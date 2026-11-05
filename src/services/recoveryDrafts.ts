import { emptyMetricDraft, type MetricBuilderDraft } from '../domain/metricBuilder'
import { emptyCostOfDelayInput, type CostOfDelayInput } from '../domain/costOfDelay'
import { blankBridgeMetric, blankValueBridge, type ValueBridgeInput } from '../domain/valueBridge'
import type { CustomerMetric, SoftwareCost } from '../domain/softwarePayback'

type RecordValue = Record<string, unknown>
const object = (value: unknown): value is RecordValue =>
  value !== null && typeof value === 'object' && !Array.isArray(value)
const shortText = (value: unknown): value is string => typeof value === 'string' && value.length <= 5000
const finite = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value)
const optionalNumber = (value: unknown) => value === null || finite(value)
const numberOrEmpty = (value: unknown) => value === '' || finite(value)
const oneOf = (value: unknown, values: readonly string[]) => typeof value === 'string' && values.includes(value)
const recordKeys = (value: RecordValue, keys: readonly string[]) =>
  Object.keys(value).every((key) => keys.includes(key))
const sameKeys = (value: RecordValue, keys: readonly string[]) =>
  recordKeys(value, keys) && keys.every((key) => Object.hasOwn(value, key))

const evidence = ['hypothesis', 'reference', 'customer-stated', 'customer-reviewed']
const formula = ['direct', 'process', 'time', 'conversion', 'quality', 'risk', 'qualitative']
const mechanism = [
  'unresolved',
  'avoidable-cost',
  'avoided-hiring',
  'avoided-external',
  'incremental-margin',
  'reduced-error-cost',
]
const kinds = ['saving', 'margin', 'unclassified', 'capacity', 'potential', 'revenue', 'risk', 'qualitative']

export function validMetricBuilderDraft(value: unknown): value is MetricBuilderDraft {
  if (!object(value)) return false
  const sample = emptyMetricDraft()
  if (!sameKeys(value, Object.keys(sample))) return false
  const nums = [
    'volume',
    'before',
    'after',
    'hourlyCost',
    'valuePerEvent',
    'realizedAnnual',
    'startMonth',
    'rampMonths',
  ]
  return (
    Object.keys(sample).every((key) => (nums.includes(key) ? numberOrEmpty(value[key]) : shortText(value[key]))) &&
    oneOf(value.formula, formula) &&
    oneOf(value.period, ['monthly', 'annual']) &&
    oneOf(value.evidence, evidence) &&
    oneOf(value.mechanism, mechanism)
  )
}

export function validCostOfDelayInput(value: unknown): value is CostOfDelayInput {
  if (!object(value)) return false
  const sample = emptyCostOfDelayInput()
  if (!sameKeys(value, Object.keys(sample))) return false
  const text = ['title', 'problem', 'outcome', 'source', 'effectGroup', 'legacyEffectGroup', 'extraCostSource']
  const money = ['annualBenefitEur', 'benefitEndMonth', 'legacyMonthlyEur', 'projectOnceEur', 'extraCostPerMonthEur']
  const numbers = ['benefitStartMonth', 'rampMonths', 'legacyStartMonth', 'projectCostMonth']
  const bools = ['legacyMovesWithProject', 'projectCostsMove']
  return (
    text.every((k) => shortText(value[k])) &&
    money.every((k) => optionalNumber(value[k])) &&
    numbers.every((k) => finite(value[k])) &&
    bools.every((k) => typeof value[k] === 'boolean') &&
    (value.horizonMonths === 36 || value.horizonMonths === 60) &&
    oneOf(value.benefitKind, ['recurring', 'one-time']) &&
    oneOf(value.expiry, ['fixed', 'follows-start']) &&
    oneOf(value.financialTreatment, ['realized', 'capacity', 'unconfirmed']) &&
    oneOf(value.evidence, evidence)
  )
}

export function validBridgeMetric(value: unknown): boolean {
  if (!object(value)) return false
  const sample = blankBridgeMetric('template')
  if (!sameKeys(value, Object.keys(sample))) return false
  const text = ['id', 'name', 'before', 'after', 'unit', 'calculation', 'source', 'effectGroup', 'realization']
  return (
    text.every((k) => shortText(value[k])) &&
    optionalNumber(value.annualPotentialEur) &&
    optionalNumber(value.annualRealizedEur) &&
    typeof value.included === 'boolean' &&
    finite(value.startMonth) &&
    finite(value.rampMonths) &&
    oneOf(value.evidence, evidence) &&
    oneOf(value.kind, kinds) &&
    oneOf(value.origin, ['manual', 'metric-builder', 'software-business-case', 'cost-of-delay'])
  )
}

export function validValueBridgeInput(value: unknown): value is ValueBridgeInput {
  if (!object(value)) return false
  const sample = blankValueBridge()
  if (!sameKeys(value, Object.keys(sample))) return false
  const text = ['situation', 'pain', 'consequence', 'outcome', 'change', 'prerequisites', 'customer']
  return (
    text.every((k) => shortText(value[k])) &&
    (value.horizonMonths === 36 || value.horizonMonths === 60) &&
    optionalNumber(value.investmentEur) &&
    optionalNumber(value.saasMonthlyEur) &&
    Array.isArray(value.metrics) &&
    value.metrics.length <= 100 &&
    value.metrics.every(validBridgeMetric)
  )
}

export function validSoftwareCost(value: unknown): value is SoftwareCost {
  if (!object(value)) return false
  const keys = ['id', 'name', 'kind', 'amountEur', 'period', 'startMonth', 'endMonth', 'effectGroup']
  return (
    recordKeys(value, keys) &&
    shortText(value.id) &&
    shortText(value.name) &&
    oneOf(value.kind, ['one-time', 'saas', 'avoided-legacy']) &&
    oneOf(value.period, ['monthly', 'annual']) &&
    finite(value.amountEur) &&
    finite(value.startMonth) &&
    (value.endMonth === undefined || finite(value.endMonth)) &&
    (value.effectGroup === undefined || shortText(value.effectGroup))
  )
}

export function validSoftwareMetric(value: unknown): value is CustomerMetric {
  if (!object(value)) return false
  const keys = [
    'id',
    'name',
    'formula',
    'treatment',
    'evidence',
    'evidenceNote',
    'effectGroup',
    'included',
    'annualAmountEur',
    'annualVolume',
    'before',
    'after',
    'hourlyCostEur',
    'valuePerEventEur',
    'startMonth',
    'rampMonths',
    'endMonth',
  ]
  const nums = [
    'annualAmountEur',
    'annualVolume',
    'before',
    'after',
    'hourlyCostEur',
    'valuePerEventEur',
    'startMonth',
    'rampMonths',
  ]
  return (
    recordKeys(value, keys) &&
    ['id', 'name', 'evidenceNote', 'effectGroup'].every((k) => shortText(value[k])) &&
    nums.every((k) => finite(value[k])) &&
    (value.endMonth === undefined || finite(value.endMonth)) &&
    typeof value.included === 'boolean' &&
    oneOf(value.formula, formula) &&
    oneOf(value.evidence, evidence) &&
    oneOf(value.treatment, ['realized', 'capacity', 'risk', 'nonfinancial'])
  )
}
