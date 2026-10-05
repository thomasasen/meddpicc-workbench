import projectSchema from '../../schema/meddpicc-project.schema.json'
import { describe, expect, it } from 'vitest'

import { defaultProject } from '../data/defaultProject'
import { projectAreaKeys } from './project'
import {
  CURRENT_SCHEMA_VERSION,
  loadProject,
  serializeProject,
  validateProject,
} from './projectSchema'
import { qualificationStatusKeys } from './qualificationStatus'

function cloneProject() {
  return structuredClone(defaultProject)
}

describe('formales .meddpicc-Schema', () => {
  it('akzeptiert die Demo-Datei vollständig', () => {
    const result = validateProject(cloneProject())
    expect(result.success).toBe(true)
  })

  it('hält zentrale Domain-Enums konsistent zum JSON Schema', () => {
    expect(projectSchema.$defs.projectArea.enum).toEqual(projectAreaKeys)
    expect(projectSchema.$defs.qualificationStatus.enum).toEqual(qualificationStatusKeys)
  })

  it('lehnt fehlendes schemaVersion ab', () => {
    const project = cloneProject() as Record<string, unknown>
    delete project.schemaVersion

    const result = validateProject(project)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.issues.some((issue) => issue.path === '/schemaVersion')).toBe(true)
    }
  })

  it('lehnt einen ungültigen MEDDPICC-Status ab', () => {
    const project = cloneProject()
    project.meddpicc.metrics.status = 'invalid' as never

    expect(validateProject(project).success).toBe(false)
  })

  it('lehnt Confidence außerhalb 0–10 ab', () => {
    const project = cloneProject()
    project.meddpicc.metrics.confidence = 11

    expect(validateProject(project).success).toBe(false)
  })

  it('lehnt ungültige Datumswerte ab', () => {
    const project = cloneProject()
    project.project.targetCloseDate = '2027-99-31'

    expect(validateProject(project).success).toBe(false)
  })

  it('lehnt einen falschen Top-Level-Type ab', () => {
    expect(validateProject([]).success).toBe(false)
  })

  it('lehnt eine nicht unterstützte zukünftige Major-Version explizit ab', () => {
    const project = cloneProject() as unknown as { schemaVersion: string }
    project.schemaVersion = '1.0.0'

    const result = validateProject(project)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.issues[0]?.code).toBe('unsupported_future_major')
    }
  })

  it('round-tripped ohne Datenverlust', () => {
    const serialized = serializeProject(cloneProject())
    const loaded = loadProject(serialized)

    expect(loaded.success).toBe(true)
    if (loaded.success) {
      expect(loaded.project).toEqual(defaultProject)
      expect(loaded.project.schemaVersion).toBe(CURRENT_SCHEMA_VERSION)
    }
  })
})
