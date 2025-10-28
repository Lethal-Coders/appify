import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import PricingCard from '@/components/PricingCard'
import { getUserSubscriptionStatus } from '@/lib/subscription'
import DashboardLayout from '@/components/DashboardLayout'

export default async function PricingPage({
  searchParams,
}: {
  searchParams: { project_id?: string; canceled?: string }
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/signin?callbackUrl=/dashboard/pricing')
  }

  const subscriptionStatus = await getUserSubscriptionStatus(session.user.id)

  return (
    <DashboardLayout user={session.user}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 px-4">
            Choose Your Plan
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-400 px-4">
            Select the perfect plan for your mobile app needs
          </p>
          {searchParams.canceled && (
            <div className="mt-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4 mx-4">
              <p className="text-sm sm:text-base text-yellow-800 dark:text-yellow-300">
                Payment was canceled. You can try again whenever you&apos;re ready.
              </p>
            </div>
          )}
          {subscriptionStatus.isActive && (
            <div className="mt-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-4 mx-4">
              <p className="text-sm sm:text-base text-green-800 dark:text-green-300 font-semibold">
                ✓ You have an active {subscriptionStatus.plan} subscription
              </p>
              <p className="text-xs sm:text-sm text-green-700 dark:text-green-400 mt-1">
                You can generate unlimited apps until{' '}
                {subscriptionStatus.currentPeriodEnd?.toLocaleDateString()}
              </p>
            </div>
          )}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-12">
          <PricingCard
            name="Single App"
            price="$29.99"
            description="Perfect for testing or one-time needs"
            features={[
              'Generate 1 mobile app',
              'iOS & Android builds',
              'Custom icon & splash screen',
              'Download AAB & IPA files',
              'One-time payment',
            ]}
            plan="single"
            projectId={searchParams.project_id}
          />

          <PricingCard
            name="Monthly Plan"
            price="$49.99"
            period="month"
            description="Unlimited apps for growing businesses"
            features={[
              'Unlimited app generation',
              'iOS & Android builds',
              'Custom branding',
              'Priority support',
              'Cancel anytime',
            ]}
            plan="monthly"
            popular
          />

          <PricingCard
            name="Yearly Plan"
            price="$499.99"
            period="year"
            description="Best value for serious developers"
            features={[
              'Unlimited app generation',
              'iOS & Android builds',
              'Custom branding',
              'Priority support',
              'Save $100 per year',
            ]}
            plan="yearly"
          />
        </div>

        <div className="bg-purple-50 dark:bg-purple-900/20 dark:backdrop-blur-xl border border-purple-200 dark:border-purple-700 rounded-lg p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-purple-900 dark:text-purple-300 mb-3">
            What&apos;s included in all plans:
          </h3>
          <div className="grid sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm text-purple-800 dark:text-purple-300">
            <div className="flex items-start">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 dark:text-purple-400 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>React Native with Expo framework</span>
            </div>
            <div className="flex items-start">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 dark:text-purple-400 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>WebView integration for your website</span>
            </div>
            <div className="flex items-start">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 dark:text-purple-400 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>Cloud build with EAS</span>
            </div>
            <div className="flex items-start">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 dark:text-purple-400 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>Ready-to-install app files</span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
