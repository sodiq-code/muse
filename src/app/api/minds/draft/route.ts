import { NextRequest, NextResponse } from 'next/server';
import { simulateMakerOutput, createJulesInstruction, type MakerInstruction } from '@/lib/maker-simulator';
import { adapterSendMessageAndWait, isLiveMode } from '@/lib/minds-adapter';
import { getMindsConfig } from '@/lib/minds-client';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Build instruction from request or use Jules defaults
    const instruction: MakerInstruction = body.instruction
      ? body.instruction
      : createJulesInstruction(
          body.topic ?? 'AI agents in production',
          body.objective ?? 'build production-ready AI systems',
          body.overrides
        );

    if (isLiveMode()) {
      // LIVE MODE: Send to real Maker Mind and wait for response
      const config = getMindsConfig();
      const delegationMessage = `[MUSE DRAFT REQUEST]
Topic: ${instruction.topic}
Objective: ${instruction.objective}
Audience: ${instruction.audience}
Creator: ${instruction.creator}
Voice: ${instruction.voice.tone} tone, ${instruction.voice.pace} pace
Instruction: ${instruction.instruction}
[END REQUEST]`;

      const startTime = Date.now();
      const result = await adapterSendMessageAndWait(
        'muse-draft',
        delegationMessage,
        config.makerId,
        90_000 // 90 second timeout
      );
      const creditsUsed = (Date.now() - startTime) > 5000 ? 1 : 0; // Estimate

      if (result.success && result.reply) {
        // Parse Maker's real response
        let output;
        try {
          const parsed = JSON.parse(result.reply);
          output = {
            script: parsed.script ?? result.reply,
            caption: parsed.caption ?? '',
            title: parsed.title ?? instruction.topic,
            cta: parsed.cta ?? '',
            alternativeHooks: parsed.alternativeHooks ?? [],
            voiceMatch: parsed.voiceMatch ?? 0.85,
            hookCompat: parsed.hookCompat ?? 0.82,
            source: 'live' as const,
          };
        } catch {
          output = {
            ...simulateMakerOutput(instruction),
            script: result.reply,
            source: 'live' as const,
          };
        }

        return NextResponse.json({
          success: true,
          draft: output,
          metadata: {
            generatedAt: new Date().toISOString(),
            source: 'live',
            creditsUsed,
            hookPatternsAvailable: 8,
            voiceMatch: output.voiceMatch,
            hookCompat: output.hookCompat,
            makerMindId: config.makerId,
            responseTime: Date.now() - startTime,
          },
        });
      }

      // Live failed — fall through to simulator
      console.warn('[api/minds/draft] Live Maker failed, using simulator fallback');
    }

    // SIMULATED MODE (or live fallback): Generate draft using Maker simulator (0 credits)
    const output = simulateMakerOutput(instruction);

    return NextResponse.json({
      success: true,
      draft: output,
      metadata: {
        generatedAt: new Date().toISOString(),
        source: isLiveMode() ? 'simulated-fallback' : 'simulated',
        creditsUsed: 0,
        hookPatternsAvailable: 8,
        voiceMatch: output.voiceMatch,
        hookCompat: output.hookCompat,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
