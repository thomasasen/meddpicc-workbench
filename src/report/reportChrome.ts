import { rgb, type PDFFont, type PDFPage, type RGB } from 'pdf-lib'

/**
 * Gemeinsamer Seitenabschluss aller kundenfähigen Toolbox-PDFs.
 * Die Seiteninhalte und alle fachlichen Berechnungen bleiben beim jeweiligen Report.
 * Der verfügbare Platz für den Disclaimer wird gemessen, nicht geschätzt.
 */
export interface ReportFooterOptions {
  left: number
  right: number
  label: string
  borderColor?: RGB
  textColor?: RGB
  lineY?: number
  textY?: number
  fontSize?: number
  showTotal?: boolean
  pagePrefix?: string
}

export const reportInk = rgb(0.13, 0.2, 0.3)
export const reportMuted = rgb(0.34, 0.41, 0.49)
export const reportRule = rgb(0.82, 0.86, 0.91)

function fitText(value: string, font: PDFFont, size: number, width: number): string {
  if (font.widthOfTextAtSize(value, size) <= width) return value
  const ellipsis = '...'
  let result = value
  while (result && font.widthOfTextAtSize(result + ellipsis, size) > width) {
    result = result.slice(0, -1)
  }
  return result.trimEnd() + ellipsis
}

export function drawReportFooter(
  pages: readonly PDFPage[],
  normal: PDFFont,
  bold: PDFFont,
  options: ReportFooterOptions,
): void {
  const {
    left,
    right,
    label,
    borderColor = reportRule,
    textColor = reportMuted,
    lineY = 53,
    textY = 35,
    fontSize = 7.3,
    showTotal = true,
    pagePrefix = 'Seite ',
  } = options
  pages.forEach((page, index) => {
    const number = pagePrefix + (index + 1) + (showTotal ? ' / ' + pages.length : '')
    const numberWidth = bold.widthOfTextAtSize(number, fontSize)
    const maxLabelWidth = Math.max(20, right - left - numberWidth - 18)
    page.drawLine({
      start: { x: left, y: lineY },
      end: { x: right, y: lineY },
      color: borderColor,
      thickness: 0.75,
    })
    page.drawText(fitText(label, normal, fontSize, maxLabelWidth), {
      x: left,
      y: textY,
      font: normal,
      size: fontSize,
      color: textColor,
    })
    page.drawText(number, {
      x: right - numberWidth,
      y: textY,
      font: bold,
      size: fontSize,
      color: textColor,
    })
  })
}

export interface ReportMastheadOptions {
  page: PDFPage
  normal: PDFFont
  bold: PDFFont
  width: number
  height: number
  left: number
  right: number
  headerHeight: number
  title: string
  subtitle: string
  titleOffset?: number
  subtitleOffset?: number
}

/** Einheitliche Vektor-Kopfzeile, ohne Netzwerk oder externe Bildressourcen. */
export function drawReportMasthead(options: ReportMastheadOptions): void {
  const {
    page, normal, bold, width, height, left, right, headerHeight, title, subtitle,
    titleOffset = 50,
    subtitleOffset = 69,
  } = options
  const white = rgb(1, 1, 1)
  const soft = rgb(0.78, 0.85, 0.94)
  const navy = rgb(0.09, 0.17, 0.29)
  page.drawRectangle({ x: 0, y: height - headerHeight, width, height: headerHeight, color: navy })
  page.drawRectangle({
    x: left,
    y: height - 32,
    width: 23,
    height: 23,
    color: rgb(0.16, 0.36, 0.75),
  })
  page.drawText('M', { x: left + 5.5, y: height - 26, size: 13, font: bold, color: white })
  page.drawText('MEDDPICC TOOLBOX', {
    x: left + 33,
    y: height - 25,
    size: 9,
    font: bold,
    color: white,
  })
  page.drawText(fitText(title, bold, 15, right - left), {
    x: left,
    y: height - titleOffset,
    size: 15,
    font: bold,
    color: white,
  })
  page.drawText(fitText(subtitle, normal, 8, right - left), {
    x: left,
    y: height - subtitleOffset,
    size: 8,
    font: normal,
    color: soft,
  })
}
