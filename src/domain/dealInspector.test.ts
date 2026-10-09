import { describe, expect, it } from 'vitest'

import { defaultProject } from '../data/defaultProject'
import { createNewProject } from '../data/newProject'
import { inspectDeal } from './dealInspector'

describe('Deal Inspector', () => {
  it('liefert für die Demo wenige, nachvollziehbare Qualification Gaps in stabiler Priorität', () => {
    const findings = inspectDeal(structuredClone(defaultProject))

    expect(findings.map((finding) => finding.ruleId)).toEqual([
      'metrics.customer-confirmed',
      'economic-buyer.validated',
      'decision-process.ready',
      'paper-process.ready',
      'champion.proven',
    ])

    expect(findings[0]).toMatchObject({
      area: 'metrics',
      severity: 'high',
      title: 'Es gibt noch keine kundenseitig bestätigte Metric.',
    })
    expect(findings[1]).toMatchObject({
      area: 'economicBuyer',
      severity: 'high',
      title: 'Economic Buyer ist noch nicht belastbar validiert.',
      entityIds: ['st_eb'],
    })
    expect(findings[1]?.evidenceIds).toContain('ev_eb_01')
    expect(findings[1]?.missingEvidence).toEqual(
      expect.arrayContaining([
        'Identität des Economic Buyers direkt bestätigen',
        'Finale wirtschaftliche Entscheidungsautorität bestätigen',
        'Direkten Zugang bzw. direkte Interaktion mit dem Economic Buyer herstellen',
      ]),
    )

    const paperProcess = findings.find((finding) => finding.ruleId === 'paper-process.ready')
    expect(paperProcess?.entityIds).toEqual(expect.arrayContaining(['pp_01', 'pp_02', 'pp_03']))
    expect(paperProcess?.inputs).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          path: 'project.targetCloseDate',
          value: '2027-03-31',
        }),
      ]),
    )
  })

  it('behandelt ein fachlich leeres neues Projekt als unbekannt statt als gesund', () => {
    const project = createNewProject(
      {
        accountName: 'Leere Beispiel AG',
        name: 'Neue Opportunity',
      },
      {
        now: new Date('2026-10-06T12:00:00.000Z'),
        projectId: 'project_inspector_empty',
      },
    )

    const findings = inspectDeal(project)

    expect(findings.map((finding) => finding.ruleId)).toEqual([
      'pain.identified',
      'economic-buyer.validated',
      'decision-process.ready',
      'champion.proven',
      'paper-process.ready',
    ])
    expect(findings.find((finding) => finding.ruleId === 'paper-process.ready')?.severity).toBe('medium')
    expect(findings.some((finding) => finding.ruleId === 'metrics.customer-confirmed')).toBe(false)
  })

  it('erkennt fehlende kundenseitige Metric-Bestätigung erst, wenn Pain oder Metrics vorhanden sind', () => {
    const project = structuredClone(defaultProject)
    project.meddpicc.metrics.metrics.forEach((metric) => {
      metric.customerConfirmed = false
    })

    const findings = inspectDeal(project)
    const metricFinding = findings.find((finding) => finding.ruleId === 'metrics.customer-confirmed')

    expect(metricFinding).toBeDefined()
    expect(metricFinding?.severity).toBe('high')
    expect(metricFinding?.evidenceIds).toEqual(expect.arrayContaining(['ev_metric_01', 'ev_metric_02']))
  })

  it('meldet keinen Economic-Buyer-Gap, wenn Identität, Autorität, direkter Zugang, Priorität und Evidence bestätigt sind', () => {
    const project = structuredClone(defaultProject)
    const candidate = project.meddpicc.economicBuyer.candidates[0]
    expect(candidate).toBeDefined()
    if (!candidate) return

    candidate.identityStatus = 'confirmed'
    candidate.authorityStatus = 'confirmed'
    candidate.directAccess = true
    candidate.engagementStatus = 'direct'
    candidate.priorityStatus = 'confirmed'

    expect(inspectDeal(project).some((finding) => finding.ruleId === 'economic-buyer.validated')).toBe(false)
  })

  it('behandelt Assumption-Evidence nicht als belastbaren Nachweis', () => {
    const project = structuredClone(defaultProject)
    const evidence = project.evidence.find((item) => item.id === 'ev_dp_01')
    expect(evidence).toBeDefined()
    if (!evidence) return

    evidence.classification = 'assumption'
    evidence.verification = 'unconfirmed'

    project.meddpicc.decisionProcess.steps.forEach((step) => {
      step.status = 'confirmed'
    })

    const finding = inspectDeal(project).find((item) => item.ruleId === 'decision-process.ready')
    expect(finding).toBeDefined()
  })

  it('akzeptiert eine belastbare wirtschaftliche Metric ohne jede operative Metric einzeln zu monetarisieren', () => {
    const project = structuredClone(defaultProject)

    expect(inspectDeal(project).some((finding) => finding.ruleId === 'metrics.economic-impact-quantified')).toBe(false)

    // Ein bestätigter operativer Ist-Wert ohne monetäre Ableitung bleibt kritisch.
    project.meddpicc.metrics.metrics[0]!.customerConfirmed = true
    project.meddpicc.metrics.metrics.forEach((metric) => {
      metric.economicImpact.value = null
      metric.economicImpact.derivation = null
    })

    const finding = inspectDeal(project).find((item) => item.ruleId === 'metrics.economic-impact-quantified')
    expect(finding).toBeDefined()
    expect(finding?.severity).toBe('high')
  })

  it('bewertet blockierte erforderliche Prozessschritte weiterhin als Gap', () => {
    const project = structuredClone(defaultProject)
    const step = project.meddpicc.paperProcess.steps[0]
    expect(step).toBeDefined()
    if (!step) return

    step.status = 'blocked'
    step.durationBusinessDays = 5

    expect(inspectDeal(project).some((finding) => finding.ruleId === 'paper-process.ready')).toBe(true)
  })

  it('akzeptiert einen Champion erst nach belegten Verhaltenssignalen statt nur aufgrund des Statuslabels', () => {
    const project = structuredClone(defaultProject)
    const champion = project.meddpicc.champions.people[0]
    expect(champion).toBeDefined()
    if (!champion) return

    champion.status = 'confirmed'
    champion.influence = 'medium'
    expect(inspectDeal(project).some((finding) => finding.ruleId === 'champion.proven')).toBe(true)

    champion.behaviors.push(
      {
        type: 'sold_internally',
        evidenceIds: ['ev_champion_01'],
        notes: 'Hat den Business Case intern vertreten.',
      },
      {
        type: 'enabled_economic_buyer_access',
        evidenceIds: ['ev_champion_01'],
        notes: 'Hat direkten Zugang zum Economic Buyer hergestellt.',
      },
    )

    expect(inspectDeal(project).some((finding) => finding.ruleId === 'champion.proven')).toBe(false)

    const evidence = project.evidence.find((item) => item.id === 'ev_champion_01')
    expect(evidence).toBeDefined()
    if (!evidence) return

    evidence.classification = 'assumption'
    evidence.verification = 'unconfirmed'
    expect(inspectDeal(project).some((finding) => finding.ruleId === 'champion.proven')).toBe(true)
  })

  it('liefert bei gleichem Projektstand deterministisch dieselben Findings', () => {
    const first = inspectDeal(structuredClone(defaultProject))
    const second = inspectDeal(structuredClone(defaultProject))

    expect(second).toEqual(first)
  })
})
