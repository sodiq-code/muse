import { NextRequest, NextResponse } from 'next/server';
import { bulkIngestContent, getIngestStatus, type IngestItem } from '@/lib/ingestion-pipeline';
import { seedCreator, seedPerformanceData, seedExtraContent, seedDecisions } from '@/lib/seed';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const creatorId = searchParams.get('creatorId') ?? (await seedCreator());
    await seedPerformanceData(creatorId);
    await seedExtraContent(creatorId);
    await seedDecisions(creatorId);

    const status = await getIngestStatus(creatorId);

    return NextResponse.json({
      success: true,
      ...status,
    });
  } catch (error) {
    console.error('Ingest status error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get ingest status' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { creatorId, items } = body as { creatorId?: string; items: IngestItem[] };

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'items array is required (at least 1 item)' },
        { status: 400 }
      );
    }

    const effectiveCreatorId = creatorId ?? (await seedCreator());

    const result = await bulkIngestContent(effectiveCreatorId, items);

    return NextResponse.json({
      success: true,
      totalItems: result.totalItems,
      totalHooks: result.totalHooks,
      totalMetrics: result.totalMetrics,
      durationMs: result.durationMs,
      errors: result.errors,
      results: result.results.map(r => ({
        itemId: r.itemId,
        title: r.title,
        hook: r.hook,
        metricsCount: r.metricsCount,
        engagementScore: r.engagementScore,
      })),
    }, { status: 201 });
  } catch (error) {
    console.error('Bulk ingest error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to ingest content' },
      { status: 500 }
    );
  }
}
