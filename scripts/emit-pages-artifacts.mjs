import { readFile, readdir } from 'node:fs/promises'
import { join } from 'node:path'

async function listFiles(root) {
  const entries = await readdir(root, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    const path = join(root, entry.name)
    if (entry.isDirectory()) {
      files.push(...(await listFiles(path)))
    } else if (entry.isFile()) {
      files.push(path.replaceAll('\\\\', '/'))
    }
  }

  return files.sort()
}

const paths = ['index.html', 'pages-build.json', ...(await listFiles('assets'))]
const chunkSize = 12000

for (const path of paths) {
  const content = await readFile(path, 'utf8')
  const total = Math.max(1, Math.ceil(content.length / chunkSize))

  for (let index = 0; index < total; index += 1) {
    const chunk = content.slice(index * chunkSize, (index + 1) * chunkSize)
    console.log('PAGES_ARTIFACT ' + JSON.stringify({ path, index, total, content: chunk }))
  }
}
