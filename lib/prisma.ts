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

      const libsql = createClient({
        url: process.env.DATABASE_URL,
        authToken: process.env.TURSO_AUTH_TOKEN,
      })

      const adapter = new PrismaLibSQL(libsql)
      return new PrismaClient({ adapter } as any)
    } catch (error) {
      console.error('Failed to initialize LibSQL adapter:', error)
      throw new Error('LibSQL adapter required for libsql:// URLs')
    }
  }

  // Default Prisma Client
  return new PrismaClient()
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
