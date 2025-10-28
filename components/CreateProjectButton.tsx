'use client'

import { useRouter } from 'next/navigation'

export default function CreateProjectButton() {
  const router = useRouter()

  return (
    <button
      onClick={() => router.push('/dashboard/create')}
      className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition transform hover:scale-105 shadow-lg"
    >
      + Create New App
    </button>
  )
}
