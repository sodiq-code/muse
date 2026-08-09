// ============================================================================
// Memory Screen Service — Day 12
// Powers Screen 2: Memory (4 Domains + Voice Radar)
//
// Provides the "what Muse knows about you" dashboard with:
//   - Identity domain: niche, audience, tone, avoid
//   - Voice Radar: directness, technicalDepth, storytelling, humor, hype
//   - Winning Hooks: hook patterns sorted by avg effectiveness
//   - Performance domain: recent performance signals
//   - Decisions domain: recent creator decisions
//
// Each domain shows its SOURCE and data provenance — the key UX rule
// ============================================================================

import { db } from '@/lib/db';
import { computeConfidence, honestPhrase, type ConfidenceLevel } from '@/lib/learning-engine';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface MemoryScreenData {
  creatorName: string;
  identity: {
    niche: string;
    audience: string;
    tone: string[];
    avoid: string[];
    source: string;
  };
  voiceRadar: {
    directness: number;       // 0-100
    technicalDepth: number;   // 0-100
    storytelling: number;     // 0-100
    humor: number;            // 0-100
    hype: number;             // 0-100
    sentenceLength: number;
    ctaIntensity: number;
    source: string;
    evidence: string;
  };
  winningHooks: {
    pattern: string;
    avgRetention: number;     // 0-100
    sampleSize: number;
    confidence: string;
  }[];
  performance: {
    topSignals: string[];
    recentInsights: string[];
    source: string;
  };
  decisions: {
    totalDecisions: number;
    recentDecisions: { type: string; description: string; date: string }[];
    source: string;
  };
  memoryEvents: number;  // total memory events count
}

// ---------------------------------------------------------------------------
// Main: Get Memory Screen Data
// ---------------------------------------------------------------------------

export async function getMemoryScreenData(creatorId: string): Promise<MemoryScreenData> {
  // ── Step 1: Load Creator with all related data ────────────────────────────
  const creator = await db.creator.findUnique({
    where: { id: creatorId },
    include: {
      decisions: {
        orderBy: { createdAt: 'desc' },
        take: 20,
      },
      memories: {
        orderBy: { createdAt: 'desc' },
        take: 100,
      },
      recommendations: {
        where: { status: { in: ['pending', 'shown', 'accepted'] } },
        orderBy: { priority: 'desc' },
        take: 20,
      },
    },
  });

  if (!creator) throw new Error(`Creator not found: ${creatorId}`);

  // ── Step 2: Identity Domain ───────────────────────────────────────────────
  const identity = buildIdentity(creator);

  // ── Step 3: Voice Radar ───────────────────────────────────────────────────
  const voiceRadar = buildVoiceRadar(creator);

  // ── Step 4: Winning Hooks ─────────────────────────────────────────────────
  const winningHooks = await buildWinningHooks(creatorId);

  // ── Step 5: Performance Domain ────────────────────────────────────────────
  const performance = await buildPerformance(creatorId, creator.memories, creator.recommendations);

  // ── Step 6: Decisions Domain ──────────────────────────────────────────────
  const decisions = buildDecisions(creatorId, creator.decisions);

  // ── Step 7: Total memory events count ─────────────────────────────────────
  const totalMemoryEvents = await db.memoryEvent.count({
    where: { creatorId },
  });

  return {
    creatorName: creator.name,
    identity,
    voiceRadar,
    winningHooks,
    performance,
    decisions,
    memoryEvents: totalMemoryEvents,
  };
}

// ---------------------------------------------------------------------------
// Build Identity Domain
// ---------------------------------------------------------------------------

function buildIdentity(creator: {
  niche: string | null;
  audience: string | null;
  tone: string | null;
  avoid: string | null;
  name: string;
}): MemoryScreenData['identity'] {
  // Parse tone from JSON string array
  let tone: string[] = [];
  if (creator.tone) {
    try {
      const parsed = JSON.parse(creator.tone);
      if (Array.isArray(parsed)) tone = parsed;
    } catch {
      // Fallback: treat as comma-separated
      tone = creator.tone.split(',').map((t) => t.trim());
    }
  }

  // Parse avoid from JSON string array
  let avoid: string[] = [];
  if (creator.avoid) {
    try {
      const parsed = JSON.parse(creator.avoid);
      if (Array.isArray(parsed)) avoid = parsed;
    } catch {
      avoid = creator.avoid.split(',').map((a) => a.trim());
    }
  }

  return {
    niche: creator.niche ?? 'Not set',
    audience: creator.audience ?? 'Not set',
    tone: tone.length > 0 ? tone : ['Not set'],
    avoid: avoid.length > 0 ? avoid : [],
    source: `Creator profile · direct input`,
  };
}

// ---------------------------------------------------------------------------
// Build Voice Radar
// ---------------------------------------------------------------------------

function buildVoiceRadar(creator: {
  voiceProfile: string | null;
  name: string;
  memories: Array<{ category: string; key: string; value: string; confidence: number }>;
}): MemoryScreenData['voiceRadar'] {
  // Default values if no voice profile
  const defaults = {
    directness: 50,
    technicalDepth: 50,
    storytelling: 50,
    humor: 30,
    hype: 20,
    sentenceLength: 50,
    ctaIntensity: 30,
  };

  let radar = { ...defaults };
  let source = 'Default values';
  let evidence = 'No voice profile data available — using defaults';

  // Override with stored voice profile JSON
  if (creator.voiceProfile) {
    try {
      const vp = JSON.parse(creator.voiceProfile);
      if (typeof vp.directness === 'number') radar.directness = clamp01(vp.directness);
      if (typeof vp.technicalDepth === 'number') radar.technicalDepth = clamp01(vp.technicalDepth);
      if (typeof vp.storytelling === 'number') radar.storytelling = clamp01(vp.storytelling);
      if (typeof vp.humor === 'number') radar.humor = clamp01(vp.humor);
      if (typeof vp.hype === 'number') radar.hype = clamp01(vp.hype);
      if (typeof vp.sentenceLength === 'number') radar.sentenceLength = clamp01(vp.sentenceLength);
      if (typeof vp.ctaIntensity === 'number') radar.ctaIntensity = clamp01(vp.ctaIntensity);
      source = 'Creator.voiceProfile · stored JSON';
      evidence = `7 dimensions from voice analysis: D=${radar.directness}, T=${radar.technicalDepth}, S=${radar.storytelling}, H=${radar.humor}, Hy=${radar.hype}`;
    } catch {
      // Malformed JSON — keep defaults
    }
  }

  // Further refine with memory events (identity category)
  const voiceMemories = creator.memories.filter(
    (m) => m.category === 'identity' && m.key.startsWith('voice_')
  );

  if (voiceMemories.length > 0) {
    for (const mem of voiceMemories) {
      try {
        const val = JSON.parse(mem.value);
        if (typeof val === 'number') {
          const key = mem.key.replace('voice_', '');
          if (key in radar) {
            (radar as Record<string, number>)[key] = clamp01(val);
          }
        }
      } catch {
        // Skip
      }
    }
    source = 'Creator.voiceProfile + MemoryEvent overrides';
    evidence = `${voiceMemories.length} memory overrides applied on top of voice profile`;
  }

  return {
    ...radar,
    source,
    evidence,
  };
}

function clamp01(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

// ---------------------------------------------------------------------------
// Build Winning Hooks
// ---------------------------------------------------------------------------

async function buildWinningHooks(creatorId: string): Promise<MemoryScreenData['winningHooks']> {
  // Load all hooks with their patterns and effectiveness
  const hooks = await db.hook.findMany({
    where: { contentItem: { creatorId } },
    include: {
      patterns: true,
      contentItem: {
        include: { metrics: true },
      },
    },
  });

  // Aggregate pattern effectiveness
  const patternAgg = new Map<string, {
    totalEffectiveness: number;
    count: number;
    hookTexts: string[];
  }>();

  for (const hook of hooks) {
    for (const pattern of hook.patterns) {
      const eff = pattern.avgEffectiveness ?? hook.effectiveness ?? 0;
      const existing = patternAgg.get(pattern.patternName) ?? {
        totalEffectiveness: 0,
        count: 0,
        hookTexts: [],
      };
      existing.totalEffectiveness += eff;
      existing.count += 1;
      if (existing.hookTexts.length < 3) {
        existing.hookTexts.push(hook.text);
      }
      patternAgg.set(pattern.patternName, existing);
    }
  }

  // If no pattern data, try to compute from hook effectiveness alone
  if (patternAgg.size === 0 && hooks.length > 0) {
    // Group hooks by type
    const hookTypeAgg = new Map<string, {
      totalEffectiveness: number;
      count: number;
    }>();

    for (const hook of hooks) {
      const eff = hook.effectiveness ?? 0;
      const existing = hookTypeAgg.get(hook.hookType) ?? {
        totalEffectiveness: 0,
        count: 0,
      };
      existing.totalEffectiveness += eff;
      existing.count += 1;
      hookTypeAgg.set(hook.hookType, existing);
    }

    const result: MemoryScreenData['winningHooks'] = [];
    for (const [pattern, data] of hookTypeAgg) {
      const avgRetention = Math.round((data.totalEffectiveness / data.count) * 100);
      const confidence = computeConfidence(data.count);
      result.push({
        pattern: pattern.replace(/_/g, ' '),
        avgRetention,
        sampleSize: data.count,
        confidence,
      });
    }

    return result.sort((a, b) => b.avgRetention - a.avgRetention).slice(0, 5);
  }

  // Sort patterns by avg effectiveness
  const result: MemoryScreenData['winningHooks'] = [];
  for (const [pattern, data] of patternAgg) {
    const avgRetention = Math.round((data.totalEffectiveness / data.count) * 100);
    const confidence = computeConfidence(data.count);
    result.push({
      pattern: pattern.replace(/_/g, ' '),
      avgRetention,
      sampleSize: data.count,
      confidence,
    });
  }

  return result.sort((a, b) => b.avgRetention - a.avgRetention).slice(0, 5);
}

// ---------------------------------------------------------------------------
// Build Performance Domain
// ---------------------------------------------------------------------------

async function buildPerformance(
  creatorId: string,
  memories: Array<{
    category: string;
    key: string;
    value: string;
    source: string;
    confidence: number;
    createdAt: Date;
  }>,
  recommendations: Array<{
    type: string;
    title: string;
    rationale: string | null;
    payload: string | null;
    priority: number;
  }>
): Promise<MemoryScreenData['performance']> {
  const topSignals: string[] = [];
  const recentInsights: string[] = [];

  // Performance memory events
  const perfMemories = memories.filter(
    (m) => m.category === 'performance' || m.category === 'pattern'
  );

  for (const mem of perfMemories.slice(0, 5)) {
    const signalText = `${mem.key}: ${mem.value.substring(0, 80)}`;
    topSignals.push(signalText);

    // Try to extract readable insight
    try {
      const data = JSON.parse(mem.value);
      if (data.pattern && typeof data.avgEffectiveness === 'number') {
        recentInsights.push(
          honestPhrase(data.sampleSize ?? 1, data.pattern, data.avgEffectiveness)
        );
      }
    } catch {
      recentInsights.push(mem.value.substring(0, 100));
    }
  }

  // Add recommendation insights
  for (const rec of recommendations.slice(0, 3)) {
    if (rec.type === 'improvement' || rec.type === 'timing') {
      topSignals.push(rec.title.substring(0, 80));
    }
  }

  // If no performance signals, check content metrics
  if (topSignals.length === 0) {
    const contentWithMetrics = await db.contentItem.findMany({
      where: { creatorId, status: 'published' },
      include: { metrics: true },
      take: 5,
      orderBy: { createdAt: 'desc' },
    });

    for (const item of contentWithMetrics) {
      const views = item.metrics.find((m) => m.metricKey === 'views');
      const likes = item.metrics.find((m) => m.metricKey === 'likes');
      if (views && likes) {
        const engagementRate = views.metricValue > 0
          ? ((likes.metricValue / views.metricValue) * 100).toFixed(1)
          : '0';
        topSignals.push(`${item.title?.substring(0, 40) ?? 'Post'}: ${engagementRate}% like rate`);
      }
    }
  }

  // Default if still empty
  if (topSignals.length === 0) {
    topSignals.push('No performance signals yet — Muse is collecting data');
  }

  if (recentInsights.length === 0) {
    recentInsights.push('Insights will appear as Muse learns from your content');
  }

  return {
    topSignals,
    recentInsights,
    source: `MemoryEvent · ${perfMemories.length} performance events, Recommendation · ${recommendations.length} active`,
  };
}

// ---------------------------------------------------------------------------
// Build Decisions Domain
// ---------------------------------------------------------------------------

function buildDecisions(
  creatorId: string,
  decisions: Array<{
    decision: string;
    reason: string | null;
    modifications: string | null;
    contentItemId: string | null;
    recommendationId: string | null;
    createdAt: Date;
  }>
): MemoryScreenData['decisions'] {
  const recentDecisions: { type: string; description: string; date: string }[] = [];

  for (const dec of decisions.slice(0, 10)) {
    const type = dec.decision; // "accepted", "modified", "rejected", "ignored"
    const description = dec.reason ?? dec.modifications ?? `${dec.decision} a recommendation`;
    recentDecisions.push({
      type,
      description: description.substring(0, 100),
      date: dec.createdAt.toISOString(),
    });
  }

  return {
    totalDecisions: decisions.length,
    recentDecisions,
    source: `CreatorDecision · ${decisions.length} total decisions recorded`,
  };
}

// ---------------------------------------------------------------------------
// Utility: Get default creator ID
// ---------------------------------------------------------------------------

export async function getDefaultCreatorId(): Promise<string> {
  const creator = await db.creator.findFirst({
    where: { email: 'sodiqjimoh80@gmail.com' },
  });
  if (!creator) throw new Error('Default creator not found. Run seed first.');
  return creator.id;
}
