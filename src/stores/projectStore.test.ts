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

  it('legt und aktualisiert Reference-Records atomar und verknüpft neue Evidenz damit', () => {
    const store = useProjectStore()

    const reference = store.addReference(
      {
        type: 'meeting',
        title: 'CFO Steering',
        date: '2026-10-05',
        externalId: 'CRM-4711',
        url: 'https://example.test/cfo-steering',
        notes: 'Kundentermin',
      },
      { id: 'ref_store_001' },
    )

    expect(store.project.references.at(-1)).toEqual(reference)
    expect(store.dirty).toBe(true)

    store.updateReference('ref_store_001', {
      type: 'meeting',
      title: 'CFO Steering final',
      date: '2026-10-05',
      externalId: 'CRM-4711',
      url: 'https://example.test/cfo-steering',
      notes: 'Priorität bestätigt',
    })

    const evidence = store.addEvidence(
      {
        statement: 'CFO bestätigt die Investitionspriorität.',
        classification: 'confirmed_evidence',
        quality: 'high',
        verification: 'confirmed',
        sourceStakeholderId: 'st_eb',
        sourceDate: '2026-10-05',
        context: 'Steering Committee',
        referenceId: 'ref_store_001',
        relatedAreas: ['economicBuyer'],
      },
      { id: 'evidence_reference_link', now: new Date('2026-10-05T20:30:00.000Z') },
    )

    expect(evidence.referenceId).toBe('ref_store_001')
    expect(store.project.references.find((item) => item.id === 'ref_store_001')?.title).toBe('CFO Steering final')
    expect(() => serializeProject(store.project)).not.toThrow()
  })

  it('verwirft ungültige Reference-Änderungen ohne Partial State', () => {
    const store = useProjectStore()
    const before = JSON.parse(JSON.stringify(store.project))

    expect(() =>
      store.addReference(
        {
          type: 'document',
          title: 'Ungültige Quelle',
          url: 'ftp://example.test/file',
          notes: '',
        },
        { id: 'ref_invalid_url' },
      ),
    ).toThrow()

    expect(store.project).toEqual(before)
    expect(store.dirty).toBe(false)
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
  it('ändert Projektmetadaten atomar und hält Target Go-Live mit Planning synchron', () => {
    const store = useProjectStore()

    store.updateProjectMeta({
      name: 'CRM Transformation 2027 · qualifiziert',
      accountName: 'Beispielwerke Industrie SE',
      opportunityId: 'DEMO-OPP-2027-QUALIFIED',
      owner: 'Strategic AE',
      currency: 'CHF',
      dealValue: 510000,
      targetCloseDate: '2027-04-15',
      targetGoLiveDate: '2027-08-15',
      forecastCategory: 'commit',
      notes: 'Metadaten im Roadmap-2-Slice validiert bearbeitet.',
    })

    expect(store.project.project.name).toBe('CRM Transformation 2027 · qualifiziert')
    expect(store.project.project.accountName).toBe('Beispielwerke Industrie SE')
    expect(store.project.project.opportunityId).toBe('DEMO-OPP-2027-QUALIFIED')
    expect(store.project.project.owner).toBe('Strategic AE')
    expect(store.project.project.currency).toBe('CHF')
    expect(store.project.project.dealValue).toBe(510000)
    expect(store.project.project.targetCloseDate).toBe('2027-04-15')
    expect(store.project.project.targetGoLiveDate).toBe('2027-08-15')
    expect(store.project.planning.targetGoLiveDate).toBe('2027-08-15')
    expect(store.project.project.forecastCategory).toBe('commit')
    expect(store.project.project.notes).toBe('Metadaten im Roadmap-2-Slice validiert bearbeitet.')
    expect(store.dirty).toBe(true)
    expect(() => serializeProject(store.project)).not.toThrow()
  })

  it('verwirft ungültige Projektmetadaten ohne Partial State', () => {
    const store = useProjectStore()
    const before = JSON.parse(JSON.stringify(store.project))

    expect(() => store.updateProjectMeta({ accountName: '', currency: 'EURO' })).toThrow()

    expect(store.project).toEqual(before)
    expect(store.dirty).toBe(false)
  })

  it('verknüpft und entfernt konkrete Evidence-Entity-Links atomar', () => {
    const store = useProjectStore()

    store.setEvidenceQualificationLinks('ev_metric_02', [
      { area: 'metrics', entityId: 'metric_01' },
      { area: 'decisionCriteria', entityId: 'dc_01' },
    ])

    expect(store.project.meddpicc.metrics.metrics[0].evidenceIds).toContain('ev_metric_02')
    expect(store.project.meddpicc.metrics.metrics[1].evidenceIds).not.toContain('ev_metric_02')
    expect(store.project.meddpicc.decisionCriteria.criteria[0].evidenceIds).toContain('ev_metric_02')

    store.setEvidenceQualificationLinks('ev_metric_02', [{ area: 'decisionCriteria', entityId: 'dc_01' }])

    expect(store.project.meddpicc.metrics.metrics[0].evidenceIds).not.toContain('ev_metric_02')
    expect(
      store.project.meddpicc.decisionCriteria.criteria[0].evidenceIds.filter((id) => id === 'ev_metric_02'),
    ).toHaveLength(1)
    expect(() => serializeProject(store.project)).not.toThrow()
  })

  it('legt neue Evidence und konkrete Entity-Links in derselben validierten Mutation an', () => {
    const store = useProjectStore()

    const evidence = store.addEvidence(
      {
        statement: 'CFO bestätigt das Integrationskriterium als kaufentscheidend.',
        classification: 'confirmed_evidence',
        quality: 'high',
        verification: 'confirmed',
        sourceStakeholderId: 'st_eb',
        sourceDate: '2026-10-05',
        context: 'CFO Steering',
        referenceId: 'ref_discovery_01',
        relatedAreas: ['economicBuyer', 'decisionCriteria'],
      },
      {
        id: 'evidence_entity_create',
        now: new Date('2026-10-05T22:15:00.000Z'),
        entityTargets: [
          { area: 'economicBuyer', entityId: 'st_eb' },
          { area: 'decisionCriteria', entityId: 'dc_01' },
        ],
      },
    )

    expect(evidence.id).toBe('evidence_entity_create')
    expect(store.project.meddpicc.economicBuyer.candidates[0].evidenceIds).toContain('evidence_entity_create')
    expect(store.project.meddpicc.decisionCriteria.criteria[0].evidenceIds).toContain('evidence_entity_create')
    expect(store.project.history.at(-1)).toMatchObject({
      type: 'evidence_added',
      entityId: 'evidence_entity_create',
    })
  })

  it('verwirft ungültige Evidence- oder Entity-Targets ohne Partial State', () => {
    const store = useProjectStore()
    const before = JSON.parse(JSON.stringify(store.project))

    expect(() =>
      store.setEvidenceQualificationLinks('ev_missing', [{ area: 'metrics', entityId: 'metric_01' }]),
    ).toThrow()
    expect(store.project).toEqual(before)
    expect(store.dirty).toBe(false)

    expect(() =>
      store.setEvidenceQualificationLinks('ev_metric_01', [{ area: 'metrics', entityId: 'metric_missing' }]),
    ).toThrow()
    expect(store.project).toEqual(before)
    expect(store.dirty).toBe(false)

    expect(() =>
      store.addEvidence(
        {
          statement: 'Diese Evidence darf wegen des ungültigen Targets nicht committed werden.',
          classification: 'customer_statement',
          quality: 'medium',
          verification: 'single_source',
          sourceStakeholderId: 'st_champion',
          sourceDate: '2026-10-05',
          context: null,
          referenceId: 'ref_discovery_01',
          relatedAreas: ['metrics'],
        },
        {
          id: 'evidence_invalid_target',
          now: new Date('2026-10-05T22:30:00.000Z'),
          entityTargets: [{ area: 'metrics', entityId: 'metric_missing' }],
        },
      ),
    ).toThrow()
    expect(store.project).toEqual(before)
    expect(store.dirty).toBe(false)
  })
})
