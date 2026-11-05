import { expect, test } from '@playwright/test'

test('Buttons liefern unmittelbares Feedback bei Pointerdown und behalten nativen Fokus', async ({ page }) => {
  await page.goto('/meddpicc-workbench/#/tools/quick-payback')

  const demo = page.getByRole('button', { name: 'Fiktives Beispiel einsetzen' })
  await demo.hover()
  await page.mouse.down()
  await expect(demo).toHaveCSS('transform', /matrix/)
  await page.mouse.up()

  await demo.focus()
  await page.keyboard.press('Shift+Tab')
  await page.keyboard.press('Tab')
  await expect(demo).toBeFocused()
  await expect(demo).toHaveCSS('outline-style', 'solid')
})

test('Reduced Motion deaktiviert Druck-Skalierung und lässt die Navigation bedienbar', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/meddpicc-workbench/')

  const tools = page.locator('.toolbox-entry-card').first()
  await tools.focus()
  await expect(tools).toBeFocused()
  await tools.dispatchEvent('pointerdown', { pointerType: 'touch', pointerId: 72, button: 0 })
  await expect(tools).toHaveCSS('transform', 'none')
  await tools.press('Enter')
  await expect(page).toHaveURL(/\/#\/\#tools$/)
})

test('Kontrastreicher Modus erhält klare Grenzen und Fokus', async ({ page }) => {
  await page.emulateMedia({ contrast: 'more' })
  await page.goto('/meddpicc-workbench/#/tools/metric-builder')

  const button = page.locator('.tool-step-navigation__item').first()
  await button.focus()
  await expect(button).toBeFocused()
  await expect(button).toHaveCSS('outline-style', 'solid')
  await expect(button).toHaveCSS('border-top-width', '2px')
})
