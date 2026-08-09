// ============================================================================
// Evaluation Service — Day 10
// Maker Output Evaluation: Voice Match + Hook Compatibility + Quality Scoring
//
// When Maker produces output, Muse must EVALUATE it before storing as Draft.
// This is the quality gate — it ensures Maker's output aligns with the
// creator's voice, uses proven hook patterns, and meets quality thresholds.
//
// Evaluation is NOT a rubber stamp. It can REJECT output that doesn't
// meet the creator's standards.
// ============================================================================

import { type MakerOutput } from '@/lib/maker-simulator';
import { type CreatorVoiceSnapshot, type HookPatternSummary } from '@/lib/delegation-service';
import { computeConfidence, type ConfidenceLevel } from '@/lib/learning-engine';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Detailed voice match evaluation */
export interface VoiceMatchEvaluation {
  overall: number;              // 0-1 composite score
  toneAlignment: number;        // 0-1 — does output tone match creator's voice?
  paceConsistency: number;      // 0-1 — does output pace match creator's pace?
  vocabularyMatch: number;      // 0-1 — does output vocabulary match creator's?
  avoidTopicsCompliance: number;// 0-1 — did output avoid all forbidden topics?
  strengthUtilization: number;  // 0-1 — did output use creator's strengths?
  breakdown: string[];          // Human-readable explanations for each sub-score
  evidence: string[];           // What data was used to compute scores
}

/** Detailed hook compatibility evaluation */
export interface HookCompatEvaluation {
  overall: number;              // 0-1 composite score
  primaryHookPatternMatch: number;   // 0-1 — does primary hook match best pattern?
  historicalAlignment: number;       // 0-1 — alignment with historical winners?
  hookVariety: number;               // 0-1 — are alternative hooks diverse?
  hookStrength: number;              // 0-1 — are hooks compelling (length, structure)?
  breakdown: string[];          // Human-readable explanations
  evidence: string[];           // What data was used
}

/** Content quality evaluation (beyond voice + hook) */
export interface ContentQualityEvaluation {
  overall: number;              // 0-1 composite score
  scriptStructure: number;      // 0-1 — does script have proper structure (hook, body, CTA)?
  ctaClarity: number;           // 0-1 — is the CTA clear and actionable?
  titleEffectiveness: number;   // 0-1 — is the title compelling?
  captionAlignment: number;     // 0-1 — does caption align with content?
  breakdown: string[];          // Human-readable explanations
  evidence: string[];           // What data was used
}

/** Complete evaluation result */
export interface EvaluationResult {
  evaluationId: string;
  timestamp: string;

  // The three evaluation dimensions
  voiceMatch: VoiceMatchEvaluation;
  hookCompat: HookCompatEvaluation;
  contentQuality: ContentQualityEvaluation;

  // Composite scores
  overallScore: number;         // 0-1 weighted composite
  confidenceLevel: ConfidenceLevel;

  // Pass/fail determination
  passed: boolean;
  failReasons: string[];       // If !passed, why
  passThreshold: number;       // The threshold used

  // What was evaluated
  makerOutput: {
    title: string;
    hookCount: number;
    source: 'live' | 'simulated';
  };

  // Evidence for the evaluation itself (meta-evidence)
  evaluationEvidence: string[];
  dataPointsUsed: number;
}

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

/** Weight configuration for overall score calculation */
const WEIGHTS = {
  voiceMatch: 0.40,    // Voice match is most important — it's the creator's identity
  hookCompat: 0.35,    // Hook compatibility drives audience engagement
  contentQuality: 0.25, // Content quality matters but is secondary
} as const;

/** Pass threshold — Maker output must score at least this to be stored as Draft */
const PASS_THRESHOLD = 0.70;

/** Minimum individual scores — any sub-score below this is a flag */
const MIN_INDIVIDUAL_SCORE = 0.50;

// ---------------------------------------------------------------------------
// Step 1: Evaluate Voice Match
// ---------------------------------------------------------------------------

export function evaluateVoiceMatch(
  output: MakerOutput,
  voice: CreatorVoiceSnapshot,
  hookPatterns: HookPatternSummary[]
): VoiceMatchEvaluation {
  const breakdown: string[] = [];
  const evidence: string[] = [];
  let subScores: number[] = [];

  // --- Tone Alignment ---
  // Check if the output's language matches the creator's tone
  const outputText = `${output.title} ${output.caption} ${output.script} ${output.cta}`.toLowerCase();
  const toneScore = computeToneAlignment(outputText, voice.tone);
  subScores.push(toneScore);
  breakdown.push(`Tone alignment: ${(toneScore * 100).toFixed(0)}% — output ${toneScore >= 0.7 ? 'matches' : 'differs from'} "${voice.tone}" tone`);
  evidence.push(`Creator tone: ${voice.tone}`);

  // --- Pace Consistency ---
  // Check sentence length distribution vs expected pace
  const paceScore = computePaceConsistency(output.script, voice.pace);
  subScores.push(paceScore);
  breakdown.push(`Pace consistency: ${(paceScore * 100).toFixed(0)}% — output ${paceScore >= 0.7 ? 'matches' : 'differs from'} "${voice.pace}" pace`);
  evidence.push(`Creator pace: ${voice.pace}`);

  // --- Vocabulary Match ---
  // Check if output uses the right vocabulary level
  const vocabScore = computeVocabularyMatch(outputText, voice.vocabulary);
  subScores.push(vocabScore);
  breakdown.push(`Vocabulary match: ${(vocabScore * 100).toFixed(0)}% — output ${vocabScore >= 0.7 ? 'uses' : 'doesn\'t use'} "${voice.vocabulary}" vocabulary`);
  evidence.push(`Creator vocabulary: ${voice.vocabulary}`);

  // --- Avoid Topics Compliance ---
  // Check if output respects the "avoid" list
  const avoidScore = computeAvoidCompliance(outputText, voice.avoidTopics);
  subScores.push(avoidScore);
  if (voice.avoidTopics.length > 0) {
    breakdown.push(`Avoid compliance: ${(avoidScore * 100).toFixed(0)}% — output ${avoidScore >= 0.9 ? 'respects' : 'violates'} avoid topics`);
    evidence.push(`Avoid topics: ${voice.avoidTopics.join(', ')}`);
  } else {
    breakdown.push(`Avoid compliance: ${(avoidScore * 100).toFixed(0)}% — no avoid topics specified`);
  }

  // --- Strength Utilization ---
  // Check if output leverages creator's strengths
  const strengthScore = computeStrengthUtilization(outputText, voice.strengths);
  subScores.push(strengthScore);
  if (voice.strengths.length > 0) {
    breakdown.push(`Strength utilization: ${(strengthScore * 100).toFixed(0)}% — output ${strengthScore >= 0.6 ? 'leverages' : 'underutilizes'} creator strengths`);
    evidence.push(`Creator strengths: ${voice.strengths.join(', ')}`);
  } else {
    breakdown.push(`Strength utilization: ${(strengthScore * 100).toFixed(0)}% — no strengths specified`);
  }

  // --- Composite Voice Score ---
  // Weighted average: tone and avoid are most important
  const overall = (
    toneScore * 0.30 +
    paceScore * 0.15 +
    vocabScore * 0.20 +
    avoidScore * 0.20 +
    strengthScore * 0.15
  );

  evidence.push(`Data points: ${hookPatterns.reduce((sum, p) => sum + p.sampleSize, 0)} hook pattern samples`);

  return {
    overall: Math.round(overall * 1000) / 1000,
    toneAlignment: Math.round(toneScore * 1000) / 1000,
    paceConsistency: Math.round(paceScore * 1000) / 1000,
    vocabularyMatch: Math.round(vocabScore * 1000) / 1000,
    avoidTopicsCompliance: Math.round(avoidScore * 1000) / 1000,
    strengthUtilization: Math.round(strengthScore * 1000) / 1000,
    breakdown,
    evidence,
  };
}

// ---------------------------------------------------------------------------
// Step 2: Evaluate Hook Compatibility
// ---------------------------------------------------------------------------

export function evaluateHookCompat(
  output: MakerOutput,
  hookPatterns: HookPatternSummary[],
  historicalWinners: string[]
): HookCompatEvaluation {
  const breakdown: string[] = [];
  const evidence: string[] = [];

  // --- Primary Hook Pattern Match ---
  // Does the primary hook (in script or title) match the best-known pattern?
  const primaryHook = extractPrimaryHook(output);
  const patternMatchScore = computePatternMatch(primaryHook, hookPatterns);
  breakdown.push(`Pattern match: ${(patternMatchScore * 100).toFixed(0)}% — primary hook ${patternMatchScore >= 0.7 ? 'aligns with' : 'differs from'} best pattern`);
  if (hookPatterns.length > 0) {
    evidence.push(`Best pattern: ${hookPatterns[0].pattern} (${(hookPatterns[0].avgEffectiveness * 100).toFixed(0)}% avg, ${hookPatterns[0].sampleSize} samples)`);
  }

  // --- Historical Alignment ---
  // Does the output resemble what worked before?
  const historicalScore = computeHistoricalAlignment(output, historicalWinners);
  breakdown.push(`Historical alignment: ${(historicalScore * 100).toFixed(0)}% — output ${historicalScore >= 0.6 ? 'resembles' : 'differs from'} past winners`);
  if (historicalWinners.length > 0) {
    evidence.push(`Historical winners: ${historicalWinners.length} items`);
  }

  // --- Hook Variety ---
  // Are alternative hooks diverse (not all same pattern)?
  const varietyScore = computeHookVariety(output.alternativeHooks);
  breakdown.push(`Hook variety: ${(varietyScore * 100).toFixed(0)}% — ${varietyScore >= 0.7 ? 'diverse' : 'repetitive'} alternative hooks`);
  evidence.push(`Hook count: 1 primary + ${output.alternativeHooks.length} alternatives`);

  // --- Hook Strength ---
  // Are hooks compelling (proper length, structure, opening)?
  const strengthScore = computeHookStrength(output);
  breakdown.push(`Hook strength: ${(strengthScore * 100).toFixed(0)}% — hooks ${strengthScore >= 0.7 ? 'are' : 'aren\'t'} compelling`);

  // --- Composite Hook Score ---
  const overall = (
    patternMatchScore * 0.35 +
    historicalScore * 0.25 +
    varietyScore * 0.20 +
    strengthScore * 0.20
  );

  evidence.push(`Data points: ${hookPatterns.reduce((sum, p) => sum + p.sampleSize, 0)} hook pattern samples + ${historicalWinners.length} winners`);

  return {
    overall: Math.round(overall * 1000) / 1000,
    primaryHookPatternMatch: Math.round(patternMatchScore * 1000) / 1000,
    historicalAlignment: Math.round(historicalScore * 1000) / 1000,
    hookVariety: Math.round(varietyScore * 1000) / 1000,
    hookStrength: Math.round(strengthScore * 1000) / 1000,
    breakdown,
    evidence,
  };
}

// ---------------------------------------------------------------------------
// Step 3: Evaluate Content Quality
// ---------------------------------------------------------------------------

export function evaluateContentQuality(output: MakerOutput): ContentQualityEvaluation {
  const breakdown: string[] = [];
  const evidence: string[] = [];

  // --- Script Structure ---
  // Does the script have hook → body → CTA?
  const structureScore = computeScriptStructure(output.script);
  breakdown.push(`Script structure: ${(structureScore * 100).toFixed(0)}% — ${structureScore >= 0.8 ? 'complete' : 'incomplete'} structure (hook/body/CTA)`);
  evidence.push(`Script length: ${output.script.length} chars`);

  // --- CTA Clarity ---
  // Is the CTA specific and actionable?
  const ctaScore = computeCtaClarity(output.cta);
  breakdown.push(`CTA clarity: ${(ctaScore * 100).toFixed(0)}% — CTA ${ctaScore >= 0.7 ? 'is' : 'isn\'t'} clear and actionable`);
  evidence.push(`CTA: "${output.cta.substring(0, 60)}${output.cta.length > 60 ? '...' : ''}"`);

  // --- Title Effectiveness ---
  // Is the title compelling?
  const titleScore = computeTitleEffectiveness(output.title);
  breakdown.push(`Title effectiveness: ${(titleScore * 100).toFixed(0)}% — title ${titleScore >= 0.7 ? 'is' : 'isn\'t'} compelling`);
  evidence.push(`Title: "${output.title}"`);

  // --- Caption Alignment ---
  // Does caption align with the content?
  const captionScore = computeCaptionAlignment(output.caption, output.title, output.script);
  breakdown.push(`Caption alignment: ${(captionScore * 100).toFixed(0)}% — caption ${captionScore >= 0.7 ? 'aligns' : 'misaligns'} with content`);
  evidence.push(`Caption: "${output.caption.substring(0, 60)}${output.caption.length > 60 ? '...' : ''}"`);

  // --- Composite Quality Score ---
  const overall = (
    structureScore * 0.35 +
    ctaScore * 0.25 +
    titleScore * 0.25 +
    captionScore * 0.15
  );

  return {
    overall: Math.round(overall * 1000) / 1000,
    scriptStructure: Math.round(structureScore * 1000) / 1000,
    ctaClarity: Math.round(ctaScore * 1000) / 1000,
    titleEffectiveness: Math.round(titleScore * 1000) / 1000,
    captionAlignment: Math.round(captionScore * 1000) / 1000,
    breakdown,
    evidence,
  };
}

// ---------------------------------------------------------------------------
// Step 4: Full Evaluation Pipeline
// ---------------------------------------------------------------------------

export function evaluateMakerOutput(
  output: MakerOutput,
  voice: CreatorVoiceSnapshot,
  hookPatterns: HookPatternSummary[],
  historicalWinners: string[]
): EvaluationResult {
  const evaluationId = `eval_${Date.now()}`;

  // Run all three evaluation dimensions
  const voiceMatch = evaluateVoiceMatch(output, voice, hookPatterns);
  const hookCompat = evaluateHookCompat(output, hookPatterns, historicalWinners);
  const contentQuality = evaluateContentQuality(output);

  // Composite overall score (weighted)
  const overallScore = (
    voiceMatch.overall * WEIGHTS.voiceMatch +
    hookCompat.overall * WEIGHTS.hookCompat +
    contentQuality.overall * WEIGHTS.contentQuality
  );

  // Determine pass/fail
  const failReasons: string[] = [];
  let passed = true;

  if (overallScore < PASS_THRESHOLD) {
    passed = false;
    failReasons.push(`Overall score ${(overallScore * 100).toFixed(0)}% below threshold ${(PASS_THRESHOLD * 100).toFixed(0)}%`);
  }

  // Check individual sub-scores for critical failures
  if (voiceMatch.avoidTopicsCompliance < MIN_INDIVIDUAL_SCORE) {
    passed = false;
    failReasons.push(`Avoid topics compliance ${(voiceMatch.avoidTopicsCompliance * 100).toFixed(0)}% below minimum ${(MIN_INDIVIDUAL_SCORE * 100).toFixed(0)}%`);
  }

  if (voiceMatch.toneAlignment < MIN_INDIVIDUAL_SCORE) {
    passed = false;
    failReasons.push(`Tone alignment ${(voiceMatch.toneAlignment * 100).toFixed(0)}% below minimum ${(MIN_INDIVIDUAL_SCORE * 100).toFixed(0)}%`);
  }

  // Confidence level based on data points
  const dataPointsUsed = hookPatterns.reduce((sum, p) => sum + p.sampleSize, 0) + historicalWinners.length;
  const confidenceLevel = computeConfidence(dataPointsUsed);

  // Meta-evidence for the evaluation itself
  const evaluationEvidence: string[] = [];
  evaluationEvidence.push(`Evaluation ID: ${evaluationId}`);
  evaluationEvidence.push(`Pass threshold: ${(PASS_THRESHOLD * 100).toFixed(0)}%`);
  evaluationEvidence.push(`Weights: voice=${(WEIGHTS.voiceMatch * 100).toFixed(0)}%, hook=${(WEIGHTS.hookCompat * 100).toFixed(0)}%, quality=${(WEIGHTS.contentQuality * 100).toFixed(0)}%`);
  evaluationEvidence.push(`Data points used: ${dataPointsUsed}`);
  evaluationEvidence.push(`Confidence: ${confidenceLevel}`);
  if (!passed) {
    evaluationEvidence.push(`Failed: ${failReasons.join('; ')}`);
  }

  return {
    evaluationId,
    timestamp: new Date().toISOString(),
    voiceMatch,
    hookCompat,
    contentQuality,
    overallScore: Math.round(overallScore * 1000) / 1000,
    confidenceLevel,
    passed,
    failReasons,
    passThreshold: PASS_THRESHOLD,
    makerOutput: {
      title: output.title,
      hookCount: output.alternativeHooks.length + 1,
      source: output.source,
    },
    evaluationEvidence,
    dataPointsUsed,
  };
}

// ---------------------------------------------------------------------------
// Sub-score computation helpers
// ---------------------------------------------------------------------------

function computeToneAlignment(text: string, expectedTone: string): number {
  // Score based on whether output language matches expected tone
  const toneIndicators: Record<string, { present: string[]; absent: string[] }> = {
    direct: {
      present: ['exactly', 'here\'s', 'this is', 'the fact', 'the reason', 'here\'s why', 'that\'s why'],
      absent: ['perhaps', 'maybe', 'might', 'could possibly', 'i think'],
    },
    educational: {
      present: ['step', 'learn', 'understand', 'how to', 'guide', 'framework', 'walk through', 'walk you'],
      absent: ['just', 'simply', 'obviously', 'trivially'],
    },
    witty: {
      present: ['funny', 'ironic', 'plot twist', ' spoiler', 'joke'],
      absent: [],
    },
    narrative: {
      present: ['story', 'last week', 'i spent', 'then i', 'it turned out', 'let me'],
      absent: [],
    },
  };

  const indicators = toneIndicators[expectedTone] ?? toneIndicators.direct;
  const lowerText = text.toLowerCase();

  let matchCount = 0;
  for (const phrase of indicators.present) {
    if (lowerText.includes(phrase.toLowerCase())) matchCount++;
  }

  let violationCount = 0;
  for (const phrase of indicators.absent) {
    if (lowerText.includes(phrase.toLowerCase())) violationCount++;
  }

  // Base score from matches
  const presenceRatio = indicators.present.length > 0 ? matchCount / indicators.present.length : 0.5;
  const violationPenalty = indicators.absent.length > 0 ? violationCount / indicators.absent.length : 0;

  // Combine: baseline 0.60, + presence bonus, - violation penalty
  const score = 0.60 + presenceRatio * 0.30 - violationPenalty * 0.20;
  return Math.max(0.30, Math.min(1.0, score));
}

function computePaceConsistency(script: string, expectedPace: string): number {
  // Analyze sentence lengths to determine pace
  const sentences = script.split(/[.!?]+/).filter((s) => s.trim().length > 10);
  if (sentences.length === 0) return 0.70;

  const avgLength = sentences.reduce((sum, s) => sum + s.split(/\s+/).length, 0) / sentences.length;

  // Expected word counts per sentence for each pace
  const paceExpect: Record<string, { min: number; max: number; ideal: number }> = {
    fast: { min: 5, max: 20, ideal: 12 },
    measured: { min: 10, max: 30, ideal: 18 },
    slow: { min: 15, max: 40, ideal: 25 },
  };

  const expected = paceExpect[expectedPace] ?? paceExpect.measured;

  // Score based on how close avgLength is to ideal
  const deviation = Math.abs(avgLength - expected.ideal) / expected.ideal;
  const score = Math.max(0.40, 1.0 - deviation * 0.5);

  return score;
}

function computeVocabularyMatch(text: string, expectedVocab: string): number {
  // Check vocabulary level in output
  const vocabIndicators: Record<string, { words: string[]; penalty: string[] }> = {
    technical: {
      words: ['implement', 'architecture', 'optimize', 'production', 'framework', 'debug', 'deploy', 'iterate', 'instrument', 'compound'],
      penalty: ['basically', 'simply', 'just like', 'super easy', 'no brainer'],
    },
    casual: {
      words: ['cool', 'awesome', 'stuff', 'thing', 'pretty', 'kinda', 'gonna'],
      penalty: ['therefore', 'consequently', 'henceforth', 'notwithstanding'],
    },
    academic: {
      words: ['therefore', 'consequently', 'demonstrates', 'hypothesis', 'empirical', 'analysis'],
      penalty: ['cool', 'awesome', 'stuff', 'gonna'],
    },
  };

  const vocab = vocabIndicators[expectedVocab] ?? vocabIndicators.technical;
  const lowerText = text.toLowerCase();

  let matchCount = 0;
  for (const word of vocab.words) {
    if (lowerText.includes(word.toLowerCase())) matchCount++;
  }

  let penaltyCount = 0;
  for (const word of vocab.penalty) {
    if (lowerText.includes(word.toLowerCase())) penaltyCount++;
  }

  const matchRatio = vocab.words.length > 0 ? matchCount / vocab.words.length : 0.5;
  const penaltyRatio = vocab.penalty.length > 0 ? penaltyCount / vocab.penalty.length : 0;

  const score = 0.55 + matchRatio * 0.35 - penaltyRatio * 0.15;
  return Math.max(0.30, Math.min(1.0, score));
}

function computeAvoidCompliance(text: string, avoidTopics: string[]): number {
  if (avoidTopics.length === 0) return 1.0; // No restrictions = perfect compliance

  const lowerText = text.toLowerCase();
  let violations = 0;

  for (const topic of avoidTopics) {
    // Check for key phrases from each avoid topic
    const topicLower = topic.toLowerCase();
    const keywords = topicLower.split(/\s+/).filter((w) => w.length > 3);
    for (const keyword of keywords) {
      if (lowerText.includes(keyword)) {
        violations++;
        break; // One violation per topic
      }
    }
  }

  const violationRatio = violations / avoidTopics.length;
  return Math.max(0.20, 1.0 - violationRatio);
}

function computeStrengthUtilization(text: string, strengths: string[]): number {
  if (strengths.length === 0) return 0.70; // No strengths specified = neutral

  const lowerText = text.toLowerCase();
  let utilized = 0;

  // Map strengths to keywords that indicate utilization
  const strengthKeywords: Record<string, string[]> = {
    'code walkthroughs': ['code', 'walkthrough', 'step by step', 'implementation', 'here\'s the'],
    'architecture decisions': ['architecture', 'design', 'decision', 'trade-off', 'approach'],
    'debugging strategies': ['debug', 'debugging', 'fix', 'issue', 'error', 'solve'],
    'tool comparisons': ['compare', 'vs', 'alternative', 'better', 'trade-off'],
  };

  for (const strength of strengths) {
    const keywords = strengthKeywords[strength] ?? strength.toLowerCase().split(/\s+/);
    for (const keyword of keywords) {
      if (lowerText.includes(keyword.toLowerCase())) {
        utilized++;
        break; // One utilization per strength
      }
    }
  }

  const ratio = utilized / strengths.length;
  return 0.40 + ratio * 0.55; // 0.40 base + up to 0.55 bonus
}

function extractPrimaryHook(output: MakerOutput): string {
  // Extract the hook from the script's [HOOK] section
  const hookMatch = output.script.match(/\[HOOK\]\s*\n(.+)/);
  if (hookMatch) return hookMatch[1].trim();
  // Fallback: first sentence of script
  const firstSentence = output.script.split(/[.!?]/)[0];
  return firstSentence?.trim() ?? output.title;
}

function computePatternMatch(hook: string, patterns: HookPatternSummary[]): number {
  if (patterns.length === 0) return 0.75; // No pattern data = neutral

  const hookLower = hook.toLowerCase();

  // Map patterns to their textual indicators
  const patternIndicators: Record<string, string[]> = {
    contrarian_claim: ['wrong', "they're wrong", 'everyone says', 'myth', 'misconception'],
    question: ['what if', 'why do', 'how could', '?'],
    story: ['last week', 'i spent', 'then i', 'story', 'it turned out'],
    statistic: ['%', 'percent', 'study', 'data', 'research'],
    tutorial: ['step', 'how to', 'guide', 'build', 'setup'],
    listicle: ['5 ', '7 ', 'top 5', 'mistakes', 'reasons'],
    analogy: ['like a', 'think of', 'imagine', 'picture', 'metaphor'],
    personal: ['i avoided', 'i tried', 'changed how', 'for me'],
  };

  let bestScore = 0;

  for (const pattern of patterns) {
    const indicators = patternIndicators[pattern.pattern] ?? [];
    if (indicators.length === 0) continue;

    let matchCount = 0;
    for (const indicator of indicators) {
      if (hookLower.includes(indicator.toLowerCase())) matchCount++;
    }

    const matchRatio = matchCount / indicators.length;
    // Weight by pattern's effectiveness and confidence
    const score = matchRatio * pattern.avgEffectiveness;
    if (score > bestScore) bestScore = score;
  }

  // If no patterns matched at all, check basic hook quality
  if (bestScore === 0) {
    return hook.length > 20 ? 0.60 : 0.40;
  }

  return Math.min(0.95, bestScore + 0.30); // Boost base since we found a pattern
}

function computeHistoricalAlignment(output: MakerOutput, historicalWinners: string[]): number {
  if (historicalWinners.length === 0) return 0.70; // No history = neutral

  const outputText = `${output.title} ${output.caption}`.toLowerCase();
  let alignmentScore = 0;

  // Check if output's language resembles historical winners
  for (const winner of historicalWinners) {
    const winnerLower = winner.toLowerCase();
    const winnerWords = winnerLower.split(/\s+/).filter((w) => w.length > 4);

    let matchCount = 0;
    for (const word of winnerWords) {
      if (outputText.includes(word)) matchCount++;
    }

    if (winnerWords.length > 0) {
      alignmentScore += matchCount / winnerWords.length;
    }
  }

  const avgAlignment = alignmentScore / historicalWinners.length;
  return 0.50 + avgAlignment * 0.45; // 0.50 base + up to 0.45 bonus
}

function computeHookVariety(alternativeHooks: string[]): number {
  if (alternativeHooks.length === 0) return 0.40;
  if (alternativeHooks.length === 1) return 0.55;

  // Check if hooks start differently (diverse patterns)
  const starters = new Set<string>();
  for (const hook of alternativeHooks) {
    const start = hook.split(/\s+/).slice(0, 2).join(' ').toLowerCase();
    starters.add(start);
  }

  // Also check length variety
  const lengths = alternativeHooks.map((h) => h.length);
  const avgLen = lengths.reduce((a, b) => a + b, 0) / lengths.length;
  const lenVariance = lengths.reduce((sum, l) => sum + Math.abs(l - avgLen), 0) / lengths.length;

  const startVariety = starters.size / alternativeHooks.length;
  const lenVariety = Math.min(1.0, lenVariance / 50); // Normalize variance

  return 0.50 + startVariety * 0.30 + lenVariety * 0.20;
}

function computeHookStrength(output: MakerOutput): number {
  // Check all hooks for compelling characteristics
  const allHooks = [extractPrimaryHook(output), ...output.alternativeHooks];

  let totalStrength = 0;
  for (const hook of allHooks) {
    let strength = 0.50; // baseline

    // Good length (20-100 chars)
    if (hook.length >= 20 && hook.length <= 100) strength += 0.15;
    else if (hook.length > 100) strength += 0.05; // Too long but has content

    // Starts with a strong word
    const strongStarts = ['what', 'why', 'how', 'everyone', 'nobody', 'i', 'last', '93%', '5', '7'];
    const firstWord = hook.split(/\s+/)[0]?.toLowerCase() ?? '';
    if (strongStarts.some((s) => firstWord.startsWith(s))) strength += 0.15;

    // Contains a number (statistical hooks)
    if (/\d/.test(hook)) strength += 0.10;

    // Contains a question mark
    if (hook.includes('?')) strength += 0.05;

    totalStrength += Math.min(1.0, strength);
  }

  return totalStrength / allHooks.length;
}

function computeScriptStructure(script: string): number {
  let score = 0;

  // Check for key structural elements
  const hasHook = /\[HOOK\]/i.test(script) || script.includes('HOOK');
  const hasBody = /\[CORE|PROOF|FRAMEWORK|INSIGHT\]/i.test(script);
  const hasCta = /\[CTA\]/i.test(script) || script.includes('CTA');
  const hasEnd = /\[END\]/i.test(script);

  if (hasHook) score += 0.30;
  if (hasBody) score += 0.40;
  if (hasCta) score += 0.20;
  if (hasEnd) score += 0.10;

  return Math.max(0.20, score);
}

function computeCtaClarity(cta: string): number {
  if (!cta || cta.length < 5) return 0.20;

  let score = 0.50; // baseline

  // CTA should be actionable
  const actionWords = ['follow', 'subscribe', 'hit', 'click', 'try', 'download', 'share', 'join', 'check'];
  const ctaLower = cta.toLowerCase();
  for (const word of actionWords) {
    if (ctaLower.includes(word)) {
      score += 0.20;
      break;
    }
  }

  // CTA should mention the creator or channel
  if (ctaLower.includes('for more') || ctaLower.includes('subscribe') || ctaLower.includes('follow')) {
    score += 0.15;
  }

  // Reasonable length
  if (cta.length >= 20 && cta.length <= 200) score += 0.15;

  return Math.min(1.0, score);
}

function computeTitleEffectiveness(title: string): number {
  if (!title || title.length < 5) return 0.20;

  let score = 0.50; // baseline

  // Title should be compelling
  const compellingIndicators = ['nobody', 'secret', 'wrong', 'why', 'how', 'framework', 'mistake', 'actually'];
  const titleLower = title.toLowerCase();
  for (const indicator of compellingIndicators) {
    if (titleLower.includes(indicator)) {
      score += 0.15;
      break;
    }
  }

  // Colon pattern (Topic: Subtitle) is effective
  if (title.includes(':')) score += 0.10;

  // Reasonable length (20-80 chars for video title)
  if (title.length >= 20 && title.length <= 80) score += 0.15;
  else if (title.length > 80) score += 0.05;

  return Math.min(1.0, score);
}

function computeCaptionAlignment(caption: string, title: string, script: string): number {
  if (!caption || caption.length < 5) return 0.50;

  let score = 0.60; // baseline

  // Caption should reference the same topic as title
  const titleWords = new Set(title.toLowerCase().split(/\s+/).filter((w) => w.length > 4));
  const captionLower = caption.toLowerCase();
  let overlap = 0;
  for (const word of titleWords) {
    if (captionLower.includes(word)) overlap++;
  }
  if (titleWords.size > 0) {
    score += (overlap / titleWords.size) * 0.25;
  }

  // Caption with arrow/link indicator
  if (caption.includes('→') || caption.includes('→') || caption.includes('link')) {
    score += 0.15;
  }

  return Math.min(1.0, score);
}

// ---------------------------------------------------------------------------
// Utility: Get evaluation thresholds for display
// ---------------------------------------------------------------------------

export function getEvaluationThresholds() {
  return {
    passThreshold: PASS_THRESHOLD,
    minIndividualScore: MIN_INDIVIDUAL_SCORE,
    weights: WEIGHTS,
    description: 'Maker output must score ≥70% overall and ≥50% on all critical sub-scores to pass evaluation',
  };
}
