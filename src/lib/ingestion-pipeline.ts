// ============================================================================
// Content Ingestion Pipeline — Day 5
// Bulk ingest creator content with auto hook classification + metrics.
// Designed for onboarding: when a creator joins, we import their
// existing content library to seed the memory graph.
// ============================================================================

import { db } from '@/lib/db';
import { classifyHook, type HookPattern } from '@/lib/hook-classifier';
import { logMemoryEvent } from '@/lib/creator-service';
import { computeEngagementScore } from '@/lib/performance-service';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface IngestItem {
  type: string;             // "youtube_video", "twitter_thread", "instagram_post"
  title: string;
  body?: string;
  hookText?: string;        // Opening hook text (auto-classified if provided)
  hookPattern?: HookPattern; // Override pattern if known
  status?: string;          // "published", "drafting", "idea"
  publishedAt?: string;     // ISO date
  metrics?: Record<string, number>; // { views: 18400, likes: 892, ... }
  platformMeta?: Record<string, unknown>;
}

export interface IngestResult {
  itemId: string;
  title: string;
  hook?: {
    text: string;
    pattern: string;
    confidence: number;
  };
  metricsCount: number;
  engagementScore: number | null;
}

export interface BulkIngestResult {
  totalItems: number;
  totalHooks: number;
  totalMetrics: number;
  results: IngestResult[];
  durationMs: number;
  errors: string[];
}

// ---------------------------------------------------------------------------
// Single Item Ingest
// ---------------------------------------------------------------------------

export async function ingestSingleItem(
  creatorId: string,
  item: IngestItem
): Promise<IngestResult> {
  // 1. Create ContentItem
  const contentItem = await db.contentItem.create({
    data: {
      creatorId,
      type: item.type,
      title: item.title,
      body: item.body ?? null,
      status: item.status ?? 'published',
      platformMeta: item.platformMeta ? JSON.stringify(item.platformMeta) : null,
      publishedAt: item.publishedAt ? new Date(item.publishedAt) : null,
    },
  });

  // 2. Create + classify Hook (if hook text provided)
  let hookResult: IngestResult['hook'] = undefined;
  let hookId: string | null = null;

  if (item.hookText) {
    // Auto-classify the hook
    const classification = item.hookPattern
      ? { pattern: item.hookPattern, confidence: 0.8, reasoning: 'Pattern override from ingest' }
      : classifyHook(item.hookText);

    const hook = await db.hook.create({
      data: {
        contentItemId: contentItem.id,
        text: item.hookText,
        hookType: 'opening',
      },
    });

    hookId = hook.id;

    // Create hook pattern record
    await db.hookPattern.create({
      data: {
        hookId: hook.id,
        patternName: classification.pattern,
        confidence: classification.confidence,
        sampleSize: 0,
      },
    });

    hookResult = {
      text: item.hookText,
      pattern: classification.pattern,
      confidence: classification.confidence,
    };
  }

  // 3. Create metrics (if provided)
  let metricsCount = 0;
  let engagementScore: number | null = null;

  if (item.metrics && Object.keys(item.metrics).length > 0) {
    const metricEntries = Object.entries(item.metrics).map(([key, value]) => ({
      contentItemId: contentItem.id,
      metricKey: key,
      metricValue: value,
      capturedAt: item.publishedAt ? new Date(item.publishedAt) : new Date(),
    }));

    await db.contentMetric.createMany({ data: metricEntries });
    metricsCount = metricEntries.length;

    // Compute engagement score
    engagementScore = computeEngagementScore(item.metrics);

    // Update hook effectiveness from engagement
    if (hookId && engagementScore > 0) {
      await db.hook.update({
        where: { id: hookId },
        data: { effectiveness: engagementScore },
      });
    }
  }

  return {
    itemId: contentItem.id,
    title: item.title,
    hook: hookResult,
    metricsCount,
    engagementScore,
  };
}

// ---------------------------------------------------------------------------
// Bulk Ingest Pipeline
// ---------------------------------------------------------------------------

export async function bulkIngestContent(
  creatorId: string,
  items: IngestItem[]
): Promise<BulkIngestResult> {
  const startTime = Date.now();
  const results: IngestResult[] = [];
  const errors: string[] = [];
  let totalHooks = 0;
  let totalMetrics = 0;

  for (let i = 0; i < items.length; i++) {
    try {
      const result = await ingestSingleItem(creatorId, items[i]);
      results.push(result);
      if (result.hook) totalHooks++;
      totalMetrics += result.metricsCount;
    } catch (err) {
      errors.push(`Item ${i + 1} "${items[i].title}": ${String(err)}`);
    }
  }

  // Log memory event for the bulk ingest
  if (results.length > 0) {
    await logMemoryEvent({
      creatorId,
      category: 'performance',
      key: 'bulk_ingest',
      value: JSON.stringify({
        itemsIngested: results.length,
        hooksClassified: totalHooks,
        metricsIngested: totalMetrics,
      }),
      source: 'creator',
      confidence: 0.95,
    });
  }

  // Audit event
  await db.auditEvent.create({
    data: {
      creatorId,
      actor: 'system',
      action: 'create',
      targetType: 'bulk_ingest',
      targetId: creatorId,
      delta: JSON.stringify({
        itemsIngested: results.length,
        hooksClassified: totalHooks,
        metricsIngested: totalMetrics,
        errors: errors.length,
      }),
    },
  });

  return {
    totalItems: results.length,
    totalHooks,
    totalMetrics,
    results,
    durationMs: Date.now() - startTime,
    errors,
  };
}

// ---------------------------------------------------------------------------
// Ingest Status Check
// ---------------------------------------------------------------------------

export interface IngestStatus {
  totalContentItems: number;
  totalHooks: number;
  totalMetrics: number;
  hookPatternCoverage: number; // 0-1, fraction of patterns seen
  meetsMinimum: boolean; // true if 20+ items
  lastIngestAt: Date | null;
}

export async function getIngestStatus(creatorId: string): Promise<IngestStatus> {
  const [itemCount, hookCount, metricCount] = await Promise.all([
    db.contentItem.count({ where: { creatorId } }),
    db.hook.count({
      where: { contentItem: { creatorId } },
    }),
    db.contentMetric.count({
      where: { contentItem: { creatorId } },
    }),
  ]);

  // Check hook pattern coverage
  const patterns = await db.hookPattern.findMany({
    where: { hook: { contentItem: { creatorId } } },
    select: { patternName: true },
  });
  const uniquePatterns = new Set(patterns.map(p => p.patternName));
  const ALL_PATTERNS = 8; // contrarian_claim, question, story, statistic, tutorial, listicle, analogy, personal
  const hookPatternCoverage = uniquePatterns.size / ALL_PATTERNS;

  // Last ingest
  const lastItem = await db.contentItem.findFirst({
    where: { creatorId },
    orderBy: { createdAt: 'desc' },
    select: { createdAt: true },
  });

  return {
    totalContentItems: itemCount,
    totalHooks: hookCount,
    totalMetrics: metricCount,
    hookPatternCoverage,
    meetsMinimum: itemCount >= 20,
    lastIngestAt: lastItem?.createdAt ?? null,
  };
}
