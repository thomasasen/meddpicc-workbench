import Ajv2020, { type ErrorObject } from 'ajv/dist/2020.js'
import addFormats from 'ajv-formats'

import projectSchema from '../../schema/meddpicc-project.schema.json'
import type { MeddpiccProject } from './project'
import { validateProjectDomain } from './projectValidation'

export const CURRENT_SCHEMA_VERSION = '0.2.0'
export const MAX_PROJECT_FILE_BYTES = 5 * 1024 * 1024

export type ProjectValidationSource = 'file' | 'parse' | 'version' | 'schema' | 'domain'

export type ProjectValidationIssue = {
  source: ProjectValidationSource
  code: string
  path: string
  message: string
}

export type ProjectParseResult =
  { success: true; value: unknown } | { success: false; issues: ProjectValidationIssue[] }

export type ProjectValidationResult =
  { success: true; project: MeddpiccProject } | { success: false; issues: ProjectValidationIssue[] }

const ajv = new Ajv2020({
  allErrors: true,
  strict: true,
  validateFormats: true,
})

addFormats(ajv)

const validateSchema = ajv.compile<MeddpiccProject>(projectSchema)

function schemaMessage(error: ErrorObject): string {
  switch (error.keyword) {
    case 'required':
      return `Pflichtfeld "${String(error.params.missingProperty)}" fehlt.`
    case 'enum':
      return 'Der Wert ist nicht zulässig.'
    case 'const':
      return 'Der Wert entspricht nicht dem unterstützten Dateiformat.'
    case 'format':
      return `Das Format "${String(error.params.format)}" ist ungültig.`
    case 'type':
      return 'Der Datentyp ist ungültig.'
    case 'minimum':
      return 'Der Wert liegt unter dem erlaubten Minimum.'
    case 'maximum':
      return 'Der Wert liegt über dem erlaubten Maximum.'
    case 'pattern':
      return 'Der Wert entspricht nicht dem erwarteten Format.'
    default:
      return error.message ? `Schemafehler: ${error.message}.` : 'Die Projektdatei ist ungültig.'
  }
}

function schemaPath(error: ErrorObject): string {
  if (error.keyword === 'required') {
    const suffix = String(error.params.missingProperty)
    return `${error.instancePath || ''}/${suffix}` || '/'
  }

  return error.instancePath || '/'
}

function getSchemaVersion(value: unknown): string | null {
  if (!value || typeof value !== 'object') return null

  const version = (value as { schemaVersion?: unknown }).schemaVersion
  return typeof version === 'string' ? version : null
}

function getMajor(version: string): number | null {
  const match = /^(\d+)\.(\d+)\.(\d+)(?:-[0-9A-Za-z.-]+)?$/.exec(version)
  return match ? Number(match[1]) : null
}

function validateVersion(value: unknown): ProjectValidationIssue[] {
  const version = getSchemaVersion(value)
  if (!version || version === CURRENT_SCHEMA_VERSION) return []

  const currentMajor = getMajor(CURRENT_SCHEMA_VERSION)
  const candidateMajor = getMajor(version)

  if (candidateMajor !== null && currentMajor !== null && candidateMajor > currentMajor) {
    return [
      {
        source: 'version',
        code: 'unsupported_future_major',
        path: '/schemaVersion',
        message: `Schema-Version ${version} ist neuer als die unterstützte Version ${CURRENT_SCHEMA_VERSION}. Die Datei wird nicht geladen oder überschrieben.`,
      },
    ]
  }

  return [
    {
      source: 'version',
      code: 'unsupported_schema_version',
      path: '/schemaVersion',
      message: `Schema-Version ${version} wird derzeit nicht unterstützt. Unterstützt wird ${CURRENT_SCHEMA_VERSION}.`,
    },
  ]
}

export function parseProjectJson(raw: string): ProjectParseResult {
  const bytes = new TextEncoder().encode(raw).byteLength

  if (bytes > MAX_PROJECT_FILE_BYTES) {
    return {
      success: false,
      issues: [
        {
          source: 'file',
          code: 'file_too_large',
          path: '/',
          message: `Die Projektdatei überschreitet das aktuelle Größenlimit von ${MAX_PROJECT_FILE_BYTES / 1024 / 1024} MB.`,
        },
      ],
    }
  }

  try {
    return { success: true, value: JSON.parse(raw) as unknown }
  } catch {
    return {
      success: false,
      issues: [
        {
          source: 'parse',
          code: 'invalid_json',
          path: '/',
          message: 'Die Projektdatei enthält kein gültiges JSON.',
        },
      ],
    }
  }
}

export function validateProject(value: unknown): ProjectValidationResult {
  const versionIssues = validateVersion(value)
  if (versionIssues.length > 0) {
    return { success: false, issues: versionIssues }
  }

  if (!validateSchema(value)) {
    return {
      success: false,
      issues: (validateSchema.errors ?? []).map((error) => ({
        source: 'schema',
        code: error.keyword,
        path: schemaPath(error),
        message: schemaMessage(error),
      })),
    }
  }

  const domainIssues = validateProjectDomain(value)
  if (domainIssues.length > 0) {
    return {
      success: false,
      issues: domainIssues.map((issue) => ({ source: 'domain', ...issue })),
    }
  }

  return { success: true, project: value }
}

export function loadProject(raw: string): ProjectValidationResult {
  const parsed = parseProjectJson(raw)
  if (!parsed.success) return parsed

  return validateProject(parsed.value)
}

export class ProjectValidationError extends Error {
  readonly issues: ProjectValidationIssue[]

  constructor(message: string, issues: ProjectValidationIssue[]) {
    super(message)
    this.name = 'ProjectValidationError'
    this.issues = issues
  }
}

export function serializeProject(project: MeddpiccProject): string {
  const validation = validateProject(project)

  if (!validation.success) {
    throw new ProjectValidationError(
      'Das Projekt kann nicht serialisiert werden, weil es ungültig ist.',
      validation.issues,
    )
  }

  return `${JSON.stringify(project, null, 2)}\n`
}
