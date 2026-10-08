import { describe, expect, it } from 'vitest'

import { competitionChecklist, competitionKnowledge } from './competition'

// prettier-ignore
describe('Competition – Primärquellen, Evidenz und fachliche Grenzen', () => {
  it('kennt vier Alternativarten statt nur Rival Vendors', () => {
    expect(competitionKnowledge.types.map((item) => item.id)).toEqual(['rival', 'build', 'projects', 'inertia'])
    expect(competitionKnowledge.shortDefinition).toMatch(/Ressourcen|Prioritäten/)
  })
  it('trennt Political, Technical und Commercial von den vier Arten', () => {
    expect(competitionKnowledge.perspectives.map((item) => item.title)).toEqual(['Political', 'Technical', 'Commercial'])
    expect(competitionKnowledge.types).toHaveLength(4)
  })
  it('wertet Inertia-Signale nicht als automatische Loss-Prognose', () => {
    const item = competitionKnowledge.deepDives.find((entry) => entry.title.startsWith('Inertia'))
    expect(item?.meaning).toMatch(/keine Verlustprognose/)
    expect(competitionChecklist.items.find((entry) => entry.id === 'inertia')?.commonMisinterpretation).toMatch(/beweist/)
  })
  it('macht Internal Build nicht pauschal wirtschaftlich schlechter', () => {
    const item = competitionKnowledge.types.find((entry) => entry.id === 'build')
    expect(item?.trap).toMatch(/nicht automatisch/)
  })
  it('ordnet Lahoutifard korrekt ohne Competition-Kapitel ein', () => {
    expect(competitionKnowledge.sourceNotes.join(' ')).toMatch(/Kein eigenständiges Competition-Kapitel/)
    expect(competitionKnowledge.sourceNotes.join(' ')).toMatch(/Chapter Five/)
  })
  it('unterscheidet alle sieben Value-Triangle-Zonen', () => {
    expect(competitionKnowledge.zones.map((zone) => zone.id)).toEqual([
      'parity', 'market-trends', 'useless', 'unique-differentiators', 'value', 'danger', 'custom-needs',
    ])
    const zone = (id: string) => competitionKnowledge.zones.find((item) => item.id === id)?.meaning ?? ''
    expect(zone('value')).toMatch(/bestätigtes Käuferkriterium/)
    expect(zone('unique-differentiators')).toMatch(/noch kein bestätigter VALUE/)
    expect(zone('parity')).toMatch(/Kein Differenzierungsbeweis/)
    expect(zone('danger')).toMatch(/Ungeprüftes Wissen ist keine DANGER/)
  })
  it('unterscheidet beobachtete Evidenz, Kundenbericht, Hypothese und Unbekannt', () => {
    expect(competitionKnowledge.evidence.map((item) => item.title)).toEqual([
      'Beobachtung / geprüfter Vorgang', 'Kundenaussage', 'Seller-Hypothese', 'Unbekannt',
    ])
    expect(competitionKnowledge.scenario.steps.map((item) => item.title)).toContain('Seller-Hypothese')
  })
  it('deutet nur einen Anbieter nicht als konkurrenzlos', () => {
    expect(competitionKnowledge.whyImportant.join(' ')).toMatch(/Ein einziger angesprochener Anbieter bedeutet nicht/)
    expect(competitionChecklist.items[0]?.commonMisinterpretation).toMatch(/einzige Vendor/)
  })
  it('kennzeichnet das gesamte Beispiel als frei konstruiert', () => {
    expect(competitionKnowledge.scenario.label).toMatch(/Frei konstruiertes/)
    expect(competitionKnowledge.sourceNotes.join(' ')).toMatch(/frei konstruierte/)
  })
  it('vermeidet konkrete unbelegte Anbieter-, ROI- und Preisbehauptungen', () => {
    const text = JSON.stringify(competitionKnowledge)
    expect(text).not.toMatch(/(?:Microsoft|Salesforce|SAP|HubSpot) (?:bietet|kann|kostet)/i)
    expect(text).not.toMatch(/\d+\s*%|\d+\s*€/)
  })
  it('liefert zehn unabhängige und vollständige Checklist-Punkte', () => {
    expect(competitionChecklist.items).toHaveLength(10)
    const ids = competitionChecklist.items.map((item) => item.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const item of competitionChecklist.items) {
      expect(item.question.length).toBeGreaterThan(15)
      expect(item.meaning.length).toBeGreaterThan(20)
      expect(item.whyItMatters.length).toBeGreaterThan(20)
      expect(item.signals.length).toBeGreaterThanOrEqual(2)
      expect(item.commonMisinterpretation.length).toBeGreaterThan(15)
      expect(item.possibleQuestionsOrActions.length).toBeGreaterThanOrEqual(2)
      expect(item.relatedKnowledge).toBeTruthy()
    }
  })
  it('verwendet keinen Score oder Persistenz im Competition-Datenmodell', () => {
    const content = JSON.stringify({ competitionChecklist, competitionKnowledge })
    expect(content).not.toMatch(/localStorage|sessionStorage|indexedDB|win.probability|dealScore/)
    expect(Object.keys(competitionChecklist)).not.toContain('score')
  })
  it('trennt die ethische Praxisübertragung von Whytes Trap-Taktik', () => {
    expect(competitionKnowledge.deepDives.find((item) => item.title.includes('Trap-Fragen'))?.meaning).toMatch(/Whyte beschreibt/)
    expect(competitionKnowledge.sourceNotes.join(' ')).toMatch(/eigene faire/)
  })
})
