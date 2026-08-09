// ============================================================================
// Delegation Beat Service — Day 11
// Full Delegation Beat: Muse→Maker→Evaluate→Store
//
// This is the DEMO-READY end-to-end pipeline that shows the complete
// delegation cycle working in a single, step-by-step execution.
//
// Each step is timed, evidences are collected, and the full beat
// produces a complete audit trail from context loading to draft storage.
//
// Blueprint Reference:
//   Scene 5: "Muse delegates to Maker (shows structured instruction)"
//   Scene 6: "Maker returns; Muse evaluates (Voice 94%, Hook 91%)"
//   Day 11: "Demo the full delegation beat | Muse→Maker→evaluate→store"
// ============================================================================

import { db } from '@/lib/db';
import {
  loadDelegationContext,
  buildStructuredInstruction,
  executeDelegation,
  getDefaultCreatorId,
  type DelegationContext,
  type StructuredInstruction,
  type DelegationResult,
} from '@/lib/delegation-service';
import {
  evaluateMakerOutput,
  getEvaluationThresholds,
  type EvaluationResult,
} from '@/lib/evaluation-service';
import {
  storeDraftFromEvaluation,
  type DraftCreationResult,
} from '@/lib/draft-pipeline';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** A single step in the delegation beat */
export interface BeatStep {
  step: number;
  name: string;
  description: string;
  status: 'pending' | 'running' | 'complete' | 'failed';
  startTime: number;    // epoch ms
  endTime: number;      // epoch ms
  duration: number;     // ms
  evidence: string[];   // What data this step used/produced
  data: Record<string, unknown>;  // Step-specific result data
}

/** The complete delegation beat result */
export interface DelegationBeatResult {
  beatId: string;
  timestamp: string;
  creatorId: string;
  creatorName: string;
  mode: 'live' | 'simulated';
  totalDuration: number;  // ms
  steps: BeatStep[];

  // Convenience accessors for each step's key output
  context: DelegationContext | null;
  instruction: StructuredInstruction | null;
  delegation: DelegationResult | null;
  evaluation: EvaluationResult | null;
  draft: DraftCreationResult | null;
  makerOutput: DelegationResult['makerOutput'] | null;

  // Overall beat status
  success: boolean;
  evaluationPassed: boolean;
  draftStored: boolean;

  // Audit trail summary
  auditSummary: {
    totalAuditEvents: number;
    delegationAuditId: string;
    evaluationId: string;
    draftAuditId: string;
  };
}

// ---------------------------------------------------------------------------
// Step 1: Load Context
// ---------------------------------------------------------------------------

async function runStep1_LoadContext(
  creatorId: string,
  topic?: string,
  objective?: string
): Promise<{ step: BeatStep; context: DelegationContext }> {
  const startTime = Date.now();

  const context = await loadDelegationContext(creatorId, topic, objective);

  const evidence: string[] = [];
  evidence.push(`Creator: ${context.creatorName} on ${context.platform}`);
  evidence.push(`Voice: ${context.voiceProfile.tone}/${context.voiceProfile.pace}/${context.voiceProfile.vocabulary}`);
  evidence.push(`${context.bestHookPatterns.length} best hook patterns loaded`);
  evidence.push(`${context.recentWinners.length} recent winning items`);
  evidence.push(`${context.performanceSignals.length} performance signals`);
  evidence.push(`Topic inferred: "${context.topic}"`);
  evidence.push(`Objective inferred: "${context.objective}"`);

  const endTime = Date.now();
  const step: BeatStep = {
    step: 1,
    name: 'Load Context',
    description: 'Load creator identity, voice profile, hook patterns, and performance signals from memory',
    status: 'complete',
    startTime,
    endTime,
    duration: endTime - startTime,
    evidence,
    data: {
      creatorName: context.creatorName,
      platform: context.platform,
      niche: context.niche,
      audience: context.audience,
      voiceProfile: context.voiceProfile,
      hookPatternsCount: context.bestHookPatterns.length,
      winnersCount: context.recentWinners.length,
      signalsCount: context.performanceSignals.length,
      topic: context.topic,
      objective: context.objective,
    },
  };

  return { step, context };
}

// ---------------------------------------------------------------------------
// Step 2: Build & Send Delegation
// ---------------------------------------------------------------------------

async function runStep2_Delegate(
  context: DelegationContext,
  creatorId: string
): Promise<{ step: BeatStep; instruction: StructuredInstruction; delegation: DelegationResult }> {
  const startTime = Date.now();

  // Build structured instruction
  const instruction = buildStructuredInstruction(context);

  // Execute delegation (send to Maker)
  const delegation = await executeDelegation(instruction, creatorId);

  const evidence: string[] = [];
  evidence.push(`Instruction ID: ${instruction.instructionId}`);
  evidence.push(`Mode: ${delegation.mode}`);
  evidence.push(`Topic: "${instruction.makerInput.topic}"`);
  evidence.push(`Objective: "${instruction.makerInput.objective}"`);
  evidence.push(`Confidence: ${instruction.confidenceLevel} (${instruction.dataPointsUsed} data points)`);
  evidence.push(`Maker output: "${delegation.makerOutput.title}"`);
  evidence.push(`Voice match: ${(delegation.makerOutput.voiceMatch * 100).toFixed(1)}%`);
  evidence.push(`Hook compat: ${(delegation.makerOutput.hookCompat * 100).toFixed(1)}%`);
  evidence.push(`Delegation time: ${delegation.delegationTime}ms`);
  evidence.push(`Reasoning: ${instruction.reasoning.substring(0, 120)}...`);

  const endTime = Date.now();
  const step: BeatStep = {
    step: 2,
    name: 'Delegate to Maker',
    description: 'Muse builds structured instruction from context and sends to Maker via Circle',
    status: 'complete',
    startTime,
    endTime,
    duration: endTime - startTime,
    evidence,
    data: {
      instructionId: instruction.instructionId,
      mode: delegation.mode,
      delegationTime: delegation.delegationTime,
      makerOutput: {
        title: delegation.makerOutput.title,
        hookCount: delegation.makerOutput.alternativeHooks.length + 1,
        voiceMatch: delegation.makerOutput.voiceMatch,
        hookCompat: delegation.makerOutput.hookCompat,
        source: delegation.makerOutput.source,
      },
      confidenceLevel: instruction.confidenceLevel,
      dataPointsUsed: instruction.dataPointsUsed,
    },
  };

  return { step, instruction, delegation };
}

// ---------------------------------------------------------------------------
// Step 3: Evaluate Maker Output
// ---------------------------------------------------------------------------

function runStep3_Evaluate(
  delegation: DelegationResult,
  context: DelegationContext
): { step: BeatStep; evaluation: EvaluationResult } {
  const startTime = Date.now();

  const evaluation = evaluateMakerOutput(
    delegation.makerOutput,
    context.voiceProfile,
    context.bestHookPatterns,
    context.recentWinners
  );

  const evidence: string[] = [];
  evidence.push(`Evaluation ID: ${evaluation.evaluationId}`);
  evidence.push(`Overall score: ${(evaluation.overallScore * 100).toFixed(1)}%`);
  evidence.push(`Voice match: ${(evaluation.voiceMatch.overall * 100).toFixed(1)}%`);
  evidence.push(`Hook compat: ${(evaluation.hookCompat.overall * 100).toFixed(1)}%`);
  evidence.push(`Content quality: ${(evaluation.contentQuality.overall * 100).toFixed(1)}%`);
  evidence.push(`Confidence: ${evaluation.confidenceLevel} (${evaluation.dataPointsUsed} data points)`);
  evidence.push(`Passed: ${evaluation.passed ? 'YES' : 'NO'} (threshold: ${(evaluation.passThreshold * 100).toFixed(0)}%)`);
  if (evaluation.failReasons.length > 0) {
    evidence.push(`Fail reasons: ${evaluation.failReasons.join(', ')}`);
  }
  // Add key sub-scores
  evidence.push(`Tone alignment: ${(evaluation.voiceMatch.toneAlignment * 100).toFixed(1)}%`);
  evidence.push(`Primary hook match: ${(evaluation.hookCompat.primaryHookPatternMatch * 100).toFixed(1)}%`);
  evidence.push(`Script structure: ${(evaluation.contentQuality.scriptStructure * 100).toFixed(1)}%`);

  const endTime = Date.now();
  const step: BeatStep = {
    step: 3,
    name: 'Evaluate Output',
    description: 'Muse evaluates Maker output against voice profile, hook patterns, and quality thresholds',
    status: evaluation.passed ? 'complete' : 'failed',
    startTime,
    endTime,
    duration: endTime - startTime,
    evidence,
    data: {
      evaluationId: evaluation.evaluationId,
      overallScore: evaluation.overallScore,
      voiceMatch: evaluation.voiceMatch.overall,
      hookCompat: evaluation.hookCompat.overall,
      contentQuality: evaluation.contentQuality.overall,
      passed: evaluation.passed,
      confidenceLevel: evaluation.confidenceLevel,
      failReasons: evaluation.failReasons,
    },
  };

  return { step, evaluation };
}

// ---------------------------------------------------------------------------
// Step 4: Store Draft
// ---------------------------------------------------------------------------

async function runStep4_StoreDraft(
  creatorId: string,
  evaluation: EvaluationResult,
  delegation: DelegationResult,
  context: DelegationContext
): Promise<{ step: BeatStep; draft: DraftCreationResult }> {
  const startTime = Date.now();

  const draft = await storeDraftFromEvaluation({
    creatorId,
    evaluation,
    makerOutput: delegation.makerOutput,
    topic: context.topic,
    objective: context.objective,
    instructionId: delegation.instruction.instructionId,
    mode: delegation.mode,
  });

  const evidence: string[] = [];
  if (draft.success) {
    evidence.push(`Draft stored: ${draft.draftId}`);
    evidence.push(`Version: ${draft.version}`);
    evidence.push(`Content item: ${draft.contentItemId}`);
    evidence.push(`Evaluation passed: YES`);
    evidence.push(`Audit event: ${draft.auditEventId}`);
  } else {
    evidence.push(`Draft NOT stored — evaluation did not pass`);
    evidence.push(`Audit event (rejection): ${draft.auditEventId}`);
  }

  const endTime = Date.now();
  const step: BeatStep = {
    step: 4,
    name: 'Store Draft',
    description: 'If evaluation passes, store Maker output as versioned Draft; otherwise log rejection',
    status: draft.success ? 'complete' : 'failed',
    startTime,
    endTime,
    duration: endTime - startTime,
    evidence,
    data: {
      draftId: draft.draftId || null,
      version: draft.version,
      contentItemId: draft.contentItemId || null,
      evaluationPassed: draft.evaluationPassed,
      auditEventId: draft.auditEventId,
    },
  };

  return { step, draft };
}

// ---------------------------------------------------------------------------
// Full Beat: Muse→Maker→Evaluate→Store
// ---------------------------------------------------------------------------

export async function runDelegationBeat(
  creatorId: string,
  topic?: string,
  objective?: string
): Promise<DelegationBeatResult> {
  const beatId = `beat_${Date.now()}`;
  const beatStart = Date.now();

  // Initialize result
  const result: DelegationBeatResult = {
    beatId,
    timestamp: new Date().toISOString(),
    creatorId,
    creatorName: '',
    mode: 'simulated',
    totalDuration: 0,
    steps: [],
    context: null,
    instruction: null,
    delegation: null,
    evaluation: null,
    draft: null,
    makerOutput: null,
    success: false,
    evaluationPassed: false,
    draftStored: false,
    auditSummary: {
      totalAuditEvents: 0,
      delegationAuditId: '',
      evaluationId: '',
      draftAuditId: '',
    },
  };

  try {
    // ── Step 1: Load Context ──
    const { step: step1, context } = await runStep1_LoadContext(creatorId, topic, objective);
    result.steps.push(step1);
    result.context = context;
    result.creatorName = context.creatorName;

    // ── Step 2: Delegate to Maker ──
    const { step: step2, instruction, delegation } = await runStep2_Delegate(context, creatorId);
    result.steps.push(step2);
    result.instruction = instruction;
    result.delegation = delegation;
    result.mode = delegation.mode;
    result.makerOutput = delegation.makerOutput;
    result.auditSummary.delegationAuditId = delegation.auditEventId;

    // ── Step 3: Evaluate Output ──
    const { step: step3, evaluation } = runStep3_Evaluate(delegation, context);
    result.steps.push(step3);
    result.evaluation = evaluation;
    result.evaluationPassed = evaluation.passed;
    result.auditSummary.evaluationId = evaluation.evaluationId;

    // ── Step 4: Store Draft ──
    const { step: step4, draft } = await runStep4_StoreDraft(creatorId, evaluation, delegation, context);
    result.steps.push(step4);
    result.draft = draft;
    result.draftStored = draft.success;
    result.auditSummary.draftAuditId = draft.auditEventId;

    // Count audit events
    const auditCount = await db.auditEvent.count({
      where: {
        creatorId,
        createdAt: { gte: new Date(beatStart) },
      },
    });
    result.auditSummary.totalAuditEvents = auditCount;

    // Overall success
    result.success = true;

  } catch (error) {
    // If any step fails, mark the beat as failed
    result.success = false;
    const lastStep = result.steps[result.steps.length - 1];
    if (lastStep) {
      lastStep.status = 'failed';
      lastStep.evidence.push(`Error: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  result.totalDuration = Date.now() - beatStart;

  // Store the beat itself as an audit event
  await db.auditEvent.create({
    data: {
      creatorId,
      actor: 'muse',
      action: 'delegation_beat',
      targetType: 'delegation_beat',
      targetId: beatId,
      delta: JSON.stringify({
        beatId,
        mode: result.mode,
        success: result.success,
        evaluationPassed: result.evaluationPassed,
        draftStored: result.draftStored,
        totalDuration: result.totalDuration,
        steps: result.steps.map((s) => ({
          step: s.step,
          name: s.name,
          duration: s.duration,
          status: s.status,
        })),
        scores: {
          voiceMatch: result.evaluation?.voiceMatch.overall ?? 0,
          hookCompat: result.evaluation?.hookCompat.overall ?? 0,
          contentQuality: result.evaluation?.contentQuality.overall ?? 0,
          overall: result.evaluation?.overallScore ?? 0,
        },
      }),
    },
  });

  return result;
}

// ---------------------------------------------------------------------------
// Convenience: Run beat with default creator
// ---------------------------------------------------------------------------

export async function runDelegationBeatDefault(
  topic?: string,
  objective?: string
): Promise<DelegationBeatResult> {
  const creatorId = await getDefaultCreatorId();
  return runDelegationBeat(creatorId, topic, objective);
}

// ---------------------------------------------------------------------------
// Get recent beats from audit log
// ---------------------------------------------------------------------------

export interface BeatHistoryEntry {
  beatId: string;
  timestamp: string;
  mode: string;
  success: boolean;
  evaluationPassed: boolean;
  draftStored: boolean;
  totalDuration: number;
  scores: {
    voiceMatch: number;
    hookCompat: number;
    contentQuality: number;
    overall: number;
  };
}

export async function getRecentBeats(creatorId: string, limit: number = 10): Promise<BeatHistoryEntry[]> {
  const beats = await db.auditEvent.findMany({
    where: {
      creatorId,
      action: 'delegation_beat',
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });

  return beats.map((beat) => {
    let delta: Record<string, unknown> = {};
    try {
      delta = JSON.parse(beat.delta);
    } catch {
      // skip
    }

    return {
      beatId: (delta.beatId as string) ?? beat.targetId,
      timestamp: beat.createdAt.toISOString(),
      mode: (delta.mode as string) ?? 'simulated',
      success: (delta.success as boolean) ?? false,
      evaluationPassed: (delta.evaluationPassed as boolean) ?? false,
      draftStored: (delta.draftStored as boolean) ?? false,
      totalDuration: (delta.totalDuration as number) ?? 0,
      scores: (delta.scores as BeatHistoryEntry['scores']) ?? {
        voiceMatch: 0,
        hookCompat: 0,
        contentQuality: 0,
        overall: 0,
      },
    };
  });
}
