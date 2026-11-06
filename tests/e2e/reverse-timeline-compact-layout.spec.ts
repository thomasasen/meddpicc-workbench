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
      const unitWidth = await cards.first().locator('.reverse-step-fields select').evaluate(
        (element) => element.getBoundingClientRect().width,
      )
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
