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

  it('legt Evidenz atomar mit History-Eintrag an und markiert das Projekt dirty', () => {
    const store = useProjectStore()
    const evidenceCount = store.project.evidence.length
    const historyCount = store.project.history.length

    const evidence = store.addEvidence(
      {
        statement: 'Economic Buyer bestätigt Priorität im Steering.',
        classification: 'confirmed_evidence',
        quality: 'high',
        verification: 'confirmed',
        sourceStakeholderId: null,
        sourceDate: '2026-10-05',
        context: 'Steering Committee',
        referenceId: null,
        relatedAreas: ['economicBuyer'],
      },
      {
        id: 'evidence_store_001',
        now: new Date('2026-10-05T17:30:00.000Z'),
      },
    )

    expect(store.project.evidence).toHaveLength(evidenceCount + 1)
    expect(store.project.history).toHaveLength(historyCount + 1)
    expect(store.project.evidence.at(-1)).toEqual(evidence)
    expect(store.project.history.at(-1)).toMatchObject({
      type: 'evidence_added',
      area: 'economicBuyer',
      entityId: 'evidence_store_001',
    })
    expect(store.dirty).toBe(true)

    expect(() => serializeProject(store.project)).not.toThrow()
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
  it('legt und schließt ein Risk atomar mit eindeutiger History an', () => {
    const store = useProjectStore()
    const historyCount = store.project.history.length

    store.addRisk(
      {
        title: 'Economic Buyer nicht validiert',
        severity: 'high',
        status: 'open',
        relatedArea: 'economicBuyer',
        relatedEntityIds: ['st_eb'],
        impact: 'Priorität ist nicht direkt bestätigt.',
      },
      { id: 'risk_store_001', now: new Date('2026-10-05T18:00:00.000Z'), historyId: 'history_risk_store_open' },
    )

    expect(store.project.risks.some((risk) => risk.id === 'risk_store_001')).toBe(true)
    expect(store.project.history.slice(historyCount).filter((event) => event.type === 'risk_opened')).toHaveLength(1)
    expect(store.dirty).toBe(true)

    store.setRiskStatus('risk_store_001', 'closed', {
      now: new Date('2026-10-05T19:00:00.000Z'),
      historyId: 'history_risk_store_closed',
    })
    store.setRiskStatus('risk_store_001', 'closed', { now: new Date('2026-10-05T19:30:00.000Z') })

    expect(store.project.risks.find((risk) => risk.id === 'risk_store_001')?.status).toBe('closed')
    expect(
      store.project.history.filter((event) => event.entityId === 'risk_store_001' && event.type === 'risk_closed'),
    ).toHaveLength(1)
  })

  it('verknüpft eine Action mit Risk und protokolliert completed genau einmal', () => {
    const store = useProjectStore()
    store.addRisk(
      {
        title: 'Test Risk',
        severity: 'medium',
        status: 'open',
        relatedArea: 'competition',
        relatedEntityIds: [],
        impact: 'Alternative ist unklar.',
      },
      { id: 'risk_action_link', now: new Date('2026-10-05T18:00:00.000Z'), historyId: 'history_risk_action_link' },
    )

    store.addAction(
      {
        title: 'Alternativen validieren',
        status: 'open',
        owner: 'Test Seller',
        relatedArea: 'competition',
        relatedRiskId: 'risk_action_link',
        relatedGap: 'Competition unbekannt',
        desiredEvidence: 'Champion benennt aktive Alternativen.',
        evidenceIds: [],
      },
      { id: 'action_store_001' },
    )

    expect(store.project.actions.find((action) => action.id === 'action_store_001')?.relatedRiskId).toBe(
      'risk_action_link',
    )
    expect(() => serializeProject(store.project)).not.toThrow()

    store.setActionStatus('action_store_001', 'completed', {
      now: new Date('2026-10-05T20:00:00.000Z'),
      historyId: 'history_action_store_completed',
    })
    store.setActionStatus('action_store_001', 'completed')

    expect(
      store.project.history.filter(
        (event) => event.entityId === 'action_store_001' && event.type === 'action_completed',
      ),
    ).toHaveLength(1)
  })

  it('lehnt ungültige Risk-Referenzen atomar ab', () => {
    const store = useProjectStore()
    const before = JSON.parse(JSON.stringify(store.project))

    expect(() =>
      store.addRisk(
        {
          title: 'Ungültiges Risk',
          severity: 'high',
          status: 'open',
          relatedArea: 'economicBuyer',
          relatedEntityIds: ['pp_01'],
          impact: 'Test',
        },
        { id: 'risk_invalid_ref', now: new Date('2026-10-05T18:00:00.000Z') },
      ),
    ).toThrow()

    expect(store.project).toEqual(before)
    expect(store.dirty).toBe(false)
  })

  it('bleibt nach Risk- und Action-Änderungen im Save-Round-Trip valide', () => {
    const store = useProjectStore()
    store.addAction(
      {
        title: 'Discovery vertiefen',
        status: 'open',
        relatedArea: 'metrics',
        desiredEvidence: 'Kunde bestätigt wirtschaftliche Wirkung.',
        evidenceIds: [],
      },
      { id: 'action_roundtrip' },
    )

    const download = store.prepareDownload(new Date('2026-10-05T21:00:00.000Z'))
    expect(() => serializeProject(download.project)).not.toThrow()
    expect(
      JSON.parse(download.content).actions.some((action: { id: string }) => action.id === 'action_roundtrip'),
    ).toBe(true)
  })
})
