import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { readFile } from 'fs/promises'
import { join } from 'path'

export async function GET(
  request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const project = await prisma.project.findUnique({
      where: { id: params.projectId },
    })

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    if (project.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (project.status !== 'COMPLETED' || !project.downloadUrl) {
      return NextResponse.json(
        { error: 'Project not ready for download' },
        { status: 400 }
      )
    }

    // Read the ZIP file
    const zipPath = join(process.cwd(), 'generated', `${params.projectId}.zip`)
    const fileBuffer = await readFile(zipPath)

    // Return the file
    return new NextResponse(fileBuffer as unknown as BodyInit, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${project.name}.zip"`,
        'Content-Length': fileBuffer.length.toString(),
      },
    })
  } catch (error) {
    console.error('Error downloading project:', error)
    return NextResponse.json(
      { error: 'Failed to download project' },
      { status: 500 }
    )
  }
}
