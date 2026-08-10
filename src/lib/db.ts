import { PrismaClient } from '@prisma/client'
import { PrismaLibSQL } from '@prisma/adapter-libsql'
import { createClient } from '@libsql/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const tursoUrl = process.env.TURSO_DATABASE_URL
const tursoToken = process.env.TURSO_AUTH_TOKEN
const isVercel = !!process.env.VERCEL
const useTurso = isVercel && !!(tursoUrl && tursoToken)

let db: PrismaClient

if (useTurso) {
  // Turso (libSQL) for Vercel serverless — initialized synchronously with static imports
  try {
    const libsql = createClient({
      url: tursoUrl!,
      authToken: tursoToken!,
    })

    const adapter = new PrismaLibSQL(libsql)
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
  db = globalForPrisma.prisma ?? new PrismaClient({
    log: process.env.NODE_ENV === 'production' ? [] : ['query'],
  })
  if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
}

export { db }
