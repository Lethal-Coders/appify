'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface CreateProjectFormProps {
  userId: string
}

export default function CreateProjectForm({ userId }: CreateProjectFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    websiteUrl: '',
  })
  const [icon, setIcon] = useState<File | null>(null)
  const [splash, setSplash] = useState<File | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const formDataToSend = new FormData()
      formDataToSend.append('name', formData.name)
      formDataToSend.append('websiteUrl', formData.websiteUrl)
      formDataToSend.append('userId', userId)

      if (icon) formDataToSend.append('icon', icon)
      if (splash) formDataToSend.append('splash', splash)

      const response = await fetch('/api/projects', {
        method: 'POST',
        body: formDataToSend,
      })

      if (!response.ok) throw new Error('Failed to create project')

      const data = await response.json()
      router.push(`/dashboard/project/${data.id}`)
    } catch (error) {
      console.error('Error creating project:', error)
      alert('Failed to create project. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-sm">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            App Name *
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="My Awesome App"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Website URL *
          </label>
          <input
            type="url"
            required
            value={formData.websiteUrl}
            onChange={(e) =>
              setFormData({ ...formData, websiteUrl: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="https://example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            App Icon (optional)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setIcon(e.target.files?.[0] || null)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">
            Recommended: 1024x1024px PNG
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Splash Screen (optional)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setSplash(e.target.files?.[0] || null)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">
            Recommended: 1242x2436px PNG
          </p>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating...' : 'Create App'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  )
}
