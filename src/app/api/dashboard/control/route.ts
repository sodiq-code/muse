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
    creatorName: 'Jules',
    autonomySettings: {
      overnightAnalysis: true,
      draftCreation: true,
      autoPublish: false,
      communityMonitoring: true,
    },
    approvalQueue: [
      {
        id: 'ca1',
        itemType: 'draft',
        itemId: 'fallback-draft-1',
        title: 'Most AI agents aren\'t really agents',
        action: 'publish',
        status: 'pending',
        createdAt: '2026-08-09T06:00:00Z',
        reviewedAt: null,
        age: '6h ago',
      },
    ],
    pendingCount: 1,
    auditLog: [
      { timestamp: '2026-08-09T22:04:00Z', actor: 'muse', action: 'Muse reviewed audience signals', detail: '3 observations, 2 recommendations', targetType: 'content_item', targetId: null, delta: null },
      { timestamp: '2026-08-09T22:31:00Z', actor: 'muse', action: 'Muse delegated to maker', detail: 'delegated draft generation', targetType: 'draft', targetId: null, delta: null },
      { timestamp: '2026-08-09T22:42:00Z', actor: 'maker', action: 'Maker created draft', detail: 'Most AI agents aren\'t really agents', targetType: 'draft', targetId: null, delta: null },
      { timestamp: '2026-08-09T22:45:00Z', actor: 'muse', action: 'Muse evaluated draft', detail: 'Voice 94%, Hook 91%, Quality 88%', targetType: 'draft', targetId: null, delta: null },
      { timestamp: '2026-08-09T23:02:00Z', actor: 'muse', action: 'Muse updated memory', detail: 'Hook pattern strength increased', targetType: 'memory', targetId: null, delta: null },
    ],
    totalAuditEvents: 47,
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
