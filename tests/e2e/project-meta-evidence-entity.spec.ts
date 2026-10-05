import { expect, test } from '@playwright/test'

test('bearbeitet Projektmetadaten und verknüpft Evidence konkret mit einer Qualification-Entity', async ({ page }) => {
  const runtimeErrors: string[] = []
  page.on('pageerror', (error) => runtimeErrors.push(error.message))

  await page.goto('/meddpicc-workbench/')

  await page.getByRole('button', { name: 'Projekt bearbeiten', exact: true }).click()
  const metaEditor = page.getByRole('region', { name: 'Opportunity-Daten bearbeiten' })
  await expect(metaEditor).toBeVisible()
  await metaEditor.getByLabel('Account').fill('Beispielwerke Industrie SE')
  await metaEditor.getByLabel('Opportunity ID').fill('DEMO-OPP-2027-QUALIFIED')
  await metaEditor.getByLabel('Owner').fill('Strategic AE')
  await metaEditor.getByLabel('Deal Value').fill('520000')
  await metaEditor.getByLabel('Target Go-Live').fill('2027-08-15')
  await metaEditor.getByLabel('Forecast Category').selectOption('commit')
  await metaEditor.getByLabel('Notizen').fill('Metadaten im Roadmap-2-Slice validiert bearbeitet.')
  await metaEditor.getByRole('button', { name: 'Änderungen speichern', exact: true }).click()

  await expect(page.getByRole('heading', { name: 'Beispielwerke Industrie SE' })).toBeVisible()
  await expect(page.locator('.project-toolbar')).toContainText('Beispielwerke Industrie SE · CRM & Service Transformation 2027')
  await expect(page.locator('.project-toolbar')).toContainText('Ungespeicherte Änderungen')
  await expect(page.getByText('15.08.2027', { exact: true })).toBeVisible()
  await expect(page.getByText('Commit', { exact: true })).toBeVisible()

  await page.getByRole('link', { name: 'Evidenzregister', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'Evidenzregister' })).toBeVisible()

  const evidenceForm = page.getByRole('region', { name: 'Beobachtung oder Aussage erfassen' })
  await evidenceForm
    .getByRole('textbox', { name: 'Aussage', exact: true })
    .fill('Die CFO bestätigt die Investitionspriorität und die wirtschaftliche Freigabe für das Vorhaben.')
  await evidenceForm.getByLabel('Klassifikation').selectOption('confirmed_evidence')
  await evidenceForm.getByLabel('Verifikation').selectOption('confirmed')
  await evidenceForm.getByLabel('Evidenzqualität').selectOption('high')
  await evidenceForm.getByLabel('Quelle / Stakeholder').selectOption('st_eb')
  await evidenceForm.getByLabel('Quelldatum').fill('2026-10-05')
  await evidenceForm
    .getByLabel('Quellenreferenz')
    .selectOption({ label: 'Discovery Workshop Vertrieb · Meeting' })
  await evidenceForm.getByLabel('Economic Buyer', { exact: true }).check()

  const entitySelector = evidenceForm.getByRole('group', { name: /Konkrete Qualification-Entities/ })
  await entitySelector.getByText('Economic Buyer', { exact: true }).click()
  await entitySelector.getByLabel('Dr. Julia Berger · CFO', { exact: true }).check()
  await evidenceForm.getByRole('button', { name: 'Evidenz hinzufügen', exact: true }).click()

  const evidenceCard = page
    .getByRole('article')
    .filter({ hasText: 'Die CFO bestätigt die Investitionspriorität und die wirtschaftliche Freigabe für das Vorhaben.' })
  await expect(evidenceCard).toBeVisible()
  await expect(evidenceCard).toContainText('Discovery Workshop Vertrieb')
  await expect(evidenceCard).toContainText('Dr. Julia Berger · CFO')
  await expect(evidenceCard).toContainText('Economic Buyer')

  await evidenceCard.getByRole('button', { name: 'Links bearbeiten', exact: true }).click()
  const linkEditor = evidenceCard.locator('.evidence-link-editor')
  await linkEditor.getByText('Decision Criteria', { exact: true }).click()
  await linkEditor.getByLabel('Integration in Microsoft 365 und ERP', { exact: true }).check()
  await linkEditor.getByRole('button', { name: 'Links speichern', exact: true }).click()

  await expect(evidenceCard).toContainText('Dr. Julia Berger · CFO')
  await expect(evidenceCard).toContainText('Integration in Microsoft 365 und ERP')

  await page.getByRole('link', { name: 'Dashboard', exact: true }).click()
  const economicBuyerRisk = page
    .getByText('Priorität beim Economic Buyer ist nur indirekt belegt', { exact: true })
    .locator('..')
  await expect(economicBuyerRisk).toContainText('2 Evidenzen')
  await expect(economicBuyerRisk).toContainText('Discovery Workshop Vertrieb')

  await economicBuyerRisk.getByRole('link', { name: /Quellenbasis:/ }).click()
  await expect(page.getByRole('heading', { name: 'Quellen & Referenzen' })).toBeVisible()
  await expect(
    page.locator('[id^="reference-"]').filter({ hasText: 'Discovery Workshop Vertrieb' }),
  ).toBeVisible()

  expect(runtimeErrors).toEqual([])
})
