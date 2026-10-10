import { describe, expect, it } from 'vitest'
import { PDFDocument } from 'pdf-lib'
import { buildMetricBuilderPdf } from './metricBuilderPdf'
import { buildCostOfDelayPdf } from './costOfDelayPdf'
import { emptyMetricDraft, metricDemos } from '../domain/metricBuilder'
import { costOfDelayDemos, calculateCostOfDelay } from '../domain/costOfDelay'

describe('Mehrseitige Berichte mit umfangreichen Kundentexten', () => {
  it('paginiert die vollständigen Datenquellen des Metric Builders', async () => {
    const draft = {
      ...emptyMetricDraft(),
      ...metricDemos.crm,
      problem: 'Arbeitsbelastung und fehlerhafte Datenerfassung. '.repeat(170),
      assumptionNote: 'Prüfgrundlage: Verträge, Zeitstempel und Teamgespräche. '.repeat(650),
      realizationNote: 'Der konkrete Mechanismus muss mit dem Kunden bestätigt werden. '.repeat(190),
    }
    const pdf = await PDFDocument.load(await buildMetricBuilderPdf(draft))
    expect(pdf.getPageCount()).toBeGreaterThan(4)
    for (const page of pdf.getPages()) {
      expect(page.getWidth()).toBeCloseTo(595.28, 1)
      expect(page.getHeight()).toBeCloseTo(841.89, 1)
    }
  })

  it('paginiert lange Aussagen und Quellenangaben in Cost of Delay', async () => {
    const original = costOfDelayDemos.service!
    const draft = {
      ...original,
      problem: 'Der derzeitige Prozess verursacht dokumentationspflichtige Folgekosten. '.repeat(170),
      outcome: 'Die Prozessveränderung muss mehrere Bereiche erreichen. '.repeat(170),
      source: 'Quelle ist noch gemeinsam mit Finance zu prüfen. '.repeat(650),
      extraCostSource: 'Zusätzliche Verzögerungskosten dokumentieren. '.repeat(320),
    }
    const result = calculateCostOfDelay(draft, [3, 6, 12])
    expect(result.success).toBe(true)
    if (!result.success) return
    const selected = result.scenarios.find((scenario) => scenario.delayMonths === 6)!
    const pdf = await PDFDocument.load(await buildCostOfDelayPdf(draft, result, selected))
    expect(pdf.getPageCount()).toBeGreaterThan(4)
    for (const page of pdf.getPages()) {
      expect(page.getWidth()).toBeCloseTo(595.28, 1)
      expect(page.getHeight()).toBeCloseTo(841.89, 1)
    }
  })
})
