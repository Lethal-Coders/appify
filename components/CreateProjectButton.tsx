'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function CreateProjectButton() {
  const router = useRouter()

  return (
    <Link
      href="/dashboard/create"
      className="inline-flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-[#B197E0] via-[#8B7AB8] to-[#524278] text-white font-semibold rounded-lg hover:from-[#A086CF] hover:via-[#7A69A7] hover:to-[#413167] transition-all transform hover:scale-105 shadow-lg whitespace-nowrap text-sm sm:text-base"
    >
      <span className="text-lg sm:text-xl mr-2">➕</span>
      <span className="hidden sm:inline">Create New App</span>
      <span className="sm:hidden">New App</span>
    </Link>
  )
}
