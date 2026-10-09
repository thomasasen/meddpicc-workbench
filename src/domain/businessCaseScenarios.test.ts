import { describe, expect, it } from 'vitest'
import { createCrmSaasDemo } from '../data/softwarePaybackDemo'
import { illustrativeBalanceContinuation } from './paybackContinuation'
import { summarizeBusinessCase } from './businessCase'
import { calculateSoftwarePayback, exampleSoftwareProject } from './softwarePayback'
import { compareBusinessScenarios, DEFAULT_SCENARIO_SETTINGS } from './businessCaseScenarios'

describe('Szenario-Stresstest mit vorhandener Monatsengine', () => {
  it.each([36, 60] as const)('erhält Basis bei %i Monaten exakt', (horizon) => {
    const input = createCrmSaasDemo()
    input.horizonMonths = horizon
    const snapshot = JSON.stringify(input)
    const base = compareBusinessScenarios(input)![0]!
    expect(base.summary).toEqual(summarizeBusinessCase(input))
    expect(base.summary.periodMetrics.at(-1)!.balanceEur).toBe(base.summary.netValueEur)
    expect(JSON.stringify(input)).toBe(snapshot)
  })

  it('prüft Nutzenskalierung, Einmalkosten und Verzögerung einzeln und kombiniert', () => {
    const input = exampleSoftwareProject()
    const base = summarizeBusinessCase(input)!
    const less = summarizeBusinessCase(input, { benefitPercent: -25, oneTimeCostPercent: 0, benefitDelayMonths: 0 })!
    expect(less.benefitEur).toBe(base.benefitEur * 0.75)
    expect(less.totalCostEur).toBe(base.totalCostEur)
    const dearer = summarizeBusinessCase(input, { benefitPercent: 0, oneTimeCostPercent: 15, benefitDelayMonths: 0 })!
    expect(dearer.investmentEur).toBe(138000)
    expect(dearer.operatingCostsEur).toBe(base.operatingCostsEur)
    const delayed = summarizeBusinessCase(input, { benefitPercent: 0, oneTimeCostPercent: 0, benefitDelayMonths: 3 })!
    expect(delayed.periodMetrics[7]!.benefitEur).toBe(0)
    expect(delayed.periodMetrics[10]!.benefitEur).toBe(15000)
    expect(delayed.benefitEur).toBe(405000)
    const combined = compareBusinessScenarios(input)!
    expect(combined[1]!.summary.totalCostEur).toBe(dearer.totalCostEur)
    expect(combined[1]!.summary.benefitEur).toBe(303750)
    expect(combined[1]!.deltaBalanceEur).toBeCloseTo(combined[1]!.summary.netValueEur - base.netValueEur)
    expect(combined[2]!.summary.totalCostEur).toBe(base.totalCostEur)
    expect(combined[2]!.summary.benefitEur).toBeCloseTo(495000)
  })

  it('hält Lizenzkosten und Altsystemeffekte trotz Nutzenverzögerung auf denselben Monaten', () => {
    const input = createCrmSaasDemo()
    const base = calculateSoftwarePayback(input)
    const stress = calculateSoftwarePayback(input, DEFAULT_SCENARIO_SETTINGS.conservative)
    expect(base.success && stress.success).toBe(true)
    if (!base.success || !stress.success) return
    for (const month of [0, 1, 7, 10, 36]) {
      expect(stress.months[month]!.avoidedLegacyEur).toBe(base.months[month]!.avoidedLegacyEur)
    }
    expect(stress.months[1]!.newCostEur).toBe(base.months[1]!.newCostEur)
    expect(stress.months[7]!.metricBenefitEur).toBe(0)
    expect(stress.months[10]!.metricBenefitEur).toBeGreaterThan(0)
  })

  it('rechnet Zeitgewinne und Risikowerte nicht automatisch an', () => {
    const stress = calculateSoftwarePayback(createCrmSaasDemo(), {
      benefitPercent: 150,
      oneTimeCostPercent: 0,
      benefitDelayMonths: 0,
    })
    expect(stress.success).toBe(true)
    if (stress.success) {
      expect(stress.countedMetrics).toHaveLength(3)
      expect(stress.nonMonetized).toHaveLength(2)
      expect(stress.nonMonetized.map((m) => m.reason).join(' ')).toMatch(/Kapazitätsgewinn.*Risiko/)
    }
  })

  it('zeigt fehlenden Break-even, Verluste und nicht definierten ROI unverfälscht', () => {
    const input = exampleSoftwareProject()
    input.metrics[0]!.annualAmountEur = 0
    const scenarios = compareBusinessScenarios(input)!
    expect(scenarios.every((s) => s.summary.sustainedBreakEvenMonth === null)).toBe(true)
    expect(scenarios.every((s) => s.summary.netValueEur < 0)).toBe(true)
    input.costs = []
    expect(compareBusinessScenarios(input)![0]!.summary.roiPercent).toBeNull()
  })

  it('verschiebt Ramp-up und Nutzenende, nicht die Vertragstermine', () => {
    const input = exampleSoftwareProject()
    input.metrics[0]!.rampMonths = 3
    input.metrics[0]!.endMonth = 9
    const shifted = calculateSoftwarePayback(input, {
      benefitPercent: 0,
      oneTimeCostPercent: 0,
      benefitDelayMonths: 3,
    })
    expect(shifted.success).toBe(true)
    if (shifted.success) {
      expect(shifted.months[10]!.metricBenefitEur).toBe(5000)
      expect(shifted.months[12]!.metricBenefitEur).toBe(15000)
      expect(shifted.months[13]!.metricBenefitEur).toBe(0)
    }
  })

  it('schneidet wirtschaftlichen Nutzen am Betrachtungsende ab', () => {
    const input = exampleSoftwareProject()
    input.metrics[0]!.startMonth = 35
    const summary = summarizeBusinessCase(input, {
      benefitPercent: 0,
      oneTimeCostPercent: 0,
      benefitDelayMonths: 12,
    })!
    expect(summary.creditedMetricsEur).toBe(0)
    expect(summary.periodMetrics).toHaveLength(37)
  })

  it('bewertet V4-Fortführung pro Szenario und zählt diese nie in Modell-KPIs', () => {
    const input = exampleSoftwareProject()
    for (const s of compareBusinessScenarios(input)!) {
      const continuation = illustrativeBalanceContinuation(s.summary.periodMetrics, 6)
      expect(s.summary.periodMetrics.at(-1)!.balanceEur).toBeCloseTo(s.summary.netValueEur)
      if (continuation) expect(continuation.points.at(-1)!.month).toBe(42)
    }
    input.metrics[0]!.annualAmountEur = 10000
    expect(
      compareBusinessScenarios(input)!.every(
        (s) => illustrativeBalanceContinuation(s.summary.periodMetrics, 6) === null,
      ),
    ).toBe(true)
  })

  it('weist ungültige Parameter zurück und verändert die Originaldaten nicht', () => {
    const input = exampleSoftwareProject()
    const before = JSON.stringify(input)
    const invalid = { benefitPercent: Number.NaN, oneTimeCostPercent: 0, benefitDelayMonths: 0 }
    expect(calculateSoftwarePayback(input, invalid).success).toBe(false)
    expect(
      compareBusinessScenarios(input, {
        conservative: invalid,
        optimistic: DEFAULT_SCENARIO_SETTINGS.optimistic,
      }),
    ).toBeNull()
    expect(JSON.stringify(input)).toBe(before)
  })
})
