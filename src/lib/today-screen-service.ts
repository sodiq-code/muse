// ============================================================================
// Today Screen Service — Day 12
// Powers Screen 1: Today (Home + Morning Brief)
//
// Provides the "good morning" dashboard with:
//   - Time-aware greeting
//   - Overnight brief (what Muse did while you were offline)
//   - Top signals from the learning engine
//   - New data analyzed (recent content items)
//   - Try next (recommended hook pattern)
//   - Pending approvals (drafts awaiting creator action)
//
// Every data point shows SOURCE and EVIDENCE — the key UX rule from blueprint
// ============================================================================

import { db } from '@/lib/db';
import { computeConfidence, honestPhrase, type ConfidenceLevel } from '@/lib/learning-engine';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface TodayScreenData {
  greeting: {
    text: string;
    timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  };
  creatorName: string;
  overnightBrief: {
    items: string[];
    reviewedCount: number;
    draftedCount: number;
    updatedCount: number;
    source: string;
  };
  topSignals: {
    label: string;
    value: string;
    source: string;
    evidence: string;
  }[];
  newData: {
    label: string;
    value: string;
    source: string;
  };
  tryNext: {
    label: string;
    description: string;
    hookPattern: string;
    confidence: string;
    evidence: string;
  };
  pendingApprovals: PendingApproval[];
}

export interface PendingApproval {
  draftId: string;
  title: string;
  hookType: string;
  source: string;
  evidenceCount: number;
  avgScore: number;
  createdAt: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getTimeOfDay(): 'morning' | 'afternoon' | 'evening' | 'night' {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night';
}

function getGreetingText(timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night', name: string): string {
  switch (timeOfDay) {
    case 'morning': return `Good morning, ${name}.`;
    case 'afternoon': return `Good afternoon, ${name}.`;
    case 'evening': return `Good evening, ${name}.`;
    case 'night': return `Working late, ${name}?`;
  }
}

function formatRetention(value: number): string {
  return `${Math.round(value * 100)}%`;
}

// ---------------------------------------------------------------------------
// Main: Get Today Screen Data
// ---------------------------------------------------------------------------

export async function getTodayScreenData(creatorId: string): Promise<TodayScreenData> {
  const now = new Date();
  const twelveHoursAgo = new Date(now.getTime() - 12 * 60 * 60 * 1000);
  const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  // ── Step 1: Load Creator ──────────────────────────────────────────────────
  const creator = await db.creator.findUnique({
    where: { id: creatorId },
    include: {
      auditEvents: {
        where: { createdAt: { gte: twelveHoursAgo } },
        orderBy: { createdAt: 'desc' },
        take: 50,
      },
      approvals: {
        where: { status: 'pending' },
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
      recommendations: {
        where: { status: { in: ['pending', 'shown'] } },
        orderBy: { priority: 'desc' },
        take: 10,
      },
    },
  });

  if (!creator) throw new Error(`Creator not found: ${creatorId}`);

  // ── Step 2: Greeting ──────────────────────────────────────────────────────
  const timeOfDay = getTimeOfDay();
  const greeting = {
    text: getGreetingText(timeOfDay, creator.name),
    timeOfDay,
  };

  // ── Step 3: Overnight Brief ───────────────────────────────────────────────
  // Count overnight audit events (reviews, drafts, updates) from the last 12 hours
  const reviewedCount = creator.auditEvents.filter(
    (e) => e.actor === 'muse' && (e.action === 'learn' || e.action === 'update' || e.targetType === 'content_item')
  ).length;

  const draftedCount = creator.auditEvents.filter(
    (e) => e.targetType === 'draft' && (e.action === 'create' || e.action === 'update')
  ).length;

  const updatedCount = creator.auditEvents.filter(
    (e) => e.action === 'update' && e.targetType !== 'draft'
  ).length;

  const overnightItems: string[] = [];
  if (reviewedCount > 0) overnightItems.push(`Reviewed ${reviewedCount} new ${reviewedCount === 1 ? 'item' : 'items'}`);
  if (draftedCount > 0) overnightItems.push(`Drafted ${draftedCount} content ${draftedCount === 1 ? 'suggestion' : 'suggestions'}`);
  if (updatedCount > 0) overnightItems.push(`Updated hook performance data`);
  if (overnightItems.length === 0) overnightItems.push('No overnight activity');

  const overnightBrief = {
    items: overnightItems,
    reviewedCount,
    draftedCount,
    updatedCount,
    source: `AuditEvent · ${creator.auditEvents.length} events in last 12h`,
  };

  // ── Step 4: Top Signals ───────────────────────────────────────────────────
  // Get the top 3 performance signals/recommendations from the learning engine
  const topSignals = await buildTopSignals(creatorId, creator.recommendations);

  // ── Step 5: New Data ──────────────────────────────────────────────────────
  // Count of recently analyzed content items (last 24h)
  const recentContentCount = await db.contentItem.count({
    where: {
      creatorId,
      createdAt: { gte: twentyFourHoursAgo },
    },
  });

  const totalContentCount = await db.contentItem.count({
    where: { creatorId },
  });

  const recentMetricsCount = await db.contentMetric.count({
    where: {
      contentItem: { creatorId },
      capturedAt: { gte: twentyFourHoursAgo },
    },
  });

  const newData = {
    label: recentContentCount > 0
      ? `${recentContentCount} new ${recentContentCount === 1 ? 'post' : 'posts'} analyzed`
      : `${totalContentCount} posts tracked`,
    value: `${recentContentCount}`,
    source: `ContentItem · ${totalContentCount} total, ${recentMetricsCount} recent metrics`,
  };

  // ── Step 6: Try Next ──────────────────────────────────────────────────────
  // The top recommended hook pattern to try next
  const tryNext = await buildTryNext(creatorId);

  // ── Step 7: Pending Approvals ─────────────────────────────────────────────
  // Drafts that haven't been approved yet (check Approval table with status = 'pending')
  const pendingApprovals = await buildPendingApprovals(creatorId, creator.approvals);

  return {
    greeting,
    creatorName: creator.name,
    overnightBrief,
    topSignals,
    newData,
    tryNext,
    pendingApprovals,
  };
}

// ---------------------------------------------------------------------------
// Build Top Signals
// ---------------------------------------------------------------------------

async function buildTopSignals(
  creatorId: string,
  recommendations: Array<{
    id: string;
    type: string;
    title: string;
    rationale: string | null;
    priority: number;
    payload: string | null;
  }>
): Promise<TodayScreenData['topSignals']> {
  const signals: TodayScreenData['topSignals'] = [];

  // Signal 1: Hook performance from learning engine
  const hooks = await db.hook.findMany({
    where: { contentItem: { creatorId } },
    include: { patterns: true },
  });

  const patternEffectiveness = new Map<string, { total: number; count: number }>();
  for (const hook of hooks) {
    for (const pattern of hook.patterns) {
      const existing = patternEffectiveness.get(pattern.patternName) ?? { total: 0, count: 0 };
      existing.total += pattern.avgEffectiveness ?? hook.effectiveness ?? 0;
      existing.count += 1;
      patternEffectiveness.set(pattern.patternName, existing);
    }
  }

  // Find top pattern
  let topPattern: { name: string; avg: number; count: number } | null = null;
  for (const [name, data] of patternEffectiveness) {
    const avg = data.total / data.count;
    if (!topPattern || avg > topPattern.avg) {
      topPattern = { name, avg, count: data.count };
    }
  }

  if (topPattern && topPattern.count >= 2) {
    const avgPct = Math.round(topPattern.avg * 100);
    const confidence = computeConfidence(topPattern.count);
    signals.push({
      label: 'Top Hook',
      value: `${topPattern.name} · ${avgPct}% avg`,
      source: `HookPattern · ${topPattern.count} samples`,
      evidence: honestPhrase(topPattern.count, topPattern.name, topPattern.avg),
    });

    // Compare to second-best to get the delta
    let secondPattern: { name: string; avg: number; count: number } | null = null;
    for (const [name, data] of patternEffectiveness) {
      if (name === topPattern.name) continue;
      const avg = data.total / data.count;
      if (!secondPattern || avg > secondPattern.avg) {
        secondPattern = { name, avg, count: data.count };
      }
    }

    if (secondPattern) {
      const delta = Math.round((topPattern.avg - secondPattern.avg) * 100);
      if (delta > 0) {
        signals.push({
          label: 'Engage Uplift',
          value: `Up ${delta}% vs ${secondPattern.name}`,
          source: `HookPattern comparison · ${confidence} confidence`,
          evidence: `Based on ${topPattern.count + secondPattern.count} total samples across 2 patterns`,
        });
      }
    }
  }

  // Signal 2: From pending recommendations
  const topRecs = recommendations
    .filter((r) => r.type === 'hook' || r.type === 'improvement' || r.type === 'content_idea')
    .slice(0, 2);

  for (const rec of topRecs) {
    let dataPoints = 0;
    let evidenceType = 'recommendation';
    if (rec.payload) {
      try {
        const payload = JSON.parse(rec.payload);
        dataPoints = payload.dataPoints ?? 0;
        evidenceType = payload.evidenceType ?? 'recommendation';
      } catch {
        // skip
      }
    }

    signals.push({
      label: rec.type === 'hook' ? 'Hook Insight' : rec.type === 'improvement' ? 'Improvement' : 'Content Idea',
      value: rec.title.substring(0, 60),
      source: `Recommendation · ${rec.rationale ? 'has rationale' : 'no rationale'} · ${evidenceType}`,
      evidence: dataPoints > 0
        ? `Based on ${dataPoints} data points`
        : rec.rationale?.substring(0, 80) ?? 'Muse recommendation',
    });
  }

  // Ensure at least 1 signal
  if (signals.length === 0) {
    signals.push({
      label: 'Status',
      value: 'Learning engine active',
      source: 'System',
      evidence: 'Muse is collecting data to generate insights',
    });
  }

  return signals.slice(0, 3);
}

// ---------------------------------------------------------------------------
// Build Try Next
// ---------------------------------------------------------------------------

async function buildTryNext(creatorId: string): Promise<TodayScreenData['tryNext']> {
  // Get all hook patterns with effectiveness, find the one that's promising but underused
  const hooks = await db.hook.findMany({
    where: { contentItem: { creatorId } },
    include: {
      patterns: true,
      contentItem: { include: { metrics: true } },
    },
  });

  // Aggregate pattern data
  const patternData = new Map<string, {
    totalEffectiveness: number;
    count: number;
    bestHookText: string;
  }>();

  for (const hook of hooks) {
    for (const pattern of hook.patterns) {
      const existing = patternData.get(pattern.patternName) ?? {
        totalEffectiveness: 0,
        count: 0,
        bestHookText: hook.text,
      };
      existing.totalEffectiveness += pattern.avgEffectiveness ?? hook.effectiveness ?? 0;
      existing.count += 1;
      patternData.set(pattern.patternName, existing);
    }
  }

  // Sort by avg effectiveness descending
  const sortedPatterns = Array.from(patternData.entries())
    .map(([name, data]) => ({
      name,
      avgEffectiveness: data.totalEffectiveness / data.count,
      count: data.count,
      bestHookText: data.bestHookText,
    }))
    .sort((a, b) => b.avgEffectiveness - a.avgEffectiveness);

  if (sortedPatterns.length > 0) {
    // Recommend the second-best pattern if it has room to grow, or the best if only 1
    const recommended = sortedPatterns.length > 1 ? sortedPatterns[1] : sortedPatterns[0];
    const confidence = computeConfidence(recommended.count);

    return {
      label: `Try ${recommended.name.replace(/_/g, ' ')} hook`,
      description: `${recommended.name.replace(/_/g, ' ')} hooks show ${Math.round(recommended.avgEffectiveness * 100)}% avg effectiveness across ${recommended.count} samples`,
      hookPattern: recommended.name,
      confidence,
      evidence: honestPhrase(recommended.count, recommended.name, recommended.avgEffectiveness),
    };
  }

  // Fallback: check recommendations
  const hookRec = await db.recommendation.findFirst({
    where: {
      creatorId,
      type: 'hook',
      status: { in: ['pending', 'shown'] },
    },
    orderBy: { priority: 'desc' },
  });

  if (hookRec) {
    return {
      label: hookRec.title.substring(0, 50),
      description: hookRec.rationale?.substring(0, 100) ?? 'Recommended hook strategy',
      hookPattern: 'recommended',
      confidence: 'medium',
      evidence: `Muse recommendation · ${hookRec.rationale ? 'has rationale' : 'auto-generated'}`,
    };
  }

  // Default fallback
  return {
    label: 'Try contrarian hook',
    description: 'Contrarian hooks challenge conventional thinking and drive engagement',
    hookPattern: 'contrarian_claim',
    confidence: 'low',
    evidence: 'Default suggestion — not enough data to personalize',
  };
}

// ---------------------------------------------------------------------------
// Build Pending Approvals
// ---------------------------------------------------------------------------

async function buildPendingApprovals(
  creatorId: string,
  pendingApprovalRecords: Array<{
    id: string;
    itemType: string;
    itemId: string | null;
    action: string;
    createdAt: Date;
  }>
): Promise<PendingApproval[]> {
  const approvals: PendingApproval[] = [];

  // Process pending approval records that reference drafts
  const draftApprovals = pendingApprovalRecords.filter(
    (a) => a.itemType === 'draft' && a.itemId
  );

  for (const approval of draftApprovals.slice(0, 5)) {
    const draft = await db.draft.findUnique({
      where: { id: approval.itemId! },
    });

    if (!draft) continue;

    // Parse draft content for title and evaluation info
    let parsed: Record<string, unknown> = {};
    try {
      parsed = JSON.parse(draft.content);
    } catch {
      // skip
    }

    const title = (parsed.title as string) ?? 'Untitled Draft';
    const evaluation = parsed.evaluation as {
      overallScore?: number;
      voiceMatch?: number;
      hookCompat?: number;
      passed?: boolean;
    } | undefined;

    // Count evidence: related hooks and content items
    const relatedHooksCount = draft.contentItemId
      ? await db.hook.count({
          where: { contentItemId: draft.contentItemId },
        })
      : 0;

    approvals.push({
      draftId: draft.id,
      title,
      hookType: (parsed.topic as string) ?? 'content',
      source: `Muse · ${draft.generatedBy ?? 'maker'} · v${draft.version}`,
      evidenceCount: relatedHooksCount,
      avgScore: evaluation?.overallScore
        ? Math.round(evaluation.overallScore * 100)
        : 0,
      createdAt: draft.createdAt.toISOString(),
    });
  }

  // Also check for drafts with no approval record yet (newly created drafts)
  if (approvals.length === 0) {
    const recentDrafts = await db.draft.findMany({
      where: {
        creatorId,
        // Drafts created in the last 48 hours with no approval yet
        createdAt: { gte: new Date(Date.now() - 48 * 60 * 60 * 1000) },
      },
      orderBy: { createdAt: 'desc' },
      take: 3,
    });

    for (const draft of recentDrafts) {
      // Check if there's already an approval for this draft
      const existingApproval = await db.approval.findFirst({
        where: {
          creatorId,
          itemType: 'draft',
          itemId: draft.id,
          status: { in: ['approved', 'rejected'] },
        },
      });

      // Only show if not already decided
      if (!existingApproval) {
        let parsed: Record<string, unknown> = {};
        try {
          parsed = JSON.parse(draft.content);
        } catch {
          // skip
        }

        const title = (parsed.title as string) ?? 'Untitled Draft';
        const evaluation = parsed.evaluation as {
          overallScore?: number;
        } | undefined;

        const relatedHooksCount = draft.contentItemId
          ? await db.hook.count({
              where: { contentItemId: draft.contentItemId },
            })
          : 0;

        approvals.push({
          draftId: draft.id,
          title,
          hookType: (parsed.topic as string) ?? 'content',
          source: `Muse · ${draft.generatedBy ?? 'maker'} · v${draft.version}`,
          evidenceCount: relatedHooksCount,
          avgScore: evaluation?.overallScore
            ? Math.round(evaluation.overallScore * 100)
            : 0,
          createdAt: draft.createdAt.toISOString(),
        });
      }
    }
  }

  return approvals;
}

// ---------------------------------------------------------------------------
// Utility: Get default creator ID (re-export for convenience)
// ---------------------------------------------------------------------------

export async function getDefaultCreatorId(): Promise<string> {
  const creator = await db.creator.findFirst({
    where: { email: 'sodiqjimoh80@gmail.com' },
  });
  if (!creator) throw new Error('Default creator not found. Run seed first.');
  return creator.id;
}
