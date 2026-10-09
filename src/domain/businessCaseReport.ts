import type { CustomerMetric, SoftwarePaybackInput, SoftwarePaybackResult } from '../domain/softwarePayback'
import { annualMetricPotential } from '../domain/softwarePayback'

export interface CaseReport {
  customer: string
  project: string
  preparedBy: string
  date: string
  input: SoftwarePaybackInput
  result: Extract<SoftwarePaybackResult, { success: true }>
}
export interface InvestmentKpis {
  roiPercent: number | null
  investmentEur: number
  costEur: number
  benefitEur: number
  netEur: number
  lowestEur: number
  lowestMonth: number
}
export function investmentKpis(report: CaseReport): InvestmentKpis {
  const { result } = report
  const min = result.months.reduce(
    (lowest, m) => (m.cumulativeEur < lowest.cumulativeEur ? m : lowest),
    result.months[0]!,
  )
  return {
    roiPercent: result.costTotalEur > 0 ? (result.cumulativeEur / result.costTotalEur) * 100 : null,
    investmentEur: report.input.costs.filter((c) => c.kind === 'one-time').reduce((s, c) => s + c.amountEur, 0),
    costEur: result.costTotalEur,
    benefitEur: result.benefitTotalEur,
    netEur: result.cumulativeEur,
    lowestEur: min.cumulativeEur,
    lowestMonth: min.month,
  }
}
const euro = (v: number) =>
  new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(v)
const percent = (v: number) => new Intl.NumberFormat('de-DE', { maximumFractionDigits: 1 }).format(v) + ' %'
const safe = (s: string) =>
  s
    .replace(/[\r\n\t]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
const evidence = (m: CustomerMetric) =>
  ({
    hypothesis: 'Unbestätigte Hypothese',
    reference: 'Referenz / M1',
    'customer-stated': 'Kundenaussage',
    'customer-reviewed': 'Laut Nutzer kundenbesprochen',
  })[m.evidence]
const formula = (m: CustomerMetric) =>
  ({
    direct: 'Direkter EUR-Wert pro Jahr',
    process: 'Vorgangsmenge x Kostendifferenz',
    time: 'Zeitgewinn x Stundensatz (nur Kapazität)',
    conversion: 'Zusätzliche Abschlüsse x Deckungsbeitrag',
    quality: 'Weniger Fehler x vermeidbare Fehlerkosten',
    risk: 'Geschätzter Risikowert (nicht angerechnet)',
    qualitative: 'Qualitative Kennzahl (nicht monetarisiert)',
  })[m.formula]
const moneyWord = (v: number) => euro(v).replace('€', 'EUR')

// Browser-independent, deterministic PDF builder. Native PDF vector drawing, A4.
// No server, network, third-party font or PDF package. German umlauts use Windows-1252.
function latin(s: string): number[] {
  const out: number[] = []
  for (const ch of s) {
    const n = ch.charCodeAt(0)
    if (n <= 255) out.push(n)
    else if (ch === '€') out.push(128)
    else if (ch === '–' || ch === '—') out.push(45)
    else if (ch === '„' || ch === '“' || ch === '”') out.push(34)
    else if (ch === '×') out.push(120)
    else if (ch === '→') out.push(62)
    else out.push(63)
  }
  return out
}
function hex(s: string) {
  return latin(s)
    .map((n) => n.toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase()
}
const A4W = 595.28
const A4H = 841.89
class PdfPages {
  private pages: string[] = []
  private commands: string[] = []
  private y = 0
  private page = 0
  constructor() {
    this.begin('')
  }
  private add(s: string) {
    this.commands.push(s)
  }
  private rgb(c: [number, number, number], stroke = false) {
    return c.map((n) => n.toFixed(3)).join(' ') + (stroke ? ' RG' : ' rg')
  }
  begin(section: string) {
    if (this.commands.length) this.pages.push(this.commands.join('\n'))
    this.commands = []
    this.page += 1
    this.y = 78
    this.rect(0, A4H - 68, A4W, 68, [0.075, 0.126, 0.22])
    this.txt('BUSINESS CASE  /  SOFTWARE INVESTMENT', 42, 803, 10, true, [1, 1, 1])
    this.txt(section.toUpperCase() || 'EXECUTIVE SUMMARY', 42, 783, 8, false, [0.77, 0.85, 0.96])
  }
  rect(x: number, y: number, w: number, h: number, color: [number, number, number]) {
    this.add(this.rgb(color) + '\n' + [x, y, w, h].map((n) => n.toFixed(2)).join(' ') + ' re f')
  }
  line(x1: number, y1: number, x2: number, y2: number, color: [number, number, number], width = 1) {
    this.add(
      this.rgb(color, true) +
        '\n' +
        width +
        ' w ' +
        [x1, y1].map((n) => n.toFixed(2)).join(' ') +
        ' m ' +
        [x2, y2].map((n) => n.toFixed(2)).join(' ') +
        ' l S',
    )
  }
  txt(
    text: string,
    x: number,
    y: number,
    size = 10,
    bold = false,
    color: [number, number, number] = [0.09, 0.15, 0.24],
  ) {
    this.add(
      this.rgb(color) +
        '\nBT /' +
        (bold ? 'F2' : 'F1') +
        ' ' +
        size +
        ' Tf 1 0 0 1 ' +
        x.toFixed(2) +
        ' ' +
        y.toFixed(2) +
        ' Tm <' +
        hex(safe(text)) +
        '> Tj ET',
    )
  }
  space(n = 14) {
    this.y += n
  }
  heading(value: string) {
    if (this.y > 690) this.begin(value)
    this.txt(value, 42, A4H - this.y, 17, true)
    this.y += 30
  }
  private split(value: string, maxChars: number) {
    const words = safe(value).split(' ')
    const lines: string[] = []
    let cur = ''
    for (const word of words) {
      if ((cur + ' ' + word).trim().length > maxChars && cur) {
        lines.push(cur)
        cur = word
      } else cur = (cur + ' ' + word).trim()
    }
    if (cur) lines.push(cur)
    return lines
  }
  p(value: string, opts?: { bold?: boolean; color?: [number, number, number]; indent?: number }) {
    for (const line of this.split(value, 99 - (opts?.indent ?? 0) / 7)) {
      if (this.y > 756) this.begin('Fortsetzung')
      this.txt(line, 42 + (opts?.indent ?? 0), A4H - this.y, 10, opts?.bold, opts?.color)
      this.y += 16
    }
    this.y += 5
  }
  label(left: string, right: string) {
    if (this.y > 751) this.begin('Details')
    this.txt(left, 42, A4H - this.y, 10)
    this.txt(right, 360, A4H - this.y, 10, true)
    this.y += 21
    this.line(42, A4H - this.y + 5, 553, A4H - this.y + 5, [0.87, 0.9, 0.93], 0.6)
  }
  card(k: string, v: string, x: number, y: number, w: number) {
    this.rect(x, y, w, 73, [0.94, 0.96, 0.99])
    this.txt(k, x + 12, y + 52, 9, false, [0.3, 0.37, 0.48])
    this.txt(v, x + 12, y + 21, 16, true, [0.08, 0.22, 0.42])
  }
  chart(data: { month: number; cumulativeEur: number }[], w = 500, h = 190) {
    if (this.y > 525) this.begin('Wertentwicklung')
    const left = 55,
      top = A4H - this.y,
      bottom = top - h,
      right = left + w
    const values = data.map((x) => x.cumulativeEur)
    let low = Math.min(0, ...values),
      high = Math.max(0, ...values)
    if (low === high) {
      low -= 1
      high += 1
    }
    const pad = (high - low) * 0.12
    low -= pad
    high += pad
    const X = (m: number) => left + (m / (data[data.length - 1]?.month || 1)) * w
    const Y = (v: number) => bottom + ((v - low) / (high - low)) * h
    const zero = Y(0)
    this.line(left, zero, right, zero, [0.56, 0.63, 0.72], 1)
    this.txt('0 EUR', left, zero + 5, 8, false, [0.4, 0.45, 0.5])
    this.line(left, bottom, left, top, [0.78, 0.82, 0.88], 0.7)
    const negative = data.filter((x) => x.cumulativeEur < 0)
    const positive = data.filter((x) => x.cumulativeEur >= 0)
    if (negative.length) this.txt('INVESTMENTPHASE', left + 12, bottom + 12, 8, true, [0.65, 0.27, 0.26])
    if (positive.length) this.txt('WERTBEITRAG', right - 98, top - 12, 8, true, [0.14, 0.48, 0.35])
    for (let i = 1; i < data.length; i++) {
      const a = data[i - 1]!,
        b = data[i]!
      const c =
        b.cumulativeEur >= 0
          ? ([0.12, 0.48, 0.35] as [number, number, number])
          : ([0.16, 0.4, 0.86] as [number, number, number])
      this.line(X(a.month), Y(a.cumulativeEur), X(b.month), Y(b.cumulativeEur), c, 2)
    }
    for (const m of [0, 12, 24, 36, 48, 60].filter((x) => x <= data[data.length - 1]!.month)) {
      this.txt(String(m), X(m) - 4, bottom - 15, 8, false, [0.32, 0.38, 0.46])
    }
    this.y += h + 34
  }
  bytes(): Uint8Array {
    if (this.commands.length) this.pages.push(this.commands.join('\n'))
    const objects: string[] = ['']
    const add = (x: string) => {
      objects.push(x)
      return objects.length - 1
    }
    const catalog = add('')
    const pagesIndex = add('')
    const font1 = add('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>')
    const font2 = add('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>')
    const pids: number[] = []
    const enc = new TextEncoder()
    for (const [i, page] of this.pages.entries()) {
      const content =
        page +
        '\n' +
        this.rgb([0.45, 0.49, 0.55]) +
        '\nBT /F1 8 Tf 1 0 0 1 42 29 Tm <' +
        hex('Modellrechnung · vertraulich · Seite ' + (i + 1) + ' / ' + this.pages.length) +
        '> Tj ET'
      const len = enc.encode(content).length
      const stream = add('<< /Length ' + len + ' >>\nstream\n' + content + '\nendstream')
      pids.push(
        add(
          '<< /Type /Page /Parent ' +
            pagesIndex +
            ' 0 R /MediaBox [0 0 ' +
            A4W +
            ' ' +
            A4H +
            '] /Resources << /Font << /F1 ' +
            font1 +
            ' 0 R /F2 ' +
            font2 +
            ' 0 R >> >> /Contents ' +
            stream +
            ' 0 R >>',
        ),
      )
    }
    objects[catalog] = '<< /Type /Catalog /Pages ' + pagesIndex + ' 0 R >>'
    objects[pagesIndex] =
      '<< /Type /Pages /Kids [' + pids.map((i) => i + ' 0 R').join(' ') + '] /Count ' + pids.length + ' >>'
    let pdf = '%PDF-1.4\n%----\n'
    const positions = [0]
    for (let i = 1; i < objects.length; i++) {
      positions.push(enc.encode(pdf).length)
      pdf += i + ' 0 obj\n' + objects[i] + '\nendobj\n'
    }
    const xref = enc.encode(pdf).length
    pdf += 'xref\n0 ' + objects.length + '\n0000000000 65535 f \n'
    for (let i = 1; i < objects.length; i++) pdf += String(positions[i]).padStart(10, '0') + ' 00000 n \n'
    pdf += 'trailer\n<< /Size ' + objects.length + ' /Root ' + catalog + ' 0 R >>\nstartxref\n' + xref + '\n%%EOF'
    return enc.encode(pdf)
  }
}
export function createBusinessCasePdf(report: CaseReport): Uint8Array {
  const p = new PdfPages(),
    k = investmentKpis(report)
  p.heading(safe(report.project) || 'Softwareprojekt')
  p.p('Kunde: ' + (safe(report.customer) || 'Nicht angegeben'))
  p.p(
    'Erstellt von: ' +
      (safe(report.preparedBy) || 'Nicht angegeben') +
      '   |   Stand: ' +
      (safe(report.date) || 'Ohne Datum'),
  )
  p.p('VERTRAULICHE MODELLRECHNUNG – keine bestätigte Investitionsentscheidung.', {
    bold: true,
    color: [0.62, 0.31, 0.17],
  })
  p.space(12)
  p.card(
    'AMORTISATION',
    report.result.sustainedBreakEvenMonth === null
      ? 'Nicht erreicht'
      : 'Monat ' + report.result.sustainedBreakEvenMonth,
    42,
    496,
    156,
  )
  p.card('WERTBEITRAG', moneyWord(k.netEur), 207, 496, 168)
  p.card('MODELL-ROI', k.roiPercent === null ? 'n. a.' : percent(k.roiPercent), 384, 496, 169)
  p.space(16)
  p.heading('Management-Fazit')
  p.p(
    'Der berechnete wirtschaftliche Saldo gegenüber dem fortgesetzten Bestandssystem beträgt ' +
      moneyWord(k.netEur) +
      ' nach ' +
      report.input.horizonMonths +
      ' Projektmonaten. Die wirtschaftliche Amortisation ' +
      (report.result.sustainedBreakEvenMonth === null
        ? 'wird innerhalb des Zeitraums nicht erreicht.'
        : 'erfolgt im Projektmonat ' + report.result.sustainedBreakEvenMonth + '.'),
  )
  p.p(
    'Im Modell wurden ' +
      report.result.countedMetrics.length +
      ' monetäre Kunden-Metrics angesetzt. ' +
      report.result.unresolvedAssumptions +
      ' davon sind nicht als kundenseitig geprüft gekennzeichnet. ' +
      report.result.nonMonetized.length +
      ' weitere Kennzahlen werden nicht als sichere Geldeinsparung gewertet.',
  )
  p.heading('Finanzielle Gesamtübersicht')
  p.label('Einmalige Projektkosten', moneyWord(k.investmentEur))
  p.label('Gesamte neue Software-/Projektkosten', moneyWord(k.costEur))
  p.label('Gesamtnutzen inkl. Altsoftware-Wegfall', moneyWord(k.benefitEur))
  p.label('Kumulierter Nettovorteil', moneyWord(k.netEur))
  p.label('Tiefster kumulierter Saldo', moneyWord(k.lowestEur) + ' (M' + k.lowestMonth + ')')
  p.heading('Wirtschaftlicher Verlauf')
  p.chart(report.result.months)
  p.p(
    'Der Modell-ROI ist definiert als kumulierter Nettovorteil geteilt durch die gesamten neu angesetzten Projekt- und Softwarekosten im gewählten Zeitraum. Er ist undiskontiert und kein IRR / Kapitalwert / Liquiditäts-ROI.',
  )
  p.begin('Kosten und Nutzen')
  p.heading('Investitionen und laufende Kosten')
  for (const c of report.input.costs) {
    const kind = c.kind === 'one-time' ? 'Einmalig' : c.kind === 'saas' ? 'SaaS / Betrieb' : 'Wegfall Bestand'
    p.p(kind + ' | ' + safe(c.name), { bold: true })
    p.p(
      moneyWord(c.amountEur) +
        (c.kind === 'one-time' ? ' einmalig' : c.period === 'monthly' ? ' / Monat' : ' / Jahr') +
        ' | ab Monat ' +
        c.startMonth +
        (c.endMonth === undefined ? '' : ' bis Monat ' + c.endMonth),
    )
  }
  p.heading('Angerechnete Kunden-Metrics')
  for (const m of report.input.metrics.filter((x) => x.included && x.treatment === 'realized')) {
    p.p(safe(m.name) + ' | ' + moneyWord(annualMetricPotential(m) ?? 0) + ' / Jahr', { bold: true })
    p.p(formula(m) + ' | ab Monat ' + m.startMonth + ' | Hochlauf ' + m.rampMonths + ' Monat(e) | ' + evidence(m))
    p.p('Nachweis / Realisierung: ' + safe(m.evidenceNote))
  }
  p.heading('Nicht angerechnete Kennzahlen')
  for (const m of report.input.metrics.filter((x) => !(x.included && x.treatment === 'realized'))) {
    p.p(safe(m.name) + ' | ' + formula(m) + ' | nicht im Basiswert', { bold: true })
    p.p('Status: ' + evidence(m) + '. ' + safe(m.evidenceNote))
  }
  p.begin('Validierung und Methodik')
  p.heading('Vor einer Kundenentscheidung zu validieren')
  for (const m of report.input.metrics.filter(
    (x) => x.included && x.treatment === 'realized' && x.evidence !== 'customer-reviewed',
  )) {
    p.p(
      'OFFEN: ' +
        safe(m.name) +
        ' – ' +
        evidence(m) +
        '. Kostenwirkung, Umfang, Start und Datenquelle mit Kunde/Finance prüfen.',
    )
  }
  if (report.result.unresolvedAssumptions === 0)
    p.p(
      'Alle angerechneten Metrics sind laut Eingabe als mit Kunden besprochen markiert. Eine externe Prüfung der Angaben fand nicht statt.',
    )
  p.heading('Rechnung und Aussagegrenzen')
  p.p(
    'Monatlicher Saldo = tatsächlich im Modell angerechnete Monatsnutzen inklusive wegfallender Bestandssystemkosten minus neue Software- und Projektkosten. Kumulierter Saldo = Summe bis zum Projektmonat.',
  )
  p.p(
    'Modell-ROI (%) = (kumulierte angerechnete Nutzen – kumulierte neue Kosten) / kumulierte neue Kosten x 100. Nicht definiert, wenn neue Kosten = 0 EUR.',
  )
  p.p(
    'Jährliche Softwarebeträge werden gleichmäßig durch zwölf dividiert. Einmalinvestitionen fließen im angegebenen Projektmonat ein. Nutzungseffekte beginnen in dem je Metric erfassten Monat und berücksichtigen den Hochlauf.',
  )
  p.p(
    'Keine modellierten tatsächlichen Zahlungstermine, Jahresvorauszahlungen, Steuern, Finanzierung, Diskontierung, NPV/IRR oder unabhängige Kundenprüfung. Kapazitätsgewinne und Risikohypothesen sind explizit nicht eingerechnet.',
  )
  p.p(
    'Datenbasis: individuelle Projektangaben zum Exportzeitpunkt. Anbieter-Referenzen (M1), Verkäuferhypothesen und kundenbezogene Aussagen werden nicht als automatisch verifizierte M2 dargestellt.',
  )
  p.heading('Monatswerte – Prüfspur')
  for (const m of report.result.months) {
    p.p(
      'M' +
        String(m.month).padStart(2, '0') +
        '   Kosten ' +
        moneyWord(m.newCostEur) +
        ' | Nutzen ' +
        moneyWord(m.totalBenefitEur) +
        ' | Saldo ' +
        moneyWord(m.cumulativeEur),
    )
  }
  return p.bytes()
}
