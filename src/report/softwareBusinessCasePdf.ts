import { PDFDocument, StandardFonts, rgb, type PDFPage, type PDFFont } from 'pdf-lib'
import { summarizeBusinessCase, economicInterpretation, type CaseSummary } from '../domain/businessCase'
import type { SoftwarePaybackInput } from '../domain/softwarePayback'

export interface ReportData {
  customer: string
  project: string
  preparedBy: string
  date: string
  input: SoftwarePaybackInput
}
const PW = 595.28,
  PH = 841.89,
  L = 46,
  R = PW - 46
const navy = rgb(0.09, 0.14, 0.24),
  blue = rgb(0.12, 0.37, 0.9),
  green = rgb(0.03, 0.48, 0.38)
const muted = rgb(0.38, 0.44, 0.52),
  light = rgb(0.95, 0.97, 0.99),
  border = rgb(0.84, 0.88, 0.92)
const danger = rgb(0.7, 0.28, 0.19),
  white = rgb(1, 1, 1)
type Fonts = { normal: PDFFont; bold: PDFFont }
type State = { p: PDFPage; y: number }
const euro = (n: number) =>
  new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n)
const percent = (n: number | null) =>
  n === null
    ? 'nicht definiert'
    : new Intl.NumberFormat('de-DE', { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(n) + ' %'
function safe(s: string): string {
  return s
    .replace(/[\u2010-\u2015]/g, '-')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201c\u201d]/g, '"')
    .replace(/[\u2022\u2023]/g, '-')
    .replace(/\u2026/g, '...')
    .replace(/\u00a0/g, ' ')
    .replace(/[^\u0020-\u00ff\u20ac\n]/g, '?')
}
function draw(p: PDFPage, v: string, x: number, y: number, size: number, font: PDFFont, color = navy, width?: number) {
  let t = safe(v)
  if (width !== undefined) while (t.length && font.widthOfTextAtSize(t, size) > width) t = t.slice(0, -1)
  p.drawText(t, { x, y, size, font, color })
}
function wrap(s: string, font: PDFFont, size: number, width: number): string[] {
  const output: string[] = []
  for (const para of safe(s).split('\n')) {
    let line = ''
    for (const word of para.split(/\s+/)) {
      if (!word) continue
      const next = line ? line + ' ' + word : word
      if (font.widthOfTextAtSize(next, size) <= width) {
        line = next
        continue
      }
      if (line) output.push(line)
      line = ''
      for (const char of word) {
        if (line && font.widthOfTextAtSize(line + char, size) > width) {
          output.push(line)
          line = ''
        }
        line += char
      }
    }
    output.push(line)
  }
  return output
}
function para(s: State, v: string, f: Fonts, size = 9, width = R - L, spacing = 13) {
  for (const line of wrap(v, f.normal, size, width)) {
    draw(s.p, line, L, s.y, size, f.normal, muted)
    s.y -= spacing
  }
  s.y -= 7
}
function page(pdf: PDFDocument, f: Fonts, chapter: string): State {
  const p = pdf.addPage([PW, PH])
  p.drawRectangle({ x: 0, y: PH - 89, width: PW, height: 89, color: navy })
  draw(p, 'SOFTWARE INVESTMENT / BUSINESS CASE', L, PH - 35, 10, f.bold, white)
  draw(p, chapter.toUpperCase(), L, PH - 57, 9, f.normal, rgb(0.68, 0.82, 1))
  return { p, y: PH - 117 }
}
function heading(s: State, v: string, f: Fonts, size = 17) {
  draw(s.p, v, L, s.y, size, f.bold)
  s.y -= size + 19
}
function field(s: State, label: string, value: string, f: Fonts) {
  draw(s.p, label, L, s.y, 9, f.normal, muted, 275)
  draw(s.p, value, 333, s.y, 9, f.bold, navy, R - 333)
  s.y -= 23
}
function box(s: State, v: string, f: Fonts) {
  const ls = wrap(v, f.normal, 9, R - L - 27)
  const height = ls.length * 13 + 22
  s.p.drawRectangle({ x: L, y: s.y - height + 8, width: R - L, height, color: light })
  s.p.drawRectangle({ x: L, y: s.y - height + 8, width: 3, height, color: blue })
  for (const row of ls) {
    draw(s.p, row, L + 13, s.y - 8, 9, f.normal)
    s.y -= 13
  }
  s.y -= 22
}
function kpi(s: State, f: Fonts, x: number, y: number, label: string, value: string, color = navy) {
  const w = 243
  s.p.drawRectangle({ x, y: y - 72, width: w, height: 72, color: light })
  draw(s.p, label, x + 12, y - 20, 8.4, f.normal, muted, w - 24)
  draw(s.p, value, x + 12, y - 48, 17, f.bold, color, w - 24)
}
function axis(n: number): string {
  const v = Math.abs(n),
    prefix = n < 0 ? '-' : ''
  return (
    prefix +
    (v >= 1000000
      ? (v / 1000000).toFixed(1) + ' Mio.'
      : v >= 1000
        ? Math.round(v / 1000) + ' Tsd.'
        : Math.round(v).toString())
  )
}
function chart(s: State, f: Fonts, c: CaseSummary) {
  const top = s.y - 10,
    h = 216
  const x0 = L + 53,
    x1 = R - 12,
    y0 = top - h + 33,
    y1 = top - 16
  const vals = c.periodMetrics.map((x) => x.balanceEur)
  let low = Math.min(0, ...vals),
    high = Math.max(0, ...vals)
  if (high - low < 1) {
    low -= 1
    high += 1
  }
  const pad = (high - low) * 0.09
  low -= pad
  high += pad
  const px = (m: number) => x0 + ((x1 - x0) * m) / c.horizon
  const py = (n: number) => y0 + ((y1 - y0) * (n - low)) / (high - low)
  for (let i = 0; i <= 4; i++) {
    const v = low + ((high - low) * i) / 4,
      y = py(v)
    s.p.drawLine({ start: { x: x0, y }, end: { x: x1, y }, thickness: 0.55, color: border })
    draw(s.p, axis(v), L, y - 3, 8, f.normal, muted, 47)
  }
  if (low < 0 && high > 0)
    s.p.drawLine({
      start: { x: x0, y: py(0) },
      end: { x: x1, y: py(0) },
      thickness: 1,
      color: muted,
      dashArray: [4, 4],
    })
  for (let m = 0; m <= c.horizon; m += 12) draw(s.p, String(m), px(m) - 5, y0 - 16, 8, f.normal, muted)
  for (let i = 1; i < c.periodMetrics.length; i++) {
    const a = c.periodMetrics[i - 1]!,
      b = c.periodMetrics[i]!
    s.p.drawLine({
      start: { x: px(a.month), y: py(a.balanceEur) },
      end: { x: px(b.month), y: py(b.balanceEur) },
      thickness: 2.5,
      color: blue,
    })
  }
  const min = c.periodMetrics[c.lowestMonth]!
  s.p.drawCircle({ x: px(min.month), y: py(min.balanceEur), size: 3.5, color: danger })
  draw(
    s.p,
    'Tiefpunkt M' + min.month,
    Math.min(x1 - 104, px(min.month) + 8),
    py(min.balanceEur) - 15,
    8,
    f.bold,
    danger,
    103,
  )
  if (c.sustainedBreakEvenMonth !== null) {
    const m = c.periodMetrics[c.sustainedBreakEvenMonth]!
    s.p.drawCircle({ x: px(m.month), y: py(m.balanceEur), size: 4, color: green })
    draw(
      s.p,
      'Break-even M' + m.month,
      Math.max(x0 + 2, Math.min(x1 - 105, px(m.month) - 35)),
      py(m.balanceEur) + 12,
      8,
      f.bold,
      green,
    )
  }
  draw(s.p, 'PROJEKTMONAT', x1 - 85, y0 - 29, 7.6, f.bold, muted)
  s.y -= h + 9
}
function line(s: State, label: string, value: string, f: Fonts) {
  const rows = wrap(label, f.normal, 9, 295),
    height = Math.max(20, rows.length * 12 + 5)
  for (let i = 0; i < rows.length; i++) draw(s.p, rows[i]!, L + 8, s.y - i * 12, 9, f.normal)
  draw(s.p, value, R - 176, s.y, 9, f.bold, navy, 174)
  s.p.drawLine({
    start: { x: L, y: s.y - height + 7 },
    end: { x: R, y: s.y - height + 7 },
    thickness: 0.5,
    color: border,
  })
  s.y -= height
}
function tableHead(s: State, f: Fonts, one = 'Kosten- oder Nutzenblock', two = 'EUR, Betrachtungszeitraum') {
  s.p.drawRectangle({ x: L, y: s.y - 7, width: R - L, height: 24, color: light })
  draw(s.p, one, L + 7, s.y + 1, 9, f.bold)
  draw(s.p, two, R - 176, s.y + 1, 9, f.bold)
  s.y -= 31
}
function footer(pdf: PDFDocument, f: Fonts, customer: string) {
  const pages = pdf.getPages()
  for (let i = 0; i < pages.length; i++) {
    const p = pages[i]!
    p.drawLine({ start: { x: L, y: 38 }, end: { x: R, y: 38 }, thickness: 0.6, color: border })
    draw(p, 'MODELLRECHNUNG - ' + customer, L, 24, 7.3, f.normal, muted, 355)
    draw(p, String(i + 1) + ' / ' + String(pages.length), R - 27, 24, 8, f.bold, muted)
  }
}
export async function buildSoftwareBusinessCasePdf(data: ReportData): Promise<Uint8Array> {
  const c = summarizeBusinessCase(data.input)
  if (!c) throw new Error('Bitte ungültige Angaben oder Doppelzählungen korrigieren.')
  const pdf = await PDFDocument.create()
  const f: Fonts = {
    normal: await pdf.embedFont(StandardFonts.Helvetica),
    bold: await pdf.embedFont(StandardFonts.HelveticaBold),
  }
  pdf.setTitle(safe('Business Case - ' + data.project))
  pdf.setSubject('Undiskontierte wirtschaftliche Projektmodellrechnung')
  pdf.setCreator('MEDDPICC Toolbox (clientseitig)')
  const client = data.customer.trim() || 'Nicht angegeben'
  let s = page(pdf, f, '01  Management Summary')
  heading(s, 'Wirtschaftlicher Business Case', f, 21)
  field(s, 'Kunde / Unternehmen', client, f)
  field(s, 'Projekt', data.project.trim() || 'Nicht angegeben', f)
  field(s, 'Erstellt von', data.preparedBy.trim() || 'Nicht angegeben', f)
  field(s, 'Datum', data.date, f)
  s.y -= 10
  const y = s.y
  kpi(
    s,
    f,
    L,
    y,
    'BREAK-EVEN',
    c.sustainedBreakEvenMonth === null ? 'Nicht erreicht' : 'Monat ' + c.sustainedBreakEvenMonth,
    c.sustainedBreakEvenMonth === null ? danger : green,
  )
  kpi(s, f, L + 257, y, 'KUMULIERTER NETTOWERT', euro(c.netValueEur), c.netValueEur < 0 ? danger : green)
  kpi(
    s,
    f,
    L,
    y - 84,
    'ROI ÜBER ' + c.horizon + ' MONATE',
    percent(c.roiPercent),
    c.roiPercent !== null && c.roiPercent >= 0 ? green : danger,
  )
  kpi(s, f, L + 257, y - 84, 'NEUE PROJEKTKOSTEN INSGESAMT', euro(c.totalCostEur))
  s.y -= 191
  heading(s, 'Wertentwicklung', f, 14)
  chart(s, f, c)
  para(s, economicInterpretation(c), f, 9.4)
  box(
    s,
    'Schätzung, keine Budgetfreigabe: ' +
      c.unverified +
      ' angerechnete Kunden-Metrics sind noch nicht als kundenseitig geprüft dokumentiert.',
    f,
  )

  s = page(pdf, f, '02  Wirtschaftliche Herleitung')
  heading(s, 'Kosten, Nutzen und ROI', f)
  tableHead(s, f)
  for (const row of [
    ['Einmalige Projektkosten', c.investmentEur],
    ['Laufende neue Kosten über den Horizont', c.operatingCostsEur],
    ['Neue Projektkosten insgesamt', c.totalCostEur],
    ['Wegfallende Bestandssoftwarekosten', c.avoidedLegacyEur],
    ['Angerechnete Kundennutzen-Metrics', c.creditedMetricsEur],
    ['Wirtschaftlicher Gesamtnutzen', c.benefitEur],
    ['Kumulierter Nettowert', c.netValueEur],
  ] as const)
    line(s, row[0], euro(row[1]), f)
  s.y -= 21
  heading(s, 'ROI-Definition', f, 14)
  box(
    s,
    'ROI (' +
      c.horizon +
      ' Monate) = (Gesamtnutzen - neue Projektkosten) / neue Projektkosten x 100 = ' +
      percent(c.roiPercent) +
      '. Altsoftware-Einsparungen sind nur im Nutzen enthalten, niemals zusätzlich vom Kostennenner abgezogen.',
    f,
  )
  para(
    s,
    'ROI ist eine undiskontierte Gesamtrendite über den Betrachtungshorizont, keine annualisierte Rendite. Bei null Projektkosten ist ROI in Prozent nicht definiert.',
    f,
  )
  s.y -= 13
  heading(s, 'Zeit und wirtschaftliche Risiken', f, 14)
  field(s, 'Tiefster kumulierter Saldo', euro(c.lowestBalanceEur) + ' (M' + c.lowestMonth + ')', f)
  field(
    s,
    'Erste Nullpunktüberschreitung',
    c.firstBreakEvenMonth === null ? 'Nicht erreicht' : 'Monat ' + c.firstBreakEvenMonth,
    f,
  )
  field(
    s,
    'Bis Horizont anhaltender Break-even',
    c.sustainedBreakEvenMonth === null ? 'Nicht erreicht' : 'Monat ' + c.sustainedBreakEvenMonth,
    f,
  )
  para(
    s,
    'Ein positiver Saldo kann durch spätere Zusatzkosten wieder ins Negative fallen. Ein anhaltender Break-even gilt nur bis zum gewählten Modellende.',
    f,
  )

  s = page(pdf, f, '03  Kostenpositionen und Customer Metrics')
  heading(s, 'Positionen und Datenherkunft', f)
  heading(s, 'Softwarekosten', f, 13)
  for (const cost of c.costDetails) {
    if (s.y < 112) {
      s = page(pdf, f, 'Kostenpositionen / Fortsetzung')
      heading(s, 'Softwarekosten (Fortsetzung)', f)
    }
    draw(s.p, cost.name, L, s.y, 10, f.bold, navy, R - L)
    s.y -= 16
    const type =
      cost.kind === 'one-time' ? 'Einmalig' : cost.kind === 'saas' ? 'Neue laufende Kosten' : 'Bestandssystem entfällt'
    para(
      s,
      type +
        ' | ' +
        euro(cost.amountEur) +
        (cost.kind === 'one-time' ? '' : cost.period === 'monthly' ? '/Monat' : '/Jahr') +
        ' | wirksam ab Monat ' +
        cost.startMonth +
        (cost.endMonth === undefined ? '' : ' bis ' + cost.endMonth),
      f,
      8.7,
      R - L,
      12,
    )
  }
  s.y -= 9
  if (s.y < 149) s = page(pdf, f, 'Customer Metrics')
  heading(s, 'Customer Metrics', f, 14)
  for (const m of c.metricDetails) {
    if (s.y < 181) {
      s = page(pdf, f, 'Customer Metrics / Fortsetzung')
      heading(s, 'Kunden-Metrics (Fortsetzung)', f, 15)
    }
    s.p.drawRectangle({ x: L, y: s.y - 7, width: R - L, height: 22, color: light })
    draw(
      s.p,
      m.included ? 'IM PAYBACK ENTHALTEN' : 'NICHT ANGERECHNET',
      L + 8,
      s.y,
      8,
      f.bold,
      m.included ? green : danger,
    )
    s.y -= 31
    draw(s.p, m.name, L, s.y, 10, f.bold, navy, R - L)
    s.y -= 17
    para(
      s,
      'Berechnung: ' +
        m.formula +
        ' | ' +
        (m.annualEur === null ? 'nicht monetär' : euro(m.annualEur) + '/Jahr (voller Nutzen)'),
      f,
      9,
      R - L,
      12,
    )
    para(
      s,
      'Startmonat ' +
        m.startMonth +
        ' | Ramp-up ' +
        m.rampMonths +
        ' Monate | Quelle: ' +
        m.evidence +
        ' | Gruppe: ' +
        m.group,
      f,
      8.4,
      R - L,
      11,
    )
    para(s, 'Validierung: ' + (m.evidenceNote.trim() || 'Keine Begründung hinterlegt.'), f, 8.4, R - L, 11)
    s.y -= 8
  }

  s = page(pdf, f, '04  Lückenloser Monatsverlauf')
  heading(s, 'Monatliche Wirtschaftlichkeit', f, 15)
  para(
    s,
    'Werte in EUR, auf volle Euro gerundet. Intern wird ohne Zwischenrundung gerechnet. Monat 0 enthält ggf. sofortige Projektkosten.',
    f,
    8.5,
  )
  function cols() {
    s.p.drawRectangle({ x: L, y: s.y - 7, width: R - L, height: 24, color: light })
    for (const [x, t] of [
      [L + 7, 'Monat'],
      [L + 99, 'Kosten'],
      [L + 231, 'Nutzen'],
      [L + 358, 'Kumuliert'],
    ] as const)
      draw(s.p, t, x, s.y + 1, 8.5, f.bold)
    s.y -= 30
  }
  cols()
  for (const m of c.periodMetrics) {
    if (s.y < 68) {
      s = page(pdf, f, 'Monatsverlauf / Fortsetzung')
      heading(s, 'Monatswerte (Fortsetzung)', f, 14)
      cols()
    }
    draw(s.p, String(m.month), L + 7, s.y, 8.4, f.normal)
    draw(s.p, euro(m.costEur), L + 99, s.y, 8.4, f.normal, navy, 127)
    draw(s.p, euro(m.benefitEur), L + 231, s.y, 8.4, f.normal, navy, 120)
    draw(s.p, euro(m.balanceEur), L + 358, s.y, 8.4, f.bold, m.balanceEur >= 0 ? green : navy, 138)
    s.p.drawLine({ start: { x: L, y: s.y - 6 }, end: { x: R, y: s.y - 6 }, thickness: 0.5, color: border })
    s.y -= 22
  }
  s = page(pdf, f, '05  Methodik und Prüfschritte')
  heading(s, 'Transparenz und nächste Schritte', f, 18)
  para(
    s,
    'Das Modell verwendet ' +
      c.horizon +
      ' wirtschaftliche Projektmonate einschließlich Monat 0. Es berücksichtigt nur ausdrücklich angerechnete Effekte; Kapazitätsgewinne und Risikoschätzungen bleiben außerhalb der konservativen Basis.',
    f,
    10,
  )
  for (const i of c.issues) para(s, '- ' + i, f, 9.4)
  s.y -= 18
  heading(s, 'Vor Vorlage beim Economic Buyer prüfen', f, 14)
  for (const i of [
    'Istwerte, Ziele, Mengen und Kostensätze gemeinsam mit dem Kunden validieren.',
    'Tatsächlich realisierbare Einsparungen und zusätzlichen Deckungsbeitrag mit Finance bestätigen.',
    'Implementierungsplan, Go-Live, SaaS-Beginn, Abschaltung des Altsystems und Ramp-up prüfen.',
    'Überschneidungen der Wirkungsgruppen sowie Zeit- und Risikoeffekte separat dokumentieren.',
    'Entscheidungskriterien, kaufmännische Freigabe und Alternativen beim Economic Buyer verifizieren.',
  ])
    para(s, '- ' + i, f, 9.4)
  box(
    s,
    'Hinweis: ' +
      c.unverified +
      ' angerechnete Metrics sind nicht als kundenseitig geprüft markiert. Der Bericht ist keine unabhängige Prüfung, keine Garantie und kein Freigabesignal.',
    f,
  )
  footer(pdf, f, client)
  return pdf.save({ useObjectStreams: false })
}
