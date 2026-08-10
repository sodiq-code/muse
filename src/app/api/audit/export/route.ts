// ============================================================================
// API: /api/audit/export
// GET: Export audit trail as CSV or JSON for download
// Day 15: Audit logging polish
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import {
  getFilteredAuditTrail,
  getDefaultCreatorId,
  type AuditFilterOptions,
} from '@/lib/overnight-scheduler-service';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const creatorId = await getDefaultCreatorId();
    const searchParams = request.nextUrl.searchParams;

    // Parse filter options from query params
    const filters: AuditFilterOptions = {
      actor: searchParams.get('actor') ?? undefined,
      action: searchParams.get('action') ?? undefined,
      targetType: searchParams.get('targetType') ?? undefined,
      since: searchParams.get('since') ?? undefined,
      until: searchParams.get('until') ?? undefined,
      search: searchParams.get('search') ?? undefined,
      limit: parseInt(searchParams.get('limit') ?? '1000', 10),
    };

    const format = searchParams.get('format') ?? 'json';
    const { events } = await getFilteredAuditTrail(creatorId, filters);

    if (format === 'csv') {
      // Generate CSV
      const headers = ['id', 'actor', 'action', 'targetType', 'targetId', 'delta', 'createdAt'];
      const rows = events.map((e) => [
        e.id,
        e.actor,
        e.action,
        e.targetType,
        e.targetId ?? '',
        `"${(e.delta ?? '').replace(/"/g, '""')}"`,
        e.createdAt,
      ]);

      const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="audit-export-${new Date().toISOString().split('T')[0]}.csv"`,
        },
      });
    }

    // Default: JSON
    return NextResponse.json({
      success: true,
      exportDate: new Date().toISOString(),
      count: events.length,
      events,
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
