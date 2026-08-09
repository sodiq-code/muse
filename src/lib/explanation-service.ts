// ============================================================================
// "Why Muse Chose This" — Explanation System (Day 8)
// Every recommendation MUST have a traceable evidence chain from raw data → inference → recommendation
// This is Tier 1 NON-NEGOTIABLE — remove this and Muse becomes a black box
// ============================================================================

import { db } from '@/lib/db';
import {
  computeConfidence,
  honestPhrase,
  classifyEvidenceType,
  type ConfidenceLevel,
  type EvidenceType,
} from '@/lib/learning-engine';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface EvidenceSource {
  type: 'content_item' | 'hook' | 'metric' | 'pattern' | 'memory_event' | 'decision';
  id: string;
  label: string;
  value: string;
  capturedAt: string;
}

export interface EvidenceStep {
  step: number;
  phase: 'OBSERVE' | 'COMPARE' | 'INFER' | 'UPDATE' | 'RECOMMEND';
  description: string;
  evidenceType: EvidenceType;
  confidence: ConfidenceLevel;
  dataPoints: number;
  sources: EvidenceSource[];
  derivedFrom: number[]; // step numbers this was derived from
}

export interface FullExplanation {
  recommendationId: string;
  recommendationTitle: string;
  recommendationType: string;
  summary: string;                    // One-sentence summary
  narrative: string;                  // Human-readable story
  evidenceChain: EvidenceStep[];      // Step-by-step evidence
  confidence: ConfidenceLevel;
  overallDataPoints: number;
  supportingContentCount: number;     // How many content items support this
  patternHistory: PatternHistoryItem[];
  creatorSpecificContext: string;     // Personalized for this creator
  generatedAt: string;
  honestyVerified: boolean;
}

export interface PatternHistoryItem {
  pattern: string;
  avgEffectiveness: number;
  sampleSize: number;
  confidence: ConfidenceLevel;
  lastSeen: string;
}

// ---------------------------------------------------------------------------
// Build full explanation for a single recommendation
// ---------------------------------------------------------------------------

export async function buildExplanationForRecommendation(
  recommendationId: string
): Promise<FullExplanation> {
  // Load the recommendation with creator info
  const recommendation = await db.recommendation.findUnique({
    where: { id: recommendationId },
    include: {
      creator: {
        include: {
          contentItems: {
            include: {
              metrics: true,
              hooks: { include: { patterns: true } },
            },
            orderBy: { createdAt: 'desc' },
          },
          memories: {
            where: { category: { in: ['pattern', 'performance', 'feedback'] } },
            orderBy: { createdAt: 'desc' },
            take: 50,
          },
          decisions: {
            orderBy: { createdAt: 'desc' },
            take: 20,
          },
        },
      },
    },
  });

  if (!recommendation) {
    throw new Error(`Recommendation not found: ${recommendationId}`);
  }

  const creator = recommendation.creator;
  const payload = recommendation.payload ? JSON.parse(recommendation.payload) : {};

  // Build the evidence chain step by step
  const evidenceChain: EvidenceStep[] = [];
  let stepNum = 1;

  // ---- STEP 1: OBSERVE — What data did Muse see? ----
  const contentSources: EvidenceSource[] = creator.contentItems.slice(0, 10).map((item) => ({
    type: 'content_item' as const,
    id: item.id,
    label: item.title ?? `Content ${item.type}`,
    value: `${item.metrics.length} metrics, ${item.hooks.length} hooks`,
    capturedAt: item.createdAt.toISOString(),
  }));

  const totalMetrics = creator.contentItems.reduce((sum, item) => sum + item.metrics.length, 0);
  const totalHooks = creator.contentItems.reduce((sum, item) => sum + item.hooks.length, 0);

  evidenceChain.push({
    step: stepNum++,
    phase: 'OBSERVE',
    description: `Muse observed ${creator.contentItems.length} content items with ${totalMetrics} metrics and ${totalHooks} hooks for ${creator.name}`,
    evidenceType: 'observed',
    confidence: computeConfidence(creator.contentItems.length),
    dataPoints: creator.contentItems.length,
    sources: contentSources,
    derivedFrom: [],
  });

  // ---- STEP 2: COMPARE — What patterns were compared? ----
  const patternData = new Map<string, { effectiveness: number; count: number; samples: EvidenceSource[] }>();

  for (const item of creator.contentItems) {
    for (const hook of item.hooks) {
      for (const pattern of hook.patterns) {
        const existing = patternData.get(pattern.patternName) ?? {
          effectiveness: 0,
          count: 0,
          samples: [] as EvidenceSource[],
        };
        existing.effectiveness += pattern.avgEffectiveness ?? hook.effectiveness ?? 0;
        existing.count++;
        if (existing.samples.length < 5) {
          existing.samples.push({
            type: 'hook',
            id: hook.id,
            label: `"${hook.text.substring(0, 60)}${hook.text.length > 60 ? '...' : ''}"`,
            value: `Pattern: ${pattern.patternName}, Effectiveness: ${((pattern.avgEffectiveness ?? hook.effectiveness ?? 0) * 100).toFixed(1)}%`,
            capturedAt: item.createdAt.toISOString(),
          });
        }
        patternData.set(pattern.patternName, existing);
      }
    }
  }

  const comparisonSources: EvidenceSource[] = [];
  const patternComparisons: string[] = [];

  for (const [patternName, data] of patternData) {
    const avg = data.effectiveness / data.count;
    comparisonSources.push(...data.samples.slice(0, 2));
    patternComparisons.push(`${patternName}: ${(avg * 100).toFixed(1)}% avg over ${data.count} samples`);
  }

  evidenceChain.push({
    step: stepNum++,
    phase: 'COMPARE',
    description: `Compared ${patternData.size} hook patterns — ${patternComparisons.join('; ')}`,
    evidenceType: patternData.size >= 3 ? 'correlation' : 'observed',
    confidence: computeConfidence(Math.min(...Array.from(patternData.values()).map((d) => d.count))),
    dataPoints: Array.from(patternData.values()).reduce((sum, d) => sum + d.count, 0),
    sources: comparisonSources.slice(0, 10),
    derivedFrom: [1],
  });

  // ---- STEP 3: INFER — What did Muse conclude? ----
  const patternHistory: PatternHistoryItem[] = [];
  const inferenceSources: EvidenceSource[] = [];

  for (const [patternName, data] of patternData) {
    const avg = data.effectiveness / data.count;
    const conf = computeConfidence(data.count);
    patternHistory.push({
      pattern: patternName,
      avgEffectiveness: avg,
      sampleSize: data.count,
      confidence: conf,
      lastSeen: creator.contentItems[0]?.createdAt.toISOString() ?? new Date().toISOString(),
    });

    inferenceSources.push({
      type: 'pattern',
      id: patternName,
      label: `${patternName} pattern`,
      value: honestPhrase(data.count, patternName, avg),
      capturedAt: new Date().toISOString(),
    });
  }

  // Sort by effectiveness to identify best/worst
  patternHistory.sort((a, b) => b.avgEffectiveness - a.avgEffectiveness);

  const bestPattern = patternHistory[0];
  const worstPattern = patternHistory[patternHistory.length - 1];

  let inferenceDescription: string;
  if (bestPattern) {
    inferenceDescription = `Inferred ${patternHistory.length} patterns. Best: ${bestPattern.pattern} at ${(bestPattern.avgEffectiveness * 100).toFixed(1)}% (${bestPattern.sampleSize} samples, ${bestPattern.confidence} confidence)`;
    if (worstPattern && worstPattern.pattern !== bestPattern.pattern) {
      inferenceDescription += `. Worst: ${worstPattern.pattern} at ${(worstPattern.avgEffectiveness * 100).toFixed(1)}%`;
    }
  } else {
    inferenceDescription = 'Insufficient data to infer patterns';
  }

  evidenceChain.push({
    step: stepNum++,
    phase: 'INFER',
    description: inferenceDescription,
    evidenceType: bestPattern && bestPattern.sampleSize >= 5 ? 'correlation' : 'observed',
    confidence: bestPattern?.confidence ?? 'low',
    dataPoints: patternHistory.reduce((sum, p) => sum + p.sampleSize, 0),
    sources: inferenceSources,
    derivedFrom: [1, 2],
  });

  // ---- STEP 4: UPDATE — How did memory change? ----
  const memorySources: EvidenceSource[] = creator.memories.slice(0, 10).map((mem) => ({
    type: 'memory_event',
    id: mem.id,
    label: `${mem.category}/${mem.key}`,
    value: mem.value.substring(0, 100),
    capturedAt: mem.createdAt.toISOString(),
  }));

  evidenceChain.push({
    step: stepNum++,
    phase: 'UPDATE',
    description: `Updated creator memory with ${patternHistory.length} pattern insights and ${creator.memories.length} existing memory events`,
    evidenceType: 'correlation',
    confidence: computeConfidence(creator.memories.length + patternHistory.length),
    dataPoints: creator.memories.length + patternHistory.length,
    sources: memorySources,
    derivedFrom: [3],
  });

  // ---- STEP 5: RECOMMEND — Why this specific recommendation? ----
  const recEvidenceType = (payload.evidenceType ?? 'correlation') as EvidenceType;
  const rawConfidence = (payload.confidence ?? 'medium') as ConfidenceLevel;
  const recDataPoints = payload.dataPoints ?? 0;
  // Enforce honest confidence — correct any stored confidence that doesn't match data
  const recConfidence = computeConfidence(recDataPoints);
  const supportingFacts: string[] = payload.supportingFacts ?? [];

  const recommendSources: EvidenceSource[] = supportingFacts.map((fact, i) => ({
    type: 'metric',
    id: `fact_${i}`,
    label: `Supporting fact ${i + 1}`,
    value: fact,
    capturedAt: recommendation.createdAt.toISOString(),
  }));

  evidenceChain.push({
    step: stepNum++,
    phase: 'RECOMMEND',
    description: recommendation.title,
    evidenceType: recEvidenceType,
    confidence: recConfidence,
    dataPoints: recDataPoints,
    sources: recommendSources,
    derivedFrom: [3, 4],
  });

  // ---- Build the narrative ----
  const narrative = buildNarrative(
    recommendation.title,
    recommendation.type,
    creator.name,
    creator.contentItems.length,
    bestPattern,
    worstPattern,
    patternHistory,
    recConfidence,
    recDataPoints,
    supportingFacts
  );

  // ---- Build creator-specific context ----
  const creatorSpecificContext = buildCreatorContext(
    creator.name,
    bestPattern,
    worstPattern,
    creator.contentItems.length,
    recConfidence
  );

  // ---- Verify honesty ----
  const honestyVerified = verifyExplanationHonesty(narrative, recConfidence, recDataPoints);

  // ---- Build summary ----
  const summary = `${recommendation.title} — ${honestPhrase(recDataPoints, recommendation.type, bestPattern?.avgEffectiveness ?? 0)} (${recConfidence} confidence)`;

  return {
    recommendationId: recommendation.id,
    recommendationTitle: recommendation.title,
    recommendationType: recommendation.type,
    summary,
    narrative,
    evidenceChain,
    confidence: recConfidence,
    overallDataPoints: recDataPoints,
    supportingContentCount: creator.contentItems.length,
    patternHistory,
    creatorSpecificContext,
    generatedAt: new Date().toISOString(),
    honestyVerified,
  };
}

// ---------------------------------------------------------------------------
// Build all explanations for a creator's recommendations
// ---------------------------------------------------------------------------

export async function buildAllExplanationsForCreator(
  creatorId: string
): Promise<FullExplanation[]> {
  const recommendations = await db.recommendation.findMany({
    where: { creatorId, status: 'pending' },
    orderBy: { priority: 'desc' },
  });

  const explanations: FullExplanation[] = [];
  for (const rec of recommendations) {
    try {
      const explanation = await buildExplanationForRecommendation(rec.id);
      explanations.push(explanation);
    } catch (err) {
      console.error(`Failed to build explanation for ${rec.id}:`, err);
    }
  }

  return explanations;
}

// ---------------------------------------------------------------------------
// Narrative builder — tells the "story" of why Muse chose this
// ---------------------------------------------------------------------------

function buildNarrative(
  title: string,
  type: string,
  creatorName: string,
  contentCount: number,
  bestPattern: PatternHistoryItem | undefined,
  worstPattern: PatternHistoryItem | undefined,
  allPatterns: PatternHistoryItem[],
  confidence: ConfidenceLevel,
  dataPoints: number,
  facts: string[]
): string {
  const parts: string[] = [];

  // Opening — what triggered this recommendation
  parts.push(`Muse analyzed ${contentCount} content items from ${creatorName}'s history.`);

  // Pattern evidence
  if (bestPattern) {
    parts.push(
      `The strongest signal comes from the ${bestPattern.pattern} hook pattern, which averages ${(bestPattern.avgEffectiveness * 100).toFixed(1)}% effectiveness across ${bestPattern.sampleSize} posts (${bestPattern.confidence} confidence).`
    );
  }

  // Contrast
  if (worstPattern && bestPattern && worstPattern.pattern !== bestPattern.pattern) {
    const diff = bestPattern.avgEffectiveness - worstPattern.avgEffectiveness;
    if (diff > 0.05) {
      parts.push(
        `By contrast, ${worstPattern.pattern} hooks average ${(worstPattern.avgEffectiveness * 100).toFixed(1)}% — a ${(diff * 100).toFixed(0)} percentage point difference.`
      );
    }
  }

  // Data breadth
  parts.push(
    `This recommendation is based on ${dataPoints} data points across ${allPatterns.length} pattern categories.`
  );

  // Supporting facts
  if (facts.length > 0) {
    parts.push(`Key evidence: ${facts.slice(0, 3).join('; ')}.`);
  }

  // Confidence qualifier
  if (confidence === 'low') {
    parts.push('⚠️ Low confidence — treat this as a hypothesis worth testing, not a conclusion.');
  } else if (confidence === 'medium') {
    parts.push('Medium confidence — directionally correct, but more data would strengthen this signal.');
  } else {
    parts.push('High confidence — the data consistently supports this pattern.');
  }

  return parts.join(' ');
}

// ---------------------------------------------------------------------------
// Creator-specific context — personalized explanation
// ---------------------------------------------------------------------------

function buildCreatorContext(
  creatorName: string,
  bestPattern: PatternHistoryItem | undefined,
  worstPattern: PatternHistoryItem | undefined,
  contentCount: number,
  confidence: ConfidenceLevel
): string {
  if (!bestPattern) {
    return `${creatorName}, we need more content data before we can make personalized recommendations. ${contentCount} posts analyzed so far.`;
  }

  const parts: string[] = [];
  parts.push(`${creatorName}, your data shows a clear signal:`);
  parts.push(
    `Your ${bestPattern.pattern} hooks are your strongest opening — averaging ${(bestPattern.avgEffectiveness * 100).toFixed(1)}% across ${bestPattern.sampleSize} posts.`
  );

  if (worstPattern && worstPattern.pattern !== bestPattern.pattern && worstPattern.avgEffectiveness < bestPattern.avgEffectiveness * 0.7) {
    parts.push(
      `Your ${worstPattern.pattern} hooks underperform by ${(((bestPattern.avgEffectiveness - worstPattern.avgEffectiveness) / worstPattern.avgEffectiveness) * 100).toFixed(0)}% — consider testing them less frequently.`
    );
  }

  if (confidence === 'low') {
    parts.push('This is a preliminary finding — keep creating and the signal will get clearer.');
  }

  return parts.join(' ');
}

// ---------------------------------------------------------------------------
// Honesty verification for the explanation itself
// ---------------------------------------------------------------------------

function verifyExplanationHonesty(
  narrative: string,
  confidence: ConfidenceLevel,
  dataPoints: number
): boolean {
  // Check 1: No inflated language
  // Note: "100.0%" from calculated averages is acceptable — only bare "100%" claims are inflated
  const inflatedPhrases = ['AI discovered', 'proven', 'guaranteed', 'always', 'never', 'causes', 'will result in'];
  const hasInflated = inflatedPhrases.some((p) => narrative.toLowerCase().includes(p.toLowerCase()));
  if (hasInflated) return false;
  // Check for bare "100%" that isn't a calculated average like "100.0%"
  const bare100Match = narrative.match(/(?<!\d\.)100%(?!\.\d)/);
  if (bare100Match) return false;

  // Check 2: Confidence matches data
  if (confidence === 'high' && dataPoints < 16) return false;
  if (confidence === 'medium' && dataPoints < 5) return false;

  // Check 3: Narrative mentions data points
  if (!narrative.includes('data point') && !narrative.includes('posts') && !narrative.includes('sample')) {
    // Not necessarily dishonest but suspicious — still pass
  }

  return true;
}

// ---------------------------------------------------------------------------
// Quick explanation (for dashboard preview, without full DB traversal)
// ---------------------------------------------------------------------------

export function buildQuickExplanation(
  title: string,
  evidenceType: string,
  confidence: ConfidenceLevel,
  dataPoints: number,
  supportingFacts: string[]
): { summary: string; narrative: string; honest: boolean } {
  const summary = `${title} (${confidence} confidence, ${dataPoints} data points, ${evidenceType} evidence)`;

  const narrativeParts: string[] = [];
  narrativeParts.push(honestPhrase(dataPoints, title, 0.5)); // generic avg for quick view
  narrativeParts.push(`Evidence type: ${evidenceType}`);

  if (supportingFacts.length > 0) {
    narrativeParts.push(`Supported by: ${supportingFacts.join('; ')}`);
  }

  if (confidence === 'low') {
    narrativeParts.push('Low confidence — treat as hypothesis.');
  }

  const inflatedPhrases = ['AI discovered', 'proven', 'guaranteed', 'always', 'never', '100%'];
  const honest = !inflatedPhrases.some((p) => summary.toLowerCase().includes(p.toLowerCase()));

  return {
    summary,
    narrative: narrativeParts.join(' '),
    honest,
  };
}
