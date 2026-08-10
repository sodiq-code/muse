import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({
    VERCEL: process.env.VERCEL ?? 'NOT_SET',
    TURSO_URL_SET: !!process.env.TURSO_DATABASE_URL,
    TURSO_URL_PREFIX: process.env.TURSO_DATABASE_URL?.substring(0, 30) ?? 'NOT_SET',
    TURSO_TOKEN_SET: !!process.env.TURSO_AUTH_TOKEN,
    TURSO_TOKEN_PREFIX: process.env.TURSO_AUTH_TOKEN?.substring(0, 20) ?? 'NOT_SET',
    DATABASE_URL_SET: !!process.env.DATABASE_URL,
    DATABASE_URL_PREFIX: process.env.DATABASE_URL?.substring(0, 30) ?? 'NOT_SET',
    NODE_ENV: process.env.NODE_ENV ?? 'NOT_SET',
  });
}
