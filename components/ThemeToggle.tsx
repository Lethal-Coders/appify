'use client'

import { useTheme } from '@/contexts/ThemeContext'
import { useState, useEffect } from 'react'

export default function ThemeToggle() {
  const { theme, toggleTheme, mounted } = useTheme()
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // Show scroll-to-top button after scrolling down 300px
      setShowScrollTop(window.scrollY > 300)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  // Don't render on server to avoid hydration mismatch
  if (!mounted) {
    return null
  }

  return (
    <>
      {/* Theme Toggle - Bottom Left */}
      <button
        onClick={toggleTheme}
        className="fixed bottom-6 left-6 z-50 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-900 shadow-2xl hover:shadow-3xl hover:scale-110 transition-all duration-200 flex items-center justify-center border-2 border-gray-700 dark:border-gray-300"
        aria-label="Toggle theme"
      >
        {theme === 'light' ? (
          // Moon icon for dark mode
          <svg 
            className="w-6 h-6 sm:w-7 sm:h-7" 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          </svg>
        ) : (
          // Sun icon for light mode
          <svg 
            className="w-6 h-6 sm:w-7 sm:h-7" 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path 
              fillRule="evenodd" 
              d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" 
              clipRule="evenodd" 
            />
          </svg>
        )}
      </button>

      {/* Scroll to Top - Bottom Right with hero purple gradient */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-[#B197E0] to-[#524278] text-white shadow-2xl hover:shadow-3xl hover:scale-110 transition-all duration-200 flex items-center justify-center border-2 border-[#8B7AB8]"
          aria-label="Scroll to top"
        >
          <svg 
            className="w-6 h-6 sm:w-7 sm:h-7" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      )}
    </>
  )
}
