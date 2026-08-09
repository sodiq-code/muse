import { NextRequest, NextResponse } from 'next/server';
import { predictHookPerformance } from '@/lib/hook-comparison';
import { seedCreator, seedPerformanceData } from '@/lib/seed';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { hookText } = body;

    if (!hookText || typeof hookText !== 'string' || hookText.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'hookText (string) is required in request body' },
        { status: 400 }
      );
    }

    // Auto-seed creator if not exists
    const creatorId = await seedCreator();
    await seedPerformanceData(creatorId);

    const result = await predictHookPerformance(creatorId, hookText.trim());

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error('Hook prediction error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to predict hook performance' },
      { status: 500 }
    );
  }
}
