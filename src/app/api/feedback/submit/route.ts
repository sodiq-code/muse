// POST /api/feedback/submit — Submit creator feedback on a recommendation/draft/insight
import { NextRequest, NextResponse } from 'next/server';
import { submitCreatorFeedback } from '@/lib/creator-feedback-service';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { creatorId, feedbackType, targetType, targetId, targetTitle, originalValue, correctedValue, reason, category, confidence, isSimulation } = body;

    if (!creatorId || !feedbackType || !targetType || !targetId || !originalValue) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: creatorId, feedbackType, targetType, targetId, originalValue' },
        { status: 400 }
      );
    }

    const result = await submitCreatorFeedback({
      creatorId,
      feedbackType,
      targetType,
      targetId,
      targetTitle,
      originalValue,
      correctedValue,
      reason,
      category,
      confidence,
      isSimulation: isSimulation ?? false,
    });

    return NextResponse.json({ success: true, result });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message ?? 'Failed to submit feedback' },
      { status: 500 }
    );
  }
}
