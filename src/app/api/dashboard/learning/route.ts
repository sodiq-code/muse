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
    creatorName: 'Jules',
    timeline: [
      {
        contentTitle: 'Video #12: Most AI agents aren\'t really agents',
        contentType: 'youtube_video',
        publishedAt: '2026-08-07T14:00:00Z',
        steps: [
          { type: 'published', label: 'Published', detail: 'Published on 8/7/2026' },
          { type: 'performance', label: 'Performance', detail: '71% retention' },
          { type: 'hook_analysis', label: 'Hook analysis', detail: 'Pattern: Contrarian Claim' },
          { type: 'comparison', label: 'Comparison', detail: '+18% vs your average (61%)', delta: '+18%' },
          { type: 'memory_updated', label: 'Memory updated', detail: 'Contrarian claim confidence: low→medium' },
          { type: 'strategy_changed', label: 'Strategy changed', detail: 'Prioritize contrarian claim in AI topics' },
          { type: 'loop_working', label: 'THE LOOP IS WORKING', detail: 'Used contrarian claim hook — pattern from earlier content applied' },
        ],
      },
      {
        contentTitle: 'Video #11: Why your AI prompts fail',
        contentType: 'youtube_video',
        publishedAt: '2026-08-04T14:00:00Z',
        steps: [
          { type: 'published', label: 'Published', detail: 'Published on 8/4/2026' },
          { type: 'performance', label: 'Performance', detail: '67% retention' },
          { type: 'hook_analysis', label: 'Hook analysis', detail: 'Pattern: Question' },
          { type: 'comparison', label: 'Comparison', detail: '+10% vs your average (61%)', delta: '+10%' },
          { type: 'memory_updated', label: 'Memory updated', detail: 'Question confidence: low' },
        ],
      },
      {
        contentTitle: 'Video #10: Stop using ChatGPT wrong',
        contentType: 'youtube_video',
        publishedAt: '2026-08-01T14:00:00Z',
        steps: [
          { type: 'published', label: 'Published', detail: 'Published on 8/1/2026' },
          { type: 'performance', label: 'Performance', detail: '61% retention' },
          { type: 'hook_analysis', label: 'Hook analysis', detail: 'Pattern: Contrarian Claim' },
          { type: 'memory_updated', label: 'Memory updated', detail: 'Contrarian claim confidence: low' },
        ],
      },
    ],
    currentInsight: {
      text: 'Contrarian hooks outperform question hooks by +11pp retention',
      evidence: 'Based on 8 posts, contrarian pattern averages 72% retention vs 61% baseline',
      confidence: 'medium',
      dataPoints: 8,
    },
    loopStatus: {
      lastRun: '2026-08-09T06:00:00Z',
      totalRuns: 23,
      totalRecommendations: 14,
      avgConfidence: 'MEDIUM',
    },
    honestyScore: {
      checksPassed: 5,
      checksTotal: 5,
      isHonest: true,
    },
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
