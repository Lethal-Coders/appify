import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient() {
  // Only use LibSQL adapter if DATABASE_URL is a libsql:// URL and we're not in build phase
  const isBuildPhase = process.env.NEXT_PHASE === 'phase-production-build'

  if (process.env.DATABASE_URL?.startsWith('libsql://') && !isBuildPhase) {
    try {
      const { PrismaLibSQL } = require('@prisma/adapter-libsql')
      const { createClient } = require('@libsql/client')

      const libsql = createClient({
        url: process.env.DATABASE_URL,
        authToken: process.env.TURSO_AUTH_TOKEN,
      })

      const adapter = new PrismaLibSQL(libsql)
      return new PrismaClient({ adapter })
    } catch (error) {
      console.warn('Failed to initialize LibSQL adapter, falling back to default Prisma Client:', error)
      return new PrismaClient()
    }
  }

  // Default to regular Prisma Client for SQLite or during build
  return new PrismaClient()
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
