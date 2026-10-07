import { describe, expect, it } from 'vitest'

import { calculateReverseTimeline, type ReverseTimelineInput } from './reverseTimeline'

const baseInput: ReverseTimelineInput = {
  targetGoLiveDate: '2027-07-01',
  referenceDate: '2027-06-01',
  steps: [
    {
      id: 'implementation',
      label: 'Implementierung',
      duration: 5,
      durationUnit: 'calendar-days',
      owner: 'shared',
      area: 'implementation',
    },
    {
      id: 'legal',
      label: 'Legal',
      duration: 2,
      durationUnit: 'business-days',
      owner: 'customer',
      area: 'paper-process',
    },
  ],
}

describe('calculateReverseTimeline', () => {
  it('rechnet deterministisch vom Target Go-Live rückwärts', () => {
    const result = calculateReverseTimeline(baseInput)

    expect(result.success).toBe(true)
    if (!result.success) return

    expect(result.plan.backwardSegments[0]).toMatchObject({
      id: 'implementation',
      startDate: '2027-06-26',
      endDate: '2027-07-01',
    })
    expect(result.plan.backwardSegments[1]).toMatchObject({
      id: 'legal',
      startDate: '2027-06-24',
      endDate: '2027-06-26',
    })
    expect(result.plan.latestStartDate).toBe('2027-06-24')
  })

  it('überspringt bei Arbeitstagen Samstag und Sonntag', () => {
    const result = calculateReverseTimeline({
      targetGoLiveDate: '2027-03-01',
      referenceDate: '2027-02-01',
      steps: [
        {
          id: 'one-day',
          label: 'Ein Arbeitstag',
          duration: 1,
          durationUnit: 'business-days',
          owner: 'customer',
          area: 'decision-process',
        },
      ],
    })

    expect(result.success).toBe(true)
    if (!result.success) return
    expect(result.plan.latestStartDate).toBe('2027-02-26')
  })

  it('erkennt rechnerischen Kompressionsbedarf', () => {
    const result = calculateReverseTimeline({
      ...baseInput,
      referenceDate: '2027-06-25',
    })

    expect(result.success).toBe(true)
    if (!result.success) return
    expect(result.plan.status).toBe('compression-required')
    expect(result.plan.calendarDaysToLatestStart).toBe(-1)
  })

  it('erkennt ein bereits vergangenes Target Go-Live', () => {
    const result = calculateReverseTimeline({
      ...baseInput,
      referenceDate: '2027-07-02',
    })

    expect(result.success).toBe(true)
    if (!result.success) return
    expect(result.plan.status).toBe('target-before-reference')
  })

  it('validiert fehlende und ungültige Eingaben', () => {
    const result = calculateReverseTimeline({
      targetGoLiveDate: 'kein-datum',
      referenceDate: '2027-01-01',
      steps: [
        {
          id: '',
          label: '',
          duration: 1.5,
          durationUnit: 'calendar-days',
          owner: 'seller',
          area: 'decision-process',
        },
      ],
    })

    expect(result.success).toBe(false)
    if (result.success) return
    expect(result.issues).toContain('Target Go-Live muss ein gültiges Datum sein.')
    expect(result.issues).toContain('Schritt 1: ID fehlt.')
    expect(result.issues).toContain('Schritt 1: Bezeichnung fehlt.')
    expect(result.issues).toContain('Schritt 1: Dauer muss eine ganze Zahl zwischen 0 und 1000 sein.')
  })

  it('lehnt doppelte Schritt-IDs ab', () => {
    const result = calculateReverseTimeline({
      ...baseInput,
      steps: [baseInput.steps[0], { ...baseInput.steps[1], id: baseInput.steps[0].id }],
    })

    expect(result.success).toBe(false)
    if (result.success) return
    expect(result.issues).toContain('Schritt 2: ID ist nicht eindeutig.')
  })

  it('führt Compelling Event und konkreten Owner als Kontext mit, ohne die Datumslogik zu verändern', () => {
    const baseline = calculateReverseTimeline(baseInput)
    const contextual = calculateReverseTimeline({
      ...baseInput,
      compellingEvent: '  Altvertrag endet am 30.06.  ',
      steps: baseInput.steps.map((step, index) =>
        index === 0 ? { ...step, ownerDetail: 'Projektteam' } : step,
      ),
    })

    expect(baseline.success).toBe(true)
    expect(contextual.success).toBe(true)
    if (!baseline.success || !contextual.success) return

    expect(contextual.plan.compellingEvent).toBe('Altvertrag endet am 30.06.')
    expect(contextual.plan.backwardSegments[0].ownerDetail).toBe('Projektteam')
    expect(contextual.plan.latestStartDate).toBe(baseline.plan.latestStartDate)
    expect(contextual.plan.backwardSegments.map(({ startDate, endDate }) => ({ startDate, endDate }))).toEqual(
      baseline.plan.backwardSegments.map(({ startDate, endDate }) => ({ startDate, endDate })),
    )
  })

  it('mutiert die Eingabe nicht', () => {
    const input = structuredClone(baseInput)
    const before = structuredClone(input)

    calculateReverseTimeline(input)

    expect(input).toEqual(before)
  })

  it('liefert die chronologische Darstellung in umgekehrter Reihenfolge', () => {
    const result = calculateReverseTimeline(baseInput)

    expect(result.success).toBe(true)
    if (!result.success) return
    expect(result.plan.chronologicalSegments.map((segment) => segment.id)).toEqual(['legal', 'implementation'])
  })
})
