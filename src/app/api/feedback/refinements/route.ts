// GET /api/feedback/refinements — Get refinement timeline (feedback → memory → improvement chain)
import { NextRequest, NextResponse } from 'next/server';
import { getRefinementTimeline } from '@/lib/creator-feedback-service';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const creatorId = url.searchParams.get('creatorId');
    const limit = parseInt(url.searchParams.get('limit') ?? '30', 10);

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

    const timeline = await getRefinementTimeline(creator.id, limit);

    return NextResponse.json({ success: true, timeline, creatorId: creator.id });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
