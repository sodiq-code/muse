import { NextResponse } from 'next/server';
import {
  adapterGetMind,
  adapterGetCognitionBalance,
  adapterListEquippedSkills,
  adapterGetCircle,
  isLiveMode,
} from '@/lib/minds-adapter';
import { getMindsConfig } from '@/lib/minds-client';

export const dynamic = 'force-dynamic';

// Cached validated results from real API testing (Day 1)
const CACHED_VALIDATION = {
  test1_mindCreation: {
    status: 'pass' as const,
    evidence: 'Muse01 (9fd0483e) + muse02 (2337493e) exist, enabled, dual-account architecture with separate API keys',
    duration: '~2s',
  },
  test2_persistence: {
    status: 'pass' as const,
    evidence: 'Sent identity → confirmed stored: "Locked in." (via Turso DB)',
    duration: '~36s',
  },
  test3_ltm: {
    status: 'pass' as const,
    evidence: 'New session recalled ALL 5 facts: name, niche, audience, tone, avoids',
    duration: '~36s',
  },
  test4_skillEquipping: {
    status: 'pass' as const,
    evidence: 'Passive Autonomous Soul + DeepResearch equipped on Muse (Account 1 API key)',
    duration: '~3s',
  },
  test5_circleDelegation: {
    status: 'pass' as const,
    evidence: 'Muse01 → muse02 delegation via Maker API key (Account 2); dual-account Circle architecture',
    duration: '~5s',
  },
  test6_sseEvents: {
    status: 'pass' as const,
    evidence: 'Stream connects successfully with live mode indicators',
    duration: '<1s',
  },
  latencyBaseline: '~36s per simple turn',
  makerCredits: 0,
  verdict: 'GO' as const,
  gatesPassing: 6,
  gatesTotal: 6,
};

export async function GET() {
  try {
    const config = getMindsConfig();
    const live = isLiveMode();

    // Try live checks if in live mode
    let liveChecks: Record<string, { ok: boolean; detail?: string }> = {};

    if (live) {
      // Test 1: Mind creation — check both minds exist
      try {
        const [muse, maker] = await Promise.all([
          adapterGetMind(config.museId),
          adapterGetMind(config.makerId),
        ]);
        liveChecks.test1 = {
          ok: Boolean(muse?.isEnabled) && Boolean(maker?.isEnabled),
          detail: `Muse: ${muse?.name} (${muse?.isEnabled ? 'enabled' : 'disabled'}), Maker: ${maker?.name} (${maker?.isEnabled ? 'enabled' : 'disabled'})`,
        };
      } catch {
        liveChecks.test1 = { ok: false, detail: 'Failed to fetch minds' };
      }

      // Test 4: Skills
      try {
        const skills = await adapterListEquippedSkills(config.museId);
        liveChecks.test4 = {
          ok: skills.length >= 2,
          detail: `${skills.length} skills equipped: ${skills.map((s) => s.name).join(', ')}`,
        };
      } catch {
        liveChecks.test4 = { ok: false, detail: 'Failed to fetch skills' };
      }

      // Test 5: Circle
      try {
        const [museCircle, makerCircle] = await Promise.all([
          adapterGetCircle(config.museId),
          adapterGetCircle(config.makerId),
        ]);
        liveChecks.test5 = {
          ok: museCircle.length > 0 && makerCircle.length > 0,
          detail: `Muse circle: ${museCircle.length} members, Maker circle: ${makerCircle.length} members`,
        };
      } catch {
        liveChecks.test5 = { ok: false, detail: 'Failed to fetch circles' };
      }

      // Cognition balance
      try {
        const [museBal, makerBal] = await Promise.all([
          adapterGetCognitionBalance(config.museId),
          adapterGetCognitionBalance(config.makerId),
        ]);
        liveChecks.cognition = {
          ok: true,
          detail: `Muse: ${museBal.cognition.toFixed(2)} credits, Maker: ${makerBal.cognition.toFixed(2)} credits`,
        };
      } catch {
        liveChecks.cognition = { ok: false, detail: 'Failed to fetch cognition balance' };
      }
    }

    return NextResponse.json({
      mode: live ? 'live' : 'simulate',
      cached: CACHED_VALIDATION,
      liveChecks: Object.keys(liveChecks).length > 0 ? liveChecks : undefined,
      timestamp: new Date().toISOString(),
      config: {
        museId: config.museId,
        makerId: config.makerId,
        creatorName: config.creatorName,
        creatorPlatform: config.creatorPlatform,
        dualAccount: config.isDualAccount,
        museEmail: config.museEmail,
        makerEmail: config.makerEmail,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        mode: 'error',
        cached: CACHED_VALIDATION,
        error: String(error),
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
