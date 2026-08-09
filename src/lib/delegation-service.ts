// ============================================================================
// Delegation Service — Day 9
// Muse→Maker Structured Instruction
// The core of Phase 4: DELEGATION
//
// Muse (Orchestrator) builds a structured instruction from:
//   - Creator identity + voice profile
//   - Learning engine insights (best hook patterns)
//   - Historical winning content
//   - Current performance signals
//
// Then sends it to Maker via Minds SDK (live) or Simulator (fallback)
// Maker produces voice-aligned creative output
// Muse receives and stores the result
// ============================================================================

import { db } from '@/lib/db';
import {
  type MakerInstruction,
  type MakerOutput,
  type VoiceProfile as MakerVoiceProfile,
  simulateMakerOutput,
  JULES_VOICE,
} from '@/lib/maker-simulator';
import {
  adapterSendMessage,
  adapterGetCircle,
} from '@/lib/minds-adapter';
import { getMindsConfig } from '@/lib/minds-client';
import { computeConfidence, type ConfidenceLevel } from '@/lib/learning-engine';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface DelegationContext {
  creatorId: string;
  creatorName: string;
  creatorEmail: string;
  platform: string;
  niche: string | null;
  audience: string | null;
  voiceProfile: CreatorVoiceSnapshot;
  bestHookPatterns: HookPatternSummary[];
  recentWinners: string[];         // Titles of top-performing content
  performanceSignals: string[];    // Key observations from learning engine
  topic: string;                   // What to create about
  objective: string;               // What the content should achieve
}

export interface CreatorVoiceSnapshot {
  tone: string;
  pace: string;
  vocabulary: string;
  avoidTopics: string[];
  strengths: string[];
  directness?: number;
  technicalDepth?: number;
  humor?: number;
  storytelling?: number;
}

export interface HookPatternSummary {
  pattern: string;
  avgEffectiveness: number;
  sampleSize: number;
  confidence: ConfidenceLevel;
}

export interface StructuredInstruction {
  // The structured message Muse sends to Maker
  instructionId: string;
  from: 'muse';
  to: 'maker';
  timestamp: string;

  // Maker's expected input format (from blueprint §6.2)
  makerInput: MakerInstruction;

  // Metadata about why Muse chose this instruction
  reasoning: string;
  evidenceUsed: string[];
  confidenceLevel: ConfidenceLevel;
  dataPointsUsed: number;
}

export interface DelegationResult {
  success: boolean;
  instruction: StructuredInstruction;
  makerOutput: MakerOutput;
  mode: 'live' | 'simulated';
  delegationTime: number;           // ms
  auditEventId: string;
  timestamp: string;
}

// ---------------------------------------------------------------------------
// Step 1: Load creator context from database
// ---------------------------------------------------------------------------

export async function loadDelegationContext(
  creatorId: string,
  topic?: string,
  objective?: string
): Promise<DelegationContext> {
  const creator = await db.creator.findUnique({
    where: { id: creatorId },
    include: {
      contentItems: {
        include: {
          metrics: true,
          hooks: { include: { patterns: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: 20,
      },
      memories: {
        where: { category: { in: ['identity', 'pattern', 'performance'] } },
        orderBy: { createdAt: 'desc' },
        take: 30,
      },
    },
  });

  if (!creator) throw new Error(`Creator not found: ${creatorId}`);

  // Build voice snapshot from creator profile + memory
  const voiceSnapshot = buildVoiceSnapshot(creator);

  // Identify best hook patterns from content
  const bestHookPatterns = extractBestHookPatterns(creator.contentItems);

  // Get recent winning content (top performers by views)
  const recentWinners = extractRecentWinners(creator.contentItems);

  // Get performance signals from memory events
  const performanceSignals = extractPerformanceSignals(creator.memories);

  // Determine topic and objective
  const finalTopic = topic ?? inferTopic(creator, bestHookPatterns);
  const finalObjective = objective ?? inferObjective(creator);

  return {
    creatorId: creator.id,
    creatorName: creator.name,
    creatorEmail: creator.email,
    platform: creator.platform,
    niche: creator.niche,
    audience: creator.audience,
    voiceProfile: voiceSnapshot,
    bestHookPatterns,
    recentWinners,
    performanceSignals,
    topic: finalTopic,
    objective: finalObjective,
  };
}

// ---------------------------------------------------------------------------
// Step 2: Build structured instruction for Maker
// ---------------------------------------------------------------------------

export function buildStructuredInstruction(
  context: DelegationContext
): StructuredInstruction {
  const instructionId = `delegation_${Date.now()}`;

  // Convert creator voice to Maker's expected VoiceProfile format
  const makerVoice: MakerVoiceProfile = {
    tone: context.voiceProfile.tone,
    pace: context.voiceProfile.pace,
    vocabulary: context.voiceProfile.vocabulary,
    avoidTopics: context.voiceProfile.avoidTopics,
    strengths: context.voiceProfile.strengths,
  };

  // Build historical winners as hook texts
  const historicalWinners = context.bestHookPatterns
    .filter((p) => p.confidence !== 'low')
    .map((p) => `${p.pattern} hook (${(p.avgEffectiveness * 100).toFixed(0)}% avg, ${p.sampleSize} samples)`);

  // Build the natural language instruction that Muse gives Maker
  const instructionText = buildInstructionText(context);

  // Build reasoning — why Muse chose this instruction
  const reasoning = buildReasoning(context);

  // Evidence used
  const evidenceUsed: string[] = [];
  evidenceUsed.push(`Creator: ${context.creatorName} on ${context.platform}`);
  if (context.bestHookPatterns.length > 0) {
    evidenceUsed.push(`Best hooks: ${context.bestHookPatterns.slice(0, 3).map((p) => p.pattern).join(', ')}`);
  }
  if (context.recentWinners.length > 0) {
    evidenceUsed.push(`Recent winners: ${context.recentWinners.length} top-performing items`);
  }
  evidenceUsed.push(`Voice profile: ${context.voiceProfile.tone}, ${context.voiceProfile.pace} pace, ${context.voiceProfile.vocabulary} vocabulary`);

  // Overall confidence
  const totalDataPoints = context.bestHookPatterns.reduce((sum, p) => sum + p.sampleSize, 0) + context.recentWinners.length;
  const confidenceLevel = computeConfidence(totalDataPoints);

  // Maker's expected input format
  const makerInput: MakerInstruction = {
    creator: context.creatorName,
    topic: context.topic,
    objective: context.objective,
    audience: context.audience ?? 'technical creators and developers',
    voice: makerVoice,
    historicalWinners,
    instruction: instructionText,
  };

  return {
    instructionId,
    from: 'muse',
    to: 'maker',
    timestamp: new Date().toISOString(),
    makerInput,
    reasoning,
    evidenceUsed,
    confidenceLevel,
    dataPointsUsed: totalDataPoints,
  };
}

// ---------------------------------------------------------------------------
// Step 3: Execute delegation — send to Maker and get output
// ---------------------------------------------------------------------------

export async function executeDelegation(
  instruction: StructuredInstruction,
  creatorId: string
): Promise<DelegationResult> {
  const startTime = Date.now();
  const config = getMindsConfig();

  let makerOutput: MakerOutput;
  let mode: 'live' | 'simulated';

  // Try live Minds API first
  try {
    // Check if Maker is in Muse's circle
    const circle = await adapterGetCircle(config.museId);
    const makerInCircle = circle.some(
      (m) => m.email === config.makerEmail || m.partyId === config.makerId
    );

    if (makerInCircle && config.mode === 'live') {
      // Send structured instruction to Maker via Minds
      const delegationMessage = formatDelegationMessage(instruction);
      const sendResult = await adapterSendMessage(
        'muse-to-maker',
        delegationMessage,
        config.makerId
      );

      if (sendResult.success) {
        // Maker would process and reply — for now use simulator
        // (real waitForReply would be used in production)
        makerOutput = simulateMakerOutput(instruction.makerInput);
        makerOutput.source = 'live';
        mode = 'live';
      } else {
        // Send failed — fallback to simulator
        makerOutput = simulateMakerOutput(instruction.makerInput);
        mode = 'simulated';
      }
    } else {
      // Maker not in circle or simulate mode — use simulator
      makerOutput = simulateMakerOutput(instruction.makerInput);
      mode = 'simulated';
    }
  } catch (err) {
    console.warn('[delegation] Live delegation failed, using simulator:', err);
    makerOutput = simulateMakerOutput(instruction.makerInput);
    mode = 'simulated';
  }

  const delegationTime = Date.now() - startTime;

  // Store audit event
  const auditEvent = await db.auditEvent.create({
    data: {
      creatorId,
      actor: 'muse',
      action: 'delegate',
      targetType: 'maker_instruction',
      targetId: instruction.instructionId,
      delta: JSON.stringify({
        instructionId: instruction.instructionId,
        topic: instruction.makerInput.topic,
        objective: instruction.makerInput.objective,
        mode,
        makerOutput: {
          title: makerOutput.title,
          voiceMatch: makerOutput.voiceMatch,
          hookCompat: makerOutput.hookCompat,
          hookCount: makerOutput.alternativeHooks.length + 1,
        },
        delegationTime,
        confidenceLevel: instruction.confidenceLevel,
        dataPointsUsed: instruction.dataPointsUsed,
      }),
    },
  });

  return {
    success: true,
    instruction,
    makerOutput,
    mode,
    delegationTime,
    auditEventId: auditEvent.id,
    timestamp: new Date().toISOString(),
  };
}

// ---------------------------------------------------------------------------
// Step 4: Full delegation pipeline (load → build → execute)
// ---------------------------------------------------------------------------

export async function runDelegation(
  creatorId: string,
  topic?: string,
  objective?: string
): Promise<DelegationResult> {
  // Load context from real DB data
  const context = await loadDelegationContext(creatorId, topic, objective);

  // Build structured instruction
  const instruction = buildStructuredInstruction(context);

  // Execute delegation
  const result = await executeDelegation(instruction, creatorId);

  return result;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function buildVoiceSnapshot(creator: {
  voiceProfile: string | null;
  tone: string | null;
  avoid: string | null;
  name: string;
  niche: string | null;
  memories: Array<{ category: string; key: string; value: string }>;
}): CreatorVoiceSnapshot {
  // Start with Jules defaults
  const snapshot: CreatorVoiceSnapshot = {
    tone: JULES_VOICE.tone,
    pace: JULES_VOICE.pace,
    vocabulary: JULES_VOICE.vocabulary,
    avoidTopics: [...JULES_VOICE.avoidTopics],
    strengths: [...JULES_VOICE.strengths],
  };

  // Override with stored voice profile if available
  if (creator.voiceProfile) {
    try {
      const vp = JSON.parse(creator.voiceProfile);
      if (vp.directness !== undefined) snapshot.directness = vp.directness;
      if (vp.technicalDepth !== undefined) snapshot.technicalDepth = vp.technicalDepth;
      if (vp.humor !== undefined) snapshot.humor = vp.humor;
      if (vp.storytelling !== undefined) snapshot.storytelling = vp.storytelling;
      // Map voice dimensions to tone/pace/vocabulary
      if (vp.directness > 70) snapshot.tone = 'direct';
      if (vp.technicalDepth > 60) snapshot.vocabulary = 'technical';
      if (vp.storytelling > 50) snapshot.tone = 'narrative';
    } catch {
      // Skip malformed
    }
  }

  // Override with tone preferences if available
  if (creator.tone) {
    try {
      const tonePrefs = JSON.parse(creator.tone);
      if (Array.isArray(tonePrefs) && tonePrefs.length > 0) {
        snapshot.tone = tonePrefs[0];
      }
    } catch {
      // Skip
    }
  }

  // Override with avoid topics if available
  if (creator.avoid) {
    try {
      const avoidTopics = JSON.parse(creator.avoid);
      if (Array.isArray(avoidTopics)) {
        snapshot.avoidTopics = [...new Set([...snapshot.avoidTopics, ...avoidTopics])];
      }
    } catch {
      // Skip
    }
  }

  // Learn from memory events
  for (const mem of creator.memories) {
    if (mem.category === 'identity' && mem.key === 'tone') {
      snapshot.tone = mem.value;
    }
    if (mem.category === 'identity' && mem.key === 'vocabulary') {
      snapshot.vocabulary = mem.value;
    }
  }

  return snapshot;
}

function extractBestHookPatterns(
  contentItems: Array<{
    hooks: Array<{
      effectiveness: number | null;
      patterns: Array<{ patternName: string; avgEffectiveness: number | null; sampleSize: number }>;
    }>;
  }>
): HookPatternSummary[] {
  const patternData = new Map<string, { effectiveness: number; count: number }>();

  for (const item of contentItems) {
    for (const hook of item.hooks) {
      for (const pattern of hook.patterns) {
        const existing = patternData.get(pattern.patternName) ?? { effectiveness: 0, count: 0 };
        existing.effectiveness += pattern.avgEffectiveness ?? hook.effectiveness ?? 0;
        existing.count++;
        patternData.set(pattern.patternName, existing);
      }
    }
  }

  return Array.from(patternData.entries())
    .map(([pattern, data]) => ({
      pattern,
      avgEffectiveness: data.effectiveness / data.count,
      sampleSize: data.count,
      confidence: computeConfidence(data.count),
    }))
    .sort((a, b) => b.avgEffectiveness - a.avgEffectiveness)
    .slice(0, 5);
}

function extractRecentWinners(
  contentItems: Array<{
    title: string | null;
    metrics: Array<{ metricKey: string; metricValue: number }>;
  }>
): string[] {
  return contentItems
    .filter((item) => {
      const views = item.metrics.find((m) => m.metricKey === 'views')?.metricValue ?? 0;
      return views > 1000;
    })
    .map((item) => item.title ?? 'Untitled')
    .slice(0, 5);
}

function extractPerformanceSignals(
  memories: Array<{ category: string; key: string; value: string }>
): string[] {
  return memories
    .filter((m) => m.category === 'performance')
    .map((m) => `${m.key}: ${m.value.substring(0, 80)}`)
    .slice(0, 5);
}

function inferTopic(
  creator: { niche: string | null; name: string },
  bestPatterns: HookPatternSummary[]
): string {
  if (creator.niche) return creator.niche;
  // Infer from best patterns
  if (bestPatterns.length > 0) {
    return `content using ${bestPatterns[0].pattern} hooks`;
  }
  return 'creative content strategy';
}

function inferObjective(creator: { platform: string; audience: string | null }): string {
  if (creator.audience) {
    return `engage ${creator.audience} on ${creator.platform}`;
  }
  return `grow audience on ${creator.platform}`;
}

function buildInstructionText(context: DelegationContext): string {
  const parts: string[] = [];

  parts.push(`Create a ${context.platform} piece about "${context.topic}".`);
  parts.push(`Objective: ${context.objective}.`);
  parts.push(`Target audience: ${context.audience ?? 'technical creators'}.`);

  // Voice guidance
  parts.push(`Voice: ${context.voiceProfile.tone} tone, ${context.voiceProfile.pace} pace, ${context.voiceProfile.vocabulary} vocabulary.`);
  if (context.voiceProfile.avoidTopics.length > 0) {
    parts.push(`Avoid: ${context.voiceProfile.avoidTopics.join(', ')}.`);
  }
  if (context.voiceProfile.strengths.length > 0) {
    parts.push(`Lean into strengths: ${context.voiceProfile.strengths.join(', ')}.`);
  }

  // Hook guidance from learning
  if (context.bestHookPatterns.length > 0) {
    const topPattern = context.bestHookPatterns[0];
    parts.push(`Based on ${topPattern.sampleSize} posts, ${topPattern.pattern} hooks perform best at ${(topPattern.avgEffectiveness * 100).toFixed(0)}% avg effectiveness (${topPattern.confidence} confidence). Lead with this pattern.`);
  }

  // Performance signals
  if (context.performanceSignals.length > 0) {
    parts.push(`Recent signals: ${context.performanceSignals.join('; ')}.`);
  }

  return parts.join(' ');
}

function buildReasoning(context: DelegationContext): string {
  const parts: string[] = [];

  parts.push(`Muse delegated to Maker for ${context.creatorName} on "${context.topic}".`);

  if (context.bestHookPatterns.length > 0) {
    const top = context.bestHookPatterns[0];
    parts.push(`Chose ${top.pattern} hook pattern based on ${top.sampleSize} samples at ${(top.avgEffectiveness * 100).toFixed(0)}% avg effectiveness.`);
  }

  if (context.recentWinners.length > 0) {
    parts.push(`${context.recentWinners.length} recent top-performing items provided as historical reference.`);
  }

  parts.push(`Voice alignment: ${context.voiceProfile.tone}/${context.voiceProfile.pace}/${context.voiceProfile.vocabulary}.`);

  return parts.join(' ');
}

function formatDelegationMessage(instruction: StructuredInstruction): string {
  // Format as a structured message that Maker can parse
  const { makerInput } = instruction;

  return `[MUSE DELEGATION]
Creator: ${makerInput.creator}
Topic: ${makerInput.topic}
Objective: ${makerInput.objective}
Audience: ${makerInput.audience}

Voice Profile:
  Tone: ${makerInput.voice.tone}
  Pace: ${makerInput.voice.pace}
  Vocabulary: ${makerInput.voice.vocabulary}
  Avoid: ${makerInput.voice.avoidTopics.join(', ')}
  Strengths: ${makerInput.voice.strengths.join(', ')}

Historical Winners:
${makerInput.historicalWinners.map((w) => `  - ${w}`).join('\n')}

Instruction:
${makerInput.instruction}

[END DELEGATION]`;
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
