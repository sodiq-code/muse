import { NextRequest, NextResponse } from 'next/server';
import { analyzeVoice, analyzeAndUpdateVoice, computeVoiceMatch, JULES_VOICE_PROFILE, getVoiceProfile } from '@/lib/voice-profiler';
import { seedCreator } from '@/lib/seed';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, updateProfile = true } = body;

    if (!text || typeof text !== 'string' || text.trim().length < 20) {
      return NextResponse.json(
        { success: false, error: 'Text must be at least 20 characters for voice analysis' },
        { status: 400 }
      );
    }

    const creatorId = await seedCreator();
    const analysis = analyzeVoice(text);

    // Compute match against existing profile
    const existingProfile = await getVoiceProfile(creatorId);
    const baseline = existingProfile ?? JULES_VOICE_PROFILE;
    const matchResult = computeVoiceMatch(analysis.profile, baseline);

    // Build frontend-friendly match object
    const dimensionKeys = ['directness', 'technicalDepth', 'humor', 'hype', 'storytelling', 'sentenceLength', 'ctaIntensity'] as const;
    const dimensionLabels: Record<string, string> = {
      directness: 'Directness',
      technicalDepth: 'Technical Depth',
      humor: 'Humor',
      hype: 'Hype',
      storytelling: 'Storytelling',
      sentenceLength: 'Sentence Length',
      ctaIntensity: 'CTA Intensity',
    };

    const match = {
      overallMatch: matchResult.score,
      dimensionMatches: dimensionKeys.map((key) => {
        const profileScore = (baseline[key] ?? 0) / 100;
        const contentScore = (analysis.profile[key] ?? 0) / 100;
        const matchVal = matchResult.dimensionScores[key] ?? 0;
        const isMismatch = matchResult.mismatches.includes(key);
        return {
          dimension: dimensionLabels[key],
          profileScore,
          contentScore,
          match: matchVal,
          isMismatch,
        };
      }),
      mismatchCount: matchResult.mismatches.length,
    };

    // Optionally update the stored voice profile
    if (updateProfile) {
      await analyzeAndUpdateVoice(creatorId, text, 0.3);
    }

    // Build frontend-friendly analysis array
    const analysisResults = analysis.dimensions.map((d) => ({
      dimension: d.name,
      score: d.score,
      indicator: d.indicators.join(', ') || 'measured',
      reasoning: d.reasoning,
    }));

    return NextResponse.json({
      success: true,
      analysis: analysisResults,
      match,
    });
  } catch (error) {
    console.error('Voice analysis error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to analyze voice' },
      { status: 500 }
    );
  }
}
