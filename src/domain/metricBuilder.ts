import {
  annualMetricPotential,
  newMetric,
  type CustomerMetric,
  type MetricEvidence,
  type MetricFormula,
} from './softwarePayback'

export type InputNumber = number | ''
export type MetricPeriod = 'monthly' | 'annual'
export type RealizationMechanism =
  'unresolved' | 'avoidable-cost' | 'avoided-hiring' | 'avoided-external' | 'incremental-margin' | 'reduced-error-cost'

export interface MetricBuilderDraft {
  problem: string
  process: string
  consequence: string
  outcome: string
  formula: MetricFormula
  period: MetricPeriod
  volume: InputNumber
  before: InputNumber
  after: InputNumber
  hourlyCost: InputNumber
  valuePerEvent: InputNumber
  beforeText: string
  afterText: string
  evidence: MetricEvidence
  assumptionNote: string
  effectGroup: string
  mechanism: RealizationMechanism
  realizationNote: string
  realizedAnnual: InputNumber
  startMonth: InputNumber
  rampMonths: InputNumber
}

export interface MetricBuilderResult {
  complete: boolean
  issues: string[]
  questions: string[]
  potentialEur: number | null
  realizedEur: number | null
  operatingChange: number | null
  beforeText: string
  afterText: string
  calculation: string
  metric: CustomerMetric | null
  transfer: CustomerMetric[]
}

const MAX = 1_000_000_000_000
const MONEY = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 2 })
const NUMBER = new Intl.NumberFormat('de-DE', { maximumFractionDigits: 2 })
export const euro = (value: number): string => MONEY.format(value)
export const decimal = (value: number): string => NUMBER.format(value)

export const metricTypeLabels: Record<MetricFormula, string> = {
  direct: 'Direkte Kostenreduzierung',
  process: 'Geringere Kosten pro Vorgang',
  time: 'Zeitersparnis / Kapazitätsgewinn',
  conversion: 'Höhere Conversion / Deckungsbeitrag',
  quality: 'Weniger Fehler / Qualitätskosten',
  risk: 'Risikoreduktion',
  qualitative: 'Qualitative Verbesserung',
}

export const evidenceLabels: Record<MetricEvidence, string> = {
  hypothesis: 'Hypothese / Annahme',
  reference: 'Referenzwert / M1-Proof-Point',
  'customer-stated': 'Kundenaussage (nicht unabhängig geprüft)',
  'customer-reviewed': 'Mit dem Kunden geprüft (manuell bestätigt)',
}

export const customerEvidenceLabels: Record<MetricEvidence, string> = {
  hypothesis: 'Ungeprüfte Annahme',
  reference: 'Referenzwert eines anderen Unternehmens, nicht kundenseitig überprüft',
  'customer-stated': 'Kundenaussage, nicht unabhängig geprüft',
  'customer-reviewed': 'Nach eigener Dokumentation mit dem Kunden geprüft',
}

export const mechanismLabels: Record<RealizationMechanism, string> = {
  unresolved: 'Noch nicht geklärt',
  'avoidable-cost': 'Konkreter laufender Kostenblock sinkt',
  'avoided-hiring': 'Geplante zusätzliche Stelle wird nachweisbar vermieden',
  'avoided-external': 'Externe Leistungen / Überstunden entfallen',
  'incremental-margin': 'Zusätzlicher Deckungsbeitrag entsteht',
  'reduced-error-cost': 'Tatsächliche Fehler- und Nacharbeitskosten entfallen',
}

export function emptyMetricDraft(): MetricBuilderDraft {
  return {
    problem: '',
    process: '',
    consequence: '',
    outcome: '',
    formula: 'time',
    period: 'annual',
    volume: '',
    before: '',
    after: '',
    hourlyCost: '',
    valuePerEvent: '',
    beforeText: '',
    afterText: '',
    evidence: 'hypothesis',
    assumptionNote: '',
    effectGroup: '',
    mechanism: 'unresolved',
    realizationNote: '',
    realizedAnnual: '',
    startMonth: 1,
    rampMonths: 1,
  }
}

function numberValue(value: InputNumber): number | null {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= MAX ? value : null
}

function questionFor(
  value: InputNumber,
  field: string,
  questions: string[],
  issues: string[],
  question: string,
): number | null {
  const parsed = numberValue(value)
  if (parsed === null) {
    issues.push(field + ': Bitte eine gültige Zahl von 0 bis 1 Billion eingeben.')
    questions.push(question)
  }
  return parsed
}

function periodFactor(period: MetricPeriod): number {
  return period === 'monthly' ? 12 : 1
}

function defaultTreatment(formula: MetricFormula): CustomerMetric['treatment'] {
  if (formula === 'time') return 'capacity'
  if (formula === 'risk') return 'risk'
  return 'nonfinancial'
}

export function buildMetric(draft: MetricBuilderDraft): MetricBuilderResult {
  const issues: string[] = []
  const questions: string[] = []
  const nonFinancial = draft.formula === 'risk' || draft.formula === 'qualitative'
  const factor = periodFactor(draft.period)
  const validFormula = Object.hasOwn(metricTypeLabels, draft.formula)
  const validPeriod = draft.period === 'monthly' || draft.period === 'annual'
  const validEvidence = Object.hasOwn(evidenceLabels, draft.evidence)
  const validMechanism = Object.hasOwn(mechanismLabels, draft.mechanism)
  if (!validFormula) issues.push('Unbekannter Metric-Typ.')
  if (!validPeriod) issues.push('Betrachtungszeitraum muss Monat oder Jahr sein.')
  if (!validEvidence) issues.push('Unbekannte Evidenzkategorie.')
  if (!validMechanism) issues.push('Unbekannter Realisierungsmechanismus.')
  if (!draft.problem.trim()) questions.push('Welches konkrete Kundenproblem soll verbessert werden?')
  if (!draft.process.trim()) questions.push('In welchem Geschäftsprozess entsteht das Problem?')
  if (!draft.outcome.trim()) questions.push('Welchen besseren Zustand möchte der Kunde erreichen?')

  let before: number | null = null
  let after: number | null = null
  let volume: number | null = null
  let hourly: number | null = null
  let perEvent: number | null = null
  let operatingChange: number | null = null
  let beforeText = draft.beforeText.trim()
  let afterText = draft.afterText.trim()
  let calculation = ''
  let potentialEur: number | null = null

  if (validFormula && validPeriod && draft.formula !== 'qualitative') {
    before = questionFor(
      draft.before,
      'Ausgangswert',
      questions,
      issues,
      draft.formula === 'risk'
        ? 'Wie häufig tritt das Risiko aktuell auf?'
        : 'Wie hoch ist der tatsächliche Ausgangswert des betroffenen Prozesses?',
    )
    after = questionFor(
      draft.after,
      'Zielwert',
      questions,
      issues,
      'Welcher Zielwert ist unter realistischen Bedingungen erreichbar?',
    )
    if (before !== null && after !== null) {
      const improvement = draft.formula === 'conversion' ? after - before : before - after
      if (improvement <= 0) {
        issues.push(
          improvement === 0
            ? 'Keine Verbesserung gegenüber dem Ausgangswert.'
            : 'Der Zielwert stellt eine Verschlechterung dar.',
        )
        questions.push('Welche Verbesserung ist tatsächlich erreichbar?')
      } else operatingChange = improvement
      if ((draft.formula === 'conversion' || draft.formula === 'quality') && (before > 100 || after > 100)) {
        issues.push('Prozentwerte müssen zwischen 0 und 100 liegen.')
        operatingChange = null
      }
    }
    if (draft.formula !== 'direct') {
      volume = questionFor(
        draft.volume,
        'Menge',
        questions,
        issues,
        'Wie viele Vorgänge, Kundenkontakte oder Risikoereignisse gibt es pro Monat oder Jahr?',
      )
    }
    if (draft.formula === 'time') {
      hourly = questionFor(
        draft.hourlyCost,
        'Vollkostensatz',
        questions,
        issues,
        'Welcher belastbare Vollkostensatz je Stunde liegt zugrunde?',
      )
    }
    if (draft.formula === 'conversion' || draft.formula === 'quality') {
      perEvent = questionFor(
        draft.valuePerEvent,
        'Wert je Ereignis',
        questions,
        issues,
        draft.formula === 'conversion'
          ? 'Welcher zusätzliche Deckungsbeitrag entsteht pro gewonnenem Abschluss (nicht Umsatz)?'
          : 'Welche tatsächlich vermeidbaren Fehlerkosten fallen je Fehler an?',
      )
    }
    if (operatingChange !== null && (draft.formula === 'direct' || volume !== null)) {
      const metric = newMetric('preview', draft.formula)
      metric.annualVolume = (volume ?? 0) * factor
      metric.before = before ?? 0
      metric.after = after ?? 0
      metric.hourlyCostEur = hourly ?? 0
      metric.valuePerEventEur = perEvent ?? 0
      if (draft.formula === 'direct') metric.annualAmountEur = operatingChange * factor
      // Kein finanzieller Erwartungswert für Risiko ohne nachvollziehbare Risikomodellierung.
      if (
        draft.formula !== 'risk' &&
        (draft.formula !== 'time' || hourly !== null) &&
        ((draft.formula !== 'conversion' && draft.formula !== 'quality') || perEvent !== null)
      ) {
        const value = annualMetricPotential(metric)
        if (value !== null && Number.isFinite(value) && value >= 0 && value <= MAX) potentialEur = value
        else issues.push('Das rechnerische Potenzial liegt außerhalb des zulässigen Bereichs.')
      }
      if (draft.formula === 'risk') {
        calculation =
          decimal(volume ?? 0) +
          ' Ereignisse je ' +
          (draft.period === 'monthly' ? 'Monat' : 'Jahr') +
          ' × (' +
          decimal(before ?? 0) +
          ' − ' +
          decimal(after ?? 0) +
          ') = ' +
          decimal((volume ?? 0) * operatingChange * factor) +
          ' vermiedene Risikoereignisse/Jahr (keine EUR-Bewertung).'
      } else if (draft.formula === 'direct') {
        calculation =
          '(' +
          euro(before ?? 0) +
          ' − ' +
          euro(after ?? 0) +
          ') × ' +
          factor +
          ' = ' +
          (potentialEur === null ? 'noch offen' : euro(potentialEur) + '/Jahr') +
          '.'
      } else {
        const parts =
          draft.formula === 'time'
            ? decimal(metric.annualVolume) +
              ' Vorgänge/Jahr × ' +
              decimal(operatingChange) +
              ' Min. ÷ 60 × ' +
              euro(hourly ?? 0) +
              '/h'
            : draft.formula === 'process'
              ? decimal(metric.annualVolume) + ' Vorgänge/Jahr × ' + euro(operatingChange) + '/Vorgang'
              : decimal(metric.annualVolume) +
                ' Vorgänge/Jahr × ' +
                decimal(operatingChange) +
                ' Prozentpunkte ÷ 100 × ' +
                euro(perEvent ?? 0) +
                '/Ereignis'
        calculation = parts + ' = ' + (potentialEur === null ? 'noch offen' : euro(potentialEur) + '/Jahr') + '.'
      }
    }
    const unit =
      draft.formula === 'time'
        ? 'Minuten/Vorgang'
        : draft.formula === 'quality' || draft.formula === 'conversion'
          ? '%'
          : draft.formula === 'process'
            ? 'EUR/Vorgang'
            : draft.formula === 'direct'
              ? 'EUR/' + (draft.period === 'monthly' ? 'Monat' : 'Jahr')
              : 'Ereignisse/Vorgang'
    if (before !== null) beforeText = decimal(before) + ' ' + unit
    if (after !== null) afterText = decimal(after) + ' ' + unit
  }

  if (draft.formula === 'qualitative') {
    if (!beforeText) questions.push('Wie lässt sich der heutige Zustand konkret beschreiben?')
    if (!afterText) questions.push('Woran wird der bessere Zustand erkennbar sein?')
    calculation = 'Qualitativer Vorher-nachher-Vergleich. Kein EUR-Wert berechnet.'
  }
  if (draft.evidence === 'reference')
    questions.push('Wie lässt sich überprüfen, ob der Referenzwert unter den Bedingungen dieses Kunden erreichbar ist?')
  if (draft.evidence === 'customer-stated')
    questions.push('Mit welchen Daten kann die Kundenaussage unabhängig abgeglichen werden?')
  if (draft.evidence === 'hypothesis') questions.push('Wer beim Kunden kann Ausgangswerte und Annahmen überprüfen?')
  if (draft.evidence === 'customer-reviewed' && !draft.assumptionNote.trim()) {
    issues.push('Für „mit dem Kunden geprüft“ bitte Quelle, Datum oder geprüfte Annahmen dokumentieren.')
    questions.push('Mit wem und anhand welcher konkreten Zahlen wurden die Annahmen geprüft?')
  }

  const start = numberValue(draft.startMonth)
  const ramp = numberValue(draft.rampMonths)
  if (start === null || !Number.isInteger(start) || start < 1 || start > 60)
    issues.push('Nutzenbeginn: Monat 1 bis 60 eingeben.')
  if (ramp === null || !Number.isInteger(ramp) || ramp < 1 || ramp > 60)
    issues.push('Ramp-up: 1 bis 60 Monate eingeben.')
  const validTiming = start !== null && ramp !== null && start + ramp <= 61

  let realizedEur: number | null = null
  const mechanismSelected = draft.mechanism !== 'unresolved' && validMechanism
  if (mechanismSelected && !nonFinancial) {
    const claim = numberValue(draft.realizedAnnual)
    if (claim === null) issues.push('Realisierbarer Jahresbetrag fehlt oder ist ungültig.')
    else if (potentialEur === null) issues.push('Realisierung erst nach gültiger operativer Berechnung möglich.')
    else if (claim > potentialEur + 0.005)
      issues.push('Der realisierbare Betrag darf das berechnete Potenzial nicht übersteigen.')
    else if (claim === 0)
      questions.push('Welcher Kostenblock entfällt tatsächlich, oder bleibt der Nutzen ein Kapazitätsgewinn?')
    else if (draft.realizationNote.trim().length < 12)
      issues.push('Konkreten Realisierungsmechanismus mit mindestens 12 Zeichen erläutern.')
    else if (
      (draft.formula === 'conversion' && draft.mechanism !== 'incremental-margin') ||
      (draft.formula === 'quality' && draft.mechanism !== 'reduced-error-cost') ||
      ((draft.formula === 'direct' || draft.formula === 'process' || draft.formula === 'time') &&
        (draft.mechanism === 'incremental-margin' || draft.mechanism === 'reduced-error-cost'))
    )
      issues.push('Der gewählte Realisierungsmechanismus passt nicht zum Metric-Typ.')
    else realizedEur = claim
  } else if (nonFinancial && draft.mechanism !== 'unresolved') {
    issues.push('Risiko- und qualitative Metrics werden hier nicht monetarisiert.')
  } else if (!nonFinancial) {
    questions.push(
      draft.formula === 'time'
        ? 'Entfallen durch den Kapazitätsgewinn echte Ausgaben oder entstehen zunächst nur freie Stunden?'
        : draft.formula === 'conversion'
          ? 'Wie entsteht aus zusätzlichen Abschlüssen ein tatsächlich zusätzlicher Deckungsbeitrag?'
          : 'Welche konkrete Ausgabe entfällt oder wird nachweisbar vermieden?',
    )
  }
  if (mechanismSelected && !draft.effectGroup.trim()) {
    questions.push('Zu welcher wirtschaftlichen Wirkung gehört dieser Effekt, damit nichts doppelt gezählt wird?')
    issues.push('Eine Wirkungsgruppe für den finanziellen Effekt fehlt.')
  }
  if (!validTiming) issues.push('Nutzenbeginn und Ramp-up müssen innerhalb von 60 Monaten liegen.')

  const complete =
    validFormula &&
    validPeriod &&
    validEvidence &&
    validMechanism &&
    Boolean(draft.problem.trim() && draft.process.trim() && draft.outcome.trim()) &&
    (draft.formula === 'qualitative'
      ? Boolean(beforeText && afterText)
      : operatingChange !== null && (draft.formula === 'risk' || potentialEur !== null)) &&
    issues.length === 0

  let metric: CustomerMetric | null = null
  const transfer: CustomerMetric[] = []
  if (complete) {
    metric = newMetric('metric-builder-preview', draft.formula)
    metric.name = (draft.process.trim() || draft.problem.trim()).slice(0, 140)
    metric.formula = draft.formula
    metric.treatment = defaultTreatment(draft.formula)
    metric.evidence = draft.evidence
    metric.evidenceNote = [
      draft.problem.trim(),
      draft.assumptionNote.trim(),
      'Realisierung: ' + mechanismLabels[draft.mechanism],
      draft.realizationNote.trim(),
    ]
      .filter(Boolean)
      .join(' | ')
    metric.effectGroup = draft.effectGroup.trim() || 'metric-builder'
    metric.annualVolume = (volume ?? 0) * factor
    metric.before = before ?? 0
    metric.after = after ?? 0
    metric.hourlyCostEur = hourly ?? 0
    metric.valuePerEventEur = perEvent ?? 0
    metric.annualAmountEur = draft.formula === 'direct' ? (potentialEur ?? 0) : 0
    metric.startMonth = start ?? 1
    metric.rampMonths = ramp ?? 1
    metric.included = false
    // Partial economic realization needs its own direct amount, otherwise the
    // existing Payback engine would count the *whole* operational potential.
    if (
      realizedEur !== null &&
      potentialEur !== null &&
      realizedEur > 0 &&
      Math.abs(realizedEur - potentialEur) < 0.005
    ) {
      metric.treatment = 'realized'
    }
    transfer.push(metric)
    if (
      realizedEur !== null &&
      potentialEur !== null &&
      realizedEur > 0 &&
      Math.abs(realizedEur - potentialEur) >= 0.005
    ) {
      const financial = newMetric('metric-builder-realized', 'direct')
      financial.name = (metric.name + ' – realisierbarer Anteil').slice(0, 140)
      financial.treatment = 'realized'
      financial.evidence = draft.evidence
      financial.evidenceNote =
        metric.evidenceNote + ' | Nur nachweisbar realisierbarer Teil des Potenzials: ' + euro(realizedEur) + '/Jahr.'
      financial.effectGroup = metric.effectGroup
      financial.annualAmountEur = realizedEur
      financial.startMonth = metric.startMonth
      financial.rampMonths = metric.rampMonths
      financial.included = false
      transfer.push(financial)
    }
  }

  return {
    complete,
    issues,
    questions: Array.from(new Set(questions)),
    potentialEur,
    realizedEur,
    operatingChange,
    beforeText,
    afterText,
    calculation,
    metric,
    transfer,
  }
}

export function metricSummary(draft: MetricBuilderDraft, result: MetricBuilderResult): string {
  const lines = [
    'Kundenproblem: ' + (draft.problem.trim() || 'noch zu beschreiben'),
    'Zielbild: ' + (draft.outcome.trim() || 'noch zu beschreiben'),
    'Vergleich: ' + (result.beforeText || 'offen') + ' → ' + (result.afterText || 'offen'),
    'Rechenweg: ' + (result.calculation || 'noch nicht vollständig'),
    'Rechnerisches Potenzial: ' +
      (result.potentialEur === null ? 'nicht bezifferbar' : euro(result.potentialEur) + '/Jahr'),
    'Wirtschaftlich realisierbar: ' +
      (result.realizedEur === null ? 'nicht nachgewiesen / nicht angesetzt' : euro(result.realizedEur) + '/Jahr'),
    'Annahmenstand: ' + customerEvidenceLabels[draft.evidence],
  ]
  if (draft.assumptionNote.trim()) lines.push('Datenbasis: ' + draft.assumptionNote.trim())
  if (draft.realizationNote.trim()) lines.push('Realisierung: ' + draft.realizationNote.trim())
  if (result.questions.length) lines.push('Offen: ' + result.questions.join(' '))
  if (!result.complete) lines.push('Unvollständige Modellrechnung: keine finanzielle Aussage ableitbar.')
  return lines.join('\n')
}

/** Fiktive Lehrbeispiele; niemals als Referenzbelege verwenden. */
export const metricDemos: Record<string, Partial<MetricBuilderDraft>> = {
  crm: {
    problem: 'Manuelle Datenpflege bindet Servicezeit.',
    process: 'CRM-Datenpflege',
    consequence: 'Weniger Zeit für Kundenanliegen',
    outcome: 'Erfassungszeit je Vorgang senken',
    formula: 'time',
    volume: 25000,
    before: 12,
    after: 8,
    hourlyCost: 55,
    period: 'annual',
    evidence: 'hypothesis',
    mechanism: 'unresolved',
    effectGroup: 'crm-datenpflege',
  },
  service: {
    problem: 'Externe Nachbearbeitung ist zu teuer.',
    process: 'Servicebearbeitung',
    outcome: 'Kosten pro Vorgang senken',
    formula: 'process',
    volume: 15000,
    before: 12,
    after: 8,
    period: 'annual',
    evidence: 'hypothesis',
    mechanism: 'avoided-external',
    realizedAnnual: 60000,
    realizationNote: 'Externer Dienstleister reduziert die jährliche Rechnung um 60.000 EUR.',
    effectGroup: 'service-extern',
  },
  sales: {
    problem: 'Zu wenige qualifizierte Angebote werden gewonnen.',
    process: 'Angebotsprozess',
    outcome: 'Abschlussquote verbessern',
    formula: 'conversion',
    volume: 1200,
    before: 20,
    after: 24,
    valuePerEvent: 4000,
    evidence: 'hypothesis',
    mechanism: 'incremental-margin',
    realizedAnnual: 192000,
    realizationNote: 'Zusätzlicher Deckungsbeitrag durch tatsächlich zusätzlich gewonnene Abschlüsse.',
    effectGroup: 'vertrieb-conversion',
  },
  quality: {
    problem: 'Fehler verursachen Nacharbeit und Nachbesserung.',
    process: 'Auftragsbearbeitung',
    outcome: 'Fehlerquote senken',
    formula: 'quality',
    volume: 20000,
    before: 5,
    after: 3,
    valuePerEvent: 80,
    evidence: 'hypothesis',
    mechanism: 'reduced-error-cost',
    realizedAnnual: 32000,
    realizationNote: 'Vermiedene externe Nachbesserungskosten gemäß künftig zu prüfenden Rechnungen.',
    effectGroup: 'qualitaetskosten',
  },
  risk: {
    problem: 'Ausfälle gefährden kritische Serviceprozesse.',
    process: 'Serviceverfügbarkeit',
    outcome: 'Weniger Betriebsstörungen',
    formula: 'risk',
    volume: 1,
    before: 10,
    after: 5,
    evidence: 'hypothesis',
    mechanism: 'unresolved',
    effectGroup: 'service-risiko',
  },
}
