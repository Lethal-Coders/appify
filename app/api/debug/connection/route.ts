import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const envCheck = {
      NODE_ENV: process.env.NODE_ENV,
      NEXT_PHASE: process.env.NEXT_PHASE,
      hasTursoUrl: !!process.env.TURSO_DATABASE_URL,
      hasTursoToken: !!process.env.TURSO_AUTH_TOKEN,
      tursoUrlPreview: process.env.TURSO_DATABASE_URL?.substring(0, 30) || 'NOT SET',
    }

    // Try to query the database
    let dbTest = { success: false, error: null, userCount: 0 }
    try {
      const userCount = await prisma.user.count()
      dbTest = { success: true, error: null, userCount }
    } catch (error: any) {
      dbTest = { success: false, error: error.message, userCount: 0 }
    }

    return NextResponse.json({
      envCheck,
      dbTest,
      message: 'Database connection test'
    })
  } catch (error: any) {
    return NextResponse.json({
      error: error.message,
      stack: error.stack
    }, { status: 500 })
  }
}
