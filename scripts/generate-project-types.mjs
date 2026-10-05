import { mkdir, writeFile } from 'node:fs/promises'
import { dirname } from 'node:path'

import { compileFromFile } from 'json-schema-to-typescript'

const schemaPath = 'schema/meddpicc-project.schema.json'
const outputPath = 'src/domain/project.generated.ts'

const output = await compileFromFile(schemaPath, {
  bannerComment:
    '/* Diese Datei wird aus schema/meddpicc-project.schema.json generiert. Nicht manuell bearbeiten. */',
})

await mkdir(dirname(outputPath), { recursive: true })
await writeFile(outputPath, output, 'utf8')
