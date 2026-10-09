import { describe, expect, it } from 'vitest'
import { balanceChartAreas, chartDisplayEnd, chartMoneyTicks } from './paybackChartAreas'

describe('Balance-Flächen und Achsen', () => {
  it('teilt die Füllung genau bei Null und erzeugt keine erfundenen Werte', () => {
    const areas = balanceChartAreas([
      { month: 0, balanceEur: -100 },
      { month: 1, balanceEur: 100 },
      { month: 2, balanceEur: -100 },
    ])
    expect(areas.map((a) => a.kind)).toEqual(['negative', 'positive', 'positive', 'negative'])
    expect(areas[0]!.corners[2]!.month).toBeCloseTo(0.5)
    expect(areas[2]!.corners[2]!.month).toBeCloseTo(1.5)
    for (const area of areas) {
      expect(area.corners.length).toBe(4)
      for (const p of area.corners) {
        expect(p.month).toBeGreaterThanOrEqual(0)
        expect(p.month).toBeLessThanOrEqual(2)
        if (area.kind === 'negative') expect(p.balanceEur).toBeLessThanOrEqual(0)
        if (area.kind === 'positive') expect(p.balanceEur).toBeGreaterThanOrEqual(0)
      }
    }
  })
  it('unterstützt reine Vorzeichenbereiche und Nullwerte', () => {
    expect(
      balanceChartAreas([
        { month: 0, balanceEur: 0 },
        { month: 1, balanceEur: 0 },
      ]),
    ).toEqual([])
    expect(
      balanceChartAreas([
        { month: 0, balanceEur: 0 },
        { month: 1, balanceEur: 10 },
      ])[0]!.kind,
    ).toBe('positive')
    expect(
      balanceChartAreas([
        { month: 0, balanceEur: -10 },
        { month: 1, balanceEur: 0 },
      ])[0]!.kind,
    ).toBe('negative')
  })
  it('weist ungültige oder unsortierte Daten zurück', () => {
    expect(() =>
      balanceChartAreas([
        { month: 2, balanceEur: 1 },
        { month: 1, balanceEur: -1 },
      ]),
    ).toThrow('chronologisch')
    expect(() =>
      balanceChartAreas([
        { month: 0, balanceEur: 1 },
        { month: 1, balanceEur: Infinity },
      ]),
    ).toThrow('endlich')
  })
  it('zeigt rechts nur Achsenraum, keine zusätzlichen berechneten Monate', () => {
    expect(chartDisplayEnd(36)).toBe(42)
    expect(chartDisplayEnd(60)).toBe(72)
    expect(chartMoneyTicks({ min: -600000, max: 100000 })).toContain(0)
    expect(chartMoneyTicks({ min: -600000, max: 100000 })).toContain(-400000)
  })
})
