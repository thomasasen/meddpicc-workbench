import { expect, test } from '@playwright/test'

test('zeigt das sichtbare Redesign mit Bereichsnavigation und sofortigem Tool-Einstieg', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.goto('/meddpicc-workbench/')

  const nav = page.getByRole('navigation', { name: 'Toolbox-Bereiche' })
  await expect(nav).toBeVisible()
  await expect(nav.getByRole('link', { name: 'Tools' })).toHaveAttribute('href', '#tools')
  await expect(nav.getByRole('link', { name: 'Checklists' })).toHaveAttribute('href', '#checklists')
  await expect(nav.getByRole('link', { name: 'Wissen' })).toHaveAttribute('href', '#knowledge')

  const hero = page.locator('.toolbox-hero')
  const action = hero.getByRole('link', { name: /Planung öffnen/ })
  await expect(action).toBeVisible()
  await expect(action).toHaveAttribute('href', '#/tools/reverse-timeline')

  const geometry = await hero.evaluate((element) => {
    const style = getComputedStyle(element)
    return {
      radius: Number.parseFloat(style.borderTopLeftRadius),
      gap: style.gap,
      background: style.backgroundImage,
    }
  })
  expect(geometry.radius).toBeGreaterThanOrEqual(20)
  expect(geometry.background).toContain('gradient')

  await action.click()
  await expect(page.getByRole('heading', { name: 'Go-Live-Rückwärtsplanung' })).toBeVisible()
  expect(errors).toEqual([])
})

test('arbeitet mit Tab-/Enter-Navigation und sichtbaren Fokuszuständen', async ({ page }) => {
  await page.goto('/meddpicc-workbench/')
  const nav = page.getByRole('navigation', { name: 'Toolbox-Bereiche' })
  const tools = nav.getByRole('link', { name: 'Tools' })
  await tools.focus()
  await page.keyboard.press('Shift+Tab')
  await page.keyboard.press('Tab')
  await expect(tools).toBeFocused()
  await expect(tools).toHaveCSS('outline-style', 'solid')
  await tools.press('Enter')
  await expect(page).toHaveURL(/#\/tools$/)
})

test('Startseite bleibt bei 320–1440 Pixeln vollständig zugänglich', async ({ page }) => {
  for (const width of [320, 375, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 920 })
    await page.goto('/meddpicc-workbench/')
    const state = await page.evaluate(() => ({
      viewport: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
    }))
    expect(state.scrollWidth, `horizontales Überlaufen bei ${width}px`).toBeLessThanOrEqual(
      state.viewport + 2,
    )
    await expect(page.getByRole('heading', { name: /Wiederkehrende Sales-Aufgaben/ })).toBeVisible()
    await expect(page.getByRole('navigation', { name: 'Toolbox-Bereiche' })).toBeVisible()
    await expect(page.locator('.toolbox-entry-card')).toHaveCount(3)
  }
})

test('Reduzierte Bewegung und erhöhter Kontrast bleiben erhalten', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce', contrast: 'more' })
  await page.goto('/meddpicc-workbench/')

  const card = page.locator('.toolbox-entry-card').first()
  const css = await card.evaluate((element) => {
    const style = getComputedStyle(element)
    return { borderWidth: style.borderTopWidth, transitionDuration: style.transitionDuration }
  })
  expect(css.borderWidth).toBe('1px')
  expect(css.transitionDuration.split(',').every((duration) => Number.parseFloat(duration) <= 0.01)).toBe(
    true,
  )

  await card.focus()
  await expect(card).toHaveCSS('outline-style', 'solid')
})
