// ============================================================================
// API Route: /api/dashboard/control
// Day 13 — Control Screen Data
//
// GET: Returns Control screen data for the default creator (Jules)
// Powers Screen 5: CREATOR CONTROL (autonomy settings + approval queue + audit log)
// ============================================================================

import { NextResponse } from 'next/server';
import { getControlScreenData, getDefaultCreatorId } from '@/lib/control-screen-service';

export async function GET() {
  try {
    const creatorId = await getDefaultCreatorId();
    const data = await getControlScreenData(creatorId);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('[api/dashboard/control] Error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
