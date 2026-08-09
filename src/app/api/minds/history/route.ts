import { NextRequest, NextResponse } from 'next/server';
import { adapterGetHistory } from '@/lib/minds-adapter';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const alias = searchParams.get('alias');
    const limit = searchParams.get('limit');

    if (!alias) {
      return NextResponse.json(
        { error: 'alias query parameter is required' },
        { status: 400 }
      );
    }

    const history = await adapterGetHistory(alias, limit ? parseInt(limit, 10) : 50);

    return NextResponse.json({ alias, history });
  } catch (error) {
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}
