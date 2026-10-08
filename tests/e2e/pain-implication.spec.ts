import { expect, test } from '@playwright/test'

test('Pain-Wissen: Navigation, fachliche Stufen, Quellen, Links und Screenshot', async ({ page }, testInfo) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.goto('/meddpicc-workbench/')
  await page.locator('a[href$="#/knowledge/pain-implication"]').click()
  await expect(page.getByRole('heading', { name: 'Pain / Implication: Vom Symptom zur echten Priorität' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Identify → Indicate → Implicate' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Pain-Typen, Outcome und echte Dringlichkeit' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Konstruiertes Beispiel · B2B-SaaS-Vertrieb' })).toBeVisible()
  await expect(page.getByText('Reine Rechenannahme', { exact: false })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Metrics nachschlagen' })).toHaveAttribute('href', /knowledge\/metrics/)
  await expect(page.getByRole('link', { name: 'Economic Buyer nachschlagen' })).toHaveAttribute('href', /knowledge\/economic-buyer/)
  await expect(page.getByRole('link', { name: 'Discovery Call nachschlagen' })).toHaveAttribute('href', /knowledge\/discovery-call/)
  const flag = page.locator('.knowledge-detail').first()
  await expect(flag).not.toHaveAttribute('open')
  await flag.locator('summary').click()
  await expect(flag.getByText('Die Lösung ist sichtbar', { exact: false })).toBeVisible()
  await flag.locator('summary').click()
  const sources = page.locator('.knowledge-source-details').last()
  await expect(sources).not.toHaveAttribute('open')
  await expect(page.getByText('Andy Whyte', { exact: true })).not.toBeVisible()
  await sources.locator('summary').click()
  await expect(page.getByText('Andy Whyte', { exact: true })).toBeVisible()
  await expect(page.getByText('Darius Lahoutifard', { exact: true })).toBeVisible()
  await sources.locator('summary').click()
  expect(errors).toEqual([])
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.screenshot({
    path: testInfo.outputPath(`pain-knowledge-${testInfo.project.name}.png`),
    fullPage: true,
  })
  await page.getByRole('link', { name: 'Pain-Checklist öffnen' }).click()
  await expect(page.getByRole('heading', { name: 'Pain / Implication: Wie belastbar ist die Konsequenz?' })).toBeVisible()
})

test('Pain-Checklist: zehn Punkte, Details, temporäre Haken, Quellen und Screenshot', async ({ page }, testInfo) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.goto('/meddpicc-workbench/')
  await page.locator('a[href$="#/checklists/pain-implication"]').click()
  await expect(page.getByRole('checkbox')).toHaveCount(10)
  const first = page.locator('.checklist-item').first()
  await first.locator('summary').click()
  await expect(first.getByRole('heading', { name: 'Worum geht es?' })).toBeVisible()
  await expect(first.getByRole('heading', { name: 'Warum ist das relevant?' })).toBeVisible()
  await expect(first.getByRole('heading', { name: 'Woran erkenne ich es?' })).toBeVisible()
  await expect(first.getByRole('heading', { name: 'Typische Fehlinterpretation' })).toBeVisible()
  await expect(first.getByRole('heading', { name: 'Mögliche Frage oder Handlung' })).toBeVisible()
  await first.getByRole('link', { name: 'Pain / Implication nachschlagen' }).click()
  await expect(page.getByRole('heading', { name: 'Was ist Pain / Implication?' })).toBeVisible()
  await page.goto('/meddpicc-workbench/#/checklists/pain-implication')
  await expect(page.getByRole('checkbox').first()).not.toBeChecked()
  await page.getByRole('checkbox').first().check()
  await expect(page.getByRole('checkbox').first()).toBeChecked()
  await page.reload()
  await expect(page.getByRole('checkbox').first()).not.toBeChecked()
  const sources = page.locator('.checklist-sources details')
  await expect(sources).not.toHaveAttribute('open')
  await sources.locator('summary').click()
  await expect(sources.getByText('Andy Whyte', { exact: false }).first()).toBeVisible()
  await expect(sources.getByText('Darius Lahoutifard', { exact: false }).first()).toBeVisible()
  await sources.locator('summary').click()
  expect(errors).toEqual([])
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.screenshot({
    path: testInfo.outputPath(`pain-checklist-${testInfo.project.name}.png`),
    fullPage: true,
  })
})

test('Pain-Screens haben bei 375, 768, 1024 und 1440 px keinen horizontalen Overflow', async ({ page }) => {
  for (const width of [375, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 812 })
    for (const path of ['/knowledge/pain-implication', '/checklists/pain-implication']) {
      await page.goto(`/meddpicc-workbench/#${path}`)
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
      const size = await page.evaluate(() => ({
        viewport: document.documentElement.clientWidth,
        content: document.documentElement.scrollWidth,
      }))
      expect(size.content, `width=${width} path=${path}`).toBeLessThanOrEqual(size.viewport)
    }
  }
})
