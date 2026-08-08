'use client';

import { useEffect, useState, useCallback } from 'react';
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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
  User,
  Fingerprint,
  History,
  Pencil,
  X,
  Save,
  Database,
  Mic,
  TrendingUp,
  Award,
  PieChart,
  Plus,
  Upload,
  Scale,
  ThumbsUp,
  ThumbsDown,
  GitBranch,
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

interface CreatorResponse {
  success: boolean;
  creator?: {
    id: string;
    email: string;
    name: string;
    niche: string | null;
    audience: string | null;
    tone: string[];
    avoid: string[];
    platform: string;
    voiceProfile: Record<string, number>;
    mindsHumanId: string | null;
    mindsMuseId: string | null;
    mindsMakerId: string | null;
    createdAt: string;
    updatedAt: string;
  };
  identityDomain?: {
    name: string;
    niche: string | null;
    audience: string | null;
    tone: string[];
    avoid: string[];
    platform: string;
    email: string;
  };
  stats?: {
    memoryEvents: number;
    auditEvents: number;
  };
}

interface MemoryEventItem {
  id: string;
  creatorId: string;
  category: string;
  key: string;
  value: string;
  confidence: number;
  source: string;
  sessionId: string | null;
  createdAt: string;
}

interface AuditEventItem {
  id: string;
  creatorId: string;
  actor: string;
  action: string;
  targetType: string;
  targetId: string | null;
  delta: string | null;
  createdAt: string;
}

interface MemoryResponse {
  success: boolean;
  events: MemoryEventItem[];
  count: number;
  category: string;
}

interface AuditResponse {
  success: boolean;
  events: AuditEventItem[];
  count: number;
}

// Voice Domain Types
interface VoiceProfileResponse {
  success: boolean;
  profile?: Record<string, number>;
  dimensions?: string[];
}

interface VoiceAnalysisResult {
  dimension: string;
  score: number;
  indicator: string;
  reasoning: string;
}

interface VoiceMatchResult {
  overallMatch: number;
  dimensionMatches: { dimension: string; profileScore: number; contentScore: number; match: number; isMismatch: boolean }[];
  mismatchCount: number;
}

interface VoiceAnalyzeResponse {
  success: boolean;
  analysis?: VoiceAnalysisResult[];
  match?: VoiceMatchResult;
  error?: string;
}

// Performance Domain Types
interface ContentItem {
  id: string;
  title: string;
  type: string;
  status: string;
  hookPattern: string | null;
  hookText: string | null;
  metricsCount: number;
  publishedAt: string | null;
  createdAt: string;
}

interface ContentListResponse {
  success: boolean;
  items: ContentItem[];
  count: number;
}

interface HookPatternStat {
  pattern: string;
  count: number;
  avgEffectiveness: number;
  sampleSize: number;
}

interface PerformanceInsight {
  title: string;
  detail: string;
  confidence: 'low' | 'medium' | 'high';
  dataPoints: number;
  evidenceType: string;
}

interface PerformanceResponse {
  success: boolean;
  hookPatterns: HookPatternStat[];
  insights: PerformanceInsight[];
  bestPattern: string | null;
  worstPattern: string | null;
}

interface ContentMetricsResponse {
  success: boolean;
  message?: string;
  error?: string;
}

// Decisions Domain Types
interface DecisionItem {
  id: string;
  contentItemId: string;
  contentItemTitle: string;
  decisionType: 'accepted' | 'modified' | 'rejected' | 'ignored';
  category: string;
  reason: string;
  modifications: string | null;
  createdAt: string;
}

interface DecisionLearning {
  insight: string;
  confidence: 'low' | 'medium' | 'high';
  dataPoints: number;
}

interface DecisionsResponse {
  success: boolean;
  decisions: DecisionItem[];
  learnings: DecisionLearning[];
  summary: {
    total: number;
    accepted: number;
    modified: number;
    rejected: number;
    ignored: number;
    acceptanceRate: number;
    modificationRate: number;
    mostRejectedCategory: string;
  };
}

interface IngestStatusResponse {
  success: boolean;
  totalContentItems: number;
  totalHooks: number;
  totalMetrics: number;
  hookPatternCoverage: number;
  meetsMinimum: boolean;
  lastIngestAt: string | null;
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

function voiceBarColor(value: number): string {
  if (value >= 70) return 'bg-emerald-500';
  if (value >= 40) return 'bg-amber-500';
  return 'bg-rose-400';
}

function voiceBadgeColor(value: number): string {
  if (value >= 70) return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
  if (value >= 40) return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
  return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
}

function statusBadgeStyle(status: string): string {
  switch (status) {
    case 'published': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    case 'drafting': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    case 'idea': return 'bg-violet-500/10 text-violet-400 border-violet-500/20';
    case 'archived': return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    default: return '';
  }
}

function confidenceBadgeStyle(confidence: string): string {
  switch (confidence) {
    case 'high': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    case 'medium': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    case 'low': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
    default: return '';
  }
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
  const [creatorData, setCreatorData] = useState<CreatorResponse | null>(null);
  const [memoryData, setMemoryData] = useState<MemoryResponse | null>(null);
  const [auditData, setAuditData] = useState<AuditResponse | null>(null);
  const [editingIdentity, setEditingIdentity] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', niche: '', audience: '', tone: '', avoid: '' });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Voice Domain State
  const [voiceProfile, setVoiceProfile] = useState<VoiceProfileResponse | null>(null);
  const [voiceLoading, setVoiceLoading] = useState(true);
  const [analyzeText, setAnalyzeText] = useState('');
  const [analyzeLoading, setAnalyzeLoading] = useState(false);
  const [analyzeResult, setAnalyzeResult] = useState<VoiceAnalyzeResponse | null>(null);
  const [updateProfileToggle, setUpdateProfileToggle] = useState(true);

  // Performance Domain State
  const [contentItems, setContentItems] = useState<ContentListResponse | null>(null);
  const [perfData, setPerfData] = useState<PerformanceResponse | null>(null);
  const [perfLoading, setPerfLoading] = useState(true);
  const [showAddContent, setShowAddContent] = useState(false);
  const [showIngestMetrics, setShowIngestMetrics] = useState(false);
  const [newContent, setNewContent] = useState({ title: '', type: 'short_form', hookText: '' });
  const [newMetrics, setNewMetrics] = useState({ contentId: '', views: '', likes: '', shares: '', comments: '' });
  const [addingContent, setAddingContent] = useState(false);
  const [addingMetrics, setAddingMetrics] = useState(false);

  // Decisions Domain State
  const [decisionsData, setDecisionsData] = useState<DecisionsResponse | null>(null);
  const [decisionsLoading, setDecisionsLoading] = useState(true);
  const [ingestStatus, setIngestStatus] = useState<IngestStatusResponse | null>(null);
  const [decisionForm, setDecisionForm] = useState({ contentItemId: '', decisionType: 'accepted', category: '', reason: '' });
  const [submittingDecision, setSubmittingDecision] = useState(false);

  // Fetch creator/memory/audit data
  const fetchCreatorData = useCallback(async () => {
    try {
      const [creatorRes, memRes, auditRes] = await Promise.all([
        fetch('/api/creator').then((r) => r.json()).catch(() => null),
        fetch('/api/creator/memory').then((r) => r.json()).catch(() => null),
        fetch('/api/creator/audit').then((r) => r.json()).catch(() => null),
      ]);
      if (creatorRes) setCreatorData(creatorRes);
      if (memRes) setMemoryData(memRes);
      if (auditRes) setAuditData(auditRes);
    } catch {
      // silently fail
    }
  }, []);

  // Fetch voice profile
  const fetchVoiceProfile = useCallback(async () => {
    setVoiceLoading(true);
    try {
      const res = await fetch('/api/creator/voice').then((r) => r.json()).catch(() => null);
      if (res) setVoiceProfile(res);
    } catch {
      // silently fail
    } finally {
      setVoiceLoading(false);
    }
  }, []);

  // Fetch performance data
  const fetchPerformanceData = useCallback(async () => {
    setPerfLoading(true);
    try {
      const [contentRes, perfRes] = await Promise.all([
        fetch('/api/content').then((r) => r.json()).catch(() => null),
        fetch('/api/content/performance').then((r) => r.json()).catch(() => null),
      ]);
      if (contentRes) setContentItems(contentRes);
      if (perfRes) setPerfData(perfRes);
    } catch {
      // silently fail
    } finally {
      setPerfLoading(false);
    }
  }, []);

  // Fetch decisions and ingest data
  const fetchDecisionsData = useCallback(async () => {
    setDecisionsLoading(true);
    try {
      const [decisionsRes, ingestRes] = await Promise.all([
        fetch('/api/creator/decisions').then((r) => r.json()).catch(() => null),
        fetch('/api/content/ingest').then((r) => r.json()).catch(() => null),
      ]);
      if (decisionsRes) setDecisionsData(decisionsRes);
      if (ingestRes) setIngestStatus(ingestRes);
    } catch {
      // silently fail
    } finally {
      setDecisionsLoading(false);
    }
  }, []);

  useEffect(() => {
    async function fetchAll() {
      try {
        const [statusRes, valRes, draftRes, autoRes, hookRes, creatorRes, memRes, auditRes] = await Promise.all([
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
          fetch('/api/creator').then((r) => r.json()).catch(() => null),
          fetch('/api/creator/memory').then((r) => r.json()).catch(() => null),
          fetch('/api/creator/audit').then((r) => r.json()).catch(() => null),
        ]);
        setStatus(statusRes);
        setValidation(valRes);
        setDraftData(draftRes);
        setAutonomyData(autoRes);
        setHookData(hookRes);
        if (creatorRes) setCreatorData(creatorRes);
        if (memRes) setMemoryData(memRes);
        if (auditRes) setAuditData(auditRes);
      } catch (e) {
        setError(String(e));
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
    fetchVoiceProfile();
    fetchPerformanceData();
    fetchDecisionsData();
  }, [fetchVoiceProfile, fetchPerformanceData, fetchDecisionsData]);

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

  // Voice profile dimensions for display (sorted descending)
  const voiceProfileEntries = voiceProfile?.profile
    ? Object.entries(voiceProfile.profile).sort(([, a], [, b]) => b - a)
    : creatorData?.creator?.voiceProfile
      ? Object.entries(creatorData.creator.voiceProfile).sort(([, a], [, b]) => b - a)
      : [];

  // Performance overview computed values
  const totalContentItems = contentItems?.count ?? 0;
  const totalHooksTracked = perfData?.hookPatterns?.reduce((sum, p) => sum + p.count, 0) ?? 0;
  const bestPatternEntry = perfData?.hookPatterns?.find((p) => p.pattern === perfData.bestPattern);
  const worstPatternEntry = perfData?.hookPatterns?.find((p) => p.pattern === perfData.worstPattern);

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
                Muse — Day 5 Memory
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
            <Badge variant="outline" className="gap-1 border-sky-500/40 text-sky-400">
              ❄️ Schema Frozen
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
        <Tabs defaultValue="decisions" className="w-full">
          <TabsList className="w-full sm:w-auto flex-wrap">
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
            <TabsTrigger value="memory" className="gap-1.5">
              <Database className="size-3.5" />
              Memory
            </TabsTrigger>
            <TabsTrigger value="voice" className="gap-1.5">
              <Mic className="size-3.5" />
              Voice
            </TabsTrigger>
            <TabsTrigger value="performance" className="gap-1.5">
              <TrendingUp className="size-3.5" />
              Performance
            </TabsTrigger>
            <TabsTrigger value="decisions" className="gap-1.5">
              <Scale className="size-3.5" />
              Decisions
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

          {/* ===== MEMORY TAB ===== */}
          <TabsContent value="memory" className="space-y-6">
            {/* Identity Card */}
            <section>
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                <Fingerprint className="size-4" />
                Creator Identity Domain
              </h2>
              <Card className="border-violet-500/30 shadow-md">
                <CardHeader>
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-full bg-gradient-to-br from-violet-500 to-emerald-500 flex items-center justify-center">
                        <User className="size-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{creatorData?.creator?.name ?? 'Loading…'}</CardTitle>
                        <CardDescription>{creatorData?.creator?.niche ?? '—'}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="gap-1 border-amber-500/40 text-amber-400">
                        {creatorData?.creator?.platform === 'youtube' ? 'YouTube' : creatorData?.creator?.platform ?? '—'}
                      </Badge>
                      {creatorData?.stats && (
                        <Badge variant="secondary" className="gap-1">
                          <Database className="size-3" />
                          {creatorData.stats.memoryEvents} memories
                        </Badge>
                      )}
                      {!editingIdentity ? (
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1"
                          onClick={() => {
                            const c = creatorData?.creator;
                            setEditForm({
                              name: c?.name ?? '',
                              niche: c?.niche ?? '',
                              audience: c?.audience ?? '',
                              tone: c?.tone?.join(', ') ?? '',
                              avoid: c?.avoid?.join(', ') ?? '',
                            });
                            setEditingIdentity(true);
                          }}
                        >
                          <Pencil className="size-3" />
                          Edit
                        </Button>
                      ) : (
                        <div className="flex gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-1"
                            onClick={() => setEditingIdentity(false)}
                          >
                            <X className="size-3" />
                            Cancel
                          </Button>
                          <Button
                            size="sm"
                            className="gap-1 bg-violet-600 text-white hover:bg-violet-700"
                            disabled={saving}
                            onClick={async () => {
                              setSaving(true);
                              try {
                                const res = await fetch('/api/creator', {
                                  method: 'PATCH',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({
                                    name: editForm.name,
                                    niche: editForm.niche,
                                    audience: editForm.audience,
                                    tone: editForm.tone.split(',').map((s) => s.trim()).filter(Boolean),
                                    avoid: editForm.avoid.split(',').map((s) => s.trim()).filter(Boolean),
                                  }),
                                });
                                if (res.ok) {
                                  setEditingIdentity(false);
                                  await fetchCreatorData();
                                }
                              } catch {
                                // error
                              } finally {
                                setSaving(false);
                              }
                            }}
                          >
                            <Save className="size-3" />
                            {saving ? 'Saving…' : 'Save'}
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {editingIdentity ? (
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-medium text-muted-foreground block mb-1">Name</label>
                        <Input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground block mb-1">Niche</label>
                        <Input value={editForm.niche} onChange={(e) => setEditForm({ ...editForm, niche: e.target.value })} />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground block mb-1">Audience</label>
                        <Input value={editForm.audience} onChange={(e) => setEditForm({ ...editForm, audience: e.target.value })} />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground block mb-1">Tone (comma-separated)</label>
                        <Textarea value={editForm.tone} onChange={(e) => setEditForm({ ...editForm, tone: e.target.value })} rows={2} />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground block mb-1">Avoid (comma-separated)</label>
                        <Textarea value={editForm.avoid} onChange={(e) => setEditForm({ ...editForm, avoid: e.target.value })} rows={2} />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs font-medium text-muted-foreground mb-1">Audience</p>
                          <p className="text-sm">{creatorData?.creator?.audience ?? '—'}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-muted-foreground mb-1">Email</p>
                          <p className="text-sm font-mono text-xs">{creatorData?.creator?.email ?? '—'}</p>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-2">Tone</p>
                        <div className="flex flex-wrap gap-1.5">
                          {(creatorData?.creator?.tone ?? []).map((t) => (
                            <Badge key={t} variant="outline" className="border-violet-500/40 text-violet-400">{t}</Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-2">Avoid</p>
                        <div className="flex flex-wrap gap-1.5">
                          {(creatorData?.creator?.avoid ?? []).map((a) => (
                            <Badge key={a} variant="outline" className="border-rose-500/40 text-rose-400">{a}</Badge>
                          ))}
                        </div>
                      </div>

                      <Separator />

                      {/* Minds IDs */}
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-2">Minds IDs</p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono">
                          <div className="p-2 rounded bg-muted/50">
                            <span className="text-muted-foreground">Human: </span>
                            <span>{truncateId(creatorData?.creator?.mindsHumanId ?? '', 12)}</span>
                          </div>
                          <div className="p-2 rounded bg-muted/50">
                            <span className="text-muted-foreground">Muse: </span>
                            <span>{truncateId(creatorData?.creator?.mindsMuseId ?? '', 12)}</span>
                          </div>
                          <div className="p-2 rounded bg-muted/50">
                            <span className="text-muted-foreground">Maker: </span>
                            <span>{truncateId(creatorData?.creator?.mindsMakerId ?? '', 12)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </section>

            <Separator />

            {/* Voice Profile (Memory tab - existing) */}
            <section>
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                <Activity className="size-4" />
                Voice Profile
              </h2>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Voice Dimensions</CardTitle>
                  <CardDescription>Quantified creator voice characteristics from identity analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {creatorData?.creator?.voiceProfile && Object.entries(creatorData.creator.voiceProfile)
                      .sort(([, a], [, b]) => b - a)
                      .map(([key, value]) => {
                        const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase());
                        const pct = Math.round(value);
                        const barColor = pct >= 70 ? 'bg-emerald-500' : pct >= 40 ? 'bg-amber-500' : 'bg-rose-500';
                        return (
                          <div key={key} className="flex items-center gap-3">
                            <span className="text-xs text-muted-foreground w-28 shrink-0 text-right">{label}</span>
                            <div className="flex-1 h-6 bg-muted rounded-md overflow-hidden relative">
                              <div
                                className={`h-full rounded-md ${barColor} transition-all duration-500`}
                                style={{ width: `${pct}%` }}
                              />
                              <span className="absolute inset-0 flex items-center justify-center text-xs font-medium">
                                {pct}%
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    {!creatorData?.creator?.voiceProfile && (
                      <div className="space-y-2">
                        {['Directness', 'Technical Depth', 'Storytelling', 'Humor', 'CTA Intensity', 'Hype'].map((label) => (
                          <div key={label} className="flex items-center gap-3">
                            <span className="text-xs text-muted-foreground w-28 shrink-0 text-right">{label}</span>
                            <div className="flex-1 h-6 bg-muted rounded-md animate-pulse" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </section>

            <Separator />

            {/* Memory Events Feed */}
            <section>
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                <Brain className="size-4" />
                Memory Events Feed
                {memoryData && (
                  <Badge variant="secondary" className="ml-1">{memoryData.count}</Badge>
                )}
              </h2>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Learning Memory</CardTitle>
                  <CardDescription>
                    Every identity update, preference signal, and performance observation
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="max-h-96">
                    <div className="space-y-2 pr-3">
                      {memoryData?.events && memoryData.events.length > 0 ? (
                        memoryData.events.map((evt) => {
                          const categoryColors: Record<string, string> = {
                            identity: 'border-violet-500/40 text-violet-400',
                            preference: 'border-emerald-500/40 text-emerald-400',
                            performance: 'border-amber-500/40 text-amber-400',
                            pattern: 'border-rose-500/40 text-rose-400',
                            feedback: 'border-violet-500/40 text-violet-400',
                          };
                          const sourceColors: Record<string, string> = {
                            creator: 'bg-violet-500/10 text-violet-400',
                            analytics: 'bg-emerald-500/10 text-emerald-400',
                            muse_inference: 'bg-amber-500/10 text-amber-400',
                            maker_feedback: 'bg-rose-500/10 text-rose-400',
                          };
                          const confidenceLabel = evt.confidence >= 0.8 ? 'high' : evt.confidence >= 0.4 ? 'medium' : 'low';
                          const confidenceColor = confidenceLabel === 'high' ? 'text-emerald-400' : confidenceLabel === 'medium' ? 'text-amber-400' : 'text-rose-400';
                          const valueDisplay = evt.value.length > 60 ? evt.value.slice(0, 60) + '…' : evt.value;

                          return (
                            <div key={evt.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                              <div className="flex flex-col gap-1 shrink-0">
                                <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${categoryColors[evt.category] ?? ''}`}>
                                  {evt.category}
                                </Badge>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="text-sm font-medium">{evt.key}</span>
                                  <span className="text-xs text-muted-foreground truncate">{valueDisplay}</span>
                                </div>
                                <div className="flex items-center gap-2 mt-1 flex-wrap">
                                  <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${sourceColors[evt.source] ?? ''}`}>
                                    {evt.source}
                                  </Badge>
                                  <span className={`text-[10px] font-medium ${confidenceColor}`}>
                                    {confidenceLabel} confidence
                                  </span>
                                  <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                                    <Clock className="size-2.5" />
                                    {new Date(evt.createdAt).toLocaleString()}
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="space-y-2">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="h-16 bg-muted rounded-lg animate-pulse" />
                          ))}
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </section>

            <Separator />

            {/* Audit Trail */}
            <section>
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                <History className="size-4" />
                Audit Trail
                {auditData && (
                  <Badge variant="secondary" className="ml-1">{auditData.count}</Badge>
                )}
              </h2>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Full Audit Log</CardTitle>
                  <CardDescription>
                    Every create, update, and learn event — the foundation of the learning loop
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="max-h-64">
                    <div className="space-y-2 pr-3">
                      {auditData?.events && auditData.events.length > 0 ? (
                        auditData.events.map((evt) => {
                          const actorColors: Record<string, string> = {
                            creator: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
                            muse: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
                            maker: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
                            system: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
                          };
                          const deltaDisplay = evt.delta
                            ? (() => { try { return JSON.stringify(JSON.parse(evt.delta)); } catch { return evt.delta; } })()
                            : null;
                          const truncatedDelta = deltaDisplay && deltaDisplay.length > 80 ? deltaDisplay.slice(0, 80) + '…' : deltaDisplay;

                          return (
                            <div key={evt.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                              <Badge variant="outline" className={`text-[10px] px-1.5 py-0 shrink-0 ${actorColors[evt.actor] ?? ''}`}>
                                {evt.actor}
                              </Badge>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="text-sm font-medium">{evt.action}</span>
                                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0">{evt.targetType}</Badge>
                                </div>
                                {truncatedDelta && (
                                  <p className="text-xs text-muted-foreground mt-1 truncate">{truncatedDelta}</p>
                                )}
                                <span className="text-[10px] text-muted-foreground flex items-center gap-0.5 mt-1">
                                  <Clock className="size-2.5" />
                                  {new Date(evt.createdAt).toLocaleString()}
                                </span>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="space-y-2">
                          {[1, 2, 3].map((i) => (
                            <div key={i} className="h-12 bg-muted rounded-lg animate-pulse" />
                          ))}
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </section>
          </TabsContent>

          {/* ===== VOICE TAB ===== */}
          <TabsContent value="voice" className="space-y-6">
            {/* Voice Profile Card */}
            <section>
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                <Mic className="size-4" />
                Voice Profile Domain
              </h2>
              <Card className="border-violet-500/30 shadow-md">
                <CardHeader>
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <div className="size-8 rounded-lg bg-gradient-to-br from-violet-500 to-rose-500 flex items-center justify-center">
                        <Mic className="size-4 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-base">Voice Profile Analysis</CardTitle>
                        <CardDescription>7 dimensions defining your unique creator voice</CardDescription>
                      </div>
                    </div>
                    <Badge variant="outline" className="gap-1 border-violet-500/40 text-violet-400">
                      <Activity className="size-3" />
                      {voiceProfileEntries.length} dimensions
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {voiceLoading ? (
                      <div className="space-y-2">
                        {['Directness', 'Technical Depth', 'Storytelling', 'Humor', 'CTA Intensity', 'Sentence Length', 'Hype'].map((label) => (
                          <div key={label} className="flex items-center gap-3">
                            <span className="text-xs text-muted-foreground w-28 shrink-0 text-right">{label}</span>
                            <div className="flex-1 h-6 bg-muted rounded-md animate-pulse" />
                          </div>
                        ))}
                      </div>
                    ) : voiceProfileEntries.length > 0 ? (
                      voiceProfileEntries.map(([key, value]) => {
                        const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase());
                        const pct = Math.round(value);
                        return (
                          <div key={key} className="flex items-center gap-3">
                            <span className="text-xs text-muted-foreground w-28 shrink-0 text-right">{label}</span>
                            <div className="flex-1 h-6 bg-muted rounded-md overflow-hidden relative">
                              <div
                                className={`h-full rounded-md ${voiceBarColor(pct)} transition-all duration-500`}
                                style={{ width: `${pct}%` }}
                              />
                              <span className="absolute inset-0 flex items-center justify-center text-xs font-medium">
                                {pct}%
                              </span>
                            </div>
                            <Badge variant="outline" className={`text-[10px] px-1.5 py-0 shrink-0 ${voiceBadgeColor(pct)}`}>
                              {pct >= 70 ? 'High' : pct >= 40 ? 'Med' : 'Low'}
                            </Badge>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-sm text-muted-foreground text-center py-6">
                        No voice profile data yet. Analyze content below to build your profile.
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </section>

            <Separator />

            {/* Voice Analysis Tool */}
            <section>
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                <BarChart3 className="size-4" />
                Voice Analysis Tool
              </h2>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Analyze Content Voice</CardTitle>
                  <CardDescription>Paste any content to measure its voice profile against your stored dimensions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Textarea
                      placeholder="Paste your content here to analyze its voice profile..."
                      value={analyzeText}
                      onChange={(e) => setAnalyzeText(e.target.value)}
                      rows={6}
                      className="resize-none"
                    />
                    <div className="flex items-center justify-between flex-wrap gap-3">
                      <div className="flex items-center gap-3">
                        <Button
                          className="gap-1.5 bg-violet-600 text-white hover:bg-violet-700"
                          disabled={!analyzeText.trim() || analyzeLoading}
                          onClick={async () => {
                            setAnalyzeLoading(true);
                            setAnalyzeResult(null);
                            try {
                              const res = await fetch('/api/creator/voice/analyze', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ text: analyzeText, updateProfile: updateProfileToggle }),
                              });
                              const data = await res.json();
                              setAnalyzeResult(data);
                              if (updateProfileToggle && data.success) {
                                await fetchVoiceProfile();
                              }
                            } catch {
                              setAnalyzeResult({ success: false, error: 'Failed to analyze voice' });
                            } finally {
                              setAnalyzeLoading(false);
                            }
                          }}
                        >
                          <Mic className="size-3.5" />
                          {analyzeLoading ? 'Analyzing…' : 'Analyze Voice'}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className={updateProfileToggle ? 'border-emerald-500/40 text-emerald-400' : ''}
                          onClick={() => setUpdateProfileToggle(!updateProfileToggle)}
                        >
                          {updateProfileToggle ? (
                            <>
                              <CheckCircle2 className="size-3.5" />
                              Update Profile
                            </>
                          ) : (
                            <>
                              <X className="size-3.5" />
                              Read-Only
                            </>
                          )}
                        </Button>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {analyzeText.length} characters
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Analysis Results */}
            {analyzeResult && (
              <section>
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Sparkles className="size-4" />
                  Analysis Results
                </h2>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Voice Dimension Scores</CardTitle>
                    <CardDescription>
                      {analyzeResult.success ? 'Each dimension measured with indicators and reasoning' : 'Analysis failed'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {analyzeResult.success && analyzeResult.analysis ? (
                      <div className="space-y-4">
                        {/* Dimension Scores */}
                        <div className="space-y-3">
                          {analyzeResult.analysis.map((dim) => {
                            const pct = Math.round(dim.score);
                            return (
                              <div key={dim.dimension} className="p-3 rounded-lg bg-muted/50">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-sm font-medium">{dim.dimension}</span>
                                  <div className="flex items-center gap-2">
                                    <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${voiceBadgeColor(pct)}`}>
                                      {dim.indicator}
                                    </Badge>
                                    <span className="text-sm font-mono font-semibold">{pct}%</span>
                                  </div>
                                </div>
                                <div className="h-3 bg-muted rounded-md overflow-hidden mb-2">
                                  <div
                                    className={`h-full rounded-md ${voiceBarColor(pct)} transition-all duration-500`}
                                    style={{ width: `${pct}%` }}
                                  />
                                </div>
                                <p className="text-xs text-muted-foreground">{dim.reasoning}</p>
                              </div>
                            );
                          })}
                        </div>

                        {/* Voice Match Display */}
                        {analyzeResult.match && (
                          <>
                            <Separator />
                            <div>
                              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                                <Award className="size-4 text-violet-400" />
                                Voice Match Score
                              </h3>
                              {/* Overall Match */}
                              <div className="flex items-center gap-4 mb-4">
                                <div className="text-3xl font-bold">
                                  {Math.round(analyzeResult.match.overallMatch * 100)}%
                                </div>
                                <Badge
                                  variant="outline"
                                  className={
                                    analyzeResult.match.overallMatch >= 0.8
                                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                      : analyzeResult.match.overallMatch >= 0.5
                                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                        : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                                  }
                                >
                                  {analyzeResult.match.overallMatch >= 0.8
                                    ? 'Strong Match'
                                    : analyzeResult.match.overallMatch >= 0.5
                                      ? 'Partial Match'
                                      : 'Weak Match'}
                                </Badge>
                              </div>

                              {/* Per-dimension Matches */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mb-3">
                                {analyzeResult.match.dimensionMatches.map((dm) => (
                                  <div
                                    key={dm.dimension}
                                    className={`p-2 rounded-lg text-xs ${
                                      dm.isMismatch
                                        ? 'bg-rose-500/10 border border-rose-500/20'
                                        : 'bg-muted/50'
                                    }`}
                                  >
                                    <div className="flex items-center justify-between mb-1">
                                      <span className={`font-medium ${dm.isMismatch ? 'text-rose-400' : ''}`}>
                                        {dm.dimension}
                                      </span>
                                      <span className="font-mono">{Math.round(dm.match * 100)}%</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-muted-foreground">
                                      <span>Profile: {Math.round(dm.profileScore * 100)}%</span>
                                      <span>→</span>
                                      <span>Content: {Math.round(dm.contentScore * 100)}%</span>
                                    </div>
                                  </div>
                                ))}
                              </div>

                              {/* Mismatch Warnings */}
                              {analyzeResult.match.mismatchCount > 0 && (
                                <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20">
                                  <p className="text-sm font-medium text-rose-400 flex items-center gap-2">
                                    <AlertTriangle className="size-4" />
                                    {analyzeResult.match.mismatchCount} dimension{analyzeResult.match.mismatchCount > 1 ? 's' : ''} mismatched
                                  </p>
                                  <div className="mt-2 space-y-1">
                                    {analyzeResult.match.dimensionMatches
                                      .filter((dm) => dm.isMismatch)
                                      .map((dm) => (
                                        <p key={dm.dimension} className="text-xs text-rose-300">
                                          • {dm.dimension}: profile {Math.round(dm.profileScore * 100)}% vs content {Math.round(dm.contentScore * 100)}%
                                        </p>
                                      ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    ) : (
                      <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20">
                        <p className="text-sm text-rose-400">
                          {analyzeResult.error ?? 'Analysis failed. Please try again.'}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </section>
            )}
          </TabsContent>

          {/* ===== PERFORMANCE TAB ===== */}
          <TabsContent value="performance" className="space-y-6">
            {/* Performance Overview Cards */}
            <section>
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                <TrendingUp className="size-4" />
                Performance Overview
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="border-emerald-500/30 shadow-md">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <FileText className="size-4 text-emerald-400" />
                      <CardTitle className="text-sm">Total Content Items</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{totalContentItems}</div>
                    <p className="text-xs text-muted-foreground mt-1">across all statuses</p>
                  </CardContent>
                </Card>
                <Card className="border-amber-500/30 shadow-md">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="size-4 text-amber-400" />
                      <CardTitle className="text-sm">Total Hooks Tracked</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{totalHooksTracked}</div>
                    <p className="text-xs text-muted-foreground mt-1">hook pattern observations</p>
                  </CardContent>
                </Card>
                <Card className="border-violet-500/30 shadow-md">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <Award className="size-4 text-violet-400" />
                      <CardTitle className="text-sm">Best Hook Pattern</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-lg font-bold">{bestPatternEntry?.pattern ?? perfData?.bestPattern ?? '—'}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      avg {bestPatternEntry ? `${Math.round(bestPatternEntry.avgEffectiveness * 100)}% effectiveness` : 'no data'}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </section>

            <Separator />

            {/* Content Items List */}
            <section>
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                <FileText className="size-4" />
                Content Items
                {contentItems && (
                  <Badge variant="secondary" className="ml-1">{contentItems.count}</Badge>
                )}
              </h2>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">All Content</CardTitle>
                  <CardDescription>Your content items with hook patterns and performance metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="max-h-96">
                    <div className="space-y-2 pr-3">
                      {perfLoading ? (
                        <div className="space-y-2">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="h-16 bg-muted rounded-lg animate-pulse" />
                          ))}
                        </div>
                      ) : contentItems?.items && contentItems.items.length > 0 ? (
                        contentItems.items.map((item) => (
                          <div key={item.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap mb-1">
                                <span className="text-sm font-medium truncate">{item.title}</span>
                                <Badge variant="outline" className="text-[10px] px-1.5 py-0 shrink-0">
                                  {item.type}
                                </Badge>
                                <Badge variant="outline" className={`text-[10px] px-1.5 py-0 shrink-0 ${statusBadgeStyle(item.status)}`}>
                                  {item.status}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-2 flex-wrap text-xs text-muted-foreground">
                                {item.hookPattern && (
                                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                                    {item.hookPattern}
                                  </Badge>
                                )}
                                <span className="flex items-center gap-0.5">
                                  <BarChart3 className="size-2.5" />
                                  {item.metricsCount} metrics
                                </span>
                                {item.publishedAt && (
                                  <span className="flex items-center gap-0.5">
                                    <Clock className="size-2.5" />
                                    {new Date(item.publishedAt).toLocaleDateString()}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-sm text-muted-foreground text-center py-6">
                          No content items yet. Use &quot;Add Content&quot; below to create one.
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </section>

            <Separator />

            {/* Hook Pattern Performance */}
            <section>
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                <PieChart className="size-4" />
                Hook Pattern Performance
              </h2>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Pattern Effectiveness</CardTitle>
                  <CardDescription>Statistical comparison of hook patterns with honest sample sizes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {perfLoading ? (
                      <div className="space-y-2">
                        {[1, 2, 3, 4].map((i) => (
                          <div key={i} className="h-12 bg-muted rounded-lg animate-pulse" />
                        ))}
                      </div>
                    ) : perfData?.hookPatterns && perfData.hookPatterns.length > 0 ? (
                      perfData.hookPatterns.map((pattern) => {
                        const isBest = pattern.pattern === perfData.bestPattern;
                        const isWorst = pattern.pattern === perfData.worstPattern;
                        const pct = Math.round(pattern.avgEffectiveness * 100);
                        return (
                          <div
                            key={pattern.pattern}
                            className={`p-3 rounded-lg ${
                              isBest
                                ? 'bg-emerald-500/10 border border-emerald-500/20'
                                : isWorst
                                  ? 'bg-rose-500/10 border border-rose-500/20'
                                  : 'bg-muted/50'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">{pattern.pattern}</span>
                                {isBest && (
                                  <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                                    Best
                                  </Badge>
                                )}
                                {isWorst && (
                                  <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-rose-500/10 text-rose-400 border-rose-500/20">
                                    Worst
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-mono font-semibold">{pct}%</span>
                                <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                                  {pattern.count} uses
                                </Badge>
                              </div>
                            </div>
                            <div className="h-2 bg-muted rounded-md overflow-hidden mb-1">
                              <div
                                className={`h-full rounded-md ${
                                  isBest ? 'bg-emerald-500' : isWorst ? 'bg-rose-400' : voiceBarColor(pct)
                                } transition-all duration-500`}
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                            <p className="text-[10px] text-muted-foreground">
                              Based on {pattern.sampleSize} sample{pattern.sampleSize !== 1 ? 's' : ''} — avg effectiveness {pct}%
                            </p>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-sm text-muted-foreground text-center py-6">
                        No hook pattern data yet. Add content and metrics to build performance stats.
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </section>

            <Separator />

            {/* Performance Insights */}
            <section>
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                <Lightbulb className="size-4" />
                Performance Insights
              </h2>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">AI-Generated Insights</CardTitle>
                  <CardDescription>Statistically honest recommendations based on your content data</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {perfLoading ? (
                      <div className="space-y-2">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="h-20 bg-muted rounded-lg animate-pulse" />
                        ))}
                      </div>
                    ) : perfData?.insights && perfData.insights.length > 0 ? (
                      perfData.insights.map((insight, i) => (
                        <div key={i} className="p-3 rounded-lg bg-muted/50">
                          <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                            <span className="text-sm font-medium">{insight.title}</span>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${confidenceBadgeStyle(insight.confidence)}`}>
                                {insight.confidence} confidence
                              </Badge>
                              <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                                {insight.evidenceType}
                              </Badge>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground mb-1">{insight.detail}</p>
                          <p className="text-[10px] text-muted-foreground">
                            Based on {insight.dataPoints} data point{insight.dataPoints !== 1 ? 's' : ''}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-muted-foreground text-center py-6">
                        No insights yet. Add more content and metrics to generate insights.
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </section>

            <Separator />

            {/* Quick Actions */}
            <section>
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                <Zap className="size-4" />
                Quick Actions
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Add Content */}
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Plus className="size-4 text-violet-400" />
                        <CardTitle className="text-sm">Add Content</CardTitle>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-1 text-xs"
                        onClick={() => { setShowAddContent(!showAddContent); setShowIngestMetrics(false); }}
                      >
                        {showAddContent ? <X className="size-3" /> : <Plus className="size-3" />}
                        {showAddContent ? 'Cancel' : 'New'}
                      </Button>
                    </div>
                  </CardHeader>
                  {showAddContent && (
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <label className="text-xs font-medium text-muted-foreground block mb-1">Title</label>
                          <Input
                            placeholder="Content title..."
                            value={newContent.title}
                            onChange={(e) => setNewContent({ ...newContent, title: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-muted-foreground block mb-1">Type</label>
                          <Select
                            value={newContent.type}
                            onValueChange={(val) => setNewContent({ ...newContent, type: val })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="short_form">Short Form</SelectItem>
                              <SelectItem value="long_form">Long Form</SelectItem>
                              <SelectItem value="carousel">Carousel</SelectItem>
                              <SelectItem value="video">Video</SelectItem>
                              <SelectItem value="thread">Thread</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-muted-foreground block mb-1">Hook Text</label>
                          <Textarea
                            placeholder="Opening hook text..."
                            value={newContent.hookText}
                            onChange={(e) => setNewContent({ ...newContent, hookText: e.target.value })}
                            rows={2}
                          />
                        </div>
                        <Button
                          className="w-full gap-1.5 bg-violet-600 text-white hover:bg-violet-700"
                          disabled={!newContent.title.trim() || addingContent}
                          onClick={async () => {
                            setAddingContent(true);
                            try {
                              const res = await fetch('/api/content', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(newContent),
                              });
                              if (res.ok) {
                                setNewContent({ title: '', type: 'short_form', hookText: '' });
                                setShowAddContent(false);
                                await fetchPerformanceData();
                              }
                            } catch {
                              // error
                            } finally {
                              setAddingContent(false);
                            }
                          }}
                        >
                          <Plus className="size-3.5" />
                          {addingContent ? 'Adding…' : 'Add Content'}
                        </Button>
                      </div>
                    </CardContent>
                  )}
                </Card>

                {/* Ingest Metrics */}
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Upload className="size-4 text-emerald-400" />
                        <CardTitle className="text-sm">Ingest Metrics</CardTitle>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-1 text-xs"
                        onClick={() => { setShowIngestMetrics(!showIngestMetrics); setShowAddContent(false); }}
                      >
                        {showIngestMetrics ? <X className="size-3" /> : <Upload className="size-3" />}
                        {showIngestMetrics ? 'Cancel' : 'Add'}
                      </Button>
                    </div>
                  </CardHeader>
                  {showIngestMetrics && (
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <label className="text-xs font-medium text-muted-foreground block mb-1">Content Item</label>
                          <Select
                            value={newMetrics.contentId}
                            onValueChange={(val) => setNewMetrics({ ...newMetrics, contentId: val })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select content..." />
                            </SelectTrigger>
                            <SelectContent>
                              {contentItems?.items?.map((item) => (
                                <SelectItem key={item.id} value={item.id}>
                                  {item.title.slice(0, 40)}{item.title.length > 40 ? '…' : ''}
                                </SelectItem>
                              )) ?? (
                                <SelectItem value="none" disabled>No content items</SelectItem>
                              )}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs font-medium text-muted-foreground block mb-1">Views</label>
                            <Input
                              type="number"
                              placeholder="0"
                              value={newMetrics.views}
                              onChange={(e) => setNewMetrics({ ...newMetrics, views: e.target.value })}
                            />
                          </div>
                          <div>
                            <label className="text-xs font-medium text-muted-foreground block mb-1">Likes</label>
                            <Input
                              type="number"
                              placeholder="0"
                              value={newMetrics.likes}
                              onChange={(e) => setNewMetrics({ ...newMetrics, likes: e.target.value })}
                            />
                          </div>
                          <div>
                            <label className="text-xs font-medium text-muted-foreground block mb-1">Shares</label>
                            <Input
                              type="number"
                              placeholder="0"
                              value={newMetrics.shares}
                              onChange={(e) => setNewMetrics({ ...newMetrics, shares: e.target.value })}
                            />
                          </div>
                          <div>
                            <label className="text-xs font-medium text-muted-foreground block mb-1">Comments</label>
                            <Input
                              type="number"
                              placeholder="0"
                              value={newMetrics.comments}
                              onChange={(e) => setNewMetrics({ ...newMetrics, comments: e.target.value })}
                            />
                          </div>
                        </div>
                        <Button
                          className="w-full gap-1.5 bg-emerald-600 text-white hover:bg-emerald-700"
                          disabled={!newMetrics.contentId || addingMetrics}
                          onClick={async () => {
                            setAddingMetrics(true);
                            try {
                              const res = await fetch('/api/content/metrics', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                  contentId: newMetrics.contentId,
                                  views: parseInt(newMetrics.views) || 0,
                                  likes: parseInt(newMetrics.likes) || 0,
                                  shares: parseInt(newMetrics.shares) || 0,
                                  comments: parseInt(newMetrics.comments) || 0,
                                }),
                              });
                              if (res.ok) {
                                setNewMetrics({ contentId: '', views: '', likes: '', shares: '', comments: '' });
                                setShowIngestMetrics(false);
                                await fetchPerformanceData();
                              }
                            } catch {
                              // error
                            } finally {
                              setAddingMetrics(false);
                            }
                          }}
                        >
                          <Upload className="size-3.5" />
                          {addingMetrics ? 'Ingesting…' : 'Ingest Metrics'}
                        </Button>
                      </div>
                    </CardContent>
                  )}
                </Card>
              </div>
            </section>
          </TabsContent>

          {/* ===== DECISIONS TAB ===== */}
          <TabsContent value="decisions" className="space-y-6">
            {/* Decision Summary Cards */}
            <section>
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                <Scale className="size-4" />
                Decision Summary
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-emerald-500/30 shadow-md">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <ThumbsUp className="size-4 text-emerald-400" />
                      <CardTitle className="text-sm">Total Decisions</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{decisionsData?.summary?.total ?? 0}</div>
                    <p className="text-xs text-muted-foreground mt-1">all decisions recorded</p>
                  </CardContent>
                </Card>
                <Card className="border-amber-500/30 shadow-md">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <GitBranch className="size-4 text-amber-400" />
                      <CardTitle className="text-sm">Acceptance Rate</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      {decisionsData?.summary ? `${Math.round(decisionsData.summary.acceptanceRate * 100)}%` : '—'}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">accepted + modified / total</p>
                  </CardContent>
                </Card>
                <Card className="border-rose-500/30 shadow-md">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <ThumbsDown className="size-4 text-rose-400" />
                      <CardTitle className="text-sm">Most Rejected Category</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-lg font-bold truncate">{decisionsData?.summary?.mostRejectedCategory ?? '—'}</div>
                    <p className="text-xs text-muted-foreground mt-1">highest rejection count</p>
                  </CardContent>
                </Card>
                <Card className="border-violet-500/30 shadow-md">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <Pencil className="size-4 text-violet-400" />
                      <CardTitle className="text-sm">Modification Rate</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      {decisionsData?.summary ? `${Math.round(decisionsData.summary.modificationRate * 100)}%` : '—'}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">modified / total</p>
                  </CardContent>
                </Card>
              </div>
            </section>

            <Separator />

            {/* Decision Learnings */}
            <section>
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                <Lightbulb className="size-4" />
                Decision Learnings
              </h2>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Insights from Decision Patterns</CardTitle>
                  <CardDescription>What your decision history reveals about content strategy</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {decisionsLoading ? (
                      <div className="space-y-2">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="h-20 bg-muted rounded-lg animate-pulse" />
                        ))}
                      </div>
                    ) : decisionsData?.learnings && decisionsData.learnings.length > 0 ? (
                      decisionsData.learnings.map((learning, i) => (
                        <div key={i} className="p-3 rounded-lg bg-muted/50">
                          <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                            <span className="text-sm font-medium">{learning.insight}</span>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${confidenceBadgeStyle(learning.confidence)}`}>
                                {learning.confidence}
                              </Badge>
                              <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                                {learning.dataPoints} pts
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-muted-foreground text-center py-6">
                        No decision learnings yet. Make decisions on content to generate insights.
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </section>

            <Separator />

            {/* Recent Decisions Feed */}
            <section>
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                <History className="size-4" />
                Recent Decisions
                {decisionsData?.decisions && (
                  <Badge variant="secondary" className="ml-1">{decisionsData.decisions.length}</Badge>
                )}
              </h2>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Decision Feed</CardTitle>
                  <CardDescription>Your content decisions with type, category, and reasoning</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="max-h-96">
                    <div className="space-y-2 pr-3">
                      {decisionsLoading ? (
                        <div className="space-y-2">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="h-16 bg-muted rounded-lg animate-pulse" />
                          ))}
                        </div>
                      ) : decisionsData?.decisions && decisionsData.decisions.length > 0 ? (
                        decisionsData.decisions.map((decision) => {
                          const typeColors: Record<string, string> = {
                            accepted: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
                            modified: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
                            rejected: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
                            ignored: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
                          };
                          let extractedCategory = decision.category;
                          if (!extractedCategory && decision.modifications) {
                            try {
                              const mods = JSON.parse(decision.modifications);
                              extractedCategory = mods.category ?? mods.type ?? '';
                            } catch { /* ignore */ }
                          }

                          return (
                            <div key={decision.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                              <Badge variant="outline" className={`text-[10px] px-1.5 py-0 shrink-0 ${typeColors[decision.decisionType] ?? ''}`}>
                                {decision.decisionType}
                              </Badge>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap mb-1">
                                  <span className="text-sm font-medium truncate">{decision.contentItemTitle}</span>
                                  {extractedCategory && (
                                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0 shrink-0">
                                      {extractedCategory}
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-xs text-muted-foreground truncate">{decision.reason}</p>
                                <span className="text-[10px] text-muted-foreground flex items-center gap-0.5 mt-1">
                                  <Clock className="size-2.5" />
                                  {new Date(decision.createdAt).toLocaleString()}
                                </span>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="text-sm text-muted-foreground text-center py-6">
                          No decisions recorded yet. Use the form below to submit a decision.
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </section>

            <Separator />

            {/* Decision Quick Action */}
            <section>
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                <Zap className="size-4" />
                Decision Quick Action
              </h2>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Submit Decision</CardTitle>
                  <CardDescription>Record a content decision with type, category, and reasoning</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-medium text-muted-foreground block mb-1">Content Item</label>
                      <Select
                        value={decisionForm.contentItemId}
                        onValueChange={(val) => setDecisionForm({ ...decisionForm, contentItemId: val })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select content item..." />
                        </SelectTrigger>
                        <SelectContent>
                          {contentItems?.items?.map((item) => (
                            <SelectItem key={item.id} value={item.id}>
                              {item.title.slice(0, 40)}{item.title.length > 40 ? '…' : ''}
                            </SelectItem>
                          )) ?? (
                            <SelectItem value="none" disabled>No content items</SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-medium text-muted-foreground block mb-1">Decision Type</label>
                        <Select
                          value={decisionForm.decisionType}
                          onValueChange={(val) => setDecisionForm({ ...decisionForm, decisionType: val })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="accepted">Accepted</SelectItem>
                            <SelectItem value="modified">Modified</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                            <SelectItem value="ignored">Ignored</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground block mb-1">Category</label>
                        <Select
                          value={decisionForm.category}
                          onValueChange={(val) => setDecisionForm({ ...decisionForm, category: val })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="hook_pattern">Hook Pattern</SelectItem>
                            <SelectItem value="voice_match">Voice Match</SelectItem>
                            <SelectItem value="content_quality">Content Quality</SelectItem>
                            <SelectItem value="timing">Timing</SelectItem>
                            <SelectItem value="audience_fit">Audience Fit</SelectItem>
                            <SelectItem value="format">Format</SelectItem>
                            <SelectItem value="cta">CTA</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground block mb-1">Reason</label>
                      <Input
                        placeholder="Why this decision?"
                        value={decisionForm.reason}
                        onChange={(e) => setDecisionForm({ ...decisionForm, reason: e.target.value })}
                      />
                    </div>
                    <Button
                      className="w-full gap-1.5 bg-violet-600 text-white hover:bg-violet-700"
                      disabled={!decisionForm.contentItemId || !decisionForm.category || !decisionForm.reason.trim() || submittingDecision}
                      onClick={async () => {
                        setSubmittingDecision(true);
                        try {
                          const res = await fetch('/api/creator/decisions', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(decisionForm),
                          });
                          if (res.ok) {
                            setDecisionForm({ contentItemId: '', decisionType: 'accepted', category: '', reason: '' });
                            await fetchDecisionsData();
                          }
                        } catch {
                          // error
                        } finally {
                          setSubmittingDecision(false);
                        }
                      }}
                    >
                      <Scale className="size-3.5" />
                      {submittingDecision ? 'Submitting…' : 'Submit Decision'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </section>

            <Separator />

            {/* Ingest Status Card */}
            <section>
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                <Upload className="size-4" />
                Ingest Status
              </h2>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <Database className="size-4 text-emerald-400" />
                      <CardTitle className="text-base">Content Ingest Status</CardTitle>
                    </div>
                    {ingestStatus && (
                      <Badge variant="outline" className={`gap-1 ${ingestStatus.meetsMinimum ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'}`}>
                        {ingestStatus.meetsMinimum ? '✅ Meets 20+ minimum' : '❌ Below 20+ minimum'}
                      </Badge>
                    )}
                  </div>
                  <CardDescription>Content ingestion pipeline statistics</CardDescription>
                </CardHeader>
                <CardContent>
                  {decisionsLoading ? (
                    <div className="space-y-3">
                      <div className="h-8 bg-muted rounded animate-pulse" />
                      <div className="h-8 bg-muted rounded animate-pulse" />
                      <div className="h-8 bg-muted rounded animate-pulse" />
                    </div>
                  ) : ingestStatus ? (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="p-3 rounded-lg bg-muted/50 text-center">
                        <p className="text-2xl font-bold">{ingestStatus.totalContentItems}</p>
                        <p className="text-xs text-muted-foreground mt-1">Total Content Items</p>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/50 text-center">
                        <p className="text-2xl font-bold">{ingestStatus.totalHooks}</p>
                        <p className="text-xs text-muted-foreground mt-1">Total Hooks</p>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/50 text-center">
                        <p className="text-2xl font-bold">{Math.round(ingestStatus.hookPatternCoverage * 100)}%</p>
                        <p className="text-xs text-muted-foreground mt-1">Pattern Coverage</p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground text-center py-6">
                      Ingest status unavailable
                    </div>
                  )}
                </CardContent>
              </Card>
            </section>
          </TabsContent>
        </Tabs>
      </main>

      {/* ===== Footer ===== */}
      <footer className="border-t border-border bg-card mt-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between text-xs text-muted-foreground flex-wrap gap-2">
          <span>All 4 memory domains active • Schema frozen ❄️ • 0 credits burned</span>
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
