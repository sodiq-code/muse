// ============================================================================
// API: /api/autonomy/run-overnight
// POST: Run the full overnight cycle (DB-backed)
// GET:  Get the current overnight schedule info
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import {
  runOvernightCycle,
  getDefaultCreatorId,
  getOvernightSchedule,
} from '@/lib/overnight-scheduler-service';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const creatorId = body.creatorId ?? (await getDefaultCreatorId());

    const result = await runOvernightCycle(creatorId);

    return NextResponse.json({
      success: true,
      result,
      message: result.success
        ? 'Overnight cycle completed — draft awaiting approval'
        : 'Overnight cycle completed with errors',
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

export async function GET() {
  try {
    const creatorId = await getDefaultCreatorId();
    const scheduleInfo = await getOvernightSchedule(creatorId);

    return NextResponse.json({
      success: true,
      schedule: scheduleInfo,
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
