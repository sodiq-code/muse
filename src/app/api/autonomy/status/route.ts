import { NextResponse } from 'next/server';
import { getAutonomyStatus, runOvernightPipeline } from '@/lib/autonomy-scheduler';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // If autonomy hasn't been run yet, run the pipeline to initialize
    const status = getAutonomyStatus();

    // If still sleeping, run the overnight pipeline to demonstrate
    if (status.phase === 'sleeping') {
      const result = runOvernightPipeline();
      return NextResponse.json({
        success: true,
        status: result,
        pipelineRun: true,
        message: 'Overnight pipeline executed — draft awaiting approval',
      });
    }

    return NextResponse.json({
      success: true,
      status,
      pipelineRun: false,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
