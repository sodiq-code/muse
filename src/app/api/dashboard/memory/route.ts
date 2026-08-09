// ============================================================================
// API Route: /api/dashboard/memory
// Day 12 — Memory Screen Data
//
// GET: Returns Memory screen data for the default creator (Jules)
// Powers Screen 2: Memory (4 Domains + Voice Radar)
// ============================================================================

import { NextResponse } from 'next/server';
import { getMemoryScreenData, getDefaultCreatorId } from '@/lib/memory-screen-service';

export async function GET() {
  try {
    const creatorId = await getDefaultCreatorId();
    const data = await getMemoryScreenData(creatorId);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('[api/dashboard/memory] Error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
