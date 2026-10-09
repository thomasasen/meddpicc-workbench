import type { BalancePoint } from './paybackChartAreas'

export type BalanceContinuation = {
  points: BalancePoint[]
  monthlyContributionEur: number
  sourceMonths: number
  /** A conditional illustration, NOT a forecast or additional finance-model output. */
  status: 'illustrative'
}

/**
 * An illustrative continuation of the last stable economic MONTHLY NET CONTRIBUTION.
 * No new revenue, renewal assumptions, costs or financial scenarios are invented.
 *
 * Only show it when the computed horizon ends above zero and its last three monthly
 * increments are positive and reasonably consistent (max deviation <= 15%).
 * If the current plan does not justify this simple assumption, show NO projection.
 */
export function illustrativeBalanceContinuation(
  values: readonly BalancePoint[],
  extensionMonths: number,
): BalanceContinuation | null {
  if (!Number.isInteger(extensionMonths) || extensionMonths < 1 || values.length < 4) return null
  if (values.some((p) => !Number.isFinite(p.month) || !Number.isFinite(p.balanceEur))) return null
  const last = values[values.length - 1]!
  if (last.balanceEur <= 0) return null
  const trailing = values.slice(-4)
  if (trailing.some((v, i) => i > 0 && v.month !== trailing[i - 1]!.month + 1)) return null
  const net = trailing.slice(1).map((value, i) => value.balanceEur - trailing[i]!.balanceEur)
  if (net.some((value) => value <= 0)) return null
  const mean = net.reduce((a, b) => a + b, 0) / net.length
  if (net.some((value) => Math.abs(value - mean) > mean * 0.15)) return null
  return {
    status: 'illustrative',
    monthlyContributionEur: mean,
    sourceMonths: net.length,
    points: Array.from({ length: extensionMonths + 1 }, (_, index) => ({
      month: last.month + index,
      balanceEur: last.balanceEur + mean * index,
    })),
  }
}
