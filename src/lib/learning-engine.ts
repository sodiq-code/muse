// ============================================================================
// Learning Loop Engine — Day 2 → Enhanced Day 7
// Implements the core learning loop: OBSERVE → COMPARE → INFER → UPDATE → RECOMMEND
// Statistical honesty is NON-NEGOTIABLE — no inflated metrics
// Day 7 enhancements: Evidence type system, honest labeling, confidence guardrails
// ============================================================================

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ContentMetricInput {
  contentId: string;
  hookText?: string;
  hookPattern?: string;
  views: number;
  likes: number;
  shares: number;
  comments: number;
  watchTime?: number;   // seconds
  subscribers?: number; // gained
  clickThroughRate?: number;
  capturedAt: string;
}

export interface CreatorMemory {
  creatorId: string;
  knownPreferences: Record<string, string>;
  pastPerformance: ContentMetricInput[];
  learnedPatterns: LearnedPattern[];
  totalPosts: number;
}

export interface LearnedPattern {
  pattern: string;
  avgEffectiveness: number;
  sampleSize: number;
  lastSeen: string;
}

export type ConfidenceLevel = 'low' | 'medium' | 'high';

// Day 7: Formal evidence type taxonomy
export type EvidenceType = 'observed' | 'correlation' | 'recommendation' | 'insufficient' | 'statistical' | 'absence' | 'observational';

// Day 7: Forbidden phrases that imply inflated claims
const FORBIDDEN_PHRASES = [
  'AI discovered',
  'AI found',
  'proven',
  'guaranteed',
  'always',
  'never',
  '100%',
  'causes',
  'caused',
  'will result in',
  'ensures',
  'definitely',
  'absolutely',
  'certainly',
];

// Day 7: Confidence thresholds — data must meet these to earn each level
export const CONFIDENCE_THRESHOLDS = {
  low: { minDataPoints: 0, label: 'Low — treat as hypothesis' },
  medium: { minDataPoints: 5, label: 'Medium — directionally correct' },
  high: { minDataPoints: 16, label: 'High — statistically meaningful' },
} as const;

export interface LearningRecommendation {
  type: string;
  title: string;
  explanation: string;
  evidenceType: string;
  confidence: ConfidenceLevel;
  dataPoints: number;
  supportingFacts: string[];
  action?: string;
  priority: number; // 1-10
}

export interface LearningLoopResult {
  observations: string[];
  comparisons: string[];
  inferences: string[];
  updates: LearnedPattern[];
  recommendations: LearningRecommendation[];
  confidence: ConfidenceLevel;
  totalDataPoints: number;
  loopComplete: boolean;
}

// ---------------------------------------------------------------------------
// Statistical honesty framework
// ---------------------------------------------------------------------------

export function computeConfidence(dataPointCount: number): ConfidenceLevel {
  if (dataPointCount < CONFIDENCE_THRESHOLDS.medium.minDataPoints) return 'low';
  if (dataPointCount < CONFIDENCE_THRESHOLDS.high.minDataPoints) return 'medium';
  return 'high';
}

export function honestPhrase(dataPoints: number, pattern: string, avgValue: number): string {
  return `Based on ${dataPoints} posts, ${pattern} pattern averages ${(avgValue * 100).toFixed(1)}%`;
}

// Day 7: Determine evidence type from data characteristics
export function classifyEvidenceType(
  dataPoints: number,
  hasComparison: boolean,
  hasCausationRisk: boolean
): EvidenceType {
  if (dataPoints === 0) return 'insufficient';
  if (dataPoints < 3) return 'observed';
  if (hasComparison && dataPoints >= 10) return 'statistical';
  if (hasComparison) return 'correlation';
  if (hasCausationRisk) return 'correlation'; // downgrade causation claims to correlation
  return 'observational';
}

// Day 7: Check if a phrase violates statistical honesty
export function hasInflatedLanguage(text: string): { violated: boolean; phrases: string[] } {
  const lower = text.toLowerCase();
  const found = FORBIDDEN_PHRASES.filter((p) => lower.includes(p.toLowerCase()));
  return { violated: found.length > 0, phrases: found };
}

// Day 7: Generate confidence-qualified phrasing
export function qualifiedPhrase(
  dataPoints: number,
  pattern: string,
  avgValue: number,
  baseline?: number
): string {
  const confidence = computeConfidence(dataPoints);
  const base = honestPhrase(dataPoints, pattern, avgValue);

  if (confidence === 'low') {
    return `${base} (Low confidence — treat as hypothesis, not fact)`;
  }

  if (baseline !== undefined && baseline > 0) {
    const diff = avgValue - baseline;
    const pctChange = (diff / baseline) * 100;
    if (Math.abs(pctChange) > 5) {
      const direction = pctChange > 0 ? 'above' : 'below';
      return `${base} (${Math.abs(pctChange).toFixed(0)}% ${direction} your baseline, ${confidence} confidence)`;
    }
  }

  if (confidence === 'medium') {
    return `${base} (Medium confidence — directionally correct, more data recommended)`;
  }

  return `${base} (High confidence)`;
}

// ---------------------------------------------------------------------------
// Engagement score calculation
// ---------------------------------------------------------------------------

function engagementScore(metric: ContentMetricInput): number {
  if (metric.views === 0) return 0;
  const likesRate = metric.likes / metric.views;
  const commentsRate = metric.comments / metric.views;
  const sharesRate = metric.shares / metric.views;
  // Weighted: shares matter most, then comments, then likes
  return Math.min(1, sharesRate * 20 + commentsRate * 5 + likesRate * 2);
}

function hookEffectiveness(metric: ContentMetricInput): number {
  // CTR is the best proxy for hook effectiveness; fall back to engagement
  if (metric.clickThroughRate != null && metric.clickThroughRate > 0) {
    return Math.min(1, metric.clickThroughRate / 10); // normalize: 10% CTR = 1.0
  }
  return engagementScore(metric);
}

// ---------------------------------------------------------------------------
// The 5-Step Learning Loop
// ---------------------------------------------------------------------------

/**
 * OBSERVE: Gather and summarize the data
 */
function observe(metrics: ContentMetricInput[], memory: CreatorMemory): string[] {
  const observations: string[] = [];

  const totalPosts = metrics.length;
  observations.push(`Observed ${totalPosts} content items with performance data`);

  if (totalPosts === 0) {
    observations.push('No content metrics available — insufficient data for pattern detection');
    return observations;
  }

  const avgViews = metrics.reduce((s, m) => s + m.views, 0) / totalPosts;
  const avgEngagement = metrics.reduce((s, m) => s + engagementScore(m), 0) / totalPosts;
  const avgLikes = metrics.reduce((s, m) => s + m.likes, 0) / totalPosts;

  observations.push(`Average views: ${Math.round(avgViews).toLocaleString()}`);
  observations.push(`Average engagement score: ${(avgEngagement * 100).toFixed(1)}%`);
  observations.push(`Average likes: ${Math.round(avgLikes).toLocaleString()}`);

  // Hook patterns observed
  const hookPatterns = metrics.filter((m) => m.hookPattern).map((m) => m.hookPattern!);
  if (hookPatterns.length > 0) {
    const patternCounts: Record<string, number> = {};
    hookPatterns.forEach((p) => { patternCounts[p] = (patternCounts[p] || 0) + 1; });
    const topPattern = Object.entries(patternCounts).sort((a, b) => b[1] - a[1])[0];
    observations.push(`Most common hook pattern: ${topPattern[0]} (${topPattern[1]} occurrences)`);
  }

  // Memory context
  if (memory.totalPosts > 0) {
    observations.push(`Creator has ${memory.totalPosts} total posts in memory`);
  }

  return observations;
}

/**
 * COMPARE: Compare current metrics against past performance
 */
function compare(metrics: ContentMetricInput[], memory: CreatorMemory): string[] {
  const comparisons: string[] = [];

  if (metrics.length === 0) {
    comparisons.push('No metrics to compare — need at least 1 data point');
    return comparisons;
  }

  // Compare against historical data
  const historical = memory.pastPerformance;
  if (historical.length > 0) {
    const currentAvgEngagement = metrics.reduce((s, m) => s + engagementScore(m), 0) / metrics.length;
    const historicalAvgEngagement = historical.reduce((s, m) => s + engagementScore(m), 0) / historical.length;

    const diff = currentAvgEngagement - historicalAvgEngagement;
    const pctChange = historicalAvgEngagement > 0 ? (diff / historicalAvgEngagement) * 100 : 0;

    if (Math.abs(pctChange) > 5) {
      comparisons.push(
        `Current engagement ${(pctChange > 0 ? 'up' : 'down')} ${Math.abs(pctChange).toFixed(1)}% vs historical average`
      );
    } else {
      comparisons.push('Current engagement is within 5% of historical average');
    }

    // Compare hook patterns
    const currentPatterns = metrics.filter((m) => m.hookPattern).map((m) => m.hookPattern!);
    const historicalPatterns = historical.filter((m) => m.hookPattern).map((m) => m.hookPattern!);

    if (currentPatterns.length > 0 && historicalPatterns.length > 0) {
      const currentUnique = new Set(currentPatterns);
      const historicalUnique = new Set(historicalPatterns);
      const newPatterns = [...currentUnique].filter((p) => !historicalUnique.has(p));
      if (newPatterns.length > 0) {
        comparisons.push(`New hook patterns not in history: ${newPatterns.join(', ')}`);
      }
    }
  } else {
    comparisons.push('No historical data to compare against — this is the first observation set');
  }

  // Internal comparison: best vs worst performers
  if (metrics.length >= 2) {
    const withHooks = metrics.filter((m) => m.hookPattern);
    if (withHooks.length >= 2) {
      const sorted = [...withHooks].sort((a, b) => hookEffectiveness(b) - hookEffectiveness(a));
      const best = sorted[0];
      const worst = sorted[sorted.length - 1];
      comparisons.push(
        `Best performer: ${best.hookPattern} hook (${(hookEffectiveness(best) * 100).toFixed(1)}% effectiveness) vs worst: ${worst.hookPattern} (${(hookEffectiveness(worst) * 100).toFixed(1)}%)`
      );
    }
  }

  return comparisons;
}

/**
 * INFER: Draw conclusions from observations and comparisons
 */
function infer(
  metrics: ContentMetricInput[],
  memory: CreatorMemory,
  _comparisons: string[]
): { inferences: string[]; patterns: LearnedPattern[] } {
  const inferences: string[] = [];
  const patterns: LearnedPattern[] = [];

  if (metrics.length === 0) {
    inferences.push('Cannot infer patterns — insufficient data');
    return { inferences, patterns };
  }

  // Infer hook pattern effectiveness
  const byPattern: Record<string, ContentMetricInput[]> = {};
  metrics.forEach((m) => {
    const p = m.hookPattern ?? 'unknown';
    if (!byPattern[p]) byPattern[p] = [];
    byPattern[p].push(m);
  });

  Object.entries(byPattern).forEach(([pattern, items]) => {
    const avgEff = items.reduce((s, m) => s + hookEffectiveness(m), 0) / items.length;
    patterns.push({
      pattern,
      avgEffectiveness: avgEff,
      sampleSize: items.length,
      lastSeen: new Date().toISOString(),
    });

    // Only infer with statistical honesty
    if (items.length >= 2) {
      inferences.push(
        honestPhrase(items.length, pattern, avgEff)
      );
    } else {
      inferences.push(
        `${pattern} pattern seen in only ${items.length} post(s) — too few to infer reliably`
      );
    }
  });

  // Infer best performing pattern
  const bestPattern = patterns.sort((a, b) => b.avgEffectiveness - a.avgEffectiveness)[0];
  if (bestPattern && bestPattern.sampleSize >= 2) {
    inferences.push(
      `Based on ${bestPattern.sampleSize} posts, ${bestPattern.pattern} appears most effective at ${(bestPattern.avgEffectiveness * 100).toFixed(1)}% avg effectiveness`
    );
  }

  // Infer from memory
  if (memory.learnedPatterns.length > 0) {
    const memoryBest = [...memory.learnedPatterns].sort((a, b) => b.avgEffectiveness - a.avgEffectiveness)[0];
    inferences.push(
      `From memory: ${memoryBest.pattern} was previously best at ${(memoryBest.avgEffectiveness * 100).toFixed(1)}% (based on ${memoryBest.sampleSize} posts)`
    );
  }

  return { inferences, patterns };
}

/**
 * UPDATE: Merge new patterns with existing memory
 */
function update(
  newPatterns: LearnedPattern[],
  memory: CreatorMemory
): LearnedPattern[] {
  const merged = new Map<string, LearnedPattern>();

  // Start with existing memory patterns
  memory.learnedPatterns.forEach((p) => {
    merged.set(p.pattern, p);
  });

  // Merge new patterns (weighted average by sample size)
  newPatterns.forEach((np) => {
    const existing = merged.get(np.pattern);
    if (existing) {
      const totalSample = existing.sampleSize + np.sampleSize;
      const weightedAvg =
        (existing.avgEffectiveness * existing.sampleSize + np.avgEffectiveness * np.sampleSize) / totalSample;
      merged.set(np.pattern, {
        pattern: np.pattern,
        avgEffectiveness: weightedAvg,
        sampleSize: totalSample,
        lastSeen: np.lastSeen,
      });
    } else {
      merged.set(np.pattern, np);
    }
  });

  return Array.from(merged.values());
}

/**
 * RECOMMEND: Generate actionable recommendations
 */
function recommend(
  updatedPatterns: LearnedPattern[],
  metrics: ContentMetricInput[],
  memory: CreatorMemory
): LearningRecommendation[] {
  const recommendations: LearningRecommendation[] = [];
  const totalDataPoints = metrics.length + memory.pastPerformance.length;
  const confidence = computeConfidence(totalDataPoints);

  // Sort patterns by effectiveness
  const sorted = [...updatedPatterns].sort((a, b) => b.avgEffectiveness - a.avgEffectiveness);

  // Recommendation 1: Best hook pattern
  if (sorted.length > 0) {
    const best = sorted[0];
    // Day 7 fix: Use pattern-specific confidence, not overall confidence
    const patternConfidence = computeConfidence(best.sampleSize);
    recommendations.push({
      type: 'hook_pattern',
      title: `Use ${best.pattern} hooks more often`,
      explanation: honestPhrase(best.sampleSize, best.pattern, best.avgEffectiveness),
      evidenceType: best.sampleSize >= 10 ? 'statistical' : best.sampleSize >= 5 ? 'correlation' : 'observational',
      confidence: patternConfidence,
      dataPoints: best.sampleSize,
      supportingFacts: [
        `${best.sampleSize} content items analyzed`,
        `Average effectiveness: ${(best.avgEffectiveness * 100).toFixed(1)}%`,
        ...(best.sampleSize < 5 ? ['Low sample size — treat as hypothesis, not fact'] : []),
      ],
      action: `Try leading your next 3 pieces with ${best.pattern} hooks`,
      priority: 9,
    });
  }

  // Recommendation 2: Underperforming patterns to test less
  if (sorted.length >= 2) {
    const worst = sorted[sorted.length - 1];
    if (worst.sampleSize >= 2 && worst.avgEffectiveness < 0.3) {
      recommendations.push({
        type: 'pattern_avoidance',
        title: `Reduce ${worst.pattern} hooks until more data is available`,
        explanation: honestPhrase(worst.sampleSize, worst.pattern, worst.avgEffectiveness),
        evidenceType: 'observational',
        confidence: computeConfidence(worst.sampleSize),
        dataPoints: worst.sampleSize,
        supportingFacts: [
          `${worst.sampleSize} content items show below-average effectiveness`,
          `Average: ${(worst.avgEffectiveness * 100).toFixed(1)}%`,
        ],
        action: `Test ${worst.pattern} hooks only 1 in 5 pieces until you have 10+ samples`,
        priority: 6,
      });
    }
  }

  // Recommendation 3: Experiment with untested patterns
  const knownPatterns = ['contrarian_claim', 'question', 'story', 'statistic', 'tutorial', 'listicle', 'analogy', 'personal'];
  const testedPatterns = new Set(updatedPatterns.map((p) => p.pattern));
  const untested = knownPatterns.filter((p) => !testedPatterns.has(p));

  if (untested.length > 0) {
    recommendations.push({
      type: 'pattern_exploration',
      title: `Test untested hook patterns: ${untested.slice(0, 3).join(', ')}`,
      explanation: `Based on ${totalDataPoints} total data points, ${untested.length} hook patterns have no performance data yet`,
      evidenceType: 'absence',
      confidence: 'low',
      dataPoints: 0,
      supportingFacts: [
        `No data for: ${untested.join(', ')}`,
        'Cannot recommend for or against without data',
        'Systematic testing needed',
      ],
      action: `Try each untested pattern at least 3 times to gather baseline data`,
      priority: 4,
    });
  }

  // Recommendation 4: Posting cadence (if we have enough data)
  if (metrics.length >= 5) {
    const avgViews = metrics.reduce((s, m) => s + m.views, 0) / metrics.length;
    const aboveAvg = metrics.filter((m) => m.views > avgViews);
    recommendations.push({
      type: 'content_performance',
      title: `${aboveAvg.length} of ${metrics.length} recent posts above average performance`,
      explanation: `Based on ${metrics.length} posts, average views are ${Math.round(avgViews).toLocaleString()}`,
      evidenceType: 'statistical',
      confidence,
      dataPoints: metrics.length,
      supportingFacts: [
        `Average views: ${Math.round(avgViews).toLocaleString()}`,
        `Above-average posts: ${aboveAvg.length}`,
        `Hit rate: ${((aboveAvg.length / metrics.length) * 100).toFixed(0)}%`,
      ],
      priority: 5,
    });
  }

  // Sort by priority
  return recommendations.sort((a, b) => b.priority - a.priority);
}

// ---------------------------------------------------------------------------
// Main loop entry point
// ---------------------------------------------------------------------------

export function runLearningLoop(
  metrics: ContentMetricInput[],
  memory: CreatorMemory
): LearningLoopResult {
  // Step 1: OBSERVE
  const observations = observe(metrics, memory);

  // Step 2: COMPARE
  const comparisons = compare(metrics, memory);

  // Step 3: INFER
  const { inferences, patterns: newPatterns } = infer(metrics, memory, comparisons);

  // Step 4: UPDATE
  const updates = update(newPatterns, memory);

  // Step 5: RECOMMEND
  const recommendations = recommend(updates, metrics, memory);

  // Overall confidence
  const totalDataPoints = metrics.length + memory.pastPerformance.length;
  const confidence = computeConfidence(totalDataPoints);

  return {
    observations,
    comparisons,
    inferences,
    updates,
    recommendations,
    confidence,
    totalDataPoints,
    loopComplete: true,
  };
}

// ---------------------------------------------------------------------------
// Empty memory factory
// ---------------------------------------------------------------------------

export function emptyCreatorMemory(creatorId: string): CreatorMemory {
  return {
    creatorId,
    knownPreferences: {},
    pastPerformance: [],
    learnedPatterns: [],
    totalPosts: 0,
  };
}
