// ============================================================================
// API Route: /api/dashboard/overnight
// Day 13 — Overnight Screen Data
//
// GET: Returns Overnight screen data for the default creator (Jules)
// Powers Screen 4: OVERNIGHT (Mind Theatre)
// ============================================================================

import { NextResponse } from 'next/server';
import { getOvernightScreenData, getDefaultCreatorId } from '@/lib/overnight-screen-service';

function getFallbackOvernightData() {
  return {
    creatorName: 'Jules',
    schedule: {
      wakeTime: '22:00',
      draftTime: '23:30',
      briefTime: '06:00',
    },
    theatreStatus: 'complete',
    mindTheatre: [
      { time: '22:00', actor: 'creator', action: 'Creator went offline', phase: 'sleeping' },
      { time: '22:04', actor: 'muse', action: 'Reviewing signals...', phase: 'reviewing_signals' },
      { time: '22:17', actor: 'muse', action: 'Checking performance...', phase: 'reviewing_signals' },
      { time: '22:24', actor: 'muse', action: 'Delegating to Maker...', phase: 'delegating' },
      { time: '22:42', actor: 'maker', action: 'Creating draft...', phase: 'drafting' },
      { time: '22:45', actor: 'muse', action: 'Evaluating output...', phase: 'draft_complete' },
      { time: '23:02', actor: 'muse', action: 'Storing candidate', phase: 'waiting_approval' },
      { time: '06:00', actor: 'muse', action: 'Morning brief ready', phase: 'brief_ready' },
    ],
    overnightOutput: {
      draftTitle: 'Most AI agents aren\'t really agents',
      draftId: 'fallback-draft-1',
      voiceMatch: 94,
      hookCompat: 91,
      contentQuality: 88,
      overallScore: 91,
      evaluationPassed: true,
      hookPattern: 'Contrarian Claim',
      createdAt: '2026-08-09T06:00:00Z',
    },
    lastRunTime: '2026-08-09T06:00:00Z',
    isSimulation: true,
    source: 'prerecorded',
  };
}

export async function GET() {
  try {
    const creatorId = await getDefaultCreatorId();
    const data = await getOvernightScreenData(creatorId);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    // Database unavailable — return pre-recorded fallback data
    console.warn('[api/dashboard/overnight] Database unavailable, returning fallback data');
    return NextResponse.json({ success: true, data: getFallbackOvernightData(), fallback: true });
  }
}
