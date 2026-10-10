import { expect, test } from '@playwright/test'

test('Checklists: lokale Filter trennen markierte und offene Punkte ohne Deal-Scoring', async ({ page }) => {
  await page.goto('/#/checklists/metrics')
  const items = page.locator('.checklist-item')
  const total = await items.count()
  expect(total).toBeGreaterThan(0)

  await page.getByRole('button', { name: 'Markiert', exact: true }).click()
  await expect(page.getByText('Noch keine Punkte markiert.')).toBeVisible()

  await page.getByRole('button', { name: 'Alle anzeigen' }).click()
  await items.first().locator('input[type=checkbox]').check()
  await page.getByRole('button', { name: 'Markiert', exact: true }).click()
  await expect(items).toHaveCount(1)
  await expect(page.getByText('1 von ' + total + ' Punkten als Gedankenstütze markiert')).toBeVisible()

  await page.getByRole('button', { name: 'Noch offen' }).click()
  await expect(items).toHaveCount(total - 1)
  await page.reload()
  await expect(page.getByText('0 von ' + total + ' Punkten als Gedankenstütze markiert')).toBeVisible()
  await expect(items).toHaveCount(total)
})

test('Ein fokussiertes Select ändert seinen Wert nicht durch Scrollen', async ({ page }) => {
  await page.goto('/#/tools/value-bridge')
  const select = page.getByRole('combobox', { name: 'Ergebnisansicht' })
  await expect(select).toHaveValue('false')
  await select.focus()
  await select.scrollIntoViewIfNeeded()
  const bounds = await select.boundingBox()
  expect(bounds).not.toBeNull()
  if (bounds) {
    await page.mouse.move(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2)
    await page.mouse.wheel(0, 310)
  }
  await expect(select).toHaveValue('false')
  await expect(select).not.toBeFocused()
})

test('Quick Payback: jährliche Nutzen-Kosten-Grafik bleibt textuell verständlich', async ({ page }) => {
  await page.goto('/#/tools/quick-payback')
  await page.getByRole('button', { name: 'Fiktives Beispiel einsetzen' }).click()
  const chart = page.getByRole('figure', {
    name: 'Vergleich jährlicher Nutzen und zusätzlicher Betriebskosten',
  })
  await expect(chart).toBeVisible()
  await expect(chart.getByText('Angesetzter realisierbarer Bruttonutzen')).toBeVisible()
  await expect(chart.getByText('Zusätzliche laufende Betriebskosten')).toBeVisible()
  await expect(chart.getByText('Die Darstellung zeigt keine realisierten Einsparungen.', { exact: false })).toBeVisible()
})
