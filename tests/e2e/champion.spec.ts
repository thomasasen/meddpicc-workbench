import { expect, test } from '@playwright/test'

// prettier-ignore
test('Champion Knowledge: Navigation, Quellen und echter Browser-Screenshot', async ({ page }, testInfo) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.goto('/meddpicc-workbench/')
  await page.locator('a[href$="#/knowledge/champion"]').click()
  await expect(page.getByRole('heading', { name: 'Champion: Nicht Sympathie, sondern Wirkung zählt' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Kontakt, Coach, Kandidat oder Champion?' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Einfluss, internes Verkaufen, eigenes Interesse' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Vom hilfreichen Coach zur überprüften Fürsprache' })).toBeVisible()
  await expect(page.getByText('Sämtliche Personen, Aussagen', { exact: false })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Economic Buyer nachschlagen' })).toHaveAttribute('href', /knowledge\/economic-buyer/)
  await expect(page.getByRole('link', { name: 'Metrics nachschlagen' })).toHaveAttribute('href', /knowledge\/metrics/)
  await expect(page.getByRole('link', { name: 'Pain / Implication nachschlagen' })).toHaveAttribute('href', /knowledge\/pain-implication/)
  const flag = page.locator('.knowledge-detail').first()
  await expect(flag).not.toHaveAttribute('open')
  await flag.locator('summary').click()
  await expect(flag.getByText('Nicht verwechseln:', { exact: false })).toBeVisible()
  await flag.locator('summary').click()
  const sources = page.locator('.knowledge-source-details').last()
  await expect(sources).not.toHaveAttribute('open')
  await sources.locator('summary').click()
  await expect(sources.getByText('Andy Whyte', { exact: true })).toBeVisible()
  await expect(sources.getByText('Darius Lahoutifard', { exact: true })).toBeVisible()
  await sources.locator('summary').click()
  expect(errors).toEqual([])
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.screenshot({ path: testInfo.outputPath('champion-knowledge-' + testInfo.project.name + '.png'), fullPage: true })
  await page.getByRole('link', { name: 'Champion-Checklist öffnen' }).first().click()
  await expect(page.getByRole('heading', { name: 'Champion: Wo ist unsere Evidenz belastbar?' })).toBeVisible()
})

// prettier-ignore
test('Champion Checklist: zehn Punkte, flüchtige Haken und echter Browser-Screenshot', async ({ page }, testInfo) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.goto('/meddpicc-workbench/')
  await page.locator('a[href$="#/checklists/champion"]').click()
  await expect(page.getByRole('checkbox')).toHaveCount(10)
  const first = page.locator('.checklist-item').first()
  await first.locator('summary').click()
  await expect(first.getByRole('heading', { name: 'Worum geht es?' })).toBeVisible()
  await expect(first.getByRole('heading', { name: 'Warum ist das relevant?' })).toBeVisible()
  await expect(first.getByRole('heading', { name: 'Woran erkenne ich es?' })).toBeVisible()
  await expect(first.getByRole('heading', { name: 'Typische Fehlinterpretation' })).toBeVisible()
  await expect(first.getByRole('heading', { name: 'Mögliche Frage oder Handlung' })).toBeVisible()
  await first.getByRole('link', { name: 'Champion nachschlagen' }).click()
  await expect(page.getByRole('heading', { name: 'Was ist ein Champion?' })).toBeVisible()
  await page.goto('/meddpicc-workbench/#/checklists/champion')
  await page.getByRole('checkbox').first().check()
  await page.getByRole('checkbox').nth(2).check()
  await page.reload()
  await expect(page.getByRole('checkbox').first()).not.toBeChecked()
  await expect(page.getByRole('checkbox').nth(2)).not.toBeChecked()
  const sources = page.locator('.checklist-sources details')
  await expect(sources).not.toHaveAttribute('open')
  await sources.locator('summary').click()
  await expect(sources.getByText('Darius Lahoutifard', { exact: false }).first()).toBeVisible()
  await sources.locator('summary').click()
  expect(errors).toEqual([])
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.screenshot({ path: testInfo.outputPath('champion-checklist-' + testInfo.project.name + '.png'), fullPage: true })
})

// prettier-ignore
test('Champion-Seiten: 375/768/1024/1440 Pixel ohne horizontalen Overflow', async ({ page }) => {
  for (const width of [375, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 812 })
    for (const route of ['/knowledge/champion', '/checklists/champion']) {
      await page.goto('/meddpicc-workbench/#' + route)
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
      const size = await page.evaluate(() => [document.documentElement.scrollWidth, document.documentElement.clientWidth])
      expect(size[0], 'width ' + width + ' route ' + route).toBeLessThanOrEqual(size[1]!)
      await page.locator('main details').first().locator('summary').click()
      const expanded = await page.evaluate(() => [document.documentElement.scrollWidth, document.documentElement.clientWidth])
      expect(expanded[0], 'expanded width ' + width + ' route ' + route).toBeLessThanOrEqual(expanded[1]!)
    }
  }
})

// prettier-ignore
test('Champion: Querverweise und Tastaturbedienung', async ({ page }) => {
  await page.goto('/meddpicc-workbench/#/knowledge/champion')
  await page.getByRole('link', { name: 'Decision Process nachschlagen' }).click()
  await expect(page).toHaveURL(/knowledge\/decision-process/)
  await page.goto('/meddpicc-workbench/#/knowledge/champion')
  await page.getByRole('link', { name: 'Paper Process nachschlagen' }).click()
  await expect(page).toHaveURL(/knowledge\/paper-process/)
  await page.goto('/meddpicc-workbench/#/checklists/champion')
  await page.getByRole('checkbox').first().focus()
  await expect(page.getByRole('checkbox').first()).toBeFocused()
  await page.keyboard.press('Space')
  await expect(page.getByRole('checkbox').first()).toBeChecked()
})
