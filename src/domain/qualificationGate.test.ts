import { describe, expect, it } from 'vitest'

import { defaultProject } from '../data/defaultProject'
import { createNewProject } from '../data/newProject'
import {
  assessQualificationGate,
  assessQualificationGates,
  qualificationGateIds,
  type QualificationGateAssessment,
} from './qualificationGate'

function gate(
  assessments: readonly QualificationGateAssessment[],
  gateId: QualificationGateAssessment['gateId'],
): QualificationGateAssessment {
  const assessment = assessments.find((item) => item.gateId === gateId)
  expect(assessment).toBeDefined()
  return assessment as QualificationGateAssessment
}

function fullyQualifiedProject() {
  const project = structuredClone(defaultProject)

  const economicBuyer = project.meddpicc.economicBuyer.candidates[0]
  expect(economicBuyer).toBeDefined()
  if (economicBuyer) {
    economicBuyer.identityStatus = 'confirmed'
    economicBuyer.authorityStatus = 'confirmed'
    economicBuyer.directAccess = true
    economicBuyer.engagementStatus = 'direct'
    economicBuyer.priorityStatus = 'confirmed'
  }

  project.meddpicc.decisionProcess.steps.forEach((step) => {
    if (!step.required) return
    step.status = 'confirmed'
    if (step.ownerStakeholderId === null) step.ownerStakeholderId = 'st_champion'
  })

  project.meddpicc.paperProcess.steps.forEach((step) => {
    if (!step.required) return
    step.status = 'confirmed'
    if (step.ownerStakeholderId === null) step.ownerStakeholderId = 'st_procurement'
    if (step.durationBusinessDays === null) step.durationBusinessDays = 5
  })

  const champion = project.meddpicc.champions.people[0]
  expect(champion).toBeDefined()
  if (champion) {
    champion.behaviors.push(
      {
        type: 'confirmed_personal_win',
        evidenceIds: ['ev_champion_01'],
        notes: 'Hat den eigenen Personal Win belastbar bestätigt.',
      },
      {
        type: 'sold_internally',
        evidenceIds: ['ev_champion_01'],
        notes: 'Hat die Lösung intern aktiv vertreten.',
      },
      {
        type: 'enabled_economic_buyer_access',
        evidenceIds: ['ev_champion_01'],
        notes: 'Hat direkten Zugang zum Economic Buyer hergestellt.',
      },
    )
  }

  project.meddpicc.competition.status = 'partial'
  const competitionEvidence = project.evidence.find((item) => item.id === 'ev_comp_01')
  expect(competitionEvidence).toBeDefined()
  if (competitionEvidence) {
    competitionEvidence.classification = 'customer_statement'
    competitionEvidence.verification = 'corroborated'
  }

  return project
}

describe('Qualification Gates', () => {
  it('liefert die drei v0.1-Gates in stabiler Reihenfolge', () => {
    const assessments = assessQualificationGates(structuredClone(defaultProject))

    expect(assessments.map((item) => item.gateId)).toEqual(qualificationGateIds)
  })

  it('liefert für denselben Projektstand deterministisch dieselben Assessments', () => {
    const first = assessQualificationGates(structuredClone(defaultProject))
    const second = assessQualificationGates(structuredClone(defaultProject))

    expect(second).toEqual(first)
  })

  it('empfiehlt für die Demo beim POC/Pilot eine Pause wegen des offenen Decision Process', () => {
    const assessment = assessQualificationGate(structuredClone(defaultProject), 'poc-pilot')

    expect(assessment.status).toBe('not-ready')
    expect(assessment.missingRequired.map((item) => item.id)).toContain('poc.decision-process')
    expect(assessment.nextBestActionRuleId).toBe('nba.decision-process.validate')
    expect(assessment.nextStep).toBe('Geplante und unbekannte Decision-Process-Schritte kundenseitig validieren')
    expect(assessment.limitations.join(' ')).toContain('Success Criteria')
  })

  it('bewertet Proposal / Pricing in der Demo als bedingt statt künstlich zu blockieren', () => {
    const assessment = assessQualificationGate(structuredClone(defaultProject), 'proposal-pricing')

    expect(assessment.status).toBe('conditional')
    expect(assessment.missingRequired).toHaveLength(0)
    expect(assessment.missingRecommended.map((item) => item.id)).toEqual(
      expect.arrayContaining(['proposal.economic-buyer', 'proposal.decision-process']),
    )
    expect(assessment.nextBestActionRuleId).toBe('nba.economic-buyer.advance')
  })

  it('bewertet Commit Forecast in der Demo wegen EB, Decision Process und Paper Process als nicht bereit', () => {
    const assessment = assessQualificationGate(structuredClone(defaultProject), 'commit-forecast')

    expect(assessment.status).toBe('not-ready')
    expect(assessment.missingRequired.map((item) => item.id)).toEqual(
      expect.arrayContaining(['commit.economic-buyer', 'commit.decision-process', 'commit.paper-process']),
    )
    expect(assessment.nextBestActionRuleId).toBe('nba.economic-buyer.advance')
    expect(assessment.verdict).toContain('Pause empfohlen')
  })

  it('behandelt ein fachlich leeres Projekt bei allen Gates als nicht bereit', () => {
    const project = createNewProject(
      { accountName: 'Leere Beispiel AG', name: 'Neue Opportunity' },
      { now: new Date('2026-10-06T12:00:00.000Z'), projectId: 'qualification_gate_empty' },
    )

    const assessments = assessQualificationGates(project)

    expect(assessments.every((item) => item.status === 'not-ready')).toBe(true)

    const poc = gate(assessments, 'poc-pilot')
    expect(poc.missingRequired.map((item) => item.id)).toEqual(
      expect.arrayContaining(['poc.pain', 'poc.decision-criteria', 'poc.decision-process']),
    )
    expect(poc.nextBestActionRuleId).toBe('nba.pain.clarify-impact')

    const proposal = gate(assessments, 'proposal-pricing')
    expect(proposal.missingRequired.map((item) => item.id)).toContain('proposal.metrics')

    const commit = gate(assessments, 'commit-forecast')
    expect(commit.missingRequired.map((item) => item.id)).toEqual(
      expect.arrayContaining(['commit.target-close', 'commit.metrics-confirmed', 'commit.economic-impact']),
    )
  })

  it('wertet ein customerConfirmed-Flag ohne belastbare Evidence nicht als erfüllte Metric-Voraussetzung', () => {
    const project = structuredClone(defaultProject)
    const evidence = project.evidence.find((item) => item.id === 'ev_metric_01')
    expect(evidence).toBeDefined()
    if (!evidence) return

    project.meddpicc.metrics.metrics.forEach((metric) => {
      metric.evidenceIds = ['ev_metric_01']
      metric.customerConfirmed = true
    })
    evidence.classification = 'assumption'
    evidence.verification = 'unconfirmed'

    const assessment = assessQualificationGate(project, 'proposal-pricing')
    const metricRequirement = assessment.requirements.find((item) => item.id === 'proposal.metrics')

    expect(metricRequirement?.satisfied).toBe(false)
    expect(assessment.status).toBe('not-ready')
  })

  it('wertet einen strukturierten Pain mit reiner Assumption-Evidence nicht als erfüllt', () => {
    const project = structuredClone(defaultProject)
    const evidence = project.evidence.find((item) => item.id === 'ev_pain_01')
    expect(evidence).toBeDefined()
    if (!evidence) return

    project.meddpicc.pain.items.forEach((item) => {
      item.evidenceIds = ['ev_pain_01']
    })
    project.meddpicc.pain.evidenceIds = ['ev_pain_01']
    evidence.classification = 'assumption'
    evidence.verification = 'unconfirmed'

    const assessment = assessQualificationGate(project, 'poc-pilot')
    const painRequirement = assessment.requirements.find((item) => item.id === 'poc.pain')

    expect(painRequirement?.satisfied).toBe(false)
    expect(assessment.status).toBe('not-ready')
  })

  it('wertet priorisierte Decision Criteria ohne belastbare Evidence nicht als erfüllt', () => {
    const project = structuredClone(defaultProject)
    const evidenceIds = project.meddpicc.decisionCriteria.criteria.flatMap((criterion) => criterion.evidenceIds)

    project.evidence
      .filter((item) => evidenceIds.includes(item.id))
      .forEach((item) => {
        item.classification = 'assumption'
        item.verification = 'unconfirmed'
      })

    const assessment = assessQualificationGate(project, 'poc-pilot')
    const requirement = assessment.requirements.find((item) => item.id === 'poc.decision-criteria')

    expect(requirement?.satisfied).toBe(false)
    expect(assessment.status).toBe('not-ready')
  })

  it('verlangt für Commit ein konkretes Target Close', () => {
    const project = fullyQualifiedProject()
    project.project.targetCloseDate = null

    const assessment = assessQualificationGate(project, 'commit-forecast')

    expect(assessment.missingRequired.map((item) => item.id)).toContain('commit.target-close')
    expect(assessment.status).toBe('not-ready')
  })

  it('liefert ready, wenn alle im v0.1-Prüfumfang definierten Voraussetzungen erfüllt sind', () => {
    const assessments = assessQualificationGates(fullyQualifiedProject())

    expect(assessments.map((item) => item.status)).toEqual(['ready', 'ready', 'ready'])
    expect(assessments.every((item) => item.nextStep === null)).toBe(true)
  })

  it('mutiert den kanonischen Projektstand nicht', () => {
    const project = structuredClone(defaultProject)
    const original = structuredClone(project)

    assessQualificationGates(project)

    expect(project).toEqual(original)
  })
})
