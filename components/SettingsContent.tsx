'use client'

import { useTheme } from '@/contexts/ThemeContext'

export default function SettingsContent() {
  const { theme, toggleTheme, mounted } = useTheme()

  if (!mounted) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      {/* Appearance Section */}
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Appearance
        </h2>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white mb-1">
              Theme
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Choose your preferred theme for the dashboard
            </p>
          </div>
          <button
            onClick={toggleTheme}
            className={`relative inline-flex h-12 w-24 items-center rounded-full transition-colors ${
              theme === 'dark' ? 'bg-gradient-to-r from-[#B197E0] to-[#8B7AB8]' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-10 w-10 transform rounded-full bg-white shadow-lg transition-transform flex items-center justify-center ${
                theme === 'dark' ? 'translate-x-12' : 'translate-x-1'
              }`}
            >
              {theme === 'light' ? '☀️' : '🌙'}
            </span>
          </button>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4">
          <button
            onClick={() => theme === 'dark' && toggleTheme()}
            className={`p-4 rounded-lg border-2 transition ${
              theme === 'light'
                ? 'border-[#B197E0] bg-[#F0EDFD] dark:bg-[#524278]/20'
                : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">☀️</span>
              <div className="text-left">
                <div className="font-medium text-gray-900 dark:text-white">Light</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Bright and clear</div>
              </div>
            </div>
          </button>
          <button
            onClick={() => theme === 'light' && toggleTheme()}
            className={`p-4 rounded-lg border-2 transition ${
              theme === 'dark'
                ? 'border-[#B197E0] bg-[#F0EDFD] dark:bg-[#524278]/20'
                : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">🌙</span>
              <div className="text-left">
                <div className="font-medium text-gray-900 dark:text-white">Dark</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Easy on the eyes</div>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Account Section */}
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Account Information
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              disabled
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="Your email is managed by your account"
            />
          </div>
        </div>
      </div>

      {/* Preferences Section */}
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Preferences
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                Email Notifications
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Receive email updates about your app builds
              </p>
            </div>
            <input
              type="checkbox"
              defaultChecked
              className="w-5 h-5 text-[#8B7AB8] border-gray-300 rounded focus:ring-[#B197E0]"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
