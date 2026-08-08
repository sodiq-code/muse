// ============================================================================
// Creator Decisions Service — Day 5
// Domain 4 of Creator Memory System: CREATOR DECISIONS
// Tracks how creators accept, modify, or reject Muse's recommendations.
// Every decision becomes a learning signal — this is the feedback loop
// that makes Muse actually improve over time.
// ============================================================================

import { db } from '@/lib/db';
import { logMemoryEvent } from '@/lib/creator-service';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type DecisionType = 'accepted' | 'modified' | 'rejected' | 'ignored';

export interface CreateDecisionInput {
  creatorId: string;
  contentItemId?: string;
  recommendationId?: string;
  decision: DecisionType;
  category?: string;       // "hook", "topic", "timing", "format", "cta", "voice"
  originalValue?: string;  // What Muse recommended
  finalValue?: string;     // What creator actually used (if modified)
  modifications?: Record<string, unknown>; // What the creator changed
  reason?: string;         // Why they decided this way
}

export interface DecisionSummary {
  total: number;
  byType: Record<DecisionType, number>;
  byCategory: Record<string, number>;
  recentDecisions: DecisionDetail[];
  modificationPatterns: ModificationPattern[];
  rejectionReasons: RejectionReason[];
  learnings: DecisionLearning[];
}

export interface DecisionDetail {
  id: string;
  decision: DecisionType;
  category: string;
  originalValue: string | null;
  finalValue: string | null;
  reason: string | null;
  contentItemTitle: string | null;
  createdAt: Date;
}

export interface ModificationPattern {
  category: string;
  count: number;
  commonChanges: string;
  exampleOriginal: string;
  exampleModified: string;
}

export interface RejectionReason {
  reason: string;
  count: number;
  category: string;
}

export interface DecisionLearning {
  category: string;
  insight: string;
  confidence: 'low' | 'medium' | 'high';
  dataPoints: number;
}

// ---------------------------------------------------------------------------
// Core CRUD Operations
// ---------------------------------------------------------------------------

/** Create a creator decision — the core feedback loop */
export async function createDecision(input: CreateDecisionInput) {
  // Create the decision record
  const decision = await db.creatorDecision.create({
    data: {
      creatorId: input.creatorId,
      contentItemId: input.contentItemId ?? null,
      recommendationId: input.recommendationId ?? null,
      decision: input.decision,
      modifications: input.modifications ? JSON.stringify(input.modifications) : null,
      reason: input.reason ?? null,
    },
  });

  // Build the memory value with full context
  const memoryValue: Record<string, unknown> = {
    decision: input.decision,
    category: input.category ?? 'general',
  };
  if (input.originalValue) memoryValue.originalValue = input.originalValue;
  if (input.finalValue) memoryValue.finalValue = input.finalValue;
  if (input.reason) memoryValue.reason = input.reason;

  // Log memory event — every decision is a learning signal
  await logMemoryEvent({
    creatorId: input.creatorId,
    category: 'feedback',
    key: `decision_${input.category ?? 'general'}`,
    value: JSON.stringify(memoryValue),
    source: 'creator',
    confidence: input.decision === 'accepted' ? 0.9
      : input.decision === 'modified' ? 0.8
        : input.decision === 'rejected' ? 0.95
          : 0.3, // ignored = low confidence signal
  });

  // If the decision modifies a recommendation, log what changed
  if (input.decision === 'modified' && input.originalValue && input.finalValue) {
    await logMemoryEvent({
      creatorId: input.creatorId,
      category: 'pattern',
      key: `modification_${input.category ?? 'general'}`,
      value: JSON.stringify({
        original: input.originalValue,
        modified: input.finalValue,
        reason: input.reason,
      }),
      source: 'creator',
      confidence: 0.85,
    });
  }

  // If rejected, log rejection reason for pattern detection
  if (input.decision === 'rejected' && input.reason) {
    await logMemoryEvent({
      creatorId: input.creatorId,
      category: 'preference',
      key: `rejection_${input.category ?? 'general'}`,
      value: input.reason,
      source: 'creator',
      confidence: 0.9,
    });
  }

  // Update recommendation status if linked
  if (input.recommendationId) {
    const recStatus = input.decision === 'accepted' ? 'accepted'
      : input.decision === 'rejected' ? 'rejected'
        : input.decision === 'modified' ? 'accepted' // modified = accepted with changes
          : 'expired'; // ignored
    await db.recommendation.update({
      where: { id: input.recommendationId },
      data: { status: recStatus },
    }).catch(() => {
      // Recommendation may not exist — that's OK
    });
  }

  // Audit event
  await db.auditEvent.create({
    data: {
      creatorId: input.creatorId,
      actor: 'creator',
      action: input.decision === 'accepted' ? 'approve'
        : input.decision === 'rejected' ? 'reject'
          : 'update',
      targetType: 'recommendation',
      targetId: input.recommendationId ?? decision.id,
      delta: JSON.stringify({
        decision: input.decision,
        category: input.category,
        originalValue: input.originalValue,
        finalValue: input.finalValue,
        reason: input.reason,
      }),
    },
  });

  return decision;
}

/** Get all decisions for a creator */
export async function listDecisions(
  creatorId: string,
  options?: { decision?: DecisionType; limit?: number; offset?: number }
) {
  return db.creatorDecision.findMany({
    where: {
      creatorId,
      ...(options?.decision ? { decision: options.decision } : {}),
    },
    include: {
      contentItem: {
        select: { id: true, title: true, type: true },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: options?.limit ?? 50,
    skip: options?.offset ?? 0,
  });
}

/** Get a single decision */
export async function getDecision(decisionId: string) {
  return db.creatorDecision.findUnique({
    where: { id: decisionId },
    include: {
      contentItem: {
        select: { id: true, title: true, type: true, status: true },
      },
      creator: {
        select: { id: true, name: true, email: true },
      },
    },
  });
}

// ---------------------------------------------------------------------------
// Convenience Methods — Common Decision Patterns
// ---------------------------------------------------------------------------

/** Creator accepts a recommendation as-is */
export async function acceptRecommendation(
  creatorId: string,
  recommendationId: string,
  contentItemId?: string,
  category?: string,
) {
  return createDecision({
    creatorId,
    recommendationId,
    contentItemId,
    decision: 'accepted',
    category,
  });
}

/** Creator modifies a recommendation before using it */
export async function modifyRecommendation(
  creatorId: string,
  recommendationId: string,
  originalValue: string,
  finalValue: string,
  modifications: Record<string, unknown>,
  reason?: string,
  contentItemId?: string,
  category?: string,
) {
  return createDecision({
    creatorId,
    recommendationId,
    contentItemId,
    decision: 'modified',
    category,
    originalValue,
    finalValue,
    modifications,
    reason,
  });
}

/** Creator rejects a recommendation */
export async function rejectRecommendation(
  creatorId: string,
  recommendationId: string,
  reason: string,
  contentItemId?: string,
  category?: string,
  originalValue?: string,
) {
  return createDecision({
    creatorId,
    recommendationId,
    contentItemId,
    decision: 'rejected',
    category,
    originalValue,
    reason,
  });
}

/** Creator ignores a recommendation (no action taken) */
export async function ignoreRecommendation(
  creatorId: string,
  recommendationId: string,
  category?: string,
) {
  return createDecision({
    creatorId,
    recommendationId,
    decision: 'ignored',
    category,
  });
}

// ---------------------------------------------------------------------------
// Decision Analysis & Summary
// ---------------------------------------------------------------------------

/** Get comprehensive decision summary with learning insights */
export async function getDecisionSummary(creatorId: string): Promise<DecisionSummary> {
  const decisions = await db.creatorDecision.findMany({
    where: { creatorId },
    include: {
      contentItem: {
        select: { id: true, title: true },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 100,
  });

  // By type counts
  const byType: Record<DecisionType, number> = {
    accepted: 0,
    modified: 0,
    rejected: 0,
    ignored: 0,
  };
  decisions.forEach(d => { byType[d.decision as DecisionType]++; });

  // Get memory events for categories
  const memoryEvents = await db.memoryEvent.findMany({
    where: {
      creatorId,
      key: { startsWith: 'decision_' },
    },
    orderBy: { createdAt: 'desc' },
    take: 100,
  });

  // By category counts (from memory events)
  const byCategory: Record<string, number> = {};
  memoryEvents.forEach(m => {
    try {
      const val = JSON.parse(m.value);
      const cat = val.category ?? 'general';
      byCategory[cat] = (byCategory[cat] ?? 0) + 1;
    } catch {
      // skip malformed
    }
  });

  // Recent decisions detail
  const recentDecisions: DecisionDetail[] = decisions.slice(0, 20).map(d => {
    let category = 'general';
    let originalValue: string | null = null;
    let finalValue: string | null = null;
    let reason: string | null = d.reason;

    // Try to extract from modifications JSON
    if (d.modifications) {
      try {
        const mod = JSON.parse(d.modifications);
        if (mod.category) category = mod.category;
        if (mod.originalValue) originalValue = String(mod.originalValue);
        if (mod.finalValue) finalValue = String(mod.finalValue);
        if (mod.reason && !reason) reason = mod.reason;
      } catch {
        // skip
      }
    }

    return {
      id: d.id,
      decision: d.decision as DecisionType,
      category,
      originalValue,
      finalValue,
      reason,
      contentItemTitle: d.contentItem?.title ?? null,
      createdAt: d.createdAt,
    };
  });

  // Modification patterns
  const modificationPatterns: ModificationPattern[] = [];
  const modDecisions = decisions.filter(d => d.decision === 'modified' && d.modifications);
  if (modDecisions.length > 0) {
    const byModCategory: Record<string, typeof modDecisions> = {};
    modDecisions.forEach(d => {
      try {
        const mod = JSON.parse(d.modifications!);
        const cat = mod.category ?? 'general';
        if (!byModCategory[cat]) byModCategory[cat] = [];
        byModCategory[cat].push(d);
      } catch {
        // skip
      }
    });

    for (const [cat, items] of Object.entries(byModCategory)) {
      const examples = items.slice(0, 2);
      let exampleOriginal = '';
      let exampleModified = '';
      try {
        const first = JSON.parse(examples[0].modifications!);
        exampleOriginal = first.originalValue ?? '';
        exampleModified = first.finalValue ?? '';
      } catch {
        // skip
      }

      modificationPatterns.push({
        category: cat,
        count: items.length,
        commonChanges: `${items.length} modifications in ${cat}`,
        exampleOriginal,
        exampleModified,
      });
    }
  }

  // Rejection reasons
  const rejectionReasons: RejectionReason[] = [];
  const rejectedDecisions = decisions.filter(d => d.decision === 'rejected' && d.reason);
  if (rejectedDecisions.length > 0) {
    const byReason: Record<string, { count: number; category: string }> = {};
    rejectedDecisions.forEach(d => {
      const reasonKey = d.reason!.toLowerCase().trim().slice(0, 50);
      if (!byReason[reasonKey]) {
        byReason[reasonKey] = { count: 0, category: 'general' };
      }
      byReason[reasonKey].count++;
      try {
        const mod = d.modifications ? JSON.parse(d.modifications) : {};
        if (mod.category) byReason[reasonKey].category = mod.category;
      } catch {
        // skip
      }
    });

    for (const [reason, data] of Object.entries(byReason)) {
      rejectionReasons.push({
        reason,
        count: data.count,
        category: data.category,
      });
    }
    rejectionReasons.sort((a, b) => b.count - a.count);
  }

  // Decision learnings — insights from the feedback loop
  const learnings: DecisionLearning[] = [];

  // Learning 1: Acceptance rate
  const acceptanceRate = decisions.length > 0
    ? (byType.accepted + byType.modified) / decisions.length
    : 0;
  learnings.push({
    category: 'overall',
    insight: `Creator accepts ${(acceptanceRate * 100).toFixed(0)}% of recommendations (${byType.accepted + byType.modified} of ${decisions.length})`,
    confidence: decisions.length >= 10 ? 'high' : decisions.length >= 5 ? 'medium' : 'low',
    dataPoints: decisions.length,
  });

  // Learning 2: Modification rate
  if (byType.modified > 0) {
    const modRate = byType.modified / decisions.length;
    learnings.push({
      category: 'modifications',
      insight: `Creator modifies ${(modRate * 100).toFixed(0)}% of recommendations — voice mismatch indicator`,
      confidence: decisions.length >= 10 ? 'high' : 'medium',
      dataPoints: decisions.length,
    });
  }

  // Learning 3: Rejection patterns
  if (rejectionReasons.length > 0) {
    const topReason = rejectionReasons[0];
    learnings.push({
      category: 'rejections',
      insight: `Most common rejection reason: "${topReason.reason}" (${topReason.count} times in ${topReason.category})`,
      confidence: topReason.count >= 3 ? 'high' : 'medium',
      dataPoints: topReason.count,
    });
  }

  // Learning 4: Category-specific patterns
  for (const [cat, count] of Object.entries(byCategory)) {
    if (count >= 3 && cat !== 'general') {
      const catDecisions = decisions.filter(d => {
        try {
          const mod = d.modifications ? JSON.parse(d.modifications) : {};
          return (mod.category ?? 'general') === cat;
        } catch { return false; }
      });
      const catAcceptRate = catDecisions.length > 0
        ? catDecisions.filter(d => d.decision === 'accepted' || d.decision === 'modified').length / catDecisions.length
        : 0;
      learnings.push({
        category: cat,
        insight: `In ${cat}, creator accepts ${(catAcceptRate * 100).toFixed(0)}% of recommendations (${count} decisions)`,
        confidence: count >= 10 ? 'high' : count >= 5 ? 'medium' : 'low',
        dataPoints: count,
      });
    }
  }

  return {
    total: decisions.length,
    byType,
    byCategory,
    recentDecisions,
    modificationPatterns,
    rejectionReasons,
    learnings,
  };
}

/** Check if a specific recommendation has already been decided on */
export async function hasDecisionOnRecommendation(creatorId: string, recommendationId: string): Promise<boolean> {
  const count = await db.creatorDecision.count({
    where: { creatorId, recommendationId },
  });
  return count > 0;
}

/** Get decisions related to a specific content item */
export async function getDecisionsForContent(contentItemId: string) {
  return db.creatorDecision.findMany({
    where: { contentItemId },
    orderBy: { createdAt: 'desc' },
  });
}

// ---------------------------------------------------------------------------
// Decision Labels & Helpers
// ---------------------------------------------------------------------------

export const DECISION_LABELS: Record<DecisionType, string> = {
  accepted: 'Accepted',
  modified: 'Modified',
  rejected: 'Rejected',
  ignored: 'Ignored',
};

export const DECISION_COLORS: Record<DecisionType, string> = {
  accepted: 'bg-emerald-100 text-emerald-800',
  modified: 'bg-amber-100 text-amber-800',
  rejected: 'bg-rose-100 text-rose-800',
  ignored: 'bg-slate-100 text-slate-800',
};

export const DECISION_ICONS: Record<DecisionType, string> = {
  accepted: '✓',
  modified: '✎',
  rejected: '✗',
  ignored: '○',
};

export const DECISION_CATEGORIES = [
  'hook',
  'topic',
  'timing',
  'format',
  'cta',
  'voice',
  'structure',
  'general',
] as const;

export type DecisionCategory = typeof DECISION_CATEGORIES[number];
