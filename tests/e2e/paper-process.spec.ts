import { expect, test } from '@playwright/test'

test('Paper-Process-Wissen ist über die Startseite erreichbar und grenzt die Prozesse ab', async ({
  page,
}, testInfo) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.goto('/meddpicc-workbench/')
  await page.locator('a[href$="#/knowledge/paper-process"]').click()
  await expect(
    page.getByRole('heading', { name: 'Paper Process: den Weg bis zur Unterschrift verstehen' }),
  ).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Entscheidung, Approval und Paper Process' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Prozess, Personen und Timing' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Was je nach Kunde dazugehören kann' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Typische gefährliche Kurzschlüsse' })).toBeVisible()
  await expect(page.getByText('Schon eine frühe NDA vor dem POC', { exact: false })).toBeVisible()
  await expect(page.getByText('Seller-Fristen können intern helfen', { exact: false })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Go-Live-Rückwärtsplanung öffnen' })).toHaveAttribute(
    'href',
    /\/tools\/reverse-timeline/,
  )
  await expect(page.getByRole('link', { name: 'Decision Process nachschlagen' })).toHaveAttribute(
    'href',
    /\/knowledge\/decision-process/,
  )

  const redFlag = page.locator('.knowledge-detail').first()
  await expect(redFlag).not.toHaveAttribute('open')
  await redFlag.locator('summary').click()
  await expect(redFlag.getByText('keine wirksamer Vertrag')).toHaveCount(0)
  await expect(redFlag.getByText('kein wirksamer Vertrag', { exact: false })).toBeVisible()

  const sources = page.locator('main > section:last-of-type > details')
  await expect(sources).not.toHaveAttribute('open')
  await expect(page.getByText('Andy Whyte', { exact: true })).not.toBeVisible()
  await sources.locator('summary').click()
  await expect(page.getByText('Andy Whyte', { exact: true })).toBeVisible()
  await expect(page.getByText('Darius Lahoutifard', { exact: true })).toBeVisible()
  await sources.locator('summary').click()
  expect(errors).toEqual([])
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.screenshot({
    path: testInfo.outputPath(`paper-process-knowledge-${testInfo.project.name}.png`),
    fullPage: true,
  })
})

test('Paper-Process-Checklist erklärt zehn Fragen, Quellen und temporäre Häkchen', async ({ page }, testInfo) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.goto('/meddpicc-workbench/')
  await page.locator('a[href$="#/checklists/paper-process"]').click()
  await expect(
    page.getByRole('heading', { name: 'Paper Process: Ist der Weg zum Auftrag wirklich geklärt?' }),
  ).toBeVisible()
  await expect(page.getByRole('checkbox')).toHaveCount(10)
  const contract = page.locator('.checklist-item').filter({
    hasText: 'Sind Vertragsprüfung, Unterlagen und mögliche Verhandlungspunkte geklärt?',
  })
  await contract.locator('summary').click()
  await expect(contract.getByText('ob eine NDA', { exact: false })).toBeVisible()
  await contract.locator('summary').click()
  await page.getByRole('checkbox').first().check()
  await expect(page.getByRole('checkbox').first()).toBeChecked()
  const first = page.locator('.checklist-item').first()
  await first.locator('summary').click()
  await expect(first.getByRole('heading', { name: 'Worum geht es?' })).toBeVisible()
  await expect(first.getByRole('heading', { name: 'Typische Fehlinterpretation' })).toBeVisible()
  await first.getByRole('link', { name: 'Paper Process nachschlagen' }).click()
  await expect(page.getByRole('heading', { name: 'Was ist der Paper Process?' })).toBeVisible()
  await page.goto('/meddpicc-workbench/#/checklists/paper-process')
  await expect(page.getByRole('checkbox').first()).not.toBeChecked()
  const sources = page.locator('.checklist-sources details')
  await expect(sources).not.toHaveAttribute('open')
  await sources.locator('summary').click()
  await expect(sources.getByText('Andy Whyte', { exact: false }).first()).toBeVisible()
  await expect(sources.getByText('Darius Lahoutifard', { exact: false }).first()).toBeVisible()
  await sources.locator('summary').click()
  expect(errors).toEqual([])
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.screenshot({
    path: testInfo.outputPath(`paper-process-checklist-${testInfo.project.name}.png`),
    fullPage: true,
  })
})

test('Paper-Process-Wissen und Checklist haben bei 375, 768, 1024 und 1440 px keinen horizontalen Overflow', async ({
  page,
}) => {
  for (const width of [375, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 812 })
    for (const path of ['/knowledge/paper-process', '/checklists/paper-process']) {
      await page.goto(`/meddpicc-workbench/#${path}`)
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
      const size = await page.evaluate(() => ({
        viewport: document.documentElement.clientWidth,
        content: document.documentElement.scrollWidth,
      }))
      expect(size.content, `width=${width} path=${path}`).toBeLessThanOrEqual(size.viewport)
    }
  }
})
