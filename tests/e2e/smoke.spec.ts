import { expect, test } from '@playwright/test'

test('zeigt die MEDDPICC Toolbox mit Tools, Checklists und Knowledge', async ({ page }, testInfo) => {
  const runtimeErrors: string[] = []
  page.on('pageerror', (error) => runtimeErrors.push(error.message))

  await page.goto('/meddpicc-workbench/')

  await expect(page.getByText('MEDDPICC Toolbox', { exact: true }).first()).toBeVisible()
  await expect(
    page.getByRole('heading', { name: 'Wiederkehrende Sales-Aufgaben schneller und sicherer erledigen.' }),
  ).toBeVisible()

  await expect(page.locator('a[href="#tools"]')).toBeVisible()
  await expect(page.locator('a[href="#checklists"]')).toBeVisible()
  await expect(page.locator('a[href="#knowledge"]')).toBeVisible()

  await expect(page.getByRole('heading', { name: 'Eine konkrete Aufgabe erledigen' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Vor wichtigen Sales-Situationen kurz gegenprüfen' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'MEDDPICC-Fragen schnell und praxisnah klären' })).toBeVisible()

  await expect(page.getByRole('link', { name: /Go-Live-Rückwärtsplanung/ })).toBeVisible()
  await expect(page.getByText('Quick Payback', { exact: true })).toBeVisible()
  await expect(page.getByText('Economic-Buyer-Termin', { exact: true })).toBeVisible()
  await expect(
    page.getByText(/Zieltermin und Schritte eingeben.*späteste Starttermine und eine teilbare Timeline/),
  ).toBeVisible()
  await expect(page.getByText(/Investition und Nutzen eingeben.*wann sich die Investition amortisiert/)).toBeVisible()
  await expect(
    page.getByText(/Was macht einen echten Champion aus.*welche Signale werden häufig überschätzt/),
  ).toBeVisible()

  for (const topic of [
    'Metrics',
    'Economic Buyer',
    'Decision Criteria',
    'Decision Process',
    'Paper Process',
    'Pain & Implication',
    'Champion',
    'Competition',
  ]) {
    await expect(page.getByText(topic, { exact: true }).last()).toBeVisible()
  }

  expect(runtimeErrors).toEqual([])

  await page.evaluate(() => {
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur()
    window.scrollTo(0, 0)
  })
  await page.addStyleTag({ content: '.skip-link { display: none !important; }' })

  await page.screenshot({
    path: testInfo.outputPath(`toolbox-start-${testInfo.project.name}.png`),
    fullPage: true,
  })
})

test('rechnet einen Go-Live-Plan rückwärts und zeigt kundenfähige Exporte', async ({ page }, testInfo) => {
  const runtimeErrors: string[] = []
  page.on('pageerror', (error) => runtimeErrors.push(error.message))

  await page.goto('/meddpicc-workbench/')
  await page.getByRole('link', { name: /Go-Live-Rückwärtsplanung/ }).click()

  await expect(page.getByRole('heading', { name: 'Go-Live-Rückwärtsplanung' })).toBeVisible()
  await expect(page.getByText('Kundenfähig', { exact: true }).first()).toBeVisible()

  await page.getByLabel('Kunde optional').fill('Beispielwerke GmbH')
  await page.getByLabel('Planungsdatum').fill('2027-01-04')
  await page.getByLabel('Target Go-Live').fill('2027-07-01')

  await expect(page.getByText('Spätester Start', { exact: true })).toBeVisible()
  await expect(page.getByText('Go-Live-Plan', { exact: true }).last()).toBeVisible()
  await expect(page.getByText('Beispielwerke GmbH', { exact: true })).toBeVisible()
  const timelineChart = page.getByTestId('executive-timeline-chart')
  await expect(
    timelineChart.locator('[data-segment-id="implementation"] .executive-row-label strong'),
  ).toHaveText('Implementierung / Rollout')
  await expect(timelineChart.locator('[data-segment-id="procurement"] .executive-row-label strong')).toHaveText(
    'Einkauf / Procurement',
  )
  await expect(page.getByRole('button', { name: 'SVG' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'PNG' })).toBeVisible()
  await expect(page.getByText(/Feiertage werden in v0\.1 bewusst nicht automatisch eingerechnet/)).toBeVisible()

  expect(runtimeErrors).toEqual([])

  await page.evaluate(() => {
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur()
    window.scrollTo(0, 0)
  })
  await page.addStyleTag({ content: '.skip-link { display: none !important; }' })

  await page.screenshot({
    path: testInfo.outputPath(`reverse-timeline-${testInfo.project.name}.png`),
    fullPage: true,
  })
})

test('validiert fehlerhafte Timeline-Eingaben verständlich', async ({ page }) => {
  await page.goto('/meddpicc-workbench/#/tools/reverse-timeline')

  await page.getByLabel('Target Go-Live').fill('2027-07-01')
  const duration = page.getByLabel('Dauer').first()
  await duration.fill('1.5')

  await expect(page.getByText('Die Timeline kann noch nicht berechnet werden.')).toBeVisible()
  await expect(page.getByText(/Dauer muss eine ganze Zahl zwischen 0 und 1000 sein/)).toBeVisible()
})
