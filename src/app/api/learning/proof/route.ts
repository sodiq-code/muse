import { NextResponse } from 'next/server';
import { runProofExperiment } from '@/lib/proof-experiment';
import { getDefaultCreatorId } from '@/lib/learning-engine-service';

export const dynamic = 'force-dynamic';

/**
 * GET /api/learning/proof
 * Runs the 7-day proof experiment on real creator content
 * Returns ≥3 genuine insights with full evidence chains
 */
export async function GET() {
  try {
    const creatorId = await getDefaultCreatorId();
    const result = await runProofExperiment(creatorId);

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error('Proof experiment error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to run proof experiment',
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/learning/proof
 * Triggers a new 7-day proof experiment run
 */
export async function POST() {
  try {
    const creatorId = await getDefaultCreatorId();
    const result = await runProofExperiment(creatorId);

    // Store the experiment results as audit event
    const { db } = await import('@/lib/db');
    await db.auditEvent.create({
      data: {
        creatorId,
        actor: 'muse',
        action: 'learn',
        targetType: 'proof_experiment',
        targetId: result.experimentId,
        delta: JSON.stringify({
          totalGenuineInsights: result.totalGenuineInsights,
          meetsThreshold: result.meetsThreshold,
          daysSimulated: result.totalDays,
          honestyReport: result.honestyReport,
        }),
      },
    });

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error('Proof experiment error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to run proof experiment',
      },
      { status: 500 }
    );
  }
}
