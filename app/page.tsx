'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import { useSession, signOut } from 'next-auth/react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

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
            <Link href="#about" className="text-sm font-medium text-white/90 hover:text-white transition whitespace-nowrap">About Us</Link>
            <Link href="/dashboard/pricing" className="text-sm font-medium text-white/90 hover:text-white transition whitespace-nowrap">Pricing</Link>
            <Link href="/contact" className="text-sm font-medium text-white/90 hover:text-white transition whitespace-nowrap">Contact</Link>
            <Link href="/dashboard/support" className="text-sm font-medium text-white/90 hover:text-white transition whitespace-nowrap">Support</Link>
            
            {/* Show user profile or Sign In button */}
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

                {/* User Dropdown Menu */}
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
              <Link href="#about" className="block px-4 py-3 text-white/90 hover:bg-white/10 rounded-lg transition" onClick={() => setMenuOpen(false)}>About Us</Link>
              <Link href="/dashboard/pricing" className="block px-4 py-3 text-white/90 hover:bg-white/10 rounded-lg transition" onClick={() => setMenuOpen(false)}>Pricing</Link>
              <Link href="/contact" className="block px-4 py-3 text-white/90 hover:bg-white/10 rounded-lg transition" onClick={() => setMenuOpen(false)}>Contact</Link>
              <Link href="/dashboard/support" className="block px-4 py-3 text-white/90 hover:bg-white/10 rounded-lg transition" onClick={() => setMenuOpen(false)}>Support</Link>
              
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

      {/* Hero Section styled like the NixtNode image */}
      <section className="relative z-10 container mx-auto px-4 sm:px-6 pt-8 pb-20">
        <div className="relative overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] lg:rounded-[3rem] border border-black/10 shadow-[0_40px_120px_-20px_rgba(0,0,0,0.3)]">
          {/* Purple gradient background with dark edges */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#F0EDFD_5%,#B197E0_36%,#524278_65%,#18171D_85%)] rounded-[2rem] sm:rounded-[2.5rem] lg:rounded-[3rem]" />

          {/* Decorative curved lines */}
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

          {/* Main content */}
          <div className="relative px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 py-12 sm:py-16 md:py-20 lg:py-24 pb-24 sm:pb-32 md:pb-40">
            {/* Top section: headline left, description + button right */}
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-start mb-12 sm:mb-16 lg:mb-20">
              {/* Left: Large headline */}
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

              {/* Right: Description + CTA button */}
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

            {/* Bottom: Stat cards positioned like in the image */}
            <div className="relative">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 items-stretch">
                {/* Block 1 - 5-10 Minutes to Launch */}
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

                {/* Block 2 - NO Code Required! */}
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

                {/* Block 3 - iOS & Android Production-Ready Files */}
                <div className="w-full sm:col-span-2 lg:col-span-1">
                  <div className="relative overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] bg-black/80 backdrop-blur-xl p-6 sm:p-8 lg:p-10 border border-white/10 shadow-[0_20px_80px_rgba(0,0,0,0.6)] h-full min-h-[200px] sm:min-h-[220px]">
                    <div className="text-center h-full flex flex-col items-center justify-center">
                      <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white mb-2 sm:mb-3 leading-tight px-2">
                        iOS &
                        <br className="sm:hidden" /> Android
                      </div>
                      <p className="text-xs sm:text-sm font-medium text-white whitespace-nowrap">Production-Ready Files</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Floating scroll-down button - ALWAYS VISIBLE positioned below the card */}
        <div className="flex justify-center mt-8 relative z-30">
          <Link
            href="#about"
            className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white text-purple-700 shadow-2xl border border-black/10 ring-1 ring-black/10 hover:translate-y-0.5 transition-transform"
            aria-label="Scroll to About"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </Link>
        </div>
      </section>

      {/* About Section - Appify */}
      <div id="about" className="relative z-10 container mx-auto px-4 sm:px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="bg-black/70 backdrop-blur-xl rounded-[3rem] p-8 sm:p-12 md:p-16 shadow-2xl border border-white/10">
            <div className="text-center mb-12">
              <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">About Appify</h2>
              <p className="text-lg sm:text-xl text-white/80 max-w-3xl mx-auto">We make mobile app creation accessible to everyone</p>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-8 mb-12">
              <div className="h-full text-center p-8 bg-black/80 rounded-3xl border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
                <div className="text-5xl mb-4">🚀</div>
                <h3 className="text-2xl font-bold text-white mb-3">Our Mission</h3>
                <p className="text-white/80">To empower businesses and individuals to reach mobile audiences without the complexity and cost of traditional app development.</p>
              </div>
              
              <div className="h-full text-center p-8 bg-black/80 rounded-3xl border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
                <div className="text-5xl mb-4">💡</div>
                <h3 className="text-2xl font-bold text-white mb-3">Our Vision</h3>
                <p className="text-white/80">A world where every website owner can have a professional mobile app, regardless of technical expertise or budget.</p>
              </div>
            </div>
            
            <div className="rounded-3xl p-8 bg-black/85 border border-white/10 shadow-xl">
              <h3 className="text-2xl font-extrabold text-center text-white mb-6">Why Choose Appify?</h3>
              <div className="grid sm:grid-cols-3 gap-6 text-white">
                <div className="text-center px-4 py-6 rounded-2xl bg-white/5 border border-white/10">
                  <div className="text-4xl mb-3">⚡</div>
                  <h4 className="font-semibold mb-2">Fast & Easy</h4>
                  <p className="text-sm text-white/80">Generate apps in minutes, not months</p>
                </div>
                <div className="text-center px-4 py-6 rounded-2xl bg-white/5 border border-white/10">
                  <div className="text-4xl mb-3">💰</div>
                  <h4 className="font-semibold mb-2">Affordable</h4>
                  <p className="text-sm text-white/80">No expensive developers needed</p>
                </div>
                <div className="text-center px-4 py-6 rounded-2xl bg-white/5 border border-white/10">
                  <div className="text-4xl mb-3">🎯</div>
                  <h4 className="font-semibold mb-2">Professional</h4>
                  <p className="text-sm text-white/80">Production-ready native apps</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-purple-600 to-purple-800 dark:from-purple-900 dark:to-purple-950 rounded-[3rem] p-8 sm:p-12 md:p-16 shadow-2xl border border-purple-400/20 text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Create Your App?
            </h2>
            <p className="text-lg sm:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of businesses already using Appify to reach their mobile audience
            </p>
            <Link
              href="/setup"
              className="inline-flex items-center justify-center rounded-full px-8 py-4 bg-white text-purple-700 font-semibold text-sm uppercase tracking-wider shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-200"
            >
              Get Started Now
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}