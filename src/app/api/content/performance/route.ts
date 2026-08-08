import { NextRequest, NextResponse } from 'next/server';
import { getPerformanceSummary, getPerformanceInsights } from '@/lib/performance-service';
import { seedCreator, seedPerformanceData } from '@/lib/seed';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const creatorId = searchParams.get('creatorId') ?? (await seedCreator());

    // Auto-seed performance data if not already seeded
    await seedPerformanceData(creatorId);

    const [summary, insights] = await Promise.all([
      getPerformanceSummary(creatorId),
      getPerformanceInsights(creatorId),
    ]);

    // Build hookPatterns array from summary
    const hookPatterns = Object.entries(summary.hookStats.byPattern).map(
      ([pattern, data]) => ({
        pattern,
        count: data.count,
        avgEffectiveness: data.avgEffectiveness,
        sampleSize: data.totalSampleSize,
      })
    );

    // Sort by avgEffectiveness descending
    hookPatterns.sort((a, b) => b.avgEffectiveness - a.avgEffectiveness);

    return NextResponse.json({
      success: true,
      hookPatterns,
      insights: insights.map((i) => ({
        title: i.title,
        detail: i.detail,
        confidence: i.confidence,
        dataPoints: i.dataPoints,
        evidenceType: i.evidenceType,
      })),
      bestPattern: summary.hookStats.bestPattern,
      worstPattern: summary.hookStats.worstPattern,
    });
  } catch (error) {
    console.error('Performance summary error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get performance summary' },
      { status: 500 }
    );
  }
}
