import { describe, expect, it } from 'vitest'

import { qualificationStatusLabels } from './qualificationStatus'

describe('qualificationStatusLabels', () => {
  it('stellt alle internen Statuswerte auf Deutsch dar', () => {
    expect(qualificationStatusLabels).toEqual({
      confirmed: 'Bestätigt',
      partial: 'Teilweise',
      assumption: 'Annahme',
      unknown: 'Unbekannt',
      risk: 'Risiko',
    })
  })
})
