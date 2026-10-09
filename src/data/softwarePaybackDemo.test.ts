import { describe, expect, it } from 'vitest'

import { calculateSoftwarePayback } from '../domain/softwarePayback'
import { calculateCrmSaasDemo, createCrmSaasDemo } from './softwarePaybackDemo'

describe('CRM-/SaaS-Demobeispiel mit Kunden-Metrics', () => {
  it('enthält Einmalinvestitionen, SaaS, wegfallende Bestandskosten und fünf verschiedene Metrics', () => {
    const scenario = createCrmSaasDemo()
    expect(scenario.horizonMonths).toBe(36)
    expect(scenario.costs.filter((cost) => cost.kind === 'one-time').reduce((sum, c) => sum + c.amountEur, 0)).toBe(480000)
    expect(scenario.costs.find((cost) => cost.kind === 'saas')?.amountEur).toBe(8000)
    expect(scenario.costs.find((cost) => cost.kind === 'avoided-legacy')?.startMonth).toBe(10)
    expect(scenario.metrics.map((metric) => metric.formula)).toEqual([
      'direct',
      'process',
      'conversion',
      'time',
      'risk',
    ])
  })

  it('berücksichtigt nur drei begründete wirtschaftliche Effects, nicht Kapazität oder Risikoschätzung', () => {
    const result = calculateCrmSaasDemo()
    expect(result.success).toBe(true)
    if (!result.success) return
    expect(result.countedMetrics).toHaveLength(3)
    expect(result.countedMetrics.reduce((total, metric) => total + metric.annualEur, 0)).toBe(320000)
    expect(result.nonMonetized).toHaveLength(2)
    expect(result.nonMonetized.find((metric) => metric.name.includes('CRM-Nacharbeit'))?.annualPotentialEur).toBe(1360680)
    expect(result.nonMonetized.find((metric) => metric.name.includes('Compliance'))?.annualPotentialEur).toBe(40000)
    expect(result.unresolvedAssumptions).toBe(3)
  })

  it('hat einen nachvollziehbaren Payback im Monat 35 statt eines unbegründeten Soforterfolgs', () => {
    const result = calculateCrmSaasDemo()
    if (!result.success) throw new Error(result.issues.join('; '))
    expect(result.months[0]!.cumulativeEur).toBe(-360000)
    expect(result.months[6]!.cumulativeEur).toBe(-528000)
    expect(result.months[9]!.avoidedLegacyEur).toBe(0)
    expect(result.months[10]!.avoidedLegacyEur).toBe(3000)
    expect(result.firstBreakEvenMonth).toBe(35)
    expect(result.sustainedBreakEvenMonth).toBe(35)
    expect(result.months[36]!.cumulativeEur).toBeCloseTo(42583.333333333, 3)
  })

  it('ist nicht global veränderbar: erneutes Laden liefert dieselben unveränderten Demowerte', () => {
    const first = createCrmSaasDemo()
    first.metrics[0]!.annualAmountEur = 1
    first.costs[0]!.amountEur = 1
    const second = createCrmSaasDemo()
    expect(second.metrics[0]!.annualAmountEur).toBe(110000)
    expect(second.costs[0]!.amountEur).toBe(360000)
    expect(calculateSoftwarePayback(second).success).toBe(true)
  })
})
