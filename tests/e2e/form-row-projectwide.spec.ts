import { expect, test, type Page } from '@playwright/test'

const routePrefix = '/meddpicc-workbench/#'
const groupSelector = [
  '.reverse-context-grid',
  '.reverse-step-fields',
  '.metric-fields',
  '.metric-timing',
  '.software-fields',
  '.software-report-story',
  '.vb-fields-two',
  '.cod-field-row',
  '.evidence-form',
  '.work-object-form',
  '.branding-color-row',
].join(', ')

type Scenario = {
  name: string
  route: string
  setup?: (page: Page) => Promise<void>
  pairedAtDesktop?: boolean
}

const scenarios: Scenario[] = [
  {
    name: 'Go-Live-Planungsrahmen und Prozessschritte',
    route: '/tools/reverse-timeline',
    pairedAtDesktop: true,
  },
  {
    name: 'Software-Payback: Kosten, Metrics und Bericht',
    route: '/tools/quick-payback',
    pairedAtDesktop: true,
    setup: async (page) => {
      await page.getByRole('button', { name: 'Softwareprojekt & Kunden-Metrics' }).click()
      await page.getByRole('button', { name: 'Einmalkosten' }).click()
      await page.getByRole('button', { name: 'SaaS / Betrieb', exact: true }).click()
      await page.getByRole('button', { name: 'Metric hinzufügen' }).click()
      const reportContext = page.locator('details.software-report-context')
      if (await reportContext.isVisible()) await reportContext.locator('summary').click()
    },
  },
  {
    name: 'Metric Builder: Discovery',
    route: '/tools/metric-builder',
    pairedAtDesktop: true,
  },
  {
    name: 'Metric Builder: Vorher/Nachher mit langem Label',
    route: '/tools/metric-builder',
    pairedAtDesktop: true,
    setup: async (page) => {
      await page
        .getByRole('navigation', { name: 'Metric entwickeln' })
        .getByRole('button', { name: '2 · Messung' })
        .click()
      await expect(page.getByRole('heading', { name: 'Wie lässt sich die Veränderung messen?' })).toBeVisible()
    },
  },
  {
    name: 'Metric Builder: Wirkung und Hilfetexte',
    route: '/tools/metric-builder',
    pairedAtDesktop: true,
    setup: async (page) => {
      await page
        .getByRole('navigation', { name: 'Metric entwickeln' })
        .getByRole('button', { name: '3 · Wirkung & Evidenz' })
        .click()
      await expect(page.getByRole('heading', { name: 'Was wird tatsächlich wirtschaftlich wirksam?' })).toBeVisible()
      await page.getByLabel('Wie kann der Nutzen finanziell realisiert werden?').selectOption('avoidable-cost')
      await expect(page.getByLabel('Tatsächlich realisierbarer Betrag in EUR pro Jahr')).toBeVisible()
    },
  },
  {
    name: 'Cost of Delay: Nutzenbeginn und Ramp-up',
    route: '/tools/cost-of-delay',
    pairedAtDesktop: true,
  },
  {
    name: 'Value Bridge: Metric-Eingaben',
    route: '/tools/value-bridge',
    pairedAtDesktop: true,
    setup: async (page) => {
      await page.getByRole('button', { name: '3 · Metrics & Wert' }).click()
    },
  },
  {
    name: 'Dokumentgestaltung: Hex-Feld und Farbwahl',
    route: '/settings/document-design',
    pairedAtDesktop: true,
  },
  {
    name: 'Evidenzregister (Legacy)',
    route: '/evidence',
    pairedAtDesktop: true,
  },
  {
    name: 'Risiken und nächste Schritte (Legacy)',
    route: '/risks-actions',
    pairedAtDesktop: true,
  },
  {
    name: 'Quellenverwaltung (Legacy)',
    route: '/references',
    pairedAtDesktop: true,
  },
]

async function auditVisibleRows(page: Page) {
  return page.evaluate((selector) => {
    const violations: string[] = []
    let checkedPairs = 0
    let checkedControls = 0

    for (const [groupIndex, group] of [...document.querySelectorAll<HTMLElement>(selector)].entries()) {
      if (group.getBoundingClientRect().width < 1) continue

      const fields = [...group.children]
        .filter((node): node is HTMLLabelElement => node instanceof HTMLLabelElement)
        .map((label) => {
          const control = label.querySelector<HTMLElement>(
            ':scope > input:not([type="checkbox"]):not([type="radio"]), :scope > select, :scope > textarea',
          )
          if (!control || control.getBoundingClientRect().width < 1) return null

          const labelText = label.querySelector<HTMLElement>(':scope > span')
          // Die Farbwahl-Beschriftung ist ein direkter Textknoten, kein span.
          const textNode = label.firstChild
          const textRange = !labelText && textNode?.nodeType === Node.TEXT_NODE ? document.createRange() : null
          if (textRange && textNode) textRange.selectNodeContents(textNode)
          const labelBottom = labelText?.getBoundingClientRect().bottom ?? textRange?.getBoundingClientRect().bottom
          // Bei ungültigen Eingaben ist der statische Hilfetext ausgeblendet; nur sichtbare Hinweise messen.
          const hintCandidates = label.querySelectorAll<HTMLElement>(
            ':scope > small, :scope > .field-help, :scope > [role="alert"]',
          )
          const hint = [...hintCandidates].find((element) => element.getClientRects().length > 0)
          return {
            label: label.innerText.replace(/\s+/g, ' ').slice(0, 60),
            controlType: control.tagName.toLowerCase(),
            field: label.getBoundingClientRect(),
            control: control.getBoundingClientRect(),
            labelBottom,
            hintTop: hint?.getBoundingClientRect().top,
          }
        })
        .filter((field): field is NonNullable<typeof field> => field !== null)

      if (group.matches('.branding-color-row')) {
        for (const label of group.querySelectorAll<HTMLLabelElement>(':scope > label')) {
          if (label.scrollWidth > label.clientWidth + 1) {
            violations.push(`Farbauswahl-Beschriftung ragt aus dem Feld (${label.scrollWidth}/${label.clientWidth}px)`)
          }
        }
      }

      for (const field of fields) {
        checkedControls++
        if (field.control.height < 44) {
          violations.push(`Gruppe ${groupIndex}: "${field.label}" ist nur ${field.control.height}px hoch`)
        }
        if (field.controlType !== 'textarea' && Math.abs(field.control.height - 46) > 1) {
          violations.push(
            `Gruppe ${groupIndex}: Einzeilen-Control "${field.label}" ist ${field.control.height}px statt 46px hoch`,
          )
        }
        if (field.labelBottom !== undefined && field.labelBottom > field.control.top + 1) {
          violations.push(`Gruppe ${groupIndex}: Label überschneidet Control "${field.label}"`)
        }
        if (field.hintTop !== undefined && field.hintTop < field.control.bottom - 1) {
          violations.push(`Gruppe ${groupIndex}: Hilfetext liegt nicht unter "${field.label}"`)
        }
      }

      for (let i = 0; i < fields.length; i++) {
        for (let j = i + 1; j < fields.length; j++) {
          const a = fields[i]
          const b = fields[j]
          const fieldsOverlapVertically = a.field.top < b.field.bottom && b.field.top < a.field.bottom
          const sameRow = Math.abs(a.field.top - b.field.top) < 36 && fieldsOverlapVertically
          const separateColumns = a.field.right <= b.field.left + 2 || b.field.right <= a.field.left + 2
          if (!sameRow || !separateColumns) continue

          checkedPairs++
          if (Math.abs(a.control.top - b.control.top) > 1) {
            violations.push(
              `Gruppe ${groupIndex}: vertikaler Versatz ${Math.abs(a.control.top - b.control.top).toFixed(1)}px: "${a.label}" / "${b.label}"`,
            )
          }
          if (Math.abs(a.control.height - b.control.height) > 1) {
            violations.push(
              `Gruppe ${groupIndex}: unterschiedliche Höhen ${a.control.height.toFixed(1)}/${b.control.height.toFixed(1)}px: "${a.label}" / "${b.label}"`,
            )
          }
        }
      }
    }

    return { checkedPairs, checkedControls, violations }
  }, groupSelector)
}

for (const scenario of scenarios) {
  test(`Formularraster projektweit: ${scenario.name}`, async ({ page }, testInfo) => {
    test.setTimeout(60_000)

    for (const [index, width] of [320, 375, 768, 800, 1024, 1440].entries()) {
      await page.setViewportSize({ width, height: 900 })
      // Hash-Routen-Wechsel können den Wizard-State behalten; reload initialisiert für jede Breite neu.
      if (index === 0) await page.goto(routePrefix + scenario.route)
      else await page.reload()
      await expect(page.locator('main').first()).toBeVisible()
      if (scenario.setup) await scenario.setup(page)
      if (scenario.route === '/settings/document-design') {
        await expect(page.locator('.branding-color-row').first()).toBeVisible()
      }

      const result = await auditVisibleRows(page)
      const horizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
      expect(horizontalOverflow, `${scenario.name} bei ${width}px: horizontaler Überlauf`).toBeLessThanOrEqual(1)
      expect(result.checkedControls, `${scenario.name} bei ${width}px: keine Eingabefelder geprüft`).toBeGreaterThan(0)
      expect(result.violations, `${scenario.name} bei ${width}px`).toEqual([])
      if (scenario.pairedAtDesktop && width === 1440) {
        expect(result.checkedPairs, `${scenario.name}: kein Feldpaar in einer Zeile geprüft`).toBeGreaterThan(0)
      }
      if (width === 320 || width === 1440) {
        const slug = scenario.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '')
        await page.screenshot({ path: testInfo.outputPath(`form-${slug}-${width}.png`), fullPage: true })
      }
    }
  })
}

test('Dynamische Änderungen verschieben die Formular-Controls nicht', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto(routePrefix + '/tools/metric-builder')
  await page.getByRole('button', { name: 'CRM-Zeitgewinn' }).click()
  const first = await auditVisibleRows(page)
  expect(first.checkedPairs).toBeGreaterThan(0)
  expect(first.violations).toEqual([])

  await page.getByRole('button', { name: 'Weiter', exact: false }).click()
  const second = await auditVisibleRows(page)
  expect(second.checkedPairs).toBeGreaterThan(0)
  expect(second.violations).toEqual([])
})
