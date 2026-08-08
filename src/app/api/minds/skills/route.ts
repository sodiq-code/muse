import { NextRequest, NextResponse } from 'next/server';
import { adapterListEquippedSkills } from '@/lib/minds-adapter';
import { getMindsConfig } from '@/lib/minds-client';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const mindId = searchParams.get('mindId');

    if (!mindId) {
      return NextResponse.json(
        { error: 'mindId query parameter is required' },
        { status: 400 }
      );
    }

    const skills = await adapterListEquippedSkills(mindId);

    return NextResponse.json({ mindId, skills, count: skills.length });
  } catch (error) {
    // Fallback to config-based IDs
    const config = getMindsConfig();
    if (mindId) {
      const skills = await adapterListEquippedSkills(mindId).catch(() => []);
      return NextResponse.json({ mindId, skills, count: skills.length });
    }
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}
