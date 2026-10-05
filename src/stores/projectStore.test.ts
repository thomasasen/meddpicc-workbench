import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'

import legacyProjectRaw from '../../examples/legacy/demo-opportunity-0.1.0.meddpicc?raw'

import { defaultProject } from '../data/defaultProject'
import { serializeProject } from '../domain/projectSchema'
import { useProjectStore } from './projectStore'

describe('projectStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('startet mit der validierten Demo als clean state', () => {
    const store = useProjectStore()

    expect(store.source).toBe('demo')
    expect(store.dirty).toBe(false)
    expect(store.fileName).toBeNull()
  })

  it('markiert ein neues Projekt als ungespeichert', () => {
    const store = useProjectStore()

    store.createProject(
      {
        accountName: 'Neue Beispiel AG',
        name: 'CRM Auswahl 2027',
        owner: 'Test Seller',
        currency: 'EUR',
      },
      {
        now: new Date('2026-10-05T16:30:00.000Z'),
        projectId: 'project_store_001',
      },
    )

    expect(store.source).toBe('new')
    expect(store.dirty).toBe(true)
    expect(store.project.project.accountName).toBe('Neue Beispiel AG')
    expect(store.fileName).toBe('Neue Beispiel AG - CRM Auswahl 2027.meddpicc')
  })

  it('lädt nur vollständig valide importierte Projekte', () => {
    const store = useProjectStore()
    const before = JSON.parse(JSON.stringify(store.project))

    const invalidResult = store.importProjectText('{ invalid', 'kaputt.meddpicc')
    expect(invalidResult.success).toBe(false)
    expect(store.project).toEqual(before)
    expect(store.source).toBe('demo')

    const validResult = store.importProjectText(serializeProject(defaultProject), 'deal.meddpicc')
    expect(validResult.success).toBe(true)
    expect(store.source).toBe('file')
    expect(store.fileName).toBe('deal.meddpicc')
    expect(store.dirty).toBe(false)
  })

  it('markiert ein automatisch migriertes Legacy-Projekt bis zum Speichern als dirty', () => {
    const store = useProjectStore()

    const result = store.importProjectText(legacyProjectRaw, 'legacy.meddpicc')

    expect(result.success).toBe(true)
    if (!result.success) return

    expect(result.migration?.fromVersion).toBe('0.1.0')
    expect(store.project.schemaVersion).toBe('0.2.0')
    expect(store.fileName).toBe('legacy.meddpicc')
    expect(store.dirty).toBe(true)
  })

  it('setzt bei Bearbeitung dirty und erst nach bestätigtem Download wieder clean', () => {
    const store = useProjectStore()

    store.updateProjectMeta({ owner: 'Neuer Owner' })
    expect(store.dirty).toBe(true)

    const download = store.prepareDownload(new Date('2026-10-05T17:00:00.000Z'))
    expect(store.dirty).toBe(true)
    expect(download.project.revision).toBe(defaultProject.revision + 1)

    store.confirmDownloaded(download)
    expect(store.dirty).toBe(false)
    expect(store.source).toBe('file')
    expect(store.project.updatedAt).toBe('2026-10-05T17:00:00.000Z')
  })
})
