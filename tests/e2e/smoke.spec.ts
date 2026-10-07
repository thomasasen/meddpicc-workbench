import { expect, test } from '@playwright/test'

test('zeigt die MEDDPICC Toolbox als Startpunkt ohne Deal-Pflicht', async ({ page }) => {
  const runtimeErrors: string[] = []
  page.on('pageerror', (error) => runtimeErrors.push(error.message))

  await page.goto('/meddpicc-workbench/')

  await expect(page.getByText('MEDDPICC Toolbox', { exact: true }).first()).toBeVisible()
  await expect(page.getByRole('heading', { name: 'MEDDPICC nicht pflegen. MEDDPICC anwenden.' })).toBeVisible()
  await expect(page.locator('.meddpicc-group')).toHaveCount(8)
  await expect(page.getByRole('heading', { name: 'Metrics' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Economic Buyer' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Decision Process' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Champion' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Competition' })).toBeVisible()

  const reverseTimeline = page.getByRole('link', { name: /Go-Live-Rückwärtsplanung/ })
  await expect(reverseTimeline).toBeVisible()
  await expect(reverseTimeline).toContainText('Kundenfähig')

  await expect(page.getByText('Evidenzregister', { exact: true })).toHaveCount(0)
  await expect(page.getByText('Fiktive Demo', { exact: true })).toHaveCount(0)
  expect(runtimeErrors).toEqual([])
})

test('berechnet eine Go-Live-Planung rückwärts und aktualisiert sie sofort', async ({ page }) => {
  await page.goto('/meddpicc-workbench/')
  await page.getByRole('link', { name: /Go-Live-Rückwärtsplanung/ }).click()

  await expect(page.getByRole('heading', { name: 'Go-Live-Rückwärtsplanung' })).toBeVisible()
  await expect(page.getByText('Nur das, was diese Planung braucht')).toBeVisible()
  await expect(page.getByText('Kundenfähiger Output')).toBeVisible()
  await expect(page.getByTestId('latest-start')).toHaveText('11.02.2027')
  await expect(page.locator('.step-editor-row')).toHaveCount(5)

  const implementation = page.locator('.step-editor-row').first()
  await implementation.getByLabel('Arbeitstage').fill('60')
  await expect(page.getByTestId('latest-start')).toHaveText('18.02.2027')

  await expect(page.locator('.timeline-svg')).toBeVisible()
  await expect(page.locator('.timeline-svg')).toContainText('Finale Entscheidung')
  await expect(page.locator('.timeline-svg')).toContainText('Implementierung')
  await expect(page.locator('.timeline-svg')).toContainText('GO-LIVE')
})

test('exportiert den kundenfähigen Plan als SVG', async ({ page }) => {
  await page.goto('/meddpicc-workbench/#/tools/go-live-rueckwaertsplanung')

  const downloadPromise = page.waitForEvent('download')
  await page.getByRole('button', { name: 'SVG' }).click()
  const download = await downloadPromise

  expect(download.suggestedFilename()).toMatch(/beispielkunde-gemeinsamer-go-live-plan\.svg$/)
})
