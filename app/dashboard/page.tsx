import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import ProjectList from '@/components/ProjectList'
import CreateProjectButton from '@/components/CreateProjectButton'
import DashboardLayout from '@/components/DashboardLayout'

export default async function Dashboard() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/signin?callbackUrl=/dashboard')
  }

  const projects = await prisma.project.findMany({
    where: {
      userId: session.user?.id,
    },
    orderBy: {
      updatedAt: 'desc',
    },
  })

  return (
    <DashboardLayout user={session.user}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">
              Welcome back, {session.user.name}! 👋
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
              Manage your mobile apps and create new ones
            </p>
          </div>
          <CreateProjectButton />
        </div>

        <ProjectList projects={projects} />
      </div>
    </DashboardLayout>
  )
}
