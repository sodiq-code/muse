import { NextRequest, NextResponse } from 'next/server';
import { getMemoryEvents } from '@/lib/creator-service';
import { getCreatorByEmail } from '@/lib/creator-service';
import { seedCreator, isSeeded } from '@/lib/seed';

export const dynamic = 'force-dynamic';

/** GET /api/creator/memory — Get memory events (query: category?) */
export async function GET(request: NextRequest) {
  try {
    // Ensure seed has run
    const seeded = await isSeeded();
    if (!seeded) {
      await seedCreator();
    }

    const creator = await getCreatorByEmail('sodiqjimoh80@gmail.com');
    if (!creator) {
      return NextResponse.json({ success: false, error: 'Creator not found' }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') ?? undefined;

    const events = await getMemoryEvents(creator.id, category);

    return NextResponse.json({
      success: true,
      events,
      count: events.length,
      category: category ?? 'all',
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
