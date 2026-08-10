import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const results: Record<string, any> = {};

  // Check env vars
  results.env = {
    VERCEL: process.env.VERCEL ?? 'NOT_SET',
    TURSO_URL_SET: !!process.env.TURSO_DATABASE_URL,
    TURSO_TOKEN_SET: !!process.env.TURSO_AUTH_TOKEN,
    DATABASE_URL_SET: !!process.env.DATABASE_URL,
  };

  // Try Turso connection directly
  try {
    const { PrismaLibSQL } = await import('@prisma/adapter-libsql');
    results.adapterImport = 'SUCCESS';

    const tursoUrl = process.env.TURSO_DATABASE_URL!;
    const tursoToken = process.env.TURSO_AUTH_TOKEN!;

    const adapter = new PrismaLibSQL({
      url: tursoUrl,
      authToken: tursoToken,
    });
    results.adapterCreate = 'SUCCESS';

    const { PrismaClient } = await import('@prisma/client');
    const testDb = new PrismaClient({ adapter } as any);
    results.clientCreate = 'SUCCESS';

    // Try a simple query
    const creator = await testDb.creator.findFirst();
    results.query = 'SUCCESS';
    results.creator = creator ? { id: creator.id, name: creator.name, email: creator.email } : null;

    await testDb.$disconnect();
  } catch (e: any) {
    results.error = {
      message: e?.message ?? String(e),
      code: e?.code,
      name: e?.constructor?.name,
      stack: e?.stack?.substring(0, 500),
    };
  }

  // Also test the existing db export
  try {
    const { db } = await import('@/lib/db');
    const creator = await db.creator.findFirst();
    results.existingDb = {
      success: true,
      creator: creator ? { id: creator.id, name: creator.name } : null,
    };
  } catch (e: any) {
    results.existingDb = {
      success: false,
      error: e?.message ?? String(e),
    };
  }

  return NextResponse.json(results);
}
