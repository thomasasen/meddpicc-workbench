import { describe, expect, it } from 'vitest'

import { economicBuyerChecklists, economicBuyerConcepts, economicBuyerKnowledge } from './economicBuyer'

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

describe('Economic Buyer content model', () => {
  it('liefert für jeden Checklist-Punkt die notwendigen Erklärungsebenen', () => {
    for (const checklist of Object.values(economicBuyerChecklists)) {
      expect(checklist.items.length).toBeGreaterThan(0)

      for (const item of checklist.items) {
        expect(item.question.trim()).not.toBe('')
        expect(item.meaning.trim()).not.toBe('')
        expect(item.whyItMatters.trim()).not.toBe('')
        expect(item.signals.length).toBeGreaterThan(0)
        expect(item.commonMisinterpretation.trim()).not.toBe('')
        expect(item.possibleQuestionsOrActions.length).toBeGreaterThan(0)
      }
    }
  })

  it('verwendet innerhalb jeder Checklist eindeutige Item-IDs', () => {
    for (const checklist of Object.values(economicBuyerChecklists)) {
      const ids = checklist.items.map((item) => item.id)
      expect(new Set(ids).size).toBe(ids.length)
    }
  })

  it('referenziert nur vorhandene Knowledge-Themen', () => {
    const knownTopics = new Set([economicBuyerKnowledge.id])

    for (const checklist of Object.values(economicBuyerChecklists)) {
      for (const item of checklist.items) {
        if (item.relatedKnowledge) {
          expect(knownTopics.has(item.relatedKnowledge)).toBe(true)
        }
      }
    }
  })

  it('führt keine Score-, Gewichtungs- oder Prozentfelder im Content-Modell ein', () => {
    const keys = collectKeys({
      economicBuyerConcepts,
      economicBuyerKnowledge,
      economicBuyerChecklists,
    })

    for (const forbidden of ['score', 'weight', 'weighting', 'points', 'percentage', 'percent']) {
      expect(keys.has(forbidden)).toBe(false)
    }
  })

  it('behandelt validierte Informationen nicht als Ersatz für Economic-Buyer-Zugang', () => {
    const accessItem = economicBuyerChecklists['economic-buyer'].items.find((item) => item.id === 'access')

    expect(accessItem?.question).toContain('direkten Zugang')
    expect(accessItem?.question).toContain('wie ich Zugang herstellen kann')
  })

  it('macht den Autorenunterschied zur Anzahl möglicher Economic Buyer sichtbar', () => {
    expect(economicBuyerKnowledge.authorPerspective.whyte).toContain('mehreren Personen')
    expect(economicBuyerKnowledge.authorPerspective.lahoutifard).toContain('finalen Wort')
    expect(economicBuyerKnowledge.authorPerspective.practicalTakeaway).toContain('keine starre Zählregel')
  })
})
