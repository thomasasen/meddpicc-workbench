import { calculateSoftwarePayback, type CustomerMetric, type SoftwareCost } from './softwarePayback'

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
