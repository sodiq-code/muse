// ============================================================================
// API Route: /api/dashboard/memory
// Day 12 — Memory Screen Data
//
// GET: Returns Memory screen data for the default creator (Jules)
// Powers Screen 2: Memory (4 Domains + Voice Radar)
// ============================================================================

import { NextResponse } from 'next/server';
import { getMemoryScreenData, getDefaultCreatorId } from '@/lib/memory-screen-service';

function getFallbackMemoryData() {
  return {
    creatorName: 'Jules',
    identity: {
      niche: 'AI / developer education',
      audience: 'technical creators',
      tone: ['direct', 'technical', 'conversational'],
      avoid: ['corporate language', 'fake urgency', 'excessive hype'],
      source: 'Creator profile · direct input',
    },
    voiceRadar: {
      directness: 91,
      technicalDepth: 88,
      storytelling: 72,
      humor: 34,
      hype: 8,
      sentenceLength: 43,
      ctaIntensity: 28,
      source: 'Creator.voiceProfile · stored JSON',
      evidence: '7 dimensions from voice analysis: D=91, T=88, S=72, H=34, Hy=8',
    },
    winningHooks: [
      { pattern: 'contrarian claim', avgRetention: 72, sampleSize: 8, confidence: 'medium' },
      { pattern: 'story', avgRetention: 67, sampleSize: 6, confidence: 'low' },
      { pattern: 'question', avgRetention: 61, sampleSize: 7, confidence: 'low' },
    ],
    performance: {
      topSignals: [
        'Your audience responds better to direct technical explanations than broad AI news',
        'Contrarian openings consistently outperform listicle openings',
        'Engagement peaks on Tuesday and Thursday mornings',
      ],
      recentInsights: [
        'Contrarian hooks outperform question hooks by +11pp retention',
        'Audience retention drops when introductions exceed 12 seconds',
      ],
      source: 'MemoryEvent · 12 performance events, Recommendation · 5 active',
    },
    decisions: {
      totalDecisions: 8,
      recentDecisions: [
        { type: 'accepted', description: 'Approved contrarian hook for AI topic', date: '2026-08-09T06:00:00Z' },
        { type: 'modified', description: 'Changed draft title to be more specific', date: '2026-08-08T22:30:00Z' },
        { type: 'rejected', description: 'Declined listicle format suggestion', date: '2026-08-08T18:00:00Z' },
      ],
      source: 'CreatorDecision · 8 total decisions recorded',
    },
    memoryEvents: 47,
    isSimulation: true,
    source: 'prerecorded',
  };
}

export async function GET() {
  try {
    const creatorId = await getDefaultCreatorId();
    const data = await getMemoryScreenData(creatorId);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    // Database unavailable — return pre-recorded fallback data
    console.warn('[api/dashboard/memory] Database unavailable, returning fallback data');
    return NextResponse.json({ success: true, data: getFallbackMemoryData(), fallback: true });
  }
}
