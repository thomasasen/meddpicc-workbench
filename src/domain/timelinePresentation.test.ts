import { describe, expect, it } from 'vitest'

import { calculateReverseTimeline, type ReverseTimelineInput } from './reverseTimeline'
import {
  buildTimelineScale,
  timelineSegmentPosition,
  timelineTotalDays,
} from './timelinePresentation'

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
    expect(ticks[0]).toEqual({ date: '2027-03-21', position: 0 })
    expect(ticks.at(-1)).toEqual({ date: '2027-04-30', position: 100 })
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
})
