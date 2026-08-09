// ============================================================================
// API Route: /api/dashboard/learning
// Day 13 — Learning Screen Data
//
// GET: Returns Learning screen data for the default creator (Jules)
// Powers Screen 3: LEARNING (timeline + insights) — "MOST IMPORTANT" per blueprint
// ============================================================================

import { NextResponse } from 'next/server';
import { getLearningScreenData, getDefaultCreatorId } from '@/lib/learning-screen-service';

function getFallbackLearningData() {
  return {
    recentInsights: [
      {
        id: 'li1',
        insight: 'Contrarian hooks outperform question hooks by +11pp retention',
        confidence: 'medium',
        evidenceType: 'correlation',
        dataPoints: 8,
        timestamp: '2026-08-09T06:00:00Z',
      },
      {
        id: 'li2',
        insight: 'Audience retention drops when introductions exceed 12 seconds',
        confidence: 'low',
        evidenceType: 'observed',
        dataPoints: 3,
        timestamp: '2026-08-08T23:30:00Z',
      },
      {
        id: 'li3',
        insight: 'Tutorial format shows emerging strength in AI workflow content',
        confidence: 'low',
        evidenceType: 'correlation',
        dataPoints: 2,
        timestamp: '2026-08-08T22:00:00Z',
      },
    ],
    hookRankings: [
      { pattern: 'contrarian_claim', label: 'Contrarian Claim', avgEffectiveness: 0.72, sampleSize: 8, confidence: 'medium' },
      { pattern: 'story', label: 'Story', avgEffectiveness: 0.67, sampleSize: 6, confidence: 'low' },
      { pattern: 'question', label: 'Question', avgEffectiveness: 0.61, sampleSize: 7, confidence: 'low' },
      { pattern: 'tutorial', label: 'Tutorial', avgEffectiveness: 0.58, sampleSize: 4, confidence: 'low' },
      { pattern: 'listicle', label: 'Listicle', avgEffectiveness: 0.34, sampleSize: 2, confidence: 'low' },
    ],
    learningTimeline: [
      { step: 1, label: 'Video #12 Published', detail: '71% retention, contrarian hook' },
      { step: 2, label: 'Performance Analyzed', detail: '+18% vs 61% baseline' },
      { step: 3, label: 'Pattern Detected', detail: 'Contrarian claim confidence: low → medium' },
      { step: 4, label: 'Memory Updated', detail: 'Hook pattern strength increased' },
      { step: 5, label: 'Strategy Changed', detail: 'Prioritize contrarian in AI topics' },
    ],
    honestyScore: { isHonest: true, violations: 0, totalChecked: 15 },
    loopWorking: true,
    isSimulation: true,
    source: 'prerecorded',
  };
}

export async function GET() {
  try {
    const creatorId = await getDefaultCreatorId();
    const data = await getLearningScreenData(creatorId);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    // Database unavailable — return pre-recorded fallback data
    console.warn('[api/dashboard/learning] Database unavailable, returning fallback data');
    return NextResponse.json({ success: true, data: getFallbackLearningData(), fallback: true });
  }
}
