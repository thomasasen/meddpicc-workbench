import { describe, expect, it } from 'vitest'

import { calculateReverseTimeline, type ReverseTimelineInput } from './reverseTimeline'
import { buildTimelineScale, timelineSegmentPosition, timelineTotalDays } from './timelinePresentation'

const input: ReverseTimelineInput = {
  targetGoLiveDate: '2027-04-30',
  referenceDate: '2027-01-01',
  steps: [
    {
      id: 'implementation',
      label: 'Implementierung',
      duration: 30,
      durationUnit: 'calendar-days',
      owner: 'shared',
      area: 'implementation',
    },
    {
      id: 'legal',
      label: 'Legal',
      duration: 10,
      durationUnit: 'calendar-days',
      owner: 'customer',
      area: 'paper-process',
    },
  ],
}

function planFor(source: ReverseTimelineInput) {
  const result = calculateReverseTimeline(source)
  expect(result.success).toBe(true)
  if (!result.success) throw new Error(result.issues.join(', '))
  return result.plan
}

describe('timelinePresentation', () => {
  it('spannt die Achse exakt von spätestem Start bis Go-Live auf', () => {
    const plan = planFor(input)
    const ticks = buildTimelineScale(plan)

    expect(timelineTotalDays(plan)).toBe(40)
    expect(ticks[0]).toMatchObject({ date: '2027-03-21', position: 0, kind: 'start' })
    expect(ticks.at(-1)).toMatchObject({ date: '2027-04-30', position: 100, kind: 'end' })
  })

  it('verwendet bei kurzen Plänen semantische Kalenderwochen', () => {
    const plan = planFor(input)
    const ticks = buildTimelineScale(plan)
    const periods = ticks.filter((tick) => tick.kind === 'period')

    expect(periods.length).toBeGreaterThan(0)
    expect(periods.every((tick) => tick.label.startsWith('KW '))).toBe(true)
  })

  it('verwendet bei längeren Plänen Monatsmarken statt beliebiger Zwischenwerte', () => {
    const plan = planFor({
      ...input,
      targetGoLiveDate: '2027-08-31',
      steps: [
        { ...input.steps[0], duration: 120 },
        { ...input.steps[1], duration: 30 },
      ],
    })
    const ticks = buildTimelineScale(plan)
    const periods = ticks.filter((tick) => tick.kind === 'period')

    expect(periods.length).toBeGreaterThan(0)
    expect(periods.every((tick) => !tick.label.startsWith('KW '))).toBe(true)
    expect(periods.some((tick) => tick.date.endsWith('-01'))).toBe(true)
  })

  it('positioniert Prozessschritte proportional zu ihrem Kalenderzeitraum', () => {
    const plan = planFor(input)
    const legal = plan.chronologicalSegments.find((segment) => segment.id === 'legal')
    const implementation = plan.chronologicalSegments.find((segment) => segment.id === 'implementation')

    expect(legal).toBeDefined()
    expect(implementation).toBeDefined()
    if (!legal || !implementation) return

    expect(timelineSegmentPosition(plan, legal)).toEqual({
      leftPercent: 0,
      widthPercent: 25,
    })
    expect(timelineSegmentPosition(plan, implementation)).toEqual({
      leftPercent: 25,
      widthPercent: 75,
    })
  })

  it('passt die grafischen Proportionen deterministisch an geänderte Dauern an', () => {
    const original = planFor(input)
    const changed = planFor({
      ...input,
      steps: [{ ...input.steps[0], duration: 10 }, input.steps[1]],
    })

    const originalImplementation = original.chronologicalSegments.find((segment) => segment.id === 'implementation')
    const changedImplementation = changed.chronologicalSegments.find((segment) => segment.id === 'implementation')

    expect(originalImplementation).toBeDefined()
    expect(changedImplementation).toBeDefined()
    if (!originalImplementation || !changedImplementation) return

    expect(timelineSegmentPosition(original, originalImplementation).widthPercent).toBe(75)
    expect(timelineSegmentPosition(changed, changedImplementation).widthPercent).toBe(50)
  })

  it('hält Schritte mit Dauer 0 als sichtbaren Marker innerhalb der Timeline', () => {
    const plan = planFor({
      targetGoLiveDate: '2027-04-30',
      referenceDate: '2027-04-01',
      steps: [
        {
          id: 'milestone',
          label: 'Finale Freigabe',
          duration: 0,
          durationUnit: 'calendar-days',
          owner: 'customer',
          area: 'decision-process',
        },
      ],
    })

    const segment = plan.chronologicalSegments[0]
    const position = timelineSegmentPosition(plan, segment)
    const ticks = buildTimelineScale(plan)

    expect(position.widthPercent).toBe(0.8)
    expect(position.leftPercent).toBe(0)
    expect(ticks).toEqual([
      { date: '2027-04-30', position: 0, label: '30. Apr.', kind: 'start' },
      { date: '2027-04-30', position: 100, label: '30. Apr.', kind: 'end' },
    ])
  })
})
