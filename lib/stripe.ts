import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-09-30.clover',
  typescript: true,
})

export const PRICING = {
  SINGLE: {
    amount: parseInt(process.env.STRIPE_SINGLE_APP_PRICE || '2999'),
    name: 'Single App',
    description: 'Generate one mobile app',
    currency: 'usd',
  },
  MONTHLY: {
    amount: parseInt(process.env.STRIPE_MONTHLY_PRICE || '4999'),
    name: 'Monthly Subscription',
    description: 'Unlimited apps per month',
    currency: 'usd',
    interval: 'month' as const,
  },
  YEARLY: {
    amount: parseInt(process.env.STRIPE_YEARLY_PRICE || '49999'),
    name: 'Yearly Subscription',
    description: 'Unlimited apps per year (save $100)',
    currency: 'usd',
    interval: 'year' as const,
  },
}

export async function createOrRetrieveCustomer(
  email: string,
  userId: string
): Promise<string> {
  const { prisma } = await import('./prisma')
  
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { stripeCustomerId: true },
  })

  if (user?.stripeCustomerId) {
    return user.stripeCustomerId
  }

  const customer = await stripe.customers.create({
    email,
    metadata: { userId },
  })

  await prisma.user.update({
    where: { id: userId },
    data: { stripeCustomerId: customer.id },
  })

  return customer.id
}
