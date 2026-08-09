// ============================================================================
// Control Screen Service — Day 13
// Powers Screen 5: CREATOR CONTROL
//
// Shows the creator what Muse is allowed to do autonomously:
//   - Autonomy Settings: ON/OFF for overnight analysis, draft creation,
//     auto-publish (ALWAYS OFF — can never be turned on), community monitoring
//   - Approval Queue: pending items awaiting creator review
//   - Audit Log: every significant action Muse has taken, always logged
//
// CRITICAL: Auto-publish is ALWAYS OFF with a lock.
// Publishing ALWAYS requires the creator's explicit approval.
// ============================================================================

import { db } from '@/lib/db';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ControlScreenData {
  creatorName: string;
  autonomySettings: {
    overnightAnalysis: boolean;
    draftCreation: boolean;
    autoPublish: boolean;     // ALWAYS false — can never be turned on
    communityMonitoring: boolean;
  };
  approvalQueue: ApprovalQueueItem[];
  pendingCount: number;
  auditLog: AuditLogEntry[];
  totalAuditEvents: number;
}

export interface ApprovalQueueItem {
  id: string;
  itemType: string;  // 'draft'
  itemId: string;
  title: string;
  action: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface AuditLogEntry {
  timestamp: string;
  actor: string;     // 'muse', 'maker', 'system'
  action: string;
  detail: string;
}

// ---------------------------------------------------------------------------
// Main: Get Control Screen Data
// ---------------------------------------------------------------------------

export async function getControlScreenData(creatorId: string): Promise<ControlScreenData> {
  // ── Step 1: Load Creator ──────────────────────────────────────────────────
  const creator = await db.creator.findUnique({ where: { id: creatorId } });
  if (!creator) throw new Error(`Creator not found: ${creatorId}`);

  // ── Step 2: Autonomy Settings ──────────────────────────────────────────────
  // Hard-coded settings. Auto-publish is ALWAYS OFF — locked.
  const autonomySettings = {
    overnightAnalysis: true,
    draftCreation: true,
    autoPublish: false,        // 🔒 ALWAYS OFF — can never be turned on
    communityMonitoring: true,
  };

  // ── Step 3: Approval Queue ─────────────────────────────────────────────────
  const { approvalQueue, pendingCount } = await buildApprovalQueue(creatorId);

  // ── Step 4: Audit Log ──────────────────────────────────────────────────────
  const { auditLog, totalAuditEvents } = await buildAuditLog(creatorId);

  return {
    creatorName: creator.name,
    autonomySettings,
    approvalQueue,
    pendingCount,
    auditLog,
    totalAuditEvents,
  };
}

// ---------------------------------------------------------------------------
// Build Approval Queue
// ---------------------------------------------------------------------------

async function buildApprovalQueue(
  creatorId: string
): Promise<{ approvalQueue: ApprovalQueueItem[]; pendingCount: number }> {
  // Load all pending approvals
  const pendingApprovals = await db.approval.findMany({
    where: {
      creatorId,
      status: 'pending',
    },
    orderBy: { createdAt: 'desc' },
    take: 20,
  });

  // Also get recently decided approvals (approved/rejected in last 48h) for context
  const recentDecided = await db.approval.findMany({
    where: {
      creatorId,
      status: { in: ['approved', 'rejected'] },
      reviewedAt: { gte: new Date(Date.now() - 48 * 60 * 60 * 1000) },
    },
    orderBy: { reviewedAt: 'desc' },
    take: 10,
  });

  const approvalQueue: ApprovalQueueItem[] = [];

  // Process pending approvals
  for (const approval of pendingApprovals) {
    const item = await resolveApprovalItem(approval.itemType, approval.itemId);
    approvalQueue.push({
      id: approval.id,
      itemType: approval.itemType,
      itemId: approval.itemId ?? '',
      title: item.title,
      action: approval.action,
      status: 'pending',
      createdAt: approval.createdAt.toISOString(),
    });
  }

  // Process recently decided approvals
  for (const approval of recentDecided) {
    const item = await resolveApprovalItem(approval.itemType, approval.itemId);
    approvalQueue.push({
      id: approval.id,
      itemType: approval.itemType,
      itemId: approval.itemId ?? '',
      title: item.title,
      action: approval.action,
      status: approval.status as 'approved' | 'rejected',
      createdAt: approval.createdAt.toISOString(),
    });
  }

  // Sort by date descending
  approvalQueue.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return {
    approvalQueue: approvalQueue.slice(0, 20),
    pendingCount: pendingApprovals.length,
  };
}

// ---------------------------------------------------------------------------
// Resolve approval item title from itemType + itemId
// ---------------------------------------------------------------------------

async function resolveApprovalItem(
  itemType: string,
  itemId: string | null
): Promise<{ title: string }> {
  if (!itemId) return { title: `Pending ${itemType}` };

  if (itemType === 'draft') {
    const draft = await db.draft.findUnique({
      where: { id: itemId },
    });
    if (draft) {
      try {
        const parsed = JSON.parse(draft.content);
        return { title: (parsed.title as string) ?? 'Untitled Draft' };
      } catch {
        // Content might be plain text
        return { title: draft.content.substring(0, 60) || 'Untitled Draft' };
      }
    }
  }

  if (itemType === 'autonomous_run') {
    const run = await db.autonomousRun.findUnique({
      where: { id: itemId },
    });
    if (run) {
      return { title: `Autonomous run: ${run.taskType}` };
    }
  }

  if (itemType === 'recommendation') {
    const rec = await db.recommendation.findUnique({
      where: { id: itemId },
    });
    if (rec) {
      return { title: rec.title };
    }
  }

  return { title: `${itemType} item` };
}

// ---------------------------------------------------------------------------
// Build Audit Log
// ---------------------------------------------------------------------------

async function buildAuditLog(
  creatorId: string
): Promise<{ auditLog: AuditLogEntry[]; totalAuditEvents: number }> {
  // Get total count of audit events
  const totalAuditEvents = await db.auditEvent.count({
    where: { creatorId },
  });

  // Get last 50 audit events
  const recentEvents = await db.auditEvent.findMany({
    where: { creatorId },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });

  const auditLog: AuditLogEntry[] = recentEvents.map((event) => ({
    timestamp: event.createdAt.toISOString(),
    actor: event.actor,
    action: formatAuditAction(event),
    detail: formatAuditDetail(event),
  }));

  return { auditLog, totalAuditEvents };
}

// ---------------------------------------------------------------------------
// Format audit action for display
// ---------------------------------------------------------------------------

function formatAuditAction(event: {
  actor: string;
  action: string;
  targetType: string;
}): string {
  const actorLabel = mapActorLabel(event.actor);

  switch (event.action) {
    case 'learn':
      return `${actorLabel} ran learning loop`;
    case 'create':
      if (event.targetType === 'draft') return `${actorLabel} created draft`;
      return `${actorLabel} created ${event.targetType.replace(/_/g, ' ')}`;
    case 'update':
      if (event.targetType === 'memory') return `${actorLabel} updated memory`;
      if (event.targetType === 'draft') return `${actorLabel} updated draft`;
      return `${actorLabel} updated ${event.targetType.replace(/_/g, ' ')}`;
    case 'approve':
      return `${actorLabel} approved ${event.targetType.replace(/_/g, ' ')}`;
    case 'reject':
      return `${actorLabel} rejected ${event.targetType.replace(/_/g, ' ')}`;
    case 'publish':
      return `${actorLabel} published ${event.targetType.replace(/_/g, ' ')}`;
    case 'delete':
      return `${actorLabel} deleted ${event.targetType.replace(/_/g, ' ')}`;
    default:
      return `${actorLabel} ${event.action} ${event.targetType.replace(/_/g, ' ')}`;
  }
}

// ---------------------------------------------------------------------------
// Format audit detail for display
// ---------------------------------------------------------------------------

function formatAuditDetail(event: {
  actor: string;
  action: string;
  targetType: string;
  targetId: string | null;
  delta: string | null;
}): string {
  // Try to parse delta for meaningful detail
  if (event.delta) {
    try {
      const delta = JSON.parse(event.delta);
      // For learning loop events
      if (delta.observations !== undefined) {
        return `${delta.observations} observations, ${delta.recommendations ?? 0} recommendations`;
      }
      // For other structured deltas
      if (delta.title) return delta.title;
      if (delta.pattern) return `Pattern: ${delta.pattern}`;
      // Generic: return first meaningful key
      const keys = Object.keys(delta).slice(0, 3);
      if (keys.length > 0) {
        return keys.map((k) => `${k}: ${JSON.stringify(delta[k])}`).join(', ');
      }
    } catch { /* not JSON */ }
  }

  // Fallback
  return `${event.action} on ${event.targetType.replace(/_/g, ' ')}`;
}

// ---------------------------------------------------------------------------
// Helper: Map actor to display label
// ---------------------------------------------------------------------------

function mapActorLabel(actor: string): string {
  switch (actor) {
    case 'muse': return 'Muse';
    case 'maker': return 'Maker';
    case 'creator': return 'Creator';
    case 'system': return 'System';
    default: return actor;
  }
}

// ---------------------------------------------------------------------------
// Utility: Get default creator ID
// ---------------------------------------------------------------------------

export async function getDefaultCreatorId(): Promise<string> {
  const creator = await db.creator.findFirst({
    where: { email: 'sodiqjimoh80@gmail.com' },
  });
  if (!creator) throw new Error('Default creator not found. Run seed first.');
  return creator.id;
}
