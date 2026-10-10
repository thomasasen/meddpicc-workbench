import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from 'pdf-lib'
import {
  buildMetric,
  customerEvidenceLabels,
  euro,
  mechanismLabels,
  metricSummary,
  metricTypeLabels,
  type MetricBuilderDraft,
} from '../domain/metricBuilder'

/**
 * Visuelle Systematik: konstante linke Achse, Nähe innerhalb einer Information,
 * größerer Abstand zwischen Abschnitten, klarer Typografie-Kontrast.
 * Alle Höhen werden vor dem Zeichnen reserviert; kein Text darf Boxen überlagern.
 */
const PAGE_WIDTH = 595.28
const PAGE_HEIGHT = 841.89
const LEFT = 46
const RIGHT = PAGE_WIDTH - LEFT
const CONTENT_WIDTH = RIGHT - LEFT
const LINE_HEIGHT = 14.5
const COLORS = {
  navy: rgb(0.08, 0.15, 0.25),
  ink: rgb(0.12, 0.19, 0.29),
  muted: rgb(0.34, 0.4, 0.48),
  blue: rgb(0.12, 0.38, 0.75),
  border: rgb(0.84, 0.88, 0.92),
  surface: rgb(0.95, 0.97, 0.98),
  white: rgb(1, 1, 1),
}

function printable(value: string): string {
  return value
    .replace(/[\u2010-\u2015]/g, '-')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201c\u201d]/g, '"')
    .replace(/\u2192/g, '->')
    .replace(/\u00a0/g, ' ')
    .replace(/[^\u0020-\u00ff\u20ac\n]/g, '?')
}

function wrap(value: string, font: PDFFont, size: number, maxWidth: number): string[] {
  const result: string[] = []
  for (const sourceLine of printable(value).split('\n')) {
    let current = ''
    for (const word of sourceLine.split(/\s+/)) {
      if (!word) continue
      const candidate = current ? current + ' ' + word : word
      if (font.widthOfTextAtSize(candidate, size) <= maxWidth) {
        current = candidate
        continue
      }
      if (current) result.push(current)
      current = ''
      for (const letter of word) {
        if (current && font.widthOfTextAtSize(current + letter, size) > maxWidth) {
          result.push(current)
          current = ''
        }
        current += letter
      }
    }
    if (current) result.push(current)
  }
  return result.length ? result : ['']
}

export async function buildMetricBuilderPdf(draft: MetricBuilderDraft): Promise<Uint8Array> {
  const result = buildMetric(draft)
  const pdf = await PDFDocument.create()
  const normal = await pdf.embedFont(StandardFonts.Helvetica)
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold)
  let page!: PDFPage
  let cursor = 0

  function newPage(): void {
    page = pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT])
    page.drawRectangle({
      x: 0,
      y: PAGE_HEIGHT - 92,
      width: PAGE_WIDTH,
      height: 92,
      color: COLORS.navy,
    })
    page.drawText('METRIC-STECKBRIEF', {
      x: LEFT,
      y: PAGE_HEIGHT - 40,
      size: 18,
      font: bold,
      color: COLORS.white,
    })
    page.drawText('KUNDENFÄHIGE DISKUSSIONSGRUNDLAGE', {
      x: LEFT,
      y: PAGE_HEIGHT - 63,
      size: 9.2,
      font: normal,
      color: rgb(0.76, 0.83, 0.91),
    })
    cursor = PAGE_HEIGHT - 120
  }

  function reserve(height: number): void {
    if (cursor - height < 72) newPage()
  }

  function text(
    value: string,
    options: {
      size?: number
      font?: PDFFont
      color?: ReturnType<typeof rgb>
      left?: number
      width?: number
      gap?: number
    } = {},
  ): void {
    if (!value.trim()) return
    const font = options.font ?? normal
    const size = options.size ?? 9.8
    const x = options.left ?? LEFT
    const rows = wrap(value, font, size, options.width ?? RIGHT - x)
    const lineHeight = size < 9 ? 12.5 : LINE_HEIGHT
    const after = options.gap ?? 8
    reserve(rows.length * lineHeight + after)
    for (const row of rows) {
      page.drawText(row, { x, y: cursor, font, size, color: options.color ?? COLORS.ink })
      cursor -= lineHeight
    }
    cursor -= after
  }

  function section(title: string): void {
    reserve(50)
    cursor -= 13
    page.drawText(printable(title), { x: LEFT, y: cursor, font: bold, size: 12, color: COLORS.navy })
    cursor -= 24
  }

  function labeled(label: string, value: string): void {
    const rows = wrap(value || 'Noch offen', normal, 9.8, CONTENT_WIDTH)
    const total = 12.5 + rows.length * LINE_HEIGHT + 11
    reserve(total)
    page.drawText(printable(label.toUpperCase()), {
      x: LEFT,
      y: cursor,
      font: bold,
      size: 8.2,
      color: COLORS.muted,
    })
    cursor -= 16
    for (const row of rows) {
      page.drawText(row, { x: LEFT, y: cursor, font: normal, size: 9.8, color: COLORS.ink })
      cursor -= LINE_HEIGHT
    }
    cursor -= 9
  }

  function highlight(label: string, value: string): void {
    const body = wrap(value, normal, 9.8, CONTENT_WIDTH - 30)
    const title = wrap(label.toUpperCase(), bold, 8.4, CONTENT_WIDTH - 30)
    const height = 18 + title.length * 12.5 + 8 + body.length * LINE_HEIGHT + 13
    reserve(height + 18)
    const top = cursor + 12
    page.drawRectangle({
      x: LEFT,
      y: top - height,
      width: CONTENT_WIDTH,
      height,
      color: COLORS.surface,
    })
    page.drawRectangle({
      x: LEFT,
      y: top - height,
      width: 3,
      height,
      color: COLORS.blue,
    })
    let local = top - 19
    for (const row of title) {
      page.drawText(row, {
        x: LEFT + 16,
        y: local,
        font: bold,
        size: 8.4,
        color: COLORS.muted,
      })
      local -= 12.5
    }
    local -= 8
    for (const row of body) {
      page.drawText(row, {
        x: LEFT + 16,
        y: local,
        font: normal,
        size: 9.8,
        color: COLORS.ink,
      })
      local -= LINE_HEIGHT
    }
    cursor = top - height - 15
  }

  function beforeAfter(): void {
    const gap = 12
    const width = (CONTENT_WIDTH - gap) / 2
    const values = [
      { label: 'HEUTE', value: result.beforeText || 'Nicht beziffert' },
      { label: 'ANGESTREBTER ZUSTAND', value: result.afterText || 'Nicht beziffert' },
    ]
    const wrapped = values.map((v) => wrap(v.value, bold, 10.1, width - 30))
    const height = Math.max(...wrapped.map((rows) => rows.length)) * 15 + 48
    reserve(height + 17)
    const top = cursor + 10
    for (const [index, value] of values.entries()) {
      const x = LEFT + index * (width + gap)
      page.drawRectangle({
        x,
        y: top - height,
        width,
        height,
        color: COLORS.surface,
      })
      page.drawText(value.label, {
        x: x + 15,
        y: top - 21,
        size: 8.3,
        font: bold,
        color: COLORS.muted,
      })
      wrapped[index]!.forEach((row, offset) => {
        page.drawText(row, {
          x: x + 15,
          y: top - 42 - offset * 15,
          size: 10.1,
          font: bold,
          color: COLORS.ink,
        })
      })
    }
    cursor = top - height - 16
  }

  newPage()
  text(metricTypeLabels[draft.formula] + '  |  ' + new Date().toLocaleDateString('de-DE'), {
    size: 9,
    color: COLORS.muted,
    gap: 7,
  })

  section('1. Problem und Zielbild')
  labeled('Kundenproblem', draft.problem.trim() || 'Noch zu beschreiben')
  if (draft.process.trim()) labeled('Betroffener Prozess', draft.process.trim())
  if (draft.consequence.trim()) labeled('Auswirkung', draft.consequence.trim())
  labeled('Angestrebter Zustand', draft.outcome.trim() || 'Noch offen')

  section('2. Messbare Veränderung')
  beforeAfter()
  labeled('Berechnungsweg', result.calculation || 'Ausgangsdaten und Rechenweg sind noch nicht vollständig.')
  if (draft.formula !== 'qualitative') {
    labeled(
      'Rechnerisches Potenzial pro Jahr',
      result.potentialEur === null ? 'Noch nicht belastbar berechenbar' : euro(result.potentialEur),
    )
  }

  section('3. Wirtschaftliche Wirkung')
  highlight(
    'Wirtschaftlich realisierbar',
    result.realizedEur === null
      ? 'Nicht nachgewiesen. Ein möglicher Kapazitätsgewinn wird nicht als Einsparung angesetzt.'
      : euro(result.realizedEur) +
          ' pro Jahr sind als realisierbarer Anteil modelliert. Die Annahmen müssen noch kundenseitig geprüft werden.',
  )
  labeled('Realisierungsmechanismus', mechanismLabels[draft.mechanism])
  if (draft.realizationNote.trim()) labeled('Begründung', draft.realizationNote.trim())

  section('4. Datenbasis und nächste Fragen')
  labeled('Herkunft', customerEvidenceLabels[draft.evidence])
  if (draft.assumptionNote.trim()) labeled('Datenbasis', draft.assumptionNote.trim())
  if (result.questions.length) labeled('Noch zu klären', result.questions.join(' '))
  if (result.issues.length) labeled('Fehlende oder ungültige Angaben', result.issues.join(' '))
  if (!result.complete) highlight('Unvollständige Berechnung', 'Es liegt noch keine abgeschlossene Modellrechnung vor.')

  for (const [index, p] of pdf.getPages().entries()) {
    p.drawLine({
      start: { x: LEFT, y: 53 },
      end: { x: RIGHT, y: 53 },
      color: COLORS.border,
      thickness: 0.75,
    })
    p.drawText('MODELLANNAHMEN - KEINE GARANTIE ODER BUDGETFREIGABE', {
      x: LEFT,
      y: 34,
      size: 7.6,
      font: normal,
      color: COLORS.muted,
    })
    const number = 'SEITE ' + (index + 1)
    p.drawText(number, {
      x: RIGHT - bold.widthOfTextAtSize(number, 7.6),
      y: 34,
      size: 7.6,
      font: bold,
      color: COLORS.muted,
    })
  }
  return pdf.save()
}

/** Kundentext ohne interne Bewertungs- und Coaching-Bezeichnungen. */
export function metricPdfPreview(draft: MetricBuilderDraft): string {
  return metricSummary(draft, buildMetric(draft))
}
