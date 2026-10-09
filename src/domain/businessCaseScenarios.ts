import { summarizeBusinessCase, type CaseSummary } from './businessCase'
import {
  BASE_ADJUSTMENTS,
  validScenarioAdjustments,
  type ScenarioAdjustments,
  type SoftwarePaybackInput,
} from './softwarePayback'

export type BusinessScenarioId = 'base' | 'conservative' | 'optimistic'
export type ScenarioSettings = { conservative: ScenarioAdjustments; optimistic: ScenarioAdjustments }

export const DEFAULT_SCENARIO_SETTINGS: Readonly<ScenarioSettings> = Object.freeze({
  conservative: Object.freeze({ benefitPercent: -25, oneTimeCostPercent: 15, benefitDelayMonths: 3 }),
  optimistic: Object.freeze({ benefitPercent: 10, oneTimeCostPercent: 0, benefitDelayMonths: 0 }),
})

export const SCENARIO_LABELS: Record<BusinessScenarioId, string> = {
  base: 'Basis',
  conservative: 'Konservativ',
  optimistic: 'Optimistisch',
}

export interface ComparedBusinessScenario {
  id: BusinessScenarioId
  label: string
  assumptions: ScenarioAdjustments
  summary: CaseSummary
  deltaBalanceEur: number
  deltaCostEur: number
  deltaBenefitEur: number
  deltaPaybackMonths: number | null
}

/** Keine zweite Finanzengine: alle Zahlen stammen aus derselben Monatsrechnung wie V4. */
export function compareBusinessScenarios(
  input: SoftwarePaybackInput,
  settings: ScenarioSettings = DEFAULT_SCENARIO_SETTINGS,
): ComparedBusinessScenario[] | null {
  if (
    !validScenarioAdjustments(settings.conservative, input.horizonMonths) ||
    !validScenarioAdjustments(settings.optimistic, input.horizonMonths)
  ) return null
  const base = summarizeBusinessCase(input)
  const conservative = summarizeBusinessCase(input, settings.conservative)
  const optimistic = summarizeBusinessCase(input, settings.optimistic)
  if (!base || !conservative || !optimistic) return null
  const rows = [
    { id: 'base' as const, summary: base, assumptions: BASE_ADJUSTMENTS },
    { id: 'conservative' as const, summary: conservative, assumptions: settings.conservative },
    { id: 'optimistic' as const, summary: optimistic, assumptions: settings.optimistic },
  ]
  return rows.map(({ id, summary, assumptions }) => ({
    id,
    label: SCENARIO_LABELS[id],
    assumptions,
    summary,
    deltaBalanceEur: summary.netValueEur - base.netValueEur,
    deltaCostEur: summary.totalCostEur - base.totalCostEur,
    deltaBenefitEur: summary.benefitEur - base.benefitEur,
    deltaPaybackMonths:
      summary.sustainedBreakEvenMonth === null || base.sustainedBreakEvenMonth === null
        ? null
        : summary.sustainedBreakEvenMonth - base.sustainedBreakEvenMonth,
  }))
}

export function describeScenarioAssumptions(a: ScenarioAdjustments): string {
  const percent = (n: number) => (n > 0 ? '+' : '') + n.toLocaleString('de-DE', { maximumFractionDigits: 1 }) + ' %'
  return 'Kundennutzen ' + percent(a.benefitPercent) +
    ', einmalige Projektkosten ' + percent(a.oneTimeCostPercent) +
    ', Nutzenbeginn +' + a.benefitDelayMonths + ' Monate'
}
