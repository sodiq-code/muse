import { PrismaClient } from '@prisma/client'
import { PrismaLibSQL } from '@prisma/adapter-libsql'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const tursoUrl = process.env.TURSO_DATABASE_URL
const tursoToken = process.env.TURSO_AUTH_TOKEN
// Use Turso whenever the URL and token are available (Vercel or local)
const useTurso = !!(tursoUrl && tursoToken)

let db: PrismaClient

if (useTurso) {
  // Turso (libSQL) — initialized synchronously via PrismaLibSQL config API
  try {
    const adapter = new PrismaLibSQL({
      url: tursoUrl!,
      authToken: tursoToken!,
    })
    db = new PrismaClient({ adapter } as any)
    console.log('[db] Connected to Turso:', tursoUrl!.replace(/\/\/.*\.turso\.io/, '//***.turso.io'))
  } catch (e) {
    console.error('[db] Turso init failed, falling back to SQLite:', e)
    db = globalForPrisma.prisma ?? new PrismaClient({
      log: process.env.NODE_ENV === 'production' ? [] : ['query'],
    })
    if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
  }
} else {
  // Standard SQLite for local development
  console.log('[db] Using local SQLite (no Turso config found)')
  db = globalForPrisma.prisma ?? new PrismaClient({
    log: process.env.NODE_ENV === 'production' ? [] : ['query'],
  })
  if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
}

export { db }
