import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { stripe, PRICING, createOrRetrieveCustomer } from '@/lib/stripe'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id || !session.user.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { plan, projectId } = await request.json()

    if (!plan || !['single', 'monthly', 'yearly'].includes(plan)) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
    }

    // Create or retrieve Stripe customer
    const customerId = await createOrRetrieveCustomer(
      session.user.email,
      session.user.id
    )

    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
    
    let checkoutSession

    if (plan === 'single') {
      // One-time payment for single app
      checkoutSession = await stripe.checkout.sessions.create({
        customer: customerId,
        mode: 'payment',
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: PRICING.SINGLE.currency,
              unit_amount: PRICING.SINGLE.amount,
              product_data: {
                name: PRICING.SINGLE.name,
                description: PRICING.SINGLE.description,
              },
            },
            quantity: 1,
          },
        ],
        success_url: `${baseUrl}/dashboard/payment/success?session_id={CHECKOUT_SESSION_ID}&project_id=${projectId || ''}`,
        cancel_url: `${baseUrl}/dashboard/pricing?canceled=true`,
        metadata: {
          userId: session.user.id,
          plan: 'single',
          projectId: projectId || '',
        },
      })
    } else {
      // Subscription payment
      const pricing = plan === 'monthly' ? PRICING.MONTHLY : PRICING.YEARLY

      checkoutSession = await stripe.checkout.sessions.create({
        customer: customerId,
        mode: 'subscription',
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: pricing.currency,
              unit_amount: pricing.amount,
              product_data: {
                name: pricing.name,
                description: pricing.description,
              },
              recurring: {
                interval: pricing.interval,
              },
            },
            quantity: 1,
          },
        ],
        success_url: `${baseUrl}/dashboard/payment/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}/dashboard/pricing?canceled=true`,
        metadata: {
          userId: session.user.id,
          plan,
        },
      })
    }

    return NextResponse.json({ sessionId: checkoutSession.id, url: checkoutSession.url })
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
