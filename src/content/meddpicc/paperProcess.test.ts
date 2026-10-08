import { describe, expect, it } from 'vitest'

import { paperProcessChecklist, paperProcessKnowledge } from './paperProcess'

describe('Paper Process: Quellen, Grenzen und Checklistenvertrag', () => {
  it('trennt fachliche Auswahl, Business Approval und formale Bestellung', () => {
    expect(paperProcessKnowledge.distinctions.map((item) => item.title)).toEqual([
      'Decision Process',
      'Business Approval',
      'Paper Process',
    ])
    expect(paperProcessKnowledge.shortDefinition).toContain('administrative')
    expect(paperProcessKnowledge.redFlags[0]?.explanation).toContain('kein wirksamer Vertrag')
    expect(paperProcessKnowledge.lead).not.toMatch(/Whyte|Lahoutifard|Buch/)
  })

  it('erhält die voneinander abweichenden Autorendefinitionen', () => {
    expect(paperProcessKnowledge.perspectives.map((item) => item.author)).toEqual(['Andy Whyte', 'Darius Lahoutifard'])
    expect(paperProcessKnowledge.perspectives[0]?.summary).toContain('Eigenes MEDDPICC-Element')
    expect(paperProcessKnowledge.perspectives[1]?.summary).toContain('Decision Process')
    expect(paperProcessChecklist.sourceNotes.join(' ')).toContain('Approval')
  })

  it('fordert echte Zuständigkeit, Evidenz, Fristen und Zeichnungsweg', () => {
    expect(paperProcessKnowledge.dimensions.map((item) => item.title)).toEqual(['Prozess', 'Personen', 'Timing'])
    const all = paperProcessChecklist.items
      .map((item) => item.question + item.meaning + item.signals.join(' '))
      .join(' ')
    expect(all).toContain('Verantwortlichen')
    expect(all).toContain('bestätigt')
    expect(all).toContain('Unterschriftsberechtigung')
    expect(all).toContain('Bearbeitungszeiten')
  })

  it('unterstellt keine universellen Pflichtstationen und keine starre Reihenfolge', () => {
    const text = paperProcessKnowledge.examples.map((item) => item.detail).join(' ')
    expect(text).toContain('Falls erforderlich')
    expect(text).toContain('Falls relevant')
    expect(text).toContain('Kein universeller Ablauf')
    expect(paperProcessKnowledge.planning.join(' ')).toContain('parallelisieren')
    expect(paperProcessChecklist.items.find((item) => item.id === 'dependencies')?.commonMisinterpretation).toContain(
      'linear',
    )
  })

  it('baut Implementierungsdauer ein und verwechselt Verkäuferarbeit nicht mit Käuferfortschritt', () => {
    expect(paperProcessKnowledge.planning.join(' ')).toContain('Implementierungsdauer')
    expect(paperProcessKnowledge.practiceActions.join(' ')).toContain('Seller-Artefakte')
    expect(
      paperProcessChecklist.items.find((item) => item.id === 'evidence-golive')?.commonMisinterpretation,
    ).toContain('garantiere')
  })

  it('nimmt die vorgezogene NDA-Prüfung und mögliche kommerzielle Verhandlungslücken ernst', () => {
    const contract = paperProcessChecklist.items.find((item) => item.id === 'contract')
    expect(contract?.meaning).toContain('NDA')
    expect(contract?.meaning).toContain('vor kommerziellen Zusagen')
    expect(contract?.commonMisinterpretation).toContain('NDA sei eine Kaufzusage')
    expect(paperProcessKnowledge.examples.find((item) => item.title === 'Vertrag und Dokumente')?.detail).toContain(
      'frühe NDA',
    )
    expect(paperProcessKnowledge.practiceActions.join(' ')).toContain('vor verbindlichen kommerziellen Zusagen')
  })

  it('verlangt gebriefte und verfügbare Personen statt einer bloßen Champion-Zusage', () => {
    const stakeholders = paperProcessChecklist.items.find((item) => item.id === 'stakeholders')
    expect(stakeholders?.meaning).toContain('informiert')
    expect(stakeholders?.signals.join(' ')).toContain('gebrieft')
    expect(paperProcessKnowledge.practiceActions.join(' ')).toContain('Den Champion konkret bestätigen lassen')
  })

  it('trennt sellerseitige Deadline vom Economic-Buyer-Compelling-Event und erkennt neue Genehmigungsgrenzen', () => {
    expect(paperProcessKnowledge.redFlags.find((item) => item.claim.includes('Quartalsende'))?.explanation).toContain(
      'belegt aber keinen kundenseitigen Compelling Event',
    )
    expect(paperProcessKnowledge.dimensions.find((item) => item.title === 'Timing')?.meaning).toContain(
      'Seller-Fristen',
    )
    expect(paperProcessKnowledge.planning.join(' ')).toContain('Genehmigungsschwellen')
    expect(paperProcessChecklist.items.find((item) => item.id === 'approval-po')?.meaning).toContain(
      'Freigabegrenzen',
    )
  })

  it('fordert beidseitige Schriftlichkeit, regelkonforme Parallelisierung und belegbaren Kaufabschluss', () => {
    expect(paperProcessKnowledge.practiceActions.join(' ')).toContain('schriftlich festhalten')
    expect(paperProcessKnowledge.practiceActions.join(' ')).toContain('Seller')
    expect(paperProcessChecklist.items.find((item) => item.id === 'dependencies')?.meaning).toContain(
      'ohne den administrativen Ablauf eigenmächtig zu verändern',
    )
    expect(paperProcessChecklist.items.find((item) => item.id === 'evidence-golive')?.signals.join(' ')).toContain(
      'Signatur',
    )
    expect(paperProcessKnowledge.discoveryQuestions.join(' ')).toContain('Verzögerungen')
  })

  it('verwendet zehn vollständige temporäre Prüfpunkte ohne Score', () => {
    expect(paperProcessChecklist.items).toHaveLength(10)
    expect(new Set(paperProcessChecklist.items.map((item) => item.id)).size).toBe(10)
    for (const item of paperProcessChecklist.items) {
      expect(item.question.length).toBeGreaterThan(20)
      expect(item.meaning.length).toBeGreaterThan(35)
      expect(item.whyItMatters.length).toBeGreaterThan(30)
      expect(item.signals.length).toBeGreaterThanOrEqual(2)
      expect(item.commonMisinterpretation.length).toBeGreaterThan(25)
      expect(item.possibleQuestionsOrActions.length).toBeGreaterThanOrEqual(2)
      expect(item.relatedKnowledge).toBe('paper-process')
      expect(item.sourceNote).toContain('→')
    }
    expect(Object.keys(paperProcessKnowledge)).not.toContain('score')
    expect(Object.keys(paperProcessChecklist)).not.toContain('score')
  })

  it('kennzeichnet situative Praxisbeispiele und hält Quellen im Quellenbereich', () => {
    expect(paperProcessKnowledge.sourceNotes.join(' ')).toContain('nicht durch beide Primärquellen')
    expect(paperProcessKnowledge.sourceNotes.join(' ')).toContain('Keine Rechtsberatung')
    expect(paperProcessKnowledge.discoveryQuestions.length).toBeGreaterThanOrEqual(6)
    expect(paperProcessKnowledge.redFlags.length).toBeGreaterThanOrEqual(5)
  })
})
