import { expect, test, type Page } from '@playwright/test'

const builder = '/meddpicc-workbench/#/tools/metric-builder'
const valueBridge = '/meddpicc-workbench/#/tools/value-bridge'
const settings = '/meddpicc-workbench/#/settings'

function acceptBeforeUnload(page: Page): void {
  page.on('dialog', (dialog) => void dialog.accept())
}

async function enableAndFill(page: Page, text = 'Nur lokal: nicht kundenseitig bestätigt') {
  await page.goto(builder)
  await page.getByRole('button', { name: 'Lokale Sicherung aktivieren' }).click()
  await page.getByRole('textbox', { name: 'Welches konkrete Problem besteht?' }).fill(text)
  await expect(page.getByText('Zuletzt lokal zwischengesichert:', { exact: false })).toBeVisible()
}

async function seedRecovery(page: Page, version: number, payload: unknown) {
  await page.evaluate(
    async ({ version, payload }) => {
      const db = await new Promise<IDBDatabase>((resolve, reject) => {
        const request = indexedDB.open('meddpicc-tool-recovery', 1)
        request.onsuccess = () => resolve(request.result)
        request.onerror = () => reject(request.error)
      })
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction('snapshots', 'readwrite')
        tx.objectStore('snapshots').put(
          {
            schemaVersion: version,
            toolId: 'metric-builder',
            revision: 4,
            savedAt: new Date().toISOString(),
            expiresAt: new Date(Date.now() + 2 * 86_400_000).toISOString(),
            payload,
          },
          'metric-builder',
        )
        tx.oncomplete = () => resolve()
        tx.onerror = () => reject(tx.error)
      })
      db.close()
    },
    { version, payload },
  )
}

test('ohne Opt-in gehen Eingaben beim Reload verloren, während die Warnung erscheint', async ({ page }) => {
  await page.goto(builder)
  await page.getByRole('textbox', { name: 'Welches konkrete Problem besteht?' }).fill('Eingabe ohne Einwilligung')
  await expect(page.getByRole('button', { name: 'Lokale Sicherung aktivieren' })).toBeVisible()
  acceptBeforeUnload(page)
  await page.reload()
  await expect(page.getByRole('textbox', { name: 'Welches konkrete Problem besteht?' })).toHaveValue('')
  await expect(page.getByRole('dialog')).toHaveCount(0)
  const result = await page.evaluate(async () => {
    const databases = await indexedDB.databases()
    return databases.filter((entry) => entry.name === 'meddpicc-tool-recovery')
  })
  expect(result).toHaveLength(1) // Only schema/settings database, never unconsented inputs.
  const snapshotCount = await page.evaluate(async () => {
    const req = indexedDB.open('meddpicc-tool-recovery')
    return await new Promise<number>((resolve, reject) => {
      req.onsuccess = () => {
        const tx = req.result.transaction('snapshots', 'readonly')
        const count = tx.objectStore('snapshots').count()
        count.onsuccess = () => resolve(count.result)
        count.onerror = () => reject(count.error)
      }
      req.onerror = () => reject(req.error)
    })
  })
  expect(snapshotCount).toBe(0)
})

test('explizites Opt-in, Reload, Dialog und atomare Wiederherstellung', async ({ page }, testInfo) => {
  await enableAndFill(page)
  acceptBeforeUnload(page)
  await page.reload()
  const dialog = page.getByRole('dialog', { name: 'Lokalen Entwurf gefunden' })
  await expect(dialog).toBeVisible()
  await expect(dialog.getByText('nicht als Datei gespeichert', { exact: false })).toBeVisible()
  await dialog.getByRole('button', { name: 'Entwurf wiederherstellen' }).click()
  await expect(page.getByRole('textbox', { name: 'Welches konkrete Problem besteht?' })).toHaveValue(
    'Nur lokal: nicht kundenseitig bestätigt',
  )
  await expect(dialog).toHaveCount(0)
  await page.screenshot({
    path: testInfo.outputPath('recovery-restored-' + testInfo.project.name + '.png'),
    fullPage: true,
  })
})

test('Tab-Schließen, erneutes Öffnen und bewusstes Verwerfen', async ({ page }) => {
  await enableAndFill(page, 'Mehrstufiger Entwurf nach Tab-Absturz')
  const context = page.context()
  await page.close()
  const reopened = await context.newPage()
  await reopened.goto(builder)
  const dialog = reopened.getByRole('dialog', { name: 'Lokalen Entwurf gefunden' })
  await expect(dialog).toBeVisible()
  await dialog.getByRole('button', { name: 'Recovery verwerfen' }).click()
  await expect(dialog).toHaveCount(0)
  await expect(reopened.getByRole('textbox', { name: 'Welches konkrete Problem besteht?' })).toHaveValue('')
  await reopened.reload()
  await expect(reopened.getByRole('dialog')).toHaveCount(0)
})

test('Deaktivieren löscht vorhandene Entwürfe, zentraler Reset löscht alle Recoverydaten', async ({ page }) => {
  await enableAndFill(page)
  await page.getByRole('button', { name: 'Sicherung deaktivieren und löschen' }).click()
  await expect(page.getByRole('button', { name: 'Lokale Sicherung aktivieren' })).toBeVisible()
  acceptBeforeUnload(page)
  await page.reload()
  await expect(page.getByRole('dialog')).toHaveCount(0)

  await enableAndFill(page, 'Wird vollständig gelöscht')
  await page.goto(settings)
  await page.getByRole('button', { name: 'Alle Recoverydaten löschen' }).click()
  await expect(page.getByRole('status').filter({ hasText: 'Alle lokalen Recovery-Entwürfe' })).toBeVisible()
  await page.goto(builder)
  await expect(page.getByRole('dialog')).toHaveCount(0)
  await expect(page.getByRole('button', { name: 'Lokale Sicherung aktivieren' })).toBeVisible()
})

test('beschädigte und inkompatible Snapshots werden nie geladen', async ({ page }) => {
  await page.goto(builder)
  await page.getByRole('button', { name: 'Lokale Sicherung aktivieren' }).click()
  await seedRecovery(page, 2, { draft: 'incompatible' })
  await page.reload()
  await expect(page.getByRole('alert').filter({ hasText: 'nicht kompatibel' })).toBeVisible()
  await expect(page.getByRole('textbox', { name: 'Welches konkrete Problem besteht?' })).toHaveValue('')
  await page.getByRole('button', { name: 'Ungültige Recoverydaten löschen' }).click()
  await expect(page.getByRole('alert').filter({ hasText: 'nicht kompatibel' })).toHaveCount(0)
  await seedRecovery(page, 1, { draft: { problem: 'malicious' }, step: 2 })
  await page.reload()
  await expect(page.getByRole('alert').filter({ hasText: 'nicht kompatibel' })).toBeVisible()
})

test('älterer Recovery-Stand ersetzt übergebene Daten nicht automatisch', async ({ page }) => {
  await enableAndFill(page, 'Vorheriger Entwurf')
  acceptBeforeUnload(page)
  await page.goto(valueBridge)
  await page.goto(builder)
  const dialog = page.getByRole('dialog', { name: 'Lokalen Entwurf gefunden' })
  await expect(dialog).toBeVisible()
  await expect(page.getByRole('textbox', { name: 'Welches konkrete Problem besteht?' })).toHaveValue('')
  await dialog.getByRole('button', { name: 'Recovery verwerfen' }).click()
  await expect(page.getByRole('textbox', { name: 'Welches konkrete Problem besteht?' })).toHaveValue('')
})

test('zwei Tabs überschreiben einander nicht; Konflikt ist ausdrücklich sichtbar', async ({ page }) => {
  await enableAndFill(page, 'Version eins')
  const other = await page.context().newPage()
  await other.goto(builder)
  await other
    .getByRole('dialog', { name: 'Lokalen Entwurf gefunden' })
    .getByRole('button', { name: 'Entwurf wiederherstellen' })
    .click()
  await expect(other.getByRole('textbox', { name: 'Welches konkrete Problem besteht?' })).toHaveValue('Version eins')

  await page.getByRole('textbox', { name: 'Welches konkrete Problem besteht?' }).fill('Version zwei')
  await expect(page.getByText('Zuletzt lokal zwischengesichert:', { exact: false })).toBeVisible()
  await expect(other.getByRole('alert').filter({ hasText: 'anderen Tab' })).toBeVisible()
  await other.getByRole('textbox', { name: 'Welches konkrete Problem besteht?' }).fill('Konkurrenzstand')
  await other.getByRole('button', { name: 'Anderen Datenstand prüfen' }).click()
  const conflict = other.getByRole('dialog', { name: 'Lokalen Entwurf gefunden' })
  await expect(conflict).toBeVisible()
  await expect(
    conflict.getByText('Wiederherstellen ersetzt den aktuellen Arbeitsstand vollständig.', { exact: false }),
  ).toBeVisible()
})

test('gesicherte Eingaben bleiben bei Speicherfehlern als ungesichert gekennzeichnet', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, 'indexedDB', { get: () => undefined })
  })
  await page.goto(builder)
  await page.getByRole('button', { name: 'Lokale Sicherung aktivieren' }).click()
  await expect(page.getByRole('alert').filter({ hasText: 'nicht verfügbar' })).toBeVisible()
  await page
    .getByRole('textbox', { name: 'Welches konkrete Problem besteht?' })
    .fill('Keine falsche Sicherungsbestätigung')
  await expect(page.getByText('Zuletzt lokal zwischengesichert:', { exact: false })).toHaveCount(0)
})

test('Tastaturfokus, Dialog, mobil und Breitbild ohne horizontales Überlaufen', async ({ page }, testInfo) => {
  await enableAndFill(page, 'Fokusprüfung')
  acceptBeforeUnload(page)
  await page.reload()
  const dialog = page.getByRole('dialog', { name: 'Lokalen Entwurf gefunden' })
  await expect(dialog).toBeVisible()
  const activeIsInDialog = await dialog.evaluate((element) => element.contains(document.activeElement))
  expect(activeIsInDialog).toBe(true)
  await page.keyboard.press('Tab')
  expect(await dialog.evaluate((element) => element.contains(document.activeElement))).toBe(true)
  for (const width of [320, 375, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 850 })
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    )
    expect(overflow, 'Recovery-Dialog bei ' + width).toBeLessThanOrEqual(0)
    await page.screenshot({
      path: testInfo.outputPath('recovery-dialog-' + width + '-' + testInfo.project.name + '.png'),
    })
  }
  await dialog.getByRole('button', { name: 'Recovery verwerfen' }).click()
  await expect(dialog).toHaveCount(0)
})

test('Metric-Handoff funktioniert ohne Recovery und aktiviert keine importierte Metric', async ({ page }) => {
  await page.goto(builder)
  await page.getByRole('button', { name: 'Servicekosten' }).click()
  await page.getByRole('button', { name: 'Weiter', exact: false }).click()
  await page.getByRole('button', { name: 'Metric in Software-Payback übernehmen' }).click()
  await expect(page).toHaveURL(/importMetric=1/)
  const checkbox = page.getByRole('checkbox', { name: 'In den Payback einrechnen' }).first()
  await expect(checkbox).not.toBeChecked()
  await expect(page.getByRole('button', { name: 'Lokale Sicherung aktivieren' })).toBeVisible()
})

test('QuotaExceededError während des Schreibens zeigt keinen falschen Sicherungsstatus', async ({ page }) => {
  await page.addInitScript(() => {
    const originalPut = IDBObjectStore.prototype.put
    IDBObjectStore.prototype.put = function (value: unknown, key?: IDBValidKey) {
      if (this.name === 'snapshots') throw new DOMException('Storage quota full', 'QuotaExceededError')
      return originalPut.call(this, value, key)
    }
  })
  await page.goto(builder)
  await page.getByRole('button', { name: 'Lokale Sicherung aktivieren' }).click()
  await page.getByRole('textbox', { name: 'Welches konkrete Problem besteht?' }).fill('Keine Sicherung bei vollem Speicher')
  await expect(page.getByRole('alert')).toContainText('Speicher gesperrt oder voll')
  await expect(page.getByText('Zuletzt lokal zwischengesichert:', { exact: false })).toHaveCount(0)
})

test('Ein abgelaufener Snapshot wird bei der nächsten Werkzeugöffnung physisch gelöscht', async ({ page }) => {
  await enableAndFill(page, 'Snapshot mit abgelaufener Gültigkeit')
  await page.evaluate(async () => {
    const request = indexedDB.open('meddpicc-tool-recovery')
    const db = await new Promise<IDBDatabase>((resolve, reject) => {
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction('snapshots', 'readwrite')
      const store = tx.objectStore('snapshots')
      const get = store.get('metric-builder')
      get.onsuccess = () => {
        const snapshot = get.result as { expiresAt: string }
        snapshot.expiresAt = new Date(Date.now() - 1000).toISOString()
        store.put(snapshot, 'metric-builder')
      }
      tx.oncomplete = () => resolve()
      tx.onerror = () => reject(tx.error)
    })
    db.close()
  })
  acceptBeforeUnload(page)
  await page.reload()
  await expect(page.getByRole('dialog')).toHaveCount(0)
  const count = await page.evaluate(async () => {
    const request = indexedDB.open('meddpicc-tool-recovery')
    return await new Promise<number>((resolve, reject) => {
      request.onsuccess = () => {
        const db = request.result
        const tx = db.transaction('snapshots', 'readonly')
        const get = tx.objectStore('snapshots').count()
        get.onsuccess = () => resolve(get.result)
        get.onerror = () => reject(get.error)
        tx.oncomplete = () => db.close()
      }
      request.onerror = () => reject(request.error)
    })
  })
  expect(count).toBe(0)
})

test('Fehler beim Export erzeugt keinen Erfolgshinweis und verliert die Eingaben nicht', async ({ page }) => {
  await page.goto(builder)
  await page.getByRole('button', { name: 'CRM-Zeitgewinn' }).click()
  await page.getByRole('button', { name: 'Weiter', exact: false }).click()
  await page.evaluate(() => {
    URL.createObjectURL = () => {
      throw new Error('Download durch Browser blockiert')
    }
  })
  await page.getByRole('button', { name: 'Steckbrief als PDF' }).click()
  await expect(page.getByText('PDF konnte nicht erzeugt werden.')).toBeVisible()
  await expect(page.getByRole('textbox', { name: 'Welches konkrete Problem besteht?' })).not.toHaveValue('')
})
