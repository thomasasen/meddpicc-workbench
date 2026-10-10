import { describe, expect, it } from 'vitest'
import { wrapReportText } from './reportText'

const font = { widthOfTextAtSize: (value: string, size: number) => value.length * size }

describe('Report-Textumbruch', () => {
  it('bricht Sätze anhand gemessener Breiten um', () => {
    const lines = wrapReportText('Wirtschaftliche Auswirkungen transparent nachvollziehen', font, 1, 22)
    expect(lines.join(' ')).toBe('Wirtschaftliche Auswirkungen transparent nachvollziehen')
    expect(lines.every((line) => line.length <= 22)).toBe(true)
  })

  it('verliert bei langen ungetrennten Wörtern keine Zeichen', () => {
    const lines = wrapReportText('Entscheidungsfreigabeverfahren', font, 1, 8)
    expect(lines.join('')).toBe('Entscheidungsfreigabeverfahren')
    expect(lines.every((line) => line.length <= 8)).toBe(true)
  })

  it('erhält deutsche Umlaute und Geldbeträge ohne Transkription', () => {
    const lines = wrapReportText('Käuferlösung: 125.000 € je Jahr, Prüfung und Änderung', font, 1, 22)
    expect(lines.join(' ')).toContain('Käuferlösung')
    expect(lines.join(' ')).toContain('125.000 €')
  })

  it('erhält Absatzgrenzen und Leerzeilen', () => {
    expect(wrapReportText('Erster Absatz\n\nZweiter Absatz', font, 1, 30)).toEqual([
      'Erster Absatz',
      '',
      'Zweiter Absatz',
    ])
  })

  it('behandelt leere Eingaben und fehlerhafte Breiten explizit', () => {
    expect(wrapReportText('', font, 1, 30, 'Noch offen')).toEqual(['Noch offen'])
    expect(() => wrapReportText('Text', font, 1, 0)).toThrow('Textbreite')
  })
})
