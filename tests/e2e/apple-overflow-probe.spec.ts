import { test } from '@playwright/test'

test('inspect overflowing elements in the visual redesign', async ({ page }) => {
  for (const route of ['/settings/document-design', '/tools/value-bridge']) {
    for (const width of [320, 375, 768]) {
      await page.setViewportSize({ width, height: 850 })
      await page.goto('/meddpicc-workbench/#' + route)
      if (route.includes('value-bridge')) {
        await page.getByRole('button', { name: 'CRM / Service' }).click()
      } else {
        await page.locator('.branding-panel').first().waitFor()
      }
      const result = await page.evaluate(() => {
        const limit = document.documentElement.clientWidth
        const elements = Array.from(document.querySelectorAll<HTMLElement>('body *'))
          .map((element) => {
            const rect = element.getBoundingClientRect()
            const styles = getComputedStyle(element)
            return {
              tag: element.tagName.toLowerCase(),
              class: String(element.className).slice(0, 90),
              text: (element.textContent ?? '').trim().slice(0, 54),
              left: Math.round(rect.left),
              right: Math.round(rect.right),
              width: Math.round(rect.width),
              minWidth: styles.minWidth,
              overflowX: styles.overflowX,
              whiteSpace: styles.whiteSpace,
            }
          })
          .filter((element) => element.right > limit + 1 && element.width > 0)
          .sort((a, b) => b.right - a.right)
        return {
          limit,
          scrollWidth: document.documentElement.scrollWidth,
          offenders: elements.slice(0, 16),
        }
      })
      console.log('APPLE_OVERFLOW_PROBE ' + JSON.stringify({ route, width, ...result }))
    }
  }
})
