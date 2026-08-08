// ============================================================================
// Autonomy Scheduler — Day 2
// Overnight system: 23:00 wake → review signals → delegate → 00:00 draft → 06:00 brief
// Approval gate: Nothing publishes without human approval
// Audit logging: Every autonomous action gets an audit event
// Uses Passive Autonomous Soul skill (equipped on Muse01)
// ============================================================================

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type AutonomyPhase =
  | 'sleeping'
  | 'waking'
  | 'reviewing_signals'
  | 'delegating'
  | 'drafting'
  | 'draft_complete'
  | 'waiting_approval'
  | 'generating_brief'
  | 'brief_ready'
  | 'idle';

export interface AutonomySchedule {
  wakeTime: string;      // "23:00"
  draftTime: string;     // "00:00"
  briefTime: string;     // "06:00"
}

export interface AuditEntry {
  id: string;
  timestamp: string;
  actor: 'muse' | 'maker' | 'system';
  action: string;
  phase: AutonomyPhase;
  detail: string;
  approvalRequired: boolean;
  approvalStatus?: 'pending' | 'approved' | 'rejected';
}

export interface OvernightDraft {
  id: string;
  title: string;
  script: string;
  hookPattern: string;
  source: 'autonomous';
  createdAt: string;
  approvalId: string;
  approvalStatus: 'pending' | 'approved' | 'rejected';
}

export interface MorningBrief {
  id: string;
  date: string;
  draftSummaries: { title: string; hookPattern: string; approvalStatus: string }[];
  signalAlerts: string[];
  recommendations: string[];
  generatedAt: string;
}

export interface AutonomyStatus {
  phase: AutonomyPhase;
  schedule: AutonomySchedule;
  equipped: boolean;     // Passive Autonomous Soul equipped
  lastAction: string | null;
  pendingApprovals: number;
  auditLog: AuditEntry[];
  drafts: OvernightDraft[];
  briefs: MorningBrief[];
  creditBurnEstimate: number;
}

// ---------------------------------------------------------------------------
// Default schedule
// ---------------------------------------------------------------------------

export const DEFAULT_SCHEDULE: AutonomySchedule = {
  wakeTime: '23:00',
  draftTime: '00:00',
  briefTime: '06:00',
};

// ---------------------------------------------------------------------------
// Audit logger
// ---------------------------------------------------------------------------

let auditLog: AuditEntry[] = [];
let auditCounter = 0;

function audit(
  actor: AuditEntry['actor'],
  action: string,
  phase: AutonomyPhase,
  detail: string,
  approvalRequired = false
): AuditEntry {
  const entry: AuditEntry = {
    id: `audit-${++auditCounter}`,
    timestamp: new Date().toISOString(),
    actor,
    action,
    phase,
    detail,
    approvalRequired,
    ...(approvalRequired ? { approvalStatus: 'pending' } : {}),
  };
  auditLog.push(entry);
  return entry;
}

// ---------------------------------------------------------------------------
// Approval gate — CRITICAL: Nothing publishes without human approval
// ---------------------------------------------------------------------------

let pendingApprovals: Map<string, { type: string; itemId: string; status: 'pending' | 'approved' | 'rejected' }> = new Map();
let approvalCounter = 0;

function requireApproval(type: string, itemId: string): string {
  const id = `approval-${++approvalCounter}`;
  pendingApprovals.set(id, { type, itemId, status: 'pending' });
  return id;
}

export function approveItem(approvalId: string): boolean {
  const item = pendingApprovals.get(approvalId);
  if (!item) return false;
  item.status = 'approved';
  // Also update audit entries
  auditLog.forEach((e) => {
    if (e.approvalRequired && e.approvalStatus === 'pending' && e.detail.includes(approvalId)) {
      e.approvalStatus = 'approved';
    }
  });
  return true;
}

export function rejectItem(approvalId: string): boolean {
  const item = pendingApprovals.get(approvalId);
  if (!item) return false;
  item.status = 'rejected';
  auditLog.forEach((e) => {
    if (e.approvalRequired && e.approvalStatus === 'pending' && e.detail.includes(approvalId)) {
      e.approvalStatus = 'rejected';
    }
  });
  return true;
}

// ---------------------------------------------------------------------------
// Overnight drafts store
// ---------------------------------------------------------------------------

let drafts: OvernightDraft[] = [];
let draftCounter = 0;

// ---------------------------------------------------------------------------
// Morning briefs store
// ---------------------------------------------------------------------------

let briefs: MorningBrief[] = [];
let briefCounter = 0;

// ---------------------------------------------------------------------------
// Phase transitions
// ---------------------------------------------------------------------------

let currentPhase: AutonomyPhase = 'sleeping';
let lastAction: string | null = null;

export function getCurrentPhase(): AutonomyPhase {
  return currentPhase;
}

export function getAutonomyStatus(): AutonomyStatus {
  const pendingCount = Array.from(pendingApprovals.values()).filter((a) => a.status === 'pending').length;

  return {
    phase: currentPhase,
    schedule: DEFAULT_SCHEDULE,
    equipped: true, // Passive Autonomous Soul is equipped on Muse01
    lastAction,
    pendingApprovals: pendingCount,
    auditLog: auditLog.slice(-50), // Last 50 entries
    drafts: drafts.slice(-10),
    briefs: briefs.slice(-5),
    creditBurnEstimate: 0, // 0 credits — all simulation
  };
}

// ---------------------------------------------------------------------------
// Overnight pipeline simulation
// ---------------------------------------------------------------------------

export function runOvernightPipeline(
  signals?: string[],
  creatorName?: string
): AutonomyStatus {
  const creator = creatorName ?? 'Jules';
  const signalList = signals ?? [
    'AI agent frameworks trending +40% this month',
    'Contrarian claim hooks outperforming by 18%',
    'Tutorial format: 3x engagement vs listicle',
    'Audience requesting more deep-dive architecture content',
  ];

  // Phase 1: Wake up (23:00)
  currentPhase = 'waking';
  audit('muse', 'wake', 'waking', 'Muse01 woke up for overnight cycle (Passive Autonomous Soul)');
  lastAction = 'Woke up for overnight cycle';

  // Phase 2: Review signals
  currentPhase = 'reviewing_signals';
  audit('muse', 'review_signals', 'reviewing_signals', `Reviewed ${signalList.length} signals: ${signalList.join('; ')}`);
  lastAction = `Reviewed ${signalList.length} signals`;

  // Phase 3: Delegate to Maker/simulator
  currentPhase = 'delegating';
  audit('muse', 'delegate', 'delegating', 'Delegated draft creation to Maker (simulated — 0 credits)');
  lastAction = 'Delegated to Maker simulator';

  // Phase 4: Draft production (00:00)
  currentPhase = 'drafting';
  const draftId = `draft-${++draftCounter}`;
  const approvalId = requireApproval('draft', draftId);
  audit('maker', 'create_draft', 'drafting', `Created draft ${draftId} — awaiting approval ${approvalId}`, true);

  const draft: OvernightDraft = {
    id: draftId,
    title: `AI Agents: The Architecture Decision That Changed How I Ship Code`,
    script: `[HOOK]\nEveryone says AI agents are the future of development. They're wrong — and here's why.\n\n[CONTEXT]\n${creator} here. If you're building with AI agents and feeling the complexity creep, this one's for you.\n\n[CORE INSIGHT]\nMost agent frameworks optimize for flexibility when they should optimize for debuggability. The direct approach is to start with a state machine, add observability before orchestration, and never let an agent make an irreversible decision.\n\n[FRAMEWORK]\n1. Start with state machines, not neural orchestrators\n2. Add observability BEFORE you add complexity\n3. Every agent action must be auditable and reversible\n4. Compound reliability beats clever architecture\n\n[CTA]\nIf this resonated, hit subscribe — I break down AI engineering trade-offs like this every week.\n\n[END]`,
    hookPattern: 'contrarian_claim',
    source: 'autonomous',
    createdAt: new Date().toISOString(),
    approvalId,
    approvalStatus: 'pending',
  };
  drafts.push(draft);

  currentPhase = 'draft_complete';
  audit('maker', 'draft_complete', 'draft_complete', `Draft "${draft.title}" ready for approval`);
  lastAction = `Draft produced: "${draft.title}"`;

  // Phase 5: Waiting for approval
  currentPhase = 'waiting_approval';
  audit('muse', 'wait_approval', 'waiting_approval', `Draft ${draftId} awaiting human approval — will NOT publish without approval`);
  lastAction = 'Waiting for human approval';

  // Phase 6: Generate morning brief (06:00)
  currentPhase = 'generating_brief';
  audit('muse', 'generate_brief', 'generating_brief', 'Generating morning brief for creator review');

  const brief: MorningBrief = {
    id: `brief-${++briefCounter}`,
    date: new Date().toISOString().split('T')[0],
    draftSummaries: drafts.slice(-3).map((d) => ({
      title: d.title,
      hookPattern: d.hookPattern,
      approvalStatus: d.approvalStatus,
    })),
    signalAlerts: signalList,
    recommendations: [
      `Based on ${signalList.length} signals, contrarian_claim hooks are trending — test 2 more this week`,
      'Tutorial deep-dives show 3x engagement — increase cadence to 2/week',
      'No posts in 48 hours — schedule draft review to maintain momentum',
    ],
    generatedAt: new Date().toISOString(),
  };
  briefs.push(brief);

  currentPhase = 'brief_ready';
  audit('muse', 'brief_ready', 'brief_ready', `Morning brief ${brief.id} ready for ${creator}`);
  lastAction = 'Morning brief ready';

  // Return to idle
  currentPhase = 'idle';

  return getAutonomyStatus();
}

// ---------------------------------------------------------------------------
// Reset (for testing)
// ---------------------------------------------------------------------------

export function resetAutonomy(): void {
  currentPhase = 'sleeping';
  lastAction = null;
  auditLog = [];
  auditCounter = 0;
  drafts = [];
  draftCounter = 0;
  briefs = [];
  briefCounter = 0;
  pendingApprovals = new Map();
  approvalCounter = 0;
}
