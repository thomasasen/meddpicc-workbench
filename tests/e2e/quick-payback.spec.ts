import { expect, test } from '@playwright/test'

const route = '/meddpicc-workbench/#/tools/quick-payback'

async function enterExample(page: import('@playwright/test').Page) {
  await page.getByLabel('Einmalige Anfangsinvestition (EUR)').fill('120.000')
  await page.getByLabel('Jährlicher realisierbarer Bruttonutzen (EUR/Jahr)').fill('240.000')
  await page.getByLabel('Jährliche zusätzliche laufende Kosten (EUR/Jahr)').fill('60.000')
}

test('Quick Payback: Startseite, leerer Zustand und Original-Screenshot', async ({ page }, testInfo) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.goto('/meddpicc-workbench/')
  await page.locator('a[href$="#/tools/quick-payback"]').click()
  await expect(page).toHaveURL(/#\/tools\/quick-payback/)
  await expect(page.getByRole('heading', { name: 'In wie vielen Monaten rechnet sich die Investition?' })).toBeVisible()
  await expect(
    page.getByText('Gib Anfangsinvestition und jährlichen Bruttonutzen ein.', { exact: false }),
  ).toBeVisible()
  await expect(page.getByLabel('Jährliche zusätzliche laufende Kosten (EUR/Jahr)')).toHaveValue('0')
  await expect(page.getByLabel('Einmalige Anfangsinvestition (EUR)')).toHaveValue('')
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.screenshot({
    path: testInfo.outputPath('quick-payback-empty-' + testInfo.project.name + '.png'),
    fullPage: true,
  })
  expect(errors).toEqual([])
})

test('Quick Payback: Berechnung, Copy, Live-Aktualisierung und Original-Screenshot', async ({ page }, testInfo) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.goto(route)
  await enterExample(page)
  await expect(page.locator('.quick-duration')).toContainText('8,0')
  await expect(page.getByText('180.000,00', { exact: false }).first()).toBeVisible()
  await expect(page.getByText('15.000,00', { exact: false }).first()).toBeVisible()
  await expect(page.getByText('linear und undiskontiert', { exact: false })).toBeVisible()
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.screenshot({
    path: testInfo.outputPath('quick-payback-result-' + testInfo.project.name + '.png'),
    fullPage: true,
  })
  await page.getByLabel('Einmalige Anfangsinvestition (EUR)').fill('90.000')
  await expect(page.locator('.quick-duration')).toContainText('6,0')
  await page.getByLabel('Einmalige Anfangsinvestition (EUR)').fill('120.000')
  await page.context().grantPermissions(['clipboard-read', 'clipboard-write'])
  await page.getByRole('button', { name: 'Zusammenfassung kopieren' }).click()
  await expect(page.getByRole('status').last()).toContainText('Zusammenfassung kopiert.')
  const copied = await page.evaluate(() => navigator.clipboard.readText())
  expect(copied).toContain('8,0 Monate')
  expect(copied).toContain('Modellrechnung / Schätzung')
  expect(copied).not.toContain('garantiert')
  expect(errors).toEqual([])
})

test('Quick Payback: ungültige Zahlen, Grenzfälle, Demo, Reset und Quellen', async ({ page }) => {
  await page.goto(route)
  await page.getByRole('button', { name: 'Fiktives Beispiel einsetzen' }).click()
  await expect(page.getByText('Fiktives Beispiel. Keine Kunden- oder Referenzzahlen.')).toBeVisible()
  await expect(page.locator('.quick-duration')).toContainText('8,0')
  const benefit = page.getByLabel('Jährlicher realisierbarer Bruttonutzen (EUR/Jahr)')
  await benefit.fill('0')
  await expect(page.getByText('Unter diesen Annahmen kein einfacher Payback erreichbar.')).toBeVisible()
  await page.getByLabel('Einmalige Anfangsinvestition (EUR)').fill('0')
  await expect(page.getByText('Keine aussagekräftige positive Amortisation.')).toBeVisible()
  await page.getByLabel('Jährliche zusätzliche laufende Kosten (EUR/Jahr)').fill('0')
  await benefit.fill('10')
  await expect(page.locator('.quick-duration')).toContainText('0,0')
  await benefit.fill('-1')
  await expect(page.getByText('Bitte korrigiere die markierten Beträge.')).toBeVisible()
  await expect(benefit).toHaveAttribute('aria-invalid', 'true')
  const sources = page.locator('.quick-sources details')
  await expect(sources).not.toHaveAttribute('open')
  await sources.locator('summary').focus()
  await page.keyboard.press('Enter')
  await expect(sources).toHaveAttribute('open', '')
  await expect(sources.getByText('Darius Lahoutifard', { exact: false })).toBeVisible()
  await page.getByRole('button', { name: 'Zurücksetzen' }).click()
  await expect(page.getByLabel('Einmalige Anfangsinvestition (EUR)')).toHaveValue('')
  await expect(page.getByLabel('Jährliche zusätzliche laufende Kosten (EUR/Jahr)')).toHaveValue('0')
  await expect(page.locator('.quick-duration')).toHaveCount(0)
})

test('Quick Payback: responsive Breiten, Quellen und Eingabefehler ohne Horizontal-Overflow', async ({ page }) => {
  for (const width of [375, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 812 })
    await page.goto(route)
    await enterExample(page)
    await expect(page.locator('.quick-duration')).toContainText('8,0')
    await page.locator('.quick-sources summary').click()
    const wide = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
    expect(wide, 'Ergebnis / Quellen: ' + width).toBeLessThanOrEqual(0)
    await page.getByLabel('Einmalige Anfangsinvestition (EUR)').fill('falsch')
    await expect(page.getByText('Bitte korrigiere die markierten Beträge.')).toBeVisible()
    const invalidWide = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    )
    expect(invalidWide, 'Fehlerzustand: ' + width).toBeLessThanOrEqual(0)
  }
})

test('Quick Payback: Back-Navigation und korrekte aktive sowie geplante Tools', async ({ page }) => {
  await page.goto('/meddpicc-workbench/')
  const builder = page.locator('.tool-row').filter({ has: page.getByText('Metric Builder', { exact: true }) })
  await expect(builder).toHaveAttribute('href', /metric-builder/)
  const delay = page.locator('.tool-row').filter({ has: page.getByText('Cost of Delay', { exact: true }) })
  await expect(delay).toHaveAttribute('href', /cost-of-delay/)
  for (const name of ['Business Case', 'Competition / Alternatives Map']) {
    const item = page.locator('.tool-row').filter({ has: page.getByText(name, { exact: true }) })
    await expect(item.getByText('Geplant')).toBeVisible()
    await expect(item).not.toHaveAttribute('href')
  }
  await page.goto(route)
  await page.getByRole('link', { name: 'Alle Microtools' }).click()
  await expect(page).toHaveURL(/meddpicc-workbench\/#\//)
  await page.goto('/meddpicc-workbench/#/knowledge/competition')
  await expect(page.getByRole('heading', { name: 'Competition: Die echte Alternative verstehen' })).toBeVisible()
  await page.goto('/meddpicc-workbench/#/checklists/competition')
  await expect(page.getByRole('checkbox')).toHaveCount(10)
})
