/** Geometrische Flächen für den kumulierten Saldo, nicht für Cashflows. */
export type BalancePoint = { month: number; balanceEur: number }
export type BalanceArea = { kind: 'negative' | 'positive'; corners: BalancePoint[] }

/**
 * Teilt die Kurve an tatsächlichen Nulldurchgängen. Dadurch ist keine rote
 * Fläche oberhalb bzw. grüne Fläche unterhalb von 0 möglich, auch bei mehreren
 * Vorzeichenwechseln. Hier werden keine Monate oder Werte extrapoliert.
 */
export function balanceChartAreas(points: readonly BalancePoint[]): BalanceArea[] {
  const areas: BalanceArea[] = []
  function add(a: BalancePoint, b: BalancePoint): void {
    if (a.balanceEur === 0 && b.balanceEur === 0) return
    areas.push({
      kind: a.balanceEur > 0 || b.balanceEur > 0 ? 'positive' : 'negative',
      corners: [{ month: a.month, balanceEur: 0 }, a, b, { month: b.month, balanceEur: 0 }],
    })
  }
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1]!
    const b = points[i]!
    if (
      !Number.isFinite(a.month) ||
      !Number.isFinite(b.month) ||
      !Number.isFinite(a.balanceEur) ||
      !Number.isFinite(b.balanceEur) ||
      b.month <= a.month
    ) {
      throw new Error('Diagrammdaten müssen endlich und chronologisch sein.')
    }
    if (a.balanceEur * b.balanceEur < 0) {
      const crossing = {
        month: a.month + ((b.month - a.month) * -a.balanceEur) / (b.balanceEur - a.balanceEur),
        balanceEur: 0,
      }
      add(a, crossing)
      add(crossing, b)
    } else {
      add(a, b)
    }
  }
  return areas
}

/** Geplante Laufzeit endet vor dem visuellen rechten Rand; keine Prognose. */
export const chartDisplayEnd = (horizon: number): number => horizon + (horizon <= 36 ? 6 : 12)

/** Geldachse mit nachvollziehbaren Referenzwerten einschließlich Nullpunkt. */
export function chartMoneyTicks(bounds: { min: number; max: number }): number[] {
  const span = bounds.max - bounds.min
  const raw = span / 4
  const magnitude = 10 ** Math.floor(Math.log10(raw))
  const step = ([1, 2, 2.5, 5, 10].find((n) => n * magnitude >= raw) ?? 10) * magnitude
  const ticks: number[] = []
  for (let value = Math.ceil(bounds.min / step) * step; value <= bounds.max + step * 1e-8; value += step) {
    ticks.push(Math.round(value * 1e8) / 1e8)
  }
  if (!ticks.some((x) => x === 0)) ticks.push(0)
  return ticks.sort((a, b) => a - b)
}
