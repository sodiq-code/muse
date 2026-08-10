// ============================================================================
// Performance Service — Day 4
// Domain 3 of Creator Memory System: PERFORMANCE
// ContentItem CRUD, metrics ingestion, hook tracking, performance aggregation
// Statistical honesty enforced — all insights show sample sizes and confidence
// ============================================================================

import { db } from '@/lib/db';
import { logMemoryEvent } from '@/lib/creator-service';
import { classifyHook, type HookPattern } from '@/lib/hook-classifier';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CreateContentItemInput {
  creatorId: string;
  type: string;        // "youtube_video", "twitter_thread", "instagram_post"
  title: string;
  body?: string;
  status?: string;     // "idea", "drafting", "ready", "published", "archived"
  platformMeta?: Record<string, unknown>;
}

export interface IngestMetricsInput {
  contentItemId: string;
  metrics: MetricInput[];
}

export interface MetricInput {
  metricKey: string;    // "views", "likes", "shares", "comments", "watchTime", etc.
  metricValue: number;
}

export interface CreateHookInput {
  contentItemId: string;
  text: string;
  hookType?: string;    // "opening", "transition", "callback", "cta"
}

export interface PerformanceSummary {
  totalItems: number;
  byType: Record<string, number>;
  byStatus: Record<string, number>;
  totalMetrics: number;
  topMetrics: Record<string, { sum: number; avg: number; count: number }>;
  hookStats: {
    totalHooks: number;
    byPattern: Record<string, { count: number; avgEffectiveness: number; totalSampleSize: number }>;
    bestPattern: string | null;
    worstPattern: string | null;
  };
  recentItems: ContentItemSummary[];
}

export interface ContentItemSummary {
  id: string;
  title: string;
  type: string;
  status: string;
  hookCount: number;
  metricCount: number;
  createdAt: Date;
  publishedAt: Date | null;
}

export interface ContentItemDetail {
  id: string;
  title: string;
  type: string;
  status: string;
  body: string | null;
  platformMeta: Record<string, unknown> | null;
  hooks: HookDetail[];
  metrics: MetricDetail[];
  hookPatterns: HookPatternDetail[];
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date | null;
}

export interface HookDetail {
  id: string;
  text: string;
  hookType: string;
  effectiveness: number | null;
  pattern: string | null;
  patternConfidence: number | null;
}

export interface MetricDetail {
  id: string;
  metricKey: string;
  metricValue: number;
  capturedAt: Date;
}

export interface HookPatternDetail {
  patternName: string;
  confidence: number;
  sampleSize: number;
  avgEffectiveness: number | null;
}

// ---------------------------------------------------------------------------
// ContentItem CRUD
// ---------------------------------------------------------------------------

/** Create a new content item */
export async function createContentItem(input: CreateContentItemInput) {
  const item = await db.contentItem.create({
    data: {
      creatorId: input.creatorId,
      type: input.type,
      title: input.title,
      body: input.body ?? null,
      status: input.status ?? 'idea',
      platformMeta: input.platformMeta ? JSON.stringify(input.platformMeta) : null,
    },
  });

  // Audit event
  await db.auditEvent.create({
    data: {
      creatorId: input.creatorId,
      actor: 'creator',
      action: 'create',
      targetType: 'content_item',
      targetId: item.id,
      delta: JSON.stringify({ title: input.title, type: input.type }),
    },
  });

  // Log memory event
  await logMemoryEvent({
    creatorId: input.creatorId,
    category: 'performance',
    key: 'content_created',
    value: JSON.stringify({ type: input.type, title: input.title }),
    source: 'creator',
    confidence: 1.0,
  });

  return item;
}

/** Get content items for a creator */
export async function listContentItems(
  creatorId: string,
  options?: { type?: string; status?: string; limit?: number; offset?: number }
) {
  return db.contentItem.findMany({
    where: {
      creatorId,
      ...(options?.type ? { type: options.type } : {}),
      ...(options?.status ? { status: options.status } : {}),
    },
    include: {
      metrics: { orderBy: { capturedAt: 'desc' } },
      hooks: {
        include: { patterns: true },
        orderBy: { createdAt: 'desc' },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: options?.limit ?? 50,
    skip: options?.offset ?? 0,
  });
}

/** Get a single content item with full detail */
export async function getContentItemDetail(contentItemId: string): Promise<ContentItemDetail | null> {
  const item = await db.contentItem.findUnique({
    where: { id: contentItemId },
    include: {
      metrics: { orderBy: { capturedAt: 'desc' } },
      hooks: {
        include: { patterns: true },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!item) return null;

  return {
    id: item.id,
    title: item.title ?? 'Untitled',
    type: item.type,
    status: item.status,
    body: item.body,
    platformMeta: item.platformMeta ? JSON.parse(item.platformMeta) : null,
    hooks: item.hooks.map(h => ({
      id: h.id,
      text: h.text,
      hookType: h.hookType,
      effectiveness: h.effectiveness,
      pattern: h.patterns.length > 0 ? h.patterns[0].patternName : null,
      patternConfidence: h.patterns.length > 0 ? h.patterns[0].confidence : null,
    })),
    metrics: item.metrics.map(m => ({
      id: m.id,
      metricKey: m.metricKey,
      metricValue: m.metricValue,
      capturedAt: m.capturedAt,
    })),
    hookPatterns: item.hooks.flatMap(h =>
      h.patterns.map(p => ({
        patternName: p.patternName,
        confidence: p.confidence,
        sampleSize: p.sampleSize,
        avgEffectiveness: p.avgEffectiveness,
      }))
    ),
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    publishedAt: item.publishedAt,
  };
}

/** Update content item status */
export async function updateContentItemStatus(
  contentItemId: string,
  status: string,
  publishedAt?: Date
) {
  const item = await db.contentItem.findUnique({ where: { id: contentItemId } });
  if (!item) throw new Error(`Content item not found: ${contentItemId}`);

  const updated = await db.contentItem.update({
    where: { id: contentItemId },
    data: {
      status,
      ...(publishedAt ? { publishedAt } : {}),
      ...(status === 'published' && !item.publishedAt ? { publishedAt: new Date() } : {}),
    },
  });

  // Audit event
  await db.auditEvent.create({
    data: {
      creatorId: item.creatorId,
      actor: 'creator',
      action: 'update',
      targetType: 'content_item',
      targetId: contentItemId,
      delta: JSON.stringify({ status: { from: item.status, to: status } }),
    },
  });

  return updated;
}

// ---------------------------------------------------------------------------
// Metrics Ingestion
// ---------------------------------------------------------------------------

/** Ingest multiple metrics for a content item */
export async function ingestMetrics(input: IngestMetricsInput) {
  const item = await db.contentItem.findUnique({
    where: { id: input.contentItemId },
    include: { creator: true },
  });
  if (!item) throw new Error(`Content item not found: ${input.contentItemId}`);

  const created = await db.contentMetric.createMany({
    data: input.metrics.map(m => ({
      contentItemId: input.contentItemId,
      metricKey: m.metricKey,
      metricValue: m.metricValue,
    })),
  });

  // Compute engagement score from the metrics for hook effectiveness update
  const metricMap: Record<string, number> = {};
  for (const m of input.metrics) {
    metricMap[m.metricKey] = m.metricValue;
  }

  // If we have views + engagement data, update hook effectiveness
  if (metricMap.views && metricMap.views > 0) {
    const engagementScore = computeEngagementScore(metricMap);

    // Update all hooks on this content item with the effectiveness score
    const hooks = await db.hook.findMany({
      where: { contentItemId: input.contentItemId },
    });

    for (const hook of hooks) {
      await db.hook.update({
        where: { id: hook.id },
        data: { effectiveness: engagementScore },
      });

      // Update hook pattern effectiveness
      const patterns = await db.hookPattern.findMany({
        where: { hookId: hook.id },
      });

      for (const pattern of patterns) {
        const newSampleSize = pattern.sampleSize + 1;
        const newAvg = pattern.avgEffectiveness != null
          ? (pattern.avgEffectiveness * pattern.sampleSize + engagementScore) / newSampleSize
          : engagementScore;

        await db.hookPattern.update({
          where: { id: pattern.id },
          data: {
            avgEffectiveness: newAvg,
            sampleSize: newSampleSize,
          },
        });
      }
    }

    // Log memory event for performance
    await logMemoryEvent({
      creatorId: item.creatorId,
      category: 'performance',
      key: 'metrics_ingested',
      value: JSON.stringify({
        contentItemId: input.contentItemId,
        title: item.title,
        ...metricMap,
        engagementScore: Math.round(engagementScore * 1000) / 1000,
      }),
      source: 'analytics',
      confidence: 0.9,
    });
  }

  // Audit event
  await db.auditEvent.create({
    data: {
      creatorId: item.creatorId,
      actor: 'system',
      action: 'create',
      targetType: 'content_metric',
      targetId: input.contentItemId,
      delta: JSON.stringify({ metricsIngested: input.metrics.length, keys: input.metrics.map(m => m.metricKey) }),
    },
  });

  return { count: created.count, engagementScore: metricMap.views ? computeEngagementScore(metricMap) : null };
}

// ---------------------------------------------------------------------------
// Hook Creation + Auto-Classification
// ---------------------------------------------------------------------------

/** Create a hook and auto-classify its pattern */
export async function createHook(input: CreateHookInput) {
  const item = await db.contentItem.findUnique({
    where: { id: input.contentItemId },
    include: { creator: true },
  });
  if (!item) throw new Error(`Content item not found: ${input.contentItemId}`);

  // Auto-classify the hook
  const classification = classifyHook(input.text);

  // Create the hook
  const hook = await db.hook.create({
    data: {
      contentItemId: input.contentItemId,
      text: input.text,
      hookType: input.hookType ?? 'opening',
    },
  });

  // Create the hook pattern record
  await db.hookPattern.create({
    data: {
      hookId: hook.id,
      patternName: classification.pattern,
      confidence: classification.confidence,
      sampleSize: 0, // Will be updated when metrics come in
    },
  });

  // Log memory event
  await logMemoryEvent({
    creatorId: item.creatorId,
    category: 'pattern',
    key: 'hook_classified',
    value: JSON.stringify({
      text: input.text.slice(0, 100),
      pattern: classification.pattern,
      confidence: classification.confidence,
      contentItemId: input.contentItemId,
    }),
    source: 'muse_inference',
    confidence: classification.confidence,
  });

  // Audit event
  await db.auditEvent.create({
    data: {
      creatorId: item.creatorId,
      actor: 'system',
      action: 'create',
      targetType: 'hook',
      targetId: hook.id,
      delta: JSON.stringify({
        text: input.text.slice(0, 100),
        pattern: classification.pattern,
        confidence: classification.confidence,
      }),
    },
  });

  return {
    hook,
    classification,
  };
}

// ---------------------------------------------------------------------------
// Performance Aggregation
// ---------------------------------------------------------------------------

/** Get aggregated performance summary for a creator */
export async function getPerformanceSummary(creatorId: string): Promise<PerformanceSummary> {
  // Get all content items
  const items = await db.contentItem.findMany({
    where: { creatorId },
    include: {
      metrics: true,
      hooks: {
        include: { patterns: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  // By type
  const byType: Record<string, number> = {};
  items.forEach(i => { byType[i.type] = (byType[i.type] || 0) + 1; });

  // By status
  const byStatus: Record<string, number> = {};
  items.forEach(i => { byStatus[i.status] = (byStatus[i.status] || 0) + 1; });

  // Aggregate metrics
  const allMetrics = items.flatMap(i => i.metrics);
  const topMetrics: Record<string, { sum: number; avg: number; count: number }> = {};
  allMetrics.forEach(m => {
    if (!topMetrics[m.metricKey]) {
      topMetrics[m.metricKey] = { sum: 0, avg: 0, count: 0 };
    }
    topMetrics[m.metricKey].sum += m.metricValue;
    topMetrics[m.metricKey].count += 1;
  });
  // Compute averages
  for (const key of Object.keys(topMetrics)) {
    topMetrics[key].avg = topMetrics[key].sum / topMetrics[key].count;
  }

  // Hook stats
  const allHooks = items.flatMap(i => i.hooks);
  const allPatterns = allHooks.flatMap(h => h.patterns);
  const byPattern: Record<string, { count: number; avgEffectiveness: number; totalSampleSize: number }> = {};
  allPatterns.forEach(p => {
    if (!byPattern[p.patternName]) {
      byPattern[p.patternName] = { count: 0, avgEffectiveness: 0, totalSampleSize: 0 };
    }
    byPattern[p.patternName].count += 1;
    byPattern[p.patternName].totalSampleSize += p.sampleSize;
    if (p.avgEffectiveness != null) {
      // Weighted average
      const existing = byPattern[p.patternName];
      existing.avgEffectiveness = existing.avgEffectiveness === 0
        ? p.avgEffectiveness
        : (existing.avgEffectiveness + p.avgEffectiveness) / 2;
    }
  });

  // Best/worst pattern
  let bestPattern: string | null = null;
  let worstPattern: string | null = null;
  const patternEntries = Object.entries(byPattern).filter(([, v]) => v.avgEffectiveness > 0);
  if (patternEntries.length >= 1) {
    const sorted = patternEntries.sort((a, b) => b[1].avgEffectiveness - a[1].avgEffectiveness);
    bestPattern = sorted[0][0];
    worstPattern = sorted[sorted.length - 1][0];
  }

  // Recent items summary
  const recentItems: ContentItemSummary[] = items.slice(0, 10).map(i => ({
    id: i.id,
    title: i.title ?? 'Untitled',
    type: i.type,
    status: i.status,
    hookCount: i.hooks.length,
    metricCount: i.metrics.length,
    createdAt: i.createdAt,
    publishedAt: i.publishedAt,
  }));

  return {
    totalItems: items.length,
    byType,
    byStatus,
    totalMetrics: allMetrics.length,
    topMetrics,
    hookStats: {
      totalHooks: allHooks.length,
      byPattern,
      bestPattern,
      worstPattern,
    },
    recentItems,
  };
}

/** Get performance insights with statistical honesty */
export async function getPerformanceInsights(creatorId: string): Promise<PerformanceInsight[]> {
  const summary = await getPerformanceSummary(creatorId);
  const insights: PerformanceInsight[] = [];

  // Insight 1: Best performing hook pattern
  if (summary.hookStats.bestPattern) {
    const patternData = summary.hookStats.byPattern[summary.hookStats.bestPattern];
    const confidence = patternData.totalSampleSize >= 10 ? 'high' : patternData.totalSampleSize >= 5 ? 'medium' : 'low';

    insights.push({
      type: 'hook_performance',
      title: `Best hook pattern: ${summary.hookStats.bestPattern}`,
      detail: `Based on ${patternData.totalSampleSize} samples, ${summary.hookStats.bestPattern} hooks average ${(patternData.avgEffectiveness * 100).toFixed(1)}% effectiveness`,
      confidence,
      dataPoints: patternData.totalSampleSize,
      evidenceType: patternData.totalSampleSize >= 5 ? 'statistical' : 'observed',
    });
  }

  // Insight 2: Publishing velocity
  const published = summary.byStatus['published'] ?? 0;
  const total = summary.totalItems;
  if (total > 0) {
    const publishRate = published / total;
    insights.push({
      type: 'publishing_velocity',
      title: `Publishing rate: ${published} of ${total} items published`,
      detail: `${(publishRate * 100).toFixed(0)}% of content items have been published`,
      confidence: total >= 10 ? 'high' : total >= 5 ? 'medium' : 'low',
      dataPoints: total,
      evidenceType: 'observed',
    });
  }

  // Insight 3: Engagement overview
  if (summary.topMetrics['views']) {
    const avgViews = Math.round(summary.topMetrics['views'].avg);
    insights.push({
      type: 'engagement_overview',
      title: `Average views: ${avgViews.toLocaleString()}`,
      detail: `Across ${summary.topMetrics['views'].count} data points`,
      confidence: summary.topMetrics['views'].count >= 10 ? 'high' : 'medium',
      dataPoints: summary.topMetrics['views'].count,
      evidenceType: 'observed',
    });
  }

  return insights;
}

export interface PerformanceInsight {
  type: string;
  title: string;
  detail: string;
  confidence: 'low' | 'medium' | 'high';
  dataPoints: number;
  evidenceType: 'observed' | 'statistical' | 'correlation';
}

// ---------------------------------------------------------------------------
// Engagement Score Computation
// ---------------------------------------------------------------------------

export function computeEngagementScore(metrics: Record<string, number>): number {
  const views = metrics.views ?? 0;
  if (views === 0) return 0;

  const likes = metrics.likes ?? 0;
  const comments = metrics.comments ?? 0;
  const shares = metrics.shares ?? 0;

  // Weighted: shares matter most, then comments, then likes
  const sharesRate = shares / views;
  const commentsRate = comments / views;
  const likesRate = likes / views;

  return Math.min(1, sharesRate * 20 + commentsRate * 5 + likesRate * 2);
}
