import { expect, test } from '@playwright/test'

const routes = [
  '/',
  '/settings',
  '/settings/document-design',
  '/tools/value-bridge',
  '/tools/cost-of-delay',
  '/tools/metric-builder',
  '/tools/quick-payback',
  '/tools/reverse-timeline',
  '/knowledge/discovery-call',
  '/checklists/discovery-call',
  '/knowledge/decision-criteria',
  '/checklists/decision-criteria',
  '/knowledge/decision-process',
  '/checklists/decision-process',
  '/knowledge/pain-implication',
  '/checklists/pain-implication',
  '/knowledge/champion',
  '/checklists/champion',
  '/knowledge/competition',
  '/checklists/competition',
  '/knowledge/paper-process',
  '/checklists/paper-process',
  '/knowledge/metrics',
  '/checklists/metrics',
  '/knowledge/economic-buyer',
  '/checklists/economic-buyer',
  '/checklists/economic-buyer-meeting',
  '/evidence',
  '/risks-actions',
  '/references',
] as const

for (const route of routes) {
  test('Skip-Link erhält Fokus und Hash-Route: ' + route, async ({ page }) => {
    await page.goto('/meddpicc-workbench/#' + route)
    const main = page.locator('main#main-content')
    const skipLink = page.getByRole('link', { name: 'Zum Inhalt springen' })
    await expect(main).toBeVisible()
    await expect(skipLink).toHaveAttribute('href', '#main-content')

    const initialUrl = page.url()
    const initialHistoryLength = await page.evaluate(() => window.history.length)
    await skipLink.focus()
    await expect(skipLink).toBeFocused()
    await page.keyboard.press('Enter')

    await expect(main).toBeFocused()
    expect(page.url(), 'Hash-Route nach Skip-Link-Aktivierung').toBe(initialUrl)
    expect(await page.evaluate(() => window.history.length), 'History ohne neuen Eintrag').toBe(initialHistoryLength)
  })
}

for (const width of [320, 375, 1440]) {
  test('Skip-Link-Fokus: Referenzscreenshots bei ' + width + ' px', async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/meddpicc-workbench/#/tools/metric-builder')
    const skipLink = page.getByRole('link', { name: 'Zum Inhalt springen' })
    await skipLink.focus()
    await page.screenshot({
      path: testInfo.outputPath('skip-link-fokussiert-' + width + '.png'),
    })
    await page.keyboard.press('Enter')
    await expect(page.locator('main#main-content')).toBeFocused()
    await page.screenshot({
      path: testInfo.outputPath('hauptinhalt-fokussiert-' + width + '.png'),
    })
  })
}
