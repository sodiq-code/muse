// ============================================================================
// API: /api/autonomy/approval-history
// GET: Get approval history (all statuses, not just pending)
// Day 15: Approval gate refinement
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import {
  getApprovalHistory,
  getDefaultCreatorId,
} from '@/lib/overnight-scheduler-service';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const creatorId = await getDefaultCreatorId();
    const searchParams = request.nextUrl.searchParams;

    const limit = parseInt(searchParams.get('limit') ?? '50', 10);
    const status = searchParams.get('status') ?? undefined;

    const history = await getApprovalHistory(creatorId, { limit, status });

    return NextResponse.json({
      success: true,
      history,
      count: history.length,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
