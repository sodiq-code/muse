import { NextRequest, NextResponse } from 'next/server';
import { compareHookVsHistory } from '@/lib/hook-comparison';
import { seedCreator, seedPerformanceData } from '@/lib/seed';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const hookText = searchParams.get('hookText');

    if (!hookText || hookText.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'hookText query parameter is required' },
        { status: 400 }
      );
    }

    // Auto-seed creator if not exists
    const creatorId = await seedCreator();
    await seedPerformanceData(creatorId);

    const result = await compareHookVsHistory(creatorId, hookText.trim());

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error('Hook comparison error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to compare hook against history' },
      { status: 500 }
    );
  }
}
