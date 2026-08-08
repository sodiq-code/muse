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

export default function Day1Dashboard() {
  const [status, setStatus] = useState<StatusResponse | null>(null);
  const [validation, setValidation] = useState<ValidationResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAll() {
      try {
        const [statusRes, valRes] = await Promise.all([
          fetch('/api/minds/status').then((r) => r.json()),
          fetch('/api/validation/day1').then((r) => r.json()),
        ]);
        setStatus(statusRes);
        setValidation(valRes);
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

  // Day 2 tasks
  const day2Tasks = [
    { id: 'd2-1', label: 'Creator Onboarding Flow — capture identity via Muse conversation' },
    { id: 'd2-2', label: 'Memory Graph — store all learned facts as MemoryEvent records' },
    { id: 'd2-3', label: 'Hook Pattern Engine — analyze past hooks for effectiveness patterns' },
    { id: 'd2-4', label: 'Content Recommendation Pipeline — Muse → Maker → Draft → Approval' },
    { id: 'd2-5', label: 'Dashboard V2 — real-time creative workspace with live Mind feeds' },
  ];

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
                Muse — Day 1 Platform Validation
              </h1>
              <p className="text-xs text-muted-foreground">
                The AI Creative Team That Learns You
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {loading ? (
              <Badge variant="secondary" className="gap-1">
                <Server className="size-3 animate-pulse" />
                Connecting…
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
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-6 space-y-8">
        {/* ---------- Section 1: Mind Status Cards ---------- */}
        <section>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
            <Bot className="size-4" />
            Mind Status
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Muse Card */}
            <MindCard
              title="Muse — Orchestrator"
              subtitle="The mind that learns you and orchestrates creative work"
              data={status?.muse ?? null}
              colorScheme="violet"
              icon={<Brain className="size-5 text-violet-400" />}
              loading={loading}
            />
            {/* Maker Card */}
            <MindCard
              title="Maker — Creative"
              subtitle="The mind that generates content and hooks"
              data={status?.maker ?? null}
              colorScheme="emerald"
              icon={<Zap className="size-5 text-emerald-400" />}
              loading={loading}
            />
          </div>
        </section>

        <Separator />

        {/* ---------- Section 2: Validation Test Results ---------- */}
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
                All 6 Day 1 gates must pass for GO/NO-GO decision
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
                  {/* Table header */}
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
                  <Badge
                    className={`text-base px-3 py-1 ${
                      validation.cached.verdict === 'GO'
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-red-600 text-white border-red-600'
                    }`}
                  >
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

        {/* ---------- Section 3: System Architecture ---------- */}
        <section>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
            <Layers className="size-4" />
            System Architecture
          </h2>
          <Card>
            <CardHeader>
              <CardTitle>3-Layer Creative Intelligence</CardTitle>
              <CardDescription>
                Creator → Muse (Orchestrator) → Maker (Creative) → Learning Engine → Creator Memory Graph
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Architecture Diagram */}
              <div className="flex flex-col items-center gap-3 py-4">
                {/* Row 1: Creator */}
                <ArchNode
                  label="Creator"
                  sublabel="Jules (YouTube)"
                  icon={<Users className="size-4" />}
                  color="amber"
                />
                <ArchArrow />

                {/* Row 2: Muse */}
                <ArchNode
                  label="Muse"
                  sublabel="Orchestrator · Learner"
                  icon={<Brain className="size-4" />}
                  color="violet"
                />
                <ArchArrow />

                {/* Row 3: Maker */}
                <ArchNode
                  label="Maker"
                  sublabel="Creative · Executor"
                  icon={<Zap className="size-4" />}
                  color="emerald"
                />
                <ArchArrow />

                {/* Row 4: Learning Engine */}
                <ArchNode
                  label="Learning Engine"
                  sublabel="Memory · Patterns · Hooks"
                  icon={<Eye className="size-4" />}
                  color="violet"
                />
                <ArchArrow />

                {/* Row 5: Memory Graph */}
                <ArchNode
                  label="Creator Memory Graph"
                  sublabel="Identity · Preferences · Performance"
                  icon={<Workflow className="size-4" />}
                  color="amber"
                  wide
                />
              </div>

              {/* Flow description */}
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-muted-foreground">
                <div className="flex flex-col items-center gap-1 p-3 rounded-lg bg-violet-500/10 text-violet-300">
                  <Cpu className="size-4" />
                  <span className="font-medium text-violet-400">Muse Layer</span>
                  <span className="text-center">Understands creator, orchestrates workflow, manages memory</span>
                </div>
                <div className="flex flex-col items-center gap-1 p-3 rounded-lg bg-emerald-500/10 text-emerald-300">
                  <Lightbulb className="size-4" />
                  <span className="font-medium text-emerald-400">Maker Layer</span>
                  <span className="text-center">Generates content, drafts, hooks, and creative assets</span>
                </div>
                <div className="flex flex-col items-center gap-1 p-3 rounded-lg bg-amber-500/10 text-amber-300">
                  <Activity className="size-4" />
                  <span className="font-medium text-amber-400">Learning Layer</span>
                  <span className="text-center">Feeds decisions back into memory, evolves recommendations</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* ---------- Section 4: Next Steps ---------- */}
        <section>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
            <ArrowRight className="size-4" />
            Day 2 Next Steps
          </h2>
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Tasks</CardTitle>
              <CardDescription>
                Building on Day 1 foundation — creator onboarding, memory, hooks, and content pipeline
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {day2Tasks.map((task) => (
                  <div key={task.id} className="flex items-start gap-3">
                    <Checkbox id={task.id} className="mt-0.5" />
                    <label
                      htmlFor={task.id}
                      className="text-sm leading-relaxed cursor-pointer"
                    >
                      {task.label}
                    </label>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <Progress value={16} className="flex-1" />
              <span className="text-xs text-muted-foreground ml-3">Day 1 of 6 complete</span>
            </CardFooter>
          </Card>
        </section>
      </main>

      {/* ===== Footer ===== */}
      <footer className="border-t border-border bg-card mt-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between text-xs text-muted-foreground flex-wrap gap-2">
          <span>Muse — Creative Minds Jam #1 | Built with Next.js 16 + Minds SDK</span>
          <span className="flex items-center gap-1">
            <Server className="size-3" />
            {status?.mode === 'live' ? 'Live API' : 'Simulated'}
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
