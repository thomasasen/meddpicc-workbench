import { readFile } from 'node:fs/promises'

import { expect, test } from '@playwright/test'

test('erstellt ein neues Projekt und speichert es als valide .meddpicc-Datei', async ({ page }) => {
  await page.goto('/meddpicc-workbench/')

  await page.getByRole('button', { name: 'Neues Projekt' }).click()
  await page.getByLabel('Account').fill('Neue Beispiel AG')
  await page.getByLabel('Projektname').fill('CRM Auswahl 2027')
  await page.getByLabel(/Owner/).fill('Test Seller')
  await page.getByRole('button', { name: 'Projekt erstellen' }).click()

  const toolbar = page.locator('.project-toolbar')
  await expect(toolbar.getByText('Neue Beispiel AG · CRM Auswahl 2027')).toBeVisible()
  await expect(toolbar.getByText('Ungespeicherte Änderungen')).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Neue Beispiel AG' })).toBeVisible()

  const downloadPromise = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Projekt speichern' }).click()
  const download = await downloadPromise

  expect(download.suggestedFilename()).toBe('Neue Beispiel AG - CRM Auswahl 2027.meddpicc')

  const downloadPath = await download.path()
  expect(downloadPath).not.toBeNull()

  const raw = await readFile(downloadPath as string, 'utf8')
  const saved = JSON.parse(raw) as {
    format: string
    schemaVersion: string
    revision: number
    project: { accountName: string; name: string }
    meddpicc: { metrics: { status: string } }
  }

  expect(saved.format).toBe('meddpicc-workbench-project')
  expect(saved.schemaVersion).toBe('0.2.0')
  expect(saved.revision).toBe(2)
  expect(saved.project.accountName).toBe('Neue Beispiel AG')
  expect(saved.project.name).toBe('CRM Auswahl 2027')
  expect(saved.meddpicc.metrics.status).toBe('unknown')

  await expect(toolbar.getByText('Gespeicherter Stand')).toBeVisible()
})

test('lehnt eine ungültige Projektdatei vollständig ab', async ({ page }) => {
  await page.goto('/meddpicc-workbench/')

  await page.locator('input[type="file"]').setInputFiles({
    name: 'kaputt.meddpicc',
    mimeType: 'application/json',
    buffer: Buffer.from('{ ungueltig'),
  })

  await expect(page.getByRole('alert')).toContainText('Projektdatei wurde nicht geladen')
  await expect(page.getByRole('alert')).toContainText('kein gültiges JSON')
  await expect(page.getByRole('heading', { name: 'Beispielwerke Industrie GmbH' })).toBeVisible()
})

test('öffnet eine valide .meddpicc-Datei und schützt ungespeicherte Änderungen', async ({ page }) => {
  await page.goto('/meddpicc-workbench/')

  await page.getByRole('button', { name: 'Neues Projekt' }).click()
  await page.getByLabel('Account').fill('Ungespeicherte AG')
  await page.getByLabel('Projektname').fill('Noch nicht gespeichert')
  await page.getByRole('button', { name: 'Projekt erstellen' }).click()

  page.once('dialog', async (dialog) => {
    expect(dialog.type()).toBe('confirm')
    expect(dialog.message()).toContain('ungespeicherte Änderungen')
    await dialog.dismiss()
  })

  await page.locator('input[type="file"]').setInputFiles('examples/demo-opportunity.meddpicc')
  await expect(page.getByRole('heading', { name: 'Ungespeicherte AG' })).toBeVisible()

  page.once('dialog', async (dialog) => {
    await dialog.accept()
  })

  await page.locator('input[type="file"]').setInputFiles('examples/demo-opportunity.meddpicc')

  await expect(page.getByRole('heading', { name: 'Beispielwerke Industrie GmbH' })).toBeVisible()
  await expect(page.locator('.project-toolbar')).toContainText('demo-opportunity.meddpicc')
  await expect(page.locator('.project-toolbar')).toContainText('Gespeicherter Stand')
})


test('migriert eine historische 0.1.0-Datei sichtbar und speichert sie als 0.2.0', async ({ page }) => {
  await page.goto('/meddpicc-workbench/')

  await page
    .locator('input[type="file"]')
    .setInputFiles('examples/legacy/demo-opportunity-0.1.0.meddpicc')

  await expect(page.getByRole('status')).toContainText('wurde von Schema 0.1.0 auf 0.2.0 migriert')
  await expect(page.getByRole('status')).toContainText('Bitte speichern')
  await expect(page.locator('.project-toolbar')).toContainText('Ungespeicherte Änderungen')
  await expect(page.getByRole('heading', { name: 'Beispielwerke Industrie GmbH' })).toBeVisible()

  const downloadPromise = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Projekt speichern' }).click()
  const download = await downloadPromise

  const downloadPath = await download.path()
  expect(downloadPath).not.toBeNull()

  const raw = await readFile(downloadPath as string, 'utf8')
  const saved = JSON.parse(raw) as {
    schemaVersion: string
    history: Array<{ type: string; summary: string }>
  }

  expect(saved.schemaVersion).toBe('0.2.0')
  expect(saved.history.some((entry) => entry.type === 'schema_migrated')).toBe(true)
  expect(saved.history.some((entry) => entry.summary.includes('0.1.0 auf 0.2.0'))).toBe(true)

  await expect(page.locator('.project-toolbar')).toContainText('Gespeicherter Stand')
})
