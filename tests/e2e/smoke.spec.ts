import { expect, test } from '@playwright/test'

test('zeigt die MEDDPICC Toolbox mit Tools, Checklists und Knowledge', async ({ page }, testInfo) => {
  const runtimeErrors: string[] = []
  page.on('pageerror', (error) => runtimeErrors.push(error.message))

  await page.goto('/meddpicc-workbench/')

  await expect(page.getByText('MEDDPICC Toolbox', { exact: true }).first()).toBeVisible()
  await expect(
    page.getByRole('heading', { name: 'Das richtige Werkzeug genau dann, wenn du es brauchst.' }),
  ).toBeVisible()

  await expect(page.getByRole('link', { name: /Tools Arbeit vereinfachen/ })).toBeVisible()
  await expect(page.getByRole('link', { name: /Checklists Nichts Wichtiges vergessen/ })).toBeVisible()
  await expect(page.getByRole('link', { name: /Knowledge Schnell nachschlagen/ })).toBeVisible()

  await expect(page.getByRole('heading', { name: 'Wiederkehrende Arbeit schneller erledigen' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Kurze Orientierung für konkrete Sales-Situationen' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'MEDDPICC nachschlagen, ohne im Buch zu suchen' })).toBeVisible()

  await expect(page.getByRole('link', { name: /Go-Live-Rückwärtsplanung/ })).toBeVisible()
  await expect(page.getByText('Quick Payback', { exact: true })).toBeVisible()
  await expect(page.getByText('Economic-Buyer-Termin', { exact: true })).toBeVisible()
  await expect(page.getByText('Keine Pipeline, keine Opportunity-Pflege, kein dauerhaftes MEDDPICC-Scoring.')).toBeVisible()

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
  await expect(page.getByText('Implementierung / Rollout', { exact: true }).last()).toBeVisible()
  await expect(page.getByText('Einkauf / Procurement', { exact: true }).last()).toBeVisible()
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
