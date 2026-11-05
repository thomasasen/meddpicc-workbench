import { expect, test, type Page } from '@playwright/test'

const containers = [
  '.reverse-context-grid',
  '.reverse-step-fields',
  '.metric-fields',
  '.metric-timing',
  '.software-fields',
  '.software-report-story',
  '.cod-field-row',
  '.vb-fields-two',
  '.evidence-form',
  '.work-object-form',
  '.branding-color-row',
].join(', ')

async function inspectRows(page: Page) {
  return page.locator(containers).evaluateAll((grids) => {
    const problems: string[] = []
    let groups = 0
    for (const grid of grids) {
      if (!grid.getClientRects().length) continue
      const fields = Array.from(grid.children).flatMap((child) => {
        if (!(child instanceof HTMLLabelElement) || !child.getClientRects().length) return []
        const control = Array.from(child.children).find(
          (node) =>
            node instanceof HTMLInputElement ||
            node instanceof HTMLSelectElement ||
            node instanceof HTMLTextAreaElement,
        )
        if (!(control instanceof HTMLElement) || !control.getClientRects().length) return []
        if (control instanceof HTMLInputElement && ['checkbox', 'radio', 'file'].includes(control.type)) return []
        const rect = control.getBoundingClientRect()
        const note = Array.from(child.children).find((node) => node instanceof HTMLElement && node.tagName === 'SMALL')
        const noteTop = note instanceof HTMLElement ? note.getBoundingClientRect().top : null
        const name = (child.textContent ?? '').trim().slice(0, 32)
        const single = !(control instanceof HTMLTextAreaElement)
        if (single && Math.abs(rect.height - 46) > 1) problems.push(`${grid.className}: ${name} Höhe ${rect.height}`)
        if (noteTop !== null && noteTop < rect.bottom - 1) problems.push(`${grid.className}: Hinweis überlappt ${name}`)
        return [{ name, top: child.getBoundingClientRect().top, y: rect.top, height: rect.height, single }]
      })
      const rows: (typeof fields)[] = []
      for (const field of fields) {
        const row = rows.find((items) => Math.abs(items[0].top - field.top) <= 1)
        if (row) row.push(field)
        else rows.push([field])
      }
      for (const row of rows.filter((items) => items.length > 1)) {
        groups++
        if (Math.max(...row.map((v) => v.y)) - Math.min(...row.map((v) => v.y)) > 1)
          problems.push(`${grid.className}: versetzte Eingaben ${row.map((v) => v.name).join(' / ')}`)
        const singles = row.filter((v) => v.single)
        if (
          singles.length > 1 &&
          Math.max(...singles.map((v) => v.height)) - Math.min(...singles.map((v) => v.height)) > 1
        )
          problems.push(`${grid.className}: verschiedene Höhen ${singles.map((v) => v.name).join(' / ')}`)
      }
    }
    return { groups, problems }
  })
}

test('Formular-Matrix: alle Bereiche bei vier Viewportbreiten', async ({ page }) => {
  test.setTimeout(180_000)
  let checkedGroups = 0
  for (const width of [375, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 })
    for (const route of [
      '/tools/reverse-timeline',
      '/tools/metric-builder',
      '/tools/cost-of-delay',
      '/tools/value-bridge',
      '/settings/document-design',
      '/evidence',
      '/risks-actions',
      '/references',
    ]) {
      await page.goto('/meddpicc-workbench/#' + route)
      await expect(page.locator('main').first()).toBeVisible()
      const result = await inspectRows(page)
      expect(result.problems, `${route} bei ${width}px`).toEqual([])
      checkedGroups += result.groups
    }
  }
  expect(checkedGroups).toBeGreaterThan(8)
})

test('dynamische Formulare bleiben nach Zustandswechsel ausgerichtet', async ({ page }) => {
  test.setTimeout(150_000)
  for (const width of [375, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/meddpicc-workbench/#/tools/quick-payback')
    await page.getByRole('button', { name: /Softwareprojekt & Kunden-Metrics/ }).click()
    await page.getByRole('button', { name: 'CRM-/SaaS-Beispiel mit Kunden-Metrics' }).click()
    const software = await inspectRows(page)
    expect(software.problems, `Softwareprojekt bei ${width}px`).toEqual([])
    if (width >= 768) {
      expect(software.groups, `Softwareprojekt bei ${width}px`).toBeGreaterThan(0)
    } else {
      await expect(page.locator('.software-fields .field').first()).toBeVisible()
    }

    await page.goto('/meddpicc-workbench/#/tools/metric-builder')
    await page.getByRole('button', { name: 'CRM-Zeitgewinn' }).click()
    await page.getByRole('button', { name: /Weiter/ }).click()
    expect((await inspectRows(page)).problems, 'Metric Builder 2').toEqual([])
    await page.getByRole('button', { name: /Weiter/ }).click()
    expect((await inspectRows(page)).problems, 'Metric Builder 3').toEqual([])

    await page.goto('/meddpicc-workbench/#/tools/value-bridge')
    await page.locator('.vb-steps button').nth(1).click()
    expect((await inspectRows(page)).problems, 'Value Bridge 2').toEqual([])
    await page.locator('.vb-steps button').nth(2).click()
    expect((await inspectRows(page)).problems, 'Value Bridge 3').toEqual([])

    await page.goto('/meddpicc-workbench/#/tools/cost-of-delay')
    await page.getByRole('button', { name: /Weiter/ }).click()
    expect((await inspectRows(page)).problems, 'Cost of Delay 2').toEqual([])
  }
})
