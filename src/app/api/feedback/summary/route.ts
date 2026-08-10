// GET /api/feedback/summary — Get feedback summary for a creator
import { NextRequest, NextResponse } from 'next/server';
import { getFeedbackSummary } from '@/lib/creator-feedback-service';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const creatorId = url.searchParams.get('creatorId');

    let creator = creatorId
      ? await db.creator.findUnique({ where: { id: creatorId } })
      : null;

    if (!creator) {
      creator = await db.creator.findFirst();
    }

    if (!creator) {
      return NextResponse.json(
        { success: false, error: 'No creator found' },
        { status: 400 }
      );
    }

    const summary = await getFeedbackSummary(creator.id);

    return NextResponse.json({ success: true, summary, creatorId: creator.id });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
