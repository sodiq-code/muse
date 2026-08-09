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
// Environment helpers
// ---------------------------------------------------------------------------

export function getMindsConfig() {
  return {
    builderApiKey: process.env.MINDS_BUILDER_API_KEY ?? '',
    humanId: process.env.MINDS_HUMAN_ID ?? '',
    museId: process.env.MINDS_MUSE_ID ?? '',
    makerId: process.env.MINDS_MAKER_ID ?? '',
    museEmail: process.env.MINDS_MUSE_EMAIL ?? '',
    makerEmail: process.env.MINDS_MAKER_EMAIL ?? '',
    mode: (process.env.MINDS_MODE ?? 'simulate') as 'live' | 'simulate',
    creatorName: process.env.CREATOR_NAME ?? 'Creator',
    creatorEmail: process.env.CREATOR_EMAIL ?? '',
    creatorPlatform: process.env.CREATOR_PLATFORM ?? 'youtube',
  };
}

// ---------------------------------------------------------------------------
// Live Minds client singleton
// ---------------------------------------------------------------------------

let _client: MindsClient | null = null;

export function getMindsClient(): MindsClient {
  if (_client) return _client;
  const config = getMindsConfig();
  _client = createMindsClient({ builderApiKey: config.builderApiKey });
  return _client;
}

// ---------------------------------------------------------------------------
// Typed wrapper methods (used by API routes)
// ---------------------------------------------------------------------------

export async function getMind(mindId: string): Promise<BuilderMind> {
  const client = getMindsClient();
  return client.getMind(mindId);
}

export async function listMinds(): Promise<BuilderMind[]> {
  const client = getMindsClient();
  return client.listMinds();
}

export async function createConversation(
  alias: string,
  mindId: string
): Promise<Conversation> {
  const client = getMindsClient();
  return client.createConversation({ alias, mindId });
}

export async function sendMessage(
  alias: string,
  messageText: string
): Promise<Record<string, unknown>> {
  const client = getMindsClient();
  return client.sendMessage({ alias, messageText });
}

export async function getHistory(
  alias: string,
  limit?: number
): Promise<MessageRecord[]> {
  const client = getMindsClient();
  return client.getHistory(alias, { limit: limit ?? 50 });
}

export async function waitForReply(
  alias: string,
  timeoutMs: number = 120_000,
  sentMessageText?: string
) {
  const client = getMindsClient();
  return client.waitForReply({ alias, timeoutMs, sentMessageText });
}

export async function listEquippedSkills(
  mindId: string
): Promise<EquippedSkill[]> {
  const client = getMindsClient();
  return client.listEquippedSkills(mindId);
}

export async function equipSkills(
  mindId: string,
  skillIds: string[]
): Promise<EquipMutationResult<EquipSkillResultItem>> {
  const client = getMindsClient();
  return client.equipSkills(mindId, { ids: skillIds });
}

export async function getCircle(mindId: string): Promise<CircleMember[]> {
  const client = getMindsClient();
  return client.getCircle(mindId);
}

export async function addCircleMembers(
  mindId: string,
  emails: string[]
) {
  const client = getMindsClient();
  return client.addCircleMembers(mindId, { emails });
}

export async function getCognitionBalance(
  mindId: string
): Promise<CognitionBalance> {
  const client = getMindsClient();
  return client.getCognitionBalance(mindId);
}

export async function getCognitionUsage(
  mindId: string,
  interval: '1m' | '5m' | '15m' | '1h' | '1d' | '1w' | '1M' = '1d'
): Promise<CognitionUsageResponse> {
  const client = getMindsClient();
  return client.getCognitionUsage(mindId, { interval });
}

export async function getConversation(alias: string): Promise<Conversation> {
  const client = getMindsClient();
  return client.getConversation(alias);
}

export async function ensureConversation(
  alias: string,
  mindId: string
): Promise<Conversation> {
  const client = getMindsClient();
  return client.ensureConversation(alias, mindId);
}
