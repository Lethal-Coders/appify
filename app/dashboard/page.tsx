import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import ProjectList from '@/components/ProjectList'
import CreateProjectButton from '@/components/CreateProjectButton'
import Header from '@/components/Header'

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
    <div className="min-h-screen bg-gray-50">
      <Header user={session.user} />

      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Projects</h1>
            <p className="text-gray-600 mt-1">Manage your mobile app projects</p>
          </div>
          <CreateProjectButton />
        </div>

        <ProjectList projects={projects} />
      </main>
    </div>
  )
}
