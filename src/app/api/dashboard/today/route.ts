// ============================================================================
// API Route: /api/dashboard/today
// Day 12 — Today Screen Data
//
// GET: Returns Today screen data for the default creator (Jules)
// Powers Screen 1: Today (Home + Morning Brief)
// ============================================================================

import { NextResponse } from 'next/server';
import { getTodayScreenData, getDefaultCreatorId } from '@/lib/today-screen-service';

export async function GET() {
  try {
    const creatorId = await getDefaultCreatorId();
    const data = await getTodayScreenData(creatorId);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('[api/dashboard/today] Error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
