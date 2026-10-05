import { describe, expect, it } from 'vitest'

import { defaultProject } from '../data/defaultProject'
import { traceActionSources, traceAreaSources, traceRiskSources } from './sourceTraceability'

describe('source traceability', () => {
  it('führt MEDDPICC-Bereich über Evidence zu Reference-Records zurück', () => {
    const project = structuredClone(defaultProject)
    const trace = traceAreaSources(project, 'economicBuyer')

    expect(trace.evidence.map((item) => item.id)).toContain('ev_eb_01')
    expect(trace.references.map((item) => item.id)).toContain('ref_discovery_01')
  })

  it('führt ein Risk über Bereich und verknüpfte Entity auf Evidenz und Quellen zurück', () => {
    const project = structuredClone(defaultProject)
    const risk = project.risks.find((item) => item.id === 'risk_pp_01')
    expect(risk).toBeDefined()
    if (!risk) return

    project.evidence.push({
      id: 'ev_unrelated_pp',
      classification: 'customer_statement',
      quality: 'medium',
      statement: 'Allgemeine Paper-Process-Aussage ohne Entity-Link.',
      sourceStakeholderId: 'st_procurement',
      sourceDate: '2026-10-05',
      context: null,
      referenceId: 'ref_discovery_01',
      verification: 'single_source',
      relatedAreas: ['paperProcess'],
      createdAt: '2026-10-05T20:00:00.000Z',
    })

    const trace = traceRiskSources(project, risk)

    expect(trace.evidence.map((item) => item.id)).toContain('ev_pp_01')
    expect(trace.evidence.map((item) => item.id)).not.toContain('ev_unrelated_pp')
    expect(trace.references.map((item) => item.id)).toContain('ref_procurement_call')
  })

  it('nutzt bei einer Action direkte Evidence und die Quellen des verknüpften Risks', () => {
    const project = structuredClone(defaultProject)
    const action = project.actions.find((item) => item.id === 'action_eb_01')
    expect(action).toBeDefined()
    if (!action) return

    action.evidenceIds = ['ev_metric_02']
    const trace = traceActionSources(project, action)

    expect(trace.evidence.map((item) => item.id)).toEqual(expect.arrayContaining(['ev_metric_02', 'ev_eb_01']))
    expect(trace.references.map((item) => item.id)).toEqual(
      expect.arrayContaining(['ref_service_report', 'ref_discovery_01']),
    )
  })
  it('ordnet einem Entity-Risk keine Evidence einer anderen Entity desselben Bereichs zu, behält Section-Evidence aber bei', () => {
    const project = structuredClone(defaultProject)
    const risk = project.risks.find((item) => item.id === 'risk_comp_01')
    const otherAlternative = project.meddpicc.competition.knownAlternatives.find((item) => item.id === 'comp_02')
    expect(risk).toBeDefined()
    expect(otherAlternative).toBeDefined()
    if (!risk || !otherAlternative) return

    project.evidence.push(
      {
        id: 'ev_comp_other_entity',
        classification: 'customer_statement',
        quality: 'medium',
        statement: 'Budget könnte in ein anderes Projekt verschoben werden.',
        sourceStakeholderId: 'st_champion',
        sourceDate: '2026-10-05',
        context: null,
        referenceId: 'ref_discovery_01',
        verification: 'single_source',
        relatedAreas: ['competition'],
        createdAt: '2026-10-05T21:00:00.000Z',
      },
      {
        id: 'ev_comp_section',
        classification: 'customer_statement',
        quality: 'medium',
        statement: 'Der Kunde bewertet Competition weiterhin als offenen Bereich.',
        sourceStakeholderId: 'st_champion',
        sourceDate: '2026-10-05',
        context: null,
        referenceId: 'ref_discovery_01',
        verification: 'single_source',
        relatedAreas: ['competition'],
        createdAt: '2026-10-05T21:01:00.000Z',
      },
    )
    otherAlternative.evidenceIds.push('ev_comp_other_entity')
    project.meddpicc.competition.evidenceIds.push('ev_comp_section')

    const trace = traceRiskSources(project, risk)
    const evidenceIds = trace.evidence.map((item) => item.id)

    expect(evidenceIds).toContain('ev_comp_01')
    expect(evidenceIds).toContain('ev_comp_section')
    expect(evidenceIds).not.toContain('ev_comp_other_entity')
  })
})
