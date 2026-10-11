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
    name: 'bad.json',
    mimeType: 'application/json',
    buffer: Buffer.from('{ bad }'),
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


const samplePng =
  'iVBORw0KGgoAAAANSUhEUgAAASwAAABGCAYAAAB2Zan9AAABdklEQVR42u3cu63CQBRFUUCug4S+SBxREZET+iKhEegAG2HMuTNrxfwRW2f09LzbAQAAAAAAAAAA8I393A2O5+vTxwT82uN2me3RwccEVCFYgGABCBYgWACCBbCSoYU3cZ/Gxbc9jZNvHQQrM1Bz9xUwEKyoSC19XPECwYoM1bvnEi4QrNhQCRfUEPlXwn/GKvF1AKHBSouEaIEjYakwOCKChVVuxVhb0HmwqkVAtKDzhQUQH6yqa8XKgs6CVf1HL1rgSAiQFaxW1omVBRYWgGABgtX1McqxECwsAMECBAtAsAAECxAsAMECBGvrJ2ztqp2uQgoWFoBgAYLV5THKcRAsLICsYFVfJ9YVdJawqv7oxQocCQGyg1VtrVhX0PnCqhIBsYL/GtJikHgFT6ECC6tEHMQKBKtEJMQKHAnjj4hCBYIVHy6hAsFaPSZrxkukQLA2XUKfBEygQLCiAga0yb/mAIIFIFiAYAEIFgAAAAAAAAAAQNteGgNlqRWs/fMAAAAASUVORK5CYII='

test('Dokumentgestaltung: Logo prüfen, speichern und ohne Datenverlust entfernen', async ({ page }) => {
  await page.goto(route)
  await page.getByLabel('Firmenname').fill('Fiktive Logofirma GmbH')
  await page.locator('input[aria-label="PNG- oder JPEG-Firmenlogo wählen"]').setInputFiles({
    name: 'test-logo.png',
    mimeType: 'image/png',
    buffer: Buffer.from(samplePng, 'base64'),
  })
  await expect(page.getByRole('img', { name: 'Aktuell ausgewähltes Firmenlogo' })).toBeVisible()
  await page.getByRole('button', { name: 'Änderungen speichern' }).click()
  await expect(page.getByText('CI-Profil dauerhaft in diesem Browser gespeichert.')).toBeVisible()
  await page.reload()
  await expect(page.getByRole('img', { name: 'Aktuell ausgewähltes Firmenlogo' })).toBeVisible()

  await page.locator('input[aria-label="PNG- oder JPEG-Firmenlogo wählen"]').setInputFiles({
    name: 'angriff.svg',
    mimeType: 'image/svg+xml',
    buffer: Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>'),
  })
  await expect(page.getByRole('alert')).toContainText('Nur echte PNG- und JPEG-Dateien')
  await expect(page.getByRole('img', { name: 'Aktuell ausgewähltes Firmenlogo' })).toBeVisible()

  await page.getByRole('button', { name: 'Logo entfernen' }).click()
  await page.getByRole('button', { name: 'Änderungen speichern' }).click()
  await page.reload()
  await expect(page.getByText('Kein Firmenlogo hinterlegt.')).toBeVisible()
})

test('Dokumentgestaltung: gleichzeitige Tabs können gespeicherte CI-Daten nicht still überschreiben', async ({
  page,
}) => {
  const second = await page.context().newPage()
  await page.goto(route)
  await second.goto(route)
  await expect(page.getByText('Neutrale Dokumentgestaltung ist aktiv.')).toBeVisible()
  await expect(second.getByText('Neutrale Dokumentgestaltung ist aktiv.')).toBeVisible()
  await page.getByLabel('Firmenname').fill('Erstes Unternehmen GmbH')
  await page.getByRole('button', { name: 'Änderungen speichern' }).click()
  await expect(page.getByText('CI-Profil dauerhaft in diesem Browser gespeichert.')).toBeVisible()
  await second.getByLabel('Firmenname').fill('Veraltetes Unternehmen GmbH')
  await second.getByRole('button', { name: 'Änderungen speichern' }).click()
  await expect(second.getByRole('alert')).toContainText('in einem anderen Tab geändert')
  await second.reload()
  await expect(second.getByLabel('Firmenname')).toHaveValue('Erstes Unternehmen GmbH')
  await second.close()
})

test('Dokumentgestaltung: simulierter IndexedDB-Ausfall meldet ungespeicherte Änderungen', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(IDBFactory.prototype, 'open', {
      configurable: true,
      value() {
        throw new DOMException('Simulierter Quota-Fehler', 'QuotaExceededError')
      },
    })
  })
  await page.goto(route)
  await expect(page.getByRole('alert')).toContainText('nicht dauerhaft gespeichert')
  await page.getByLabel('Firmenname').fill('Nicht gespeicherte Firma GmbH')
  await page.getByRole('button', { name: 'Änderungen speichern' }).click()
  await expect(page.getByRole('alert')).toContainText('Simulierter Quota-Fehler')
  await expect(page.getByText('CI-Profil dauerhaft in diesem Browser gespeichert.')).toHaveCount(0)
})
