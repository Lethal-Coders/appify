'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface CreateProjectFormProps {
  userId: string
}

export default function CreateProjectForm({ userId }: CreateProjectFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    websiteUrl: '',
    primaryColor: '#8B5CF6',
  })
  const [icon, setIcon] = useState<File | null>(null)
  const [iconPreview, setIconPreview] = useState<string | null>(null)
  const [splash, setSplash] = useState<File | null>(null)
  const [splashPreview, setSplashPreview] = useState<string | null>(null)
  const [showPricingOptions, setShowPricingOptions] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<'single' | 'monthly' | 'yearly' | null>(null)
  const [showPaymentPrompt, setShowPaymentPrompt] = useState(false)

  const pricingPlans = [
    {
      id: 'single',
      name: 'Single App',
      price: '$29.99',
      period: '',
      description: 'Perfect for testing or one-time needs',
      features: [
        'Generate 1 mobile app',
        'iOS & Android builds',
        'Custom icon & splash screen',
        'Download AAB & IPA files',
        'One-time payment',
      ],
    },
    {
      id: 'monthly',
      name: 'Monthly Plan',
      price: '$49.99',
      period: '/month',
      description: 'Unlimited apps for growing businesses',
      features: [
        'Unlimited app generation',
        'iOS & Android builds',
        'Custom branding',
        'Priority support',
        'Cancel anytime',
      ],
      popular: true,
    },
    {
      id: 'yearly',
      name: 'Yearly Plan',
      price: '$499.99',
      period: '/year',
      description: 'Best value for serious developers',
      features: [
        'Unlimited app generation',
        'iOS & Android builds',
        'Custom branding',
        'Priority support',
        'Save $100 per year',
      ],
    },
  ]

  useEffect(() => {
    // Load wizard data from localStorage
    const wizardDataStr = localStorage.getItem('wizardData')
    const wizardAppIcon = localStorage.getItem('wizardAppIcon')
    const wizardSplashScreen = localStorage.getItem('wizardSplashScreen')

    if (wizardDataStr) {
      const wizardData = JSON.parse(wizardDataStr)
      setFormData({
        name: wizardData.appName || '',
        websiteUrl: wizardData.websiteUrl || '',
        primaryColor: wizardData.primaryColor || '#8B5CF6',
      })
    }

    if (wizardAppIcon) {
      setIconPreview(wizardAppIcon)
      fetch(wizardAppIcon)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], 'app-icon.png', { type: 'image/png' })
          setIcon(file)
        })
    }

    if (wizardSplashScreen) {
      setSplashPreview(wizardSplashScreen)
      fetch(wizardSplashScreen)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], 'splash-screen.png', { type: 'image/png' })
          setSplash(file)
        })
    }

    // Clear localStorage after loading
    localStorage.removeItem('wizardData')
    localStorage.removeItem('wizardAppIcon')
    localStorage.removeItem('wizardSplashScreen')
  }, [])

  const handleIconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setIcon(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setIconPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSplashUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSplash(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setSplashPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setShowPricingOptions(true)
  }

  const handlePlanSelect = (plan: 'single' | 'monthly' | 'yearly') => {
    setSelectedPlan(plan)
    setShowPaymentPrompt(true)
  }

  const handlePayAndCreate = async () => {
    setLoading(true)

    try {
      // First, create the project
      const formDataToSend = new FormData()
      formDataToSend.append('name', formData.name)
      formDataToSend.append('websiteUrl', formData.websiteUrl)
      formDataToSend.append('primaryColor', formData.primaryColor)
      formDataToSend.append('userId', userId)

      if (icon) formDataToSend.append('icon', icon)
      if (splash) formDataToSend.append('splash', splash)

      const response = await fetch('/api/projects', {
        method: 'POST',
        body: formDataToSend,
      })

      if (!response.ok) throw new Error('Failed to create project')

      const project = await response.json()

      // Now redirect to Stripe checkout with the project ID and selected plan
      const checkoutResponse = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          plan: selectedPlan,
          projectId: project.id 
        }),
      })

      const checkoutData = await checkoutResponse.json()

      if (checkoutData.url) {
        // Redirect to Stripe checkout
        window.location.href = checkoutData.url
      } else {
        throw new Error('No checkout URL returned')
      }
    } catch (error) {
      console.error('Error creating project:', error)
      alert('Failed to create project. Please try again.')
      setLoading(false)
    }
  }

  // Pricing Options View
  if (showPricingOptions && !showPaymentPrompt) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <div className="p-8 text-center border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Select Your Plan
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Choose the perfect plan for your app creation needs
          </p>
        </div>

        <div className="p-8">
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {pricingPlans.map((plan) => (
              <div
                key={plan.id}
                className={`relative bg-white dark:bg-gray-900 rounded-2xl border-2 p-6 transition-all cursor-pointer hover:scale-105 ${
                  plan.popular
                    ? 'border-purple-500 shadow-lg shadow-purple-500/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-purple-400'
                }`}
                onClick={() => handlePlanSelect(plan.id as 'single' | 'monthly' | 'yearly')}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {plan.name}
                  </h3>
                  <div className="mb-2">
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">
                      {plan.price}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">
                      {plan.period}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {plan.description}
                  </p>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start text-sm">
                      <svg
                        className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handlePlanSelect(plan.id as 'single' | 'monthly' | 'yearly')}
                  className={`w-full py-3 rounded-lg font-semibold transition ${
                    plan.popular
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  Select Plan
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={() => setShowPricingOptions(false)}
            className="w-full px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition"
          >
            Back to Edit Details
          </button>
        </div>
      </div>
    )
  }

  // Payment Confirmation View
  if (showPaymentPrompt && selectedPlan) {
    const plan = pricingPlans.find(p => p.id === selectedPlan)!
    
    return (
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-sm">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">💳</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Ready to Create Your App?
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Complete your payment to generate your mobile app
          </p>
        </div>

        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 mb-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">App Summary:</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">App Name:</span>
              <span className="font-medium text-gray-900 dark:text-white">{formData.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Website URL:</span>
              <span className="font-medium text-gray-900 dark:text-white truncate ml-4">{formData.websiteUrl}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Primary Color:</span>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded" style={{ backgroundColor: formData.primaryColor }}></div>
                <span className="font-medium text-gray-900 dark:text-white">{formData.primaryColor}</span>
              </div>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">App Icon:</span>
              <span className="font-medium text-gray-900 dark:text-white">{icon ? '✓ Uploaded' : '✗ Not provided'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Splash Screen:</span>
              <span className="font-medium text-gray-900 dark:text-white">{splash ? '✓ Uploaded' : '✗ Not provided'}</span>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-6 mb-6 border-2 border-purple-200 dark:border-purple-700">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                {plan.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {plan.description}
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-primary">{plan.price}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{plan.period}</div>
            </div>
          </div>
          <ul className="space-y-2">
            {plan.features.slice(0, 3).map((feature, index) => (
              <li key={index} className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex gap-4">
          <button
            onClick={handlePayAndCreate}
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
          >
            {loading ? 'Processing...' : 'Pay & Create App'}
          </button>
          <button
            type="button"
            onClick={() => {
              setShowPaymentPrompt(false)
              setSelectedPlan(null)
            }}
            className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition"
          >
            Change Plan
          </button>
        </div>
      </div>
    )
  }

  // Form Edit View
  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-sm">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            App Name *
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="My Awesome App"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Website URL *
          </label>
          <input
            type="url"
            required
            value={formData.websiteUrl}
            onChange={(e) =>
              setFormData({ ...formData, websiteUrl: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="https://example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Primary Color *
          </label>
          <div className="flex gap-4 items-center">
            <input
              type="color"
              value={formData.primaryColor}
              onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
              className="w-20 h-12 rounded-lg border-2 border-gray-300 dark:border-gray-600 cursor-pointer"
            />
            <input
              type="text"
              value={formData.primaryColor}
              onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="#8B5CF6"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            App Icon (optional)
          </label>
          {iconPreview ? (
            <div className="flex items-center gap-4">
              <Image src={iconPreview} alt="Icon Preview" width={80} height={80} className="rounded-lg" />
              <button
                type="button"
                onClick={() => {
                  setIcon(null)
                  setIconPreview(null)
                }}
                className="text-red-500 hover:text-red-600 text-sm font-medium"
              >
                Remove
              </button>
            </div>
          ) : (
            <input
              type="file"
              accept="image/*"
              onChange={handleIconUpload}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          )}
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Recommended: 1024x1024px PNG
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Splash Screen (optional)
          </label>
          {splashPreview ? (
            <div className="flex items-center gap-4">
              <Image src={splashPreview} alt="Splash Preview" width={80} height={160} className="rounded-lg" />
              <button
                type="button"
                onClick={() => {
                  setSplash(null)
                  setSplashPreview(null)
                }}
                className="text-red-500 hover:text-red-600 text-sm font-medium"
              >
                Remove
              </button>
            </div>
          ) : (
            <input
              type="file"
              accept="image/*"
              onChange={handleSplashUpload}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          )}
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Recommended: 1242x2436px PNG
          </p>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
          >
            Continue to Pricing
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  )
}
