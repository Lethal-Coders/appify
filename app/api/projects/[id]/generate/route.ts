import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { generateExpoApp } from '@/lib/app-generator'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const project = await prisma.project.findUnique({
      where: { id: params.id },
    })

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    if (project.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Generate the app in the background
    generateExpoApp({
      projectId: project.id,
      name: project.name,
      websiteUrl: project.websiteUrl,
      iconUrl: project.iconUrl,
      splashUrl: project.splashUrl,
    }).catch((error) => {
      console.error('Error generating app:', error)
    })

    return NextResponse.json({ message: 'App generation started' })
  } catch (error) {
    console.error('Error starting app generation:', error)
    return NextResponse.json(
      { error: 'Failed to start app generation' },
      { status: 500 }
    )
  }
}
