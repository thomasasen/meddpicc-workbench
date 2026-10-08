import { describe, expect, it } from 'vitest'

import { painImplicationChecklist, painImplicationKnowledge } from './painImplication'

// prettier-ignore
describe('Pain / Implication: Quellen und Abgrenzungen', () => {
  it('trennt Whytes drei I und die ergänzende Perspektive Lahoutifards', () => {
    expect(painImplicationKnowledge.stages.map((stage) => stage.title)).toEqual([
      '1 · Identify',
      '2 · Indicate',
      '3 · Implicate',
    ])
    expect(painImplicationKnowledge.otherPerspective.map((item) => item.title)).toEqual([
      'Business-Pain',
      'Capability-Pain',
      'Konsequenz, Outcome, Urgency',
    ])
    expect(painImplicationKnowledge.perspectives.map((item) => item.author)).toEqual([
      'Andy Whyte',
      'Darius Lahoutifard',
    ])
  })

  it('markiert Ursache, Lösung, Outcome, Metric und Compelling Event als unterschiedliche Fragen', () => {
    const boundaries = painImplicationKnowledge.distinctions.map((item) => item.title).join(' ')
    expect(boundaries).toContain('Symptom ≠ Ursache')
    expect(boundaries).toContain('Pain ≠ Lösung')
    expect(boundaries).toContain('Pain ≠ Outcome')
    expect(boundaries).toContain('Implication ≠ Metric')
    expect(boundaries).toContain('Pain ≠ Compelling Event')
  })

  it('prüft Käuferverständnis statt behaupteter Verkäufer-Implication', () => {
    expect(painImplicationKnowledge.stages[2]?.evidence).toContain('Kunde beschreibt selbst')
    expect(painImplicationKnowledge.redFlags.at(-1)?.explanation).toContain('Seller-Aktion')
    expect(painImplicationChecklist.items.find((item) => item.id === 'implicate')?.signals.join(' ')).toContain(
      'eigenen Worten',
    )
  })

  it('stellt offene und positive Fragen statt aggressiver Problem-Rhetorik', () => {
    expect(painImplicationKnowledge.questions[0]).toContain('funktioniert')
    expect(painImplicationKnowledge.questions[1]).toContain('verbessern')
    expect(painImplicationKnowledge.questions.join(' ')).not.toMatch(/was ist falsch|was ist ihr problem/i)
  })

  it('kennzeichnet konstruierte Werte und trennt Hypothesen von bestätigter Evidenz', () => {
    expect(painImplicationKnowledge.scenario.title).toContain('Konstruiertes')
    const steps = painImplicationKnowledge.scenario.steps.map((step) => step.detail).join(' ')
    expect(steps).toContain('Rechenannahme')
    expect(steps).toContain('Weder Personenanzahl noch Zeit')
    expect(painImplicationKnowledge.evidenceLevels.map((item) => item.title)).toContain('Verkäuferhypothese')
    expect(painImplicationKnowledge.evidenceLevels.map((item) => item.title)).toContain('Bestätigte Kundenevidenz')
    expect(painImplicationKnowledge.redFlags[3]?.explanation).toContain('keine Kundenfrist')
  })

  it('liefert zehn vollständige Punkte mit Prüffrage, Warnsignal und konkretem Next Step', () => {
    expect(painImplicationChecklist.items).toHaveLength(10)
    expect(new Set(painImplicationChecklist.items.map((item) => item.id)).size).toBe(10)
    for (const item of painImplicationChecklist.items) {
      expect(item.question.length).toBeGreaterThan(25)
      expect(item.meaning.length).toBeGreaterThan(45)
      expect(item.whyItMatters.length).toBeGreaterThan(40)
      expect(item.signals.length).toBeGreaterThanOrEqual(2)
      expect(item.commonMisinterpretation.length).toBeGreaterThan(35)
      expect(item.possibleQuestionsOrActions.length).toBeGreaterThanOrEqual(2)
      expect(item.relatedKnowledge).toBe('pain-implication')
      expect(item.sourceNote).toContain('→')
    }
  })

  it('besitzt weder Score noch gespeicherten Qualifizierungsstatus', () => {
    expect(Object.keys(painImplicationKnowledge)).not.toContain('score')
    expect(Object.keys(painImplicationChecklist)).not.toContain('score')
    expect(painImplicationChecklist.sourceNotes.join(' ')).toContain('weder Deal-Score noch Speicherung')
    expect(painImplicationKnowledge.sourceNotes.join(' ')).toContain('Praxisableitung')
  })
})
