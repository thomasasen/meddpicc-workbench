import { expect, test } from '@playwright/test'

test('pflegt Source-Records und zeigt die Traceability bis ins Dashboard', async ({ page }) => {
  const runtimeErrors: string[] = []
  page.on('pageerror', (error) => runtimeErrors.push(error.message))

  await page.goto('/meddpicc-workbench/')
  await page.getByRole('link', { name: 'Quellen' }).click()
  await expect(page.getByRole('heading', { name: 'Quellen & Referenzen' })).toBeVisible()

  const referenceForm = page.getByRole('region', { name: 'Quelleneintrag pflegen' })
  await referenceForm.getByLabel('Typ').selectOption('meeting')
  await referenceForm.getByLabel('Datum').fill('2026-10-05')
  await referenceForm.getByLabel('Titel').fill('CFO Steering 05.10.2026')
  await referenceForm.getByLabel('Externe ID').fill('CRM-4711')
  await referenceForm.getByLabel('URL').fill('https://example.test/cfo-steering')
  await referenceForm.getByLabel('Notizen').fill('Wirtschaftliche Priorität und Authority.')
  await referenceForm.getByRole('button', { name: 'Quelle anlegen' }).click()

  const createdReference = page.getByRole('article').filter({ hasText: 'CFO Steering 05.10.2026' })
  await expect(createdReference).toBeVisible()
  await expect(createdReference).toContainText('CRM-4711')
  await expect(page.getByText('Ungespeicherte Änderungen')).toBeVisible()

  await page.getByRole('link', { name: 'Evidenzregister' }).click()
  await expect(page.getByRole('heading', { name: 'Evidenzregister' })).toBeVisible()

  const evidenceForm = page.getByRole('region', { name: 'Beobachtung oder Aussage erfassen' })
  await evidenceForm.getByLabel('Aussage').fill('CFO bestätigt die wirtschaftliche Priorität des Vorhabens.')
  await evidenceForm.getByLabel('Klassifikation').selectOption('confirmed_evidence')
  await evidenceForm.getByLabel('Verifikation').selectOption('confirmed')
  await evidenceForm.getByLabel('Evidenzqualität').selectOption('high')
  await evidenceForm.getByLabel('Quelldatum').fill('2026-10-05')
  await evidenceForm.getByLabel('Quellenreferenz').selectOption({ label: /CFO Steering 05\.10\.2026/ })
  await evidenceForm.getByLabel('Economic Buyer').check()
  await evidenceForm.getByRole('button', { name: 'Evidenz hinzufügen' }).click()

  const createdEvidence = page
    .getByRole('article')
    .filter({ hasText: 'CFO bestätigt die wirtschaftliche Priorität des Vorhabens.' })
  await expect(createdEvidence).toBeVisible()
  await expect(createdEvidence).toContainText('CFO Steering 05.10.2026')

  await page.getByRole('link', { name: 'Dashboard' }).click()
  const economicBuyerRisk = page
    .getByText('Priorität beim Economic Buyer ist nur indirekt belegt', { exact: true })
    .locator('..')
  await expect(economicBuyerRisk).toContainText('CFO Steering 05.10.2026')

  const traceLink = economicBuyerRisk.getByRole('link', { name: /Quellenbasis:/ })
  await traceLink.click()
  await expect(page.getByRole('heading', { name: 'Quellen & Referenzen' })).toBeVisible()
  await expect(page.locator('[id^="reference-"]').filter({ hasText: 'Discovery Workshop Vertrieb' })).toBeVisible()

  expect(runtimeErrors).toEqual([])
})
