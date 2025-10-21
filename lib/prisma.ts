import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient() {
  // Check if we should use LibSQL adapter
  const isBuildPhase = process.env.NEXT_PHASE === 'phase-production-build'
  const useTurso = process.env.DATABASE_URL?.startsWith('libsql://') && !isBuildPhase

  if (useTurso) {
    try {
      // Dynamic require to avoid build-time resolution
      const { PrismaLibSQL } = require('@prisma/adapter-libsql')
      const { createClient } = require('@libsql/client')

      console.log('[Prisma] Creating LibSQL client with URL:', process.env.DATABASE_URL?.substring(0, 40))

      const libsql = createClient({
        url: process.env.DATABASE_URL!,
        authToken: process.env.TURSO_AUTH_TOKEN!,
      })

      console.log('[Prisma] Creating Prisma adapter')
      const adapter = new PrismaLibSQL(libsql)

      console.log('[Prisma] Creating Prisma client with adapter')
      const client = new PrismaClient({
        adapter,
        datasourceUrl: process.env.DATABASE_URL
      } as any)
      console.log('[Prisma] Prisma client created successfully')

      return client
    } catch (error: any) {
      console.error('[Prisma] Failed to initialize LibSQL adapter:',  {
        message: error.message,
        stack: error.stack,
        name: error.name
      })
      // Fall back to regular client and let it fail with a better error
      return new PrismaClient()
    }
  }

  // Default Prisma Client
  console.log('[Prisma] Using default Prisma client')
  return new PrismaClient()
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
