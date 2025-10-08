import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Header from '@/components/Header'
import ProjectDetails from '@/components/ProjectDetails'

export default async function ProjectPage({
  params,
}: {
  params: { id: string }
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/signin')
  }

  const project = await prisma.project.findUnique({
    where: { id: params.id },
  })

  if (!project || project.userId !== session.user?.id) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={session.user} />

      <main className="container mx-auto px-4 py-8">
        <ProjectDetails project={project} />
      </main>
    </div>
  )
}
