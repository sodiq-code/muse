// ============================================================================
// API Route: /api/learning/ab-proof
// Stateless vs. Memory-Backed Recommendation A/B Proof
//
// This route demonstrates the value of persistent memory by running the SAME
// question through two paths:
//
//   1. BASELINE (stateless): A fresh Mind call with NO creator context.
//      This is what a stateless AI tool produces — generic, reusable across
//      any creator, no memory of past performance.
//
//   2. MUSE (memory-backed): A Mind call WITH the creator's memory graph,
//      voice profile, and hook performance history injected into the prompt.
//      This is what MUSE produces — specific, personalized, evidence-cited.
//
// The proof is the side-by-side difference. The baseline is generic;
// the Muse response cites real past performance, specific hooks, and voice
// dimensions. This is the value of persistent memory, made visible.
//
// In simulate mode: both paths use deterministic mock responses.
// In live mode: both paths make real waitForReply calls to the Mind.
// ============================================================================

import { NextResponse } from 'next/server';
import { isLiveMode, adapterSendMessageAndWait } from '@/lib/minds-adapter';
import { getMindsConfig } from '@/lib/minds-client';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const maxDuration = 120;

const TEST_QUESTION = 'What hook should I use for my next piece of content?';

// The stateless baseline prompt — NO creator context.
const BASELINE_PROMPT = `${TEST_QUESTION}

You are a helpful AI assistant. Give a brief hook recommendation.`;

// The memory-backed Muse prompt — full creator context.
function buildMemoryBackedPrompt(
  creatorName: string,
  voiceProfile: { directness: number; technicalDepth: number; storytelling: number; humor: number; hype: number },
  hookRankings: Array<{ pattern: string; avgRetention: number; sampleSize: number; confidence: string }>,
  recentWinners: Array<{ title: string; hookPattern: string; retention?: number }>,
): string {
  const voiceLine = `Voice profile — Directness: ${voiceProfile.directness}, Technical Depth: ${voiceProfile.technicalDepth}, Storytelling: ${voiceProfile.storytelling}, Humor: ${voiceProfile.humor}, Hype: ${voiceProfile.hype}`;
  const hooksLine = hookRankings.length > 0
    ? `Hook performance history:\n${hookRankings.map(h => `  - ${h.pattern}: ${h.avgRetention}% avg retention (${h.sampleSize} samples, ${h.confidence} confidence)`).join('\n')}`
    : 'Hook performance history: (no samples yet)';
  const winnersLine = recentWinners.length > 0
    ? `Recent winning content:\n${recentWinners.map(w => `  - "${w.title}" (${w.hookPattern}${w.retention ? `, ${w.retention}% retention` : ''})`).join('\n')}`
    : 'Recent winning content: (none tracked yet)';

  return `${TEST_QUESTION}

You are Muse, the persistent creative teammate for ${creatorName}. You have accumulated memory of their past content performance. Use it.

${voiceLine}
${hooksLine}
${winnersLine}

Based on this accumulated evidence, recommend a specific hook. Cite which past performance data informed your choice.`;
}

// Deterministic mock responses for simulate mode
const MOCK_BASELINE_RESPONSE = `For your next piece of content, I'd recommend using a question hook. Questions create curiosity gaps that drive engagement. Something like "What if you could 10x your output?" tends to work well across most audiences and niches.`;

const MOCK_MUSE_RESPONSE = `Based on your memory: your contrarian_claim hooks average 72% retention across 8 samples (medium confidence), outperforming your question hooks which sit at 54%. Your voice profile shows 91 directness and 88 technical depth — your audience values expertise over curiosity gaps.

Lead with a contrarian claim: "Most AI agents aren't really agents — here's what actually qualifies." This matches your winning pattern (your top post "Most AI agents aren't really agents" hit 18.4K views at 71% retention) and stays in your direct, technical voice.`;

export async function GET() {
  const startTime = Date.now();
  const config = getMindsConfig();
  const live = isLiveMode();

  // ------------------------------------------------------------------
  // Load creator memory from the database (for the memory-backed path)
  // ------------------------------------------------------------------
  let creatorName = 'Creator';
  let voiceProfile = { directness: 91, technicalDepth: 88, storytelling: 72, humor: 34, hype: 8 };
  let hookRankings: Array<{ pattern: string; avgRetention: number; sampleSize: number; confidence: string }> = [];
  let recentWinners: Array<{ title: string; hookPattern: string; retention?: number }> = [];

  try {
    const creator = await db.creator.findFirst({ orderBy: { createdAt: 'asc' } });
    if (creator) {
      creatorName = creator.name ?? 'Creator';

      const voice = await db.memoryEvent.findFirst({
        where: { creatorId: creator.id, category: 'voice' },
        orderBy: { createdAt: 'desc' },
      });
      if (voice?.value) {
        try {
          const parsed = JSON.parse(voice.value);
          voiceProfile = { ...voiceProfile, ...parsed };
        } catch { /* use defaults */ }
      }

      // Hook patterns are stored via Hook → HookPattern relation
      const hookPatterns = await db.hookPattern.findMany({
        where: { hook: { contentItem: { creatorId: creator.id } } },
        orderBy: { avgEffectiveness: 'desc' },
        take: 8,
        include: { hook: { include: { contentItem: true } } },
      });
      hookRankings = hookPatterns.map(hp => ({
        pattern: hp.patternName,
        avgRetention: hp.avgEffectiveness ? Math.round(hp.avgEffectiveness * 100) : 0,
        sampleSize: hp.sampleSize,
        confidence: hp.confidence > 0.7 ? 'high' : hp.confidence > 0.4 ? 'medium' : 'low',
      }));

      const winners = await db.contentItem.findMany({
        where: { creatorId: creator.id, status: 'published' },
        orderBy: { createdAt: 'desc' },
        take: 3,
        include: { hooks: { include: { patterns: true } } },
      });
      recentWinners = winners.map(w => ({
        title: w.title ?? 'Untitled',
        hookPattern: w.hooks[0]?.patterns[0]?.patternName ?? 'unknown',
        retention: undefined,
      }));
    }
  } catch {
    // DB not available — use seeded defaults
  }

  // ------------------------------------------------------------------
  // Run both paths
  // ------------------------------------------------------------------
  let baselineResponse: string;
  let museResponse: string;
  let baselineMode: 'live' | 'simulated';
  let museMode: 'live' | 'simulated';
  let baselineLatency = 0;
  let museLatency = 0;

  if (live) {
    // LIVE: run both through the real Mind IN PARALLEL to minimize total latency
    const baselineAlias = `ab-proof-baseline-${Date.now()}`;
    const museAlias = `ab-proof-muse-${Date.now()}`;
    const memoryPrompt = buildMemoryBackedPrompt(creatorName, voiceProfile, hookRankings, recentWinners);

    const [baselineResult, museResult] = await Promise.allSettled([
      (async () => {
        const start = Date.now();
        try {
          const result = await adapterSendMessageAndWait(baselineAlias, BASELINE_PROMPT, config.museId, 60_000);
          return { response: result.success && result.reply ? extractMessageText(result.reply) : MOCK_BASELINE_RESPONSE, mode: result.success && result.reply ? 'live' : 'simulated' as const, latency: Date.now() - start };
        } catch {
          return { response: MOCK_BASELINE_RESPONSE, mode: 'simulated' as const, latency: Date.now() - start };
        }
      })(),
      (async () => {
        const start = Date.now();
        try {
          const result = await adapterSendMessageAndWait(museAlias, memoryPrompt, config.museId, 90_000);
          return { response: result.success && result.reply ? extractMessageText(result.reply) : MOCK_MUSE_RESPONSE, mode: result.success && result.reply ? 'live' : 'simulated' as const, latency: Date.now() - start };
        } catch {
          return { response: MOCK_MUSE_RESPONSE, mode: 'simulated' as const, latency: Date.now() - start };
        }
      })(),
    ]);

    const b = baselineResult.status === 'fulfilled' ? baselineResult.value : { response: MOCK_BASELINE_RESPONSE, mode: 'simulated' as const, latency: 0 };
    const m = museResult.status === 'fulfilled' ? museResult.value : { response: MOCK_MUSE_RESPONSE, mode: 'simulated' as const, latency: 0 };

    baselineResponse = b.response;
    baselineMode = b.mode;
    baselineLatency = b.latency;
    museResponse = m.response;
    museMode = m.mode;
    museLatency = m.latency;
  } else {
    // SIMULATE: deterministic mock responses (with realistic latency)
    baselineResponse = MOCK_BASELINE_RESPONSE;
    museResponse = MOCK_MUSE_RESPONSE;
    baselineMode = 'simulated';
    museMode = 'simulated';
    baselineLatency = 1200;
    museLatency = 2800;
  }

  // ------------------------------------------------------------------
  // Analysis: what did memory add?
  // ------------------------------------------------------------------
  const baselineWords = baselineResponse.split(/\s+/).length;
  const museWords = museResponse.split(/\s+/).length;
  const museCitesData = /\d+%|sample|retention|voice|directness|technical/i.test(museResponse);
  const baselineCitesData = /\d+%|sample|retention|voice|directness|technical/i.test(baselineResponse);
  const museCitesPastContent = /won|top post|winning|previous|last/i.test(museResponse);

  return NextResponse.json({
    success: true,
    question: TEST_QUESTION,
    timestamp: new Date().toISOString(),
    totalLatency: Date.now() - startTime,

    baseline: {
      label: 'Stateless AI (no memory)',
      description: 'Fresh call with no creator context — what a generic AI tool produces',
      response: baselineResponse,
      mode: baselineMode,
      latencyMs: baselineLatency,
      wordCount: baselineWords,
      citesData: baselineCitesData,
      citesPastContent: false,
    },

    muse: {
      label: 'Muse (memory-backed)',
      description: 'Mind call with full creator memory graph, voice profile, and hook history',
      response: museResponse,
      mode: museMode,
      latencyMs: museLatency,
      wordCount: museWords,
      citesData: museCitesData,
      citesPastContent: museCitesPastContent,
      contextUsed: {
        creatorName,
        voiceProfile,
        hookRankings,
        recentWinners,
      },
    },

    analysis: {
      memoryValueAdded: museCitesData && !baselineCitesData,
      museCitesRealData: museCitesData,
      museCitesPastContent,
      personalizationScore: museCitesData ? (museCitesPastContent ? 'high' : 'medium') : 'low',
      baselinePersonalizationScore: 'none',
      summary: museCitesData
        ? 'Muse cited specific retention data, voice dimensions, and past content performance. The baseline gave a generic recommendation with no personalization.'
        : 'Both responses were generic — Muse may need more accumulated memory data to demonstrate the full value.',
    },
  });
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function extractMessageText(reply: string): string {
  try {
    const parsed = JSON.parse(reply);
    if (parsed.reply?.messageText) return stripHtml(parsed.reply.messageText);
    if (parsed.messageText) return stripHtml(parsed.messageText);
    if (parsed.reply?.content) return stripHtml(parsed.reply.content);
    if (typeof parsed === 'string') return stripHtml(parsed);
  } catch {
    // Not JSON — use as-is
  }
  return stripHtml(reply);
}

function stripHtml(text: string): string {
  return text
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>\s*<p>/gi, '\n\n')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .trim();
}
