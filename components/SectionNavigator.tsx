'use client'

import { useState, useEffect } from 'react'

interface SectionNavigatorProps {
  sections: string[] // Array of section IDs to navigate through
}

export default function SectionNavigator({ sections }: SectionNavigatorProps) {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const handleScroll = () => {
      // Find which section is currently in view
      const scrollPosition = window.scrollY + window.innerHeight / 2
      
      let newIndex = 0
      for (let i = 0; i < sections.length; i++) {
        const section = document.getElementById(sections[i])
        if (section) {
          const sectionTop = section.offsetTop
          const sectionBottom = sectionTop + section.offsetHeight
          
          if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            newIndex = i
            break
          }
        }
      }
      
      setCurrentSectionIndex(newIndex)
      
      // Hide button at the very bottom of the page
      const isAtBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100
      setIsVisible(!isAtBottom)
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Initial check
    
    return () => window.removeEventListener('scroll', handleScroll)
  }, [sections])

  const scrollToNextSection = () => {
    const nextIndex = currentSectionIndex + 1
    if (nextIndex < sections.length) {
      const nextSection = document.getElementById(sections[nextIndex])
      if (nextSection) {
        nextSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
  }

  // Don't show if we're at the last section or button is hidden
  if (!isVisible || currentSectionIndex >= sections.length - 1) {
    return null
  }

  return (
    <div className="fixed left-1/2 -translate-x-1/2 bottom-4 z-40 flex flex-col items-center gap-2">
      {/* Button with hero purple gradient - Made smaller */}
      <button
        onClick={scrollToNextSection}
        className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white dark:bg-gray-800 text-[#524278] dark:text-[#B197E0] shadow-2xl border-2 border-[#8B7AB8] dark:border-[#8B7AB8] hover:scale-110 hover:bg-purple-50 dark:hover:bg-gray-700 transition-all duration-300 flex items-center justify-center group"
        aria-label="Scroll to next section"
      >
        <svg 
          className="w-5 h-5 sm:w-6 sm:h-6 animate-bounce" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      
      {/* Progress indicator dots with hero purple gradient - Made smaller */}
      <div className="flex gap-1">
        {sections.map((_, index) => (
          <div
            key={index}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              index === currentSectionIndex
                ? 'bg-[#8B7AB8] dark:bg-[#B197E0] w-5'
                : index < currentSectionIndex
                ? 'bg-[#B197E0] dark:bg-[#8B7AB8] w-1.5'
                : 'bg-gray-300 dark:bg-gray-600 w-1.5'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
