import { db } from '@/lib/db';
import { createCreator, getCreatorByEmail, logMemoryEvent } from '@/lib/creator-service';

// ---------------------------------------------------------------------------
// Validated Jules Creator Data
// ---------------------------------------------------------------------------

const JULES_CREATOR = {
  email: 'sodiqjimoh80@gmail.com',
  name: 'Jules',
  niche: 'AI / developer education',
  audience: 'technical creators',
  tone: ['direct', 'technical', 'conversational'],
  avoid: ['corporate language', 'fake urgency', 'excessive hype'],
  platform: 'youtube',
  voiceProfile: {
    directness: 91,
    technicalDepth: 88,
    humor: 34,
    hype: 8,
    storytelling: 72,
    sentenceLength: 43,
    ctaIntensity: 28,
  },
  mindsHumanId: '8fd0483e-f36b-1410-8466-00039ce7df11',
  mindsMuseId: '9fd0483e-f36b-1410-8466-00039ce7df11',
  mindsMakerId: '15d1483e-f36b-1410-8466-00039ce7df11',
};

// ---------------------------------------------------------------------------
// Seed Function
// ---------------------------------------------------------------------------

export async function seedCreator(): Promise<string> {
  // Idempotent: check if creator already exists by email
  const existing = await getCreatorByEmail(JULES_CREATOR.email);
  if (existing) {
    return existing.id;
  }

  // Create the Creator record
  const creator = await createCreator(JULES_CREATOR);

  // Create MemoryEvents for each identity field (category: "identity")
  const identityFields = [
    { key: 'name', value: JULES_CREATOR.name },
    { key: 'niche', value: JULES_CREATOR.niche },
    { key: 'audience', value: JULES_CREATOR.audience },
    { key: 'tone', value: JSON.stringify(JULES_CREATOR.tone) },
    { key: 'avoid', value: JSON.stringify(JULES_CREATOR.avoid) },
    { key: 'platform', value: JULES_CREATOR.platform },
    { key: 'voiceProfile', value: JSON.stringify(JULES_CREATOR.voiceProfile) },
  ];

  for (const field of identityFields) {
    await logMemoryEvent({
      creatorId: creator.id,
      category: 'identity',
      key: field.key,
      value: field.value,
      source: 'creator',
      confidence: 1.0,
    });
  }

  return creator.id;
}

/** Check if Jules creator exists in the database */
export async function isSeeded(): Promise<boolean> {
  const existing = await getCreatorByEmail(JULES_CREATOR.email);
  return !!existing;
}

/** Get the Jules creator data (for reference) */
export function getJulesCreatorData() {
  return JULES_CREATOR;
}
