import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// If Turso is configured (TURSO_DATABASE_URL is set), use LibSQL adapter
// Otherwise, fall back to standard SQLite (for local dev)
async function createDbWithTurso(): Promise<PrismaClient> {
  const tursoUrl = process.env.TURSO_DATABASE_URL
  const tursoToken = process.env.TURSO_AUTH_TOKEN

  if (tursoUrl && tursoToken) {
    try {
      const { PrismaLibSQL } = await import('@prisma/adapter-libsql')
      const { createClient } = await import('@libsql/client')

      const libsql = createClient({
        url: tursoUrl,
        authToken: tursoToken,
      })

      const adapter = new PrismaLibSQL(libsql)
      return new PrismaClient({ adapter } as any)
    } catch (e) {
      console.warn('[db] Failed to initialize Turso adapter, falling back to SQLite:', e)
    }
  }

  // Standard SQLite (local dev or Vercel without Turso)
  return new PrismaClient({
    log: process.env.NODE_ENV === 'production' ? [] : ['query'],
  })
}

// Synchronous initialization for non-Turso environments
// Turso is initialized lazily on first use if configured
function createDbSync(): PrismaClient {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'production' ? [] : ['query'],
  })
}

// Check if Turso is configured
const tursoUrl = process.env.TURSO_DATABASE_URL
const tursoToken = process.env.TURSO_AUTH_TOKEN
const useTurso = !!(tursoUrl && tursoToken)

// For Turso: we need async init, but Prisma needs to be available synchronously
// Solution: create sync client immediately, replace with Turso client when ready
let _db: PrismaClient | null = null

if (useTurso) {
  // Create temporary sync client, then replace with Turso async
  _db = createDbSync()
  createDbWithTurso().then((tursoDb) => {
    _db = tursoDb
    if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = tursoDb
  }).catch(() => {
    // Keep sync client as fallback
  })
} else {
  _db = globalForPrisma.prisma ?? createDbSync()
  if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = _db
}

export const db = _db!
