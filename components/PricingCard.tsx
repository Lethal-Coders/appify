'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface PricingCardProps {
  name: string
  price: string
  period?: string
  description: string
  features: string[]
  plan: 'single' | 'monthly' | 'yearly'
  popular?: boolean
  projectId?: string
}

export default function PricingCard({
  name,
  price,
  period,
  description,
  features,
  plan,
  popular,
  projectId,
}: PricingCardProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleSubscribe = async () => {
    setLoading(true)

    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan, projectId }),
      })

      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error('No checkout URL returned')
      }
    } catch (error) {
      console.error('Error creating checkout session:', error)
      alert('Failed to initiate payment. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div
      className={`relative bg-white dark:bg-gray-800/95 dark:backdrop-blur-xl rounded-2xl shadow-lg p-6 sm:p-8 transition-all hover:scale-105 ${
        popular ? 'border-2 border-[#B197E0] ring-4 ring-[#F0EDFD] dark:ring-[#524278]/20' : 'border border-gray-200 dark:border-gray-700/50'
      }`}
    >
      {popular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <span className="bg-gradient-to-r from-[#B197E0] via-[#8B7AB8] to-[#524278] text-white px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm font-semibold">
            Most Popular
          </span>
        </div>
      )}

      <div className="text-center mb-6">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">{name}</h3>
        <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">{description}</p>
      </div>

      <div className="text-center mb-6">
        <span className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white">{price}</span>
        {period && <span className="text-gray-600 dark:text-gray-400 ml-2 text-sm sm:text-base">/ {period}</span>}
      </div>

      <ul className="space-y-3 sm:space-y-4 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <svg
              className="w-5 h-5 text-[#8B7AB8] dark:text-[#B197E0] mr-3 flex-shrink-0 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm sm:text-base text-gray-700 dark:text-gray-300">{feature}</span>
          </li>
        ))}
      </ul>

      <button
        onClick={handleSubscribe}
        disabled={loading}
        className={`w-full py-3 px-4 sm:px-6 rounded-lg font-semibold transition text-sm sm:text-base ${
          popular
            ? 'bg-gradient-to-r from-[#B197E0] via-[#8B7AB8] to-[#524278] text-white hover:from-[#A086CF] hover:via-[#7A69A7] hover:to-[#413167]'
            : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {loading ? 'Processing...' : 'Get Started'}
      </button>
    </div>
  )
}
