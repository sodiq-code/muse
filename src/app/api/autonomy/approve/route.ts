// ============================================================================
// API: /api/autonomy/approve
// POST: Approve a pending action (approval gate)
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import {
  approveAction,
  getDefaultCreatorId,
} from '@/lib/overnight-scheduler-service';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { approvalId } = body;

    if (!approvalId || typeof approvalId !== 'string') {
      return NextResponse.json(
        { success: false, error: 'approvalId is required' },
        { status: 400 }
      );
    }

    const creatorId = await getDefaultCreatorId();
    const result = await approveAction(approvalId, creatorId);

    return NextResponse.json({
      success: true,
      result,
      message: `Action approved: ${result.itemType} ${result.action}`,
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
