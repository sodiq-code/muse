// ============================================================================
// API Route: /api/dashboard/overnight
// Day 13 — Overnight Screen Data
//
// GET: Returns Overnight screen data for the default creator (Jules)
// Powers Screen 4: OVERNIGHT (Mind Theatre)
// ============================================================================

import { NextResponse } from 'next/server';
import { getOvernightScreenData, getDefaultCreatorId } from '@/lib/overnight-screen-service';

export async function GET() {
  try {
    const creatorId = await getDefaultCreatorId();
    const data = await getOvernightScreenData(creatorId);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('[api/dashboard/overnight] Error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
