'use client'

import { useState } from 'react'
import { Project } from '@prisma/client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface ProjectDetailsProps {
  project: Project
}

export default function ProjectDetails({ project: initialProject }: ProjectDetailsProps) {
  const router = useRouter()
  const [project, setProject] = useState(initialProject)
  const [generating, setGenerating] = useState(false)

  const handleGenerate = async () => {
    setGenerating(true)

    try {
      const response = await fetch(`/api/projects/${project.id}/generate`, {
        method: 'POST',
      })

      if (!response.ok) throw new Error('Failed to generate app')

      // Poll for status updates
      const pollStatus = setInterval(async () => {
        const statusResponse = await fetch(`/api/projects/${project.id}`)
        const updatedProject = await statusResponse.json()
        setProject(updatedProject)

        if (updatedProject.status === 'COMPLETED' || updatedProject.status === 'FAILED') {
          clearInterval(pollStatus)
          setGenerating(false)
          router.refresh()
        }
      }, 2000)
    } catch (error) {
      console.error('Error generating app:', error)
      alert('Failed to generate app. Please try again.')
      setGenerating(false)
    }
  }

  const statusColors = {
    DRAFT: 'bg-gray-100 text-gray-800',
    GENERATING: 'bg-blue-100 text-blue-800',
    BUILDING: 'bg-yellow-100 text-yellow-800',
    COMPLETED: 'bg-green-100 text-green-800',
    FAILED: 'bg-red-100 text-red-800',
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link
          href="/dashboard"
          className="text-primary hover:text-primary/80 text-sm"
        >
          ← Back to Dashboard
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {project.name}
            </h1>
            <p className="text-gray-600">{project.websiteUrl}</p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              statusColors[project.status]
            }`}
          >
            {project.status}
          </span>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">App Icon</h3>
            {project.iconUrl ? (
              <img
                src={project.iconUrl}
                alt="App Icon"
                className="w-24 h-24 rounded-lg border border-gray-200"
              />
            ) : (
              <div className="w-24 h-24 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400">
                No icon
              </div>
            )}
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Splash Screen
            </h3>
            {project.splashUrl ? (
              <img
                src={project.splashUrl}
                alt="Splash Screen"
                className="w-32 h-48 rounded-lg border border-gray-200 object-cover"
              />
            ) : (
              <div className="w-32 h-48 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400">
                No splash
              </div>
            )}
          </div>
        </div>

        <div className="border-t pt-6">
          {project.status === 'DRAFT' && (
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {generating ? 'Generating...' : 'Generate App'}
            </button>
          )}

          {(project.status === 'GENERATING' || project.status === 'BUILDING') && (
            <div className="text-center py-4">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
              <p className="text-gray-600">
                {project.status === 'GENERATING' ? 'Generating your app...' : 'Building APK and IPA files...'}
              </p>
            </div>
          )}

          {project.status === 'COMPLETED' && project.downloadUrl && (
            <div className="space-y-4">
              <a
                href={project.downloadUrl}
                download
                className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
              >
                Download App (APK & IPA)
              </a>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">
                  What&apos;s included:
                </h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-blue-800">
                  <li><strong>app.apk</strong> - Android application (install on Android devices)</li>
                  <li><strong>app.ipa</strong> - iOS application (install on iOS devices via TestFlight or enterprise distribution)</li>
                </ul>
                <p className="mt-3 text-sm text-blue-800">
                  Extract the ZIP file and install the appropriate file for your device.
                </p>
              </div>
            </div>
          )}

          {project.status === 'FAILED' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800">
                App generation failed. Please try again or contact support.
              </p>
              <button
                onClick={handleGenerate}
                disabled={generating}
                className="mt-4 bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary/90 transition"
              >
                Retry
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
