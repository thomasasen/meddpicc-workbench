import { describe, expect, it } from 'vitest'

import { defaultProject } from '../data/defaultProject'
import { prepareProjectForSave, suggestProjectFileName } from './projectPersistence'

describe('projectPersistence', () => {
  it('erhöht Revision und updatedAt in einem separaten Save-Snapshot', () => {
    const original = structuredClone(defaultProject)
    const snapshot = prepareProjectForSave(original, new Date('2026-10-05T17:00:00.000Z'))

    expect(snapshot.revision).toBe(original.revision + 1)
    expect(snapshot.updatedAt).toBe('2026-10-05T17:00:00.000Z')
    expect(original.revision).toBe(defaultProject.revision)
    expect(original.updatedAt).toBe(defaultProject.updatedAt)
  })

  it('erzeugt einen Windows-tauglichen .meddpicc-Dateinamen', () => {
    const project = structuredClone(defaultProject)
    project.project.accountName = 'ACME / DACH: Vertrieb'
    project.project.name = 'CRM * Auswahl? 2027'

    expect(suggestProjectFileName(project)).toBe('ACME DACH Vertrieb - CRM Auswahl 2027.meddpicc')
  })
})
