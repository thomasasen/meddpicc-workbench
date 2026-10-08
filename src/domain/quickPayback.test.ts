import { describe, expect, it } from 'vitest'

import {
  buildQuickPaybackSummary,
  calculateQuickPayback,
  formatMonths,
  parseEuroInput,
  type QuickPaybackInput,
} from './quickPayback'

const standard: QuickPaybackInput = {
  upfrontInvestmentEur: '200.000',
  annualRealizableBenefitEur: '400.000',
  annualIncrementalOperatingCostEur: '0',
}
const run = (overrides: Partial<QuickPaybackInput> = {}) => calculateQuickPayback({ ...standard, ...overrides })

describe('Quick Payback: reine Berechnung und klare Modellgrenzen', () => {
  it('überträgt Lahoutifards 200k/400k-Dimensionsbeispiel auf EUR: 6 Monate', () => {
    const result = run()
    expect(result.kind).toBe('payback')
    if (result.kind !== 'payback') return
    expect(result.annualNetBenefitEur).toBe(400000)
    expect(result.monthlyNetBenefitEur).toBeCloseTo(400000 / 12)
    expect(result.months).toBe(6)
  })

  it('trennt Einmalinvestition und zusätzliche Jahreskosten: 8 Monate', () => {
    const result = run({
      upfrontInvestmentEur: '120.000',
      annualRealizableBenefitEur: '240.000',
      annualIncrementalOperatingCostEur: '60.000',
    })
    expect(result.kind).toBe('payback')
    if (result.kind === 'payback') {
      expect(result.annualNetBenefitEur).toBe(180000)
      expect(result.monthlyNetBenefitEur).toBe(15000)
      expect(result.months).toBe(8)
    }
  })

  it.each([
    ['1 Monat', '10.000', '120.000', 1],
    ['1 Jahr', '120.000', '120.000', 12],
    ['über 12 Monate', '180.000', '120.000', 18],
    ['ein Zwölftel Jahr', '1.000', '12.000', 1],
    ['Dezimalmonate', '13.000', '24.000', 6.5],
  ])('%s ohne Jahres-/Monatsverwechslung', (_, upfront, benefit, expected) => {
    const result = run({ upfrontInvestmentEur: upfront, annualRealizableBenefitEur: benefit })
    expect(result.kind).toBe('payback')
    if (result.kind === 'payback') expect(result.months).toBeCloseTo(expected)
  })

  it('berechnet sehr kleine positive Nettozuflüsse ohne Zwischenrundung', () => {
    const result = run({
      upfrontInvestmentEur: '1',
      annualRealizableBenefitEur: '0,02',
      annualIncrementalOperatingCostEur: '0,01',
    })
    expect(result.kind).toBe('payback')
    if (result.kind === 'payback') expect(result.months).toBeCloseTo(1200)
  })

  it.each([
    ['400.000', '400.000'],
    ['200.000', '400.000'],
  ])('bei Bruttonutzen %s und Kosten %s keinen Payback', (benefit, costs) => {
    const result = run({ annualRealizableBenefitEur: benefit, annualIncrementalOperatingCostEur: costs })
    expect(result.kind).toBe('no-payback')
    if (result.kind === 'no-payback') {
      expect(result.months).toBeNull()
      expect(Number.isFinite(result.annualNetBenefitEur)).toBe(true)
    }
  })

  it('unterscheidet 0 Anfangsinvestition mit und ohne positiven Nutzen', () => {
    const positive = run({ upfrontInvestmentEur: '0' })
    expect(positive.kind).toBe('zero-investment')
    if (positive.kind === 'zero-investment') expect(positive.months).toBe(0)
    expect(run({ upfrontInvestmentEur: '0', annualRealizableBenefitEur: '0' }).kind).toBe('no-financial-gain')
    expect(
      run({ upfrontInvestmentEur: '0', annualRealizableBenefitEur: '0', annualIncrementalOperatingCostEur: '1' }).kind,
    ).toBe('no-financial-gain')
  })

  it('zeigt ohne vollständige Eingaben keine erfundene Kennzahl', () => {
    expect(run({ annualRealizableBenefitEur: '' }).kind).toBe('empty')
    expect(run({ upfrontInvestmentEur: ' ' }).kind).toBe('empty')
  })

  it.each(['-1', '1,234', '1.23', '1 000', 'Infinity', 'NaN', '1e9', '1000000000001', '1.234.56', 'abc'])(
    'weist ungültige Eingabe %s feldgenau zurück',
    (value) => {
      const result = run({ upfrontInvestmentEur: value })
      expect(result.kind).toBe('invalid')
      if (result.kind === 'invalid') expect(result.issues.upfrontInvestmentEur).toContain('Anfangsinvestition')
    },
  )

  it('parst dezimalkomma und deutsche Tausendertrennung eindeutig', () => {
    expect(parseEuroInput(' 1.234.567,89 ')).toBe(1234567.89)
    expect(parseEuroInput('1234,50')).toBe(1234.5)
    expect(parseEuroInput('0')).toBe(0)
    expect(parseEuroInput('1.000')).toBe(1000)
    expect(parseEuroInput('1,2')).toBe(1.2)
    expect(parseEuroInput('1234.56')).toBeNull()
  })

  it('kopiert ausschließlich berechnete Zahlen und nie eine garantierte ROI-Aussage', () => {
    const result = run({
      upfrontInvestmentEur: '120.000',
      annualRealizableBenefitEur: '240.000',
      annualIncrementalOperatingCostEur: '60.000',
    })
    if (result.kind !== 'payback') throw new Error('Referenzberechnung fehlgeschlagen')
    const text = buildQuickPaybackSummary(result)
    expect(text).toContain('8,0 Monate')
    expect(text).toContain('180.000,00')
    expect(text).toContain('15.000,00')
    expect(text).toContain('Modellrechnung / Schätzung')
    expect(text).not.toMatch(/ROI|garantiert|bestätigt|Freigabe/)
    expect(text).toContain('kundenseitig zu validieren')
    expect(formatMonths(0.01)).toBe('unter 0,1')
  })
})
