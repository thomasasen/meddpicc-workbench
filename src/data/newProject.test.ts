import { describe, expect, it } from 'vitest'

import { validateProject } from '../domain/projectSchema'
import { createNewProject } from './newProject'

describe('createNewProject', () => {
  it('erzeugt ein valides fachlich leeres Projekt', () => {
    const project = createNewProject(
      {
        accountName: 'Neue Beispiel AG',
        name: 'CRM Auswahl 2027',
        owner: 'Test Seller',
        currency: 'EUR',
      },
      {
        now: new Date('2026-10-05T16:30:00.000Z'),
        projectId: 'project_test_001',
      },
    )

    expect(validateProject(project).success).toBe(true)
    expect(project.projectId).toBe('project_test_001')
    expect(project.revision).toBe(1)
    expect(project.project.accountName).toBe('Neue Beispiel AG')
    expect(project.project.dealValue).toBeNull()
    expect(project.stakeholders).toEqual([])
    expect(project.evidence).toEqual([])
    expect(project.risks).toEqual([])
    expect(project.actions).toEqual([])
    expect(project.meddpicc.metrics.status).toBe('unknown')
    expect(project.meddpicc.metrics.confidence).toBe(0)
    expect(project.meddpicc.metrics.metrics).toEqual([])
    expect(project.meddpicc.economicBuyer.candidates).toEqual([])
    expect(project.meddpicc.decisionCriteria.criteria).toEqual([])
    expect(project.meddpicc.decisionProcess.steps).toEqual([])
    expect(project.meddpicc.paperProcess.steps).toEqual([])
    expect(project.meddpicc.pain.items).toEqual([])
    expect(project.meddpicc.champions.people).toEqual([])
    expect(project.meddpicc.competition.knownAlternatives).toEqual([])
    expect(project.history).toHaveLength(1)
    expect(project.history[0]?.type).toBe('project_created')
  })

  it('übernimmt keine Demo-Inhalte', () => {
    const project = createNewProject(
      {
        accountName: 'Leerer Account',
        name: 'Leeres Projekt',
      },
      {
        now: new Date('2026-10-05T16:30:00.000Z'),
        projectId: 'project_empty_001',
      },
    )

    expect(project.project.accountName).not.toContain('Beispielwerke')
    expect(project.references).toEqual([])
    expect(project.calculators.businessCase?.inputs.affectedSalesEmployees).toBeNull()
  })
})
