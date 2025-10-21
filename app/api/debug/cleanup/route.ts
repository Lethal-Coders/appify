import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Delete the test user
    await prisma.user.deleteMany({
      where: {
        email: 'test@example.com'
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Test user deleted'
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 })
  }
}
