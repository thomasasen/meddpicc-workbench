import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from 'pdf-lib'
import { summarizeBusinessCase, type CaseSummary } from '../domain/businessCase'
import type { ReportData } from './softwareBusinessCasePdf'

const W = 595.28
const H = 841.89
const X = 48
const RIGHT = W - X
const navy = rgb(0.075, 0.13, 0.23)
const ink = rgb(0.12, 0.18, 0.27)
const muted = rgb(0.36, 0.43, 0.52)
const teal = rgb(0.03, 0.41, 0.37)
const amber = rgb(0.57, 0.31, 0.07)
const red = rgb(0.68, 0.23, 0.23)
const pale = rgb(0.948, 0.967, 0.974)
const line = rgb(0.85, 0.89, 0.92)
const white = rgb(1, 1, 1)
type FontSet = { regular: PDFFont; bold: PDFFont }
type Paint = { pdf: PDFDocument; p: PDFPage; fonts: FontSet }

const euro = (n: number) =>
  new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n)

function readable(value: string): string {
  return value
    .replace(/[\u2010-\u2015]/g, '-')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201c\u201d]/g, '"')
    .replace(/\u2026/g, '...')
    .replace(/\u00a0/g, ' ')
    .replace(/[\u2022\u2023]/g, '-')
    .replace(/[^\u0020-\u00ff\u20ac\n]/g, '?')
}

function write(
  p: PDFPage,
  value: string,
  x: number,
  y: number,
  size: number,
  font: PDFFont,
  color = ink,
  maxWidth = RIGHT - x,
): void {
  let content = readable(value).replace(/\s+/g, ' ').trim()
  if (!content) return
  if (font.widthOfTextAtSize(content, size) > maxWidth) {
    const suffix = '...'
    while (content && font.widthOfTextAtSize(content + suffix, size) > maxWidth) content = content.slice(0, -1)
    content += suffix
  }
  p.drawText(content, { x, y, size, font, color })
}

function wrap(value: string, font: PDFFont, size: number, width: number): string[] {
  const lines: string[] = []
  for (const paragraph of readable(value).split(/\n/)) {
    let row = ''
    for (const word of paragraph.split(/\s+/)) {
      if (!word) continue
      const candidate = row ? row + ' ' + word : word
      if (font.widthOfTextAtSize(candidate, size) <= width) {
        row = candidate
        continue
      }
      if (row) lines.push(row)
      row = ''
      for (const char of word) {
        if (row && font.widthOfTextAtSize(row + char, size) > width) {
          lines.push(row)
          row = ''
        }
        row += char
      }
    }
    if (row) lines.push(row)
  }
  return lines.length ? lines : ['']
}

function paragraph(
  p: PDFPage,
  value: string,
  x: number,
  top: number,
  width: number,
  fonts: FontSet,
  opts: { maxLines?: number; size?: number; leading?: number; color?: ReturnType<typeof rgb>; bold?: boolean } = {},
): number {
  const size = opts.size ?? 10
  const leading = opts.leading ?? 15
  const font = opts.bold ? fonts.bold : fonts.regular
  const lines = wrap(value, font, size, width)
  const max = opts.maxLines ?? 99999
  for (const [i, row] of lines.slice(0, max).entries()) {
    const clipped = i === max - 1 && lines.length > max ? row + ' ... (siehe Finance-Anhang)' : row
    write(p, clipped, x, top - i * leading, size, font, opts.color ?? muted, width)
  }
  return top - Math.min(lines.length, max) * leading
}

function section(p: PDFPage, title: string, y: number, f: FontSet): void {
  write(p, title, X, y, 15, f.bold, navy)
  p.drawLine({ start: { x: X, y: y - 12 }, end: { x: RIGHT, y: y - 12 }, thickness: 0.8, color: line })
}

function page(doc: PDFDocument, fonts: FontSet, chapter: string, number: number): Paint {
  const p = doc.addPage([W, H])
  p.drawRectangle({ x: 0, y: H - 77, width: W, height: 77, color: navy })
  p.drawRectangle({ x: X, y: H - 82, width: 34, height: 4, color: teal })
  write(p, 'IHRE WIRTSCHAFTLICHKEITSBETRACHTUNG', X, H - 35, 11, fonts.bold, white)
  write(p, chapter.toUpperCase(), X, H - 55, 8.5, fonts.regular, rgb(0.72, 0.81, 0.88))
  p.drawLine({ start: { x: X, y: 46 }, end: { x: RIGHT, y: 46 }, thickness: 0.65, color: line })
  write(p, 'GESPRÄCHSGRUNDLAGE | ANNAHMEN UND QUELLEN OFFENGELEGT', X, 30, 7.3, fonts.regular, muted)
  write(p, 'SEITE ' + number, RIGHT - 52, 30, 7.3, fonts.bold, muted, 52)
  return { pdf: doc, p, fonts }
}

function meta(p: PDFPage, label: string, value: string, y: number, f: FontSet): void {
  write(p, label.toUpperCase(), X, y, 8, f.regular, muted, 120)
  write(p, value, X + 127, y - 1, 10.5, f.bold, ink, RIGHT - X - 127)
}

function metricCard(
  p: PDFPage,
  x: number,
  top: number,
  width: number,
  label: string,
  value: string,
  f: FontSet,
  color = navy,
): void {
  p.drawRectangle({ x, y: top - 73, width, height: 73, color: pale })
  p.drawRectangle({ x, y: top - 73, width: 3, height: 73, color })
  write(p, label.toUpperCase(), x + 13, top - 22, 8, f.regular, muted, width - 26)
  write(p, value, x + 13, top - 51, 17, f.bold, color, width - 26)
}

function notice(p: PDFPage, top: number, text: string, fonts: FontSet): void {
  const height = 65
  p.drawRectangle({ x: X, y: top - height, width: RIGHT - X, height, color: rgb(0.994, 0.971, 0.926) })
  p.drawRectangle({ x: X, y: top - height, width: 3, height, color: amber })
  write(p, 'STAND DER ANNAHMEN', X + 13, top - 19, 8, fonts.bold, amber)
  paragraph(p, text, X + 13, top - 36, RIGHT - X - 26, fonts, { size: 9, leading: 13, maxLines: 2, color: ink })
}

/**
 * Kundenorientierte Wirtschaftlichkeitsgrafik. Bewusst KEINE kumulierte
 * Saldenkurve: zwei proportionale, vergleichbar skalierte Kosten-/Nutzenbalken
 * und eine eigenständige Zeitachse für den Payback.
 * Die Beträge stammen unverändert aus der gemeinsamen Monats-Engine.
 */
function investmentComparison(p: PDFPage, c: CaseSummary, f: FontSet): void {
  const barX = X + 3
  const barWidth = RIGHT - barX - 3
  const maxValue = Math.max(1, c.totalCostEur, c.benefitEur)
  const scaled = (value: number): number => barWidth * Math.max(0, value) / maxValue
  const costWidth = scaled(c.totalCostEur)
  const benefitWidth = scaled(c.benefitEur)
  const upFrontWidth = scaled(c.investmentEur)
  const improvementWidth = scaled(c.creditedMetricsEur)

  const bar = (y: number, width: number, first: number, col1: ReturnType<typeof rgb>, col2: ReturnType<typeof rgb>) => {
    p.drawRectangle({ x: barX, y, width: barWidth, height: 16, color: pale })
    if (width > 0) p.drawRectangle({ x: barX, y, width, height: 16, color: col2 })
    if (first > 0) p.drawRectangle({ x: barX, y, width: Math.min(first, width), height: 16, color: col1 })
  }
  const amount = (value: number, y: number): void => {
    const txt = euro(value)
    write(p, txt, RIGHT - f.bold.widthOfTextAtSize(readable(txt), 10), y, 10, f.bold, ink, 125)
  }

  write(p, 'Gesamte Kosten über ' + c.horizon + ' Monate', barX, 383, 9.3, f.bold, navy, 310)
  amount(c.totalCostEur, 383)
  bar(361, costWidth, upFrontWidth, navy, rgb(0.48, 0.57, 0.70))
  write(p, 'Einmalige Einführung', barX, 343, 8, f.regular, muted)
  write(p, 'Laufender Betrieb', barX + 215, 343, 8, f.regular, muted)

  write(p, 'Erwarteter wirtschaftlicher Nutzen', barX, 317, 9.3, f.bold, navy, 316)
  amount(c.benefitEur, 317)
  bar(295, benefitWidth, improvementWidth, teal, rgb(0.57, 0.77, 0.71))
  write(p, 'Verbesserungen und Mehrertrag', barX, 277, 8, f.regular, muted)
  write(p, 'Entfall bisheriger Kosten', barX + 215, 277, 8, f.regular, muted)

  p.drawRectangle({ x: X, y: 237, width: RIGHT - X, height: 29, color: pale })
  const netLabel = c.netValueEur < 0 ? 'Rechnerische Lücke' : 'Rechnerischer Überschuss'
  write(p, netLabel + ' nach ' + c.horizon + ' Monaten', X + 11, 247, 9.2, f.bold, ink)
  const netText = euro(Math.abs(c.netValueEur))
  write(
    p,
    netText,
    RIGHT - 10 - f.bold.widthOfTextAtSize(readable(netText), 11),
    246,
    11,
    f.bold,
    c.netValueEur < 0 ? red : teal,
    125,
  )

  const axisX = barX
  const axisW = barWidth
  const axisY = 195
  write(p, 'Wann erreicht der Nutzen die Kosten?', axisX, 219, 9.5, f.bold, navy)
  p.drawRectangle({ x: axisX, y: axisY, width: axisW, height: 9, color: rgb(0.81, 0.86, 0.9) })
  if (c.sustainedBreakEvenMonth !== null) {
    const marker = axisX + (c.sustainedBreakEvenMonth / c.horizon) * axisW
    p.drawRectangle({ x: marker, y: axisY, width: Math.max(0, axisX + axisW - marker), height: 9, color: teal })
    p.drawLine({ start: { x: marker, y: axisY - 6 }, end: { x: marker, y: axisY + 14 }, color: teal, thickness: 1.6 })
    const label = 'Monat ' + c.sustainedBreakEvenMonth + ': wirtschaftlicher Ausgleich'
    const labelWidth = f.bold.widthOfTextAtSize(readable(label), 8)
    write(p, label, Math.max(axisX, Math.min(RIGHT - labelWidth, marker - labelWidth / 2)), 171, 8, f.bold, teal, labelWidth + 1)
  } else {
    write(p, 'Kein wirtschaftlicher Ausgleich im Betrachtungszeitraum', axisX, 171, 8, f.bold, red)
  }
  write(p, 'Beginn', axisX, 181, 7.8, f.regular, muted)
  const endLabel = 'Monat ' + c.horizon
  write(p, endLabel, RIGHT - f.regular.widthOfTextAtSize(endLabel, 7.8), 181, 7.8, f.regular, muted)
}

function twoColumnRow(p: PDFPage, y: number, label: string, number: string, f: FontSet, total = false): void {
  if (total) p.drawRectangle({ x: X, y: y - 7, width: RIGHT - X, height: 29, color: pale })
  write(p, label, X + 8, y + 4, 9.5, total ? f.bold : f.regular, total ? ink : muted, 330)
  const numWidth = f.bold.widthOfTextAtSize(readable(number), 10)
  write(p, number, RIGHT - 8 - numWidth, y + 4, 10, f.bold, total ? navy : ink, 150)
  if (!total) p.drawLine({ start: { x: X, y: y - 11 }, end: { x: RIGHT, y: y - 11 }, thickness: 0.45, color: line })
}

function statusLabel(evidence: string): string {
  if (evidence === 'customer-reviewed') return 'Laut Angaben gemeinsam geprüft'
  if (evidence === 'customer-stated') return 'Genannter Wert, noch zu bestätigen'
  if (evidence === 'reference') return 'Orientierungswert, noch abzustimmen'
  return 'Planungsannahme, noch zu bestätigen'
}

function executivePage(pdf: PDFDocument, f: FontSet, data: ReportData, c: CaseSummary): void {
  const { p } = page(pdf, f, '01 | Investition auf einen Blick', 1)
  write(p, 'Ihre Investition im Überblick', X, 729, 20, f.bold, navy)
  meta(p, 'Unternehmen', data.customer.trim(), 695, f)
  meta(p, 'Vorhaben', data.project.trim(), 674, f)
  meta(p, 'Kontakt', data.preparedBy.trim() + '  |  ' + data.date, 653, f)

  const month = c.sustainedBreakEvenMonth
  const claim = month === null
    ? 'Der wirtschaftliche Ausgleich wird nicht erreicht'
    : 'Der wirtschaftliche Ausgleich ist ab Monat ' + month + ' möglich'
  write(p, claim, X, 613, 14.5, f.bold, month === null ? red : navy)
  const outcome = data.targetOutcome?.trim()
    ? 'Ihr angestrebtes Ergebnis: ' + data.targetOutcome.trim()
    : 'Das angestrebte Geschäftsergebnis wird im gemeinsamen Gespräch ergänzt.'
  paragraph(p, outcome, X, 590, RIGHT - X, f, { size: 9.4, leading: 14, maxLines: 2 })

  const gap = 10
  const cardWidth = (RIGHT - X - 2 * gap) / 3
  metricCard(p, X, 541, cardWidth, 'Amortisation', month === null ? 'Nicht erreicht' : 'Monat ' + month, f)
  metricCard(p, X + cardWidth + gap, 541, cardWidth, 'Gesamtkosten / ' + c.horizon + ' M.', euro(c.totalCostEur), f)
  metricCard(
    p, X + 2 * (cardWidth + gap), 541, cardWidth,
    'Saldo nach ' + c.horizon + ' Monaten', euro(c.netValueEur), f,
    c.netValueEur < 0 ? red : navy,
  )

  write(p, 'Kosten und Nutzen im direkten Vergleich', X, 431, 13.5, f.bold, navy)
  write(p, 'Modellierte Gesamtwerte, nicht mit tatsächlichen Zahlungen gleichzusetzen', X, 411, 8.4, f.regular, muted)
  investmentComparison(p, c, f)

  const uncertainty = c.unverified > 0
    ? c.unverified +
      (c.unverified === 1 ? ' Nutzenposition beruht' : ' Nutzenpositionen beruhen') +
      ' auf noch nicht gemeinsam bestätigten Angaben. Bitte die wirtschaftlichen Annahmen vor einer Entscheidung abstimmen.'
    : 'Die Nutzenwerte sind laut Eingabe bereits gemeinsam geprüft. Kosten, Zeitplan und Auswirkungen sollten vor der Entscheidung nochmals abgestimmt werden.'
  notice(p, 143, uncertainty, f)
}

function economicsPage(pdf: PDFDocument, f: FontSet, c: CaseSummary): void {
  const { p } = page(pdf, f, '02 | Herkunft des Nutzens', 2)
  write(p, 'So entsteht der wirtschaftliche Nutzen', X, 729, 20, f.bold, navy)
  paragraph(
    p,
    'Für die Bewertung vergleichen wir die geplanten Ausgaben mit erwarteten Verbesserungen und den wegfallenden Kosten bisheriger Systeme.',
    X,
    697,
    RIGHT - X,
    f,
    { size: 9.5, maxLines: 2 },
  )
  section(p, 'Die Rechnung im Überblick', 649, f)
  const rows: Array<[string, number, boolean]> = [
    ['Einführung und einmalige Aufwände', c.investmentEur, false],
    ['Neue laufende Software- und Betriebskosten', c.operatingCostsEur, false],
    ['Gesamte neue Kosten', c.totalCostEur, true],
    ['Vermiedene Altsystemkosten', c.avoidedLegacyEur, false],
    ['Erwarteter Nutzen aus Verbesserungen', c.creditedMetricsEur, false],
    ['Erwarteter wirtschaftlicher Gesamtnutzen', c.benefitEur, true],
    ['Rechnerischer Saldo am Periodenende', c.netValueEur, true],
  ]
  rows.forEach(([label, amount, total], i) => twoColumnRow(p, 610 - i * 31, label, euro(amount), f, total))

  section(p, 'Welche Veränderungen sollen Nutzen bringen?', 365, f)
  const included = c.metricDetails.filter((m) => m.included)
  const visible = included.slice(0, 3)
  if (!visible.length)
    paragraph(p, 'Bisher sind keine Veränderungen mit einem gesicherten Geldwert hinterlegt.', X, 336, RIGHT - X, f)
  visible.forEach((m, i) => {
    const top = 335 - i * 72
    write(p, m.name, X, top, 10.5, f.bold, ink, 355)
    const money = m.annualEur === null ? 'noch ohne Geldwert' : euro(m.annualEur) + ' / Jahr*'
    const tw = f.bold.widthOfTextAtSize(readable(money), 9)
    write(p, money, RIGHT - tw, top, 9, f.bold, navy, tw + 2)
    write(p, statusLabel(m.evidence), X, top - 18, 8.5, f.regular, m.evidence === 'customer-reviewed' ? teal : amber)
    write(
      p,
      'Geplanter Nutzenbeginn: Monat ' +
        m.startMonth +
        ' | Einführung über ' +
        m.rampMonths +
        ' ' +
        (m.rampMonths === 1 ? 'Monat' : 'Monate'),
      X,
      top - 33,
      8.2,
      f.regular,
      muted,
    )
    p.drawLine({ start: { x: X, y: top - 44 }, end: { x: RIGHT, y: top - 44 }, thickness: 0.5, color: line })
  })
  if (included.length > visible.length) {
    write(
      p,
      String(included.length - visible.length) + ' weitere Nutzenpositionen mit Detailannahmen im Finance-Anhang.',
      X,
      110,
      8.5,
      f.regular,
      muted,
    )
  }
  const excluded = c.metricDetails.filter((m) => !m.included)
  if (excluded.length)
    write(
      p,
      String(excluded.length) +
        ' weitere Effekte sind nicht als finanzieller Nutzen eingerechnet.',
      X,
      80,
      8.3,
      f.regular,
      muted,
    )
}

function decisionPage(pdf: PDFDocument, f: FontSet, data: ReportData, c: CaseSummary): void {
  const { p } = page(pdf, f, '03 | Nächste Schritte', 3)
  write(p, 'Die nächsten Schritte für Ihr Vorhaben', X, 729, 19, f.bold, navy)
  section(p, 'Ausgangssituation und gewünschtes Ergebnis', 687, f)
  write(p, 'IHRE AKTUELLE SITUATION', X, 657, 8, f.bold, muted)
  paragraph(
    p,
    data.businessPain?.trim() || 'Die Ausgangssituation halten wir gemeinsam im nächsten Gespräch fest.',
    X, 636, RIGHT - X, f, { size: 9.4, leading: 15, maxLines: 4 },
  )
  write(p, 'WAS SICH DURCH DAS VORHABEN VERBESSERN SOLL', X, 552, 8, f.bold, muted)
  paragraph(
    p,
    data.targetOutcome?.trim() || 'Das gewünschte Geschäftsergebnis stimmen wir gemeinsam ab.',
    X, 531, RIGHT - X, f, { size: 9.4, leading: 15, maxLines: 4 },
  )

  section(p, 'Was wir gemeinsam überprüfen und abstimmen', 447, f)
  const questions = [
    ['01', 'Ausgangswerte und Wirkung', 'Mengen, heutige Aufwände und erreichbare Verbesserungen gemeinsam prüfen.'],
    ['02', 'Finanzielle Auswirkungen', 'Einsparungen, zusätzliche Erträge und Gesamtkosten mit Ihrem Controlling bewerten.'],
    ['03', 'Umstellung und Zeitplan', 'Start, Lizenzkosten, Ablösung bisheriger Systeme und schrittweisen Nutzenbeginn abstimmen.'],
    ['04', 'Entscheidungsgrundlage', 'Annahmen, offene Punkte, Entscheidungskriterien und das weitere Vorgehen festhalten.'],
  ] as const
  questions.forEach(([number, owner, note], i) => {
    const y = 412 - i * 62
    p.drawRectangle({ x: X, y: y - 32, width: 31, height: 31, color: pale })
    write(p, number, X + 8, y - 20, 9, f.bold, teal, 20)
    write(p, owner, X + 44, y - 5, 9.5, f.bold, navy)
    paragraph(p, note, X + 44, y - 21, RIGHT - X - 44, f, { size: 8.7, leading: 12, maxLines: 2 })
  })
  notice(
    p,
    145,
    'Die vorliegende Einschätzung betrachtet ' + c.horizon +
      ' Monate. Sie zeigt die wirtschaftlichen Auswirkungen der eingetragenen Annahmen, nicht die tatsächlichen Zahlungszeitpunkte. Einzelheiten und Datenstand enthält der Finance-Anhang.',
    f,
  )
}

export async function buildCustomerBusinessCasePdf(data: ReportData): Promise<Uint8Array> {
  if (!data.customer.trim() || !data.project.trim() || !data.preparedBy.trim()) {
    throw new Error('Kunde, Projekt und Verfasser sind für den Kundenbericht erforderlich.')
  }
  const c = summarizeBusinessCase(data.input)
  if (!c) throw new Error('Bitte ungültige Angaben oder Doppelzählungen korrigieren.')
  const pdf = await PDFDocument.create()
  const fonts: FontSet = {
    regular: await pdf.embedFont(StandardFonts.Helvetica),
    bold: await pdf.embedFont(StandardFonts.HelveticaBold),
  }
  pdf.setTitle(readable('Business Case - ' + data.project))
  pdf.setSubject('Kundenbericht | undiskontierte Wirtschaftlichkeitsmodellrechnung')
  pdf.setCreator('MEDDPICC Workbench - lokaler Browserexport')
  executivePage(pdf, fonts, data, c)
  economicsPage(pdf, fonts, c)
  decisionPage(pdf, fonts, data, c)
  return pdf.save({ useObjectStreams: false })
}
