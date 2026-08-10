import {
  createMindsClient,
  type MindsClient,
  type BuilderMind,
  type Conversation,
  type MessageRecord,
  type EquippedSkill,
  type CircleMember,
  type CognitionBalance,
  type CognitionUsageResponse,
  type EquipMutationResult,
  type EquipSkillResultItem,
} from '@animocabrands/minds-client-lib';

// ---------------------------------------------------------------------------
// Environment helpers — Dual Account Architecture
//
// Account 1 (Muse01): sodiqjimoh80@gmail.com — Orchestrator
// Account 2 (muse02):  sodiqbolaji88@gmail.com — Maker/Creative
//
// Each account has its own API key, Human ID, and Mind ID.
// We create TWO Minds SDK clients — one per account.
// ---------------------------------------------------------------------------

export function getMindsConfig() {
  return {
    // Account 1: Muse (Orchestrator)
    builderApiKey: process.env.MINDS_BUILDER_API_KEY ?? '',
    humanId: process.env.MINDS_HUMAN_ID ?? '',
    museId: process.env.MINDS_MUSE_ID ?? '',
    museEmail: process.env.MINDS_MUSE_EMAIL ?? '',

    // Account 2: Maker (Creative)
    makerApiKey: process.env.MINDS_MAKER_API_KEY ?? '',
    makerHumanId: process.env.MINDS_MAKER_HUMAN_ID ?? '',
    makerId: process.env.MINDS_MAKER_ID ?? '',
    makerEmail: process.env.MINDS_MAKER_EMAIL ?? '',

    // General
    mode: (process.env.MINDS_MODE ?? 'simulate') as 'live' | 'simulate',
    creatorName: process.env.CREATOR_NAME ?? 'Creator',
    creatorEmail: process.env.CREATOR_EMAIL ?? '',
    creatorPlatform: process.env.CREATOR_PLATFORM ?? 'youtube',

    // Derived flags
    isDualAccount: !!(process.env.MINDS_MAKER_API_KEY && process.env.MINDS_MAKER_HUMAN_ID),
  };
}

// ---------------------------------------------------------------------------
// Dual Minds client singletons
// ---------------------------------------------------------------------------

let _museClient: MindsClient | null = null;
let _makerClient: MindsClient | null = null;

/** Get the Muse client (Account 1 — sodiqjimoh80@gmail.com) */
export function getMuseClient(): MindsClient {
  if (_museClient) return _museClient;
  const config = getMindsConfig();
  _museClient = createMindsClient({ builderApiKey: config.builderApiKey });
  return _museClient;
}

/** Get the Maker client (Account 2 — sodiqbolaji88@gmail.com) */
export function getMakerClient(): MindsClient {
  if (_makerClient) return _makerClient;
  const config = getMindsConfig();
  if (!config.makerApiKey) {
    // Fallback to Muse client if no Maker key configured
    return getMuseClient();
  }
  _makerClient = createMindsClient({ builderApiKey: config.makerApiKey });
  return _makerClient;
}

/** Legacy: getMindsClient returns the Muse client */
export function getMindsClient(): MindsClient {
  return getMuseClient();
}

// ---------------------------------------------------------------------------
// Typed wrapper methods — MUSE (Account 1)
// ---------------------------------------------------------------------------

export async function getMind(mindId: string): Promise<BuilderMind> {
  const client = getMuseClient();
  return client.getMind(mindId);
}

export async function listMinds(): Promise<BuilderMind[]> {
  const client = getMuseClient();
  return client.listMinds();
}

export async function createConversation(
  alias: string,
  mindId: string
): Promise<Conversation> {
  const client = getMuseClient();
  return client.createConversation({ alias, mindId });
}

export async function sendMessage(
  alias: string,
  messageText: string
): Promise<Record<string, unknown>> {
  const client = getMuseClient();
  return client.sendMessage({ alias, messageText });
}

export async function getHistory(
  alias: string,
  limit?: number
): Promise<MessageRecord[]> {
  const client = getMuseClient();
  return client.getHistory(alias, { limit: limit ?? 50 });
}

export async function waitForReply(
  alias: string,
  timeoutMs: number = 120_000,
  sentMessageText?: string
) {
  const client = getMuseClient();
  return client.waitForReply({ alias, timeoutMs, sentMessageText });
}

export async function listEquippedSkills(
  mindId: string
): Promise<EquippedSkill[]> {
  const client = getMuseClient();
  return client.listEquippedSkills(mindId);
}

export async function equipSkills(
  mindId: string,
  skillIds: string[]
): Promise<EquipMutationResult<EquipSkillResultItem>> {
  const client = getMuseClient();
  return client.equipSkills(mindId, { ids: skillIds });
}

export async function getCircle(mindId: string): Promise<CircleMember[]> {
  const client = getMuseClient();
  return client.getCircle(mindId);
}

export async function addCircleMembers(
  mindId: string,
  emails: string[]
) {
  const client = getMuseClient();
  return client.addCircleMembers(mindId, { emails });
}

export async function getCognitionBalance(
  mindId: string
): Promise<CognitionBalance> {
  const client = getMuseClient();
  return client.getCognitionBalance(mindId);
}

export async function getCognitionUsage(
  mindId: string,
  interval: '1m' | '5m' | '15m' | '1h' | '1d' | '1w' | '1M' = '1d'
): Promise<CognitionUsageResponse> {
  const client = getMuseClient();
  return client.getCognitionUsage(mindId, { interval });
}

export async function getConversation(alias: string): Promise<Conversation> {
  const client = getMuseClient();
  return client.getConversation(alias);
}

export async function ensureConversation(
  alias: string,
  mindId: string
): Promise<Conversation> {
  const client = getMuseClient();
  return client.ensureConversation(alias, mindId);
}

// ---------------------------------------------------------------------------
// Typed wrapper methods — MAKER (Account 2 — uses its own API key)
// These are used for delegation: sending instructions to Maker and
// receiving creative output back.
// ---------------------------------------------------------------------------

export async function makerGetMind(mindId?: string): Promise<BuilderMind> {
  const client = getMakerClient();
  return client.getMind(mindId ?? getMindsConfig().makerId);
}

export async function makerListMinds(): Promise<BuilderMind[]> {
  const client = getMakerClient();
  return client.listMinds();
}

export async function makerEnsureConversation(
  alias: string,
  mindId?: string
): Promise<Conversation> {
  const client = getMakerClient();
  return client.ensureConversation(alias, mindId ?? getMindsConfig().makerId);
}

export async function makerSendMessage(
  alias: string,
  messageText: string
): Promise<Record<string, unknown>> {
  const client = getMakerClient();
  return client.sendMessage({ alias, messageText });
}

export async function makerWaitForReply(
  alias: string,
  timeoutMs: number = 120_000,
  sentMessageText?: string
) {
  const client = getMakerClient();
  return client.waitForReply({ alias, timeoutMs, sentMessageText });
}

export async function makerGetHistory(
  alias: string,
  limit?: number
): Promise<MessageRecord[]> {
  const client = getMakerClient();
  return client.getHistory(alias, { limit: limit ?? 50 });
}

export async function makerGetCognitionBalance(
  mindId?: string
): Promise<CognitionBalance> {
  const client = getMakerClient();
  return client.getCognitionBalance(mindId ?? getMindsConfig().makerId);
}

export async function makerGetCircle(mindId?: string): Promise<CircleMember[]> {
  const client = getMakerClient();
  return client.getCircle(mindId ?? getMindsConfig().makerId);
}

export async function makerAddCircleMembers(
  mindId: string,
  emails: string[]
) {
  const client = getMakerClient();
  return client.addCircleMembers(mindId, { emails });
}

export async function makerListEquippedSkills(
  mindId?: string
): Promise<EquippedSkill[]> {
  const client = getMakerClient();
  return client.listEquippedSkills(mindId ?? getMindsConfig().makerId);
}
