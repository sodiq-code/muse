import { NextRequest, NextResponse } from 'next/server';
import {
  createContentItem,
  listContentItems,
  getPerformanceSummary,
} from '@/lib/performance-service';
import { seedCreator, seedPerformanceData } from '@/lib/seed';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const creatorId = searchParams.get('creatorId') ?? (await seedCreator());

    // Auto-seed performance data if not already seeded
    await seedPerformanceData(creatorId);

    const type = searchParams.get('type') ?? undefined;
    const status = searchParams.get('status') ?? undefined;

    const [items, summary] = await Promise.all([
      listContentItems(creatorId, { type, status, limit: 50, offset: 0 }),
      getPerformanceSummary(creatorId),
    ]);

    return NextResponse.json({
      success: true,
      items: items.map((item) => ({
        id: item.id,
        title: item.title,
        type: item.type,
        status: item.status,
        hookPattern: item.hooks.length > 0 && item.hooks[0].patterns.length > 0
          ? item.hooks[0].patterns[0].patternName
          : (item.hooks.length > 0 ? item.hooks[0].hookType : null),
        hookText: item.hooks.length > 0 ? item.hooks[0].text : null,
        hookEffectiveness: item.hooks.length > 0 ? item.hooks[0].effectiveness : null,
        metricsCount: item.metrics.length,
        publishedAt: item.publishedAt?.toISOString() ?? null,
        createdAt: item.createdAt.toISOString(),
      })),
      summary: {
        totalItems: summary.totalItems,
        totalMetrics: summary.totalMetrics,
        totalHooks: summary.hookStats.totalHooks,
        bestPattern: summary.hookStats.bestPattern,
        worstPattern: summary.hookStats.worstPattern,
        byType: summary.byType,
        byStatus: summary.byStatus,
      },
      count: items.length,
    });
  } catch (error) {
    console.error('Content list error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to list content items' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, type, hookText } = body;

    if (!title || !type) {
      return NextResponse.json(
        { success: false, error: 'title and type are required' },
        { status: 400 }
      );
    }

    const creatorId = await seedCreator();

    // Create the content item
    const item = await createContentItem({
      creatorId,
      type,
      title,
      status: 'idea',
    });

    // If hook text provided, auto-create and classify
    let hookResult = null;
    if (hookText) {
      const { createHook } = await import('@/lib/performance-service');
      hookResult = await createHook({
        contentItemId: item.id,
        text: hookText,
        hookType: 'opening',
      });
    }

    return NextResponse.json({
      success: true,
      item: {
        id: item.id,
        type: item.type,
        title: item.title,
        status: item.status,
        createdAt: item.createdAt,
      },
      hook: hookResult
        ? {
            text: hookResult.hook.text,
            pattern: hookResult.classification.pattern,
            confidence: hookResult.classification.confidence,
            reasoning: hookResult.classification.reasoning,
          }
        : null,
    }, { status: 201 });
  } catch (error) {
    console.error('Content create error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create content item' },
      { status: 500 }
    );
  }
}
