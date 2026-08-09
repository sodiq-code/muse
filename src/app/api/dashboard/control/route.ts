// ============================================================================
// API Route: /api/dashboard/control
// Day 13 — Control Screen Data
//
// GET: Returns Control screen data for the default creator (Jules)
// Powers Screen 5: CREATOR CONTROL (autonomy settings + approval queue + audit log)
// ============================================================================

import { NextResponse } from 'next/server';
import { getControlScreenData, getDefaultCreatorId } from '@/lib/control-screen-service';

function getFallbackControlData() {
  return {
    autonomySettings: {
      overnightAnalysis: true,
      draftCreation: true,
      autoPublish: false,
      communityMonitoring: true,
    },
    pendingApprovals: [
      {
        id: 'ca1',
        action: 'publish',
        description: 'Most AI agents aren\'t really agents',
        source: 'mind_muse',
        status: 'pending',
        createdAt: '2026-08-09T06:00:00Z',
      },
    ],
    auditLog: [
      { id: 'al1', actor: 'muse', action: 'review', target: 'audience signals', timestamp: '2026-08-09T22:04:00Z' },
      { id: 'al2', actor: 'muse', action: 'delegate', target: 'maker', timestamp: '2026-08-09T22:31:00Z' },
      { id: 'al3', actor: 'maker', action: 'create', target: 'draft', timestamp: '2026-08-09T22:42:00Z' },
      { id: 'al4', actor: 'muse', action: 'evaluate', target: 'draft', timestamp: '2026-08-09T22:45:00Z' },
      { id: 'al5', actor: 'muse', action: 'update', target: 'content plan', timestamp: '2026-08-09T23:02:00Z' },
    ],
    isSimulation: true,
    source: 'prerecorded',
  };
}

export async function GET() {
  try {
    const creatorId = await getDefaultCreatorId();
    const data = await getControlScreenData(creatorId);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    // Database unavailable — return pre-recorded fallback data
    console.warn('[api/dashboard/control] Database unavailable, returning fallback data');
    return NextResponse.json({ success: true, data: getFallbackControlData(), fallback: true });
  }
}
