import { readFileSync } from 'node:fs'
import { PDFDocument } from 'pdf-lib'
import { expect, test } from '@playwright/test'

const route = '/meddpicc-workbench/#/tools/quick-payback'

async function projectMode(page: import('@playwright/test').Page) {
  await page.goto(route)
  await page.getByRole('button', { name: 'Softwareprojekt & Kunden-Metrics' }).click()
  await expect(page.getByRole('heading', { name: 'Kosten erfassen' })).toBeVisible()
}

test('Software Payback: freie Projektmodellierung, Leermodus und Originalbild', async ({ page }, testInfo) => {
  const errors: string[] = []
  page.on('pageerror', (err) => errors.push(err.message))
  await projectMode(page)
  await expect(page.getByText('Mit Einmalkosten oder SaaS / Betrieb starten.')).toBeVisible()
  await expect(page.getByText('Als Einstieg reicht eine jährliche Einsparung in EUR.', { exact: false })).toBeVisible()
  await expect(page.getByTestId('project-empty')).toContainText('keine wirtschaftliche Aussage')
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.screenshot({
    path: testInfo.outputPath('software-payback-empty-' + testInfo.project.name + '.png'),
    fullPage: true,
    scale: 'css',
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
  page.on('pageerror', (err) => errors.push(err.message))
  await projectMode(page)
  await page.getByRole('button', { name: 'Einfaches Beispiel laden' }).click()
  await expect(page.getByTestId('sustained-payback')).toHaveText('Monat 18')
  await expect(page.getByText('Datenstatus: Verkäuferannahme.', { exact: false })).toBeVisible()
  await expect(page.getByRole('figure')).toBeVisible()
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.screenshot({
    path: testInfo.outputPath('software-payback-result-' + testInfo.project.name + '.png'),
    fullPage: true,
    scale: 'css',
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

test('Software Payback: CRM-/SaaS-Beispiel zeigt mehrere finanzielle und nicht monetarisierte Metrics', async ({
  page,
}, testInfo) => {
  await projectMode(page)
  await page.getByRole('button', { name: 'CRM-/SaaS-Beispiel mit Kunden-Metrics' }).click()
  await expect(page.getByRole('status').filter({ hasText: 'Fiktives CRM-/SaaS-Beispiel' })).toBeVisible()
  await expect(page.getByTestId('sustained-payback')).toHaveText('Monat 35')
  await expect(page.getByText('Wegfall externer Vertriebsunterstützung', { exact: false }).first()).toBeVisible()
  await expect(page.getByText('Mehr Abschlüsse durch bessere Conversion', { exact: false }).first()).toBeVisible()
  await expect(page.locator('.software-entry').filter({ has: page.getByText(/Metric [1-5] · /) })).toHaveCount(5)
  await expect(page.getByText('2 weitere Metrics stehen außerhalb', { exact: false })).toBeVisible()
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.screenshot({
    path: testInfo.outputPath('software-payback-crm-demo-' + testInfo.project.name + '.png'),
    fullPage: true,
    scale: 'css',
  })
  await page.getByRole('button', { name: 'Einfaches Beispiel laden' }).click()
  await expect(page.getByTestId('sustained-payback')).toHaveText('Monat 18')
  await page.getByRole('button', { name: 'Zurücksetzen' }).click()
  await expect(page.getByTestId('project-empty')).toContainText('keine wirtschaftliche Aussage')
})

test('Software Payback: dieselbe Wirkungsgruppe blockiert Doppelzählung', async ({ page }) => {
  await projectMode(page)
  await page.getByRole('button', { name: 'Einfaches Beispiel laden' }).click()
  await page.getByRole('button', { name: 'Metric hinzufügen' }).click()
  const second = page.locator('.software-entry').filter({ has: page.getByText('Metric 2 · Neue Kunden-Metric') })
  await second.locator('details.software-more > summary').click()
  await second.getByLabel('Wirkungsgruppe').fill('crm-gesamtwert')
  await second.getByLabel('In den Payback einrechnen').check()
  await second
    .getByLabel('Wie wird der EUR-Nutzen tatsächlich realisiert?')
    .fill('Fiktive zusätzliche Kennzahl, möglicherweise identisch.')
  await expect(page.getByText('Mögliche Doppelzählung', { exact: false })).toBeVisible()
  await expect(page.getByTestId('sustained-payback')).toHaveCount(0)
  await second.getByLabel('In den Payback einrechnen').uncheck()
  await expect(page.getByTestId('sustained-payback')).toHaveText('Monat 18')
})

test('Software Payback: Zeitgewinn und Risk zählen nicht als sichere EUR-Wirkung', async ({ page }) => {
  await projectMode(page)
  await page.getByRole('button', { name: 'Metric hinzufügen' }).click()
  const metric = page.locator('.software-entry').filter({ has: page.getByText('Metric 1 · Neue Kunden-Metric') })
  await metric.getByLabel('Wie wird der Nutzen berechnet?').selectOption('time')
  await expect(metric.getByLabel('Wirtschaftliche Einordnung')).toHaveValue('capacity')
  await expect(metric.getByLabel('In den Payback einrechnen')).toBeDisabled()
  await metric.getByLabel('Wie wird der Nutzen berechnet?').selectOption('risk')
  await expect(metric.getByLabel('Wirtschaftliche Einordnung')).toHaveValue('risk')
  await expect(metric.getByLabel('In den Payback einrechnen')).toBeDisabled()
})

test('Software Payback: sichtbare Einstiege, progressive Eingaben und saubere Ausrichtung', async ({ page }) => {
  await projectMode(page)
  await expect(page.getByRole('button', { name: /Softwareprojekt & Kunden-Metrics/ })).toHaveAttribute(
    'aria-pressed',
    'true',
  )
  await expect(page.getByText('SaaS, Kosten und Nutzen im Zeitverlauf')).toBeVisible()
  await page.getByRole('button', { name: 'Metric hinzufügen' }).click()
  const card = page.locator('.software-entry').filter({ has: page.getByText('Metric 1 · Neue Kunden-Metric') })
  await expect(card.locator('details.software-more')).not.toHaveAttribute('open')
  await expect(card.getByText('Start Monat 1', { exact: false })).toBeVisible()
  await card.locator('details.software-more > summary').focus()
  await page.keyboard.press('Enter')
  await expect(card.locator('details.software-more')).toHaveAttribute('open')
  await expect(card.getByLabel('Erster Nutzenmonat')).toBeVisible()
  await expect(card.getByLabel('Herkunft / Datenqualität')).toBeVisible()

  for (const width of [375, 768, 1280]) {
    await page.setViewportSize({ width, height: 850 })
    const inputs = await card
      .locator(
        '.software-fields:not(.software-detail-fields) input, .software-fields:not(.software-detail-fields) select',
      )
      .evaluateAll((els) =>
        els.map((el) => ({
          height: Math.round(el.getBoundingClientRect().height),
          left: Math.round(el.getBoundingClientRect().left),
          right: Math.round(el.getBoundingClientRect().right),
        })),
      )
    expect(inputs.length).toBeGreaterThanOrEqual(2)
    for (const input of inputs) {
      expect(input.height, 'control height at ' + width).toBeGreaterThanOrEqual(40)
      expect(input.left).toBeGreaterThanOrEqual(0)
      expect(input.right).toBeLessThanOrEqual(width)
    }
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    )
    expect(overflow, 'document overflow ' + width).toBeLessThanOrEqual(0)
  }
})

test('Software Payback: responsive, direkte Navigation und Tastatur', async ({ page }) => {
  for (const width of [375, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 812 })
    await projectMode(page)
    await page.getByRole('button', { name: 'Einfaches Beispiel laden' }).click()
    await expect(page.getByTestId('sustained-payback')).toHaveText('Monat 18')
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    )
    expect(overflow, 'horizontal overflow at ' + width).toBeLessThanOrEqual(0)
  }
  await page.getByRole('button', { name: 'Schnellberechnung' }).focus()
  await page.keyboard.press('Enter')
  await expect(page.getByRole('heading', { name: 'Einfacher Payback' })).toBeVisible()
  await page.getByRole('button', { name: 'Softwareprojekt & Kunden-Metrics' }).click()
  await expect(page.getByTestId('project-empty')).toContainText('keine wirtschaftliche Aussage')
  await page.getByRole('link', { name: 'Alle Microtools' }).click()
  await expect(page).toHaveURL(/meddpicc-workbench\/#\//)
})


test('Business Case: farbcodierte Chart-Markierungen und echtes mehrseitiges PDF', async ({ page }, testInfo) => {
  const errors: string[] = []
  page.on('pageerror', e => errors.push(e.message))
  await projectMode(page)
  await page.getByRole('button', { name: 'CRM-/SaaS-Beispiel mit Kunden-Metrics' }).click()
  await expect(page.getByTestId('sustained-payback')).toHaveText('Monat 35')
  await expect(page.getByTestId('roi-percent')).toContainText('%')
  const chart = page.locator('.value-chart')
  await expect(chart.getByText('Break-even · M35')).toBeVisible()
  await expect(chart.getByText('Tiefpunkt', {exact:false})).toBeVisible()
  await chart.screenshot({ path: testInfo.outputPath('business-case-chart-' + testInfo.project.name + '.png') })

  const customer = page.getByLabel('Kunde / Unternehmen')
  await expect(customer).toHaveValue('Beispielwerke Industrie GmbH')
  await customer.fill('Beispielwerke Industrie GmbH')
  await page.getByLabel('Erstellt von (optional)').fill('Demo Vertrieb')
  const download = page.waitForEvent('download')
  await page.getByRole('button', { name: /Business-Case-Bericht \(PDF\) herunterladen/ }).click()
  const pdfFile = await download
  expect(pdfFile.suggestedFilename()).toContain('.pdf')
  const path = testInfo.outputPath('business-case-qa-' + testInfo.project.name + '.pdf')
  await pdfFile.saveAs(path)
  const bytes = readFileSync(path)
  expect(bytes.subarray(0,5).toString()).toBe('%PDF-')
  expect(bytes.byteLength).toBeGreaterThan(13000)
  const parsed = await PDFDocument.load(bytes)
  expect(parsed.getPageCount()).toBeGreaterThanOrEqual(5)
  expect(parsed.getTitle()).toContain('CRM & Service Transformation')
  for (const pdfPage of parsed.getPages()) {
    expect(pdfPage.getWidth()).toBeCloseTo(595.28,1)
    expect(pdfPage.getHeight()).toBeCloseTo(841.89,1)
  }
  await expect(page.getByRole('status').filter({hasText:'PDF-Bericht erstellt.'})).toBeVisible()
  expect(errors).toEqual([])
})

test('Business Case: ROI und Report blockiert bei Doppelzählung', async ({page}) => {
  await projectMode(page)
  await page.getByRole('button', { name: 'Einfaches Beispiel laden' }).click()
  await expect(page.getByTestId('roi-percent')).toBeVisible()
  await page.getByRole('button', {name:'Metric hinzufügen'}).click()
  const second=page.locator('.software-entry').filter({has:page.getByText('Metric 2 · Neue Kunden-Metric')})
  await second.locator('details.software-more > summary').click()
  await second.getByLabel('Wirkungsgruppe').fill('crm-gesamtwert')
  await second.getByLabel('In den Payback einrechnen').check()
  await second.getByLabel('Wie wird der EUR-Nutzen tatsächlich realisiert?').fill('Hypothetischer Doppelwert')
  await expect(page.getByText('Mögliche Doppelzählung',{exact:false})).toBeVisible()
  await expect(page.getByRole('button',{name:/Business-Case-Bericht \(PDF\)/})).toHaveCount(0)
})
