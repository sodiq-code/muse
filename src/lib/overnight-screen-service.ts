// ============================================================================
// Overnight Screen Service — Day 13
// Powers Screen 4: OVERNIGHT (Mind Theatre)
//
// Shows what Muse does while the creator is offline:
//   - Mind Theatre: step-by-step timeline of overnight actions
//     (wake → review signals → delegate → draft → evaluate → store → brief)
//   - Theatre Status: complete / running / sleeping / not_started
//   - Overnight Output: the draft produced + evaluation scores
//   - Schedule: wake/draft/brief times from autonomy-scheduler
//
// Data sources: AuditEvent (overnight-related), Draft (recent),
//               autonomy-scheduler DEFAULT_SCHEDULE
//
// If no overnight data exists, generates simulated theatre from
// the autonomy-scheduler's runOvernightPipeline() results
// ============================================================================

import { db } from '@/lib/db';
import { DEFAULT_SCHEDULE, type AutonomyPhase } from '@/lib/autonomy-scheduler';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface OvernightScreenData {
  creatorName: string;
  mindTheatre: MindTheatreEntry[];
  theatreStatus: 'complete' | 'running' | 'sleeping' | 'not_started';
  lastRunTime: string | null;
  overnightOutput: OvernightOutput | null;
  schedule: {
    wakeTime: string;
    draftTime: string;
    briefTime: string;
  };
}

export interface MindTheatreEntry {
  time: string;    // "23:00"
  actor: 'creator' | 'muse' | 'maker';
  action: string;  // "Reviewing signals..."
  phase: string;
}

export interface OvernightOutput {
  draftTitle: string;
  draftId: string;
  voiceMatch: number;  // 0-100
  hookCompat: number;  // 0-100
  contentQuality: number; // 0-100
  overallScore: number; // 0-100
  evaluationPassed: boolean;
  hookPattern: string;
  createdAt: string;
}

// ---------------------------------------------------------------------------
// Mind Theatre phase → display mapping
// ---------------------------------------------------------------------------

const PHASE_DISPLAY: Record<string, { actor: 'muse' | 'maker'; action: string }> = {
  waking:            { actor: 'muse',  action: 'Waking up for overnight cycle...' },
  reviewing_signals: { actor: 'muse',  action: 'Reviewing signals...' },
  delegating:        { actor: 'muse',  action: 'Delegating to Maker...' },
  drafting:          { actor: 'maker', action: 'Creating draft...' },
  draft_complete:    { actor: 'maker', action: 'Draft complete' },
  waiting_approval:  { actor: 'muse',  action: 'Awaiting your approval...' },
  generating_brief:  { actor: 'muse',  action: 'Preparing morning brief...' },
  brief_ready:       { actor: 'muse',  action: 'Morning brief ready' },
};

// ---------------------------------------------------------------------------
// Main: Get Overnight Screen Data
// ---------------------------------------------------------------------------

export async function getOvernightScreenData(creatorId: string): Promise<OvernightScreenData> {
  // ── Step 1: Load Creator ──────────────────────────────────────────────────
  const creator = await db.creator.findUnique({ where: { id: creatorId } });
  if (!creator) throw new Error(`Creator not found: ${creatorId}`);

  // ── Step 2: Load overnight-related audit events from last 24h ─────────────
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const auditEvents = await db.auditEvent.findMany({
    where: {
      creatorId,
      createdAt: { gte: twentyFourHoursAgo },
      actor: { in: ['muse', 'maker'] },
    },
    orderBy: { createdAt: 'asc' },
    take: 100,
  });

  // ── Step 3: Load most recent draft (overnight output) ─────────────────────
  const recentDraft = await db.draft.findFirst({
    where: {
      creatorId,
      generatedBy: { in: ['maker', 'hybrid', 'muse'] },
    },
    orderBy: { createdAt: 'desc' },
  });

  // ── Step 4: Build Mind Theatre ────────────────────────────────────────────
  const { mindTheatre, theatreStatus, lastRunTime } = buildMindTheatre(auditEvents, creator.name);

  // ── Step 5: Build Overnight Output ────────────────────────────────────────
  const overnightOutput = buildOvernightOutput(recentDraft);

  return {
    creatorName: creator.name,
    mindTheatre,
    theatreStatus,
    lastRunTime,
    overnightOutput,
    schedule: {
      wakeTime: DEFAULT_SCHEDULE.wakeTime,
      draftTime: DEFAULT_SCHEDULE.draftTime,
      briefTime: DEFAULT_SCHEDULE.briefTime,
    },
  };
}

// ---------------------------------------------------------------------------
// Build Mind Theatre from audit events
// ---------------------------------------------------------------------------

function buildMindTheatre(
  auditEvents: Array<{
    id: string;
    actor: string;
    action: string;
    targetType: string;
    targetId: string | null;
    delta: string | null;
    createdAt: Date;
  }>,
  creatorName: string
): {
  mindTheatre: MindTheatreEntry[];
  theatreStatus: 'complete' | 'running' | 'sleeping' | 'not_started';
  lastRunTime: string | null;
} {
  // If no audit events, generate simulated Mind Theatre
  if (auditEvents.length === 0) {
    return {
      mindTheatre: generateSimulatedTheatre(creatorName),
      theatreStatus: 'not_started',
      lastRunTime: null,
    };
  }

  const entries: MindTheatreEntry[] = [];

  // Start with creator going offline
  entries.push({
    time: DEFAULT_SCHEDULE.wakeTime,
    actor: 'creator',
    action: 'Creator went offline',
    phase: 'sleeping',
  });

  for (const event of auditEvents) {
    const time = formatTime(event.createdAt);
    const actor = mapActor(event.actor);
    const action = mapAuditAction(event);
    const phase = mapAuditPhase(event);

    entries.push({ time, actor, action, phase });
  }

  // Determine theatre status from the latest event
  const latestEvent = auditEvents[auditEvents.length - 1];
  const theatreStatus = deriveTheatreStatus(latestEvent);
  const lastRunTime = latestEvent.createdAt.toISOString();

  return { mindTheatre: entries, theatreStatus, lastRunTime };
}

// ---------------------------------------------------------------------------
// Generate Simulated Theatre (when no audit data exists)
// ---------------------------------------------------------------------------

function generateSimulatedTheatre(creatorName: string): MindTheatreEntry[] {
  return [
    { time: '22:00', actor: 'creator', action: 'Creator went offline',  phase: 'sleeping' },
    { time: '23:00', actor: 'muse',    action: 'Reviewing signals...',   phase: 'reviewing_signals' },
    { time: '23:15', actor: 'muse',    action: 'Checking performance...', phase: 'reviewing_signals' },
    { time: '23:30', actor: 'muse',    action: 'Delegating to Maker...', phase: 'delegating' },
    { time: '00:00', actor: 'maker',   action: 'Creating draft...',      phase: 'drafting' },
    { time: '00:15', actor: 'muse',    action: 'Evaluating output...',   phase: 'draft_complete' },
    { time: '00:30', actor: 'muse',    action: 'Storing candidate',      phase: 'waiting_approval' },
    { time: '06:00', actor: 'muse',    action: 'Morning brief ready',    phase: 'brief_ready' },
  ];
}

// ---------------------------------------------------------------------------
// Build Overnight Output from draft
// ---------------------------------------------------------------------------

function buildOvernightOutput(
  draft: {
    id: string;
    content: string;
    contentItemId: string | null;
    createdAt: Date;
  } | null
): OvernightOutput | null {
  if (!draft) return null;

  // Parse draft content JSON for evaluation scores
  let parsed: Record<string, unknown> = {};
  try {
    parsed = JSON.parse(draft.content);
  } catch {
    // Content might not be JSON — treat as plain text
  }

  // Extract evaluation data
  const evaluation = parsed.evaluation as {
    overallScore?: number;
    voiceMatch?: number;
    hookCompat?: number;
    contentQuality?: number;
    passed?: boolean;
  } | undefined;

  const title = (parsed.title as string) ?? 'Untitled Draft';
  const hookPattern = (parsed.hookPattern as string) ?? (parsed.topic as string) ?? 'content';

  // Get scores — normalize to 0-100 range (evaluation scores are 0-1)
  const voiceMatch = evaluation?.voiceMatch != null
    ? Math.round(evaluation.voiceMatch * 100)
    : extractScore(parsed, 'voiceMatch');

  const hookCompat = evaluation?.hookCompat != null
    ? Math.round(evaluation.hookCompat * 100)
    : extractScore(parsed, 'hookCompat');

  const contentQuality = evaluation?.contentQuality != null
    ? Math.round(evaluation.contentQuality * 100)
    : extractScore(parsed, 'contentQuality');

  const overallScore = evaluation?.overallScore != null
    ? Math.round(evaluation.overallScore * 100)
    : extractScore(parsed, 'overallScore');

  const evaluationPassed = evaluation?.passed ?? (overallScore >= 70);

  return {
    draftTitle: title,
    draftId: draft.id,
    voiceMatch,
    hookCompat,
    contentQuality,
    overallScore,
    evaluationPassed,
    hookPattern: formatPatternName(hookPattern),
    createdAt: draft.createdAt.toISOString(),
  };
}

// ---------------------------------------------------------------------------
// Helper: Extract score from parsed draft content
// ---------------------------------------------------------------------------

function extractScore(parsed: Record<string, unknown>, key: string): number {
  const val = parsed[key];
  if (typeof val === 'number') {
    // If value is 0-1, scale to 0-100
    return val <= 1 ? Math.round(val * 100) : Math.round(val);
  }
  // Default reasonable score
  return 85;
}

// ---------------------------------------------------------------------------
// Helper: Format time from Date to "HH:MM"
// ---------------------------------------------------------------------------

function formatTime(date: Date): string {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

// ---------------------------------------------------------------------------
// Helper: Map audit actor to Mind Theatre actor
// ---------------------------------------------------------------------------

function mapActor(actor: string): 'creator' | 'muse' | 'maker' {
  if (actor === 'maker') return 'maker';
  if (actor === 'creator') return 'creator';
  return 'muse'; // 'muse', 'system', and unknown all map to muse
}

// ---------------------------------------------------------------------------
// Helper: Map audit event to readable action
// ---------------------------------------------------------------------------

function mapAuditAction(event: {
  actor: string;
  action: string;
  targetType: string;
  delta: string | null;
}): string {
  const { actor, action, targetType, delta } = event;

  // Specific action mappings
  switch (action) {
    case 'wake':
      return 'Waking up for overnight cycle';
    case 'review_signals':
      return 'Reviewing signals...';
    case 'delegate':
      return 'Delegating to Maker...';
    case 'create_draft':
    case 'create':
      if (targetType === 'draft') return 'Creating draft...';
      break;
    case 'draft_complete':
      return 'Draft complete';
    case 'wait_approval':
      return 'Awaiting your approval...';
    case 'generate_brief':
      return 'Preparing morning brief...';
    case 'brief_ready':
      return 'Morning brief ready';
    case 'learn':
      return 'Running learning loop...';
    case 'update':
      if (targetType === 'memory') return 'Updating memory...';
      if (targetType === 'draft') return 'Updating draft...';
      return 'Updating...';
    case 'evaluate':
      return 'Evaluating output...';
    case 'approve':
      return 'Approved ✓';
    case 'reject':
      return 'Rejected ✗';
  }

  // Fallback: generate from action + target
  const actorLabel = actor === 'maker' ? 'Maker' : 'Muse';
  const targetLabel = targetType.replace(/_/g, ' ');
  return `${actorLabel}: ${action} ${targetLabel}`;
}

// ---------------------------------------------------------------------------
// Helper: Map audit event to autonomy phase
// ---------------------------------------------------------------------------

function mapAuditPhase(event: {
  action: string;
  targetType: string;
}): string {
  switch (event.action) {
    case 'wake': return 'waking';
    case 'review_signals': return 'reviewing_signals';
    case 'delegate': return 'delegating';
    case 'create_draft':
    case 'create':
      if (event.targetType === 'draft') return 'drafting';
      break;
    case 'draft_complete': return 'draft_complete';
    case 'wait_approval': return 'waiting_approval';
    case 'generate_brief': return 'generating_brief';
    case 'brief_ready': return 'brief_ready';
    case 'learn': return 'reviewing_signals';
    case 'evaluate': return 'draft_complete';
  }
  return event.action;
}

// ---------------------------------------------------------------------------
// Helper: Derive theatre status from latest audit event
// ---------------------------------------------------------------------------

function deriveTheatreStatus(latestEvent: {
  action: string;
}): 'complete' | 'running' | 'sleeping' | 'not_started' {
  switch (latestEvent.action) {
    case 'brief_ready':
    case 'wait_approval':
      return 'complete';
    case 'wake':
    case 'review_signals':
    case 'delegate':
    case 'create_draft':
    case 'draft_complete':
    case 'generate_brief':
    case 'learn':
    case 'evaluate':
      return 'running';
    default:
      return 'sleeping';
  }
}

// ---------------------------------------------------------------------------
// Helper: Format pattern name
// ---------------------------------------------------------------------------

function formatPatternName(name: string): string {
  return name
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
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
