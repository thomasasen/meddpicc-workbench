import { expect, test } from '@playwright/test'

const routes = [
  '/',
  '/tools/quick-payback',
  '/tools/metric-builder',
  '/tools/cost-of-delay',
  '/tools/value-bridge',
  '/tools/reverse-timeline',
  '/checklists/discovery-call',
  '/checklists/decision-criteria',
  '/checklists/decision-process',
  '/checklists/pain-implication',
  '/checklists/champion',
  '/checklists/competition',
  '/checklists/paper-process',
  '/checklists/metrics',
  '/checklists/economic-buyer',
  '/checklists/economic-buyer-meeting',
  '/knowledge/discovery-call',
  '/knowledge/decision-criteria',
  '/knowledge/decision-process',
  '/knowledge/pain-implication',
  '/knowledge/champion',
  '/knowledge/competition',
  '/knowledge/paper-process',
  '/knowledge/metrics',
  '/knowledge/economic-buyer',
] as const

for (const route of routes) {
  test('Viewport-Matrix: ' + route, async ({ page }, testInfo) => {
    test.setTimeout(120_000)
    const errors: string[] = []
    page.on('pageerror', (error) => errors.push(error.message))
    for (const width of [375, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 900 })
      await page.goto('/#' + route)
      await expect(page.locator('main').first()).toBeVisible()
      await expect(page.locator('h1').first()).toBeVisible()

      const overflow = await page.evaluate(() => ({
        width: window.innerWidth,
        document: document.documentElement.scrollWidth,
      }))
      expect(overflow.document, route + ' bei ' + width + 'px').toBeLessThanOrEqual(overflow.width + 1)
      if (width === 375 || width === 1440) {
        const name = route.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '') || 'start'
        await page.screenshot({
          path: testInfo.outputPath(name + '-' + width + '-' + testInfo.project.name + '.png'),
          fullPage: true,
        })
      }
    }
    expect(errors).toEqual([])
  })
}
