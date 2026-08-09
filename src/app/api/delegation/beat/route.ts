import { NextRequest, NextResponse } from 'next/server';
import {
  runDelegationBeatDefault,
  getRecentBeats,
  type DelegationBeatResult,
} from '@/lib/delegation-beat-service';
import { getDefaultCreatorId } from '@/lib/delegation-service';

export const dynamic = 'force-dynamic';

/**
 * GET /api/delegation/beat
 * Get recent delegation beat history
 */
export async function GET() {
  try {
    const creatorId = await getDefaultCreatorId();
    const history = await getRecentBeats(creatorId, 10);

    return NextResponse.json({
      success: true,
      history,
      count: history.length,
    });
  } catch (error) {
    console.error('Beat history error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to get beat history' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/delegation/beat
 * Run the full delegation beat: Muse→Maker→Evaluate→Store
 *
 * Body: { topic?: string, objective?: string }
 *
 * Returns step-by-step results with timing, evidence, and scores.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { topic, objective } = body as { topic?: string; objective?: string };

    const result: DelegationBeatResult = await runDelegationBeatDefault(topic, objective);

    return NextResponse.json({
      success: true,
      beat: result,
    });
  } catch (error) {
    console.error('Delegation beat error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to run delegation beat' },
      { status: 500 }
    );
  }
}
