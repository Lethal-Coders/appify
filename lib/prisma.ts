import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient() {
  // Only use LibSQL adapter if DATABASE_URL is a libsql:// URL and we're not in build phase
  const isBuildPhase = process.env.NEXT_PHASE === 'phase-production-build'

  if (process.env.DATABASE_URL?.startsWith('libsql://') && !isBuildPhase) {
    console.log('Initializing Prisma with LibSQL adapter for Turso')

    try {
      // Use dynamic imports to avoid loading these during build
      const { PrismaLibSQL } = eval('require')('@prisma/adapter-libsql')
      const { createClient } = eval('require')('@libsql/client')

      const libsql = createClient({
        url: process.env.DATABASE_URL,
        authToken: process.env.TURSO_AUTH_TOKEN,
      })

      const adapter = new PrismaLibSQL(libsql)
      return new PrismaClient({ adapter } as any)
    } catch (error) {
      console.error('Failed to initialize LibSQL adapter:', error)
      throw error  // Don't fall back - we need LibSQL for this URL
    }
  }

  // Default to regular Prisma Client for SQLite or during build
  console.log('Initializing Prisma with default SQLite adapter')
  return new PrismaClient()
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
