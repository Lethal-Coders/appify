'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import { useSession, signOut } from 'next-auth/react'
import Image from 'next/image'
import ThemeToggle from '@/components/ThemeToggle'

export default function AboutPage() {
  const [mounted, setMounted] = useState(false)
  const { theme, toggleTheme } = useTheme()
  const [menuOpen, setMenuOpen] = useState(false)
  const { data: session, status } = useSession()
  const [showUserMenu, setShowUserMenu] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-100 via-purple-50 to-purple-100 dark:from-gray-950 dark:via-[#140F1F] dark:to-black relative overflow-hidden">
      {/* Header */}
      <header className="relative z-20 container mx-auto px-4 sm:px-6 py-6">
        <nav className="bg-black/90 dark:bg-black/95 backdrop-blur-xl rounded-[2rem] px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between shadow-2xl border border-white/10">
          <div className="flex items-center gap-2">
            <Link href="/">
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-white cursor-pointer">Appify</h1>
            </Link>
          </div>
          
          <div className="hidden lg:flex items-center gap-4 xl:gap-6 2xl:gap-8">
            <Link href="/about" className="text-sm font-medium text-white/90 hover:text-white transition whitespace-nowrap">About Us</Link>
            <Link href="/pricing" className="text-sm font-medium text-white/90 hover:text-white transition whitespace-nowrap">Pricing</Link>
            <Link href="/contact" className="text-sm font-medium text-white/90 hover:text-white transition whitespace-nowrap">Contact</Link>
            <Link href="/support" className="text-sm font-medium text-white/90 hover:text-white transition whitespace-nowrap">Support</Link>
            
            {session ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 hover:opacity-80 transition"
                >
                  {session.user?.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user.name || 'User'}
                      width={40}
                      height={40}
                      className="rounded-full border-2 border-white/20"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-semibold border-2 border-white/20">
                      {session.user?.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                  )}
                </button>

                {showUserMenu && (
                  <>
                    <div className="absolute right-0 mt-2 w-56 bg-black/95 backdrop-blur-xl rounded-xl shadow-2xl border border-white/20 py-2 z-50">
                      <div className="px-4 py-3 border-b border-white/10">
                        <p className="text-sm font-semibold text-white">
                          {session.user?.name || 'User'}
                        </p>
                        <p className="text-xs text-white/60 truncate">
                          {session.user?.email}
                        </p>
                      </div>
                      
                      <Link
                        href="/dashboard"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-white/90 hover:bg-white/10 transition"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <span className="text-lg">📊</span>
                        Dashboard
                      </Link>
                      
                      <Link
                        href="/dashboard/settings"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-white/90 hover:bg-white/10 transition"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <span className="text-lg">⚙️</span>
                        Settings
                      </Link>
                      
                      <button
                        onClick={() => signOut()}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition"
                      >
                        <span className="text-lg">🚪</span>
                        Sign Out
                      </button>
                    </div>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowUserMenu(false)}
                    />
                  </>
                )}
              </div>
            ) : (
              <Link href="/auth/signin" className="text-sm font-medium text-white bg-white/10 hover:bg-white/20 px-4 xl:px-6 py-2 rounded-full transition border border-white/20 whitespace-nowrap">Sign In</Link>
            )}
          </div>

          {/* Mobile Menu Button */}
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

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 mt-2 mx-4 bg-black/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 py-4 z-50">
            <div className="space-y-1 px-4">
              <Link href="/about" className="block px-4 py-3 text-white/90 hover:bg-white/10 rounded-lg transition" onClick={() => setMenuOpen(false)}>About Us</Link>
              <Link href="/pricing" className="block px-4 py-3 text-white/90 hover:bg-white/10 rounded-lg transition" onClick={() => setMenuOpen(false)}>Pricing</Link>
              <Link href="/contact" className="block px-4 py-3 text-white/90 hover:bg-white/10 rounded-lg transition" onClick={() => setMenuOpen(false)}>Contact</Link>
              <Link href="/support" className="block px-4 py-3 text-white/90 hover:bg-white/10 rounded-lg transition" onClick={() => setMenuOpen(false)}>Support</Link>
              
              {session ? (
                <>
                  <div className="px-4 py-3 border-t border-white/10 mt-2">
                    <p className="text-sm font-semibold text-white">
                      {session.user?.name || 'User'}
                    </p>
                    <p className="text-xs text-white/60 truncate">
                      {session.user?.email}
                    </p>
                  </div>
                  <Link href="/dashboard" className="block px-4 py-3 text-white/90 hover:bg-white/10 rounded-lg transition" onClick={() => setMenuOpen(false)}>Dashboard</Link>
                  <Link href="/dashboard/settings" className="block px-4 py-3 text-white/90 hover:bg-white/10 rounded-lg transition" onClick={() => setMenuOpen(false)}>Settings</Link>
                  <button onClick={() => signOut()} className="w-full text-left block px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg transition">Sign Out</button>
                </>
              ) : (
                <Link href="/auth/signin" className="block px-4 py-3 text-white font-medium hover:bg-white/10 rounded-lg transition" onClick={() => setMenuOpen(false)}>Sign In</Link>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Hero Section - Simplified and cleaner */}
      <section className="relative z-10 container mx-auto px-4 sm:px-6 pt-12 pb-16">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold mb-6 bg-gradient-to-r from-[#B197E0] via-[#8B7AB8] to-[#524278] dark:from-[#B197E0] dark:via-[#9585C0] dark:to-[#7B6BA8] bg-clip-text text-transparent">
            About Appify
          </h1>
          <p className="text-xl sm:text-2xl md:text-3xl text-gray-700 dark:text-gray-300 font-light leading-relaxed max-w-3xl mx-auto">
            We&apos;re on a mission to democratize mobile app development and make it accessible to everyone.
          </p>
        </div>
      </section>

      {/* Our Mission Section - Clean white/dark cards */}
      <section className="relative z-10 container mx-auto px-4 sm:px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 sm:p-12 md:p-16 border border-gray-200 dark:border-gray-700">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
              Our Mission
            </h2>
            <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 leading-relaxed mb-12">
              We believe that every business, from startups to enterprises, should have the power to reach their audience on mobile devices without breaking the bank or spending months in development.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-[#F0EDFD] to-[#E5E0F7] dark:from-[#524278]/20 dark:to-[#3D2F5A]/20 rounded-2xl p-6 border border-[#B197E0]/30 dark:border-[#8B7AB8]/30">
                <div className="text-5xl mb-4">🚀</div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Speed</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Go from website to mobile app in minutes, not months. Our streamlined process eliminates the traditional development bottleneck.
                </p>
              </div>

              <div className="bg-gradient-to-br from-[#F0EDFD] to-[#E5E0F7] dark:from-[#6F5E96]/20 dark:to-[#524278]/20 rounded-2xl p-6 border border-[#8B7AB8]/30 dark:border-[#6F5E96]/30">
                <div className="text-5xl mb-4">💰</div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Affordability</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Stop overpaying for mobile development. Our platform offers enterprise-grade solutions at a fraction of the cost.
                </p>
              </div>

              <div className="bg-gradient-to-br from-[#E5E0F7] to-[#D9D3ED] dark:from-[#3D2F5A]/20 dark:to-[#2A1F3D]/20 rounded-2xl p-6 border border-[#6F5E96]/30 dark:border-[#524278]/30">
                <div className="text-5xl mb-4">✨</div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Simplicity</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  No coding required. Our intuitive platform handles all the technical complexity so you can focus on your business.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section - Timeline style */}
      <section className="relative z-10 container mx-auto px-4 sm:px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-12 text-center text-gray-900 dark:text-white">
            Our Story
          </h2>
          
          <div className="space-y-8">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border-l-4 border-[#B197E0]">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-[#F0EDFD] dark:bg-[#524278]/30 rounded-full flex items-center justify-center text-2xl">
                  💡
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">The Problem</h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    Appify was born from a frustration we all shared: the mobile app development process was too expensive, too slow, and too complicated. Small businesses and entrepreneurs were being left behind in the mobile revolution simply because they couldn&apos;t afford the astronomical costs of traditional app development.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border-l-4 border-[#8B7AB8]">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-[#E5E0F7] dark:bg-[#6F5E96]/30 rounded-full flex items-center justify-center text-2xl">
                  🔨
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">The Solution</h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    Our team of experienced developers and designers set out to change that. We built a platform that automates the complex parts of mobile app development, allowing anyone with a website to have a professional mobile presence in minutes.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border-l-4 border-[#6F5E96]">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-[#D9D3ED] dark:bg-[#3D2F5A]/30 rounded-full flex items-center justify-center text-2xl">
                  🎉
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Today</h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    We&apos;re proud to have helped thousands of businesses reach their mobile audience. From e-commerce stores to content publishers, service providers to community platforms, Appify powers mobile experiences for companies of all sizes around the world.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section - Icon grid with better contrast */}
      <section className="relative z-10 container mx-auto px-4 sm:px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-center text-gray-900 dark:text-white">
            Why Businesses Choose Appify
          </h2>
          <p className="text-lg text-center text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
            Join thousands of satisfied customers who have transformed their websites into successful mobile apps
          </p>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-[#F0EDFD] dark:bg-[#524278]/30 rounded-xl flex items-center justify-center text-3xl mb-4">
                ⚡
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Lightning Fast</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Generate production-ready iOS and Android apps in 5-10 minutes. No waiting, no delays.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-[#E5E0F7] dark:bg-[#6F5E96]/30 rounded-xl flex items-center justify-center text-3xl mb-4">
                🎯
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Native Performance</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                True native apps for both iOS and Android, not wrapped websites. Your users will feel the difference.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-[#D9D3ED] dark:bg-[#3D2F5A]/30 rounded-xl flex items-center justify-center text-3xl mb-4">
                🔧
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">No Code Needed</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Our platform handles all the technical complexity. Just provide your website URL and we do the rest.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-[#F0EDFD] dark:bg-[#524278]/30 rounded-xl flex items-center justify-center text-3xl mb-4">
                💎
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Cost Effective</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Save tens of thousands compared to traditional development. Get the same quality at a fraction of the price.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-[#E5E0F7] dark:bg-[#6F5E96]/30 rounded-xl flex items-center justify-center text-3xl mb-4">
                🛡️
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Reliable & Secure</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Built with best practices and security in mind. Your apps and data are safe with us.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-[#D9D3ED] dark:bg-[#3D2F5A]/30 rounded-xl flex items-center justify-center text-3xl mb-4">
                💬
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Outstanding Support</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Our dedicated support team is here to help you succeed every step of the way.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Bold and clear */}
      <section className="relative z-10 container mx-auto px-4 sm:px-6 py-16 pb-24">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-[#B197E0] via-[#8B7AB8] to-[#524278] dark:from-[#8B7AB8] dark:via-[#6F5E96] dark:to-[#3D2F5A] rounded-3xl shadow-2xl p-12 md:p-16 text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-white">
              Ready to Join Thousands of Successful Businesses?
            </h2>
            <p className="text-lg sm:text-xl text-white/90 leading-relaxed mb-8 max-w-2xl mx-auto">
              Start your mobile journey today. Transform your website into a professional mobile app in minutes.
            </p>
            <Link
              href="/setup"
              className="inline-flex items-center justify-center rounded-full px-10 py-4 bg-white text-[#524278] font-bold text-lg hover:bg-gray-100 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-200"
            >
              Get Started Now →
            </Link>
          </div>
        </div>
      </section>

      {/* Theme Toggle Button */}
      <ThemeToggle />
    </main>
  )
}
