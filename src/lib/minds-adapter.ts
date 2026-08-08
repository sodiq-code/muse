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
  listEquippedSkills as liveListEquippedSkills,
  equipSkills as liveEquipSkills,
  getCircle as liveGetCircle,
  addCircleMembers as liveAddCircleMembers,
  getCognitionBalance as liveGetCognitionBalance,
  ensureConversation as liveEnsureConversation,
  getMindsConfig,
} from './minds-client';

// ---------------------------------------------------------------------------
// Simulated data (used when MINDS_MODE=simulate)
// ---------------------------------------------------------------------------

const SIMULATED_MUSE_MIND: BuilderMind = {
  mindId: '9fd0483e-f36b-1410-8466-00039ce7df11',
  name: 'Muse01',
  email: 'muse01@hellominds.ai',
  model: 'gpt-4o',
  species: 'mind',
  isEnabled: true,
  createdAt: '2025-01-05T00:00:00Z',
  walletAddress: '0xSimMuseWallet',
  chain: 'base',
};

const SIMULATED_MAKER_MIND: BuilderMind = {
  mindId: '15d1483e-f36b-1410-8466-00039ce7df11',
  name: 'muse_1',
  email: 'muse_1@hellominds.ai',
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
    email: 'muse_1@hellominds.ai',
    partyType: 0,
    partyId: '15d1483e-f36b-1410-8466-00039ce7df11',
    name: 'muse_1',
    circleId: 1,
    isSteward: false,
    createdAt: '2025-01-05T12:00:00Z',
  },
];

const SIMULATED_MAKER_CIRCLE: CircleMember[] = [
  {
    email: 'muse01@hellominds.ai',
    partyType: 0,
    partyId: '9fd0483e-f36b-1410-8466-00039ce7df11',
    name: 'Muse01',
    circleId: 1,
    isSteward: false,
    createdAt: '2025-01-05T12:00:00Z',
  },
];

// ---------------------------------------------------------------------------
// Adapter: routes to live or simulate based on MINDS_MODE
// ---------------------------------------------------------------------------

export function isLiveMode(): boolean {
  return getMindsConfig().mode === 'live';
}

export async function adapterGetMind(mindId: string): Promise<BuilderMind> {
  if (!isLiveMode()) {
    if (mindId === SIMULATED_MUSE_MIND.mindId) return SIMULATED_MUSE_MIND;
    if (mindId === SIMULATED_MAKER_MIND.mindId) return SIMULATED_MAKER_MIND;
    return { ...SIMULATED_MUSE_MIND, mindId, name: 'Unknown Mind' };
  }
  try {
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
    return await liveListMinds();
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

export async function adapterGetHistory(
  alias: string,
  limit?: number
): Promise<MessageRecord[]> {
  if (!isLiveMode()) {
    return [
      {
        fingerprint: 'sim-fp-1',
        messageText: 'Hello, I am Muse — your creative orchestrator.',
        senderType: 0,
        senderEmail: 'muse01@hellominds.ai',
        createdAt: new Date().toISOString(),
      },
    ];
  }
  try {
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
    return { mindId, cognition: mindId === SIMULATED_MAKER_MIND.mindId ? -9.14 : 100 };
  }
  try {
    return await liveGetCognitionBalance(mindId);
  } catch (err) {
    console.warn(`[minds-adapter] getCognitionBalance failed for ${mindId}`, err);
    return { mindId, cognition: 0 };
  }
}
