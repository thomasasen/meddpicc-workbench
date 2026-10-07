import { expect, test } from '@playwright/test'

test('öffnet Economic Buyer Wissen von der Startseite und erklärt das Thema praxisnah', async ({ page }, testInfo) => {
  const runtimeErrors: string[] = []
  page.on('pageerror', (error) => runtimeErrors.push(error.message))

  await page.goto('/meddpicc-workbench/')
  const knowledgeLink = page.locator('a[href$="#/knowledge/economic-buyer"]')
  await expect(knowledgeLink).toBeVisible()
  await knowledgeLink.click()

  await expect(page.getByRole('heading', { name: 'Economic Buyer verstehen und sicherer einordnen' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Was ist ein Economic Buyer?' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Typische Fehlinterpretationen' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Welche Fragen helfen mir?' })).toBeVisible()
  await expect(page.getByText('Andy Whyte', { exact: true })).toBeVisible()
  await expect(page.getByText('Darius Lahoutifard', { exact: true })).toBeVisible()

  const firstMisinterpretation = page.locator('.knowledge-detail').first()
  await firstMisinterpretation.locator('summary').click()
  await expect(firstMisinterpretation.locator('p')).toBeVisible()

  expect(runtimeErrors).toEqual([])

  await page.evaluate(() => {
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur()
    window.scrollTo(0, 0)
  })
  await page.addStyleTag({ content: '.skip-link { display: none !important; }' })
  await page.screenshot({
    path: testInfo.outputPath(`economic-buyer-knowledge-${testInfo.project.name}.png`),
    fullPage: true,
  })
})

test('öffnet die Economic Buyer Themen-Checklist und hält Checks lokal', async ({ page }, testInfo) => {
  const runtimeErrors: string[] = []
  page.on('pageerror', (error) => runtimeErrors.push(error.message))

  await page.goto('/meddpicc-workbench/')
  const checklistLink = page.locator('a[href$="#/checklists/economic-buyer"]')
  await expect(checklistLink).toBeVisible()
  await checklistLink.click()

  await expect(page.getByRole('heading', { name: 'Economic Buyer: Wissen oder nur annehmen?' })).toBeVisible()
  const checkboxes = page.getByRole('checkbox')
  await expect(checkboxes).toHaveCount(7)

  const firstCheckbox = checkboxes.first()
  await firstCheckbox.check()
  await expect(firstCheckbox).toBeChecked()

  const firstItem = page.locator('.checklist-item').first()
  await firstItem.locator('summary').click()
  await expect(firstItem.getByRole('heading', { name: 'Worum geht es?' })).toBeVisible()
  await expect(firstItem.getByRole('heading', { name: 'Typische Fehlinterpretation' })).toBeVisible()
  await expect(firstItem.getByRole('heading', { name: 'Mögliche Frage oder Handlung' })).toBeVisible()

  await expect(page.getByText(/Deal Score|Qualification Score|MEDDPICC completeness|Prozent/i)).toHaveCount(0)
  expect(runtimeErrors).toEqual([])

  await page.evaluate(() => {
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur()
    window.scrollTo(0, 0)
  })
  await page.addStyleTag({ content: '.skip-link { display: none !important; }' })
  await page.screenshot({
    path: testInfo.outputPath(`economic-buyer-checklist-${testInfo.project.name}.png`),
    fullPage: true,
  })
})

test('öffnet die Economic-Buyer-Termin Checklist und zeigt kompakte Vorbereitung', async ({ page }, testInfo) => {
  const runtimeErrors: string[] = []
  page.on('pageerror', (error) => runtimeErrors.push(error.message))

  await page.goto('/meddpicc-workbench/')
  const meetingLink = page.locator('a[href$="#/checklists/economic-buyer-meeting"]')
  await expect(meetingLink).toBeVisible()
  await meetingLink.click()

  await expect(
    page.getByRole('heading', { name: 'Economic-Buyer-Termin in wenigen Minuten vorbereiten' }),
  ).toBeVisible()
  await expect(page.getByRole('checkbox')).toHaveCount(9)
  await expect(page.getByText(/Value, Kernfragen, Commitment und den nächsten Schritt/)).toBeVisible()

  const firstItem = page.locator('.checklist-item').first()
  await firstItem.locator('summary').click()
  await expect(firstItem.getByRole('heading', { name: 'Warum ist das relevant?' })).toBeVisible()

  await expect(page.getByText(/Deal Score|Qualification Score|MEDDPICC completeness|Prozent/i)).toHaveCount(0)
  expect(runtimeErrors).toEqual([])

  await page.evaluate(() => {
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur()
    window.scrollTo(0, 0)
  })
  await page.addStyleTag({ content: '.skip-link { display: none !important; }' })
  await page.screenshot({
    path: testInfo.outputPath(`economic-buyer-meeting-${testInfo.project.name}.png`),
    fullPage: true,
  })
})
