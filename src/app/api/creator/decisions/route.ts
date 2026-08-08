import { NextRequest, NextResponse } from 'next/server';
import { createDecision, listDecisions, getDecisionSummary, type DecisionType } from '@/lib/decision-service';
import { seedCreator, seedPerformanceData, seedExtraContent, seedDecisions } from '@/lib/seed';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const creatorId = searchParams.get('creatorId') ?? (await seedCreator());

    // Auto-seed decisions
    await seedPerformanceData(creatorId);
    await seedExtraContent(creatorId);
    await seedDecisions(creatorId);

    const decision = searchParams.get('decision') as DecisionType | null;
    const summary = await getDecisionSummary(creatorId);

    const decisions = await listDecisions(creatorId, {
      decision: decision ?? undefined,
      limit: 50,
    });

    // Compute acceptance rate and modification rate
    const acceptanceRate = summary.total > 0
      ? (summary.byType.accepted + summary.byType.modified) / summary.total
      : 0;
    const modificationRate = summary.total > 0
      ? summary.byType.modified / summary.total
      : 0;

    // Find most rejected category
    let mostRejectedCategory = '—';
    const rejectionCategories: Record<string, number> = {};
    summary.rejectionReasons.forEach(r => {
      rejectionCategories[r.category] = (rejectionCategories[r.category] ?? 0) + r.count;
    });
    const topRejectionCat = Object.entries(rejectionCategories).sort(([, a], [, b]) => b - a)[0];
    if (topRejectionCat) {
      mostRejectedCategory = topRejectionCat[0];
    }
    // Also check byCategory if no rejection reasons
    if (mostRejectedCategory === '—' && Object.keys(summary.byCategory).length > 0) {
      mostRejectedCategory = Object.entries(summary.byCategory).sort(([, a], [, b]) => b - a)[0][0];
    }

    return NextResponse.json({
      success: true,
      summary: {
        total: summary.total,
        accepted: summary.byType.accepted,
        modified: summary.byType.modified,
        rejected: summary.byType.rejected,
        ignored: summary.byType.ignored,
        acceptanceRate,
        modificationRate,
        mostRejectedCategory,
      },
      decisions: decisions.map(d => {
        // Extract category from modifications JSON if available
        let category = 'general';
        if (d.modifications) {
          try {
            const mod = JSON.parse(d.modifications);
            if (mod.category) category = mod.category;
          } catch { /* skip */ }
        }
        return {
          id: d.id,
          contentItemId: d.contentItem?.id ?? '',
          contentItemTitle: d.contentItem?.title ?? 'Unknown',
          decisionType: d.decision,
          category,
          reason: d.reason ?? '',
          modifications: d.modifications,
          createdAt: d.createdAt.toISOString(),
        };
      }),
      learnings: summary.learnings.map(l => ({
        insight: l.insight,
        confidence: l.confidence,
        dataPoints: l.dataPoints,
      })),
    });
  } catch (error) {
    console.error('Decisions list error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to list decisions' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { contentItemId, decisionType, category, reason } = body;

    const decision = decisionType;
    if (!decision || !['accepted', 'modified', 'rejected', 'ignored'].includes(decision)) {
      return NextResponse.json(
        { success: false, error: 'decision must be one of: accepted, modified, rejected, ignored' },
        { status: 400 }
      );
    }

    const effectiveCreatorId = await seedCreator();

    const result = await createDecision({
      creatorId: effectiveCreatorId,
      contentItemId,
      decision,
      category,
      reason,
    });

    return NextResponse.json({
      success: true,
      decision: {
        id: result.id,
        decision: result.decision,
        createdAt: result.createdAt,
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Decision create error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create decision' },
      { status: 500 }
    );
  }
}
