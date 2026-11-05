import { describe, expect, it } from 'vitest'
import { criticallyDampedOffsets } from './dragSpring'

describe('kritisch gedämpftes Drag-Einrasten', () => {
  it('startet exakt an der Bildschirmposition und endet im Layoutziel', () => {
    const samples = criticallyDampedOffsets(180)
    expect(samples).toHaveLength(33)
    expect(samples[0]).toBe(180)
    expect(samples.at(-1)).toBe(0)
    expect(samples.slice(1, -1).every((value, index) => value < samples[index] && value > 0)).toBe(true)
  })

  it('behält die Bewegungsrichtung beim Loslassen kurzzeitig bei', () => {
    const resting = criticallyDampedOffsets(0)
    const flicking = criticallyDampedOffsets(0, 500)
    expect(resting.every((value) => value === 0)).toBe(true)
    expect(flicking[1]).toBeGreaterThan(0)
    expect(flicking.at(-1)).toBe(0)
  })

  it('wahrt auch negative Distanzen und begrenzt ungültige Werte', () => {
    const negative = criticallyDampedOffsets(-120)
    expect(negative[0]).toBe(-120)
    expect(negative.at(-1)).toBe(0)
    expect(negative.slice(0, -1).every((value) => value <= 0)).toBe(true)
    expect(criticallyDampedOffsets(Number.NaN, Infinity).every(Number.isFinite)).toBe(true)
  })
})
