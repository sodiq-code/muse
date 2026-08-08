import { db } from '@/lib/db';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CreateCreatorInput {
  email: string;
  name: string;
  niche?: string;
  audience?: string;
  tone?: string[];
  avoid?: string[];
  platform?: string;
  voiceProfile?: Record<string, number>;
  mindsHumanId?: string;
  mindsMuseId?: string;
  mindsMakerId?: string;
}

export interface UpdateIdentityInput {
  name?: string;
  niche?: string;
  audience?: string;
  tone?: string[];
  avoid?: string[];
}

export interface IdentityDomain {
  name: string;
  niche: string | null;
  audience: string | null;
  tone: string[];
  avoid: string[];
  platform: string;
  email: string;
}

export interface LogMemoryEventInput {
  creatorId: string;
  category: string;
  key: string;
  value: string;
  source?: string;
  confidence?: number;
  sessionId?: string;
}

// ---------------------------------------------------------------------------
// Creator Identity Service
// ---------------------------------------------------------------------------

/** Get a creator by ID, including their memory events */
export async function getCreator(id: string) {
  return db.creator.findUnique({
    where: { id },
    include: {
      memories: {
        orderBy: { createdAt: 'desc' },
        take: 50,
      },
      auditEvents: {
        orderBy: { createdAt: 'desc' },
        take: 50,
      },
    },
  });
}

/** Get a creator by email */
export async function getCreatorByEmail(email: string) {
  return db.creator.findUnique({
    where: { email },
  });
}

/** Create a new creator with audit event */
export async function createCreator(data: CreateCreatorInput) {
  const creator = await db.creator.create({
    data: {
      email: data.email,
      name: data.name,
      niche: data.niche ?? null,
      audience: data.audience ?? null,
      tone: data.tone ? JSON.stringify(data.tone) : null,
      avoid: data.avoid ? JSON.stringify(data.avoid) : null,
      platform: data.platform ?? 'youtube',
      voiceProfile: data.voiceProfile ? JSON.stringify(data.voiceProfile) : null,
      mindsHumanId: data.mindsHumanId ?? null,
      mindsMuseId: data.mindsMuseId ?? null,
      mindsMakerId: data.mindsMakerId ?? null,
    },
  });

  // Audit event for creation
  await db.auditEvent.create({
    data: {
      creatorId: creator.id,
      actor: 'system',
      action: 'create',
      targetType: 'creator',
      targetId: creator.id,
      delta: JSON.stringify({ name: data.name, email: data.email, niche: data.niche }),
    },
  });

  return creator;
}

/** Update identity domain fields — creates MemoryEvent + AuditEvent for each changed field */
export async function updateIdentity(id: string, input: UpdateIdentityInput) {
  const existing = await db.creator.findUnique({ where: { id } });
  if (!existing) throw new Error(`Creator not found: ${id}`);

  const updates: Record<string, unknown> = {};
  const changes: Record<string, { before: unknown; after: unknown }> = {};

  if (input.name !== undefined && input.name !== existing.name) {
    updates.name = input.name;
    changes.name = { before: existing.name, after: input.name };
  }

  if (input.niche !== undefined && input.niche !== existing.niche) {
    updates.niche = input.niche;
    changes.niche = { before: existing.niche, after: input.niche };
  }

  if (input.audience !== undefined && input.audience !== existing.audience) {
    updates.audience = input.audience;
    changes.audience = { before: existing.audience, after: input.audience };
  }

  if (input.tone !== undefined) {
    const existingTone = existing.tone ? JSON.parse(existing.tone) : [];
    if (JSON.stringify(input.tone) !== JSON.stringify(existingTone)) {
      updates.tone = JSON.stringify(input.tone);
      changes.tone = { before: existingTone, after: input.tone };
    }
  }

  if (input.avoid !== undefined) {
    const existingAvoid = existing.avoid ? JSON.parse(existing.avoid) : [];
    if (JSON.stringify(input.avoid) !== JSON.stringify(existingAvoid)) {
      updates.avoid = JSON.stringify(input.avoid);
      changes.avoid = { before: existingAvoid, after: input.avoid };
    }
  }

  if (Object.keys(updates).length === 0) {
    return existing;
  }

  // Apply updates
  const updated = await db.creator.update({
    where: { id },
    data: updates,
  });

  // Create MemoryEvents for each changed field
  for (const [key, change] of Object.entries(changes)) {
    await db.memoryEvent.create({
      data: {
        creatorId: id,
        category: 'identity',
        key,
        value: JSON.stringify(change.after),
        confidence: 1.0,
        source: 'creator',
      },
    });
  }

  // Create AuditEvent for the update
  await db.auditEvent.create({
    data: {
      creatorId: id,
      actor: 'creator',
      action: 'update',
      targetType: 'creator_identity',
      targetId: id,
      delta: JSON.stringify(changes),
    },
  });

  return updated;
}

/** Get the identity domain — the 4 memory domains concept */
export async function getIdentityDomain(creatorId: string): Promise<IdentityDomain | null> {
  const creator = await db.creator.findUnique({ where: { id: creatorId } });
  if (!creator) return null;

  return {
    name: creator.name,
    niche: creator.niche,
    audience: creator.audience,
    tone: creator.tone ? JSON.parse(creator.tone) : [],
    avoid: creator.avoid ? JSON.parse(creator.avoid) : [],
    platform: creator.platform,
    email: creator.email,
  };
}

/** Log a memory event */
export async function logMemoryEvent(input: LogMemoryEventInput) {
  return db.memoryEvent.create({
    data: {
      creatorId: input.creatorId,
      category: input.category,
      key: input.key,
      value: input.value,
      confidence: input.confidence ?? 1.0,
      source: input.source ?? 'creator',
      sessionId: input.sessionId ?? null,
    },
  });
}

/** Get memory events, optionally filtered by category */
export async function getMemoryEvents(creatorId: string, category?: string) {
  return db.memoryEvent.findMany({
    where: {
      creatorId,
      ...(category ? { category } : {}),
    },
    orderBy: { createdAt: 'desc' },
    take: 100,
  });
}

/** Get the full audit trail for a creator */
export async function getAuditTrail(creatorId: string) {
  return db.auditEvent.findMany({
    where: { creatorId },
    orderBy: { createdAt: 'desc' },
    take: 100,
  });
}
