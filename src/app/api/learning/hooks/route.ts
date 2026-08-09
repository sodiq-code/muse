import { NextRequest, NextResponse } from 'next/server';
import { classifyHook, classifyHooks, ALL_PATTERNS, PATTERN_LABELS } from '@/lib/hook-classifier';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, texts } = body;

    // Single classification
    if (text && typeof text === 'string') {
      const result = classifyHook(text);
      return NextResponse.json({
        success: true,
        classification: result,
        patterns: ALL_PATTERNS.map((p) => ({ id: p, label: PATTERN_LABELS[p] })),
      });
    }

    // Batch classification
    if (texts && Array.isArray(texts)) {
      const results = classifyHooks(texts);
      return NextResponse.json({
        success: true,
        classifications: results,
        patterns: ALL_PATTERNS.map((p) => ({ id: p, label: PATTERN_LABELS[p] })),
      });
    }

    return NextResponse.json(
      { success: false, error: 'Provide "text" (string) or "texts" (string[]) in request body' },
      { status: 400 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
