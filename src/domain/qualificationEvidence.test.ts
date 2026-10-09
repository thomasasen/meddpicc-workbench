import { describe, expect, it } from 'vitest'

import { defaultProject } from '../data/defaultProject'
import {
  evidenceForQualificationTarget,
  listQualificationEvidenceTargets,
  qualificationEvidenceLinksForEvidence,
  qualificationTargetsForEvidence,
  replaceEvidenceQualificationLinks,
} from './qualificationEvidence'

describe('qualification evidence', () => {
  it('adressiert alle stabil unterstützten konkreten Qualification-Entities nach MEDDPICC-Bereich', () => {
    const project = structuredClone(defaultProject)
    const groups = listQualificationEvidenceTargets(project)

    expect(groups.find((group) => group.area === 'metrics')?.targets.map((item) => item.entityId)).toEqual([
      'metric_01',
      'metric_02',
      'metric_03',
      'metric_04',
      'metric_05',
    ])
    expect(groups.find((group) => group.area === 'economicBuyer')?.targets.map((item) => item.entityId)).toEqual([
      'st_eb',
    ])
    expect(groups.find((group) => group.area === 'decisionCriteria')?.targets.map((item) => item.entityId)).toEqual([
      'dc_01',
      'dc_02',
      'dc_03',
    ])
    expect(groups.find((group) => group.area === 'decisionProcess')?.targets.map((item) => item.entityId)).toEqual([
      'dp_01',
      'dp_02',
      'dp_03',
    ])
    expect(groups.find((group) => group.area === 'paperProcess')?.targets.map((item) => item.entityId)).toEqual([
      'pp_01',
      'pp_02',
      'pp_03',
    ])
    expect(groups.find((group) => group.area === 'pain')?.targets.map((item) => item.entityId)).toEqual(['pain_01'])
    expect(groups.find((group) => group.area === 'competition')?.targets.map((item) => item.entityId)).toEqual([
      'comp_01',
      'comp_02',
    ])

    const champions = groups.find((group) => group.area === 'champions')
    expect(champions?.targets).toEqual([])
    expect(champions?.unsupportedReason).toContain('ohne eigene stabile ID')
  })

  it('liefert fachlich gleiche Target-Adressen auch bei mehrfachen Carriern nur einmal', () => {
    const project = structuredClone(defaultProject)
    project.meddpicc.economicBuyer.candidates.push(structuredClone(project.meddpicc.economicBuyer.candidates[0]))

    const group = listQualificationEvidenceTargets(project).find((item) => item.area === 'economicBuyer')
    const reverse = qualificationTargetsForEvidence(project, 'ev_eb_01')

    expect(group?.targets.map((item) => item.entityId)).toEqual(['st_eb'])
    expect(reverse.map((item) => item.entityId)).toEqual(['st_eb'])
  })

  it('leitet Evidence zu allen konkret verknüpften unterstützten Entities rückwärts ab', () => {
    const project = structuredClone(defaultProject)
    const targets = qualificationTargetsForEvidence(project, 'ev_dc_02')

    expect(targets.map((target) => target.entityId)).toEqual(['dc_02', 'dc_03'])
    expect(targets.every((target) => target.area === 'decisionCriteria')).toBe(true)
  })

  it('ermittelt die Evidence einer konkreten Entity ohne Duplikate', () => {
    const project = structuredClone(defaultProject)
    project.meddpicc.metrics.metrics[0].evidenceIds.push('ev_metric_01')

    const evidence = evidenceForQualificationTarget(project, {
      area: 'metrics',
      entityId: 'metric_01',
    })

    expect(evidence.map((item) => item.id)).toEqual(['ev_metric_01'])
  })

  it('ersetzt konkrete Evidence-Links deterministisch, entfernt alte Links und erzeugt keine Duplikate', () => {
    const project = structuredClone(defaultProject)

    replaceEvidenceQualificationLinks(project, 'ev_metric_02', [
      { area: 'metrics', entityId: 'metric_01' },
      { area: 'metrics', entityId: 'metric_01' },
      { area: 'decisionCriteria', entityId: 'dc_01' },
    ])

    expect(project.meddpicc.metrics.metrics[0].evidenceIds.filter((id) => id === 'ev_metric_02')).toHaveLength(1)
    expect(project.meddpicc.metrics.metrics[1].evidenceIds).not.toContain('ev_metric_02')
    expect(project.meddpicc.decisionCriteria.criteria[0].evidenceIds).toContain('ev_metric_02')
  })

  it('ändert bei ungültiger Evidence-ID oder Entity-Adresse keinen Zustand', () => {
    const project = structuredClone(defaultProject)
    const before = structuredClone(project)

    expect(() =>
      replaceEvidenceQualificationLinks(project, 'ev_missing', [{ area: 'metrics', entityId: 'metric_01' }]),
    ).toThrow('existiert nicht')
    expect(project).toEqual(before)

    expect(() =>
      replaceEvidenceQualificationLinks(project, 'ev_metric_01', [{ area: 'metrics', entityId: 'metric_missing' }]),
    ).toThrow('nicht stabil adressierbar')
    expect(project).toEqual(before)
  })
  it('macht bestehende Champion-Behavior-Links sichtbar, ohne eine künstliche editierbare ID zu erfinden', () => {
    const project = structuredClone(defaultProject)
    const links = qualificationEvidenceLinksForEvidence(project, 'ev_champion_01')

    expect(links).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          area: 'champions',
          label: expect.stringContaining('Interne Informationen geliefert'),
          editable: false,
        }),
        expect.objectContaining({
          area: 'champions',
          label: expect.stringContaining('Zugang hergestellt'),
          editable: false,
        }),
      ]),
    )
    expect(links.filter((link) => link.area === 'champions').every((link) => link.target === undefined)).toBe(true)
  })
})
