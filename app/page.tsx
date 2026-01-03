'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import { useSession, signOut } from 'next-auth/react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import ThemeToggle from '@/components/ThemeToggle'
import SectionNavigator from '@/components/SectionNavigator'

export default function Home() {
  const [mounted, setMounted] = useState(false)
  const { theme, toggleTheme } = useTheme()
  const [menuOpen, setMenuOpen] = useState(false)
  const { data: session, status } = useSession()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  // Define section IDs for navigation
  const sections = ['hero', 'features', 'how-it-works', 'pricing', 'cta']

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

      {/* Hero Section - Keep as is, you love this */}
      <section id="hero" className="relative z-10 container mx-auto px-4 sm:px-6 pt-8 pb-20">
        <div className="relative overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] lg:rounded-[3rem] border border-black/10 shadow-[0_40px_120px_-20px_rgba(0,0,0,0.3)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#F0EDFD_5%,#B197E0_36%,#524278_65%,#18171D_85%)] rounded-[2rem] sm:rounded-[2.5rem] lg:rounded-[3rem]" />

          <svg
            className="pointer-events-none absolute inset-0 opacity-30 rounded-[2rem] sm:rounded-[2.5rem] lg:rounded-[3rem]"
            viewBox="0 0 1200 800"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="curveGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="rgba(255,255,255,0.1)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0.02)" />
              </linearGradient>
            </defs>
            <path d="M-100,700 C400,200 800,150 1300,600" fill="none" stroke="url(#curveGrad)" strokeWidth="2" />
            <path d="M-50,750 C350,250 850,200 1350,650" fill="none" stroke="url(#curveGrad)" strokeWidth="1.5" />
            <ellipse cx="900" cy="150" rx="250" ry="250" fill="none" stroke="url(#curveGrad)" strokeWidth="1" opacity="0.4" />
            <ellipse cx="350" cy="500" rx="180" ry="180" fill="none" stroke="url(#curveGrad)" strokeWidth="1" opacity="0.3" />
          </svg>

          <div className="relative px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 py-12 sm:py-16 md:py-20 lg:py-24 pb-24 sm:pb-32 md:pb-40">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-start mb-12 sm:mb-16 lg:mb-20">
              <div className="max-w-full">
                <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-2 text-white break-words leading-tight">
                  Appify
                </div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight mt-4 break-words">
                  Transform Your Website Into a Mobile App
                </h1>
                <p className="mt-4 text-sm sm:text-base md:text-lg text-white/95 leading-relaxed">
                  Ditch the developers. Go native on iOS and Android instantly.
                </p>
              </div>

              <div className="lg:pt-8 xl:pt-12 flex flex-col justify-start max-w-full">
                <div className="bg-black/10 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-5 sm:p-6 mb-5 sm:mb-6 border border-white/10">
                  <p className="text-white/95 text-sm sm:text-base md:text-lg leading-relaxed">
                    Stop overpaying for mobile development. Our streamlined, cloud-based workflow turns your existing website into a professional mobile app in under 10 minutes.
                  </p>
                </div>
                <div className="flex justify-center sm:justify-start lg:justify-end">
                  <Link
                    href="/setup"
                    className="inline-flex items-center justify-center rounded-full px-6 sm:px-8 py-3 sm:py-4 bg-black text-white font-semibold text-xs sm:text-sm uppercase tracking-wider shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-200 whitespace-nowrap"
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 items-stretch">
                <div className="w-full">
                  <div className="relative overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] bg-black/80 backdrop-blur-xl p-6 sm:p-8 lg:p-10 border border-white/10 shadow-[0_20px_80px_rgba(0,0,0,0.6)] h-full min-h-[200px] sm:min-h-[220px]">
                    <div className="text-center h-full flex flex-col items-center justify-center">
                      <div className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold text-white mb-2 sm:mb-3 leading-none">
                        5-10
                      </div>
                      <p className="text-xs sm:text-sm font-medium text-white whitespace-nowrap">Minutes to Launch</p>
                    </div>
                  </div>
                </div>

                <div className="w-full">
                  <div className="relative overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] bg-black/80 backdrop-blur-xl p-6 sm:p-8 lg:p-10 border border-white/10 shadow-[0_20px_80px_rgba(0,0,0,0.6)] h-full min-h-[200px] sm:min-h-[220px]">
                    <div className="text-center h-full flex flex-col items-center justify-center">
                      <div className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold text-white mb-2 sm:mb-3 leading-none">
                        NO
                      </div>
                      <p className="text-xs sm:text-sm font-medium text-white whitespace-nowrap">Code Required!</p>
                    </div>
                  </div>
                </div>

                <div className="w-full sm:col-span-2 lg:col-span-1">
                  <div className="relative overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] bg-black/80 backdrop-blur-xl p-6 sm:p-8 lg:p-10 border border-white/10 shadow-[0_20px_80px_rgba(0,0,0,0.6)] h-full min-h-[200px] sm:min-h-[220px]">
                    <div className="text-center h-full flex flex-col items-center justify-center">
                      <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white mb-2 sm:mb-3 leading-tight px-2">
                        iOS & Android
                      </div>
                      <p className="text-xs sm:text-sm font-medium text-white whitespace-nowrap">Production-Ready Files</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Use hero purple gradient */}
      <section id="features" className="relative z-10 container mx-auto px-4 sm:px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4 bg-gradient-to-r from-[#B197E0] via-[#8B7AB8] to-[#524278] dark:from-[#B197E0] dark:via-[#9585C0] dark:to-[#7B6BA8] bg-clip-text text-transparent">
              Why Choose Appify?
            </h2>
            <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
              Everything you need to take your website mobile, without the complexity
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="group bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-2xl hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-[#B197E0] to-[#524278] rounded-2xl flex items-center justify-center text-white text-3xl mb-6 group-hover:scale-110 transition-transform">
                ⚡
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Lightning Fast</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Generate production-ready native apps in just 5-10 minutes. No waiting weeks for developers.
              </p>
            </div>

            <div className="group bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-2xl hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-[#8B7AB8] to-[#3D2F5A] rounded-2xl flex items-center justify-center text-white text-3xl mb-6 group-hover:scale-110 transition-transform">
                💎
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Cost Effective</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Save thousands compared to hiring developers. Get professional apps at a fraction of the cost.
              </p>
            </div>

            <div className="group bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-2xl hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-[#6F5E96] to-[#2A1F3D] rounded-2xl flex items-center justify-center text-white text-3xl mb-6 group-hover:scale-110 transition-transform">
                🎯
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Native Quality</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                True native apps for iOS and Android, not just wrapped websites. Your users will notice.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section - Use hero purple gradient */}
      <section id="how-it-works" className="relative z-10 py-24">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-100 via-purple-50 to-white dark:from-[#2A1F3D] dark:via-[#140F1F] dark:to-transparent"></div>
        
        <div className="relative container mx-auto px-4 sm:px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4 text-gray-900 dark:text-white">
                How It Works
              </h2>
              <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300">
                Three simple steps to launch your mobile app
              </p>
            </div>

            <div className="space-y-8">
              <div className="flex flex-col md:flex-row items-center gap-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-gray-200/50 dark:border-gray-700/50">
                <div className="flex-shrink-0 w-20 h-20 bg-gradient-to-br from-[#B197E0] to-[#524278] rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                  1
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Enter Your Details</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
                    Provide your website URL, app name, and customize your branding with icons and colors.
                  </p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-center gap-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-gray-200/50 dark:border-gray-700/50">
                <div className="flex-shrink-0 w-20 h-20 bg-gradient-to-br from-[#8B7AB8] to-[#3D2F5A] rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                  2
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">We Build Your App</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
                    Our system automatically generates native iOS and Android apps using React Native and Expo.
                  </p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-center gap-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-gray-200/50 dark:border-gray-700/50">
                <div className="flex-shrink-0 w-20 h-20 bg-gradient-to-br from-[#6F5E96] to-[#2A1F3D] rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                  3
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Download & Deploy</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
                    Get your AAB and IPA files ready to upload to Google Play Store and Apple App Store.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Teaser Section - Use hero purple gradient */}
      <section id="pricing" className="relative z-10 container mx-auto px-4 sm:px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="relative overflow-hidden rounded-[3rem] border border-gray-200 dark:border-gray-800 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-[#B197E0] via-[#6F5E96] to-[#2A1F3D] dark:from-[#8B7AB8] dark:via-[#524278] dark:to-[#18171D]"></div>
            
            <div className="relative px-8 sm:px-12 md:px-16 lg:px-20 py-16 sm:py-20 md:py-24">
              <div className="text-center max-w-3xl mx-auto">
                <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-6">
                  Simple, Transparent Pricing
                </h2>
                <p className="text-xl sm:text-2xl text-white/90 mb-10 leading-relaxed">
                  Choose the plan that works for you. No hidden fees, cancel anytime.
                </p>
                
                <div className="flex flex-wrap justify-center gap-4">
                  <Link
                    href="/pricing"
                    className="inline-flex items-center justify-center rounded-full px-8 py-4 bg-white text-[#524278] font-bold text-lg hover:bg-gray-100 shadow-2xl hover:scale-105 transition-all duration-200"
                  >
                    View Pricing Plans
                  </Link>
                  <Link
                    href="/setup"
                    className="inline-flex items-center justify-center rounded-full px-8 py-4 bg-black/20 backdrop-blur-sm text-white font-bold text-lg border-2 border-white/30 hover:bg-black/30 hover:scale-105 transition-all duration-200"
                  >
                    Start Free Trial
                  </Link>
                </div>

                <div className="mt-12 flex flex-wrap justify-center gap-8 text-white/90">
                  <div className="flex items-center gap-2">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">No setup fees</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">Cancel anytime</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">24/7 support</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section - Use hero purple gradient */}
      <section id="cta" className="relative z-10 container mx-auto px-4 sm:px-6 py-16 pb-32">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-[#B197E0] via-[#8B7AB8] to-[#524278] dark:from-[#B197E0] dark:via-[#9585C0] dark:to-[#7B6BA8] bg-clip-text text-transparent">
            Ready to Go Mobile?
          </h2>
          <p className="text-xl sm:text-2xl text-gray-700 dark:text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            Join thousands of businesses already reaching their mobile audience with Appify
          </p>
          <Link
            href="/setup"
            className="inline-flex items-center justify-center rounded-full px-10 py-5 bg-gradient-to-r from-[#B197E0] via-[#8B7AB8] to-[#524278] text-white font-bold text-xl shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300"
          >
            Create Your App Now →
          </Link>
        </div>
      </section>

      {/* Section Navigator - Floating button in the middle */}
      <SectionNavigator sections={sections} />

      {/* Theme Toggle and Scroll to Top */}
      <ThemeToggle />
    </main>
  )
}