import type { MetricBuilderDraft, MetricBuilderResult } from './metricBuilder'
import type { CostOfDelayInput } from './costOfDelay'
import type { SoftwarePaybackInput } from './softwarePayback'
import {
  blankBridgeMetric,
  blankValueBridge,
  type BridgeMetric,
  type ValueBridgeInput,
  type ValueKind,
} from './valueBridge'

const KEY = 'meddpicc-value-bridge-handoff-v1'

type Handoff = { version: 1; input: ValueBridgeInput }

function store(input: ValueBridgeInput, storage: Pick<Storage, 'setItem'>): void {
  storage.setItem(KEY, JSON.stringify({ version: 1, input } satisfies Handoff))
}

/** Ein Metric-Builder-Wert wird niemals automatisch angerechnet. */
export function queueBuilderToBridge(
  draft: MetricBuilderDraft,
  result: MetricBuilderResult,
  storage: Pick<Storage, 'setItem'>,
): void {
  if (!result.complete) throw new Error('Nur vollständige Metrics können übernommen werden.')
  const kind: ValueKind =
    result.realizedEur !== null && result.realizedEur > 0
      ? draft.formula === 'conversion'
        ? 'margin'
        : 'saving'
      : draft.formula === 'time'
        ? 'capacity'
        : draft.formula === 'risk'
          ? 'risk'
          : draft.formula === 'qualitative'
            ? 'qualitative'
            : 'potential'
  const metric: BridgeMetric = {
    ...blankBridgeMetric('from-builder'),
    name: draft.process || draft.problem,
    before: result.beforeText,
    after: result.afterText,
    evidence: draft.evidence,
    source: [draft.assumptionNote, draft.realizationNote].filter(Boolean).join(' | '),
    effectGroup: draft.effectGroup,
    kind,
    annualPotentialEur: result.potentialEur,
    annualRealizedEur: result.realizedEur,
    realization: draft.realizationNote,
    included: false,
    startMonth: Number(draft.startMonth),
    rampMonths: Number(draft.rampMonths),
    origin: 'metric-builder',
  }
  store(
    {
      ...blankValueBridge(),
      situation: draft.process,
      pain: draft.problem,
      consequence: draft.consequence,
      outcome: draft.outcome,
      metrics: [metric],
    },
    storage,
  )
}

/** Kein Cost-of-Delay-Differenzbetrag: nur der ausdrücklich modellierte Ausgangsnutzen. */
export function queueDelayToBridge(input: CostOfDelayInput, storage: Pick<Storage, 'setItem'>): void {
  const amount = input.financialTreatment === 'realized' ? input.annualBenefitEur : null
  const metric: BridgeMetric = {
    ...blankBridgeMetric('from-delay'),
    name: input.title,
    kind: amount !== null ? 'unclassified' : input.financialTreatment === 'capacity' ? 'capacity' : 'potential',
    evidence: input.evidence,
    source: input.source,
    effectGroup: input.effectGroup,
    annualRealizedEur: amount,
    realization: input.source,
    included: false,
    startMonth: input.benefitStartMonth,
    rampMonths: input.rampMonths,
    origin: 'cost-of-delay',
  }
  store({ ...blankValueBridge(), pain: input.problem, outcome: input.outcome, metrics: [metric] }, storage)
}

/** Der vollständige Business Case hat reichhaltigere Kosten-/Zeitlogik: hier nur kompatible Daten übernehmen. */
export function queuePaybackToBridge(input: SoftwarePaybackInput, storage: Pick<Storage, 'setItem'>): void {
  if (!Array.isArray(input.metrics) || input.metrics.length > 15)
    throw new Error('Maximal 15 Metrics in eine Value Bridge übernehmen.')
  const metrics = input.metrics.map((m): BridgeMetric => {
    const value = m.formula === 'direct' && m.treatment === 'realized' ? m.annualAmountEur : null
    const kind: ValueKind =
      m.treatment === 'capacity'
        ? 'capacity'
        : m.treatment === 'risk'
          ? 'risk'
          : m.treatment === 'nonfinancial'
            ? 'qualitative'
            : value !== null
              ? 'saving'
              : 'potential'
    return {
      ...blankBridgeMetric(m.id),
      name: m.name,
      kind,
      evidence: m.evidence,
      source: m.evidenceNote,
      effectGroup: m.effectGroup,
      annualRealizedEur: value,
      annualPotentialEur: value,
      realization: m.evidenceNote,
      included: false,
      startMonth: m.startMonth,
      rampMonths: m.rampMonths,
      origin: 'software-business-case',
    }
  })
  const oneTime = input.costs.filter((c) => c.kind === 'one-time')
  const recurring = input.costs.filter((c) => c.kind === 'saas')
  const compatibleCosts =
    oneTime.every((c) => c.startMonth === 0) &&
    recurring.every((c) => c.period === 'monthly' && c.startMonth === 1 && c.endMonth === undefined) &&
    input.costs.length === oneTime.length + recurring.length
  store(
    {
      ...blankValueBridge(),
      horizonMonths: input.horizonMonths,
      investmentEur: compatibleCosts ? oneTime.reduce((sum, c) => sum + c.amountEur, 0) : null,
      saasMonthlyEur: compatibleCosts ? recurring.reduce((sum, c) => sum + c.amountEur, 0) : null,
      metrics: metrics.length ? metrics : [blankBridgeMetric('metric-1')],
    },
    storage,
  )
}

/** Nur einmal nutzbar; keine URL-Parameter mit Kundendaten und keine dauerhafte Speicherung. */
export function consumeValueBridgeHandoff(storage: Pick<Storage, 'getItem' | 'removeItem'>): ValueBridgeInput | null {
  const raw = storage.getItem(KEY)
  if (!raw) return null
  storage.removeItem(KEY)
  try {
    const parsed: unknown = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return null
    const record = parsed as Partial<Handoff>
    const input = record.input
    if (
      record.version !== 1 ||
      !input ||
      !Array.isArray(input.metrics) ||
      input.metrics.length < 1 ||
      input.metrics.length > 15 ||
      (input.horizonMonths !== 36 && input.horizonMonths !== 60)
    )
      return null
    if (
      input.metrics.some(
        (m) =>
          !m ||
          typeof m.name !== 'string' ||
          typeof m.evidence !== 'string' ||
          !['hypothesis', 'reference', 'customer-stated', 'customer-reviewed'].includes(m.evidence) ||
          typeof m.kind !== 'string' ||
          m.included !== false ||
          (m.annualRealizedEur !== null && (!Number.isFinite(m.annualRealizedEur) || m.annualRealizedEur < 0)),
      )
    )
      return null
    return { ...blankValueBridge(), ...input, metrics: input.metrics.map((m) => ({ ...m, included: false })) }
  } catch {
    return null
  }
}
