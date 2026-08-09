// ============================================================================
// API: /api/audit/stats
// GET: Get audit statistics — aggregated counts for dashboard display
// Day 15: Audit logging polish
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import {
  getAuditStats,
  getDefaultCreatorId,
} from '@/lib/overnight-scheduler-service';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const creatorId = await getDefaultCreatorId();
    const stats = await getAuditStats(creatorId);

    return NextResponse.json({
      success: true,
      stats,
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
