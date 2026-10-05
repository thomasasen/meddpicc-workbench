import { describe, expect, it } from 'vitest'

import { createAction, createRisk, updateAction, updateRisk } from './riskAction'

describe('riskAction domain', () => {
  it('erzeugt ein Risk deterministisch und normalisiert optionale Texte sowie Referenzen', () => {
    const risk = createRisk(
      {
        title: '  Economic Buyer nicht validiert  ',
        severity: 'high',
        status: 'open',
        relatedArea: 'economicBuyer',
        relatedEntityIds: ['st_eb', 'st_eb', '  '],
        impact: '  Budgetautorität und Priorität sind unbestätigt.  ',
        mitigation: '  CFO-Gespräch vorbereiten.  ',
        owner: '  Test Seller  ',
        dueDate: '2026-10-12',
      },
      {
        id: 'risk_test_001',
        now: new Date('2026-10-05T18:00:00.000Z'),
      },
    )

    expect(risk).toEqual({
      id: 'risk_test_001',
      title: 'Economic Buyer nicht validiert',
      severity: 'high',
      status: 'open',
      relatedArea: 'economicBuyer',
      relatedEntityIds: ['st_eb'],
      impact: 'Budgetautorität und Priorität sind unbestätigt.',
      mitigation: 'CFO-Gespräch vorbereiten.',
      owner: 'Test Seller',
      dueDate: '2026-10-12',
      openedAt: '2026-10-05T18:00:00.000Z',
    })
  })

  it('erzeugt eine Action deterministisch und hält Desired Evidence getrennt vom Gap', () => {
    const action = createAction(
      {
        title: '  Meeting mit CFO vorbereiten  ',
        status: 'open',
        owner: '  Test Seller  ',
        dueDate: '',
        relatedArea: 'economicBuyer',
        relatedRiskId: ' risk_test_001 ',
        relatedGap: '  Authority ist nur indirekt belegt.  ',
        desiredEvidence: '  CFO bestätigt Entscheidungsautorität und Priorität.  ',
        evidenceIds: ['ev_01', 'ev_01', ' ev_02 '],
      },
      { id: 'action_test_001' },
    )

    expect(action).toEqual({
      id: 'action_test_001',
      title: 'Meeting mit CFO vorbereiten',
      status: 'open',
      owner: 'Test Seller',
      dueDate: null,
      relatedArea: 'economicBuyer',
      relatedRiskId: 'risk_test_001',
      relatedGap: 'Authority ist nur indirekt belegt.',
      desiredEvidence: 'CFO bestätigt Entscheidungsautorität und Priorität.',
      evidenceIds: ['ev_01', 'ev_02'],
    })
  })

  it('bewahrt bei Updates stabile IDs und Risk-openedAt', () => {
    const risk = createRisk(
      {
        title: 'Risk',
        severity: 'medium',
        status: 'open',
        relatedArea: 'competition',
        relatedEntityIds: [],
        impact: '',
      },
      { id: 'risk_stable', now: new Date('2026-10-05T18:00:00.000Z') },
    )

    const updatedRisk = updateRisk(risk, {
      title: '  Risk aktualisiert  ',
      severity: 'critical',
      status: 'mitigating',
      relatedArea: 'competition',
      relatedEntityIds: [],
      impact: '  Wirkung  ',
      mitigation: '',
      owner: '',
      dueDate: null,
    })

    const action = createAction(
      {
        title: 'Action',
        status: 'open',
        relatedArea: 'competition',
        desiredEvidence: '',
        evidenceIds: [],
      },
      { id: 'action_stable' },
    )
    const updatedAction = updateAction(action, {
      title: '  Action aktualisiert  ',
      status: 'completed',
      relatedArea: 'competition',
      desiredEvidence: '  Evidenz  ',
      evidenceIds: [],
    })

    expect(updatedRisk.id).toBe('risk_stable')
    expect(updatedRisk.openedAt).toBe('2026-10-05T18:00:00.000Z')
    expect(updatedRisk.title).toBe('Risk aktualisiert')
    expect(updatedAction.id).toBe('action_stable')
    expect(updatedAction.title).toBe('Action aktualisiert')
  })
})
