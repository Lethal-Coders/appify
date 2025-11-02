'use client'

import Header from './Header'
import Sidebar from './Sidebar'
import SupportButton from './SupportButton'
import { useState } from 'react'

interface DashboardLayoutProps {
  children: React.ReactNode
  user: any
}

export default function DashboardLayout({ children, user }: DashboardLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
      <Sidebar user={user} onCollapsedChange={setSidebarCollapsed} />
      
      {/* Header and Main Content Area */}
      <div className={`transition-all duration-300 ${
        sidebarCollapsed ? 'ml-0 md:ml-20' : 'ml-0 md:ml-64'
      }`}>
        <Header />
        
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {children}
        </main>
      </div>

      {/* Floating Support Button */}
      <SupportButton />
    </div>
  )
}
