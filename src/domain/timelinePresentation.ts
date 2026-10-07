import type { ReverseTimelinePlan, ReverseTimelineSegment } from './reverseTimeline'

const DAY_MS = 86_400_000

export type TimelineScaleTick = {
  date: string
  position: number
  label: string
  kind: 'start' | 'period' | 'end'
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

function toIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10)
}

function positionForDate(plan: ReverseTimelinePlan, date: string): number {
  const totalDays = timelineTotalDays(plan)
  const offset = (dateMs(date) - dateMs(plan.latestStartDate)) / DAY_MS
  return clamp((offset / totalDays) * 100, 0, 100)
}

function formatExactDate(isoDate: string): string {
  return new Intl.DateTimeFormat('de-DE', {
    day: '2-digit',
    month: 'short',
  }).format(new Date(`${isoDate}T00:00:00Z`))
}

function formatMonth(isoDate: string): string {
  return new Intl.DateTimeFormat('de-DE', {
    month: 'short',
  }).format(new Date(`${isoDate}T00:00:00Z`))
}

function isoWeekNumber(isoDate: string): number {
  const date = new Date(`${isoDate}T00:00:00Z`)
  const day = date.getUTCDay() || 7
  date.setUTCDate(date.getUTCDate() + 4 - day)
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1))
  return Math.ceil(((date.getTime() - yearStart.getTime()) / DAY_MS + 1) / 7)
}

function nextUtcMonday(isoDate: string): Date {
  const date = new Date(`${isoDate}T00:00:00Z`)
  const day = date.getUTCDay()
  const daysUntilMonday = day === 1 ? 7 : (8 - day) % 7
  date.setUTCDate(date.getUTCDate() + daysUntilMonday)
  return date
}

function monthStartAfter(isoDate: string): Date {
  const date = new Date(`${isoDate}T00:00:00Z`)
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 1))
}

export function timelineTotalDays(plan: ReverseTimelinePlan): number {
  return Math.max(1, Math.round((dateMs(plan.targetGoLiveDate) - dateMs(plan.latestStartDate)) / DAY_MS))
}

export function buildTimelineScale(plan: ReverseTimelinePlan): TimelineScaleTick[] {
  if (plan.latestStartDate === plan.targetGoLiveDate) {
    return [
      {
        date: plan.latestStartDate,
        position: 0,
        label: formatExactDate(plan.latestStartDate),
        kind: 'start',
      },
      {
        date: plan.targetGoLiveDate,
        position: 100,
        label: formatExactDate(plan.targetGoLiveDate),
        kind: 'end',
      },
    ]
  }

  const totalDays = timelineTotalDays(plan)
  const ticks: TimelineScaleTick[] = [
    {
      date: plan.latestStartDate,
      position: 0,
      label: formatExactDate(plan.latestStartDate),
      kind: 'start',
    },
  ]

  if (totalDays <= 42) {
    const weekStep = totalDays > 28 ? 2 : 1
    const cursor = nextUtcMonday(plan.latestStartDate)
    let weekIndex = 0

    while (cursor.getTime() < dateMs(plan.targetGoLiveDate)) {
      weekIndex += 1
      if (weekIndex % weekStep === 0) {
        const date = toIsoDate(cursor)
        ticks.push({
          date,
          position: positionForDate(plan, date),
          label: `KW ${isoWeekNumber(date)}`,
          kind: 'period',
        })
      }
      cursor.setUTCDate(cursor.getUTCDate() + 7)
    }
  } else {
    const monthStarts: string[] = []
    let cursor = monthStartAfter(plan.latestStartDate)

    while (cursor.getTime() < dateMs(plan.targetGoLiveDate)) {
      monthStarts.push(toIsoDate(cursor))
      cursor = new Date(Date.UTC(cursor.getUTCFullYear(), cursor.getUTCMonth() + 1, 1))
    }

    const monthStep = Math.max(1, Math.ceil(monthStarts.length / 5))
    monthStarts.forEach((date, index) => {
      if (index % monthStep !== 0) return
      ticks.push({
        date,
        position: positionForDate(plan, date),
        label: formatMonth(date),
        kind: 'period',
      })
    })
  }

  ticks.push({
    date: plan.targetGoLiveDate,
    position: 100,
    label: formatExactDate(plan.targetGoLiveDate),
    kind: 'end',
  })

  return ticks.sort((a, b) => a.position - b.position)
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
