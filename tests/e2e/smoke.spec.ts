import { expect, test } from '@playwright/test'

test('lädt die Standard-Demo ohne offensichtlichen Runtime-Fehler', async ({ page }) => {
  const runtimeErrors: string[] = []
  page.on('pageerror', (error) => runtimeErrors.push(error.message))

  await page.goto('/meddpicc-workbench/')

  await expect(page.getByText('MEDDPICC Workbench', { exact: true }).first()).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Beispielwerke Industrie GmbH' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Kritische Gaps' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'MEDDPICC-Status' })).toBeVisible()
  await expect(page.getByText('Economic Buyer', { exact: true }).first()).toBeVisible()

  expect(runtimeErrors).toEqual([])
})

test('erfasst Evidenz im zentralen Register', async ({ page }) => {
  await page.goto('/meddpicc-workbench/')

  await page.getByRole('link', { name: 'Evidenzregister' }).click()
  await expect(page.getByRole('heading', { name: 'Evidenzregister' })).toBeVisible()

  await page
    .getByRole('textbox', { name: 'Aussage', exact: true })
    .fill('Testaussage für den browserbasierten Evidenz-Flow.')
  await page.getByLabel('Klassifikation').selectOption('assumption')
  await page.getByLabel('Evidenzqualität').selectOption('low')
  await page.getByLabel('Verifikation').selectOption('unconfirmed')
  await page.getByLabel('Economic Buyer').check()
  await page.getByRole('button', { name: 'Evidenz hinzufügen' }).click()

  await expect(page.getByText('Testaussage für den browserbasierten Evidenz-Flow.')).toBeVisible()
  await expect(page.getByText('Annahme', { exact: true }).last()).toBeVisible()
  await expect(page.getByText('Ungespeicherte Änderungen')).toBeVisible()
})
