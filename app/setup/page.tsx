'use client';

import SetupWizard from '@/components/SetupWizard'
import Link from 'next/link';
import { useState } from 'react';

export default function SetupPage() {
  const [menuOpen, setMenuOpen] = useState(false); // Added state for menu toggle

  return (
    <>
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
      <SetupWizard />
    </>
  )
}