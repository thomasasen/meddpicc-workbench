import { expect, test } from '@playwright/test'

const timeline = '/meddpicc-workbench/#/tools/reverse-timeline'
const entry = 'z. B. Beispielwerke GmbH'
const customer = (page: import('@playwright/test').Page) => page.getByPlaceholder(entry)

test('ohne Opt-in keine dauerhafte Wiederherstellung nach Reload', async ({ page }, testInfo) => {
  await page.goto(timeline)
  await page.screenshot({ path: testInfo.outputPath('recovery-opt-out.png'), fullPage: true })
  await customer(page).fill('Nicht gespeichert')
  page.on('dialog', (dialog) => void dialog.accept())
  await page.reload()
  await expect(customer(page)).toHaveValue('')
  await expect(page.getByRole('button', { name: 'Wiederherstellen' })).toHaveCount(0)
})

test('Opt-in, Neustart des Tabs, manuelles Wiederherstellen und Verwerfen', async ({ page }, testInfo) => {
  await page.goto(timeline)
  await page.getByRole('button', { name: 'Lokales Recovery aktivieren' }).click()
  await customer(page).fill('Recovery Beispielwerke')
  await expect(page.getByText('Nur lokal zwischengesichert.', { exact: false })).toBeVisible()
  await page.reload()
  await expect(customer(page)).toHaveValue('')
  await expect(page.getByRole('button', { name: 'Wiederherstellen' })).toBeVisible()
  await page.setViewportSize({ width: 375, height: 850 })
  await page.screenshot({ path: testInfo.outputPath('recovery-candidate-375.png'), fullPage: true })
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.screenshot({ path: testInfo.outputPath('recovery-candidate-1440.png'), fullPage: true })
  await page.getByRole('button', { name: 'Wiederherstellen' }).click()
  await expect(customer(page)).toHaveValue('Recovery Beispielwerke')
  await expect(page.getByText('nicht neu bestätigt', { exact: false })).toBeVisible()
  await page.screenshot({ path: testInfo.outputPath('recovery-restored-1440.png'), fullPage: true })
  await page.getByRole('button', { name: 'Recoverydaten löschen und deaktivieren' }).click()
  await expect(page.getByText('Recoverydaten gelöscht und lokales Recovery deaktiviert.')).toBeVisible()
  await page.screenshot({ path: testInfo.outputPath('recovery-discarded-1440.png'), fullPage: true })
  await page.reload()
  await expect(page.getByRole('button', { name: 'Wiederherstellen' })).toHaveCount(0)
})

test('Leere numerische Zwischenfelder stoppen Recovery nicht dauerhaft', async ({ page }) => {
  await page.goto(timeline)
  await page.getByRole('button', { name: 'Lokales Recovery aktivieren' }).click()
  await customer(page).fill('Mit unvollständiger Dauer')
  const duration = page.locator('.reverse-step-fields input[type="number"]').first()
  await expect(duration).toBeVisible()
  await duration.fill('')
  await expect(page.getByText('Nur lokal zwischengesichert.', { exact: false })).toBeVisible()
  await page.reload()
  await page.getByRole('button', { name: 'Wiederherstellen' }).click()
  await expect(customer(page)).toHaveValue('Mit unvollständiger Dauer')
  await expect(page.locator('.reverse-step-fields input[type="number"]').first()).toHaveValue('')
})

test('Navigationsflush kann mit Debounce konkurrieren, ohne einen Konflikt auszulösen', async ({ page }) => {
  await page.goto(timeline)
  await page.getByRole('button', { name: 'Lokales Recovery aktivieren' }).click()
  await customer(page).fill('Schneller Werkzeugwechsel')
  await page.getByRole('link', { name: 'Alle Microtools' }).click()
  await expect(page).not.toHaveURL(/reverse-timeline/)
  await page.goto(timeline)
  await page.getByRole('button', { name: 'Wiederherstellen' }).click()
  await expect(customer(page)).toHaveValue('Schneller Werkzeugwechsel')
})

test('Opt-in sichert bereits eingegebene Daten ohne eine weitere Änderung', async ({ page }) => {
  await page.goto(timeline)
  await customer(page).fill('Bereits vor Opt-in erfasst')
  await page.getByRole('button', { name: 'Lokales Recovery aktivieren' }).click()
  await expect(page.getByText('Nur lokal zwischengesichert.', { exact: false })).toBeVisible()
  await page.reload()
  await expect(page.getByRole('button', { name: 'Wiederherstellen' })).toBeVisible()
  await page.getByRole('button', { name: 'Wiederherstellen' }).click()
  await expect(customer(page)).toHaveValue('Bereits vor Opt-in erfasst')
})

test('Tab schließen und im gleichen Browserprofil erneut öffnen', async ({ context }) => {
  const first = await context.newPage()
  await first.goto(timeline)
  await first.getByRole('button', { name: 'Lokales Recovery aktivieren' }).click()
  await customer(first).fill('Im selben Browserprofil')
  await expect(first.getByText('Nur lokal zwischengesichert.', { exact: false })).toBeVisible()
  await first.close()
  const reopened = await context.newPage()
  await reopened.goto(timeline)
  await reopened.getByRole('button', { name: 'Wiederherstellen' }).click()
  await expect(customer(reopened)).toHaveValue('Im selben Browserprofil')
})

test('beschädigte Snapshots werden weder übernommen noch still überschrieben', async ({ page }) => {
  await page.goto(timeline)
  await page.evaluate(async () => {
    const db = await new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open('meddpicc-tool-recovery', 1)
      request.onupgradeneeded = () => {
        if (!request.result.objectStoreNames.contains('snapshots')) request.result.createObjectStore('snapshots')
      }
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction('snapshots', 'readwrite')
      tx.objectStore('snapshots').put('{"version":999,"data":{"customerName":"Falsch"}}', 'reverse-timeline')
      tx.oncomplete = () => resolve()
      tx.onabort = () => reject(tx.error)
    })
    db.close()
  })
  await page.reload()
  await expect(page.getByText('Recoverydaten sind beschädigt', { exact: false })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Wiederherstellen' })).toHaveCount(0)
  await expect(customer(page)).toHaveValue('')
  await page.getByRole('button', { name: 'Recoverydaten löschen und deaktivieren' }).click()
  await expect(page.getByText('Recoverydaten gelöscht', { exact: false })).toBeVisible()
})

test('abgelaufene Recoverydaten aller Tools werden bei erneutem Zugriff bereinigt', async ({ page }) => {
  await page.goto(timeline)
  await page.evaluate(async () => {
    const db = await new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open('meddpicc-tool-recovery', 1)
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction('snapshots', 'readwrite')
      tx.objectStore('snapshots').put(
        JSON.stringify({
          version: 1,
          tool: 'metric-builder',
          token: 'expired-token-123',
          savedAt: '2020-01-01T00:00:00.000Z',
          expiresAt: '2020-01-08T00:00:00.000Z',
          data: {},
        }),
        'metric-builder',
      )
      tx.oncomplete = () => resolve()
      tx.onabort = () => reject(tx.error)
    })
    db.close()
  })
  await page.reload()
  await expect(page.getByRole('button', { name: 'Lokales Recovery aktivieren' })).toBeEnabled()
  const expiredRemoved = () =>
    page.evaluate(async () => {
      const db = await new Promise<IDBDatabase>((resolve, reject) => {
        const request = indexedDB.open('meddpicc-tool-recovery', 1)
        request.onsuccess = () => resolve(request.result)
        request.onerror = () => reject(request.error)
      })
      const result = await new Promise<unknown>((resolve, reject) => {
        const tx = db.transaction('snapshots', 'readonly')
        const request = tx.objectStore('snapshots').get('metric-builder')
        request.onsuccess = () => resolve(request.result)
        request.onerror = () => reject(request.error)
      })
      db.close()
      return result === undefined
    })
  await expect.poll(expiredRemoved).toBe(true)
})

test('Zwei Tabs erkennen auch ohne BroadcastChannel den Schreibkonflikt', async ({ context }, testInfo) => {
  const first = await context.newPage()
  const second = await context.newPage()
  await second.addInitScript(() => {
    Object.defineProperty(window, 'BroadcastChannel', { configurable: true, value: undefined })
  })
  await first.goto(timeline)
  await second.goto(timeline)
  await first.getByRole('button', { name: 'Lokales Recovery aktivieren' }).click()
  await expect(first.getByText('Nur lokal zwischengesichert.', { exact: false })).toBeVisible()
  await second.getByRole('button', { name: 'Lokales Recovery aktivieren' }).click()
  await expect(second.getByText('in einem anderen Tab verändert', { exact: false })).toBeVisible()
  await second.screenshot({ path: testInfo.outputPath('recovery-conflict.png'), fullPage: true })
  await customer(first).fill('Stand aus Tab A')
  await expect(first.getByText('Nur lokal zwischengesichert.', { exact: false })).toBeVisible()
  await customer(second).fill('Nicht übernommener Stand aus Tab B')
  second.once('dialog', (dialog) => void dialog.accept())
  await second.reload()
  await expect(second.getByRole('button', { name: 'Wiederherstellen' })).toBeVisible()
  await second.getByRole('button', { name: 'Wiederherstellen' }).click()
  await expect(customer(second)).toHaveValue('Stand aus Tab A')
})

test('globale Löschung entfernt Recovery-Snapshots', async ({ page }) => {
  await page.goto(timeline)
  await page.getByRole('button', { name: 'Lokales Recovery aktivieren' }).click()
  await customer(page).fill('Sensible lokale Eingabe')
  await expect(page.getByText('Nur lokal zwischengesichert.', { exact: false })).toBeVisible()
  await page.goto('/meddpicc-workbench/#/settings')
  page.on('dialog', (dialog) => void dialog.accept())
  await page.getByRole('button', { name: 'Alle lokalen Recoverydaten löschen' }).click()
  await expect(page.getByText('Alle lokalen Recovery-Arbeitsstände wurden gelöscht.', { exact: false })).toBeVisible()
  await page.goto(timeline)
  await expect(page.getByRole('button', { name: 'Wiederherstellen' })).toHaveCount(0)
})

test('unfreiwillige Tool-Navigation wird bei ungesicherten Eingaben verhindert', async ({ page }) => {
  await page.goto(timeline)
  await customer(page).fill('Vor Navigationsverlust schützen')
  page.once('dialog', async (dialog) => {
    expect(dialog.type()).toBe('confirm')
    await dialog.dismiss()
  })
  await page.getByRole('link', { name: 'Alle Microtools' }).click()
  await expect(page).toHaveURL(/reverse-timeline/)
  await expect(customer(page)).toHaveValue('Vor Navigationsverlust schützen')
})

test('deaktivierte IndexedDB zeigt einen Fehler und keinen gespeicherten Zustand', async ({ page }, testInfo) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, 'indexedDB', { configurable: true, value: undefined })
  })
  await page.goto(timeline)
  await expect(page.getByText('Lokaler Browserspeicher nicht verfügbar.', { exact: false })).toBeVisible()
  await customer(page).fill('Ohne Browserspeicher')
  await page.getByRole('button', { name: 'Lokales Recovery aktivieren' }).click()
  await expect(page.getByText('Lokales Zwischenspeichern fehlgeschlagen.', { exact: false })).toBeVisible()
  await expect(page.locator('.recovery-panel .recovery-label')).toHaveCount(0)
  await page.setViewportSize({ width: 375, height: 850 })
  await page.screenshot({ path: testInfo.outputPath('recovery-storage-error.png'), fullPage: true })
})

test('Recovery: Tastaturfokus und responsive Breiten ohne Overflow', async ({ page }, testInfo) => {
  await page.goto(timeline)
  const enable = page.getByRole('button', { name: 'Lokales Recovery aktivieren' })
  await enable.focus()
  await expect(enable).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page.getByText('Nur lokal zwischengesichert.', { exact: false })).toBeVisible()
  for (const width of [320, 375, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 850 })
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    )
    expect(overflow, 'Viewport ' + width).toBeLessThanOrEqual(0)
    await page.screenshot({ path: testInfo.outputPath('recovery-active-' + width + '.png'), fullPage: true })
  }
})

test('Reduced Motion: Recovery-Oberfläche bleibt ohne Animation verständlich', async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.setViewportSize({ width: 375, height: 850 })
  await page.goto(timeline)
  expect(await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches)).toBe(true)
  await page.screenshot({ path: testInfo.outputPath('recovery-reduced-motion-375.png'), fullPage: true })
})

test('Metric Builder, Cost of Delay und Value Bridge: unabhängige Opt-in-Wiederherstellung', async ({ page }) => {
  const workflows = [
    {
      route: '/meddpicc-workbench/#/tools/metric-builder',
      input: 'textarea[placeholder*="Unsere Servicemitarbeiter"]',
      value: 'Neues Kundenproblem mit vielen Detailannahmen',
    },
    {
      route: '/meddpicc-workbench/#/tools/cost-of-delay',
      input: 'input[placeholder*="Vermiedene externe Servicekosten"]',
      value: 'Verzögerung bei der Implementierung',
    },
    {
      route: '/meddpicc-workbench/#/tools/value-bridge',
      input: 'input[placeholder="Kunde oder Projekt"]',
      value: 'Wiederhergestelltes Unternehmen',
    },
  ] as const
  page.on('dialog', (dialog) => void dialog.accept())
  for (const workflow of workflows) {
    await page.goto(workflow.route)
    const field = page.locator(workflow.input)
    await expect(field).toBeVisible()
    await page.getByRole('button', { name: 'Lokales Recovery aktivieren' }).click()
    await field.fill(workflow.value)
    await expect(page.getByText('Nur lokal zwischengesichert.', { exact: false })).toBeVisible()
    await page.reload()
    await expect(field).toHaveValue('')
    await page.getByRole('button', { name: 'Wiederherstellen' }).click()
    await expect(field).toHaveValue(workflow.value)
  }
})

test('Software-Payback: umfangreicher Kostenentwurf wird im Projektmodus wiederhergestellt', async ({ page }) => {
  await page.goto('/meddpicc-workbench/#/tools/quick-payback')
  await page.getByRole('button', { name: 'Softwareprojekt & Kunden-Metrics' }).click()
  await page.getByRole('button', { name: 'Lokales Recovery aktivieren' }).click()
  await page.getByRole('button', { name: 'Einmalkosten' }).click()
  const name = page.locator('.software-entry input').first()
  await name.fill('Kundenprojekt 4711 mit spezifischen Kosten')
  await expect(page.getByText('Nur lokal zwischengesichert.', { exact: false })).toBeVisible()
  await page.reload()
  await page.getByRole('button', { name: 'Softwareprojekt & Kunden-Metrics' }).click()
  await expect(page.getByRole('button', { name: 'Wiederherstellen' })).toBeVisible()
  await page.getByRole('button', { name: 'Wiederherstellen' }).click()
  await expect(page.locator('.software-entry input').first()).toHaveValue('Kundenprojekt 4711 mit spezifischen Kosten')
})

test('blockierter IndexedDB-Zugriff: keine falsche Sicherungsbestätigung', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, 'indexedDB', { configurable: true, value: undefined })
  })
  await page.goto(timeline)
  await expect(page.getByText('Lokaler Browserspeicher nicht verfügbar.', { exact: false })).toBeVisible()
  await page.getByRole('button', { name: 'Lokales Recovery aktivieren' }).click()
  await customer(page).fill('Kann nicht gesichert werden')
  await expect(page.getByText('Lokales Zwischenspeichern fehlgeschlagen.', { exact: false })).toBeVisible()
  await expect(page.getByText('Nur lokal zwischengesichert.', { exact: false })).toHaveCount(0)
})
