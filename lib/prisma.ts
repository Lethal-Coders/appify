import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient() {
  const isVercel = !!process.env.VERCEL_ENV;
  const useTurso = isVercel && !!process.env.TURSO_DATABASE_URL;

  console.log('[Prisma] Environment check:', {
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PHASE: process.env.NEXT_PHASE,
    VERCEL_ENV: process.env.VERCEL_ENV,
    isVercel,
    useTurso,
    hasTursoUrl: !!process.env.TURSO_DATABASE_URL,
  });

  if (useTurso) {
    try {
      // Database connection for Vercel (production)
      const { PrismaLibSQL } = require('@prisma/adapter-libsql');
      const { createClient } = require('@libsql/client');
      
      console.log('[Prisma] Using Turso for Vercel runtime.');

      const libsql = createClient({
        url: process.env.TURSO_DATABASE_URL!,
        authToken: process.env.TURSO_AUTH_TOKEN!,
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
