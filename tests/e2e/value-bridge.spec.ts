import { expect, test } from '@playwright/test'
import { PDFDocument } from 'pdf-lib'
import { readFile } from 'node:fs/promises'

const route = '/meddpicc-workbench/#/tools/value-bridge'

test('Value Bridge: Servicebeispiel, kundenfähige Visualisierung, PDF und vier Viewports', async ({ page }, testInfo) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.goto(route)
  await page.getByRole('button', { name: 'CRM / Service' }).click()
  await expect(page.getByRole('heading', { name: 'Wirkungszusammenhang' })).toBeVisible()
  await expect(page.locator('.vb-link--value')).toContainText('36.000')
  await expect(page.locator('.vb-link--value')).toContainText('Saldo nach 36 Monaten')
  await page.getByRole('combobox', { name: 'Ergebnisansicht' }).selectOption('true')
  await expect(page.getByText('Offene Validierung')).toHaveCount(0)
  await expect(page.getByText('Fiktives Beispiel geladen, keine echten Kundendaten.')).toBeVisible()
  const downloadEvent = page.waitForEvent('download')
  await page.getByRole('button', { name: 'PDF exportieren' }).click()
  const download = await downloadEvent
  expect(download.suggestedFilename()).toBe('value-bridge.pdf')
  const path = testInfo.outputPath('value-bridge-service-' + testInfo.project.name + '.pdf')
  await download.saveAs(path)
  const pdf = await PDFDocument.load(await readFile(path))
  expect(pdf.getPageCount()).toBeGreaterThanOrEqual(1)

  for (const width of [375, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 })
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
    expect(overflow, 'Seitenüberlauf bei ' + width + ' px').toBeLessThanOrEqual(1)
  }
  await page.setViewportSize({ width: testInfo.project.name === 'mobile-chromium' ? 393 : 1440, height: 900 })
  await page.screenshot({ path: testInfo.outputPath('value-bridge-money-' + testInfo.project.name + '.png'),
    fullPage: true })
  expect(errors).toEqual([])
})

test('Value Bridge: Kapazität ohne bestätigte EUR-Realisierung und sichtbare Fragen', async ({ page }, testInfo) => {
  await page.goto(route)
  await page.getByRole('button', { name: 'Kapazität / Qualität' }).click()
  await expect(page.locator('.vb-link--value')).toContainText('EUR-Realisierung noch offen')
  await expect(page.locator('.vb-link--value')).not.toContainText('Saldo nach')
  await expect(page.getByText('Freigesetzte Kapazität, keine EUR-Ersparnis')).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Offene Validierung' })).toBeVisible()
  await page.screenshot({ path: testInfo.outputPath('value-bridge-open-' + testInfo.project.name + '.png'),
    fullPage: true })
})

test('Value Bridge: doppelte Wirkungsgruppen verhindern finanzielle Freigabe', async ({ page }) => {
  await page.goto(route)
  await page.getByRole('button', { name: 'Vertrieb / Doppelzählung' }).click()
  await expect(page.locator('.vb-errors')).toContainText('Doppelzählung')
  await expect(page.locator('.vb-link--value')).toContainText('EUR-Realisierung noch offen')
})

test('Value Bridge: Metric-Builder-Übergabe ist einmalig, lässt Evidenz unverändert und aktiviert keine Geldrechnung', async ({ page }) => {
  await page.goto('/meddpicc-workbench/#/tools/metric-builder')
  await page.getByRole('button', { name: 'Servicekosten' }).click()
  await page.getByRole('button', { name: 'Weiter', exact: false }).click()
  await page.getByRole('button', { name: 'In Value Bridge übernehmen' }).click()
  await expect(page).toHaveURL(/#\/tools\/value-bridge/)
  await expect(page.getByText('Daten ausdrücklich übernommen.', { exact: false })).toBeVisible()
  await expect(page.locator('.vb-out-metric')).toContainText('Hypothese')
  await expect(page.locator('.vb-link--value')).toContainText('EUR-Realisierung noch offen')
  await page.reload()
  await expect(page.getByText('Daten ausdrücklich übernommen.', { exact: false })).toHaveCount(0)
})
