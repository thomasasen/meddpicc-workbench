import { cp, mkdir, readFile, readdir, rm, stat } from 'node:fs/promises'
import { dirname, join, relative } from 'node:path'

const distRoot = 'dist'
const publishedIndex = 'index.html'
const publishedAssets = 'assets'
const checkOnly = process.argv.includes('--check')

async function listFiles(root) {
  const files = []

  async function walk(current) {
    for (const entry of await readdir(current, { withFileTypes: true })) {
      const fullPath = join(current, entry.name)
      if (entry.isDirectory()) {
        await walk(fullPath)
      } else if (entry.isFile()) {
        files.push(relative(root, fullPath).replaceAll('\\', '/'))
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

async function sameFile(left, right) {
  try {
    const [leftStat, rightStat] = await Promise.all([stat(left), stat(right)])
    if (leftStat.size !== rightStat.size) return false

    const [leftContent, rightContent] = await Promise.all([readFile(left), readFile(right)])
    return leftContent.equals(rightContent)
  } catch (error) {
    if (error?.code === 'ENOENT') return false
    throw error
  }
}

async function assertPublishedRootMatchesDist() {
  const mismatches = []

  if (!(await sameFile(join(distRoot, 'index.html'), publishedIndex))) {
    mismatches.push('index.html')
  }

  const distAssets = await listFiles(join(distRoot, 'assets'))
  const rootAssets = await listFiles(publishedAssets)

  if (JSON.stringify(distAssets) !== JSON.stringify(rootAssets)) {
    mismatches.push('assets/ Dateiliste')
  } else {
    for (const asset of distAssets) {
      if (!(await sameFile(join(distRoot, 'assets', asset), join(publishedAssets, asset)))) {
        mismatches.push(`assets/${asset}`)

        if (asset.endsWith('.css') && process.env.CI) {
          const expectedContent = await readFile(join(distRoot, 'assets', asset))
          console.error(
            `PAGES_EXPECTED_CSS_BASE64:${expectedContent.toString('base64')}`,
          )
        }
      }
    }
  }

  if (mismatches.length > 0) {
    console.error('Der veröffentlichte GitHub-Pages-Root ist nicht mit dist synchron:')
    for (const mismatch of mismatches) console.error(`- ${mismatch}`)
    console.error('Bitte "npm run pages:sync" ausführen und die generierten Dateien committen.')
    process.exit(1)
  }

  console.log('GitHub-Pages-Root entspricht dem aktuellen Production Build.')
}

async function syncPublishedRoot() {
  await mkdir(dirname(publishedIndex), { recursive: true })
  await cp(join(distRoot, 'index.html'), publishedIndex)

  await rm(publishedAssets, { recursive: true, force: true })
  await cp(join(distRoot, 'assets'), publishedAssets, { recursive: true })

  console.log('Production Build nach index.html und assets/ synchronisiert.')
}

if (checkOnly) {
  await assertPublishedRootMatchesDist()
} else {
  await syncPublishedRoot()
}
