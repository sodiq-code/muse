import { NextRequest, NextResponse } from 'next/server';
import { getCreatorByEmail, getIdentityDomain, getMemoryEvents } from '@/lib/creator-service';
import { seedCreator, isSeeded } from '@/lib/seed';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

/** GET /api/creator — Get creator profile with identity domain + memory events count */
export async function GET() {
  try {
    // Ensure seed has run
    const seeded = await isSeeded();
    if (!seeded) {
      await seedCreator();
    }

    // Get Jules creator by known email
    const creator = await getCreatorByEmail('sodiqjimoh80@gmail.com');
    if (!creator) {
      return NextResponse.json({ success: false, error: 'Creator not found' }, { status: 404 });
    }

    const identityDomain = await getIdentityDomain(creator.id);
    const memoryCount = await db.memoryEvent.count({ where: { creatorId: creator.id } });
    const auditCount = await db.auditEvent.count({ where: { creatorId: creator.id } });

    // Parse JSON fields for response
    const tone: string[] = creator.tone ? JSON.parse(creator.tone) : [];
    const avoid: string[] = creator.avoid ? JSON.parse(creator.avoid) : [];
    const voiceProfile: Record<string, number> = creator.voiceProfile ? JSON.parse(creator.voiceProfile) : {};

    return NextResponse.json({
      success: true,
      creator: {
        ...creator,
        tone,
        avoid,
        voiceProfile,
      },
      identityDomain,
      stats: {
        memoryEvents: memoryCount,
        auditEvents: auditCount,
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

/** POST /api/creator — Create/seed creator (idempotent) */
export async function POST() {
  try {
    const creatorId = await seedCreator();
    const creator = await getCreatorByEmail('sodiqjimoh80@gmail.com');

    return NextResponse.json({
      success: true,
      creatorId,
      creator,
      message: 'Creator seeded successfully',
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

/** PATCH /api/creator — Update identity domain fields */
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, niche, audience, tone, avoid } = body;

    // Get Jules creator
    const creator = await getCreatorByEmail('sodiqjimoh80@gmail.com');
    if (!creator) {
      return NextResponse.json({ success: false, error: 'Creator not found' }, { status: 404 });
    }

    const { updateIdentity } = await import('@/lib/creator-service');
    const updated = await updateIdentity(creator.id, { name, niche, audience, tone, avoid });

    // Return with parsed JSON fields
    const parsedTone: string[] = updated.tone ? JSON.parse(updated.tone) : [];
    const parsedAvoid: string[] = updated.avoid ? JSON.parse(updated.avoid) : [];
    const voiceProfile: Record<string, number> = updated.voiceProfile ? JSON.parse(updated.voiceProfile) : {};

    return NextResponse.json({
      success: true,
      creator: {
        ...updated,
        tone: parsedTone,
        avoid: parsedAvoid,
        voiceProfile,
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
