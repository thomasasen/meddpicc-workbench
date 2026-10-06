import { expect, test } from '@playwright/test'

test('lädt die Standard-Demo als Deal-Fokus ohne offensichtlichen Runtime-Fehler', async ({ page }) => {
  const runtimeErrors: string[] = []
  page.on('pageerror', (error) => runtimeErrors.push(error.message))

  await page.goto('/meddpicc-workbench/')

  await expect(page.getByText('MEDDPICC Workbench', { exact: true }).first()).toBeVisible()
  await expect(
    page.getByRole('heading', { name: /Beispielwerke Industrie GmbH.*CRM & Service Transformation 2027/ }),
  ).toBeVisible()

  const context = page.locator('.project-toolbar')
  await expect(context).toContainText('Fiktive Demo')
  await expect(context).toContainText('Gespeicherter Stand')
  await expect(context).toContainText(/480\.000.*€/)
  await expect(context).toContainText('Best Case')
  await expect(context).toContainText('31.03.2027')
  await expect(context).toContainText('01.07.2027')

  await expect(page.getByRole('heading', { name: 'Aktuell wichtig' })).toBeVisible()

  const inspector = page.locator('.inspector-panel')
  await expect(inspector.getByRole('heading', { name: 'Deal Inspector' })).toBeVisible()
  await expect(inspector).toContainText('Economic Buyer ist noch nicht belastbar validiert.')
  await expect(inspector).toContainText('Erforderliche Schritte im Decision Process sind noch nicht bestätigt.')
  await expect(inspector).toContainText('Der Paper Process enthält noch close-relevante Lücken.')
  await expect(inspector).toContainText('economic-buyer.validated')
  await expect(inspector).toContainText('Regelset v0.1')

  const recommendations = page.locator('.next-best-action-panel')
  await expect(recommendations.getByRole('heading', { name: 'Empfohlene nächste Schritte' })).toBeVisible()
  await expect(recommendations).toContainText('4 deterministisch abgeleitete Empfehlungen')
  await expect(recommendations.locator('.next-best-action-item')).toHaveCount(3)
  await expect(recommendations).toContainText('Tatsächliche Economic-Buyer-Authority validieren')
  await expect(recommendations).toContainText(
    'Geplante und unbekannte Decision-Process-Schritte kundenseitig validieren',
  )
  await expect(recommendations).toContainText('Paper-Process-Owner und Lead Times bestätigen')
  await expect(recommendations).not.toContainText('Champion-Candidate durch konkrete interne Aktion testen')
  await expect(recommendations).toContainText('Warum jetzt?')
  await expect(recommendations).toContainText('Gewünschte Evidence / Outcome')

  const gates = page.locator('.qualification-gates-panel')
  await expect(gates.getByRole('heading', { name: 'Qualification Gates' })).toBeVisible()
  await expect(gates.locator('.qualification-gate-card')).toHaveCount(3)

  const pocGate = gates.locator('.qualification-gate-card').filter({ hasText: 'POC / Pilot' })
  await expect(pocGate).toContainText('Nicht bereit')
  await expect(pocGate).toContainText('Geplante und unbekannte Decision-Process-Schritte kundenseitig validieren')

  const proposalGate = gates.locator('.qualification-gate-card').filter({ hasText: 'Proposal / Pricing' })
  await expect(proposalGate).toContainText('Bedingt')
  await expect(proposalGate).toContainText('Tatsächliche Economic-Buyer-Authority validieren')

  const commitGate = gates.locator('.qualification-gate-card').filter({ hasText: 'Commit Forecast' })
  await expect(commitGate).toContainText('Nicht bereit')
  await expect(commitGate).toContainText('Pause empfohlen')

  const championTester = page.locator('.champion-tester-panel')
  await expect(championTester.getByRole('heading', { name: 'Champion Tester' })).toBeVisible()
  await expect(championTester).toContainText('Markus Stein')
  await expect(championTester).toContainText('Teilweise bewiesen')
  await expect(championTester).toContainText('Inside Information / Bad News')
  await expect(championTester).toContainText('Internal Selling')
  await expect(championTester).toContainText('Economic-Buyer-Zugang')
  await expect(championTester).toContainText('Strukturiert, nicht evidenzverankert')
  await expect(championTester).toContainText('Internal Selling konkret testen')
  await expect(championTester).toContainText('Beobachtbares internes Verkaufen zugunsten der Opportunity')

  await expect(page.getByRole('heading', { name: 'Offene Risiken' })).toBeVisible()
  await expect(page.getByText('Paper Process ist nicht belastbar bestätigt', { exact: true })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Nächste Aktionen' })).toBeVisible()
  await expect(page.getByText('Champion um Einführung beim Economic Buyer bitten', { exact: true })).toBeVisible()

  await expect(page.getByRole('heading', { name: 'Direkt in den nächsten Arbeitsschritt' })).toBeVisible()
  await expect(page.getByRole('link', { name: /Evidenz prüfen/ })).toBeVisible()
  await expect(page.getByRole('button', { name: /Projekt bearbeiten/ })).toBeVisible()

  const qualificationSnapshot = page.locator('.qualification-section')
  await expect(qualificationSnapshot.getByRole('heading', { name: 'MEDDPICC-Kurzstatus' })).toBeVisible()
  await expect(qualificationSnapshot.getByText('Economic Buyer', { exact: true }).first()).toBeVisible()
  await expect(qualificationSnapshot.getByText(/keine Win Probability/i)).toBeVisible()

  expect(runtimeErrors).toEqual([])
})

test('zeigt bei einem neuen Projekt fachlich korrekte Empty States', async ({ page }) => {
  await page.goto('/meddpicc-workbench/')

  await page.getByRole('button', { name: 'Neues Projekt' }).click()
  await page.getByLabel('Account').fill('Leere Beispiel AG')
  await page.getByLabel('Projektname').fill('Neue Opportunity')
  await page.getByRole('button', { name: 'Projekt erstellen' }).click()

  await expect(page.getByText('Keine offenen Risiken erfasst.', { exact: true })).toBeVisible()
  await expect(page.getByText('Keine offenen nächsten Aktionen vorhanden.', { exact: true })).toBeVisible()

  const inspector = page.locator('.inspector-panel')
  await expect(inspector).toContainText('5 deterministisch abgeleitete Qualification Gaps')
  await expect(inspector).toContainText('Kundenseitiger Pain ist noch nicht konkret identifiziert.')
  await expect(inspector).toContainText('Economic Buyer ist noch nicht belastbar validiert.')
  await expect(inspector).not.toContainText('Die aktuellen v0.1-Regeln erkennen kein offenes Qualification Gap.')

  const recommendations = page.locator('.next-best-action-panel')
  await expect(recommendations).toContainText('5 deterministisch abgeleitete Empfehlungen')
  await expect(recommendations.locator('.next-best-action-item')).toHaveCount(3)
  await expect(recommendations).toContainText('Kundenseitigen Pain konkretisieren')
  await expect(recommendations).toContainText('Economic-Buyer-Candidate identifizieren und Authority prüfen')
  await expect(recommendations).toContainText('Kundenseitigen Decision Process gemeinsam abbilden')

  const gates = page.locator('.qualification-gates-panel')
  await expect(gates.locator('.qualification-gate-card')).toHaveCount(3)
  await expect(gates.locator('.qualification-gate-status--not-ready')).toHaveCount(3)

  const pocGate = gates.locator('.qualification-gate-card').filter({ hasText: 'POC / Pilot' })
  await expect(pocGate).toContainText('Kundenseitigen Pain konkretisieren')

  const proposalGate = gates.locator('.qualification-gate-card').filter({ hasText: 'Proposal / Pricing' })
  await expect(proposalGate).toContainText('Nicht bereit')

  const commitGate = gates.locator('.qualification-gate-card').filter({ hasText: 'Commit Forecast' })
  await expect(commitGate).toContainText('Nicht bereit')

  const championTester = page.locator('.champion-tester-panel')
  await expect(championTester.getByRole('heading', { name: 'Champion Tester' })).toBeVisible()
  await expect(championTester).toContainText('0 aktive Candidates')
  await expect(championTester).toContainText('Kein aktiver Champion-Candidate vorhanden.')

  const context = page.locator('.opportunity-context-meta')
  await expect(context.getByText('Unbekannt', { exact: true })).toHaveCount(4)
  await expect(page.getByText('Der Deal hat keine Risiken.', { exact: true })).toHaveCount(0)
  await expect(page.getByText('Keine Aktion notwendig.', { exact: true })).toHaveCount(0)
})

test('erfasst Evidenz im zentralen Register', async ({ page }) => {
  await page.goto('/meddpicc-workbench/')

  await page.getByRole('link', { name: 'Evidenzregister' }).click()
  await expect(page.getByRole('heading', { name: 'Evidenzregister' })).toBeVisible()

  await page
    .getByRole('textbox', { name: 'Aussage', exact: true })
    .fill('Testaussage für den browserbasierten Evidenz-Flow.')
  await page.getByLabel('Klassifikation').selectOption('assumption')
  await page.getByLabel('Evidenzqualität').selectOption('low')
  await page.getByLabel('Verifikation').selectOption('unconfirmed')
  await page.getByLabel('Economic Buyer').check()
  await page.getByRole('button', { name: 'Evidenz hinzufügen' }).click()

  await expect(page.getByText('Testaussage für den browserbasierten Evidenz-Flow.', { exact: true })).toBeVisible()
  await expect(page.getByText('Annahme', { exact: true }).last()).toBeVisible()
  await expect(page.getByText('Ungespeicherte Änderungen')).toBeVisible()
})
