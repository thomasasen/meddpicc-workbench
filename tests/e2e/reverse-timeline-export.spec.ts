import { readFile } from 'node:fs/promises'

import { expect, test } from '@playwright/test'

test('exportiert die Go-Live-Timeline mit sauberem Layout und UI-Typografie', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name.includes('mobile'), 'Der Export ist viewport-unabhängig und wird einmal visuell geprüft.')

  await page.goto('/meddpicc-workbench/#/tools/reverse-timeline')

  await page.getByLabel('Planungsdatum').fill('2026-10-08')
  await page.getByLabel('Target Go-Live').fill('2026-12-31')
  await page.getByLabel('Titel').fill('Go-Live-Timeline')

  const svgDownloadPromise = page.waitForEvent('download')
  await page.getByRole('button', { name: 'SVG' }).click()
  const svgDownload = await svgDownloadPromise
  const svgPath = await svgDownload.path()

  expect(svgPath).not.toBeNull()
  if (!svgPath) return

  const svg = await readFile(svgPath, 'utf8')
  expect(svg).toContain('data-export-safe-right="120"')
  expect(svg).toContain("font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif")

  const pngDownloadPromise = page.waitForEvent('download')
  await page.getByRole('button', { name: 'PNG' }).click()
  const pngDownload = await pngDownloadPromise
  const pngPath = await pngDownload.path()

  expect(pngPath).not.toBeNull()
  if (!pngPath) return

  const png = await readFile(pngPath)
  expect(png[0]).toBe(0x89)
  expect(png.subarray(1, 4).toString('ascii')).toBe('PNG')
  expect(png.readUInt32BE(16)).toBe(1600)
  expect(png.readUInt32BE(20)).toBeGreaterThan(850)

  await page.setViewportSize({ width: 1600, height: 1000 })
  await page.setContent(`<!doctype html><html><body style="margin:0;background:#fff">${svg}</body></html>`)

  const root = page.locator('svg')
  await expect(root).toBeVisible()

  const fontFamily = await root.evaluate((element) => window.getComputedStyle(element).fontFamily)
  expect(fontFamily.toLowerCase()).toContain('sans-serif')
  expect(fontFamily.toLowerCase().startsWith('serif')).toBe(false)

  const geometry = await page.evaluate(() => {
    function box(selector: string) {
      const element = document.querySelector<SVGGraphicsElement>(selector)
      if (!element) throw new Error(`Export-Element fehlt: ${selector}`)
      const bounds = element.getBBox()
      return {
        x: bounds.x,
        y: bounds.y,
        width: bounds.width,
        height: bounds.height,
        right: bounds.x + bounds.width,
        bottom: bounds.y + bounds.height,
      }
    }

    const axisLabels = [...document.querySelectorAll<SVGGraphicsElement>('#export-axis text')].map((element) => {
      const bounds = element.getBBox()
      return {
        top: bounds.y,
        bottom: bounds.y + bounds.height,
      }
    })

    const handoffs = [...document.querySelectorAll<SVGCircleElement>('#export-rows circle')]
    const finalHandoff = handoffs.at(-1)
    if (!finalHandoff) throw new Error('Finaler Go-Live-Punkt fehlt.')

    const finalCx = Number(finalHandoff.getAttribute('cx') || '0')
    const finalRadius = Number(finalHandoff.getAttribute('r') || '0')

    return {
      summary: box('#export-summary rect'),
      legend: box('#export-legend'),
      firstBar: box('#export-row-0 rect'),
      axisLabelTop: Math.min(...axisLabels.map((label) => label.top)),
      axisLabelBottom: Math.max(...axisLabels.map((label) => label.bottom)),
      finalHandoffRight: finalCx + finalRadius,
    }
  })

  expect(geometry.legend.y - geometry.summary.bottom).toBeGreaterThan(20)
  expect(geometry.axisLabelTop - geometry.legend.bottom).toBeGreaterThan(8)
  expect(geometry.firstBar.y - geometry.axisLabelBottom).toBeGreaterThan(30)
  expect(1600 - geometry.finalHandoffRight).toBeGreaterThan(100)

  await page.screenshot({
    path: testInfo.outputPath('timeline-export-svg-desktop.png'),
    fullPage: true,
  })
})
