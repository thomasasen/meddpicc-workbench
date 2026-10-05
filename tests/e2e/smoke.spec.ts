import { expect, test } from '@playwright/test'

test('lädt die Standard-Demo ohne offensichtlichen Runtime-Fehler', async ({ page }) => {
  const runtimeErrors: string[] = []
  page.on('pageerror', (error) => runtimeErrors.push(error.message))

  await page.goto('/meddpicc-workbench/')

  await expect(page.getByText('MEDDPICC Workbench', { exact: true }).first()).toBeVisible()
  await expect(
    page.getByRole('heading', { name: 'Beispielwerke Industrie GmbH' }),
  ).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Kritische Gaps' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'MEDDPICC-Status' })).toBeVisible()
  await expect(page.getByText('Economic Buyer', { exact: true }).first()).toBeVisible()

  expect(runtimeErrors).toEqual([])
})
