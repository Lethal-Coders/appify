import { readFile, writeFile, mkdir, copyFile } from 'fs/promises'
import { join } from 'path'
import archiver from 'archiver'
import { createWriteStream } from 'fs'
import { exec } from 'child_process'
import { promisify } from 'util'
import axios, { AxiosError } from 'axios'
import { prisma } from './prisma'

const execAsync = promisify(exec)

const EXPO_GRAPHQL_API = 'https://api.expo.dev/graphql';
const EXPO_TOKEN = process.env.EXPO_ACCESS_TOKEN

const isWebUrl = (url: string) => url.startsWith('http://') || url.startsWith('https://');

interface EASBuild {
  id: string
  status: 'new' | 'in-queue' | 'in-progress' | 'errored' | 'finished' | 'canceled'
  platform: 'android' | 'ios'
  artifacts?: {
    buildUrl?: string
  }
}

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

    // Generate slug from name with timestamp to ensure uniqueness
    const baseSlug = name.toLowerCase().replace(/[^a-z0-9]/g, '')
    const slug = `${baseSlug}${Date.now()}`

    // Generate a bundle ID from the website URL to avoid conflicts
    let bundleId: string
    try {
      // Extract the main part of the domain, e.g., "google" from "www.google.com"
      bundleId = new URL(websiteUrl).hostname.replace(/^www\./, '').split('.')[0]
    } catch {
      // Fallback for invalid URLs
      bundleId = 'app'
    }

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
      const destinationIconPath = join(assetsDir, 'icon.png');
      if (isWebUrl(iconUrl)) {
        console.log(`Downloading icon from ${iconUrl}...`);
        await downloadArtifact(iconUrl, destinationIconPath);
      } else {
        const sourceIconPath = join(process.cwd(), 'public', iconUrl);
        await copyFile(sourceIconPath, destinationIconPath);
      }
      // Copy the primary icon to the other required icon assets
      await copyFile(destinationIconPath, join(assetsDir, 'adaptive-icon.png'));
      await copyFile(destinationIconPath, join(assetsDir, 'favicon.png'));
    } else {
      // Copy default icon
      const defaultIcon = join(templateDir, 'assets', 'default-icon.png');
      await copyFile(defaultIcon, join(assetsDir, 'icon.png'));
      await copyFile(defaultIcon, join(assetsDir, 'adaptive-icon.png'));
      await copyFile(defaultIcon, join(assetsDir, 'favicon.png'));
    }

    if (splashUrl) {
      const destinationSplashPath = join(assetsDir, 'splash.png');
      if (isWebUrl(splashUrl)) {
        console.log(`Downloading splash image from ${splashUrl}...`);
        await downloadArtifact(splashUrl, destinationSplashPath);
      } else {
        const sourceSplashPath = join(process.cwd(), 'public', splashUrl);
        await copyFile(sourceSplashPath, destinationSplashPath);
      }
    } else {
      // Copy default splash
      const defaultSplash = join(templateDir, 'assets', 'default-splash.png');
      await copyFile(defaultSplash, join(assetsDir, 'splash.png'));
    }

    // Update status to BUILDING
    await prisma.project.update({
      where: { id: projectId },
      data: { status: 'BUILDING' },
    })

    // Install dependencies
    console.log('Installing dependencies...')
    await execAsync('npm install', { cwd: projectDir })

    // Initialize EAS project, which may create a default eas.json
    console.log('Initializing EAS project...')
    try {
      const { stdout, stderr } = await execAsync('npx eas-cli init --force --non-interactive', {
        cwd: projectDir,
        env: {
          ...process.env,
          EXPO_TOKEN: process.env.EXPO_ACCESS_TOKEN,
        }
      })
      console.log('EAS init output:', stdout)
      if (stderr) console.log('EAS init stderr:', stderr)
    } catch (error: any) {
      console.error('EAS init failed:', error.message)
      if (error.stdout) console.log('stdout:', error.stdout)
      if (error.stderr) console.log('stderr:', error.stderr)
      throw new Error('Failed to initialize EAS project')
    }

    // Forcefully overwrite eas.json with a known-good configuration
    console.log('Forcefully writing correct eas.json configuration...');
    const easJsonPath = join(projectDir, 'eas.json');
    const correctEasConfig = {
      cli: {
        version: ">= 5.2.0",
        appVersionSource: "remote"
      },
      build: {
        preview: {
          android: {
            buildType: "apk",
            gradleCommand: ":app:assembleRelease",
            withoutCredentials: true
          },
          ios: {
            simulator: true,
            image: "latest"
          }
        },
        production: {
          android: {
            buildType: "app-bundle"
          }
        }
      },
      submit: {
        production: {}
      }
    };
    await writeFile(easJsonPath, JSON.stringify(correctEasConfig, null, 2));

    // Initialize git repository and commit all files AFTER all modifications are complete
    console.log('Initializing git repository and committing files...');
    await execAsync(`git init && git add . && git commit -m "Initial commit"`, { cwd: projectDir });

    // Read the Expo project ID from app.json
    const updatedAppJson = JSON.parse(await readFile(join(projectDir, 'app.json'), 'utf-8'))
    const expoProjectId = updatedAppJson.expo?.extra?.eas?.projectId
    if (!expoProjectId) {
      throw new Error('Failed to get Expo project ID from app.json after eas init')
    }
    console.log(`Expo project ID: ${expoProjectId}`)

    // Build APK and IPA files (iOS is optional)
    // const apkPath = await buildAndroidAPK(projectDir, projectId, expoProjectId)
    const apkPath = null;

    let ipaPath: string | null = null
    try {
      ipaPath = await buildIOSIPA(projectDir, projectId, expoProjectId)
    } catch (error) {
      console.error('iOS build failed (this is optional):', error)
      console.log('Continuing with Android APK only...')
    }

    // Create ZIP file with available binaries
    const zipPath = join(process.cwd(), 'generated', `${projectId}.zip`)
    if (apkPath || ipaPath) {
      await createZipWithBinaries(apkPath, ipaPath, zipPath)
    } else {
      console.log('No build artifacts were generated to zip.');
    }

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

async function pollBuildStatus(buildId: string, expoProjectId: string): Promise<EASBuild> {
  const maxAttempts = 60 // Poll for up to 30 minutes
  const pollInterval = 30000 // Poll every 30 seconds

  const graphqlQuery = {
    query: `
      query GetBuildById($buildId: ID!) {
        build {
          byId(buildId: $buildId) {
            id
            status
            platform
            artifacts {
              buildUrl
            }
          }
        }
      }
    `,
    variables: {
      buildId,
    },
  };

  // Add an initial delay before the first poll to avoid a race condition
  console.log('Waiting 10 seconds before first poll...');
  await new Promise(resolve => setTimeout(resolve, 10000));

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    if (attempt > 0) {
      await new Promise(resolve => setTimeout(resolve, pollInterval));
    }

    try {
      console.log(`Polling for build ${buildId} (attempt ${attempt + 1}/${maxAttempts})...`);
      const response = await axios.post(EXPO_GRAPHQL_API, graphqlQuery, {
        headers: {
          'Authorization': `Bearer ${EXPO_TOKEN}`,
          'Content-Type': 'application/json',
        },
      });

      const build: EASBuild = response.data.data.build.byId;

      if (!build) {
        console.log(`Build ${buildId} not found in GraphQL response, will retry...`);
        continue;
      }

      console.log(`Build ${buildId} status: ${build.status}`);

      if (build.status === 'finished') {
        return build;
      }

      if (build.status === 'errored' || build.status === 'canceled') {
        throw new Error(`Build ${buildId} failed with status: ${build.status}`);
      }
    } catch (error) {
      console.error(`An error occurred while polling build ${buildId}, will retry...`, error);
    }
  }

  throw new Error(`Build ${buildId} timed out after ${maxAttempts} attempts`);
}


async function downloadArtifact(url: string, outputPath: string): Promise<void> {
  const response = await axios.get(url, {
    responseType: 'arraybuffer',
  })

  await writeFile(outputPath, Buffer.from(response.data))
  console.log(`Downloaded artifact to ${outputPath}`)
}

async function buildAndroidAPK(projectDir: string, projectId: string, expoProjectId: string): Promise<string | null> {
  try {
    // Build Android APK using EAS cloud build (unsigned for testing)
    const { stdout, stderr } = await execAsync(
      'npx eas-cli build --platform android --profile preview --non-interactive --no-wait',
      {
        cwd: projectDir,
        env: {
          ...process.env,
          EXPO_TOKEN: process.env.EXPO_ACCESS_TOKEN,
        }
      }
    )

    console.log('EAS Android build output:', stdout)
    if (stderr) console.log('EAS Android build stderr:', stderr)

    // Extract build ID from output (format: ".../builds/<uuid>")
    const buildIdMatch = stdout.match(/builds\/([a-f0-9-]{36})/i)
    if (!buildIdMatch) {
      throw new Error('Failed to extract build ID from EAS CLI output')
    }

    const buildId = buildIdMatch[1]
    console.log(`Android build ID: ${buildId}`)

    // Poll for build completion
    const completedBuild = await pollBuildStatus(buildId, expoProjectId)

    if (!completedBuild.artifacts?.buildUrl) {
      throw new Error('Build completed but no artifact URL found')
    }

    // Download the APK
    const buildDir = join(projectDir, 'build')
    await mkdir(buildDir, { recursive: true })
    const apkPath = join(buildDir, `${projectId}.apk`)

    await downloadArtifact(completedBuild.artifacts.buildUrl, apkPath)

    return apkPath
  } catch (error) {
    console.error('Error building Android APK:', error)
    return null;
  }
}

async function buildIOSIPA(projectDir: string, projectId: string, expoProjectId: string): Promise<string | null> {
  try {
    // Build iOS simulator build (doesn't require Apple credentials)
    const { stdout, stderr } = await execAsync(
      'npx eas-cli build --platform ios --profile preview --non-interactive --no-wait',
      {
        cwd: projectDir,
        env: {
          ...process.env,
          EXPO_TOKEN: process.env.EXPO_ACCESS_TOKEN,
        }
      }
    )

    console.log('EAS iOS build output:', stdout)
    if (stderr) console.log('EAS iOS build stderr:', stderr)

    // Extract build ID from output (format: ".../builds/<uuid>")
    const buildIdMatch = stdout.match(/builds\/([a-f0-9-]{36})/i)
    if (!buildIdMatch) {
      throw new Error('Failed to extract build ID from EAS CLI output')
    }

    const buildId = buildIdMatch[1]
    console.log(`iOS build ID: ${buildId}`)

    // Poll for build completion
    const completedBuild = await pollBuildStatus(buildId, expoProjectId)

    if (!completedBuild.artifacts?.buildUrl) {
      throw new Error('Build completed but no artifact URL found')
    }

    // Download the IPA
    const buildDir = join(projectDir, 'build')
    await mkdir(buildDir, { recursive: true })
    const ipaPath = join(buildDir, `${projectId}.ipa`)

    await downloadArtifact(completedBuild.artifacts.buildUrl, ipaPath)

    return ipaPath
  } catch (error) {
    console.error('Error building iOS IPA:', error)
    return null;
  }
}

async function createZipWithBinaries(apkPath: string | null, ipaPath: string | null, outputPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const output = createWriteStream(outputPath)
    const archive = archiver('zip', { zlib: { level: 9 } })

    output.on('close', () => resolve())
    archive.on('error', (err) => reject(err))

    archive.pipe(output)

    // Add APK file to the zip
    if (apkPath) {
      archive.file(apkPath, { name: 'app.apk' })
    }

    // Add IPA file if available
    if (ipaPath) {
      archive.file(ipaPath, { name: 'app.ipa' })
    }

    archive.finalize()
  })
}
