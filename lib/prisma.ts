import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient() {
  const isBuild = process.env.NEXT_PHASE === 'phase-production-build';
  const isVercel = !!process.env.VERCEL_ENV;
  const useTurso = isVercel && !!process.env.TURSO_DATABASE_URL && !isBuild;

  console.log('[Prisma] Environment check:', {
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PHASE: process.env.NEXT_PHASE,
    VERCEL_ENV: process.env.VERCEL_ENV,
    isBuild,
    isVercel,
    useTurso,
    hasTursoUrl: !!process.env.TURSO_DATABASE_URL,
  });

  if (useTurso) {
    try {
      const { PrismaLibSQL } = require('@prisma/adapter-libsql');
      const { createClient } = require('@libsql/client');

      const dbUrl = process.env.TURSO_DATABASE_URL;
      console.log('[Prisma] Creating Turso client with URL:', dbUrl?.substring(0, 40) + '...');

      const libsql = createClient({
        url: dbUrl!,
        authToken: process.env.TURSO_AUTH_TOKEN!,
      });

      const adapter = new PrismaLibSQL(libsql);
      const client = new PrismaClient({
        adapter,
        log: process.env.NODE_ENV === 'production' ? ['error', 'warn'] : ['query', 'info', 'warn', 'error'],
      } as any);
      
      console.log('[Prisma] ✓ Prisma client with Turso adapter created successfully');
      return client;
    } catch (error: any) {
      console.error('[Prisma] ✗ Failed to initialize LibSQL adapter:', {
        message: error.message,
        stack: error.stack,
      });
      console.error('[Prisma] Falling back to default Prisma client due to error');
      return new PrismaClient();
    }
  }

  // Default Prisma Client (for local dev and build phase)
  console.log('[Prisma] Using default Prisma client');
  return new PrismaClient();
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
