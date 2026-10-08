import { describe, expect, it } from 'vitest'

import { discoveryCallChecklist, discoveryCallConcepts, discoveryCallKnowledge, spicedElements } from './discoveryCall'

function keysDeep(value: unknown, keys = new Set<string>()): Set<string> {
  if (!value || typeof value !== 'object') return keys
  if (Array.isArray(value)) {
    for (const item of value) keysDeep(item, keys)
    return keys
  }
  for (const [key, item] of Object.entries(value)) {
    keys.add(key.toLowerCase())
    keysDeep(item, keys)
  }
  return keys
}

describe('Discovery Call: books + SPICED source contract', () => {
  it('identifies all five SPICED elements in canonical order, including CE', () => {
    expect(spicedElements.map((element) => element.code)).toEqual(['S', 'P', 'I', 'CE', 'D'])
    expect(spicedElements.map((element) => element.name)).toEqual([
      'Situation',
      'Pain',
      'Impact',
      'Critical Event',
      'Decision',
    ])
    for (const element of spicedElements) {
      expect(element.meaning).not.toBe('')
      expect(element.openingQuestion).not.toBe('')
      expect(element.followUpQuestion).not.toBe('')
      expect(element.evidenceGap).not.toBe('')
      expect(element.meddpiccBridge).not.toBe('')
    }
  })

  it('includes seven Whyte question intentions, T.H.E.D. and original ACE', () => {
    expect(discoveryCallKnowledge.whyteBigQuestions).toHaveLength(7)
    expect(discoveryCallKnowledge.lahouThed.map((item) => item.code)).toEqual([
      'T',
      'H',
      'E',
      'D',
    ])
    expect(discoveryCallKnowledge.ace.map((item) => item.code)).toEqual(['A', 'C', 'E'])
    expect(discoveryCallKnowledge.twoSidedExample.caution).toContain('überprüft')
  })

  it('never conflates Decision with just criteria, and recognizes emotional Impact', () => {
    const decision = spicedElements.find((element) => element.code === 'D')
    const impact = spicedElements.find((element) => element.code === 'I')
    expect(decision?.meaning).toContain('Beteiligte')
    expect(decision?.meaning).toContain('Prozess')
    expect(impact?.meaning).toContain('persönliche')
    expect(impact?.meddpiccBridge).toContain('emotionale')
  })

  it('retains distinction between deadlines and compelling events', () => {
    const event = spicedElements.find((element) => element.code === 'CE')
    expect(event?.evidenceGap).toContain('noch kein Critical Event')
    expect(event?.followUpQuestion).toContain('passieren')
    expect(discoveryCallConcepts.event.signals.length).toBeGreaterThan(1)
  })

  it('provides source-backed guidance on active listening and continuous discovery', () => {
    expect(discoveryCallKnowledge.principle).toContain('einmalige')
    expect(discoveryCallKnowledge.differences.map((author) => author.author)).toEqual([
      'Andy Whyte',
      'Darius Lahoutifard',
      'Winning by Design · SPICED',
    ])
    expect(discoveryCallConcepts.listen.sourceNote).toContain('Two-Sided Discovery')
    expect(discoveryCallConcepts.opening.meaning).toContain('ACE')
  })

  it('keeps checklist short with nine complete explanations and unique ids', () => {
    const ids = discoveryCallChecklist.items.map((item) => item.id)
    expect(ids).toHaveLength(9)
    expect(new Set(ids).size).toBe(ids.length)
    for (const item of discoveryCallChecklist.items) {
      expect(item.question.trim().length).toBeGreaterThan(10)
      expect(item.meaning.trim()).not.toBe('')
      expect(item.whyItMatters.trim()).not.toBe('')
      expect(item.signals.length).toBeGreaterThan(0)
      expect(item.commonMisinterpretation.trim()).not.toBe('')
      expect(item.possibleQuestionsOrActions.length).toBeGreaterThan(0)
      expect(item.relatedKnowledge).toBe('discovery-call')
      expect(item.sourceNote).toContain('→')
    }
  })

  it('does not imply a closed checklist proves deal completion or generate seller scores', () => {
    const keys = keysDeep({ discoveryCallChecklist, discoveryCallKnowledge, discoveryCallConcepts })
    for (const forbidden of ['score', 'weight', 'confidence', 'dealstatus', 'percentage']) {
      expect(keys.has(forbidden)).toBe(false)
    }
    expect(discoveryCallChecklist.lead).not.toContain('vollständige Qualification')
  })

  it('grounds SPICED and ACE in Winning by Design original materials', () => {
    const sources = discoveryCallChecklist.sourceNotes.join(' ')
    expect(sources).toContain('winningbydesign.com/spiced-framework/')
    expect(sources).toContain('The-Perfect-Discovery-Call.pdf')
    expect(sources).toContain('Andy Whyte')
    expect(sources).toContain('Darius Lahoutifard')
  })
})
