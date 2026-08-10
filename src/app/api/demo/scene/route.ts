import { NextRequest, NextResponse } from 'next/server';
import { getPrerecordedScene, DEMO_SCENES, TOTAL_DEMO_DURATION_MS } from '@/lib/demo-prerecorded-data';
import { DemoFallbackProvider } from '@/lib/demo-reliability-service';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const sceneParam = req.nextUrl.searchParams.get('scene');

    // If no scene parameter, return list of all scenes (summary only)
    if (!sceneParam) {
      const provider = new DemoFallbackProvider();
      await provider.initialize();

      const scenes = DEMO_SCENES.map((s) => ({
        sceneId: s.sceneId,
        sceneName: s.sceneName,
        sceneNumber: s.sceneNumber,
        durationMs: s.durationMs,
        emotionalArc: s.emotionalArc,
        turnCount: s.conversationTurns.length,
        isSimulation: s.isSimulation,
        source: s.source,
      }));

      return NextResponse.json({
        scenes,
        totalDurationMs: TOTAL_DEMO_DURATION_MS,
        fallbackMode: provider.getMode(),
        isSimulation: true,
        source: 'prerecorded',
      });
    }

    // Parse scene number
    const sceneNumber = parseInt(sceneParam, 10);
    if (isNaN(sceneNumber) || sceneNumber < 1 || sceneNumber > 10) {
      return NextResponse.json(
        { error: 'Invalid scene number. Must be 1-10.', isSimulation: true, source: 'prerecorded' },
        { status: 400 }
      );
    }

    const scene = getPrerecordedScene(sceneNumber);
    if (!scene) {
      return NextResponse.json(
        { error: `Scene ${sceneNumber} not found`, isSimulation: true, source: 'prerecorded' },
        { status: 404 }
      );
    }

    const provider = new DemoFallbackProvider();
    await provider.initialize();

    return NextResponse.json({
      scene,
      fallbackMode: provider.getMode(),
      isSimulation: true,
      source: 'prerecorded',
    });
  } catch (error) {
    return NextResponse.json(
      { error: String(error), isSimulation: true, source: 'prerecorded' },
      { status: 500 }
    );
  }
}
