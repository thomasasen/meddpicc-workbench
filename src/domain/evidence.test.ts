import { describe, expect, it } from 'vitest'

import { createEvidence } from './evidence'

describe('createEvidence', () => {
  it('normalisiert optionale Texte und dedupliziert MEDDPICC-Bereiche', () => {
    const evidence = createEvidence(
      {
        statement: '  CFO bestätigt Budgetrahmen.  ',
        classification: 'customer_statement',
        quality: 'high',
        verification: 'single_source',
        sourceStakeholderId: 'stakeholder_cfo',
        sourceDate: '2026-10-05',
        context: '  Steering Committee  ',
        referenceId: '',
        relatedAreas: ['economicBuyer', 'economicBuyer', 'metrics'],
      },
      {
        id: 'evidence_test_001',
        now: new Date('2026-10-05T17:30:00.000Z'),
      },
    )

    expect(evidence).toEqual({
      id: 'evidence_test_001',
      classification: 'customer_statement',
      quality: 'high',
      statement: 'CFO bestätigt Budgetrahmen.',
      sourceStakeholderId: 'stakeholder_cfo',
      sourceDate: '2026-10-05',
      context: 'Steering Committee',
      referenceId: null,
      verification: 'single_source',
      relatedAreas: ['economicBuyer', 'metrics'],
      createdAt: '2026-10-05T17:30:00.000Z',
    })
  })
})
