// ============================================================================
// API Route: /api/dashboard/today
// Day 12 — Today Screen Data
//
// GET: Returns Today screen data for the default creator (Jules)
// Powers Screen 1: Today (Home + Morning Brief)
// ============================================================================

import { NextResponse } from 'next/server';
import { getTodayScreenData, getDefaultCreatorId } from '@/lib/today-screen-service';

function getFallbackTodayData() {
  return {
    greeting: { text: 'Good morning, Jules.', timeOfDay: 'morning' },
    creatorName: 'Jules',
    overnightBrief: {
      items: [
        'Reviewed 3 new audience signals',
        'Drafted 1 content suggestion',
        'Updated hook performance data',
      ],
      reviewedCount: 3,
      draftedCount: 1,
      updatedCount: 2,
      source: 'AuditEvent · 50 events in last 12h',
    },
    topSignals: [
      {
        label: 'Top Hook',
        value: 'Contrarian · 72% avg retention',
        source: 'HookPattern · 8 samples',
        evidence:
          'Based on 8 posts, contrarian pattern averages 72% retention vs 61% baseline',
      },
      {
        label: 'Engage Uplift',
        value: 'Up 11% vs baseline',
        source: 'HookPattern comparison · medium confidence',
        evidence: 'Contrarian hooks outperform question hooks by 11pp',
      },
    ],
    newData: { label: '3 new posts analyzed', value: '3', source: 'ContentItem · 28 total' },
    tryNext: {
      label: 'Try contrarian hook',
      description:
        'Contrarian hooks show 72% avg effectiveness across 8 samples',
      hookPattern: 'contrarian_claim',
      confidence: 'medium',
      evidence:
        'Based on 8 posts, contrarian pattern averages 72% retention',
    },
    pendingApprovals: [
      {
        draftId: 'fallback-1',
        title: 'Most AI agents aren\'t really agents',
        hookType: 'contrarian_claim',
        source: 'Muse · Maker · v1',
        evidenceCount: 8,
        avgScore: 91,
        createdAt: '2026-08-09T06:00:00Z',
      },
    ],
    isSimulation: true,
    source: 'prerecorded',
  };
}

export async function GET() {
  try {
    const creatorId = await getDefaultCreatorId();
    const data = await getTodayScreenData(creatorId);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    // Database unavailable — return pre-recorded fallback data
    console.warn('[api/dashboard/today] Database unavailable, returning fallback data');
    return NextResponse.json({ success: true, data: getFallbackTodayData(), fallback: true });
  }
}
