import { expect, test } from '@playwright/test'

const route = '/meddpicc-workbench/#/tools/reverse-timeline'

test('Recovery-Karte besitzt Innenabstände und kompakte Datenschutzhinweise', async ({ page }) => {
  for (const width of [320, 375, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 })
    await page.goto(route)

    const panel = page.locator('.recovery-panel')
    await expect(panel.getByRole('heading', { name: 'Optionales lokales Recovery' })).toBeVisible()
    await expect(panel.locator('details')).not.toHaveAttribute('open', '')

    const metrics = await panel.evaluate((element) => {
      const panelRect = element.getBoundingClientRect()
      const headingRect = element.querySelector('h2')?.getBoundingClientRect()
      const actionsRect = element.querySelector('.recovery-actions')?.getBoundingClientRect()
      if (!headingRect || !actionsRect) throw new Error('Recovery-Inhalt fehlt')
      return {
        panelLeft: panelRect.left,
        panelRight: panelRect.right,
        headingLeft: headingRect.left,
        headingTop: headingRect.top,
        panelTop: panelRect.top,
        actionsRight: actionsRect.right,
      }
    })

    expect(metrics.headingLeft - metrics.panelLeft).toBeGreaterThanOrEqual(12)
    expect(metrics.headingTop - metrics.panelTop).toBeGreaterThanOrEqual(12)
    expect(metrics.actionsRight).toBeLessThanOrEqual(metrics.panelRight - 12)
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)
    expect(overflow).toBeLessThanOrEqual(1)
  }
})

test('Recovery-Stand zeigt Warnung und Aktionen, lange Hinweise bleiben einklappbar', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto(route)
  await page.getByRole('button', { name: 'Lokales Recovery aktivieren' }).click()
  await page.getByPlaceholder('z. B. Beispielwerke GmbH').fill('Testkunde')
  // Die Sicherung erfolgt asynchron; Reload erst nach bestätigtem Snapshot.
  await expect(page.getByText('Nur lokal zwischengesichert.', { exact: false })).toBeVisible()
  await page.reload()

  const panel = page.locator('.recovery-panel')
  await expect(panel.getByText('Lokaler Arbeitsstand vom', { exact: false })).toBeVisible()
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
