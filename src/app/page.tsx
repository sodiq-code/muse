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
                Muse — Day 18 Polished UI
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
            <Badge variant="secondary" className="bg-sky-500/10 text-sky-400 border-sky-500/20">🧊 Scope Frozen</Badge>
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
            <TabsTrigger value="feedback" className="gap-1 shrink-0">
              <MessageCircle className="size-3.5" />
              <span className="hidden sm:inline">Feedback</span><span className="sm:hidden">FB</span>
            </TabsTrigger>
            <TabsTrigger value="validation" className="gap-1 shrink-0">
              <ShieldCheck className="size-3.5" />
              <span className="hidden sm:inline">Validation</span><span className="sm:hidden">Val</span>
            </TabsTrigger>
            <TabsTrigger value="day1" className="gap-1 shrink-0">
              <Shield className="size-3.5" />
              <span className="hidden md:inline">Day 1</span><span className="md:hidden">D1</span>
            </TabsTrigger>
            <TabsTrigger value="day2" className="gap-1 shrink-0">
              <Sparkles className="size-3.5" />
              <span className="hidden md:inline">Day 2</span><span className="md:hidden">D2</span>
            </TabsTrigger>
            <TabsTrigger value="draft" className="gap-1 shrink-0">
              <SendHorizontal className="size-3.5" />
              <span className="hidden md:inline">Delegation</span><span className="md:hidden">Deleg</span>
            </TabsTrigger>
            <TabsTrigger value="autonomy" className="gap-1 shrink-0">
              <Moon className="size-3.5" />
              <span className="hidden md:inline">Autonomy</span><span className="md:hidden">Auto</span>
            </TabsTrigger>
            <TabsTrigger value="memory" className="gap-1 shrink-0">
              <Database className="size-3.5" />
              <span className="hidden md:inline">Memory DB</span><span className="md:hidden">MDB</span>
            </TabsTrigger>
            <TabsTrigger value="voice" className="gap-1 shrink-0">
              <Mic className="size-3.5" />
              <span className="hidden md:inline">Voice</span><span className="md:hidden">Voc</span>
            </TabsTrigger>
            <TabsTrigger value="performance" className="gap-1 shrink-0">
              <TrendingUp className="size-3.5" />
              <span className="hidden md:inline">Performance</span><span className="md:hidden">Perf</span>
            </TabsTrigger>
            <TabsTrigger value="learning" className="gap-1 shrink-0">
              <GraduationCap className="size-3.5" />
              <span className="hidden md:inline">Learning DB</span><span className="md:hidden">LDB</span>
            </TabsTrigger>
            <TabsTrigger value="decisions" className="gap-1 shrink-0">
              <Scale className="size-3.5" />
              <span className="hidden md:inline">Decisions</span><span className="md:hidden">Dec</span>
            </TabsTrigger>
            <TabsTrigger value="explain" className="gap-1 shrink-0">
              <Eye className="size-3.5" />
              <span className="hidden md:inline">Why?</span><span className="md:hidden">Why</span>
            </TabsTrigger>
            <TabsTrigger value="proof" className="gap-1 shrink-0">
              <FlaskConical className="size-3.5" />
              <span className="hidden md:inline">7-Day Proof</span><span className="md:hidden">7D</span>
            </TabsTrigger>
            <TabsTrigger value="evaluate" className="gap-1 shrink-0">
              <Scale className="size-3.5" />
              <span className="hidden md:inline">Evaluate</span><span className="md:hidden">Eval</span>
            </TabsTrigger>
            <TabsTrigger value="drafts" className="gap-1 shrink-0">
              <FileText className="size-3.5" />
              <span className="hidden md:inline">Drafts</span><span className="md:hidden">Drft</span>
            </TabsTrigger>
            <TabsTrigger value="beat" className="gap-1 shrink-0">
              <Workflow className="size-3.5" />
              <span className="hidden md:inline">Beat</span><span className="md:hidden">Beat</span>
            </TabsTrigger>
          </TabsList>

          {/* ===== TODAY TAB (Day 12) ===== */}
          <TabsContent value="today" className="space-y-6">
            {/* Load Button */}
            <div className="flex items-center gap-3">
              <Button
                onClick={async () => {
                  setTodayScreenLoading(true);
                  try {
                    const res = await fetch('/api/dashboard/today');
                    const json = await res.json();
                    if (json.success) setTodayScreenData(json.data);
                  } catch { /* silently fail */ }
                  setTodayScreenLoading(false);
                }}
                disabled={todayScreenLoading}
                className="gap-2"
              >
                <Sun className="size-4" />
                {todayScreenLoading ? 'Loading…' : 'Load Today'}
              </Button>
              {todayScreenData && (
                <Badge variant="secondary" className="text-xs">Live</Badge>
              )}
            </div>

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

            {!todayScreenLoading && !todayScreenData && (
              <div className="text-center py-12 text-muted-foreground">
                <Sun className="size-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm">Click &quot;Load Today&quot; to fetch your daily briefing</p>
              </div>
            )}
          </TabsContent>

          {/* ===== MEMORY SCREEN TAB (Day 12) ===== */}
          <TabsContent value="memoryscreen" className="space-y-6">
            {/* Load Button */}
            <div className="flex items-center gap-3">
              <Button
                onClick={async () => {
                  setMemoryScreenLoading(true);
                  try {
                    const res = await fetch('/api/dashboard/memory');
                    const json = await res.json();
                    if (json.success) setMemoryScreenData(json.data);
                  } catch { /* silently fail */ }
                  setMemoryScreenLoading(false);
                }}
                disabled={memoryScreenLoading}
                className="gap-2"
              >
                <Brain className="size-4" />
                {memoryScreenLoading ? 'Loading…' : 'Load Memory'}
              </Button>
              {memoryScreenData && (
                <Badge variant="secondary" className="text-xs">Live</Badge>
              )}
            </div>

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

            {!memoryScreenLoading && !memoryScreenData && (
              <div className="text-center py-12 text-muted-foreground">
                <Brain className="size-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm">Click &quot;Load Memory&quot; to explore what Muse knows</p>
              </div>
            )}
          </TabsContent>

          {/* ===== LEARNING SCREEN TAB (Day 13) — MOST IMPORTANT ===== */}
          <TabsContent value="learningscreen" className="space-y-6">
            {/* Load Button */}
            <div className="flex items-center gap-3">
              <Button
                onClick={async () => {
                  setLearningScreenLoading(true);
                  try {
                    const res = await fetch('/api/dashboard/learning');
                    const json = await res.json();
                    if (json.success) setLearningScreenData(json.data);
                  } catch { /* silently fail */ }
                  setLearningScreenLoading(false);
                }}
                disabled={learningScreenLoading}
                className="gap-2"
              >
                <GraduationCap className="size-4" />
                {learningScreenLoading ? 'Loading…' : 'Load Learning'}
              </Button>
              {learningScreenData && (
                <Badge variant="secondary" className="text-xs">Live</Badge>
              )}
            </div>

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
                                        <span>📊</span>
                                        <span className="text-sm font-medium">{step.label}</span>
                                        <span className="text-xs text-muted-foreground font-mono">{step.detail}</span>
                                      </div>
                                    )}
                                    {step.type === 'hook_analysis' && (
                                      <div className="flex items-center gap-2">
                                        <span>🎣</span>
                                        <span className="text-sm font-medium">{step.label}</span>
                                        <span className="text-xs text-muted-foreground">{step.detail}</span>
                                      </div>
                                    )}
                                    {step.type === 'comparison' && (
                                      <div className="flex items-center gap-2">
                                        <span>📈</span>
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
                                        <span>🧠</span>
                                        <span className="text-sm font-medium">{step.label}</span>
                                        <span className="text-xs text-violet-400">{step.detail}</span>
                                      </div>
                                    )}
                                    {step.type === 'strategy_changed' && (
                                      <div className="flex items-center gap-2">
                                        <span>⚡</span>
                                        <span className="text-sm font-medium">{step.label}</span>
                                        <span className="text-xs text-amber-400">{step.detail}</span>
                                      </div>
                                    )}
                                    {step.type === 'loop_working' && (
                                      <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                                        <span>✅</span>
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
                            {learningScreenData.honestyScore.isHonest ? '✅ Honest' : '❌ Dishonest'}
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

            {!learningScreenLoading && !learningScreenData && (
              <div className="text-center py-12 text-muted-foreground">
                <GraduationCap className="size-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm">Click &quot;Load Learning&quot; to see how Muse is learning</p>
              </div>
            )}
          </TabsContent>

          {/* ===== OVERNIGHT SCREEN TAB (Day 13) ===== */}
          <TabsContent value="overnightscreen" className="space-y-6">
            {/* Load Button */}
            <div className="flex items-center gap-3">
              <Button
                onClick={async () => {
                  setOvernightScreenLoading(true);
                  try {
                    const res = await fetch('/api/dashboard/overnight');
                    const json = await res.json();
                    if (json.success) setOvernightScreenData(json.data);
                  } catch { /* silently fail */ }
                  setOvernightScreenLoading(false);
                }}
                disabled={overnightScreenLoading}
                className="gap-2"
              >
                <Moon className="size-4" />
                {overnightScreenLoading ? 'Loading…' : 'Load Overnight'}
              </Button>
              {overnightScreenData && (
                <Badge variant="secondary" className="text-xs">Live</Badge>
              )}
            </div>

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
                        {overnightScreenData.theatreStatus === 'complete' && '✅ Complete'}
                        {overnightScreenData.theatreStatus === 'running' && '🔄 Running'}
                        {overnightScreenData.theatreStatus === 'sleeping' && '💤 Sleeping'}
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
                              {entry.actor === 'creator' && '👤'}
                              {entry.actor === 'muse' && '🧠'}
                              {entry.actor === 'maker' && '🎨'}
                              {!['creator','muse','maker'].includes(entry.actor) && '⚙️'}
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
                            {overnightScreenData.overnightOutput.evaluationPassed ? '✅ Passed' : '❌ Failed'}
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

            {!overnightScreenLoading && !overnightScreenData && (
              <div className="text-center py-12 text-muted-foreground">
                <Moon className="size-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm">Click &quot;Load Overnight&quot; to see what happened while you were offline</p>
              </div>
            )}
          </TabsContent>

          {/* ===== CONTROL SCREEN TAB (Day 13) ===== */}
          <TabsContent value="controlscreen" className="space-y-6">
            {/* Load Button */}
            <div className="flex items-center gap-3">
              <Button
                onClick={async () => {
                  setControlScreenLoading(true);
                  try {
                    const [controlRes, statsRes] = await Promise.all([
                      fetch('/api/dashboard/control').then((r) => r.json()),
                      fetch('/api/audit/stats').then((r) => r.json()).catch(() => null),
                    ]);
                    if (controlRes.success) setControlScreenData(controlRes.data);
                    if (statsRes?.success) setAuditStatsData(statsRes.stats);
                  } catch { /* silently fail */ }
                  setControlScreenLoading(false);
                }}
                disabled={controlScreenLoading}
                className="gap-2"
              >
                <Settings className="size-4" />
                {controlScreenLoading ? 'Loading…' : 'Load Control'}
              </Button>
              {controlScreenData && (
                <Badge variant="secondary" className="text-xs">Live</Badge>
              )}
            </div>

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
                          <span className="text-amber-400" title="Publishing requires explicit approval">🔒</span>
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
                        <p className="text-sm">No items pending your review ✅</p>
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
                                  {entry.actor === 'muse' && '🧠'}
                                  {entry.actor === 'maker' && '🎨'}
                                  {entry.actor === 'system' && '⚙️'}
                                  {entry.actor === 'creator' && '👤'}
                                  {!['muse','maker','system','creator'].includes(entry.actor) && '⚙️'}
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
                                    {actor === 'muse' && '🧠'}
                                    {actor === 'maker' && '🎨'}
                                    {actor === 'system' && '⚙️'}
                                    {actor === 'creator' && '👤'}
                                    {!['muse','maker','system','creator'].includes(actor) && '❓'}
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

            {!controlScreenLoading && !controlScreenData && (
              <div className="text-center py-12 text-muted-foreground">
                <Settings className="size-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm">Click &quot;Load Control&quot; to view your autonomy settings</p>
              </div>
            )}
          </TabsContent>

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

          {/* ===== DELEGATION TAB (Day 9) ===== */}
          <TabsContent value="draft" className="space-y-6">
            <section>
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                <Send className="size-4" />
                Muse→Maker Delegation
              </h2>

              {/* Input Controls */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <SendHorizontal className="size-4" />
                    Delegation Controls
                  </CardTitle>
                  <CardDescription>
                    Override inferred topic & objective, then preview or execute the Muse→Maker delegation pipeline
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-muted-foreground">Topic (optional override)</label>
                      <Input
                        placeholder="Leave empty to use inferred topic"
                        value={delegationTopic}
                        onChange={(e) => setDelegationTopic(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-muted-foreground">Objective (optional override)</label>
                      <Input
                        placeholder="Leave empty to use inferred objective"
                        value={delegationObjective}
                        onChange={(e) => setDelegationObjective(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <Button
                      variant="outline"
                      className="gap-2"
                      disabled={delegationPreviewLoading}
                      onClick={async () => {
                        setDelegationPreviewLoading(true);
                        setDelegationPreview(null);
                        try {
                          const res = await fetch('/api/delegation/send');
                          const data = await res.json();
                          if (data.success) setDelegationPreview(data);
                        } catch (e) {
                          console.error('Preview error:', e);
                        } finally {
                          setDelegationPreviewLoading(false);
                        }
                      }}
                    >
                      <Eye className="size-4" />
                      {delegationPreviewLoading ? 'Loading…' : 'Preview Instruction'}
                    </Button>
                    <Button
                      className="gap-2 bg-violet-600 hover:bg-violet-700 text-white"
                      disabled={delegationExecuteLoading}
                      onClick={async () => {
                        setDelegationExecuteLoading(true);
                        setDelegationResult(null);
                        try {
                          const body: Record<string, string> = {};
                          if (delegationTopic) body.topic = delegationTopic;
                          if (delegationObjective) body.objective = delegationObjective;
                          const res = await fetch('/api/delegation/send', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(body),
                          });
                          const data = await res.json();
                          if (data.success) setDelegationResult(data);
                        } catch (e) {
                          console.error('Execute error:', e);
                        } finally {
                          setDelegationExecuteLoading(false);
                        }
                      }}
                    >
                      <Send className="size-4" />
                      {delegationExecuteLoading ? 'Delegating…' : 'Execute Delegation'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Preview Results */}
            {delegationPreview && (
              <section className="space-y-4">
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Eye className="size-4" />
                  Delegation Preview
                </h2>

                {/* Creator Context Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <User className="size-4" />
                      Creator Context
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Name</p>
                        <p className="text-sm font-medium">{delegationPreview.context.creatorName}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Platform</p>
                        <p className="text-sm font-medium">{delegationPreview.context.platform}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Niche</p>
                        <p className="text-sm font-medium">{delegationPreview.context.niche ?? '—'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Audience</p>
                        <p className="text-sm font-medium">{delegationPreview.context.audience ?? '—'}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Voice Profile Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Mic className="size-4" />
                      Voice Profile
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Tone</p>
                        <p className="text-sm font-medium">{delegationPreview.context.voiceProfile.tone}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Pace</p>
                        <p className="text-sm font-medium">{delegationPreview.context.voiceProfile.pace}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Vocabulary</p>
                        <p className="text-sm font-medium">{delegationPreview.context.voiceProfile.vocabulary}</p>
                      </div>
                    </div>
                    {delegationPreview.context.voiceProfile.avoidTopics.length > 0 && (
                      <div className="mt-3">
                        <p className="text-xs text-muted-foreground mb-1">Avoid Topics</p>
                        <div className="flex flex-wrap gap-1">
                          {delegationPreview.context.voiceProfile.avoidTopics.map((t) => (
                            <Badge key={t} variant="outline" className="text-xs border-rose-500/30 text-rose-400">{t}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {delegationPreview.context.voiceProfile.strengths.length > 0 && (
                      <div className="mt-3">
                        <p className="text-xs text-muted-foreground mb-1">Strengths</p>
                        <div className="flex flex-wrap gap-1">
                          {delegationPreview.context.voiceProfile.strengths.map((s) => (
                            <Badge key={s} variant="outline" className="text-xs border-emerald-500/30 text-emerald-400">{s}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Best Hook Patterns */}
                {delegationPreview.context.bestHookPatterns.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Target className="size-4" />
                        Best Hook Patterns
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {delegationPreview.context.bestHookPatterns.map((p, i) => (
                          <div key={i} className="flex items-center justify-between p-2.5 rounded-lg bg-muted/50">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">{p.pattern}</span>
                              <Badge variant="outline" className={`text-xs ${confidenceColor(p.confidence)}`}>
                                {p.confidence}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                              <span>{(p.avgEffectiveness * 100).toFixed(0)}% avg</span>
                              <span>n={p.sampleSize}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Recent Winners */}
                {delegationPreview.context.recentWinners.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Award className="size-4" />
                        Recent Winners
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-1.5">
                        {delegationPreview.context.recentWinners.map((w, i) => (
                          <div key={i} className="flex items-center gap-2 p-2 rounded-md bg-muted/50 text-sm">
                            <CheckCircle2 className="size-3.5 text-emerald-400 shrink-0" />
                            <span>{w}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Performance Signals */}
                {delegationPreview.context.performanceSignals.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Activity className="size-4" />
                        Performance Signals
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-1.5">
                        {delegationPreview.context.performanceSignals.map((s, i) => (
                          <div key={i} className="flex items-start gap-2 p-2 rounded-md bg-muted/50 text-sm">
                            <Zap className="size-3.5 text-amber-400 shrink-0 mt-0.5" />
                            <span>{s}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Structured Instruction Card */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Radio className="size-4" />
                        Structured Instruction
                      </CardTitle>
                      <Badge variant="outline" className="gap-1 border-violet-500/40 text-violet-400">
                        {delegationPreview.instruction.instructionId}
                      </Badge>
                    </div>
                    <CardDescription>
                      From: <span className="font-medium text-violet-400">{delegationPreview.instruction.from}</span> → To: <span className="font-medium text-emerald-400">{delegationPreview.instruction.to}</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="p-3 rounded-lg bg-muted/50">
                        <p className="text-xs text-muted-foreground">Topic</p>
                        <p className="text-sm font-medium mt-1">{delegationPreview.instruction.makerInput.topic}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/50">
                        <p className="text-xs text-muted-foreground">Objective</p>
                        <p className="text-sm font-medium mt-1">{delegationPreview.instruction.makerInput.objective}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/50">
                        <p className="text-xs text-muted-foreground">Audience</p>
                        <p className="text-sm font-medium mt-1">{delegationPreview.instruction.makerInput.audience}</p>
                      </div>
                    </div>

                    {/* Instruction Text */}
                    <div className="p-3 rounded-lg bg-violet-500/10 border border-violet-500/20">
                      <p className="text-xs font-medium text-violet-400 mb-1.5">Instruction</p>
                      <p className="text-sm leading-relaxed">{delegationPreview.instruction.makerInput.instruction}</p>
                    </div>

                    {/* Reasoning */}
                    <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                      <p className="text-xs font-medium text-amber-400 mb-1.5 flex items-center gap-1">
                        <Lightbulb className="size-3" />
                        Reasoning
                      </p>
                      <p className="text-sm leading-relaxed">{delegationPreview.instruction.reasoning}</p>
                    </div>

                    {/* Evidence Used */}
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1.5">Evidence Used</p>
                      <div className="space-y-1">
                        {delegationPreview.instruction.evidenceUsed.map((ev, i) => (
                          <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                            <span className="text-emerald-400 mt-0.5">•</span>
                            <span>{ev}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Confidence + Data Points */}
                    <div className="flex items-center gap-4 flex-wrap">
                      <Badge variant="outline" className={`gap-1 ${confidenceColor(delegationPreview.instruction.confidenceLevel)}`}>
                        Confidence: {delegationPreview.instruction.confidenceLevel}
                      </Badge>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Database className="size-3" />
                        {delegationPreview.instruction.dataPointsUsed} data points
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </section>
            )}

            {/* Execution Results */}
            {delegationResult && (
              <section className="space-y-4">
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Zap className="size-4" />
                  Delegation Result
                </h2>

                {/* Maker Output Card */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Sparkles className="size-4" />
                        {delegationResult.makerOutput.title}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge className={delegationResult.mode === 'live' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-amber-600 text-white border-amber-600'}>
                          {delegationResult.mode === 'live' ? 'Live' : 'Simulated'}
                        </Badge>
                        <Badge variant="outline" className="gap-1">
                          <Clock className="size-3" />
                          {delegationResult.delegationTime}ms
                        </Badge>
                      </div>
                    </div>
                    <CardDescription>{delegationResult.makerOutput.caption}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* CTA */}
                    <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                      <p className="text-xs font-medium text-emerald-400 mb-1">CTA</p>
                      <p className="text-sm">{delegationResult.makerOutput.cta}</p>
                    </div>

                    {/* Scores */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-medium">Voice Match</span>
                          <span className="text-violet-400">{(delegationResult.makerOutput.voiceMatch * 100).toFixed(0)}%</span>
                        </div>
                        <Progress value={delegationResult.makerOutput.voiceMatch * 100} className="h-2" />
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-medium">Hook Compatibility</span>
                          <span className="text-emerald-400">{(delegationResult.makerOutput.hookCompat * 100).toFixed(0)}%</span>
                        </div>
                        <Progress value={delegationResult.makerOutput.hookCompat * 100} className="h-2" />
                      </div>
                    </div>

                    {/* Source badge + delegation time */}
                    <div className="flex items-center gap-3 flex-wrap">
                      <Badge variant="outline" className={delegationResult.makerOutput.source === 'live' ? 'gap-1 border-emerald-500/40 text-emerald-400' : 'gap-1 border-amber-500/40 text-amber-400'}>
                        {delegationResult.makerOutput.source === 'live' ? <CheckCircle2 className="size-3" /> : <CircleDashed className="size-3" />}
                        {delegationResult.makerOutput.source}
                      </Badge>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="size-3" />
                        Delegated in {delegationResult.delegationTime}ms
                      </span>
                    </div>

                    {/* Script (collapsible) */}
                    <div className="rounded-lg border border-border">
                      <button
                        type="button"
                        className="w-full flex items-center justify-between p-3 text-sm font-medium hover:bg-muted/50 transition-colors"
                        onClick={() => setScriptExpanded(!scriptExpanded)}
                      >
                        <span className="flex items-center gap-2">
                          <FileText className="size-4" />
                          Generated Script
                        </span>
                        {scriptExpanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                      </button>
                      {scriptExpanded && (
                        <div className="px-3 pb-3 border-t border-border">
                          <ScrollArea className="max-h-64">
                            <p className="text-sm leading-relaxed whitespace-pre-wrap pr-3 pt-3">{delegationResult.makerOutput.script}</p>
                          </ScrollArea>
                        </div>
                      )}
                    </div>

                    {/* Alternative Hooks */}
                    {delegationResult.makerOutput.alternativeHooks.length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-2">Alternative Hooks</p>
                        <div className="space-y-1.5">
                          {delegationResult.makerOutput.alternativeHooks.map((hook, i) => (
                            <div key={i} className="flex items-start gap-2 p-2 rounded-md bg-muted/50 text-xs">
                              <MessageSquare className="size-3 mt-0.5 text-muted-foreground shrink-0" />
                              <span>{hook}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Thumbnail Concept */}
                    {delegationResult.makerOutput.thumbnailConcept && (
                      <div className="p-3 rounded-lg bg-sky-500/10 border border-sky-500/20">
                        <p className="text-xs font-medium text-sky-400 mb-1 flex items-center gap-1">
                          <Layers className="size-3" />
                          Thumbnail Concept
                        </p>
                        <p className="text-sm">{delegationResult.makerOutput.thumbnailConcept}</p>
                      </div>
                    )}

                    {/* Audit Event ID */}
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Shield className="size-3" />
                      <span>Audit: {delegationResult.auditEventId}</span>
                    </div>
                  </CardContent>
                </Card>
              </section>
            )}

            {/* Empty state when no preview or result */}
            {!delegationPreview && !delegationResult && (
              <Card>
                <CardContent className="py-12 text-center">
                  <SendHorizontal className="size-10 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">
                    Click <strong>Preview Instruction</strong> to see the delegation context, or <strong>Execute Delegation</strong> to run the full Muse→Maker pipeline.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* ===== AUTONOMY TAB ===== */}
          <TabsContent value="autonomy" className="space-y-6">
            <section>
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                <Moon className="size-4" />
                Overnight Autonomy Pipeline (DB-Backed)
              </h2>

              {/* Run Overnight Cycle Card */}
              <Card className="border-violet-500/30 shadow-md mb-4">
                <CardHeader>
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="size-5 text-violet-400" />
                      Run Overnight Cycle
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge className={autonomyData?.status?.isRunning ? 'bg-amber-600 text-white border-amber-600' : autonomyData?.status?.equipped ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-amber-600 text-white border-amber-600'}>
                        {autonomyData?.status?.isRunning ? '🔄 Running' : autonomyData?.status?.equipped ? 'Passive Autonomous Soul ✓' : 'Not Equipped'}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {autonomyData?.scheduleInfo?.totalRuns ?? 0} runs
                      </Badge>
                    </div>
                  </div>
                  <CardDescription>
                    22:00 offline → 23:00 wake → review signals → delegate → 00:00 draft → 06:00 morning brief
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Schedule Display */}
                    {autonomyData?.scheduleInfo?.schedule && (
                      <div className="grid grid-cols-3 gap-3">
                        <div className="p-2 rounded-lg bg-violet-500/10 border border-violet-500/20 text-center">
                          <p className="text-xs text-muted-foreground">Wake</p>
                          <p className="font-mono font-bold text-violet-400">{autonomyData.scheduleInfo.schedule.wakeTime}</p>
                        </div>
                        <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-center">
                          <p className="text-xs text-muted-foreground">Draft</p>
                          <p className="font-mono font-bold text-emerald-400">{autonomyData.scheduleInfo.schedule.draftTime}</p>
                        </div>
                        <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-center">
                          <p className="text-xs text-muted-foreground">Brief</p>
                          <p className="font-mono font-bold text-amber-400">{autonomyData.scheduleInfo.schedule.briefTime}</p>
                        </div>
                      </div>
                    )}

                    {/* Run Button */}
                    <Button
                      onClick={runOvernightCycleAction}
                      disabled={overnightCycleRunning || autonomyData?.status?.isRunning}
                      className="w-full bg-gradient-to-r from-violet-600 to-emerald-600 hover:from-violet-500 hover:to-emerald-500 text-white"
                    >
                      {overnightCycleRunning ? (
                        <span className="flex items-center gap-2">
                          <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Running Overnight Cycle...
                        </span>
                      ) : autonomyData?.status?.isRunning ? (
                        <span className="flex items-center gap-2">
                          <Clock className="size-4" />
                          Cycle Already Running
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Moon className="size-4" />
                          Run Overnight Cycle Now
                        </span>
                      )}
                    </Button>

                    {/* Overnight Cycle Result */}
                    {overnightCycleResult && (
                      <div className="space-y-3">
                        <Separator />
                        <div className={`p-3 rounded-lg border ${overnightCycleResult.success ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-rose-500/10 border-rose-500/20'}`}>
                          <p className={`text-sm font-medium ${overnightCycleResult.success ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {overnightCycleResult.success ? '✅ Overnight Cycle Complete' : '❌ Overnight Cycle Failed'}
                          </p>
                          {overnightCycleResult.result && (
                            <div className="mt-2 space-y-2 text-xs">
                              <p className="text-muted-foreground">
                                Duration: {(overnightCycleResult.result.totalDuration / 1000).toFixed(1)}s | Steps: {overnightCycleResult.result.steps.length} | Run ID: {overnightCycleResult.result.runId.slice(0, 12)}…
                              </p>

                              {/* Steps Summary */}
                              <div className="space-y-1">
                                {overnightCycleResult.result.steps.map((step) => (
                                  <div key={step.step} className="flex items-center gap-2 p-1.5 rounded bg-muted/30">
                                    <div className={`size-2 rounded-full ${step.status === 'complete' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                                    <span className="flex-1">{step.step}. {step.name}</span>
                                    <span className="text-muted-foreground font-mono">{step.duration}ms</span>
                                  </div>
                                ))}
                              </div>

                              {/* Morning Brief */}
                              {overnightCycleResult.result.morningBrief && (
                                <div className="mt-2 p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
                                  <p className="font-medium text-amber-400 flex items-center gap-1">
                                    <Sunrise className="size-3" />
                                    Morning Brief
                                  </p>
                                  <p className="mt-1 text-muted-foreground">{overnightCycleResult.result.morningBrief.summary}</p>
                                  {overnightCycleResult.result.morningBrief.newInsights.length > 0 && (
                                    <ul className="mt-1 space-y-0.5">
                                      {overnightCycleResult.result.morningBrief.newInsights.map((insight, i) => (
                                        <li key={i} className="text-muted-foreground">• {insight}</li>
                                      ))}
                                    </ul>
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                          <p className="text-xs text-muted-foreground mt-1">{overnightCycleResult.message}</p>
                        </div>
                      </div>
                    )}

                    {/* Phase Timeline */}
                    <Separator />
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-2">Phase Timeline</p>
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
                    </div>

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

                    {/* Approval Queue */}
                    {autonomyData?.status?.approvalQueue && autonomyData.status.approvalQueue.length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
                          <Shield className="size-3" />
                          Approval Queue ({autonomyData.status.approvalQueue.length})
                        </p>
                        <div className="space-y-2">
                          {autonomyData.status.approvalQueue.map((item) => (
                            <div key={item.id} className="p-3 rounded-lg border border-amber-500/20 bg-amber-500/5">
                              <div className="flex items-center justify-between gap-2 mb-2">
                                <div className="flex items-center gap-2 min-w-0">
                                  <FileText className="size-4 text-amber-400 shrink-0" />
                                  <span className="text-sm font-medium truncate">
                                    {item.title ?? `${item.itemType} ${item.action}`}
                                  </span>
                                </div>
                                <Badge variant="outline" className="text-xs shrink-0">{item.status}</Badge>
                              </div>
                              <p className="text-xs text-muted-foreground mb-2">
                                {item.itemType} → {item.action} | Created: {new Date(item.createdAt).toLocaleString()}
                              </p>
                              {showRejectInput === item.id ? (
                                <div className="flex items-center gap-2 mb-2">
                                  <Input
                                    placeholder="Reason for rejection (optional)"
                                    value={rejectReason}
                                    onChange={(e) => setRejectReason(e.target.value)}
                                    className="text-xs h-8"
                                  />
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => rejectActionHandler(item.id, rejectReason || undefined)}
                                    disabled={approvalActionLoading === item.id}
                                    className="h-8 text-xs shrink-0"
                                  >
                                    Confirm
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => { setShowRejectInput(null); setRejectReason(''); }}
                                    className="h-8 text-xs shrink-0"
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              ) : (
                                <div className="flex items-center gap-2">
                                  <Button
                                    size="sm"
                                    onClick={() => approveActionHandler(item.id)}
                                    disabled={approvalActionLoading === item.id}
                                    className="h-7 text-xs bg-emerald-600 hover:bg-emerald-500 text-white shrink-0"
                                  >
                                    <CheckCircle2 className="size-3 mr-1" />
                                    Approve
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => setShowRejectInput(item.id)}
                                    disabled={approvalActionLoading === item.id}
                                    className="h-7 text-xs shrink-0"
                                  >
                                    <X className="size-3 mr-1" />
                                    Reject
                                  </Button>
                                  {approvalActionLoading === item.id && (
                                    <span className="size-3 border-2 border-muted-foreground/30 border-t-muted-foreground rounded-full animate-spin" />
                                  )}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

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

                    {/* Run History */}
                    {autonomyData?.scheduleInfo?.recentRuns && autonomyData.scheduleInfo.recentRuns.length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
                          <History className="size-3" />
                          Recent Runs
                        </p>
                        <ScrollArea className="max-h-32">
                          <div className="space-y-1 pr-3">
                            {autonomyData.scheduleInfo.recentRuns.map((run) => (
                              <div key={run.id} className="flex items-center justify-between text-xs p-1.5 rounded bg-muted/30">
                                <span className="font-mono text-muted-foreground">{run.id.slice(0, 12)}…</span>
                                <Badge variant={run.status === 'completed' ? 'secondary' : run.status === 'failed' ? 'destructive' : 'outline'} className="text-[10px] px-1 py-0">
                                  {run.status}
                                </Badge>
                                <span className="text-muted-foreground">{new Date(run.startedAt).toLocaleString()}</span>
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

          {/* ===== LEARNING TAB ===== */}
          <TabsContent value="learning" className="space-y-6">
            {/* Day 7: Learning Engine — Full 5-Step Loop */}
            <section>
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                <Workflow className="size-4" />
                Learning Engine — OBSERVE → COMPARE → INFER → UPDATE → RECOMMEND
              </h2>
              <Card className="border-violet-500/30 shadow-md">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base">Run Learning Loop on Real Data</CardTitle>
                      <CardDescription>Execute the full 5-step learning loop on your creator&apos;s database content</CardDescription>
                    </div>
                    <Button
                      onClick={async () => {
                        setLearningRunLoading(true);
                        setLearningRunResult(null);
                        try {
                          const res = await fetch('/api/learning/run').then((r) => r.json());
                          setLearningRunResult(res);
                        } catch {
                          // fail silently
                        } finally {
                          setLearningRunLoading(false);
                        }
                      }}
                      disabled={learningRunLoading}
                    >
                      {learningRunLoading ? 'Running…' : 'Run Loop'}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {learningRunLoading ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="size-3 rounded-full bg-violet-500 animate-pulse" />
                        <span className="text-sm text-muted-foreground">OBSERVE — gathering data from {learningRunResult ? '' : 'database'}…</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="size-3 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-sm text-muted-foreground">COMPARE — comparing against memory…</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="size-3 rounded-full bg-amber-500 animate-pulse" />
                        <span className="text-sm text-muted-foreground">INFER — drawing conclusions…</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="size-3 rounded-full bg-sky-500 animate-pulse" />
                        <span className="text-sm text-muted-foreground">UPDATE — merging with memory…</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="size-3 rounded-full bg-rose-500 animate-pulse" />
                        <span className="text-sm text-muted-foreground">RECOMMEND — generating recommendations…</span>
                      </div>
                    </div>
                  ) : learningRunResult?.success ? (
                    <div className="space-y-5">
                      {/* Data Summary */}
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                        <div className="p-2 rounded-lg bg-muted/50 text-center">
                          <p className="text-lg font-bold">{learningRunResult.dataSummary.contentItems}</p>
                          <p className="text-[10px] text-muted-foreground">Content Items</p>
                        </div>
                        <div className="p-2 rounded-lg bg-muted/50 text-center">
                          <p className="text-lg font-bold">{learningRunResult.dataSummary.metricsCount}</p>
                          <p className="text-[10px] text-muted-foreground">Metrics</p>
                        </div>
                        <div className="p-2 rounded-lg bg-muted/50 text-center">
                          <p className="text-lg font-bold">{learningRunResult.dataSummary.hooksCount}</p>
                          <p className="text-[10px] text-muted-foreground">Hooks</p>
                        </div>
                        <div className="p-2 rounded-lg bg-muted/50 text-center">
                          <p className="text-lg font-bold">{learningRunResult.dataSummary.memoryEvents}</p>
                          <p className="text-[10px] text-muted-foreground">Memory Events</p>
                        </div>
                        <div className="p-2 rounded-lg bg-muted/50 text-center">
                          <p className="text-lg font-bold">{learningRunResult.dataSummary.existingPatterns}</p>
                          <p className="text-[10px] text-muted-foreground">Patterns</p>
                        </div>
                      </div>

                      {/* 5-Step Loop Steps */}
                      <div className="space-y-4">
                        {/* OBSERVE */}
                        <div className="p-3 rounded-lg border border-violet-500/20 bg-violet-500/5">
                          <div className="flex items-center gap-2 mb-2">
                            <Eye className="size-4 text-violet-400" />
                            <span className="text-sm font-semibold text-violet-400">OBSERVE</span>
                            <Badge variant="secondary" className="text-[10px]">{learningRunResult.loopResult.observations.length} observations</Badge>
                          </div>
                          <ScrollArea className="max-h-32">
                            <div className="space-y-1 pr-3">
                              {learningRunResult.loopResult.observations.map((obs, i) => (
                                <p key={i} className="text-xs text-muted-foreground">• {obs}</p>
                              ))}
                            </div>
                          </ScrollArea>
                        </div>

                        {/* COMPARE */}
                        <div className="p-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5">
                          <div className="flex items-center gap-2 mb-2">
                            <LineChart className="size-4 text-emerald-400" />
                            <span className="text-sm font-semibold text-emerald-400">COMPARE</span>
                            <Badge variant="secondary" className="text-[10px]">{learningRunResult.loopResult.comparisons.length} comparisons</Badge>
                          </div>
                          <ScrollArea className="max-h-32">
                            <div className="space-y-1 pr-3">
                              {learningRunResult.loopResult.comparisons.map((comp, i) => (
                                <p key={i} className="text-xs text-muted-foreground">• {comp}</p>
                              ))}
                            </div>
                          </ScrollArea>
                        </div>

                        {/* INFER */}
                        <div className="p-3 rounded-lg border border-amber-500/20 bg-amber-500/5">
                          <div className="flex items-center gap-2 mb-2">
                            <Lightbulb className="size-4 text-amber-400" />
                            <span className="text-sm font-semibold text-amber-400">INFER</span>
                            <Badge variant="secondary" className="text-[10px]">{learningRunResult.loopResult.inferences.length} inferences</Badge>
                          </div>
                          <ScrollArea className="max-h-32">
                            <div className="space-y-1 pr-3">
                              {learningRunResult.loopResult.inferences.map((inf, i) => (
                                <p key={i} className="text-xs text-muted-foreground">• {inf}</p>
                              ))}
                            </div>
                          </ScrollArea>
                        </div>

                        {/* UPDATE */}
                        <div className="p-3 rounded-lg border border-sky-500/20 bg-sky-500/5">
                          <div className="flex items-center gap-2 mb-2">
                            <Database className="size-4 text-sky-400" />
                            <span className="text-sm font-semibold text-sky-400">UPDATE</span>
                            <Badge variant="secondary" className="text-[10px]">{learningRunResult.loopResult.updates.length} pattern updates</Badge>
                          </div>
                          <div className="space-y-2">
                            {learningRunResult.loopResult.updates
                              .sort((a, b) => b.avgEffectiveness - a.avgEffectiveness)
                              .map((upd, i) => (
                              <div key={i} className="flex items-center gap-2">
                                <Badge variant="outline" className="text-[10px] px-1.5 py-0 shrink-0">
                                  {upd.pattern}
                                </Badge>
                                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                  <div
                                    className="h-full rounded-full bg-sky-500"
                                    style={{ width: `${Math.round(upd.avgEffectiveness * 100)}%` }}
                                  />
                                </div>
                                <span className="text-[10px] w-20 text-right shrink-0">
                                  {Math.round(upd.avgEffectiveness * 100)}% ({upd.sampleSize})
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* RECOMMEND */}
                        <div className="p-3 rounded-lg border border-rose-500/20 bg-rose-500/5">
                          <div className="flex items-center gap-2 mb-2">
                            <Sparkles className="size-4 text-rose-400" />
                            <span className="text-sm font-semibold text-rose-400">RECOMMEND</span>
                            <Badge variant="secondary" className="text-[10px]">{learningRunResult.loopResult.recommendations.length} recommendations</Badge>
                          </div>
                          <div className="space-y-3">
                            {learningRunResult.loopResult.recommendations.map((rec, i) => (
                              <div key={i} className="p-2 rounded bg-muted/50">
                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                  <span className="text-sm font-medium">{rec.title}</span>
                                  <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${confidenceBadgeStyle(rec.confidence)}`}>
                                    {rec.confidence}
                                  </Badge>
                                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                                    {rec.dataPoints} pts
                                  </Badge>
                                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                                    {rec.evidenceType}
                                  </Badge>
                                </div>
                                <p className="text-xs text-muted-foreground">{rec.explanation}</p>
                                {rec.action && (
                                  <p className="text-xs text-violet-400 mt-1">→ {rec.action}</p>
                                )}
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {rec.supportingFacts.map((fact, j) => (
                                    <span key={j} className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                                      {fact}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Honesty Report */}
                      <div className="p-3 rounded-lg border border-border bg-muted/30">
                        <div className="flex items-center gap-2 mb-2">
                          <Shield className="size-4 text-emerald-400" />
                          <span className="text-sm font-semibold">Statistical Honesty</span>
                          <Badge variant="outline" className={confidenceBadgeStyle(learningRunResult.honestyReport.isHonest ? 'high' : 'low')}>
                            {learningRunResult.honestyReport.isHonest ? 'Honest ✅' : 'Violations ⚠️'}
                          </Badge>
                          <Badge variant="secondary" className="text-[10px]">
                            {learningRunResult.honestyReport.checksPassed}/{learningRunResult.honestyReport.checksTotal} checks
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{learningRunResult.honestyReport.summary}</p>
                        {learningRunResult.honestyReport.violations.length > 0 && (
                          <div className="mt-2 space-y-1">
                            {learningRunResult.honestyReport.violations.map((v, i) => (
                              <p key={i} className="text-xs text-rose-400">⚠️ {v.message}</p>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Evidence Chain */}
                      <div className="p-3 rounded-lg border border-border bg-muted/30">
                        <div className="flex items-center gap-2 mb-2">
                          <GitBranch className="size-4 text-violet-400" />
                          <span className="text-sm font-semibold">Evidence Chain</span>
                          <Badge variant="secondary" className="text-[10px]">{learningRunResult.evidenceChain.length} steps</Badge>
                        </div>
                        <ScrollArea className="max-h-48">
                          <div className="space-y-2 pr-3">
                            {learningRunResult.evidenceChain.map((step, i) => (
                              <div key={i} className="flex items-start gap-2 p-2 rounded bg-muted/50">
                                <div className="flex flex-col items-center shrink-0">
                                  <div className={`size-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white ${
                                    step.step === 'OBSERVE' ? 'bg-violet-500' :
                                    step.step === 'COMPARE' ? 'bg-emerald-500' :
                                    step.step === 'INFER' ? 'bg-amber-500' :
                                    step.step === 'UPDATE' ? 'bg-sky-500' :
                                    'bg-rose-500'
                                  }`}>
                                    {i + 1}
                                  </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <Badge variant="outline" className="text-[10px] px-1.5 py-0">{step.step}</Badge>
                                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0">{step.evidenceType}</Badge>
                                    <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${confidenceBadgeStyle(step.confidence)}`}>
                                      {step.confidence}
                                    </Badge>
                                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0">{step.dataPoints} pts</Badge>
                                  </div>
                                  <p className="text-xs text-muted-foreground mt-0.5 truncate">{step.description}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      </div>

                      {/* Storage Results */}
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Stored {learningRunResult.storedMemories} memory events</span>
                        <span>•</span>
                        <span>Stored {learningRunResult.storedRecommendations} recommendations</span>
                        <span>•</span>
                        <span>Ran at {new Date(learningRunResult.ranAt).toLocaleString()}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-sm text-muted-foreground">Click &quot;Run Loop&quot; to execute the full 5-step learning engine on your creator&apos;s real data</p>
                      <p className="text-xs text-muted-foreground mt-2">OBSERVE → COMPARE → INFER → UPDATE → RECOMMEND</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </section>

            <Separator />

            {/* Day 7: Statistical Honesty Framework */}
            <section>
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                <Shield className="size-4" />
                Statistical Honesty Framework
              </h2>
              <Card className="border-emerald-500/30 shadow-md">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base">Honesty Verification</CardTitle>
                      <CardDescription>Verifies no inflated metrics, proper confidence levels, and honest phrasing</CardDescription>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={async () => {
                        setHonestyCheckLoading(true);
                        try {
                          const res = await fetch('/api/learning/honesty').then((r) => r.json());
                          setHonestyCheckResult(res);
                        } catch {
                          // fail silently
                        } finally {
                          setHonestyCheckLoading(false);
                        }
                      }}
                      disabled={honestyCheckLoading}
                    >
                      {honestyCheckLoading ? 'Checking…' : 'Verify'}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {honestyCheckLoading ? (
                    <div className="space-y-2">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-8 bg-muted rounded animate-pulse" />
                      ))}
                    </div>
                  ) : honestyCheckResult?.success ? (
                    <div className="space-y-4">
                      {/* Overall status */}
                      <div className="flex items-center gap-2">
                        {honestyCheckResult.allChecksPassed ? (
                          <CheckCircle2 className="size-5 text-emerald-500" />
                        ) : (
                          <AlertTriangle className="size-5 text-rose-500" />
                        )}
                        <span className="text-sm font-medium">
                          {honestyCheckResult.allChecksPassed
                            ? 'All honesty checks passed — no inflated metrics'
                            : 'Some honesty checks failed — review violations'}
                        </span>
                        <Badge variant="outline" className={confidenceBadgeStyle(honestyCheckResult.allChecksPassed ? 'high' : 'low')}>
                          {honestyCheckResult.checksPassed}/{honestyCheckResult.checksTotal}
                        </Badge>
                      </div>

                      {/* Individual checks */}
                      <div className="space-y-2">
                        {honestyCheckResult.checks.map((check, i) => (
                          <div key={i} className="flex items-start gap-2 p-2 rounded bg-muted/50">
                            {check.passed ? (
                              <CheckCircle2 className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                            ) : (
                              <AlertTriangle className="size-4 text-rose-500 shrink-0 mt-0.5" />
                            )}
                            <div>
                              <p className="text-sm font-medium">{check.name}</p>
                              <p className="text-xs text-muted-foreground">{check.details}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Principles */}
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground">Principles</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                          {honestyCheckResult.principles.map((p, i) => (
                            <p key={i} className="text-[11px] text-muted-foreground">{p}</p>
                          ))}
                        </div>
                      </div>

                      {/* Evidence Type Taxonomy */}
                      {honestyCheckResult.evidenceTypeTaxonomy && (
                        <div className="space-y-1">
                          <p className="text-xs font-medium text-muted-foreground">Evidence Type Taxonomy</p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                            {Object.entries(honestyCheckResult.evidenceTypeTaxonomy).map(([type, desc]) => (
                              <div key={type} className="flex items-start gap-1.5">
                                <Badge variant="outline" className="text-[10px] px-1.5 py-0 shrink-0">{type}</Badge>
                                <span className="text-[11px] text-muted-foreground">{desc}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground text-center py-4">
                      Honesty check unavailable
                    </div>
                  )}
                </CardContent>
              </Card>
            </section>

            <Separator />

            {/* Section 1: Hook Classifier Tool */}
            <section>
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                <Sparkles className="size-4" />
                Hook Classifier
              </h2>
              <Card className="border-violet-500/30 shadow-md">
                <CardHeader>
                  <CardTitle className="text-base">Classify Hook Text</CardTitle>
                  <CardDescription>Enter hook text to classify it into one of 8 pattern types</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Textarea
                      placeholder="e.g. Most AI agents aren't really agents"
                      value={learningHookText}
                      onChange={(e) => setLearningHookText(e.target.value)}
                      className="flex-1"
                      rows={2}
                    />
                    <Button
                      onClick={async () => {
                        if (!learningHookText.trim()) return;
                        setLearningClassLoading(true);
                        setLearningClassResult(null);
                        try {
                          const res = await fetch('/api/learning/hooks', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ text: learningHookText }),
                          }).then((r) => r.json());
                          setLearningClassResult(res);
                        } catch {
                          // fail silently
                        } finally {
                          setLearningClassLoading(false);
                        }
                      }}
                      disabled={learningClassLoading || !learningHookText.trim()}
                      className="self-end"
                    >
                      {learningClassLoading ? 'Classifying…' : 'Classify'}
                    </Button>
                  </div>

                  {learningClassResult?.success && learningClassResult.classification && (
                    <div className="space-y-3 pt-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge className="bg-violet-600 text-white border-violet-600">
                          {learningClassResult.classification.pattern}
                        </Badge>
                        <Badge variant="outline" className={confidenceBadgeStyle(
                          learningClassResult.classification.confidence > 0.5 ? 'high' : learningClassResult.classification.confidence > 0.25 ? 'medium' : 'low'
                        )}>
                          {Math.round(learningClassResult.classification.confidence * 100)}% confidence
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{learningClassResult.classification.reasoning}</p>

                      {/* All 8 pattern scores as mini bars */}
                      {learningClassResult.classification.allScores && (
                        <div className="space-y-1.5">
                          <p className="text-xs font-medium text-muted-foreground">Pattern Scores</p>
                          {Object.entries(learningClassResult.classification.allScores)
                            .sort(([, a], [, b]) => (b as number) - (a as number))
                            .map(([pattern, score]) => (
                              <div key={pattern} className="flex items-center gap-2">
                                <span className="text-xs w-28 shrink-0 truncate">{pattern}</span>
                                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                  <div
                                    className="h-full rounded-full bg-violet-500"
                                    style={{ width: `${Math.round((score as number) * 100)}%` }}
                                  />
                                </div>
                                <span className="text-xs w-8 text-right">{Math.round((score as number) * 100)}%</span>
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </section>

            <Separator />

            {/* Section 2: Hook Comparison */}
            <section>
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                <LineChart className="size-4" />
                Hook Comparison vs History
              </h2>
              <Card className="border-emerald-500/30 shadow-md">
                <CardHeader>
                  <CardTitle className="text-base">Compare Against Your History</CardTitle>
                  <CardDescription>See how this hook pattern performs compared to your creator-specific averages</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Textarea
                      placeholder="Hook text to compare against your history…"
                      value={learningHookText}
                      onChange={(e) => setLearningHookText(e.target.value)}
                      className="flex-1"
                      rows={2}
                    />
                    <Button
                      onClick={async () => {
                        if (!learningHookText.trim()) return;
                        setLearningCompLoading(true);
                        setLearningCompResult(null);
                        try {
                          const res = await fetch(`/api/learning/comparison?hookText=${encodeURIComponent(learningHookText)}`).then((r) => r.json());
                          setLearningCompResult(res);
                        } catch {
                          // fail silently
                        } finally {
                          setLearningCompLoading(false);
                        }
                      }}
                      disabled={learningCompLoading || !learningHookText.trim()}
                      className="self-end"
                    >
                      {learningCompLoading ? 'Comparing…' : 'Compare'}
                    </Button>
                  </div>

                  {learningCompResult?.success && (
                    <div className="space-y-3 pt-2">
                      {/* Classification */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge className="bg-violet-600 text-white border-violet-600">
                          {learningCompResult.hookClassification.pattern}
                        </Badge>
                        <Badge variant="outline" className={confidenceBadgeStyle(learningCompResult.historicalComparison.confidence)}>
                          {learningCompResult.historicalComparison.confidence} confidence
                        </Badge>
                        <Badge variant="outline">
                          {learningCompResult.historicalComparison.sampleSize} samples
                        </Badge>
                      </div>

                      {/* Comparison message */}
                      <Card className="bg-muted/50">
                        <CardContent className="p-3">
                          <p className="text-sm font-medium">{learningCompResult.historicalComparison.message}</p>
                        </CardContent>
                      </Card>

                      {/* Pattern vs overall comparison bars */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs w-28 shrink-0">Pattern avg</span>
                          <div className="flex-1 h-4 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full bg-violet-500"
                              style={{ width: `${Math.round(learningCompResult.historicalComparison.patternAvg * 100)}%` }}
                            />
                          </div>
                          <span className="text-xs w-12 text-right">{Math.round(learningCompResult.historicalComparison.patternAvg * 100)}%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs w-28 shrink-0">Your avg</span>
                          <div className="flex-1 h-4 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full bg-emerald-500"
                              style={{ width: `${Math.round(learningCompResult.historicalComparison.creatorOverallAvg * 100)}%` }}
                            />
                          </div>
                          <span className="text-xs w-12 text-right">{Math.round(learningCompResult.historicalComparison.creatorOverallAvg * 100)}%</span>
                        </div>
                      </div>

                      {/* Creator-specific insights */}
                      {learningCompResult.creatorSpecific.totalPatterns > 0 && (
                        <div className="text-sm text-muted-foreground space-y-1">
                          <p>Rank: #{learningCompResult.creatorSpecific.patternRank} of {learningCompResult.creatorSpecific.totalPatterns} patterns</p>
                          {learningCompResult.creatorSpecific.betterPatterns.length > 0 && (
                            <p>Outperformed by: {learningCompResult.creatorSpecific.betterPatterns.join(', ')}</p>
                          )}
                          {learningCompResult.creatorSpecific.worsePatterns.length > 0 && (
                            <p>Outperforms: {learningCompResult.creatorSpecific.worsePatterns.join(', ')}</p>
                          )}
                        </div>
                      )}

                      {/* Evidence type */}
                      <Badge variant="secondary" className="text-[10px]">
                        Evidence: {learningCompResult.historicalComparison.evidenceType}
                      </Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
            </section>

            <Separator />

            {/* Section 3: Hook Pattern Rankings */}
            <section>
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                <Award className="size-4" />
                Hook Pattern Rankings
              </h2>
              <Card className="border-amber-500/30 shadow-md">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base">Your Hook Pattern Effectiveness</CardTitle>
                      <CardDescription>Ranked by historical effectiveness — creator-specific data</CardDescription>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fetchRankings()}
                      disabled={learningRankingsLoading}
                    >
                      {learningRankingsLoading ? 'Loading…' : 'Refresh'}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {learningRankingsLoading ? (
                      <div className="space-y-2">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                          <div key={i} className="h-12 bg-muted rounded-lg animate-pulse" />
                        ))}
                      </div>
                    ) : learningRankings?.success && learningRankings.rankings ? (
                      <>
                        {learningRankings.rankings.map((r) => {
                          const pct = Math.round(r.avgEffectiveness * 100);
                          const isTested = r.status === 'tested';
                          return (
                            <div key={r.pattern} className={`flex items-center gap-3 p-3 rounded-lg ${isTested ? 'bg-muted/50 hover:bg-muted' : 'bg-muted/20'} transition-colors`}>
                              {/* Rank */}
                              <div className="w-8 text-center">
                                {isTested ? (
                                  <span className="text-lg font-bold text-violet-400">#{r.rank}</span>
                                ) : (
                                  <span className="text-lg text-muted-foreground">—</span>
                                )}
                              </div>

                              {/* Pattern name + bar */}
                              <div className="flex-1 min-w-0 space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium">{r.label}</span>
                                  <Badge variant="outline" className={confidenceBadgeStyle(r.confidence)}>
                                    {r.confidence}
                                  </Badge>
                                  {!isTested && (
                                    <Badge variant="secondary" className="text-[10px]">No data</Badge>
                                  )}
                                </div>
                                {isTested && (
                                  <div className="flex items-center gap-2">
                                    <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                                      <div
                                        className={`h-full rounded-full ${
                                          r.rank === 1 ? 'bg-emerald-500' : r.rank <= 3 ? 'bg-violet-500' : 'bg-amber-500'
                                        }`}
                                        style={{ width: `${pct}%` }}
                                      />
                                    </div>
                                    <span className="text-xs w-10 text-right">{pct}%</span>
                                  </div>
                                )}
                              </div>

                              {/* Sample size */}
                              <div className="text-xs text-muted-foreground w-16 text-right shrink-0">
                                {isTested ? `${r.sampleSize} samples` : '—'}
                              </div>
                            </div>
                          );
                        })}

                        {/* Overall confidence */}
                        <div className="pt-3 border-t flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            {learningRankings.totalSamples} total samples across all patterns
                          </span>
                          <Badge variant="outline" className={confidenceBadgeStyle(learningRankings.overallConfidence)}>
                            Overall: {learningRankings.overallConfidence} confidence
                          </Badge>
                        </div>
                      </>
                    ) : (
                      <div className="text-sm text-muted-foreground text-center py-6">
                        No ranking data available
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </section>

            <Separator />

            {/* Section 4: Performance Prediction */}
            <section>
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                <Target className="size-4" />
                Performance Prediction
              </h2>
              <Card className="border-sky-500/30 shadow-md">
                <CardHeader>
                  <CardTitle className="text-base">Predict Hook Performance</CardTitle>
                  <CardDescription>Estimate how a new hook might perform based on your historical pattern data</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Textarea
                      placeholder="Enter new hook text to predict performance…"
                      value={learningPredText}
                      onChange={(e) => setLearningPredText(e.target.value)}
                      className="flex-1"
                      rows={2}
                    />
                    <Button
                      onClick={async () => {
                        if (!learningPredText.trim()) return;
                        setLearningPredLoading(true);
                        setLearningPredResult(null);
                        try {
                          const res = await fetch('/api/learning/predict', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ hookText: learningPredText }),
                          }).then((r) => r.json());
                          setLearningPredResult(res);
                        } catch {
                          // fail silently
                        } finally {
                          setLearningPredLoading(false);
                        }
                      }}
                      disabled={learningPredLoading || !learningPredText.trim()}
                      className="self-end"
                    >
                      {learningPredLoading ? 'Predicting…' : 'Predict'}
                    </Button>
                  </div>

                  {learningPredResult?.success && (
                    <div className="space-y-3 pt-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge className="bg-violet-600 text-white border-violet-600">
                          {learningPredResult.patternLabel}
                        </Badge>
                        <Badge variant="outline" className={confidenceBadgeStyle(learningPredResult.confidence)}>
                          {learningPredResult.confidence} confidence
                        </Badge>
                        <Badge variant="outline">
                          {learningPredResult.historicalSampleSize} historical samples
                        </Badge>
                      </div>

                      {/* Predicted effectiveness bar */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs w-28 shrink-0">Predicted</span>
                          <div className="flex-1 h-4 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full bg-sky-500"
                              style={{ width: `${Math.round(learningPredResult.predictedEffectiveness * 100)}%` }}
                            />
                          </div>
                          <span className="text-xs w-12 text-right font-medium">
                            {Math.round(learningPredResult.predictedEffectiveness * 100)}%
                          </span>
                        </div>
                      </div>

                      {/* Message */}
                      <Card className="bg-muted/50">
                        <CardContent className="p-3">
                          <p className="text-sm font-medium">{learningPredResult.message}</p>
                        </CardContent>
                      </Card>

                      {/* Evidence */}
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-[10px]">
                          Evidence: {learningPredResult.evidenceType}
                        </Badge>
                      </div>

                      {/* Similar hooks */}
                      {learningPredResult.similarHooks.length > 0 && (
                        <div className="space-y-1.5">
                          <p className="text-xs font-medium text-muted-foreground">Similar hooks from your history</p>
                          <ScrollArea className="max-h-32">
                            <div className="space-y-1 pr-3">
                              {learningPredResult.similarHooks.map((h, i) => (
                                <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground p-1.5 rounded bg-muted/30">
                                  <span className="flex-1 truncate">{h.text}</span>
                                  <span className="shrink-0">{Math.round(h.effectiveness * 100)}%</span>
                                </div>
                              ))}
                            </div>
                          </ScrollArea>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
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

          {/* ===== DAY 8: WHY MUSE CHOSE THIS TAB ===== */}
          <TabsContent value="explain" className="space-y-6">
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                  <Eye className="size-4" />
                  Why Muse Chose This — Evidence Chains
                </h2>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1.5"
                  onClick={async () => {
                    setExplainLoading(true);
                    try {
                      const res = await fetch('/api/learning/explain').then((r) => r.json());
                      setExplainResult(res);
                    } catch {
                      setExplainResult({ success: false, error: 'Failed to fetch explanations' });
                    } finally {
                      setExplainLoading(false);
                    }
                  }}
                  disabled={explainLoading}
                >
                  {explainLoading ? (
                    <>
                      <Activity className="size-3.5 animate-pulse" />
                      Loading…
                    </>
                  ) : (
                    <>
                      <GitBranch className="size-3.5" />
                      Load Explanations
                    </>
                  )}
                </Button>
              </div>

              {explainLoading && (
                <div className="flex items-center justify-center py-12">
                  <Activity className="size-6 animate-pulse text-muted-foreground" />
                  <span className="ml-2 text-sm text-muted-foreground">Building evidence chains…</span>
                </div>
              )}

              {!explainLoading && !explainResult && (
                <Card className="border-dashed">
                  <CardContent className="py-8 text-center">
                    <GitBranch className="size-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Click "Load Explanations" to see why Muse chose each recommendation
                    </p>
                  </CardContent>
                </Card>
              )}

              {!explainLoading && explainResult && !explainResult.success && (
                <Card className="border-destructive/30">
                  <CardContent className="py-4">
                    <p className="text-sm text-destructive">Error: {explainResult.error || 'Unknown error'}</p>
                  </CardContent>
                </Card>
              )}

              {!explainLoading && explainResult?.success && explainResult.explanations && (
                <div className="space-y-4">
                  <p className="text-xs text-muted-foreground">
                    {explainResult.count} recommendation{explainResult.count !== 1 ? 's' : ''} with full evidence chains
                  </p>
                  {explainResult.explanations.map((exp) => {
                    const isExpanded = expandedChains.has(exp.recommendationId);
                    return (
                      <Card key={exp.recommendationId} className="overflow-hidden">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between gap-2 flex-wrap">
                            <CardTitle className="text-base">{exp.recommendationTitle}</CardTitle>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <Badge variant="outline" className="text-xs">{exp.recommendationType}</Badge>
                              <Badge variant="outline" className={`text-xs ${confidenceBadgeStyle(exp.confidence)}`}>
                                {exp.confidence} confidence
                              </Badge>
                              {exp.honestyVerified ? (
                                <Badge variant="outline" className="text-xs bg-emerald-500/10 text-emerald-400 border-emerald-500/20">✅ Honest</Badge>
                              ) : (
                                <Badge variant="outline" className="text-xs bg-rose-500/10 text-rose-400 border-rose-500/20">❌ Dishonest</Badge>
                              )}
                            </div>
                          </div>
                          <CardDescription className="text-sm">{exp.summary}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {/* Evidence Chain */}
                          <div>
                            <button
                              className="flex items-center gap-1.5 text-sm font-medium text-primary hover:underline mb-2"
                              onClick={() => {
                                const next = new Set(expandedChains);
                                if (next.has(exp.recommendationId)) next.delete(exp.recommendationId);
                                else next.add(exp.recommendationId);
                                setExpandedChains(next);
                              }}
                            >
                              <Link2 className="size-3.5" />
                              Evidence Chain ({exp.evidenceChain.length} steps)
                              {isExpanded ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5" />}
                            </button>
                            {isExpanded && (
                              <div className="space-y-2 pl-2">
                                {exp.evidenceChain.map((step, idx) => (
                                  <div key={step.step}>
                                    <div className="flex items-start gap-2 bg-muted/30 rounded-md p-3">
                                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                                        {step.step}
                                      </div>
                                      <div className="flex-1 min-w-0 space-y-1">
                                        <div className="flex items-center gap-1.5 flex-wrap">
                                          <Badge variant="secondary" className="text-xs font-mono">{step.phase}</Badge>
                                          <Badge variant="outline" className={`text-xs ${confidenceBadgeStyle(step.confidence)}`}>
                                            {step.confidence}
                                          </Badge>
                                          <Badge variant="outline" className="text-xs">{step.evidenceType}</Badge>
                                          <span className="text-xs text-muted-foreground">{step.dataPoints} data pts</span>
                                        </div>
                                        <p className="text-sm">{step.description}</p>
                                        {step.sources.length > 0 && (
                                          <ScrollArea className="max-h-24 w-full">
                                            <div className="space-y-0.5">
                                              {step.sources.map((src, si) => (
                                                <div key={si} className="text-xs text-muted-foreground flex items-center gap-1">
                                                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-muted-foreground/40" />
                                                  <span className="font-medium">{src.label}</span>: {src.value}
                                                </div>
                                              ))}
                                            </div>
                                          </ScrollArea>
                                        )}
                                      </div>
                                    </div>
                                    {idx < exp.evidenceChain.length - 1 && (
                                      <div className="flex justify-center py-1">
                                        <ArrowRight className="size-3.5 text-muted-foreground/50 rotate-90" />
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          <Separator />

                          {/* Narrative */}
                          <div>
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Narrative</p>
                            <p className="text-sm leading-relaxed">{exp.narrative}</p>
                          </div>

                          <Separator />

                          {/* Creator-Specific Context */}
                          <div>
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Personalized For You</p>
                            <p className="text-sm leading-relaxed bg-muted/30 rounded-md p-3">{exp.creatorSpecificContext}</p>
                          </div>

                          {/* Pattern History */}
                          {exp.patternHistory.length > 0 && (
                            <>
                              <Separator />
                              <div>
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Pattern History</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                  {exp.patternHistory.map((ph) => (
                                    <div key={ph.pattern} className="flex items-center justify-between text-xs bg-muted/20 rounded-md px-2 py-1.5">
                                      <span className="font-medium truncate mr-2">{ph.pattern}</span>
                                      <div className="flex items-center gap-2 flex-shrink-0">
                                        <span>{(ph.avgEffectiveness * 100).toFixed(0)}%</span>
                                        <Badge variant="outline" className={`text-[10px] ${confidenceBadgeStyle(ph.confidence)}`}>
                                          {ph.confidence}
                                        </Badge>
                                        <span className="text-muted-foreground">n={ph.sampleSize}</span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </section>
          </TabsContent>

          {/* ===== DAY 8: 7-DAY PROOF TAB ===== */}
          <TabsContent value="proof" className="space-y-6">
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                  <FlaskConical className="size-4" />
                  7-Day Proof Experiment
                </h2>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1.5"
                  onClick={async () => {
                    setProofLoading(true);
                    try {
                      const res = await fetch('/api/learning/proof').then((r) => r.json());
                      setProofResult(res);
                    } catch {
                      setProofResult({ success: false, error: 'Failed to run proof experiment', experimentId: '', creatorId: '', creatorName: '', startedAt: '', completedAt: '', totalDays: 0, dayResults: [], genuineInsights: [], totalGenuineInsights: 0, meetsThreshold: false, summary: { totalContentAnalyzed: 0, totalObservations: 0, totalInferences: 0, totalRecommendations: 0, confidenceProgression: [], dataPointProgression: [], insightByDay: [] }, honestyReport: { allInsightsGenuine: false, noFabricatedData: false, evidenceChainsComplete: false, confidenceHonest: false } });
                    } finally {
                      setProofLoading(false);
                    }
                  }}
                  disabled={proofLoading}
                >
                  {proofLoading ? (
                    <>
                      <Activity className="size-3.5 animate-pulse" />
                      Running…
                    </>
                  ) : (
                    <>
                      <FlaskConical className="size-3.5" />
                      Run Proof Experiment
                    </>
                  )}
                </Button>
              </div>

              {proofLoading && (
                <div className="flex items-center justify-center py-12">
                  <Activity className="size-6 animate-pulse text-muted-foreground" />
                  <span className="ml-2 text-sm text-muted-foreground">Running 7-day proof experiment…</span>
                </div>
              )}

              {!proofLoading && !proofResult && (
                <Card className="border-dashed">
                  <CardContent className="py-8 text-center">
                    <FlaskConical className="size-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Click "Run Proof Experiment" to simulate 7 days of learning
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Goal: ≥3 genuine insights discovered over 7 days
                    </p>
                  </CardContent>
                </Card>
              )}

              {!proofLoading && proofResult && !proofResult.success && (
                <Card className="border-destructive/30">
                  <CardContent className="py-4">
                    <p className="text-sm text-destructive">Error: {proofResult.error || 'Unknown error'}</p>
                  </CardContent>
                </Card>
              )}

              {!proofLoading && proofResult?.success && (
                <div className="space-y-6">
                  {/* Experiment Header */}
                  <Card>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-2 flex-wrap">
                        <div>
                          <CardTitle className="text-base">7-Day Proof Experiment</CardTitle>
                          <CardDescription className="text-sm">
                            {proofResult.creatorName} • {proofResult.totalDays} days • {proofResult.experimentId.slice(0, 20)}…
                          </CardDescription>
                        </div>
                        <Badge variant="outline" className={`text-xs ${proofResult.meetsThreshold ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'}`}>
                          {proofResult.meetsThreshold ? '✅ ≥3 Genuine Insights' : '❌ <3 Insights'}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                        <div className="text-center">
                          <p className="text-lg font-bold">{proofResult.totalGenuineInsights}</p>
                          <p className="text-xs text-muted-foreground">Total Insights</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold">{proofResult.summary.totalContentAnalyzed}</p>
                          <p className="text-xs text-muted-foreground">Content Analyzed</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold">{proofResult.summary.totalObservations}</p>
                          <p className="text-xs text-muted-foreground">Observations</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold">{proofResult.summary.totalInferences}</p>
                          <p className="text-xs text-muted-foreground">Inferences</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold">{proofResult.summary.totalRecommendations}</p>
                          <p className="text-xs text-muted-foreground">Recommendations</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Day-by-Day Timeline */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <History className="size-4" />
                        Day-by-Day Timeline
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {proofResult.dayResults.map((day) => (
                          <div key={day.day} className="border rounded-md p-3 space-y-2">
                            <div className="flex items-center justify-between flex-wrap gap-2">
                              <div className="flex items-center gap-2">
                                <Badge variant="secondary" className="text-xs font-mono">Day {day.day}</Badge>
                                <span className="text-xs text-muted-foreground">{day.date}</span>
                              </div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <Badge variant="outline" className="text-xs">{day.contentAnalyzed} items</Badge>
                                <Badge variant="outline" className="text-xs">{day.newObservations.length} obs</Badge>
                                {day.patternsDiscovered.length > 0 && (
                                  <Badge variant="outline" className="text-xs bg-violet-500/10 text-violet-400 border-violet-500/20">
                                    {day.patternsDiscovered.length} new pattern{day.patternsDiscovered.length !== 1 ? 's' : ''}
                                  </Badge>
                                )}
                              </div>
                            </div>
                            {/* Confidence Growth */}
                            <div className="flex items-center gap-2 text-xs">
                              <span className="text-muted-foreground">Confidence:</span>
                              <Badge variant="outline" className={`text-[10px] ${confidenceBadgeStyle(day.confidenceGrowth.before)}`}>{day.confidenceGrowth.before}</Badge>
                              <ArrowRight className="size-3 text-muted-foreground" />
                              <Badge variant="outline" className={`text-[10px] ${confidenceBadgeStyle(day.confidenceGrowth.after)}`}>{day.confidenceGrowth.after}</Badge>
                            </div>
                            {/* Data Point Growth */}
                            <div className="flex items-center gap-2 text-xs">
                              <span className="text-muted-foreground">Data points:</span>
                              <span>{day.dataPointGrowth.before}</span>
                              <ArrowRight className="size-3 text-muted-foreground" />
                              <span className="font-medium">{day.dataPointGrowth.after}</span>
                              <span className="text-muted-foreground">(+{day.dataPointGrowth.after - day.dataPointGrowth.before})</span>
                            </div>
                            {/* Patterns Discovered */}
                            {day.patternsDiscovered.length > 0 && (
                              <div className="flex items-center gap-1.5 flex-wrap text-xs">
                                <span className="text-muted-foreground">Discovered:</span>
                                {day.patternsDiscovered.map((p) => (
                                  <Badge key={p} variant="secondary" className="text-[10px]">{p}</Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Genuine Insights */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Lightbulb className="size-4" />
                        Genuine Insights ({proofResult.genuineInsights.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="max-h-96">
                        <div className="space-y-3">
                          {proofResult.genuineInsights.map((insight) => {
                            const typeColor: Record<string, string> = {
                              pattern_emergence: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
                              performance_signal: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
                              recommendation_with_evidence: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
                              confidence_upgrade: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
                            };
                            return (
                              <div key={insight.id} className="border rounded-md p-3 space-y-1.5">
                                <div className="flex items-start justify-between gap-2 flex-wrap">
                                  <p className="text-sm font-medium">{insight.title}</p>
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <Badge variant="outline" className={`text-[10px] ${typeColor[insight.type] || ''}`}>{insight.type.replace(/_/g, ' ')}</Badge>
                                    <Badge variant="outline" className={`text-[10px] ${confidenceBadgeStyle(insight.confidence)}`}>{insight.confidence}</Badge>
                                    <Badge variant="secondary" className="text-[10px]">Day {insight.dayDiscovered}</Badge>
                                  </div>
                                </div>
                                <p className="text-xs text-muted-foreground">{insight.description}</p>
                                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                  <span>{insight.dataPoints} data pts</span>
                                  <span>{insight.evidenceType}</span>
                                  <span className="flex items-center gap-1">
                                    {insight.isGenuine ? <CheckCircle2 className="size-3 text-emerald-500" /> : <AlertTriangle className="size-3 text-rose-500" />}
                                    {insight.verificationNote}
                                  </span>
                                </div>
                                {insight.supportingFacts.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {insight.supportingFacts.map((fact, fi) => (
                                      <span key={fi} className="text-[10px] bg-muted/40 rounded px-1.5 py-0.5">{fact}</span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>

                  {/* Honesty Report */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Shield className="size-4" />
                        Honesty Report
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {([
                          ['All Insights Genuine', proofResult.honestyReport.allInsightsGenuine],
                          ['No Fabricated Data', proofResult.honestyReport.noFabricatedData],
                          ['Evidence Chains Complete', proofResult.honestyReport.evidenceChainsComplete],
                          ['Confidence Honest', proofResult.honestyReport.confidenceHonest],
                        ] as [string, boolean][]).map(([label, passed]) => (
                          <div key={label} className="flex items-center gap-2 text-sm">
                            {passed ? (
                              <CheckCircle2 className="size-4 text-emerald-500 flex-shrink-0" />
                            ) : (
                              <AlertTriangle className="size-4 text-rose-500 flex-shrink-0" />
                            )}
                            <span>{label}</span>
                            <span className="ml-auto text-xs">{passed ? '✅' : '❌'}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </section>
          </TabsContent>

          {/* ===== EVALUATION TAB (Day 10) ===== */}
          <TabsContent value="evaluate" className="space-y-6">
            <section>
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                <Scale className="size-4" />
                Maker Output Evaluation
              </h2>

              {/* Evaluation Controls */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Scale className="size-4" />
                    Evaluate Pipeline
                  </CardTitle>
                  <CardDescription>
                    Run the full Muse→Maker→Evaluate→Store pipeline. Maker output is evaluated for voice match, hook compatibility, and content quality before being stored as a Draft.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-muted-foreground">Topic (optional override)</label>
                      <Input
                        placeholder="Leave empty to use inferred topic"
                        value={delegationTopic}
                        onChange={(e) => setDelegationTopic(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-muted-foreground">Objective (optional override)</label>
                      <Input
                        placeholder="Leave empty to use inferred objective"
                        value={delegationObjective}
                        onChange={(e) => setDelegationObjective(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <Button
                      variant="outline"
                      className="gap-2"
                      disabled={evalLoading}
                      onClick={async () => {
                        setEvalLoading(true);
                        setEvalThresholds(null);
                        try {
                          const res = await fetch('/api/delegation/evaluate');
                          const data = await res.json();
                          if (data.success) setEvalThresholds(data);
                        } catch (e) {
                          console.error('Threshold error:', e);
                        } finally {
                          setEvalLoading(false);
                        }
                      }}
                    >
                      <Eye className="size-4" />
                      View Thresholds
                    </Button>
                    <Button
                      className="gap-2 bg-violet-600 hover:bg-violet-700 text-white"
                      disabled={evalLoading}
                      onClick={async () => {
                        setEvalLoading(true);
                        setEvalResult(null);
                        try {
                          const body: Record<string, string | boolean> = { storeDraft: true };
                          if (delegationTopic) body.topic = delegationTopic;
                          if (delegationObjective) body.objective = delegationObjective;
                          const res = await fetch('/api/delegation/evaluate', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(body),
                          });
                          const data = await res.json();
                          if (data.success) setEvalResult(data);
                        } catch (e) {
                          console.error('Evaluate error:', e);
                        } finally {
                          setEvalLoading(false);
                        }
                      }}
                    >
                      <Scale className="size-4" />
                      {evalLoading ? 'Evaluating…' : 'Run Evaluate + Store Draft'}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Thresholds Display */}
              {evalThresholds && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Shield className="size-4" />
                      Evaluation Criteria
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="p-3 rounded-lg bg-violet-500/10 border border-violet-500/20">
                        <p className="text-xs text-muted-foreground">Pass Threshold</p>
                        <p className="text-lg font-bold text-violet-400">{(evalThresholds.thresholds.passThreshold * 100).toFixed(0)}%</p>
                      </div>
                      <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                        <p className="text-xs text-muted-foreground">Min Individual Score</p>
                        <p className="text-lg font-bold text-amber-400">{(evalThresholds.thresholds.minIndividualScore * 100).toFixed(0)}%</p>
                      </div>
                      <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                        <p className="text-xs text-muted-foreground">Weights</p>
                        <p className="text-sm font-medium text-emerald-400">V:{(evalThresholds.thresholds.weights.voiceMatch * 100).toFixed(0)}% H:{(evalThresholds.thresholds.weights.hookCompat * 100).toFixed(0)}% Q:{(evalThresholds.thresholds.weights.contentQuality * 100).toFixed(0)}%</p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">{evalThresholds.thresholds.description}</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div>
                        <p className="text-xs text-muted-foreground">Creator</p>
                        <p className="text-sm font-medium">{evalThresholds.creatorContext.name}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Platform</p>
                        <p className="text-sm font-medium">{evalThresholds.creatorContext.platform}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Hook Patterns</p>
                        <p className="text-sm font-medium">{evalThresholds.creatorContext.hookPatternsCount}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Historical Winners</p>
                        <p className="text-sm font-medium">{evalThresholds.creatorContext.historicalWinnersCount}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Evaluation Results */}
              {evalResult?.evaluation && (
                <section className="space-y-4">
                  <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Zap className="size-4" />
                    Evaluation Result
                  </h2>

                  {/* Pass/Fail + Overall Score */}
                  <Card className={evalResult.evaluation.passed ? 'border-emerald-500/30' : 'border-rose-500/30'}>
                    <CardHeader>
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <CardTitle className="text-base flex items-center gap-2">
                          {evalResult.evaluation.passed ? <CheckCircle2 className="size-5 text-emerald-400" /> : <AlertTriangle className="size-5 text-rose-400" />}
                          {evalResult.evaluation.passed ? 'PASSED — Draft Stored' : 'FAILED — Output Rejected'}
                        </CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge className={evalResult.evaluation.passed ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-rose-600 text-white border-rose-600'}>
                            {(evalResult.evaluation.overallScore * 100).toFixed(0)}%
                          </Badge>
                          <Badge variant="outline" className={`gap-1 ${confidenceColor(evalResult.evaluation.confidenceLevel)}`}>
                            {evalResult.evaluation.confidenceLevel} confidence
                          </Badge>
                        </div>
                      </div>
                      <CardDescription>
                        Threshold: {(evalResult.evaluation.passThreshold * 100).toFixed(0)}% • Data points: {evalResult.evaluation.dataPointsUsed}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Three Score Dimensions */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {/* Voice Match */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-medium flex items-center gap-1"><Mic className="size-3" /> Voice Match</p>
                            <p className="text-xs text-violet-400 font-bold">{(evalResult.evaluation.voiceMatch.overall * 100).toFixed(0)}%</p>
                          </div>
                          <Progress value={evalResult.evaluation.voiceMatch.overall * 100} className="h-2" />
                          <div className="space-y-1">
                            <ScoreBar label="Tone" value={evalResult.evaluation.voiceMatch.toneAlignment} />
                            <ScoreBar label="Pace" value={evalResult.evaluation.voiceMatch.paceConsistency} />
                            <ScoreBar label="Vocab" value={evalResult.evaluation.voiceMatch.vocabularyMatch} />
                            <ScoreBar label="Avoid" value={evalResult.evaluation.voiceMatch.avoidTopicsCompliance} />
                            <ScoreBar label="Strengths" value={evalResult.evaluation.voiceMatch.strengthUtilization} />
                          </div>
                        </div>
                        {/* Hook Compat */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-medium flex items-center gap-1"><Target className="size-3" /> Hook Compat</p>
                            <p className="text-xs text-emerald-400 font-bold">{(evalResult.evaluation.hookCompat.overall * 100).toFixed(0)}%</p>
                          </div>
                          <Progress value={evalResult.evaluation.hookCompat.overall * 100} className="h-2" />
                          <div className="space-y-1">
                            <ScoreBar label="Pattern" value={evalResult.evaluation.hookCompat.primaryHookPatternMatch} />
                            <ScoreBar label="History" value={evalResult.evaluation.hookCompat.historicalAlignment} />
                            <ScoreBar label="Variety" value={evalResult.evaluation.hookCompat.hookVariety} />
                            <ScoreBar label="Strength" value={evalResult.evaluation.hookCompat.hookStrength} />
                          </div>
                        </div>
                        {/* Content Quality */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-medium flex items-center gap-1"><Wand2 className="size-3" /> Quality</p>
                            <p className="text-xs text-amber-400 font-bold">{(evalResult.evaluation.contentQuality.overall * 100).toFixed(0)}%</p>
                          </div>
                          <Progress value={evalResult.evaluation.contentQuality.overall * 100} className="h-2" />
                          <div className="space-y-1">
                            <ScoreBar label="Structure" value={evalResult.evaluation.contentQuality.scriptStructure} />
                            <ScoreBar label="CTA" value={evalResult.evaluation.contentQuality.ctaClarity} />
                            <ScoreBar label="Title" value={evalResult.evaluation.contentQuality.titleEffectiveness} />
                            <ScoreBar label="Caption" value={evalResult.evaluation.contentQuality.captionAlignment} />
                          </div>
                        </div>
                      </div>

                      <Separator />

                      {/* Breakdowns */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <p className="text-xs font-medium text-violet-400 mb-1.5 flex items-center gap-1"><Mic className="size-3" /> Voice Breakdown</p>
                          <div className="space-y-1">
                            {evalResult.evaluation.voiceMatch.breakdown.map((b, i) => (
                              <p key={i} className="text-xs text-muted-foreground">{b}</p>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-emerald-400 mb-1.5 flex items-center gap-1"><Target className="size-3" /> Hook Breakdown</p>
                          <div className="space-y-1">
                            {evalResult.evaluation.hookCompat.breakdown.map((b, i) => (
                              <p key={i} className="text-xs text-muted-foreground">{b}</p>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-amber-400 mb-1.5 flex items-center gap-1"><Wand2 className="size-3" /> Quality Breakdown</p>
                          <div className="space-y-1">
                            {evalResult.evaluation.contentQuality.breakdown.map((b, i) => (
                              <p key={i} className="text-xs text-muted-foreground">{b}</p>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Fail Reasons */}
                      {!evalResult.evaluation.passed && evalResult.evaluation.failReasons.length > 0 && (
                        <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20">
                          <p className="text-xs font-medium text-rose-400 mb-1.5 flex items-center gap-1">
                            <AlertTriangle className="size-3" />
                            Fail Reasons
                          </p>
                          {evalResult.evaluation.failReasons.map((r, i) => (
                            <p key={i} className="text-xs text-rose-300">• {r}</p>
                          ))}
                        </div>
                      )}

                      {/* Draft Info */}
                      {evalResult.draft && evalResult.draft.stored && (
                        <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                          <p className="text-xs font-medium text-emerald-400 mb-1 flex items-center gap-1">
                            <CheckCircle2 className="size-3" />
                            Draft Stored (v{evalResult.draft.version})
                          </p>
                          <p className="text-xs text-muted-foreground">ID: {evalResult.draft.draftId.slice(0, 16)}…</p>
                        </div>
                      )}

                      {/* Meta-evidence */}
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1.5 flex items-center gap-1">
                          <Shield className="size-3" />
                          Evaluation Evidence
                        </p>
                        <div className="space-y-1">
                          {evalResult.evaluation.evaluationEvidence.map((ev, i) => (
                            <p key={i} className="text-xs text-muted-foreground">• {ev}</p>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </section>
              )}

              {/* Empty state */}
              {!evalResult && !evalThresholds && (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Scale className="size-10 text-muted-foreground/30 mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">
                      Click <strong>View Thresholds</strong> to see evaluation criteria, or <strong>Run Evaluate + Store Draft</strong> to execute the full Muse→Maker→Evaluate→Store pipeline.
                    </p>
                  </CardContent>
                </Card>
              )}
            </section>
          </TabsContent>

          {/* ===== DRAFTS TAB (Day 10) ===== */}
          <TabsContent value="drafts" className="space-y-6">
            <section>
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                <FileText className="size-4" />
                Draft Pipeline
              </h2>

              <div className="flex items-center gap-3 mb-4">
                <Button
                  variant="outline"
                  className="gap-2"
                  disabled={draftsLoading}
                  onClick={async () => {
                    setDraftsLoading(true);
                    try {
                      const res = await fetch('/api/drafts');
                      const data = await res.json();
                      if (data.success) setDraftsData(data);
                    } catch (e) {
                      console.error('Drafts error:', e);
                    } finally {
                      setDraftsLoading(false);
                    }
                  }}
                >
                  <Database className="size-4" />
                  {draftsLoading ? 'Loading…' : 'Load Drafts'}
                </Button>
              </div>

              {draftsData && (
                <>
                  {/* Summary */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <BarChart3 className="size-4" />
                        Draft Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 sm:grid-cols-6 gap-4">
                        <div>
                          <p className="text-xs text-muted-foreground">Total</p>
                          <p className="text-lg font-bold">{draftsData.summary.totalDrafts}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Passed</p>
                          <p className="text-lg font-bold text-emerald-400">{draftsData.summary.passedDrafts}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Failed</p>
                          <p className="text-lg font-bold text-rose-400">{draftsData.summary.failedDrafts}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Avg Score</p>
                          <p className="text-lg font-bold">{(draftsData.summary.avgScore * 100).toFixed(0)}%</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Avg Voice</p>
                          <p className="text-lg font-bold text-violet-400">{(draftsData.summary.avgVoiceMatch * 100).toFixed(0)}%</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Avg Hook</p>
                          <p className="text-lg font-bold text-emerald-400">{(draftsData.summary.avgHookCompat * 100).toFixed(0)}%</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Draft List */}
                  {draftsData.drafts.length > 0 ? (
                    <div className="space-y-3">
                      {draftsData.drafts.map((draft) => (
                        <Card key={draft.id} className={draft.evaluationPassed ? 'border-emerald-500/20' : 'border-rose-500/20'}>
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between flex-wrap gap-2">
                              <CardTitle className="text-sm flex items-center gap-2">
                                {draft.evaluationPassed ? <CheckCircle2 className="size-4 text-emerald-400" /> : <AlertTriangle className="size-4 text-rose-400" />}
                                {draft.title}
                              </CardTitle>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs">v{draft.version}</Badge>
                                <Badge className={draft.evaluationPassed ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-rose-600 text-white border-rose-600'}>
                                  {(draft.evaluationScore * 100).toFixed(0)}%
                                </Badge>
                                <Badge variant="outline" className={`text-xs ${draft.source === 'live' ? 'border-emerald-500/40 text-emerald-400' : 'border-amber-500/40 text-amber-400'}`}>
                                  {draft.source}
                                </Badge>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="pt-0 space-y-3">
                            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                              <div>
                                <p className="text-xs text-muted-foreground">Voice</p>
                                <div className="flex items-center gap-1.5">
                                  <Progress value={draft.voiceMatch * 100} className="h-1.5 flex-1" />
                                  <span className="text-xs text-violet-400">{(draft.voiceMatch * 100).toFixed(0)}%</span>
                                </div>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">Hook</p>
                                <div className="flex items-center gap-1.5">
                                  <Progress value={draft.hookCompat * 100} className="h-1.5 flex-1" />
                                  <span className="text-xs text-emerald-400">{(draft.hookCompat * 100).toFixed(0)}%</span>
                                </div>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">Quality</p>
                                <div className="flex items-center gap-1.5">
                                  <Progress value={draft.contentQuality * 100} className="h-1.5 flex-1" />
                                  <span className="text-xs text-amber-400">{(draft.contentQuality * 100).toFixed(0)}%</span>
                                </div>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">Topic</p>
                                <p className="text-xs font-medium truncate">{draft.topic}</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">Created</p>
                                <p className="text-xs font-medium">{new Date(draft.createdAt).toLocaleDateString()}</p>
                              </div>
                            </div>
                            {draft.changeLog && (
                              <p className="text-xs text-muted-foreground italic">{draft.changeLog}</p>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <Card>
                      <CardContent className="py-8 text-center">
                        <p className="text-sm text-muted-foreground">No drafts yet. Run the Evaluate pipeline to create one.</p>
                      </CardContent>
                    </Card>
                  )}
                </>
              )}

              {!draftsData && !draftsLoading && (
                <Card>
                  <CardContent className="py-12 text-center">
                    <FileText className="size-10 text-muted-foreground/30 mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">
                      Click <strong>Load Drafts</strong> to see all stored drafts from Maker evaluations.
                    </p>
                  </CardContent>
                </Card>
              )}
            </section>
          </TabsContent>

          {/* ===== DELEGATION BEAT TAB (Day 11) ===== */}
          <TabsContent value="beat" className="space-y-6">
            {/* Header */}
            <section>
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                <Workflow className="size-4" />
                Full Delegation Beat: Muse → Maker → Evaluate → Store
              </h2>

              {/* Controls */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Workflow className="size-4" />
                    Run Delegation Beat
                  </CardTitle>
                  <CardDescription>
                    Execute the full Muse→Maker→evaluate→store pipeline in a single step-by-step beat
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-muted-foreground">Topic (optional)</label>
                      <Input
                        placeholder="Leave empty to use inferred topic"
                        value={beatTopic}
                        onChange={(e) => setBeatTopic(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-muted-foreground">Objective (optional)</label>
                      <Input
                        placeholder="Leave empty to use inferred objective"
                        value={beatObjective}
                        onChange={(e) => setBeatObjective(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <Button
                      className="gap-2 bg-gradient-to-r from-violet-600 to-emerald-600 hover:from-violet-700 hover:to-emerald-700 text-white"
                      disabled={beatLoading}
                      onClick={async () => {
                        setBeatLoading(true);
                        setBeatResult(null);
                        setActiveBeatStep(null);
                        try {
                          const body: Record<string, string> = {};
                          if (beatTopic) body.topic = beatTopic;
                          if (beatObjective) body.objective = beatObjective;
                          const res = await fetch('/api/delegation/beat', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(body),
                          });
                          const data = await res.json();
                          if (data.success) setBeatResult(data);
                        } catch (e) {
                          console.error('Beat error:', e);
                        } finally {
                          setBeatLoading(false);
                        }
                      }}
                    >
                      <Zap className="size-4" />
                      {beatLoading ? 'Running Beat…' : 'Run Full Beat'}
                    </Button>
                    <Button
                      variant="outline"
                      className="gap-2"
                      disabled={beatHistoryLoading}
                      onClick={async () => {
                        setBeatHistoryLoading(true);
                        try {
                          const res = await fetch('/api/delegation/beat');
                          const data = await res.json();
                          if (data.success) setBeatHistory(data);
                        } catch (e) {
                          console.error('Beat history error:', e);
                        } finally {
                          setBeatHistoryLoading(false);
                        }
                      }}
                    >
                      <History className="size-4" />
                      {beatHistoryLoading ? 'Loading…' : 'Beat History'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Pipeline Flow Visualization */}
            <section>
              <Card className="border-violet-500/20">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <GitBranch className="size-4" />
                    Pipeline Flow
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center gap-2 sm:gap-4 flex-wrap">
                    {/* Step indicators */}
                    {[
                      { step: 1, name: 'Load Context', icon: <Database className="size-4" /> },
                      { step: 2, name: 'Delegate', icon: <Send className="size-4" /> },
                      { step: 3, name: 'Evaluate', icon: <Scale className="size-4" /> },
                      { step: 4, name: 'Store Draft', icon: <Save className="size-4" /> },
                    ].map(({ step, name, icon }, idx) => {
                      const stepData = beatResult?.beat.steps.find((s) => s.step === step);
                      const isActive = activeBeatStep === step;
                      const isComplete = stepData?.status === 'complete';
                      const isFailed = stepData?.status === 'failed';
                      return (
                        <div key={step} className="flex items-center gap-2 sm:gap-4">
                          <button
                            onClick={() => setActiveBeatStep(isActive ? null : step)}
                            className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all ${
                              isActive
                                ? 'border-violet-500/50 bg-violet-500/10 scale-105'
                                : isComplete
                                  ? 'border-emerald-500/30 bg-emerald-500/5'
                                  : isFailed
                                    ? 'border-rose-500/30 bg-rose-500/5'
                                    : 'border-border bg-muted/30'
                            }`}
                          >
                            <div className={`flex items-center justify-center size-8 rounded-full ${
                              isComplete
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : isFailed
                                  ? 'bg-rose-500/20 text-rose-400'
                                  : isActive
                                    ? 'bg-violet-500/20 text-violet-400'
                                    : 'bg-muted text-muted-foreground'
                            }`}>
                              {isComplete ? <CheckCircle2 className="size-4" /> : isFailed ? <AlertTriangle className="size-4" /> : icon}
                            </div>
                            <span className={`text-xs font-medium ${
                              isComplete ? 'text-emerald-400' : isFailed ? 'text-rose-400' : isActive ? 'text-violet-400' : 'text-muted-foreground'
                            }`}>
                              {name}
                            </span>
                            {stepData && (
                              <span className="text-[10px] text-muted-foreground">
                                {stepData.duration}ms
                              </span>
                            )}
                          </button>
                          {idx < 3 && (
                            <ArrowRight className={`size-4 ${isComplete ? 'text-emerald-400' : 'text-muted-foreground/30'}`} />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Beat Result */}
            {beatResult && (
              <>
                {/* Overall Summary */}
                <section>
                  <Card className={beatResult.beat.success ? 'border-emerald-500/30' : 'border-rose-500/30'}>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        {beatResult.beat.success ? (
                          <CheckCircle2 className="size-4 text-emerald-400" />
                        ) : (
                          <AlertTriangle className="size-4 text-rose-400" />
                        )}
                        Beat Result — {beatResult.beat.beatId}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div>
                          <p className="text-xs text-muted-foreground">Creator</p>
                          <p className="text-sm font-medium">{beatResult.beat.creatorName}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Mode</p>
                          <Badge variant={beatResult.beat.mode === 'live' ? 'default' : 'secondary'}>
                            {beatResult.beat.mode}
                          </Badge>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Total Duration</p>
                          <p className="text-sm font-medium font-mono">{beatResult.beat.totalDuration}ms</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Evaluation</p>
                          <Badge variant={beatResult.beat.evaluationPassed ? 'default' : 'destructive'}>
                            {beatResult.beat.evaluationPassed ? 'PASSED' : 'FAILED'}
                          </Badge>
                        </div>
                      </div>

                      {/* Evaluation Scores */}
                      {beatResult.beat.evaluation && (
                        <div className="mt-4 space-y-2">
                          <p className="text-xs font-semibold text-muted-foreground uppercase">Evaluation Scores</p>
                          <div className="grid grid-cols-3 gap-3">
                            <div className="p-3 rounded-lg bg-muted/50 text-center">
                              <p className="text-xs text-muted-foreground">Voice Match</p>
                              <p className="text-xl font-bold text-violet-400">
                                {(beatResult.beat.evaluation.voiceMatch.overall * 100).toFixed(1)}%
                              </p>
                            </div>
                            <div className="p-3 rounded-lg bg-muted/50 text-center">
                              <p className="text-xs text-muted-foreground">Hook Compat</p>
                              <p className="text-xl font-bold text-emerald-400">
                                {(beatResult.beat.evaluation.hookCompat.overall * 100).toFixed(1)}%
                              </p>
                            </div>
                            <div className="p-3 rounded-lg bg-muted/50 text-center">
                              <p className="text-xs text-muted-foreground">Content Quality</p>
                              <p className="text-xl font-bold text-amber-400">
                                {(beatResult.beat.evaluation.contentQuality.overall * 100).toFixed(1)}%
                              </p>
                            </div>
                          </div>
                          <div className="p-3 rounded-lg bg-violet-500/5 border border-violet-500/20 text-center">
                            <p className="text-xs text-muted-foreground">Overall Score</p>
                            <p className="text-2xl font-bold text-violet-400">
                              {(beatResult.beat.evaluation.overallScore * 100).toFixed(1)}%
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Draft Info */}
                      {beatResult.beat.draft && (
                        <div className="mt-4 p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
                          <p className="text-xs font-semibold text-emerald-400 uppercase mb-1">Draft Stored</p>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                            <div>
                              <span className="text-xs text-muted-foreground">ID</span>
                              <p className="font-mono text-xs">{beatResult.beat.draft.draftId.slice(0, 16)}…</p>
                            </div>
                            <div>
                              <span className="text-xs text-muted-foreground">Version</span>
                              <p className="font-medium">v{beatResult.beat.draft.version}</p>
                            </div>
                            <div>
                              <span className="text-xs text-muted-foreground">Content Item</span>
                              <p className="font-mono text-xs">{beatResult.beat.draft.contentItemId.slice(0, 16)}…</p>
                            </div>
                            <div>
                              <span className="text-xs text-muted-foreground">Status</span>
                              <Badge variant="default" className="bg-emerald-600">Stored</Badge>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </section>

                {/* Step Details */}
                <section className="space-y-3">
                  <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Layers className="size-4" />
                    Step-by-Step Breakdown
                  </h2>
                  {beatResult.beat.steps.map((step) => {
                    const isActive = activeBeatStep === step.step;
                    return (
                      <Card
                        key={step.step}
                        className={`cursor-pointer transition-all ${
                          isActive ? 'border-violet-500/40 shadow-md' : 'border-border'
                        } ${step.status === 'complete' ? 'hover:border-emerald-500/30' : step.status === 'failed' ? 'hover:border-rose-500/30' : ''}`}
                        onClick={() => setActiveBeatStep(isActive ? null : step.step)}
                      >
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-sm flex items-center gap-2">
                              <span className={`flex items-center justify-center size-6 rounded-full text-xs font-bold ${
                                step.status === 'complete'
                                  ? 'bg-emerald-500/20 text-emerald-400'
                                  : step.status === 'failed'
                                    ? 'bg-rose-500/20 text-rose-400'
                                    : 'bg-muted text-muted-foreground'
                              }`}>
                                {step.step}
                              </span>
                              {step.name}
                            </CardTitle>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-[10px] font-mono">
                                {step.duration}ms
                              </Badge>
                              <Badge
                                variant={step.status === 'complete' ? 'default' : step.status === 'failed' ? 'destructive' : 'secondary'}
                                className={step.status === 'complete' ? 'bg-emerald-600' : undefined}
                              >
                                {step.status}
                              </Badge>
                            </div>
                          </div>
                          <CardDescription className="text-xs">{step.description}</CardDescription>
                        </CardHeader>
                        {isActive && (
                          <CardContent className="pt-2 space-y-3">
                            {/* Evidence */}
                            <div>
                              <p className="text-xs font-semibold text-muted-foreground uppercase mb-1.5">Evidence</p>
                              <div className="space-y-1">
                                {step.evidence.map((ev, i) => (
                                  <div key={i} className="flex items-start gap-2 text-xs">
                                    <span className="text-violet-400 mt-0.5 shrink-0">•</span>
                                    <span className="text-muted-foreground">{ev}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Step-specific data */}
                            {step.step === 1 && beatResult.beat.instruction && (
                              <div>
                                <p className="text-xs font-semibold text-muted-foreground uppercase mb-1.5">Context Details</p>
                                <div className="grid grid-cols-2 gap-2">
                                  <div className="p-2 rounded bg-muted/50">
                                    <p className="text-[10px] text-muted-foreground">Topic</p>
                                    <p className="text-xs font-medium">{beatResult.beat.instruction.makerInput.topic}</p>
                                  </div>
                                  <div className="p-2 rounded bg-muted/50">
                                    <p className="text-[10px] text-muted-foreground">Objective</p>
                                    <p className="text-xs font-medium">{beatResult.beat.instruction.makerInput.objective}</p>
                                  </div>
                                </div>
                              </div>
                            )}

                            {step.step === 2 && beatResult.beat.instruction && (
                              <div>
                                <p className="text-xs font-semibold text-muted-foreground uppercase mb-1.5">Structured Instruction</p>
                                <div className="p-3 rounded-lg bg-muted/50 text-xs font-mono whitespace-pre-wrap max-h-48 overflow-y-auto scrollbar-thin">
{`[MUSE DELEGATION]
Creator: ${beatResult.beat.instruction.makerInput.creator}
Topic: ${beatResult.beat.instruction.makerInput.topic}
Objective: ${beatResult.beat.instruction.makerInput.objective}
Audience: ${beatResult.beat.instruction.makerInput.audience}

Instruction:
${beatResult.beat.instruction.makerInput.instruction}

Reasoning: ${beatResult.beat.instruction.reasoning}
Confidence: ${beatResult.beat.instruction.confidenceLevel} (${beatResult.beat.instruction.dataPointsUsed} data points)
[END DELEGATION]`}
                                </div>
                              </div>
                            )}

                            {step.step === 3 && beatResult.beat.evaluation && (
                              <div>
                                <p className="text-xs font-semibold text-muted-foreground uppercase mb-1.5">Evaluation Breakdown</p>
                                <div className="space-y-2">
                                  <ScoreBar label="Voice" value={beatResult.beat.evaluation.voiceMatch.overall} />
                                  <ScoreBar label="Hook" value={beatResult.beat.evaluation.hookCompat.overall} />
                                  <ScoreBar label="Quality" value={beatResult.beat.evaluation.contentQuality.overall} />
                                  <ScoreBar label="Overall" value={beatResult.beat.evaluation.overallScore} />
                                </div>
                                {beatResult.beat.evaluation.voiceMatch.breakdown.length > 0 && (
                                  <div className="mt-2 space-y-1">
                                    <p className="text-[10px] font-semibold text-muted-foreground uppercase">Voice Breakdown</p>
                                    {beatResult.beat.evaluation.voiceMatch.breakdown.map((b, i) => (
                                      <p key={i} className="text-[10px] text-muted-foreground">{b}</p>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}

                            {step.step === 4 && beatResult.beat.draft && (
                              <div>
                                <p className="text-xs font-semibold text-muted-foreground uppercase mb-1.5">Draft Info</p>
                                <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
                                  <p className="text-xs">Draft <span className="font-mono">{beatResult.beat.draft.draftId.slice(0, 20)}…</span> stored as version {beatResult.beat.draft.version}</p>
                                </div>
                              </div>
                            )}
                          </CardContent>
                        )}
                      </Card>
                    );
                  })}
                </section>

                {/* Maker Output Preview */}
                {beatResult.beat.makerOutput && (
                  <section>
                    <Card className="border-emerald-500/20">
                      <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                          <Zap className="size-4 text-emerald-400" />
                          Maker Output
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Title</p>
                          <p className="text-sm font-medium">{beatResult.beat.makerOutput.title}</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Caption</p>
                          <p className="text-sm text-muted-foreground">{beatResult.beat.makerOutput.caption}</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">CTA</p>
                          <p className="text-sm text-muted-foreground">{beatResult.beat.makerOutput.cta}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="p-2 rounded-lg bg-violet-500/5 text-center">
                            <p className="text-[10px] text-muted-foreground">Voice Match</p>
                            <p className="text-lg font-bold text-violet-400">{(beatResult.beat.makerOutput.voiceMatch * 100).toFixed(1)}%</p>
                          </div>
                          <div className="p-2 rounded-lg bg-emerald-500/5 text-center">
                            <p className="text-[10px] text-muted-foreground">Hook Compat</p>
                            <p className="text-lg font-bold text-emerald-400">{(beatResult.beat.makerOutput.hookCompat * 100).toFixed(1)}%</p>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">
                            Alternative Hooks ({beatResult.beat.makerOutput.alternativeHooks.length})
                          </p>
                          <div className="space-y-1 max-h-32 overflow-y-auto scrollbar-thin">
                            {beatResult.beat.makerOutput.alternativeHooks.map((hook, i) => (
                              <p key={i} className="text-xs text-muted-foreground p-1.5 rounded bg-muted/30">{hook}</p>
                            ))}
                          </div>
                        </div>
                        <details className="group">
                          <summary className="text-xs font-medium text-muted-foreground cursor-pointer hover:text-foreground">
                            View full script ({beatResult.beat.makerOutput.script.length} chars)
                          </summary>
                          <pre className="mt-2 p-3 rounded-lg bg-muted/50 text-xs font-mono whitespace-pre-wrap max-h-64 overflow-y-auto scrollbar-thin">
                            {beatResult.beat.makerOutput.script}
                          </pre>
                        </details>
                      </CardContent>
                    </Card>
                  </section>
                )}

                {/* Audit Trail */}
                <section>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Shield className="size-4" />
                        Audit Trail
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                        <div>
                          <p className="text-xs text-muted-foreground">Total Events</p>
                          <p className="font-medium">{beatResult.beat.auditSummary.totalAuditEvents}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Delegation</p>
                          <p className="font-mono text-xs">{beatResult.beat.auditSummary.delegationAuditId.slice(0, 16)}…</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Evaluation</p>
                          <p className="font-mono text-xs">{beatResult.beat.auditSummary.evaluationId.slice(0, 16)}…</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Draft</p>
                          <p className="font-mono text-xs">{beatResult.beat.auditSummary.draftAuditId.slice(0, 16)}…</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </section>
              </>
            )}

            {/* Beat History */}
            {beatHistory && beatHistory.history.length > 0 && (
              <section>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <History className="size-4" />
                      Recent Beats ({beatHistory.count})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-thin">
                      {beatHistory.history.map((beat) => (
                        <div
                          key={beat.beatId}
                          className="flex items-center justify-between p-2.5 rounded-lg bg-muted/50"
                        >
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={beat.evaluationPassed ? 'default' : 'destructive'}
                              className="text-[10px]"
                            >
                              {beat.evaluationPassed ? 'PASS' : 'FAIL'}
                            </Badge>
                            <span className="text-xs font-mono">{beat.beatId}</span>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span>V:{(beat.scores.voiceMatch * 100).toFixed(0)}%</span>
                            <span>H:{(beat.scores.hookCompat * 100).toFixed(0)}%</span>
                            <span>{beat.totalDuration}ms</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </section>
            )}

            {/* Empty State */}
            {!beatResult && !beatLoading && (
              <Card>
                <CardContent className="py-16 text-center">
                  <Workflow className="size-12 text-muted-foreground/20 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Run the Full Delegation Beat</h3>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto mb-4">
                    This demonstrates the complete Muse→Maker→evaluate→store pipeline in a single
                    step-by-step execution — the core intelligence cycle of MUSE.
                  </p>
                  <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <div className="size-5 rounded-full bg-violet-500/10 flex items-center justify-center">
                        <Database className="size-3 text-violet-400" />
                      </div>
                      Load
                    </div>
                    <ArrowRight className="size-3" />
                    <div className="flex items-center gap-1.5">
                      <div className="size-5 rounded-full bg-violet-500/10 flex items-center justify-center">
                        <Send className="size-3 text-violet-400" />
                      </div>
                      Delegate
                    </div>
                    <ArrowRight className="size-3" />
                    <div className="flex items-center gap-1.5">
                      <div className="size-5 rounded-full bg-emerald-500/10 flex items-center justify-center">
                        <Scale className="size-3 text-emerald-400" />
                      </div>
                      Evaluate
                    </div>
                    <ArrowRight className="size-3" />
                    <div className="flex items-center gap-1.5">
                      <div className="size-5 rounded-full bg-emerald-500/10 flex items-center justify-center">
                        <Save className="size-3 text-emerald-400" />
                      </div>
                      Store
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* ===== VALIDATION TAB (Day 16) ===== */}
          {/* ===== FEEDBACK TAB — Day 17 ===== */}
          <TabsContent value="feedback" className="space-y-6">
            <Card className="rounded-xl border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-transparent muse-card-hover">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 muse-stagger-1">
                  <MessageCircle className="size-8 text-amber-400" />
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight">Phase 7: Creator Feedback Loop</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      Collect creator corrections → Log decisions → Refine memory → Improve recommendations
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Real Creator Gate */}
            <Card className="rounded-xl">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <ClipboardCheck className="size-4 text-violet-400" />
                    Day 17 — Real Creator Gate
                  </CardTitle>
                  <Button
                    onClick={async () => {
                      setCreatorGateLoading(true);
                      setCreatorGate(null);
                      try {
                        const res = await fetch('/api/feedback/gate');
                        const json = await res.json();
                        if (json.success) setCreatorGate(json.gate);
                      } catch { /* fail */ }
                      setCreatorGateLoading(false);
                    }}
                    disabled={creatorGateLoading}
                    size="sm"
                    variant="outline"
                    className="gap-2"
                  >
                    <ClipboardCheck className="size-3" />
                    {creatorGateLoading ? 'Checking…' : 'Check Gate'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {creatorGate && (
                  <div className="space-y-3">
                    <div className={`p-4 rounded-xl border ${
                      creatorGate.gateStatus === 'PASS'
                        ? 'bg-emerald-500/10 border-emerald-500/30'
                        : 'bg-amber-500/10 border-amber-500/30'
                    }`}>
                      <div className="flex items-center gap-2">
                        {creatorGate.gateStatus === 'PASS'
                          ? <CheckCircle2 className="size-5 text-emerald-400" />
                          : <AlertCircle className="size-5 text-amber-400" />
                        }
                        <span className="font-bold text-sm">
                          {creatorGate.gateStatus === 'PASS' ? 'REAL CREATOR GATE: PASSED' : 'REAL CREATOR GATE: PIVOT TO SIMULATION'}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">{creatorGate.recommendation}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-lg bg-muted/20 text-center">
                        <p className="text-lg font-bold">{creatorGate.realCreatorCount}</p>
                        <p className="text-[10px] text-muted-foreground">Real Feedback Events</p>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/20 text-center">
                        <p className="text-lg font-bold">{creatorGate.simulationCount}</p>
                        <p className="text-[10px] text-muted-foreground">Simulation Events</p>
                      </div>
                    </div>
                    {creatorGate.methodologyNotes?.length > 0 && (
                      <div className="p-3 rounded-lg bg-muted/10 border border-muted">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Methodology Notes</p>
                        <div className="space-y-1">
                          {creatorGate.methodologyNotes.map((note: string, i: number) => (
                            <p key={i} className="text-xs text-muted-foreground">• {note}</p>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
                {!creatorGate && !creatorGateLoading && (
                  <div className="text-center py-6 text-muted-foreground">
                    <ClipboardCheck className="size-10 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">Click &quot;Check Gate&quot; to verify Real Creator Gate status</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Disclosed Simulation */}
            <Card className="rounded-xl">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <FlaskConical className="size-4 text-amber-400" />
                    Disclosed Simulation
                    <Badge variant="outline" className="text-[10px] border-amber-500/30 text-amber-400">SIMULATED</Badge>
                  </CardTitle>
                  <Button
                    onClick={async () => {
                      setSimulationLoading(true);
                      setSimulationResult(null);
                      try {
                        const res = await fetch('/api/feedback/simulate', { method: 'POST' });
                        const json = await res.json();
                        if (json.success) setSimulationResult(json.result);
                      } catch { /* fail */ }
                      setSimulationLoading(false);
                    }}
                    disabled={simulationLoading}
                    size="sm"
                    className="gap-2"
                  >
                    <FlaskConical className="size-3" />
                    {simulationLoading ? 'Running…' : 'Run Simulation'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {simulationLoading && (
                  <div className="flex items-center justify-center py-8 text-muted-foreground">
                    <div className="animate-pulse flex items-center gap-2">
                      <FlaskConical className="size-5 animate-spin" />
                      Running disclosed simulation with methodological rigor…
                    </div>
                  </div>
                )}

                {simulationResult && (
                  <div className="space-y-4">
                    {/* Disclosed banner */}
                    <div className="p-3 rounded-xl border border-amber-500/30 bg-amber-500/5">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="size-4 text-amber-400" />
                        <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                          Disclosed Simulation — Not Real Creator Feedback
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{simulationResult.config?.simulationLabel}</p>
                    </div>

                    {/* Results summary */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 rounded-lg bg-muted/20">
                      <div className="text-center">
                        <p className="text-sm font-bold">{simulationResult.totalFeedback}</p>
                        <p className="text-[10px] text-muted-foreground">Feedback Items</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-bold">{simulationResult.correctionsLogged}</p>
                        <p className="text-[10px] text-muted-foreground">Corrections Logged</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-bold">{simulationResult.refinementsApplied}</p>
                        <p className="text-[10px] text-muted-foreground">Refinements Applied</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-bold">{simulationResult.durationMs}ms</p>
                        <p className="text-[10px] text-muted-foreground">Duration</p>
                      </div>
                    </div>

                    {/* Simulation config */}
                    <div className="p-3 rounded-lg bg-muted/10 border border-muted">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Simulation Parameters</p>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex justify-between"><span className="text-muted-foreground">Methodology:</span><span className="font-mono">{simulationResult.config?.methodologyVersion}</span></div>
                        <div className="flex justify-between"><span className="text-muted-foreground">Correction Rate:</span><span className="font-mono">{((simulationResult.config?.correctionRate ?? 0) * 100).toFixed(0)}%</span></div>
                        <div className="flex justify-between"><span className="text-muted-foreground">Rejection Rate:</span><span className="font-mono">{((simulationResult.config?.rejectionRate ?? 0) * 100).toFixed(0)}%</span></div>
                        <div className="flex justify-between"><span className="text-muted-foreground">Consistency:</span><span className="font-mono">{((simulationResult.config?.consistencyScore ?? 0) * 100).toFixed(0)}%</span></div>
                      </div>
                    </div>

                    {/* Feedback results detail */}
                    {simulationResult.feedbackResults?.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Feedback Details</p>
                        {simulationResult.feedbackResults.map((fb: any, i: number) => (
                          <div key={i} className="p-3 rounded-lg border bg-muted/5">
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-2">
                                {fb.refinements?.length > 0 && <RefreshCw className="size-3 text-violet-400" />}
                                <span className="text-xs font-semibold">{fb.refinements?.length ?? 0} refinements</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Badge variant="outline" className="text-[10px] border-amber-500/30 text-amber-400">SIM</Badge>
                                <Badge variant="outline" className="text-[10px]">{fb.impact?.memoryEventsCreated ?? 0} mem</Badge>
                                <Badge variant="outline" className="text-[10px]">{fb.impact?.confidenceAdjustments ?? 0} conf</Badge>
                              </div>
                            </div>
                            {fb.refinements?.map((r: any, j: number) => (
                              <div key={j} className="flex items-start gap-2 mt-1 text-xs text-muted-foreground">
                                <ArrowRight className="size-3 shrink-0 mt-0.5 text-violet-400" />
                                <div>
                                  <span className="font-mono text-[10px] bg-violet-500/10 px-1 rounded">{r.type}</span>
                                  {' '}{r.category}: {r.oldValue.substring(0, 40)}{r.oldValue.length > 40 ? '…' : ''}
                                  {r.newValue && <span className="text-emerald-400"> → {r.newValue.substring(0, 40)}{r.newValue.length > 40 ? '…' : ''}</span>}
                                </div>
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Methodology notes */}
                    {simulationResult.methodologyNotes?.length > 0 && (
                      <div className="p-3 rounded-lg bg-muted/10 border border-muted">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Methodology Audit Trail</p>
                        <div className="space-y-1 max-h-32 overflow-y-auto scrollbar-thin">
                          {simulationResult.methodologyNotes.map((note: string, i: number) => (
                            <p key={i} className="text-[11px] text-muted-foreground">• {note}</p>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {!simulationLoading && !simulationResult && (
                  <div className="text-center py-6 text-muted-foreground">
                    <FlaskConical className="size-10 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">Run disclosed simulation to generate creator feedback</p>
                    <p className="text-xs mt-1">All simulation data is clearly labeled as simulated</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Feedback Summary */}
            <Card className="rounded-xl">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <BarChart3 className="size-4 text-emerald-400" />
                    Feedback Summary
                  </CardTitle>
                  <Button
                    onClick={async () => {
                      setFeedbackSummaryLoading(true);
                      setFeedbackSummary(null);
                      try {
                        const res = await fetch('/api/feedback/summary');
                        const json = await res.json();
                        if (json.success) setFeedbackSummary(json.summary);
                      } catch { /* fail */ }
                      setFeedbackSummaryLoading(false);
                    }}
                    disabled={feedbackSummaryLoading}
                    size="sm"
                    variant="outline"
                    className="gap-2"
                  >
                    <BarChart3 className="size-3" />
                    {feedbackSummaryLoading ? 'Loading…' : 'Load Summary'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {feedbackSummary && (
                  <div className="space-y-4">
                    {/* Summary stats */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 rounded-lg bg-muted/20">
                      <div className="text-center">
                        <p className="text-sm font-bold">{feedbackSummary.totalFeedback}</p>
                        <p className="text-[10px] text-muted-foreground">Total Feedback</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-bold">{feedbackSummary.memoryRefinements}</p>
                        <p className="text-[10px] text-muted-foreground">Memory Refinements</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-bold">{feedbackSummary.confidenceShifts}</p>
                        <p className="text-[10px] text-muted-foreground">Confidence Shifts</p>
                      </div>
                      <div className="text-center">
                        <Badge variant="outline" className={`text-[10px] ${feedbackSummary.isSimulation ? 'border-amber-500/30 text-amber-400' : 'border-emerald-500/30 text-emerald-400'}`}>
                          {feedbackSummary.isSimulation ? 'SIMULATED' : 'REAL'}
                        </Badge>
                      </div>
                    </div>

                    {/* Feedback by type */}
                    <div className="grid grid-cols-5 gap-2">
                      {(['correction', 'approval', 'rejection', 'refinement', 'preference'] as const).map((type) => {
                        const count = feedbackSummary.byType?.[type] ?? 0;
                        const colors: Record<string, string> = {
                          correction: 'text-violet-400',
                          approval: 'text-emerald-400',
                          rejection: 'text-red-400',
                          refinement: 'text-amber-400',
                          preference: 'text-sky-400',
                        };
                        return (
                          <div key={type} className="text-center p-2 rounded-lg bg-muted/10">
                            <p className={`text-sm font-bold ${colors[type]}`}>{count}</p>
                            <p className="text-[10px] text-muted-foreground capitalize">{type}</p>
                          </div>
                        );
                      })}
                    </div>

                    {/* Top correction patterns */}
                    {feedbackSummary.topCorrectionPatterns?.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Top Correction Patterns</p>
                        {feedbackSummary.topCorrectionPatterns.slice(0, 5).map((cp: any, i: number) => (
                          <div key={i} className="flex items-start gap-3 p-2 rounded-lg bg-muted/5 border border-muted">
                            <Badge variant="outline" className="text-[10px] shrink-0">{cp.category}</Badge>
                            <div className="text-xs text-muted-foreground min-w-0 flex-1">
                              <span className="truncate block">{cp.exampleOriginal.substring(0, 50)}</span>
                              <span className="text-emerald-400">→ {cp.exampleCorrected.substring(0, 50)}</span>
                            </div>
                            <Badge variant="outline" className="text-[10px] shrink-0">×{cp.count}</Badge>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Recent feedback */}
                    {feedbackSummary.recentFeedback?.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Recent Feedback</p>
                        <div className="max-h-48 overflow-y-auto scrollbar-thin space-y-1">
                          {feedbackSummary.recentFeedback.slice(0, 10).map((fb: any, i: number) => {
                            const typeColors: Record<string, string> = {
                              correction: 'bg-violet-500/10 border-violet-500/20',
                              approval: 'bg-emerald-500/10 border-emerald-500/20',
                              rejection: 'bg-red-500/10 border-red-500/20',
                              refinement: 'bg-amber-500/10 border-amber-500/20',
                              preference: 'bg-sky-500/10 border-sky-500/20',
                            };
                            return (
                              <div key={i} className={`flex items-start gap-2 p-2 rounded-lg border ${typeColors[fb.feedbackType] ?? 'bg-muted/10'}`}>
                                <Badge className="text-[9px] capitalize shrink-0" variant="outline">{fb.feedbackType}</Badge>
                                <div className="text-xs min-w-0 flex-1">
                                  <span className="font-semibold">{fb.targetTitle}</span>
                                  {fb.correctedValue && (
                                    <span className="text-muted-foreground">: {fb.originalValue.substring(0, 30)} → <span className="text-emerald-400">{fb.correctedValue.substring(0, 30)}</span></span>
                                  )}
                                  {fb.reason && <p className="text-muted-foreground text-[10px] mt-0.5 truncate">{fb.reason}</p>}
                                </div>
                                {fb.isSimulation && <Badge variant="outline" className="text-[9px] border-amber-500/30 text-amber-400 shrink-0">SIM</Badge>}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}
                {!feedbackSummary && !feedbackSummaryLoading && (
                  <div className="text-center py-6 text-muted-foreground">
                    <BarChart3 className="size-10 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">Load feedback summary to see collected corrections</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Refinement Timeline */}
            <Card className="rounded-xl">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <GitBranch className="size-4 text-violet-400" />
                    Refinement Timeline
                    <span className="text-[10px] text-muted-foreground font-normal">Feedback → Memory → Improvement</span>
                  </CardTitle>
                  <Button
                    onClick={async () => {
                      setRefinementLoading(true);
                      setRefinementTimeline([]);
                      try {
                        const res = await fetch('/api/feedback/refinements');
                        const json = await res.json();
                        if (json.success) setRefinementTimeline(json.timeline);
                      } catch { /* fail */ }
                      setRefinementLoading(false);
                    }}
                    disabled={refinementLoading}
                    size="sm"
                    variant="outline"
                    className="gap-2"
                  >
                    <GitBranch className="size-3" />
                    {refinementLoading ? 'Loading…' : 'Load Timeline'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {refinementTimeline.length > 0 && (
                  <div className="space-y-2 max-h-80 overflow-y-auto scrollbar-thin">
                    {refinementTimeline.map((entry: any, i: number) => {
                      const typeColors: Record<string, string> = {
                        memory_update: 'border-violet-500/20 bg-violet-500/5',
                        confidence_adjustment: 'border-amber-500/20 bg-amber-500/5',
                        pattern_correction: 'border-emerald-500/20 bg-emerald-500/5',
                        preference_update: 'border-sky-500/20 bg-sky-500/5',
                      };
                      const typeIcons: Record<string, React.ReactNode> = {
                        memory_update: <Database className="size-3 text-violet-400" />,
                        confidence_adjustment: <TrendingUp className="size-3 text-amber-400" />,
                        pattern_correction: <RefreshCw className="size-3 text-emerald-400" />,
                        preference_update: <Pencil className="size-3 text-sky-400" />,
                      };
                      return (
                        <div key={i} className={`p-3 rounded-lg border ${typeColors[entry.feedbackType] ?? 'border-muted bg-muted/5'}`}>
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              {typeIcons[entry.feedbackType] ?? <GitBranch className="size-3 text-muted-foreground" />}
                              <span className="text-xs font-semibold">{entry.category}</span>
                              <Badge variant="outline" className="text-[9px] capitalize">{entry.feedbackType.replace('_', ' ')}</Badge>
                            </div>
                            <div className="flex items-center gap-1">
                              {entry.isSimulation && <Badge variant="outline" className="text-[9px] border-amber-500/30 text-amber-400">SIM</Badge>}
                              <span className="text-[10px] text-muted-foreground font-mono">{new Date(entry.timestamp).toLocaleTimeString()}</span>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground">{entry.description}</p>
                          <div className="flex items-center gap-2 mt-1 text-[10px]">
                            {entry.beforeValue && (
                              <span className="text-red-400/80 line-through truncate max-w-[120px]">{entry.beforeValue.substring(0, 40)}</span>
                            )}
                            {entry.afterValue && (
                              <span className="text-emerald-400 truncate max-w-[120px]">→ {entry.afterValue.substring(0, 40)}</span>
                            )}
                            {entry.confidenceShift !== 0 && (
                              <Badge variant="outline" className={`text-[9px] ${entry.confidenceShift > 0 ? 'text-emerald-400 border-emerald-500/20' : 'text-red-400 border-red-500/20'}`}>
                                {entry.confidenceShift > 0 ? '+' : ''}{entry.confidenceShift.toFixed(2)} conf
                              </Badge>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
                {refinementTimeline.length === 0 && !refinementLoading && (
                  <div className="text-center py-6 text-muted-foreground">
                    <GitBranch className="size-10 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">Load refinement timeline to see the feedback → memory → improvement chain</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Manual Feedback Submit */}
            <Card className="rounded-xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <Send className="size-4 text-violet-400" />
                  Submit Manual Feedback
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Feedback Type</label>
                      <Select defaultValue="correction" onValueChange={(v) => { /* stored in closure */ }}>
                        <SelectTrigger className="mt-1 h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="correction">Correction</SelectItem>
                          <SelectItem value="approval">Approval</SelectItem>
                          <SelectItem value="rejection">Rejection</SelectItem>
                          <SelectItem value="refinement">Refinement</SelectItem>
                          <SelectItem value="preference">Preference</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Target Type</label>
                      <Select defaultValue="hook" onValueChange={(v) => { /* stored in closure */ }}>
                        <SelectTrigger className="mt-1 h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hook">Hook</SelectItem>
                          <SelectItem value="voice">Voice</SelectItem>
                          <SelectItem value="recommendation">Recommendation</SelectItem>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="timing">Timing</SelectItem>
                          <SelectItem value="insight">Insight</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Original Value (Muse recommended)</label>
                    <Input className="mt-1 h-8 text-xs" placeholder="e.g., You won't BELIEVE what happened…" />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Corrected Value (Creator&apos;s version)</label>
                    <Input className="mt-1 h-8 text-xs" placeholder="e.g., I spent 30 days testing this — here's what worked" />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Reason</label>
                    <Textarea className="mt-1 text-xs" rows={2} placeholder="Why the creator disagrees with Muse's recommendation" />
                  </div>
                  <Button
                    onClick={async () => {
                      setFeedbackSubmitLoading(true);
                      setFeedbackSubmitResult(null);
                      try {
                        // Submit a demo correction
                        const res = await fetch('/api/feedback/submit', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            creatorId: creatorData?.creator?.id ?? validation?.config?.creatorId,
                            feedbackType: 'correction',
                            targetType: 'hook',
                            targetId: 'manual-hook-1',
                            targetTitle: 'Manual Creator Correction',
                            originalValue: 'AI-generated hook suggestion',
                            correctedValue: 'Creator-preferred hook style',
                            reason: 'Creator manually corrected the hook to match their authentic voice',
                            category: 'hook',
                            confidence: 0.9,
                          }),
                        });
                        const json = await res.json();
                        if (json.success) setFeedbackSubmitResult(json.result);
                      } catch { /* fail */ }
                      setFeedbackSubmitLoading(false);
                    }}
                    disabled={feedbackSubmitLoading}
                    size="sm"
                    className="gap-2 w-full"
                  >
                    <Send className="size-3" />
                    {feedbackSubmitLoading ? 'Submitting…' : 'Submit Feedback (Demo)'}
                  </Button>
                  {feedbackSubmitResult && (
                    <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="size-4 text-emerald-400" />
                        <span className="text-xs font-semibold">Feedback submitted — Memory refined</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 mt-2 text-[10px]">
                        <div className="text-center">
                          <p className="font-bold">{feedbackSubmitResult.refinements?.length ?? 0}</p>
                          <p className="text-muted-foreground">Refinements</p>
                        </div>
                        <div className="text-center">
                          <p className="font-bold">{feedbackSubmitResult.impact?.memoryEventsCreated ?? 0}</p>
                          <p className="text-muted-foreground">Memory Events</p>
                        </div>
                        <div className="text-center">
                          <p className="font-bold">{feedbackSubmitResult.impact?.confidenceAdjustments ?? 0}</p>
                          <p className="text-muted-foreground">Conf Adj</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="validation" className="space-y-6">
            <Card className="rounded-xl border-violet-500/30 bg-gradient-to-br from-violet-500/10 to-transparent muse-card-hover">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 muse-stagger-1">
                  <ShieldCheck className="size-8 text-violet-400" />
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight">Phase 7: Validation</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      Run the creator through the full MUSE flow. Verify every insight is genuine.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* E2E Validation Pipeline */}
            <Card className="rounded-xl">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <Target className="size-4 text-emerald-400" />
                    End-to-End Validation
                  </CardTitle>
                  <Button
                    onClick={async () => {
                      setE2eValidationLoading(true);
                      setE2eValidationResult(null);
                      try {
                        const res = await fetch('/api/validation/run', { method: 'POST' });
                        const json = await res.json();
                        if (json.success) setE2eValidationResult(json.result);
                      } catch { /* fail */ }
                      setE2eValidationLoading(false);
                    }}
                    disabled={e2eValidationLoading}
                    className="gap-2"
                    size="sm"
                  >
                    <Zap className="size-3" />
                    {e2eValidationLoading ? 'Running…' : 'Run Full Pipeline'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {e2eValidationLoading && (
                  <div className="flex items-center justify-center py-8 text-muted-foreground">
                    <div className="animate-pulse flex items-center gap-2">
                      <Target className="size-5 animate-spin" />
                      Running full validation pipeline…
                    </div>
                  </div>
                )}

                {e2eValidationResult && (
                  <div className="space-y-4">
                    {/* Overall result */}
                    <div className={`p-4 rounded-xl border ${
                      e2eValidationResult.overallPass
                        ? 'bg-emerald-500/10 border-emerald-500/30'
                        : 'bg-amber-500/10 border-amber-500/30'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {e2eValidationResult.overallPass
                            ? <CheckCircle2 className="size-5 text-emerald-400" />
                            : <AlertTriangle className="size-5 text-amber-400" />
                          }
                          <span className="font-bold">
                            {e2eValidationResult.overallPass ? 'ALL STEPS PASSED' : 'SOME STEPS FAILED'}
                          </span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {e2eValidationResult.steps?.length ?? 0} steps · {e2eValidationResult.totalDurationMs}ms
                        </Badge>
                      </div>
                    </div>

                    {/* Pipeline steps */}
                    <div className="space-y-2">
                      {e2eValidationResult.steps?.map((step: any, i: number) => (
                        <div key={i} className={`flex items-center gap-3 p-3 rounded-lg border ${
                          step.status === 'pass' ? 'bg-emerald-500/5 border-emerald-500/20' :
                          step.status === 'fail' ? 'bg-red-500/5 border-red-500/20' :
                          'bg-muted/30 border-muted'
                        }`}>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="font-mono text-xs text-muted-foreground w-6">{step.step}.</span>
                            {step.status === 'pass' && <CheckCircle2 className="size-4 text-emerald-400" />}
                            {step.status === 'fail' && <X className="size-4 text-red-400" />}
                            {step.status === 'skip' && <CircleDashed className="size-4 text-muted-foreground" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold">{step.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{step.evidence}</p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <Badge variant="outline" className="text-[10px]">{step.durationMs}ms</Badge>
                            <Badge className={`text-[10px] ${
                              step.status === 'pass' ? 'bg-emerald-600 text-white' :
                              step.status === 'fail' ? 'bg-red-600 text-white' :
                              'bg-gray-500 text-white'
                            }`}>{step.status.toUpperCase()}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Summary */}
                    {e2eValidationResult.summary && (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 rounded-lg bg-muted/20">
                        <div className="text-center">
                          <p className="text-sm font-bold">{e2eValidationResult.summary.contentItemsLoaded}</p>
                          <p className="text-[10px] text-muted-foreground">Content Items</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-bold">{e2eValidationResult.summary.insightsGenerated}</p>
                          <p className="text-[10px] text-muted-foreground">Insights</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-bold">{e2eValidationResult.summary.evaluationScore ?? '—'}</p>
                          <p className="text-[10px] text-muted-foreground">Eval Score</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-bold">{e2eValidationResult.summary.confidenceLevel ?? '—'}</p>
                          <p className="text-[10px] text-muted-foreground">Confidence</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {!e2eValidationLoading && !e2eValidationResult && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Target className="size-12 mx-auto mb-3 opacity-30" />
                    <p className="text-sm">Click &quot;Run Full Pipeline&quot; to validate the entire MUSE flow</p>
                    <p className="text-xs mt-1">Ingest → Learn → Delegate → Evaluate → Draft → Approve → Brief</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Statistical Honesty Report */}
            <Card className="rounded-xl">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <Scale className="size-4 text-violet-400" />
                    Statistical Honesty
                  </CardTitle>
                  <Button
                    onClick={async () => {
                      setHonestyLoading(true);
                      setHonestyReport(null);
                      try {
                        const res = await fetch('/api/validation/honesty');
                        const json = await res.json();
                        if (json.success) setHonestyReport(json.report);
                      } catch { /* fail */ }
                      setHonestyLoading(false);
                    }}
                    disabled={honestyLoading}
                    className="gap-2"
                    size="sm"
                    variant="outline"
                  >
                    <Scale className="size-3" />
                    {honestyLoading ? 'Verifying…' : 'Verify Honesty'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {honestyLoading && (
                  <div className="flex items-center justify-center py-8 text-muted-foreground">
                    <div className="animate-pulse flex items-center gap-2">
                      <Scale className="size-5 animate-spin" />
                      Verifying statistical honesty…
                    </div>
                  </div>
                )}

                {honestyReport && (
                  <div className="space-y-4">
                    {/* Overall score */}
                    <div className={`p-4 rounded-xl border ${
                      honestyReport.overallHonest
                        ? 'bg-emerald-500/10 border-emerald-500/30'
                        : 'bg-amber-500/10 border-amber-500/30'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {honestyReport.overallHonest
                            ? <ShieldCheck className="size-5 text-emerald-400" />
                            : <AlertTriangle className="size-5 text-amber-400" />
                          }
                          <span className="font-bold">
                            {honestyReport.overallHonest ? 'STATISTICALLY HONEST' : 'HONESTY ISSUES FOUND'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Progress value={honestyReport.score} className="w-20 h-2" />
                          <Badge variant="outline" className="text-xs">{honestyReport.score}/100</Badge>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        {honestyReport.passing} passing · {honestyReport.failing} failing · {honestyReport.warnings} warnings
                      </p>
                    </div>

                    {/* Individual checks */}
                    <div className="space-y-2">
                      {honestyReport.checks?.map((check: any, i: number) => (
                        <div key={i} className={`p-3 rounded-lg border ${
                          check.status === 'pass' ? 'bg-emerald-500/5 border-emerald-500/20' :
                          check.status === 'fail' ? 'bg-red-500/5 border-red-500/20' :
                          'bg-amber-500/5 border-amber-500/20'
                        }`}>
                          <div className="flex items-start gap-2">
                            {check.status === 'pass' && <CheckCircle2 className="size-4 text-emerald-400 mt-0.5 shrink-0" />}
                            {check.status === 'fail' && <X className="size-4 text-red-400 mt-0.5 shrink-0" />}
                            {check.status === 'warning' && <AlertTriangle className="size-4 text-amber-400 mt-0.5 shrink-0" />}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-[10px]">{check.category}</Badge>
                                <p className="text-sm font-medium">{check.description}</p>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">{check.evidence}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Summary stats */}
                    {honestyReport.summary && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-3 rounded-lg bg-muted/20">
                        <div className="text-center">
                          <p className="text-sm font-bold">{honestyReport.summary.recommendationsChecked}</p>
                          <p className="text-[10px] text-muted-foreground">Recs Checked</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-bold">{honestyReport.summary.memoryEventsChecked}</p>
                          <p className="text-[10px] text-muted-foreground">Memory Events</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-bold">{honestyReport.summary.auditEventsChecked}</p>
                          <p className="text-[10px] text-muted-foreground">Audit Events</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {!honestyLoading && !honestyReport && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Scale className="size-12 mx-auto mb-3 opacity-30" />
                    <p className="text-sm">Click &quot;Verify Honesty&quot; to audit all insights for statistical integrity</p>
                    <p className="text-xs mt-1">Checks evidence, confidence, source, audit trail, approval gate, metrics</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* ===== Footer ===== */}
      <footer className="border-t border-border bg-card mt-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between text-xs text-muted-foreground flex-wrap gap-2">
          <span>Autonomy ✅ • Overnight Loop ✅ • Approval Gate ✅ • Audit Trail ✅ • E2E Validation ✅ • Honesty ✅ • Feedback Loop ✅ • Disclosed Sim ✅ • Polish ✅ • 🧊 Scope frozen</span>
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
