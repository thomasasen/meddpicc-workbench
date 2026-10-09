import { describe, expect, it } from 'vitest'
import { PDFDocument } from 'pdf-lib'
import { createCrmSaasDemo } from '../data/softwarePaybackDemo'
import { exampleSoftwareProject } from '../domain/softwarePayback'
import { buildCustomerBusinessCasePdf } from './customerBusinessCasePdf'

const input = () => ({
  customer: 'Beispielwerke Industrie GmbH',
  project: 'CRM-Modernisierung',
  preparedBy: 'Kundenberatung',
  date: '09.10.2026',
  businessPain: 'Manuelle Nacharbeit und ineffiziente Angebotsprozesse.',
  targetOutcome: 'Nachvollziehbare Kostenreduktion und mehr Deckungsbeitrag.',
  input: createCrmSaasDemo(),
})

describe('Kundenbericht - kompakte Executive-Ausgabe', () => {
  it('erstellt genau vier A4-Seiten für das fiktive CRM-Beispiel', async () => {
    const bytes = await buildCustomerBusinessCasePdf(input())
    const pdf = await PDFDocument.load(bytes)
    expect(
      Array.from(bytes.slice(0, 5))
        .map((n) => String.fromCharCode(n))
        .join(''),
    ).toBe('%PDF-')
    expect(pdf.getPageCount()).toBe(4)
    expect(pdf.getTitle()).toContain('CRM-Modernisierung')
    expect(pdf.getSubject()).toContain('Kundenbericht')
    for (const page of pdf.getPages()) {
      expect(page.getWidth()).toBeCloseTo(595.28, 1)
      expect(page.getHeight()).toBeCloseTo(841.89, 1)
    }
  })

  it('verlangt Kunde, Projekt und Verfasser für eine Kundenunterlage', async () => {
    await expect(buildCustomerBusinessCasePdf({ ...input(), customer: '' })).rejects.toThrow('Kunde')
    await expect(buildCustomerBusinessCasePdf({ ...input(), project: '' })).rejects.toThrow('Kunde')
    await expect(buildCustomerBusinessCasePdf({ ...input(), preparedBy: '' })).rejects.toThrow('Kunde')
    await expect(buildCustomerBusinessCasePdf({ ...input(), businessPain: '' })).rejects.toThrow('Ausgangssituation')
    await expect(buildCustomerBusinessCasePdf({ ...input(), targetOutcome: '' })).rejects.toThrow('Ausgangssituation')
  })

  it('trennt die PDF-Darstellung von Finanzrechnung und verhindert Doppelzählung', async () => {
    const corrupted = exampleSoftwareProject()
    corrupted.metrics[0]!.evidenceNote = ''
    await expect(buildCustomerBusinessCasePdf({ ...input(), input: corrupted })).rejects.toThrow(
      /ungültige|Doppelzählungen/,
    )
  })

  it('unterstützt negative Werte, nicht erreichte Amortisation und Nullkosten', async () => {
    const negative = exampleSoftwareProject()
    negative.metrics[0]!.annualAmountEur = 0
    const bad = await PDFDocument.load(await buildCustomerBusinessCasePdf({ ...input(), input: negative }))
    expect(bad.getPageCount()).toBe(4)

    negative.costs = []
    const free = await PDFDocument.load(await buildCustomerBusinessCasePdf({ ...input(), input: negative }))
    expect(free.getPageCount()).toBe(4)
  })

  it('hält den Kundenbericht auch bei 60 Monaten und vielen Metrics auf vier Seiten', async () => {
    const demo = createCrmSaasDemo()
    demo.horizonMonths = 60
    const extra = Array.from({ length: 12 }, (_, i) => ({
      ...demo.metrics[3]!,
      id: 'extra-' + i,
      name: 'Zusätzliche qualitative Kundenanforderung Nummer ' + i,
      effectGroup: 'extra-' + i,
    }))
    demo.metrics.push(...extra)
    const report = await PDFDocument.load(
      await buildCustomerBusinessCasePdf({
        ...input(),
        businessPain: 'Ausgangslage mit vielen involvierten Prozessen. '.repeat(120),
        targetOutcome: 'Ziele in verschiedenen Geschäftsbereichen. '.repeat(120),
        input: demo,
      }),
    )
    expect(report.getPageCount()).toBe(4)
  })
})
