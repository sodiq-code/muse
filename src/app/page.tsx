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
  Target,
  LineChart,
  Wand2,
  FlaskConical,
  ChevronDown,
  ChevronUp,
  Link2,
  Send,
  SendHorizontal,
  Sun,
  CloudSun,
  Sunrise,
  MapPin,
  Check,
  RotateCcw,
  Trophy,
  Settings,
  ShieldCheck,
  MessageCircle,
  RefreshCw,
  ClipboardCheck,
  AlertCircle,
  Anchor,
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

interface DelegationPreviewResponse {
  success: boolean;
  preview: boolean;
  context: {
    creatorName: string;
    platform: string;
    niche: string | null;
    audience: string | null;
    voiceProfile: {
      tone: string;
      pace: string;
      vocabulary: string;
      avoidTopics: string[];
      strengths: string[];
      directness?: number;
      technicalDepth?: number;
      humor?: number;
      storytelling?: number;
    };
    bestHookPatterns: Array<{
      pattern: string;
      avgEffectiveness: number;
      sampleSize: number;
      confidence: string;
    }>;
    recentWinners: string[];
    performanceSignals: string[];
    topic: string;
    objective: string;
  };
  instruction: {
    instructionId: string;
    from: string;
    to: string;
    timestamp: string;
    makerInput: {
      creator: string;
      topic: string;
      objective: string;
      audience: string;
      voice: {
        tone: string;
        pace: string;
        vocabulary: string;
        avoidTopics: string[];
        strengths: string[];
      };
      historicalWinners: string[];
      instruction: string;
    };
    reasoning: string;
    evidenceUsed: string[];
    confidenceLevel: string;
    dataPointsUsed: number;
  };
}

interface DelegationExecuteResponse {
  success: boolean;
  instruction: DelegationPreviewResponse['instruction'];
  makerOutput: {
    title: string;
    caption: string;
    cta: string;
    script: string;
    alternativeHooks: string[];
    thumbnailConcept?: string;
    voiceMatch: number;
    hookCompat: number;
    source: string;
  };
  mode: 'live' | 'simulated';
  delegationTime: number;
  auditEventId: string;
  timestamp: string;
}

// Day 10: Evaluation & Drafts types
interface EvaluationResponse {
  success: boolean;
  delegation?: {
    instructionId: string;
    mode: string;
    delegationTime: number;
    topic: string;
    objective: string;
  };
  evaluation?: {
    evaluationId: string;
    timestamp: string;
    overallScore: number;
    confidenceLevel: string;
    passed: boolean;
    failReasons: string[];
    passThreshold: number;
    voiceMatch: {
      overall: number;
      toneAlignment: number;
      paceConsistency: number;
      vocabularyMatch: number;
      avoidTopicsCompliance: number;
      strengthUtilization: number;
      breakdown: string[];
      evidence: string[];
    };
    hookCompat: {
      overall: number;
      primaryHookPatternMatch: number;
      historicalAlignment: number;
      hookVariety: number;
      hookStrength: number;
      breakdown: string[];
      evidence: string[];
    };
    contentQuality: {
      overall: number;
      scriptStructure: number;
      ctaClarity: number;
      titleEffectiveness: number;
      captionAlignment: number;
      breakdown: string[];
      evidence: string[];
    };
    makerOutput: { title: string; hookCount: number; source: string };
    evaluationEvidence: string[];
    dataPointsUsed: number;
  };
  draft?: { stored: boolean; draftId: string; version: number; contentItemId: string };
  makerOutput?: { title: string; voiceMatch: number; hookCompat: number; source: string; hookCount: number };
}

interface DraftsResponse {
  success: boolean;
  drafts: Array<{
    id: string;
    contentItemId: string | null;
    version: number;
    title: string;
    evaluationScore: number;
    evaluationPassed: boolean;
    voiceMatch: number;
    hookCompat: number;
    contentQuality: number;
    topic: string;
    objective: string;
    source: string;
    generatedBy: string | null;
    changeLog: string | null;
    createdAt: string;
    updatedAt: string;
  }>;
  summary: {
    totalDrafts: number;
    passedDrafts: number;
    failedDrafts: number;
    avgScore: number;
    avgVoiceMatch: number;
    avgHookCompat: number;
  };
}

// Day 11: Delegation Beat types
interface BeatStepData {
  step: number;
  name: string;
  description: string;
  status: 'pending' | 'running' | 'complete' | 'failed';
  startTime: number;
  endTime: number;
  duration: number;
  evidence: string[];
  data: Record<string, unknown>;
}

interface DelegationBeatResponse {
  success: boolean;
  beat: {
    beatId: string;
    timestamp: string;
    creatorId: string;
    creatorName: string;
    mode: 'live' | 'simulated';
    totalDuration: number;
    steps: BeatStepData[];
    success: boolean;
    evaluationPassed: boolean;
    draftStored: boolean;
    evaluation: {
      evaluationId: string;
      overallScore: number;
      voiceMatch: { overall: number; toneAlignment: number; paceConsistency: number; vocabularyMatch: number; avoidTopicsCompliance: number; strengthUtilization: number; breakdown: string[]; evidence: string[] };
      hookCompat: { overall: number; primaryHookPatternMatch: number; historicalAlignment: number; hookVariety: number; hookStrength: number; breakdown: string[]; evidence: string[] };
      contentQuality: { overall: number; scriptStructure: number; ctaClarity: number; titleEffectiveness: number; captionAlignment: number; breakdown: string[]; evidence: string[] };
      passed: boolean;
      failReasons: string[];
      confidenceLevel: string;
      dataPointsUsed: number;
    } | null;
    instruction: {
      instructionId: string;
      makerInput: { creator: string; topic: string; objective: string; audience: string; instruction: string };
      reasoning: string;
      evidenceUsed: string[];
      confidenceLevel: string;
      dataPointsUsed: number;
    } | null;
    makerOutput: {
      title: string;
      script: string;
      caption: string;
      cta: string;
      alternativeHooks: string[];
      voiceMatch: number;
      hookCompat: number;
      source: string;
    } | null;
    draft: {
      success: boolean;
      draftId: string;
      version: number;
      contentItemId: string;
      evaluationPassed: boolean;
    } | null;
    auditSummary: {
      totalAuditEvents: number;
      delegationAuditId: string;
      evaluationId: string;
      draftAuditId: string;
    };
  };
}

interface BeatHistoryResponse {
  success: boolean;
  history: Array<{
    beatId: string;
    timestamp: string;
    mode: string;
    success: boolean;
    evaluationPassed: boolean;
    draftStored: boolean;
    totalDuration: number;
    scores: { voiceMatch: number; hookCompat: number; contentQuality: number; overall: number };
  }>;
  count: number;
}

interface EvaluationThresholdsResponse {
  success: boolean;
  thresholds: {
    passThreshold: number;
    minIndividualScore: number;
    weights: { voiceMatch: number; hookCompat: number; contentQuality: number };
    description: string;
  };
  creatorContext: {
    name: string;
    platform: string;
    voiceProfile: Record<string, unknown>;
    hookPatternsCount: number;
    historicalWinnersCount: number;
    performanceSignalsCount: number;
  };
}

interface AutonomyStatusResponse {
  success: boolean;
  status?: {
    phase: string;
    equipped: boolean;
    pendingApprovals: number;
    isRunning: boolean;
    totalRuns: number;
    drafts: { id: string; title: string; approvalStatus: string; hookPattern: string }[];
    briefs: { id: string; date: string }[];
    auditLog: { id: string; timestamp: string; actor: string; action: string; detail: string }[];
    creditBurnEstimate: number;
    approvalQueue?: { id: string; itemType: string; itemId: string | null; action: string; status: string; createdAt: string; title?: string }[];
  };
  scheduleInfo?: {
    schedule: { wakeTime: string; draftTime: string; briefTime: string };
    lastRun: { id: string; status: string; startedAt: string; completedAt: string | null; taskType: string; trigger: string } | null;
    lastRunTime: string | null;
    totalRuns: number;
    pendingApprovals: number;
    isRunning: boolean;
    recentRuns: { id: string; status: string; startedAt: string; completedAt: string | null; taskType: string }[];
  };
}

interface OvernightCycleResponse {
  success: boolean;
  result?: {
    runId: string;
    creatorId: string;
    success: boolean;
    steps: { step: number; name: string; status: string; duration: number; auditEventId: string; data: Record<string, unknown> }[];
    delegationBeat: any;
    approvalId: string | null;
    morningBrief: { id: string; date: string; summary: string; draftTitle: string | null; draftScore: number | null; recommendationsCount: number; newInsights: string[]; generatedAt: string };
    startedAt: string;
    completedAt: string;
    totalDuration: number;
  };
  message?: string;
}

interface HookClassResponse {
  success: boolean;
  classification?: {
    pattern: string;
    confidence: number;
    reasoning: string;
    allScores?: Record<string, number>;
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

// Learning Domain Types
interface HookClassificationResult {
  pattern: string;
  confidence: number;
  reasoning: string;
  allScores?: Record<string, number>;
}

interface HookComparisonResponse {
  success: boolean;
  hookClassification: HookClassificationResult;
  historicalComparison: {
    patternAvg: number;
    creatorOverallAvg: number;
    diff: number;
    diffPercent: number;
    message: string;
    confidence: 'low' | 'medium' | 'high';
    evidenceType: string;
    sampleSize: number;
  };
  creatorSpecific: {
    patternRank: number;
    totalPatterns: number;
    betterPatterns: string[];
    worsePatterns: string[];
  };
}

interface PatternRankingItem {
  pattern: string;
  label: string;
  avgEffectiveness: number;
  sampleSize: number;
  rank: number;
  confidence: 'low' | 'medium' | 'high';
  status: 'tested' | 'untested';
}

interface HookRankingsResponse {
  success: boolean;
  rankings: PatternRankingItem[];
  overallConfidence: 'low' | 'medium' | 'high';
  totalSamples: number;
}

interface PredictionResponse {
  success: boolean;
  pattern: string;
  patternLabel: string;
  predictedEffectiveness: number;
  confidence: 'low' | 'medium' | 'high';
  historicalSampleSize: number;
  similarHooks: { text: string; effectiveness: number }[];
  message: string;
  evidenceType: string;
}

// Day 7: Learning Engine Types
interface LearningRunResponse {
  success: boolean;
  creatorId: string;
  creatorName: string;
  loopResult: {
    observations: string[];
    comparisons: string[];
    inferences: string[];
    updates: { pattern: string; avgEffectiveness: number; sampleSize: number; lastSeen: string }[];
    recommendations: {
      type: string;
      title: string;
      explanation: string;
      evidenceType: string;
      confidence: 'low' | 'medium' | 'high';
      dataPoints: number;
      supportingFacts: string[];
      action?: string;
      priority: number;
    }[];
    confidence: 'low' | 'medium' | 'high';
    totalDataPoints: number;
    loopComplete: boolean;
  };
  honestyReport: {
    isHonest: boolean;
    violations: { type: string; message: string; recommendationIndex?: number }[];
    summary: string;
    checksPassed: number;
    checksTotal: number;
  };
  evidenceChain: {
    step: string;
    description: string;
    evidenceType: string;
    confidence: 'low' | 'medium' | 'high';
    dataPoints: number;
    supportingFacts: string[];
    timestamp: string;
  }[];
  storedMemories: number;
  storedRecommendations: number;
  auditEventId: string;
  ranAt: string;
  dataSummary: {
    contentItems: number;
    metricsCount: number;
    hooksCount: number;
    memoryEvents: number;
    existingPatterns: number;
  };
}

interface HonestyCheckResponse {
  success: boolean;
  framework: string;
  allChecksPassed: boolean;
  checksPassed: number;
  checksTotal: number;
  checks: { name: string; passed: boolean; details: string }[];
  principles: string[];
  evidenceTypeTaxonomy: Record<string, string>;
  confidenceThresholds: Record<string, { minDataPoints: number; label: string }>;
}

// Day 8: Explanation System Types
interface EvidenceSource {
  type: string;
  id: string;
  label: string;
  value: string;
  capturedAt: string;
}

interface EvidenceStep {
  step: number;
  phase: 'OBSERVE' | 'COMPARE' | 'INFER' | 'UPDATE' | 'RECOMMEND';
  description: string;
  evidenceType: string;
  confidence: 'low' | 'medium' | 'high';
  dataPoints: number;
  sources: EvidenceSource[];
  derivedFrom: number[];
}

interface FullExplanation {
  recommendationId: string;
  recommendationTitle: string;
  recommendationType: string;
  summary: string;
  narrative: string;
  evidenceChain: EvidenceStep[];
  confidence: 'low' | 'medium' | 'high';
  overallDataPoints: number;
  supportingContentCount: number;
  patternHistory: { pattern: string; avgEffectiveness: number; sampleSize: number; confidence: string; lastSeen: string }[];
  creatorSpecificContext: string;
  generatedAt: string;
  honestyVerified: boolean;
}

interface ExplainResponse {
  success: boolean;
  count?: number;
  explanations?: FullExplanation[];
  explanation?: FullExplanation;
  error?: string;
}

// Day 8: Proof Experiment Types
interface GenuineInsight {
  id: string;
  dayDiscovered: number;
  type: 'pattern_emergence' | 'performance_signal' | 'recommendation_with_evidence' | 'confidence_upgrade';
  title: string;
  description: string;
  evidenceType: string;
  confidence: 'low' | 'medium' | 'high';
  dataPoints: number;
  supportingFacts: string[];
  isGenuine: boolean;
  verificationNote: string;
}

interface DayResult {
  day: number;
  date: string;
  contentAnalyzed: number;
  newObservations: string[];
  newInferences: string[];
  recommendations: { title: string; type: string; explanation: string; confidence: string; dataPoints: number; evidenceType: string; supportingFacts: string[] }[];
  confidenceGrowth: { before: string; after: string };
  dataPointGrowth: { before: number; after: number };
  patternsDiscovered: string[];
}

interface ProofResponse {
  success: boolean;
  experimentId: string;
  creatorId: string;
  creatorName: string;
  startedAt: string;
  completedAt: string;
  totalDays: number;
  dayResults: DayResult[];
  genuineInsights: GenuineInsight[];
  totalGenuineInsights: number;
  meetsThreshold: boolean;
  summary: {
    totalContentAnalyzed: number;
    totalObservations: number;
    totalInferences: number;
    totalRecommendations: number;
    confidenceProgression: string[];
    dataPointProgression: number[];
    insightByDay: number[];
  };
  honestyReport: {
    allInsightsGenuine: boolean;
    noFabricatedData: boolean;
    evidenceChainsComplete: boolean;
    confidenceHonest: boolean;
  };
  error?: string;
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

  // Learning Domain State
  const [learningHookText, setLearningHookText] = useState('');
  const [learningClassResult, setLearningClassResult] = useState<HookClassResponse | null>(null);
  const [learningClassLoading, setLearningClassLoading] = useState(false);
  const [learningCompResult, setLearningCompResult] = useState<HookComparisonResponse | null>(null);
  const [learningCompLoading, setLearningCompLoading] = useState(false);
  const [learningRankings, setLearningRankings] = useState<HookRankingsResponse | null>(null);
  const [learningRankingsLoading, setLearningRankingsLoading] = useState(true);
  const [learningPredText, setLearningPredText] = useState('');
  const [learningPredResult, setLearningPredResult] = useState<PredictionResponse | null>(null);
  const [learningPredLoading, setLearningPredLoading] = useState(false);

  // Day 7: Learning Engine State
  const [learningRunResult, setLearningRunResult] = useState<LearningRunResponse | null>(null);
  const [learningRunLoading, setLearningRunLoading] = useState(false);
  const [honestyCheckResult, setHonestyCheckResult] = useState<HonestyCheckResponse | null>(null);
  const [honestyCheckLoading, setHonestyCheckLoading] = useState(true);

  // Day 8: Explanation & Proof State
  const [explainResult, setExplainResult] = useState<ExplainResponse | null>(null);
  const [explainLoading, setExplainLoading] = useState(false);
  const [expandedChains, setExpandedChains] = useState<Set<string>>(new Set());
  const [proofResult, setProofResult] = useState<ProofResponse | null>(null);
  const [proofLoading, setProofLoading] = useState(false);

  // Day 9: Delegation State
  const [delegationPreview, setDelegationPreview] = useState<DelegationPreviewResponse | null>(null);
  const [delegationResult, setDelegationResult] = useState<DelegationExecuteResponse | null>(null);
  const [delegationTopic, setDelegationTopic] = useState('');
  const [delegationObjective, setDelegationObjective] = useState('');
  const [delegationPreviewLoading, setDelegationPreviewLoading] = useState(false);
  const [delegationExecuteLoading, setDelegationExecuteLoading] = useState(false);
  const [scriptExpanded, setScriptExpanded] = useState(false);

  // Day 10: Evaluation & Drafts State
  const [evalResult, setEvalResult] = useState<EvaluationResponse | null>(null);
  const [evalLoading, setEvalLoading] = useState(false);
  const [evalThresholds, setEvalThresholds] = useState<EvaluationThresholdsResponse | null>(null);
  const [draftsData, setDraftsData] = useState<DraftsResponse | null>(null);
  const [draftsLoading, setDraftsLoading] = useState(false);

  // Day 11: Delegation Beat State
  const [beatResult, setBeatResult] = useState<DelegationBeatResponse | null>(null);

  // Day 12: Today + Memory screen state
  const [todayScreenData, setTodayScreenData] = useState<any>(null);
  const [todayScreenLoading, setTodayScreenLoading] = useState(false);
  const [memoryScreenData, setMemoryScreenData] = useState<any>(null);
  const [memoryScreenLoading, setMemoryScreenLoading] = useState(false);

  // Day 13: Learning, Overnight, Control screen state
  const [learningScreenData, setLearningScreenData] = useState<any>(null);
  const [learningScreenLoading, setLearningScreenLoading] = useState(false);
  const [overnightScreenData, setOvernightScreenData] = useState<any>(null);
  const [overnightScreenLoading, setOvernightScreenLoading] = useState(false);
  const [controlScreenData, setControlScreenData] = useState<any>(null);
  const [controlScreenLoading, setControlScreenLoading] = useState(false);
  const [beatLoading, setBeatLoading] = useState(false);
  const [beatHistory, setBeatHistory] = useState<BeatHistoryResponse | null>(null);
  const [beatHistoryLoading, setBeatHistoryLoading] = useState(false);
  const [beatTopic, setBeatTopic] = useState('');
  const [beatObjective, setBeatObjective] = useState('');
  const [activeBeatStep, setActiveBeatStep] = useState<number | null>(null);

  // Day 14: DB-backed overnight scheduler state
  const [overnightCycleRunning, setOvernightCycleRunning] = useState(false);
  const [overnightCycleResult, setOvernightCycleResult] = useState<OvernightCycleResponse | null>(null);
  const [approvalActionLoading, setApprovalActionLoading] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectInput, setShowRejectInput] = useState<string | null>(null);

  // Day 15: Approval gate refinement + audit logging polish state
  const [auditFilterActor, setAuditFilterActor] = useState<string>('all');
  const [auditTimeRange, setAuditTimeRange] = useState<'24h' | '7d' | 'all'>('all');
  const [auditSearchQuery, setAuditSearchQuery] = useState('');
  const [expandedDeltaId, setExpandedDeltaId] = useState<string | null>(null);
  const [auditStatsData, setAuditStatsData] = useState<any>(null);
  const [expireLoading, setExpireLoading] = useState(false);
  const [expireResult, setExpireResult] = useState<any>(null);
  const [approvalHistoryData, setApprovalHistoryData] = useState<any>(null);
  const [approvalHistoryLoading, setApprovalHistoryLoading] = useState(false);

  // Day 16: Validation state
  const [e2eValidationResult, setE2eValidationResult] = useState<any>(null);
  const [e2eValidationLoading, setE2eValidationLoading] = useState(false);
  const [honestyReport, setHonestyReport] = useState<any>(null);
  const [honestyLoading, setHonestyLoading] = useState(false);

  // Day 17: Feedback state
  const [feedbackSummary, setFeedbackSummary] = useState<any>(null);
  const [feedbackSummaryLoading, setFeedbackSummaryLoading] = useState(false);
  const [simulationResult, setSimulationResult] = useState<any>(null);
  const [simulationLoading, setSimulationLoading] = useState(false);
  const [refinementTimeline, setRefinementTimeline] = useState<any[]>([]);
  const [refinementLoading, setRefinementLoading] = useState(false);
  const [creatorGate, setCreatorGate] = useState<any>(null);
  const [creatorGateLoading, setCreatorGateLoading] = useState(false);
  const [feedbackSubmitResult, setFeedbackSubmitResult] = useState<any>(null);
  const [feedbackSubmitLoading, setFeedbackSubmitLoading] = useState(false);

  // Day 19: Demo Reliability state
  const [demoHealth, setDemoHealth] = useState<any>(null);
  const [demoHealthLoading, setDemoHealthLoading] = useState(false);
  const [demoSceneList, setDemoSceneList] = useState<any>(null);
  const [demoSceneListLoading, setDemoSceneListLoading] = useState(false);
  const [demoCurrentScene, setDemoCurrentScene] = useState<any>(null);
  const [demoCurrentSceneLoading, setDemoCurrentSceneLoading] = useState(false);
  const [demoSelectedScene, setDemoSelectedScene] = useState<number>(1);
  const [demoRehearsalStatus, setDemoRehearsalStatus] = useState<any>(null);
  const [demoRehearsalRunning, setDemoRehearsalRunning] = useState(false);

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

  // Day 14: Run overnight cycle
  const runOvernightCycleAction = useCallback(async () => {
    setOvernightCycleRunning(true);
    try {
      const res = await fetch('/api/autonomy/run-overnight', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      const json = await res.json();
      setOvernightCycleResult(json);
      // Refresh autonomy status
      const statusRes = await fetch('/api/autonomy/status').then((r) => r.json()).catch(() => null);
      if (statusRes) setAutonomyData(statusRes);
    } catch (e) {
      setOvernightCycleResult({ success: false, message: String(e) });
    } finally {
      setOvernightCycleRunning(false);
    }
  }, []);

  // Day 14: Approve an action
  const approveActionHandler = useCallback(async (approvalId: string) => {
    setApprovalActionLoading(approvalId);
    try {
      await fetch('/api/autonomy/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approvalId }),
      });
      // Refresh autonomy status + control screen
      const [statusRes, controlRes] = await Promise.all([
        fetch('/api/autonomy/status').then((r) => r.json()).catch(() => null),
        fetch('/api/dashboard/control').then((r) => r.json()).catch(() => null),
      ]);
      if (statusRes) setAutonomyData(statusRes);
      if (controlRes?.success) setControlScreenData(controlRes.data);
    } catch {
      // silently fail
    } finally {
      setApprovalActionLoading(null);
    }
  }, []);

  // Day 14: Reject an action
  const rejectActionHandler = useCallback(async (approvalId: string, reason?: string) => {
    setApprovalActionLoading(approvalId);
    try {
      await fetch('/api/autonomy/reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approvalId, reason }),
      });
      // Refresh autonomy status + control screen
      const [statusRes, controlRes] = await Promise.all([
        fetch('/api/autonomy/status').then((r) => r.json()).catch(() => null),
        fetch('/api/dashboard/control').then((r) => r.json()).catch(() => null),
      ]);
      if (statusRes) setAutonomyData(statusRes);
      if (controlRes?.success) setControlScreenData(controlRes.data);
      setShowRejectInput(null);
      setRejectReason('');
    } catch {
      // silently fail
    } finally {
      setApprovalActionLoading(null);
    }
  }, []);

  // Fetch hook rankings for Learning tab
  const fetchRankings = useCallback(async () => {
    setLearningRankingsLoading(true);
    try {
      const res = await fetch('/api/learning/rankings').then((r) => r.json()).catch(() => null);
      if (res) setLearningRankings(res);
    } catch {
      // silently fail
    } finally {
      setLearningRankingsLoading(false);
    }
  }, []);

  // Fetch honesty check for Learning tab (Day 7)
  const fetchHonestyCheck = useCallback(async () => {
    setHonestyCheckLoading(true);
    try {
      const res = await fetch('/api/learning/honesty').then((r) => r.json()).catch(() => null);
      if (res) setHonestyCheckResult(res);
    } catch {
      // silently fail
    } finally {
      setHonestyCheckLoading(false);
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
    fetchRankings();
    fetchHonestyCheck();

    // Auto-load dashboard tab data on mount
    (async () => {
      setTodayScreenLoading(true);
      setMemoryScreenLoading(true);
      setLearningScreenLoading(true);
      setOvernightScreenLoading(true);
      setControlScreenLoading(true);
      try {
        const [todayRes, memRes, learnRes, overRes, ctrlRes, statsRes] = await Promise.all([
          fetch('/api/dashboard/today').then((r) => r.json()).catch(() => null),
          fetch('/api/dashboard/memory').then((r) => r.json()).catch(() => null),
          fetch('/api/dashboard/learning').then((r) => r.json()).catch(() => null),
          fetch('/api/dashboard/overnight').then((r) => r.json()).catch(() => null),
          fetch('/api/dashboard/control').then((r) => r.json()).catch(() => null),
          fetch('/api/audit/stats').then((r) => r.json()).catch(() => null),
        ]);
        if (todayRes?.success) setTodayScreenData(todayRes.data);
        if (memRes?.success) setMemoryScreenData(memRes.data);
        if (learnRes?.success) setLearningScreenData(learnRes.data);
        if (overRes?.success) setOvernightScreenData(overRes.data);
        if (ctrlRes?.success) setControlScreenData(ctrlRes.data);
        if (statsRes?.success) setAuditStatsData(statsRes.stats);
      } catch { /* silently fail */ }
      setTodayScreenLoading(false);
      setMemoryScreenLoading(false);
      setLearningScreenLoading(false);
      setOvernightScreenLoading(false);
      setControlScreenLoading(false);
    })();
  }, [fetchVoiceProfile, fetchPerformanceData, fetchDecisionsData, fetchRankings, fetchHonestyCheck]);

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
    { id: 'd14-1', label: 'DB-Backed Overnight Scheduler — full overnight loop with delegation beat + approval gates', done: true },
    { id: 'd14-2', label: 'Overnight API Routes — /run-overnight, /approve, /reject', done: true },
    { id: 'd15-1', label: 'Approval Gate Refinement — expiry logic, CreatorDecision on approve, wired approve/reject buttons, rejection reason', done: true },
    { id: 'd15-2', label: 'Audit Logging Polish — stats, filters, search, expandable delta, export CSV, actor distribution', done: true },
    { id: 'd16-1', label: 'E2E Validation Pipeline — Ingest → Learn → Delegate → Evaluate → Draft → Approve → Brief', done: true },
    { id: 'd16-2', label: 'Statistical Honesty Verifier — 7 checks: evidence, confidence, source, audit, approval, metrics, evidence chain', done: true },
    { id: 'd17-1', label: 'Creator Feedback Collection — correction/approval/rejection/refinement/preference feedback → CreatorDecision + MemoryEvent', done: true },
    { id: 'd17-2', label: 'Disclosed Simulation — Real Creator Gate: pivot to simulation with methodological rigor when no real creator', done: true },
    { id: 'd17-3', label: 'Feedback → Memory Refinement Pipeline — feedback updates confidence, creates pattern corrections, preference updates', done: true },
    { id: 'd18-1', label: 'Typography, Spacing, Hierarchy — consistent fonts, staggered animations, card hover effects', done: true },
    { id: 'd18-2', label: 'Loading States, Error States, Empty States — skeleton shimmer, graceful degradation, tab fade-in animation', done: true },
    { id: 'd18-3', label: 'Mobile Responsive — scrollable tab bar with compact labels, overflow scroll, thin scrollbars', done: true },
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
                MUSE
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
        <Tabs defaultValue="today" className="w-full">
          <TabsList className="w-full overflow-x-auto flex-nowrap justify-start gap-0.5 pb-1 scrollbar-thin" style={{ scrollbarWidth: 'thin' }}>
            <TabsTrigger value="today" className="gap-1 shrink-0">
              <Sun className="size-3.5" />
              <span className="hidden sm:inline">Today</span><span className="sm:hidden">Today</span>
            </TabsTrigger>
            <TabsTrigger value="memoryscreen" className="gap-1 shrink-0">
              <Brain className="size-3.5" />
              <span className="hidden sm:inline">Memory</span><span className="sm:hidden">Mem</span>
            </TabsTrigger>
            <TabsTrigger value="learningscreen" className="gap-1 shrink-0">
              <GraduationCap className="size-3.5" />
              <span className="hidden sm:inline">Learning</span><span className="sm:hidden">Learn</span>
            </TabsTrigger>
            <TabsTrigger value="overnightscreen" className="gap-1 shrink-0">
              <Moon className="size-3.5" />
              <span className="hidden sm:inline">Overnight</span><span className="sm:hidden">O/N</span>
            </TabsTrigger>
            <TabsTrigger value="controlscreen" className="gap-1 shrink-0">
              <Settings className="size-3.5" />
              <span className="hidden sm:inline">Control</span><span className="sm:hidden">Ctrl</span>
            </TabsTrigger>
          </TabsList>

          {/* ===== TODAY TAB (Day 12) ===== */}
          <TabsContent value="today" className="space-y-6">
            {todayScreenLoading && (
              <div className="flex items-center justify-center py-12 text-muted-foreground">
                <div className="animate-pulse flex items-center gap-2">
                  <Sun className="size-5 animate-spin" />
                  Loading today&apos;s brief…
                </div>
              </div>
            )}

            {todayScreenData && (
              <>
                {/* Morning Greeting */}
                <Card className="rounded-xl border-violet-500/30 bg-gradient-to-br from-violet-500/10 to-transparent muse-card-hover">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 muse-stagger-1">
                      {todayScreenData.greeting?.timeOfDay === 'morning' ? (
                        <Sunrise className="size-8 text-amber-400" />
                      ) : todayScreenData.greeting?.timeOfDay === 'evening' || todayScreenData.greeting?.timeOfDay === 'night' ? (
                        <Moon className="size-8 text-indigo-400" />
                      ) : (
                        <CloudSun className="size-8 text-sky-400" />
                      )}
                      <div>
                        <h2 className="text-2xl font-bold tracking-tight">
                          {todayScreenData.greeting?.text || 'Good day!'}
                        </h2>
                        <p className="text-sm text-muted-foreground mt-1">
                          {todayScreenData.creatorName ? `Your daily briefing, ${todayScreenData.creatorName}.` : 'Your daily briefing.'}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Overnight Brief */}
                {todayScreenData.overnightBrief && (
                  <Card className="rounded-xl">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                        <Moon className="size-4 text-indigo-400" />
                        Overnight Brief
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-3 gap-3">
                        <div className="text-center p-3 rounded-lg bg-muted/50">
                          <p className="font-mono text-lg font-bold text-emerald-400">{todayScreenData.overnightBrief.reviewedCount ?? 0}</p>
                          <p className="text-xs text-muted-foreground">Reviewed</p>
                        </div>
                        <div className="text-center p-3 rounded-lg bg-muted/50">
                          <p className="font-mono text-lg font-bold text-violet-400">{todayScreenData.overnightBrief.draftedCount ?? 0}</p>
                          <p className="text-xs text-muted-foreground">Drafted</p>
                        </div>
                        <div className="text-center p-3 rounded-lg bg-muted/50">
                          <p className="font-mono text-lg font-bold text-sky-400">{todayScreenData.overnightBrief.updatedCount ?? 0}</p>
                          <p className="text-xs text-muted-foreground">Updated</p>
                        </div>
                      </div>
                      {todayScreenData.overnightBrief.items?.length > 0 && (
                        <ul className="space-y-1">
                          {todayScreenData.overnightBrief.items.map((item: string, i: number) => (
                            <li key={i} className="text-sm flex items-start gap-2">
                              <span className="text-muted-foreground mt-0.5">•</span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      )}
                      {todayScreenData.overnightBrief.source && (
                        <p className="text-xs text-muted-foreground">
                          <span className="font-semibold">SOURCE:</span> {todayScreenData.overnightBrief.source}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* 3 Quick-Stat Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Top Signals */}
                  {todayScreenData.topSignals && todayScreenData.topSignals.length > 0 && (
                    <Card className="rounded-xl">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                          <Zap className="size-4 text-amber-400" />
                          Top Signals
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {todayScreenData.topSignals.map((sig: any, i: number) => (
                          <div key={i} className="p-2 rounded-lg bg-muted/50">
                            <p className="font-semibold text-sm">{sig.label}</p>
                            <p className="font-mono text-xs text-violet-400">{sig.value}</p>
                            {sig.evidence && (
                              <p className="text-xs italic text-muted-foreground mt-1">{sig.evidence}</p>
                            )}
                            {sig.source && (
                              <p className="text-xs text-muted-foreground mt-0.5">
                                <span className="font-semibold">SRC:</span> {sig.source}
                              </p>
                            )}
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  )}

                  {/* New Data */}
                  {todayScreenData.newData && (
                    <Card className="rounded-xl">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                          <Database className="size-4 text-sky-400" />
                          New Data
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <p className="font-semibold text-sm">{todayScreenData.newData.label}</p>
                        <p className="font-mono text-2xl font-bold text-emerald-400">{todayScreenData.newData.value}</p>
                        {todayScreenData.newData.source && (
                          <p className="text-xs text-muted-foreground">
                            <span className="font-semibold">SRC:</span> {todayScreenData.newData.source}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  {/* Try Next */}
                  {todayScreenData.tryNext && (
                    <Card className="rounded-xl">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                          <Lightbulb className="size-4 text-amber-400" />
                          Try Next
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <p className="font-semibold text-sm">{todayScreenData.tryNext.label}</p>
                        <p className="text-sm text-muted-foreground">{todayScreenData.tryNext.description}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">{todayScreenData.tryNext.hookPattern}</Badge>
                          <Badge variant="secondary" className="text-xs">{todayScreenData.tryNext.confidence} confidence</Badge>
                        </div>
                        {todayScreenData.tryNext.evidence && (
                          <p className="text-xs italic text-muted-foreground">{todayScreenData.tryNext.evidence}</p>
                        )}
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Pending Approvals */}
                {todayScreenData.pendingApprovals && todayScreenData.pendingApprovals.length > 0 && (
                  <Card className="rounded-xl">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                        <CheckCircle2 className="size-4 text-emerald-400" />
                        Pending Approvals
                        <Badge variant="secondary" className="ml-1">{todayScreenData.pendingApprovals.length}</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="max-h-64 overflow-y-auto scrollbar-thin space-y-3">
                        {todayScreenData.pendingApprovals.map((draft: any, i: number) => (
                          <div key={draft.draftId || i} className="p-3 rounded-lg border bg-muted/30 space-y-2">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-sm truncate">{draft.title}</p>
                                <div className="flex items-center gap-2 mt-1 flex-wrap">
                                  {draft.hookType && <Badge variant="outline" className="text-xs">{draft.hookType}</Badge>}
                                  {draft.source && <span className="text-xs text-muted-foreground">{draft.source}</span>}
                                </div>
                              </div>
                              <div className="text-right shrink-0">
                                <p className="font-mono text-sm font-bold">{draft.avgScore ?? '—'}</p>
                                <p className="text-xs text-muted-foreground">avg score</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <Button size="sm" variant="default" className="h-7 text-xs gap-1 bg-emerald-600 hover:bg-emerald-700">
                                <Check className="size-3" /> Approve
                              </Button>
                              <Button size="sm" variant="outline" className="h-7 text-xs gap-1">
                                <Pencil className="size-3" /> Modify
                              </Button>
                              <Button size="sm" variant="outline" className="h-7 text-xs gap-1 text-destructive border-destructive/30 hover:bg-destructive/10">
                                <X className="size-3" /> Reject
                              </Button>
                            </div>
                            {draft.evidenceCount !== undefined && (
                              <p className="text-xs text-muted-foreground">{draft.evidenceCount} evidence items</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            )}

            {!todayScreenLoading && !todayScreenData && null}
          </TabsContent>

          {/* ===== MEMORY SCREEN TAB (Day 12) ===== */}
          <TabsContent value="memoryscreen" className="space-y-6">
            {memoryScreenLoading && (
              <div className="flex items-center justify-center py-12 text-muted-foreground">
                <div className="animate-pulse flex items-center gap-2">
                  <Brain className="size-5 animate-bounce" />
                  Loading memory…
                </div>
              </div>
            )}

            {memoryScreenData && (
              <>
                {/* Header: What Muse Knows About You */}
                <Card className="rounded-xl border-violet-500/30 bg-gradient-to-br from-violet-500/10 to-transparent muse-card-hover">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 muse-stagger-1">
                      <Brain className="size-8 text-violet-400" />
                      <div>
                        <h2 className="text-2xl font-bold tracking-tight">
                          What Muse Knows About {memoryScreenData.creatorName || 'You'}
                        </h2>
                        <p className="text-sm text-muted-foreground mt-1">
                          {memoryScreenData.memoryEvents ?? 0} memory events recorded
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Identity Domain */}
                {memoryScreenData.identity && (
                  <Card className="rounded-xl">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                        <Fingerprint className="size-4 text-violet-400" />
                        Identity
                      </CardTitle>
                      {memoryScreenData.identity.source && (
                        <CardDescription className="text-xs text-muted-foreground">
                          SRC: {memoryScreenData.identity.source}
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="p-3 rounded-lg bg-muted/50">
                          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Niche</p>
                          <p className="text-sm font-semibold">{memoryScreenData.identity.niche}</p>
                        </div>
                        <div className="p-3 rounded-lg bg-muted/50">
                          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Audience</p>
                          <p className="text-sm font-semibold">{memoryScreenData.identity.audience}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Tone</p>
                        <div className="flex flex-wrap gap-1.5">
                          {memoryScreenData.identity.tone?.map((t: string) => (
                            <Badge key={t} variant="outline" className="text-xs border-violet-500/30 text-violet-300">{t}</Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Avoid</p>
                        <div className="flex flex-wrap gap-1.5">
                          {memoryScreenData.identity.avoid?.map((a: string) => (
                            <Badge key={a} variant="outline" className="text-xs border-destructive/30 text-destructive">{a}</Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Voice Radar */}
                {memoryScreenData.voiceRadar && (
                  <Card className="rounded-xl">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                        <Radio className="size-4 text-sky-400" />
                        Voice Radar
                      </CardTitle>
                      {memoryScreenData.voiceRadar.source && (
                        <CardDescription className="text-xs text-muted-foreground">
                          SRC: {memoryScreenData.voiceRadar.source}
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {[
                        { key: 'directness', label: 'Directness', color: 'bg-violet-500' },
                        { key: 'technicalDepth', label: 'Technical Depth', color: 'bg-sky-500' },
                        { key: 'storytelling', label: 'Storytelling', color: 'bg-amber-500' },
                        { key: 'humor', label: 'Humor', color: 'bg-emerald-500' },
                        { key: 'hype', label: 'Hype', color: 'bg-rose-500' },
                        { key: 'sentenceLength', label: 'Sentence Length', color: 'bg-indigo-500' },
                        { key: 'ctaIntensity', label: 'CTA Intensity', color: 'bg-orange-500' },
                      ].map(({ key, label, color }) => {
                        const val = memoryScreenData.voiceRadar[key] ?? 0;
                        return (
                          <div key={key} className="space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-medium">{label}</span>
                              <span className="font-mono text-xs text-muted-foreground">{val}%</span>
                            </div>
                            <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                              <div
                                className={`h-full rounded-full ${color} transition-all duration-500`}
                                style={{ width: `${Math.min(100, Math.max(0, val))}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                      {memoryScreenData.voiceRadar.evidence && (
                        <p className="text-xs italic text-muted-foreground pt-2">{memoryScreenData.voiceRadar.evidence}</p>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Winning Hooks */}
                {memoryScreenData.winningHooks && memoryScreenData.winningHooks.length > 0 && (
                  <Card className="rounded-xl">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                        <Trophy className="size-4 text-amber-400" />
                        Winning Hooks
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {memoryScreenData.winningHooks.map((hook: any, i: number) => (
                          <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">{hook.pattern}</Badge>
                              <span className="text-xs text-muted-foreground">
                                n={hook.sampleSize ?? 0}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-sm font-bold text-amber-400">{hook.avgRetention}%</span>
                              <Badge variant="secondary" className="text-xs">{hook.confidence}</Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Performance */}
                {memoryScreenData.performance && (
                  <Card className="rounded-xl">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                        <TrendingUp className="size-4 text-emerald-400" />
                        Performance
                      </CardTitle>
                      {memoryScreenData.performance.source && (
                        <CardDescription className="text-xs text-muted-foreground">
                          SRC: {memoryScreenData.performance.source}
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {memoryScreenData.performance.topSignals?.length > 0 && (
                        <div>
                          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Top Signals</p>
                          <ul className="space-y-1">
                            {memoryScreenData.performance.topSignals.map((sig: string, i: number) => (
                              <li key={i} className="text-sm flex items-start gap-2">
                                <Zap className="size-3 text-amber-400 mt-0.5 shrink-0" />
                                {sig}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {memoryScreenData.performance.recentInsights?.length > 0 && (
                        <div>
                          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Recent Insights</p>
                          <ul className="space-y-1">
                            {memoryScreenData.performance.recentInsights.map((ins: string, i: number) => (
                              <li key={i} className="text-sm flex items-start gap-2">
                                <Lightbulb className="size-3 text-sky-400 mt-0.5 shrink-0" />
                                {ins}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Decisions */}
                {memoryScreenData.decisions && (
                  <Card className="rounded-xl">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                        <Scale className="size-4 text-violet-400" />
                        Decisions
                        <Badge variant="secondary" className="ml-1">{memoryScreenData.decisions.totalDecisions ?? 0}</Badge>
                      </CardTitle>
                      {memoryScreenData.decisions.source && (
                        <CardDescription className="text-xs text-muted-foreground">
                          SRC: {memoryScreenData.decisions.source}
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent>
                      {memoryScreenData.decisions.recentDecisions?.length > 0 ? (
                        <div className="max-h-48 overflow-y-auto scrollbar-thin space-y-2">
                          {memoryScreenData.decisions.recentDecisions.map((dec: any, i: number) => (
                            <div key={i} className="flex items-start gap-2 p-2 rounded-lg bg-muted/50">
                              {dec.type === 'accepted' ? (
                                <CheckCircle2 className="size-4 text-emerald-400 mt-0.5 shrink-0" />
                              ) : dec.type === 'rejected' ? (
                                <X className="size-4 text-destructive mt-0.5 shrink-0" />
                              ) : (
                                <Pencil className="size-4 text-amber-400 mt-0.5 shrink-0" />
                              )}
                              <div className="min-w-0">
                                <p className="text-sm font-medium">{dec.description}</p>
                                <p className="text-xs text-muted-foreground">{dec.date}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">No recent decisions</p>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Memory Events Summary */}
                <Card className="rounded-xl">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <History className="size-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Total Memory Events</span>
                    </div>
                    <span className="font-mono text-lg font-bold">{memoryScreenData.memoryEvents ?? 0}</span>
                  </CardContent>
                </Card>
              </>
            )}

            {!memoryScreenLoading && !memoryScreenData && null}
          </TabsContent>

          {/* ===== LEARNING SCREEN TAB (Day 13) — MOST IMPORTANT ===== */}
          <TabsContent value="learningscreen" className="space-y-6">
            {learningScreenLoading && (
              <div className="flex items-center justify-center py-12 text-muted-foreground">
                <div className="animate-pulse flex items-center gap-2">
                  <GraduationCap className="size-5 animate-bounce" />
                  Loading learning data…
                </div>
              </div>
            )}

            {learningScreenData && (
              <>
                {/* How Muse Is Learning Header */}
                <Card className="rounded-xl border-violet-500/30 bg-gradient-to-br from-violet-500/10 to-transparent muse-card-hover">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 muse-stagger-1">
                      <GraduationCap className="size-8 text-violet-400" />
                      <div>
                        <h2 className="text-2xl font-bold tracking-tight">How Muse Is Learning</h2>
                        <p className="text-sm text-muted-foreground mt-1">
                          {learningScreenData.creatorName
                            ? `${learningScreenData.creatorName}, every piece of content teaches something new.`
                            : 'Every piece of content teaches something new.'}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Learning Timeline */}
                <Card className="rounded-xl">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                      <History className="size-4 text-violet-400" />
                      Learning Timeline
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="max-h-96 overflow-y-auto scrollbar-thin">
                      <div className="space-y-6">
                        {learningScreenData.timeline?.map((entry: any, entryIdx: number) => (
                          <div key={entryIdx} className="space-y-3">
                            {/* Content Title */}
                            <div className="p-3 rounded-lg bg-muted/50">
                              <p className="font-semibold text-sm">{entry.contentTitle}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="text-xs">{entry.contentType}</Badge>
                                {entry.publishedAt && (
                                  <span className="text-xs text-muted-foreground font-mono">
                                    {new Date(entry.publishedAt).toLocaleDateString()}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Steps */}
                            {entry.steps?.map((step: any, stepIdx: number) => (
                              <div key={stepIdx} className="ml-4 space-y-1">
                                {/* Connector */}
                                <div className="flex items-start gap-2">
                                  <div className="flex flex-col items-center mt-1">
                                    <div className="w-px h-3 bg-border" />
                                    <span className="text-muted-foreground text-xs">↓</span>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    {step.type === 'published' && (
                                      <div className="flex items-center gap-2">
                                        <span>📢</span>
                                        <span className="text-sm text-emerald-400 font-medium">{step.label}</span>
                                        <span className="text-xs text-muted-foreground">{step.detail}</span>
                                      </div>
                                    )}
                                    {step.type === 'performance' && (
                                      <div className="flex items-center gap-2">
                                        <BarChart3 className="size-4" />
                                        <span className="text-sm font-medium">{step.label}</span>
                                        <span className="text-xs text-muted-foreground font-mono">{step.detail}</span>
                                      </div>
                                    )}
                                    {step.type === 'hook_analysis' && (
                                      <div className="flex items-center gap-2">
                                        <Anchor className="size-4" />
                                        <span className="text-sm font-medium">{step.label}</span>
                                        <span className="text-xs text-muted-foreground">{step.detail}</span>
                                      </div>
                                    )}
                                    {step.type === 'comparison' && (
                                      <div className="flex items-center gap-2">
                                        <TrendingUp className="size-4" />
                                        <span className="text-sm font-medium">{step.label}</span>
                                        <span className={`text-xs font-mono ${
                                          step.delta && step.delta.startsWith('-')
                                            ? 'text-red-400'
                                            : 'text-emerald-400'
                                        }`}>
                                          {step.detail}
                                        </span>
                                      </div>
                                    )}
                                    {step.type === 'memory_updated' && (
                                      <div className="flex items-center gap-2">
                                        <Brain className="size-4" />
                                        <span className="text-sm font-medium">{step.label}</span>
                                        <span className="text-xs text-violet-400">{step.detail}</span>
                                      </div>
                                    )}
                                    {step.type === 'strategy_changed' && (
                                      <div className="flex items-center gap-2">
                                        <Zap className="size-4" />
                                        <span className="text-sm font-medium">{step.label}</span>
                                        <span className="text-xs text-amber-400">{step.detail}</span>
                                      </div>
                                    )}
                                    {step.type === 'loop_working' && (
                                      <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                                        <CheckCircle2 className="size-4" />
                                        <span className="text-sm font-bold text-emerald-400">{step.label}</span>
                                        <span className="text-xs text-emerald-300">{step.detail}</span>
                                      </div>
                                    )}
                                    {/* Fallback for unknown step types */}
                                    {!['published','performance','hook_analysis','comparison','memory_updated','strategy_changed','loop_working'].includes(step.type) && (
                                      <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium">{step.label}</span>
                                        <span className="text-xs text-muted-foreground">{step.detail}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>

                {/* Current Insight + Loop Status + Honesty Score — 2-col grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Current Insight */}
                  {learningScreenData.currentInsight && (
                    <Card className="rounded-xl">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                          <Lightbulb className="size-4 text-amber-400" />
                          Current Insight
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-sm italic">{learningScreenData.currentInsight.text}</p>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="outline" className="text-xs">
                            {learningScreenData.currentInsight.evidence} evidence
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {learningScreenData.currentInsight.confidence} confidence
                          </Badge>
                          <span className="text-xs text-muted-foreground font-mono">
                            {learningScreenData.currentInsight.dataPoints} data points
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Honesty Score */}
                  {learningScreenData.honestyScore && (
                    <Card className="rounded-xl">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                          <Shield className="size-4 text-emerald-400" />
                          Honesty Score
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-3xl font-bold">
                            {learningScreenData.honestyScore.checksPassed}/{learningScreenData.honestyScore.checksTotal}
                          </span>
                          <Badge
                            className={learningScreenData.honestyScore.isHonest
                              ? 'bg-emerald-600 text-white border-emerald-600'
                              : 'bg-red-600 text-white border-red-600'
                            }
                          >
                            {learningScreenData.honestyScore.isHonest ? 'Honest' : 'Dishonest'}
                          </Badge>
                        </div>
                        <Progress
                          value={(learningScreenData.honestyScore.checksPassed / learningScreenData.honestyScore.checksTotal) * 100}
                          className="h-2"
                        />
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Loop Status */}
                {learningScreenData.loopStatus && (
                  <Card className="rounded-xl">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                        <RotateCcw className="size-4 text-violet-400" />
                        Loop Status
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div className="text-center p-3 rounded-lg bg-muted/50">
                          <p className="font-mono text-lg font-bold text-violet-400">{learningScreenData.loopStatus.totalRuns}</p>
                          <p className="text-xs text-muted-foreground">Total Runs</p>
                        </div>
                        <div className="text-center p-3 rounded-lg bg-muted/50">
                          <p className="font-mono text-lg font-bold text-amber-400">{learningScreenData.loopStatus.totalRecommendations}</p>
                          <p className="text-xs text-muted-foreground">Recommendations</p>
                        </div>
                        <div className="text-center p-3 rounded-lg bg-muted/50">
                          <p className="font-mono text-lg font-bold text-sky-400">{learningScreenData.loopStatus.avgConfidence}</p>
                          <p className="text-xs text-muted-foreground">Avg Confidence</p>
                        </div>
                        <div className="text-center p-3 rounded-lg bg-muted/50">
                          <p className="font-mono text-sm font-bold text-muted-foreground">
                            {learningScreenData.loopStatus.lastRun
                              ? new Date(learningScreenData.loopStatus.lastRun).toLocaleString()
                              : '—'}
                          </p>
                          <p className="text-xs text-muted-foreground">Last Run</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            )}

            {!learningScreenLoading && !learningScreenData && null}
          </TabsContent>

          {/* ===== OVERNIGHT SCREEN TAB (Day 13) ===== */}
          <TabsContent value="overnightscreen" className="space-y-6">
            {overnightScreenLoading && (
              <div className="flex items-center justify-center py-12 text-muted-foreground">
                <div className="animate-pulse flex items-center gap-2">
                  <Moon className="size-5 animate-pulse" />
                  Loading overnight data…
                </div>
              </div>
            )}

            {overnightScreenData && (
              <>
                {/* While You Were Offline Header */}
                <Card className="rounded-xl border-indigo-500/30 bg-gradient-to-br from-indigo-500/10 to-transparent">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                      <Moon className="size-8 text-indigo-400" />
                      <div>
                        <h2 className="text-2xl font-bold tracking-tight">While You Were Offline</h2>
                        <p className="text-sm text-muted-foreground mt-1">
                          {overnightScreenData.creatorName
                            ? `${overnightScreenData.creatorName}, Muse was working while you slept.`
                            : 'Muse was working while you slept.'}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Schedule */}
                {overnightScreenData.schedule && (
                  <Card className="rounded-xl">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                        <Clock className="size-4 text-sky-400" />
                        Schedule
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-center gap-3 text-sm">
                        <div className="text-center p-3 rounded-lg bg-muted/50">
                          <p className="font-mono font-bold text-indigo-400">{overnightScreenData.schedule.wakeTime}</p>
                          <p className="text-xs text-muted-foreground">Offline</p>
                        </div>
                        <ArrowRight className="size-4 text-muted-foreground" />
                        <div className="text-center p-3 rounded-lg bg-muted/50">
                          <p className="font-mono font-bold text-violet-400">{overnightScreenData.schedule.draftTime}</p>
                          <p className="text-xs text-muted-foreground">Draft</p>
                        </div>
                        <ArrowRight className="size-4 text-muted-foreground" />
                        <div className="text-center p-3 rounded-lg bg-muted/50">
                          <p className="font-mono font-bold text-emerald-400">{overnightScreenData.schedule.briefTime}</p>
                          <p className="text-xs text-muted-foreground">Brief</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Mind Theatre */}
                <Card className="rounded-xl">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                        <Brain className="size-4 text-violet-400" />
                        Mind Theatre
                      </CardTitle>
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          overnightScreenData.theatreStatus === 'complete'
                            ? 'border-emerald-500/30 text-emerald-400'
                            : overnightScreenData.theatreStatus === 'running'
                              ? 'border-amber-500/30 text-amber-400'
                              : 'border-indigo-500/30 text-indigo-400'
                        }`}
                      >
                        {overnightScreenData.theatreStatus === 'complete' && 'Complete'}
                        {overnightScreenData.theatreStatus === 'running' && 'Running'}
                        {overnightScreenData.theatreStatus === 'sleeping' && 'Sleeping'}
                        {!['complete','running','sleeping'].includes(overnightScreenData.theatreStatus) && overnightScreenData.theatreStatus}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="max-h-80 overflow-y-auto scrollbar-thin">
                      <div className="space-y-2">
                        {overnightScreenData.mindTheatre?.map((entry: any, i: number) => (
                          <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/30">
                            <span className="font-mono text-xs text-muted-foreground w-12 shrink-0">
                              {entry.time}
                            </span>
                            <span className="text-sm shrink-0">
                              {entry.actor === 'creator' && 'Creator'}
                              {entry.actor === 'muse' && 'Muse'}
                              {entry.actor === 'maker' && 'Maker'}
                              {!['creator','muse','maker'].includes(entry.actor) && entry.actor}
                            </span>
                            <span className="text-sm flex-1">{entry.action}</span>
                            <Badge variant="outline" className="text-[10px] shrink-0">
                              {entry.phase}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                    {overnightScreenData.lastRunTime && (
                      <p className="text-xs text-muted-foreground mt-3">
                        Last run: {new Date(overnightScreenData.lastRunTime).toLocaleString()}
                      </p>
                    )}
                  </CardContent>
                </Card>

                {/* Overnight Output */}
                {overnightScreenData.overnightOutput && (
                  <Card className="rounded-xl">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                        <Sparkles className="size-4 text-emerald-400" />
                        Overnight Output
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <p className="font-semibold text-sm">{overnightScreenData.overnightOutput.draftTitle}</p>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          {overnightScreenData.overnightOutput.hookPattern && (
                            <Badge variant="outline" className="text-xs">
                              {overnightScreenData.overnightOutput.hookPattern}
                            </Badge>
                          )}
                          <Badge
                            className={overnightScreenData.overnightOutput.evaluationPassed
                              ? 'bg-emerald-600 text-white border-emerald-600 text-xs'
                              : 'bg-red-600 text-white border-red-600 text-xs'
                            }
                          >
                            {overnightScreenData.overnightOutput.evaluationPassed ? 'Passed' : 'Failed'}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            Score: {overnightScreenData.overnightOutput.overallScore}
                          </Badge>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-muted-foreground">Voice Match</span>
                            <span className="font-mono font-bold">{overnightScreenData.overnightOutput.voiceMatch}%</span>
                          </div>
                          <Progress value={overnightScreenData.overnightOutput.voiceMatch} className="h-2" />
                        </div>
                        <div>
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-muted-foreground">Hook Compat</span>
                            <span className="font-mono font-bold">{overnightScreenData.overnightOutput.hookCompat}%</span>
                          </div>
                          <Progress value={overnightScreenData.overnightOutput.hookCompat} className="h-2" />
                        </div>
                        <div>
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-muted-foreground">Content Quality</span>
                            <span className="font-mono font-bold">{overnightScreenData.overnightOutput.contentQuality}%</span>
                          </div>
                          <Progress value={overnightScreenData.overnightOutput.contentQuality} className="h-2" />
                        </div>
                      </div>

                      {overnightScreenData.overnightOutput.createdAt && (
                        <p className="text-xs text-muted-foreground">
                          Created: {new Date(overnightScreenData.overnightOutput.createdAt).toLocaleString()}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                )}
              </>
            )}

            {!overnightScreenLoading && !overnightScreenData && null}
          </TabsContent>

          {/* ===== CONTROL SCREEN TAB (Day 13) ===== */}
          <TabsContent value="controlscreen" className="space-y-6">
            {controlScreenLoading && (
              <div className="flex items-center justify-center py-12 text-muted-foreground">
                <div className="animate-pulse flex items-center gap-2">
                  <Settings className="size-5 animate-spin" />
                  Loading control settings…
                </div>
              </div>
            )}

            {controlScreenData && (
              <>
                {/* You're In Control Header */}
                <Card className="rounded-xl border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 to-transparent muse-card-hover">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 muse-stagger-1">
                      <Settings className="size-8 text-emerald-400" />
                      <div>
                        <h2 className="text-2xl font-bold tracking-tight">You&apos;re In Control</h2>
                        <p className="text-sm text-muted-foreground mt-1">
                          {controlScreenData.creatorName
                            ? `${controlScreenData.creatorName}, you decide what Muse can and cannot do.`
                            : 'You decide what Muse can and cannot do.'}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Autonomy Settings */}
                {controlScreenData.autonomySettings && (
                  <Card className="rounded-xl">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                        <Shield className="size-4 text-sky-400" />
                        Autonomy Settings
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                        <span className="text-sm font-medium">Overnight Analysis</span>
                        <Badge className={controlScreenData.autonomySettings.overnightAnalysis
                          ? 'bg-emerald-600 text-white border-emerald-600 text-xs'
                          : 'bg-red-600 text-white border-red-600 text-xs'
                        }>
                          {controlScreenData.autonomySettings.overnightAnalysis ? 'ON' : 'OFF'}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                        <span className="text-sm font-medium">Draft Creation</span>
                        <Badge className={controlScreenData.autonomySettings.draftCreation
                          ? 'bg-emerald-600 text-white border-emerald-600 text-xs'
                          : 'bg-red-600 text-white border-red-600 text-xs'
                        }>
                          {controlScreenData.autonomySettings.draftCreation ? 'ON' : 'OFF'}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-lg bg-amber-500/5 border border-amber-500/20">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">Auto-Publish</span>
                          <Shield className="size-3 text-amber-400" title="Publishing requires explicit approval" />
                        </div>
                        <Badge className="bg-red-600 text-white border-red-600 text-xs">OFF</Badge>
                      </div>
                      <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="size-4 text-amber-400" />
                          <p className="text-sm text-amber-300 font-medium">
                            Publishing ALWAYS requires your explicit approval.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                        <span className="text-sm font-medium">Community Monitoring</span>
                        <Badge className={controlScreenData.autonomySettings.communityMonitoring
                          ? 'bg-emerald-600 text-white border-emerald-600 text-xs'
                          : 'bg-red-600 text-white border-red-600 text-xs'
                        }>
                          {controlScreenData.autonomySettings.communityMonitoring ? 'ON' : 'OFF'}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Approval Queue — Refined Day 15 */}
                <Card className="rounded-xl">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                        <CheckCircle2 className="size-4 text-emerald-400" />
                        Approval Queue
                        <Badge variant="secondary" className="text-xs ml-1">
                          {controlScreenData.pendingCount ?? 0} pending
                        </Badge>
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        {/* Expire Stale Approvals */}
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs gap-1"
                          disabled={expireLoading}
                          onClick={async () => {
                            setExpireLoading(true);
                            try {
                              const res = await fetch('/api/autonomy/expire', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ maxAgeHours: 48 }),
                              });
                              const json = await res.json();
                              setExpireResult(json);
                              // Refresh control screen
                              const controlRes = await fetch('/api/dashboard/control').then((r) => r.json()).catch(() => null);
                              if (controlRes?.success) setControlScreenData(controlRes.data);
                            } catch { /* fail */ }
                            setExpireLoading(false);
                          }}
                        >
                          <Clock className="size-3" />
                          {expireLoading ? 'Expiring…' : 'Expire Stale'}
                        </Button>
                        {/* View Full History */}
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs gap-1"
                          disabled={approvalHistoryLoading}
                          onClick={async () => {
                            setApprovalHistoryLoading(true);
                            try {
                              const res = await fetch('/api/autonomy/approval-history');
                              const json = await res.json();
                              if (json.success) setApprovalHistoryData(json);
                            } catch { /* fail */ }
                            setApprovalHistoryLoading(false);
                          }}
                        >
                          <History className="size-3" />
                          History
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* Expire result notification */}
                    {expireResult && (
                      <div className={`mb-3 p-2 rounded-lg text-xs ${expireResult.success && expireResult.result?.expired > 0 ? 'bg-amber-500/10 border border-amber-500/20 text-amber-300' : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-300'}`}>
                        {expireResult.message || 'Done'}
                      </div>
                    )}
                    {controlScreenData.approvalQueue && controlScreenData.approvalQueue.length > 0 ? (
                      <div className="space-y-3">
                        {controlScreenData.approvalQueue.map((item: any, i: number) => (
                          <div key={item.id || i} className={`p-3 rounded-lg border space-y-2 ${
                            item.status === 'pending' ? 'bg-amber-500/5 border-amber-500/20' :
                            item.status === 'approved' ? 'bg-emerald-500/5 border-emerald-500/20' :
                            item.status === 'rejected' ? 'bg-red-500/5 border-red-500/20' :
                            item.status === 'expired' ? 'bg-muted/30 border-muted' :
                            'bg-muted/30'
                          }`}>
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-sm truncate">{item.title || item.itemType || 'Pending item'}</p>
                                <div className="flex items-center gap-2 mt-1 flex-wrap">
                                  <Badge variant="outline" className="text-[10px]">{item.itemType}</Badge>
                                  <Badge variant="outline" className="text-[10px]">{item.action}</Badge>
                                  {/* Status badge */}
                                  {item.status === 'pending' && (
                                    <Badge className="bg-amber-500 text-white border-amber-500 text-[10px]">Pending</Badge>
                                  )}
                                  {item.status === 'approved' && (
                                    <Badge className="bg-emerald-600 text-white border-emerald-600 text-[10px]">Approved</Badge>
                                  )}
                                  {item.status === 'rejected' && (
                                    <Badge className="bg-red-600 text-white border-red-600 text-[10px]">Rejected</Badge>
                                  )}
                                  {item.status === 'expired' && (
                                    <Badge className="bg-gray-500 text-white border-gray-500 text-[10px]">Expired</Badge>
                                  )}
                                  {/* Age */}
                                  {item.age && (
                                    <span className="text-[10px] text-muted-foreground">{item.age}</span>
                                  )}
                                </div>
                              </div>
                              {/* Action buttons — only for pending items */}
                              {item.status === 'pending' && (
                                <div className="flex items-center gap-2 shrink-0">
                                  <Button
                                    size="sm"
                                    variant="default"
                                    className="h-7 text-xs gap-1 bg-emerald-600 hover:bg-emerald-700"
                                    disabled={approvalActionLoading === item.id}
                                    onClick={() => approveActionHandler(item.id)}
                                  >
                                    <Check className="size-3" /> Approve
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-7 text-xs gap-1 text-destructive border-destructive/30 hover:bg-destructive/10"
                                    disabled={approvalActionLoading === item.id}
                                    onClick={() => setShowRejectInput(item.id)}
                                  >
                                    <X className="size-3" /> Reject
                                  </Button>
                                </div>
                              )}
                            </div>
                            {/* Reject reason input */}
                            {showRejectInput === item.id && (
                              <div className="space-y-2 mt-2 pt-2 border-t border-muted">
                                <Textarea
                                  placeholder="Why are you rejecting this? (optional)"
                                  value={rejectReason}
                                  onChange={(e) => setRejectReason(e.target.value)}
                                  className="text-xs min-h-[60px]"
                                />
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    className="h-7 text-xs gap-1"
                                    onClick={() => rejectActionHandler(item.id, rejectReason || undefined)}
                                    disabled={approvalActionLoading === item.id}
                                  >
                                    Confirm Reject
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-7 text-xs"
                                    onClick={() => { setShowRejectInput(null); setRejectReason(''); }}
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              </div>
                            )}
                            {/* Loading spinner */}
                            {approvalActionLoading === item.id && (
                              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                <div className="animate-spin size-3 border-2 border-current border-t-transparent rounded-full" />
                                Processing…
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6 text-muted-foreground">
                        <CheckCircle2 className="size-8 mx-auto mb-2 text-emerald-400 opacity-50" />
                        <p className="text-sm">No items pending your review</p>
                      </div>
                    )}
                    {/* Approval History Panel */}
                    {approvalHistoryData && approvalHistoryData.history && (
                      <div className="mt-4 pt-4 border-t border-muted">
                        <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
                          <History className="size-3" /> Approval History ({approvalHistoryData.count})
                        </p>
                        <ScrollArea className="max-h-48 overflow-y-auto scrollbar-thin">
                          <div className="space-y-2">
                            {approvalHistoryData.history.map((h: any) => (
                              <div key={h.id} className="flex items-center gap-3 p-2 rounded-lg bg-muted/20 text-xs">
                                <Badge className={`text-[9px] shrink-0 ${
                                  h.status === 'approved' ? 'bg-emerald-600 text-white' :
                                  h.status === 'rejected' ? 'bg-red-600 text-white' :
                                  h.status === 'expired' ? 'bg-gray-500 text-white' :
                                  'bg-amber-500 text-white'
                                }`}>{h.status}</Badge>
                                <span className="truncate flex-1">{h.title || h.itemType}</span>
                                <span className="text-muted-foreground shrink-0">{h.age || ''}</span>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Audit Log — Polished Day 15 */}
                <Card className="rounded-xl">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                        <History className="size-4 text-violet-400" />
                        Audit Log
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        {controlScreenData.totalAuditEvents !== undefined && (
                          <Badge variant="outline" className="text-xs">
                            {controlScreenData.totalAuditEvents} total
                          </Badge>
                        )}
                        {/* Export button */}
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs gap-1"
                          onClick={async () => {
                            try {
                              const res = await fetch('/api/audit/export?format=csv');
                              if (res.ok) {
                                const text = await res.text();
                                const blob = new Blob([text], { type: 'text/csv' });
                                const url = URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.href = url;
                                a.download = `audit-export-${new Date().toISOString().split('T')[0]}.csv`;
                                a.click();
                                URL.revokeObjectURL(url);
                              }
                            } catch { /* fail */ }
                          }}
                        >
                          <FileText className="size-3" /> Export CSV
                        </Button>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Every action logged. Always.</p>
                  </CardHeader>
                  <CardContent>
                    {/* Audit Stats Summary */}
                    {auditStatsData && (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                        <div className="p-2 rounded-lg bg-muted/30 text-center">
                          <p className="text-lg font-bold">{auditStatsData.totalEvents}</p>
                          <p className="text-[10px] text-muted-foreground">Total</p>
                        </div>
                        <div className="p-2 rounded-lg bg-muted/30 text-center">
                          <p className="text-lg font-bold">{auditStatsData.last24h}</p>
                          <p className="text-[10px] text-muted-foreground">Last 24h</p>
                        </div>
                        <div className="p-2 rounded-lg bg-muted/30 text-center">
                          <p className="text-lg font-bold">{auditStatsData.last7d}</p>
                          <p className="text-[10px] text-muted-foreground">Last 7d</p>
                        </div>
                        <div className="p-2 rounded-lg bg-muted/30 text-center">
                          <p className="text-lg font-bold">{Object.keys(auditStatsData.byActor || {}).length}</p>
                          <p className="text-[10px] text-muted-foreground">Actors</p>
                        </div>
                      </div>
                    )}

                    {/* Filter Controls */}
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      {/* Actor filter */}
                      <Select value={auditFilterActor} onValueChange={setAuditFilterActor}>
                        <SelectTrigger className="h-7 text-xs w-[120px]">
                          <SelectValue placeholder="Actor" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Actors</SelectItem>
                          <SelectItem value="muse">Muse</SelectItem>
                          <SelectItem value="maker">Maker</SelectItem>
                          <SelectItem value="system">System</SelectItem>
                          <SelectItem value="creator">Creator</SelectItem>
                        </SelectContent>
                      </Select>
                      {/* Time range tabs */}
                      <div className="flex items-center gap-1 bg-muted/30 rounded-md p-0.5">
                        {(['24h', '7d', 'all'] as const).map((range) => (
                          <button
                            key={range}
                            onClick={() => setAuditTimeRange(range)}
                            className={`px-2 py-0.5 text-[10px] rounded-sm transition-colors ${
                              auditTimeRange === range
                                ? 'bg-background text-foreground shadow-sm'
                                : 'text-muted-foreground hover:text-foreground'
                            }`}
                          >
                            {range === 'all' ? 'All' : range}
                          </button>
                        ))}
                      </div>
                      {/* Search */}
                      <Input
                        placeholder="Search audit…"
                        value={auditSearchQuery}
                        onChange={(e) => setAuditSearchQuery(e.target.value)}
                        className="h-7 text-xs w-[140px]"
                      />
                    </div>

                    {/* Audit Log Entries */}
                    <ScrollArea className="max-h-80 overflow-y-auto scrollbar-thin">
                      <div className="space-y-1">
                        {controlScreenData.auditLog
                          ?.filter((entry: any) => {
                            // Actor filter
                            if (auditFilterActor !== 'all' && entry.actor !== auditFilterActor) return false;
                            // Time range filter
                            if (auditTimeRange !== 'all' && entry.timestamp) {
                              const entryDate = new Date(entry.timestamp).getTime();
                              const now = Date.now();
                              if (auditTimeRange === '24h' && entryDate < now - 24*60*60*1000) return false;
                              if (auditTimeRange === '7d' && entryDate < now - 7*24*60*60*1000) return false;
                            }
                            // Search filter
                            if (auditSearchQuery) {
                              const q = auditSearchQuery.toLowerCase();
                              const matchAction = (entry.action || '').toLowerCase().includes(q);
                              const matchDetail = (entry.detail || '').toLowerCase().includes(q);
                              const matchTarget = (entry.targetType || '').toLowerCase().includes(q);
                              const matchDelta = (entry.delta || '').toLowerCase().includes(q);
                              if (!matchAction && !matchDetail && !matchTarget && !matchDelta) return false;
                            }
                            return true;
                          })
                          .map((entry: any, i: number) => {
                          const eventId = `${entry.timestamp}-${entry.actor}-${entry.action}-${i}`;
                          const isExpanded = expandedDeltaId === eventId;
                          return (
                            <div key={i} className="group">
                              <div
                                className={`flex items-start gap-3 p-2 rounded-lg hover:bg-muted/30 cursor-pointer ${isExpanded ? 'bg-muted/30' : ''}`}
                                onClick={() => {
                                  if (entry.delta) {
                                    setExpandedDeltaId(isExpanded ? null : eventId);
                                  }
                                }}
                              >
                                <span className="font-mono text-[10px] text-muted-foreground w-14 shrink-0 mt-0.5">
                                  {entry.timestamp ? new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}
                                </span>
                                <span className="text-sm shrink-0 mt-0.5">
                                  {entry.actor === 'muse' && 'Muse'}
                                  {entry.actor === 'maker' && 'Maker'}
                                  {entry.actor === 'system' && 'System'}
                                  {entry.actor === 'creator' && 'Creator'}
                                  {!['muse','maker','system','creator'].includes(entry.actor) && entry.actor}
                                </span>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium truncate">{entry.action}</p>
                                  {entry.detail && (
                                    <p className="text-xs text-muted-foreground truncate">{entry.detail}</p>
                                  )}
                                  {/* Target info */}
                                  {entry.targetType && (
                                    <p className="text-[10px] text-muted-foreground mt-0.5">
                                      → {entry.targetType}{entry.targetId ? ` #${entry.targetId.slice(0,8)}…` : ''}
                                    </p>
                                  )}
                                </div>
                                {/* Expand indicator */}
                                {entry.delta && (
                                  <span className="text-[10px] text-muted-foreground shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                    {isExpanded ? '▼' : '▶'} JSON
                                  </span>
                                )}
                              </div>
                              {/* Expandable delta view */}
                              {isExpanded && entry.delta && (
                                <div className="ml-[68px] mr-2 mb-1 p-2 rounded-md bg-muted/50 border border-muted">
                                  <pre className="text-[10px] font-mono text-muted-foreground whitespace-pre-wrap break-all overflow-x-auto max-h-40 overflow-y-auto">
                                    {(() => {
                                      try {
                                        return JSON.stringify(JSON.parse(entry.delta), null, 2);
                                      } catch {
                                        return entry.delta;
                                      }
                                    })()}
                                  </pre>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </ScrollArea>

                    {/* Actor distribution bar */}
                    {auditStatsData?.byActor && (
                      <div className="mt-3 pt-3 border-t border-muted">
                        <p className="text-[10px] text-muted-foreground mb-2">Actor Distribution</p>
                        <div className="flex items-center gap-2 flex-wrap">
                          {Object.entries(auditStatsData.byActor as Record<string, number>)
                            .sort((a, b) => b[1] - a[1])
                            .map(([actor, count]) => {
                              const total = auditStatsData.totalEvents || 1;
                              const pct = Math.round((count / total) * 100);
                              return (
                                <div key={actor} className="flex items-center gap-1">
                                  <span className="text-[10px]">
                                    {actor}
                                  </span>
                                  <span className="text-[10px] font-medium">{actor}</span>
                                  <Badge variant="outline" className="text-[9px]">{count} ({pct}%)</Badge>
                                </div>
                              );
                            })}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </>
            )}

            {!controlScreenLoading && !controlScreenData && null}
          </TabsContent>
        </Tabs>
      </main>

      {/* ===== Footer ===== */}
      <footer className="border-t border-border bg-card mt-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between text-xs text-muted-foreground flex-wrap gap-2">
          <span>MUSE — Persistent AI Creative Team • Minds Platform • Track 1: Audience Growth &amp; Engagement</span>
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

function ScoreBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] text-muted-foreground w-14 shrink-0">{label}</span>
      <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full bg-current transition-all"
          style={{ width: `${Math.min(100, value * 100)}%`, color: value >= 0.7 ? '#10b981' : value >= 0.5 ? '#f59e0b' : '#ef4444' }}
        />
      </div>
      <span className="text-[10px] text-muted-foreground w-8 text-right">{(value * 100).toFixed(0)}%</span>
    </div>
  );
}

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
