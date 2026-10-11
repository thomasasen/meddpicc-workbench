import { rgb, type PDFFont, type PDFPage, type RGB, type PDFDocument, type PDFImage } from 'pdf-lib'
import { contrastRatio, hexToRgb, readableInkOn, validateBrandProfile, type BrandProfile } from './brandProfile'

export type ReportAudience = 'customer' | 'internal'
export interface ReportOptions {
  brand?: BrandProfile | null
}

export interface PreparedReportBranding {
  audience: ReportAudience
  profile: BrandProfile | null
  image: PDFImage | null
  primary: RGB
  accent: RGB
  onPrimary: RGB
}

export const reportInk = rgb(0.13, 0.2, 0.3)
export const reportMuted = rgb(0.34, 0.41, 0.49)
export const reportRule = rgb(0.82, 0.86, 0.91)

const rgbHex = (hex: string): RGB => {
  const c = hexToRgb(hex)
  return rgb(c.red, c.green, c.blue)
}

/** Snapshot wird vor dem ersten Seitenaufbau validiert und das Logo genau einmal eingebettet. */
export async function prepareReportBranding(
  pdf: PDFDocument,
  supplied: BrandProfile | null | undefined,
  audience: ReportAudience,
): Promise<PreparedReportBranding> {
  const profile = supplied ? validateBrandProfile(supplied) : null
  let image: PDFImage | null = null
  if (profile?.logo) {
    const bytes = Uint8Array.from(atob(profile.logo.base64), (char) => char.charCodeAt(0))
    image = profile.logo.mimeType === 'image/png' ? await pdf.embedPng(bytes) : await pdf.embedJpg(bytes)
  }
  const background = profile?.primaryColor ?? '#172B49'
  return {
    audience,
    profile,
    image,
    primary: rgbHex(background),
    accent: rgbHex(profile?.accentColor ?? '#2764A8'),
    onPrimary: rgbHex(readableInkOn(background)),
  }
}

/** Keine Täuschung über einen Autor; die Bibliotheks-Provenienz bleibt zulässig. */
export function applyReportBrandMetadata(pdf: PDFDocument, branding: PreparedReportBranding): void {
  pdf.setCreator('')
  if (branding.profile?.defaultAuthor) pdf.setAuthor(branding.profile.defaultAuthor)
}

function fitText(value: string, font: PDFFont, size: number, width: number): string {
  // Helvetica ist WinAnsi. Ungültige Brandingzeichen werden bereits beim Import zurückgewiesen.
  if (font.widthOfTextAtSize(value, size) <= width) return value
  const ellipsis = '...'
  let result = value
  while (result && font.widthOfTextAtSize(result + ellipsis, size) > width) {
    result = result.slice(0, -1)
  }
  return result.trimEnd() + ellipsis
}

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
  branding?: PreparedReportBranding
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
    branding,
  } = options
  // Individuelle Textfarbe nur bei WCAG-tauglichem Kontrast auf weißem Papier.
  const requestedInk = branding?.profile?.textColor
  const footerInk = requestedInk && contrastRatio(requestedInk, '#FFFFFF') >= 4.5 ? rgbHex(requestedInk) : textColor
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
      color: footerInk,
    })
    page.drawText(number, {
      x: right - numberWidth,
      y: textY,
      font: bold,
      size: fontSize,
      color: footerInk,
    })
    // Fachlich verpflichtende Disclaimer werden nicht durch frei konfigurierten Text ersetzt.
    const extra = [branding?.profile?.website, branding?.profile?.contact, branding?.profile?.footerNote]
      .filter(Boolean)
      .join(' | ')
    if (extra) {
      page.drawText(fitText(extra, normal, 6.3, right - left - 8), {
        x: left,
        y: Math.max(9, textY - 11),
        font: normal,
        size: 6.3,
        color: footerInk,
      })
    }
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
  branding?: PreparedReportBranding
}

/**
 * Neutrales oder gebrandetes White-Label. Alte Inhaltsstartpositionen bleiben
 * unabhängig von Logo und Firmenname konstant. Ein Logo wird proportional eingepasst.
 */
export function drawReportMasthead(options: ReportMastheadOptions): void {
  const {
    page,
    normal,
    bold,
    width,
    height,
    left,
    right,
    headerHeight,
    title,
    subtitle,
    titleOffset = 50,
    subtitleOffset = 69,
    branding,
  } = options
  const base = branding?.primary ?? rgb(0.09, 0.17, 0.29)
  const foreground = branding?.onPrimary ?? rgb(1, 1, 1)
  const soft = foreground
  page.drawRectangle({ x: 0, y: height - headerHeight, width, height: headerHeight, color: base })
  // Reine Zierlinie, nicht auf KPIs/Warnings angewandt. Neutrale Exporte bleiben ohne CI-Streifen.
  if (branding?.profile) {
    page.drawRectangle({
      x: 0,
      y: height - headerHeight,
      width,
      height: 2.4,
      color: branding.accent,
    })
  }
  const markTop = height - 10
  let companyX = left
  if (branding?.image) {
    const fitted = branding.image.scaleToFit(86, 22)
    const patchW = fitted.width + 8
    page.drawRectangle({
      x: left,
      y: markTop - 25,
      width: patchW,
      height: 26,
      color: rgb(1, 1, 1),
    })
    page.drawImage(branding.image, {
      x: left + (patchW - fitted.width) / 2,
      y: markTop - 24 + (22 - fitted.height) / 2,
      width: fitted.width,
      height: fitted.height,
    })
    companyX += patchW + 9
  }
  if (branding?.profile?.companyName) {
    const reserved = branding.audience === 'internal' ? 145 : 0
    const available = Math.max(35, right - companyX - reserved)
    page.drawText(fitText(branding.profile.companyName, bold, 8.5, available), {
      x: companyX,
      y: height - 25,
      size: 8.5,
      font: bold,
      color: foreground,
    })
  }
  if (branding?.audience === 'internal') {
    const label = 'INTERNE ARBEITSUNTERLAGE'
    page.drawText(label, {
      x: right - bold.widthOfTextAtSize(label, 7.2),
      y: height - 25,
      size: 7.2,
      font: bold,
      color: foreground,
    })
  }
  page.drawText(fitText(title, bold, 15, right - left), {
    x: left,
    y: height - titleOffset,
    size: 15,
    font: bold,
    color: foreground,
  })
  page.drawText(fitText(subtitle, normal, 8, right - left), {
    x: left,
    y: height - subtitleOffset,
    size: 8,
    font: normal,
    color: soft,
  })
}
