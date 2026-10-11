import { expect, test } from '@playwright/test'

const route = '/meddpicc-workbench/#/settings/document-design'

test('Dokumentgestaltung: Speichern, Reload, Import/Export, Vorschau und Reset', async ({ page }, testInfo) => {
  await page.goto(route)
  await expect(page.getByRole('heading', { name: 'Dokumentgestaltung' })).toBeVisible()
  await expect(page.getByText('Neutrale Dokumentgestaltung ist aktiv.')).toBeVisible()
  await page.getByLabel('Firmenname').fill('Fiktive Industrie GmbH')
  await page.getByLabel('Primärfarbe (Hex)').fill('#172B49')
  await page.getByRole('button', { name: 'Änderungen speichern' }).click()
  await expect(page.getByText('CI-Profil dauerhaft in diesem Browser gespeichert.')).toBeVisible()
  await page.reload()
  await expect(page.getByLabel('Firmenname')).toHaveValue('Fiktive Industrie GmbH')
  await page.getByRole('button', { name: 'PDF-Vorschau erzeugen' }).click()
  await expect(page.locator('iframe[title="Fiktive PDF-Vorschau"]')).toBeVisible()
  const download = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Vorschau herunterladen' }).click()
  expect((await download).suggestedFilename()).toBe('ci-vorschau-customer.pdf')
  const profile = page.waitForEvent('download')
  await page.getByRole('button', { name: 'CI-Profil exportieren' }).click()
  const downloaded = await profile
  expect(downloaded.suggestedFilename()).toBe('company-branding.json')
  const exported = await downloaded.path()
  expect(exported).toBeTruthy()
  if (exported) {
    page.once('dialog', (dialog) => dialog.accept())
    await page.locator('input[aria-label="CI-Profil-JSON auswählen"]').setInputFiles(exported)
    await expect(page.getByText('CI-Profil vollständig geprüft und dauerhaft importiert.')).toBeVisible()
  }
  await page.screenshot({ path: testInfo.outputPath('document-branding-desktop.png'), fullPage: true })
  page.once('dialog', (dialog) => dialog.accept())
  await page.getByRole('button', { name: 'Auf neutrales Profil zurücksetzen' }).click()
  await expect(page.getByLabel('Firmenname')).toHaveValue('')
  await page.reload()
  await expect(page.getByText('Neutrale Dokumentgestaltung ist aktiv.')).toBeVisible()
})

test('Dokumentgestaltung: ungültiger Import verändert gespeicherte Konfiguration nicht', async ({ page }) => {
  await page.goto(route)
  await page.getByLabel('Firmenname').fill('Unveränderte Firma GmbH')
  await page.getByRole('button', { name: 'Änderungen speichern' }).click()
  await page.locator('input[aria-label="CI-Profil-JSON auswählen"]').setInputFiles({
    name: 'bad.json', mimeType: 'application/json', buffer: Buffer.from('{ bad }'),
  })
  await expect(page.getByRole('alert')).toContainText('kein gültiges JSON')
  await page.reload()
  await expect(page.getByLabel('Firmenname')).toHaveValue('Unveränderte Firma GmbH')
})

test('Dokumentgestaltung: Layout bei vier Viewports ohne horizontalen Überlauf', async ({ page }, testInfo) => {
  for (const width of [375, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 850 })
    await page.goto(route)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
    if (width === 375 || width === 1440) {
      await page.screenshot({ path: testInfo.outputPath('document-branding-' + width + '.png'), fullPage: true })
    }
  }
})
