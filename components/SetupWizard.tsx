'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface WizardData {
  appName: string
  websiteUrl: string
  primaryColor: string
  appIcon: File | null
  appIconPreview: string | null
  splashScreen: File | null
  splashScreenPreview: string | null
}

const COLOR_PRESETS = [
  { name: 'Purple', value: '#8B5CF6' },
  { name: 'Blue', value: '#3B82F6' },
  { name: 'Green', value: '#10B981' },
  { name: 'Red', value: '#EF4444' },
  { name: 'Pink', value: '#EC4899' },
  { name: 'Orange', value: '#F97316' },
  { name: 'Teal', value: '#14B8A6' },
  { name: 'Indigo', value: '#6366F1' },
]

export default function SetupWizard() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [wizardData, setWizardData] = useState<WizardData>({
    appName: '',
    websiteUrl: '',
    primaryColor: '#8B5CF6',
    appIcon: null,
    appIconPreview: null,
    splashScreen: null,
    splashScreenPreview: null,
  })
  const [customColor, setCustomColor] = useState('#8B5CF6')
  const [hexInput, setHexInput] = useState('#8B5CF6')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const totalSteps = 5

  const handleNext = () => {
    // Validate current step
    const newErrors: Record<string, string> = {}

    if (currentStep === 1 && !wizardData.appName.trim()) {
      newErrors.appName = 'App name is required'
    }

    if (currentStep === 2) {
      if (!wizardData.websiteUrl.trim()) {
        newErrors.websiteUrl = 'Website URL is required'
      } else if (!isValidUrl(wizardData.websiteUrl)) {
        newErrors.websiteUrl = 'Please enter a valid URL'
      }
    }

    if (currentStep === 4 && !wizardData.appIcon) {
      newErrors.appIcon = 'App icon is required'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setErrors({})

    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    } else {
      // Save to localStorage and redirect to sign-in
      localStorage.setItem('wizardData', JSON.stringify({
        appName: wizardData.appName,
        websiteUrl: wizardData.websiteUrl,
        primaryColor: wizardData.primaryColor,
      }))

      // Save files separately (we'll handle them after sign-in)
      if (wizardData.appIcon) {
        const reader = new FileReader()
        reader.onloadend = () => {
          localStorage.setItem('wizardAppIcon', reader.result as string)
        }
        reader.readAsDataURL(wizardData.appIcon)
      }

      if (wizardData.splashScreen) {
        const reader = new FileReader()
        reader.onloadend = () => {
          localStorage.setItem('wizardSplashScreen', reader.result as string)
        }
        reader.readAsDataURL(wizardData.splashScreen)
      }

      router.push('/auth/signin?redirect=/dashboard/create')
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      setErrors({})
    }
  }

  const isValidUrl = (url: string) => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'icon' | 'splash') => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        if (type === 'icon') {
          setWizardData({
            ...wizardData,
            appIcon: file,
            appIconPreview: reader.result as string,
          })
        } else {
          setWizardData({
            ...wizardData,
            splashScreen: file,
            splashScreenPreview: reader.result as string,
          })
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleColorSelect = (color: string) => {
    setWizardData({ ...wizardData, primaryColor: color })
    setCustomColor(color)
    setHexInput(color)
  }

  const handleHexInput = (value: string) => {
    setHexInput(value)
    if (/^#[0-9A-F]{6}$/i.test(value)) {
      setWizardData({ ...wizardData, primaryColor: value })
      setCustomColor(value)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-purple-50 to-blue-50 dark:from-gray-950 dark:via-purple-950/20 dark:to-gray-900 relative overflow-hidden py-12 px-4">
      {/* Decorative circles */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-300/20 dark:bg-purple-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-300/20 dark:bg-blue-500/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

      <div className="max-w-2xl mx-auto relative z-10">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            {[1, 2, 3, 4, 5].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition ${
                    step <= currentStep
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                      : 'bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {step}
                </div>
                {step < 5 && (
                  <div
                    className={`h-1 w-12 sm:w-20 mx-2 transition ${
                      step < currentStep
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600'
                        : 'bg-gray-300 dark:bg-gray-700'
                    }`}
                  ></div>
                )}
              </div>
            ))}
          </div>
          <p className="text-center text-gray-600 dark:text-gray-400 text-sm">
            Step {currentStep} of {totalSteps}
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white/80 dark:bg-black/60 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-gray-200/50 dark:border-gray-800/50">
          {/* Step 1: App Name */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  What do you want to name your app?
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Choose a memorable name for your mobile application
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  App Name *
                </label>
                <input
                  type="text"
                  value={wizardData.appName}
                  onChange={(e) => setWizardData({ ...wizardData, appName: e.target.value })}
                  placeholder="e.g., My Awesome App"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                />
                {errors.appName && (
                  <p className="text-red-500 text-sm mt-2">{errors.appName}</p>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Website URL */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  What&apos;s your website URL?
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Enter the URL of the website you want to convert into an app
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Website URL *
                </label>
                <input
                  type="url"
                  value={wizardData.websiteUrl}
                  onChange={(e) => setWizardData({ ...wizardData, websiteUrl: e.target.value })}
                  placeholder="https://example.com"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                />
                {errors.websiteUrl && (
                  <p className="text-red-500 text-sm mt-2">{errors.websiteUrl}</p>
                )}
              </div>
            </div>
          )}

          {/* Step 3: App Colors */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Choose your app colors
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Select a primary color for your app theme
                </p>
              </div>

              {/* Preset Colors */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Preset Colors
                </label>
                <div className="grid grid-cols-4 gap-3">
                  {COLOR_PRESETS.map((preset) => (
                    <button
                      key={preset.value}
                      onClick={() => handleColorSelect(preset.value)}
                      className={`p-4 rounded-lg border-2 transition ${
                        wizardData.primaryColor === preset.value
                          ? 'border-gray-900 dark:border-white'
                          : 'border-gray-300 dark:border-gray-600'
                      }`}
                      style={{ backgroundColor: preset.value }}
                    >
                      <span className="text-white text-xs font-semibold">{preset.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Picker */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Custom Color Picker
                </label>
                <div className="flex gap-4 items-center">
                  <input
                    type="color"
                    value={customColor}
                    onChange={(e) => handleColorSelect(e.target.value)}
                    className="w-20 h-20 rounded-lg border-2 border-gray-300 dark:border-gray-600 cursor-pointer"
                  />
                  <div className="flex-1">
                    <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                      Hex Code
                    </label>
                    <input
                      type="text"
                      value={hexInput}
                      onChange={(e) => handleHexInput(e.target.value.toUpperCase())}
                      placeholder="#8B5CF6"
                      maxLength={7}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                    />
                  </div>
                </div>
              </div>

              {/* Preview */}
              <div className="p-4 rounded-lg border border-gray-300 dark:border-gray-600">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Preview:</p>
                <div
                  className="h-12 rounded-lg"
                  style={{ backgroundColor: wizardData.primaryColor }}
                ></div>
              </div>
            </div>
          )}

          {/* Step 4: App Icon */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Upload your app icon
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  This will be the icon users see on their home screen
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  App Icon * (PNG, JPG - Recommended: 1024x1024px)
                </label>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
                  {wizardData.appIconPreview ? (
                    <div className="space-y-4">
                      <Image
                        src={wizardData.appIconPreview}
                        alt="App Icon Preview"
                        width={150}
                        height={150}
                        className="mx-auto rounded-2xl"
                      />
                      <button
                        onClick={() => setWizardData({ ...wizardData, appIcon: null, appIconPreview: null })}
                        className="text-red-500 hover:text-red-600 text-sm font-medium"
                      >
                        Remove Icon
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer">
                      <div className="text-6xl mb-4">📱</div>
                      <p className="text-gray-600 dark:text-gray-400 mb-2">
                        Click to upload or drag and drop
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'icon')}
                        className="hidden"
                      />
                      <span className="text-purple-600 dark:text-purple-400 font-medium">
                        Browse Files
                      </span>
                    </label>
                  )}
                </div>
                {errors.appIcon && (
                  <p className="text-red-500 text-sm mt-2">{errors.appIcon}</p>
                )}
              </div>
            </div>
          )}

          {/* Step 5: Splash Screen (Optional) */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Upload your splash screen
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Optional: This appears when your app is launching
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Splash Screen (Optional - PNG, JPG - Recommended: 1242x2436px)
                </label>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
                  {wizardData.splashScreenPreview ? (
                    <div className="space-y-4">
                      <Image
                        src={wizardData.splashScreenPreview}
                        alt="Splash Screen Preview"
                        width={200}
                        height={400}
                        className="mx-auto rounded-2xl"
                      />
                      <button
                        onClick={() => setWizardData({ ...wizardData, splashScreen: null, splashScreenPreview: null })}
                        className="text-red-500 hover:text-red-600 text-sm font-medium"
                      >
                        Remove Splash Screen
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer">
                      <div className="text-6xl mb-4">🖼️</div>
                      <p className="text-gray-600 dark:text-gray-400 mb-2">
                        Click to upload or drag and drop
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'splash')}
                        className="hidden"
                      />
                      <span className="text-purple-600 dark:text-purple-400 font-medium">
                        Browse Files
                      </span>
                    </label>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleBack}
              disabled={currentStep === 1}
              className={`px-6 py-3 rounded-full font-semibold transition ${
                currentStep === 1
                  ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              Back
            </button>
            <button
              onClick={handleNext}
              className="px-6 py-3 rounded-full font-semibold bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 transition transform hover:scale-105"
            >
              {currentStep === totalSteps ? 'Continue to Sign In' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}