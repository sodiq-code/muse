import { NextResponse } from 'next/server';
import { getVoiceProfile, JULES_VOICE_PROFILE, VOICE_DIMENSION_LABELS, VOICE_DIMENSION_DESCRIPTIONS } from '@/lib/voice-profiler';
import { seedCreator, seedPerformanceData } from '@/lib/seed';

export async function GET() {
  try {
    const creatorId = await seedCreator();
    await seedPerformanceData(creatorId);

    // Get voice profile (from DB or fallback to Jules default)
    const profile = await getVoiceProfile(creatorId) ?? JULES_VOICE_PROFILE;

    return NextResponse.json({
      success: true,
      profile,
      dimensions: Object.entries(VOICE_DIMENSION_LABELS).map(([key, label]) => ({
        key,
        label,
        description: VOICE_DIMENSION_DESCRIPTIONS[key as keyof typeof VOICE_DIMENSION_DESCRIPTIONS],
        value: profile[key as keyof typeof profile],
      })),
      source: profile === JULES_VOICE_PROFILE ? 'default' : 'stored',
    });
  } catch (error) {
    console.error('Voice profile error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get voice profile' },
      { status: 500 }
    );
  }
}
