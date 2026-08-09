// ============================================================================
// API: /api/autonomy/status
// GET:  Get the current autonomy status (DB-backed)
// POST: Run the full overnight cycle (same as /api/autonomy/run-overnight)
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import {
  getOvernightSchedule,
  getApprovalQueue,
  runOvernightCycle,
  getDefaultCreatorId,
  type OvernightScheduleInfo,
  type ApprovalQueueItem,
} from '@/lib/overnight-scheduler-service';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const creatorId = await getDefaultCreatorId();

    // Get DB-backed schedule info
    const scheduleInfo = await getOvernightSchedule(creatorId);

    // Get pending approval queue
    const approvalQueue = await getApprovalQueue(creatorId);

    // Get recent audit events for overnight-related actions
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentAuditEvents = await (await import('@/lib/db')).db.auditEvent.findMany({
      where: {
        creatorId,
        createdAt: { gte: twentyFourHoursAgo },
        actor: { in: ['muse', 'maker'] },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return NextResponse.json({
      success: true,
      status: {
        phase: scheduleInfo.isRunning ? 'running' : (scheduleInfo.lastRun ? 'idle' : 'sleeping'),
        schedule: scheduleInfo.schedule,
        equipped: true,
        lastAction: scheduleInfo.lastRun
          ? `Last run: ${scheduleInfo.lastRun.status} at ${scheduleInfo.lastRun.startedAt}`
          : null,
        pendingApprovals: scheduleInfo.pendingApprovals,
        isRunning: scheduleInfo.isRunning,
        totalRuns: scheduleInfo.totalRuns,
        approvalQueue,
      },
      scheduleInfo,
      recentAuditEvents: recentAuditEvents.map((e) => ({
        id: e.id,
        actor: e.actor,
        action: e.action,
        targetType: e.targetType,
        targetId: e.targetId,
        createdAt: e.createdAt.toISOString(),
      })),
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
