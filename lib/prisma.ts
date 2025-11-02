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
  if (resolvedLibsqlUrl) {
    try {
      console.log('[Prisma] Using LibSQL adapter')
      const { PrismaLibSQL } = require('@prisma/adapter-libsql')
      const { createClient } = require('@libsql/client')

      const libsql = createClient({
        url: resolvedLibsqlUrl,
        authToken: tursoAuthToken, // for public Turso databases
      })

      const adapter = new PrismaLibSQL(libsql)
      return new PrismaClient({
        adapter,
        log: ['warn', 'error'],
      } as any)
    } catch (error: any) {
      console.error('[Prisma] ✗ Failed to initialize LibSQL adapter:', {
        message: error?.message,
      })
      console.error('[Prisma] Falling back to default Prisma client')
      return new PrismaClient()
    }
  }

  // Default Prisma Client (e.g., local sqlite)
  console.log('[Prisma] Using default Prisma client (no LibSQL env detected)')
  return new PrismaClient()
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
