import { expect, test } from '@playwright/test'

const route = '/meddpicc-workbench/#/tools/metric-builder'

test('Metric Builder: Discovery, leere Werte und geführter Ablauf', async ({ page }, testInfo) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.goto('/meddpicc-workbench/')
  const entry = page.locator('.tool-row').filter({ has: page.getByText('Metric Builder', { exact: true }) })
  await expect(entry).toHaveAttribute('href', /metric-builder/)
  await entry.click()
  await expect(page).toHaveURL(/#\/tools\/metric-builder/)
  await expect(page.getByRole('heading', { name: 'Vom Kundenproblem zur belastbaren Metric' })).toBeVisible()
  await page.getByRole('button', { name: 'Weiter', exact: false }).click()
  await expect(page.getByText('Kein verlässlicher finanzieller Potenzialwert ableitbar.')).toBeVisible()
  await page.getByRole('button', { name: 'Weiter', exact: false }).click()
  await expect(page.getByText('Unvollständig: Es wird kein abgeschlossener finanzieller Business Case behauptet.')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Metric in Software-Payback übernehmen' })).toBeDisabled()
  await page.screenshot({ path: testInfo.outputPath('metric-builder-empty-' + testInfo.project.name + '.png'), fullPage: true })
  expect(errors).toEqual([])
})

test('Metric Builder: Kapazität ohne Geldersparnis, PDF und responsives Layout', async ({ page }, testInfo) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.goto(route)
  await page.getByRole('button', { name: 'CRM-Zeitgewinn' }).click()
  await expect(page.getByRole('heading', { name: 'Wie lässt sich die Veränderung messen?' })).toBeVisible()
  await expect(page.getByText('91.666,67', { exact: false }).first()).toBeVisible()
  await page.getByRole('button', { name: 'Weiter', exact: false }).click()
  await expect(page.getByRole('heading', { name: 'Was wird tatsächlich wirtschaftlich wirksam?' })).toBeVisible()
  await expect(page.getByText('Nicht nachgewiesen', { exact: false }).first()).toBeVisible()
  await expect(page.getByText('25.000 Vorgänge/Jahr', { exact: false }).first()).toBeVisible()
  const download = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Steckbrief als PDF' }).click()
  const file = await download
  expect(file.suggestedFilename()).toBe('metric-steckbrief.pdf')
  await file.saveAs(testInfo.outputPath('metric-builder-brief-' + testInfo.project.name + '.pdf'))
  await page.screenshot({ path: testInfo.outputPath('metric-builder-result-' + testInfo.project.name + '.png'), fullPage: true })
  for (const width of [375, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 800 })
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    )
    expect(overflow, 'Breite ' + width).toBeLessThanOrEqual(0)
  }
  expect(errors).toEqual([])
})

test('Metric Builder: Service-Metric übertragen, keine automatische Anrechnung', async ({ page }) => {
  await page.goto(route)
  await page.getByRole('button', { name: 'Servicekosten' }).click()
  await page.getByRole('button', { name: 'Weiter', exact: false }).click()
  await expect(page.getByText('60.000', { exact: false }).first()).toBeVisible()
  await page.getByRole('button', { name: 'Metric in Software-Payback übernehmen' }).click()
  await expect(page).toHaveURL(/#\/tools\/quick-payback\?importMetric=1/)
  await expect(page.getByRole('heading', { name: 'Kundennutzen erfassen' })).toBeVisible()
  await expect(page.getByText('Metric(s) übernommen, noch nicht in der Rechnung berücksichtigt.', { exact: false })).toBeVisible()
  const imported = page.locator('.software-entry').filter({ has: page.getByText('Servicebearbeitung', { exact: false }) }).first()
  await expect(imported.getByRole('checkbox', { name: 'In den Payback einrechnen' })).not.toBeChecked()
  await expect(imported.getByText('Nicht angerechnet')).toBeVisible()
  await page.reload()
  await expect(page.getByText('Metric(s) übernommen', { exact: false })).toHaveCount(0)
})

test('Metric Builder: Payback-Kosten bleiben beim Hin- und Rückweg erhalten', async ({ page }) => {
  await page.goto('/meddpicc-workbench/#/tools/quick-payback')
  await page.getByRole('button', { name: 'Softwareprojekt & Kunden-Metrics', exact: false }).click()
  await page.getByRole('button', { name: 'Einmalkosten' }).click()
  await expect(page.locator('.software-entry input').first()).toHaveValue('Projektaufwand')
  await page.getByRole('button', { name: 'Metric entwickeln' }).click()
  await expect(page).toHaveURL(/#\/tools\/metric-builder/)
  await page.getByRole('button', { name: 'Conversion' }).click()
  await page.getByRole('button', { name: 'Weiter', exact: false }).click()
  await page.getByRole('button', { name: 'Metric in Software-Payback übernehmen' }).click()
  await expect(page.getByText('Projektaufwand')).toBeVisible()
  await expect(page.getByText('Angebotsprozess', { exact: false }).first()).toBeVisible()
})

test('Metric Builder: fehlende Annahmen verhindern finanzielle Übernahme', async ({ page }) => {
  await page.goto(route)
  await page.getByRole('button', { name: 'Conversion' }).click()
  await page.getByRole('button', { name: 'Weiter', exact: false }).click()
  await page.getByRole('button', { name: 'Weiter', exact: false }).click()
  await page.getByLabel('Tatsächlich realisierbarer Betrag in EUR pro Jahr').fill('99999999')
  await expect(page.getByText('Der realisierbare Betrag darf das berechnete Potenzial nicht übersteigen.')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Metric in Software-Payback übernehmen' })).toBeDisabled()
})
