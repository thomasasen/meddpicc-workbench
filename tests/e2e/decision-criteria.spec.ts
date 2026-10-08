import { expect, test } from '@playwright/test'

test('Decision-Criteria-Wissen ist erreichbar und Quellen bleiben zunächst unsichtbar', async ({ page }, testInfo) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))

  await page.goto('/meddpicc-workbench/')
  await page.locator('a[href$="#/knowledge/decision-criteria"]').click()
  await expect(
    page.getByRole('heading', { name: 'Decision Criteria: verstehen, was die Auswahl wirklich bestimmt' }),
  ).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Was sind Decision Criteria?' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Das Value Triangle richtig nutzen' })).toBeVisible()
  await expect(
    page.getByRole('heading', { name: 'Kriterien mitgestalten und Kundenbewertung erfragen' }),
  ).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Kundenbewertung statt Verkäufer-Score' })).toBeVisible()

  for (const label of ['Value', 'Danger', 'Parity', 'Unique Differentiators', 'Custom Needs']) {
    await expect(page.getByRole('heading', { name: label, exact: true })).toBeVisible()
  }

  const sources = page.locator('main > section:last-of-type > details')
  await expect(sources).not.toHaveAttribute('open')
  await expect(page.getByText('Andy Whyte', { exact: true })).not.toBeVisible()
  await sources.locator('summary').click()
  await expect(page.getByText('Andy Whyte', { exact: true })).toBeVisible()
  await expect(page.getByText('Darius Lahoutifard', { exact: true })).toBeVisible()
  await sources.locator('summary').click()

  await expect(page.getByRole('link', { name: 'Decision-Criteria-Checklist öffnen' })).toBeVisible()
  expect(errors).toEqual([])
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.screenshot({
    path: testInfo.outputPath(`decision-criteria-knowledge-${testInfo.project.name}.png`),
    fullPage: true,
  })
})

test('Decision-Criteria-Checklist enthält zehn Punkte ohne gespeicherte Checks', async ({ page }, testInfo) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.goto('/meddpicc-workbench/')
  await page.locator('a[href$="#/checklists/decision-criteria"]').click()

  await expect(
    page.getByRole('heading', { name: 'Decision Criteria: prüfe, was die Entscheidung wirklich trägt' }),
  ).toBeVisible()
  await expect(page.getByRole('checkbox')).toHaveCount(10)
  await page.getByRole('checkbox').first().check()
  await expect(page.getByRole('checkbox').first()).toBeChecked()

  const first = page.locator('.checklist-item').first()
  await first.locator('summary').click()
  await expect(first.getByRole('heading', { name: 'Worum geht es?' })).toBeVisible()
  await expect(first.getByRole('heading', { name: 'Typische Fehlinterpretation' })).toBeVisible()
  await expect(first.getByText('Whyte →', { exact: false })).toHaveCount(0)
  await first.getByRole('link', { name: 'Decision Criteria nachschlagen' }).click()
  await expect(page.getByRole('heading', { name: 'Was sind Decision Criteria?' })).toBeVisible()

  await page.goto('/meddpicc-workbench/#/checklists/decision-criteria')
  await expect(page.getByRole('checkbox').first()).not.toBeChecked()
  const sources = page.locator('.checklist-sources details')
  await expect(sources).not.toHaveAttribute('open')
  await sources.locator('summary').click()
  await expect(sources.getByText('Andy Whyte', { exact: false }).first()).toBeVisible()
  await sources.locator('summary').click()
  expect(errors).toEqual([])
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.screenshot({
    path: testInfo.outputPath(`decision-criteria-checklist-${testInfo.project.name}.png`),
    fullPage: true,
  })
})

test('Decision-Criteria-Seiten bleiben bei üblichen Bildschirmbreiten ohne Dokument-Overflow', async ({ page }) => {
  for (const width of [375, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 812 })
    for (const path of ['/knowledge/decision-criteria', '/checklists/decision-criteria']) {
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
