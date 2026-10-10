import { expect, test } from '@playwright/test'
import { PDFDocument } from 'pdf-lib'
import { readFile } from 'node:fs/promises'

const route = '/meddpicc-workbench/#/tools/cost-of-delay'

test('Cost of Delay: Einstieg, leere Eingaben und Kapazitätsgewinn ohne EUR-Schaden', async ({ page }, testInfo) => {
  await page.goto('/meddpicc-workbench/')
  const entry = page.locator('.tool-row').filter({ has: page.getByText('Cost of Delay', { exact: true }) })
  await expect(entry).toHaveAttribute('href', /cost-of-delay/)
  await entry.click()
  await expect(page.getByRole('heading', { name: 'Was kostet es wirtschaftlich, später zu starten?' })).toBeVisible()
  await page.getByRole('button', { name: '3 · Konsequenz' }).click()
  await expect(page.getByText('Noch kein EUR-Verzögerungsschaden ableitbar.')).toBeVisible()
  await page.getByRole('button', { name: '1 · Ausgangspunkt' }).click()
  await page.getByRole('button', { name: 'Kapazität' }).click()
  await page.getByRole('button', { name: '3 · Konsequenz' }).click()
  await expect(page.getByText('Noch kein EUR-Verzögerungsschaden ableitbar.')).toBeVisible()
  await expect(page.locator('.cod-kpis')).toHaveCount(0)
  await page.screenshot({
    path: testInfo.outputPath('cost-of-delay-empty-' + testInfo.project.name + '.png'),
    fullPage: true,
  })
})

test('Cost of Delay: monatliche EUR-Eingabe wird korrekt auf den Jahreswert normalisiert', async ({ page }) => {
  await page.goto(route)
  await page.getByRole('button', { name: 'CRM / Service' }).click()
  await page.getByLabel('Eingabezeitraum für realisierten Nutzen').selectOption('monthly')
  await page.getByLabel('Realisierbarer Nutzen in EUR/Monat').fill('5000')
  await page.getByRole('button', { name: '3 · Konsequenz' }).click()
  await expect(page.getByRole('button', { name: '+3 Monate' })).toContainText('15.000,00')
})

test('Cost of Delay: fiktives Servicebeispiel, Monatskurve, PDF und Responsive-QA', async ({ page }, testInfo) => {
  const errors: string[] = []
  page.on('pageerror', (err) => errors.push(err.message))
  await page.goto(route)
  await page.getByRole('button', { name: 'CRM / Service' }).click()
  await expect(page.getByText('Fiktives Schulungsbeispiel geladen:', { exact: false })).toBeVisible()
  await page.getByRole('button', { name: '3 · Konsequenz' }).click()
  await expect(page.getByRole('heading', { name: 'Wirtschaftliche Konsequenz verstehen' })).toBeVisible()
  await expect(page.locator('.cod-kpis')).toBeVisible()
  await expect(page.getByText('Unbestätigte Szenarioannahme.', { exact: false })).toBeVisible()
  await expect(page.locator('.cod-chart polyline')).toHaveCount(2)
  await page.getByRole('button', { name: '+3 Monate' }).click()
  await expect(page.getByText('Nutzen bei +3 Monaten')).toBeVisible()
  await expect(page.locator('.cod-breakdown').getByText('Nicht berechenbar')).toBeVisible()
  await page
    .locator('.cod-results details')
    .filter({ hasText: 'Vollständigen Monatsvergleich anzeigen' })
    .locator('summary')
    .click()
  await expect(page.locator('.cod-table-scroll tbody tr')).toHaveCount(37)
  await page
    .locator('.cod-results details')
    .filter({ hasText: 'Vollständigen Monatsvergleich anzeigen' })
    .locator('summary')
    .click()
  const waiting = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Kunden-Steckbrief als PDF' }).click()
  const file = await waiting
  expect(file.suggestedFilename()).toBe('cost-of-delay-steckbrief.pdf')
  const path = testInfo.outputPath('cost-of-delay-' + testInfo.project.name + '.pdf')
  await file.saveAs(path)
  const pdf = await PDFDocument.load(await readFile(path))
  expect(pdf.getPageCount()).toBeGreaterThanOrEqual(1)
  expect(pdf.getPageCount()).toBeLessThanOrEqual(4)
  for (const width of [375, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 })
    const out = await page.evaluate(() => {
      const overflow = document.documentElement.scrollWidth - document.documentElement.clientWidth
      const bad: string[] = []
      document.querySelectorAll<HTMLElement>('.cod-kpis > div, .cod-scenario').forEach((card) => {
        const box = card.getBoundingClientRect()
        if (box.right > document.documentElement.clientWidth + 2) bad.push('KPI ragt aus Sichtfenster')
        if (box.width < 80) bad.push('KPI zu schmal')
      })
      return { overflow, bad }
    })
    expect(out.overflow, 'Horizontaler Overflow bei ' + width).toBeLessThanOrEqual(0)
    expect(out.bad, 'Layout bei ' + width).toEqual([])
  }
  await page.setViewportSize({
    width: testInfo.project.name === 'mobile-chromium' ? 393 : 1280,
    height: 900,
  })
  await page.screenshot({
    path: testInfo.outputPath('cost-of-delay-result-' + testInfo.project.name + '.png'),
    fullPage: true,
  })
  expect(errors).toEqual([])
})

test('Cost of Delay: optionale Zeitregeln und explizite Altvertragsannahmen', async ({ page }) => {
  await page.goto(route)
  await page.getByRole('button', { name: 'Vertrieb' }).click()
  await page.getByRole('button', { name: '2 · Verzögerung' }).click()
  await page.getByLabel('Eigene Verzögerung in Monaten').fill('18')
  await page.locator('.cod-details').filter({ hasText: 'Hat die Wirkung ein festes Ende?' }).locator('summary').click()
  await page.getByLabel('Letzter Monat mit Nutzen').fill('24')
  await page.getByLabel('Wie verändert sich der Endtermin?').selectOption('fixed')
  await page.getByRole('button', { name: '3 · Konsequenz' }).click()
  await expect(page.getByRole('button', { name: '+18 Monate' })).toBeVisible()
  await expect(page.getByText('nicht nachholbar', { exact: false }).last()).toBeVisible()
})

test('Cost of Delay: finanzielle Metric nur nach bewusster Übergabe aus Metric Builder', async ({ page }) => {
  await page.goto('/meddpicc-workbench/#/tools/metric-builder')
  await page.getByRole('button', { name: 'Servicekosten' }).click()
  await page.getByRole('button', { name: 'Weiter', exact: false }).click()
  await page.getByRole('button', { name: 'Realisierbare Metric in Cost of Delay übernehmen' }).click()
  await expect(page).toHaveURL(/#\/tools\/cost-of-delay/)
  await expect(
    page.getByText('Metric Builder: wirtschaftlicher Jahreswert übernommen.', { exact: false }),
  ).toBeVisible()
  await expect(page.getByLabel('Realisierbarer Nutzen in EUR/Jahr')).toHaveValue('60000')
  await expect(page.getByLabel('Herkunft und Prüfstand der Annahmen')).toHaveValue('hypothesis')
  await page.reload()
  await expect(page.getByText('Metric Builder: wirtschaftlicher Jahreswert übernommen.', { exact: false })).toHaveCount(
    0,
  )
})


test('Kumulierter Nutzen bleibt auf schmalen Viewports als scrollbare Grafik lesbar', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 })
  await page.goto('/#/tools/cost-of-delay')
  await page.getByRole('button', { name: 'CRM / Service' }).click()
  await page.getByRole('button', { name: '3 · Konsequenz' }).click()
  const chart = page.getByRole('region', { name: /Diagramm der kumulierten Nutzenverläufe/ })
  await expect(chart).toBeVisible()
  const width = await chart.evaluate((element) => ({
    scroll: element.scrollWidth,
    client: element.clientWidth,
  }))
  expect(width.scroll).toBeGreaterThan(width.client)
  await chart.focus()
  await expect(chart).toBeFocused()
  await expect(page.locator('.cod-chart-scroll-hint')).toBeVisible()
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
  expect(overflow).toBeLessThanOrEqual(1)
})
