import { expect, test } from '@playwright/test'

const routes = [
  '/tools/reverse-timeline',
  '/tools/metric-builder',
  '/tools/cost-of-delay',
  '/tools/value-bridge',
] as const

for (const route of routes) {
  test('Recovery bleibt vor Aktivierung kompakt und informiert: ' + route, async ({ page }, testInfo) => {
    for (const width of [320, 375]) {
      await page.setViewportSize({ width, height: 900 })
      await page.goto('/meddpicc-workbench/#' + route)
      const panel = page.locator('.recovery-panel')
      await expect(panel).toHaveClass(/recovery-panel--compact/)
      await expect(panel).toContainText('unverschlüsselt')
      await expect(panel).toContainText('Keine Cloud')
      await expect(panel.getByText('Datenschutz- und Speicherhinweise')).toBeVisible()
      await expect(page.getByRole('button', { name: 'Lokales Recovery aktivieren' })).toBeVisible()

      await panel.locator('summary').click()
      await expect(panel).toContainText('Die lokale Sicherung beginnt erst nach ausdrücklicher Aktivierung')
      await expect(panel).toContainText('sieben Tagen')

      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
      expect(overflow, route + ' bei ' + width + ' px').toBeLessThanOrEqual(1)
      await page.screenshot({
        path: testInfo.outputPath(route.slice(1).replaceAll('/', '-') + '-recovery-' + width + '.png'),
      })
    }
  })
}

test('Recovery-Header liest nicht jeden technischen Zwischenzustand vor', async ({ page }) => {
  await page.goto('/meddpicc-workbench/#/tools/reverse-timeline')
  const header = page.getByTestId('recovery-header-status')
  const announcement = page.getByTestId('recovery-announcement')
  await expect(header).not.toHaveAttribute('aria-live', /.+/)
  await expect(announcement).toHaveAttribute('role', 'status')
  await expect(announcement).toHaveAttribute('aria-live', 'polite')

  await page.getByPlaceholder('z. B. Beispielwerke GmbH').fill('Recovery Live-Region Test')
  await expect(header).toHaveAttribute('data-state', 'unsaved')
  await expect(announcement).toBeEmpty()

  await page.getByRole('button', { name: 'Lokales Recovery aktivieren' }).click()
  await expect(header).toHaveAttribute('data-state', 'saved')
  await expect(announcement).toContainText('lokal im Browser gesichert')
})
