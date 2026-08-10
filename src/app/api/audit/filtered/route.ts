// ============================================================================
// API: /api/audit/filtered
// GET: Get filtered audit trail with pagination and search
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

    const filters: AuditFilterOptions = {
      actor: searchParams.get('actor') ?? undefined,
      action: searchParams.get('action') ?? undefined,
      targetType: searchParams.get('targetType') ?? undefined,
      since: searchParams.get('since') ?? undefined,
      until: searchParams.get('until') ?? undefined,
      search: searchParams.get('search') ?? undefined,
      limit: parseInt(searchParams.get('limit') ?? '50', 10),
      offset: parseInt(searchParams.get('offset') ?? '0', 10),
    };

    const result = await getFilteredAuditTrail(creatorId, filters);

    return NextResponse.json({
      ...result,
      success: true,
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
