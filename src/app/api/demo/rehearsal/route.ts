import { NextRequest, NextResponse } from 'next/server';
import {
  runDemoRehearsal,
  isRehearsalRunning,
  getDemoFallbackMode,
  type RehearsalResult,
} from '@/lib/demo-reliability-service';

export const dynamic = 'force-dynamic';

// In-memory rehearsal state
let lastRehearsalResult: RehearsalResult | null = null;

export async function GET() {
  try {
    return NextResponse.json({
      isRunning: isRehearsalRunning(),
      lastResult: lastRehearsalResult,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { error: String(error), timestamp: new Date().toISOString() },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const action = body.action as string;

    // Stop rehearsal
    if (action === 'stop') {
      return NextResponse.json({
        message: 'Rehearsal stop requested',
        isRunning: isRehearsalRunning(),
        lastResult: lastRehearsalResult,
        timestamp: new Date().toISOString(),
      });
    }

    // Reset rehearsal
    if (action === 'reset') {
      lastRehearsalResult = null;
      return NextResponse.json({
        message: 'Rehearsal reset',
        isRunning: false,
        lastResult: null,
        timestamp: new Date().toISOString(),
      });
    }

    // Start rehearsal
    if (isRehearsalRunning()) {
      return NextResponse.json(
        { error: 'Rehearsal already in progress', isRunning: true },
        { status: 409 }
      );
    }

    const fallbackDecision = await getDemoFallbackMode();

    // Run the rehearsal (async — don't block the response for all 10 scenes)
    // Instead, start it and return immediately
    runDemoRehearsal()
      .then((result) => {
        lastRehearsalResult = result;
      })
      .catch((err) => {
        console.error('[demo-rehearsal] Failed:', err);
      });

    return NextResponse.json({
      message: 'Rehearsal started',
      isRunning: true,
      fallbackMode: fallbackDecision.mode,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { error: String(error), timestamp: new Date().toISOString() },
      { status: 500 }
    );
  }
}
