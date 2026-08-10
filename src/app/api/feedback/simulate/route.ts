// POST /api/feedback/simulate — Run disclosed simulation with methodological rigor
// GET /api/feedback/simulate — Get simulation scenarios
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import {
  runDisclosedSimulation,
  getDefaultSimulationConfig,
  getSimulationScenarios,
} from '@/lib/disclosed-simulation-service';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { creatorId } = body;

    // Get or create creator
    let creator = creatorId
      ? await db.creator.findUnique({ where: { id: creatorId } })
      : null;

    if (!creator) {
      creator = await db.creator.findFirst();
    }

    if (!creator) {
      return NextResponse.json(
        { success: false, error: 'No creator found. Run seed first.' },
        { status: 400 }
      );
    }

    const config = getDefaultSimulationConfig(creator.id, creator.name);
    const result = await runDisclosedSimulation(config);

    return NextResponse.json({ success: true, result });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message ?? 'Simulation failed' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const scenarios = getSimulationScenarios();
    return NextResponse.json({ success: true, scenarios });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
