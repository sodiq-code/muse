import {
  type BuilderMind,
  type EquippedSkill,
  type CircleMember,
  type CognitionBalance,
  type MessageRecord,
} from '@animocabrands/minds-client-lib';
import {
  getMind as liveGetMind,
  listMinds as liveListMinds,
  sendMessage as liveSendMessage,
  getHistory as liveGetHistory,
  waitForReply as liveWaitForReply,
  listEquippedSkills as liveListEquippedSkills,
  equipSkills as liveEquipSkills,
  getCircle as liveGetCircle,
  addCircleMembers as liveAddCircleMembers,
  getCognitionBalance as liveGetCognitionBalance,
  ensureConversation as liveEnsureConversation,
  // Maker-specific imports (Account 2 API key)
  makerGetMind as liveMakerGetMind,
  makerEnsureConversation as liveMakerEnsureConversation,
  makerSendMessage as liveMakerSendMessage,
  makerWaitForReply as liveMakerWaitForReply,
  makerGetHistory as liveMakerGetHistory,
  makerGetCognitionBalance as liveMakerGetCognitionBalance,
  makerGetCircle as liveMakerGetCircle,
  makerAddCircleMembers as liveMakerAddCircleMembers,
  makerListEquippedSkills as liveMakerListEquippedSkills,
  getMindsConfig,
} from './minds-client';

// ---------------------------------------------------------------------------
// Simulated data (used when MINDS_MODE=simulate)
// Updated to match real Mind IDs
// ---------------------------------------------------------------------------

const SIMULATED_MUSE_MIND: BuilderMind = {
  mindId: '9fd0483e-f36b-1410-8466-00039ce7df11',
  name: 'Muse01',
  email: 'sodiqjimoh80@gmail.com',
  model: 'gpt-4o',
  species: 'mind',
  isEnabled: true,
  createdAt: '2025-01-05T00:00:00Z',
  walletAddress: '0xSimMuseWallet',
  chain: 'base',
};

const SIMULATED_MAKER_MIND: BuilderMind = {
  mindId: '2337493e-f36b-1410-8466-00039ce7df11',
  name: 'muse02',
  email: 'sodiqbolaji88@gmail.com',
  model: 'gpt-4o',
  species: 'mind',
  isEnabled: true,
  createdAt: '2025-01-05T00:00:00Z',
  walletAddress: '0xSimMakerWallet',
  chain: 'base',
};

const SIMULATED_MUSE_SKILLS: EquippedSkill[] = [
  {
    skillId: 'passive-autonomous-soul',
    name: 'Passive Autonomous Soul',
    description: 'Enables autonomous background processing',
    source: 'system',
    equippedAtUtc: '2025-01-05T12:00:00Z',
  },
  {
    skillId: 'deep-research',
    name: 'DeepResearch',
    description: 'Deep research and analysis capability',
    source: 'system',
    equippedAtUtc: '2025-01-05T12:01:00Z',
  },
];

const SIMULATED_MAKER_SKILLS: EquippedSkill[] = [];

const SIMULATED_MUSE_CIRCLE: CircleMember[] = [
  {
    email: 'sodiqjimoh80@gmail.com',
    partyType: 1,
    partyId: '8fd0483e-f36b-1410-8466-00039ce7df11',
    name: 'Muse01',
    circleId: -2146577074,
    isSteward: true,
    createdAt: '2026-08-08T15:56:35.29',
  },
  {
    email: 'sodiqbolaji88@gmail.com',
    partyType: 1,
    partyId: 'eb36493e-f36b-1410-8466-00039ce7df11',
    name: 'muse02',
    circleId: -2146571480,
    isSteward: false,
    createdAt: '2026-08-24T00:36:48.8682444',
  },
  {
    email: 'muse_1@hellominds.ai',
    partyType: 0,
    partyId: '15d1483e-f36b-1410-8466-00039ce7df11',
    name: 'muse_1',
    circleId: -2146577066,
    isSteward: false,
    createdAt: '2026-08-08T17:44:04.9172102',
  },
];

const SIMULATED_MAKER_CIRCLE: CircleMember[] = [
  {
    email: 'sodiqjimoh80@gmail.com',
    partyType: 1,
    partyId: '8fd0483e-f36b-1410-8466-00039ce7df11',
    name: 'Muse01',
    circleId: -2146577074,
    isSteward: false,
    createdAt: '2026-08-08T15:56:35.29',
  },
];

// ---------------------------------------------------------------------------
// Adapter: routes to live or simulate based on MINDS_MODE
// ---------------------------------------------------------------------------

export function isLiveMode(): boolean {
  return getMindsConfig().mode === 'live';
}

export function getMode(): 'live' | 'simulate' {
  return getMindsConfig().mode === 'live' ? 'live' : 'simulate';
}

export async function adapterGetMind(mindId: string): Promise<BuilderMind> {
  if (!isLiveMode()) {
    if (mindId === SIMULATED_MUSE_MIND.mindId) return SIMULATED_MUSE_MIND;
    if (mindId === SIMULATED_MAKER_MIND.mindId) return SIMULATED_MAKER_MIND;
    return { ...SIMULATED_MUSE_MIND, mindId, name: 'Unknown Mind' };
  }
  try {
    // Determine which client to use based on mindId
    const config = getMindsConfig();
    if (mindId === config.makerId && config.isDualAccount) {
      return await liveMakerGetMind(mindId);
    }
    return await liveGetMind(mindId);
  } catch (err) {
    console.warn(`[minds-adapter] getMind failed for ${mindId}, using fallback`, err);
    if (mindId === SIMULATED_MUSE_MIND.mindId) return SIMULATED_MUSE_MIND;
    if (mindId === SIMULATED_MAKER_MIND.mindId) return SIMULATED_MAKER_MIND;
    throw err;
  }
}

export async function adapterListMinds(): Promise<BuilderMind[]> {
  if (!isLiveMode()) return [SIMULATED_MUSE_MIND, SIMULATED_MAKER_MIND];
  try {
    const config = getMindsConfig();
    // Fetch from both accounts in parallel
    const [museMinds, makerMinds] = await Promise.all([
      liveListMinds().catch(() => [] as BuilderMind[]),
      config.isDualAccount ? liveMakerGetMind().then((m) => [m]).catch(() => [] as BuilderMind[]) : Promise.resolve([] as BuilderMind[]),
    ]);
    // Combine and deduplicate
    const allMinds = [...museMinds, ...makerMinds];
    if (allMinds.length > 0) return allMinds;
    return [SIMULATED_MUSE_MIND, SIMULATED_MAKER_MIND];
  } catch (err) {
    console.warn('[minds-adapter] listMinds failed, using fallback', err);
    return [SIMULATED_MUSE_MIND, SIMULATED_MAKER_MIND];
  }
}

export async function adapterSendMessage(
  alias: string,
  message: string,
  _mindId?: string
): Promise<{ success: boolean; alias: string }> {
  if (!isLiveMode()) {
    return { success: true, alias };
  }
  try {
    await liveEnsureConversation(alias, _mindId ?? getMindsConfig().museId);
    await liveSendMessage(alias, message);
    return { success: true, alias };
  } catch (err) {
    console.warn('[minds-adapter] sendMessage failed', err);
    return { success: false, alias };
  }
}

/**
 * Send message to Maker and wait for reply.
 * Uses the MAKER's own API key (Account 2) for proper authentication.
 * This is the core of the delegation flow: Muse→Maker.
 */
export async function adapterSendMessageAndWait(
  alias: string,
  message: string,
  mindId?: string,
  timeoutMs: number = 120_000
): Promise<{ success: boolean; alias: string; reply?: string; error?: string }> {
  if (!isLiveMode()) {
    return { success: true, alias, reply: '[Simulated Maker response] Content draft generated based on instruction.' };
  }
  try {
    const config = getMindsConfig();
    const targetMindId = mindId ?? config.makerId;

    // Use Maker's own API key (Account 2) for Maker operations
    // This is critical because Maker is on a separate account
    if (config.isDualAccount && targetMindId === config.makerId) {
      console.log('[minds-adapter] Using Maker API key (Account 2) for delegation');
      await liveMakerEnsureConversation(alias, targetMindId);
      await liveMakerSendMessage(alias, message);
      const reply = await liveMakerWaitForReply(alias, timeoutMs, message);
      const replyStr = typeof reply === 'string' ? reply : JSON.stringify(reply);
      return { success: true, alias, reply: replyStr };
    }

    // Fallback: use Muse client (for same-account Minds)
    await liveEnsureConversation(alias, targetMindId);
    await liveSendMessage(alias, message);
    const reply = await liveWaitForReply(alias, timeoutMs, message);
    const replyStr = typeof reply === 'string' ? reply : JSON.stringify(reply);
    return { success: true, alias, reply: replyStr };
  } catch (err) {
    console.warn('[minds-adapter] sendMessageAndWait failed', err);
    return { success: false, alias, error: String(err) };
  }
}

export async function adapterGetHistory(
  alias: string,
  limit?: number,
  useMakerClient: boolean = false
): Promise<MessageRecord[]> {
  if (!isLiveMode()) {
    return [
      {
        fingerprint: 'sim-fp-1',
        messageText: 'Hello, I am Muse — your creative orchestrator.',
        senderType: 0,
        senderEmail: 'sodiqjimoh80@gmail.com',
        createdAt: new Date().toISOString(),
      },
    ];
  }
  try {
    if (useMakerClient) {
      return await liveMakerGetHistory(alias, limit);
    }
    return await liveGetHistory(alias, limit);
  } catch (err) {
    console.warn('[minds-adapter] getHistory failed', err);
    return [];
  }
}

export async function adapterListEquippedSkills(
  mindId: string
): Promise<EquippedSkill[]> {
  if (!isLiveMode()) {
    if (mindId === SIMULATED_MUSE_MIND.mindId) return SIMULATED_MUSE_SKILLS;
    if (mindId === SIMULATED_MAKER_MIND.mindId) return SIMULATED_MAKER_SKILLS;
    return [];
  }
  try {
    const config = getMindsConfig();
    // Use Maker client for Maker mind
    if (mindId === config.makerId && config.isDualAccount) {
      return await liveMakerListEquippedSkills(mindId);
    }
    return await liveListEquippedSkills(mindId);
  } catch (err) {
    console.warn(`[minds-adapter] listEquippedSkills failed for ${mindId}`, err);
    if (mindId === SIMULATED_MUSE_MIND.mindId) return SIMULATED_MUSE_SKILLS;
    if (mindId === SIMULATED_MAKER_MIND.mindId) return SIMULATED_MAKER_SKILLS;
    return [];
  }
}

export async function adapterEquipSkills(
  mindId: string,
  skillIds: string[]
) {
  if (!isLiveMode()) {
    return { results: skillIds.map((id) => ({ skillId: id, isEquipped: true, changed: true })) };
  }
  try {
    return await liveEquipSkills(mindId, skillIds);
  } catch (err) {
    console.warn('[minds-adapter] equipSkills failed', err);
    return { results: [] };
  }
}

export async function adapterGetCircle(
  mindId: string
): Promise<CircleMember[]> {
  if (!isLiveMode()) {
    if (mindId === SIMULATED_MUSE_MIND.mindId) return SIMULATED_MUSE_CIRCLE;
    if (mindId === SIMULATED_MAKER_MIND.mindId) return SIMULATED_MAKER_CIRCLE;
    return [];
  }
  try {
    const config = getMindsConfig();
    // Use Maker client for Maker's circle
    if (mindId === config.makerId && config.isDualAccount) {
      return await liveMakerGetCircle(mindId);
    }
    return await liveGetCircle(mindId);
  } catch (err) {
    console.warn(`[minds-adapter] getCircle failed for ${mindId}`, err);
    if (mindId === SIMULATED_MUSE_MIND.mindId) return SIMULATED_MUSE_CIRCLE;
    if (mindId === SIMULATED_MAKER_MIND.mindId) return SIMULATED_MAKER_CIRCLE;
    return [];
  }
}

export async function adapterAddCircleMembers(
  mindId: string,
  emails: string[]
) {
  if (!isLiveMode()) {
    return {
      items: emails.map((e) => ({ email: e, action: 'added' })),
      summary: { activated: emails.length },
    };
  }
  try {
    const config = getMindsConfig();
    // Use Maker client for Maker's circle
    if (mindId === config.makerId && config.isDualAccount) {
      return await liveMakerAddCircleMembers(mindId, emails);
    }
    return await liveAddCircleMembers(mindId, emails);
  } catch (err) {
    console.warn('[minds-adapter] addCircleMembers failed', err);
    return { items: [], summary: {} };
  }
}

export async function adapterGetCognitionBalance(
  mindId: string
): Promise<CognitionBalance> {
  if (!isLiveMode()) {
    return { mindId, cognition: mindId === SIMULATED_MAKER_MIND.mindId ? 0 : 133.52 };
  }
  try {
    const config = getMindsConfig();
    // Use Maker client for Maker's balance
    if (mindId === config.makerId && config.isDualAccount) {
      return await liveMakerGetCognitionBalance(mindId);
    }
    return await liveGetCognitionBalance(mindId);
  } catch (err) {
    console.warn(`[minds-adapter] getCognitionBalance failed for ${mindId}`, err);
    return { mindId, cognition: 0 };
  }
}
