import { NextResponse } from 'next/server';
import {
  checkMindsApiHealth,
  getDemoFallbackMode,
} from '@/lib/demo-reliability-service';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const [health, fallback] = await Promise.all([
      checkMindsApiHealth(),
      getDemoFallbackMode(),
    ]);

    return NextResponse.json({
      health: {
        status: health.status,
        latencyMs: health.latencyMs,
        checkedAt: health.checkedAt,
        cached: health.cached,
        error: health.error,
      },
      fallback: {
        mode: fallback.mode,
        reason: fallback.reason,
        healthStatus: fallback.healthStatus,
        latencyMs: fallback.latencyMs,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        health: { status: 'down', latencyMs: -1, error: String(error) },
        fallback: { mode: 'prerecorded', reason: 'Health check failed — using fallback' },
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
