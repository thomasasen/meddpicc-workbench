import { describe, expect, it } from 'vitest'

import { createReference, updateReference } from './reference'

describe('reference domain', () => {
  it('normalisiert Reference-Records und hält die ID stabil', () => {
    const reference = createReference(
      {
        type: 'meeting',
        title: '  CFO Steering  ',
        date: '2026-10-05',
        externalId: '  CRM-4711  ',
        url: '  https://example.test/meeting  ',
        notes: '  Kundentermin  ',
      },
      { id: 'ref_test_001' },
    )

    expect(reference).toEqual({
      id: 'ref_test_001',
      type: 'meeting',
      title: 'CFO Steering',
      date: '2026-10-05',
      externalId: 'CRM-4711',
      url: 'https://example.test/meeting',
      notes: 'Kundentermin',
    })

    const updated = updateReference(reference, {
      type: 'document',
      title: ' Business Case ',
      date: '',
      externalId: '',
      url: '',
      notes: '',
    })

    expect(updated.id).toBe('ref_test_001')
    expect(updated).toMatchObject({
      type: 'document',
      title: 'Business Case',
      date: null,
      externalId: null,
      url: null,
      notes: '',
    })
  })
})
