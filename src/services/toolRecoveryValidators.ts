import type { CostOfDelayInput } from '../domain/costOfDelay'
import type { MetricBuilderDraft } from '../domain/metricBuilder'
import type { ReverseTimelineStepInput } from '../domain/reverseTimeline'
import type { CustomerMetric, SoftwareCost } from '../domain/softwarePayback'
import type { ValueBridgeInput } from '../domain/valueBridge'
import type { ScenarioSettings } from '../domain/businessCaseScenarios'

type Check = (value: unknown) => boolean
type Rules = Record<string, Check>

const record = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === 'object' && !Array.isArray(value) && Object.getPrototypeOf(value) === Object.prototype

const string: Check = (value) => typeof value === 'string' && value.length <= 6000
const number: Check = (value) => typeof value === 'number' && Number.isFinite(value) && Math.abs(value) <= 1e12
const nullableNumber: Check = (value) => value === null || number(value)
const inputNumber: Check = (value) => value === '' || number(value)
const boolean: Check = (value) => typeof value === 'boolean'
const choice = (...values: string[]): Check => (value) => values.includes(value as string)
const optional = (check: Check): Check => (value) => value === undefined || check(value)
const array = (check: Check, max = 100): Check => (value) =>
  Array.isArray(value) && value.length <= max && value.every(check)

/** Exact keys: unknown/malicious or future-version fields never enter live Vue state. */
const object = (rules: Rules): Check => (value) => {
  if (!record(value)) return false
  const keys = Object.keys(value)
  return keys.every((key) => Object.hasOwn(rules, key)) &&
    Object.entries(rules).every(([key, check]) => check(value[key]))
}

const evidence = choice('hypothesis', 'reference', 'customer-stated', 'customer-reviewed')
const formula = choice('direct', 'process', 'time', 'conversion', 'quality', 'risk', 'qualitative')

const stepCheck = object({
  id: string,
  label: string,
  duration: number,
  durationUnit: choice('calendar-days', 'business-days'),
  owner: choice('customer', 'seller', 'shared'),
  ownerDetail: optional(string),
  area: choice('decision-process', 'paper-process', 'implementation'),
})

export interface ReverseTimelineRecovery {
  customerName: string
  planTitle: string
  referenceDate: string
  targetGoLiveDate: string
  compellingEvent: string
  steps: ReverseTimelineStepInput[]
}

const timelineCheck = object({
  customerName: string,
  planTitle: string,
  referenceDate: string,
  targetGoLiveDate: string,
  compellingEvent: string,
  steps: array(stepCheck, 70),
})

export const isReverseTimelineRecovery = (value: unknown): value is ReverseTimelineRecovery => timelineCheck(value)

const builderCheck = object({
  problem: string,
  process: string,
  consequence: string,
  outcome: string,
  formula,
  period: choice('monthly', 'annual'),
  volume: inputNumber,
  before: inputNumber,
  after: inputNumber,
  hourlyCost: inputNumber,
  valuePerEvent: inputNumber,
  beforeText: string,
  afterText: string,
  evidence,
  assumptionNote: string,
  effectGroup: string,
  mechanism: choice('unresolved', 'avoidable-cost', 'avoided-hiring', 'avoided-external', 'incremental-margin', 'reduced-error-cost'),
  realizationNote: string,
  realizedAnnual: inputNumber,
  startMonth: inputNumber,
  rampMonths: inputNumber,
})

export interface MetricBuilderRecovery {
  draft: MetricBuilderDraft
  step: 1 | 2 | 3
}

export const isMetricBuilderRecovery = (value: unknown): value is MetricBuilderRecovery =>
  object({ draft: builderCheck, step: (v) => v === 1 || v === 2 || v === 3 })(value)

const costCheck = object({
  title: string,
  problem: string,
  outcome: string,
  horizonMonths: (v) => v === 36 || v === 60,
  annualBenefitEur: nullableNumber,
  benefitKind: choice('recurring', 'one-time'),
  benefitStartMonth: number,
  rampMonths: number,
  benefitEndMonth: nullableNumber,
  expiry: choice('fixed', 'follows-start'),
  financialTreatment: choice('realized', 'capacity', 'unconfirmed'),
  evidence,
  source: string,
  effectGroup: string,
  legacyMonthlyEur: nullableNumber,
  legacyStartMonth: number,
  legacyMovesWithProject: boolean,
  legacyEffectGroup: string,
  projectOnceEur: nullableNumber,
  projectCostMonth: number,
  projectCostsMove: boolean,
  extraCostPerMonthEur: nullableNumber,
  extraCostSource: string,
})

export interface CostOfDelayRecovery {
  draft: CostOfDelayInput
  step: 1 | 2 | 3
  chosenDelay: number
  customDelay: number | null
  benefitEntryPeriod: 'annual' | 'monthly'
}

export const isCostOfDelayRecovery = (value: unknown): value is CostOfDelayRecovery =>
  object({
    draft: costCheck,
    step: (v) => v === 1 || v === 2 || v === 3,
    chosenDelay: number,
    customDelay: nullableNumber,
    benefitEntryPeriod: choice('annual', 'monthly'),
  })(value)

const bridgeMetricCheck = object({
  id: string,
  name: string,
  before: string,
  after: string,
  unit: string,
  calculation: string,
  evidence,
  source: string,
  effectGroup: string,
  kind: choice('saving', 'margin', 'unclassified', 'capacity', 'potential', 'revenue', 'risk', 'qualitative'),
  annualPotentialEur: nullableNumber,
  annualRealizedEur: nullableNumber,
  realization: string,
  included: boolean,
  startMonth: number,
  rampMonths: number,
  origin: choice('manual', 'metric-builder', 'software-business-case', 'cost-of-delay'),
})

const bridgeCheck = object({
  situation: string,
  pain: string,
  consequence: string,
  outcome: string,
  change: string,
  prerequisites: string,
  customer: string,
  horizonMonths: (v) => v === 36 || v === 60,
  investmentEur: nullableNumber,
  saasMonthlyEur: nullableNumber,
  metrics: array(bridgeMetricCheck, 50),
})

export interface ValueBridgeRecovery {
  draft: ValueBridgeInput
  step: 1 | 2 | 3
}

export const isValueBridgeRecovery = (value: unknown): value is ValueBridgeRecovery =>
  object({ draft: bridgeCheck, step: (v) => v === 1 || v === 2 || v === 3 })(value)

const softwareCostCheck = object({
  id: string,
  name: string,
  kind: choice('one-time', 'saas', 'avoided-legacy'),
  amountEur: number,
  period: choice('monthly', 'annual'),
  startMonth: number,
  endMonth: optional(number),
  effectGroup: optional(string),
})
const softwareMetricCheck = object({
  id: string,
  name: string,
  formula,
  treatment: choice('realized', 'capacity', 'risk', 'nonfinancial'),
  evidence,
  evidenceNote: string,
  effectGroup: string,
  included: boolean,
  annualAmountEur: number,
  annualVolume: number,
  before: number,
  after: number,
  hourlyCostEur: number,
  valuePerEventEur: number,
  startMonth: number,
  rampMonths: number,
  endMonth: optional(number),
})
const adjustmentCheck = object({
  benefitPercent: number,
  oneTimeCostPercent: number,
  benefitDelayMonths: number,
})

export interface SoftwarePaybackRecovery {
  costs: SoftwareCost[]
  metrics: CustomerMetric[]
  horizon: 36 | 60
  selectedScenario: 'base' | 'conservative' | 'optimistic'
  scenarioSettings: ScenarioSettings
  reportCustomer: string
  reportProject: string
  reportAuthor: string
  reportPain: string
  reportGoal: string
  reportDate: string
}

export const isSoftwarePaybackRecovery = (value: unknown): value is SoftwarePaybackRecovery =>
  object({
    costs: array(softwareCostCheck, 100),
    metrics: array(softwareMetricCheck, 100),
    horizon: (v) => v === 36 || v === 60,
    selectedScenario: choice('base', 'conservative', 'optimistic'),
    scenarioSettings: object({ conservative: adjustmentCheck, optimistic: adjustmentCheck }),
    reportCustomer: string,
    reportProject: string,
    reportAuthor: string,
    reportPain: string,
    reportGoal: string,
    reportDate: string,
  })(value)
