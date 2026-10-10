import { expect, test } from '@playwright/test'

test('Alle neun Knowledge-Ansichten bieten echte Abschnittsnavigation mit Fokusführung', async ({ page }) => {
  for (const route of [
    'discovery-call',
    'decision-criteria',
    'decision-process',
    'pain-implication',
    'champion',
    'competition',
    'paper-process',
    'metrics',
    'economic-buyer',
  ]) {
    await page.goto('/#/knowledge/' + route)
    const nav = page.getByRole('navigation', { name: 'Themen auf dieser Seite' })
    await expect(nav).toBeVisible()
    const links = nav.getByRole('button')
    expect(await links.count()).toBeGreaterThanOrEqual(3)
    await links.last().click()
    const focusedHeading = page.locator('main h2:focus')
    await expect(focusedHeading).toBeVisible()
    await expect(focusedHeading).toHaveText(await links.last().innerText())
    await expect(page).toHaveURL(new RegExp('/#/knowledge/' + route + '$'))
  }
})
