import { describe, expect, it } from 'vitest'

import { defaultProject } from '../data/defaultProject'
import { validateProject } from './projectSchema'

function cloneProject() {
  return structuredClone(defaultProject)
}

describe('Domain Validation', () => {
  it('akzeptiert die Referenzintegrität des Demo-Fixtures', () => {
    expect(validateProject(cloneProject()).success).toBe(true)
  })

  it('lehnt unbekannte Evidence-IDs in MEDDPICC-Sektionen ab', () => {
    const project = cloneProject()
    project.meddpicc.metrics.evidenceIds.push('ev_missing')

    const result = validateProject(project)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.issues.some((issue) => issue.code === 'missing_reference')).toBe(true)
    }
  })

  it('lehnt unbekannte Stakeholder-IDs ab', () => {
    const project = cloneProject()
    project.meddpicc.economicBuyer.candidates[0]!.stakeholderId = 'st_missing'

    const result = validateProject(project)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.issues.some((issue) => issue.code === 'missing_stakeholder_reference')).toBe(true)
    }
  })

  it('lehnt unbekannte Related-Entity-IDs in Risiken ab', () => {
    const project = cloneProject()
    project.risks[0]!.relatedEntityIds = ['missing_entity']

    const result = validateProject(project)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.issues.some((issue) => issue.code === 'missing_reference')).toBe(true)
    }
  })

  it('lehnt unbekannte Risk-IDs in Actions ab', () => {
    const project = cloneProject()
    project.actions[0]!.relatedRiskId = 'risk_missing'

    const result = validateProject(project)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.issues.some((issue) => issue.code === 'missing_risk_reference')).toBe(true)
    }
  })

  it('lehnt unbekannte Process-Vorgänger ab', () => {
    const project = cloneProject()
    project.meddpicc.decisionProcess.steps[1]!.predecessorIds = ['dp_missing']

    const result = validateProject(project)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.issues.some((issue) => issue.code === 'missing_reference')).toBe(true)
    }
  })

  it('erkennt Process Dependency Cycles', () => {
    const project = cloneProject()
    project.meddpicc.decisionProcess.steps[0]!.predecessorIds = ['dp_03']

    const result = validateProject(project)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.issues.some((issue) => issue.code === 'dependency_cycle')).toBe(true)
    }
  })
})
