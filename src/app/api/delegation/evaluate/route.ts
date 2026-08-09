import { NextRequest, NextResponse } from 'next/server';
import {
  runDelegation,
  loadDelegationContext,
  buildStructuredInstruction,
  executeDelegation,
  getDefaultCreatorId,
  type DelegationContext,
} from '@/lib/delegation-service';
import {
  evaluateMakerOutput,
  getEvaluationThresholds,
  type EvaluationResult,
} from '@/lib/evaluation-service';
import { storeDraftFromEvaluation, type DraftCreationResult } from '@/lib/draft-pipeline';

export const dynamic = 'force-dynamic';

/**
 * GET /api/delegation/evaluate
 * Get evaluation thresholds and criteria
 */
export async function GET() {
  try {
    const thresholds = getEvaluationThresholds();

    // Also return current creator context for preview
    const creatorId = await getDefaultCreatorId();
    const context = await loadDelegationContext(creatorId);

    return NextResponse.json({
      success: true,
      thresholds,
      creatorContext: {
        name: context.creatorName,
        platform: context.platform,
        voiceProfile: context.voiceProfile,
        hookPatternsCount: context.bestHookPatterns.length,
        historicalWinnersCount: context.recentWinners.length,
        performanceSignalsCount: context.performanceSignals.length,
      },
    });
  } catch (error) {
    console.error('Evaluation threshold error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to get evaluation thresholds' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/delegation/evaluate
 * Full pipeline: delegate → evaluate → (optionally) store as draft
 *
 * Body: {
 *   topic?: string,
 *   objective?: string,
 *   storeDraft?: boolean (default: true — store draft if evaluation passes)
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { topic, objective, storeDraft = true } = body as {
      topic?: string;
      objective?: string;
      storeDraft?: boolean;
    };

    const creatorId = await getDefaultCreatorId();

    // Step 1: Run delegation (Muse→Maker)
    const delegationResult = await runDelegation(creatorId, topic, objective);

    // Step 2: Load context for evaluation
    const context = await loadDelegationContext(creatorId, topic, objective);

    // Step 3: Evaluate Maker output
    const evaluation: EvaluationResult = evaluateMakerOutput(
      delegationResult.makerOutput,
      context.voiceProfile,
      context.bestHookPatterns,
      context.recentWinners
    );

    // Step 4: Store draft if evaluation passes (and storeDraft is true)
    let draftResult: DraftCreationResult | null = null;
    if (storeDraft && evaluation.passed) {
      draftResult = await storeDraftFromEvaluation({
        creatorId,
        evaluation,
        makerOutput: delegationResult.makerOutput,
        topic: context.topic,
        objective: context.objective,
        instructionId: delegationResult.instruction.instructionId,
        mode: delegationResult.mode,
      });
    } else if (!evaluation.passed) {
      // Store the rejection audit event even if not storing draft
      draftResult = await storeDraftFromEvaluation({
        creatorId,
        evaluation,
        makerOutput: delegationResult.makerOutput,
        topic: context.topic,
        objective: context.objective,
        instructionId: delegationResult.instruction.instructionId,
        mode: delegationResult.mode,
      });
    }

    return NextResponse.json({
      success: true,
      // Delegation info
      delegation: {
        instructionId: delegationResult.instruction.instructionId,
        mode: delegationResult.mode,
        delegationTime: delegationResult.delegationTime,
        topic: context.topic,
        objective: context.objective,
      },
      // Evaluation result
      evaluation,
      // Draft result (if stored)
      draft: draftResult ? {
        stored: draftResult.success,
        draftId: draftResult.draftId,
        version: draftResult.version,
        contentItemId: draftResult.contentItemId,
      } : null,
      // Maker output summary
      makerOutput: {
        title: delegationResult.makerOutput.title,
        voiceMatch: delegationResult.makerOutput.voiceMatch,
        hookCompat: delegationResult.makerOutput.hookCompat,
        source: delegationResult.makerOutput.source,
        hookCount: delegationResult.makerOutput.alternativeHooks.length + 1,
      },
    });
  } catch (error) {
    console.error('Evaluation pipeline error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to run evaluation pipeline' },
      { status: 500 }
    );
  }
}
