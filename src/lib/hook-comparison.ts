// ============================================================================
// Hook Comparison Engine — Day 6
// CREATOR-SPECIFIC hook comparison with statistical honesty
// Every comparison includes evidence chain (sample size, date range, specific hooks)
// ZERO CREDITS — all local computation, no Minds API calls
// ============================================================================

import { db } from '@/lib/db';
import { classifyHook, ALL_PATTERNS, PATTERN_LABELS, type HookPattern } from '@/lib/hook-classifier';
import { computeConfidence, type ConfidenceLevel } from '@/lib/learning-engine';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface PatternStats {
  pattern: HookPattern;
  avgEffectiveness: number;
  sampleSize: number;
  hookTexts: string[];
  dateRange: { earliest: string; latest: string } | null;
}

export interface HookVsHistoryResult {
  hookClassification: {
    pattern: HookPattern;
    confidence: number;
    reasoning: string;
    allScores: Record<HookPattern, number>;
  };
  historicalComparison: {
    patternAvg: number;
    creatorOverallAvg: number;
    diff: number;               // patternAvg - creatorOverallAvg (positive = outperforms)
    diffPercent: number;        // percentage difference
    message: string;            // human-readable comparison
    confidence: ConfidenceLevel;
    evidenceType: string;
    sampleSize: number;
  };
  creatorSpecific: {
    patternRank: number;        // rank among all patterns for this creator
    totalPatterns: number;      // how many patterns have data
    betterPatterns: string[];   // patterns that outperform this one
    worsePatterns: string[];    // patterns this one outperforms
  };
}

export interface PatternVsPatternResult {
  patternA: {
    pattern: HookPattern;
    avgEffectiveness: number;
    sampleSize: number;
  };
  patternB: {
    pattern: HookPattern;
    avgEffectiveness: number;
    sampleSize: number;
  };
  winner: HookPattern;
  margin: number;               // winner effectiveness - loser effectiveness
  marginPercent: number;
  confidence: ConfidenceLevel;
  evidence: {
    type: string;
    message: string;
    totalSamples: number;
  };
}

export interface PatternRanking {
  pattern: HookPattern;
  label: string;
  avgEffectiveness: number;
  sampleSize: number;
  rank: number;
  confidence: ConfidenceLevel;
  status: 'tested' | 'untested';
}

export interface HookRankingsResult {
  rankings: PatternRanking[];
  overallConfidence: ConfidenceLevel;
  totalSamples: number;
}

export interface PredictionResult {
  pattern: HookPattern;
  patternLabel: string;
  predictedEffectiveness: number;
  confidence: ConfidenceLevel;
  historicalSampleSize: number;
  similarHooks: {
    text: string;
    effectiveness: number;
  }[];
  message: string;
  evidenceType: string;
}

// ---------------------------------------------------------------------------
// Internal: Get pattern stats for a creator from database
// ---------------------------------------------------------------------------

async function getCreatorPatternStats(creatorId: string): Promise<Map<HookPattern, PatternStats>> {
  const statsMap = new Map<HookPattern, PatternStats>();

  // Get all hooks with their patterns and effectiveness for this creator
  const hooks = await db.hook.findMany({
    where: {
      contentItem: { creatorId },
    },
    include: {
      patterns: true,
      contentItem: { select: { createdAt: true } },
    },
  });

  // Group by pattern name
  const patternData = new Map<HookPattern, { effectiveness: number; text: string; date: string }[]>();

  for (const hook of hooks) {
    for (const pattern of hook.patterns) {
      const patternName = pattern.patternName as HookPattern;
      if (!ALL_PATTERNS.includes(patternName)) continue;

      if (!patternData.has(patternName)) {
        patternData.set(patternName, []);
      }

      // Use the hook's effectiveness if available, otherwise use the pattern's avgEffectiveness
      const effectiveness = hook.effectiveness ?? pattern.avgEffectiveness ?? 0;
      patternData.get(patternName)!.push({
        effectiveness,
        text: hook.text,
        date: hook.contentItem.createdAt.toISOString(),
      });
    }
  }

  // Build stats
  for (const [pattern, items] of patternData) {
    const totalEff = items.reduce((sum, item) => sum + item.effectiveness, 0);
    const avgEff = items.length > 0 ? totalEff / items.length : 0;
    const dates = items.map(i => i.date).sort();

    statsMap.set(pattern, {
      pattern,
      avgEffectiveness: avgEff,
      sampleSize: items.length,
      hookTexts: items.map(i => i.text),
      dateRange: dates.length > 0 ? { earliest: dates[0], latest: dates[dates.length - 1] } : null,
    });
  }

  return statsMap;
}

// ---------------------------------------------------------------------------
// compareHookVsHistory
// ---------------------------------------------------------------------------

export async function compareHookVsHistory(
  creatorId: string,
  hookText: string
): Promise<HookVsHistoryResult> {
  // 1. Classify the hook
  const classification = classifyHook(hookText);

  // 2. Get creator's pattern stats from database
  const statsMap = await getCreatorPatternStats(creatorId);

  // 3. Get the classified pattern's stats
  const patternStats = statsMap.get(classification.pattern);
  const patternAvg = patternStats?.avgEffectiveness ?? 0;
  const patternSampleSize = patternStats?.sampleSize ?? 0;

  // 4. Compute creator's overall average (across all patterns)
  let totalEffectiveness = 0;
  let totalSamples = 0;
  const patternRankings: { pattern: HookPattern; avg: number }[] = [];

  for (const [pattern, stats] of statsMap) {
    if (stats.sampleSize > 0) {
      totalEffectiveness += stats.avgEffectiveness * stats.sampleSize;
      totalSamples += stats.sampleSize;
      patternRankings.push({ pattern, avg: stats.avgEffectiveness });
    }
  }

  const creatorOverallAvg = totalSamples > 0 ? totalEffectiveness / totalSamples : 0;

  // 5. Compute difference
  const diff = patternAvg - creatorOverallAvg;
  const diffPercent = creatorOverallAvg > 0 ? (diff / creatorOverallAvg) * 100 : 0;

  // 6. Build comparison message
  let message: string;
  if (patternSampleSize === 0) {
    message = `No historical data for ${PATTERN_LABELS[classification.pattern]} hooks — this pattern is untested for you`;
  } else if (Math.abs(diffPercent) < 5) {
    message = `This ${PATTERN_LABELS[classification.pattern]} hook performs similarly to your overall average (${(patternAvg * 100).toFixed(1)}% vs ${(creatorOverallAvg * 100).toFixed(1)}%)`;
  } else if (diffPercent > 0) {
    message = `This ${PATTERN_LABELS[classification.pattern]} hook typically outperforms your average by ${Math.abs(diffPercent).toFixed(0)}% (${(patternAvg * 100).toFixed(1)}% vs ${(creatorOverallAvg * 100).toFixed(1)}% overall)`;
  } else {
    message = `This ${PATTERN_LABELS[classification.pattern]} hook typically underperforms your average by ${Math.abs(diffPercent).toFixed(0)}% (${(patternAvg * 100).toFixed(1)}% vs ${(creatorOverallAvg * 100).toFixed(1)}% overall)`;
  }

  // 7. Compute pattern rank
  patternRankings.sort((a, b) => b.avg - a.avg);
  const patternRank = patternRankings.findIndex(p => p.pattern === classification.pattern) + 1;
  const totalPatternsWithData = patternRankings.length;

  const betterPatterns = patternRankings
    .filter(p => p.avg > patternAvg && p.pattern !== classification.pattern)
    .map(p => PATTERN_LABELS[p.pattern]);

  const worsePatterns = patternRankings
    .filter(p => p.avg < patternAvg && p.pattern !== classification.pattern)
    .map(p => PATTERN_LABELS[p.pattern]);

  return {
    hookClassification: classification,
    historicalComparison: {
      patternAvg,
      creatorOverallAvg,
      diff,
      diffPercent,
      message,
      confidence: computeConfidence(patternSampleSize),
      evidenceType: patternSampleSize >= 10 ? 'statistical' : patternSampleSize >= 3 ? 'observational' : 'insufficient',
      sampleSize: patternSampleSize,
    },
    creatorSpecific: {
      patternRank: patternRank || totalPatternsWithData + 1,
      totalPatterns: totalPatternsWithData,
      betterPatterns,
      worsePatterns,
    },
  };
}

// ---------------------------------------------------------------------------
// comparePatternVsPattern
// ---------------------------------------------------------------------------

export async function comparePatternVsPattern(
  creatorId: string,
  patternA: HookPattern,
  patternB: HookPattern
): Promise<PatternVsPatternResult> {
  const statsMap = await getCreatorPatternStats(creatorId);

  const statsA = statsMap.get(patternA);
  const statsB = statsMap.get(patternB);

  const avgA = statsA?.avgEffectiveness ?? 0;
  const avgB = statsB?.avgEffectiveness ?? 0;
  const samplesA = statsA?.sampleSize ?? 0;
  const samplesB = statsB?.sampleSize ?? 0;

  const winner = avgA >= avgB ? patternA : patternB;
  const loser = avgA >= avgB ? patternB : patternA;
  const margin = Math.abs(avgA - avgB);
  const marginPercent = (avgA > 0 && avgB > 0)
    ? (margin / Math.min(avgA, avgB)) * 100
    : 0;

  const totalSamples = samplesA + samplesB;
  const confidence = computeConfidence(Math.min(samplesA, samplesB));

  const evidenceType = totalSamples >= 10 ? 'statistical' : totalSamples >= 4 ? 'observational' : 'insufficient';

  const message = `${PATTERN_LABELS[patternA]} (${(avgA * 100).toFixed(1)}% avg, ${samplesA} samples) vs ${PATTERN_LABELS[patternB]} (${(avgB * 100).toFixed(1)}%, ${samplesB} samples) — ${PATTERN_LABELS[winner]} wins by ${marginPercent.toFixed(0)}%`;

  return {
    patternA: { pattern: patternA, avgEffectiveness: avgA, sampleSize: samplesA },
    patternB: { pattern: patternB, avgEffectiveness: avgB, sampleSize: samplesB },
    winner,
    margin,
    marginPercent,
    confidence,
    evidence: {
      type: evidenceType,
      message,
      totalSamples,
    },
  };
}

// ---------------------------------------------------------------------------
// getHookRankings
// ---------------------------------------------------------------------------

export async function getHookRankings(creatorId: string): Promise<HookRankingsResult> {
  const statsMap = await getCreatorPatternStats(creatorId);

  const rankings: PatternRanking[] = [];
  let totalSamples = 0;

  // Build rankings for patterns with data
  const patternsWithData: { pattern: HookPattern; avg: number; samples: number }[] = [];

  for (const pattern of ALL_PATTERNS) {
    const stats = statsMap.get(pattern);
    if (stats && stats.sampleSize > 0) {
      patternsWithData.push({
        pattern,
        avg: stats.avgEffectiveness,
        samples: stats.sampleSize,
      });
      totalSamples += stats.sampleSize;
    }
  }

  // Sort by effectiveness descending
  patternsWithData.sort((a, b) => b.avg - a.avg);

  // Assign ranks
  for (let i = 0; i < patternsWithData.length; i++) {
    const p = patternsWithData[i];
    rankings.push({
      pattern: p.pattern,
      label: PATTERN_LABELS[p.pattern],
      avgEffectiveness: p.avg,
      sampleSize: p.samples,
      rank: i + 1,
      confidence: computeConfidence(p.samples),
      status: 'tested',
    });
  }

  // Add untested patterns
  const testedPatterns = new Set(patternsWithData.map(p => p.pattern));
  for (const pattern of ALL_PATTERNS) {
    if (!testedPatterns.has(pattern)) {
      rankings.push({
        pattern,
        label: PATTERN_LABELS[pattern],
        avgEffectiveness: 0,
        sampleSize: 0,
        rank: 0,
        confidence: 'low',
        status: 'untested',
      });
    }
  }

  return {
    rankings,
    overallConfidence: computeConfidence(totalSamples),
    totalSamples,
  };
}

// ---------------------------------------------------------------------------
// predictHookPerformance
// ---------------------------------------------------------------------------

export async function predictHookPerformance(
  creatorId: string,
  hookText: string
): Promise<PredictionResult> {
  // 1. Classify the hook
  const classification = classifyHook(hookText);

  // 2. Get pattern stats
  const statsMap = await getCreatorPatternStats(creatorId);
  const patternStats = statsMap.get(classification.pattern);

  const avgEffectiveness = patternStats?.avgEffectiveness ?? 0;
  const sampleSize = patternStats?.sampleSize ?? 0;

  // 3. Get similar hooks (hooks of the same pattern)
  const similarHooks = (patternStats?.hookTexts ?? [])
    .slice(0, 5)
    .map(text => ({
      text,
      effectiveness: avgEffectiveness, // We use the pattern average since individual hook effectiveness varies
    }));

  // 4. Build prediction message with statistical honesty
  let message: string;
  if (sampleSize === 0) {
    message = `No historical data for ${PATTERN_LABELS[classification.pattern]} hooks — prediction not possible. Try this pattern and collect data.`;
  } else if (sampleSize < 3) {
    message = `Based on ${sampleSize} ${classification.pattern} hook${sampleSize === 1 ? '' : 's'}, this pattern averages ${(avgEffectiveness * 100).toFixed(1)}% effectiveness. Very low confidence — treat as hypothesis.`;
  } else {
    message = `Based on ${sampleSize} ${classification.pattern} hooks, this pattern averages ${(avgEffectiveness * 100).toFixed(1)}% effectiveness (${computeConfidence(sampleSize)} confidence)`;
  }

  return {
    pattern: classification.pattern,
    patternLabel: PATTERN_LABELS[classification.pattern],
    predictedEffectiveness: avgEffectiveness,
    confidence: computeConfidence(sampleSize),
    historicalSampleSize: sampleSize,
    similarHooks,
    message,
    evidenceType: sampleSize >= 10 ? 'statistical' : sampleSize >= 3 ? 'observational' : 'insufficient',
  };
}
