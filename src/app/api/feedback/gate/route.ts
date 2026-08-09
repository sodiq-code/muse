// GET /api/feedback/gate — Check Real Creator Gate (Day 17 checkpoint)
import { NextRequest, NextResponse } from 'next/server';
import { checkRealCreatorGate } from '@/lib/disclosed-simulation-service';
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

    const gateResult = await checkRealCreatorGate(creator.id);

    return NextResponse.json({ success: true, gate: gateResult, creatorId: creator.id });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
