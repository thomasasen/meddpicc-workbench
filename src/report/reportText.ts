import type { PDFFont } from 'pdf-lib'

/**
 * Gemeinsamer Umbruch: Breitenmessung anhand der eingebetteten Schrift.
 * Erhält Absätze und teilt lange einzelne Wörter statt sie abzuschneiden.
 * Die aufrufenden Generatoren steuern Seitenwechsel und Platzreservierung.
 */
export function wrapReportText(
  value: string,
  font: Pick<PDFFont, 'widthOfTextAtSize'>,
  size: number,
  width: number,
  fallback = '',
): string[] {
  if (!Number.isFinite(size) || size <= 0 || !Number.isFinite(width) || width <= 0) {
    throw new Error('Textbreite und Schriftgröße müssen positiv sein.')
  }
  const lines: string[] = []
  for (const paragraph of (value || fallback).replace(/\r\n?/g, '\n').split('\n')) {
    let current = ''
    for (const word of paragraph.trim().split(/\s+/).filter(Boolean)) {
      const candidate = current ? current + ' ' + word : word
      if (font.widthOfTextAtSize(candidate, size) <= width) {
        current = candidate
        continue
      }
      if (current) lines.push(current)
      current = ''
      for (const char of word) {
        if (current && font.widthOfTextAtSize(current + char, size) > width) {
          lines.push(current)
          current = ''
        }
        current += char
      }
    }
    lines.push(current)
  }
  return lines.length ? lines : [fallback]
}
