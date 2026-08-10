// ============================================================================
// API: /api/autonomy/reject
// POST: Reject a pending action (approval gate)
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import {
  rejectAction,
  getDefaultCreatorId,
} from '@/lib/overnight-scheduler-service';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { approvalId, reason } = body;

    if (!approvalId || typeof approvalId !== 'string') {
      return NextResponse.json(
        { success: false, error: 'approvalId is required' },
        { status: 400 }
      );
    }

    const creatorId = await getDefaultCreatorId();
    const result = await rejectAction(approvalId, creatorId, reason);

    return NextResponse.json({
      success: true,
      result,
      message: `Action rejected: ${result.itemType} ${result.action}`,
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
