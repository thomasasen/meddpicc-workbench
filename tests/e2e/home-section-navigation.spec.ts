import { expect, test } from '@playwright/test'

const root = '/meddpicc-workbench/'
const sections = [
  { label: 'Tools', id: 'tools' },
  { label: 'Checklists', id: 'checklists' },
  { label: 'Wissen', id: 'knowledge' },
] as const

test('Kopfmenü navigiert zu den Startseitenabschnitten statt die Hash-Route zu zerstören', async ({ page }) => {
  for (const width of [375, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 })
    await page.goto(root)

    const navigation = page.getByRole('navigation', { name: 'Toolbox-Bereiche' })
    for (const section of sections) {
      const link = navigation.getByRole('link', { name: section.label })
      await expect(link).toHaveAttribute('href', '#/#' + section.id)
      await link.click()
      await expect(page).toHaveURL(new RegExp('/#/#' + section.id + '$'))
      await expect(page.locator('#' + section.id)).toBeInViewport({ ratio: 0.05 })
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    }

    // Ein bereits aktiver Menülink muss nach manuellem Scrollen erneut funktionieren.
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
    await navigation.getByRole('link', { name: 'Wissen' }).click()
    await expect(page.locator('#knowledge')).toBeInViewport({ ratio: 0.05 })
  }
})

test('Auch die drei großen Einstiegskarten verwenden gültige Vue-Router-Links', async ({ page }) => {
  await page.goto(root)
  const cards = page.locator('.toolbox-entry-card')
  await expect(cards).toHaveCount(3)

  for (const [index, section] of sections.entries()) {
    await cards.nth(index).click()
    await expect(page).toHaveURL(new RegExp('/#/#' + section.id + '$'))
    await expect(page.locator('#' + section.id)).toBeInViewport({ ratio: 0.05 })
  }
})

test('Abschnittslinks funktionieren auch direkt, nach Reload und mit Tastatur', async ({ page }) => {
  await page.goto(root + '#/#checklists')
  await expect(
    page.getByRole('heading', { name: 'Wiederkehrende Sales-Aufgaben schneller und sicherer erledigen.' }),
  ).toBeVisible()
  await expect(page.locator('#checklists')).toBeInViewport({ ratio: 0.05 })

  await page.reload()
  await expect(page.locator('#checklists')).toBeInViewport({ ratio: 0.05 })

  const knowledge = page.getByRole('navigation', { name: 'Toolbox-Bereiche' }).getByRole('link', {
    name: 'Wissen',
  })
  await knowledge.focus()
  await page.keyboard.press('Enter')
  await expect(page).toHaveURL(/\/#\/\#knowledge$/)
  await expect(page.locator('#knowledge')).toBeInViewport({ ratio: 0.05 })

  // Der Skip-Link darf im Hash-Modus nicht auf eine nicht existente Route zeigen.
  await page.goto(root)
  const initialUrl = page.url()
  await page.locator('.skip-link').focus()
  await page.keyboard.press('Enter')
  await expect(page.locator('#main-content')).toBeFocused()
  expect(page.url()).toBe(initialUrl)
})
