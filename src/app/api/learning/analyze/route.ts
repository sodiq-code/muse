import { NextRequest, NextResponse } from 'next/server';
import {
  runLearningLoop,
  emptyCreatorMemory,
  type ContentMetricInput,
  type CreatorMemory,
} from '@/lib/learning-engine';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Accept metrics and optional memory from request
    const metrics: ContentMetricInput[] = body.metrics ?? [];
    const memory: CreatorMemory = body.memory ?? emptyCreatorMemory(body.creatorId ?? 'default');

    // Run the 5-step learning loop
    const result = runLearningLoop(metrics, memory);

    return NextResponse.json({
      success: true,
      result,
      metadata: {
        processedAt: new Date().toISOString(),
        inputMetrics: metrics.length,
        memoryPosts: memory.totalPosts,
        totalDataPoints: result.totalDataPoints,
        confidence: result.confidence,
        recommendationsCount: result.recommendations.length,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
