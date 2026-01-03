import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Get the user ID from the payments
    const userId = 'cmh9rzm560000tygcfjkdiwdk'
    
    // Create a subscription record for the user
    const subscription = await prisma.subscription.create({
      data: {
        userId,
        stripeSubscriptionId: 'sub_manual_fix_' + Date.now(),
        stripePriceId: 'price_monthly',
        stripeCurrentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        status: 'active',
        plan: 'monthly',
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Subscription created successfully!',
      subscription,
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 })
  }
}
