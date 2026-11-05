import { expect, test, type Page } from '@playwright/test'

/**
 * Projektweite Layout-QS: Vergleicht die gerenderten Control-Koordinaten, nicht
 * nur CSS-Tokens. Die Zeile wird über die Oberkante der Feldcontainer gebildet:
 * ein verschobenes Input darf sich so nicht selbst aus der Prüfung herausfiltern.
 */
const alignedGrids = [
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
  '.new-project-fields',
  '.branding-color-row',
].join(', ')

type ControlGeometry = {
  fieldTop: number
  x: number
  controlTop: number
  controlBottom: number
  controlHeight: number
  labelBottom: number | null
  hintTop: number | null
  kind: string
}

async function checkFormRows(page: Page, routeAndState: string): Promise<number> {
  const groups = await page.locator(alignedGrids).evaluateAll((parents) =>
    parents.flatMap((parent, groupIndex) => {
      if (!(parent instanceof HTMLElement) || parent.getClientRects().length === 0) return []

      const items = Array.from(parent.children).flatMap((element) => {
        if (!(element instanceof HTMLLabelElement) || element.getClientRects().length === 0) return []
        const control = element.querySelector<HTMLElement>(
          ':scope > input:not([type="checkbox"]):not([type="radio"]), :scope > select, :scope > textarea',
        )
        if (!control || control.getClientRects().length === 0) return []

        const field = element.getBoundingClientRect()
        const controlRect = control.getBoundingClientRect()
        const label = element.querySelector<HTMLElement>(':scope > span:first-child')
        const hint = element.querySelector<HTMLElement>(':scope > small')
        const result: ControlGeometry = {
          fieldTop: field.top,
          x: controlRect.left,
          controlTop: controlRect.top,
          controlBottom: controlRect.bottom,
          controlHeight: controlRect.height,
          labelBottom: label ? label.getBoundingClientRect().bottom : null,
          hintTop: hint ? hint.getBoundingClientRect().top : null,
          kind: control.tagName.toLowerCase(),
        }
        return [result]
      })

      return [{ groupIndex, className: parent.className, items }]
    }),
  )

  let compared = 0
  for (const group of groups) {
    for (const item of group.items) {
      if (item.kind !== 'textarea') {
        expect
          .soft(Math.abs(item.controlHeight - 46), `${routeAndState} / ${group.className}: Control-Höhe`)
          .toBeLessThanOrEqual(1)
      }
      if (item.labelBottom !== null) {
        expect
          .soft(item.labelBottom, `${routeAndState} / ${group.className}: Label muss oberhalb stehen`)
          .toBeLessThanOrEqual(item.controlTop + 1)
      }
      if (item.hintTop !== null) {
        expect
          .soft(item.hintTop, `${routeAndState} / ${group.className}: Hilfetext muss darunter stehen`)
          .toBeGreaterThanOrEqual(item.controlBottom - 1)
      }
    }

    for (let i = 0; i < group.items.length; i++) {
      for (let j = i + 1; j < group.items.length; j++) {
        const a = group.items[i]
        const b = group.items[j]
        if (Math.abs(a.fieldTop - b.fieldTop) > 2 || Math.abs(a.x - b.x) <= 2) continue
        compared++
        const context = `${routeAndState} / ${group.className} / Gruppe ${group.groupIndex} / ${i}:${j}`
        expect.soft(Math.abs(a.controlTop - b.controlTop), `${context}: Oberkanten`).toBeLessThanOrEqual(1)
        expect.soft(Math.abs(a.controlHeight - b.controlHeight), `${context}: gleiche Höhe`).toBeLessThanOrEqual(1)
      }
    }
  }

  return compared
}

async function auditRoute(page: Page, route: string, prepare?: (page: Page) => Promise<void>): Promise<number> {
  let totalCompared = 0
  for (const width of [320, 375, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 920 })
    await page.goto(`/meddpicc-workbench/#${route}`)
    await expect(page.locator('main').first()).toBeVisible()
    if (prepare) await prepare(page)
    totalCompared += await checkFormRows(page, `${route} / ${width}px`)
  }
  return totalCompared
}

test('Go-Live: Planungsrahmen und alle Prozessschritt-Felder', async ({ page }) => {
  const compared = await auditRoute(page, '/tools/reverse-timeline')
  expect(compared).toBeGreaterThan(15)
})

test('Software Payback: Kosten, Kennzahlen, Details und Bericht', async ({ page }) => {
  const compared = await auditRoute(page, '/tools/quick-payback', async (browser) => {
    await browser.getByRole('button', { name: /Softwareprojekt.*Kunden-Metrics/ }).click()
    await browser.getByRole('button', { name: 'CRM-/SaaS-Beispiel mit Kunden-Metrics' }).click()
    await browser.locator('.software-more > summary').evaluateAll((elements) =>
      elements.forEach((el) => {
        const details = el.closest('details')
        if (details) details.open = true
      }),
    )
  })
  expect(compared).toBeGreaterThan(10)
})

test('Metric Builder: alle drei Eingabeschritte einschließlich Hilfetexten', async ({ page }) => {
  let compared = 0
  for (const width of [375, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 920 })
    await page.goto('/meddpicc-workbench/#/tools/metric-builder')
    await page.getByRole('button', { name: 'CRM-Zeitgewinn' }).click()
    const steps = page.getByRole('navigation', { name: 'Metric entwickeln' }).getByRole('button')
    for (let step = 0; step < 3; step++) {
      await steps.nth(step).click()
      compared += await checkFormRows(page, `Metric Builder / Schritt ${step + 1} / ${width}px`)
    }
  }
  expect(compared).toBeGreaterThan(5)
})

test('Cost of Delay: alle Schritte und sichtbare Detailfelder', async ({ page }) => {
  let compared = 0
  for (const width of [375, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 920 })
    await page.goto('/meddpicc-workbench/#/tools/cost-of-delay')
    await page.getByRole('button', { name: 'CRM / Service' }).click()
    const steps = page.getByRole('navigation', { name: 'Cost of Delay berechnen' }).getByRole('button')
    for (let step = 0; step < 3; step++) {
      await steps.nth(step).click()
      await page.locator('details.cod-details > summary').evaluateAll((elements) => {
        elements.forEach((el) => {
          const details = el.closest('details')
          if (details) details.open = true
        })
      })
      compared += await checkFormRows(page, `Cost of Delay / Schritt ${step + 1} / ${width}px`)
    }
  }
  expect(compared).toBeGreaterThan(2)
})

test('Value Bridge: zwei-Spalten-Metrics und erweiterte Wirtschaftlichkeit', async ({ page }) => {
  let compared = 0
  for (const width of [375, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 920 })
    await page.goto('/meddpicc-workbench/#/tools/value-bridge')
    const steps = page.getByRole('navigation', { name: 'Value Bridge erstellen' }).getByRole('button')
    for (let step = 0; step < 3; step++) {
      await steps.nth(step).click()
      if (step === 2) {
        await page.getByRole('button', { name: /Weitere Metric/ }).click()
        await page.locator('.vb-details > summary').evaluateAll((elements) => {
          elements.forEach((el) => {
            const details = el.closest('details')
            if (details) details.open = true
          })
        })
      }
      compared += await checkFormRows(page, `Value Bridge / Schritt ${step + 1} / ${width}px`)
    }
  }
  expect(compared).toBeGreaterThan(2)
})

test('Dokumentgestaltung: Hex-Eingaben und native Farbauswahl', async ({ page }) => {
  const compared = await auditRoute(page, '/settings/document-design', async (browser) => {
    await expect(browser.locator('.branding-color-row')).toHaveCount(2)
  })
  expect(compared).toBeGreaterThan(2)
})

for (const route of ['/evidence', '/risks-actions', '/references']) {
  test(`Erreichbares internes Formular ${route}`, async ({ page }) => {
    const compared = await auditRoute(page, route)
    expect(compared).toBeGreaterThan(1)
  })
}

test('Quick Payback: einzelne Eingaben behalten Hilfetexte unterhalb der Controls', async ({ page }) => {
  await page.goto('/meddpicc-workbench/#/tools/quick-payback')
  const fields = page.locator('.quick-form > label.quick-field')
  await expect(fields).toHaveCount(3)
  for (const field of await fields.all()) {
    const positions = await field.evaluate((label) => {
      const input = label.querySelector('input')
      const small = label.querySelector('small')
      if (!input || !small) throw new Error('Eingabe oder Hilfe fehlt')
      return { controlBottom: input.getBoundingClientRect().bottom, helpTop: small.getBoundingClientRect().top }
    })
    expect(positions.helpTop).toBeGreaterThanOrEqual(positions.controlBottom - 1)
  }
})
