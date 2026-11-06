import { expect, test } from '@playwright/test'

test('Prozesskarten sind auf Desktop kompakt, alle Felder haben dieselbe Eingabehöhe', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/meddpicc-workbench/#/tools/reverse-timeline')

  const cards = page.locator('.reverse-step-card')
  await expect(cards).toHaveCount(5)
  const first = cards.first()
  const fields = first.locator('.reverse-step-fields :is(input, select)')
  await expect(fields).toHaveCount(5)

  const rects = await fields.evaluateAll((elements) =>
    elements.map((element) => {
      const rect = element.getBoundingClientRect()
      return { top: rect.top, bottom: rect.bottom, height: rect.height }
    }),
  )
  expect(Math.max(...rects.map((rect) => rect.top)) - Math.min(...rects.map((rect) => rect.top))).toBeLessThanOrEqual(2)
  expect(Math.max(...rects.map((rect) => rect.height)) - Math.min(...rects.map((rect) => rect.height))).toBeLessThanOrEqual(2)

  const cardHeight = await first.evaluate((element) => element.getBoundingClientRect().height)
  expect(cardHeight).toBeLessThan(175)
  await expect(first.locator('.reverse-step-extra')).not.toHaveAttribute('open', '')
  await first.locator('.reverse-step-extra summary').click()
  await expect(first.locator('.reverse-step-extra')).toHaveAttribute('open', '')
  await first.locator('.reverse-step-owner-detail input').fill('Legal Team')
  await first.locator('.reverse-step-extra summary').click()
  await expect(first.locator('.reverse-step-extra summary')).toContainText('Legal Team')
})

for (const width of [320, 375, 768, 1024]) {
  test(`Prozesskarten bei ${width} px: keine abgeschnittenen Eingaben oder horizontaler Scroll`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/meddpicc-workbench/#/tools/reverse-timeline')

    const first = page.locator('.reverse-step-card').first()
    const rects = await first.locator('.reverse-step-fields :is(input, select)').evaluateAll((elements) =>
      elements.map((element) => {
        const rect = element.getBoundingClientRect()
        return { x: rect.x, right: rect.right, top: rect.top, height: rect.height }
      }),
    )
    expect(rects).toHaveLength(5)
    for (const rect of rects) {
      expect(rect.x).toBeGreaterThanOrEqual(0)
      expect(rect.right).toBeLessThanOrEqual(width + 1)
      expect(rect.height).toBeGreaterThanOrEqual(44)
    }
    const horizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
    expect(horizontalOverflow).toBeLessThanOrEqual(1)

    const details = first.locator('.reverse-step-extra')
    await expect(details).not.toHaveAttribute('open', '')
    await details.locator('summary').click()
    await expect(details.locator('input')).toBeVisible()
    await expect(first.locator('.reverse-drag-handle')).toBeVisible()
  })
}
