import { NextRequest, NextResponse } from 'next/server';
import {
  runDelegation,
  loadDelegationContext,
  buildStructuredInstruction,
  getDefaultCreatorId,
  type DelegationResult,
  type DelegationContext,
  type StructuredInstruction,
} from '@/lib/delegation-service';

export const dynamic = 'force-dynamic';

/**
 * GET /api/delegation/send
 * Preview the delegation context and structured instruction without executing
 */
export async function GET() {
  try {
    const creatorId = await getDefaultCreatorId();
    const context = await loadDelegationContext(creatorId);
    const instruction = buildStructuredInstruction(context);

    return NextResponse.json({
      success: true,
      preview: true,
      context: {
        creatorName: context.creatorName,
        platform: context.platform,
        niche: context.niche,
        audience: context.audience,
        voiceProfile: context.voiceProfile,
        bestHookPatterns: context.bestHookPatterns,
        recentWinners: context.recentWinners,
        performanceSignals: context.performanceSignals,
        topic: context.topic,
        objective: context.objective,
      },
      instruction,
    });
  } catch (error) {
    console.error('Delegation preview error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to preview delegation' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/delegation/send
 * Execute the full Muse→Maker delegation
 * Body: { topic?: string, objective?: string }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { topic, objective } = body as { topic?: string; objective?: string };

    const creatorId = await getDefaultCreatorId();
    const result: DelegationResult = await runDelegation(creatorId, topic, objective);

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error('Delegation error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to execute delegation' },
      { status: 500 }
    );
  }
}
