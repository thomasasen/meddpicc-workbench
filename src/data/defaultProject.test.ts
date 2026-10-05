import { describe, expect, it } from 'vitest'

import { defaultProject } from './defaultProject'

describe('defaultProject', () => {
  it('lädt die fiktive Demo-Opportunity aus einer .meddpicc-Datei', () => {
    expect(defaultProject.format).toBe('meddpicc-workbench-project')
    expect(defaultProject.schemaVersion).toBe('0.1.0')
    expect(defaultProject.project.accountName).toBe('Beispielwerke Industrie GmbH')
  })

  it('enthält alle acht MEDDPICC-Bereiche mit gültigem Evidenzgrad', () => {
    const sections = Object.values(defaultProject.meddpicc)

    expect(sections).toHaveLength(8)

    for (const section of sections) {
      expect(section.confidence).toBeGreaterThanOrEqual(0)
      expect(section.confidence).toBeLessThanOrEqual(10)
      expect(section.status).toMatch(/^(confirmed|partial|assumption|unknown|risk)$/)
    }
  })

  it('referenziert aus MEDDPICC-Bereichen nur vorhandene Evidenz', () => {
    const evidenceIds = new Set(defaultProject.evidence.map((item) => item.id))

    for (const section of Object.values(defaultProject.meddpicc)) {
      for (const evidenceId of section.evidenceIds) {
        expect(evidenceIds.has(evidenceId)).toBe(true)
      }
    }
  })

  it('enthält bewusst offene Risiken und Aktionen', () => {
    expect(defaultProject.risks.some((risk) => risk.status === 'open')).toBe(true)
    expect(defaultProject.actions.some((action) => action.status === 'open')).toBe(true)
  })
})
