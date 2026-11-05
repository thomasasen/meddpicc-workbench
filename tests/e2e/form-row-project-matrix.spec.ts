import { expect, test, type Page } from '@playwright/test'

const fieldGroups = [
  '.reverse-context-grid',
  '.reverse-step-fields',
  '.metric-fields',
  '.metric-timing',
  '.software-fields',
  '.vb-fields-two',
  '.cod-field-row',
  '.evidence-form',
  '.work-object-form',
  '.project-meta-grid',
] as const

/** Compare actual input rectangles within each rendered row; CSS properties alone prove nothing. */
async function verifyVisibleFieldRows(page: Page, screen: string) {
  const result = await page.evaluate((selectors) => {
    let checkedFields = 0
    let comparedPairs = 0
    const violations: string[] = []
    for (const selector of selectors) {
      const groups = document.querySelectorAll<HTMLElement>(selector)
      groups.forEach((group, groupIndex) => {
        const entries = Array.from(group.children)
          .filter((node): node is HTMLElement => node instanceof HTMLElement)
          .filter((node) => node.matches('label.field, label.vb-field, label.cod-field'))
          .map((field) => {
            const control = field.querySelector<HTMLElement>(':scope > input, :scope > select, :scope > textarea')
            const label = field.querySelector<HTMLElement>(':scope > span:first-child')
            if (!control || !label || control.offsetParent === null) return null
            const a = field.getBoundingClientRect()
            const c = control.getBoundingClientRect()
            const l = label.getBoundingClientRect()
            const help = field.querySelector<HTMLElement>(':scope > small')
            return {
              fieldX: a.left,
              fieldY: a.top,
              fieldWidth: a.width,
              x: c.left,
              y: c.top,
              height: c.height,
              bottom: c.bottom,
              labelBottom: l.bottom,
              helpTop: help?.getBoundingClientRect().top ?? null,
              name: label.textContent?.trim() ?? '',
            }
          })
          .filter((entry): entry is NonNullable<typeof entry> => entry !== null)

        checkedFields += entries.length
        for (const [i, field] of entries.entries()) {
          if (field.labelBottom > field.y + 1) {
            violations.push(`${selector}[${groupIndex}] ${field.name}: Label überlappt Control`)
          }
          if (field.helpTop !== null && field.helpTop < field.bottom - 1) {
            violations.push(`${selector}[${groupIndex}] ${field.name}: Hilfetext überlappt Control`)
          }
          for (const neighbor of entries.slice(i + 1)) {
            // Same grid row means same field top and distinct horizontal space.
            if (Math.abs(field.fieldY - neighbor.fieldY) > 2) continue
            if (Math.abs(field.fieldX - neighbor.fieldX) < 4) continue
            if (field.fieldWidth > group.getBoundingClientRect().width * 0.85) continue
            if (neighbor.fieldWidth > group.getBoundingClientRect().width * 0.85) continue
            comparedPairs++
            if (Math.abs(field.y - neighbor.y) > 1 || Math.abs(field.height - neighbor.height) > 1) {
              violations.push(
                `${selector}[${groupIndex}] ${field.name} / ${neighbor.name}: top ${field.y.toFixed(1)} / ${neighbor.y.toFixed(1)}, height ${field.height.toFixed(1)} / ${neighbor.height.toFixed(1)}`,
              )
            }
          }
        }
      })
    }
    return { checkedFields, comparedPairs, violations }
  }, fieldGroups)

  expect(result.violations, `${screen}: ${result.checkedFields} Felder, ${result.comparedPairs} Zeilenpaare`).toEqual([])
  return result
}

test('Alle produktiven Formularraster über 375–1440 px und mehrere Wizard-Schritte', async ({ page }) => {
  test.setTimeout(120_000)
  let checkedPairs = 0
  const routes = [
    '/tools/reverse-timeline',
    '/tools/metric-builder',
    '/tools/cost-of-delay',
    '/tools/value-bridge',
    '/tools/quick-payback',
  ]
  for (const width of [375, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 920 })
    for (const route of routes) {
      await page.goto('/meddpicc-workbench/#' + route)
      await expect(page.locator('main').first()).toBeVisible()

      if (route === '/tools/quick-payback') {
        await page.getByRole('button', { name: /Softwareprojekt & Kunden-Metrics/ }).click()
      }
      checkedPairs += (await verifyVisibleFieldRows(page, `${route} @ ${width}px`)).comparedPairs

      if (['/tools/metric-builder', '/tools/cost-of-delay', '/tools/value-bridge'].includes(route)) {
        for (let step = 2; step <= 3; step++) {
          const forward = page.getByRole('button', { name: 'Weiter' }).last()
          if (!(await forward.isVisible())) break
          await forward.click()
          checkedPairs += (await verifyVisibleFieldRows(page, `${route} Schritt ${step} @ ${width}px`)).comparedPairs
        }
      }
    }
  }
  expect(checkedPairs, 'Mindestens ein tatsächliches nebeneinanderliegendes Eingabepaar geprüft').toBeGreaterThan(15)
})

test('Farbauswahl in der Dokumentgestaltung nutzt gleiche Control-Oberkante und Höhe', async ({ page }) => {
  for (const width of [375, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/meddpicc-workbench/#/settings/document-design')
    await expect(page.getByRole('heading', { name: 'Gestaltung' })).toBeVisible()
    const rows = await page.locator('.branding-color-row').evaluateAll((groups) =>
      groups.map((group) =>
        Array.from(group.querySelectorAll(':scope > label > input')).map((control) => {
          const rect = control.getBoundingClientRect()
          return { y: rect.y, height: rect.height }
        }),
      ),
    )
    expect(rows.length).toBeGreaterThanOrEqual(2)
    for (const inputs of rows) {
      expect(inputs.length).toBe(2)
      expect(Math.abs(inputs[0].y - inputs[1].y), `Farbauswahl bei ${width}px`).toBeLessThanOrEqual(1)
      expect(Math.abs(inputs[0].height - inputs[1].height)).toBeLessThanOrEqual(1)
    }
  }
})

test('Erreichbare interne Formulare zeigen keine verschobenen Eingabereihen', async ({ page }) => {
  for (const route of ['/evidence', '/risks-actions', '/references']) {
    for (const width of [375, 1024]) {
      await page.setViewportSize({ width, height: 900 })
      await page.goto('/meddpicc-workbench/#' + route)
      await expect(page.locator('main').first()).toBeVisible()
      await verifyVisibleFieldRows(page, `${route} @ ${width}px`)
    }
  }
})
