import { NextRequest, NextResponse } from 'next/server';
import { simulateMakerOutput, createJulesInstruction, type MakerInstruction } from '@/lib/maker-simulator';

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

    // Generate draft using Maker simulator (0 credits)
    const output = simulateMakerOutput(instruction);

    return NextResponse.json({
      success: true,
      draft: output,
      metadata: {
        generatedAt: new Date().toISOString(),
        source: 'simulated',
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
