import { describe, expect, it } from 'vitest'
import { calculateCostOfDelay, costOfDelayDemos, emptyCostOfDelayInput, type CostOfDelayInput } from './costOfDelay'

function calc(input: CostOfDelayInput, delays = [0, 3, 6, 12]) {
  const result = calculateCostOfDelay(input, delays)
  expect(result.success).toBe(true)
  if (!result.success) throw new Error(result.issues.join(' '))
  return result
}
const complete = (): CostOfDelayInput => ({
  ...emptyCostOfDelayInput(),
  annualBenefitEur: 120000,
  financialTreatment: 'realized',
  effectGroup: 'test-metric',
  source: 'Synthetischer Testwert',
  projectOnceEur: 0,
  legacyMonthlyEur: 0,
  extraCostPerMonthEur: 0,
})
describe('Cost of Delay: gleichbleibender Kalenderhorizont', () => {
  it('Monat 0 wird identisch behandelt und kostet nichts', () => {
    const r = calc(complete())
    expect(r.scenarios[0]?.benefitDifferenceEur).toBe(0)
    expect(r.scenarios[0]?.netDifferenceEur).toBe(0)
  })
  it('3/6/12 Monate ohne Ramp-up: je 10.000 EUR je Verzögerungsmonat', () => {
    const r = calc(complete())
    expect(r.scenarios.map((s) => s.delayMonths)).toEqual([0, 3, 6, 12])
    expect(r.scenarios.map((s) => s.benefitDifferenceEur)).toEqual([0, 30000, 60000, 120000])
  })
  it('Ramp-up wird monatlich und nicht per Pauschalmultiplikation berücksichtigt', () => {
    const input = { ...complete(), benefitStartMonth: 4, rampMonths: 3, horizonMonths: 36 as const }
    const r = calc(input, [3])
    expect(r.scenarios[1]?.baseBenefitEur).toBeCloseTo(320000, 5)
    expect(r.scenarios[1]?.delayedBenefitEur).toBeCloseTo(290000, 5)
    expect(r.scenarios[1]?.benefitDifferenceEur).toBeCloseTo(30000, 5)
    expect(r.scenarios[1]?.months[4]?.baseBenefitEur).toBeCloseTo(10000 / 3)
  })
  it('Einmaliger Effekt fällt nur im Startmonat an, nicht 12 mal', () => {
    const input = { ...complete(), benefitKind: 'one-time' as const, annualBenefitEur: 50000 }
    const r = calc(input, [3, 50])
    expect(r.scenarios[1]?.benefitDifferenceEur).toBe(0)
    expect(r.scenarios[2]?.benefitDifferenceEur).toBe(50000)
  })
  it('Später Nutzenstart nach Horizont und lange Verzögerung', () => {
    const r = calc({ ...complete(), benefitStartMonth: 35 }, [12, 100])
    expect(r.scenarios[1]?.benefitDifferenceEur).toBe(20000)
    expect(r.scenarios[2]?.delayedBenefitEur).toBe(0)
  })
  it('Verschobener Endtermin erlaubt vollständiges Nachholen innerhalb des Horizonts', () => {
    const r = calc({ ...complete(), benefitEndMonth: 6 }, [3])
    expect(r.scenarios[1]?.benefitDifferenceEur).toBe(0)
    expect(r.scenarios[1]?.irreversibleBenefitEur).toBeNull()
  })
  it('Ein festes Wirkungsende führt zu modelliert unwiederbringlichem Nutzen', () => {
    const r = calc({ ...complete(), benefitEndMonth: 6, expiry: 'fixed' }, [3])
    expect(r.scenarios[1]?.benefitDifferenceEur).toBe(30000)
    expect(r.scenarios[1]?.irreversibleBenefitEur).toBe(30000)
  })
  it('Abschaltung kann verschoben werden, ohne Kundennutzen doppelt anzurechnen', () => {
    const r = calc({ ...complete(), legacyMonthlyEur: 2000, legacyStartMonth: 4, legacyEffectGroup: 'alt' }, [3])
    expect(r.scenarios[1]?.legacyDifferenceEur).toBe(6000)
    expect(r.scenarios[1]?.netDifferenceEur).toBe(36000)
  })
  it('Unabhängige Altsystemabschaltung bleibt im ursprünglichen Monat', () => {
    const r = calc({
      ...complete(), legacyMonthlyEur: 2000, legacyStartMonth: 4,
      legacyMovesWithProject: false, legacyEffectGroup: 'alt',
    }, [3])
    expect(r.scenarios[1]?.legacyDifferenceEur).toBe(0)
  })
  it('Später anfallende Projektkosten senken nur die Horizontdifferenz und werden separat gezeigt', () => {
    const r = calc({ ...complete(), projectOnceEur: 15000, projectCostMonth: 35 }, [3])
    expect(r.scenarios[1]?.deferredProjectCostEur).toBe(15000)
    expect(r.scenarios[1]?.netDifferenceEur).toBe(15000)
  })
  it('Projektkosten mit festem Termin werden nicht blind verschoben', () => {
    const r = calc({ ...complete(), projectOnceEur: 15000, projectCostsMove: false }, [3])
    expect(r.scenarios[1]?.deferredProjectCostEur).toBe(0)
  })
  it('Zusatzkosten werden nur mit Quelle angenommen', () => {
    const input = { ...complete(), extraCostPerMonthEur: 1000, extraCostSource: 'Geprüfte Vertragsklausel' }
    const r = calc(input, [3])
    expect(r.scenarios[1]?.additionalDelayCostEur).toBe(3000)
    expect(r.scenarios[1]?.netDifferenceEur).toBe(33000)
  })
  it('Fehlende Kosten führen nicht zu fiktiver Netto-Präzision', () => {
    const r = calc({ ...complete(), projectOnceEur: null }, [3])
    expect(r.scenarios[1]?.netDifferenceEur).toBeNull()
  })
  it('Kapazitätsgewinn und offene Wirkung erzeugen keine EUR-Zahl', () => {
    const r = calc(costOfDelayDemos.capacity)
    expect(r.scenarios).toEqual([])
  })
  it('Negative Nutzenwerte, NaN, Infinity und fehlende Zahlen werden verworfen', () => {
    for (const amount of [-1, Number.NaN, Number.POSITIVE_INFINITY, null, 1e13]) {
      const r = calculateCostOfDelay({ ...complete(), annualBenefitEur: amount })
      expect(r.success).toBe(false)
    }
  })
  it('Null-Nutzen bleibt als Null erkennbar', () => {
    const r = calc({ ...complete(), annualBenefitEur: 0 }, [12])
    expect(r.scenarios[1]?.benefitDifferenceEur).toBe(0)
  })
  it('Doppelte Wirkungsgruppe blockiert eine Addition', () => {
    const r = calculateCostOfDelay({
      ...complete(), legacyMonthlyEur: 500, legacyEffectGroup: 'test-metric',
    })
    expect(r.success).toBe(false)
  })
  it('Extreme aber valide Werte werden ohne Infinity berechnet', () => {
    const r = calc({ ...complete(), annualBenefitEur: 1e12 }, [6])
    expect(r.scenarios[1]?.benefitDifferenceEur).toBeCloseTo(5e11, 1)
  })
  it('Leere Eingaben ergeben einen ausdrücklich offenen Zustand', () => {
    const r = calc(emptyCostOfDelayInput())
    expect(r.scenarios).toEqual([])
    expect(r.questions.length).toBeGreaterThan(1)
  })
  it('Benutzerdefinierte Dauer außerhalb des Horizonts bleibt erlaubt', () => {
    const r = calc(complete(), [120])
    expect(r.scenarios[1]?.delayMonths).toBe(120)
    expect(r.scenarios[1]?.delayedBenefitEur).toBe(0)
  })
})
