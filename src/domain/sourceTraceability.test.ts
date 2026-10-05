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

    const trace = traceRiskSources(project, risk)

    expect(trace.evidence.map((item) => item.id)).toContain('ev_pp_01')
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
})
