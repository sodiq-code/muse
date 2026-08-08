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

export async function GET() {
  try {
    const config = getMindsConfig();
    const mode = isLiveMode() ? 'live' : 'simulate';

    // Fetch Muse mind data
    const [museMind, makerMind] = await Promise.all([
      adapterGetMind(config.museId).catch((e) => ({ error: String(e), mindId: config.museId } as const)),
      adapterGetMind(config.makerId).catch((e) => ({ error: String(e), mindId: config.makerId } as const)),
    ]);

    // Fetch cognition balances
    const [museBalance, makerBalance] = await Promise.all([
      adapterGetCognitionBalance(config.museId).catch(() => ({ mindId: config.museId, cognition: 0 })),
      adapterGetCognitionBalance(config.makerId).catch(() => ({ mindId: config.makerId, cognition: 0 })),
    ]);

    // Fetch skills
    const [museSkills, makerSkills] = await Promise.all([
      adapterListEquippedSkills(config.museId).catch(() => []),
      adapterListEquippedSkills(config.makerId).catch(() => []),
    ]);

    // Fetch circle members
    const [museCircle, makerCircle] = await Promise.all([
      adapterGetCircle(config.museId).catch(() => []),
      adapterGetCircle(config.makerId).catch(() => []),
    ]);

    return NextResponse.json({
      mode,
      connected: true,
      muse: {
        mind: 'error' in museMind ? null : museMind,
        balance: museBalance,
        skills: museSkills,
        circleMembers: museCircle,
        error: 'error' in museMind ? museMind.error : null,
      },
      maker: {
        mind: 'error' in makerMind ? null : makerMind,
        balance: makerBalance,
        skills: makerSkills,
        circleMembers: makerCircle,
        error: 'error' in makerMind ? makerMind.error : null,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { mode: 'error', connected: false, error: String(error) },
      { status: 500 }
    );
  }
}
