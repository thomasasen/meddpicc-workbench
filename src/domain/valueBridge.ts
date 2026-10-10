import { summarizeBusinessCase, type CaseSummary } from './businessCase'
import { newMetric, type MetricEvidence, type SoftwarePaybackInput } from './softwarePayback'

export type ValueKind =
  'saving' | 'margin' | 'unclassified' | 'capacity' | 'potential' | 'revenue' | 'risk' | 'qualitative'
export type ValueOrigin = 'manual' | 'metric-builder' | 'software-business-case' | 'cost-of-delay'

export interface BridgeMetric {
  id: string
  name: string
  before: string
  after: string
  unit: string
  evidence: MetricEvidence
  source: string
  effectGroup: string
  kind: ValueKind
  annualPotentialEur: number | null
  annualRealizedEur: number | null
  realization: string
  included: boolean
  startMonth: number
  rampMonths: number
  origin: ValueOrigin
}

export interface ValueBridgeInput {
  situation: string
  pain: string
  consequence: string
  outcome: string
  change: string
  prerequisites: string
  customer: string
  horizonMonths: 36 | 60
  investmentEur: number | null
  saasMonthlyEur: number | null
  metrics: BridgeMetric[]
}

export interface ValueBridgeResult {
  issues: string[]
  questions: string[]
  financial: CaseSummary | null
  countedAnnualEur: number
  hasFinancialInputs: boolean
  overlap: string[]
  summary: string
}

export const bridgeEvidenceLabels: Record<MetricEvidence, string> = {
  hypothesis: 'Hypothese, ungeprüft',
  reference: 'Referenzwert, nicht kundenspezifisch geprüft',
  'customer-stated': 'Vom Kunden genannt, nicht geprüft',
  'customer-reviewed': 'Laut eigener Dokumentation mit dem Kunden geprüft',
}
export const bridgeKindLabels: Record<ValueKind, string> = {
  saving: 'Realisierbare Kostenvermeidung',
  margin: 'Zusätzlicher Deckungsbeitrag',
  unclassified: 'Finanzielle Wirkung: Einsparung oder Deckungsbeitrag noch zu klären',
  capacity: 'Freigesetzte Kapazität, keine EUR-Ersparnis',
  potential: 'Theoretisches Potenzial, keine EUR-Realisierung',
  revenue: 'Zusätzlicher erwarteter Umsatz, kein gesicherter Deckungsbeitrag',
  risk: 'Risikoreduzierung, nicht monetarisiert',
  qualitative: 'Qualitative Wirkung',
}

const MAX = 1_000_000_000_000
const isAmount = (value: number | null): value is number =>
  typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= MAX

export function blankBridgeMetric(id: string): BridgeMetric {
  return {
    id,
    name: '',
    before: '',
    after: '',
    unit: '',
    evidence: 'hypothesis',
    source: '',
    effectGroup: '',
    kind: 'qualitative',
    annualPotentialEur: null,
    annualRealizedEur: null,
    realization: '',
    included: false,
    startMonth: 1,
    rampMonths: 1,
    origin: 'manual',
  }
}

export function blankValueBridge(): ValueBridgeInput {
  return {
    situation: '',
    pain: '',
    consequence: '',
    outcome: '',
    change: '',
    prerequisites: '',
    customer: '',
    horizonMonths: 36,
    investmentEur: null,
    saasMonthlyEur: null,
    metrics: [blankBridgeMetric('metric-1')],
  }
}

export function evaluateValueBridge(input: ValueBridgeInput): ValueBridgeResult {
  const issues: string[] = []
  const questions: string[] = []
  const overlap: string[] = []
  const seenIds = new Set<string>()
  const seenGroups = new Map<string, string>()
  const validKinds: ValueKind[] = [
    'saving',
    'margin',
    'unclassified',
    'capacity',
    'potential',
    'revenue',
    'risk',
    'qualitative',
  ]
  const validEvidence: MetricEvidence[] = ['hypothesis', 'reference', 'customer-stated', 'customer-reviewed']
  if (!input.pain.trim()) questions.push('Welches konkrete Kundenproblem soll gelöst werden?')
  if (!input.consequence.trim()) questions.push('Welche Konsequenz hat das Problem für das Geschäft?')
  if (!input.outcome.trim()) questions.push('Welches Ergebnis soll erreicht werden?')
  if (!input.change.trim()) questions.push('Wie ermöglicht die geplante Veränderung dieses Ergebnis?')
  if (!input.prerequisites.trim()) questions.push('Welche Voraussetzungen müssen beim Kunden erfüllt sein?')
  if (input.horizonMonths !== 36 && input.horizonMonths !== 60) issues.push('Ungültiger Betrachtungshorizont.')
  if (input.metrics.length > 15) issues.push('Maximal 15 Metrics pro Value Bridge.')
  if (input.investmentEur !== null && !isAmount(input.investmentEur)) issues.push('Ungültige Investitionskosten.')
  if (input.saasMonthlyEur !== null && !isAmount(input.saasMonthlyEur)) issues.push('Ungültige laufende Kosten.')

  for (const [i, metric] of input.metrics.entries()) {
    const where = 'Metric ' + (i + 1)
    if (!metric.id || seenIds.has(metric.id)) issues.push(where + ': doppelte oder leere ID.')
    seenIds.add(metric.id)
    if (!metric.name.trim()) questions.push(where + ': Was genau wird gemessen?')
    if (!metric.before.trim() || !metric.after.trim()) {
      questions.push(where + ': Wie lauten Ausgangswert und Zielwert?')
    }
    if (!validEvidence.includes(metric.evidence)) issues.push(where + ': Evidenzstatus ungültig.')
    if (!validKinds.includes(metric.kind)) issues.push(where + ': Wirkungsart ungültig.')
    if (metric.evidence === 'customer-reviewed' && !metric.source.trim())
      issues.push(where + ': Eine kundenseitige Prüfung benötigt einen benannten Beleg.')
    if (!metric.source.trim()) questions.push(where + ': Wie und durch wen wird der Wert geprüft?')
    if (metric.annualPotentialEur !== null && !isAmount(metric.annualPotentialEur))
      issues.push(where + ': Potenzial außerhalb des gültigen EUR-Bereichs.')
    if (metric.annualRealizedEur !== null && !isAmount(metric.annualRealizedEur))
      issues.push(where + ': realisierbarer Betrag außerhalb des gültigen EUR-Bereichs.')
    if (
      !Number.isInteger(metric.startMonth) ||
      metric.startMonth < 1 ||
      metric.startMonth > input.horizonMonths ||
      !Number.isInteger(metric.rampMonths) ||
      metric.rampMonths < 1 ||
      metric.rampMonths > input.horizonMonths
    )
      issues.push(where + ': Nutzenstart oder Ramp-up ungültig.')

    const financialKind = metric.kind === 'saving' || metric.kind === 'margin'
    if (metric.included) {
      if (!financialKind) issues.push(where + ': diese Wirkungsart darf nicht als realisierter EUR-Nutzen zählen.')
      if (!metric.name.trim() || !metric.before.trim() || !metric.after.trim())
        issues.push(where + ': für die EUR-Anrechnung müssen Metric, Ausgangs- und Zielwert beschrieben sein.')
      if (!isAmount(metric.annualRealizedEur) || metric.annualRealizedEur <= 0)
        issues.push(where + ': realisierbarer Jahresbetrag fehlt.')
      if (!metric.realization.trim()) issues.push(where + ': konkreter Realisierungsmechanismus fehlt.')
      if (!metric.effectGroup.trim()) issues.push(where + ': Wirkungsgruppe zur Doppelzählungsprüfung fehlt.')
      if (
        metric.annualPotentialEur !== null &&
        isAmount(metric.annualRealizedEur) &&
        metric.annualRealizedEur > metric.annualPotentialEur
      )
        issues.push(where + ': realisierter Wert übersteigt rechnerisches Potenzial.')
      if (!metric.before.trim() || !metric.after.trim()) {
        questions.push(where + ': Die Messgröße muss noch quantifiziert werden.')
      }
      if (metric.evidence !== 'customer-reviewed')
        questions.push(where + ': Finanzwert ist eine noch nicht gemeinsam geprüfte Modellannahme.')
      const key = metric.effectGroup.trim().toLocaleLowerCase('de-DE')
      if (key) {
        const other = seenGroups.get(key)
        if (other) overlap.push(other + ' / ' + metric.name + ' (' + metric.effectGroup + ')')
        else seenGroups.set(key, metric.name)
      }
    }
    if (metric.kind === 'capacity' && metric.annualPotentialEur !== null)
      questions.push(where + ': Rechnerischer Zeitwert ist kein eingesparter Geldbetrag.')
    if (metric.kind === 'potential' || metric.kind === 'risk' || metric.kind === 'revenue')
      questions.push(where + ': Potenzial, Umsatzerwartung oder Risiko nicht als sichere Einsparung ausweisen.')
    if (metric.kind === 'unclassified')
      questions.push(
        where + ': Bitte zwischen tatsächlich vermeidbaren Kosten und zusätzlichem Deckungsbeitrag unterscheiden.',
      )
    if (metric.kind === 'margin')
      questions.push(where + ': Bitte zusätzlichen Deckungsbeitrag statt Umsatz validieren.')
  }
  for (const conflict of overlap) issues.push('Mögliche Doppelzählung: ' + conflict)
  const hasFinancialInputs = isAmount(input.investmentEur) && isAmount(input.saasMonthlyEur)
  const countedAnnualEur = issues.length
    ? 0
    : input.metrics
        .filter((m) => m.included && (m.kind === 'saving' || m.kind === 'margin'))
        .reduce((sum, m) => sum + (m.annualRealizedEur ?? 0), 0)
  let financial: CaseSummary | null = null
  if (hasFinancialInputs && !issues.length && countedAnnualEur > 0) {
    const metrics = input.metrics
      .filter((m) => m.included)
      .map((m) => ({
        ...newMetric(m.id, 'direct'),
        name: m.name,
        annualAmountEur: m.annualRealizedEur ?? 0,
        treatment: 'realized' as const,
        included: true,
        effectGroup: m.effectGroup,
        evidence: m.evidence,
        evidenceNote: [m.source, m.realization].filter(Boolean).join(' | '),
        startMonth: m.startMonth,
        rampMonths: m.rampMonths,
      }))
    const model: SoftwarePaybackInput = {
      horizonMonths: input.horizonMonths,
      costs: [
        {
          id: 'investment',
          name: 'Einmalige Projektkosten',
          kind: 'one-time',
          amountEur: input.investmentEur!,
          period: 'monthly',
          startMonth: 0,
        },
        {
          id: 'saas',
          name: 'Zusätzliche laufende Kosten',
          kind: 'saas',
          amountEur: input.saasMonthlyEur!,
          period: 'monthly',
          startMonth: 1,
        },
      ],
      metrics,
    }
    financial = summarizeBusinessCase(model)
    if (!financial) issues.push('Die bestehende Business-Case-Engine hat die Finanzannahmen zurückgewiesen.')
  }
  if (!hasFinancialInputs) questions.push('Welche Investitions- und laufenden Kosten sind bekannt?')
  if (countedAnnualEur === 0)
    questions.push('Ist überhaupt eine realisierbare EUR-Wirkung belegt oder nur ein Potenzial?')
  const lines = [
    'VALUE BRIDGE' + (input.customer.trim() ? ' | ' + input.customer.trim() : ''),
    'Situation: ' + (input.situation.trim() || 'Offen'),
    'Pain: ' + (input.pain.trim() || 'Offen'),
    'Geschäftliche Konsequenz: ' + (input.consequence.trim() || 'Offen'),
    'Ziel: ' + (input.outcome.trim() || 'Offen'),
    'Ermöglichte Veränderung: ' + (input.change.trim() || 'Offen'),
    'Voraussetzungen: ' + (input.prerequisites.trim() || 'Offen'),
    ...input.metrics.map(
      (m) =>
        '- ' +
        (m.name || 'Metric offen') +
        ': ' +
        (m.before || '?') +
        ' → ' +
        (m.after || '?') +
        (m.unit ? ' ' + m.unit : '') +
        ' | ' +
        bridgeKindLabels[m.kind] +
        ' | ' +
        bridgeEvidenceLabels[m.evidence] +
        ' | Quelle: ' +
        (m.source || 'offen') +
        ' | EUR-Wirkung im Modell: ' +
        (m.included && (m.kind === 'saving' || m.kind === 'margin')
          ? String(m.annualRealizedEur) + ' EUR/Jahr'
          : 'nicht angerechnet'),
    ),
    financial
      ? 'Modell über ' +
        input.horizonMonths +
        ' Monate: Gesamtkosten ' +
        financial.totalCostEur.toFixed(2) +
        ' EUR; Nutzen ' +
        financial.benefitEur.toFixed(2) +
        ' EUR; Saldo ' +
        financial.netValueEur.toFixed(2) +
        ' EUR. Nur unter den dokumentierten Annahmen.'
      : 'Kein vollständiger finanzieller Business Case berechnet.',
    'Offene Prüfpunkte: ' + (questions.length ? questions.join(' ') : 'Keine zusätzlichen Fragen aus dem Regelwerk.'),
    ...(overlap.length ? ['Doppelzählungswarnung: ' + overlap.join('; ')] : []),
  ]
  return { issues, questions, financial, countedAnnualEur, hasFinancialInputs, overlap, summary: lines.join('\n') }
}

export const valueBridgeDemos: Record<string, ValueBridgeInput> = {
  service: {
    ...blankValueBridge(),
    customer: 'Fiktives CRM-Serviceunternehmen',
    situation: 'Ausgelagerte Ticket-Nachbearbeitung mit wiederkehrendem Dienstleisterbudget.',
    pain: 'Mehrfacherfassung und unnötige manuelle Nacharbeit.',
    consequence: 'Externe Servicekosten bleiben hoch.',
    outcome: 'Weniger manuelle Nacharbeit bei gleichem Service-Level.',
    change: 'CRM-Workflows und automatische Zuordnung reduzieren externe Leistungen.',
    prerequisites: 'Anbindung, Akzeptanztests, tatsächliche Vertragsreduzierung.',
    investmentEur: 60000,
    saasMonthlyEur: 500,
    metrics: [
      {
        ...blankBridgeMetric('service-1'),
        name: 'Wegfall externer Serviceleistungen',
        before: '6.000',
        after: '3.000',
        unit: 'EUR/Monat',
        kind: 'saving',
        effectGroup: 'externer-service',
        annualPotentialEur: 36000,
        annualRealizedEur: 36000,
        realization: 'Dienstleisterrechnung wird vertraglich reduziert.',
        included: true,
        source: 'Fiktive Annahmen, nicht kundenseitig überprüft',
        startMonth: 4,
        rampMonths: 2,
      },
    ],
  },
  sales: {
    ...blankValueBridge(),
    customer: 'Fiktives Vertriebsunternehmen',
    situation: 'Angebotsprozesse mit geringer Transparenz.',
    pain: 'Abschlüsse verzögern sich und Conversion ist gering.',
    consequence: 'Zusätzlicher Deckungsbeitrag ist unsicher.',
    outcome: 'Steigerung der Abschlussquote.',
    change: 'Qualifiziertere Angebote und Nachverfolgung.',
    prerequisites: 'Datenqualität und Bestätigung des Zusatzdeckungsbeitrags.',
    investmentEur: 90000,
    saasMonthlyEur: 1200,
    metrics: ['Abschlussquote', 'Zusätzlicher Deckungsbeitrag'].map((name, i) => ({
      ...blankBridgeMetric('sales-' + i),
      name,
      before: '20',
      after: '24',
      unit: '%',
      kind: 'margin' as const,
      effectGroup: 'sales-margin',
      annualPotentialEur: 192000,
      annualRealizedEur: 192000,
      realization: 'Nur unter Annahme zusätzlicher, profitabler Abschlüsse.',
      included: true,
      source: 'Fiktives Szenario ohne Kundenprüfung',
    })),
  },
  capacity: {
    ...blankValueBridge(),
    customer: 'Fiktives Qualitätsmanagement',
    situation: 'Viele manuelle Prüfungen.',
    pain: 'Nacharbeiten kosten Zeit.',
    consequence: 'Fachkräfte haben weniger Zeit für anspruchsvolle Vorgänge.',
    outcome: 'Schnellere Prüfungen mit stabiler Qualität.',
    change: 'Vorlagen und Automatisierung.',
    prerequisites: 'Pilotmessung und Nutzerakzeptanz.',
    metrics: [
      {
        ...blankBridgeMetric('capacity-1'),
        name: 'Zeit pro Vorgang',
        before: '12',
        after: '8',
        unit: 'Minuten',
        kind: 'capacity',
        source: 'Fiktive operative Hypothese, keine Kostenzusage',
      },
    ],
  },
}
