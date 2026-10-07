import { expect, test } from '@playwright/test'

test('zeigt eine dynamische kundenfähige Executive-Timeline', async ({ page }, testInfo) => {
  const runtimeErrors: string[] = []
  page.on('pageerror', (error) => runtimeErrors.push(error.message))

  await page.goto('/meddpicc-workbench/#/tools/reverse-timeline')

  await page.getByLabel('Kunde optional').fill('Beispielwerke GmbH')
  await page.getByLabel('Titel').fill('Gemeinsamer Go-Live-Plan')
  await page.getByLabel('Planungsdatum').fill('2027-01-04')
  await page.getByLabel('Target Go-Live').fill('2027-07-01')

  const chart = page.getByTestId('executive-timeline-chart')
  await expect(chart).toBeVisible()
  await expect(page.getByText('Gemeinsamer Go-Live-Plan', { exact: true }).last()).toBeVisible()
  await expect(page.getByText('Beispielwerke GmbH', { exact: true })).toBeVisible()
  await expect(page.locator('.executive-go-live').getByText('Target Go-Live', { exact: true })).toBeVisible()
  await expect(page.getByText('Prozessdauer', { exact: true })).toBeVisible()
  await expect(page.getByText('Puffer zum notwendigen Start', { exact: true })).toBeVisible()
  await expect(page.getByText('Zeitproportionaler Prozessplan', { exact: true })).toBeVisible()

  const rows = chart.locator('.executive-chart-row')
  await expect(rows).toHaveCount(5)
  await expect(rows.nth(0).locator('.executive-row-label strong')).toHaveText('Finale Entscheidung')
  await expect(rows.nth(4).locator('.executive-row-label strong')).toHaveText('Implementierung / Rollout')
  await expect(chart.locator('.executive-milestone')).toHaveCount(5)
  await expect(chart.locator('.executive-milestone--go-live')).toHaveCount(1)

  const monthTicks = chart.locator('.executive-axis-tick--period')
  await expect(monthTicks.first()).toBeVisible()
  await expect(monthTicks.first()).not.toContainText('KW ')

  const details = page.locator('.timeline-details')
  await expect(details).not.toHaveAttribute('open', '')
  await expect(details.getByText('Finale Entscheidung', { exact: true })).not.toBeVisible()
  await details.locator('summary').click()
  await expect(details).toHaveAttribute('open', '')
  await expect(details.getByText('Finale Entscheidung', { exact: true })).toBeVisible()

  const implementationBar = chart.locator('[data-segment-id="implementation"] .executive-segment')
  const beforeStyle = await implementationBar.getAttribute('style')
  expect(beforeStyle).toContain('--segment-width')

  await page.locator('.reverse-step-card').first().getByLabel('Dauer').fill('30')

  await expect.poll(async () => implementationBar.getAttribute('style')).not.toBe(beforeStyle)

  await expect(page.getByText(/sollte der erste Prozessschritt spätestens am/)).toBeVisible()
  await expect(page.getByText('Decision Process', { exact: true }).last()).toBeVisible()
  await expect(page.getByText('Paper Process', { exact: true }).last()).toBeVisible()
  await expect(page.getByText('Implementierung', { exact: true }).last()).toBeVisible()

  if (testInfo.project.name.includes('mobile')) {
    const scrollMetrics = await page.locator('.executive-timeline-scroll').evaluate((element) => ({
      clientWidth: element.clientWidth,
      scrollWidth: element.scrollWidth,
    }))
    expect(scrollMetrics.scrollWidth).toBeGreaterThan(scrollMetrics.clientWidth)
    await expect(page.locator('.executive-scroll-hint')).toBeVisible()

    const stickyLabelPosition = await rows
      .nth(0)
      .locator('.executive-row-label')
      .evaluate((element) => window.getComputedStyle(element).position)
    expect(stickyLabelPosition).toBe('sticky')
  }

  expect(runtimeErrors).toEqual([])

  await page.evaluate(() => {
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur()
    window.scrollTo(0, 0)
  })
  await page.addStyleTag({ content: '.skip-link { display: none !important; }' })
  await page.screenshot({
    path: testInfo.outputPath(`executive-timeline-${testInfo.project.name}.png`),
    fullPage: true,
  })
})
