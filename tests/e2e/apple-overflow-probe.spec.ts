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
              class: String(element.className).slice(0, 80),
              text: (element.textContent ?? '').trim().slice(0, 38),
              left: Math.round(rect.left),
              right: Math.round(rect.right),
              width: Math.round(rect.width),
              scrollWidth: element.scrollWidth,
              clientWidth: element.clientWidth,
              minWidth: styles.minWidth,
              overflowX: styles.overflowX,
              whiteSpace: styles.whiteSpace,
            }
          })
        const oversized = elements
          .filter((el) => el.scrollWidth > el.clientWidth + 2 && el.clientWidth > 0)
          .sort((a, b) => b.scrollWidth - b.clientWidth - (a.scrollWidth - a.clientWidth))
        const toRight = elements
          .filter((el) => el.right > limit + 1 && el.width > 0)
          .sort((a, b) => b.right - a.right)
        return {
          limit,
          scrollWidth: document.documentElement.scrollWidth,
          bodyScrollWidth: document.body.scrollWidth,
          mainScrollWidth: document.querySelector('main')?.scrollWidth,
          headerScrollWidth: document.querySelector('.site-header')?.scrollWidth,
          offenders: toRight.slice(0, 12),
          oversized: oversized.slice(0, 22),
        }
      })
      console.log('APPLE_OVERFLOW_PROBE ' + JSON.stringify({ route, width, ...result }))
    }
  }
})
