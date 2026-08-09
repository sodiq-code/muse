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
    identity: {
      creator: 'Jules',
      niche: 'AI / developer education',
      audience: 'technical creators',
      tone: ['direct', 'technical', 'conversational'],
      avoid: ['corporate language', 'fake urgency', 'excessive hype'],
    },
    voice: {
      directness: 91,
      technicalDepth: 88,
      storytelling: 72,
      humor: 34,
      hype: 8,
      sentenceLength: 43,
      ctaIntensity: 28,
    },
    winningHooks: [
      { pattern: 'contrarian_claim', avgRetention: 0.72, sampleSize: 8, label: 'Contrarian Claim' },
      { pattern: 'story', avgRetention: 0.67, sampleSize: 6, label: 'Story' },
      { pattern: 'question', avgRetention: 0.61, sampleSize: 7, label: 'Question' },
    ],
    audienceInsights: [
      'Your audience responds better to direct technical explanations than broad AI news',
      'Contrarian openings consistently outperform listicle openings',
      'Engagement peaks on Tuesday and Thursday mornings',
    ],
    memoryEventCount: 47,
    lastUpdated: '2026-08-09T06:00:00Z',
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
