import { describe, expect, it } from 'vitest'
import { createCrmSaasDemo } from '../data/softwarePaybackDemo'
import { calculateSoftwarePayback, exampleSoftwareProject } from './softwarePayback'
import { createBusinessCasePdf, investmentKpis, type CaseReport } from './businessCaseReport'
function report(input = exampleSoftwareProject()): CaseReport {
  const result = calculateSoftwarePayback(input)
  if (!result.success) throw new Error(result.issues.join('; '))
  return { customer: 'Beispiel AG', project: 'CRM Einfuehrung', preparedBy: 'Demo', date: '09.10.2026', input, result }
}
describe('Business Case PDF und ROI-Definition', () => {
  it('erstellt ein echtes mehrseitiges A4-PDF ohne Netzwerk', () => {
    const pdf = createBusinessCasePdf(report())
    const header = new TextDecoder().decode(pdf.slice(0, 8))
    expect(header).toBe('%PDF-1.4')
    const body = new TextDecoder().decode(pdf)
    expect(body).toContain('/Type /Catalog')
    expect(body).toContain('/Type /Pages')
    expect(body).toContain('/Count ')
    expect(body).toContain('xref')
    expect(body).toContain('%%EOF')
    expect(pdf.byteLength).toBeGreaterThan(7000)
  })
  it('berechnet ROI über alle wirtschaftlichen neuen Kosten ohne Altlizenzen doppelt abzuziehen', () => {
    const r = report()
    const k = investmentKpis(r)
    expect(k.netEur).toBeCloseTo(r.result.benefitTotalEur - r.result.costTotalEur)
    expect(k.roiPercent).toBeCloseTo((k.netEur / k.costEur) * 100)
    expect(k.investmentEur).toBe(120000)
  })
  it('berichtet das realitätsnähere Demo mit und ohne monetarisierte Metrics ohne erfundene Kundenfreigabe', () => {
    const r = report(createCrmSaasDemo())
    const k = investmentKpis(r)
    expect(r.result.sustainedBreakEvenMonth).toBe(35)
    expect(k.netEur).toBeCloseTo(42583.3333333, 3)
    const body = new TextDecoder().decode(createBusinessCasePdf(r))
    expect(body).toContain('/BaseFont /Helvetica')
    expect(body).not.toContain('customer-approved')
  })
  it('zeigt ROI als nicht definiert bei 0 EUR neuen Kosten', () => {
    const r = report({ horizonMonths: 36, costs: [], metrics: [] })
    expect(investmentKpis(r).roiPercent).toBeNull()
    expect(createBusinessCasePdf(r).byteLength).toBeGreaterThan(4000)
  })
})
