'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useState } from 'react'
import ThemeToggle from '@/components/ThemeToggle'

export default function SupportPage() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false); // Added state for menu toggle

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 via-purple-50 to-purple-100 dark:from-gray-950 dark:via-[#140F1F] dark:to-black">
      {/* Header */}
      <header className="relative z-20 container mx-auto px-4 sm:px-6 py-6">
        <nav className="bg-black/90 dark:bg-black/95 backdrop-blur-xl rounded-[2rem] px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between shadow-2xl border border-white/10">
          <div className="flex items-center gap-2">
            <Link href="/">
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-white cursor-pointer">Appify</h1>
            </Link>
          </div>
          
          <div className="hidden lg:flex items-center gap-4 xl:gap-6 2xl:gap-8">
            <Link href="#about" className="text-sm font-medium text-white/90 hover:text-white transition whitespace-nowrap">About Us</Link>
            <Link href="/pricing" className="text-sm font-medium text-white/90 hover:text-white transition whitespace-nowrap">Pricing</Link>
            <Link href="/contact" className="text-sm font-medium text-white/90 hover:text-white transition whitespace-nowrap">Contact</Link>
            <Link href="/support" className="text-sm font-medium text-white/90 hover:text-white transition whitespace-nowrap">Support</Link>
            {session ? (
              <Link href="/dashboard" className="text-sm font-medium text-white bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full transition border border-white/20">
                Dashboard
              </Link>
            ) : (
              <Link href="/auth/signin" className="text-sm font-medium text-white bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full transition border border-white/20">
                Sign In
              </Link>
            )}
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-lg text-white hover:bg-white/10 transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </nav>
      </header>

      {/* Support Content */}
      <div className="container mx-auto px-4 sm:px-6 py-12">
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
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700 hover:border-[#B197E0] dark:hover:border-[#8B7AB8] transition">
              <div className="text-4xl mb-4">❓</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                FAQs
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Find answers to commonly asked questions
              </p>
              <Link
                href="#faqs"
                className="text-[#8B7AB8] dark:text-[#B197E0] hover:text-[#6F5E96] dark:hover:text-[#9585C0] font-medium"
              >
                View FAQs →
              </Link>
            </div>

            {/* Contact Support Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700 hover:border-[#B197E0] dark:hover:border-[#8B7AB8] transition">
              <div className="text-4xl mb-4">📧</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Contact Us
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Get in touch with our support team
              </p>
              <Link
                href="/contact"
                className="text-[#8B7AB8] dark:text-[#B197E0] hover:text-[#6F5E96] dark:hover:text-[#9585C0] font-medium"
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
          <div className="mt-8 bg-[#F0EDFD] dark:bg-[#524278]/20 border border-[#B197E0]/30 dark:border-[#8B7AB8]/30 rounded-xl p-6 text-center">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Still need help?
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Our support team is here to help you with any questions
            </p>
            <Link
              href="/contact"
              className="inline-block bg-gradient-to-r from-[#B197E0] via-[#8B7AB8] to-[#524278] text-white px-6 py-3 rounded-lg font-semibold hover:from-[#A086CF] hover:via-[#7A69A7] hover:to-[#413167] transition transform hover:scale-105 shadow-lg"
            >
              Contact Support Team
            </Link>
          </div>
        </div>
      </div>

      {/* Theme Toggle Button */}
      <ThemeToggle />
    </div>
  )
}
