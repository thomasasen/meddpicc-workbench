import { expect, test } from '@playwright/test'

async function stepLabels(page: import('@playwright/test').Page) {
  return page
    .locator('.reverse-step-card input[type="text"]')
    .evaluateAll((inputs) => inputs.map((input) => (input as HTMLInputElement).value))
}

test('sortiert Go-Live-Schritte intuitiv per Drag und per Tastatur', async ({ page }, testInfo) => {
  const runtimeErrors: string[] = []
  page.on('pageerror', (error) => runtimeErrors.push(error.message))

  await page.goto('/meddpicc-workbench/#/tools/reverse-timeline')

  const handles = page.locator('.reverse-drag-handle')
  await expect(handles).toHaveCount(5)
  await expect(page.getByRole('button', { name: /nach oben|nach unten/i })).toHaveCount(0)

  expect(await stepLabels(page)).toEqual([
    'Implementierung / Rollout',
    'Vertrag & Unterschrift',
    'Legal / Datenschutz',
    'Einkauf / Procurement',
    'Finale Entscheidung',
  ])

  const firstHandle = page.getByRole('button', { name: /Implementierung.*Rollout verschieben/ })
  const targetCard = page.locator('.reverse-step-card').nth(2)
  const handleBox = await firstHandle.boundingBox()
  const targetBox = await targetCard.boundingBox()

  expect(handleBox).not.toBeNull()
  expect(targetBox).not.toBeNull()
  if (!handleBox || !targetBox) return

  const pointerId = 42
  await firstHandle.dispatchEvent('pointerdown', {
    pointerId,
    pointerType: 'touch',
    isPrimary: true,
    button: 0,
    clientX: handleBox.x + handleBox.width / 2,
    clientY: handleBox.y + handleBox.height / 2,
  })
  const liftedCard = page.locator('.reverse-step-card').first()
  await expect(liftedCard).toHaveClass(/reverse-step-card--dragging/)

  const liftedStyle = await liftedCard.evaluate((element) => {
    const style = window.getComputedStyle(element)
    return {
      transform: style.transform,
      boxShadow: style.boxShadow,
      zIndex: style.zIndex,
    }
  })

  expect(liftedStyle.transform).not.toBe('none')
  expect(liftedStyle.boxShadow).not.toBe('none')
  expect(liftedStyle.zIndex).toBe('4')

  await page.addStyleTag({ content: '.skip-link { display: none !important; }' })
  await page.screenshot({
    path: testInfo.outputPath(`reverse-timeline-drag-lift-${testInfo.project.name}.png`),
    fullPage: true,
  })

  await firstHandle.dispatchEvent('pointermove', {
    pointerId,
    pointerType: 'touch',
    isPrimary: true,
    buttons: 1,
    clientX: targetBox.x + targetBox.width / 2,
    clientY: targetBox.y + targetBox.height / 2,
  })
  await firstHandle.dispatchEvent('pointerup', {
    pointerId,
    pointerType: 'touch',
    isPrimary: true,
    button: 0,
    clientX: targetBox.x + targetBox.width / 2,
    clientY: targetBox.y + targetBox.height / 2,
  })

  expect(await stepLabels(page)).toEqual([
    'Vertrag & Unterschrift',
    'Legal / Datenschutz',
    'Implementierung / Rollout',
    'Einkauf / Procurement',
    'Finale Entscheidung',
  ])

  const implementationHandle = page.getByRole('button', { name: /Implementierung.*Rollout verschieben/ })
  await implementationHandle.focus()
  await implementationHandle.press('ArrowUp')

  expect(await stepLabels(page)).toEqual([
    'Vertrag & Unterschrift',
    'Implementierung / Rollout',
    'Legal / Datenschutz',
    'Einkauf / Procurement',
    'Finale Entscheidung',
  ])
  await expect(page.getByText('Implementierung / Rollout ist jetzt Position 2.')).toBeAttached()

  expect(runtimeErrors).toEqual([])

  await page.evaluate(() => {
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur()
    window.scrollTo(0, 0)
  })
  await page.addStyleTag({ content: '.skip-link { display: none !important; }' })
  await page.screenshot({
    path: testInfo.outputPath(`reverse-timeline-drag-${testInfo.project.name}.png`),
    fullPage: true,
  })
})


test('respektiert reduzierte Bewegung beim angehobenen Drag-State', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/meddpicc-workbench/#/tools/reverse-timeline')

  const firstHandle = page.getByRole('button', { name: /Implementierung.*Rollout verschieben/ })
  const handleBox = await firstHandle.boundingBox()

  expect(handleBox).not.toBeNull()
  if (!handleBox) return

  const pointerId = 43
  await firstHandle.dispatchEvent('pointerdown', {
    pointerId,
    pointerType: 'touch',
    isPrimary: true,
    button: 0,
    clientX: handleBox.x + handleBox.width / 2,
    clientY: handleBox.y + handleBox.height / 2,
  })

  const liftedCard = page.locator('.reverse-step-card').first()
  const reducedStyle = await liftedCard.evaluate((element) => {
    const style = window.getComputedStyle(element)
    return {
      transform: style.transform,
      boxShadow: style.boxShadow,
    }
  })

  expect(reducedStyle.transform).toBe('none')
  expect(reducedStyle.boxShadow).not.toBe('none')

  await firstHandle.dispatchEvent('pointerup', {
    pointerId,
    pointerType: 'touch',
    isPrimary: true,
    button: 0,
    clientX: handleBox.x + handleBox.width / 2,
    clientY: handleBox.y + handleBox.height / 2,
  })
})
