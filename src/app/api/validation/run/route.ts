// ============================================================================
// API: /api/validation/run
// POST: Run full end-to-end validation pipeline
// Day 16: Phase 7 — VALIDATION
// ============================================================================

import { NextResponse } from 'next/server';
import { runE2EValidationDefault } from '@/lib/e2e-validation-service';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    const result = await runE2EValidationDefault();

    return NextResponse.json({
      success: true,
      result,
      message: result.overallPass
        ? `All ${result.stepsTotal} validation steps passed (${result.totalDurationMs}ms)`
        : `${result.stepsPassing}/${result.stepsTotal} steps passed — see details`,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
