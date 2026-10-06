import { describe, expect, it } from 'vitest'

import { defaultProject } from '../data/defaultProject'
import { createNewProject } from '../data/newProject'
import { assessChampion, assessChampions, strongestChampionAssessment } from './championTester'
import type { MeddpiccProject } from './project'

type ChampionPerson = MeddpiccProject['meddpicc']['champions']['people'][number]
type ChampionBehaviorType = ChampionPerson['behaviors'][number]['type']

function projectWithDemoChampion(): MeddpiccProject {
  return structuredClone(defaultProject)
}

function demoChampion(project: MeddpiccProject): ChampionPerson {
  const person = project.meddpicc.champions.people.find((item) => item.stakeholderId === 'st_champion')
  expect(person).toBeDefined()
  if (!person) throw new Error('Demo-Champion fehlt.')
  return person
}

function addBehavior(
  person: ChampionPerson,
  type: ChampionBehaviorType,
  evidenceIds: string[] = ['ev_champion_01'],
): void {
  person.behaviors.push({ type, evidenceIds, notes: 'Test-Behavior ' + type })
}

function makeChampionRobust(project: MeddpiccProject, person = demoChampion(project)): ChampionPerson {
  person.influence = 'high'
  person.personalWin = 'Die Person gewinnt sichtbar an Wirksamkeit und Zielerreichung.'
  addBehavior(person, 'confirmed_personal_win')
  addBehavior(person, 'provided_internal_information')
  addBehavior(person, 'sold_internally')
  addBehavior(person, 'enabled_economic_buyer_access')
  return person
}

function onlyBehavior(person: ChampionPerson, type: ChampionBehaviorType): void {
  person.behaviors = [{ type, evidenceIds: ['ev_champion_01'], notes: 'Nur ' + type }]
}

function signalState(project: MeddpiccProject, id: string, signalId: string) {
  return assessChampion(project, id)?.signals.find((signal) => signal.id === signalId)?.state
}

describe('Champion Tester', () => {
  it('liefert ohne Champion-Candidate keinen stärksten Candidate', () => {
    const project = createNewProject(
      { accountName: 'Leere Beispiel AG', name: 'Neue Opportunity' },
      { now: new Date('2026-10-06T12:00:00.000Z'), projectId: 'champion_empty' },
    )

    expect(assessChampions(project)).toEqual([])
    expect(strongestChampionAssessment(project)).toBeNull()
  })

  it('markiert einen Candidate ohne Personal Win nicht als belastbar', () => {
    const project = projectWithDemoChampion()
    const person = demoChampion(project)
    person.personalWin = null

    const assessment = assessChampion(project, person.stakeholderId)

    expect(assessment?.status).toBe('partially-proven')
    expect(assessment?.signals.find((item) => item.id === 'personal-win')?.state).toBe('missing')
    expect(assessment?.nextTest?.id).toBe('champion-test-personal-win-discovery')
  })

  it('behandelt hohen Einfluss ohne belastbare Behaviors nur als Candidate', () => {
    const project = projectWithDemoChampion()
    const person = demoChampion(project)
    person.status = 'candidate'
    person.influence = 'high'
    person.behaviors = []

    const assessment = assessChampion(project, person.stakeholderId)

    expect(assessment?.status).toBe('candidate')
    expect(assessment?.signals.find((item) => item.id === 'influence')?.state).toBe('structured')
    expect(assessment?.provenSignals).toHaveLength(0)
  })

  it('ignoriert ein confirmed-Label als Beweis, wenn beobachtbares Verhalten fehlt', () => {
    const project = projectWithDemoChampion()
    const person = demoChampion(project)
    person.status = 'confirmed'
    person.behaviors = []

    expect(assessChampion(project, person.stakeholderId)?.status).toBe('candidate')
  })

  it('wertet Behaviors mit Assumption- oder Unconfirmed-Evidence nicht als bewiesen', () => {
    const project = projectWithDemoChampion()
    const person = demoChampion(project)
    const evidence = project.evidence.find((item) => item.id === 'ev_champion_01')
    expect(evidence).toBeDefined()
    if (!evidence) return

    person.behaviors = []
    makeChampionRobust(project, person)
    evidence.classification = 'assumption'
    evidence.verification = 'unconfirmed'

    const assessment = assessChampion(project, person.stakeholderId)

    expect(assessment?.status).toBe('candidate')
    expect(assessment?.provenSignals).toHaveLength(0)
    expect(assessment?.signals.find((item) => item.id === 'internal-selling')?.state).toBe('insufficient')
  })

  it('unterscheidet interne Informationen klar von echtem Internal Selling', () => {
    const project = projectWithDemoChampion()
    const person = demoChampion(project)
    onlyBehavior(person, 'provided_internal_information')

    const assessment = assessChampion(project, person.stakeholderId)

    expect(assessment?.status).toBe('partially-proven')
    expect(signalState(project, person.stakeholderId, 'inside-information')).toBe('proven')
    expect(signalState(project, person.stakeholderId, 'internal-selling')).toBe('missing')
    expect(assessment?.nextTest?.id).toBe('champion-test-internal-selling')
  })

  it('unterscheidet Meeting-/Stakeholder-Zugang von Economic-Buyer-Zugang', () => {
    const project = projectWithDemoChampion()
    const person = demoChampion(project)
    person.behaviors = []
    addBehavior(person, 'provided_internal_information')
    addBehavior(person, 'sold_internally')
    addBehavior(person, 'confirmed_personal_win')
    addBehavior(person, 'created_access')

    const assessment = assessChampion(project, person.stakeholderId)

    expect(assessment?.status).toBe('partially-proven')
    expect(signalState(project, person.stakeholderId, 'access-creation')).toBe('proven')
    expect(signalState(project, person.stakeholderId, 'economic-buyer-access')).toBe('missing')
    expect(assessment?.nextTest?.id).toBe('champion-test-economic-buyer-access')
  })

  it('bleibt bei Personal Win, Einfluss und Internal Selling teilweise bewiesen, wenn zentrale Signale fehlen', () => {
    const project = projectWithDemoChampion()
    const person = demoChampion(project)
    person.behaviors = []
    addBehavior(person, 'sold_internally')

    const assessment = assessChampion(project, person.stakeholderId)

    expect(assessment?.status).toBe('partially-proven')
    expect(signalState(project, person.stakeholderId, 'internal-selling')).toBe('proven')
    expect(signalState(project, person.stakeholderId, 'economic-buyer-access')).not.toBe('proven')
  })

  it('erkennt einen belastbaren Champion erst mit gehärteten Kernsignalen', () => {
    const project = projectWithDemoChampion()
    const person = demoChampion(project)
    person.behaviors = []
    makeChampionRobust(project, person)

    const assessment = assessChampion(project, person.stakeholderId)

    expect(assessment?.status).toBe('proven')
    expect(
      assessment?.signals
        .filter((item) => item.requiredForProven && item.id !== 'influence')
        .every((item) => item.state === 'proven'),
    ).toBe(true)
    expect(assessment?.nextTest?.id).toBe('champion-test-resilience')
  })

  it('stuft einen disqualified Candidate trotz starker Daten nicht wieder hoch', () => {
    const project = projectWithDemoChampion()
    const person = demoChampion(project)
    person.behaviors = []
    makeChampionRobust(project, person)
    person.status = 'disqualified'

    const assessment = assessChampion(project, person.stakeholderId)

    expect(assessment?.status).toBe('disqualified')
    expect(assessment?.nextTest).toBeNull()
    expect(assessment?.relatedNextBestActionRuleId).toBeNull()
  })

  it('sortiert mehrere Candidates deterministisch und unabhängig von der Array-Reihenfolge', () => {
    const first = projectWithDemoChampion()
    const strongPerson = structuredClone(demoChampion(first))
    strongPerson.stakeholderId = 'st_champion_b'
    strongPerson.behaviors = []
    makeChampionRobust(first, strongPerson)
    first.meddpicc.champions.people.push(strongPerson)

    const strongStakeholder = structuredClone(first.stakeholders.find((item) => item.id === 'st_champion'))
    expect(strongStakeholder).toBeDefined()
    if (!strongStakeholder) return
    strongStakeholder.id = 'st_champion_b'
    strongStakeholder.name = 'Anna Stark'
    first.stakeholders.push(strongStakeholder)

    const second = structuredClone(first)
    second.meddpicc.champions.people.reverse()

    expect(assessChampions(first).map((item) => item.stakeholderId)).toEqual(['st_champion_b', 'st_champion'])
    expect(assessChampions(second).map((item) => item.stakeholderId)).toEqual(['st_champion_b', 'st_champion'])
    expect(strongestChampionAssessment(second)?.stakeholderId).toBe('st_champion_b')
  })

  it('liefert für denselben Projektstand exakt denselben Output', () => {
    const first = assessChampions(projectWithDemoChampion())
    const second = assessChampions(projectWithDemoChampion())

    expect(second).toEqual(first)
  })

  it('mutiert das Source Project nicht', () => {
    const project = projectWithDemoChampion()
    const before = structuredClone(project)

    assessChampions(project)
    assessChampion(project, 'st_champion')
    strongestChampionAssessment(project)

    expect(project).toEqual(before)
  })

  it('liefert für das Demo-Projekt bewusst nur teilweise bewiesen und testet als Nächstes Internal Selling', () => {
    const project = projectWithDemoChampion()
    const assessment = strongestChampionAssessment(project)

    expect(assessment).toMatchObject({
      stakeholderId: 'st_champion',
      stakeholderName: 'Markus Stein',
      status: 'partially-proven',
    })
    expect(signalState(project, 'st_champion', 'inside-information')).toBe('proven')
    expect(signalState(project, 'st_champion', 'access-creation')).toBe('proven')
    expect(signalState(project, 'st_champion', 'personal-win')).toBe('structured')
    expect(signalState(project, 'st_champion', 'internal-selling')).toBe('missing')
    expect(signalState(project, 'st_champion', 'economic-buyer-access')).toBe('missing')
    expect(assessment?.nextTest).toMatchObject({
      id: 'champion-test-internal-selling',
      title: 'Internal Selling konkret testen',
    })
  })
})
