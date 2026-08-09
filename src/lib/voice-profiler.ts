// ============================================================================
// Voice Profiler — Day 4
// Domain 2 of Creator Memory System: VOICE (Profile, NOT Clone)
// Analyzes text content to extract 7 voice dimensions:
//   directness, technicalDepth, humor, hype, storytelling,
//   sentenceLength, ctaIntensity
// Computes voice match scores and updates creator voice profile.
// ============================================================================

import { db } from '@/lib/db';
import { logMemoryEvent } from '@/lib/creator-service';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface VoiceProfile {
  directness: number;      // 0-100: How direct/blunt vs hedging/qualifying
  technicalDepth: number;  // 0-100: Technical jargon depth vs casual/simple
  humor: number;           // 0-100: Humor/playfulness vs serious
  hype: number;            // 0-100: Hype/exaggeration vs measured/grounded
  storytelling: number;    // 0-100: Narrative/story-driven vs factual/list
  sentenceLength: number;  // 0-100: Long complex vs short punchy sentences
  ctaIntensity: number;    // 0-100: Strong CTAs vs subtle/absent
}

export interface VoiceAnalysisResult {
  profile: VoiceProfile;
  sampleText: string;
  wordCount: number;
  sentenceCount: number;
  dimensions: VoiceDimensionDetail[];
}

export interface VoiceDimensionDetail {
  name: string;
  key: keyof VoiceProfile;
  score: number;
  indicators: string[];
  reasoning: string;
}

export interface VoiceMatchResult {
  score: number;          // 0-1 overall match
  dimensionScores: Record<keyof VoiceProfile, number>; // per-dimension 0-1
  mismatches: string[];   // Dimensions that are significantly off
  matchSummary: string;
}

// ---------------------------------------------------------------------------
// Default Jules Voice Profile (validated from Day 1 LTM test)
// ---------------------------------------------------------------------------

export const JULES_VOICE_PROFILE: VoiceProfile = {
  directness: 91,
  technicalDepth: 88,
  humor: 34,
  hype: 8,
  storytelling: 72,
  sentenceLength: 43,
  ctaIntensity: 28,
};

// ---------------------------------------------------------------------------
// Text Analysis Helpers
// ---------------------------------------------------------------------------

function splitSentences(text: string): string[] {
  // Split on sentence-ending punctuation, keeping meaningful sentences
  return text
    .split(/[.!?]+/)
    .map(s => s.trim())
    .filter(s => s.length > 5);
}

function countWords(text: string): number {
  return text.split(/\s+/).filter(w => w.length > 0).length;
}

function countSyllables(word: string): number {
  // Simple syllable estimation
  const lower = word.toLowerCase();
  if (lower.length <= 3) return 1;
  let count = lower.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '').match(/[aeiouy]{1,2}/g)?.length ?? 1;
  return Math.max(1, count);
}

// ---------------------------------------------------------------------------
// Dimension Analyzers
// ---------------------------------------------------------------------------

/**
 * DIRECTNESS (0-100): How direct/blunt vs hedging/qualifying
 * High: Short declarative sentences, imperative mood, "here's why", "stop doing X"
 * Low: "maybe", "perhaps", "I think", "it seems", qualifiers, hedging
 */
function analyzeDirectness(text: string, sentences: string[]): VoiceDimensionDetail {
  const indicators: string[] = [];
  let score = 50; // baseline

  const lower = text.toLowerCase();

  // Direct language markers
  if (/\b(here'?s?\s+why|here'?s?\s+how|here'?s?\s+the)\b/i.test(text)) { score += 8; indicators.push("'here's why/how' pattern"); }
  if (/\bstop\s+(doing|using|believing|writing)/i.test(text)) { score += 10; indicators.push("imperative 'stop'"); }
  if (/\bdon'?t\b/i.test(text)) { score += 3; indicators.push("'don't' directive"); }
  if (/\bmust\b|\bneed\s+to\b|\bhave\s+to\b|\bshould\b/i.test(text)) { score += 5; indicators.push("obligation modal"); }
  if (/\bwrong\b/i.test(text)) { score += 5; indicators.push("'wrong' assertion"); }
  if (/\bnever\b|\balways\b|\bevery\b/i.test(text)) { score += 4; indicators.push("absolute language"); }

  // Hedging language markers (reduce directness)
  const hedgeCount = (lower.match(/\b(maybe|perhaps|might|could|possibly|seems?|appears?|probably|likely|sort\s+of|kind\s+of|fairly|quite|rather|somewhat)\b/g) ?? []).length;
  if (hedgeCount > 0) { score -= hedgeCount * 3; indicators.push(`${hedgeCount} hedging words`); }

  if (/\bi\s+think\b|\bi\s+believe\b|\bi\s+feel\s+like\b/i.test(text)) { score -= 5; indicators.push("'I think/believe' hedging"); }

  // Short sentences = more direct
  const avgSentenceLen = sentences.length > 0
    ? sentences.reduce((s, sent) => s + countWords(sent), 0) / sentences.length
    : 15;
  if (avgSentenceLen < 10) { score += 8; indicators.push('short sentences (<10 words avg)'); }
  else if (avgSentenceLen < 15) { score += 4; indicators.push('moderate sentences (10-15 words avg)'); }
  else if (avgSentenceLen > 25) { score -= 5; indicators.push('long sentences (>25 words avg)'); }

  // Imperative mood at sentence start
  const imperativeCount = sentences.filter(s => /^(go|stop|start|try|use|build|create|don'?t|never|always|avoid|skip|check|read|watch|learn)\b/i.test(s)).length;
  if (imperativeCount > 0) { score += imperativeCount * 4; indicators.push(`${imperativeCount} imperative sentences`); }

  return {
    name: 'Directness',
    key: 'directness',
    score: Math.max(0, Math.min(100, score)),
    indicators,
    reasoning: score > 70 ? 'Highly direct — uses imperatives, assertions, and minimal hedging'
      : score > 40 ? 'Moderately direct — some hedging but generally assertive'
        : 'Low directness — heavy use of qualifiers and hedging language',
  };
}

/**
 * TECHNICAL DEPTH (0-100): Technical jargon/sophistication vs casual/simple
 * High: Code terms, API names, architecture patterns, specific tool names
 * Low: Simple vocabulary, general terms, no code references
 */
function analyzeTechnicalDepth(text: string, _sentences: string[]): VoiceDimensionDetail {
  const indicators: string[] = [];
  let score = 30; // baseline (most content is somewhat technical)

  // Technical terms
  const techTerms = (text.match(/\b(api|sdk|cli|git|docker|kubernetes|prisma|nextjs|react|typescript|javascript|node|webpack|vite|rust|golang|python|sql|nosql|rest|graphql|websocket|oauth|jwt|tls|ssl|dns|tcp|udp|http|grpc|protobuf|json|yaml|toml|csv|regex|async|await|promise|callback|middleware|decorator|factory|singleton|observer|middleware|repository|controller|service|component|hook|render|state|props|context|redux|zustand|prisma|schema|migration|seed|crud|orm|dao|dto|vo|entity|model|view)\b/gi) ?? []).length;
  if (techTerms > 0) { score += Math.min(30, techTerms * 3); indicators.push(`${techTerms} technical terms`); }

  // Code-like patterns (backticks, brackets, camelCase)
  const codePatterns = (text.match(/[`{}[\]()]/g) ?? []).length;
  if (codePatterns > 5) { score += 8; indicators.push('code syntax patterns'); }

  const camelCase = (text.match(/\b[a-z][a-zA-Z0-9]*[A-Z][a-zA-Z0-9]*\b/g) ?? []).length;
  if (camelCase > 0) { score += Math.min(10, camelCase * 2); indicators.push(`${camelCase} camelCase terms`); }

  // Architecture/pattern language
  if (/\b(architecture|pattern|paradigm|abstraction|encapsulation|polymorphism|composition|delegation|orchestrat)\b/i.test(text)) {
    score += 10; indicators.push('architecture/pattern language');
  }

  // Specific numbers with technical context (version numbers, ports, etc.)
  if (/\bv?\d+\.\d+\.\d+\b/.test(text)) { score += 5; indicators.push('version numbers'); }
  if (/\bport\s+\d+\b|\b:\d{4}\b/.test(text)) { score += 3; indicators.push('port references'); }

  // Casual language (reduces technical depth)
  const casualCount = (text.match(/\b(awesome|cool|nice|great|amazing|super|pretty|basically|just|stuff|thing|thingy|whatchamacallit)\b/gi) ?? []).length;
  if (casualCount > 3) { score -= 5; indicators.push(`${casualCount} casual words`); }

  return {
    name: 'Technical Depth',
    key: 'technicalDepth',
    score: Math.max(0, Math.min(100, score)),
    indicators,
    reasoning: score > 70 ? 'Deeply technical — uses specific tools, patterns, and code references'
      : score > 40 ? 'Moderately technical — some jargon but accessible'
        : 'Low technical depth — casual/simple vocabulary',
  };
}

/**
 * HUMOR (0-100): Humor/playfulness vs serious
 * High: Jokes, self-deprecation, witty phrasing, emojis in context
 * Low: Serious, formal, no levity
 */
function analyzeHumor(text: string, _sentences: string[]): VoiceDimensionDetail {
  const indicators: string[] = [];
  let score = 15; // baseline (most tech content is somewhat serious)

  const lower = text.toLowerCase();

  // Self-deprecation
  if (/\bi\s+(failed|broke|messed\s+up|screwed|ruined|couldn'?t|struggled|hated|wanted\s+to\s+(quit|give\s+up))\b/i.test(text)) {
    score += 15; indicators.push('self-deprecating humor');
  }

  // Witty/sarcastic patterns
  if (/\b(spoiler|plot\s+twist|fun\s+fact|pro\s+tip|protip|spoiler\s+alert)\b/i.test(text)) {
    score += 10; indicators.push('witty/sarcastic pattern');
  }

  // Exaggeration for comedic effect
  if (/\b(throw\s+your\s+(keyboard|monitor|computer|laptop)|want\s+to\s+scream|pull\s+your\s+hair|rage)\b/i.test(text)) {
    score += 12; indicators.push('comedic exaggeration');
  }

  // "Of course" / "Naturally" used sarcastically
  if (/\b(of\s+course|naturally|obviously|clearly)\b.*\b(but|except|unless|wrong|not)\b/i.test(text)) {
    score += 8; indicators.push('sarcastic setup');
  }

  // Colloquial humor
  if (/\b(yeah|yep|nope|uh|um|oh|wow|whoa|ha|lol|smh|facepalm)\b/i.test(text)) {
    score += 5; indicators.push('colloquial/humorous interjection');
  }

  // Metaphorical humor
  if (/\b(like\s+a\s+|it'?s?\s+like|imagine\s+if)\b/i.test(text) && /\b(intern|junior|toddler|chaos|disaster|nightmare|circus)\b/i.test(text)) {
    score += 8; indicators.push('humorous metaphor');
  }

  // Parenthetical asides
  const parenCount = (text.match(/\([^)]{10,}\)/g) ?? []).length;
  if (parenCount > 0) { score += parenCount * 3; indicators.push(`${parenCount} parenthetical asides`); }

  return {
    name: 'Humor',
    key: 'humor',
    score: Math.max(0, Math.min(100, score)),
    indicators,
    reasoning: score > 50 ? 'Humorous — uses wit, self-deprecation, and playful language'
      : score > 25 ? 'Some humor — occasional light moments but mostly serious'
        : 'Serious — minimal humor, formal tone',
  };
}

/**
 * HYPE (0-100): Hype/exaggeration vs measured/grounded
 * High: "revolutionary", "game-changing", "mind-blowing", ALL CAPS, excessive !!!
 * Low: Measured claims, specific numbers, caveats, "it depends"
 */
function analyzeHype(text: string, _sentences: string[]): VoiceDimensionDetail {
  const indicators: string[] = [];
  let score = 10; // baseline (default is low hype)

  // Hype words
  const hypeWords = (text.match(/\b(revolutionary|game[- ]changing|mind[- ]blowing|insane|insane|unbelievable|incredible|earth[- ]shattering|groundbreaking|world[- ]class|disruptive|paradigm[- ]shift|transformative|life[- ]changing|jaw[- ]dropping)\b/gi) ?? []).length;
  if (hypeWords > 0) { score += hypeWords * 12; indicators.push(`${hypeWords} hype words`); }

  // "X will change everything" / "the future of X"
  if (/\bwill\s+change\s+everything\b|\bfuture\s+of\b/i.test(text)) { score += 15; indicators.push("'change everything' / 'future of' pattern"); }

  // Exclamation marks
  const exclCount = (text.match(/!/g) ?? []).length;
  if (exclCount > 2) { score += Math.min(15, exclCount * 3); indicators.push(`${exclCount} exclamation marks`); }

  // ALL CAPS words (3+ letters)
  const capsWords = (text.match(/\b[A-Z]{3,}\b/g) ?? []).filter(w => !['API', 'SDK', 'CLI', 'HTTP', 'REST', 'SQL', 'CSS', 'HTML', 'JSON', 'YAML', 'TCP', 'UDP', 'DNS', 'TLS', 'SSL', 'JWT', 'ORM', 'DAO', 'DTO', 'CRUD'].includes(w));
  if (capsWords.length > 2) { score += capsWords.length * 3; indicators.push(`${capsWords.length} ALL CAPS emphasis words`); }

  // "You NEED" / "Must have" / urgency language
  if (/\byou\s+(need|must|have\s+to)\b|\burgently\b|\bnow\b|\bright\s+now\b/i.test(text)) {
    score += 8; indicators.push('urgency language');
  }

  // Measured language (reduces hype)
  if (/\b(it\s+depends|caveat|limitation|trade[- ]off|downside|important\s+caveat|with\s+reservations)\b/i.test(text)) {
    score -= 10; indicators.push('measured/caveat language');
  }
  if (/\b(specifically|exactly|precisely|in\s+practice|in\s+reality|realistically)\b/i.test(text)) {
    score -= 5; indicators.push('grounding language');
  }

  return {
    name: 'Hype',
    key: 'hype',
    score: Math.max(0, Math.min(100, score)),
    indicators,
    reasoning: score > 50 ? 'High hype — uses superlatives, urgency, and exaggerated claims'
      : score > 25 ? 'Some hype — occasional enthusiasm but generally grounded'
        : 'Low hype — measured, grounded claims with specifics',
  };
}

/**
 * STORYTELLING (0-100): Narrative/story-driven vs factual/list
 * High: "I", personal anecdotes, narrative arc, "then", temporal markers
 * Low: Bullet points, numbered lists, definitions, pure facts
 */
function analyzeStorytelling(text: string, sentences: string[]): VoiceDimensionDetail {
  const indicators: string[] = [];
  let score = 30; // baseline

  // First person narrative
  const iCount = (text.match(/\bI\s+/g) ?? []).length;
  if (iCount > 3) { score += Math.min(20, iCount * 3); indicators.push(`${iCount} first-person references`); }

  // Temporal/narrative markers
  const narrativeMarkers = (text.match(/\b(last\s+(week|month|year|night|time)|yesterday|earlier|then|after\s+that|next|finally|eventually|at\s+first|in\s+the\s+end|once|one\s+day)\b/gi) ?? []).length;
  if (narrativeMarkers > 0) { score += Math.min(15, narrativeMarkers * 4); indicators.push(`${narrativeMarkers} narrative markers`); }

  // Problem → resolution arc
  if (/\b(problem|issue|bug|error|fail|broke|struggl)\b/i.test(text) && /\b(fix|solv|resolv|work|success|figur|discover)\b/i.test(text)) {
    score += 12; indicators.push('problem → resolution arc');
  }

  // "Let me tell you" / "Story time"
  if (/\b(let\s+me\s+tell|story\s+time|here'?s?\s+what\s+happened|so\s+here'?s?\s+the\s+story)\b/i.test(text)) {
    score += 10; indicators.push('storytelling setup');
  }

  // Dialogue/quotes
  if (/"[^"]{10,}"/.test(text) || /'[^']{10,}'/.test(text)) {
    score += 5; indicators.push('quoted dialogue');
  }

  // Anti-storytelling: numbered lists, bullet points reduce storytelling score
  const listItems = (text.match(/^\s*[-*•]\s|\n\s*[-*•]\s|\n\s*\d+[.)]\s/gm) ?? []).length;
  if (listItems > 3) { score -= 8; indicators.push(`${listItems} list items (less narrative)`); }

  // "Step 1, Step 2" pattern reduces storytelling
  if (/step\s+\d/i.test(text)) { score -= 5; indicators.push('step-by-step (less narrative)'); }

  return {
    name: 'Storytelling',
    key: 'storytelling',
    score: Math.max(0, Math.min(100, score)),
    indicators,
    reasoning: score > 60 ? 'Strong storyteller — uses personal anecdotes and narrative arcs'
      : score > 35 ? 'Some storytelling — mixes narrative with factual content'
        : 'Low storytelling — primarily factual/list-based content',
  };
}

/**
 * SENTENCE LENGTH (0-100): Long complex vs short punchy sentences
 * High: Average sentence > 20 words, complex clauses
 * Low: Short punchy sentences, fragments
 */
function analyzeSentenceLength(text: string, sentences: string[]): VoiceDimensionDetail {
  const indicators: string[] = [];

  if (sentences.length === 0) {
    return {
      name: 'Sentence Length',
      key: 'sentenceLength',
      score: 50,
      indicators: ['no sentences detected'],
      reasoning: 'No sentences detected for analysis',
    };
  }

  const wordCounts = sentences.map(s => countWords(s));
  const avgLen = wordCounts.reduce((s, l) => s + l, 0) / wordCounts.length;
  const maxLen = Math.max(...wordCounts);
  const shortPct = wordCounts.filter(l => l < 8).length / wordCounts.length;

  // Map average sentence length to 0-100 score
  // 5 words = ~10, 15 words = ~50, 30 words = ~90
  let score = Math.min(100, Math.max(0, (avgLen - 3) * 4));

  if (avgLen > 20) indicators.push(`long sentences (avg ${avgLen.toFixed(1)} words)`);
  else if (avgLen > 12) indicators.push(`moderate sentences (avg ${avgLen.toFixed(1)} words)`);
  else indicators.push(`short sentences (avg ${avgLen.toFixed(1)} words)`);

  if (maxLen > 30) { score += 5; indicators.push(`max sentence ${maxLen} words`); }
  if (shortPct > 0.3) { score -= 8; indicators.push(`${(shortPct * 100).toFixed(0)}% short punchy sentences`); }

  // Subordinate clauses increase complexity
  const clauseMarkers = (text.match(/\b(although|because|since|while|whereas|unless|until|whenever|wherever|whether|which|that|who)\b/gi) ?? []).length;
  if (clauseMarkers > 2) { score += 5; indicators.push(`${clauseMarkers} subordinate clauses`); }

  return {
    name: 'Sentence Length',
    key: 'sentenceLength',
    score: Math.max(0, Math.min(100, Math.round(score))),
    indicators,
    reasoning: score > 60 ? 'Long, complex sentences — elaborate and detailed'
      : score > 35 ? 'Moderate sentence length — balanced readability'
        : 'Short, punchy sentences — concise and direct',
  };
}

/**
 * CTA INTENSITY (0-100): Strong CTAs vs subtle/absent
 * High: "Subscribe now", "Follow me", "Click here", multiple CTAs
 * Low: No CTAs, soft suggestions, "if you want"
 */
function analyzeCtaIntensity(text: string, _sentences: string[]): VoiceDimensionDetail {
  const indicators: string[] = [];
  let score = 10; // baseline (most content has minimal CTAs)

  // Strong CTA patterns
  if (/\b(subscribe\s+now|follow\s+me|click\s+(here|below)|sign\s+up|join\s+(us|me|the)|download\s+(now|free|today))\b/i.test(text)) {
    score += 20; indicators.push('strong direct CTA');
  }

  // Moderate CTAs
  if (/\b(hit\s+)?subscribe\b|\bfollow\b|\blike\s+(and\s+subscribe|this\s+video)?\b/i.test(text)) {
    score += 10; indicators.push('standard subscribe/follow CTA');
  }

  // "If you liked this" / soft CTA
  if (/\bif\s+you\s+(liked|enjoyed|found\s+this)\b/i.test(text)) {
    score += 8; indicators.push('soft conditional CTA');
  }

  // "Let me know" / engagement CTA
  if (/\b(let\s+me\s+know|drop\s+a\s+comment|comment\s+below|share\s+your|tell\s+me)\b/i.test(text)) {
    score += 8; indicators.push('engagement CTA');
  }

  // Multiple CTAs
  const ctaPatterns = [
    /\bsubscribe\b/i,
    /\bfollow\b/i,
    /\blike\b/i,
    /\bcomment\b/i,
    /\bshare\b/i,
    /\bclick\b/i,
    /\bsign\s+up\b/i,
    /\bjoin\b/i,
    /\bdownload\b/i,
    /\blink\s+(in|below|below)\b/i,
  ];
  const ctaCount = ctaPatterns.filter(p => p.test(text)).length;
  if (ctaCount >= 3) { score += 10; indicators.push(`${ctaCount} different CTA types`); }

  // Urgency modifiers on CTAs
  if (/\b(now|today|right\s+now|don'?t\s+wait|hurry)\b/i.test(text) && ctaCount > 0) {
    score += 8; indicators.push('urgency modifier on CTA');
  }

  // "No pressure" / anti-CTA
  if (/\b(no\s+pressure|only\s+if\s+you\s+want|optional|up\s+to\s+you)\b/i.test(text)) {
    score -= 5; indicators.push('soft/optional framing');
  }

  return {
    name: 'CTA Intensity',
    key: 'ctaIntensity',
    score: Math.max(0, Math.min(100, score)),
    indicators,
    reasoning: score > 50 ? 'Strong CTAs — multiple direct calls to action'
      : score > 25 ? 'Moderate CTAs — some calls to action, not aggressive'
        : 'Low CTA intensity — minimal or soft calls to action',
  };
}

// ---------------------------------------------------------------------------
// Main Analysis Function
// ---------------------------------------------------------------------------

export function analyzeVoice(text: string): VoiceAnalysisResult {
  const sentences = splitSentences(text);
  const wordCount = countWords(text);

  const dimensions: VoiceDimensionDetail[] = [
    analyzeDirectness(text, sentences),
    analyzeTechnicalDepth(text, sentences),
    analyzeHumor(text, sentences),
    analyzeHype(text, sentences),
    analyzeStorytelling(text, sentences),
    analyzeSentenceLength(text, sentences),
    analyzeCtaIntensity(text, sentences),
  ];

  const profile: VoiceProfile = {
    directness: dimensions.find(d => d.key === 'directness')!.score,
    technicalDepth: dimensions.find(d => d.key === 'technicalDepth')!.score,
    humor: dimensions.find(d => d.key === 'humor')!.score,
    hype: dimensions.find(d => d.key === 'hype')!.score,
    storytelling: dimensions.find(d => d.key === 'storytelling')!.score,
    sentenceLength: dimensions.find(d => d.key === 'sentenceLength')!.score,
    ctaIntensity: dimensions.find(d => d.key === 'ctaIntensity')!.score,
  };

  return {
    profile,
    sampleText: text.slice(0, 200) + (text.length > 200 ? '...' : ''),
    wordCount,
    sentenceCount: sentences.length,
    dimensions,
  };
}

// ---------------------------------------------------------------------------
// Voice Match — compare content voice to stored voice profile
// ---------------------------------------------------------------------------

export function computeVoiceMatch(content: VoiceProfile, target: VoiceProfile): VoiceMatchResult {
  const keys: (keyof VoiceProfile)[] = [
    'directness', 'technicalDepth', 'humor', 'hype',
    'storytelling', 'sentenceLength', 'ctaIntensity',
  ];

  // Weight dimensions by importance for voice matching
  // Directness and technicalDepth are most important for identity
  const weights: Record<keyof VoiceProfile, number> = {
    directness: 0.25,
    technicalDepth: 0.20,
    humor: 0.10,
    hype: 0.15,
    storytelling: 0.12,
    sentenceLength: 0.08,
    ctaIntensity: 0.10,
  };

  const dimensionScores: Record<keyof VoiceProfile, number> = {} as Record<keyof VoiceProfile, number>;
  const mismatches: string[] = [];

  for (const key of keys) {
    // Similarity: 1 - |a - b| / 100
    const similarity = 1 - Math.abs(content[key] - target[key]) / 100;
    dimensionScores[key] = Math.round(similarity * 100) / 100;

    // Flag significant mismatches (>30 points off)
    if (Math.abs(content[key] - target[key]) > 30) {
      const direction = content[key] > target[key] ? 'higher' : 'lower';
      mismatches.push(`${key} is ${direction} than profile (${content[key]} vs ${target[key]})`);
    }
  }

  // Weighted overall score
  let overallScore = 0;
  let totalWeight = 0;
  for (const key of keys) {
    overallScore += dimensionScores[key] * weights[key];
    totalWeight += weights[key];
  }
  overallScore = overallScore / totalWeight;

  // Generate summary
  const matchPct = (overallScore * 100).toFixed(1);
  let matchSummary = `Voice match: ${matchPct}%`;
  if (mismatches.length > 0) {
    matchSummary += `. Mismatches: ${mismatches.join('; ')}`;
  } else {
    matchSummary += '. All dimensions within target range.';
  }

  return {
    score: Math.round(overallScore * 100) / 100,
    dimensionScores,
    mismatches,
    matchSummary,
  };
}

// ---------------------------------------------------------------------------
// Database Operations
// ---------------------------------------------------------------------------

/** Get the voice profile for a creator */
export async function getVoiceProfile(creatorId: string): Promise<VoiceProfile | null> {
  const creator = await db.creator.findUnique({
    where: { id: creatorId },
    select: { voiceProfile: true },
  });
  if (!creator?.voiceProfile) return null;
  return JSON.parse(creator.voiceProfile);
}

/** Update voice profile — merges new analysis with existing profile using weighted average */
export async function updateVoiceProfile(
  creatorId: string,
  newProfile: VoiceProfile,
  weight: number = 0.3 // Weight for new data (0-1); existing gets (1-weight)
): Promise<VoiceProfile> {
  const existing = await getVoiceProfile(creatorId);

  let merged: VoiceProfile;
  if (existing) {
    // Weighted merge: existing * (1-weight) + new * weight
    const keys: (keyof VoiceProfile)[] = [
      'directness', 'technicalDepth', 'humor', 'hype',
      'storytelling', 'sentenceLength', 'ctaIntensity',
    ];
    merged = { ...existing };
    for (const key of keys) {
      merged[key] = Math.round(existing[key] * (1 - weight) + newProfile[key] * weight);
    }
  } else {
    merged = newProfile;
  }

  // Update in database
  await db.creator.update({
    where: { id: creatorId },
    data: { voiceProfile: JSON.stringify(merged) },
  });

  // Log memory events for changed dimensions
  if (existing) {
    const keys: (keyof VoiceProfile)[] = [
      'directness', 'technicalDepth', 'humor', 'hype',
      'storytelling', 'sentenceLength', 'ctaIntensity',
    ];
    for (const key of keys) {
      if (Math.abs(merged[key] - existing[key]) >= 2) {
        await logMemoryEvent({
          creatorId,
          category: 'identity',
          key: `voice_${key}`,
          value: String(merged[key]),
          source: 'analytics',
          confidence: 0.7, // Voice analysis is inferred, not directly stated
        });
      }
    }
  }

  // Audit event
  await db.auditEvent.create({
    data: {
      creatorId,
      actor: 'system',
      action: 'update',
      targetType: 'voice_profile',
      targetId: creatorId,
      delta: JSON.stringify({
        before: existing,
        after: merged,
        weight,
      }),
    },
  });

  return merged;
}

/** Analyze text and update voice profile in one step */
export async function analyzeAndUpdateVoice(
  creatorId: string,
  text: string,
  mergeWeight: number = 0.3
): Promise<{ analysis: VoiceAnalysisResult; updatedProfile: VoiceProfile; match?: VoiceMatchResult }> {
  const analysis = analyzeVoice(text);
  const existing = await getVoiceProfile(creatorId);

  const updatedProfile = await updateVoiceProfile(creatorId, analysis.profile, mergeWeight);

  let match: VoiceMatchResult | undefined;
  if (existing) {
    match = computeVoiceMatch(analysis.profile, existing);
  }

  return { analysis, updatedProfile, match };
}

// ---------------------------------------------------------------------------
// Voice Profile Label Helpers
// ---------------------------------------------------------------------------

export const VOICE_DIMENSION_LABELS: Record<keyof VoiceProfile, string> = {
  directness: 'Directness',
  technicalDepth: 'Technical Depth',
  humor: 'Humor',
  hype: 'Hype',
  storytelling: 'Storytelling',
  sentenceLength: 'Sentence Length',
  ctaIntensity: 'CTA Intensity',
};

export const VOICE_DIMENSION_DESCRIPTIONS: Record<keyof VoiceProfile, string> = {
  directness: 'How direct and assertive vs hedging and qualifying',
  technicalDepth: 'Technical jargon depth vs casual and simple',
  humor: 'Humor and playfulness vs serious and formal',
  hype: 'Exaggeration and urgency vs measured and grounded',
  storytelling: 'Narrative and story-driven vs factual and list-based',
  sentenceLength: 'Long complex sentences vs short punchy ones',
  ctaIntensity: 'Strong calls to action vs subtle or absent',
};

/** Get color class for a voice dimension value */
export function getVoiceDimensionColor(value: number): string {
  if (value >= 70) return 'text-emerald-600';
  if (value >= 40) return 'text-amber-600';
  return 'text-rose-500';
}

export function getVoiceDimensionBgColor(value: number): string {
  if (value >= 70) return 'bg-emerald-500';
  if (value >= 40) return 'bg-amber-500';
  return 'bg-rose-400';
}
