import { expect, test } from '@playwright/test'

const route = '/meddpicc-workbench/#/tools/reverse-timeline'

test('Prozesskarten sind bei allen relevanten Breiten kompakt und ohne Überlauf', async ({ page }) => {
  for (const width of [320, 375, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 })
    await page.goto(route)

    const cards = page.locator('.reverse-step-card')
    await expect(cards).toHaveCount(5)
    await expect(page.getByRole('heading', { name: 'Schritte vom Go-Live rückwärts' })).toBeVisible()

    const result = await page.evaluate(() => {
      const section = document.querySelector<HTMLElement>('.reverse-steps-section')
      const list = document.querySelector<HTMLElement>('.reverse-step-list')
      const cards = [...document.querySelectorAll<HTMLElement>('.reverse-step-card')]
      const details = document.querySelector<HTMLDetailsElement>('.reverse-step-more')
      if (!section || !list || !details || cards.length !== 5) throw new Error('Prozesskarten fehlen')

      const bounds = cards.map((card) => card.getBoundingClientRect())
      const labels = [...cards[0].querySelectorAll<HTMLElement>('.reverse-step-fields .field > span')].map((label) =>
        label.textContent?.trim(),
      )

      return {
        viewport: window.innerWidth,
        documentWidth: document.documentElement.scrollWidth,
        sectionWidth: section.getBoundingClientRect().width,
        listWidth: list.getBoundingClientRect().width,
        cardWidths: bounds.map((box) => box.width),
        cardHeights: bounds.map((box) => box.height),
        cardGaps: bounds.slice(1).map((box, i) => box.top - bounds[i].bottom),
        detailsInitiallyClosed: !details.open,
        labels,
      }
    })

    expect(result.documentWidth, `Horizontaler Überlauf bei ${width}px`).toBeLessThanOrEqual(result.viewport + 1)
    expect(result.listWidth, `Listenbreite bei ${width}px`).toBeLessThanOrEqual(result.sectionWidth)
    expect(result.cardWidths.every((value) => value <= result.listWidth + 1)).toBe(true)
    expect(result.detailsInitiallyClosed).toBe(true)
    expect(result.labels).toEqual(['Schritt', 'Dauer', 'Einheit'])
    expect(result.cardGaps.every((value) => value >= 7 && value <= 20)).toBe(true)
    if (width === 1440) {
      expect(result.listWidth).toBeLessThanOrEqual(1041)
      expect(Math.max(...result.cardHeights)).toBeLessThan(170)
    }
    if (width <= 375) {
      expect(Math.max(...result.cardHeights)).toBeLessThan(330)
      const unitWidth = await cards
        .first()
        .locator('.reverse-step-fields select')
        .evaluate((element) => element.getBoundingClientRect().width)
      expect(unitWidth, `Einheitenauswahl bei ${width}px`).toBeGreaterThanOrEqual(160)
    }
    if ([320, 375, 1440].includes(width) && test.info().project.name === 'desktop-chromium') {
      /* Die fixe Kopfzeile darf das reine Abschnittsbild nicht überlagern.
       * Interaktiv bleibt sie unverändert sticky. */
      await page.addStyleTag({
        content: '.site-header { position: static !important; } .skip-link { display: none !important; }',
      })
      await page.locator('.reverse-steps-section').screenshot({
        path: test.info().outputPath(`reverse-timeline-compact-${width}.png`),
      })
    }
  }
})

test('Details lassen sich bearbeiten und ohne Datenverlust einklappen', async ({ page }) => {
  await page.goto(route)
  const first = page.locator('.reverse-step-card').first()
  const details = first.locator('.reverse-step-more')
  const summary = details.locator('summary')

  await expect(summary).toContainText('Implementierung · Gemeinsam')
  await expect(first.locator('.reverse-step-detail-grid select').first()).not.toBeVisible()

  await summary.click()
  await expect(details).toHaveAttribute('open', '')
  await details.getByText('Verantwortlich', { exact: true }).waitFor()
  await details.locator('select').first().selectOption('seller')
  await details.locator('select').nth(1).selectOption('paper-process')
  await details.locator('input').fill('Einkaufsleitung')
  await expect(summary).toContainText('Paper Process · Anbieter · Einkaufsleitung')

  await summary.click()
  await expect(details).not.toHaveAttribute('open', '')
  await expect(summary).toContainText('Einkaufsleitung')
  await summary.click()
  await expect(details.locator('input')).toHaveValue('Einkaufsleitung')

  const handle = first.locator('.reverse-drag-handle')
  await handle.focus()
  await handle.press('ArrowDown')
  await expect(page.locator('.reverse-step-card').nth(1).locator('.reverse-step-name input')).toHaveValue(
    'Implementierung / Rollout',
  )
})

test('Drag-Leiste fuellt die Kartenhoehe; Nummer, Eingabe und Papierkorb liegen auf derselben Linie', async ({
  page,
}) => {
  for (const width of [1024, 1440]) {
    await page.setViewportSize({ width, height: 900 })
    await page.goto(route)
    const geometry = await page
      .locator('.reverse-step-card')
      .first()
      .evaluate((card) => {
        const get = (selector: string) => {
          const element = card.querySelector<HTMLElement>(selector)
          if (!element) throw new Error(`Element fehlt: ${selector}`)
          const rect = element.getBoundingClientRect()
          return { top: rect.top, bottom: rect.bottom, height: rect.height }
        }
        const rect = card.getBoundingClientRect()
        return {
          card: { top: rect.top, bottom: rect.bottom, height: rect.height },
          grip: get('.reverse-drag-handle'),
          badge: get('.reverse-step-position'),
          name: get('.reverse-step-name input'),
          duration: get('.reverse-step-fields input[type="number"]'),
          unit: get('.reverse-step-fields select'),
          deleteButton: get('.reverse-step-controls button'),
        }
      })

    for (const control of [geometry.badge, geometry.duration, geometry.unit, geometry.deleteButton]) {
      expect(Math.abs(control.top - geometry.name.top), `Oberkante bei ${width}px`).toBeLessThanOrEqual(0.75)
      expect(Math.abs(control.height - geometry.name.height), `Control-Hoehe bei ${width}px`).toBeLessThanOrEqual(2)
    }

    expect(geometry.grip.top - geometry.card.top).toBeLessThanOrEqual(16)
    expect(geometry.card.bottom - geometry.grip.bottom).toBeLessThanOrEqual(16)
    expect(geometry.grip.height).toBeGreaterThan(geometry.name.height * 2)
  }
})

test('Recovery bleibt eine kompakte Optionszeile und legt den Datenschutztext offen', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto(route)

  const recovery = page.locator('.recovery-panel')
  await expect(recovery).toHaveCount(1)
  await expect(recovery.getByRole('heading', { name: 'Optionales lokales Recovery' })).toBeVisible()
  await expect(recovery.getByRole('button', { name: 'Lokales Recovery aktivieren' })).toBeVisible()

  const geometry = await recovery.evaluate((panel) => {
    const button = panel.querySelector<HTMLButtonElement>('.recovery-actions button')
    if (!button) throw new Error('Recovery-Aktion fehlt')
    const a = panel.getBoundingClientRect()
    const b = button.getBoundingClientRect()
    return { height: a.height, buttonTop: b.top, panelTop: a.top, buttonHeight: b.height }
  })
  expect(geometry.height).toBeLessThanOrEqual(150)
  expect(geometry.buttonHeight).toBeGreaterThanOrEqual(44)
  expect(geometry.buttonTop - geometry.panelTop).toBeGreaterThanOrEqual(0)

  await recovery.screenshot({
    path: test.info().outputPath('reverse-timeline-compact-recovery-1440.png'),
  })

  const disclosure = recovery.locator('details')
  await expect(disclosure).not.toHaveAttribute('open', '')
  await disclosure.locator('summary').click()
  await expect(disclosure).toHaveAttribute('open', '')
  await expect(disclosure.getByText(/nicht verschluesselt|nicht verschlüsselt/i)).toBeVisible()
})

test('Touch-Ansicht behaelt den durchgehenden Drag-Griff und gut erreichbare Aktionen', async ({ page }) => {
  for (const width of [320, 375, 768]) {
    await page.setViewportSize({ width, height: 900 })
    await page.goto(route)

    const geometry = await page
      .locator('.reverse-step-card')
      .first()
      .evaluate((card) => {
        const drag = card.querySelector<HTMLElement>('.reverse-drag-handle')
        const badge = card.querySelector<HTMLElement>('.reverse-step-position')
        const deleteButton = card.querySelector<HTMLElement>('.reverse-step-controls button')
        if (!drag || !badge || !deleteButton) throw new Error('Bedienelement fehlt')
        const a = card.getBoundingClientRect()
        const d = drag.getBoundingClientRect()
        const b = badge.getBoundingClientRect()
        const del = deleteButton.getBoundingClientRect()
        return {
          cardHeight: a.height,
          dragHeight: d.height,
          dragWidth: d.width,
          dragBottomGap: a.bottom - d.bottom,
          badgeHeight: b.height,
          deleteWidth: del.width,
          deleteHeight: del.height,
        }
      })

    expect(geometry.dragHeight).toBeGreaterThan(geometry.cardHeight - 35)
    expect(geometry.dragBottomGap).toBeLessThanOrEqual(17)
    expect(geometry.dragWidth).toBeGreaterThanOrEqual(44)
    expect(geometry.badgeHeight).toBeGreaterThanOrEqual(44)
    expect(geometry.deleteWidth).toBeGreaterThanOrEqual(44)
    expect(geometry.deleteHeight).toBeGreaterThanOrEqual(44)
    await expect(page.locator('.recovery-panel')).toBeVisible()
  }
})

test('Auf schmalen Displays sitzt die Schritt-Nummer direkt neben dem Textfeld', async ({ page }) => {
  for (const width of [320, 375]) {
    await page.setViewportSize({ width, height: 900 })
    await page.goto(route)
    const positions = await page
      .locator('.reverse-step-card')
      .first()
      .evaluate((card) => {
        const badge = card.querySelector<HTMLElement>('.reverse-step-position')
        const field = card.querySelector<HTMLInputElement>('.reverse-step-name input')
        const unit = card.querySelector<HTMLSelectElement>('.reverse-step-fields select')
        if (!badge || !field || !unit) throw new Error('Prozessfelder fehlen')
        const b = badge.getBoundingClientRect()
        const f = field.getBoundingClientRect()
        const u = unit.getBoundingClientRect()
        return { numberTop: b.top, fieldTop: f.top, numberHeight: b.height, fieldHeight: f.height, unitWidth: u.width }
      })
    expect(Math.abs(positions.numberTop - positions.fieldTop)).toBeLessThanOrEqual(0.75)
    expect(Math.abs(positions.numberHeight - positions.fieldHeight)).toBeLessThanOrEqual(2)
    expect(positions.unitWidth).toBeGreaterThanOrEqual(160)
  }
})
