import { NextRequest, NextResponse } from 'next/server';
import { adapterSendMessage } from '@/lib/minds-adapter';
import { getMindsConfig } from '@/lib/minds-client';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { alias, message, mindId } = body as {
      alias?: string;
      message?: string;
      mindId?: string;
    };

    if (!alias || !message) {
      return NextResponse.json(
        { error: 'alias and message are required' },
        { status: 400 }
      );
    }

    const config = getMindsConfig();
    const targetMindId = mindId ?? config.museId;

    const result = await adapterSendMessage(alias, message, targetMindId);

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}
