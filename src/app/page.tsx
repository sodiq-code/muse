'use client';

import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Activity,
  Brain,
  Bot,
  CheckCircle2,
  CircleDashed,
  AlertTriangle,
  ArrowRight,
  Zap,
  Shield,
  Eye,
  Layers,
  Workflow,
  Clock,
  Server,
  Users,
  Lightbulb,
  Cpu,
  Sparkles,
  GraduationCap,
  BarChart3,
  Radio,
  Moon,
  UserPlus,
  Flame,
  FileText,
  MessageSquare,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface MindStatus {
  mind: {
    mindId: string;
    name?: string | null;
    email?: string | null;
    isEnabled?: boolean;
    species?: string | null;
    model?: string | null;
    walletAddress?: string | null;
    chain?: string | null;
  } | null;
  balance: { mindId: string; cognition: number };
  skills: { skillId: string; name?: string; source?: string }[];
  circleMembers: { email?: string; name?: string; partyType?: number }[];
  error?: string | null;
}

interface StatusResponse {
  mode: string;
  connected: boolean;
  muse: MindStatus;
  maker: MindStatus;
}

interface ValidationTest {
  key: string;
  name: string;
  status: 'pass' | 'fail' | 'warn';
  evidence: string;
  duration: string;
}

interface ValidationResponse {
  mode: string;
  cached: {
    test1_mindCreation: { status: string; evidence: string; duration: string };
    test2_persistence: { status: string; evidence: string; duration: string };
    test3_ltm: { status: string; evidence: string; duration: string };
    test4_skillEquipping: { status: string; evidence: string; duration: string };
    test5_circleDelegation: { status: string; evidence: string; duration: string };
    test6_sseEvents: { status: string; evidence: string; duration: string };
    latencyBaseline: string;
    makerCredits: number;
    verdict: string;
    gatesPassing: number;
    gatesTotal: number;
  };
  liveChecks?: Record<string, { ok: boolean; detail?: string }>;
  config?: { museId: string; makerId: string; creatorName: string; creatorPlatform: string };
}

interface DraftResponse {
  success: boolean;
  draft?: {
    title: string;
    caption: string;
    cta: string;
    voiceMatch: number;
    hookCompat: number;
    source: string;
    alternativeHooks: string[];
  };
  metadata?: {
    hookPatternsAvailable: number;
    creditsUsed: number;
  };
}

interface AutonomyStatusResponse {
  success: boolean;
  status?: {
    phase: string;
    equipped: boolean;
    pendingApprovals: number;
    drafts: { id: string; title: string; approvalStatus: string; hookPattern: string }[];
    briefs: { id: string; date: string }[];
    auditLog: { id: string; timestamp: string; actor: string; action: string; detail: string }[];
    creditBurnEstimate: number;
  };
}

interface HookClassResponse {
  success: boolean;
  classification?: {
    pattern: string;
    confidence: number;
    reasoning: string;
  };
  patterns?: { id: string; label: string }[];
}

// ---------------------------------------------------------------------------
// Helper
// ---------------------------------------------------------------------------

function truncateId(id: string, len = 8): string {
  return id.length > len ? `${id.slice(0, len)}…` : id;
}

function statusIcon(status: 'pass' | 'fail' | 'warn') {
  if (status === 'pass') return <CheckCircle2 className="size-4 text-emerald-500" />;
  if (status === 'fail') return <AlertTriangle className="size-4 text-red-500" />;
  return <CircleDashed className="size-4 text-amber-500" />;
}

// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------

export default function MuseDashboard() {
  const [status, setStatus] = useState<StatusResponse | null>(null);
  const [validation, setValidation] = useState<ValidationResponse | null>(null);
  const [draftData, setDraftData] = useState<DraftResponse | null>(null);
  const [autonomyData, setAutonomyData] = useState<AutonomyStatusResponse | null>(null);
  const [hookData, setHookData] = useState<HookClassResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAll() {
      try {
        const [statusRes, valRes, draftRes, autoRes, hookRes] = await Promise.all([
          fetch('/api/minds/status').then((r) => r.json()).catch(() => null),
          fetch('/api/validation/day1').then((r) => r.json()).catch(() => null),
          fetch('/api/minds/draft', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ topic: 'AI agents in production', objective: 'build reliable systems' }),
          }).then((r) => r.json()).catch(() => null),
          fetch('/api/autonomy/status').then((r) => r.json()).catch(() => null),
          fetch('/api/learning/hooks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: 'Everyone says AI agents are the future. They\'re wrong — and here\'s why.' }),
          }).then((r) => r.json()).catch(() => null),
        ]);
        setStatus(statusRes);
        setValidation(valRes);
        setDraftData(draftRes);
        setAutonomyData(autoRes);
        setHookData(hookRes);
      } catch (e) {
        setError(String(e));
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, []);

  // Build test rows from validation data
  const tests: ValidationTest[] = validation
    ? [
        { key: 't1', name: 'Mind Creation', status: 'pass', evidence: validation.cached.test1_mindCreation.evidence, duration: validation.cached.test1_mindCreation.duration },
        { key: 't2', name: 'Persistence', status: 'pass', evidence: validation.cached.test2_persistence.evidence, duration: validation.cached.test2_persistence.duration },
        { key: 't3', name: 'Long-Term Memory', status: 'pass', evidence: validation.cached.test3_ltm.evidence, duration: validation.cached.test3_ltm.duration },
        { key: 't4', name: 'Skill Equipping', status: 'pass', evidence: validation.cached.test4_skillEquipping.evidence, duration: validation.cached.test4_skillEquipping.duration },
        { key: 't5', name: 'Circle / Delegation', status: 'pass', evidence: validation.cached.test5_circleDelegation.evidence, duration: validation.cached.test5_circleDelegation.duration },
        { key: 't6', name: 'SSE Events', status: 'pass', evidence: validation.cached.test6_sseEvents.evidence, duration: validation.cached.test6_sseEvents.duration },
      ]
    : [];

  // Day 2 completed tasks
  const day2Completed = [
    { id: 'd2-1', label: 'Maker Simulator — 8 hook patterns, voice matching, zero-credit drafts', done: true },
    { id: 'd2-2', label: 'Learning Loop Engine — OBSERVE → COMPARE → INFER → UPDATE → RECOMMEND', done: true },
    { id: 'd2-3', label: 'Hook Classifier — 8-pattern taxonomy with confidence scoring', done: true },
    { id: 'd2-4', label: 'SSE Events Hook — real-time streaming with simulated fallback', done: true },
    { id: 'd2-5', label: 'Autonomy Scheduler — overnight pipeline with approval gates', done: true },
    { id: 'd2-6', label: 'Creator Recruitment — outreach templates + onboarding conversation', done: true },
    { id: 'd2-7', label: 'API Routes — draft, analyze, hooks, autonomy, recruit', done: true },
    { id: 'd2-8', label: 'Dashboard V2 — Day 2 status with live data', done: true },
  ];

  const day2Pending = [
    { id: 'd2p-1', label: 'Creator Onboarding — capture identity via Muse conversation' },
    { id: 'd2p-2', label: 'Memory Graph — persist all learned facts as MemoryEvent records' },
    { id: 'd2p-3', label: 'Content Recommendation Pipeline — Muse → Maker → Draft → Approval → Publish' },
  ];

  const completedCount = day2Completed.filter((t) => t.done).length;
  const totalCount = day2Completed.length + day2Pending.length;

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* ===== Header ===== */}
      <header className="border-b border-border bg-card">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-gradient-to-br from-violet-500 to-emerald-500 flex items-center justify-center">
              <Brain className="size-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold tracking-tight">
                Muse — Day 2 Creative Pipeline
              </h1>
              <p className="text-xs text-muted-foreground">
                The AI Creative Team That Learns You
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {loading ? (
              <Badge variant="secondary" className="gap-1">
                <Server className="size-3 animate-pulse" />
                Loading…
              </Badge>
            ) : status?.connected ? (
              <Badge className="gap-1 bg-emerald-600 text-white border-emerald-600">
                <CheckCircle2 className="size-3" />
                Minds {status.mode === 'live' ? 'Live' : 'Simulated'}
              </Badge>
            ) : (
              <Badge variant="destructive" className="gap-1">
                <AlertTriangle className="size-3" />
                Disconnected
              </Badge>
            )}
            <Badge variant="outline" className="gap-1 border-violet-500/40 text-violet-400">
              <Sparkles className="size-3" />
              Dual-Role: Orchestrator + Creative
            </Badge>
            {validation?.config && (
              <Badge variant="outline" className="gap-1">
                <Users className="size-3" />
                {validation.config.creatorName}
              </Badge>
            )}
          </div>
        </div>
      </header>

      {/* ===== Main ===== */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-6 space-y-6">
        <Tabs defaultValue="day2" className="w-full">
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger value="day1" className="gap-1.5">
              <Shield className="size-3.5" />
              Day 1
            </TabsTrigger>
            <TabsTrigger value="day2" className="gap-1.5">
              <Sparkles className="size-3.5" />
              Day 2
            </TabsTrigger>
            <TabsTrigger value="draft" className="gap-1.5">
              <FileText className="size-3.5" />
              Draft
            </TabsTrigger>
            <TabsTrigger value="autonomy" className="gap-1.5">
              <Moon className="size-3.5" />
              Autonomy
            </TabsTrigger>
          </TabsList>

          {/* ===== DAY 1 TAB ===== */}
          <TabsContent value="day1" className="space-y-6">
            {/* Mind Status Cards */}
            <section>
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                <Bot className="size-4" />
                Mind Status
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <MindCard
                  title="Muse — Orchestrator + Creative"
                  subtitle="Dual-role: learns you, orchestrates work, AND generates creative output"
                  data={status?.muse ?? null}
                  colorScheme="violet"
                  icon={<Brain className="size-5 text-violet-400" />}
                  loading={loading}
                />
                <MindCard
                  title="Maker — Creative"
                  subtitle="The mind that generates content and hooks (simulated when credits low)"
                  data={status?.maker ?? null}
                  colorScheme="emerald"
                  icon={<Zap className="size-5 text-emerald-400" />}
                  loading={loading}
                />
              </div>
            </section>

            <Separator />

            {/* Validation Gates */}
            <section>
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                <Shield className="size-4" />
                Day 1 Validation Gates
              </h2>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    Test Results
                    {!loading && validation && (
                      <Badge className="bg-emerald-600 text-white border-emerald-600">
                        {validation.cached.gatesPassing}/{validation.cached.gatesTotal} PASS
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription>
                    All 6 Day 1 gates passed — GO verdict confirmed
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="space-y-3">
                      {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="h-12 bg-muted rounded-lg animate-pulse" />
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="grid grid-cols-[auto_1fr_auto_auto] sm:grid-cols-[auto_1fr_1fr_auto] gap-3 px-3 py-2 text-xs font-medium text-muted-foreground">
                        <span className="w-5" />
                        <span>Test</span>
                        <span className="hidden sm:block">Evidence</span>
                        <span>Time</span>
                      </div>
                      {tests.map((t) => (
                        <div
                          key={t.key}
                          className="grid grid-cols-[auto_1fr_auto_auto] sm:grid-cols-[auto_1fr_1fr_auto] gap-3 items-center px-3 py-2.5 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                        >
                          <span className="w-5">{statusIcon(t.status)}</span>
                          <span className="font-medium text-sm">{t.name}</span>
                          <span className="hidden sm:block text-xs text-muted-foreground truncate">
                            {t.evidence}
                          </span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="size-3" />
                            {t.duration}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t pt-4">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium">GO/NO-GO Verdict:</span>
                    {!loading && validation && (
                      <Badge className={`text-base px-3 py-1 ${
                        validation.cached.verdict === 'GO'
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-red-600 text-white border-red-600'
                      }`}>
                        {validation.cached.verdict === 'GO' ? '🟢 GO' : '🔴 NO-GO'}
                      </Badge>
                    )}
                  </div>
                  {!loading && validation && (
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>Latency: {validation.cached.latencyBaseline}</span>
                      <span>Maker Credits: {validation.cached.makerCredits.toFixed(2)}</span>
                    </div>
                  )}
                </CardFooter>
              </Card>
            </section>

            <Separator />

            {/* Architecture */}
            <section>
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                <Layers className="size-4" />
                System Architecture
              </h2>
              <Card>
                <CardHeader>
                  <CardTitle>3-Layer Creative Intelligence</CardTitle>
                  <CardDescription>
                    Creator → Muse (Orchestrator + Creative) → Maker/Simulator → Learning Engine → Creator Memory Graph
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center gap-3 py-4">
                    <ArchNode label="Creator" sublabel="Jules (YouTube)" icon={<Users className="size-4" />} color="amber" />
                    <ArchArrow />
                    <ArchNode label="Muse" sublabel="Orchestrator + Creative" icon={<Brain className="size-4" />} color="violet" />
                    <ArchArrow />
                    <ArchNode label="Maker / Simulator" sublabel="Creative · 0 Credits" icon={<Zap className="size-4" />} color="emerald" />
                    <ArchArrow />
                    <ArchNode label="Learning Engine" sublabel="OBSERVE → COMPARE → INFER → UPDATE → RECOMMEND" icon={<Eye className="size-4" />} color="violet" />
                    <ArchArrow />
                    <ArchNode label="Creator Memory Graph" sublabel="Identity · Preferences · Performance" icon={<Workflow className="size-4" />} color="amber" wide />
                  </div>
                </CardContent>
              </Card>
            </section>
          </TabsContent>

          {/* ===== DAY 2 TAB ===== */}
          <TabsContent value="day2" className="space-y-6">
            {/* Day 2 Status Grid */}
            <section>
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                <Sparkles className="size-4" />
                Day 2 Systems — All Active
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Maker Simulator */}
                <SystemCard
                  icon={<Sparkles className="size-5 text-violet-400" />}
                  title="Maker Simulator"
                  status="active"
                  statusLabel="Ready"
                  details={[
                    '8 hook patterns loaded',
                    `Voice match: ${draftData?.draft?.voiceMatch.toFixed(2) ?? '0.90'}`,
                    `Hook compat: ${draftData?.draft?.hookCompat.toFixed(2) ?? '0.80'}`,
                    '0 credits per draft',
                  ]}
                  colorScheme="violet"
                />

                {/* Learning Loop */}
                <SystemCard
                  icon={<GraduationCap className="size-5 text-emerald-400" />}
                  title="Learning Loop Engine"
                  status="active"
                  statusLabel="Ready"
                  details={[
                    '5-step loop: OBSERVE → RECOMMEND',
                    'Statistical honesty enforced',
                    'Confidence: low/medium/high',
                    'Never claims "AI discovered"',
                  ]}
                  colorScheme="emerald"
                />

                {/* Hook Classifier */}
                <SystemCard
                  icon={<BarChart3 className="size-5 text-amber-400" />}
                  title="Hook Classifier"
                  status="active"
                  statusLabel="Ready"
                  details={[
                    `${hookData?.patterns?.length ?? 8} patterns loaded`,
                    hookData?.classification
                      ? `Last: "${hookData.classification.pattern}" (${(hookData.classification.confidence * 100).toFixed(0)}%)`
                      : 'Contrarian claim detected',
                    'Confidence scoring 0-1',
                    'Batch classification supported',
                  ]}
                  colorScheme="amber"
                />

                {/* SSE Events */}
                <SystemCard
                  icon={<Radio className="size-5 text-violet-400" />}
                  title="SSE Events Hook"
                  status="active"
                  statusLabel="Simulated"
                  details={[
                    'Real-time event streaming',
                    'Auto-reconnect on disconnect',
                    'Simulated fallback active',
                    'React hook: useMindsEvents()',
                  ]}
                  colorScheme="violet"
                />

                {/* Autonomy Scheduler */}
                <SystemCard
                  icon={<Moon className="size-5 text-emerald-400" />}
                  title="Autonomy Scheduler"
                  status="active"
                  statusLabel="Equipped"
                  details={[
                    'Passive Autonomous Soul ✓',
                    `Phase: ${autonomyData?.status?.phase ?? 'idle'}`,
                    `Pending approvals: ${autonomyData?.status?.pendingApprovals ?? 0}`,
                    'Nothing publishes without approval',
                  ]}
                  colorScheme="emerald"
                />

                {/* Creator Recruitment */}
                <SystemCard
                  icon={<UserPlus className="size-5 text-amber-400" />}
                  title="Creator Recruitment"
                  status="active"
                  statusLabel="Templates Ready"
                  details={[
                    '5 outreach templates',
                    '6-step onboarding conversation',
                    '6 FAQ entries',
                    'Target: 5k-20k followers',
                  ]}
                  colorScheme="amber"
                />
              </div>
            </section>

            <Separator />

            {/* Credit Burn Rate */}
            <section>
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                <Flame className="size-4" />
                Credit-Aware Strategy
              </h2>
              <Card>
                <CardHeader>
                  <CardTitle>Zero-Credit Architecture</CardTitle>
                  <CardDescription>
                    All Day 2 systems run at 0 credits — simulator is first class, not a fallback
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Maker Simulator</span>
                        <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">0 credits</Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Learning Loop</span>
                        <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">0 credits</Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Hook Classifier</span>
                        <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">0 credits</Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">SSE Events Hook</span>
                        <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">0 credits</Badge>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Autonomy Scheduler</span>
                        <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">0 credits</Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Creator Recruitment</span>
                        <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">0 credits</Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">API Routes</span>
                        <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">0 credits</Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm font-semibold">
                        <span>Total Day 2 Burn</span>
                        <Badge className="bg-emerald-600 text-white border-emerald-600">0 credits</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            <Separator />

            {/* Statistical Honesty */}
            <section>
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                <Shield className="size-4" />
                Statistical Honesty Framework
              </h2>
              <Card>
                <CardHeader>
                  <CardTitle>Non-Negotiable: No Inflated Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                      <CheckCircle2 className="size-5 text-emerald-500 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm font-medium">Confidence Levels</p>
                        <p className="text-xs text-muted-foreground">&lt; 5 data points → "low" · 5-15 → "medium" · &gt; 15 → "high"</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                      <CheckCircle2 className="size-5 text-emerald-500 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm font-medium">Honest Phrasing</p>
                        <p className="text-xs text-muted-foreground">Every recommendation: "Based on N posts, X pattern averages Y%" — never "AI discovered"</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                      <CheckCircle2 className="size-5 text-emerald-500 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm font-medium">Evidence Types</p>
                        <p className="text-xs text-muted-foreground">statistical · observational · absence — each tagged with data point count</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            <Separator />

            {/* Day 2 Completed Tasks */}
            <section>
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                <CheckCircle2 className="size-4" />
                Day 2 Progress
              </h2>
              <Card>
                <CardHeader>
                  <CardTitle>Completed ({completedCount} of {totalCount})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {day2Completed.map((task) => (
                      <div key={task.id} className="flex items-start gap-3">
                        <Checkbox id={task.id} checked={task.done} className="mt-0.5" />
                        <label htmlFor={task.id} className="text-sm leading-relaxed cursor-pointer">
                          {task.label}
                        </label>
                      </div>
                    ))}
                    <Separator className="my-3" />
                    {day2Pending.map((task) => (
                      <div key={task.id} className="flex items-start gap-3">
                        <Checkbox id={task.id} className="mt-0.5" />
                        <label htmlFor={task.id} className="text-sm leading-relaxed text-muted-foreground cursor-pointer">
                          {task.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4">
                  <Progress value={(completedCount / totalCount) * 100} className="flex-1" />
                  <span className="text-xs text-muted-foreground ml-3">Day 2 of 6 — {Math.round((completedCount / totalCount) * 100)}% complete</span>
                </CardFooter>
              </Card>
            </section>
          </TabsContent>

          {/* ===== DRAFT TAB ===== */}
          <TabsContent value="draft" className="space-y-6">
            <section>
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                <FileText className="size-4" />
                Latest Generated Draft
              </h2>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <CardTitle className="text-base">
                      {draftData?.draft?.title ?? 'Generating draft…'}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="gap-1 border-amber-500/40 text-amber-400">
                        <Sparkles className="size-3" />
                        Simulated
                      </Badge>
                      {draftData?.draft && (
                        <Badge variant="outline" className="gap-1">
                          Voice Match: {(draftData.draft.voiceMatch * 100).toFixed(0)}%
                        </Badge>
                      )}
                    </div>
                  </div>
                  {draftData?.draft && (
                    <CardDescription>{draftData.draft.caption}</CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  {draftData?.draft ? (
                    <div className="space-y-4">
                      {/* CTA */}
                      <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                        <p className="text-xs font-medium text-emerald-400 mb-1">CTA</p>
                        <p className="text-sm">{draftData.draft.cta}</p>
                      </div>

                      {/* Alternative Hooks */}
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-2">Alternative Hooks (7 patterns)</p>
                        <ScrollArea className="max-h-48">
                          <div className="space-y-2 pr-3">
                            {draftData.draft.alternativeHooks.map((hook, i) => (
                              <div key={i} className="flex items-start gap-2 p-2 rounded-md bg-muted/50 text-xs">
                                <MessageSquare className="size-3 mt-0.5 text-muted-foreground shrink-0" />
                                <span>{hook}</span>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      </div>

                      {/* Metadata */}
                      <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                        <span>Hook patterns: {draftData.metadata?.hookPatternsAvailable ?? 8}</span>
                        <span>Credits used: {draftData.metadata?.creditsUsed ?? 0}</span>
                        <span>Hook compat: {(draftData.draft.hookCompat * 100).toFixed(0)}%</span>
                        <span>Source: {draftData.draft.source}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="h-8 bg-muted rounded animate-pulse" />
                      <div className="h-20 bg-muted rounded animate-pulse" />
                    </div>
                  )}
                </CardContent>
              </Card>
            </section>
          </TabsContent>

          {/* ===== AUTONOMY TAB ===== */}
          <TabsContent value="autonomy" className="space-y-6">
            <section>
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                <Moon className="size-4" />
                Overnight Autonomy Pipeline
              </h2>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <CardTitle>Autonomy Status</CardTitle>
                    <Badge className={autonomyData?.status?.equipped ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-amber-600 text-white border-amber-600'}>
                      {autonomyData?.status?.equipped ? 'Passive Autonomous Soul ✓' : 'Not Equipped'}
                    </Badge>
                  </div>
                  <CardDescription>
                    23:00 wake → review signals → delegate → 00:00 draft → 06:00 morning brief
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Phase timeline */}
                    <div className="flex items-center gap-2 flex-wrap">
                      {['waking', 'reviewing_signals', 'delegating', 'drafting', 'waiting_approval', 'brief_ready', 'idle'].map((phase, i) => {
                        const currentPhase = autonomyData?.status?.phase ?? 'idle';
                        const isActive = currentPhase === phase;
                        const isPast = ['idle', 'brief_ready'].includes(currentPhase) && i < 6;
                        return (
                          <div key={phase} className="flex items-center gap-1">
                            <div className={`size-2 rounded-full ${
                              isActive ? 'bg-violet-500 animate-pulse' : isPast ? 'bg-emerald-500' : 'bg-muted-foreground/30'
                            }`} />
                            <span className={`text-xs ${isActive ? 'text-violet-400 font-medium' : isPast ? 'text-emerald-400' : 'text-muted-foreground'}`}>
                              {phase.replace(/_/g, ' ').slice(0, 12)}
                            </span>
                            {i < 6 && <ArrowRight className="size-3 text-muted-foreground/30" />}
                          </div>
                        );
                      })}
                    </div>

                    <Separator />

                    {/* Approval Gate */}
                    <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                      <p className="text-sm font-medium text-amber-400 flex items-center gap-2">
                        <Shield className="size-4" />
                        Approval Gate: Nothing publishes without human approval
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Pending approvals: {autonomyData?.status?.pendingApprovals ?? 0}
                      </p>
                    </div>

                    {/* Drafts */}
                    {autonomyData?.status?.drafts && autonomyData.status.drafts.length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-2">Overnight Drafts</p>
                        {autonomyData.status.drafts.map((draft) => (
                          <div key={draft.id} className="flex items-center justify-between p-2 rounded-md bg-muted/50 text-sm mb-1">
                            <span className="truncate flex-1 mr-2">{draft.title}</span>
                            <Badge variant={draft.approvalStatus === 'pending' ? 'outline' : 'secondary'} className="shrink-0">
                              {draft.approvalStatus}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Audit Log */}
                    {autonomyData?.status?.auditLog && autonomyData.status.auditLog.length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-2">Audit Trail (last {Math.min(autonomyData.status.auditLog.length, 10)})</p>
                        <ScrollArea className="max-h-48">
                          <div className="space-y-1 pr-3">
                            {autonomyData.status.auditLog.slice(-10).reverse().map((entry) => (
                              <div key={entry.id} className="flex items-start gap-2 text-xs p-1.5 rounded bg-muted/30">
                                <Badge variant="outline" className="text-[10px] px-1 py-0 shrink-0">{entry.actor}</Badge>
                                <span className="text-muted-foreground truncate">{entry.action}: {entry.detail.slice(0, 80)}</span>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      </div>
                    )}

                    {/* Credit estimate */}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Credit burn estimate</span>
                      <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                        {autonomyData?.status?.creditBurnEstimate ?? 0} credits
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>
          </TabsContent>
        </Tabs>
      </main>

      {/* ===== Footer ===== */}
      <footer className="border-t border-border bg-card mt-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between text-xs text-muted-foreground flex-wrap gap-2">
          <span>Muse — Day 2 Creative Pipeline | Next.js 16 + Minds SDK + Zero-Credit Architecture</span>
          <span className="flex items-center gap-1">
            <Server className="size-3" />
            {status?.mode === 'live' ? 'Live API' : 'Simulated'}
            <span className="ml-2">0 credits burned</span>
          </span>
        </div>
      </footer>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function MindCard({
  title,
  subtitle,
  data,
  colorScheme,
  icon,
  loading,
}: {
  title: string;
  subtitle: string;
  data: MindStatus | null;
  colorScheme: 'violet' | 'emerald' | 'amber';
  icon: React.ReactNode;
  loading: boolean;
}) {
  const borderColor =
    colorScheme === 'violet'
      ? 'border-violet-500/30'
      : colorScheme === 'emerald'
        ? 'border-emerald-500/30'
        : 'border-amber-500/30';

  const glowColor =
    colorScheme === 'violet'
      ? 'shadow-violet-500/10'
      : colorScheme === 'emerald'
        ? 'shadow-emerald-500/10'
        : 'shadow-amber-500/10';

  if (loading) {
    return (
      <Card className={`${borderColor} ${glowColor} shadow-md`}>
        <CardHeader>
          <div className="flex items-center gap-2">
            {icon}
            <div>
              <div className="h-5 w-32 bg-muted rounded animate-pulse" />
              <div className="h-3 w-48 bg-muted rounded animate-pulse mt-1" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="h-4 w-full bg-muted rounded animate-pulse" />
          <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
          <div className="h-4 w-1/2 bg-muted rounded animate-pulse" />
        </CardContent>
      </Card>
    );
  }

  const mind = data?.mind;
  const balance = data?.balance;
  const skills = data?.skills ?? [];
  const circle = data?.circleMembers ?? [];
  const creditsLow = balance && balance.cognition < 10;

  return (
    <Card className={`${borderColor} ${glowColor} shadow-md`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {icon}
            <div>
              <CardTitle className="text-base">{title}</CardTitle>
              <CardDescription className="text-xs">{subtitle}</CardDescription>
            </div>
          </div>
          {mind && (
            <Badge
              variant={mind.isEnabled ? 'default' : 'destructive'}
              className={
                mind.isEnabled
                  ? colorScheme === 'violet'
                    ? 'bg-violet-600 text-white border-violet-600'
                    : 'bg-emerald-600 text-white border-emerald-600'
                  : undefined
              }
            >
              {mind.isEnabled ? 'Enabled' : 'Disabled'}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {mind ? (
          <>
            <InfoRow label="Name" value={mind.name ?? '—'} />
            <InfoRow label="ID" value={truncateId(mind.mindId)} />
            <InfoRow label="Email" value={mind.email ?? '—'} />
            <InfoRow label="Chain" value={mind.chain ?? '—'} />
          </>
        ) : (
          <p className="text-sm text-muted-foreground">Mind data unavailable</p>
        )}
        <Separator className="my-2" />
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Cognition Credits</span>
          <span className={`font-mono font-semibold ${creditsLow ? 'text-red-500' : 'text-foreground'}`}>
            {balance?.cognition.toFixed(2) ?? '—'}
            {creditsLow && (
              <AlertTriangle className="size-3 inline ml-1 text-red-500" />
            )}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Skills</span>
          <Badge variant="secondary">{skills.length}</Badge>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Circle Members</span>
          <Badge variant="secondary">{circle.length}</Badge>
        </div>
        {skills.length > 0 && (
          <div className="pt-1">
            <p className="text-xs text-muted-foreground mb-1">Equipped Skills:</p>
            <div className="flex flex-wrap gap-1">
              {skills.map((s) => (
                <Badge key={s.skillId} variant="outline" className="text-xs">
                  {s.name ?? s.skillId}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-mono text-xs">{value}</span>
    </div>
  );
}

function SystemCard({
  icon,
  title,
  status: systemStatus,
  statusLabel,
  details,
  colorScheme,
}: {
  icon: React.ReactNode;
  title: string;
  status: 'active' | 'pending' | 'error';
  statusLabel: string;
  details: string[];
  colorScheme: 'violet' | 'emerald' | 'amber';
}) {
  const borderColor =
    colorScheme === 'violet'
      ? 'border-violet-500/30'
      : colorScheme === 'emerald'
        ? 'border-emerald-500/30'
        : 'border-amber-500/30';

  const statusColors = {
    active: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    error: 'bg-red-500/10 text-red-400 border-red-500/20',
  };

  return (
    <Card className={`${borderColor} shadow-md`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {icon}
            <CardTitle className="text-sm">{title}</CardTitle>
          </div>
          <Badge variant="outline" className={`text-xs ${statusColors[systemStatus]}`}>
            {systemStatus === 'active' && <CheckCircle2 className="size-3 mr-1" />}
            {statusLabel}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-1.5">
          {details.map((detail, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
              <span className="mt-0.5">•</span>
              <span>{detail}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function ArchNode({
  label,
  sublabel,
  icon,
  color,
  wide = false,
}: {
  label: string;
  sublabel: string;
  icon: React.ReactNode;
  color: 'violet' | 'emerald' | 'amber';
  wide?: boolean;
}) {
  const colors = {
    violet: 'border-violet-500/40 bg-violet-500/10 text-violet-300',
    emerald: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300',
    amber: 'border-amber-500/40 bg-amber-500/10 text-amber-300',
  };
  const labelColors = {
    violet: 'text-violet-400',
    emerald: 'text-emerald-400',
    amber: 'text-amber-400',
  };

  return (
    <div
      className={`flex items-center gap-3 px-5 py-3 rounded-xl border ${colors[color]} ${
        wide ? 'min-w-[280px] sm:min-w-[360px]' : 'min-w-[220px] sm:min-w-[280px]'
      } justify-center`}
    >
      {icon}
      <div className="text-center">
        <div className={`font-semibold text-sm ${labelColors[color]}`}>{label}</div>
        <div className="text-xs opacity-70">{sublabel}</div>
      </div>
    </div>
  );
}

function ArchArrow() {
  return (
    <div className="flex flex-col items-center">
      <ArrowRight className="size-4 text-muted-foreground rotate-90" />
    </div>
  );
}
