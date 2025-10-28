import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import ProjectDetails from '@/components/ProjectDetails'
import { canGenerateApp } from '@/lib/subscription'
import DashboardLayout from '@/components/DashboardLayout'

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

  // Check if user can generate this app
  const accessCheck = await canGenerateApp(session.user.id, params.id)

  return (
    <DashboardLayout user={session.user}>
      <ProjectDetails 
        project={project} 
        canGenerate={accessCheck.canGenerate}
        requiresPayment={accessCheck.requiresPayment}
      />
    </DashboardLayout>
  )
}
