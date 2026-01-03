'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function SupportButton() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Floating Support Menu */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-4 w-64 animate-in slide-in-from-bottom">
          <div className="space-y-2">
            <Link
              href="/dashboard/support"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-purple-50 dark:hover:bg-gray-700 transition text-gray-700 dark:text-gray-300"
              onClick={() => setIsOpen(false)}
            >
              <span className="text-xl">❓</span>
              <span className="font-medium">FAQs & Help</span>
            </Link>
            <Link
              href="/contact"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-purple-50 dark:hover:bg-gray-700 transition text-gray-700 dark:text-gray-300"
              onClick={() => setIsOpen(false)}
            >
              <span className="text-xl">📧</span>
              <span className="font-medium">Contact Us</span>
            </Link>
            <a
              href="mailto:support@appify.com"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-purple-50 dark:hover:bg-gray-700 transition text-gray-700 dark:text-gray-300"
              onClick={() => setIsOpen(false)}
            >
              <span className="text-xl">✉️</span>
              <span className="font-medium">Email Support</span>
            </a>
          </div>
        </div>
      )}

      {/* Floating Support Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 rounded-full shadow-2xl hover:from-purple-700 hover:to-blue-700 transition transform hover:scale-110"
        title="Need help?"
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )}
      </button>
    </>
  )
}