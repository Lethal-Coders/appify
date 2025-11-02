import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient() {
  const isBuildPhase = process.env.NEXT_PHASE === 'phase-production-build'
  const isProduction = process.env.NODE_ENV === 'production'
  
  console.log('[Prisma] Environment check:', {
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PHASE: process.env.NEXT_PHASE,
    isBuildPhase,
    isProduction,
    hasTursoUrl: !!process.env.TURSO_DATABASE_URL,
    hasTursoToken: !!process.env.TURSO_AUTH_TOKEN
  })
  
  // In production (Vercel), always use Turso. Skip during build phase.
  const useTurso = (isProduction || process.env.USE_TURSO === 'true') && 
                   !!process.env.TURSO_DATABASE_URL && 
                   !isBuildPhase

  console.log('[Prisma] Use Turso:', useTurso)

  if (useTurso) {
    try {
      const { PrismaLibSQL } = require('@prisma/adapter-libsql')
      const { createClient } = require('@libsql/client')

      const dbUrl = process.env.TURSO_DATABASE_URL
      console.log('[Prisma] Creating Turso client with URL:', dbUrl?.substring(0, 40) + '...')

      const libsql = createClient({
        url: dbUrl!,
        authToken: process.env.TURSO_AUTH_TOKEN!,
      })

      const adapter = new PrismaLibSQL(libsql)
      const client = new PrismaClient({
        adapter,
        log: isProduction ? ['error', 'warn'] : ['query', 'info', 'warn', 'error'],
      } as any)
      
      console.log('[Prisma] ✓ Prisma client with Turso adapter created successfully')
      return client
    } catch (error: any) {
      console.error('[Prisma] ✗ Failed to initialize LibSQL adapter:', {
        message: error.message,
        stack: error.stack
      })
      // Fall back to regular client
      console.error('[Prisma] Falling back to default Prisma client')
      return new PrismaClient()
    }
  }

  // Default Prisma Client (uses prisma/schema.prisma datasource)
  console.log('[Prisma] Using default Prisma client')
  return new PrismaClient()
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
