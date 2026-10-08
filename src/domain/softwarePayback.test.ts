import { describe, expect, it } from 'vitest'
import {
  annualMetricPotential,
  calculateSoftwarePayback,
  exampleSoftwareProject,
  newMetric,
  type SoftwarePaybackInput,
  type SoftwareCost,
} from './softwarePayback'

const calculate = (input: SoftwarePaybackInput) => {
  const result = calculateSoftwarePayback(input)
  if (!result.success) throw new Error('Unerwartete Validierung: ' + result.issues.join('; '))
  return result
}
const setup = (amountEur: number, startMonth = 0): SoftwareCost => ({
  id: 'setup',
  name: 'Projekt',
  kind: 'one-time',
  amountEur,
  period: 'monthly',
  startMonth,
})
const saas = (amountEur: number, startMonth = 1): SoftwareCost => ({
  id: 'saas',
  name: 'SaaS',
  kind: 'saas',
  amountEur,
  period: 'monthly',
  startMonth,
})

describe('Monatliche Softwarewirtschaftlichkeit', () => {
  it('berechnet das fiktive Softwareprojekt mit 6 Monaten Implementierung auf 18 statt 10 Monate', () => {
    const result = calculate(exampleSoftwareProject())
    expect(result.months[0]!.cumulativeEur).toBe(-120000)
    expect(result.months[6]!.cumulativeEur).toBe(-138000)
    expect(result.months[7]!.netEur).toBe(12000)
    expect(result.months[18]!.cumulativeEur).toBe(6000)
    expect(result.firstBreakEvenMonth).toBe(18)
    expect(result.sustainedBreakEvenMonth).toBe(18)
    expect(result.unresolvedAssumptions).toBe(1)
  })

  it('behandelt jährliche Gebühren als monatliche wirtschaftliche Kosten, nicht als jährlichen Cash-Abfluss', () => {
    const input = exampleSoftwareProject()
    input.costs[1]!.amountEur = 36000
    input.costs[1]!.period = 'annual'
    const result = calculate(input)
    expect(result.months[1]!.newCostEur).toBe(3000)
    expect(result.firstBreakEvenMonth).toBe(18)
  })

  it('erfasst gestaffelte Lizenzen, verzögerte Einmalkosten und Parallelbetrieb', () => {
    const input = exampleSoftwareProject()
    input.costs.push({
      id: 'next',
      name: 'Lizenzstufe',
      kind: 'saas',
      amountEur: 2000,
      period: 'monthly',
      startMonth: 13,
    })
    input.costs.push({
      id: 'migration',
      name: 'Migration',
      kind: 'one-time',
      amountEur: 10000,
      period: 'monthly',
      startMonth: 3,
    })
    const result = calculate(input)
    expect(result.months[3]!.newCostEur).toBe(13000)
    expect(result.months[13]!.newCostEur).toBe(5000)
    expect(result.months[18]!.cumulativeEur).toBe(-16000)
  })

  it('vergütet Abschaltung des Altsystems erst ab tatsächlichem Kündigungsmonat', () => {
    const input = exampleSoftwareProject()
    input.costs.push({
      id: 'legacy',
      name: 'Abgelöstes CRM',
      kind: 'avoided-legacy',
      amountEur: 2000,
      period: 'monthly',
      startMonth: 9,
      effectGroup: 'alte-lizenzen',
    })
    const result = calculate(input)
    expect(result.months[8]!.avoidedLegacyEur).toBe(0)
    expect(result.months[9]!.avoidedLegacyEur).toBe(2000)
  })

  it('berechnet monatliches Ramp-up und befristeten Nutzen korrekt', () => {
    const input = exampleSoftwareProject()
    input.metrics[0]!.rampMonths = 3
    input.metrics[0]!.endMonth = 9
    const result = calculate(input)
    expect(result.months[7]!.metricBenefitEur).toBeCloseTo(5000)
    expect(result.months[8]!.metricBenefitEur).toBeCloseTo(10000)
    expect(result.months[9]!.metricBenefitEur).toBeCloseTo(15000)
    expect(result.months[10]!.metricBenefitEur).toBe(0)
  })

  it('verwendet denselben Baustein für direkte, Prozess-, Zeit-, Conversion- und Fehlermetrics', () => {
    const a = newMetric('a', 'process')
    Object.assign(a, { annualVolume: 20000, before: 7, after: 4 })
    expect(annualMetricPotential(a)).toBe(60000)
    const b = newMetric('b', 'time')
    Object.assign(b, { annualVolume: 25000, before: 12, after: 8, hourlyCostEur: 55 })
    expect(annualMetricPotential(b)).toBeCloseTo(91666.666667)
    const c = newMetric('c', 'conversion')
    Object.assign(c, { annualVolume: 1000, before: 20, after: 25, valuePerEventEur: 1000 })
    expect(annualMetricPotential(c)).toBeCloseTo(50000)
    const d = newMetric('d', 'quality')
    Object.assign(d, { annualVolume: 20000, before: 5, after: 2, valuePerEventEur: 80 })
    expect(annualMetricPotential(d)).toBeCloseTo(48000)
    expect(annualMetricPotential(newMetric('e', 'qualitative'))).toBeNull()
  })

  it('rechnet reine Arbeitszeiteinsparung ohne belegte wirtschaftliche Realisierung nicht an', () => {
    const input = exampleSoftwareProject()
    const m = newMetric('time', 'time')
    Object.assign(m, {
      name: 'Kapazität',
      included: true,
      annualVolume: 25000,
      before: 12,
      after: 8,
      hourlyCostEur: 55,
      evidenceNote: 'Mehr Kapazität, aber keine vermiedene Ausgabe.',
    })
    input.metrics = [m]
    const result = calculate(input)
    expect(result.months[7]!.metricBenefitEur).toBe(0)
    expect(result.nonMonetized).toHaveLength(1)
    expect(result.nonMonetized[0]!.reason).toContain('Kapazitätsgewinn')
  })

  it('schließt quantitative Risiko-Erwartungswerte aus der konservativen Basis aus', () => {
    const input = exampleSoftwareProject()
    const risk = newMetric('risk', 'risk')
    Object.assign(risk, { included: true, annualAmountEur: 600000, name: 'Risikovermeidung' })
    input.metrics = [risk]
    const result = calculate(input)
    expect(result.months[18]!.metricBenefitEur).toBe(0)
    expect(result.nonMonetized[0]!.reason).toContain('Risiko')
  })

  it('verhindert Doppelzählung für zwei Metrics derselben Wirkungsgruppe', () => {
    const input = exampleSoftwareProject()
    input.metrics.push({ ...input.metrics[0]!, id: 'double', name: 'Bearbeitungskosten' })
    const result = calculateSoftwarePayback(input)
    expect(result.success).toBe(false)
    if (!result.success) expect(result.issues.join(' ')).toContain('Doppelzählung')
  })

  it('verhindert Doppelzählung zwischen Altsystemersparnis und Metric', () => {
    const input = exampleSoftwareProject()
    input.costs.push({
      id: 'legacy',
      name: 'Altsystem',
      kind: 'avoided-legacy',
      amountEur: 1000,
      period: 'monthly',
      startMonth: 7,
      effectGroup: 'crm-gesamtwert',
    })
    const result = calculateSoftwarePayback(input)
    expect(result.success).toBe(false)
    if (!result.success) expect(result.issues.join(' ')).toContain('Doppelzählung')
  })

  it('lässt keine anrechenbare Metric ohne Realisierungsbegründung zu', () => {
    const input = exampleSoftwareProject()
    input.metrics[0]!.evidenceNote = ''
    const result = calculateSoftwarePayback(input)
    expect(result.success).toBe(false)
    if (!result.success) expect(result.issues.join(' ')).toContain('Realisierung')
  })

  it('weist unplausible Werte, negative Nettoeffekte und ungültige Starts zurück', () => {
    const input = exampleSoftwareProject()
    input.metrics[0]!.annualAmountEur = Number.NaN
    input.costs[1]!.startMonth = -1
    const result = calculateSoftwarePayback(input)
    expect(result.success).toBe(false)
    if (!result.success) expect(result.issues.length).toBeGreaterThanOrEqual(2)
  })

  it('meldet korrekt keine Amortisation bei nur Kosten', () => {
    const result = calculate({ horizonMonths: 36, costs: [setup(120000), saas(2000)], metrics: [] })
    expect(result.firstBreakEvenMonth).toBeNull()
    expect(result.sustainedBreakEvenMonth).toBeNull()
    expect(result.cumulativeEur).toBeLessThan(0)
  })

  it('unterscheidet erste und über Horizont stabile Amortisation bei Kostenanstieg', () => {
    const input = exampleSoftwareProject()
    input.costs.push({
      id: 'renewal',
      name: 'Zusätzlicher Projektaufwand',
      kind: 'one-time',
      amountEur: 250000,
      period: 'monthly',
      startMonth: 20,
    })
    const result = calculate(input)
    expect(result.firstBreakEvenMonth).toBe(18)
    expect(result.months[20]!.cumulativeEur).toBeLessThan(0)
    expect(result.sustainedBreakEvenMonth).toBeGreaterThan(20)
  })

  it('macht vermiedene Bestandskosten ab Monat 9 sichtbar, ohne zweite separate Geldersparnis zu erfinden', () => {
    const input = exampleSoftwareProject()
    input.costs.push({
      id: 'legacy',
      name: 'Legacy CRM',
      kind: 'avoided-legacy',
      amountEur: 24000,
      period: 'annual',
      startMonth: 9,
      effectGroup: 'legacy',
    })
    const result = calculate(input)
    expect(result.months[9]!.avoidedLegacyEur).toBe(2000)
    expect(result.benefitTotalEur).toBeGreaterThan(0)
  })

  it('verhindert unendlich lange Horizonte und falsche Prozentformeln', () => {
    const input = exampleSoftwareProject()
    input.metrics[0]!.formula = 'conversion'
    input.metrics[0]!.before = 50
    input.metrics[0]!.after = 250
    const result = calculateSoftwarePayback(input)
    expect(result.success).toBe(false)
    if (!result.success) expect(result.issues.join(' ')).toContain('Prozentwerte')
  })
})
