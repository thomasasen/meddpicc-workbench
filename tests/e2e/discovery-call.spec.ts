import { expect, test } from '@playwright/test'

test('Discovery-Call-Wissen mit SPICED und Buchquellen öffnen', async ({ page }, testInfo) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))

  await page.goto('/meddpicc-workbench/')
  await page.locator('a[href$="#/knowledge/discovery-call"]').click()

  await expect(page.getByRole('heading', { name: 'Discovery Call: erst verstehen, dann empfehlen' })).toBeVisible()
  for (const heading of ['S · Situation', 'P · Pain', 'I · Impact', 'CE · Critical Event', 'D · Decision']) {
    await expect(page.getByRole('heading', { name: heading, exact: true })).toBeVisible()
  }
  await expect(page.getByRole('heading', { name: 'Ein natürlicher Gesprächsverlauf' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Typische Warnsignale' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Originalbücher und die ergänzende SPICED-Methodik' })).toBeVisible()

  await page.getByText('Primär- und Originalquellen anzeigen').click()
  await expect(page.getByRole('link', { name: 'Originaldefinition von SPICED bei Winning by Design' })).toBeVisible()

  expect(errors).toEqual([])
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.screenshot({
    path: testInfo.outputPath(`discovery-knowledge-${testInfo.project.name}.png`),
    fullPage: true,
  })
})

test('Discovery-Call-Checklist erklärt Quellen und setzt temporäre Checks zurück', async ({ page }, testInfo) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))

  await page.goto('/meddpicc-workbench/')
  await page.locator('a[href$="#/checklists/discovery-call"]').click()
  await expect(
    page.getByRole('heading', { name: 'Discovery Call: vorbereitet, neugierig und kundenzentriert' }),
  ).toBeVisible()
  const checkboxes = page.getByRole('checkbox')
  await expect(checkboxes).toHaveCount(9)
  await checkboxes.first().check()
  await expect(checkboxes.first()).toBeChecked()

  const firstItem = page.locator('.checklist-item').first()
  await firstItem.locator('summary').click()
  await expect(firstItem.getByRole('heading', { name: 'Worum geht es?' })).toBeVisible()
  await expect(firstItem.getByRole('heading', { name: 'Woran erkenne ich es?' })).toBeVisible()
  await expect(firstItem.getByText('Whyte → Discovery: Research First', { exact: false })).toBeVisible()

  await firstItem.getByRole('link', { name: 'Discovery Call nachschlagen' }).click()
  await expect(page.getByRole('heading', { name: 'Discovery Call: erst verstehen, dann empfehlen' })).toBeVisible()
  await page.reload()
  await page.goto('/meddpicc-workbench/#/checklists/discovery-call')
  await expect(page.getByRole('checkbox').first()).not.toBeChecked()
  expect(errors).toEqual([])

  await page.evaluate(() => window.scrollTo(0, 0))
  await page.screenshot({
    path: testInfo.outputPath(`discovery-checklist-${testInfo.project.name}.png`),
    fullPage: true,
  })
})

test('Discovery Call funktioniert bei 375px ohne horizontales Overflow', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 })
  for (const path of ['/knowledge/discovery-call', '/checklists/discovery-call']) {
    await page.goto(`/meddpicc-workbench/#${path}`)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    const widths = await page.evaluate(() => ({
      viewport: document.documentElement.clientWidth,
      content: document.documentElement.scrollWidth,
    }))
    expect(widths.content).toBeLessThanOrEqual(widths.viewport)
  }
})
