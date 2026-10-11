import { readFile } from 'node:fs/promises'
import { expect, test } from '@playwright/test'

const settings = '/meddpicc-workbench/#/settings/document-design'
const timeline = '/meddpicc-workbench/#/tools/reverse-timeline'

test('Timeline-Exporte nutzen das lokal gespeicherte CI und sind ohne externe Bildquellen', async ({ page }, info) => {
  await page.goto(settings)
  await page.getByLabel('Firmenname').fill('A & B Consulting GmbH')
  await page.getByLabel('Primärfarbe (Hex)').fill('#F3EBD7')
  await page.getByLabel('Akzentfarbe (Hex)').fill('#E4AC13')
  await page.getByRole('button', { name: 'Änderungen speichern' }).click()
  await expect(page.getByText('CI-Profil dauerhaft in diesem Browser gespeichert.')).toBeVisible()
  await page.goto(timeline)
  await page.getByLabel('Planungsdatum').fill('2026-10-08')
  await page.getByLabel('Target Go-Live').fill('2026-12-31')
  const pending = page.waitForEvent('download')
  await page.getByRole('button', { name: 'SVG' }).click()
  const downloaded = await pending
  const svg = await readFile((await downloaded.path())!, 'utf8')
  expect(svg).toContain('A &amp; B Consulting GmbH')
  expect(svg).toContain('data-brand-accent="true"')
  expect(svg).toContain('fill="#E4AC13"')
  expect(svg).toContain('<desc id="timeline-svg-description">')
  expect(svg).not.toContain('MEDDPICC TOOLBOX')
  expect(svg).not.toMatch(/(?:https?:|\/\/)[^" ]+\.(?:png|jpe?g|svg)/i)
  expect(svg).toContain('fill="#15803d"')

  const pngDownload = page.waitForEvent('download')
  await page.getByRole('button', { name: 'PNG' }).click()
  const bytes = await readFile((await (await pngDownload).path())!)
  expect(bytes.subarray(1, 4).toString('ascii')).toBe('PNG')
  expect(bytes.readUInt32BE(16)).toBe(1600)
  await page.screenshot({ path: info.outputPath('timeline-ci-settings.png'), fullPage: true })
})

test('Export fällt bei gesperrtem IndexedDB sichtbar neutral zurück', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(IDBFactory.prototype, 'open', {
      configurable: true,
      value() { throw new DOMException('Test-DB gesperrt', 'InvalidStateError') },
    })
  })
  await page.goto(timeline)
  await page.getByLabel('Target Go-Live').fill('2026-12-31')
  const download = page.waitForEvent('download')
  await page.getByRole('button', { name: 'SVG' }).click()
  const result = await download
  const svg = await readFile((await result.path())!, 'utf8')
  expect(svg).not.toContain('data-brand-name')
  await expect(page.getByRole('status')).toContainText('neutral ohne Firmenbranding')
})

test('Dokumentgestaltung ist tastaturbedienbar und stellt Statusmeldungen semantisch dar', async ({ page }, info) => {
  await page.goto(settings)
  await expect(page.getByRole('main')).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Dokumentgestaltung', level: 1 })).toBeVisible()
  const input = page.getByLabel('Firmenname')
  await input.focus()
  await expect(input).toBeFocused()
  await page.keyboard.type('Beispiel Beratung GmbH')
  await expect(input).toHaveValue('Beispiel Beratung GmbH')
  await page.keyboard.press('Tab')
  await expect(page.getByLabel('Website (optional)')).toBeFocused()
  await page.getByRole('button', { name: 'Änderungen speichern' }).focus()
  await page.keyboard.press('Enter')
  await expect(page.getByRole('status').filter({ hasText: 'CI-Profil dauerhaft' })).toBeVisible()
  await page.getByLabel('Primärfarbe (Hex)').fill('falsch')
  await page.getByRole('button', { name: 'Änderungen speichern' }).click()
  await expect(page.getByRole('alert')).toBeVisible()
  await page.screenshot({ path: info.outputPath('branding-keyboard-validation.png'), fullPage: true })
})
