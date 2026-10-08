import { expect, test } from '@playwright/test'

test('Decision-Process-Wissen ist erreichbar und unterscheidet die drei Prozesse', async ({ page }, testInfo) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.goto('/meddpicc-workbench/')
  await page.locator('a[href$="#/knowledge/decision-process"]').click()
  await expect(
    page.getByRole('heading', { name: 'Decision Process: verstehen, wie der Kunde wirklich entscheidet' }),
  ).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Was, wie und bis zur Unterschrift' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Validation, Business Approval und Paper Process' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Typische Kurzschlüsse' })).toBeVisible()

  await expect(page.getByRole('heading', { name: 'Die Timeline braucht Aufgaben auf beiden Seiten' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Kundenseite' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Verkäuferseite' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Warum muss der Kunde gerade jetzt entscheiden?' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Go-Live-Rückwärtsplanung öffnen' })).toHaveAttribute(
    'href',
    /\/tools\/reverse-timeline/,
  )
  await expect(page.getByText('Wiederholte Auskunftsverweigerung', { exact: false })).not.toBeVisible()

  const sources = page.locator('main > section:last-of-type > details')
  await expect(sources).not.toHaveAttribute('open')
  await expect(page.getByText('Andy Whyte', { exact: true })).not.toBeVisible()
  await sources.locator('summary').click()
  await expect(page.getByText('Andy Whyte', { exact: true })).toBeVisible()
  await expect(page.getByText('Darius Lahoutifard', { exact: true })).toBeVisible()
  await sources.locator('summary').click()
  await expect(page.getByRole('link', { name: 'Decision-Process-Checklist öffnen' })).toBeVisible()
  expect(errors).toEqual([])
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.screenshot({
    path: testInfo.outputPath(`decision-process-knowledge-${testInfo.project.name}.png`),
    fullPage: true,
  })
})

test('Decision-Process-Checklist erklärt zehn Punkte ohne dauerhafte Bewertung', async ({ page }, testInfo) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.goto('/meddpicc-workbench/#/checklists/decision-process')
  await expect(
    page.getByRole('heading', { name: 'Decision Process: Ist der Entscheidungsweg wirklich geklärt?' }),
  ).toBeVisible()
  await expect(page.getByRole('checkbox')).toHaveCount(10)
  await page.getByRole('checkbox').first().check()
  await expect(page.getByRole('checkbox').first()).toBeChecked()
  const first = page.locator('.checklist-item').first()
  await first.locator('summary').click()
  await expect(first.getByRole('heading', { name: 'Worum geht es?' })).toBeVisible()
  await expect(first.getByRole('heading', { name: 'Typische Fehlinterpretation' })).toBeVisible()
  await first.getByRole('link', { name: 'Decision Process nachschlagen' }).click()
  await expect(page.getByRole('heading', { name: 'Was ist der Decision Process?' })).toBeVisible()

  await page.goto('/meddpicc-workbench/#/checklists/decision-process')
  await expect(page.getByRole('checkbox').first()).not.toBeChecked()
  const sources = page.locator('.checklist-sources details')
  await expect(sources).not.toHaveAttribute('open')
  await sources.locator('summary').click()
  await expect(sources.getByText('Andy Whyte', { exact: false }).first()).toBeVisible()
  await sources.locator('summary').click()
  expect(errors).toEqual([])
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.screenshot({
    path: testInfo.outputPath(`decision-process-checklist-${testInfo.project.name}.png`),
    fullPage: true,
  })
})

test('Decision-Process-Seiten bleiben bei 375, 768, 1024 und 1440 Pixeln ohne Overflow', async ({ page }) => {
  for (const width of [375, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 812 })
    for (const path of ['/knowledge/decision-process', '/checklists/decision-process']) {
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
