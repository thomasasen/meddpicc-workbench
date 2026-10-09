import { describe, expect, it } from 'vitest'
import { buildMetric, emptyMetricDraft, metricDemos } from './metricBuilder'
import { consumeMetricHandoff, queueMetricHandoff } from './metricBuilderHandoff'
import type { SoftwareCost } from './softwarePayback'

function storage(): Storage {
  const map = new Map<string, string>()
  return {
    get length() { return map.size },
    clear: () => map.clear(),
    getItem: (key) => map.get(key) ?? null,
    key: (index) => Array.from(map.keys())[index] ?? null,
    removeItem: (key) => { map.delete(key) },
    setItem: (key, value) => { map.set(key, value) },
  }
}

describe('Metric Builder: minimale lokale Übergabe', () => {
  it('übernimmt explizit, einmalig, ohne Kosten oder bestehende Metrics zu überschreiben', () => {
    const source = buildMetric({ ...emptyMetricDraft(), ...metricDemos.service })
    const store = storage()
    queueMetricHandoff(source.transfer, store)
    const existing = buildMetric({ ...emptyMetricDraft(), ...metricDemos.crm }).transfer[0]!
    const costs: SoftwareCost[] = [{ id: 'setup', name: 'Setup', kind: 'one-time', amountEur: 10000, period: 'monthly', startMonth: 0 }]
    const result = consumeMetricHandoff(store, [existing], costs, 36)
    expect(result.imported).toHaveLength(1)
    expect(result.imported[0]?.included).toBe(false)
    expect(result.imported[0]?.evidence).toBe(source.transfer[0]?.evidence)
    expect(result.imported[0]?.evidenceNote).toContain('Realisierung:')
    expect(result.imported[0]?.id).not.toBe(existing.id)
    expect(costs).toHaveLength(1)
    expect(existing.included).toBe(false)
    expect(consumeMetricHandoff(store, [existing], costs, 36).imported).toHaveLength(0)
  })

  it('weist bereits angerechnete und manipulierbare fehlerhafte Payloads zurück', () => {
    const store = storage()
    const metric = buildMetric({ ...emptyMetricDraft(), ...metricDemos.service }).transfer[0]!
    expect(() => queueMetricHandoff([{ ...metric, included: true }], store)).toThrow()
    queueMetricHandoff([{ ...metric, annualAmountEur: Number.NaN }], store)
    expect(consumeMetricHandoff(store, [], [], 36).imported).toHaveLength(0)
  })

  it('weist Doppelzählungsgefahr bei gleichen Wirkungsgruppen sichtbar aus', () => {
    const store = storage()
    const metric = buildMetric({ ...emptyMetricDraft(), ...metricDemos.service }).transfer[0]!
    queueMetricHandoff([metric], store)
    const result = consumeMetricHandoff(store, [metric], [], 36)
    expect(result.message).toContain('Doppelzählung')
  })
})
