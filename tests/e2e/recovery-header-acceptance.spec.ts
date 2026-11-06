import { expect, test } from '@playwright/test'

const base = '/meddpicc-workbench/#/tools/'

const tools = [
  {
    id: 'reverse-timeline',
    route: 'reverse-timeline',
    selector: 'input[placeholder="z. B. Beispielwerke GmbH"]',
    value: 'Recovery Prüfung Timeline',
  },
  {
    id: 'metric-builder',
    route: 'metric-builder',
    selector: 'textarea[placeholder*="Unsere Servicemitarbeiter"]',
    value: 'Recovery Prüfung Kundenproblem',
  },
  {
    id: 'cost-of-delay',
    route: 'cost-of-delay',
    selector: 'input[placeholder*="Vermiedene externe Servicekosten"]',
    value: 'Recovery Prüfung Kosten',
  },
  {
    id: 'value-bridge',
    route: 'value-bridge',
    selector: 'input[placeholder="Kunde oder Projekt"]',
    value: 'Recovery Prüfung Wertbeitrag',
  },
  {
    id: 'software-payback',
    route: 'quick-payback',
    selector: '.software-entry input',
    value: 'Recovery Prüfung Softwarekosten',
  },
] as const

test('Der Headerstatus funktioniert in allen fünf Tools auf 320 bis 1440 Pixeln', async ({ page }, testInfo) => {
  page.on('dialog', (dialog) => void dialog.accept())

  for (const tool of tools) {
    await page.goto(base + tool.route)
    if (tool.id === 'software-payback') {
      await page.getByRole('button', { name: /Softwareprojekt & Kunden-Metrics/ }).click()
      await page.getByRole('button', { name: 'Einmalkosten' }).click()
    }

    const status = page.getByTestId('recovery-header-status')
    const field = page.locator(tool.selector).first()
    await expect(status).toHaveCount(1)
    // Der Wechsel vom Schnellrechner in den Projektmodus erzeugt selbst bereits
    // einen neuen, noch nicht gesicherten Tool-Input. Das ist fachlich korrekt.
    await expect(status).toHaveAttribute('data-state', tool.id === 'software-payback' ? 'unsaved' : 'inactive')
    await expect(field).toBeVisible()
    await field.fill(tool.value)
    await expect(status).toHaveAttribute('data-state', 'unsaved')

    await page.getByRole('button', { name: 'Lokales Recovery aktivieren' }).click()
    await expect(status).toHaveAttribute('data-state', 'saved')
    await expect(status).toContainText('Lokal gesichert')
    await expect(status).toHaveAttribute('title', /Keine gespeicherte Datei/)
    expect(await status.innerText()).not.toContain(tool.value)

    for (const width of [320, 375, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 850 })
      await expect(status, tool.id + ' bei ' + width + 'px').toBeVisible()
      const box = await status.boundingBox()
      expect(box, tool.id + ': Status hat kein Layout').not.toBeNull()
      if (box) {
        expect(box.x, tool.id + ': linker Rand').toBeGreaterThanOrEqual(-1)
        expect(box.x + box.width, tool.id + ': rechter Rand').toBeLessThanOrEqual(width + 1)
      }
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      )
      expect(overflow, tool.id + ': horizontaler Überlauf bei ' + width + 'px').toBeLessThanOrEqual(1)
      await page.screenshot({
        path: testInfo.outputPath(tool.id + '-saved-' + width + '.png'),
        fullPage: true,
      })
    }
  }
})

test('Echte Statusübergänge einschließlich Pending und Saving sind sichtbar', async ({ page }, testInfo) => {
  // Die reale IndexedDB-Öffnung bleibt bestehen; nur ihr Success-Callback wird
  // für den Screenshot verzögert. Kein künstlicher UI-Zustand wird gesetzt.
  await page.addInitScript(() => {
    const originalOpen = indexedDB.open.bind(indexedDB)
    Object.defineProperty(indexedDB, 'open', {
      configurable: true,
      value: (name: string, version?: number) => {
        const request = version === undefined ? originalOpen(name) : originalOpen(name, version)
        Object.defineProperty(request, 'onsuccess', {
          configurable: true,
          set(callback: ((this: IDBRequest, event: Event) => void) | null) {
            if (!callback) return
            request.addEventListener(
              'success',
              (event) => {
                window.setTimeout(() => callback.call(request, event), 1200)
              },
              { once: true },
            )
          },
        })
        return request
      },
    })
  })

  await page.setViewportSize({ width: 375, height: 850 })
  await page.goto(base + 'reverse-timeline')
  const status = page.getByTestId('recovery-header-status')
  await expect(status).toHaveAttribute('data-state', 'inactive')
  await page.screenshot({ path: testInfo.outputPath('inactive-375.png'), fullPage: true })

  const customer = page.getByPlaceholder('z. B. Beispielwerke GmbH')
  await customer.fill('Erste Sicherung')
  await expect(status).toHaveAttribute('data-state', 'unsaved')
  await page.screenshot({ path: testInfo.outputPath('unsaved-375.png'), fullPage: true })

  await page.getByRole('button', { name: 'Lokales Recovery aktivieren' }).click()
  await expect(status).toHaveAttribute('data-state', 'saving')
  await page.screenshot({ path: testInfo.outputPath('saving-375.png'), fullPage: true })
  await expect(status).toHaveAttribute('data-state', 'saved')
  await customer.fill('Noch nicht geschrieben')
  await expect(status).toHaveAttribute('data-state', 'pending')
  await status.screenshot({ path: testInfo.outputPath('pending-375.png') })
  await expect(status).toHaveAttribute('data-state', 'saving')
  await expect(status).toHaveAttribute('data-state', 'saved')
  await page.screenshot({ path: testInfo.outputPath('saved-375.png'), fullPage: true })

  await page.reload()
  await expect(status).toHaveAttribute('data-state', 'available')
  await page.screenshot({ path: testInfo.outputPath('available-375.png'), fullPage: true })
})

test('Ein fehlgeschlagener Restore erscheint als Fehler statt als wiederherstellbarer Stand', async ({
  page,
}, testInfo) => {
  await page.goto(base + 'reverse-timeline')
  await page.getByPlaceholder('z. B. Beispielwerke GmbH').fill('Vertraulicher Entwurf')
  await page.getByRole('button', { name: 'Lokales Recovery aktivieren' }).click()
  const status = page.getByTestId('recovery-header-status')
  await expect(status).toHaveAttribute('data-state', 'saved')
  await page.reload()
  await expect(status).toHaveAttribute('data-state', 'available')

  await page.evaluate(() => {
    Object.defineProperty(indexedDB, 'open', {
      configurable: true,
      value: () => {
        throw new Error('IndexedDB temporär nicht verfügbar')
      },
    })
  })
  await page.getByRole('button', { name: 'Wiederherstellen' }).click()
  await expect(status).toHaveAttribute('data-state', 'error')
  await expect(status).toContainText('Speicherproblem')
  await expect(page.getByPlaceholder('z. B. Beispielwerke GmbH')).toHaveValue('')
  await page.screenshot({ path: testInfo.outputPath('restore-error-375.png'), fullPage: true })
})

test('Reduced Motion und Tastaturbedienung bleiben im Header verlässlich', async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.setViewportSize({ width: 320, height: 740 })
  await page.goto(base + 'reverse-timeline')
  const status = page.getByTestId('recovery-header-status')
  await expect(status).toBeVisible()
  await expect(status).toHaveAttribute('role', 'status')
  await expect(status).toHaveAttribute('aria-atomic', 'true')

  const activate = page.getByRole('button', { name: 'Lokales Recovery aktivieren' })
  await activate.focus()
  await expect(activate).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(status).toHaveAttribute('data-state', 'saved')
  await expect(status.locator('svg')).toHaveCSS('animation-name', 'none')
  await page.screenshot({ path: testInfo.outputPath('reduced-motion-320.png'), fullPage: true })
})
