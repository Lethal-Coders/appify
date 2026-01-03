'use client'

import { useState } from 'react'
import { Project } from '@prisma/client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface ProjectDetailsProps {
  project: Project
  canGenerate: boolean
  requiresPayment: boolean
}

export default function ProjectDetails({ 
  project: initialProject, 
  canGenerate,
  requiresPayment 
}: ProjectDetailsProps) {
  const router = useRouter()
  const [project, setProject] = useState(initialProject)
  const [generating, setGenerating] = useState(false)

  const handleGenerate = async () => {
    setGenerating(true)

    try {
      const response = await fetch(`/api/projects/${project.id}/generate`, {
        method: 'POST',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to generate app')
      }

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
    } catch (error: any) {
      console.error('Error generating app:', error)
      alert(error.message || 'Failed to generate app. Please try again.')
      setGenerating(false)
    }
  }

  const handlePayment = () => {
    router.push(`/dashboard/pricing?project_id=${project.id}`)
  }

  const statusColors: Record<string, string> = {
    DRAFT: 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200',
    GENERATING: 'bg-[#F0EDFD] dark:bg-[#524278]/30 text-[#524278] dark:text-[#B197E0]',
    BUILDING: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200',
    COMPLETED: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200',
    FAILED: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200',
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link
          href="/dashboard"
          className="text-[#8B7AB8] dark:text-[#B197E0] hover:text-[#6F5E96] dark:hover:text-[#9585C0] text-sm inline-flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {project.name}
            </h1>
            <a 
              href={project.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#8B7AB8] dark:text-[#B197E0] hover:underline"
            >
              {project.websiteUrl}
            </a>
          </div>
          <div className="flex gap-2 items-center">
            {project.isPaid && (
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200">
                ✓ Paid
              </span>
            )}
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                statusColors[project.status]
              }`}
            >
              {project.status}
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">App Icon</h3>
            {project.iconUrl ? (
              <Image
                src={project.iconUrl}
                alt="App Icon"
                width={96}
                height={96}
                className="rounded-lg border border-gray-200 dark:border-gray-700"
              />
            ) : (
              <div className="w-24 h-24 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-400 dark:text-gray-500">
                No icon
              </div>
            )}
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Splash Screen
            </h3>
            {project.splashUrl ? (
              <Image
                src={project.splashUrl}
                alt="Splash Screen"
                width={128}
                height={192}
                className="rounded-lg border border-gray-200 dark:border-gray-700 object-cover"
              />
            ) : (
              <div className="w-32 h-48 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-400 dark:text-gray-500">
                No splash
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          {project.status === 'DRAFT' && (
            <>
              {requiresPayment ? (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-6 text-center">
                  <div className="text-5xl mb-3">💳</div>
                  <h3 className="text-xl font-semibold text-yellow-900 dark:text-yellow-300 mb-2">
                    Payment Required
                  </h3>
                  <p className="text-yellow-800 dark:text-yellow-400 mb-6">
                    To generate this app, you need to purchase a plan or have an active subscription.
                  </p>
                  <button
                    onClick={handlePayment}
                    className="bg-gradient-to-r from-[#B197E0] via-[#8B7AB8] to-[#524278] text-white px-8 py-3 rounded-lg font-semibold hover:from-[#A086CF] hover:via-[#7A69A7] hover:to-[#413167] transition transform hover:scale-105 shadow-lg"
                  >
                    Choose a Plan
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <button
                    onClick={handleGenerate}
                    disabled={generating}
                    className="bg-gradient-to-r from-[#B197E0] via-[#8B7AB8] to-[#524278] text-white px-8 py-4 rounded-lg font-semibold hover:from-[#A086CF] hover:via-[#7A69A7] hover:to-[#413167] transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                  >
                    {generating ? 'Generating...' : '🚀 Generate App'}
                  </button>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
                    This will create your iOS and Android app files
                  </p>
                </div>
              )}
            </>
          )}

          {(project.status === 'GENERATING' || project.status === 'BUILDING') && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#E5E0F7] border-t-[#8B7AB8] dark:border-[#524278]/30 dark:border-t-[#B197E0] mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">
                {project.status === 'GENERATING' ? 'Generating your app...' : 'Building AAB and IPA files...'}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                This may take a few minutes
              </p>
            </div>
          )}

          {project.status === 'COMPLETED' && project.downloadUrl && (
            <div className="space-y-4 text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Your App is Ready!
              </h3>
              <a
                href={project.downloadUrl}
                download
                className="inline-block bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-4 rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transition transform hover:scale-105 shadow-lg"
              >
                📥 Download App (AAB & IPA)
              </a>
              <div className="bg-[#F0EDFD] dark:bg-[#524278]/20 border border-[#B197E0]/30 dark:border-[#8B7AB8]/30 rounded-lg p-6 mt-6">
                <h4 className="font-semibold text-[#524278] dark:text-[#B197E0] mb-3">
                  What&apos;s included:
                </h4>
                <ul className="space-y-2 text-sm text-[#524278] dark:text-[#B197E0] text-left max-w-2xl mx-auto">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-[#8B7AB8] dark:text-[#B197E0] mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span><strong>app.aab</strong> - Android App Bundle (for Google Play Store submission)</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-[#8B7AB8] dark:text-[#B197E0] mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span><strong>app.ipa</strong> - iOS application (install via TestFlight or enterprise distribution)</span>
                  </li>
                </ul>
                <p className="mt-4 text-sm text-[#524278] dark:text-[#B197E0]">
                  💡 Extract the ZIP file. Upload the AAB to Google Play Console for Android distribution.
                </p>
              </div>
            </div>
          )}

          {project.status === 'FAILED' && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-6 text-center">
              <div className="text-5xl mb-3">❌</div>
              <h3 className="text-xl font-semibold text-red-900 dark:text-red-300 mb-2">
                Generation Failed
              </h3>
              <p className="text-red-800 dark:text-red-400 mb-4">
                App generation failed. Please try again or contact support if the issue persists.
              </p>
              <button
                onClick={handleGenerate}
                disabled={generating || requiresPayment}
                className="bg-gradient-to-r from-[#B197E0] via-[#8B7AB8] to-[#524278] text-white px-6 py-3 rounded-lg font-semibold hover:from-[#A086CF] hover:via-[#7A69A7] hover:to-[#413167] transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {requiresPayment ? 'Payment Required' : '🔄 Retry Generation'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
