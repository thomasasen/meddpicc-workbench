import { readFile } from 'node:fs/promises'
import { execFileSync } from 'node:child_process'
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


test('Firmenlogo bleibt beim SVG/PNG-Export eingebettet und wird nicht extern geladen', async ({ page }) => {
  await page.goto(settings)
  await page.getByLabel('Firmenname').fill('Fiktive Logo-Beratung GmbH')
  await page.locator('input[aria-label="PNG- oder JPEG-Firmenlogo wählen"]').setInputFiles({
    name: 'test.png', mimeType: 'image/png', buffer: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAKAAAAAkCAYAAAAO7jHjAAAAmklEQVR42u3b0Q1AMBSG0bqbWMgqZrGKhYzCAkIl2ityzrOn5svfFy0FAACgo6H2w3FadsdFrW2dh1cCFB4tQwzx0dJdQyE+MiMM8ZEZYTgaMoX1I3MFLSDfWkAQIAIEASJAECACBAEiQBAgAgQB8r8Aa//lh6fO2rKAfO8KtoL0WL/LBRQhreO7vYJFSMv4SvEwnaTwAAAAUhw4/SwyqIE0/AAAAABJRU5ErkJggg==', 'base64'),
  })
  await expect(page.getByRole('img', { name: 'Aktuell ausgewähltes Firmenlogo' })).toBeVisible()
  await page.getByRole('button', { name: 'Änderungen speichern' }).click()
  await expect(page.getByText('CI-Profil dauerhaft in diesem Browser gespeichert.')).toBeVisible()
  await page.goto(timeline)
  await page.getByLabel('Target Go-Live').fill('2026-12-31')
  const svgDownload = page.waitForEvent('download')
  await page.getByRole('button', { name: 'SVG' }).click()
  const svg = await readFile((await (await svgDownload).path())!, 'utf8')
  expect(svg).toContain('data-brand-logo="true"')
  expect(svg).toMatch(/href="data:image\/png;base64,[A-Za-z0-9+/=]+"/)
  expect(svg).not.toContain('<script')
  expect(svg).not.toContain('<foreignObject')
  const pngDownload = page.waitForEvent('download')
  await page.getByRole('button', { name: 'PNG' }).click()
  const png = await readFile((await (await pngDownload).path())!)
  expect(png.subarray(1, 4).toString('ascii')).toBe('PNG')
})

test('PDF-Vorschau erhält typografische Sonderzeichen als echten Text', async ({ page }) => {
  await page.goto(settings)
  const companyName = 'Straße – „München“ Büro'
  await page.getByLabel('Firmenname').fill(companyName)
  await page.getByRole('button', { name: 'Änderungen speichern' }).click()
  await expect(page.getByText('CI-Profil dauerhaft in diesem Browser gespeichert.')).toBeVisible()
  await page.getByRole('button', { name: 'PDF-Vorschau erzeugen' }).click()
  await expect(page.locator('iframe[title="Fiktive PDF-Vorschau"]')).toBeVisible()
  const download = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Vorschau herunterladen' }).click()
  const file = await (await download).path()
  expect(file).toBeTruthy()
  if (!file) return
  const extracted = execFileSync('pdftotext', [file, '-'], { encoding: 'utf8' })
  expect(extracted).toContain(companyName)
  expect(extracted).not.toContain('Straße ?')
})
