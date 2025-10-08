'use client'

import { useRouter } from 'next/navigation'

export default function CreateProjectButton() {
  const router = useRouter()

  return (
    <button
      onClick={() => router.push('/dashboard/create')}
      className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition"
    >
      + Create New App
    </button>
  )
}
