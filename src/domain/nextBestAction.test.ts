import { describe, expect, it } from 'vitest'

import { defaultProject } from '../data/defaultProject'
import { createNewProject } from '../data/newProject'
import { inspectDeal } from './dealInspector'
import { deriveNextBestActions } from './nextBestAction'

function recommendationsFor(project = structuredClone(defaultProject)) {
  return deriveNextBestActions(project, inspectDeal(project))
}

describe('Next Best Action Engine', () => {
  it('liefert bei gleichem Projektstand dieselben Empfehlungen in derselben Reihenfolge', () => {
    const firstProject = structuredClone(defaultProject)
    const secondProject = structuredClone(defaultProject)

    expect(deriveNextBestActions(secondProject, inspectDeal(secondProject))).toEqual(
      deriveNextBestActions(firstProject, inspectDeal(firstProject)),
    )
  })

  it('identifiziert zuerst einen Economic-Buyer-Candidate, wenn keiner bekannt ist', () => {
    const project = structuredClone(defaultProject)
    project.meddpicc.economicBuyer.candidates = []

    const recommendation = recommendationsFor(project).find(
      (item) => item.ruleId === 'nba.economic-buyer.advance',
    )

    expect(recommendation?.title).toBe('Economic-Buyer-Candidate identifizieren und Authority prüfen')
    expect(recommendation?.priority).toBe('high')
  })

  it('validiert Authority, wenn ein EB-Candidate bekannt, aber nicht bestätigt ist', () => {
    const project = structuredClone(defaultProject)
    const candidate = project.meddpicc.economicBuyer.candidates[0]
    expect(candidate).toBeDefined()
    if (!candidate) return

    candidate.identityStatus = 'confirmed'
    candidate.authorityStatus = 'reported'

    const recommendation = recommendationsFor(project).find(
      (item) => item.ruleId === 'nba.economic-buyer.advance',
    )

    expect(recommendation?.title).toBe('Tatsächliche Economic-Buyer-Authority validieren')
  })

  it('empfiehlt bei fehlendem EB-Zugang und belastbarem Champion eine gezielte Introduction', () => {
    const project = structuredClone(defaultProject)
    const candidate = project.meddpicc.economicBuyer.candidates[0]
    const champion = project.meddpicc.champions.people[0]
    expect(candidate).toBeDefined()
    expect(champion).toBeDefined()
    if (!candidate || !champion) return

    candidate.identityStatus = 'confirmed'
    candidate.authorityStatus = 'confirmed'
    candidate.directAccess = false
    candidate.engagementStatus = 'indirect'
    candidate.priorityStatus = 'confirmed'

    champion.behaviors.push({
      type: 'sold_internally',
      evidenceIds: ['ev_champion_01'],
      notes: 'Hat den Business Case intern aktiv vertreten.',
    })

    const recommendation = recommendationsFor(project).find(
      (item) => item.ruleId === 'nba.economic-buyer.advance',
    )

    expect(recommendation?.title).toBe('Champion gezielt um direkte Economic-Buyer-Introduction bitten')
  })

  it('unterstellt keine Champion-Introduction, wenn der Champion nicht belastbar ist', () => {
    const project = structuredClone(defaultProject)
    const candidate = project.meddpicc.economicBuyer.candidates[0]
    expect(candidate).toBeDefined()
    if (!candidate) return

    candidate.identityStatus = 'confirmed'
    candidate.authorityStatus = 'confirmed'
    candidate.directAccess = false
    candidate.engagementStatus = 'indirect'

    const recommendation = recommendationsFor(project).find(
      (item) => item.ruleId === 'nba.economic-buyer.advance',
    )

    expect(recommendation?.title).not.toContain('Introduction bitten')
    expect(recommendation?.title).toBe('Champion-Candidate testen und einen belastbaren EB-Zugangspfad klären')
  })

  it('führt Champion-Test und EB-Access-Gap zu einer deduplizierten Empfehlung zusammen', () => {
    const project = structuredClone(defaultProject)
    const candidate = project.meddpicc.economicBuyer.candidates[0]
    expect(candidate).toBeDefined()
    if (!candidate) return

    candidate.identityStatus = 'confirmed'
    candidate.authorityStatus = 'confirmed'
    candidate.directAccess = false
    candidate.engagementStatus = 'indirect'

    const recommendations = recommendationsFor(project)
    const combined = recommendations.find((item) => item.ruleId === 'nba.economic-buyer.advance')

    expect(combined?.triggeringFindingRuleIds).toEqual(
      expect.arrayContaining(['economic-buyer.validated', 'champion.proven']),
    )
    expect(recommendations.some((item) => item.ruleId === 'nba.champion.test')).toBe(false)
  })

  it('bildet einen fehlenden Decision Process als konkrete nächste Aktion ab', () => {
    const project = createNewProject(
      { accountName: 'Leere Beispiel AG', name: 'Neue Opportunity' },
      { now: new Date('2026-10-06T12:00:00.000Z'), projectId: 'nba_empty_project' },
    )

    const recommendation = recommendationsFor(project).find(
      (item) => item.ruleId === 'nba.decision-process.validate',
    )

    expect(recommendation?.title).toBe('Kundenseitigen Decision Process gemeinsam abbilden')
  })

  it('priorisiert bei einem blockierten erforderlichen Decision-Process-Schritt den Blocker', () => {
    const project = structuredClone(defaultProject)
    const step = project.meddpicc.decisionProcess.steps[1]
    expect(step).toBeDefined()
    if (!step) return

    step.status = 'blocked'

    const recommendation = recommendationsFor(project).find(
      (item) => item.ruleId === 'nba.decision-process.validate',
    )

    expect(recommendation?.title).toBe(
      'Blocker im Decision Process klären, bevor nachgelagerte Schritte geplant werden',
    )
  })

  it('macht bei Target Close und unbekannten Paper-Process-Lead-Times die Klärung high-priority', () => {
    const project = structuredClone(defaultProject)

    const recommendation = recommendationsFor(project).find(
      (item) => item.ruleId === 'nba.paper-process.de-risk',
    )

    expect(recommendation).toMatchObject({
      priority: 'high',
      title: 'Paper-Process-Owner und Lead Times bestätigen',
    })
    expect(recommendation?.inputs).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ path: 'project.targetCloseDate', value: '2027-03-31' }),
      ]),
    )
  })

  it('validiert Current State und Desired Outcome, wenn Pain vorhanden aber Metrics unbestätigt sind', () => {
    const project = structuredClone(defaultProject)
    project.meddpicc.metrics.metrics.forEach((metric) => {
      metric.customerConfirmed = false
    })

    const recommendation = recommendationsFor(project).find(
      (item) => item.ruleId === 'nba.metrics.validate-value',
    )

    expect(recommendation?.title).toBe('Current State und Desired Outcome mit dem Kunden quantifizieren')
  })

  it('validiert wirtschaftlichen Impact, wenn operative Metrics vorhanden und bestätigt sind', () => {
    const project = structuredClone(defaultProject)
    project.meddpicc.metrics.metrics.forEach((metric) => {
      metric.customerConfirmed = true
      metric.economicImpact.value = null
      metric.economicImpact.derivation = null
    })

    const recommendation = recommendationsFor(project).find(
      (item) => item.ruleId === 'nba.metrics.validate-value',
    )

    expect(recommendation?.title).toBe('Wirtschaftlichen Impact einer relevanten Metric validieren')
  })

  it('behandelt Assumption-/Unconfirmed-Evidence nicht als Champion-Voraussetzung für eine EB-Introduction', () => {
    const project = structuredClone(defaultProject)
    const candidate = project.meddpicc.economicBuyer.candidates[0]
    const champion = project.meddpicc.champions.people[0]
    const evidence = project.evidence.find((item) => item.id === 'ev_champion_01')
    expect(candidate).toBeDefined()
    expect(champion).toBeDefined()
    expect(evidence).toBeDefined()
    if (!candidate || !champion || !evidence) return

    candidate.identityStatus = 'confirmed'
    candidate.authorityStatus = 'confirmed'
    candidate.directAccess = false
    candidate.engagementStatus = 'indirect'
    champion.behaviors.push({
      type: 'sold_internally',
      evidenceIds: ['ev_champion_01'],
      notes: 'Nur als unbestätigte Annahme dokumentiert.',
    })
    evidence.classification = 'assumption'
    evidence.verification = 'unconfirmed'

    const recommendation = recommendationsFor(project).find(
      (item) => item.ruleId === 'nba.economic-buyer.advance',
    )

    expect(recommendation?.title).not.toBe('Champion gezielt um direkte Economic-Buyer-Introduction bitten')
  })

  it('erzeugt keine persistierten project.actions', () => {
    const project = structuredClone(defaultProject)
    const originalActions = structuredClone(project.actions)

    recommendationsFor(project)

    expect(project.actions).toEqual(originalActions)
  })
})
