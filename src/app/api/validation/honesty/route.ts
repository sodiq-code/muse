// ============================================================================
// API: /api/validation/honesty
// GET: Run statistical honesty verification
// Day 16: Phase 7 — VALIDATION
// ============================================================================

import { NextResponse } from 'next/server';
import { runHonestyVerificationDefault } from '@/lib/honesty-verifier-service';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const report = await runHonestyVerificationDefault();

    return NextResponse.json({
      success: true,
      report,
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
