import { NextRequest, NextResponse } from 'next/server';
import { ingestMetrics } from '@/lib/performance-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { contentId, contentItemId, views, likes, shares, comments } = body;

    const effectiveContentItemId = contentItemId ?? contentId;

    if (!effectiveContentItemId) {
      return NextResponse.json(
        { success: false, error: 'contentId (or contentItemId) is required' },
        { status: 400 }
      );
    }

    // Build metrics array from flat input
    const metrics: { metricKey: string; metricValue: number }[] = [];
    if (typeof views === 'number') metrics.push({ metricKey: 'views', metricValue: views });
    if (typeof likes === 'number') metrics.push({ metricKey: 'likes', metricValue: likes });
    if (typeof shares === 'number') metrics.push({ metricKey: 'shares', metricValue: shares });
    if (typeof comments === 'number') metrics.push({ metricKey: 'comments', metricValue: comments });

    // Also support raw metrics array
    if (body.metrics && Array.isArray(body.metrics)) {
      for (const m of body.metrics) {
        if (m.metricKey && typeof m.metricValue === 'number') {
          metrics.push(m);
        }
      }
    }

    if (metrics.length === 0) {
      return NextResponse.json(
        { success: false, error: 'At least 1 metric is required (views, likes, shares, comments, or metrics array)' },
        { status: 400 }
      );
    }

    const result = await ingestMetrics({ contentItemId: effectiveContentItemId, metrics });

    return NextResponse.json({
      success: true,
      message: `${result.count} metrics ingested`,
      engagementScore: result.engagementScore,
    }, { status: 201 });
  } catch (error) {
    console.error('Metrics ingestion error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to ingest metrics' },
      { status: 500 }
    );
  }
}
