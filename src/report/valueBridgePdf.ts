import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from 'pdf-lib'
import {
  bridgeEvidenceLabels,
  bridgeKindLabels,
  evaluateValueBridge,
  type ValueBridgeInput,
} from '../domain/valueBridge'

const W = 595.28
const H = 841.89
const X = 46
const RIGHT = W - X
const navy = rgb(0.08, 0.15, 0.25)
const ink = rgb(0.13, 0.2, 0.29)
const muted = rgb(0.34, 0.41, 0.49)
const line = rgb(0.82, 0.87, 0.92)
const euro = (value: number): string =>
  new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 2 }).format(value)

/** PDF StandardFonts unterstützen kein vollständiges Unicode; unbekannte Glyphen bleiben sichtbar markiert. */
function printable(value: string): string {
  return value
    .replace(/[\u2010-\u2015]/g, '-')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201c\u201d]/g, '"')
    .replace(/\u2192/g, ' -> ')
    .replace(/[\u00a0\u202f]/g, ' ')
    .replace(/[^\u0020-\u00ff\u20ac\n]/g, '?')
}

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
      for (const letter of word) {
        if (current && font.widthOfTextAtSize(current + letter, size) > width) {
          out.push(current)
          current = ''
        }
        current += letter
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
  let cursor = 0

  function newPage(): void {
    page = pdf.addPage([W, H])
    page.drawRectangle({ x: 0, y: H - 94, width: W, height: 94, color: navy })
    page.drawText('VALUE BRIDGE', { x: X, y: H - 40, font: bold, size: 19, color: rgb(1, 1, 1) })
    page.drawText('Gesprächsgrundlage - wirtschaftliche Wirkung und offene Annahmen', {
      x: X,
      y: H - 65,
      font: regular,
      size: 9.1,
      color: rgb(0.82, 0.87, 0.94),
    })
    cursor = H - 120
  }
  function reserve(height: number): void {
    if (cursor - height < 75) newPage()
  }
  function paragraph(value: string, size = 10, gap = 11, font: PDFFont = regular): void {
    const lines = wrap(value || 'Noch offen', font, size, RIGHT - X)
    const leading = size + 4.6
    // Einzelne Zeilen statt den gesamten Block reservieren: sehr lange deutsche
    // Fließtexte umbrechen auch über mehrere PDF-Seiten ohne Abschneiden.
    for (const row of lines) {
      reserve(leading + 2)
      page.drawText(row, { x: X, y: cursor, font, size, color: ink })
      cursor -= leading
    }
    cursor -= gap
  }
  function section(label: string): void {
    reserve(46)
    cursor -= 8
    page.drawLine({ start: { x: X, y: cursor + 10 }, end: { x: RIGHT, y: cursor + 10 }, thickness: 0.6, color: line })
    page.drawText(printable(label), { x: X, y: cursor - 9, font: bold, size: 12.1, color: navy })
    cursor -= 33
  }
  function entry(label: string, value: string): void {
    paragraph(label.toUpperCase(), 8.2, 2, bold)
    paragraph(value || 'Noch offen', 9.8, 10)
  }

  newPage()
  entry('Unternehmen', input.customer.trim() || 'Nicht angegeben')
  section('1. Ausgangssituation und Ziel')
  entry('Ausgangssituation', input.situation)
  entry('Kundenproblem', input.pain)
  entry('Geschäftliche Konsequenz', input.consequence)
  entry('Angestrebtes Ergebnis', input.outcome)
  entry('Ermöglichte Veränderung', input.change)
  entry('Voraussetzungen', input.prerequisites)

  section('2. Messbare Wirkung')
  for (const [index, metric] of input.metrics.entries()) {
    reserve(36)
    paragraph(index + 1 + '. ' + (metric.name || 'Metric noch offen'), 11, 6, bold)
    entry(
      'Messung heute -> Ziel',
      (metric.before || '?') + ' -> ' + (metric.after || '?') + (metric.unit ? ' ' + metric.unit : ''),
    )
    entry('Art der Wirkung', bridgeKindLabels[metric.kind])
    if (metric.calculation) entry('Rechenweg des Jahreswerts', metric.calculation)
    entry(
      'Datenherkunft',
      bridgeEvidenceLabels[metric.evidence] + (metric.source ? ' | ' + metric.source : ' | Quelle offen'),
    )
    if (metric.annualPotentialEur !== null) entry('Rechnerisches Potenzial / Jahr', euro(metric.annualPotentialEur))
    if (metric.included && (metric.kind === 'saving' || metric.kind === 'margin')) {
      entry(
        'Als realisierbar modelliert / Jahr',
        metric.annualRealizedEur === null ? 'Nicht beziffert' : euro(metric.annualRealizedEur),
      )
      entry('Begründeter Realisierungsmechanismus', metric.realization)
    } else {
      entry('Wirtschaftliche Anrechnung', 'Nicht als realisierter EUR-Nutzen angerechnet.')
    }
  }

  section('3. Wirtschaftliche Einordnung')
  if (result.financial) {
    entry('Betrachtungszeitraum', input.horizonMonths + ' Monate')
    entry('Gesamte neue Kosten', euro(result.financial.totalCostEur))
    entry('Modellierter wirtschaftlicher Nutzen', euro(result.financial.benefitEur))
    entry('Undiskontierter kumulierter Saldo', euro(result.financial.netValueEur))
    entry(
      'Anhaltender rechnerischer Break-even',
      result.financial.sustainedBreakEvenMonth === null
        ? 'Innerhalb des Horizonts nicht erreicht'
        : 'Ab Projektmonat ' + result.financial.sustainedBreakEvenMonth,
    )
  } else {
    paragraph(
      'Eine belastbare Gesamtinvestitionsrechnung liegt noch nicht vor. Offene Kosten, ' +
        'nicht realisierbare Wirkungen und mögliche Doppelzählungen werden nicht geschätzt.',
    )
  }

  section('4. Wesentliche offene Annahmen')
  const open = [...result.issues, ...result.questions]
  if (!open.length) paragraph('Keine zusätzlichen Prüffragen aus den hinterlegten Daten abgeleitet.')
  for (const item of open) paragraph('- ' + item, 9.2, 6)

  paragraph(
    'Modellwerte sind keine Investitionsfreigabe. Ein als geprüft markierter Wert beruht auf einer ' +
      'Nutzereingabe und ist nicht unabhängig verifiziert.',
    8.6,
    10,
  )

  for (const [index, p] of pdf.getPages().entries()) {
    p.drawLine({ start: { x: X, y: 55 }, end: { x: RIGHT, y: 55 }, color: line, thickness: 0.7 })
    const footer = 'DISKUSSIONSGRUNDLAGE - KEINE GARANTIE ODER BUDGETFREIGABE'
    p.drawText(footer, { x: X, y: 37, font: regular, size: 7.2, color: muted })
    const number = 'Seite ' + (index + 1) + '/' + pdf.getPageCount()
    p.drawText(number, {
      x: RIGHT - regular.widthOfTextAtSize(number, 7.4),
      y: 37,
      font: regular,
      size: 7.4,
      color: muted,
    })
  }
  return pdf.save()
}
