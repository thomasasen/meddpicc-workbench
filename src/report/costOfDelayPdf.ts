import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from 'pdf-lib'
import { type CostOfDelayInput, type DelayScenario, type CostOfDelayResult } from '../domain/costOfDelay'

const euro = (n: number): string =>
  new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 2,
  }).format(n)
const ink = rgb(0.1, 0.16, 0.25)
const gray = rgb(0.35, 0.41, 0.49)
const lineColor = rgb(0.84, 0.88, 0.92)
const W = 595.28
const H = 841.89
const L = 48
const R = W - 48

function printable(s: string): string {
  return s
    .replace(/[\u2010-\u2015]/g, '-')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201c\u201d]/g, '"')
    .replace(/\u2192/g, '->')
    .replace(/[^\u0020-\u00ff\u20ac]/g, '?')
}
function wrapped(s: string, font: PDFFont, size: number, width: number): string[] {
  const lines: string[] = []
  let current = ''
  for (const word of printable(s).split(/\s+/)) {
    if (font.widthOfTextAtSize((current ? current + ' ' : '') + word, size) <= width) {
      current = current ? current + ' ' + word : word
    } else {
      if (current) lines.push(current)
      current = ''
      for (const c of word) {
        if (font.widthOfTextAtSize(current + c, size) > width && current) {
          lines.push(current)
          current = ''
        }
        current += c
      }
    }
  }
  if (current) lines.push(current)
  return lines.length ? lines : ['Noch offen']
}

/** Zahlen kommen aus derselben Domainfunktion wie in der UI. */
export async function buildCostOfDelayPdf(
  input: CostOfDelayInput,
  result: CostOfDelayResult,
  selected: DelayScenario,
): Promise<Uint8Array> {
  if (!result.success || !result.scenarios.length) throw new Error('Keine wirtschaftliche Rechnung vorhanden.')
  const pdf = await PDFDocument.create()
  const regular = await pdf.embedFont(StandardFonts.Helvetica)
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold)
  let page!: PDFPage
  let y = 0

  function newPage() {
    page = pdf.addPage([W, H])
    page.drawRectangle({ x: 0, y: H - 88, width: W, height: 88, color: ink })
    page.drawText('COST OF DELAY', { x: L, y: H - 39, size: 20, color: rgb(1, 1, 1), font: bold })
    page.drawText('WIRTSCHAFTLICHE AUSWIRKUNG EINER VERSCHIEBUNG', {
      x: L,
      y: H - 59,
      size: 9,
      color: rgb(0.79, 0.84, 0.91),
      font: regular,
    })
    y = H - 115
  }
  function reserve(height: number) {
    if (y - height < 70) newPage()
  }
  function row(
    text: string,
    opts: { size?: number; color?: ReturnType<typeof rgb>; strong?: boolean; after?: number } = {},
  ) {
    const size = opts.size ?? 9.4
    const font = opts.strong ? bold : regular
    const rows = wrapped(text, font, size, R - L)
    reserve(rows.length * 14.5 + (opts.after ?? 7))
    for (const textLine of rows) {
      page.drawText(textLine, { x: L, y, font, size, color: opts.color ?? ink })
      y -= 14.5
    }
    y -= opts.after ?? 7
  }
  function heading(text: string) {
    reserve(37)
    y -= 10
    page.drawText(printable(text), { x: L, y, size: 12, color: ink, font: bold })
    y -= 21
  }
  function labeled(label: string, value: string) {
    const col = L + 157
    const labels = wrapped(label.toUpperCase(), bold, 8.1, 145)
    const values = wrapped(value, regular, 9.2, R - col)
    const h = Math.max(labels.length * 14.5, values.length * 14.5) + 9
    reserve(h)
    labels.forEach((part, i) =>
      page.drawText(part, {
        x: L,
        y: y - i * 14.5,
        font: bold,
        size: 8.1,
        color: gray,
      }),
    )
    values.forEach((part, i) =>
      page.drawText(part, {
        x: col,
        y: y - i * 14.5,
        font: regular,
        size: 9.2,
        color: ink,
      }),
    )
    y -= h
  }
  function separator() {
    reserve(18)
    page.drawLine({ start: { x: L, y }, end: { x: R, y }, color: lineColor, thickness: 0.7 })
    y -= 16
  }

  newPage()
  row(input.title || 'Wirtschaftlicher Verzögerungsvergleich', { size: 13, strong: true })
  row(
    'Szenario: ' +
      selected.delayMonths +
      ' Monate Verschiebung; gemeinsamer Horizont Monat 0 bis ' +
      result.horizonMonths +
      '. Alle Werte sind Modellannahmen, keine bestätigte Vermögensschadensrechnung.',
    { size: 9, color: gray },
  )
  heading('1. Ausgangssituation und Verbesserung')
  labeled('Heutiges Problem', input.problem || 'Noch nicht dokumentiert')
  labeled('Erwartete Verbesserung', input.outcome || 'Noch nicht dokumentiert')
  labeled(
    'Wirtschaftlicher Jahreswert',
    euro(input.annualBenefitEur ?? 0) + (input.benefitKind === 'one-time' ? ' (einmaliger Betrag)' : ' pro Jahr'),
  )
  labeled('Nutzenstart / Ramp-up', 'Monat ' + input.benefitStartMonth + ' / ' + input.rampMonths + ' Monat(e)')
  heading('2. Vergleich im identischen Zeitraum')
  labeled('Ohne weitere Verschiebung', euro(selected.baseBenefitEur) + ' Kundenwirkung')
  labeled('Bei Verschiebung', euro(selected.delayedBenefitEur) + ' Kundenwirkung')
  labeled('Differenz Kundennutzen', euro(selected.benefitDifferenceEur))
  labeled(
    'Spätere Altsystemabschaltung',
    euro(selected.legacyDifferenceEur) + (input.legacyMonthlyEur === null ? ' (nicht erfasst)' : ' Differenz'),
  )
  labeled(
    'Weitere Verzögerungskosten',
    selected.additionalDelayCostEur === null
      ? 'Offen; keine Schätzung eingesetzt'
      : euro(selected.additionalDelayCostEur),
  )
  labeled(
    'Projektkosten im Zeitraum verschoben',
    selected.deferredProjectCostEur === null
      ? 'Offen; keine Kostenannahme eingesetzt'
      : euro(selected.deferredProjectCostEur),
  )
  separator()
  labeled(
    'Netto-Modellunterschied',
    selected.netDifferenceEur === null
      ? 'Nicht bestimmbar: Kostenannahmen sind unvollständig'
      : euro(selected.netDifferenceEur),
  )
  labeled(
    'Als endgültig verloren modelliert',
    selected.irreversibleBenefitEur === null
      ? 'Nicht nachgewiesen; Nutzen möglicherweise nur zeitlich verschoben'
      : euro(selected.irreversibleBenefitEur) + ' (festes Wirkungsende als Annahme)',
  )
  heading('3. Szenarienübersicht')
  for (const item of result.scenarios) {
    labeled(
      item.delayMonths === 0 ? 'Basis ohne Verschiebung' : '+' + item.delayMonths + ' Monate',
      'Kundennutzen: ' + euro(item.delayedBenefitEur) + '; Differenz: ' + euro(item.benefitDifferenceEur),
    )
  }
  heading('4. Nachvollziehbarkeit')
  row(
    'Berechnung: Summe der monatlichen monetarisierbaren Nutzenwerte im Horizont. Der Nutzen beginnt im angegebenen Monat; ' +
      'der Ramp-up steigt pro Monat linear bis 100 %. Verschiebung ändert den Startmonat. Zusatzkosten und Projekttermine ' +
      'ändern sich nur gemäß den separat getroffenen Annahmen.',
    { size: 9.1 },
  )
  labeled('Wirkungsgruppe', input.effectGroup || 'Nicht angegeben')
  labeled(
    'Evidenz',
    input.evidence === 'customer-reviewed'
      ? 'Als mit dem Kunden geprüft gekennzeichnet (vom Programm nicht unabhängig verifiziert)'
      : input.evidence === 'reference'
        ? 'Referenzwert, nicht kundenspezifisch bestätigt'
        : input.evidence === 'customer-stated'
          ? 'Kundenaussage, nicht unabhängig geprüft'
          : 'Hypothese / Modellannahme',
  )
  labeled('Datenherkunft', input.source || 'Nicht dokumentiert')
  labeled('Kostenquelle', input.extraCostSource || 'Nicht dokumentiert')
  heading('5. Offene Fragen für die Kundendiskussion')
  for (const question of result.questions) row('- ' + question, { size: 9.1, after: 4 })
  if (result.unverified)
    row('Kennzeichnung: Die zugrunde liegenden Werte sind nicht als kundenseitig geprüft dokumentiert.', {
      strong: true,
      size: 9.1,
      color: gray,
    })
  for (const [index, p] of pdf.getPages().entries()) {
    p.drawLine({ start: { x: L, y: 53 }, end: { x: R, y: 53 }, color: lineColor, thickness: 0.75 })
    p.drawText('MODELLVERGLEICH - KEINE FINANZIELLE FREIGABE ODER CASHFLOW-PROGNOSE', {
      x: L,
      y: 36,
      color: gray,
      size: 7.2,
      font: regular,
    })
    const number = 'SEITE ' + (index + 1)
    p.drawText(number, { x: R - bold.widthOfTextAtSize(number, 7.5), y: 36, size: 7.5, font: bold, color: gray })
  }
  return pdf.save()
}
