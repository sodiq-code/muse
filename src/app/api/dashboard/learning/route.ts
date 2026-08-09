// ============================================================================
// API Route: /api/dashboard/learning
// Day 13 — Learning Screen Data
//
// GET: Returns Learning screen data for the default creator (Jules)
// Powers Screen 3: LEARNING (timeline + insights) — "MOST IMPORTANT" per blueprint
// ============================================================================

import { NextResponse } from 'next/server';
import { getLearningScreenData, getDefaultCreatorId } from '@/lib/learning-screen-service';

export async function GET() {
  try {
    const creatorId = await getDefaultCreatorId();
    const data = await getLearningScreenData(creatorId);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('[api/dashboard/learning] Error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
