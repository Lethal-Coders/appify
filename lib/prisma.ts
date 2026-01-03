import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient() {
  const tursoDbUrl = process.env.TURSO_DATABASE_URL
  const tursoAuthToken = process.env.TURSO_AUTH_TOKEN
  const databaseUrl = process.env.DATABASE_URL

  const resolvedLibsqlUrl = tursoDbUrl || (databaseUrl?.startsWith('libsql://') ? databaseUrl : undefined)

  console.log('[Prisma] Environment check:', {
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PHASE: process.env.NEXT_PHASE,
    hasTursoUrl: !!tursoDbUrl,
    hasTursoToken: !!tursoAuthToken,
    hasDatabaseUrl: !!databaseUrl,
    dbUrlIsLibsql: databaseUrl?.startsWith('libsql://') || false,
    libsqlUrlPreview: resolvedLibsqlUrl?.substring(0, 40) || 'NOT SET',
  })

  // Prefer LibSQL/Turso when available
  if (tursoDbUrl && tursoAuthToken) {
    try {
      console.log('[Prisma] Initializing LibSQL adapter with TURSO_DATABASE_URL')
      const { PrismaLibSQL } = require('@prisma/adapter-libsql')
      const { createClient } = require('@libsql/client')

      const libsql = createClient({
        url: tursoDbUrl,
        authToken: tursoAuthToken,
      })

      const adapter = new PrismaLibSQL(libsql)
      console.log('[Prisma] LibSQL adapter initialized successfully')
      return new PrismaClient({
        adapter,
        log: ['query', 'info', 'warn', 'error'],
      } as any)
    } catch (error: any) {
      console.error('[Prisma] ✗ CRITICAL: Failed to initialize LibSQL adapter:', error)
      // Do NOT fall back to default client if we intended to use Turso, as it will fail on Vercel
      throw error
    }
  }

  console.log('[Prisma] No TURSO credentials found, using default Prisma client (likely local SQLite)')
  return new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
  })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
