import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage, type RGB } from 'pdf-lib'
import {
  bridgeEvidenceLabels,
  bridgeKindLabels,
  evaluateValueBridge,
  type BridgeMetric,
  type ValueBridgeInput,
} from '../domain/valueBridge'
import { drawReportFooter, drawReportMasthead } from './reportChrome'

const PAGE_W = 595.28
const PAGE_H = 841.89
const PAD = 43
const BODY_W = PAGE_W - 2 * PAD
const BOTTOM = 69
const navy = rgb(0.09, 0.17, 0.29)
const ink = rgb(0.13, 0.2, 0.3)
const muted = rgb(0.34, 0.41, 0.49)
const rule = rgb(0.82, 0.86, 0.91)
const blue = rgb(0.16, 0.36, 0.75)
const blueSoft = rgb(0.93, 0.96, 1)
const amber = rgb(0.55, 0.31, 0.09)
const amberSoft = rgb(1, 0.97, 0.93)
const teal = rgb(0.09, 0.4, 0.37)
const tealSoft = rgb(0.93, 0.97, 0.96)
const pale = rgb(0.96, 0.97, 0.99)
const white = rgb(1, 1, 1)

const euro = (value: number): string =>
  new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 2,
  }).format(value)

/** Built-in PDF fonts are WinAnsi based. Preserve standard German letters, replace unsupported glyphs. */
function printable(value: string): string {
  return value
    .replace(/[\u2010-\u2015]/g, '-')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201c\u201d]/g, '"')
    .replace(/\u2192/g, ' -> ')
    .replace(/\u2190/g, ' <- ')
    .replace(/[\u00a0\u202f]/g, ' ')
    .replace(/[^\u0020-\u00ff\u20ac\n]/g, '?')
}

/** Width-aware wrapping, including unbroken words and line-separated user content. */
function wrap(value: string, font: PDFFont, size: number, width: number): string[] {
  const out: string[] = []
  for (const paragraph of printable(value).split('\n')) {
    let current = ''
    for (const word of paragraph.split(/\s+/)) {
      if (!word) continue
      const joined = current ? current + ' ' + word : word
      if (font.widthOfTextAtSize(joined, size) <= width) {
        current = joined
        continue
      }
      if (current) out.push(current)
      current = ''
      for (const char of word) {
        if (current && font.widthOfTextAtSize(current + char, size) > width) {
          out.push(current)
          current = ''
        }
        current += char
      }
    }
    if (current) out.push(current)
    else if (!paragraph.trim()) out.push('')
  }
  return out.length ? out : ['']
}

export async function buildValueBridgePdf(input: ValueBridgeInput): Promise<Uint8Array> {
  const result = evaluateValueBridge(input)
  const pdf = await PDFDocument.create()
  const regular = await pdf.embedFont(StandardFonts.Helvetica)
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold)
  let page!: PDFPage
  let y = 0

  function pageStart(): void {
    page = pdf.addPage([PAGE_W, PAGE_H])
    drawReportMasthead({
      page,
      normal: regular,
      bold,
      width: PAGE_W,
      height: PAGE_H,
      left: PAD,
      right: PAGE_W - PAD,
      headerHeight: 99,
      title: 'Vom Problem zum messbaren Geschäftswert',
      subtitle: 'VALUE BRIDGE / KUNDENGESPRÄCH',
      subtitleOffset: 49,
      titleOffset: 82,
    })
    y = PAGE_H - 124
  }

  function keep(height: number): void {
    if (y - height < BOTTOM) pageStart()
  }

  function text(
    value: string,
    opts: { font?: PDFFont; size?: number; color?: RGB; gap?: number; x?: number; width?: number } = {},
  ): void {
    const f = opts.font ?? regular
    const size = opts.size ?? 10
    const x = opts.x ?? PAD
    const width = opts.width ?? BODY_W
    const leading = size + 4.4
    const lines = wrap(value || 'Noch offen', f, size, width)
    for (const row of lines) {
      keep(leading + 1)
      page.drawText(row, { x, y, font: f, size, color: opts.color ?? ink })
      y -= leading
    }
    y -= opts.gap ?? 8
  }

  function section(number: string, title: string): void {
    keep(53)
    y -= 12
    page.drawCircle({ x: PAD + 13, y: y - 3, size: 13, color: navy })
    page.drawText(number, { x: PAD + 7.5, y: y - 7.3, font: bold, size: 9, color: white })
    page.drawText(printable(title), { x: PAD + 36, y: y - 7, font: bold, size: 13, color: navy })
    y -= 31
  }

  function smallLine(label: string, value: string): void {
    keep(33)
    text(label.toUpperCase(), { font: bold, size: 7.7, color: muted, gap: 2 })
    text(value || 'Noch offen', { size: 9.9, gap: 9 })
  }

  /** Single compact visual stage. Long user content is rendered as unboxed, automatically paginated text. */
  function stage(n: string, label: string, value: string, surface: RGB, accent: RGB): void {
    const body = wrap(value || 'Noch offen', regular, 10.2, BODY_W - 69)
    const height = 22 + body.length * 14.4 + 10
    if (height > PAGE_H - 225) {
      section(n, label)
      text(value)
      return
    }
    keep(height + 8)
    const top = y + 2
    page.drawRectangle({ x: PAD, y: top - height, width: BODY_W, height, color: surface })
    page.drawRectangle({ x: PAD, y: top - height, width: 3, height, color: accent })
    page.drawCircle({ x: PAD + 26, y: top - 24, size: 12, color: white })
    page.drawText(n, { x: PAD + 20, y: top - 28, font: bold, size: 9.1, color: accent })
    page.drawText(label.toUpperCase(), {
      x: PAD + 50,
      y: top - 21,
      font: bold,
      size: 8.1,
      color: accent,
    })
    let lineY = top - 39
    for (const row of body) {
      page.drawText(row, { x: PAD + 50, y: lineY, font: regular, size: 10.2, color: ink })
      lineY -= 14.4
    }
    y = top - height - 8
  }

  function keyNumber(label: string, value: string, x: number, width: number, accent: RGB): void {
    page.drawRectangle({ x, y: y - 64, width, height: 64, color: pale })
    page.drawRectangle({ x, y: y - 64, width: 3, height: 64, color: accent })
    page.drawText(printable(label.toUpperCase()), {
      x: x + 13,
      y: y - 19,
      font: bold,
      size: 7.7,
      color: muted,
    })
    const amount = printable(value)
    let size = 15
    while (size > 8 && bold.widthOfTextAtSize(amount, size) > width - 26) size -= 0.5
    page.drawText(amount, { x: x + 13, y: y - 45, font: bold, size, color: ink })
  }

  /** Card is measured before drawing so every normal-size card stays together. */
  function metricCard(metric: BridgeMetric, index: number): void {
    const title = wrap(index + 1 + '. ' + (metric.name || 'Messgröße offen'), bold, 10.7, BODY_W - 32)
    const typeLines = wrap(bridgeKindLabels[metric.kind], regular, 8.9, BODY_W - 32)
    const evidenceLines = wrap(
      bridgeEvidenceLabels[metric.evidence] + ' | ' + (metric.source || 'Quelle offen'),
      regular,
      8.8,
      BODY_W - 32,
    )
    const calcLines = metric.calculation ? wrap('Herleitung: ' + metric.calculation, regular, 8.8, BODY_W - 32) : []
    const realizationLines = metric.included
      ? wrap('Realisierung: ' + (metric.realization || 'Noch offen'), regular, 8.8, BODY_W - 32)
      : []
    const valueLines =
      metric.included && (metric.kind === 'saving' || metric.kind === 'margin')
        ? wrap('Im Modell: ' + euro(metric.annualRealizedEur ?? 0) + ' pro Jahr', bold, 9.5, BODY_W - 32)
        : ['Keine EUR-Anrechnung']
    const leftPreview = wrap('HEUTE  ' + (metric.before || '?') + ' ' + metric.unit, bold, 9, (BODY_W - 42) / 2)
    const rightPreview = wrap('ZIEL  ' + (metric.after || '?') + ' ' + metric.unit, bold, 9, (BODY_W - 42) / 2)
    const extraRows = Math.max(0, Math.max(leftPreview.length, rightPreview.length) - 1)
    const bodyH =
      extraRows * 12.7 +
      title.length * 14.3 +
      typeLines.length * 12.4 +
      evidenceLines.length * 12.2 +
      calcLines.length * 12.2 +
      realizationLines.length * 12.2 +
      valueLines.length * 13.6 +
      74

    if (bodyH > PAGE_H - 231) {
      keep(50)
      text(index + 1 + '. ' + (metric.name || 'Messgröße offen'), { font: bold, size: 11 })
      smallLine('Heute -> Ziel', (metric.before || '?') + ' -> ' + (metric.after || '?') + ' ' + metric.unit)
      smallLine(
        'Art und Quelle',
        bridgeKindLabels[metric.kind] +
          ' | ' +
          bridgeEvidenceLabels[metric.evidence] +
          ' | ' +
          (metric.source || 'Quelle offen'),
      )
      if (metric.calculation) smallLine('Herleitung', metric.calculation)
      smallLine('Wirtschaftliche Anrechnung', valueLines.join(' '))
      if (metric.included) smallLine('Realisierung', metric.realization)
      return
    }

    keep(bodyH + 12)
    const top = y
    page.drawRectangle({
      x: PAD,
      y: top - bodyH,
      width: BODY_W,
      height: bodyH,
      color: white,
      borderColor: rule,
      borderWidth: 0.8,
    })
    page.drawRectangle({ x: PAD, y: top - 5, width: BODY_W, height: 5, color: blue })
    let current = top - 23
    const innerX = PAD + 16
    const drawRows = (rows: string[], font: PDFFont, size: number, leading: number, color: RGB, gap: number) => {
      for (const row of rows) {
        page.drawText(row, { x: innerX, y: current, font, size, color })
        current -= leading
      }
      current -= gap
    }
    drawRows(title, bold, 10.7, 14.3, navy, 8)
    const left = (metric.before || '?') + ' ' + metric.unit
    const right = (metric.after || '?') + ' ' + metric.unit
    const beforeLines = wrap('HEUTE  ' + left, bold, 9, (BODY_W - 42) / 2)
    const afterLines = wrap('ZIEL  ' + right, bold, 9, (BODY_W - 42) / 2)
    const count = Math.max(beforeLines.length, afterLines.length)
    for (let i = 0; i < count; i++) {
      if (beforeLines[i])
        page.drawText(beforeLines[i], {
          x: innerX,
          y: current - i * 12.7,
          font: bold,
          size: 9,
          color: ink,
        })
      if (afterLines[i])
        page.drawText(afterLines[i], {
          x: PAD + BODY_W / 2 + 8,
          y: current - i * 12.7,
          font: bold,
          size: 9,
          color: teal,
        })
    }
    current -= Math.max(1, count) * 12.7 + 9
    drawRows(typeLines, regular, 8.9, 12.4, muted, 6)
    drawRows(evidenceLines, regular, 8.8, 12.2, muted, 5)
    if (calcLines.length) drawRows(calcLines, regular, 8.8, 12.2, ink, 5)
    if (realizationLines.length) drawRows(realizationLines, regular, 8.8, 12.2, ink, 5)
    drawRows(
      valueLines,
      metric.included ? bold : regular,
      metric.included ? 9.5 : 9,
      13.6,
      metric.included ? blue : muted,
      0,
    )
    y = top - bodyH - 12
  }

  pageStart()
  const customerName = input.customer.trim() || 'Kundenprojekt (nicht benannt)'
  text(customerName, { font: bold, size: 11, gap: 8, color: navy })
  // A colored executive summary: user-provided Outcome, not an invented ROI claim.
  const headline = input.outcome.trim() || 'Das gewünschte Geschäftsergebnis ist noch zu klären.'
  const lines = wrap(headline, bold, 15, BODY_W - 30)
  const heroH = 39 + lines.length * 19
  if (heroH < PAGE_H - 225) {
    keep(heroH + 10)
    const top = y
    page.drawRectangle({ x: PAD, y: top - heroH, width: BODY_W, height: heroH, color: blueSoft })
    page.drawText('ANGESTREBTES GESCHÄFTSERGEBNIS', {
      x: PAD + 15,
      y: top - 19,
      font: bold,
      size: 8.3,
      color: blue,
    })
    lines.forEach((lineText, i) => {
      page.drawText(lineText, {
        x: PAD + 15,
        y: top - 42 - 19 * i,
        font: bold,
        size: 15,
        color: navy,
      })
    })
    // Eigenständiger Abstand: Kontexttext darf die Summary-Fläche nicht berühren.
    y -= heroH + 16
  } else {
    text('ANGESTREBTES GESCHÄFTSERGEBNIS', { font: bold, size: 8.8, color: blue })
    text(headline, { font: bold, size: 14 })
  }
  text('Ausgangslage: ' + (input.situation || 'Noch offen'), { size: 9.6, color: muted, gap: 6 })
  section('1', 'Warum sich etwas ändern muss')
  stage('01', 'Kundenproblem', input.pain, amberSoft, amber)
  stage('02', 'Geschäftliche Konsequenz', input.consequence, pale, navy)
  stage('03', 'Ermöglichte Veränderung', input.change, tealSoft, teal)
  text('Wichtige Voraussetzung: ' + (input.prerequisites || 'Noch nicht benannt.'), {
    size: 8.8,
    color: muted,
    gap: 8,
  })

  section('2', 'Wie die Verbesserung messbar wird')
  for (const [index, metric] of input.metrics.entries()) metricCard(metric, index)

  section('3', 'Wirtschaftliche Einordnung')
  if (result.financial) {
    text('Modell über ' + input.horizonMonths + ' Monate, undiskontiert. Keine Investitionsfreigabe.', {
      size: 9.1,
      color: muted,
      gap: 10,
    })
    keep(159)
    const gap = 10
    const width = (BODY_W - gap) / 2
    keyNumber('Modellierter Nutzen/Jahr', euro(result.countedAnnualEur), PAD, width, blue)
    keyNumber('Kosten im Zeitraum', euro(result.financial.totalCostEur), PAD + width + gap, width, navy)
    y -= 73
    keyNumber('Nutzen im Zeitraum', euro(result.financial.benefitEur), PAD, width, teal)
    keyNumber('Undiskontierter Saldo', euro(result.financial.netValueEur), PAD + width + gap, width, blue)
    y -= 79
    const payback =
      result.financial.sustainedBreakEvenMonth === null
        ? 'Innerhalb von ' + input.horizonMonths + ' Monaten rechnerisch nicht erreicht'
        : 'Rechnerisch ab Projektmonat ' + result.financial.sustainedBreakEvenMonth
    text('ANHALTENDER BREAK-EVEN: ' + payback, { font: bold, size: 9.1, gap: 12, color: navy })
  } else {
    keep(85)
    page.drawRectangle({ x: PAD, y: y - 71, width: BODY_W, height: 71, color: pale })
    page.drawRectangle({ x: PAD, y: y - 71, width: 4, height: 71, color: blue })
    y -= 17
    text('NOCH KEIN VOLLSTÄNDIGER FINANZIELLER BUSINESS CASE', {
      size: 8.8,
      font: bold,
      color: navy,
      gap: 5,
      x: PAD + 16,
      width: BODY_W - 32,
    })
    text('Nicht monetarisierte Wirkungen und offene Kosten bleiben ausdrücklich offen.', {
      size: 9.2,
      color: muted,
      gap: 10,
      x: PAD + 16,
      width: BODY_W - 32,
    })
    y -= 12
  }

  section('4', 'Was vor einer Entscheidung zu prüfen ist')
  const checklist = [...result.issues, ...result.questions]
  if (!checklist.length) text('Aus den erfassten Daten ergeben sich keine weiteren automatischen Prüfpunkte.')
  for (const [index, item] of checklist.entries()) {
    keep(28)
    page.drawCircle({ x: PAD + 7, y: y + 3, size: 3.1, borderColor: blue, borderWidth: 1 })
    text(index + 1 + '. ' + item, {
      size: 9.2,
      x: PAD + 20,
      width: BODY_W - 20,
      gap: 8,
    })
  }

  keep(57)
  y -= 8
  page.drawLine({ start: { x: PAD, y }, end: { x: PAGE_W - PAD, y }, color: rule, thickness: 0.8 })
  y -= 17
  text(
    'METHODIK: Alle Zahlen beruhen auf erfassten Annahmen und Datenquellen. Auch als kundenseitig ' +
      'geprüft markierte Angaben werden durch diesen Bericht nicht unabhängig verifiziert.',
    {
      size: 8.3,
      color: muted,
      gap: 0,
    },
  )

  drawReportFooter(pdf.getPages(), regular, bold, {
    left: PAD,
    right: PAGE_W - PAD,
    label: 'GESPRÄCHSGRUNDLAGE / KEINE GARANTIE ODER BUDGETFREIGABE',
    borderColor: rule,
    textColor: muted,
    fontSize: 7.1,
  })
  return pdf.save()
}
