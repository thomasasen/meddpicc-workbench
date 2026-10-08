import { describe, expect, it } from 'vitest'

import { championChecklist, championKnowledge } from './champion'

describe('Champion: Quellen, Evidenz und Abgrenzungen', () => {
  it('hat exakt Whytes drei explizite Kriterien', () => {
    expect(championKnowledge.whyteCriteria.map((item) => item.id)).toEqual(['einfluss', 'intern', 'motivation'])
    expect(championKnowledge.perspectives.map((item) => item.author)).toEqual(['Andy Whyte', 'Darius Lahoutifard'])
    expect(championKnowledge.perspectives[1].summary).toContain('keine identische')
  })

  it('trennt Kontakt, Coach, Kandidat und erprobten Champion', () => {
    expect(championKnowledge.roles.map((item) => item.title)).toEqual(['Kontakt', 'Coach', 'Champion-Kandidat', 'Erprobter Champion'])
    expect(championKnowledge.roles[1].meaning).toContain('wertvoll')
    expect(championKnowledge.roles[2].evidence).toContain('noch keine ausreichende Handlungsevidenz')
  })

  it('prüft Einfluss statt VP-Titel und internes Handeln statt Kontaktfrequenz', () => {
    expect(championChecklist.items.find((item) => item.id === 'einfluss')?.commonMisinterpretation).toContain('VP')
    expect(championChecklist.items.find((item) => item.id === 'intern')?.meaning).toContain('Indizien')
    expect(championKnowledge.redFlags[0].explanation).toContain('Kontaktfrequenz')
  })

  it('setzt EB-Nennung nicht mit Zugang oder Entscheidungsmacht gleich', () => {
    expect(championChecklist.items.find((item) => item.id === 'zugang')?.commonMisinterpretation).toContain('EB-Namens')
    expect(championKnowledge.buyerAndCommittee.join(' ')).toContain('nicht gleichzusetzen')
    expect(championKnowledge.redFlags.find((item) => item.claim.includes('Fake-Champion'))?.explanation).toContain('Zuständigkeit')
  })

  it('verbietet unterstellte Personal Wins und illoyale Tests', () => {
    expect(championChecklist.items.find((item) => item.id === 'motivation')?.commonMisinterpretation).toContain('befördert')
    const testPoint = championChecklist.items.find((item) => item.id === 'test')
    expect(testPoint?.commonMisinterpretation).toContain('Vertrauliche Unterlagen')
    expect(testPoint?.commonMisinterpretation).toContain('Feierabend')
  })

  it('kennt weitere Champions und trennt Procurement sowie Legal', () => {
    expect(championKnowledge.buyerAndCommittee.join(' ')).toContain('nicht pauschal vorgeschrieben')
    expect(championKnowledge.buyerAndCommittee.join(' ')).toContain('Zeichnungsberechtigung')
  })

  it('kennzeichnet sämtliche Beispielfakten als erfunden', () => {
    expect(championKnowledge.scenario.label).toContain('Frei konstruiertes')
    expect(championKnowledge.scenario.label).toContain('Sämtliche Personen')
    expect(championKnowledge.scenario.steps).toHaveLength(4)
    expect(championKnowledge.scenario.steps.at(-1)?.next).toContain('keine Budgetzusage')
  })

  it('enthält zehn unabhängige, vollständig erläuterte Prüfbereiche ohne Score', () => {
    expect(championChecklist.items).toHaveLength(10)
    expect(new Set(championChecklist.items.map((item) => item.id)).size).toBe(10)
    for (const item of championChecklist.items) {
      expect(item.question.length).toBeGreaterThan(35)
      expect(item.meaning.length).toBeGreaterThan(55)
      expect(item.whyItMatters.length).toBeGreaterThan(40)
      expect(item.signals.length).toBeGreaterThanOrEqual(2)
      expect(item.commonMisinterpretation.length).toBeGreaterThan(45)
      expect(item.possibleQuestionsOrActions.length).toBeGreaterThanOrEqual(2)
      expect(item.relatedKnowledge).toBeTruthy()
      expect(item.sourceNote).toContain('→')
    }
    expect(Object.keys(championChecklist)).not.toContain('score')
    expect(Object.keys(championKnowledge)).not.toContain('score')
    expect(championChecklist.sourceNotes.join(' ')).toContain('weder Deal-Score noch Speicherung')
  })
})
