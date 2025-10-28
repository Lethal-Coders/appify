'use client'

import Link from 'next/link'
import { Project } from '@prisma/client'

interface ProjectListProps {
  projects: Project[]
}

export default function ProjectList({ projects }: ProjectListProps) {
  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📱</div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          No projects yet
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Create your first mobile app to get started
        </p>
      </div>
    )
  }

  const statusColors: Record<string, string> = {
    DRAFT: 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200',
    GENERATING: 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200',
    BUILDING: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200',
    COMPLETED: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200',
    FAILED: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200',
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <Link
          key={project.id}
          href={`/dashboard/project/${project.id}`}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-lg transition border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600"
        >
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {project.name}
            </h3>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                statusColors[project.status]
              }`}
            >
              {project.status}
            </span>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 truncate">
            {project.websiteUrl}
          </p>

          <div className="text-xs text-gray-500 dark:text-gray-400">
            Updated {new Date(project.updatedAt).toLocaleDateString()}
          </div>
        </Link>
      ))}
    </div>
  )
}
