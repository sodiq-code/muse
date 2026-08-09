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
    theatreStatus: 'complete',
    timeline: [
      { time: '22:00', actor: 'muse', action: 'Creator went offline' },
      { time: '22:04', actor: 'muse', action: 'Analysed audience signals' },
      { time: '22:17', actor: 'muse', action: 'Found 3 opportunities' },
      { time: '22:24', actor: 'muse', action: 'Retrieved winning hook patterns' },
      { time: '22:31', actor: 'muse', action: 'Delegated draft to Maker' },
      { time: '22:42', actor: 'maker', action: 'Created draft' },
      { time: '22:45', actor: 'muse', action: 'Evaluated draft: Voice 94%, Hook 91%' },
      { time: '23:02', actor: 'muse', action: 'Updated content plan' },
      { time: '06:00', actor: 'muse', action: 'Morning brief prepared' },
    ],
    overnightOutput: {
      draftTitle: 'Most AI agents aren\'t really agents',
      voiceMatch: 0.94,
      hookCompat: 0.91,
      evaluationPassed: true,
      evidence: '8 posts with contrarian pattern, 72% avg retention',
    },
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
