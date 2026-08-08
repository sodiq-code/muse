// ============================================================================
// Maker Simulator — Day 2
// Produces realistic creative output when Maker credits aren't available.
// This is FIRST CLASS — not a temporary hack. It produces real output.
// ============================================================================

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type HookPattern =
  | 'contrarian_claim'
  | 'question'
  | 'story'
  | 'statistic'
  | 'tutorial'
  | 'listicle'
  | 'analogy'
  | 'personal';

export interface VoiceProfile {
  tone: string;       // e.g. "direct", "witty", "educational"
  pace: string;       // e.g. "fast", "measured", "slow"
  vocabulary: string; // e.g. "technical", "casual", "academic"
  avoidTopics: string[];
  strengths: string[];
}

export interface MakerInstruction {
  creator: string;
  topic: string;
  objective: string;
  audience: string;
  voice: VoiceProfile;
  historicalWinners: string[];
  instruction: string;
}

export interface MakerOutput {
  script: string;
  caption: string;
  title: string;
  cta: string;
  alternativeHooks: string[];
  thumbnailConcept?: string;
  voiceMatch: number;   // 0-1
  hookCompat: number;   // 0-1
  source: 'live' | 'simulated';
}

// ---------------------------------------------------------------------------
// Hook pattern generators (8 patterns)
// ---------------------------------------------------------------------------

const HOOK_GENERATORS: Record<HookPattern, (topic: string, audience: string) => string> = {
  contrarian_claim: (topic, audience) => {
    const claims: Record<string, string> = {
      default: `Everyone says ${topic.toLowerCase()} is the future. They're wrong — and here's why.`,
    };
    return claims.default;
  },

  question: (topic, audience) => {
    return `What if everything you thought you knew about ${topic.toLowerCase()} was built on a flawed assumption?`;
  },

  story: (topic, audience) => {
    return `Last week I spent 14 hours debugging a ${topic.toLowerCase()} issue that turned out to be a single misplaced semicolon. Let me save you the same pain.`;
  },

  statistic: (topic, audience) => {
    return `93% of ${audience.toLowerCase()} abandon ${topic.toLowerCase()} within the first month. The 7% who stick around all share one habit.`;
  },

  tutorial: (topic, audience) => {
    return `I built a production-ready ${topic.toLowerCase()} setup in under 20 minutes. Here's the exact step-by-step.`;
  },

  listicle: (topic, audience) => {
    return `5 ${topic.toLowerCase()} mistakes I see ${audience.toLowerCase()} make every single week — and how to fix each one.`;
  },

  analogy: (topic, audience) => {
    return `Think of ${topic.toLowerCase()} like a relay race: your handoff is where most teams lose the race, not the sprint.`;
  },

  personal: (topic, audience) => {
    return `I avoided ${topic.toLowerCase()} for 2 years because I thought it was overhyped. Then I actually tried it — and it changed how I ship code.`;
  },
};

// ---------------------------------------------------------------------------
// Script generators
// ---------------------------------------------------------------------------

function generateScript(instruction: MakerInstruction, primaryHook: string): string {
  const { creator, topic, objective, audience, voice } = instruction;

  const intro = `[HOOK]\n${primaryHook}\n\n[CONTEXT]\nHey — ${creator} here. If you're ${audience.toLowerCase()} trying to ${objective.toLowerCase()}, this one's for you.\n`;

  const body = `[CORE INSIGHT]\nHere's what most people get wrong about ${topic.toLowerCase()}: they treat it as a one-time decision instead of an iterative process. The ${voice.tone} approach is to start small, measure everything, and compound your wins.\n\n[PROOF / EXAMPLE]\nLet me walk you through exactly how this works in practice. I've been running this pattern for the last 3 months, and the results speak for themselves — faster iteration cycles, fewer bugs in production, and a dev experience that doesn't make you want to throw your keyboard.\n\n[FRAMEWORK]\n1. Start with the minimal viable setup — don't over-engineer day 1\n2. Instrument before you optimize — you can't improve what you don't measure\n3. Iterate on feedback, not assumptions — let the data (and your users) guide you\n4. Compound beats explosive — small consistent gains beat sporadic big wins`;

  const outro = `[CTA]\nIf this resonated, hit subscribe — I break down ${topic.toLowerCase()} and engineering trade-offs like this every week. No fluff, just stuff that ships.\n\n[END]`;

  return `${intro}\n${body}\n\n${outro}`;
}

function generateCaption(topic: string, objective: string): string {
  return `${topic} isn't what you think it is. Here's the ${objective.toLowerCase()} framework that actually works →`;
}

function generateTitle(topic: string, objective: string): string {
  return `${topic}: The ${objective} Framework Nobody Talks About`;
}

function generateCta(creator: string): string {
  return `Follow ${creator} for more engineering deep dives — no fluff, just stuff that ships.`;
}

function generateThumbnailConcept(topic: string, hook: string): string {
  return `Split frame: left side shows common ${topic.toLowerCase()} approach (red X overlay), right side shows the correct pattern (green checkmark). Bold text overlay: "${hook.slice(0, 40)}…" Dark background with subtle code/terminal aesthetic.`;
}

// ---------------------------------------------------------------------------
// Voice matching
// ---------------------------------------------------------------------------

function computeVoiceMatch(instruction: MakerInstruction): number {
  // Simulated voice match based on how well the instruction aligns with Jules' profile
  const voice = instruction.voice;
  let score = 0.85; // baseline

  if (voice.tone === 'direct' || voice.tone === 'educational') score += 0.05;
  if (voice.pace === 'fast' || voice.pace === 'measured') score += 0.03;
  if (voice.vocabulary === 'technical') score += 0.04;

  // Cap at 0.95
  return Math.min(0.95, score);
}

function computeHookCompat(historicalWinners: string[]): number {
  // Simulated hook compatibility based on historical data availability
  if (historicalWinners.length === 0) return 0.80;
  if (historicalWinners.length < 3) return 0.83;
  if (historicalWinners.length < 5) return 0.86;
  return Math.min(0.90, 0.86 + historicalWinners.length * 0.005);
}

// ---------------------------------------------------------------------------
// Main simulator function
// ---------------------------------------------------------------------------

export function simulateMakerOutput(instruction: MakerInstruction): MakerOutput {
  const { topic, audience, historicalWinners } = instruction;

  // Generate all 8 hook patterns
  const allHooks = Object.entries(HOOK_GENERATORS).map(([pattern, gen]) => ({
    pattern: pattern as HookPattern,
    hook: gen(topic, audience),
  }));

  // Pick primary hook — contrarian_claim for Jules (direct tone)
  // But rotate based on historical winners if available
  let primaryPattern: HookPattern = 'contrarian_claim';
  if (historicalWinners.length > 0) {
    // Pick the pattern most likely to match historical winners
    const patternScores: Record<HookPattern, number> = {
      contrarian_claim: 0.3,
      question: 0.2,
      story: 0.15,
      statistic: 0.12,
      tutorial: 0.1,
      listicle: 0.05,
      analogy: 0.04,
      personal: 0.04,
    };
    // Boost tutorial and listicle if they appear in historical winners
    const winnerText = historicalWinners.join(' ').toLowerCase();
    if (winnerText.includes('how') || winnerText.includes('step')) patternScores.tutorial += 0.2;
    if (winnerText.includes('top') || winnerText.includes('number')) patternScores.listicle += 0.2;
    if (winnerText.includes('wrong') || winnerText.includes("don't")) patternScores.contrarian_claim += 0.15;
    if (winnerText.includes('?')) patternScores.question += 0.15;

    const best = Object.entries(patternScores).sort((a, b) => b[1] - a[1])[0];
    primaryPattern = best[0] as HookPattern;
  }

  const primaryHook = HOOK_GENERATORS[primaryPattern](topic, audience);

  // Alternative hooks = all other patterns
  const alternativeHooks = allHooks
    .filter((h) => h.pattern !== primaryPattern)
    .map((h) => h.hook);

  // Generate full output
  const script = generateScript(instruction, primaryHook);
  const caption = generateCaption(topic, instruction.objective);
  const title = generateTitle(topic, instruction.objective);
  const cta = generateCta(instruction.creator);
  const thumbnailConcept = generateThumbnailConcept(topic, primaryHook);
  const voiceMatch = computeVoiceMatch(instruction);
  const hookCompat = computeHookCompat(historicalWinners);

  return {
    script,
    caption,
    title,
    cta,
    alternativeHooks,
    thumbnailConcept,
    voiceMatch,
    hookCompat,
    source: 'simulated',
  };
}

// ---------------------------------------------------------------------------
// Default Jules instruction preset
// ---------------------------------------------------------------------------

export const JULES_VOICE: VoiceProfile = {
  tone: 'direct',
  pace: 'fast',
  vocabulary: 'technical',
  avoidTopics: ['hype-driven content', 'clickbait without substance', 'vague advice'],
  strengths: ['code walkthroughs', 'architecture decisions', 'debugging strategies', 'tool comparisons'],
};

export function createJulesInstruction(
  topic: string,
  objective: string,
  overrides?: Partial<MakerInstruction>
): MakerInstruction {
  return {
    creator: 'Jules',
    topic,
    objective,
    audience: 'technical creators and developers',
    voice: JULES_VOICE,
    historicalWinners: [],
    instruction: `Create a YouTube video about ${topic} for ${objective}`,
    ...overrides,
  };
}
