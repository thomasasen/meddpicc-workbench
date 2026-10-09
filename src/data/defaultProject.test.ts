import { describe, expect, it } from 'vitest'

import { projectAreaKeys } from '../domain/project'
import { defaultProject } from './defaultProject'

describe('defaultProject', () => {
  it('lädt die fiktive Demo-Opportunity aus einer .meddpicc-Datei', () => {
    expect(defaultProject.format).toBe('meddpicc-workbench-project')
    expect(defaultProject.schemaVersion).toBe('0.2.0')
    expect(defaultProject.project.accountName).toBe('Beispielwerke Industrie GmbH')
  })

  it('enthält alle acht MEDDPICC-Bereiche mit gültigem Evidenzgrad', () => {
    const sections = projectAreaKeys.map((area) => defaultProject.meddpicc[area])

    expect(sections).toHaveLength(8)

    for (const section of sections) {
      expect(section.confidence).toBeGreaterThanOrEqual(0)
      expect(section.confidence).toBeLessThanOrEqual(10)
      expect(section.status).toMatch(/^(confirmed|partial|assumption|unknown|risk)$/)
    }
  })

  it('enthält bewusst offene Risiken und Aktionen', () => {
    expect(defaultProject.risks.some((risk) => risk.status === 'open')).toBe(true)
    expect(defaultProject.actions.some((action) => action.status === 'open')).toBe(true)
  })
  it('trennt in der Beispiel-Opportunity hypothetische Kostenwirkung von bloßem Zeitgewinn', () => {
    const metrics = defaultProject.meddpicc.metrics
    expect(metrics.status).toBe('partial')
    expect(metrics.metrics).toHaveLength(5)

    const time = metrics.metrics.find((m) => m.id === 'metric_01')
    expect(time?.economicImpact.value).toBeNull()
    expect(time?.customerConfirmed).toBe(false)
    expect(time?.economicImpact.derivation).toContain('1.360.680 EUR')

    const effects = ['metric_03', 'metric_04', 'metric_05'].map((id) =>
      metrics.metrics.find((metric) => metric.id === id),
    )
    expect(effects.every(Boolean)).toBe(true)
    expect(effects.map((m) => m?.economicImpact.value)).toEqual([110000, 60000, 150000])
    expect(effects.every((m) => m?.customerConfirmed === false)).toBe(true)
    for (const metric of effects) {
      const evidence = defaultProject.evidence.find((item) => item.id === metric?.evidenceIds[0])
      expect(evidence?.classification).toBe('assumption')
      expect(evidence?.verification).toBe('unconfirmed')
      expect(evidence?.quality).toBe('low')
    }
    const legacyBusinessCase = defaultProject.calculators.businessCase
    expect(legacyBusinessCase).toBeDefined()
    if (!legacyBusinessCase) return
    expect(legacyBusinessCase.inputs.oneTimeInvestment).toBe(480000)
    expect(legacyBusinessCase.inputs.annualRecurringCost).toBe(96000)
    expect(legacyBusinessCase.customerConfirmed).toBe(false)
  })
})
