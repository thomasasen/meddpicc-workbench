import { expect, test } from '@playwright/test'

const routes = [
  '/',
  '/tools/reverse-timeline',
  '/tools/metric-builder',
  '/tools/cost-of-delay',
  '/tools/value-bridge',
  '/checklists/metrics',
  '/knowledge/metrics',
  '/settings',
] as const

for (const route of routes) {
  test('Mobile Touchziele und Umbruch: ' + route, async ({ page }) => {
    for (const width of [320, 375]) {
      await page.setViewportSize({ width, height: 900 })
      await page.goto('/meddpicc-workbench/#' + route)
      await expect(page.locator('main')).toBeVisible()

      const results = await page.evaluate(() => {
        const buttons = document.querySelectorAll<HTMLButtonElement>('.site-shell button:not([disabled])')
        const smallButtons = Array.from(buttons)
          .map((button) => {
            const bounds = button.getBoundingClientRect()
            const styles = getComputedStyle(button)
            return {
              text: (button.textContent || button.getAttribute('aria-label') || '').trim().slice(0, 60),
              width: bounds.width,
              height: bounds.height,
              visibility: styles.visibility,
            }
          })
          .filter((button) => button.visibility === 'visible' && button.width > 0 && button.height > 0)
          .filter((button) => button.width < 43.5 || button.height < 43.5)
        return {
          smallButtons,
          scrollWidth: document.documentElement.scrollWidth,
          viewportWidth: window.innerWidth,
        }
      })

      expect(results.smallButtons, route + ' bei ' + width + ' px: zu kleine Buttons').toEqual([])
      const maxWidth = results.viewportWidth + 1
      expect(results.scrollWidth, route + ' bei ' + width + ' px').toBeLessThanOrEqual(maxWidth)
    }
  })
}

test('Nutz- und Hilfetexte auf der Startseite sind mindestens 14 CSS-px groß', async ({ page }) => {
  await page.goto('/meddpicc-workbench/')
  for (const selector of ['.tool-row small', '.checklist-preview-card p', '.knowledge-card small']) {
    const element = page.locator(selector).first()
    await expect(element).toBeVisible()
    const size = await element.evaluate((node) => Number.parseFloat(getComputedStyle(node).fontSize))
    expect(size, selector).toBeGreaterThanOrEqual(14)
  }
})
