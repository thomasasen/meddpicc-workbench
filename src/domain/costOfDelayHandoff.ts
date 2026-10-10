import { mechanismLabels, type MetricBuilderDraft, type MetricBuilderResult } from './metricBuilder'
import { emptyCostOfDelayInput, type CostOfDelayInput } from './costOfDelay'

const KEY = 'meddpicc-cost-of-delay-handoff-v1'

/** Keine behauptete Kundenbestätigung; nur expliziter Nutzertransfer. */
export function queueCostOfDelayHandoff(
  draft: MetricBuilderDraft,
  result: MetricBuilderResult,
  storage: Pick<Storage, 'setItem'>,
): void {
  if (!result.complete || result.realizedEur === null || result.realizedEur <= 0 || !draft.effectGroup.trim())
    throw new Error('Nur wirtschaftlich realisierbare Metrics mit Wirkungsgruppe übertragbar.')
  const input: CostOfDelayInput = {
    ...emptyCostOfDelayInput(),
    title: draft.process,
    problem: draft.problem,
    outcome: draft.outcome,
    annualBenefitEur: result.realizedEur,
    financialTreatment: 'realized',
    benefitStartMonth: Number(draft.startMonth),
    rampMonths: Number(draft.rampMonths),
    evidence: draft.evidence,
    source: [
      'Metric Builder; Ursprungszeitraum: ' + (draft.period === 'monthly' ? 'monatlich' : 'jährlich'),
      'Realisierungsmechanismus: ' + mechanismLabels[draft.mechanism],
      draft.assumptionNote,
      draft.realizationNote,
    ].filter(Boolean).join(' | '),
    effectGroup: draft.effectGroup,
  }
  storage.setItem(KEY, JSON.stringify(input))
}

export function consumeCostOfDelayHandoff(storage: Pick<Storage, 'getItem' | 'removeItem'>): CostOfDelayInput | null {
  const raw = storage.getItem(KEY)
  if (!raw) return null
  storage.removeItem(KEY)
  try {
    const parsed: unknown = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return null
    const input = parsed as CostOfDelayInput
    if (
      !input.title ||
      !input.effectGroup ||
      !Number.isFinite(input.annualBenefitEur) ||
      input.financialTreatment !== 'realized' ||
      !Number.isInteger(input.benefitStartMonth) ||
      !Number.isInteger(input.rampMonths)
    )
      return null
    return {
      ...emptyCostOfDelayInput(),
      ...input,
      legacyMonthlyEur: null,
      projectOnceEur: null,
      extraCostPerMonthEur: null,
    }
  } catch {
    return null
  }
}
