export type ReverseTimelineStepInput = {
  id: string
  title: string
  owner: string
  durationBusinessDays: number
}

export type ReverseTimelineInput = {
  targetGoLiveDate: string
  steps: ReverseTimelineStepInput[]
}

export type ReverseTimelineStep = ReverseTimelineStepInput & {
  startDate: string
  endDate: string
  orderFromGoLive: number
}

export type ReverseTimelineResult = {
  targetGoLiveDate: string
  latestStartDate: string
  totalBusinessDays: number
  steps: ReverseTimelineStep[]
  warnings: string[]
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/

function parseIsoDate(value: string): Date {
  if (!ISO_DATE.test(value)) {
    throw new Error('Datum muss im Format YYYY-MM-DD vorliegen.')
  }

  const [year, month, day] = value.split('-').map(Number)
  const date = new Date(Date.UTC(year, month - 1, day))

  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) {
    throw new Error('Datum ist ungültig.')
  }

  return date
}

function toIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10)
}

function isBusinessDay(date: Date): boolean {
  const weekday = date.getUTCDay()
  return weekday !== 0 && weekday !== 6
}

export function subtractBusinessDays(value: string, count: number): string {
  if (!Number.isInteger(count) || count < 0) {
    throw new Error('Arbeitstage müssen eine nicht-negative ganze Zahl sein.')
  }

  const date = parseIsoDate(value)
  let remaining = count

  while (remaining > 0) {
    date.setUTCDate(date.getUTCDate() - 1)
    if (isBusinessDay(date)) remaining -= 1
  }

  return toIsoDate(date)
}

export function calculateReverseTimeline(input: ReverseTimelineInput): ReverseTimelineResult {
  const targetDate = parseIsoDate(input.targetGoLiveDate)

  if (input.steps.length === 0) {
    throw new Error('Mindestens ein Schritt ist erforderlich.')
  }

  const seenIds = new Set<string>()
  for (const step of input.steps) {
    if (!step.id.trim() || seenIds.has(step.id)) {
      throw new Error('Jeder Schritt benötigt eine eindeutige ID.')
    }
    seenIds.add(step.id)

    if (!step.title.trim()) {
      throw new Error('Jeder Schritt benötigt einen Titel.')
    }

    if (!Number.isInteger(step.durationBusinessDays) || step.durationBusinessDays < 1) {
      throw new Error('Jeder Schritt benötigt mindestens einen Arbeitstag.')
    }
  }

  let cursor = input.targetGoLiveDate
  const backwards: ReverseTimelineStep[] = input.steps.map((step, index) => {
    const startDate = subtractBusinessDays(cursor, step.durationBusinessDays)
    const result = {
      ...step,
      title: step.title.trim(),
      owner: step.owner.trim(),
      startDate,
      endDate: cursor,
      orderFromGoLive: index + 1,
    }
    cursor = startDate
    return result
  })

  const warnings: string[] = []
  if (!isBusinessDay(targetDate)) {
    warnings.push('Das Ziel-Go-Live liegt auf einem Wochenende.')
  }
  warnings.push('Die Berechnung berücksichtigt Montag bis Freitag, aber noch keine Feiertage.')

  return {
    targetGoLiveDate: input.targetGoLiveDate,
    latestStartDate: cursor,
    totalBusinessDays: input.steps.reduce((sum, step) => sum + step.durationBusinessDays, 0),
    steps: [...backwards].reverse(),
    warnings,
  }
}
