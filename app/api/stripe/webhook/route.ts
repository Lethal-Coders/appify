import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import Stripe from 'stripe'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = headers().get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    )
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        await handleCheckoutSessionCompleted(session)
        break
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionUpdate(subscription)
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionDeleted(subscription)
        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice
        await handleInvoicePaymentSucceeded(invoice)
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        await handleInvoicePaymentFailed(invoice)
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Error processing webhook:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId
  const plan = session.metadata?.plan
  const projectId = session.metadata?.projectId

  if (!userId || !plan) {
    console.error('Missing metadata in checkout session')
    return
  }

  // Create payment record
  const payment = await prisma.payment.create({
    data: {
      userId,
      amount: (session.amount_total || 0) / 100,
      currency: session.currency || 'usd',
      status: 'completed',
      stripePaymentId: session.payment_intent as string,
      stripeSessionId: session.id,
      plan,
    },
  })

  // If single payment and project ID exists, mark project as paid
  if (plan === 'single' && projectId) {
    await prisma.project.update({
      where: { id: projectId },
      data: {
        isPaid: true,
        paymentId: payment.id,
      },
    })
  }

  // If subscription, create subscription record
  if (plan === 'monthly' || plan === 'yearly') {
    const subscriptionId = session.subscription as string
    const subscription = await stripe.subscriptions.retrieve(subscriptionId)

    await prisma.subscription.upsert({
      where: { userId },
      create: {
        userId,
        stripeSubscriptionId: subscription.id,
        stripePriceId: subscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
        status: subscription.status,
        plan,
      },
      update: {
        stripeSubscriptionId: subscription.id,
        stripePriceId: subscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
        status: subscription.status,
        plan,
      },
    })
  }
}

async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.userId

  if (!userId) {
    console.error('No userId in subscription metadata')
    return
  }

  await prisma.subscription.upsert({
    where: { userId },
    create: {
      userId,
      stripeSubscriptionId: subscription.id,
      stripePriceId: subscription.items.data[0].price.id,
      stripeCurrentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
      status: subscription.status,
      plan: subscription.metadata?.plan || 'monthly',
    },
    update: {
      stripePriceId: subscription.items.data[0].price.id,
      stripeCurrentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
      status: subscription.status,
    },
  })
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.userId

  if (!userId) {
    console.error('No userId in subscription metadata')
    return
  }

  await prisma.subscription.update({
    where: { userId },
    data: {
      status: 'canceled',
    },
  })
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  const subscriptionId = (invoice as any).subscription
  if (!subscriptionId || typeof subscriptionId !== 'string') return

  const subscription = await stripe.subscriptions.retrieve(subscriptionId)

  const userId = subscription.metadata?.userId

  if (!userId) return

  await prisma.subscription.update({
    where: { userId },
    data: {
      status: 'active',
      stripeCurrentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
    },
  })
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  const subscriptionId = (invoice as any).subscription
  if (!subscriptionId || typeof subscriptionId !== 'string') return

  const subscription = await stripe.subscriptions.retrieve(subscriptionId)

  const userId = subscription.metadata?.userId

  if (!userId) return

  await prisma.subscription.update({
    where: { userId },
    data: {
      status: 'past_due',
    },
  })
}
