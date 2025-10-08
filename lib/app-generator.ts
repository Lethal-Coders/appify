import { readFile, writeFile, mkdir, copyFile } from 'fs/promises'
import { join } from 'path'
import archiver from 'archiver'
import { createWriteStream } from 'fs'
import { prisma } from './prisma'

interface GenerateAppOptions {
  projectId: string
  name: string
  websiteUrl: string
  iconUrl?: string | null
  splashUrl?: string | null
}

export async function generateExpoApp(options: GenerateAppOptions) {
  const { projectId, name, websiteUrl, iconUrl, splashUrl } = options

  try {
    // Update project status to GENERATING
    await prisma.project.update({
      where: { id: projectId },
      data: { status: 'GENERATING' },
    })

    // Create project directory
    const projectDir = join(process.cwd(), 'generated', projectId)
    await mkdir(projectDir, { recursive: true })

    // Create assets directory
    const assetsDir = join(projectDir, 'assets')
    await mkdir(assetsDir, { recursive: true })

    // Generate slug from name
    const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '')
    const bundleId = 'rehan' // Default bundle ID

    // Read and process template files
    const templateDir = join(process.cwd(), 'templates', 'expo-app')

    // Copy and process package.json
    const packageJson = await readFile(
      join(templateDir, 'package.json'),
      'utf-8'
    )
    const processedPackageJson = packageJson.replace(/{{APP_NAME}}/g, name)
    await writeFile(
      join(projectDir, 'package.json'),
      processedPackageJson
    )

    // Copy and process app.json
    const appJson = await readFile(join(templateDir, 'app.json'), 'utf-8')
    const processedAppJson = appJson
      .replace(/{{APP_NAME}}/g, name)
      .replace(/{{APP_SLUG}}/g, slug)
      .replace(/{{BUNDLE_ID}}/g, bundleId)
    await writeFile(join(projectDir, 'app.json'), processedAppJson)

    // Copy and process App.js
    const appJs = await readFile(join(templateDir, 'App.js'), 'utf-8')
    const processedAppJs = appJs.replace(/{{WEBSITE_URL}}/g, websiteUrl)
    await writeFile(join(projectDir, 'App.js'), processedAppJs)

    // Copy .gitignore
    await copyFile(
      join(templateDir, '.gitignore'),
      join(projectDir, '.gitignore')
    )

    // Copy or generate assets
    if (iconUrl) {
      const iconPath = join(process.cwd(), 'public', iconUrl)
      await copyFile(iconPath, join(assetsDir, 'icon.png'))
      await copyFile(iconPath, join(assetsDir, 'adaptive-icon.png'))
      await copyFile(iconPath, join(assetsDir, 'favicon.png'))
    } else {
      // Copy default icon
      const defaultIcon = join(templateDir, 'assets', 'default-icon.png')
      await copyFile(defaultIcon, join(assetsDir, 'icon.png'))
      await copyFile(defaultIcon, join(assetsDir, 'adaptive-icon.png'))
      await copyFile(defaultIcon, join(assetsDir, 'favicon.png'))
    }

    if (splashUrl) {
      const splashPath = join(process.cwd(), 'public', splashUrl)
      await copyFile(splashPath, join(assetsDir, 'splash.png'))
    } else {
      // Copy default splash
      const defaultSplash = join(templateDir, 'assets', 'default-splash.png')
      await copyFile(defaultSplash, join(assetsDir, 'splash.png'))
    }

    // Create ZIP file
    const zipPath = join(process.cwd(), 'generated', `${projectId}.zip`)
    await createZip(projectDir, zipPath)

    // Update project status to COMPLETED
    await prisma.project.update({
      where: { id: projectId },
      data: {
        status: 'COMPLETED',
        downloadUrl: `/api/download/${projectId}`,
      },
    })

    return { success: true, downloadUrl: `/api/download/${projectId}` }
  } catch (error) {
    // Update project status to FAILED
    await prisma.project.update({
      where: { id: projectId },
      data: { status: 'FAILED' },
    })

    throw error
  }
}

async function createZip(sourceDir: string, outputPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const output = createWriteStream(outputPath)
    const archive = archiver('zip', { zlib: { level: 9 } })

    output.on('close', () => resolve())
    archive.on('error', (err) => reject(err))

    archive.pipe(output)
    archive.directory(sourceDir, false)
    archive.finalize()
  })
}
