import { expect, test } from '@playwright/test'

const route = '/meddpicc-workbench/#/tools/reverse-timeline'

test('Recovery-Karte besitzt Innenabstände und kompakte Datenschutzhinweise', async ({ page }) => {
  for (const width of [320, 375, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 })
    await page.goto(route)
    // Bei gleicher Route bleibt der lokale Disclosure-Zustand sonst vom vorigen Durchlauf bestehen.
    await page.reload()

    const panel = page.locator('.recovery-panel')
    const toggle = panel.getByTestId('recovery-toggle')
    await expect(panel.getByRole('heading', { name: 'Optionales lokales Recovery' })).toBeVisible()
    await expect(toggle).toHaveAttribute('aria-expanded', 'false')
    await expect(panel.locator('.recovery-actions button').first()).toBeHidden()
    const collapsedHeight = await panel.evaluate((element) => element.getBoundingClientRect().height)
    expect(collapsedHeight).toBeLessThanOrEqual(width <= 375 ? 94 : 80)
    await toggle.click()
    await expect(toggle).toHaveAttribute('aria-expanded', 'true')
    await expect(panel.locator('details')).not.toHaveAttribute('open', '')

    const metrics = await panel.evaluate((element) => {
      const panelRect = element.getBoundingClientRect()
      const titleRect = element.querySelector('.recovery-toggle-title')?.getBoundingClientRect()
      const actionsRect = element.querySelector('.recovery-actions')?.getBoundingClientRect()
      if (!titleRect || !actionsRect) throw new Error('Recovery-Inhalt fehlt')
      return {
        panelLeft: panelRect.left,
        panelRight: panelRect.right,
        headingLeft: titleRect.left,
        headingTop: titleRect.top,
        panelTop: panelRect.top,
        actionsRight: actionsRect.right,
      }
    })

    expect(metrics.headingLeft - metrics.panelLeft).toBeGreaterThanOrEqual(12)
    expect(metrics.headingTop - metrics.panelTop).toBeGreaterThanOrEqual(10)
    expect(metrics.actionsRight).toBeLessThanOrEqual(metrics.panelRight - 12)
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)
    expect(overflow).toBeLessThanOrEqual(1)
  }
})

test('Recovery-Stand zeigt Warnung und Aktionen, lange Hinweise bleiben einklappbar', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto(route)
  await page.getByTestId('recovery-toggle').click()
  await page.getByRole('button', { name: 'Lokales Recovery aktivieren' }).click()
  await page.getByPlaceholder('z. B. Beispielwerke GmbH').fill('Testkunde')
  // Die Sicherung erfolgt asynchron; Reload erst nach bestätigtem Snapshot.
  await expect(page.getByText('Nur lokal zwischengesichert.', { exact: false })).toBeVisible()
  await page.reload()

  const panel = page.locator('.recovery-panel')
  const toggle = panel.getByTestId('recovery-toggle')
  await expect(toggle).toHaveAttribute('aria-expanded', 'false')
  await expect(panel.getByText('Lokaler Arbeitsstand vom', { exact: false })).toBeVisible()
  await expect(panel.locator('.recovery-actions button').first()).toBeHidden()
  const heading = panel.locator('h2')
  await expect(heading).toHaveCSS('outline-style', 'none')
  await toggle.focus()
  await page.keyboard.press('Enter')
  await expect(toggle).toHaveAttribute('aria-expanded', 'true')
  await expect(panel.getByText(/Wiederherstellen ersetzt die aktuell sichtbaren Eingaben/)).toBeVisible()
  await expect(panel.getByRole('button', { name: 'Wiederherstellen' })).toBeVisible()
  await expect(panel.getByRole('button', { name: 'Verwerfen und löschen' })).toBeVisible()

  const details = panel.locator('details')
  await expect(details).not.toHaveAttribute('open', '')
  await details.locator('summary').click()
  await expect(details).toHaveAttribute('open', '')
  await expect(details.getByText(/Die lokale Sicherung beginnt erst/)).toBeVisible()
  await details.locator('summary').click()
  await expect(details).not.toHaveAttribute('open', '')
  await panel.getByRole('button', { name: 'Wiederherstellen' }).click()
  await expect(page.getByPlaceholder('z. B. Beispielwerke GmbH')).toHaveValue('Testkunde')
})

test('Recovery kann ohne Datenverlust wieder eingeklappt werden', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 820 })
  await page.goto(route)
  const toggle = page.getByTestId('recovery-toggle')
  await expect(toggle).toHaveAttribute('aria-expanded', 'false')
  await toggle.click()
  await page.getByRole('button', { name: 'Lokales Recovery aktivieren' }).click()
  await expect(page.getByText('Nur lokal zwischengesichert.', { exact: false })).toBeVisible()
  await toggle.click()
  await expect(toggle).toHaveAttribute('aria-expanded', 'false')
  await expect(page.getByTestId('recovery-header-status')).toHaveAttribute('data-state', 'saved')
  await expect(page.locator('.recovery-actions button').first()).toBeHidden()
  await toggle.click()
  await expect(page.getByRole('button', { name: 'Recoverydaten löschen und deaktivieren' })).toBeVisible()
})
