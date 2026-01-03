import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const name = formData.get('name') as string
    const websiteUrl = formData.get('websiteUrl') as string
    const icon = formData.get('icon') as File | null
    const splash = formData.get('splash') as File | null

    let iconUrl = null
    let splashUrl = null

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'public', 'uploads')
    await mkdir(uploadsDir, { recursive: true })

    // Save icon if provided
    if (icon) {
      const iconBuffer = Buffer.from(await icon.arrayBuffer())
      const iconFilename = `${uuidv4()}-${icon.name}`
      const iconPath = join(uploadsDir, iconFilename)
      await writeFile(iconPath, iconBuffer)
      iconUrl = `/uploads/${iconFilename}`
    }

    // Save splash if provided
    if (splash) {
      const splashBuffer = Buffer.from(await splash.arrayBuffer())
      const splashFilename = `${uuidv4()}-${splash.name}`
      const splashPath = join(uploadsDir, splashFilename)
      await writeFile(splashPath, splashBuffer)
      splashUrl = `/uploads/${splashFilename}`
    }

    // Create project in database
    const project = await prisma.project.create({
      data: {
        name,
        websiteUrl,
        iconUrl,
        splashUrl,
        userId: session.user.id,
        status: 'DRAFT',
      },
    })

    return NextResponse.json(project)
  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const projects = await prisma.project.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    })

    return NextResponse.json(projects)
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    )
  }
}
