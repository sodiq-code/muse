import { NextRequest, NextResponse } from 'next/server';
import { adapterGetCircle } from '@/lib/minds-adapter';

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

    const members = await adapterGetCircle(mindId);

    return NextResponse.json({ mindId, members, count: members.length });
  } catch (error) {
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}
