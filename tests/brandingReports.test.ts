import { describe, expect, it } from 'vitest'
import { loadBrandForReport } from '../src/services/brandProfileStore'
import { PDFDocument } from 'pdf-lib'
import { mkdirSync, writeFileSync } from 'node:fs'
import { createCrmSaasDemo } from '../src/data/softwarePaybackDemo'
import { metricDemos, emptyMetricDraft } from '../src/domain/metricBuilder'
import { calculateCostOfDelay, costOfDelayDemos } from '../src/domain/costOfDelay'
import { valueBridgeDemos } from '../src/domain/valueBridge'
import { buildCustomerBusinessCasePdf } from '../src/report/customerBusinessCasePdf'
import { buildSoftwareBusinessCasePdf } from '../src/report/softwareBusinessCasePdf'
import { buildMetricBuilderPdf } from '../src/report/metricBuilderPdf'
import { buildCostOfDelayPdf } from '../src/report/costOfDelayPdf'
import { buildValueBridgePdf } from '../src/report/valueBridgePdf'
import { brandedDark, brandedLight } from '../src/report/brandProfile.test'

const profiles = [
  { id: 'neutral', brand: null },
  { id: 'dark-wide-png', brand: brandedDark() },
  { id: 'light-tall-jpeg', brand: brandedLight() },
] as const

const demo = () => ({
  customer: 'Fiktive Beispielwerke GmbH',
  project: 'CRM-Testprojekt',
  preparedBy: 'Musterberatung',
  date: '11.10.2026',
  businessPain: 'Fiktiv: manuelle Übertragungen verursachen Aufwände.',
  targetOutcome: 'Fiktiv: bestätigungsbedürftiger Nutzen und weniger Nacharbeit.',
  input: createCrmSaasDemo(),
})

describe('White-Label-Ausgabe: 5 Generatoren × 3 CI-Profile', () => {
  for (const { id, brand } of profiles) {
    it(
      'prüft alle Dokumente mit Profil ' + id,
      async () => {
        const delayInput = costOfDelayDemos.service!
        const delay = calculateCostOfDelay(delayInput, [3, 6])
        expect(delay.success).toBe(true)
        if (!delay.success) return
        const reports: Record<string, Uint8Array> = {
          customer: await buildCustomerBusinessCasePdf(demo(), { brand }),
          finance: await buildSoftwareBusinessCasePdf(demo(), { brand }),
          metric: await buildMetricBuilderPdf({ ...emptyMetricDraft(), ...metricDemos.crm }, { brand }),
          'cost-of-delay': await buildCostOfDelayPdf(delayInput, delay, delay.scenarios[1]!, { brand }),
          'value-bridge': await buildValueBridgePdf(valueBridgeDemos.service!, { brand }),
        }
        for (const [kind, bytes] of Object.entries(reports)) {
          const parsed = await PDFDocument.load(bytes)
          expect(parsed.getPageCount()).toBeGreaterThan(0)
          expect(parsed.getCreator() ?? '').not.toMatch(/MEDDPICC|Toolbox|Workbench/i)
          expect(parsed.getAuthor() ?? '').not.toMatch(/MEDDPICC|Toolbox|Workbench/i)
          for (const page of parsed.getPages()) {
            expect(page.getWidth()).toBeCloseTo(595.28, 1)
            expect(page.getHeight()).toBeCloseTo(841.89, 1)
          }
          if (kind === 'finance') expect(parsed.getPageCount()).toBeGreaterThan(5)
          if (process.env.CI) {
            mkdirSync('qa-branding-artifacts', { recursive: true })
            writeFileSync('qa-branding-artifacts/' + kind + '-' + id + '.pdf', bytes)
          }
        }
      },
      60000,
    )
  }
})

describe('Export bleibt bei fehlender IndexedDB sicher bedienbar', () => {
  it('liefert ohne Browser-Datenbank ein neutrales Profil mit explizitem Warnhinweis', async () => {
    const resolved = await loadBrandForReport()
    expect(resolved.profile).toBeNull()
    expect(resolved.warning).toContain('neutral ohne Firmenbranding')
  })
})
