import { createHash } from 'node:crypto'
import { cp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises'
import { dirname, join, relative } from 'node:path'

const distRoot = 'dist'
const publishedIndex = 'index.html'
const publishedAssets = 'assets'
const publishedManifest = 'pages-build.json'
const checkOnly = process.argv.includes('--check')

const sourceRoots = ['app', 'src', 'schema']
const sourceFiles = [
  'package.json',
  'package-lock.json',
  'vite.config.ts',
  'tsconfig.json',
  'scripts/generate-project-types.mjs',
  'scripts/sync-pages-root.mjs',
]

async function listFiles(root) {
  const files = []

  async function walk(current) {
    for (const entry of await readdir(current, { withFileTypes: true })) {
      const fullPath = join(current, entry.name)
      if (entry.isDirectory()) {
        await walk(fullPath)
      } else if (entry.isFile()) {
        files.push(relative(root, fullPath).replaceAll('\\\\', '/'))
      }
    }
  }

  try {
    await walk(root)
  } catch (error) {
    if (error?.code === 'ENOENT') return []
    throw error
  }

  return files.sort()
}

async function hashFile(path) {
  const content = await readFile(path)
  return createHash('sha256').update(content).digest('hex')
}

async function normalizedSource(path) {
  const content = await readFile(path, 'utf8')
  return content.replaceAll('\r\n', '\n')
}

async function sourceFingerprint() {
  const inputs = [...sourceFiles]

  for (const root of sourceRoots) {
    const files = await listFiles(root)
    inputs.push(...files.map((file) => `${root}/${file}`))
  }

  const hash = createHash('sha256')

  for (const path of [...new Set(inputs)].sort()) {
    hash.update(path)
    hash.update('\0')
    hash.update(await normalizedSource(path))
    hash.update('\0')
  }

  return hash.digest('hex')
}

async function buildManifest() {
  const assetFiles = await listFiles(publishedAssets)
  const files = {
    'index.html': await hashFile(publishedIndex),
  }

  for (const asset of assetFiles) {
    files[`assets/${asset}`] = await hashFile(join(publishedAssets, asset))
  }

  return {
    version: 1,
    sourceFingerprint: await sourceFingerprint(),
    files,
  }
}

async function readPublishedManifest() {
  try {
    return JSON.parse(await readFile(publishedManifest, 'utf8'))
  } catch (error) {
    if (error?.code === 'ENOENT') return null
    throw error
  }
}

async function assertPublishedRootMatchesSource() {
  const mismatches = []
  const manifest = await readPublishedManifest()

  if (!manifest) {
    mismatches.push(`${publishedManifest} fehlt`)
  } else if (manifest.version !== 1 || typeof manifest.sourceFingerprint !== 'string' || !manifest.files) {
    mismatches.push(`${publishedManifest} hat ein unbekanntes Format`)
  } else {
    const expectedFingerprint = await sourceFingerprint()
    if (manifest.sourceFingerprint !== expectedFingerprint) {
      mismatches.push('Source-Fingerprint')
    }

    const rootAssets = await listFiles(publishedAssets)
    const manifestAssets = Object.keys(manifest.files)
      .filter((path) => path.startsWith('assets/'))
      .map((path) => path.slice('assets/'.length))
      .sort()

    if (JSON.stringify(rootAssets) !== JSON.stringify(manifestAssets)) {
      mismatches.push('assets/ Dateiliste')
    }

    for (const [path, expectedHash] of Object.entries(manifest.files)) {
      try {
        if ((await hashFile(path)) !== expectedHash) {
          mismatches.push(path)
        }
      } catch (error) {
        if (error?.code === 'ENOENT') {
          mismatches.push(path)
        } else {
          throw error
        }
      }
    }

    try {
      const index = await readFile(publishedIndex, 'utf8')
      const referencedAssets = [...index.matchAll(/(?:src|href)="\/meddpicc-workbench\/assets\/([^"]+)"/g)].map(
        (match) => match[1],
      )

      if (referencedAssets.length === 0) {
        mismatches.push('index.html enthält keine veröffentlichten Asset-Referenzen')
      }

      for (const asset of referencedAssets) {
        if (!manifest.files[`assets/${asset}`]) {
          mismatches.push(`index.html referenziert unbekanntes Asset assets/${asset}`)
        }
      }
    } catch (error) {
      if (error?.code === 'ENOENT') {
        mismatches.push('index.html fehlt')
      } else {
        throw error
      }
    }
  }

  if (mismatches.length > 0) {
    console.error('Der veröffentlichte GitHub-Pages-Root ist nicht mit den aktuellen Quellen synchron:')
    for (const mismatch of [...new Set(mismatches)]) console.error(`- ${mismatch}`)
    console.error('Bitte "npm run pages:sync" ausführen und die generierten Dateien committen.')
    process.exit(1)
  }

  console.log('GitHub-Pages-Root entspricht den aktuellen Quellen und dem veröffentlichten Build-Manifest.')
}

async function syncPublishedRoot() {
  await mkdir(dirname(publishedIndex), { recursive: true })
  await cp(join(distRoot, 'index.html'), publishedIndex)

  await rm(publishedAssets, { recursive: true, force: true })
  await cp(join(distRoot, 'assets'), publishedAssets, { recursive: true })

  const manifest = await buildManifest()
  await writeFile(publishedManifest, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8')

  console.log('Production Build nach index.html und assets/ synchronisiert.')
  console.log(`Pages-Build-Manifest nach ${publishedManifest} geschrieben.`)
}

if (checkOnly) {
  await assertPublishedRootMatchesSource()
} else {
  await syncPublishedRoot()
}
