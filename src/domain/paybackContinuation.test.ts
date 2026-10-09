import { describe, expect, it } from 'vitest'
import { illustrativeBalanceContinuation } from './paybackContinuation'

describe('illustrativeBalanceContinuation', () => {
  it('continues a stable positive monthly net contribution without changing the original data', () => {
    const months = [
      { month: 33, balanceEur: -5_000 },
      { month: 34, balanceEur: 5_000 },
      { month: 35, balanceEur: 15_000 },
      { month: 36, balanceEur: 25_000 },
    ]
    const original = JSON.stringify(months)
    const result = illustrativeBalanceContinuation(months, 6)
    expect(result?.status).toBe('illustrative')
    expect(result?.sourceMonths).toBe(3)
    expect(result?.monthlyContributionEur).toBe(10_000)
    expect(result?.points[0]).toEqual({ month: 36, balanceEur: 25_000 })
    expect(result?.points.at(-1)).toEqual({ month: 42, balanceEur: 85_000 })
    expect(JSON.stringify(months)).toBe(original)
  })
  it('does not suggest positive continuation without confirmed model basis', () => {
    const a = [-40, -30, -20, -10].map((v, i) => ({ month: i, balanceEur: v }))
    const b = [10, 20, 5, 30].map((v, i) => ({ month: i, balanceEur: v }))
    const c = [10, 20, 40, 70].map((v, i) => ({ month: i, balanceEur: v }))
    const d = [70, 60, 50, 40].map((v, i) => ({ month: i, balanceEur: v }))
    expect(illustrativeBalanceContinuation(a, 6)).toBeNull()
    expect(illustrativeBalanceContinuation(b, 6)).toBeNull()
    expect(illustrativeBalanceContinuation(c, 6)).toBeNull()
    expect(illustrativeBalanceContinuation(d, 6)).toBeNull()
    expect(illustrativeBalanceContinuation(a, -1)).toBeNull()
    expect(illustrativeBalanceContinuation(a.slice(0, 2), 6)).toBeNull()
  })
  it('supports 60-month model and refuses discontinuous trailing months', () => {
    const timeline = [57, 58, 59, 60].map((month) => ({ month, balanceEur: (month - 50) * 4_000 }))
    expect(illustrativeBalanceContinuation(timeline, 12)?.points.at(-1)?.month).toBe(72)
    expect(illustrativeBalanceContinuation([{ ...timeline[0]!, month: 56 }, ...timeline.slice(1)], 12)).toBeNull()
  })
})
