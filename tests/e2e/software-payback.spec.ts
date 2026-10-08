import { expect, test } from '@playwright/test'

const route = '/meddpicc-workbench/#/tools/quick-payback'

async function projectMode(page: import('@playwright/test').Page) {
  await page.goto(route)
  await page.getByRole('button', { name: 'Softwareprojekt & Kunden-Metrics' }).click()
  await expect(page.getByRole('heading', { name: 'Projektkosten und bestehende IT-Kosten' })).toBeVisible()
}

test('Software Payback: freie Projektmodellierung, Leermodus und Originalbild', async ({ page }, testInfo) => {
  const errors: string[] = []
  page.on('pageerror', err => errors.push(err.message))
  await projectMode(page)
  await expect(page.getByText('Noch keine Kostenpositionen erfasst.')).toBeVisible()
  await expect(page.getByText('Noch keine Kunden-Metric.', { exact: false })).toBeVisible()
  await expect(page.getByTestId('sustained-payback')).toContainText('Nicht erreicht')
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.screenshot({
    path: testInfo.outputPath('software-payback-empty-' + testInfo.project.name + '.png'), fullPage: true,
  })
  await page.getByRole('button', { name: 'Einmalkosten' }).click()
  await expect(page.getByText('Einmaliger Aufwand')).toBeVisible()
  await page.getByRole('button', { name: 'SaaS / Betrieb' }).click()
  await expect(page.getByText('Laufende neue Kosten')).toBeVisible()
  await page.getByRole('button', { name: 'Metric hinzufügen' }).click()
  await expect(page.getByText('Metric 1 · Neue Kunden-Metric')).toBeVisible()
  expect(errors).toEqual([])
})

test('Software Payback: SaaS-Vorlauf, Metriken, Berechnung, Export und Originalbild', async ({ page }, testInfo) => {
  const errors: string[] = []
  page.on('pageerror', err => errors.push(err.message))
  await projectMode(page)
  await page.getByRole('button', { name: 'Fiktives Softwareprojekt einsetzen' }).click()
  await expect(page.getByTestId('sustained-payback')).toHaveText('Monat 18')
  await expect(page.getByText('Datenstatus: Verkäuferannahme.', { exact: false })).toBeVisible()
  await expect(page.getByRole('figure')).toBeVisible()
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.screenshot({
    path: testInfo.outputPath('software-payback-result-' + testInfo.project.name + '.png'), fullPage: true,
  })

  await page.context().grantPermissions(['clipboard-read', 'clipboard-write'])
  await page.getByRole('button', { name: 'Zusammenfassung kopieren' }).click()
  await expect(page.getByText('Kundenbotschaft kopiert.')).toBeVisible()
  const copy = await page.evaluate(() => navigator.clipboard.readText())
  expect(copy).toContain('Projektmonat 18')
  expect(copy).toContain('Modellrechnung / Schätzung')
  expect(copy).toContain('nicht als kundenseitig geprüft')
  const downloadSvg = page.waitForEvent('download')
  await page.getByRole('button', { name: 'SVG exportieren' }).click()
  expect((await downloadSvg).suggestedFilename()).toBe('software-payback.svg')
  const downloadPng = page.waitForEvent('download')
  await page.getByRole('button', { name: 'PNG exportieren' }).click()
  expect((await downloadPng).suggestedFilename()).toBe('software-payback.png')
  expect(errors).toEqual([])
})

test('Software Payback: dieselbe Wirkungsgruppe blockiert Doppelzählung', async ({ page }) => {
  await projectMode(page)
  await page.getByRole('button', { name: 'Fiktives Softwareprojekt einsetzen' }).click()
  await page.getByRole('button', { name: 'Metric hinzufügen' }).click()
  const second = page.locator('.software-entry').filter({ has: page.getByText('Metric 2 · Neue Kunden-Metric') })
  await second.getByLabel('Wirkungsgruppe').fill('crm-gesamtwert')
  await second.getByLabel('Wie wird die wirtschaftliche Wirkung realisiert? / Datenquelle')
    .fill('Fiktive zusätzliche Kennzahl, möglicherweise identisch.')
  await second.getByLabel('Finanzielle Wirkung in Basisrechnung berücksichtigen').check()
  await expect(page.getByText('Mögliche Doppelzählung', { exact: false })).toBeVisible()
  await expect(page.getByTestId('sustained-payback')).toHaveCount(0)
  await second.getByLabel('Finanzielle Wirkung in Basisrechnung berücksichtigen').uncheck()
  await expect(page.getByTestId('sustained-payback')).toHaveText('Monat 18')
})

test('Software Payback: Zeitgewinn und Risk zählen nicht als sichere EUR-Wirkung', async ({ page }) => {
  await projectMode(page)
  await page.getByRole('button', { name: 'Metric hinzufügen' }).click()
  const metric = page.locator('.software-entry').filter({ has: page.getByText('Metric 1 · Neue Kunden-Metric') })
  await metric.getByLabel('Berechnungsbaustein').selectOption('time')
  await expect(metric.getByLabel('Wirtschaftliche Einordnung')).toHaveValue('capacity')
  await expect(metric.getByLabel('Finanzielle Wirkung in Basisrechnung berücksichtigen')).toBeDisabled()
  await metric.getByLabel('Berechnungsbaustein').selectOption('risk')
  await expect(metric.getByLabel('Wirtschaftliche Einordnung')).toHaveValue('risk')
  await expect(metric.getByLabel('Finanzielle Wirkung in Basisrechnung berücksichtigen')).toBeDisabled()
})

test('Software Payback: responsive, direkte Navigation und Tastatur', async ({ page }) => {
  for (const width of [375, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 812 })
    await projectMode(page)
    await page.getByRole('button', { name: 'Fiktives Softwareprojekt einsetzen' }).click()
    await expect(page.getByTestId('sustained-payback')).toHaveText('Monat 18')
    const overflow = await page.evaluate(() =>
      document.documentElement.scrollWidth - document.documentElement.clientWidth)
    expect(overflow, 'horizontal overflow at ' + width).toBeLessThanOrEqual(0)
  }
  await page.getByRole('button', { name: 'Schnellberechnung' }).focus()
  await page.keyboard.press('Enter')
  await expect(page.getByRole('heading', { name: 'Einfacher Payback' })).toBeVisible()
  await page.getByRole('button', { name: 'Softwareprojekt & Kunden-Metrics' }).click()
  await expect(page.getByTestId('sustained-payback')).toContainText('Nicht erreicht')
  await page.getByRole('link', { name: 'Alle Microtools' }).click()
  await expect(page).toHaveURL(/meddpicc-workbench\/#\//)
})
