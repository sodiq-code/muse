// ============================================================================
// Draft Pipeline — Day 10
// Store evaluated Maker output as Draft in database
//
// When Maker output PASSES evaluation, it becomes a Draft — a working
// version before publishing. This is the "store" step in:
//   Muse→Maker→evaluate→store
//
// Drafts are versioned — if the same topic gets multiple Maker outputs,
// each one increments the version.
// ============================================================================

import { db } from '@/lib/db';
import { type MakerOutput } from '@/lib/maker-simulator';
import { type EvaluationResult } from '@/lib/evaluation-service';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface DraftCreationInput {
  creatorId: string;
  evaluation: EvaluationResult;
  makerOutput: MakerOutput;
  topic: string;
  objective: string;
  instructionId: string;
  mode: 'live' | 'simulated';
}

export interface DraftCreationResult {
  success: boolean;
  draftId: string;
  contentItemId: string;
  version: number;
  evaluationPassed: boolean;
  timestamp: string;
  auditEventId: string;
}

export interface DraftWithDetails {
  id: string;
  contentItemId: string | null;
  version: number;
  content: string;          // JSON: full draft data
  changeLog: string | null;
  generatedBy: string | null;
  createdAt: Date;
  updatedAt: Date;
  // Computed fields
  title: string;
  evaluationScore: number;
  evaluationPassed: boolean;
  voiceMatch: number;
  hookCompat: number;
  contentQuality: number;
  topic: string;
  objective: string;
  source: 'live' | 'simulated';
}

// ---------------------------------------------------------------------------
// Step 1: Create or find ContentItem for the draft
// ---------------------------------------------------------------------------

async function ensureContentItem(
  creatorId: string,
  topic: string,
  title: string
): Promise<{ contentItemId: string; isNew: boolean }> {
  // Check if there's an existing "drafting" item for this topic
  const existing = await db.contentItem.findFirst({
    where: {
      creatorId,
      title: { contains: topic },
      status: 'drafting',
    },
    orderBy: { createdAt: 'desc' },
  });

  if (existing) {
    return { contentItemId: existing.id, isNew: false };
  }

  // Create new ContentItem in "drafting" status
  const contentItem = await db.contentItem.create({
    data: {
      creatorId,
      type: 'youtube_video',
      title: title,
      status: 'drafting',
      body: null, // Will be filled when draft is approved
    },
  });

  return { contentItemId: contentItem.id, isNew: true };
}

// ---------------------------------------------------------------------------
// Step 2: Determine next version number
// ---------------------------------------------------------------------------

async function getNextVersion(
  creatorId: string,
  contentItemId: string
): Promise<number> {
  const latestDraft = await db.draft.findFirst({
    where: {
      creatorId,
      contentItemId,
    },
    orderBy: { version: 'desc' },
  });

  return latestDraft ? latestDraft.version + 1 : 1;
}

// ---------------------------------------------------------------------------
// Step 3: Store Draft from evaluated Maker output
// ---------------------------------------------------------------------------

export async function storeDraftFromEvaluation(
  input: DraftCreationInput
): Promise<DraftCreationResult> {
  const { creatorId, evaluation, makerOutput, topic, objective, instructionId, mode } = input;

  // Only store if evaluation passed
  if (!evaluation.passed) {
    // Still log the failed attempt as an audit event
    const auditEvent = await db.auditEvent.create({
      data: {
        creatorId,
        actor: 'muse',
        action: 'reject',
        targetType: 'maker_output',
        targetId: evaluation.evaluationId,
        delta: JSON.stringify({
          evaluationId: evaluation.evaluationId,
          overallScore: evaluation.overallScore,
          failReasons: evaluation.failReasons,
          instructionId,
          topic,
          mode,
        }),
      },
    });

    return {
      success: false,
      draftId: '',
      contentItemId: '',
      version: 0,
      evaluationPassed: false,
      timestamp: new Date().toISOString(),
      auditEventId: auditEvent.id,
    };
  }

  // Ensure ContentItem exists
  const { contentItemId, isNew } = await ensureContentItem(
    creatorId,
    topic,
    makerOutput.title
  );

  // Get next version
  const version = await getNextVersion(creatorId, contentItemId);

  // Build draft content JSON
  const draftContent = {
    // Maker's creative output
    title: makerOutput.title,
    script: makerOutput.script,
    caption: makerOutput.caption,
    cta: makerOutput.cta,
    alternativeHooks: makerOutput.alternativeHooks,
    thumbnailConcept: makerOutput.thumbnailConcept,

    // Evaluation scores
    evaluation: {
      evaluationId: evaluation.evaluationId,
      overallScore: evaluation.overallScore,
      voiceMatch: evaluation.voiceMatch.overall,
      hookCompat: evaluation.hookCompat.overall,
      contentQuality: evaluation.contentQuality.overall,
      confidenceLevel: evaluation.confidenceLevel,
      passed: evaluation.passed,
    },

    // Metadata
    topic,
    objective,
    instructionId,
    source: makerOutput.source,
    mode,
  };

  // Build changelog
  const changeLog = version === 1
    ? `Initial draft from Maker (${mode}). Score: ${(evaluation.overallScore * 100).toFixed(0)}%`
    : `Revision v${version} from Maker (${mode}). Score: ${(evaluation.overallScore * 100).toFixed(0)}%. Voice: ${(evaluation.voiceMatch.overall * 100).toFixed(0)}%, Hook: ${(evaluation.hookCompat.overall * 100).toFixed(0)}%`;

  // Store Draft in database
  const draft = await db.draft.create({
    data: {
      creatorId,
      contentItemId,
      version,
      content: JSON.stringify(draftContent),
      changeLog,
      generatedBy: 'maker',
    },
  });

  // Store audit event
  const auditEvent = await db.auditEvent.create({
    data: {
      creatorId,
      actor: 'muse',
      action: 'create',
      targetType: 'draft',
      targetId: draft.id,
      delta: JSON.stringify({
        draftId: draft.id,
        contentItemId,
        version,
        evaluationId: evaluation.evaluationId,
        overallScore: evaluation.overallScore,
        voiceMatch: evaluation.voiceMatch.overall,
        hookCompat: evaluation.hookCompat.overall,
        contentQuality: evaluation.contentQuality.overall,
        instructionId,
        topic,
        mode,
        isNewContentItem: isNew,
      }),
    },
  });

  return {
    success: true,
    draftId: draft.id,
    contentItemId,
    version,
    evaluationPassed: true,
    timestamp: new Date().toISOString(),
    auditEventId: auditEvent.id,
  };
}

// ---------------------------------------------------------------------------
// Step 4: List drafts with computed details
// ---------------------------------------------------------------------------

export async function listDrafts(creatorId: string): Promise<DraftWithDetails[]> {
  const drafts = await db.draft.findMany({
    where: { creatorId },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });

  return drafts.map((draft) => {
    // Parse draft content
    let parsed: Record<string, unknown> = {};
    try {
      parsed = JSON.parse(draft.content);
    } catch {
      // Skip malformed
    }

    const evaluation = parsed.evaluation as {
      overallScore?: number;
      voiceMatch?: number;
      hookCompat?: number;
      contentQuality?: number;
      passed?: boolean;
    } | undefined;

    return {
      id: draft.id,
      contentItemId: draft.contentItemId,
      version: draft.version,
      content: draft.content,
      changeLog: draft.changeLog,
      generatedBy: draft.generatedBy,
      createdAt: draft.createdAt,
      updatedAt: draft.updatedAt,
      // Computed from parsed content
      title: (parsed.title as string) ?? 'Untitled Draft',
      evaluationScore: evaluation?.overallScore ?? 0,
      evaluationPassed: evaluation?.passed ?? false,
      voiceMatch: evaluation?.voiceMatch ?? 0,
      hookCompat: evaluation?.hookCompat ?? 0,
      contentQuality: evaluation?.contentQuality ?? 0,
      topic: (parsed.topic as string) ?? 'Unknown',
      objective: (parsed.objective as string) ?? 'Unknown',
      source: (parsed.source as 'live' | 'simulated') ?? 'simulated',
    };
  });
}

// ---------------------------------------------------------------------------
// Step 5: Get a single draft with full content
// ---------------------------------------------------------------------------

export async function getDraftWithContent(draftId: string): Promise<{
  draft: DraftWithDetails;
  fullContent: {
    script: string;
    caption: string;
    cta: string;
    alternativeHooks: string[];
    thumbnailConcept?: string;
  };
  evaluation: EvaluationResult;
} | null> {
  const draft = await db.draft.findUnique({
    where: { id: draftId },
  });

  if (!draft) return null;

  let parsed: Record<string, unknown> = {};
  try {
    parsed = JSON.parse(draft.content);
  } catch {
    // Skip
  }

  const evaluation = parsed.evaluation as {
    evaluationId?: string;
    overallScore?: number;
    voiceMatch?: number;
    hookCompat?: number;
    contentQuality?: number;
    confidenceLevel?: string;
    passed?: boolean;
  } | undefined;

  const draftWithDetails: DraftWithDetails = {
    id: draft.id,
    contentItemId: draft.contentItemId,
    version: draft.version,
    content: draft.content,
    changeLog: draft.changeLog,
    generatedBy: draft.generatedBy,
    createdAt: draft.createdAt,
    updatedAt: draft.updatedAt,
    title: (parsed.title as string) ?? 'Untitled Draft',
    evaluationScore: evaluation?.overallScore ?? 0,
    evaluationPassed: evaluation?.passed ?? false,
    voiceMatch: evaluation?.voiceMatch ?? 0,
    hookCompat: evaluation?.hookCompat ?? 0,
    contentQuality: evaluation?.contentQuality ?? 0,
    topic: (parsed.topic as string) ?? 'Unknown',
    objective: (parsed.objective as string) ?? 'Unknown',
    source: (parsed.source as 'live' | 'simulated') ?? 'simulated',
  };

  return {
    draft: draftWithDetails,
    fullContent: {
      script: (parsed.script as string) ?? '',
      caption: (parsed.caption as string) ?? '',
      cta: (parsed.cta as string) ?? '',
      alternativeHooks: (parsed.alternativeHooks as string[]) ?? [],
      thumbnailConcept: parsed.thumbnailConcept as string | undefined,
    },
    evaluation: {
      evaluationId: evaluation?.evaluationId ?? 'unknown',
      timestamp: draft.createdAt.toISOString(),
      voiceMatch: {
        overall: evaluation?.voiceMatch ?? 0,
        toneAlignment: 0,
        paceConsistency: 0,
        vocabularyMatch: 0,
        avoidTopicsCompliance: 0,
        strengthUtilization: 0,
        breakdown: [],
        evidence: [],
      },
      hookCompat: {
        overall: evaluation?.hookCompat ?? 0,
        primaryHookPatternMatch: 0,
        historicalAlignment: 0,
        hookVariety: 0,
        hookStrength: 0,
        breakdown: [],
        evidence: [],
      },
      contentQuality: {
        overall: evaluation?.contentQuality ?? 0,
        scriptStructure: 0,
        ctaClarity: 0,
        titleEffectiveness: 0,
        captionAlignment: 0,
        breakdown: [],
        evidence: [],
      },
      overallScore: evaluation?.overallScore ?? 0,
      confidenceLevel: (evaluation?.confidenceLevel as 'low' | 'medium' | 'high') ?? 'low',
      passed: evaluation?.passed ?? false,
      failReasons: [],
      passThreshold: 0.70,
      makerOutput: {
        title: (parsed.title as string) ?? '',
        hookCount: ((parsed.alternativeHooks as string[])?.length ?? 0) + 1,
        source: (parsed.source as 'live' | 'simulated') ?? 'simulated',
      },
      evaluationEvidence: [],
      dataPointsUsed: 0,
    },
  };
}

// ---------------------------------------------------------------------------
// Step 6: Delete a draft
// ---------------------------------------------------------------------------

export async function deleteDraft(draftId: string, creatorId: string): Promise<boolean> {
  const draft = await db.draft.findUnique({ where: { id: draftId } });
  if (!draft || draft.creatorId !== creatorId) return false;

  await db.draft.delete({ where: { id: draftId } });

  // Audit event
  await db.auditEvent.create({
    data: {
      creatorId,
      actor: 'creator',
      action: 'delete',
      targetType: 'draft',
      targetId: draftId,
      delta: JSON.stringify({ version: draft.version, generatedBy: draft.generatedBy }),
    },
  });

  return true;
}
