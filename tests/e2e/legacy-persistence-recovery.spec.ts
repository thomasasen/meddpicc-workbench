import { expect, test } from '@playwright/test'

const route = '/meddpicc-workbench/#/evidence'

async function createUnsavedEvidence(page: import('@playwright/test').Page): Promise<void> {
  await page.goto(route)
  await page.getByRole('textbox', { name: 'Aussage' }).fill('Unbestätigte Aussage für den Recovery-Lifecycle-Test')
  await page.getByRole('button', { name: 'Evidenz hinzufügen' }).click()
  await expect(page.locator('.project-save-state')).toContainText('Änderungen nicht als Datei bestätigt')
}

test('Legacy: Browser-Download bestätigt keine Dateispeicherung oder neue Revision im laufenden Projekt', async ({
  page,
}) => {
  await createUnsavedEvidence(page)
  const downloadPromise = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Projekt speichern' }).click()
  const download = await downloadPromise
  expect(download.suggestedFilename()).toMatch(/\.meddpicc$/)
  await expect(page.getByRole('status')).toContainText('Browser-Download angestoßen')
  await expect(page.locator('.project-save-state')).toContainText('Änderungen nicht als Datei bestätigt')
  await expect(page.getByText('Der Bearbeitungsstand bleibt ungesichert.', { exact: false })).toBeVisible()

  // Interne Navigation ist ebenso geschützt, nicht nur Reload/Tab-Schließen.
  await page.getByRole('link', { name: 'Dashboard' }).click()
  await expect(page).toHaveURL(/#\/evidence$/)
  page.on('dialog', (dialog) => void dialog.accept())
  await page.getByRole('link', { name: 'Dashboard' }).click()
  await expect(page).toHaveURL(/#\/$/)
})

test('Legacy: gescheiterter Browser-Download hinterlässt den nicht bestätigten Arbeitsstand', async ({ page }) => {
  await createUnsavedEvidence(page)
  await page.evaluate(() => {
    URL.createObjectURL = () => {
      throw new Error('Download durch Browser blockiert')
    }
  })
  await page.getByRole('button', { name: 'Projekt speichern' }).click()
  await expect(page.getByRole('alert')).toContainText('Das Projekt konnte nicht gespeichert werden')
  await expect(page.locator('.project-save-state')).toContainText('Änderungen nicht als Datei bestätigt')
})
