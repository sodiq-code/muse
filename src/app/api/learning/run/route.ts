import { NextResponse } from 'next/server';
import {
  runLearningEngineOnCreatorData,
  getDefaultCreatorId,
  type LearningRunResult,
} from '@/lib/learning-engine-service';

export const dynamic = 'force-dynamic';

// Cache control — learning runs should not be cached (they write to DB)
export async function GET() {
  try {
    // Get the default creator (Jules)
    const creatorId = await getDefaultCreatorId();

    // Run the full 5-step learning loop on real DB data
    const result: LearningRunResult = await runLearningEngineOnCreatorData(creatorId);

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error('Learning engine run error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to run learning engine',
      },
      { status: 500 }
    );
  }
}

// POST variant — triggers a learning run
export async function POST() {
  try {
    const creatorId = await getDefaultCreatorId();
    const result: LearningRunResult = await runLearningEngineOnCreatorData(creatorId);

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error('Learning engine run error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to run learning engine',
      },
      { status: 500 }
    );
  }
}
