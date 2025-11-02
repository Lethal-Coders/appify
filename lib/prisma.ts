import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient() {
  const tursoDbUrl = process.env.TURSO_DATABASE_URL;
  const tursoAuthToken = process.env.TURSO_AUTH_TOKEN;

  console.log('[Prisma] Environment check:', {
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PHASE: process.env.NEXT_PHASE,
    hasTursoUrl: !!tursoDbUrl,
    hasTursoToken: !!tursoAuthToken,
    tursoUrlPreview: tursoDbUrl?.substring(0, 40) || 'NOT SET',
  });

  // Use Turso if the specific Turso environment variables are set
  if (tursoDbUrl && tursoAuthToken) {
    try {
      console.log('[Prisma] Using Turso based on TURSO_DATABASE_URL.');
      const { PrismaLibSQL } = require('@prisma/adapter-libsql');
      const { createClient } = require('@libsql/client');

      const libsql = createClient({
        url: tursoDbUrl,
        authToken: tursoAuthToken,
      });

      const adapter = new PrismaLibSQL(libsql);
      return new PrismaClient({
        adapter,
        log: ['warn', 'error'],
      } as any);

    } catch (error: any) {
      console.error('[Prisma] ✗ Failed to initialize LibSQL adapter:', {
        message: error.message,
      });
      console.error('[Prisma] Falling back to default Prisma client due to error');
      return new PrismaClient();
    }
  }

  // Default Prisma Client (for local dev and Vercel build phase)
  console.log('[Prisma] Using default Prisma client (local or build phase)');
  return new PrismaClient();
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
