import { expect, test } from '@playwright/test'

test('pflegt projektweite Risiken und Aktionen inklusive Risk-Verknüpfung', async ({ page }) => {
  const runtimeErrors: string[] = []
  page.on('pageerror', (error) => runtimeErrors.push(error.message))

  await page.goto('/meddpicc-workbench/')
  await page.getByRole('link', { name: 'Risiken & Aktionen' }).click()
  await expect(page.getByRole('heading', { name: 'Risiken & Aktionen' })).toBeVisible()

  const riskSection = page.getByRole('region', { name: 'Risiken' })
  await riskSection.getByLabel('Titel').fill('Economic Buyer Priorität ungeklärt')
  await riskSection.getByLabel('Severity').selectOption('critical')
  await riskSection.getByLabel('MEDDPICC-Bereich').selectOption('economicBuyer')
  await riskSection.getByLabel('Impact').fill('Ohne direkte Bestätigung kann Budgetpriorität kippen.')
  await riskSection.getByLabel('Due Date').fill('2026-10-06')
  await riskSection.getByRole('button', { name: 'Risiko anlegen' }).click()

  await expect(riskSection.getByRole('article').filter({ hasText: 'Economic Buyer Priorität ungeklärt' })).toBeVisible()

  const actionSection = page.getByRole('region', { name: 'Nächste Aktionen' })
  await actionSection.getByLabel('Titel').fill('CFO-Gespräch vorbereiten')
  await actionSection.getByLabel('MEDDPICC-Bereich').selectOption('economicBuyer')
  await actionSection.getByLabel('Due Date').fill('2026-10-06')
  await actionSection.getByLabel('Related Risk').selectOption({ label: 'Economic Buyer Priorität ungeklärt' })
  await actionSection.getByLabel('Related Gap').fill('Authority und Priorität sind nicht direkt bestätigt.')
  await actionSection
    .getByLabel('Desired Evidence')
    .fill('CFO bestätigt Entscheidungsautorität, Business-Priorität und Investitionsrahmen.')
  await actionSection.getByRole('button', { name: 'Aktion anlegen' }).click()

  const createdAction = actionSection.getByRole('article').filter({ hasText: 'CFO-Gespräch vorbereiten' })
  await expect(createdAction).toBeVisible()
  await expect(createdAction).toContainText('Verknüpftes Risiko: Economic Buyer Priorität ungeklärt')
  await expect(page.getByText('Ungespeicherte Änderungen')).toBeVisible()

  await page.getByRole('link', { name: 'Dashboard' }).click()
  await expect(page.getByText('Economic Buyer Priorität ungeklärt', { exact: true })).toBeVisible()
  await expect(page.getByText('CFO-Gespräch vorbereiten', { exact: true })).toBeVisible()

  expect(runtimeErrors).toEqual([])
})
