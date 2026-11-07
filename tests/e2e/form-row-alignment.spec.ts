import { expect, test } from '@playwright/test'

test('Planungsrahmen: gleich hohe und ausgerichtete Controls trotz unterschiedlicher Hilfetexte', async ({ page }) => {
  for (const width of [1440, 1024, 800, 375]) {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/meddpicc-workbench/#/tools/reverse-timeline')
    await expect(page.getByRole('heading', { name: 'Planungsrahmen' })).toBeVisible()

    const fieldLayout = await page.locator('.reverse-context-grid > .field').evaluateAll((elements) =>
      elements.map((field) => {
        const input = field.querySelector('input, select')
        const label = field.querySelector(':scope > span')
        // Ungültige Felder blenden den normalen Hilfetext aus und zeigen stattdessen die Fehlermeldung.
        const help = [...field.querySelectorAll(':scope > small, :scope > [role="alert"]')].find(
          (element) => element.getClientRects().length > 0,
        )
        if (!input || !label) throw new Error('Feld ohne Beschriftung oder Eingabebox')
        const control = input.getBoundingClientRect()
        const labelRect = label.getBoundingClientRect()
        const helpRect = help?.getBoundingClientRect()
        return {
          x: control.x,
          y: control.y,
          height: control.height,
          bottom: control.bottom,
          labelBottom: labelRect.bottom,
          helpTop: helpRect?.top ?? null,
        }
      }),
    )

    for (const field of fieldLayout) {
      expect(field.height, `Control-Höhe bei ${width}px`).toBeCloseTo(46, 0)
      expect(field.labelBottom, `Label oberhalb des Controls bei ${width}px`).toBeLessThanOrEqual(field.y + 1)
      if (field.helpTop !== null) {
        expect(field.helpTop, `Hilfetext unter dem Control bei ${width}px`).toBeGreaterThanOrEqual(field.bottom - 1)
      }
    }

    for (let i = 0; i < fieldLayout.length; i++) {
      for (let j = i + 1; j < fieldLayout.length; j++) {
        const first = fieldLayout[i]
        const second = fieldLayout[j]
        // Nur Eingaben in derselben Rasterzeile vergleichen, keine übereinanderliegenden Felder.
        if (Math.abs(first.x - second.x) < 2 || Math.abs(first.y - second.y) > 55) continue
        expect(Math.abs(first.y - second.y), `Y-Versatz bei ${width}px (${i},${j})`).toBeLessThanOrEqual(1)
        expect(Math.abs(first.height - second.height), `Höhenversatz bei ${width}px`).toBeLessThanOrEqual(1)
      }
    }
  }
})

test('Planungsrahmen bleibt nach einem Datumseintrag korrekt ausgerichtet', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/meddpicc-workbench/#/tools/reverse-timeline')
  await page.locator('.reverse-context-grid input[type="date"]').last().fill('2027-02-10')
  await expect(page.locator('.reverse-context-grid > .field')).toHaveCount(5)

  const top = await page.locator('.reverse-context-grid > .field input').evaluateAll((inputs) =>
    inputs.slice(0, 4).map((input) => {
      const rect = input.getBoundingClientRect()
      return { top: rect.top, height: rect.height }
    }),
  )

  expect(Math.max(...top.map((item) => item.top)) - Math.min(...top.map((item) => item.top))).toBeLessThanOrEqual(1)
  expect(top.every((item) => Math.abs(item.height - 46) <= 1)).toBe(true)
})
