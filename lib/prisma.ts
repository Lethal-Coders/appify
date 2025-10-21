import { PrismaClient } from '@prisma/client'
import { PrismaLibSQL } from '@prisma/adapter-libsql'
import { createClient } from '@libsql/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient() {
  // Only use LibSQL adapter if DATABASE_URL is a libsql:// URL and we're not in build phase
  const isBuildPhase = process.env.NEXT_PHASE === 'phase-production-build'

  if (process.env.DATABASE_URL?.startsWith('libsql://') && !isBuildPhase) {
    console.log('Initializing Prisma with LibSQL adapter for Turso')

    const libsql = createClient({
      url: process.env.DATABASE_URL,
      authToken: process.env.TURSO_AUTH_TOKEN,
    })

    const adapter = new PrismaLibSQL(libsql as any)
    return new PrismaClient({ adapter } as any)
  }

  // Default to regular Prisma Client for SQLite or during build
  console.log('Initializing Prisma with default SQLite adapter')
  return new PrismaClient()
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
