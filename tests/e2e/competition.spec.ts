import { expect, test } from '@playwright/test'

// prettier-ignore
test('Competition Knowledge: Navigation, Alternativen, Zonen, Quellen und Screenshot', async ({ page }, testInfo) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.goto('/meddpicc-workbench/')
  await page.locator('a[href$="#/knowledge/competition"]').click()
  await expect(page.getByRole('heading', { name: 'Competition: Die echte Alternative verstehen' })).toBeVisible()
  for (const title of ['Rival Solutions', 'Building Internally / Internal Build', 'Other Projects / Priorities', 'Inertia / Status quo']) {
    await expect(page.getByRole('heading', { name: title })).toBeVisible()
  }
  for (const title of ['Political', 'Technical', 'Commercial']) {
    await expect(page.getByRole('heading', { name: title, exact: true })).toBeVisible()
  }
  await expect(page.getByText('Frei konstruiertes B2B-CRM/SaaS-Beispiel', { exact: false })).toBeVisible()
  const zone = page.locator('.knowledge-detail').filter({ has: page.getByText('VALUE', { exact: true }) }).first()
  await expect(zone).not.toHaveAttribute('open')
  await zone.locator('summary').click()
  await expect(zone.getByText('bestätigtes Käuferkriterium', { exact: false })).toBeVisible()
  await zone.locator('summary').click()
  const sources = page.locator('.knowledge-source-details').last()
  await expect(sources).not.toHaveAttribute('open')
  await sources.locator('summary').click()
  await expect(sources.getByText('Darius Lahoutifard', { exact: false }).first()).toBeVisible()
  await expect(sources.getByText('Andy Whyte', { exact: false }).first()).toBeVisible()
  await sources.locator('summary').click()
  expect(errors).toEqual([])
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.screenshot({ path: testInfo.outputPath('competition-knowledge-' + testInfo.project.name + '.png'), fullPage: true })
  await page.getByRole('link', { name: 'Competition-Checklist öffnen' }).first().click()
  await expect(page.getByRole('heading', { name: 'Competition: Gegen welche Alternative verkaufen wir wirklich?' })).toBeVisible()
})

// prettier-ignore
test('Competition Checklist: zehn Prüfpunkte, unabhängige flüchtige Haken und Screenshot', async ({ page }, testInfo) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.goto('/meddpicc-workbench/')
  await page.locator('a[href$="#/checklists/competition"]').click()
  await expect(page.getByRole('checkbox')).toHaveCount(10)
  const first = page.locator('.checklist-item').first()
  await first.locator('summary').click()
  for (const name of ['Worum geht es?', 'Warum ist das relevant?', 'Woran erkenne ich es?', 'Typische Fehlinterpretation', 'Mögliche Frage oder Handlung']) {
    await expect(first.getByRole('heading', { name })).toBeVisible()
  }
  await first.getByRole('link', { name: 'Competition nachschlagen' }).click()
  await expect(page.getByRole('heading', { name: 'Was bedeutet Competition?' })).toBeVisible()
  await page.goto('/meddpicc-workbench/#/checklists/competition')
  await page.getByRole('checkbox').first().check()
  await page.getByRole('checkbox').nth(2).check()
  await expect(page.getByRole('checkbox').nth(1)).not.toBeChecked()
  await page.reload()
  await expect(page.getByRole('checkbox').first()).not.toBeChecked()
  await expect(page.getByRole('checkbox').nth(2)).not.toBeChecked()
  await expect(page.getByText(/Deal-Score|Abschlusswahrscheinlichkeit|Gesamtscore/i)).toHaveCount(0)
  const sources = page.locator('.checklist-sources details')
  await expect(sources).not.toHaveAttribute('open')
  await sources.locator('summary').click()
  await expect(sources.getByText('Darius Lahoutifard', { exact: false }).first()).toBeVisible()
  await sources.locator('summary').click()
  expect(errors).toEqual([])
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.screenshot({ path: testInfo.outputPath('competition-checklist-' + testInfo.project.name + '.png'), fullPage: true })
})

// prettier-ignore
test('Competition: 375/768/1024/1440 Pixel ohne Overflow, auch in geöffneten Details', async ({ page }) => {
  for (const width of [375, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 812 })
    for (const route of ['/knowledge/competition', '/checklists/competition']) {
      await page.goto('/meddpicc-workbench/#' + route)
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
      const size = await page.evaluate(() => [document.documentElement.scrollWidth, document.documentElement.clientWidth])
      expect(size[0], 'width ' + width + ' route ' + route).toBeLessThanOrEqual(size[1]!)
      const detail = page.locator('main details').first()
      await detail.locator('summary').click()
      const expanded = await page.evaluate(() => [document.documentElement.scrollWidth, document.documentElement.clientWidth])
      expect(expanded[0], 'expanded width ' + width + ' route ' + route).toBeLessThanOrEqual(expanded[1]!)
    }
  }
})

// prettier-ignore
test('Competition: direkte Routen, Querverweise und Tastatur', async ({ page }) => {
  await page.goto('/meddpicc-workbench/#/knowledge/competition')
  for (const [name, route] of [
    ['Decision Criteria nachschlagen', 'decision-criteria'],
    ['Metrics nachschlagen', 'metrics'],
    ['Pain / Implication nachschlagen', 'pain-implication'],
    ['Champion', 'champion'],
    ['Economic Buyer', 'economic-buyer'],
    ['Decision Process', 'decision-process'],
    ['Paper Process', 'paper-process'],
  ]) {
    await page.goto('/meddpicc-workbench/#/knowledge/competition')
    await page.getByRole('link', { name, exact: true }).click()
    await expect(page).toHaveURL(new RegExp('knowledge/' + route))
  }
  await page.goto('/meddpicc-workbench/#/checklists/competition')
  await page.getByRole('checkbox').first().focus()
  await expect(page.getByRole('checkbox').first()).toBeFocused()
  await page.keyboard.press('Space')
  await expect(page.getByRole('checkbox').first()).toBeChecked()
})
