import { describe, expect, it } from 'vitest'
import { PDFDocument, StandardFonts } from 'pdf-lib'
import { drawReportFooter } from './reportChrome'

describe('gemeinsamer Report-Seitenabschluss', () => {
  it('platziert Zähler und gekürzten Hinweis innerhalb der Seitenbreite', async () => {
    const pdf = await PDFDocument.create()
    const normal = await pdf.embedFont(StandardFonts.Helvetica)
    const bold = await pdf.embedFont(StandardFonts.HelveticaBold)
    const pages = [pdf.addPage([595.28, 841.89]), pdf.addPage([595.28, 841.89])]
    expect(() =>
      drawReportFooter(pages, normal, bold, {
        left: 46,
        right: 549,
        label: 'Modellrechnung und offene Annahmen '.repeat(20),
        pagePrefix: 'Seite ',
      }),
    ).not.toThrow()
    const file = await pdf.save()
    expect(file.byteLength).toBeGreaterThan(500)
    expect(pdf.getPageCount()).toBe(2)
  })
})
