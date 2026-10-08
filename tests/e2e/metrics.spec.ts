import { expect, test } from '@playwright/test'

test('Metrics-Wissen von der Toolbox öffnen und Quellen-/Praxisbezug prüfen', async ({ page }, testInfo) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))

  await page.goto('/meddpicc-workbench/')
  await page.locator('a[href$="#/knowledge/metrics"]').click()

  await expect(
    page.getByRole('heading', { name: 'Metrics: aus Nutzen belastbaren Business Impact machen' }),
  ).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Was sind Metrics?' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Woran erkenne ich eine belastbare Metric?' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Vom Pain zur Metric' })).toBeVisible()
  await expect(page.getByText('Andy Whyte', { exact: true })).not.toBeVisible()
  await expect(page.getByText('Darius Lahoutifard', { exact: true })).not.toBeVisible()

  const misinterpretation = page.locator('.knowledge-detail').first()
  await misinterpretation.locator('summary').click()
  await expect(misinterpretation.locator('p')).toBeVisible()

  const sourceDetails = page.getByText('Quellen und fachliche Einordnung anzeigen')
  await sourceDetails.click()
  await expect(page.getByText('Andy Whyte', { exact: true })).toBeVisible()
  await expect(page.getByText('Darius Lahoutifard', { exact: true })).toBeVisible()
  await expect(page.getByText(/Metrics 1 \(M1\)/)).toBeVisible()
  await sourceDetails.click()

  expect(errors).toEqual([])
  await page.evaluate(() => {
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur()
    window.scrollTo(0, 0)
  })
  await page.addStyleTag({ content: '.skip-link { display: none !important; }' })
  await page.screenshot({
    path: testInfo.outputPath(`metrics-knowledge-${testInfo.project.name}.png`),
    fullPage: true,
  })
})

test('Metrics-Checklist mit Erklärungen und nur temporären Checks öffnen', async ({ page }, testInfo) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))

  await page.goto('/meddpicc-workbench/')
  await page.locator('a[href$="#/checklists/metrics"]').click()
  await expect(page.getByRole('heading', { name: 'Metrics: belastbar oder nur gut klingende Zahl?' })).toBeVisible()

  const checkboxes = page.getByRole('checkbox')
  await expect(checkboxes).toHaveCount(7)
  await checkboxes.first().check()
  await expect(checkboxes.first()).toBeChecked()

  const firstItem = page.locator('.checklist-item').first()
  await firstItem.locator('summary').click()
  await expect(firstItem.getByRole('heading', { name: 'Worum geht es?' })).toBeVisible()
  await expect(firstItem.getByRole('heading', { name: 'Warum ist das relevant?' })).toBeVisible()
  await expect(firstItem.getByRole('heading', { name: 'Typische Fehlinterpretation' })).toBeVisible()

  await firstItem.getByRole('link', { name: 'Metrics nachschlagen' }).click()
  await expect(page.getByRole('heading', { name: 'Was sind Metrics?' })).toBeVisible()

  await page.goto('/meddpicc-workbench/#/checklists/metrics')
  await expect(page.getByRole('checkbox').first()).not.toBeChecked()
  await expect(page.getByText(/Deal Score|Qualification Score|MEDDPICC completeness/i)).toHaveCount(0)

  expect(errors).toEqual([])
  await page.evaluate(() => {
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur()
    window.scrollTo(0, 0)
  })
  await page.addStyleTag({ content: '.skip-link { display: none !important; }' })
  await page.screenshot({
    path: testInfo.outputPath(`metrics-checklist-${testInfo.project.name}.png`),
    fullPage: true,
  })
})

test('Metrics-Ansichten verursachen bei 375 px kein horizontales Dokument-Overflow', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 })

  for (const path of ['/knowledge/metrics', '/checklists/metrics']) {
    await page.goto(`/meddpicc-workbench/#${path}`)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    const width = await page.evaluate(() => ({
      scroll: document.documentElement.scrollWidth,
      client: document.documentElement.clientWidth,
    }))
    expect(width.scroll).toBeLessThanOrEqual(width.client)
  }
})
