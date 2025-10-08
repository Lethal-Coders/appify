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
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No projects yet
        </h3>
        <p className="text-gray-600">
          Create your first mobile app to get started
        </p>
      </div>
    )
  }

  const statusColors = {
    DRAFT: 'bg-gray-100 text-gray-800',
    GENERATING: 'bg-blue-100 text-blue-800',
    BUILDING: 'bg-yellow-100 text-yellow-800',
    COMPLETED: 'bg-green-100 text-green-800',
    FAILED: 'bg-red-100 text-red-800',
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <Link
          key={project.id}
          href={`/dashboard/project/${project.id}`}
          className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition border border-gray-200"
        >
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
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

          <p className="text-sm text-gray-600 mb-4 truncate">
            {project.websiteUrl}
          </p>

          <div className="text-xs text-gray-500">
            Updated {new Date(project.updatedAt).toLocaleDateString()}
          </div>
        </Link>
      ))}
    </div>
  )
}
