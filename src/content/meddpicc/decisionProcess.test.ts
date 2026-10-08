import { describe, expect, it } from 'vitest'

import {
  decisionProcessChecklist,
  decisionProcessConcepts,
  decisionProcessKnowledge,
  decisionProcessPhases,
} from './decisionProcess'

describe('Decision Process: fachliche und technische Verträge', () => {
  it('trennt Kriterien, Entscheiderweg und Paper Process', () => {
    expect(decisionProcessKnowledge.distinctions.map((item) => item.title)).toEqual([
      'Decision Criteria',
      'Decision Process',
      'Paper Process',
    ])
    expect(decisionProcessPhases.map((item) => item.title)).toEqual([
      'Technical Validation',
      'Business Approval',
      'Paper Process (gesonderter Prüfpfad)',
    ])
    expect(decisionProcessKnowledge.lead).not.toMatch(/Whyte|Lahoutifard|Buch/)
  })

  it('unterstellt keinen linearen Zwang und keine automatische POC-Kaufzusage', () => {
    expect(decisionProcessPhases[1]?.description).toContain('parallel')
    expect(decisionProcessConcepts.commitment.commonMisinterpretation).toContain('bereits eine Zusage')
    expect(decisionProcessConcepts.boundaries.commonMisinterpretation).toContain('Auftrag')
    expect(decisionProcessConcepts.influence.commonMisinterpretation).toContain('streichen')
  })

  it('fordert Kundenevidenz, Eigentümer, Meilensteine und laufende Validierung', () => {
    expect(decisionProcessConcepts.evidence.meaning).toContain('Annahme')
    expect(decisionProcessConcepts.approval.meaning).toContain('Veto')
    expect(decisionProcessConcepts.timeline.meaning).toContain('Abhängigkeiten')
    expect(decisionProcessConcepts.changes.meaning).toContain('neu')
    expect(decisionProcessConcepts.alignment.signals.length).toBeGreaterThan(1)
  })

  it('bildet die tatsächliche Reihenfolge nach Whyte mit möglicher Überlappung ab', () => {
    expect(decisionProcessPhases[1]?.description).toContain('In der Regel folgt')
    expect(decisionProcessPhases[1]?.description).toContain('parallel')
    expect(decisionProcessPhases[1]?.description).toContain('Warnsignal')
    expect(decisionProcessPhases[2]?.description).toContain('früher oder parallel')
  })

  it('bewahrt Lahoutifards finanzielle, administrative und rechtliche Approval-Semantik', () => {
    expect(decisionProcessPhases[2]?.description).toContain('Business Approval')
    expect(decisionProcessKnowledge.perspectives[1]?.summary).toContain('rechtlichen')
    expect(decisionProcessKnowledge.perspectives[1]?.summary).toContain('kommerziellen')
  })

  it('verlangt Käufer- und Verkäuferaktivitäten sowie einen EB-validierten Compelling Event', () => {
    expect(decisionProcessKnowledge.balancedPlan.map((item) => item.title)).toEqual(['Kundenseite', 'Verkäuferseite'])
    expect(decisionProcessKnowledge.compellingEvent.meaning).toContain('Economic Buyer')
    expect(decisionProcessKnowledge.compellingEvent.meaning).toContain('ROI')
    expect(decisionProcessKnowledge.compellingEvent.proof).toContain('Economic Buyer bestätigt')
    expect(decisionProcessKnowledge.goLivePlanning.join(' ')).toContain('Implementierungsdauer')
    expect(decisionProcessChecklist.items[0]?.question).toContain('beider Seiten')
    expect(decisionProcessChecklist.items[4]?.question).toContain('Compelling Event')
  })

  it('verwendet echte Kapitelüberschriften statt erfundener Quellensektionen', () => {
    const sourceNotes = decisionProcessChecklist.items.map((item) => item.sourceNote ?? '').join(' ')
    expect(sourceNotes).not.toContain('Conditional Closing')
    expect(sourceNotes).not.toContain('Decision Process Timeline')
    expect(sourceNotes).not.toContain('Socializing the Go-Live Plan')
    expect(sourceNotes).toContain('Add Additional Steps')
    expect(decisionProcessKnowledge.sourceNotes.join(' ')).toContain('Compelling Event')
  })

  it('bietet zehn ausführliche, nicht dauerhaft gespeicherte Checklist-Punkte', () => {
    expect(decisionProcessChecklist.items).toHaveLength(10)
    expect(new Set(decisionProcessChecklist.items.map((item) => item.id)).size).toBe(10)
    for (const item of decisionProcessChecklist.items) {
      expect(item.question.length).toBeGreaterThan(15)
      expect(item.meaning.length).toBeGreaterThan(25)
      expect(item.whyItMatters.length).toBeGreaterThan(25)
      expect(item.signals.length).toBeGreaterThan(0)
      expect(item.possibleQuestionsOrActions.length).toBeGreaterThan(0)
      expect(item.relatedKnowledge).toBe('decision-process')
      expect(item.sourceNote).toContain('→')
    }
    expect(Object.keys(decisionProcessKnowledge)).not.toContain('score')
    expect(Object.keys(decisionProcessChecklist)).not.toContain('score')
  })

  it('weist beide Autoren getrennt aus und zeigt Quellen nicht im Haupttext', () => {
    expect(decisionProcessKnowledge.perspectives.map((item) => item.author)).toEqual([
      'Andy Whyte',
      'Darius Lahoutifard',
    ])
    expect(decisionProcessKnowledge.sourceNotes.join(' ')).toContain('Chapter Six')
    expect(decisionProcessKnowledge.pitfalls.length).toBeGreaterThanOrEqual(5)
    expect(decisionProcessKnowledge.discoveryQuestions.length).toBeGreaterThanOrEqual(6)
  })
})
