import { expect, test } from '@playwright/test'

const homeRoute = '/meddpicc-workbench/'
const settingsRoute = '/meddpicc-workbench/#/settings'
const brandingRoute = '/meddpicc-workbench/#/settings/document-design'

test('Zahnrad der Startseite öffnet die zentrale Einstellungsübersicht', async ({ page }) => {
  await page.goto(homeRoute)
  const trigger = page.getByRole('link', { name: 'Einstellungen und Konfigurationen' })
  await expect(trigger).toBeVisible()
  await expect(trigger.locator('svg')).toBeVisible()
  await trigger.click()
  await expect(page).toHaveURL(settingsRoute)
  await expect(page.getByRole('heading', { name: 'Einstellungen', level: 1 })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Dokumente und Exporte', level: 2 })).toBeVisible()
  await expect(page.getByRole('status').filter({ hasText: 'Neutrale Dokumentgestaltung ist aktiv.' })).toBeVisible()
  await page.getByRole('link', { name: 'Dokumentgestaltung öffnen' }).click()
  await expect(page).toHaveURL(brandingRoute)
  await expect(page.getByRole('heading', { name: 'Dokumentgestaltung', level: 1 })).toBeVisible()
  await page.getByRole('link', { name: 'Einstellungen', exact: true }).click()
  await expect(page).toHaveURL(settingsRoute)
  await page.getByRole('link', { name: 'Zur Startseite' }).click()
  await expect(
    page.getByRole('heading', { name: 'Wiederkehrende Sales-Aufgaben schneller und sicherer erledigen.' }),
  ).toBeVisible()
})

test('Firmenprofil bleibt nach Navigation und Reload unverändert gespeichert', async ({ page }) => {
  await page.goto(settingsRoute)
  await page.getByRole('link', { name: 'Dokumentgestaltung öffnen' }).click()
  await page.getByLabel('Firmenname').fill('Fiktive Konfiguration GmbH')
  await page.getByRole('button', { name: 'Änderungen speichern' }).click()
  await expect(page.getByText('CI-Profil dauerhaft in diesem Browser gespeichert.')).toBeVisible()
  await page.getByRole('link', { name: 'Einstellungen', exact: true }).click()
  await expect(page.getByRole('status')).toContainText('Aktives Firmenprofil: Fiktive Konfiguration GmbH')
  await page.reload()
  await expect(page.getByRole('status')).toContainText('Aktives Firmenprofil: Fiktive Konfiguration GmbH')
  await page.goto(brandingRoute)
  await expect(page.getByLabel('Firmenname')).toHaveValue('Fiktive Konfiguration GmbH')
})

test('Einstellungsübersicht bleibt bei 375, 768, 1024 und 1440px zugänglich', async ({ page }, testInfo) => {
  for (const width of [375, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 850 })
    await page.goto(homeRoute)
    const trigger = page.getByRole('link', { name: 'Einstellungen und Konfigurationen' })
    await expect(trigger).toBeVisible()
    await trigger.focus()
    await expect(trigger).toBeFocused()
    await page.keyboard.press('Enter')
    await expect(page.getByRole('heading', { name: 'Einstellungen', level: 1 })).toBeVisible()
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
    if (width === 375 || width === 1440) {
      await page.screenshot({ path: testInfo.outputPath('einstellungen-' + width + '.png'), fullPage: true })
    }
    await page.getByRole('link', { name: 'Dokumentgestaltung öffnen' }).focus()
    await page.keyboard.press('Enter')
    await expect(page.getByRole('heading', { name: 'Dokumentgestaltung', level: 1 })).toBeVisible()
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
  }
})

test('Bei defektem Browserspeicher ist die Konfiguration weiterhin erreichbar', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(IDBFactory.prototype, 'open', {
      configurable: true,
      value() {
        throw new DOMException('IDB gesperrt', 'InvalidStateError')
      },
    })
  })
  await page.goto(settingsRoute)
  await expect(page.getByRole('alert')).toContainText('konnte nicht gelesen werden')
  await page.getByRole('link', { name: 'Dokumentgestaltung öffnen' }).click()
  await expect(page.getByRole('heading', { name: 'Dokumentgestaltung', level: 1 })).toBeVisible()
})

test('Go-Live-Rückwärtsplanung verlinkt Einstellungen zentral statt direkt Dokumentgestaltung', async ({ page }) => {
  await page.goto('/meddpicc-workbench/#/tools/reverse-timeline')
  await page.getByLabel('Target Go-Live').fill('2026-12-31')
  const settings = page.getByRole('link', { name: 'Einstellungen', exact: true })
  await expect(settings).toBeVisible()
  await settings.click()
  await expect(page).toHaveURL(settingsRoute)
})
