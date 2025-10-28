import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient() {
  // Prefer local SQLite in dev. Only use Turso when explicitly enabled.
  const isBuildPhase = process.env.NEXT_PHASE === 'phase-production-build'
  const useTurso = process.env.USE_TURSO === 'true' && !!process.env.TURSO_DATABASE_URL && !isBuildPhase

  if (useTurso) {
    try {
      // Dynamic require to avoid build-time resolution
      const { PrismaLibSQL } = require('@prisma/adapter-libsql')
      const { createClient } = require('@libsql/client')

      const dbUrl = process.env.TURSO_DATABASE_URL
      console.log('[Prisma] Creating LibSQL client with URL:', dbUrl?.substring(0, 40))

      const libsql = createClient({
        url: dbUrl!,
        authToken: process.env.TURSO_AUTH_TOKEN!,
      })

      console.log('[Prisma] Creating Prisma adapter')
      const adapter = new PrismaLibSQL(libsql)

      console.log('[Prisma] Creating Prisma client with adapter')
      const client = new PrismaClient({
        adapter,
      } as any)
      console.log('[Prisma] Prisma client created successfully')

      return client
    } catch (error: any) {
      console.error('[Prisma] Failed to initialize LibSQL adapter:',  {
        message: error.message,
        stack: error.stack,
        name: error.name
      })
      // Fall back to regular client
      return new PrismaClient()
    }
  }

  // Default Prisma Client (uses prisma/schema.prisma datasource)
  console.log('[Prisma] Using default Prisma client')
  return new PrismaClient()
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
