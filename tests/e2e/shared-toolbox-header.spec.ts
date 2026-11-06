import { expect, test } from '@playwright/test'

const shared = [
  '/tools/reverse-timeline',
  '/tools/quick-payback',
  '/tools/metric-builder',
  '/tools/cost-of-delay',
  '/tools/value-bridge',
  '/checklists/metrics',
  '/knowledge/metrics',
  '/settings',
  '/settings/document-design',
] as const

for (const route of shared) {
  test('Gemeinsamer Toolbox-Header bleibt navigierbar: ' + route, async ({ page }) => {
    await page.goto('/meddpicc-workbench/#' + route)
    const header = page.getByTestId('toolbox-header')
    await expect(header).toBeVisible()
    await expect(header.getByRole('link', { name: 'MEDDPICC Toolbox Startseite' })).toBeVisible()
    await expect(header.locator('.toolbox-secondary-nav')).toHaveCount(1)

    const homeLink = header.getByRole('link', { name: 'MEDDPICC Toolbox Startseite' })
    await homeLink.click()
    await expect(page).toHaveURL(/\/#\/$/)
    await expect(page.getByRole('navigation', { name: 'Toolbox-Bereiche' })).toBeVisible()
  })
}

for (const route of ['/evidence', '/risks-actions', '/references']) {
  test('Legacy-Bereich bleibt erreichbar und gekennzeichnet: ' + route, async ({ page }) => {
    await page.goto('/meddpicc-workbench/#' + route)
    await expect(page.locator('main')).toBeVisible()
    await expect(page.getByRole('note')).toContainText('Legacy-Bereich')
    await page.getByRole('note').getByRole('link', { name: 'Zur Toolbox' }).click()
    await expect(page).toHaveURL(/\/#\/$/)
  })
}

test('Startseite priorisiert verfügbare Tools und klappt geplante ein', async ({ page }) => {
  await page.goto('/meddpicc-workbench/')
  await expect(page.getByRole('link', { name: /Go-Live-Rückwärtsplanung/ })).toBeVisible()
  const planned = page.locator('.tool-cluster-planned').first()
  await expect(planned).toBeVisible()
  await expect(planned).not.toHaveAttribute('open', '')
  await planned.locator('summary').click()
  await expect(planned).toHaveAttribute('open', '')
})

test('Recovery-Status bleibt trotz Shared Header im richtigen Teleport-Ziel', async ({ page }) => {
  await page.goto('/meddpicc-workbench/#/tools/reverse-timeline')
  await expect(page.locator('[data-testid="toolbox-header"] [data-testid="recovery-header-status"]')).toHaveCount(1)
})
