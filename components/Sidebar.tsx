'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import Image from 'next/image'
import { useTheme } from '@/contexts/ThemeContext'
import { useState, useEffect } from 'react'

interface SidebarProps {
  user: any
  onCollapsedChange?: (collapsed: boolean) => void
}

export default function Sidebar({ user, onCollapsedChange }: SidebarProps) {
  const pathname = usePathname()
  const { theme, toggleTheme, mounted } = useTheme()
  const [collapsed, setCollapsed] = useState(true)
  const [isHovering, setIsHovering] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: '📊' },
    { name: 'Create App', href: '/dashboard/create', icon: '➕' },
    { name: 'Payment History', href: '/dashboard/payment-history', icon: '💳' },
    { name: 'Support', href: '/dashboard/support', icon: '💬' },
    { name: 'Settings', href: '/dashboard/settings', icon: '⚙️' },
  ]

  const isActive = (path: string) => pathname === path

  const isExpanded = !collapsed || isHovering || mobileOpen

  useEffect(() => {
    if (onCollapsedChange) {
      onCollapsedChange(collapsed && !isHovering)
    }
  }, [collapsed, isHovering, onCollapsedChange])

  if (!mounted) {
    return null
  }

  return (
    <>
      {/* Mobile Menu Button - Fixed at top */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="md:hidden fixed top-4 left-4 z-[60] p-2 rounded-lg bg-white/90 dark:bg-gray-900/95 backdrop-blur-xl border border-gray-200 dark:border-gray-700 shadow-lg text-gray-700 dark:text-gray-300"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {mobileOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Overlay for mobile */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside 
        className={`fixed left-0 top-0 h-full bg-white dark:bg-gray-900/95 dark:backdrop-blur-xl border-r border-gray-200 dark:border-gray-700/50 shadow-lg z-50 transition-all duration-300 ${
          isExpanded ? 'w-64' : 'w-20'
        } ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700/50 flex items-center justify-center">
            {isExpanded ? (
              <div className="text-center">
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Appify</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Website to App</p>
              </div>
            ) : (
              <div className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">A</div>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 p-3 sm:p-4 overflow-y-auto">
            <ul className="space-y-2">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center ${isExpanded ? 'gap-3' : 'justify-center'} px-3 sm:px-4 py-3 rounded-lg transition ${
                      isActive(item.href)
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/20'
                    }`}
                    title={!isExpanded ? item.name : ''}
                  >
                    <span className="text-lg sm:text-xl">{item.icon}</span>
                    {isExpanded && <span className="font-medium text-sm sm:text-base">{item.name}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* User Profile & Actions */}
          <div className="p-3 sm:p-4 border-t border-gray-200 dark:border-gray-700/50 space-y-3">
            {/* User Info */}
            {isExpanded ? (
              <div className="flex items-center gap-3 px-2">
                {user?.image && (
                  <Image
                    src={user.image}
                    alt={user.name || 'User'}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-xs sm:text-sm text-gray-900 dark:text-white truncate">
                    {user?.name || 'User'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {user?.email}
                  </p>
                </div>
              </div>
            ) : (
              user?.image && (
                <div className="flex justify-center">
                  <Image
                    src={user.image}
                    alt={user.name || 'User'}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                </div>
              )
            )}

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`w-full flex items-center ${isExpanded ? 'gap-3' : 'justify-center'} px-3 sm:px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition`}
              title={!isExpanded ? (theme === 'dark' ? 'Dark Mode' : 'Light Mode') : ''}
            >
              <span className="text-lg sm:text-xl">{theme === 'dark' ? '🌙' : '☀️'}</span>
              {isExpanded && (
                <span className="font-medium text-sm sm:text-base">
                  {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                </span>
              )}
            </button>

            {/* Sign Out */}
            <button
              onClick={() => signOut()}
              className={`w-full flex items-center ${isExpanded ? 'gap-3' : 'justify-center'} px-3 sm:px-4 py-3 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition`}
              title={!isExpanded ? 'Sign Out' : ''}
            >
              <span className="text-lg sm:text-xl">🚪</span>
              {isExpanded && <span className="font-medium text-sm sm:text-base">Sign Out</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Toggle Button on Right Edge - Hidden on mobile */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className={`hidden md:block fixed top-1/2 -translate-y-1/2 z-50 bg-white dark:bg-gray-900/95 dark:backdrop-blur-xl border border-gray-200 dark:border-gray-700/50 rounded-r-lg p-2 shadow-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-300 ${
          isExpanded ? 'left-64' : 'left-20'
        }`}
        title={collapsed ? 'Pin sidebar' : 'Unpin sidebar'}
      >
        <svg
          className={`w-4 h-4 text-gray-600 dark:text-gray-400 transition-transform ${
            collapsed ? 'rotate-0' : 'rotate-180'
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </>
  )
}
