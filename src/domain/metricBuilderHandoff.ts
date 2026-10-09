import { calculateSoftwarePayback, type CustomerMetric, type SoftwareCost, type SoftwarePaybackInput } from './softwarePayback'

const KEY = 'meddpicc-metric-builder-handoff-v1'

/** Gezielte, einmalige Übergabe innerhalb derselben Browser-Session, ohne URL-Kundendaten. */
export function queueMetricHandoff(metrics: CustomerMetric[], storage: Pick<Storage, 'setItem'>): void {
  if (!metrics.length || metrics.length > 2 || metrics.some((m) => m.included))
    throw new Error('Es dürfen nur nicht angerechnete Metrics übertragen werden.')
  storage.setItem(KEY, JSON.stringify(metrics))
}

export function consumeMetricHandoff(
  storage: Pick<Storage, 'getItem' | 'removeItem'>,
  existingMetrics: CustomerMetric[],
  existingCosts: SoftwareCost[],
  horizon: 36 | 60,
): { imported: CustomerMetric[]; message: string } {
  const raw = storage.getItem(KEY)
  if (!raw) return { imported: [], message: '' }
  storage.removeItem(KEY)
  try {
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed) || parsed.length < 1 || parsed.length > 2) throw new Error('Ungültige Übergabe.')
    const existingIds = new Set(existingMetrics.map((metric) => metric.id))
    const imported = parsed.map((value: unknown, index) => {
      if (!value || typeof value !== 'object') throw new Error('Ungültiger Datensatz.')
      const metric = value as CustomerMetric
      if (metric.included !== false || !metric.name || !metric.effectGroup)
        throw new Error('Nur ausgeschlossene, vollständige Metrics übernehmen.')
      const id = 'builder-' + Date.now().toString(36) + '-' + index +
        '-' + Math.random().toString(36).slice(2, 8)
      if (existingIds.has(id)) throw new Error('ID-Kollision.')
      return { ...metric, id, included: false, startMonth: Math.min(metric.startMonth, horizon) }
    })
    const result = calculateSoftwarePayback({
      horizonMonths: horizon, costs: existingCosts, metrics: [...existingMetrics, ...imported],
    })
    if (!result.success) throw new Error(result.issues.join(' '))
    const existingGroups = new Set([
      ...existingMetrics.map((m) => m.effectGroup.trim().toLowerCase()),
      ...existingCosts.filter((c) => c.kind === 'avoided-legacy').map((c) => (c.effectGroup ?? '').trim().toLowerCase()),
    ])
    const groupOverlap = imported.some((m) => existingGroups.has(m.effectGroup.trim().toLowerCase()))
    return {
      imported,
      message: imported.length + ' Metric(s) übernommen, noch nicht in der Rechnung berücksichtigt.' +
        (groupOverlap ? ' Achtung: Eine Wirkungsgruppe existiert bereits. Doppelzählung vor Aktivierung prüfen.' : ''),
    }
  } catch (error) {
    return {
      imported: [],
      message: 'Übergabe verworfen: ' + (error instanceof Error ? error.message : 'ungültige Daten'),
    }
  }
}

const PAYBACK_KEY = 'meddpicc-payback-return-v1'

/** Nur die ausdrücklich vom Payback aus gestartete Rückkehr erhält den bisherigen Entwurf. */
export function queuePaybackReturn(input: SoftwarePaybackInput, storage: Pick<Storage, 'setItem'>): void {
  storage.setItem(PAYBACK_KEY, JSON.stringify(input))
}

export function consumePaybackReturn(storage: Pick<Storage, 'getItem' | 'removeItem'>): SoftwarePaybackInput | null {
  const raw = storage.getItem(PAYBACK_KEY)
  if (!raw) return null
  storage.removeItem(PAYBACK_KEY)
  try {
    const draft: unknown = JSON.parse(raw)
    if (!draft || typeof draft !== 'object') return null
    const input = draft as SoftwarePaybackInput
    if ((input.horizonMonths !== 36 && input.horizonMonths !== 60) ||
      !Array.isArray(input.costs) || !Array.isArray(input.metrics) ||
      input.costs.length > 100 || input.metrics.length > 100) return null
    return input
  } catch {
    return null
  }
}
