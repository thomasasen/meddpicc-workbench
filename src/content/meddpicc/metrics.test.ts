import { describe, expect, it } from 'vitest'

import { metricsChecklist, metricsConcepts, metricsKnowledge } from './metrics'

function collectKeys(value: unknown, keys = new Set<string>()): Set<string> {
  if (!value || typeof value !== 'object') return keys

  if (Array.isArray(value)) {
    for (const item of value) collectKeys(item, keys)
    return keys
  }

  for (const [key, child] of Object.entries(value)) {
    keys.add(key.toLowerCase())
    collectKeys(child, keys)
  }

  return keys
}

describe('Metrics content model', () => {
  it('liefert für jeden Checklist-Punkt die vollständigen Erklärungsebenen', () => {
    expect(metricsChecklist.items.length).toBe(7)

    for (const item of metricsChecklist.items) {
      expect(item.question.trim()).not.toBe('')
      expect(item.meaning.trim()).not.toBe('')
      expect(item.whyItMatters.trim()).not.toBe('')
      expect(item.signals.length).toBeGreaterThan(0)
      expect(item.commonMisinterpretation.trim()).not.toBe('')
      expect(item.possibleQuestionsOrActions.length).toBeGreaterThan(0)
      expect(item.relatedKnowledge).toBe('metrics')
      expect(item.sourceNote).toContain('→')
    }
  })

  it('verwendet eindeutige IDs und nur bestehende Knowledge-Verweise', () => {
    const ids = metricsChecklist.items.map((item) => item.id)
    expect(new Set(ids).size).toBe(ids.length)
    expect(metricsKnowledge.id).toBe('metrics')

    const knownConceptIds = new Set(Object.values(metricsConcepts).map((concept) => concept.id))
    for (const conceptId of metricsKnowledge.recognitionConceptIds) {
      expect(knownConceptIds.has(conceptId)).toBe(true)
    }
  })

  it('unterscheidet M1-Proof-Points und kundenspezifische M2-Metrics', () => {
    expect(metricsKnowledge.authorPerspective.whyte).toContain('M1')
    expect(metricsKnowledge.authorPerspective.whyte).toContain('M2')
    expect(metricsChecklist.items.find((item) => item.id === 'customer-specific')?.meaning).toContain(
      'noch keine kundenspezifische Metric',
    )
  })

  it('führt keine Scores, Gewichte oder Prozentwertungen ein', () => {
    const keys = collectKeys({ metricsConcepts, metricsKnowledge, metricsChecklist })
    for (const forbidden of ['score', 'weight', 'weighting', 'points', 'percentage', 'percent']) {
      expect(keys.has(forbidden)).toBe(false)
    }
  })

  it('macht die Kundenvalidierung statt Seller-Behauptungen zum Maßstab', () => {
    const item = metricsChecklist.items.find((entry) => entry.id === 'validated')
    expect(item?.meaning).toContain('Kunde')
    expect(item?.commonMisinterpretation).toContain('Excel-Rechnung')
  })

  it('stellt M2 und ROI nicht künstlich als zwei völlig getrennte Regeln dar', () => {
    const roi = metricsKnowledge.misinterpretations.find((entry) => entry.claim.includes('ROI'))
    expect(roi?.explanation).toContain('M2')
    expect(roi?.explanation).toContain('Return on Investment')
  })
})
