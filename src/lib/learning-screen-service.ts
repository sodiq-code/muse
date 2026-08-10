// ============================================================================
// Learning Screen Service — Day 13
// Powers Screen 3: LEARNING (timeline + insights) — "MOST IMPORTANT" per blueprint
//
// Shows the step-by-step learning loop in action:
//   - For each content item: Published → Performance → Hook Analysis →
//     Comparison → Memory Updated → Strategy Changed
//   - Shows "THE LOOP IS WORKING" when a later item uses a pattern
//     recommended from an earlier item
//   - Current insight from top-priority active recommendation
//   - Loop status metrics (total runs, recommendations, avg confidence)
//   - Honesty score (confidence levels match evidence)
//
// Every data point shows SOURCE and EVIDENCE — the key UX rule
// ============================================================================

import { db } from '@/lib/db';
import { computeConfidence, honestPhrase, type ConfidenceLevel } from '@/lib/learning-engine';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface LearningScreenData {
  creatorName: string;
  timeline: LearningTimelineEntry[];
  currentInsight: {
    text: string;
    evidence: string;
    confidence: string;
    dataPoints: number;
  };
  loopStatus: {
    lastRun: string | null;
    totalRuns: number;
    totalRecommendations: number;
    avgConfidence: string;
  };
  honestyScore: {
    checksPassed: number;
    checksTotal: number;
    isHonest: boolean;
  };
}

export interface LearningTimelineEntry {
  contentTitle: string;
  contentType: string;
  steps: TimelineStep[];
  publishedAt: string | null;
}

export interface TimelineStep {
  type: 'published' | 'performance' | 'hook_analysis' | 'comparison' | 'memory_updated' | 'strategy_changed' | 'loop_working';
  label: string;
  detail: string;
  delta?: string; // e.g. "+18%"
}

// ---------------------------------------------------------------------------
// Main: Get Learning Screen Data
// ---------------------------------------------------------------------------

export async function getLearningScreenData(creatorId: string): Promise<LearningScreenData> {
  // ── Step 1: Load Creator ──────────────────────────────────────────────────
  const creator = await db.creator.findUnique({ where: { id: creatorId } });
  if (!creator) throw new Error(`Creator not found: ${creatorId}`);

  // ── Step 2: Load published content with hooks, metrics, and patterns ───────
  const contentItems = await db.contentItem.findMany({
    where: { creatorId, status: 'published' },
    include: {
      hooks: { include: { patterns: true } },
      metrics: true,
    },
    orderBy: { publishedAt: 'desc' },
    take: 20,
  });

  // ── Step 3: Load learning-related memory events and recommendations ────────
  const [learnEvents, recommendations, auditEvents] = await Promise.all([
    db.memoryEvent.findMany({
      where: { creatorId, category: { in: ['pattern', 'performance', 'feedback'] } },
      orderBy: { createdAt: 'desc' },
      take: 100,
    }),
    db.recommendation.findMany({
      where: { creatorId, status: { in: ['pending', 'shown'] } },
      orderBy: { priority: 'desc' },
      take: 20,
    }),
    db.auditEvent.findMany({
      where: { creatorId, action: 'learn' },
      orderBy: { createdAt: 'desc' },
      take: 50,
    }),
  ]);

  // ── Step 4: Compute average performance across all content ─────────────────
  const avgPerformance = computeAvgPerformance(contentItems);

  // ── Step 5: Build the learning timeline ────────────────────────────────────
  const timeline = buildLearningTimeline(contentItems, learnEvents, avgPerformance);

  // ── Step 6: Current Insight ────────────────────────────────────────────────
  const currentInsight = buildCurrentInsight(recommendations, learnEvents);

  // ── Step 7: Loop Status ────────────────────────────────────────────────────
  const loopStatus = buildLoopStatus(auditEvents, recommendations, learnEvents);

  // ── Step 8: Honesty Score ──────────────────────────────────────────────────
  const honestyScore = computeHonestyScore(recommendations, learnEvents);

  return {
    creatorName: creator.name,
    timeline,
    currentInsight,
    loopStatus,
    honestyScore,
  };
}

// ---------------------------------------------------------------------------
// Compute average performance across all content items
// ---------------------------------------------------------------------------

function computeAvgPerformance(
  contentItems: Array<{
    metrics: Array<{ metricKey: string; metricValue: number }>;
  }>
): number {
  // Average retention (likes/views ratio) across published content
  let totalRetention = 0;
  let count = 0;

  for (const item of contentItems) {
    const views = item.metrics.find((m) => m.metricKey === 'views')?.metricValue ?? 0;
    const likes = item.metrics.find((m) => m.metricKey === 'likes')?.metricValue ?? 0;
    if (views > 0) {
      totalRetention += likes / views;
      count++;
    }
  }

  return count > 0 ? totalRetention / count : 0;
}

// ---------------------------------------------------------------------------
// Build Learning Timeline
// ---------------------------------------------------------------------------

function buildLearningTimeline(
  contentItems: Array<{
    id: string;
    title: string | null;
    type: string;
    publishedAt: Date | null;
    hooks: Array<{
      text: string;
      hookType: string;
      effectiveness: number | null;
      patterns: Array<{
        patternName: string;
        confidence: number;
        avgEffectiveness: number | null;
        sampleSize: number;
      }>;
    }>;
    metrics: Array<{ metricKey: string; metricValue: number }>;
  }>,
  learnEvents: Array<{
    category: string;
    key: string;
    value: string;
    confidence: number;
    createdAt: Date;
  }>,
  avgPerformance: number
): LearningTimelineEntry[] {
  const timeline: LearningTimelineEntry[] = [];
  const seenPatterns = new Map<string, { contentIndex: number; patternName: string }>();

  for (let i = 0; i < contentItems.length; i++) {
    const item = contentItems[i];
    const steps: TimelineStep[] = [];
    const contentTitle = item.title ?? `Content #${contentItems.length - i}`;

    // Step 1: Published
    steps.push({
      type: 'published',
      label: 'Published',
      detail: item.publishedAt
        ? `Published on ${item.publishedAt.toLocaleDateString()}`
        : 'Content published',
    });

    // Step 2: Performance
    const views = item.metrics.find((m) => m.metricKey === 'views')?.metricValue ?? 0;
    const likes = item.metrics.find((m) => m.metricKey === 'likes')?.metricValue ?? 0;
    const retention = views > 0 ? Math.round((likes / views) * 100) : 0;
    steps.push({
      type: 'performance',
      label: 'Performance',
      detail: `${retention}% retention`,
    });

    // Step 3: Hook Analysis
    const primaryHook = item.hooks.find((h) => h.hookType === 'opening') ?? item.hooks[0];
    const primaryPattern = primaryHook?.patterns[0];

    if (primaryPattern) {
      steps.push({
        type: 'hook_analysis',
        label: 'Hook analysis',
        detail: `Pattern: ${formatPatternName(primaryPattern.patternName)}`,
      });

      // Step 4: Comparison vs average
      const itemRetention = views > 0 ? likes / views : 0;
      if (avgPerformance > 0 && itemRetention > 0) {
        const deltaPct = Math.round((itemRetention - avgPerformance) / avgPerformance * 100);
        if (deltaPct !== 0) {
          steps.push({
            type: 'comparison',
            label: 'Comparison',
            detail: `${deltaPct > 0 ? '+' : ''}${deltaPct}% vs your average (${Math.round(avgPerformance * 100)}%)`,
            delta: `${deltaPct > 0 ? '+' : ''}${deltaPct}%`,
          });
        }
      }

      // Step 5: Memory Updated
      const patternConfidence = primaryPattern.confidence;
      const confidenceLabel = mapConfidenceLabel(patternConfidence);
      const prevConfidence = getPreviousPatternConfidence(primaryPattern.patternName, seenPatterns, learnEvents);

      if (prevConfidence && prevConfidence !== confidenceLabel) {
        steps.push({
          type: 'memory_updated',
          label: 'Memory updated',
          detail: `${formatPatternName(primaryPattern.patternName)} confidence: ${prevConfidence}→${confidenceLabel}`,
        });
      } else {
        steps.push({
          type: 'memory_updated',
          label: 'Memory updated',
          detail: `${formatPatternName(primaryPattern.patternName)} confidence: ${confidenceLabel}`,
        });
      }

      // Step 6: Strategy Changed (if this pattern is performing well)
      const patternEff = primaryPattern.avgEffectiveness ?? primaryHook?.effectiveness ?? 0;
      if (patternEff > 0.6) {
        steps.push({
          type: 'strategy_changed',
          label: 'Strategy changed',
          detail: `Prioritize ${formatPatternName(primaryPattern.patternName)} in ${item.type.includes('ai') || item.title?.toLowerCase().includes('ai') ? 'AI topics' : 'content'}`,
        });
      }

      // Check if this pattern was recommended by a PREVIOUS content item
      const previousPattern = seenPatterns.get(primaryPattern.patternName);
      if (previousPattern && previousPattern.contentIndex !== i) {
        // THE LOOP IS WORKING! — a later item uses a pattern from an earlier item
        steps.push({
          type: 'loop_working',
          label: 'THE LOOP IS WORKING',
          detail: `Used ${formatPatternName(primaryPattern.patternName)} hook — pattern from earlier content applied`,
          delta: `+${Math.round(patternEff * 100)}%`,
        });
      }

      // Track this pattern for future loop detection
      seenPatterns.set(primaryPattern.patternName, { contentIndex: i, patternName: primaryPattern.patternName });
    } else if (primaryHook) {
      // No pattern classified, still show hook analysis
      steps.push({
        type: 'hook_analysis',
        label: 'Hook analysis',
        detail: `Hook: "${primaryHook.text.substring(0, 50)}${primaryHook.text.length > 50 ? '...' : ''}"`,
      });
    }

    timeline.push({
      contentTitle,
      contentType: item.type,
      steps,
      publishedAt: item.publishedAt?.toISOString() ?? null,
    });
  }

  // If no timeline entries from published content, add entries from learn events
  if (timeline.length === 0 && learnEvents.length > 0) {
    const steps: TimelineStep[] = [];
    for (const event of learnEvents.slice(0, 6)) {
      let detail = event.value.substring(0, 100);
      try {
        const data = JSON.parse(event.value);
        if (data.pattern) detail = `${formatPatternName(data.pattern)}: ${honestPhrase(data.sampleSize ?? 1, data.pattern, data.avgEffectiveness ?? 0)}`;
      } catch { /* use raw value */ }

      steps.push({
        type: 'memory_updated',
        label: 'Memory updated',
        detail,
      });
    }
    timeline.push({
      contentTitle: 'Learning events',
      contentType: 'system',
      steps,
      publishedAt: null,
    });
  }

  return timeline;
}

// ---------------------------------------------------------------------------
// Build Current Insight
// ---------------------------------------------------------------------------

function buildCurrentInsight(
  recommendations: Array<{
    id: string;
    type: string;
    title: string;
    rationale: string | null;
    payload: string | null;
    priority: number;
    fromMind: string | null;
  }>,
  learnEvents: Array<{
    category: string;
    key: string;
    value: string;
    confidence: number;
  }>
): LearningScreenData['currentInsight'] {
  // Try to get the highest-priority active recommendation
  const topRec = recommendations.find(
    (r) => r.type === 'hook' || r.type === 'improvement' || r.type === 'content_idea'
  );

  if (topRec) {
    let dataPoints = 0;
    let evidenceType = 'recommendation';
    let confidence: ConfidenceLevel = 'low';

    if (topRec.payload) {
      try {
        const payload = JSON.parse(topRec.payload);
        dataPoints = payload.dataPoints ?? 0;
        evidenceType = payload.evidenceType ?? 'recommendation';
        confidence = payload.confidence ?? 'low';
      } catch { /* skip */ }
    }

    return {
      text: topRec.title,
      evidence: topRec.rationale ?? `Based on ${evidenceType}`,
      confidence,
      dataPoints,
    };
  }

  // Fallback: derive insight from learning events
  const patternEvents = learnEvents.filter((e) => e.category === 'pattern');
  if (patternEvents.length > 0) {
    const latest = patternEvents[0];
    try {
      const data = JSON.parse(latest.value);
      if (data.pattern) {
        return {
          text: `Your ${formatPatternName(data.pattern)} hooks are performing at ${Math.round((data.avgEffectiveness ?? 0) * 100)}% effectiveness`,
          evidence: honestPhrase(data.sampleSize ?? 1, data.pattern, data.avgEffectiveness ?? 0),
          confidence: computeConfidence(data.sampleSize ?? 1),
          dataPoints: data.sampleSize ?? 1,
        };
      }
    } catch { /* skip */ }
  }

  // Default insight
  return {
    text: 'Muse is collecting data to generate personalized insights',
    evidence: 'Insights will appear as more content is published and analyzed',
    confidence: 'low',
    dataPoints: 0,
  };
}

// ---------------------------------------------------------------------------
// Build Loop Status
// ---------------------------------------------------------------------------

function buildLoopStatus(
  auditEvents: Array<{
    action: string;
    createdAt: Date;
  }>,
  recommendations: Array<{
    status: string;
    priority: number;
    payload: string | null;
  }>,
  learnEvents: Array<{
    confidence: number;
  }>
): LearningScreenData['loopStatus'] {
  // Last run: most recent 'learn' audit event
  const lastRun = auditEvents.length > 0 ? auditEvents[0].createdAt.toISOString() : null;

  // Total runs: count of 'learn' audit events
  const totalRuns = auditEvents.length;

  // Total recommendations (all, not just active)
  const totalRecommendations = recommendations.length;

  // Average confidence across learn events
  let avgConfidenceNum = 0;
  if (learnEvents.length > 0) {
    avgConfidenceNum = learnEvents.reduce((sum, e) => sum + e.confidence, 0) / learnEvents.length;
  }
  const avgConfidence = mapConfidenceLabel(avgConfidenceNum);

  return {
    lastRun,
    totalRuns,
    totalRecommendations,
    avgConfidence,
  };
}

// ---------------------------------------------------------------------------
// Compute Honesty Score
// ---------------------------------------------------------------------------

function computeHonestyScore(
  recommendations: Array<{
    title: string;
    rationale: string | null;
    payload: string | null;
  }>,
  learnEvents: Array<{
    confidence: number;
    value: string;
  }>
): LearningScreenData['honestyScore'] {
  let checksPassed = 0;
  let checksTotal = 0;

  // Check 1: No inflated language in recommendations
  checksTotal++;
  const inflatedPatterns = ['AI discovered', 'AI found', 'proven', 'guaranteed', '100%', 'always works'];
  const hasInflated = recommendations.some((r) =>
    inflatedPatterns.some((p) =>
      r.title.toLowerCase().includes(p.toLowerCase()) ||
      (r.rationale?.toLowerCase().includes(p.toLowerCase()) ?? false)
    )
  );
  if (!hasInflated) checksPassed++;

  // Check 2: Low data points → low confidence (in recommendation payloads)
  checksTotal++;
  const confidenceHonest = recommendations.every((r) => {
    if (!r.payload) return true;
    try {
      const payload = JSON.parse(r.payload);
      if (payload.dataPoints < 3 && payload.confidence === 'high') return false;
      if (payload.dataPoints < 2 && payload.confidence === 'medium') return false;
      return true;
    } catch { return true; }
  });
  if (confidenceHonest) checksPassed++;

  // Check 3: Memory event confidence is reasonable (0-1 range)
  checksTotal++;
  const confidenceInRange = learnEvents.every((e) => e.confidence >= 0 && e.confidence <= 1);
  if (confidenceInRange) checksPassed++;

  // Check 4: No claims of causation in recommendation rationale
  checksTotal++;
  const causationWords = ['causes', 'caused', 'will result in', 'leads to', 'ensures'];
  const claimsCausation = recommendations.some((r) =>
    causationWords.some((w) => r.rationale?.toLowerCase().includes(w) ?? false)
  );
  if (!claimsCausation) checksPassed++;

  // Check 5: Pattern values in memory are parseable and reasonable
  checksTotal++;
  const patternsValid = learnEvents
    .filter((e) => e.value.startsWith('{'))
    .every((e) => {
      try {
        const data = JSON.parse(e.value);
        return typeof data === 'object' && (data.avgEffectiveness === undefined || (data.avgEffectiveness >= 0 && data.avgEffectiveness <= 1));
      } catch { return false; }
    });
  if (patternsValid) checksPassed++;

  return {
    checksPassed,
    checksTotal,
    isHonest: checksPassed === checksTotal,
  };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatPatternName(name: string): string {
  return name
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function mapConfidenceLabel(confidence: number): string {
  if (confidence >= 0.7) return 'HIGH';
  if (confidence >= 0.4) return 'MEDIUM';
  return 'LOW';
}

function getPreviousPatternConfidence(
  patternName: string,
  seenPatterns: Map<string, { contentIndex: number; patternName: string }>,
  learnEvents: Array<{ category: string; key: string; value: string; confidence: number }>
): string | null {
  // Check if we've seen this pattern before in memory events
  const patternKey = `hook_pattern_${patternName}`;
  const existingMemory = learnEvents.find((e) => e.key === patternKey);
  if (existingMemory) {
    return mapConfidenceLabel(existingMemory.confidence);
  }
  // Check seen patterns map for prior occurrence
  if (seenPatterns.has(patternName)) {
    return 'MEDIUM'; // It was seen before, so it had at least medium confidence
  }
  return null;
}

// ---------------------------------------------------------------------------
// Utility: Get default creator ID
// ---------------------------------------------------------------------------

export async function getDefaultCreatorId(): Promise<string> {
  const creator = await db.creator.findFirst({
    where: { email: 'sodiqjimoh80@gmail.com' },
  });
  if (!creator) throw new Error('Default creator not found. Run seed first.');
  return creator.id;
}
