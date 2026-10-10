import { PDFDocument, StandardFonts, rgb, type PDFPage, type PDFFont } from 'pdf-lib'
import {
  buildMetric,
  euro,
  customerEvidenceLabels,
  mechanismLabels,
  metricSummary,
  metricTypeLabels,
  type MetricBuilderDraft,
} from '../domain/metricBuilder'

const WIDTH = 595.28
const HEIGHT = 841.89
const LEFT = 45
const RIGHT = WIDTH - LEFT
const ink = rgb(0.11, 0.18, 0.29)
const subtle = rgb(0.36, 0.43, 0.51)
const navy = rgb(0.08, 0.15, 0.25)
const blue = rgb(0.12, 0.38, 0.75)
const light = rgb(0.95, 0.97, 0.98)
const white = rgb(1, 1, 1)

function safe(value: string): string {
  return value
    .replace(/[\u2010-\u2015]/g, '-')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201c\u201d]/g, '"')
    .replace(/\u2192/g, '->')
    .replace(/\u00a0/g, ' ')
    .replace(/[^\u0020-\u00ff\u20ac\n]/g, '?')
}

function lines(value: string, font: PDFFont, size: number, width: number): string[] {
  const output: string[] = []
  for (const paragraph of safe(value).split('\n')) {
    let current = ''
    for (const word of paragraph.split(/\s+/)) {
      if (!word) continue
      const next = current ? current + ' ' + word : word
      if (font.widthOfTextAtSize(next, size) <= width) {
        current = next
      } else {
        if (current) output.push(current)
        current = ''
        for (const character of word) {
          if (current && font.widthOfTextAtSize(current + character, size) > width) {
            output.push(current)
            current = ''
          }
          current += character
        }
      }
    }
    if (current) output.push(current)
  }
  return output
}

export async function buildMetricBuilderPdf(draft: MetricBuilderDraft): Promise<Uint8Array> {
  const result = buildMetric(draft)
  const pdf = await PDFDocument.create()
  const regular = await pdf.embedFont(StandardFonts.Helvetica)
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold)
  let page: PDFPage
  let y: number

  function addPage(): void {
    page = pdf.addPage([WIDTH, HEIGHT])
    page.drawRectangle({ x: 0, y: HEIGHT - 85, width: WIDTH, height: 85, color: navy })
    page.drawText('METRIC-STECKBRIEF', { x: LEFT, y: HEIGHT - 39, font: bold, size: 18, color: white })
    page.drawText('KUNDENFÄHIGE DISKUSSIONSGRUNDLAGE', {
      x: LEFT,
      y: HEIGHT - 59,
      font: regular,
      size: 9,
      color: rgb(0.7, 0.82, 0.91),
    })
    y = HEIGHT - 111
  }

  function reserve(height: number): void {
    if (y - height < 67) addPage()
  }

  function heading(text: string): void {
    reserve(36)
    page.drawText(safe(text), { x: LEFT, y, font: bold, size: 12, color: navy })
    y -= 18
  }

  function paragraph(value: string, opts: { bold?: boolean; muted?: boolean; background?: boolean } = {}): void {
    if (!value.trim()) return
    const font = opts.bold ? bold : regular
    const wrapped = lines(value, font, 9.5, RIGHT - LEFT - (opts.background ? 22 : 0))
    const height = wrapped.length * 14 + 11
    reserve(height)
    if (opts.background) {
      page.drawRectangle({
        x: LEFT,
        y: y - height + 8,
        width: RIGHT - LEFT,
        height,
        color: light,
        borderWidth: 0,
      })
      page.drawRectangle({ x: LEFT, y: y - height + 8, width: 3, height, color: blue })
    }
    for (const line of wrapped) {
      page.drawText(line, {
        x: LEFT + (opts.background ? 12 : 0),
        y,
        size: 9.5,
        font,
        color: opts.muted ? subtle : ink,
      })
      y -= 14
    }
    y -= 11
  }

  function pair(label: string, value: string): void {
    paragraph(label.toUpperCase() + ': ' + value)
  }

  addPage()
  paragraph('Typ: ' + metricTypeLabels[draft.formula] + '  |  ' + new Date().toLocaleDateString('de-DE'), {
    muted: true,
  })
  heading('1. Problem und Zielbild')
  pair('Kundenproblem', draft.problem.trim() || 'Noch zu beschreiben')
  if (draft.process.trim()) pair('Betroffener Prozess', draft.process)
  if (draft.consequence.trim()) pair('Auswirkung', draft.consequence)
  pair('Angestrebter Zustand', draft.outcome.trim() || 'Noch offen')

  heading('2. Messbare Veränderung')
  paragraph(
    'Vorher: ' +
      (result.beforeText || 'nicht beziffert') +
      '   |   Nachher: ' +
      (result.afterText || 'nicht beziffert'),
    { background: true },
  )
  paragraph(result.calculation || 'Ausgangsdaten und Rechenweg sind noch nicht vollständig.')
  if (draft.formula !== 'qualitative') {
    pair(
      'Rechnerisches Potenzial',
      result.potentialEur === null ? 'Noch nicht belastbar berechenbar' : euro(result.potentialEur) + ' pro Jahr',
    )
  }

  heading('3. Wirtschaftliche Wirkung')
  paragraph(
    result.realizedEur === null
      ? 'Keine konkrete wirtschaftliche Realisierung nachgewiesen. Ein möglicher Kapazitätsgewinn wird nicht als Einsparung angesetzt.'
      : euro(result.realizedEur) +
          ' pro Jahr sind als wirtschaftlich realisierbarer Anteil modelliert. Die Nachprüfung der Annahmen bleibt erforderlich.',
    { background: true },
  )
  pair('Mechanismus', mechanismLabels[draft.mechanism])
  if (draft.realizationNote.trim()) paragraph('Begründung: ' + draft.realizationNote.trim())

  heading('4. Datenbasis und offene Punkte')
  pair('Herkunft', customerEvidenceLabels[draft.evidence])
  if (draft.assumptionNote.trim()) paragraph('Grundlage: ' + draft.assumptionNote)
  if (result.questions.length) paragraph('Noch zu klären: ' + result.questions.join(' '))
  if (result.issues.length) paragraph('Fehlende / ungültige Angaben: ' + result.issues.join(' '))
  if (!result.complete)
    paragraph('UNVOLLSTÄNDIG: Dieser Steckbrief enthält keine abgeschlossene Modellrechnung.', { bold: true })

  for (const [index, p] of pdf.getPages().entries()) {
    p.drawLine({ start: { x: LEFT, y: 49 }, end: { x: RIGHT, y: 49 }, thickness: 0.75, color: rgb(0.85, 0.89, 0.92) })
    p.drawText('MODELLANNAHMEN - KEINE GARANTIE ODER BUDGETFREIGABE', {
      x: LEFT,
      y: 33,
      font: regular,
      size: 7.4,
      color: subtle,
    })
    p.drawText('SEITE ' + (index + 1), { x: RIGHT - 42, y: 33, font: bold, size: 7.4, color: subtle })
  }
  return pdf.save()
}

/** Kundentext ohne interne Bewertungs- und Coaching-Bezeichnungen. */
export function metricPdfPreview(draft: MetricBuilderDraft): string {
  const result = buildMetric(draft)
  return metricSummary(draft, result)
}
