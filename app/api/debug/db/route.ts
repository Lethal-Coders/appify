import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Try to query the database
    const userCount = await prisma.user.count()
    const accountCount = await prisma.account.count()
    const sessionCount = await prisma.session.count()
    const projectCount = await prisma.project.count()
    const paymentCount = await prisma.payment.count()

    // Get all projects with their payment status
    const projects = await prisma.project.findMany({
      include: {
        payment: true,
        user: {
          select: {
            email: true,
          }
        }
      }
    })

    // Get all payments
    const payments = await prisma.payment.findMany({
      include: {
        user: {
          select: {
            email: true,
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      database: {
        url: process.env.DATABASE_URL?.substring(0, 30) + '...',
        hasAuthToken: !!process.env.TURSO_AUTH_TOKEN,
      },
      counts: {
        users: userCount,
        accounts: accountCount,
        sessions: sessionCount,
        projects: projectCount,
        payments: paymentCount,
      },
      projects,
      payments,
      env: {
        nodeEnv: process.env.NODE_ENV,
        nextPhase: process.env.NEXT_PHASE,
        vercelEnv: process.env.VERCEL_ENV,
      }
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack,
      database: {
        url: process.env.DATABASE_URL?.substring(0, 30) + '...',
        hasAuthToken: !!process.env.TURSO_AUTH_TOKEN,
      },
      env: {
        nodeEnv: process.env.NODE_ENV,
        nextPhase: process.env.NEXT_PHASE,
        vercelEnv: process.env.VERCEL_ENV,
      }
    }, { status: 500 })
  }
}
