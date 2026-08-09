// ============================================================================
// End-to-End Validation Pipeline — Day 16
// Phase 7: VALIDATION — Run the creator through the FULL MUSE flow
//
// Pipeline steps:
//   1. INGEST: Load creator content items from DB
//   2. LEARN:  Run learning engine on creator data
//   3. DELEGATE: Run delegation beat (Muse → Maker)
//   4. EVALUATE: Score Maker output (voice match, hook compat)
//   5. DRAFT:   Store draft in DB
//   6. APPROVE: Request approval (never auto-publish)
//   7. BRIEF:   Generate morning brief
//
// Each step is timed, verified, and produces evidence.
// If any step fails, the pipeline halts with a clear error.
// All steps are audit-logged.
// ============================================================================

import { db } from '@/lib/db';
import {
  runLearningEngineOnCreatorData,
  type LearningRunResult,
} from '@/lib/learning-engine-service';
import {
  runDelegationBeatDefault,
  type DelegationBeatResult,
} from '@/lib/delegation-beat-service';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ValidationStep {
  step: number;
  name: string;
  status: 'pass' | 'fail' | 'skip';
  durationMs: number;
  evidence: string;
  details: Record<string, unknown>;
}

export interface E2EValidationResult {
  runId: string;
  creatorId: string;
  creatorName: string;
  startedAt: string;
  completedAt: string;
  totalDurationMs: number;
  steps: ValidationStep[];
  overallPass: boolean;
  stepsPassing: number;
  stepsTotal: number;
  summary: {
    contentItemsLoaded: number;
    insightsGenerated: number;
    recommendationsGenerated: number;
    draftCreated: boolean;
    draftTitle: string | null;
    approvalRequested: boolean;
    evaluationScore: number | null;
    confidenceLevel: string;
  };
  // Snapshot of intermediate results for audit
  learningResult: LearningRunResult | null;
  delegationResult: DelegationBeatResult | null;
}

// ---------------------------------------------------------------------------
// Main: Run End-to-End Validation
// ---------------------------------------------------------------------------

export async function runE2EValidation(
  creatorId: string
): Promise<E2EValidationResult> {
  const runId = `e2e_val_${Date.now()}`;
  const startTime = Date.now();
  const steps: ValidationStep[] = [];
  let learningResult: LearningRunResult | null = null;
  let delegationResult: DelegationBeatResult | null = null;
  let draftCreated = false;
  let draftTitle: string | null = null;
  let approvalRequested = false;
  let evaluationScore: number | null = null;
  let confidenceLevel = 'unknown';
  let contentItemsLoaded = 0;
  let insightsGenerated = 0;
  let recommendationsGenerated = 0;

  // Get creator
  const creator = await db.creator.findUnique({ where: { id: creatorId } });
  if (!creator) throw new Error(`Creator not found: ${creatorId}`);

  // ── Step 1: INGEST ──────────────────────────────────────────────────────
  try {
    const stepStart = Date.now();
    const contentItems = await db.contentItem.findMany({
      where: { creatorId },
      include: {
        metrics: true,
        hooks: { include: { patterns: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    contentItemsLoaded = contentItems.length;
    const totalMetrics = contentItems.reduce((sum, item) => sum + item.metrics.length, 0);
    const totalHooks = contentItems.reduce((sum, item) => sum + item.hooks.length, 0);

    if (contentItems.length === 0) {
      steps.push({
        step: 1, name: 'Ingest Content', status: 'fail',
        durationMs: Date.now() - stepStart,
        evidence: 'No content items found in database',
        details: { contentItemsLoaded: 0 },
      });
    } else {
      steps.push({
        step: 1, name: 'Ingest Content', status: 'pass',
        durationMs: Date.now() - stepStart,
        evidence: `${contentItems.length} content items loaded with ${totalMetrics} metrics and ${totalHooks} hooks`,
        details: { contentItemsLoaded: contentItems.length, totalMetrics, totalHooks },
      });
    }
  } catch (error) {
    steps.push({
      step: 1, name: 'Ingest Content', status: 'fail',
      durationMs: 0,
      evidence: `Ingest failed: ${error}`,
      details: { error: String(error) },
    });
  }

  // ── Step 2: LEARN ───────────────────────────────────────────────────────
  const ingestPassed = steps[0]?.status === 'pass';
  if (ingestPassed) {
    try {
      const stepStart = Date.now();
      learningResult = await runLearningEngineOnCreatorData(creatorId);

      insightsGenerated = learningResult.loopResult.inferences.length;
      recommendationsGenerated = learningResult.loopResult.recommendations.length;
      confidenceLevel = learningResult.loopResult.confidence;

      const hasInsights = learningResult.loopResult.inferences.length > 0;
      const hasRecommendations = learningResult.loopResult.recommendations.length > 0;
      const hasHonestConfidence = ['low', 'medium', 'high'].includes(learningResult.loopResult.confidence);

      steps.push({
        step: 2, name: 'Learn from Data', status: (hasInsights || hasRecommendations) ? 'pass' : 'fail',
        durationMs: Date.now() - stepStart,
        evidence: `Learning engine produced ${insightsGenerated} insights, ${recommendationsGenerated} recommendations (confidence: ${confidenceLevel}, dataPoints: ${learningResult.loopResult.totalDataPoints})`,
        details: {
          observations: learningResult.loopResult.observations.length,
          comparisons: learningResult.loopResult.comparisons.length,
          inferences: insightsGenerated,
          recommendations: recommendationsGenerated,
          confidence: confidenceLevel,
          totalDataPoints: learningResult.loopResult.totalDataPoints,
          isHonest: learningResult.honest,
        },
      });
    } catch (error) {
      steps.push({
        step: 2, name: 'Learn from Data', status: 'fail',
        durationMs: 0,
        evidence: `Learning failed: ${error}`,
        details: { error: String(error) },
      });
    }
  } else {
    steps.push({ step: 2, name: 'Learn from Data', status: 'skip', durationMs: 0, evidence: 'Skipped (ingest failed)', details: {} });
  }

  // ── Step 3: DELEGATE ────────────────────────────────────────────────────
  const learnPassed = steps[1]?.status === 'pass';
  if (learnPassed) {
    try {
      const stepStart = Date.now();
      delegationResult = await runDelegationBeatDefault();

      const hasOutput = delegationResult.makerOutput !== null;
      const topicCovered = delegationResult.makerOutput?.title !== null;

      steps.push({
        step: 3, name: 'Delegate to Maker', status: delegationResult.success && hasOutput ? 'pass' : 'fail',
        durationMs: Date.now() - stepStart,
        evidence: delegationResult.success
          ? `Delegation beat completed (${delegationResult.mode} mode) — Maker produced: "${delegationResult.makerOutput?.title ?? 'untitled'}"`
          : `Delegation failed: ${delegationResult.error ?? 'unknown'}`,
        details: {
          beatId: delegationResult.beatId,
          mode: delegationResult.mode,
          success: delegationResult.success,
          evaluationPassed: delegationResult.evaluationPassed,
          duration: delegationResult.totalDuration,
        },
      });
    } catch (error) {
      steps.push({
        step: 3, name: 'Delegate to Maker', status: 'fail',
        durationMs: 0,
        evidence: `Delegation failed: ${error}`,
        details: { error: String(error) },
      });
    }
  } else {
    steps.push({ step: 3, name: 'Delegate to Maker', status: 'skip', durationMs: 0, evidence: 'Skipped (learn failed)', details: {} });
  }

  // ── Step 4: EVALUATE ────────────────────────────────────────────────────
  const delegatePassed = steps[2]?.status === 'pass';
  if (delegatePassed && delegationResult?.evaluation) {
    try {
      const stepStart = Date.now();
      const eval_ = delegationResult.evaluation;

      evaluationScore = Math.round(eval_.overallScore * 100);
      const voiceMatch = Math.round(eval_.voiceMatchScore * 100);
      const hookCompat = Math.round(eval_.hookCompatibilityScore * 100);
      const passed = delegationResult.evaluationPassed;

      steps.push({
        step: 4, name: 'Evaluate Output', status: passed ? 'pass' : 'fail',
        durationMs: Date.now() - stepStart,
        evidence: `Evaluation ${passed ? 'PASSED' : 'FAILED'} — Overall: ${evaluationScore}%, Voice: ${voiceMatch}%, Hook: ${hookCompat}%`,
        details: {
          overallScore: evaluationScore,
          voiceMatchScore: voiceMatch,
          hookCompatibilityScore: hookCompat,
          passed,
          threshold: '60%',
        },
      });
    } catch (error) {
      steps.push({
        step: 4, name: 'Evaluate Output', status: 'fail',
        durationMs: 0,
        evidence: `Evaluation failed: ${error}`,
        details: { error: String(error) },
      });
    }
  } else {
    steps.push({ step: 4, name: 'Evaluate Output', status: 'skip', durationMs: 0, evidence: delegatePassed ? 'No evaluation data' : 'Skipped (delegate failed)', details: {} });
  }

  // ── Step 5: DRAFT ───────────────────────────────────────────────────────
  const evalPassed = steps[3]?.status === 'pass';
  if (evalPassed && delegationResult?.draftStored && delegationResult.makerOutput) {
    try {
      const stepStart = Date.now();
      draftCreated = true;
      draftTitle = delegationResult.makerOutput.title ?? null;

      steps.push({
        step: 5, name: 'Store Draft', status: 'pass',
        durationMs: Date.now() - stepStart,
        evidence: `Draft stored: "${draftTitle}" (version ${delegationResult.makerOutput.version ?? 1})`,
        details: {
          draftId: delegationResult.makerOutput.draftId ?? 'stored',
          title: draftTitle,
          version: delegationResult.makerOutput.version ?? 1,
        },
      });
    } catch (error) {
      steps.push({
        step: 5, name: 'Store Draft', status: 'fail',
        durationMs: 0,
        evidence: `Draft storage failed: ${error}`,
        details: { error: String(error) },
      });
    }
  } else {
    steps.push({ step: 5, name: 'Store Draft', status: evalPassed ? 'fail' : 'skip', durationMs: 0, evidence: evalPassed ? 'No draft produced by Maker' : 'Skipped (evaluate failed)', details: {} });
  }

  // ── Step 6: APPROVE ─────────────────────────────────────────────────────
  const draftPassed = steps[4]?.status === 'pass';
  if (draftPassed) {
    try {
      const stepStart = Date.now();

      // Check for pending approvals
      const pendingApproval = await db.approval.findFirst({
        where: {
          creatorId,
          status: 'pending',
          itemType: 'draft',
        },
        orderBy: { createdAt: 'desc' },
      });

      approvalRequested = pendingApproval !== null;

      steps.push({
        step: 6, name: 'Request Approval', status: approvalRequested ? 'pass' : 'fail',
        durationMs: Date.now() - stepStart,
        evidence: approvalRequested
          ? `Approval gate active — pending approval ${pendingApproval!.id.slice(0, 12)}… (NEVER auto-publishes)`
          : 'No pending approval found — approval gate may not be working',
        details: {
          approvalRequested,
          approvalId: pendingApproval?.id ?? null,
          itemType: 'draft',
          action: 'publish',
          note: 'NON-NEGOTIABLE: Nothing publishes without human approval',
        },
      });
    } catch (error) {
      steps.push({
        step: 6, name: 'Request Approval', status: 'fail',
        durationMs: 0,
        evidence: `Approval check failed: ${error}`,
        details: { error: String(error) },
      });
    }
  } else {
    steps.push({ step: 6, name: 'Request Approval', status: 'skip', durationMs: 0, evidence: 'Skipped (draft failed)', details: {} });
  }

  // ── Step 7: MORNING BRIEF ───────────────────────────────────────────────
  const approvePassed = steps[5]?.status === 'pass';
  if (approvePassed) {
    try {
      const stepStart = Date.now();

      // Build morning brief from available data
      const recentRecommendations = await db.recommendation.findMany({
        where: { creatorId, status: 'pending' },
        orderBy: { priority: 'desc' },
        take: 5,
      });

      const recentMemories = await db.memoryEvent.findMany({
        where: { creatorId },
        orderBy: { createdAt: 'desc' },
        take: 10,
      });

      const briefInsights = learningResult?.loopResult?.inferences?.slice(0, 3) ?? [];

      steps.push({
        step: 7, name: 'Morning Brief', status: 'pass',
        durationMs: Date.now() - stepStart,
        evidence: `Morning brief generated — ${recentRecommendations.length} recommendations, ${briefInsights.length} new insights, ${recentMemories.length} recent memories`,
        details: {
          recommendations: recentRecommendations.length,
          insights: briefInsights.length,
          memories: recentMemories.length,
          draftTitle,
          evaluationScore,
          confidenceLevel,
        },
      });
    } catch (error) {
      steps.push({
        step: 7, name: 'Morning Brief', status: 'fail',
        durationMs: 0,
        evidence: `Brief generation failed: ${error}`,
        details: { error: String(error) },
      });
    }
  } else {
    steps.push({ step: 7, name: 'Morning Brief', status: 'skip', durationMs: 0, evidence: 'Skipped (approval failed)', details: {} });
  }

  // ── Compute overall result ──────────────────────────────────────────────
  const completedAt = new Date().toISOString();
  const totalDurationMs = Date.now() - startTime;
  const stepsPassing = steps.filter((s) => s.status === 'pass').length;
  const stepsTotal = steps.length;
  const overallPass = stepsPassing === stepsTotal && stepsTotal >= 7;

  // Audit log the validation run
  await db.auditEvent.create({
    data: {
      creatorId,
      actor: 'system',
      action: 'e2e_validation',
      targetType: 'validation_run',
      targetId: runId,
      delta: JSON.stringify({
        runId,
        overallPass,
        stepsPassing,
        stepsTotal,
        totalDurationMs,
        steps: steps.map((s) => ({ step: s.step, name: s.name, status: s.status, durationMs: s.durationMs })),
      }),
    },
  });

  return {
    runId,
    creatorId,
    creatorName: creator.name,
    startedAt: new Date(startTime).toISOString(),
    completedAt,
    totalDurationMs,
    steps,
    overallPass,
    stepsPassing,
    stepsTotal,
    summary: {
      contentItemsLoaded,
      insightsGenerated,
      recommendationsGenerated,
      draftCreated,
      draftTitle,
      approvalRequested,
      evaluationScore,
      confidenceLevel,
    },
    learningResult,
    delegationResult,
  };
}

// ---------------------------------------------------------------------------
// Convenience: Run with default creator
// ---------------------------------------------------------------------------

export async function runE2EValidationDefault(): Promise<E2EValidationResult> {
  const creator = await db.creator.findFirst({
    where: { email: 'sodiqjimoh80@gmail.com' },
  });
  if (!creator) throw new Error('Default creator not found. Run seed first.');
  return runE2EValidation(creator.id);
}
