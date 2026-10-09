import { describe, expect, it } from 'vitest'
import { buildMetric, emptyMetricDraft, metricDemos, metricSummary, type MetricBuilderDraft } from './metricBuilder'
import { annualMetricPotential, calculateSoftwarePayback } from './softwarePayback'

function example(key: string, overrides: Partial<MetricBuilderDraft> = {}): MetricBuilderDraft {
  return { ...emptyMetricDraft(), ...metricDemos[key], ...overrides }
}

describe('Metric Builder: nachvollziehbare operative und wirtschaftliche Wirkung', () => {
  it('bewertet 25.000 × 4 Min × 55 EUR als Kapazität ohne finanzielle Anrechnung', () => {
    const result = buildMetric(example('crm'))
    expect(result.complete).toBe(true)
    expect(result.potentialEur).toBeCloseTo(91666.6667, 3)
    expect(result.realizedEur).toBeNull()
    expect(result.metric?.treatment).toBe('capacity')
    expect(result.transfer).toHaveLength(1)
    expect(result.transfer[0]?.included).toBe(false)
    expect(annualMetricPotential(result.metric!)).toBeCloseTo(result.potentialEur!, 5)
    const payback = calculateSoftwarePayback({ horizonMonths: 36, costs: [], metrics: result.transfer })
    expect(payback.success).toBe(true)
    if (payback.success) {
      expect(payback.benefitTotalEur).toBe(0)
      expect(payback.nonMonetized).toHaveLength(1)
    }
  })

  it('weist vermiedene externe Prozesskosten als wirtschaftlich realisierbar aus, rechnet sie aber nicht automatisch an', () => {
    const result = buildMetric(example('service'))
    expect(result.complete).toBe(true)
    expect(result.potentialEur).toBe(60000)
    expect(result.realizedEur).toBe(60000)
    expect(result.transfer).toHaveLength(1)
    expect(result.transfer[0]?.treatment).toBe('realized')
    expect(result.transfer[0]?.included).toBe(false)
  })

  it('berechnet Conversion auf Deckungsbeitrag, nicht auf Umsatz', () => {
    const result = buildMetric(example('sales'))
    expect(result.potentialEur).toBe(192000)
    expect(result.realizedEur).toBe(192000)
    expect(result.transfer[0]?.formula).toBe('conversion')
  })

  it('berechnet vermeidbare Fehlerkosten aus der Differenz in Prozentpunkten', () => {
    const result = buildMetric(example('quality'))
    expect(result.potentialEur).toBe(32000)
    expect(result.realizedEur).toBe(32000)
  })

  it('monetarisiert Risikoreduktionen auch bei Zahlenwerten nicht', () => {
    const result = buildMetric(example('risk'))
    expect(result.complete).toBe(true)
    expect(result.potentialEur).toBeNull()
    expect(result.realizedEur).toBeNull()
    expect(result.transfer[0]?.treatment).toBe('risk')
    expect(result.calculation).toContain('keine EUR-Bewertung')
  })

  it('kann qualitative Veränderungen ohne fiktive EUR-Beträge darstellen', () => {
    const result = buildMetric(
      example('crm', {
        formula: 'qualitative',
        beforeText: 'Informationen verstreut',
        afterText: 'Eine zentrale Sicht',
      }),
    )
    expect(result.complete).toBe(true)
    expect(result.potentialEur).toBeNull()
    expect(result.transfer[0]?.included).toBe(false)
    expect(result.transfer[0]?.treatment).toBe('nonfinancial')
  })

  it('normalisiert monatliche Mengen und direkte Monatskosten auf Jahreswerte', () => {
    const monthly = buildMetric(
      example('crm', { period: 'monthly', volume: 100, before: 12, after: 8, hourlyCost: 60 }),
    )
    expect(monthly.potentialEur).toBe(4800)
    const direct = buildMetric(
      example('crm', {
        formula: 'direct',
        period: 'monthly',
        before: 5000,
        after: 4000,
      }),
    )
    expect(direct.potentialEur).toBe(12000)
  })

  it('fragt gezielt nach fehlenden Angaben statt Null als vorhandene Menge zu interpretieren', () => {
    const result = buildMetric(example('crm', { before: '', after: '' }))
    expect(result.complete).toBe(false)
    expect(result.potentialEur).toBeNull()
    expect(result.questions).toContain('Welcher Zielwert ist unter realistischen Bedingungen erreichbar?')
    expect(result.issues).toContain('Ausgangswert: Bitte eine gültige Zahl von 0 bis 1 Billion eingeben.')
  })

  it('weist Nullverbesserung, Verschlechterung und unrealistische Prozentwerte zurück', () => {
    expect(buildMetric(example('crm', { after: 12 })).complete).toBe(false)
    expect(buildMetric(example('crm', { after: 13 })).issues.join(' ')).toContain('Verschlechterung')
    expect(buildMetric(example('sales', { before: 150 })).issues.join(' ')).toContain('Prozentwerte')
    expect(buildMetric(example('quality', { after: 150 })).complete).toBe(false)
  })

  it('weist negative, NaN, Infinity und Milliarden-Überläufe zurück', () => {
    expect(buildMetric(example('crm', { volume: -5 })).complete).toBe(false)
    expect(buildMetric(example('crm', { hourlyCost: NaN })).complete).toBe(false)
    expect(buildMetric(example('crm', { before: Infinity })).complete).toBe(false)
    expect(buildMetric(example('sales', { volume: 1e12, valuePerEvent: 1e12 })).complete).toBe(false)
  })

  it('erfordert Mechanismus, Betrag, Einordnung und eine konkrete Erklärung', () => {
    expect(buildMetric(example('service', { realizationNote: '' })).complete).toBe(false)
    expect(buildMetric(example('service', { effectGroup: '' })).complete).toBe(false)
    expect(buildMetric(example('service', { realizedAnnual: 60001 })).complete).toBe(false)
    expect(buildMetric(example('sales', { mechanism: 'avoidable-cost' })).complete).toBe(false)
    expect(buildMetric(example('risk', { mechanism: 'avoidable-cost' })).complete).toBe(false)
  })

  it('übernimmt bei Teilrealisierung nur den konkreten EUR-Anteil als getrennte, nicht aktivierte Position', () => {
    const result = buildMetric(
      example('crm', {
        mechanism: 'avoided-external',
        realizedAnnual: 15000,
        realizationNote: 'Die externe Sachbearbeitung sinkt um 15.000 EUR jährlich.',
      }),
    )
    expect(result.complete).toBe(true)
    expect(result.transfer).toHaveLength(2)
    expect(result.transfer[0]?.formula).toBe('time')
    expect(result.transfer[0]?.treatment).toBe('capacity')
    expect(result.transfer[1]?.formula).toBe('direct')
    expect(result.transfer[1]?.annualAmountEur).toBe(15000)
    expect(result.transfer.every((m) => m.included === false)).toBe(true)
    expect(result.transfer[0]?.effectGroup).toBe(result.transfer[1]?.effectGroup)
  })

  it('erfindet aus M1-Referenzen keine kundenseitig geprüfte M2', () => {
    const result = buildMetric(example('crm', { evidence: 'reference' }))
    expect(result.metric?.evidence).toBe('reference')
    expect(result.questions.join(' ')).toContain('Referenzwert')
    expect(result.metric?.included).toBe(false)
    expect(metricSummary(example('crm', { evidence: 'reference' }), result)).toContain('Referenzwert')
  })

  it('verlangt bei explizit ausgewählter Kundenprüfung dokumentierte Annahmen', () => {
    expect(buildMetric(example('crm', { evidence: 'customer-reviewed', assumptionNote: '' })).complete).toBe(false)
    const reviewed = buildMetric(
      example('crm', { evidence: 'customer-reviewed', assumptionNote: 'Mit Serviceleiter geprüft.' }),
    )
    expect(reviewed.complete).toBe(true)
    expect(reviewed.metric?.evidence).toBe('customer-reviewed')
  })

  it('verhindert nach manueller Aktivierung doppelte wirtschaftliche Wirkungen über die bestehende Engine', () => {
    const r = buildMetric(
      example('crm', {
        mechanism: 'avoided-external',
        realizedAnnual: 15000,
        realizationNote: 'Eine konkrete externe Dienstleisterrechnung entfällt.',
      }),
    )
    const doubles = r.transfer.map((m) => ({ ...m, treatment: 'realized' as const, included: true }))
    const calc = calculateSoftwarePayback({ horizonMonths: 36, costs: [], metrics: doubles })
    expect(calc.success).toBe(false)
    if (!calc.success) expect(calc.issues.join(' ')).toContain('Doppelzählung')
  })

  it('validiert Startmonat und Ramp-up ohne den Payback-Berechnungsweg zu verändern', () => {
    expect(buildMetric(example('crm', { startMonth: 0 })).complete).toBe(false)
    expect(buildMetric(example('crm', { rampMonths: 0 })).complete).toBe(false)
    expect(buildMetric(example('crm', { startMonth: 60, rampMonths: 2 })).complete).toBe(false)
  })
})
