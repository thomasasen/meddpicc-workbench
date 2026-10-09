import {
  annualMetricPotential,
  calculateSoftwarePayback,
  type CustomerMetric,
  type SoftwareCost,
  type SoftwarePaybackInput,
} from './softwarePayback'

export interface CaseSummary {
  horizon: number
  investmentEur: number
  operatingCostsEur: number
  avoidedLegacyEur: number
  creditedMetricsEur: number
  benefitEur: number
  totalCostEur: number
  netValueEur: number
  roiPercent: number | null
  firstBreakEvenMonth: number | null
  sustainedBreakEvenMonth: number | null
  lowestMonth: number
  lowestBalanceEur: number
  periodMetrics: Array<{ month: number; costEur: number; benefitEur: number; balanceEur: number }>
  metricDetails: Array<{
    id: string
    name: string
    formula: string
    annualEur: number | null
    included: boolean
    evidence: string
    evidenceNote: string
    startMonth: number
    rampMonths: number
    endMonth?: number
    group: string
  }>
  costDetails: SoftwareCost[]
  unverified: number
  issues: string[]
}

/** Undiskontierter ROI über den gewählten Horizont: (Nutzen - Neuprojektkosten) / Neuprojektkosten.
 * Vermiedene Bestandskosten zählen als Nutzen, nicht gleichzeitig als Minderung des Nenners.
 * Keine Rendite p.a., kein Kapitalwert, keine Zahlungsstrom-/Steuerrechnung.
 */
export function horizonRoiPercent(costEur: number, benefitEur: number): number | null {
  if (!Number.isFinite(costEur) || costEur <= 0 || !Number.isFinite(benefitEur)) return null
  return ((benefitEur - costEur) / costEur) * 100
}

export function summarizeBusinessCase(input: SoftwarePaybackInput): CaseSummary | null {
  const result = calculateSoftwarePayback(input)
  if (!result.success) return null
  const last = result.months.at(-1)!
  const lowest = result.months.reduce((a, b) => (b.cumulativeEur < a.cumulativeEur ? b : a))
  const covered = new Set(result.countedMetrics.map((m) => m.id))
  const investment = input.costs.filter((c) => c.kind === 'one-time').reduce((sum, c) => sum + c.amountEur, 0)
  const benefit = result.benefitTotalEur
  const op = result.costTotalEur - investment
  return {
    horizon: input.horizonMonths,
    investmentEur: investment,
    operatingCostsEur: op,
    avoidedLegacyEur: result.months.reduce((sum, m) => sum + m.avoidedLegacyEur, 0),
    creditedMetricsEur: result.months.reduce((sum, m) => sum + m.metricBenefitEur, 0),
    benefitEur: benefit,
    totalCostEur: result.costTotalEur,
    netValueEur: last.cumulativeEur,
    roiPercent: horizonRoiPercent(result.costTotalEur, benefit),
    firstBreakEvenMonth: result.firstBreakEvenMonth,
    sustainedBreakEvenMonth: result.sustainedBreakEvenMonth,
    lowestMonth: lowest.month,
    lowestBalanceEur: lowest.cumulativeEur,
    periodMetrics: result.months.map((m) => ({
      month: m.month,
      costEur: m.newCostEur,
      benefitEur: m.totalBenefitEur,
      balanceEur: m.cumulativeEur,
    })),
    metricDetails: input.metrics.map((m: CustomerMetric) => ({
      id: m.id,
      name: m.name,
      formula: m.formula,
      annualEur: annualMetricPotential(m),
      included: covered.has(m.id),
      evidence: m.evidence,
      evidenceNote: m.evidenceNote,
      startMonth: m.startMonth,
      rampMonths: m.rampMonths,
      endMonth: m.endMonth,
      group: m.effectGroup,
    })),
    costDetails: input.costs.map((c) => ({ ...c })),
    unverified: result.unresolvedAssumptions,
    issues: [
      'Es handelt sich um einen undiskontierten, zeitlich begrenzten wirtschaftlichen ROI – nicht um eine jährliche Kapitalrendite.',
      'Jährliche Gebühren werden im wirtschaftlichen Monatsmodell gleichmäßig verteilt; konkrete Vorauszahlungen und Liquidität sind nicht modelliert.',
      'Eine als geprüft markierte Metric ist nur eine Nutzeraussage. Es liegt dadurch keine externe Prüfung vor.',
      'Kapazitätsgewinne und Risikowerte ohne belastbare realisierbare EUR-Wirkung werden nicht angerechnet.',
    ],
  }
}

export function economicInterpretation(c: CaseSummary): string {
  const when =
    c.sustainedBreakEvenMonth === null
      ? 'Innerhalb von ' + c.horizon + ' Monaten wird keine anhaltende Amortisation erreicht.'
      : 'Die Modellrechnung erreicht den bis zum Betrachtungsende anhaltenden Break-even im Monat ' +
        c.sustainedBreakEvenMonth +
        '.'
  const status =
    c.unverified > 0
      ? c.unverified + ' eingerechnete Kunden-Metric(s) sind nicht als kundenseitig geprüft gekennzeichnet.'
      : 'Alle eingerechneten Metrics sind laut Nutzereingabe kundenseitig geprüft; keine externe Verifikation.'
  return (
    when +
    ' Der kumulierte Nettoeffekt wird aus realisierten wirtschaftlichen Vorteilen und Projektkosten abgeleitet. ' +
    status
  )
}
