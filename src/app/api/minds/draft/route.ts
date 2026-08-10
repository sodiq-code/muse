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
      // LIVE MODE: Send to real Maker Mind via Maker API key (Account 2)
      const config = getMindsConfig();
      const delegationMessage = `[MUSE DRAFT REQUEST]
Topic: ${instruction.topic}
Objective: ${instruction.objective}
Audience: ${instruction.audience}
Creator: ${instruction.creator}
Voice: ${instruction.voice.tone} tone, ${instruction.voice.pace} pace
Vocabulary: ${instruction.voice.vocabulary}
Avoid: ${instruction.voice.avoidTopics.join(', ')}
Strengths: ${instruction.voice.strengths.join(', ')}
Instruction: ${instruction.instruction}
[END REQUEST]`;

      const startTime = Date.now();
      const result = await adapterSendMessageAndWait(
        'muse-draft',
        delegationMessage,
        config.makerId,
        90_000 // 90 second timeout
      );
      const responseTime = Date.now() - startTime;

      if (result.success && result.reply) {
        // Parse Maker's real response
        // The Minds SDK waitForReply returns a complex JSON object
        // We need to extract the messageText from it
        let replyText = result.reply;
        try {
          const parsed = JSON.parse(result.reply);
          // Extract messageText from Minds SDK response format
          if (parsed.reply?.messageText) {
            replyText = parsed.reply.messageText;
          } else if (parsed.messageText) {
            replyText = parsed.messageText;
          } else if (typeof parsed === 'string') {
            replyText = parsed;
          }
          // Try to parse the messageText as JSON (Maker might return structured output)
          try {
            const structured = JSON.parse(replyText);
            if (structured.script || structured.title || structured.caption) {
              // Maker returned structured output — use it directly
              const output = {
                script: structured.script ?? replyText,
                caption: structured.caption ?? '',
                title: structured.title ?? instruction.topic,
                cta: structured.cta ?? '',
                alternativeHooks: structured.alternativeHooks ?? [],
                thumbnailConcept: structured.thumbnailConcept,
                voiceMatch: structured.voiceMatch ?? 0.85,
                hookCompat: structured.hookCompat ?? 0.82,
                source: 'live' as const,
              };
              return NextResponse.json({
                success: true,
                draft: output,
                metadata: {
                  generatedAt: new Date().toISOString(),
                  source: 'live',
                  creditsUsed: 1,
                  hookPatternsAvailable: 8,
                  voiceMatch: output.voiceMatch,
                  hookCompat: output.hookCompat,
                  makerMindId: config.makerId,
                  responseTime,
                },
              });
            }
          } catch {
            // messageText is plain text, not structured — use it as script
          }
        } catch {
          // reply is not JSON — use as-is
        }

        // Maker returned plain text (or we couldn't parse structured output)
        // Wrap it with simulated structure but mark source as 'live'
        const output = {
          ...simulateMakerOutput(instruction),
          script: replyText,
          source: 'live' as const,
        };

        return NextResponse.json({
          success: true,
          draft: output,
          metadata: {
            generatedAt: new Date().toISOString(),
            source: 'live',
            creditsUsed: 1,
            hookPatternsAvailable: 8,
            voiceMatch: output.voiceMatch,
            hookCompat: output.hookCompat,
            makerMindId: config.makerId,
            responseTime,
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
