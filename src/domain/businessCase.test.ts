import { describe, expect, it } from 'vitest'
import { createCrmSaasDemo } from '../data/softwarePaybackDemo'
import { exampleSoftwareProject } from './softwarePayback'
import { economicInterpretation, horizonRoiPercent, summarizeBusinessCase } from './businessCase'

describe('Business-Case-Reporting – konservativer ROI', () => {
  it('definiert den undiskontierten Horizon-ROI und schließt Nullkosten aus', () => {
    expect(horizonRoiPercent(100, 125)).toBe(25)
    expect(horizonRoiPercent(100, 75)).toBe(-25)
    expect(horizonRoiPercent(0, 250)).toBeNull()
    expect(horizonRoiPercent(Number.NaN, 12)).toBeNull()
  })
  it('stimmt wirtschaftlich exakt mit der bestehenden Monatsengine überein', () => {
    const c = summarizeBusinessCase(exampleSoftwareProject())!
    expect(c.investmentEur).toBe(120000)
    expect(c.totalCostEur).toBe(228000)
    expect(c.benefitEur).toBe(450000)
    expect(c.netValueEur).toBe(222000)
    expect(c.roiPercent).toBeCloseTo(222000 / 228000 * 100)
    expect(c.sustainedBreakEvenMonth).toBe(18)
    expect(c.lowestMonth).toBe(6)
  })
  it('zeigt getrennte nicht monetarisierte Metriken und nicht bestätigte Quelle im CRM-Demo', () => {
    const c = summarizeBusinessCase(createCrmSaasDemo())!
    expect(c.sustainedBreakEvenMonth).toBe(35)
    expect(c.netValueEur).toBeCloseTo(42583.33333, 2)
    expect(c.totalCostEur).toBe(768000)
    expect(c.benefitEur).toBeCloseTo(c.netValueEur + c.totalCostEur)
    expect(c.metricDetails.filter(m => m.included)).toHaveLength(3)
    expect(c.metricDetails.filter(m => !m.included)).toHaveLength(2)
    expect(c.unverified).toBe(3)
    expect(economicInterpretation(c)).toContain('nicht als kundenseitig geprüft')
  })
  it('verhindert irreführenden ROI in gesperrten oder invaliden Modellen', () => {
    const input = exampleSoftwareProject()
    input.metrics[0]!.evidenceNote = ''
    expect(summarizeBusinessCase(input)).toBeNull()
  })
  it('lässt nicht profitable Projekte und fehlende Amortisation im PDF-Datensatz', () => {
    const input = exampleSoftwareProject()
    input.metrics[0]!.annualAmountEur = 10000
    const c = summarizeBusinessCase(input)!
    expect(c.roiPercent).toBeLessThan(0)
    expect(c.sustainedBreakEvenMonth).toBeNull()
    expect(economicInterpretation(c)).toContain('keine anhaltende Amortisation')
  })
})
