export type QuickPaybackField =
  | 'upfrontInvestmentEur'
  | 'annualRealizableBenefitEur'
  | 'annualIncrementalOperatingCostEur'

export type QuickPaybackInput = Record<QuickPaybackField, string>
export type QuickPaybackNumbers = Record<QuickPaybackField, number>

export type QuickPaybackResult =
  | { kind: 'empty' }
  | { kind: 'invalid'; issues: Partial<Record<QuickPaybackField, string>> }
  | {
      kind: 'payback' | 'zero-investment' | 'no-payback' | 'no-financial-gain'
      inputs: QuickPaybackNumbers
      annualNetBenefitEur: number
      monthlyNetBenefitEur: number
      months: number | null
    }

const MAX_AMOUNT = 1_000_000_000_000
const DECIMAL_DE = /^(?:\d+|\d{1,3}(?:\.\d{3})+)(?:,\d{1,2})?$/

export function parseEuroInput(raw: string): number | null {
  const normalized = raw.trim()
  if (!DECIMAL_DE.test(normalized)) return null
  const value = Number(normalized.replaceAll('.', '').replace(',', '.'))
  return Number.isFinite(value) && value >= 0 && value <= MAX_AMOUNT ? value : null
}

export function calculateQuickPayback(input: QuickPaybackInput): QuickPaybackResult {
  if (Object.values(input).some((raw) => raw.trim() === '')) return { kind: 'empty' }

  const issues: Partial<Record<QuickPaybackField, string>> = {}
  const parsed: Partial<QuickPaybackNumbers> = {}
  const names: Record<QuickPaybackField, string> = {
    upfrontInvestmentEur: 'Anfangsinvestition',
    annualRealizableBenefitEur: 'Jährlicher Bruttonutzen',
    annualIncrementalOperatingCostEur: 'Jährliche Zusatzkosten',
  }

  for (const key of Object.keys(names) as QuickPaybackField[]) {
    const value = parseEuroInput(input[key])
    if (value === null) {
      issues[key] = names[key] + ': Bitte eine nicht negative Zahl bis 1 Billion EUR eingeben (z. B. 12.345,67).'
    } else {
      parsed[key] = value
    }
  }
  if (Object.keys(issues).length > 0) return { kind: 'invalid', issues }

  const inputs = parsed as QuickPaybackNumbers
  const annualNetBenefitEur = inputs.annualRealizableBenefitEur - inputs.annualIncrementalOperatingCostEur
  const monthlyNetBenefitEur = annualNetBenefitEur / 12
  const base = { inputs, annualNetBenefitEur, monthlyNetBenefitEur }

  if (inputs.upfrontInvestmentEur === 0 && annualNetBenefitEur <= 0) {
    return { kind: 'no-financial-gain', ...base, months: null }
  }
  if (inputs.upfrontInvestmentEur === 0) {
    return { kind: 'zero-investment', ...base, months: 0 }
  }
  if (annualNetBenefitEur <= 0) {
    return { kind: 'no-payback', ...base, months: null }
  }

  return {
    kind: 'payback',
    ...base,
    months: (inputs.upfrontInvestmentEur * 12) / annualNetBenefitEur,
  }
}

export function formatEuro(value: number, maximumFractionDigits = 2): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits,
  }).format(value)
}

export function formatMonths(value: number): string {
  if (value > 0 && value < 0.05) return 'unter 0,1'
  return new Intl.NumberFormat('de-DE', { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(value)
}

export function buildQuickPaybackSummary(
  result: Exclude<QuickPaybackResult, { kind: 'empty' } | { kind: 'invalid' }>,
): string {
  const { inputs, annualNetBenefitEur, monthlyNetBenefitEur, months } = result
  const costs = formatEuro(inputs.annualIncrementalOperatingCostEur)
  const intro =
    'Modellrechnung / Schätzung: ' +
    formatEuro(inputs.upfrontInvestmentEur) +
    ' einmalige Anfangsinvestition, ' +
    formatEuro(inputs.annualRealizableBenefitEur) +
    ' realisierbarer Bruttonutzen pro Jahr und ' +
    costs +
    ' zusätzliche laufende Kosten pro Jahr. '
  const net = 'Angenommener Nettonutzen: ' + formatEuro(annualNetBenefitEur) +
    ' pro Jahr (' + formatEuro(monthlyNetBenefitEur, 4) + ' pro Monat). '
  let conclusion: string
  if (result.kind === 'payback' && months !== null) {
    conclusion = 'Einfacher, undiskontierter Payback: ' + formatMonths(months) + ' Monate ab Beginn des regelmäßigen Nutzenzuflusses. '
  } else if (result.kind === 'zero-investment') {
    conclusion = 'Rechnerisch 0 Monate ab Nutzenbeginn, weil keine Anfangsinvestition angesetzt ist. '
  } else {
    conclusion = 'Unter diesen Annahmen kein positiver einfacher Payback ableitbar. '
  }
  return intro + net + conclusion +
    'Konstanter Nutzen und konstante Zusatzkosten unterstellt; Anlaufphase, variable Zahlungsströme, Steuern und Kapitalkosten nicht berücksichtigt. Zahlen und Realisierbarkeit sind vor einer Investitionsentscheidung kundenseitig zu validieren.'
}
