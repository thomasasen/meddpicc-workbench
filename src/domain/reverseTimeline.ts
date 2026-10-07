export type TimelineDurationUnit = 'calendar-days' | 'business-days'
export type TimelineOwner = 'customer' | 'seller' | 'shared'
export type TimelineArea = 'decision-process' | 'paper-process' | 'implementation'

export type ReverseTimelineStepInput = {
  id: string
  label: string
  duration: number
  durationUnit: TimelineDurationUnit
  owner: TimelineOwner
  area: TimelineArea
}

export type ReverseTimelineInput = {
  targetGoLiveDate: string
  referenceDate: string
  steps: ReverseTimelineStepInput[]
}

export type ReverseTimelineSegment = ReverseTimelineStepInput & {
  startDate: string
  endDate: string
  calendarSpanDays: number
}

export type ReverseTimelineStatus =
  | 'lead-time-available'
  | 'compression-required'
  | 'target-before-reference'

export type ReverseTimelinePlan = {
  targetGoLiveDate: string
  referenceDate: string
  latestStartDate: string
  calendarDaysToLatestStart: number
  status: ReverseTimelineStatus
  backwardSegments: ReverseTimelineSegment[]
  chronologicalSegments: ReverseTimelineSegment[]
}

export type ReverseTimelineCalculation =
  | { success: true; plan: ReverseTimelinePlan }
  | { success: false; issues: string[] }

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/
const MS_PER_DAY = 86_400_000

function parseIsoDate(value: string): Date | null {
  if (!ISO_DATE.test(value)) return null
  const [year, month, day] = value.split('-').map(Number)
  const date = new Date(Date.UTC(year, month - 1, day))
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null
  }
  return date
}

function toIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10)
}

function shiftUtcDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * MS_PER_DAY)
}

function subtractCalendarDays(date: Date, days: number): Date {
  return shiftUtcDays(date, -days)
}

function subtractBusinessDays(date: Date, days: number): Date {
  let cursor = new Date(date.getTime())
  let remaining = days

  while (remaining > 0) {
    cursor = shiftUtcDays(cursor, -1)
    const weekday = cursor.getUTCDay()
    if (weekday !== 0 && weekday !== 6) remaining -= 1
  }

  return cursor
}

function calendarDiff(from: Date, to: Date): number {
  return Math.round((to.getTime() - from.getTime()) / MS_PER_DAY)
}

function validateStep(step: ReverseTimelineStepInput, index: number): string[] {
  const issues: string[] = []
  const position = index + 1

  if (!step.id.trim()) issues.push(`Schritt ${position}: ID fehlt.`)
  if (!step.label.trim()) issues.push(`Schritt ${position}: Bezeichnung fehlt.`)
  if (!Number.isInteger(step.duration) || step.duration < 0 || step.duration > 1000) {
    issues.push(`Schritt ${position}: Dauer muss eine ganze Zahl zwischen 0 und 1000 sein.`)
  }
  if (step.durationUnit !== 'calendar-days' && step.durationUnit !== 'business-days') {
    issues.push(`Schritt ${position}: Unbekannte Zeiteinheit.`)
  }

  return issues
}

export function calculateReverseTimeline(input: ReverseTimelineInput): ReverseTimelineCalculation {
  const issues: string[] = []
  const targetDate = parseIsoDate(input.targetGoLiveDate)
  const referenceDate = parseIsoDate(input.referenceDate)

  if (!targetDate) issues.push('Target Go-Live muss ein gültiges Datum sein.')
  if (!referenceDate) issues.push('Planungsdatum muss ein gültiges Datum sein.')
  if (input.steps.length === 0) issues.push('Mindestens ein Planungsschritt ist erforderlich.')

  const ids = new Set<string>()
  input.steps.forEach((step, index) => {
    issues.push(...validateStep(step, index))
    if (ids.has(step.id)) issues.push(`Schritt ${index + 1}: ID ist nicht eindeutig.`)
    ids.add(step.id)
  })

  if (issues.length > 0 || !targetDate || !referenceDate) {
    return { success: false, issues }
  }

  let cursor = new Date(targetDate.getTime())
  const backwardSegments: ReverseTimelineSegment[] = []

  for (const step of input.steps) {
    const endDate = new Date(cursor.getTime())
    const startDate =
      step.durationUnit === 'business-days'
        ? subtractBusinessDays(endDate, step.duration)
        : subtractCalendarDays(endDate, step.duration)

    backwardSegments.push({
      ...step,
      startDate: toIsoDate(startDate),
      endDate: toIsoDate(endDate),
      calendarSpanDays: Math.max(0, calendarDiff(startDate, endDate)),
    })

    cursor = startDate
  }

  const latestStartDate = toIsoDate(cursor)
  const calendarDaysToLatestStart = calendarDiff(referenceDate, cursor)
  const status: ReverseTimelineStatus =
    targetDate.getTime() < referenceDate.getTime()
      ? 'target-before-reference'
      : calendarDaysToLatestStart < 0
        ? 'compression-required'
        : 'lead-time-available'

  return {
    success: true,
    plan: {
      targetGoLiveDate: input.targetGoLiveDate,
      referenceDate: input.referenceDate,
      latestStartDate,
      calendarDaysToLatestStart,
      status,
      backwardSegments,
      chronologicalSegments: [...backwardSegments].reverse(),
    },
  }
}
