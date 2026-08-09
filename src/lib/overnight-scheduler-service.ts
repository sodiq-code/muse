// ============================================================================
// Overnight Scheduler Service — Day 14
// DB-backed overnight pipeline: REAL scheduling with full overnight loop
//
// REPLACES the in-memory autonomy-scheduler with REAL database operations.
// Core of Phase 6: AUTONOMY.
//
// Overnight Blueprint:
//   22:00  Creator goes offline (detected via inactivity)
//   23:00  Muse wakes up (Alarm Clock Skill)
//          → Reviews recent performance signals
//          → Checks community sentiment
//   23:30  Muse delegates to Maker (via Circle)
//          → Structured instruction with creator voice, winning hooks, topic
//   00:00  Maker produces draft
//   00:15  Muse evaluates Maker's output
//          → Voice match score + Hook compatibility score
//   00:30  Muse stores candidate draft (NOT published)
//   06:00  Muse prepares morning brief
//          → Summary of overnight work
//          → Drafts ready for review
//          → New insights from learning engine
//
// Approval Gate: NON-NEGOTIABLE — NOTHING publishes without human approval.
// Every step creates an AuditEvent record in the DB.
// ============================================================================

import { db } from '@/lib/db';
import {
  runDelegationBeat,
  runDelegationBeatDefault,
  type DelegationBeatResult,
} from '@/lib/delegation-beat-service';
import {
  runLearningEngineOnCreatorData,
  type LearningRunResult,
} from '@/lib/learning-engine-service';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface OvernightStep {
  step: number;
  name: string;
  status: 'complete' | 'failed';
  duration: number;  // ms
  auditEventId: string;
  data: Record<string, unknown>;
}

export interface MorningBriefResult {
  id: string;
  date: string;
  summary: string;
  draftTitle: string | null;
  draftScore: number | null;  // 0-100
  recommendationsCount: number;
  newInsights: string[];
  generatedAt: string;
}

export interface OvernightCycleResult {
  runId: string;           // AutonomousRun.id
  creatorId: string;
  success: boolean;
  steps: OvernightStep[];
  delegationBeat: DelegationBeatResult | null;
  approvalId: string | null;
  morningBrief: MorningBriefResult;
  startedAt: string;
  completedAt: string;
  totalDuration: number;   // ms
}

export interface OvernightScheduleInfo {
  schedule: { wakeTime: string; draftTime: string; briefTime: string };
  lastRun: {
    id: string;
    status: string;
    startedAt: string;
    completedAt: string | null;
    taskType: string;
    trigger: string;
  } | null;
  lastRunTime: string | null;
  totalRuns: number;
  pendingApprovals: number;
  isRunning: boolean;
  recentRuns: {
    id: string;
    status: string;
    startedAt: string;
    completedAt: string | null;
    taskType: string;
  }[];
}

export interface ApprovalResult {
  success: boolean;
  approvalId: string;
  itemType: string;
  itemId: string | null;
  action: string;
  status: string;
  auditEventId: string;
}

export interface ApprovalQueueItem {
  id: string;
  itemType: string;
  itemId: string | null;
  action: string;
  status: string;
  createdAt: string;
  title?: string;  // resolved from Draft if itemType='draft'
}

// ---------------------------------------------------------------------------
// Default Schedule
// ---------------------------------------------------------------------------

export const OVERNIGHT_SCHEDULE = {
  wakeTime: '23:00',
  draftTime: '00:00',
  briefTime: '06:00',
} as const;

// ---------------------------------------------------------------------------
// Helper: Get default creator ID
// ---------------------------------------------------------------------------

export async function getDefaultCreatorId(): Promise<string> {
  const creator = await db.creator.findFirst({
    where: { email: 'sodiqjimoh80@gmail.com' },
  });
  if (!creator) throw new Error('Default creator not found. Run seed first.');
  return creator.id;
}

// ---------------------------------------------------------------------------
// Helper: Create audit event
// ---------------------------------------------------------------------------

async function createAuditEvent(
  creatorId: string,
  actor: string,
  action: string,
  targetType: string,
  targetId: string | null,
  delta: Record<string, unknown> | null
): Promise<string> {
  const event = await db.auditEvent.create({
    data: {
      creatorId,
      actor,
      action,
      targetType,
      targetId,
      delta: delta ? JSON.stringify(delta) : null,
    },
  });
  return event.id;
}

// ---------------------------------------------------------------------------
// Main: Run Full Overnight Cycle
// ---------------------------------------------------------------------------

export async function runOvernightCycle(
  creatorId: string
): Promise<OvernightCycleResult> {
  const startedAt = new Date();
  const cycleStart = Date.now();

  // ── Create AutonomousRun record ──────────────────────────────────────────
  const autonomousRun = await db.autonomousRun.create({
    data: {
      trigger: 'scheduled',
      taskType: 'overnight_cycle',
      status: 'running',
      startedAt,
    },
  });

  const steps: OvernightStep[] = [];
  let delegationBeat: DelegationBeatResult | null = null;
  let approvalId: string | null = null;
  let learningResult: LearningRunResult | null = null;
  let cycleSuccess = true;

  // ── Step 1: Wake ─────────────────────────────────────────────────────────
  try {
    const stepStart = Date.now();
    const auditEventId = await createAuditEvent(
      creatorId,
      'muse',
      'overnight_wake',
      'autonomous_run',
      autonomousRun.id,
      { message: 'Muse woke up for overnight cycle (Passive Autonomous Soul)', trigger: 'scheduled' }
    );
    const duration = Date.now() - stepStart;
    steps.push({
      step: 1,
      name: 'Wake',
      status: 'complete',
      duration,
      auditEventId,
      data: { message: 'Muse woke up for overnight cycle' },
    });
  } catch (error) {
    cycleSuccess = false;
    const stepStart = Date.now();
    const auditEventId = await createAuditEvent(
      creatorId,
      'muse',
      'overnight_wake_failed',
      'autonomous_run',
      autonomousRun.id,
      { error: String(error) }
    );
    steps.push({
      step: 1,
      name: 'Wake',
      status: 'failed',
      duration: Date.now() - stepStart,
      auditEventId,
      data: { error: String(error) },
    });
  }

  // ── Step 2: Review Signals (Run Learning Engine) ─────────────────────────
  try {
    const stepStart = Date.now();
    learningResult = await runLearningEngineOnCreatorData(creatorId);

    const recommendationsCount = learningResult.loopResult.recommendations.length;
    const insights = learningResult.loopResult.inferences.slice(0, 5);
    const confidence = learningResult.loopResult.confidence;

    const auditEventId = await createAuditEvent(
      creatorId,
      'muse',
      'overnight_review_signals',
      'learning_loop',
      learningResult.auditEventId,
      {
        observations: learningResult.loopResult.observations.length,
        comparisons: learningResult.loopResult.comparisons.length,
        inferences: learningResult.loopResult.inferences.length,
        recommendations: recommendationsCount,
        confidence,
        totalDataPoints: learningResult.loopResult.totalDataPoints,
        isHonest: learningResult.honestyReport.isHonest,
        insights,
      }
    );

    const duration = Date.now() - stepStart;
    steps.push({
      step: 2,
      name: 'Review Signals',
      status: 'complete',
      duration,
      auditEventId,
      data: {
        observations: learningResult.loopResult.observations.length,
        recommendations: recommendationsCount,
        confidence,
        dataPoints: learningResult.loopResult.totalDataPoints,
        isHonest: learningResult.honestyReport.isHonest,
        insights,
      },
    });
  } catch (error) {
    // Learning engine failure is non-fatal — continue with the cycle
    const stepStart = Date.now();
    const auditEventId = await createAuditEvent(
      creatorId,
      'muse',
      'overnight_review_signals_failed',
      'learning_loop',
      null,
      { error: String(error), note: 'Non-fatal: continuing cycle without learning data' }
    );
    steps.push({
      step: 2,
      name: 'Review Signals',
      status: 'failed',
      duration: Date.now() - stepStart,
      auditEventId,
      data: { error: String(error), note: 'Non-fatal, continuing' },
    });
  }

  // ── Step 3: Delegate (Full Delegation Beat: Muse→Maker→Evaluate→Store) ──
  try {
    const stepStart = Date.now();
    delegationBeat = await runDelegationBeat(creatorId);

    const auditEventId = await createAuditEvent(
      creatorId,
      'muse',
      'overnight_delegate',
      'delegation_beat',
      delegationBeat.beatId,
      {
        beatId: delegationBeat.beatId,
        mode: delegationBeat.mode,
        success: delegationBeat.success,
        evaluationPassed: delegationBeat.evaluationPassed,
        draftStored: delegationBeat.draftStored,
        totalDuration: delegationBeat.totalDuration,
        scores: delegationBeat.evaluation
          ? {
              voiceMatch: delegationBeat.evaluation.voiceMatch.overall,
              hookCompat: delegationBeat.evaluation.hookCompat.overall,
              overallScore: delegationBeat.evaluation.overallScore,
              passed: delegationBeat.evaluation.passed,
            }
          : null,
      }
    );

    const duration = Date.now() - stepStart;
    steps.push({
      step: 3,
      name: 'Delegate to Maker',
      status: delegationBeat.success ? 'complete' : 'failed',
      duration,
      auditEventId,
      data: {
        beatId: delegationBeat.beatId,
        mode: delegationBeat.mode,
        evaluationPassed: delegationBeat.evaluationPassed,
        draftStored: delegationBeat.draftStored,
        draftId: delegationBeat.draft?.draftId ?? null,
        overallScore: delegationBeat.evaluation?.overallScore ?? 0,
      },
    });
  } catch (error) {
    cycleSuccess = false;
    const stepStart = Date.now();
    const auditEventId = await createAuditEvent(
      creatorId,
      'muse',
      'overnight_delegate_failed',
      'delegation_beat',
      null,
      { error: String(error) }
    );
    steps.push({
      step: 3,
      name: 'Delegate to Maker',
      status: 'failed',
      duration: Date.now() - stepStart,
      auditEventId,
      data: { error: String(error) },
    });
  }

  // ── Step 4: Request Approval (CRITICAL: NEVER auto-publish) ─────────────
  try {
    const stepStart = Date.now();

    // Only create approval if delegation produced a draft
    const draftId = delegationBeat?.draft?.draftId ?? null;
    const draftTitle = delegationBeat?.makerOutput?.title ?? 'Overnight Draft';

    const approval = await db.approval.create({
      data: {
        creatorId,
        itemType: 'draft',
        itemId: draftId,
        action: 'publish',
        status: 'pending',
      },
    });
    approvalId = approval.id;

    const auditEventId = await createAuditEvent(
      creatorId,
      'muse',
      'request_approval',
      'approval',
      approval.id,
      {
        approvalId: approval.id,
        itemType: 'draft',
        itemId: draftId,
        action: 'publish',
        draftTitle,
        note: 'NEVER auto-publish — awaiting human approval',
      }
    );

    const duration = Date.now() - stepStart;
    steps.push({
      step: 4,
      name: 'Request Approval',
      status: 'complete',
      duration,
      auditEventId,
      data: {
        approvalId: approval.id,
        itemType: 'draft',
        itemId: draftId,
        draftTitle,
      },
    });
  } catch (error) {
    const stepStart = Date.now();
    const auditEventId = await createAuditEvent(
      creatorId,
      'muse',
      'request_approval_failed',
      'approval',
      null,
      { error: String(error) }
    );
    steps.push({
      step: 4,
      name: 'Request Approval',
      status: 'failed',
      duration: Date.now() - stepStart,
      auditEventId,
      data: { error: String(error) },
    });
  }

  // ── Step 5: Generate Morning Brief ───────────────────────────────────────
  try {
    const stepStart = Date.now();

    // Load latest recommendations from DB
    const recommendations = await db.recommendation.findMany({
      where: { creatorId, status: 'pending' },
      orderBy: { priority: 'desc' },
      take: 5,
    });

    // Build morning brief
    const draftTitle = delegationBeat?.makerOutput?.title ?? null;
    const draftScore = delegationBeat?.evaluation?.overallScore != null
      ? Math.round(delegationBeat.evaluation.overallScore * 100)
      : null;

    const newInsights: string[] = [];

    // Add learning engine insights
    if (learningResult?.loopResult?.inferences) {
      newInsights.push(...learningResult.loopResult.inferences.slice(0, 3));
    }

    // Add delegation result insights
    if (delegationBeat?.success) {
      newInsights.push(
        `Delegation beat completed in ${delegationBeat.totalDuration}ms (${delegationBeat.mode} mode)`
      );
      if (delegationBeat.evaluationPassed) {
        newInsights.push('Draft passed evaluation — ready for your review');
      } else {
        newInsights.push('Draft did not pass evaluation — may need revision');
      }
    }

    // Add recommendation insights
    for (const rec of recommendations.slice(0, 2)) {
      newInsights.push(`Recommendation: ${rec.title}`);
    }

    const summary = buildBriefSummary(
      draftTitle,
      draftScore,
      recommendations.length,
      newInsights,
      delegationBeat?.success ?? false
    );

    const morningBrief: MorningBriefResult = {
      id: `brief_${autonomousRun.id}`,
      date: startedAt.toISOString().split('T')[0],
      summary,
      draftTitle,
      draftScore,
      recommendationsCount: recommendations.length,
      newInsights,
      generatedAt: new Date().toISOString(),
    };

    const auditEventId = await createAuditEvent(
      creatorId,
      'muse',
      'generate_brief',
      'morning_brief',
      morningBrief.id,
      {
        briefId: morningBrief.id,
        draftTitle,
        draftScore,
        recommendationsCount: recommendations.length,
        newInsightsCount: newInsights.length,
      }
    );

    const duration = Date.now() - stepStart;
    steps.push({
      step: 5,
      name: 'Generate Morning Brief',
      status: 'complete',
      duration,
      auditEventId,
      data: {
        briefId: morningBrief.id,
        draftTitle,
        draftScore,
        recommendationsCount: recommendations.length,
        newInsightsCount: newInsights.length,
      },
    });

    // ── Update AutonomousRun with results ──────────────────────────────────
    const completedAt = new Date();
    const totalDuration = Date.now() - cycleStart;

    await db.autonomousRun.update({
      where: { id: autonomousRun.id },
      data: {
        status: cycleSuccess ? 'completed' : 'failed',
        completedAt,
        result: JSON.stringify({
          success: cycleSuccess,
          steps: steps.map((s) => ({
            step: s.step,
            name: s.name,
            status: s.status,
            duration: s.duration,
          })),
          delegationBeatId: delegationBeat?.beatId ?? null,
          approvalId,
          morningBrief,
          totalDuration,
        }),
      },
    });

    return {
      runId: autonomousRun.id,
      creatorId,
      success: cycleSuccess,
      steps,
      delegationBeat,
      approvalId,
      morningBrief,
      startedAt: startedAt.toISOString(),
      completedAt: completedAt.toISOString(),
      totalDuration,
    };
  } catch (error) {
    // Brief generation failure — still complete the run
    const stepStart = Date.now();
    const auditEventId = await createAuditEvent(
      creatorId,
      'muse',
      'generate_brief_failed',
      'morning_brief',
      null,
      { error: String(error) }
    );
    steps.push({
      step: 5,
      name: 'Generate Morning Brief',
      status: 'failed',
      duration: Date.now() - stepStart,
      auditEventId,
      data: { error: String(error) },
    });

    // Still complete the autonomous run
    const completedAt = new Date();
    const totalDuration = Date.now() - cycleStart;

    const fallbackBrief: MorningBriefResult = {
      id: `brief_${autonomousRun.id}`,
      date: startedAt.toISOString().split('T')[0],
      summary: 'Overnight cycle completed but brief generation failed.',
      draftTitle: null,
      draftScore: null,
      recommendationsCount: 0,
      newInsights: [],
      generatedAt: new Date().toISOString(),
    };

    await db.autonomousRun.update({
      where: { id: autonomousRun.id },
      data: {
        status: 'failed',
        completedAt,
        result: JSON.stringify({
          success: false,
          steps: steps.map((s) => ({
            step: s.step,
            name: s.name,
            status: s.status,
            duration: s.duration,
          })),
          error: String(error),
          totalDuration,
        }),
      },
    });

    return {
      runId: autonomousRun.id,
      creatorId,
      success: false,
      steps,
      delegationBeat,
      approvalId,
      morningBrief: fallbackBrief,
      startedAt: startedAt.toISOString(),
      completedAt: completedAt.toISOString(),
      totalDuration,
    };
  }
}

// ---------------------------------------------------------------------------
// Helper: Build brief summary text
// ---------------------------------------------------------------------------

function buildBriefSummary(
  draftTitle: string | null,
  draftScore: number | null,
  recommendationsCount: number,
  newInsights: string[],
  delegationSuccess: boolean
): string {
  const parts: string[] = [];

  if (draftTitle) {
    parts.push(`Draft ready for review: "${draftTitle}"`);
    if (draftScore != null) {
      parts.push(`Evaluation score: ${draftScore}/100`);
    }
  } else {
    parts.push('No draft produced overnight');
  }

  if (recommendationsCount > 0) {
    parts.push(`${recommendationsCount} pending recommendations`);
  }

  if (newInsights.length > 0) {
    parts.push(`${newInsights.length} new insights from learning engine`);
  }

  if (delegationSuccess) {
    parts.push('Delegation beat completed successfully');
  } else {
    parts.push('Delegation beat encountered issues');
  }

  return parts.join('. ') + '.';
}

// ---------------------------------------------------------------------------
// Get Overnight Schedule Info
// ---------------------------------------------------------------------------

export async function getOvernightSchedule(
  creatorId: string
): Promise<OvernightScheduleInfo> {
  // Get total runs count
  const totalRuns = await db.autonomousRun.count({
    where: { taskType: 'overnight_cycle' },
  });

  // Check if there's a running overnight cycle
  const runningRun = await db.autonomousRun.findFirst({
    where: {
      taskType: 'overnight_cycle',
      status: 'running',
    },
    orderBy: { startedAt: 'desc' },
  });

  // Get most recent run
  const lastRun = await db.autonomousRun.findFirst({
    where: { taskType: 'overnight_cycle' },
    orderBy: { startedAt: 'desc' },
  });

  // Get pending approvals count
  const pendingApprovals = await db.approval.count({
    where: {
      creatorId,
      status: 'pending',
    },
  });

  // Get recent runs (last 10)
  const recentRuns = await db.autonomousRun.findMany({
    where: { taskType: 'overnight_cycle' },
    orderBy: { startedAt: 'desc' },
    take: 10,
  });

  return {
    schedule: OVERNIGHT_SCHEDULE,
    lastRun: lastRun
      ? {
          id: lastRun.id,
          status: lastRun.status,
          startedAt: lastRun.startedAt.toISOString(),
          completedAt: lastRun.completedAt?.toISOString() ?? null,
          taskType: lastRun.taskType,
          trigger: lastRun.trigger,
        }
      : null,
    lastRunTime: lastRun?.startedAt.toISOString() ?? null,
    totalRuns,
    pendingApprovals,
    isRunning: runningRun !== null,
    recentRuns: recentRuns.map((r) => ({
      id: r.id,
      status: r.status,
      startedAt: r.startedAt.toISOString(),
      completedAt: r.completedAt?.toISOString() ?? null,
      taskType: r.taskType,
    })),
  };
}

// ---------------------------------------------------------------------------
// Approve Action
// ---------------------------------------------------------------------------

export async function approveAction(
  approvalId: string,
  creatorId: string
): Promise<ApprovalResult> {
  // Get the approval
  const approval = await db.approval.findUnique({
    where: { id: approvalId },
  });

  if (!approval) {
    throw new Error(`Approval not found: ${approvalId}`);
  }

  if (approval.creatorId !== creatorId) {
    throw new Error('Approval does not belong to this creator');
  }

  if (approval.status !== 'pending') {
    throw new Error(`Approval is already ${approval.status}`);
  }

  // Update approval status
  const now = new Date();
  await db.approval.update({
    where: { id: approvalId },
    data: {
      status: 'approved',
      reviewedAt: now,
    },
  });

  // Create audit event
  const auditEventId = await createAuditEvent(
    creatorId,
    'creator',
    'approve',
    'approval',
    approvalId,
    {
      approvalId,
      itemType: approval.itemType,
      itemId: approval.itemId,
      action: approval.action,
      approvedAt: now.toISOString(),
    }
  );

  // If itemType is 'draft', log the approval on the draft
  if (approval.itemType === 'draft' && approval.itemId) {
    await createAuditEvent(
      creatorId,
      'creator',
      'approve_publish',
      'draft',
      approval.itemId,
      {
        draftId: approval.itemId,
        approvalId,
        action: 'publish_approved',
        note: 'Draft approved for publishing',
      }
    );
  }

  return {
    success: true,
    approvalId,
    itemType: approval.itemType,
    itemId: approval.itemId,
    action: approval.action,
    status: 'approved',
    auditEventId,
  };
}

// ---------------------------------------------------------------------------
// Reject Action
// ---------------------------------------------------------------------------

export async function rejectAction(
  approvalId: string,
  creatorId: string,
  reason?: string
): Promise<ApprovalResult> {
  // Get the approval
  const approval = await db.approval.findUnique({
    where: { id: approvalId },
  });

  if (!approval) {
    throw new Error(`Approval not found: ${approvalId}`);
  }

  if (approval.creatorId !== creatorId) {
    throw new Error('Approval does not belong to this creator');
  }

  if (approval.status !== 'pending') {
    throw new Error(`Approval is already ${approval.status}`);
  }

  // Update approval status
  const now = new Date();
  await db.approval.update({
    where: { id: approvalId },
    data: {
      status: 'rejected',
      reviewedAt: now,
    },
  });

  // Create audit event
  const auditEventId = await createAuditEvent(
    creatorId,
    'creator',
    'reject',
    'approval',
    approvalId,
    {
      approvalId,
      itemType: approval.itemType,
      itemId: approval.itemId,
      action: approval.action,
      rejectedAt: now.toISOString(),
      reason: reason ?? 'No reason provided',
    }
  );

  // If itemType is 'draft', create a CreatorDecision
  if (approval.itemType === 'draft' && approval.itemId) {
    // Look up the draft to get its contentItemId (foreign key requires valid ContentItem)
    const draft = await db.draft.findUnique({ where: { id: approval.itemId } });
    const contentItemId = draft?.contentItemId ?? null;

    // Only create CreatorDecision if we have a valid contentItemId
    if (contentItemId) {
      await db.creatorDecision.create({
        data: {
          creatorId,
          contentItemId,
          decision: 'rejected',
          reason: reason ?? 'Creator rejected overnight draft',
        },
      });
    }

    await createAuditEvent(
      creatorId,
      'creator',
      'reject_publish',
      'draft',
      approval.itemId,
      {
        draftId: approval.itemId,
        approvalId,
        action: 'publish_rejected',
        reason: reason ?? 'No reason provided',
      }
    );
  }

  return {
    success: true,
    approvalId,
    itemType: approval.itemType,
    itemId: approval.itemId,
    action: approval.action,
    status: 'rejected',
    auditEventId,
  };
}

// ---------------------------------------------------------------------------
// Get Approval Queue
// ---------------------------------------------------------------------------

export async function getApprovalQueue(
  creatorId: string
): Promise<ApprovalQueueItem[]> {
  const approvals = await db.approval.findMany({
    where: {
      creatorId,
      status: 'pending',
    },
    orderBy: { createdAt: 'desc' },
  });

  // Resolve titles for draft approvals
  const queue: ApprovalQueueItem[] = [];
  for (const approval of approvals) {
    const item: ApprovalQueueItem = {
      id: approval.id,
      itemType: approval.itemType,
      itemId: approval.itemId,
      action: approval.action,
      status: approval.status,
      createdAt: approval.createdAt.toISOString(),
    };

    // If it's a draft, resolve the title
    if (approval.itemType === 'draft' && approval.itemId) {
      const draft = await db.draft.findUnique({
        where: { id: approval.itemId },
      });
      if (draft) {
        try {
          const content = JSON.parse(draft.content);
          item.title = content.title ?? `Draft v${draft.version}`;
        } catch {
          item.title = `Draft v${draft.version}`;
        }
      }
    }

    queue.push(item);
  }

  return queue;
}

// ---------------------------------------------------------------------------
// Convenience: Run overnight cycle with default creator
// ---------------------------------------------------------------------------

export async function runOvernightCycleDefault(): Promise<OvernightCycleResult> {
  const creatorId = await getDefaultCreatorId();
  return runOvernightCycle(creatorId);
}
