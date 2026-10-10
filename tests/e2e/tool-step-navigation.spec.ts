import { expect, test } from '@playwright/test'

test('Gemeinsame Workflow-Navigation behält Eingaben und Fokus im Metric Builder', async ({ page }) => {
  await page.goto('/#/tools/metric-builder')
  await page
    .getByRole('textbox', { name: 'Welches konkrete Problem besteht?' })
    .fill('Manuelle Doppelerfassung in fünf Teams')
  const navigation = page.getByRole('navigation', { name: 'Metric entwickeln' })
  await expect(navigation.getByRole('button', { name: '1 · Problem' })).toHaveAttribute('aria-current', 'step')
  await navigation.getByRole('button', { name: '2 · Messung' }).click()
  await expect(navigation.getByRole('button', { name: '2 · Messung' })).toHaveAttribute('aria-current', 'step')
  await expect(navigation.getByRole('button', { name: '2 · Messung' })).toBeFocused()
  await navigation.getByRole('button', { name: '1 · Problem' }).click()
  await expect(page.getByRole('textbox', { name: 'Welches konkrete Problem besteht?' })).toHaveValue(
    'Manuelle Doppelerfassung in fünf Teams',
  )
})

test('Cost of Delay lässt seine Schritte über Tastatur steuern', async ({ page }) => {
  await page.goto('/#/tools/cost-of-delay')
  const navigation = page.getByRole('navigation', { name: 'Cost of Delay berechnen' })
  const stepTwo = navigation.getByRole('button', { name: '2 · Verzögerung' })
  await stepTwo.focus()
  await page.keyboard.press('Enter')
  await expect(stepTwo).toHaveAttribute('aria-current', 'step')
})
