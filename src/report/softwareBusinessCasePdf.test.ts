import { describe, expect, it } from 'vitest'
import { PDFDocument } from 'pdf-lib'
import { createCrmSaasDemo } from '../data/softwarePaybackDemo'
import { exampleSoftwareProject } from '../domain/softwarePayback'
import { buildSoftwareBusinessCasePdf } from './softwareBusinessCasePdf'

describe('kundenfähiger Business-Case-PDF-Download', () => {
  it('erzeugt prüfbare A4-Seiten und Kundenmetadaten aus der bestehenden Monatsengine', async () => {
    const pdf = await buildSoftwareBusinessCasePdf({
      customer: 'Beispielwerke Industrie GmbH',
      project: 'CRM & Service Transformation',
      preparedBy: 'Demo Vertrieb',
      date: '09.10.2026',
      input: createCrmSaasDemo(),
    })
    expect(
      Array.from(pdf.slice(0, 5))
        .map((n) => String.fromCharCode(n))
        .join(''),
    ).toBe('%PDF-')
    const parsed = await PDFDocument.load(pdf)
    expect(parsed.getPageCount()).toBeGreaterThanOrEqual(5)
    expect(parsed.getTitle()).toContain('CRM & Service')
    for (const page of parsed.getPages()) {
      expect(page.getWidth()).toBeCloseTo(595.28, 1)
      expect(page.getHeight()).toBeCloseTo(841.89, 1)
    }
  })
  it('funktioniert ohne Namen, mit deutschem Umlaut und einfachem Beispiel', async () => {
    const pdf = await buildSoftwareBusinessCasePdf({
      customer: '',
      project: 'Käufer-Ökosystem / CRM+',
      preparedBy: '',
      date: '09.10.2026',
      input: exampleSoftwareProject(),
    })
    const result = await PDFDocument.load(pdf)
    expect(result.getTitle()).toContain('Käufer')
  })
  it('bricht bei Doppelzählung beziehungsweise ungültigen Eingaben ab', async () => {
    const input = exampleSoftwareProject()
    input.metrics[0]!.evidenceNote = ''
    await expect(
      buildSoftwareBusinessCasePdf({
        customer: '',
        project: 'Test',
        preparedBy: '',
        date: '09.10.2026',
        input,
      }),
    ).rejects.toThrow(/ungültige|Doppelzählungen/)
  })
  it('behält negative Projekte und nicht-definierten ROI als Fälle bei', async () => {
    const input = exampleSoftwareProject()
    input.metrics[0]!.annualAmountEur = 0
    const negative = await PDFDocument.load(
      await buildSoftwareBusinessCasePdf({
        customer: 'Testkunde',
        project: 'Negativer Business Case',
        preparedBy: '',
        date: '09.10.2026',
        input,
      }),
    )
    expect(negative.getPageCount()).toBeGreaterThanOrEqual(5)
    input.costs = []
    const zero = await PDFDocument.load(
      await buildSoftwareBusinessCasePdf({
        customer: 'Testkunde',
        project: 'Ohne Kosten',
        preparedBy: '',
        date: '09.10.2026',
        input,
      }),
    )
    expect(zero.getPageCount()).toBeGreaterThanOrEqual(5)
  })
  it('verteilt lange Kunden- und Validierungstexte auf zusätzliche A4-Seiten', async () => {
    const input = createCrmSaasDemo()
    input.metrics[0]!.evidenceNote = 'Verträge und Rechnungen prüfen. '.repeat(900)
    const pdf = await buildSoftwareBusinessCasePdf({
      customer: 'Beispielwerke Industrie GmbH',
      project: 'Lange Kundenargumentation',
      preparedBy: 'Demo Vertrieb',
      date: '09.10.2026',
      businessPain: 'Ausgangslage und Geschäftsauswirkung sind noch zu prüfen. '.repeat(700),
      targetOutcome: 'Zielbild und finanzielle Wirkung sind zu validieren. '.repeat(700),
      input,
    })
    const pages = (await PDFDocument.load(pdf)).getPages()
    expect(pages.length).toBeGreaterThan(10)
    for (const page of pages) {
      expect(page.getWidth()).toBeCloseTo(595.28, 1)
      expect(page.getHeight()).toBeCloseTo(841.89, 1)
    }
  })
})
