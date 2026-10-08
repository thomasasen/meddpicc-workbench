import { describe, expect, it } from 'vitest'

import {
  complementaryCriteria,
  criterionCategories,
  decisionCriteriaChecklist,
  decisionCriteriaConcepts,
  decisionCriteriaKnowledge,
  valueTriangleZones,
} from './decisionCriteria'

describe('Decision Criteria: content and source contract', () => {
  it('separates the three criteria categories from the complementary criteria model', () => {
    expect(criterionCategories.map((item) => item.code)).toEqual(['Technical', 'Economic', 'Relationship'])
    expect(complementaryCriteria.map((item) => item.label)).toEqual([
      'Vendor/Partner Criteria',
      'Financial Justification',
      'Capability Validation',
    ])
    expect(decisionCriteriaKnowledge.differences).toHaveLength(2)
    expect(decisionCriteriaKnowledge.differences[0]?.author).toBe('Andy Whyte')
    expect(decisionCriteriaKnowledge.differences[1]?.author).toBe('Darius Lahoutifard')
  })

  it('correctly distinguishes Value, Danger, Parity and other Value Triangle zones', () => {
    expect(valueTriangleZones.map((zone) => zone.code)).toEqual([
      'Value',
      'Danger',
      'Parity',
      'Unique Differentiators',
      'Custom Needs',
      'Market Trends',
      'Useless',
    ])
    const value = valueTriangleZones.find((zone) => zone.code === 'Value')
    const danger = valueTriangleZones.find((zone) => zone.code === 'Danger')
    const parity = valueTriangleZones.find((zone) => zone.code === 'Parity')
    const unique = valueTriangleZones.find((zone) => zone.code === 'Unique Differentiators')
    expect(value?.meaning).toContain('wir können')
    expect(danger?.meaning).toContain('wir derzeit nicht')
    expect(parity?.meaning).toContain('sowohl wir als auch')
    expect(unique?.meaning).toContain('bisher aber nicht')
  })

  it('keeps customer evidence separate from seller assumptions and unvalidated weights', () => {
    expect(decisionCriteriaConcepts.priorities.commonMisinterpretation).toContain('Verkäufer-Score')
    expect(decisionCriteriaConcepts.business.commonMisinterpretation).toContain('Funktionswunsch')
    expect(decisionCriteriaConcepts.alternatives.commonMisinterpretation).toContain('einzigartiges Feature')
    expect(decisionCriteriaConcepts.origin.commonMisinterpretation).toContain('RFP')
    expect(decisionCriteriaConcepts.validation.commonMisinterpretation).toContain('automatisch')
    expect(decisionCriteriaKnowledge.misinterpretations.length).toBeGreaterThanOrEqual(5)
  })

  it('offers ten fully explained checklist items without persistent qualification scores', () => {
    const ids = decisionCriteriaChecklist.items.map((item) => item.id)
    expect(ids).toHaveLength(10)
    expect(new Set(ids).size).toBe(ids.length)
    for (const item of decisionCriteriaChecklist.items) {
      expect(item.question.length).toBeGreaterThan(10)
      expect(item.meaning).not.toBe('')
      expect(item.whyItMatters).not.toBe('')
      expect(item.signals.length).toBeGreaterThan(0)
      expect(item.commonMisinterpretation).not.toBe('')
      expect(item.possibleQuestionsOrActions.length).toBeGreaterThan(0)
      expect(item.relatedKnowledge).toBe('decision-criteria')
      expect(item.sourceNote).toContain('→')
    }
    expect(Object.keys(decisionCriteriaChecklist)).not.toContain('score')
    expect(Object.keys(decisionCriteriaKnowledge)).not.toContain('score')
  })

  it('elicits customer-side ratings, recognizes missing criteria as a risk and models proactive influence', () => {
    expect(decisionCriteriaConcepts.customerEvaluation.commonMisinterpretation).toContain('interne Bewertung')
    expect(decisionCriteriaConcepts.customerEvaluation.sourceNote).toContain('Taking Score')
    expect(decisionCriteriaConcepts.origin.whyItMatters).toContain('vorbereiteten Kaufprozess')
    expect(decisionCriteriaKnowledge.engagementGuidance).toHaveLength(3)
    expect(decisionCriteriaKnowledge.engagementGuidance[1]?.meaning).toContain('gemeinsam')
    expect(valueTriangleZones.find((zone) => zone.code === 'Value')?.action).toContain('Metrics')
    expect(valueTriangleZones.find((zone) => zone.code === 'Danger')?.action).toContain('Anforderung')
    expect(valueTriangleZones.find((zone) => zone.code === 'Unique Differentiators')?.action).toContain('Kundenbeispielen')
  })

  it('keeps all book provenance available separately from user-facing explanations', () => {
    const sources = decisionCriteriaChecklist.sourceNotes.join(' ')
    expect(sources).toContain('Whyte')
    expect(sources).toContain('Lahoutifard')
    expect(decisionCriteriaKnowledge.lead).not.toMatch(/Whyte|Lahoutifard|Buch/)
    expect(decisionCriteriaKnowledge.examples).toHaveLength(3)
  })
})
