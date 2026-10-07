import type { ReverseTimelinePlan, ReverseTimelineSegment } from './reverseTimeline'

const DAY_MS = 86_400_000

export type TimelineScaleTick = {
  date: string
  position: number
}

export type TimelineSegmentPosition = {
  leftPercent: number
  widthPercent: number
}

function dateMs(isoDate: string): number {
  return Date.parse(`${isoDate}T00:00:00Z`)
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

export function timelineTotalDays(plan: ReverseTimelinePlan): number {
  return Math.max(1, Math.round((dateMs(plan.targetGoLiveDate) - dateMs(plan.latestStartDate)) / DAY_MS))
}

export function buildTimelineScale(plan: ReverseTimelinePlan): TimelineScaleTick[] {
  if (plan.latestStartDate === plan.targetGoLiveDate) {
    return [
      { date: plan.latestStartDate, position: 0 },
      { date: plan.targetGoLiveDate, position: 100 },
    ]
  }

  const totalDays = timelineTotalDays(plan)
  const startMs = dateMs(plan.latestStartDate)
  const desiredIntervals = totalDays <= 42 ? 4 : totalDays <= 120 ? 5 : 6
  const dates = new Map<string, number>()

  for (let index = 0; index <= desiredIntervals; index += 1) {
    const dayOffset = Math.round((totalDays * index) / desiredIntervals)
    const value = new Date(startMs + dayOffset * DAY_MS).toISOString().slice(0, 10)
    dates.set(value, clamp((dayOffset / totalDays) * 100, 0, 100))
  }

  dates.set(plan.latestStartDate, 0)
  dates.set(plan.targetGoLiveDate, 100)

  return [...dates.entries()].map(([date, position]) => ({ date, position })).sort((a, b) => a.position - b.position)
}

export function timelineSegmentPosition(
  plan: ReverseTimelinePlan,
  segment: ReverseTimelineSegment,
): TimelineSegmentPosition {
  const totalDays = timelineTotalDays(plan)
  const startMs = dateMs(plan.latestStartDate)
  const leftDays = (dateMs(segment.startDate) - startMs) / DAY_MS
  const spanDays = Math.max(0, (dateMs(segment.endDate) - dateMs(segment.startDate)) / DAY_MS)
  const rawLeftPercent = clamp((leftDays / totalDays) * 100, 0, 100)
  const widthPercent = Math.min(Math.max((spanDays / totalDays) * 100, 0.8), 100)
  const leftPercent = Math.min(rawLeftPercent, 100 - widthPercent)

  return {
    leftPercent,
    widthPercent,
  }
}
