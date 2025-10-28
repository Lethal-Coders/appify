import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import DashboardLayout from '@/components/DashboardLayout'
import Link from 'next/link'

export default async function SupportPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/signin?callbackUrl=/dashboard/support')
  }

  return (
    <DashboardLayout user={session.user}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Support Center
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Get help with your app creation
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* FAQs Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 transition">
            <div className="text-4xl mb-4">❓</div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              FAQs
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Find answers to commonly asked questions
            </p>
            <Link
              href="#faqs"
              className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium"
            >
              View FAQs →
            </Link>
          </div>

          {/* Contact Support Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 transition">
            <div className="text-4xl mb-4">📧</div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Contact Us
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Get in touch with our support team
            </p>
            <Link
              href="/contact"
              className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium"
            >
              Contact Support →
            </Link>
          </div>
        </div>

        {/* FAQs Section */}
        <div id="faqs" className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            {/* FAQ 1 */}
            <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                How long does it take to generate an app?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                App generation typically takes 5-10 minutes. You&apos;ll receive a notification when your app is ready for download.
              </p>
            </div>

            {/* FAQ 2 */}
            <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                What files will I receive?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                You&apos;ll receive both an AAB file for Android (Google Play Store) and an IPA file for iOS (App Store/TestFlight).
              </p>
            </div>

            {/* FAQ 3 */}
            <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Can I update my app after generation?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Yes! You can create a new version of your app at any time. If you have a subscription, you can generate unlimited updates.
              </p>
            </div>

            {/* FAQ 4 */}
            <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Do I need coding knowledge?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                No coding knowledge required! Our platform automatically converts your website into a native mobile app.
              </p>
            </div>

            {/* FAQ 5 */}
            <div className="pb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                We accept all major credit cards through our secure Stripe payment gateway.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Contact */}
        <div className="mt-8 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 rounded-xl p-6 text-center">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Still need help?
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Our support team is here to help you with any questions
          </p>
          <Link
            href="/contact"
            className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition transform hover:scale-105 shadow-lg"
          >
            Contact Support Team
          </Link>
        </div>
      </div>
    </DashboardLayout>
  )
}