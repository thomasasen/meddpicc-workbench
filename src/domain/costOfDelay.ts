import type { MetricEvidence } from './softwarePayback'

export type DelayBenefitKind = 'recurring' | 'one-time'
export type DelayFinancialTreatment = 'realized' | 'capacity' | 'unconfirmed'
export type DelayExpiry = 'fixed' | 'follows-start'

/** Alle Termine sind Modellmonate; Monat 0 ist der gemeinsame Planungsbeginn. */
export interface CostOfDelayInput {
  title: string
  problem: string
  outcome: string
  horizonMonths: 36 | 60
  annualBenefitEur: number | null
  benefitKind: DelayBenefitKind
  benefitStartMonth: number
  rampMonths: number
  benefitEndMonth: number | null
  expiry: DelayExpiry
  financialTreatment: DelayFinancialTreatment
  evidence: MetricEvidence
  source: string
  effectGroup: string
  legacyMonthlyEur: number | null
  legacyStartMonth: number
  legacyMovesWithProject: boolean
  legacyEffectGroup: string
  projectOnceEur: number | null
  projectCostMonth: number
  projectCostsMove: boolean
  extraCostPerMonthEur: number | null
  extraCostSource: string
}

export interface DelayMonth {
  month: number
  baseBenefitEur: number
  delayedBenefitEur: number
  baseCumulativeEur: number
  delayedCumulativeEur: number
}

export interface DelayScenario {
  delayMonths: number
  baseBenefitEur: number
  delayedBenefitEur: number
  benefitDifferenceEur: number
  legacyDifferenceEur: number
  additionalDelayCostEur: number | null
  deferredProjectCostEur: number | null
  netDifferenceEur: number | null
  irreversibleBenefitEur: number | null
  months: DelayMonth[]
}

export type CostOfDelayResult =
  | { success: false; issues: string[]; questions: string[] }
  | { success: true; horizonMonths: number; scenarios: DelayScenario[]; questions: string[]; unverified: boolean }

const MAX = 1_000_000_000_000
const isMoney = (value: number | null): value is number =>
  value !== null && typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= MAX
const validMonth = (value: number, min: number, max: number): boolean =>
  Number.isInteger(value) && value >= min && value <= max
const nearZero = (value: number): number => (Math.abs(value) < 0.000001 ? 0 : value)

/** Bloße Modellierung von Monatswerten, keine Cashflow-/Barwertformel. */
function benefitAt(input: CostOfDelayInput, month: number, delay: number): number {
  if (input.financialTreatment !== 'realized' || !isMoney(input.annualBenefitEur)) return 0
  const start = input.benefitStartMonth + delay
  const end =
    input.benefitEndMonth === null
      ? Number.POSITIVE_INFINITY
      : input.benefitEndMonth + (input.expiry === 'follows-start' ? delay : 0)
  if (month < start || month > end) return 0
  if (input.benefitKind === 'one-time') return month === start ? input.annualBenefitEur : 0
  const rampShare = Math.min(1, (month - start + 1) / input.rampMonths)
  return (input.annualBenefitEur / 12) * rampShare
}

function legacyAt(input: CostOfDelayInput, month: number, delay: number): number {
  if (!isMoney(input.legacyMonthlyEur)) return 0
  const movedBy = input.legacyMovesWithProject ? delay : 0
  return month >= input.legacyStartMonth + movedBy ? input.legacyMonthlyEur : 0
}

function projectCostAt(input: CostOfDelayInput, month: number, delay: number): number {
  if (!isMoney(input.projectOnceEur)) return 0
  return month === input.projectCostMonth + (input.projectCostsMove ? delay : 0) ? input.projectOnceEur : 0
}

export function emptyCostOfDelayInput(): CostOfDelayInput {
  return {
    title: '',
    problem: '',
    outcome: '',
    horizonMonths: 36,
    annualBenefitEur: null,
    benefitKind: 'recurring',
    benefitStartMonth: 1,
    rampMonths: 1,
    benefitEndMonth: null,
    expiry: 'follows-start',
    financialTreatment: 'unconfirmed',
    evidence: 'hypothesis',
    source: '',
    effectGroup: '',
    legacyMonthlyEur: null,
    legacyStartMonth: 1,
    legacyMovesWithProject: true,
    legacyEffectGroup: '',
    projectOnceEur: null,
    projectCostMonth: 0,
    projectCostsMove: true,
    extraCostPerMonthEur: null,
    extraCostSource: '',
  }
}

export const costOfDelayDemos: Record<string, CostOfDelayInput> = {
  service: {
    ...emptyCostOfDelayInput(),
    title: 'CRM / Service: externer Dienstleister',
    problem: 'Ein vermeidbarer externer Servicekostenblock besteht fort.',
    outcome: 'Servicebearbeitung intern automatisieren und externen Vertrag reduzieren.',
    annualBenefitEur: 60000,
    benefitStartMonth: 4,
    rampMonths: 3,
    financialTreatment: 'realized',
    source: 'Fiktive Annahme: Rechnung des Dienstleisters sinkt nach Umstellung.',
    effectGroup: 'service-extern',
    projectOnceEur: 0,
    extraCostPerMonthEur: 0,
  },
  sales: {
    ...emptyCostOfDelayInput(),
    title: 'Vertrieb: zusätzlicher Deckungsbeitrag',
    problem: 'Zu wenige Angebote werden gewonnen.',
    outcome: 'Conversion von 20 % auf 24 % bei 1.200 Angeboten und 4.000 EUR Deckungsbeitrag.',
    annualBenefitEur: 192000,
    benefitStartMonth: 7,
    rampMonths: 6,
    financialTreatment: 'realized',
    source: 'Fiktiv: 1.200 × 4 Prozentpunkte × 4.000 EUR Deckungsbeitrag.',
    effectGroup: 'vertrieb-deckungsbeitrag',
    projectOnceEur: 0,
    extraCostPerMonthEur: 0,
  },
  capacity: {
    ...emptyCostOfDelayInput(),
    title: 'CRM: gewonnene Arbeitszeit',
    problem: 'Manuelle Datenpflege beansprucht unnötig Zeit.',
    outcome: '25.000 Vorgänge × 4 Minuten Einsparung pro Jahr; keine nachgewiesenen wegfallenden Ausgaben.',
    annualBenefitEur: null,
    benefitStartMonth: 5,
    rampMonths: 4,
    financialTreatment: 'capacity',
    source: 'Fiktive operative Annahme; kein finanzieller Realisierungsmechanismus.',
    effectGroup: 'crm-zeitgewinn',
  },
}

/**
 * Gleichbleibender Kalenderhorizont für beide Szenarien; eine Verschiebung
 * verändert ausschließlich explizit als verschiebbar markierte Positionen.
 */
export function calculateCostOfDelay(
  input: CostOfDelayInput,
  delays: number[] = [0, 3, 6, 12],
): CostOfDelayResult {
  const issues: string[] = []
  const questions: string[] = []
  const horizon = input.horizonMonths
  if (horizon !== 36 && horizon !== 60) issues.push('Betrachtungshorizont muss 36 oder 60 Monate sein.')
  if (!validMonth(input.benefitStartMonth, 1, 120)) issues.push('Nutzenbeginn muss zwischen Monat 1 und 120 liegen.')
  if (!validMonth(input.rampMonths, 1, 120)) issues.push('Ramp-up muss 1 bis 120 Monate umfassen.')
  if (
    input.benefitEndMonth !== null &&
    (!validMonth(input.benefitEndMonth, 1, 120) || input.benefitEndMonth < input.benefitStartMonth)
  ) issues.push('Nutzenende muss frühestens im Nutzenstartmonat liegen.')
  if (!['recurring', 'one-time'].includes(input.benefitKind)) issues.push('Nutzenart ungültig.')
  if (!['fixed', 'follows-start'].includes(input.expiry)) issues.push('Ende der Wirkung ungültig.')
  if (!['realized', 'capacity', 'unconfirmed'].includes(input.financialTreatment))
    issues.push('Realisierungsstatus ungültig.')
  if (!['hypothesis', 'reference', 'customer-stated', 'customer-reviewed'].includes(input.evidence))
    issues.push('Evidenzstatus ungültig.')
  if (input.financialTreatment === 'realized' && !isMoney(input.annualBenefitEur))
    issues.push('Für einen EUR-Vergleich muss ein gültiger wirtschaftlich realisierbarer Nutzen vorliegen.')
  if (input.annualBenefitEur !== null && !isMoney(input.annualBenefitEur))
    issues.push('Jahresbetrag muss zwischen 0 und 1 Billion EUR liegen.')
  if (input.legacyMonthlyEur !== null && !isMoney(input.legacyMonthlyEur))
    issues.push('Altsystemkosten müssen eine gültige nichtnegative Zahl sein.')
  if (input.projectOnceEur !== null && !isMoney(input.projectOnceEur))
    issues.push('Projektkosten müssen eine gültige nichtnegative Zahl sein.')
  if (input.extraCostPerMonthEur !== null && !isMoney(input.extraCostPerMonthEur))
    issues.push('Zusätzliche Verzögerungskosten müssen eine gültige nichtnegative Zahl sein.')
  if (!validMonth(input.legacyStartMonth, 1, 120)) issues.push('Altsystemabschaltung: Monat 1 bis 120.')
  if (!validMonth(input.projectCostMonth, 0, 120)) issues.push('Projektkostentermin: Monat 0 bis 120.')
  if (!Array.isArray(delays) || delays.length > 10 || delays.some((d) => !validMonth(d, 0, 120)))
    issues.push('Verzögerungen müssen ganze Monate zwischen 0 und 120 sein.')
  if (input.financialTreatment === 'realized' && !input.effectGroup.trim())
    issues.push('Wirkungsgruppe für realisierten Nutzen fehlt.')
  if (input.legacyMonthlyEur !== null && input.legacyMonthlyEur > 0 && !input.legacyEffectGroup.trim())
    issues.push('Wirkungsgruppe der Altsystemeinsparung fehlt.')
  if (
    input.financialTreatment === 'realized' &&
    (input.legacyMonthlyEur ?? 0) > 0 &&
    input.effectGroup.trim().toLowerCase() === input.legacyEffectGroup.trim().toLowerCase()
  ) issues.push('Doppelzählung: Kundennutzen und Altsystemabschaltung gehören zur gleichen Wirkungsgruppe.')
  if (input.extraCostPerMonthEur !== null && input.extraCostPerMonthEur > 0 && !input.extraCostSource.trim())
    issues.push('Für zusätzliche Verzögerungskosten muss die Datenquelle angegeben werden.')
  if (input.evidence === 'customer-reviewed' && !input.source.trim())
    issues.push('Für kundenbestätigte Werte muss die Datenquelle angegeben werden.')
  if (input.financialTreatment !== 'realized')
    questions.push('Welche konkret sinkenden Ausgaben oder zusätzlichen Deckungsbeiträge sind belegbar?')
  if (!input.source.trim()) questions.push('Welche Dokumente oder Ansprechpartner belegen den wirtschaftlichen Nutzen?')
  if (input.evidence !== 'customer-reviewed')
    questions.push('Wer beim Kunden bestätigt Zahlen, Nutzenbeginn und Annahmen?')
  if (input.projectOnceEur === null)
    questions.push('Welche Projektkosten fallen bei einer Verschiebung später an oder bleiben termingebunden?')
  if (input.extraCostPerMonthEur === null)
    questions.push('Welche Zusatzkosten entstehen während einer Verzögerung tatsächlich?')
  if (input.legacyMonthlyEur === null)
    questions.push('Wann kann ein bestehendes System tatsächlich abgeschaltet und eine Zahlung vermieden werden?')
  if (input.benefitEndMonth === null)
    questions.push('Kann entgangener Nutzen später nachgeholt werden, oder existiert eine feste Ausschlussfrist?')
  if (input.benefitEndMonth !== null && input.expiry === 'fixed')
    questions.push('Ist belegt, dass der Nutzen nach dem festen Endtermin nicht mehr nachholbar ist?')
  if (issues.length) return { success: false, issues, questions }
  // Für nicht monetarisierte Auswirkungen bewusst keine EUR-Szenarien ausgeben.
  if (input.financialTreatment !== 'realized')
    return { success: true, horizonMonths: horizon, scenarios: [], questions, unverified: true }

  const values = [...new Set([0, ...delays])].sort((a, b) => a - b)
  const scenarios = values.map((delay): DelayScenario => {
    let baseBenefitEur = 0
    let delayedBenefitEur = 0
    let baseLegacy = 0
    let delayedLegacy = 0
    let baseProject = 0
    let delayedProject = 0
    const months: DelayMonth[] = []
    for (let month = 0; month <= horizon; month++) {
      const baseline = benefitAt(input, month, 0)
      const deferred = benefitAt(input, month, delay)
      baseBenefitEur += baseline
      delayedBenefitEur += deferred
      baseLegacy += legacyAt(input, month, 0)
      delayedLegacy += legacyAt(input, month, delay)
      baseProject += projectCostAt(input, month, 0)
      delayedProject += projectCostAt(input, month, delay)
      months.push({
        month,
        baseBenefitEur: baseline,
        delayedBenefitEur: deferred,
        baseCumulativeEur: nearZero(baseBenefitEur),
        delayedCumulativeEur: nearZero(delayedBenefitEur),
      })
    }
    const benefitDifferenceEur = nearZero(baseBenefitEur - delayedBenefitEur)
    const legacyDifferenceEur = nearZero(baseLegacy - delayedLegacy)
    const additionalDelayCostEur =
      input.extraCostPerMonthEur === null ? null : input.extraCostPerMonthEur * Math.min(delay, horizon)
    const deferredProjectCostEur =
      input.projectOnceEur === null ? null : nearZero(baseProject - delayedProject)
    const netDifferenceEur =
      additionalDelayCostEur === null || deferredProjectCostEur === null || input.legacyMonthlyEur === null
        ? null
        : nearZero(benefitDifferenceEur + legacyDifferenceEur + additionalDelayCostEur - deferredProjectCostEur)
    // Nur bei dokumentiert festem Wirkungsende: verpasste Monate werden im Modell nicht nachgeholt.
    const irreversibleBenefitEur =
      input.benefitEndMonth !== null && input.expiry === 'fixed' && input.benefitEndMonth <= horizon
        ? benefitDifferenceEur
        : null
    return {
      delayMonths: delay,
      baseBenefitEur: nearZero(baseBenefitEur),
      delayedBenefitEur: nearZero(delayedBenefitEur),
      benefitDifferenceEur,
      legacyDifferenceEur,
      additionalDelayCostEur,
      deferredProjectCostEur,
      netDifferenceEur,
      irreversibleBenefitEur,
      months,
    }
  })
  return { success: true, horizonMonths: horizon, scenarios, questions, unverified: input.evidence !== 'customer-reviewed' }
}
