import { NextResponse } from 'next/server';
import { getHookRankings } from '@/lib/hook-comparison';
import { seedCreator, seedPerformanceData } from '@/lib/seed';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Auto-seed creator if not exists
    const creatorId = await seedCreator();
    await seedPerformanceData(creatorId);

    const result = await getHookRankings(creatorId);

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error('Hook rankings error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get hook rankings' },
      { status: 500 }
    );
  }
}
