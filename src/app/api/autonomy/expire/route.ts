// ============================================================================
// API: /api/autonomy/expire
// POST: Expire stale pending approvals (older than threshold hours)
// Day 15: Approval gate refinement
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import {
  expireStaleApprovals,
  getDefaultCreatorId,
} from '@/lib/overnight-scheduler-service';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const maxAgeHours = body.maxAgeHours ?? 48;

    if (typeof maxAgeHours !== 'number' || maxAgeHours < 1) {
      return NextResponse.json(
        { success: false, error: 'maxAgeHours must be a positive number' },
        { status: 400 }
      );
    }

    const creatorId = await getDefaultCreatorId();
    const result = await expireStaleApprovals(creatorId, maxAgeHours);

    return NextResponse.json({
      success: true,
      result,
      message: result.expired > 0
        ? `Expired ${result.expired} stale approval(s) older than ${maxAgeHours}h`
        : `No stale approvals found (threshold: ${maxAgeHours}h)`,
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
