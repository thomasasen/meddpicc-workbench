import { describe, expect, it } from 'vitest'

import { calculateReverseTimeline, subtractBusinessDays } from './reverseTimeline'

describe('Go-Live-Rückwärtsplanung', () => {
  it('rechnet Arbeitstage rückwärts und überspringt Wochenenden', () => {
    expect(subtractBusinessDays('2026-10-12', 1)).toBe('2026-10-09')
    expect(subtractBusinessDays('2026-10-12', 5)).toBe('2026-10-05')
  })

  it('berechnet die Beispielplanung deterministisch vom Go-Live zurück', () => {
    const result = calculateReverseTimeline({
      targetGoLiveDate: '2027-07-01',
      steps: [
        { id: 'implementation', title: 'Implementierung', owner: 'Projektteam', durationBusinessDays: 65 },
        { id: 'contract', title: 'Vertrag & Signatur', owner: 'Legal / Einkauf', durationBusinessDays: 5 },
        {
          id: 'legal',
          title: 'Legal, Datenschutz & Security',
          owner: 'Legal / DSB / IT-Security',
          durationBusinessDays: 15,
        },
        { id: 'procurement', title: 'Procurement / Bestellung', owner: 'Einkauf', durationBusinessDays: 10 },
        { id: 'decision', title: 'Finale Entscheidung', owner: 'Buying Committee', durationBusinessDays: 5 },
      ],
    })

    expect(result.latestStartDate).toBe('2027-02-11')
    expect(result.totalBusinessDays).toBe(100)
    expect(result.steps.map((step) => step.id)).toEqual([
      'decision',
      'procurement',
      'legal',
      'contract',
      'implementation',
    ])
    expect(result.steps[0]).toMatchObject({
      startDate: '2027-02-11',
      endDate: '2027-02-18',
    })
    expect(result.steps.at(-1)).toMatchObject({
      startDate: '2027-04-01',
      endDate: '2027-07-01',
    })
  })

  it('verändert den Input nicht', () => {
    const input = {
      targetGoLiveDate: '2027-07-01',
      steps: [{ id: 'one', title: 'Schritt', owner: '', durationBusinessDays: 5 }],
    }
    const before = structuredClone(input)

    calculateReverseTimeline(input)

    expect(input).toEqual(before)
  })

  it('weist auf ein Go-Live am Wochenende hin', () => {
    const result = calculateReverseTimeline({
      targetGoLiveDate: '2027-07-03',
      steps: [{ id: 'one', title: 'Schritt', owner: '', durationBusinessDays: 5 }],
    })

    expect(result.warnings).toContain('Das Ziel-Go-Live liegt auf einem Wochenende.')
  })

  it('lehnt unbrauchbare Schritte ab statt Scheingenauigkeit zu erzeugen', () => {
    expect(() =>
      calculateReverseTimeline({
        targetGoLiveDate: '2027-07-01',
        steps: [{ id: 'one', title: 'Schritt', owner: '', durationBusinessDays: 0 }],
      }),
    ).toThrow('mindestens einen Arbeitstag')
  })
})
