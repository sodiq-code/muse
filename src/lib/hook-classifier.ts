// ============================================================================
// Hook Classifier — Day 2
// 8-pattern taxonomy: contrarian_claim, question, story, statistic,
//                     tutorial, listicle, analogy, personal
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

export interface HookClassification {
  pattern: HookPattern;
  confidence: number;  // 0-1
  reasoning: string;
  allScores: Record<HookPattern, number>;
}

// ---------------------------------------------------------------------------
// Pattern matchers — each returns a 0-1 score
// ---------------------------------------------------------------------------

const MATCHERS: Record<HookPattern, (text: string) => number> = {
  contrarian_claim: (text) => {
    const lower = text.toLowerCase();
    let score = 0;

    // "everyone says X" / "they're wrong"
    if (/everyone\s+(says|thinks|believes|knows)/i.test(text)) score += 0.4;
    if (/\bwrong\b/i.test(text)) score += 0.25;
    if (/\bnot\b.*\bthink\b|\bdoesn't\b/i.test(text)) score += 0.15;

    // "X is a myth" / "X is overrated"
    if (/\b(myth|overrated|lie|scam|trap)\b/i.test(text)) score += 0.35;

    // "Stop doing X" / "Don't X"
    if (/stop\s+(doing|using|believing)/i.test(text)) score += 0.3;
    if (/don't\s+(need|want|have|do)/i.test(text)) score += 0.2;

    // "Here's why" as contrarian payoff
    if (/here'?s?\s+why/i.test(text)) score += 0.1;

    // "Unpopular opinion"
    if (/unpopular\s+opinion/i.test(text)) score += 0.4;

    return Math.min(1, score);
  },

  question: (text) => {
    let score = 0;

    // Direct question mark
    if (text.includes('?')) score += 0.35;

    // "What if" / "Why" / "How" / "When"
    if (/^what\s+if\b/i.test(text)) score += 0.4;
    if (/^why\b/i.test(text)) score += 0.3;
    if (/^how\b/i.test(text)) score += 0.15;
    if (/^when\b/i.test(text)) score += 0.15;
    if (/^what\b/i.test(text)) score += 0.2;
    if (/^would\b/i.test(text)) score += 0.2;

    // Rhetorical question patterns
    if (/ever\s+wondered/i.test(text)) score += 0.3;
    if (/have\s+you\b/i.test(text)) score += 0.2;

    // Multiple questions
    const questionCount = (text.match(/\?/g) || []).length;
    if (questionCount >= 2) score += 0.15;

    return Math.min(1, score);
  },

  story: (text) => {
    let score = 0;
    const lower = text.toLowerCase();

    // Personal narrative markers
    if (/\b(i|we)\s+(was|were|had|spent|went|built|made|decided|tried)\b/i.test(text)) score += 0.25;

    // Time markers
    if (/\b(last|yesterday|earlier|this\s+morning|once|one\s+day|years?\s+ago)\b/i.test(text)) score += 0.2;

    // "Let me tell you" / "story"
    if (/\bstory\b/i.test(text)) score += 0.3;
    if (/let\s+me\s+tell/i.test(text)) score += 0.25;

    // Emotional language
    if (/\b(frustrated|excited|shocked|surprised|devastated|thrilled|scared)\b/i.test(text)) score += 0.2;

    // "Then" as narrative transition
    if (/\bthen\b/i.test(text)) score += 0.1;

    // "Turned out" / twist
    if (/turned\s+out/i.test(text)) score += 0.2;

    // Problem → resolution arc
    if (/save\s+you/i.test(text)) score += 0.1;

    return Math.min(1, score);
  },

  statistic: (text) => {
    let score = 0;

    // Percentage
    if (/\d+%/i.test(text)) score += 0.35;

    // "X out of Y" / "X in Y"
    if (/\d+\s+(out\s+of|in|of)\s+\d+/i.test(text)) score += 0.3;

    // Raw numbers with context
    if (/\d{2,}/.test(text)) score += 0.15;
    if (/\b(study|research|survey|data|report|found|show)\b/i.test(text)) score += 0.2;

    // "The majority" / "Most"
    if (/\b(majority|most|nearly\s+all|almost\s+all|only\s+\d)\b/i.test(text)) score += 0.2;

    // Statistical claim language
    if (/\b(average|median|percent|rate|growth|decline)\b/i.test(text)) score += 0.15;

    // "X% of [audience]"
    if (/\d+%\s+of\b/i.test(text)) score += 0.25;

    return Math.min(1, score);
  },

  tutorial: (text) => {
    let score = 0;

    // "How to" / "How I"
    if (/^how\s+(to|i)\b/i.test(text)) score += 0.4;

    // Step-by-step language
    if (/\b(step[- ]by[- ]step|steps?\s+\d|first|then|finally)\b/i.test(text)) score += 0.3;

    // "Build" / "Create" / "Setup" / "Deploy"
    if (/\b(build|create|setup|deploy|install|configure|implement)\b/i.test(text)) score += 0.2;

    // "Guide" / "Walkthrough" / "Tutorial"
    if (/\b(guide|walkthrough|tutorial|how[- ]to)\b/i.test(text)) score += 0.3;

    // "In X minutes"
    if (/in\s+\d+\s+(min|minute|hour|second)/i.test(text)) score += 0.2;

    // "Exact" / "Precise"
    if (/\b(exact|precise|specific|here'?s?\s+how)\b/i.test(text)) score += 0.15;

    // "From scratch"
    if (/from\s+scratch/i.test(text)) score += 0.25;

    return Math.min(1, score);
  },

  listicle: (text) => {
    let score = 0;

    // Numbered lists
    if (/\b\d+\s+(things|reasons|ways|tips|mistakes|habits|rules|lessons|secrets|tricks)\b/i.test(text)) score += 0.4;

    // "Top X" / "Best X"
    if (/\b(top\s+\d+|best\s+\d+|worst\s+\d+)\b/i.test(text)) score += 0.4;

    // "Every" / "Each" with enumeration
    if (/\bevery\s+(single\s+)?(week|day|time|month)\b/i.test(text)) score += 0.15;

    // List keywords
    if (/\b(list|checklist|checklist|roundup|collection)\b/i.test(text)) score += 0.2;

    // "X mistakes" / "X habits"
    if (/\d+\s+(mistakes?|habits?|patterns?|signs?|flags?|anti-patterns?)\b/i.test(text)) score += 0.3;

    // "How to fix"
    if (/how\s+to\s+fix/i.test(text)) score += 0.15;

    return Math.min(1, score);
  },

  analogy: (text) => {
    let score = 0;

    // "Think of X like Y"
    if (/think\s+of\b.*\blike\b/i.test(text)) score += 0.4;
    if (/think\s+about\b.*\blike\b/i.test(text)) score += 0.35;

    // "It's like" / "Is like"
    if (/\bit'?s?\s+like\b/i.test(text)) score += 0.3;

    // "Imagine" / "Picture"
    if (/\b(imagine|picture|visualize|think\s+of)\b/i.test(text)) score += 0.25;

    // "Just like" / "Same as"
    if (/\b(just\s+like|same\s+(as|way)|similar\s+to)\b/i.test(text)) score += 0.3;

    // Metaphor markers
    if (/\b(is|are)\s+the\b/i.test(text)) score += 0.1;

    // Colon used for analogy definition: "X: the Y of Z"
    if (/\w+:\s+the\s+\w+\s+of/i.test(text)) score += 0.25;

    // Relay / race / game / kitchen metaphors
    if (/\b(relay|race|game|kitchen|recipe|garden|bridge|engine|machine)\b/i.test(text)) score += 0.15;

    return Math.min(1, score);
  },

  personal: (text) => {
    let score = 0;

    // "I" as subject with strong verbs
    if (/\bi\s+(learned|realized|discovered|found|made|built|failed|quit|started|stopped|avoided)\b/i.test(text)) score += 0.35;

    // "My" / "Me" personal ownership
    if (/\b(my|mine)\b/i.test(text)) score += 0.15;

    // Vulnerability / admission
    if (/\b(failed|mistake|wrong|regret|struggled|avoided|ignored|hated)\b/i.test(text)) score += 0.2;

    // "Then I tried" / "Then it changed"
    if (/\bthen\s+i\s+(tried|actually|finally)\b/i.test(text)) score += 0.25;

    // Changed my mind
    if (/(changed\s+my\s+mind|used\s+to\s+hate|thought\s+it\s+was)\b/i.test(text)) score += 0.3;

    // "For X years"
    if (/for\s+\d+\s+years/i.test(text)) score += 0.15;

    // "Actually tried" / surprise
    if (/\bactually\b/i.test(text)) score += 0.1;

    // "Changed how I" / "changed the way"
    if (/changed\s+(how|the\s+way)\s+i\b/i.test(text)) score += 0.25;

    return Math.min(1, score);
  },
};

// ---------------------------------------------------------------------------
// Pattern labels for display
// ---------------------------------------------------------------------------

export const PATTERN_LABELS: Record<HookPattern, string> = {
  contrarian_claim: 'Contrarian Claim',
  question: 'Question',
  story: 'Story',
  statistic: 'Statistic',
  tutorial: 'Tutorial',
  listicle: 'Listicle',
  analogy: 'Analogy',
  personal: 'Personal',
};

export const ALL_PATTERNS: HookPattern[] = [
  'contrarian_claim',
  'question',
  'story',
  'statistic',
  'tutorial',
  'listicle',
  'analogy',
  'personal',
];

// ---------------------------------------------------------------------------
// Main classifier
// ---------------------------------------------------------------------------

export function classifyHook(text: string): HookClassification {
  // Score against all 8 patterns
  const allScores: Record<HookPattern, number> = {} as Record<HookPattern, number>;
  for (const pattern of ALL_PATTERNS) {
    allScores[pattern] = MATCHERS[pattern](text);
  }

  // Find the best match
  const sorted = Object.entries(allScores).sort((a, b) => b[1] - a[1]) as [HookPattern, number][];
  const best = sorted[0];
  const secondBest = sorted[1];

  // Confidence: how much better is the best than second-best
  let confidence = best[1];
  if (secondBest[1] > 0) {
    // Boost confidence if there's clear separation
    const separation = best[1] - secondBest[1];
    confidence = best[1] * (0.5 + separation * 0.5);
  }

  // If all scores are very low, confidence should be low
  if (best[1] < 0.15) {
    confidence = best[1] * 0.5;
  }

  // Generate reasoning
  const reasoning = generateReasoning(best[0], best[1], secondBest[0], secondBest[1], text);

  return {
    pattern: best[0],
    confidence: Math.round(confidence * 100) / 100,
    reasoning,
    allScores,
  };
}

// ---------------------------------------------------------------------------
// Reasoning generator
// ---------------------------------------------------------------------------

function generateReasoning(
  best: HookPattern,
  bestScore: number,
  second: HookPattern,
  secondScore: number,
  text: string
): string {
  const parts: string[] = [];

  parts.push(`Classified as "${PATTERN_LABELS[best]}" (score: ${bestScore.toFixed(2)})`);

  if (secondScore > 0.1) {
    parts.push(`Runner-up: "${PATTERN_LABELS[second]}" (score: ${secondScore.toFixed(2)})`);
  }

  if (bestScore < 0.2) {
    parts.push('Low overall scores — hook text may not match any pattern strongly');
  } else if (bestScore < 0.4) {
    parts.push('Moderate match — pattern is plausible but not strongly indicated');
  } else {
    parts.push('Strong pattern match');
  }

  // Mention text length as context
  if (text.length < 30) {
    parts.push('Short hook text — classification may be less reliable');
  }

  return parts.join('. ') + '.';
}

// ---------------------------------------------------------------------------
// Batch classifier
// ---------------------------------------------------------------------------

export function classifyHooks(texts: string[]): HookClassification[] {
  return texts.map(classifyHook);
}
