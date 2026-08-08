import { NextResponse } from 'next/server';
import { getAuditTrail, getCreatorByEmail } from '@/lib/creator-service';
import { seedCreator, isSeeded } from '@/lib/seed';

export const dynamic = 'force-dynamic';

/** GET /api/creator/audit — Get audit trail */
export async function GET() {
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

    const auditTrail = await getAuditTrail(creator.id);

    return NextResponse.json({
      success: true,
      events: auditTrail,
      count: auditTrail.length,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
