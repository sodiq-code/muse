// ============================================================================
// Creator Feedback Service — Day 17
// Phase 7 VALIDATION: Collect creator feedback → Creator corrections logged
// Refine based on feedback → Memory updated from real feedback
//
// This is the feedback loop that makes Muse actually improve:
//   Creator gives feedback → CreatorDecision logged → MemoryEvent updated
//   → Confidence adjusted → Future recommendations improved
//
// NON-NEGOTIABLE: Every feedback creates an audit trail.
// Statistical honesty: feedback impact is measured, not assumed.
// ============================================================================

import { db } from '@/lib/db';
import { logMemoryEvent } from '@/lib/creator-service';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type FeedbackType = 'correction' | 'approval' | 'rejection' | 'refinement' | 'preference';
export type FeedbackTarget = 'recommendation' | 'draft' | 'insight' | 'hook' | 'voice' | 'timing';

export interface CreatorFeedbackInput {
  creatorId: string;
  feedbackType: FeedbackType;
  targetType: FeedbackTarget;
  targetId: string;           // ID of the thing being corrected
  targetTitle?: string;       // Human-readable title
  originalValue: string;      // What Muse recommended
  correctedValue?: string;    // What the creator actually wants (if correction/refinement)
  reason?: string;            // Why the creator disagrees
  category?: string;          // "hook", "topic", "timing", "format", "cta", "voice", "tone"
  confidence?: number;        // Creator's confidence in their correction (0-1)
  isSimulation?: boolean;     // True if this is simulated feedback
}

export interface FeedbackResult {
  success: boolean;
  feedbackId: string;
  decisionId: string;
  memoryEventId: string;
  auditEventId: string;
  refinements: FeedbackRefinement[];
  impact: FeedbackImpact;
  timestamp: string;
}

export interface FeedbackRefinement {
  type: 'memory_update' | 'confidence_adjustment' | 'pattern_correction' | 'preference_update';
  category: string;
  key: string;
  oldValue: string;
  newValue: string;
  reason: string;
}

export interface FeedbackImpact {
  memoryEventsCreated: number;
  confidenceAdjustments: number;
  recommendationsAffected: number;
  patternsUpdated: number;
}

export interface FeedbackSession {
  id: string;
  creatorId: string;
  feedbackCount: number;
  correctionsLogged: number;
  refinementsApplied: number;
  memoryEventsUpdated: number;
  confidenceChanges: ConfidenceChange[];
  startedAt: string;
  lastFeedbackAt: string;
}

export interface ConfidenceChange {
  category: string;
  key: string;
  before: number;
  after: number;
  reason: string;
}

export interface FeedbackSummary {
  totalFeedback: number;
  byType: Record<FeedbackType, number>;
  byTarget: Record<FeedbackTarget, number>;
  byCategory: Record<string, number>;
  recentFeedback: FeedbackDetail[];
  topCorrectionPatterns: CorrectionPattern[];
  memoryRefinements: number;
  confidenceShifts: number;
  isSimulation: boolean;
}

export interface FeedbackDetail {
  id: string;
  feedbackType: FeedbackType;
  targetType: FeedbackTarget;
  targetTitle: string;
  originalValue: string;
  correctedValue: string | null;
  reason: string | null;
  category: string | null;
  createdAt: Date;
  isSimulation: boolean;
}

export interface CorrectionPattern {
  category: string;
  pattern: string;
  count: number;
  exampleOriginal: string;
  exampleCorrected: string;
  avgConfidenceShift: number;
}

// ---------------------------------------------------------------------------
// Core: Submit Creator Feedback
// ---------------------------------------------------------------------------

/**
 * Submit creator feedback and trigger the refinement pipeline.
 * This is the heart of the learning loop — feedback → memory → improvement.
 */
export async function submitCreatorFeedback(input: CreatorFeedbackInput): Promise<FeedbackResult> {
  const creator = await db.creator.findUnique({ where: { id: input.creatorId } });
  if (!creator) throw new Error(`Creator not found: ${input.creatorId}`);

  const refinements: FeedbackRefinement[] = [];
  let impact: FeedbackImpact = {
    memoryEventsCreated: 0,
    confidenceAdjustments: 0,
    recommendationsAffected: 0,
    patternsUpdated: 0,
  };

  // Step 1: Create CreatorDecision record
  const decisionType = input.feedbackType === 'correction' || input.feedbackType === 'refinement'
    ? 'modified'
    : input.feedbackType === 'approval'
      ? 'accepted'
      : input.feedbackType === 'rejection'
        ? 'rejected'
        : 'ignored';

  // Resolve contentItemId — only set if targetId references a real ContentItem
  let contentItemId: string | null = null;
  if (input.targetType === 'draft' || input.targetType === 'hook') {
    const exists = await db.contentItem.findUnique({ where: { id: input.targetId } }).catch(() => null);
    if (exists) contentItemId = input.targetId;
  }

  // Resolve recommendationId — only set if targetId references a real Recommendation
  let recommendationId: string | null = null;
  if (input.targetType === 'recommendation') {
    const exists = await db.recommendation.findUnique({ where: { id: input.targetId } }).catch(() => null);
    if (exists) recommendationId = input.targetId;
  }

  const decision = await db.creatorDecision.create({
    data: {
      creatorId: input.creatorId,
      contentItemId,
      recommendationId,
      decision: decisionType,
      modifications: input.correctedValue ? JSON.stringify({
        original: input.originalValue,
        corrected: input.correctedValue,
        category: input.category,
        targetType: input.targetType,
        targetTitle: input.targetTitle,
        targetId: input.targetId,
      }) : JSON.stringify({
        original: input.originalValue,
        category: input.category,
        targetType: input.targetType,
        targetTitle: input.targetTitle,
        targetId: input.targetId,
      }),
      reason: input.reason ?? null,
    },
  });

  // Step 2: Create MemoryEvent from feedback
  const memoryCategory = mapFeedbackToMemoryCategory(input.targetType);
  const memoryKey = `${input.targetType}:${input.category ?? 'general'}:${input.targetId}`;
  const memoryValue = input.correctedValue ?? input.originalValue;

  const memoryEvent = await logMemoryEvent({
    creatorId: input.creatorId,
    category: memoryCategory,
    key: memoryKey,
    value: JSON.stringify({
      original: input.originalValue,
      corrected: input.correctedValue ?? input.originalValue,
      reason: input.reason,
      feedbackType: input.feedbackType,
      source: input.isSimulation ? 'simulation_feedback' : 'creator_feedback',
    }),
    source: input.isSimulation ? 'simulation_feedback' : 'creator_feedback',
    confidence: input.confidence ?? 0.9,
  });
  impact.memoryEventsCreated++;

  refinements.push({
    type: 'memory_update',
    category: memoryCategory,
    key: memoryKey,
    oldValue: input.originalValue,
    newValue: memoryValue,
    reason: `Creator ${input.feedbackType}: ${input.reason ?? 'no reason given'}`,
  });

  // Step 3: Adjust confidence based on feedback type
  const confidenceAdjustment = computeConfidenceAdjustment(input.feedbackType);
  if (confidenceAdjustment !== 0) {
    // Update existing memory events for this category/key pattern
    const relatedMemories = await db.memoryEvent.findMany({
      where: {
        creatorId: input.creatorId,
        category: memoryCategory,
        key: { contains: input.category ?? input.targetType },
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    for (const mem of relatedMemories) {
      const newConfidence = Math.max(0.1, Math.min(1.0, mem.confidence + confidenceAdjustment));
      if (Math.abs(newConfidence - mem.confidence) > 0.01) {
        await db.memoryEvent.update({
          where: { id: mem.id },
          data: { confidence: newConfidence },
        });
        impact.confidenceAdjustments++;
      }
    }

    refinements.push({
      type: 'confidence_adjustment',
      category: memoryCategory,
      key: input.category ?? input.targetType,
      oldValue: 'adjusted',
      newValue: `${confidenceAdjustment > 0 ? '+' : ''}${confidenceAdjustment.toFixed(2)}`,
      reason: `Feedback "${input.feedbackType}" shifts confidence for ${input.category ?? input.targetType}`,
    });
  }

  // Step 4: For corrections/refinements, update pattern data
  if (input.correctedValue && input.correctedValue !== input.originalValue) {
    await logMemoryEvent({
      creatorId: input.creatorId,
      category: 'pattern',
      key: `correction_pattern:${input.category ?? input.targetType}`,
      value: JSON.stringify({
        from: input.originalValue,
        to: input.correctedValue,
        feedbackType: input.feedbackType,
      }),
      source: input.isSimulation ? 'simulation_inference' : 'muse_inference',
      confidence: 0.7,
    });
    impact.patternsUpdated++;

    refinements.push({
      type: 'pattern_correction',
      category: input.category ?? input.targetType,
      key: `correction_pattern`,
      oldValue: input.originalValue,
      newValue: input.correctedValue,
      reason: `Creator corrected "${input.originalValue}" → "${input.correctedValue}"`,
    });
  }

  // Step 5: For preference feedback, update preferences
  if (input.feedbackType === 'preference' && input.correctedValue) {
    await logMemoryEvent({
      creatorId: input.creatorId,
      category: 'preference',
      key: `creator_preference:${input.category ?? input.targetType}`,
      value: input.correctedValue,
      source: input.isSimulation ? 'simulation_feedback' : 'creator_feedback',
      confidence: 1.0,
    });

    refinements.push({
      type: 'preference_update',
      category: input.category ?? input.targetType,
      key: `creator_preference`,
      oldValue: input.originalValue,
      newValue: input.correctedValue,
      reason: `Creator explicitly set preference: "${input.correctedValue}"`,
    });
  }

  // Step 6: Count affected recommendations
  const affectedRecs = await db.recommendation.findMany({
    where: {
      creatorId: input.creatorId,
      type: input.category ?? input.targetType,
      status: 'pending',
    },
  });
  impact.recommendationsAffected = affectedRecs.length;

  // Step 7: Audit event for the entire feedback operation
  const auditEvent = await db.auditEvent.create({
    data: {
      creatorId: input.creatorId,
      actor: input.isSimulation ? 'simulation' : 'creator',
      action: 'feedback',
      targetType: 'creator_feedback',
      targetId: decision.id,
      delta: JSON.stringify({
        feedbackType: input.feedbackType,
        targetType: input.targetType,
        category: input.category,
        originalValue: input.originalValue,
        correctedValue: input.correctedValue,
        reason: input.reason,
        refinements: refinements.length,
        impact,
        isSimulation: input.isSimulation ?? false,
      }),
    },
  });

  return {
    success: true,
    feedbackId: decision.id,
    decisionId: decision.id,
    memoryEventId: memoryEvent.id,
    auditEventId: auditEvent.id,
    refinements,
    impact,
    timestamp: new Date().toISOString(),
  };
}

// ---------------------------------------------------------------------------
// Get Feedback Summary
// ---------------------------------------------------------------------------

export async function getFeedbackSummary(creatorId: string): Promise<FeedbackSummary> {
  const decisions = await db.creatorDecision.findMany({
    where: { creatorId },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });

  const memoryEvents = await db.memoryEvent.findMany({
    where: {
      creatorId,
      source: { in: ['creator_feedback', 'simulation_feedback'] },
    },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });

  // Count by type
  const byType: Record<FeedbackType, number> = {
    correction: 0, approval: 0, rejection: 0, refinement: 0, preference: 0,
  };
  const byTarget: Record<FeedbackTarget, number> = {
    recommendation: 0, draft: 0, insight: 0, hook: 0, voice: 0, timing: 0,
  };
  const byCategory: Record<string, number> = {};

  const recentFeedback: FeedbackDetail[] = [];
  const correctionPatterns: Map<string, CorrectionPattern> = new Map();

  for (const d of decisions) {
    const mods = d.modifications ? JSON.parse(d.modifications) : null;
    const fType = mapDecisionToFeedbackType(d.decision);
    byType[fType] = (byType[fType] ?? 0) + 1;

    if (mods?.category) {
      byCategory[mods.category] = (byCategory[mods.category] ?? 0) + 1;
    }

    recentFeedback.push({
      id: d.id,
      feedbackType: fType,
      targetType: mods?.category ? mapCategoryToTarget(mods.category) : 'recommendation',
      targetTitle: mods?.category ?? 'general',
      originalValue: mods?.original ?? '',
      correctedValue: mods?.corrected ?? null,
      reason: d.reason ?? null,
      category: mods?.category ?? null,
      createdAt: d.createdAt,
      isSimulation: memoryEvents.some(m => m.source === 'simulation_feedback'),
    });

    // Track correction patterns
    if (mods?.original && mods?.corrected && mods.original !== mods.corrected) {
      const patternKey = `${mods.category ?? 'general'}:${mods.original.substring(0, 30)}`;
      const existing = correctionPatterns.get(patternKey);
      if (existing) {
        existing.count++;
      } else {
        correctionPatterns.set(patternKey, {
          category: mods.category ?? 'general',
          pattern: `${mods.original} → ${mods.corrected}`,
          count: 1,
          exampleOriginal: mods.original,
          exampleCorrected: mods.corrected,
          avgConfidenceShift: 0,
        });
      }
    }
  }

  // Count simulation vs real
  const simMemories = memoryEvents.filter(m => m.source === 'simulation_feedback');

  return {
    totalFeedback: decisions.length,
    byType,
    byTarget,
    byCategory,
    recentFeedback: recentFeedback.slice(0, 20),
    topCorrectionPatterns: Array.from(correctionPatterns.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 10),
    memoryRefinements: memoryEvents.length,
    confidenceShifts: memoryEvents.filter(m => m.confidence < 0.8 || m.confidence > 0.95).length,
    isSimulation: simMemories.length > memoryEvents.length / 2,
  };
}

// ---------------------------------------------------------------------------
// Get Refinement Timeline — shows the feedback → memory → improvement chain
// ---------------------------------------------------------------------------

export interface RefinementEntry {
  id: string;
  timestamp: string;
  feedbackType: FeedbackType;
  category: string;
  description: string;
  beforeValue: string;
  afterValue: string;
  confidenceShift: number;
  isSimulation: boolean;
}

export async function getRefinementTimeline(creatorId: string, limit = 30): Promise<RefinementEntry[]> {
  const feedbackMemories = await db.memoryEvent.findMany({
    where: {
      creatorId,
      source: { in: ['creator_feedback', 'simulation_feedback', 'muse_inference', 'simulation_inference'] },
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });

  const entries: RefinementEntry[] = [];

  for (const mem of feedbackMemories) {
    let parsed: any = {};
    try { parsed = JSON.parse(mem.value); } catch { parsed = { raw: mem.value }; }

    entries.push({
      id: mem.id,
      timestamp: mem.createdAt.toISOString(),
      feedbackType: parsed.feedbackType ?? mapSourceToFeedbackType(mem.source),
      category: mem.category,
      description: parsed.reason ?? `${mem.category}/${mem.key} updated`,
      beforeValue: parsed.original ?? '',
      afterValue: parsed.corrected ?? parsed.raw ?? mem.value,
      confidenceShift: mem.confidence - 0.8, // relative to baseline
      isSimulation: mem.source.includes('simulation'),
    });
  }

  return entries;
}

// ---------------------------------------------------------------------------
// Batch: Submit multiple feedback items (for simulation mode)
// ---------------------------------------------------------------------------

export async function submitBatchFeedback(inputs: CreatorFeedbackInput[]): Promise<FeedbackResult[]> {
  const results: FeedbackResult[] = [];
  for (const input of inputs) {
    try {
      const result = await submitCreatorFeedback(input);
      results.push(result);
    } catch (err) {
      // Skip failed feedback, continue with rest
      console.error('Feedback submission failed:', err);
    }
  }
  return results;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function mapFeedbackToMemoryCategory(target: FeedbackTarget): string {
  const map: Record<FeedbackTarget, string> = {
    recommendation: 'performance',
    draft: 'pattern',
    insight: 'performance',
    hook: 'pattern',
    voice: 'identity',
    timing: 'preference',
  };
  return map[target] ?? 'feedback';
}

function computeConfidenceAdjustment(feedbackType: FeedbackType): number {
  switch (feedbackType) {
    case 'approval': return 0.05;   // Approve → slight confidence boost
    case 'rejection': return -0.15; // Reject → significant confidence drop
    case 'correction': return -0.1; // Correct → moderate confidence drop
    case 'refinement': return 0.02; // Refine → tiny confidence boost (creator cares enough to refine)
    case 'preference': return 0.1;  // Explicit preference → strong confidence boost
    default: return 0;
  }
}

function mapDecisionToFeedbackType(decision: string): FeedbackType {
  switch (decision) {
    case 'accepted': return 'approval';
    case 'rejected': return 'rejection';
    case 'modified': return 'correction';
    case 'ignored': return 'refinement';
    default: return 'correction';
  }
}

function mapCategoryToTarget(category: string): FeedbackTarget {
  switch (category) {
    case 'hook': return 'hook';
    case 'voice': return 'voice';
    case 'tone': return 'voice';
    case 'timing': return 'timing';
    case 'format': return 'draft';
    default: return 'recommendation';
  }
}

function mapSourceToFeedbackType(source: string): FeedbackType {
  if (source.includes('simulation')) return 'correction';
  if (source === 'muse_inference') return 'refinement';
  if (source === 'creator_feedback') return 'correction';
  return 'correction';
}
