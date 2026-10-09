export type MetricFormula = 'direct' | 'process' | 'time' | 'conversion' | 'quality' | 'risk' | 'qualitative'
export type MetricTreatment = 'realized' | 'capacity' | 'risk' | 'nonfinancial'
export type MetricEvidence = 'hypothesis' | 'reference' | 'customer-stated' | 'customer-reviewed'
export type CostKind = 'one-time' | 'saas' | 'avoided-legacy'
export type Period = 'monthly' | 'annual'
/** Szenariorechnung verändert keine Originaleingaben. */
export interface ScenarioAdjustments {
  benefitPercent: number
  oneTimeCostPercent: number
  benefitDelayMonths: number
}
export const BASE_ADJUSTMENTS: Readonly<ScenarioAdjustments> = Object.freeze({
  benefitPercent: 0,
  oneTimeCostPercent: 0,
  benefitDelayMonths: 0,
})
export function validScenarioAdjustments(a: ScenarioAdjustments, horizon: number): boolean {
  return (
    Number.isFinite(a.benefitPercent) &&
    a.benefitPercent >= -100 &&
    a.benefitPercent <= 200 &&
    Number.isFinite(a.oneTimeCostPercent) &&
    a.oneTimeCostPercent >= -100 &&
    a.oneTimeCostPercent <= 200 &&
    Number.isInteger(a.benefitDelayMonths) &&
    a.benefitDelayMonths >= 0 &&
    a.benefitDelayMonths <= horizon
  )
}

export interface SoftwareCost {
  id: string
  name: string
  kind: CostKind
  amountEur: number
  period: Period
  startMonth: number
  endMonth?: number
  effectGroup?: string
}

export interface CustomerMetric {
  id: string
  name: string
  formula: MetricFormula
  treatment: MetricTreatment
  evidence: MetricEvidence
  evidenceNote: string
  effectGroup: string
  included: boolean
  annualAmountEur: number
  annualVolume: number
  before: number
  after: number
  hourlyCostEur: number
  valuePerEventEur: number
  startMonth: number
  rampMonths: number
  endMonth?: number
}

export interface SoftwarePaybackInput {
  horizonMonths: 36 | 60
  costs: SoftwareCost[]
  metrics: CustomerMetric[]
}

export interface MonthFlow {
  month: number
  newCostEur: number
  avoidedLegacyEur: number
  metricBenefitEur: number
  totalBenefitEur: number
  netEur: number
  cumulativeEur: number
}

export type SoftwarePaybackResult =
  | { success: false; issues: string[] }
  | {
      success: true
      months: MonthFlow[]
      firstBreakEvenMonth: number | null
      sustainedBreakEvenMonth: number | null
      costTotalEur: number
      benefitTotalEur: number
      cumulativeEur: number
      nonMonetized: { id: string; name: string; annualPotentialEur: number | null; reason: string }[]
      countedMetrics: { id: string; name: string; annualEur: number; evidence: MetricEvidence }[]
      unresolvedAssumptions: number
    }

const MAX_EUR = 1_000_000_000_000
const EPS = 0.00001

function validMoney(value: number): boolean {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= MAX_EUR
}

function validMonth(value: number, max: number): boolean {
  return Number.isInteger(value) && value >= 0 && value <= max
}

function validateCosts(costs: SoftwareCost[], horizon: number, issues: string[]) {
  const ids = new Set<string>()
  for (const [index, cost] of costs.entries()) {
    const where = 'Kostenposition ' + (index + 1)
    if (!cost.id || ids.has(cost.id)) issues.push(where + ': eindeutige ID fehlt.')
    ids.add(cost.id)
    if (!cost.name.trim()) issues.push(where + ': Bezeichnung fehlt.')
    if (!['one-time', 'saas', 'avoided-legacy'].includes(cost.kind)) issues.push(where + ': Kostenart unbekannt.')
    if (!validMoney(cost.amountEur)) issues.push(where + ': Betrag muss zwischen 0 und 1 Billion EUR liegen.')
    if (!['monthly', 'annual'].includes(cost.period)) issues.push(where + ': ungültige Zahlungsperiode.')
    if (!validMonth(cost.startMonth, horizon)) issues.push(where + ': Startmonat ungültig.')
    if (cost.endMonth !== undefined && (!validMonth(cost.endMonth, horizon) || cost.endMonth < cost.startMonth)) {
      issues.push(where + ': Endmonat liegt außerhalb der Laufzeit.')
    }
    if (cost.kind === 'one-time' && cost.endMonth !== undefined)
      issues.push(where + ': einmaliger Aufwand hat keinen Endmonat.')
  }
}

export function annualMetricPotential(metric: CustomerMetric): number | null {
  switch (metric.formula) {
    case 'direct':
    case 'risk':
      return metric.annualAmountEur
    case 'process':
      return metric.annualVolume * (metric.before - metric.after)
    case 'time':
      return ((metric.annualVolume * (metric.before - metric.after)) / 60) * metric.hourlyCostEur
    case 'conversion':
      return ((metric.annualVolume * (metric.after - metric.before)) / 100) * metric.valuePerEventEur
    case 'quality':
      return ((metric.annualVolume * (metric.before - metric.after)) / 100) * metric.valuePerEventEur
    case 'qualitative':
      return null
  }
}

function validateMetrics(metrics: CustomerMetric[], horizon: number, issues: string[]) {
  const ids = new Set<string>()
  for (const [index, metric] of metrics.entries()) {
    const where = 'Metric ' + (index + 1)
    if (!metric.id || ids.has(metric.id)) issues.push(where + ': eindeutige ID fehlt.')
    ids.add(metric.id)
    if (!metric.name.trim()) issues.push(where + ': Bezeichnung fehlt.')
    if (!['direct', 'process', 'time', 'conversion', 'quality', 'risk', 'qualitative'].includes(metric.formula)) {
      issues.push(where + ': Berechnungstyp unbekannt.')
      continue
    }
    if (!['realized', 'capacity', 'risk', 'nonfinancial'].includes(metric.treatment)) {
      issues.push(where + ': wirtschaftliche Einordnung fehlt.')
    }
    if (!['hypothesis', 'reference', 'customer-stated', 'customer-reviewed'].includes(metric.evidence)) {
      issues.push(where + ': Datenherkunft fehlt.')
    }
    if (!validMonth(metric.startMonth, horizon) || metric.startMonth < 1) issues.push(where + ': Nutzenstart ungültig.')
    if (!Number.isInteger(metric.rampMonths) || metric.rampMonths < 1 || metric.rampMonths > horizon) {
      issues.push(where + ': Ramp-up muss zwischen 1 und Laufzeit in Monaten liegen.')
    }
    if (
      metric.endMonth !== undefined &&
      (!validMonth(metric.endMonth, horizon) || metric.endMonth < metric.startMonth)
    ) {
      issues.push(where + ': Nutzenende ungültig.')
    }
    for (const [key, value] of [
      ['Jahresbetrag', metric.annualAmountEur],
      ['Jahresmenge', metric.annualVolume],
      ['Ist-Wert', metric.before],
      ['Ziel-Wert', metric.after],
      ['Stundensatz', metric.hourlyCostEur],
      ['Wert je Vorgang', metric.valuePerEventEur],
    ] as const) {
      if (!validMoney(value)) issues.push(where + ': ' + key + ' ist ungültig.')
    }
    if (metric.formula === 'conversion' && (metric.before > 100 || metric.after > 100)) {
      issues.push(where + ': Conversion-Werte müssen Prozentwerte 0 bis 100 sein.')
    }
    if (metric.formula === 'quality' && (metric.before > 100 || metric.after > 100)) {
      issues.push(where + ': Fehlerquoten müssen Prozentwerte 0 bis 100 sein.')
    }
    const potential = annualMetricPotential(metric)
    if (potential !== null && (!Number.isFinite(potential) || potential < 0 || potential > MAX_EUR)) {
      issues.push(where + ': abgeleiteter Jahreswert ungültig oder negativ.')
    }
    if (metric.included && metric.treatment === 'realized') {
      if (!metric.effectGroup.trim()) issues.push(where + ': Wirkungsgruppe für anrechenbare Effekte fehlt.')
      if (!metric.evidenceNote.trim()) issues.push(where + ': Begründung der wirtschaftlichen Realisierung fehlt.')
      if (metric.formula === 'qualitative' || metric.formula === 'risk') {
        issues.push(where + ': qualitative und Risiko-Metrics dürfen nicht als sichere Einsparung eingerechnet werden.')
      }
    }
  }
}

function euroPerMonth(cost: SoftwareCost): number {
  return cost.period === 'annual' ? cost.amountEur / 12 : cost.amountEur
}

function active(cost: SoftwareCost, month: number): boolean {
  return month >= cost.startMonth && (cost.endMonth === undefined || month <= cost.endMonth)
}

export function calculateSoftwarePayback(
  input: SoftwarePaybackInput,
  adjustments: ScenarioAdjustments = BASE_ADJUSTMENTS,
): SoftwarePaybackResult {
  const issues: string[] = []
  if (!validScenarioAdjustments(adjustments, input.horizonMonths))
    issues.push('Ungültige Szenarioparameter: Prozentwerte -100 bis +200, Nutzenverzögerung innerhalb des Horizonts.')
  if (input.horizonMonths !== 36 && input.horizonMonths !== 60)
    issues.push('Betrachtungshorizont muss 36 oder 60 Monate sein.')
  if (input.costs.length > 100 || input.metrics.length > 100)
    issues.push('Maximal 100 Kostenpositionen und 100 Metrics möglich.')
  if (issues.length) return { success: false, issues }
  validateCosts(input.costs, input.horizonMonths, issues)
  validateMetrics(input.metrics, input.horizonMonths, issues)

  // Eine Wirkungsgruppe darf genau eine angerechnete Ersparnis erzeugen.
  // Auch Altsystem-Abschaltungen sind ein positiver Effekt und gehören in diese Prüfung.
  const groupCount = new Map<string, string[]>()
  for (const metric of input.metrics) {
    if (!metric.included || metric.treatment !== 'realized') continue
    const group = metric.effectGroup.trim().toLocaleLowerCase('de-DE')
    if (group) groupCount.set(group, [...(groupCount.get(group) ?? []), metric.name])
  }
  for (const cost of input.costs) {
    if (cost.kind !== 'avoided-legacy' || cost.amountEur === 0) continue
    const group = (cost.effectGroup ?? '').trim().toLocaleLowerCase('de-DE')
    if (!group) issues.push('Vermiedene Altsystemkosten "' + cost.name + '": Wirkungsgruppe fehlt.')
    else groupCount.set(group, [...(groupCount.get(group) ?? []), cost.name])
  }
  for (const [group, members] of groupCount) {
    if (members.length > 1) {
      issues.push(
        'Mögliche Doppelzählung in Wirkungsgruppe "' +
          group +
          '": ' +
          members.join(', ') +
          '. Bitte nur einen finanziellen Effekt je Wirkungsgruppe anrechnen.',
      )
    }
  }
  if (issues.length) return { success: false, issues }

  const countedMetrics = input.metrics
    .filter((m) => m.included && m.treatment === 'realized' && m.formula !== 'risk' && m.formula !== 'qualitative')
    .map((m) => ({
      id: m.id,
      name: m.name,
      annualEur: (annualMetricPotential(m) ?? 0) * (1 + adjustments.benefitPercent / 100),
      evidence: m.evidence,
    }))
  const includedIds = new Set(countedMetrics.map((m) => m.id))
  const nonMonetized = input.metrics
    .filter((m) => !includedIds.has(m.id))
    .map((m) => ({
      id: m.id,
      name: m.name,
      annualPotentialEur: annualMetricPotential(m),
      reason:
        m.treatment === 'capacity'
          ? 'Kapazitätsgewinn ist kein belegter Geldzufluss.'
          : m.treatment === 'risk' || m.formula === 'risk'
            ? 'Risikoannahmen bleiben außerhalb der konservativen Basisrechnung.'
            : m.formula === 'qualitative' || m.treatment === 'nonfinancial'
              ? 'Operative Metric ohne nachgewiesene EUR-Wirkung.'
              : 'Nicht zur Basisrechnung hinzugefügt.',
    }))

  const months: MonthFlow[] = []
  let cumulativeEur = 0
  let costTotalEur = 0
  let benefitTotalEur = 0
  for (let month = 0; month <= input.horizonMonths; month++) {
    let newCostEur = 0
    let avoidedLegacyEur = 0
    let metricBenefitEur = 0
    for (const cost of input.costs) {
      if (!active(cost, month)) continue
      const value =
        cost.kind === 'one-time'
          ? month === cost.startMonth
            ? cost.amountEur * (1 + adjustments.oneTimeCostPercent / 100)
            : 0
          : euroPerMonth(cost)
      if (cost.kind === 'avoided-legacy') avoidedLegacyEur += value
      else newCostEur += value
    }
    for (const metric of input.metrics) {
      // Kundennutzen verzögert sich; Lizenzkosten und Altsystemabschaltungen nicht.
      const effectiveMonth = month - adjustments.benefitDelayMonths
      if (
        !includedIds.has(metric.id) ||
        effectiveMonth < metric.startMonth ||
        (metric.endMonth !== undefined && effectiveMonth > metric.endMonth)
      )
        continue
      const share = Math.min(1, (effectiveMonth - metric.startMonth + 1) / metric.rampMonths)
      metricBenefitEur += ((annualMetricPotential(metric) ?? 0) / 12) * share * (1 + adjustments.benefitPercent / 100)
    }
    const totalBenefitEur = avoidedLegacyEur + metricBenefitEur
    const netEur = totalBenefitEur - newCostEur
    cumulativeEur += netEur
    costTotalEur += newCostEur
    benefitTotalEur += totalBenefitEur
    months.push({ month, newCostEur, avoidedLegacyEur, metricBenefitEur, totalBenefitEur, netEur, cumulativeEur })
  }

  // Ohne jemals erlittene negative Nettoposition wird kein "zurückverdienter" Aufwand behauptet.
  const hadCost = input.costs.some((c) => c.kind !== 'avoided-legacy' && c.amountEur > 0)
  let firstBreakEvenMonth: number | null = null
  if (hadCost && benefitTotalEur > 0) {
    const wasNegative = months.some((m) => m.cumulativeEur < -EPS)
    if (wasNegative) {
      firstBreakEvenMonth = months.findIndex(
        (m, i) => i > 0 && m.cumulativeEur >= -EPS && months[i - 1]!.cumulativeEur < -EPS,
      )
      if (firstBreakEvenMonth < 0) firstBreakEvenMonth = null
    } else {
      firstBreakEvenMonth = 0
    }
  }
  let sustainedBreakEvenMonth: number | null = null
  if (firstBreakEvenMonth !== null) {
    for (let i = firstBreakEvenMonth; i < months.length; i++) {
      if (months.slice(i).every((m) => m.cumulativeEur >= -EPS)) {
        sustainedBreakEvenMonth = i
        break
      }
    }
  }
  return {
    success: true,
    months,
    firstBreakEvenMonth,
    sustainedBreakEvenMonth,
    costTotalEur,
    benefitTotalEur,
    cumulativeEur,
    countedMetrics,
    nonMonetized,
    unresolvedAssumptions: countedMetrics.filter((m) => m.evidence !== 'customer-reviewed').length,
  }
}

export function newMetric(id: string, formula: MetricFormula = 'direct'): CustomerMetric {
  return {
    id,
    name: 'Neue Kunden-Metric',
    formula,
    treatment:
      formula === 'time'
        ? 'capacity'
        : formula === 'risk'
          ? 'risk'
          : formula === 'qualitative'
            ? 'nonfinancial'
            : 'realized',
    evidence: 'hypothesis',
    evidenceNote: '',
    effectGroup: id,
    included: false,
    annualAmountEur: 0,
    annualVolume: 0,
    before: 0,
    after: 0,
    hourlyCostEur: 0,
    valuePerEventEur: 0,
    startMonth: 1,
    rampMonths: 1,
  }
}

export function exampleSoftwareProject(): SoftwarePaybackInput {
  const metric = newMetric('angebot', 'direct')
  return {
    horizonMonths: 36,
    costs: [
      { id: 'setup', name: 'Implementierung', kind: 'one-time', amountEur: 120000, period: 'monthly', startMonth: 0 },
      { id: 'saas', name: 'SaaS-Lizenzen', kind: 'saas', amountEur: 3000, period: 'monthly', startMonth: 1 },
    ],
    metrics: [
      {
        ...metric,
        name: 'Wirtschaftlicher CRM-Nutzen',
        annualAmountEur: 180000,
        startMonth: 7,
        effectGroup: 'crm-gesamtwert',
        included: true,
        evidenceNote: 'Fiktive Modellannahme, noch nicht vom Kunden belegt.',
      },
    ],
  }
}
