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

    // Fetch Muse mind data (primary — owned by this API key)
    const museMind = await adapterGetMind(config.museId).catch((e) => ({ error: String(e), mindId: config.museId } as const));

    // Fetch Maker mind data (may fail with "You do not own this mind" if cross-account)
    const makerMind = await adapterGetMind(config.makerId).catch((e) => {
      const errStr = String(e);
      const isOwnershipError = errStr.includes('do not own') || errStr.includes('403') || errStr.includes('BAD_INPUT');
      return {
        error: isOwnershipError ? 'Cross-account Mind — use Circle for delegation' : errStr,
        mindId: config.makerId,
        isCrossAccount: isOwnershipError,
      } as const;
    });

    // Fetch cognition balances (maker may fail for cross-account)
    const museBalance = await adapterGetCognitionBalance(config.museId).catch(() => ({ mindId: config.museId, cognition: 0 }));
    const makerBalance = await adapterGetCognitionBalance(config.makerId).catch(() => ({
      mindId: config.makerId,
      cognition: 0,
      note: 'Cross-account — balance not accessible via this API key',
    }));

    // Fetch skills (maker may fail for cross-account)
    const museSkills = await adapterListEquippedSkills(config.museId).catch(() => []);
    const makerSkills = await adapterListEquippedSkills(config.makerId).catch(() => []);

    // Fetch circle members
    const museCircle = await adapterGetCircle(config.museId).catch(() => []);
    const makerCircle = await adapterGetCircle(config.makerId).catch(() => []);

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
        isCrossAccount: 'isCrossAccount' in makerMind ? (makerMind as any).isCrossAccount : false,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { mode: 'error', connected: false, error: String(error) },
      { status: 500 }
    );
  }
}
