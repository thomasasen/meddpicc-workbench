import { describe, expect, it } from 'vitest'
import { PDFDocument } from 'pdf-lib'
import { mkdirSync, writeFileSync } from 'node:fs'
import { buildMetricBuilderPdf } from './metricBuilderPdf'
import { buildCostOfDelayPdf } from './costOfDelayPdf'
import { emptyMetricDraft, metricDemos } from '../domain/metricBuilder'
import { costOfDelayDemos, calculateCostOfDelay } from '../domain/costOfDelay'

describe('Mehrseitige Berichte mit umfangreichen Kundentexten', () => {
  it('paginiert die vollständigen Datenquellen des Metric Builders', async () => {
    const draft = {
      ...emptyMetricDraft(),
      ...metricDemos.crm,
      problem: 'Arbeitsbelastung und fehlerhafte Datenerfassung. '.repeat(32),
      assumptionNote: 'Prüfgrundlage: Verträge, Zeitstempel und Teamgespräche. '.repeat(110),
      realizationNote: 'Der konkrete Mechanismus muss mit dem Kunden bestätigt werden. '.repeat(32),
    }
    const bytes = await buildMetricBuilderPdf(draft)
    if (process.env.CI) {
      mkdirSync('qa-report-artifacts', { recursive: true })
      writeFileSync('qa-report-artifacts/metric-builder-long.pdf', bytes)
    }
    const pdf = await PDFDocument.load(bytes)
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
      problem: 'Der derzeitige Prozess verursacht dokumentationspflichtige Folgekosten. '.repeat(32),
      outcome: 'Die Prozessveränderung muss mehrere Bereiche erreichen. '.repeat(32),
      source: 'Quelle ist noch gemeinsam mit Finance zu prüfen. '.repeat(110),
      extraCostSource: 'Zusätzliche Verzögerungskosten dokumentieren. '.repeat(45),
    }
    const result = calculateCostOfDelay(draft, [3, 6, 12])
    expect(result.success).toBe(true)
    if (!result.success) return
    const selected = result.scenarios.find((scenario) => scenario.delayMonths === 6)!
    const bytes = await buildCostOfDelayPdf(draft, result, selected)
    if (process.env.CI) {
      mkdirSync('qa-report-artifacts', { recursive: true })
      writeFileSync('qa-report-artifacts/cost-of-delay-long.pdf', bytes)
    }
    const pdf = await PDFDocument.load(bytes)
    expect(pdf.getPageCount()).toBeGreaterThan(4)
    for (const page of pdf.getPages()) {
      expect(page.getWidth()).toBeCloseTo(595.28, 1)
      expect(page.getHeight()).toBeCloseTo(841.89, 1)
    }
  })
})
