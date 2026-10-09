import { describe, expect, it } from 'vitest'
import { paybackAxisBounds } from './paybackChart'

describe('paybackAxisBounds', () => {
  it('wählt lesbare Grenzen und umfasst alle Werte samt Nulllinie', () => {
    const axis = paybackAxisBounds([-100_000, -531_278, 0, 42_583])
    expect(axis).toEqual({ min: -600_000, max: 100_000 })
  })
  it('deckt rein negative, rein positive und konstante Reihen ab', () => {
    for (const values of [[-220_000, -10_000], [0, 65_000], [0, 0, 0], [0.3, 0.4]]) {
      const axis = paybackAxisBounds(values)
      expect(axis.min).toBeLessThanOrEqual(Math.min(0, ...values))
      expect(axis.max).toBeGreaterThanOrEqual(Math.max(0, ...values))
      expect(axis.max).toBeGreaterThan(axis.min)
    }
  })
  it('verweigert nicht endliche oder leere Reihen', () => {
    expect(() => paybackAxisBounds([])).toThrow('endliche')
    expect(() => paybackAxisBounds([0, Number.NaN])).toThrow('endliche')
  })
})
