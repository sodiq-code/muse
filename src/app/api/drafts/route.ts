import { NextRequest, NextResponse } from 'next/server';
import {
  listDrafts,
  getDraftWithContent,
  deleteDraft,
} from '@/lib/draft-pipeline';
import { getDefaultCreatorId } from '@/lib/delegation-service';

export const dynamic = 'force-dynamic';

/**
 * GET /api/drafts
 * List all drafts for the creator, or get a single draft by ?id=xxx
 */
export async function GET(request: NextRequest) {
  try {
    const creatorId = await getDefaultCreatorId();
    const { searchParams } = new URL(request.url);
    const draftId = searchParams.get('id');

    if (draftId) {
      // Get single draft with full content
      const draft = await getDraftWithContent(draftId);
      if (!draft) {
        return NextResponse.json(
          { success: false, error: 'Draft not found' },
          { status: 404 }
        );
      }
      return NextResponse.json({
        success: true,
        draft: draft.draft,
        fullContent: draft.fullContent,
        evaluation: draft.evaluation,
      });
    }

    // List all drafts
    const drafts = await listDrafts(creatorId);

    // Compute summary stats
    const totalDrafts = drafts.length;
    const passedDrafts = drafts.filter((d) => d.evaluationPassed).length;
    const avgScore = totalDrafts > 0
      ? drafts.reduce((sum, d) => sum + d.evaluationScore, 0) / totalDrafts
      : 0;
    const avgVoiceMatch = totalDrafts > 0
      ? drafts.reduce((sum, d) => sum + d.voiceMatch, 0) / totalDrafts
      : 0;
    const avgHookCompat = totalDrafts > 0
      ? drafts.reduce((sum, d) => sum + d.hookCompat, 0) / totalDrafts
      : 0;

    return NextResponse.json({
      success: true,
      drafts,
      summary: {
        totalDrafts,
        passedDrafts,
        failedDrafts: totalDrafts - passedDrafts,
        avgScore: Math.round(avgScore * 1000) / 1000,
        avgVoiceMatch: Math.round(avgVoiceMatch * 1000) / 1000,
        avgHookCompat: Math.round(avgHookCompat * 1000) / 1000,
      },
    });
  } catch (error) {
    console.error('Drafts list error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to list drafts' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/drafts
 * Delete a draft by ?id=xxx
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const draftId = searchParams.get('id');

    if (!draftId) {
      return NextResponse.json(
        { success: false, error: 'Draft ID required (?id=xxx)' },
        { status: 400 }
      );
    }

    const creatorId = await getDefaultCreatorId();
    const deleted = await deleteDraft(draftId, creatorId);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Draft not found or not owned by creator' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      deleted: true,
      draftId,
    });
  } catch (error) {
    console.error('Draft delete error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to delete draft' },
      { status: 500 }
    );
  }
}
