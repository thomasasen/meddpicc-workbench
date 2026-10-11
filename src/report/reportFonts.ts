import { PDFDocument, StandardFonts, type PDFFont } from 'pdf-lib'
import fontkit from '@pdf-lib/fontkit'
import regularAsset from '@fontsource/noto-sans/files/noto-sans-latin-400-normal.woff?url'
import boldAsset from '@fontsource/noto-sans/files/noto-sans-latin-700-normal.woff?url'

export interface ReportFontSet {
  regular: PDFFont
  bold: PDFFont
}

let cachedAssets: Promise<[Uint8Array, Uint8Array]> | null = null

async function localFontBytes(url: string): Promise<Uint8Array> {
  const response = await fetch(url, { credentials: 'same-origin', redirect: 'error' })
  if (!response.ok) throw new Error('Lokale PDF-Schrift konnte nicht geladen werden.')
  const bytes = new Uint8Array(await response.arrayBuffer())
  if (bytes.byteLength < 1000 || bytes.byteLength > 800_000) {
    throw new Error('Die lokale PDF-Schrift hat eine unerwartete Dateigröße.')
  }
  return bytes
}

/**
 * Die Fonts werden aus dem Vite-Bundle des eigenen Origins ausgeliefert.
 * Kein CDN, keine Google-Fonts-Anfrage. pdf-lib/fontkit wird nur lokal verwendet.
 */
export async function embedReportFonts(pdf: PDFDocument): Promise<ReportFontSet> {
  // Die bestehenden reinen Node/Vitest-Domain-/Layouttests bleiben deterministisch.
  // Reale Unicode-Ausgabe wird zusätzlich im Playwright-Browser auf PDFs getestet.
  if (typeof window === 'undefined') {
    return {
      regular: await pdf.embedFont(StandardFonts.Helvetica),
      bold: await pdf.embedFont(StandardFonts.HelveticaBold),
    }
  }
  pdf.registerFontkit(fontkit)
  if (!cachedAssets) {
    cachedAssets = Promise.all([localFontBytes(regularAsset), localFontBytes(boldAsset)]).catch((error) => {
      cachedAssets = null
      throw error
    })
  }
  const [regularBytes, boldBytes] = await cachedAssets
  return {
    regular: await pdf.embedFont(regularBytes, { subset: true }),
    bold: await pdf.embedFont(boldBytes, { subset: true }),
  }
}

/**
 * PDF-Schriften decken lateinische Zeichen, deutsche Sonderzeichen und
 * gebräuchliche Interpunktion ab. Andere Schriftsysteme / Emoji bleiben
 * explizit begrenzt, statt unbemerkt leere Glyphen einzubetten.
 */
export function normalizeReportUnicode(value: string): string {
  return value
    .replace(/\u00a0|\u202f/g, ' ')
    .replace(/[^\u000a\u0020-\u024f\u2000-\u206f\u20ac]/g, '?')
}
