'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'
import PricingCard from '@/components/PricingCard'
import { useState } from 'react'
import ThemeToggle from '@/components/ThemeToggle'

export default function PricingPage() {
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

      {/* Pricing Content */}
      <div className="container mx-auto px-4 sm:px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 px-4">
              Choose Your Plan
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-400 px-4">
              Select the perfect plan for your mobile app needs
            </p>
            {!session && (
              <div className="mt-4 bg-[#F0EDFD] dark:bg-[#524278]/20 border border-[#B197E0]/30 dark:border-[#8B7AB8]/30 rounded-lg p-4 mx-4 max-w-2xl mx-auto">
                <p className="text-sm sm:text-base text-[#524278] dark:text-[#B197E0]">
                  <Link href="/auth/signin" className="font-semibold underline">Sign in</Link> to get started with your first app
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

          <div className="bg-[#F0EDFD] dark:bg-[#524278]/20 dark:backdrop-blur-xl border border-[#B197E0]/30 dark:border-[#8B7AB8]/30 rounded-lg p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-[#524278] dark:text-[#B197E0] mb-3">
              What&apos;s included in all plans:
            </h3>
            <div className="grid sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm text-[#524278] dark:text-[#B197E0]">
              <div className="flex items-start">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#8B7AB8] dark:text-[#B197E0] mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>React Native with Expo framework</span>
              </div>
              <div className="flex items-start">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#8B7AB8] dark:text-[#B197E0] mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>WebView integration for your website</span>
              </div>
              <div className="flex items-start">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#8B7AB8] dark:text-[#B197E0] mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Cloud build with EAS</span>
              </div>
              <div className="flex items-start">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#8B7AB8] dark:text-[#B197E0] mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Ready-to-install app files</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Theme Toggle Button */}
      <ThemeToggle />
    </div>
  )
}
