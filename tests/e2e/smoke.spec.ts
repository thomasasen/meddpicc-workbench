import { expect, test } from '@playwright/test'

test('lädt die Standard-Demo als Deal-Fokus ohne offensichtlichen Runtime-Fehler', async ({ page }) => {
  const runtimeErrors: string[] = []
  page.on('pageerror', (error) => runtimeErrors.push(error.message))

  await page.goto('/meddpicc-workbench/')

  await expect(page.getByText('MEDDPICC Workbench', { exact: true }).first()).toBeVisible()
  await expect(
    page.getByRole('heading', { name: /Beispielwerke Industrie GmbH.*CRM & Service Transformation 2027/ }),
  ).toBeVisible()

  const context = page.locator('.project-toolbar')
  await expect(context).toContainText('Fiktive Demo')
  await expect(context).toContainText('Gespeicherter Stand')
  await expect(context).toContainText(/480\.000.*€/)
  await expect(context).toContainText('Best Case')
  await expect(context).toContainText('31.03.2027')
  await expect(context).toContainText('01.07.2027')

  await expect(page.getByRole('heading', { name: 'Aktuell wichtig' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Offene Risiken' })).toBeVisible()
  await expect(page.getByText('Paper Process ist nicht belastbar bestätigt', { exact: true })).toBeVisible()
  await expect(page.getByText('Hoch', { exact: true })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Nächste Aktionen' })).toBeVisible()
  await expect(page.getByText('Champion um Einführung beim Economic Buyer bitten', { exact: true })).toBeVisible()

  await expect(page.getByRole('heading', { name: 'Direkt in den nächsten Arbeitsschritt' })).toBeVisible()
  await expect(page.getByRole('link', { name: /Evidenz prüfen/ })).toBeVisible()
  await expect(page.getByRole('button', { name: /Projekt bearbeiten/ })).toBeVisible()

  await expect(page.getByRole('heading', { name: 'MEDDPICC-Kurzstatus' })).toBeVisible()
  await expect(page.getByText('Economic Buyer', { exact: true }).first()).toBeVisible()
  await expect(page.getByText(/keine Win Probability/i)).toBeVisible()

  expect(runtimeErrors).toEqual([])
})

test('zeigt bei einem neuen Projekt fachlich korrekte Empty States', async ({ page }) => {
  await page.goto('/meddpicc-workbench/')

  await page.getByRole('button', { name: 'Neues Projekt' }).click()
  await page.getByLabel('Account').fill('Leere Beispiel AG')
  await page.getByLabel('Projektname').fill('Neue Opportunity')
  await page.getByRole('button', { name: 'Projekt erstellen' }).click()

  await expect(page.getByText('Keine offenen Risiken erfasst.', { exact: true })).toBeVisible()
  await expect(page.getByText('Keine offenen nächsten Aktionen vorhanden.', { exact: true })).toBeVisible()

  const context = page.locator('.opportunity-context-meta')
  await expect(context.getByText('Unbekannt', { exact: true })).toHaveCount(4)
  await expect(page.getByText('Der Deal hat keine Risiken.', { exact: true })).toHaveCount(0)
  await expect(page.getByText('Keine Aktion notwendig.', { exact: true })).toHaveCount(0)
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

  await expect(page.getByText('Testaussage für den browserbasierten Evidenz-Flow.', { exact: true })).toBeVisible()
  await expect(page.getByText('Annahme', { exact: true }).last()).toBeVisible()
  await expect(page.getByText('Ungespeicherte Änderungen')).toBeVisible()
})
