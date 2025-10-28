import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import DashboardLayout from '@/components/DashboardLayout'

export default async function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: { session_id?: string; project_id?: string }
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/signin')
  }

  // Verify payment and update database
  if (searchParams.session_id) {
    try {
      const checkoutSession = await stripe.checkout.sessions.retrieve(searchParams.session_id)
      
      if (checkoutSession.payment_status === 'paid') {
        const userId = checkoutSession.metadata?.userId
        const plan = checkoutSession.metadata?.plan
        const projectId = checkoutSession.metadata?.projectId

        if (userId && plan) {
          // Check if payment already exists
          const existingPayment = await prisma.payment.findUnique({
            where: { stripeSessionId: searchParams.session_id }
          })

          if (!existingPayment) {
            // Create payment record
            const payment = await prisma.payment.create({
              data: {
                userId,
                amount: (checkoutSession.amount_total || 0) / 100,
                currency: checkoutSession.currency || 'usd',
                status: 'completed',
                stripePaymentId: checkoutSession.payment_intent as string,
                stripeSessionId: checkoutSession.id,
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
              const subscriptionId = checkoutSession.subscription as string
              
              if (subscriptionId) {
                const subscription = await stripe.subscriptions.retrieve(subscriptionId)
                // Cast to access current_period_end which is a number (Unix timestamp)
                const currentPeriodEnd = (subscription as any).current_period_end as number
                
                if (currentPeriodEnd) {
                  await prisma.subscription.upsert({
                    where: { userId },
                    create: {
                      userId,
                      stripeSubscriptionId: subscription.id,
                      stripePriceId: subscription.items.data[0].price.id,
                      stripeCurrentPeriodEnd: new Date(currentPeriodEnd * 1000),
                      status: subscription.status,
                      plan,
                    },
                    update: {
                      stripeSubscriptionId: subscription.id,
                      stripePriceId: subscription.items.data[0].price.id,
                      stripeCurrentPeriodEnd: new Date(currentPeriodEnd * 1000),
                      status: subscription.status,
                      plan,
                    },
                  })
                }
              }
            }
          }
        }
      }
    } catch (error: any) {
      console.error('Error verifying payment:', error)
    }
  }

  return (
    <DashboardLayout user={session.user}>
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8 text-center border border-gray-200 dark:border-gray-700">
        <div className="mb-6">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-10 h-10 text-green-600 dark:text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Payment Successful! 🎉
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Thank you for your purchase. Your payment has been processed successfully.
          </p>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-300 mb-3">
            What happens next?
          </h2>
          <ul className="text-left space-y-3 text-blue-800 dark:text-blue-300">
            <li className="flex items-start">
              <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Your payment has been confirmed and recorded</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>You can now generate mobile apps based on your plan</span>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>You&apos;ll receive a confirmation email shortly</span>
            </li>
          </ul>
        </div>

        <div className="flex gap-4 justify-center">
          {searchParams.project_id ? (
            <Link
              href={`/dashboard/project/${searchParams.project_id}`}
              className="bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition"
            >
              Continue to Project
            </Link>
          ) : (
            <Link
              href="/dashboard/create"
              className="bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition"
            >
              Create Your First App
            </Link>
          )}
          <Link
            href="/dashboard"
            className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </DashboardLayout>
  )
}
