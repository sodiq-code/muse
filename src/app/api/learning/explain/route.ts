import { NextRequest, NextResponse } from 'next/server';
import {
  buildExplanationForRecommendation,
  buildAllExplanationsForCreator,
} from '@/lib/explanation-service';
import { getDefaultCreatorId } from '@/lib/learning-engine-service';

export const dynamic = 'force-dynamic';

/**
 * GET /api/learning/explain?recommendationId=xxx
 * GET /api/learning/explain (all recommendations for default creator)
 *
 * Returns full "Why Muse chose this" explanation with evidence chain
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const recommendationId = searchParams.get('recommendationId');

    if (recommendationId) {
      // Build explanation for a specific recommendation
      const explanation = await buildExplanationForRecommendation(recommendationId);
      return NextResponse.json({
        success: true,
        explanation,
      });
    }

    // Build explanations for all pending recommendations
    const creatorId = await getDefaultCreatorId();
    const explanations = await buildAllExplanationsForCreator(creatorId);

    return NextResponse.json({
      success: true,
      count: explanations.length,
      explanations,
    });
  } catch (error) {
    console.error('Explanation API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to build explanation',
      },
      { status: 500 }
    );
  }
}
