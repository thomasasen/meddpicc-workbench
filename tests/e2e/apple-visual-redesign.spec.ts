import { expect, test } from '@playwright/test'

const visualRoutes = [
  { route: '/', hero: '.toolbox-hero', surface: '.toolbox-entry-card' },
  { route: '/tools/quick-payback', hero: '.quick-hero', surface: '.quick-panel' },
  { route: '/tools/metric-builder', hero: '.metric-intro', surface: '.metric-panel' },
  { route: '/tools/cost-of-delay', hero: '.cod-intro', surface: '.cod-panel' },
  { route: '/tools/value-bridge', hero: '.vb-intro', surface: '.vb-panel' },
  { route: '/tools/reverse-timeline', hero: '.tool-intro', surface: '.reverse-config' },
  { route: '/checklists/metrics', hero: '.checklist-hero', surface: '.checklist-list-section' },
  { route: '/knowledge/metrics', hero: '.knowledge-hero', surface: '.knowledge-primary-card' },
  { route: '/settings', hero: '.settings-main > header', surface: '.settings-panel' },
  { route: '/settings/document-design', hero: '.branding-intro', surface: '.branding-panel' },
] as const

test('Alle produktiven Oberflächen nutzen erkennbar das neue Material-, Typografie- und Karten-System', async ({
  page,
}) => {
  for (const { route, hero, surface } of visualRoutes) {
    await page.goto('/meddpicc-workbench/#' + route)
    const site = page.locator('.site-shell')
    await expect(site).toBeVisible()
    await expect(page.locator(hero).first()).toBeVisible()
    await expect(page.locator(surface).first()).toBeVisible()

    const result = await page.evaluate(
      ({ hero, surface }) => {
        const heroEl = document.querySelector(hero) as HTMLElement
        const surfaceEl = document.querySelector(surface) as HTMLElement
        const title = document.querySelector('main h1') as HTMLElement
        return {
          heroBackground: getComputedStyle(heroEl).backgroundColor,
          heroRadius: Number.parseFloat(getComputedStyle(heroEl).borderTopLeftRadius),
          surfaceBackground: getComputedStyle(surfaceEl).backgroundColor,
          surfaceRadius: Number.parseFloat(getComputedStyle(surfaceEl).borderTopLeftRadius),
          titleSize: Number.parseFloat(getComputedStyle(title).fontSize),
        }
      },
      { hero, surface },
    )

    expect(result.heroBackground, route).toBe('rgb(234, 241, 250)')
    expect(result.heroRadius, route).toBeGreaterThanOrEqual(19)
    expect(result.surfaceBackground, route).toBe('rgb(255, 255, 255)')
    expect(result.surfaceRadius, route).toBeGreaterThanOrEqual(17)
    expect(result.titleSize, route).toBeGreaterThanOrEqual(29)
  }
})

test('Die globale Navigation schwebt beim Scrollen und bleibt ohne Verschiebung nutzbar', async ({ page }) => {
  await page.goto('/meddpicc-workbench/')
  const header = page.locator('.site-header')
  const material = header.locator('.header-inner')

  await expect(header).toHaveCSS('position', 'sticky')
  await expect(material).toHaveCSS('border-top-left-radius', '20px')
  await page.evaluate(() => window.scrollTo(0, 650))
  await expect
    .poll(() => header.evaluate((element) => Math.round(element.getBoundingClientRect().top)))
    .toBe(0)

  const brand = header.getByRole('link', { name: 'MEDDPICC Toolbox Startseite' })
  await brand.focus()
  await expect(brand).toBeFocused()
  await brand.press('Enter')
  await expect(page.getByRole('heading', { name: /Wiederkehrende Sales-Aufgaben/ })).toBeVisible()
})

test('Kontrast und reduzierte Bewegung verändern die Effekte, nicht den Inhalt', async ({ page }) => {
  await page.goto('/meddpicc-workbench/')
  const entry = page.locator('.toolbox-entry-card').first()
  await entry.hover()
  await expect(entry).toHaveCSS('transform', /matrix/)
  await page.emulateMedia({ reducedMotion: 'reduce', contrast: 'more' })
  await expect(entry).toHaveCSS('transform', 'none')
  await expect(page.locator('.site-header .header-inner')).toHaveCSS('backdrop-filter', 'none')
  await entry.focus()
  await expect(entry).toBeFocused()
  await expect(entry).toHaveCSS('outline-style', 'solid')
  await entry.press('Enter')
  await expect(page).toHaveURL(/#\/tools$/)
})

test('Auf 320px bleiben Startseite, Tool, Checklist und Wissen ohne horizontales Scrollen bedienbar', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 760 })
  for (const route of ['/', '/tools/quick-payback', '/checklists/metrics', '/knowledge/metrics']) {
    await page.goto('/meddpicc-workbench/#' + route)
    await expect(page.locator('main h1').first()).toBeVisible()
    const dimensions = await page.evaluate(() => ({
      width: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
    }))
    expect(dimensions.scrollWidth, route).toBeLessThanOrEqual(dimensions.width + 1)
  }
})
