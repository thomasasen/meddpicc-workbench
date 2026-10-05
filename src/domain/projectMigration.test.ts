import legacyProjectRaw from '../../examples/legacy/demo-opportunity-0.1.0.meddpicc?raw'
import { describe, expect, it } from 'vitest'

import { loadProject, serializeProject, validateProject } from './projectSchema'

describe('Projektmigration 0.1.0 → 0.2.0', () => {
  it('migriert das echte historische 0.1.0-Fixture vollständig auf 0.2.0', () => {
    const result = loadProject(legacyProjectRaw)

    expect(result.success).toBe(true)
    if (!result.success) return

    expect(result.migration).toEqual({
      fromVersion: '0.1.0',
      toVersion: '0.2.0',
      steps: ['0.1.0 → 0.2.0'],
    })
    expect(result.project.schemaVersion).toBe('0.2.0')
    expect(validateProject(result.project).success).toBe(true)

    expect(result.project.projectId).toBe('demo-beispielwerke-crm-2027')
    expect(result.project.project.accountName).toBe('Beispielwerke Industrie GmbH')
    expect(result.project.project.dealValue).toBe(480000)
    expect(result.project.stakeholders).toHaveLength(4)
    expect(result.project.evidence).toHaveLength(10)
    expect(result.project.risks).toHaveLength(3)
    expect(result.project.actions).toHaveLength(4)

    const firstMetric = result.project.meddpicc.metrics.metrics[0]
    expect(firstMetric?.current.value).toBe(9)
    expect(firstMetric?.target.value).toBe(3)
    expect(firstMetric?.economicImpact.value).toBeNull()

    const economicBuyer = result.project.meddpicc.economicBuyer.candidates[0]
    expect(economicBuyer?.stakeholderId).toBe('st_eb')
    expect(economicBuyer?.identityStatus).toBe('assumed')
    expect(economicBuyer?.authorityStatus).toBe('unknown')
    expect(economicBuyer?.directAccess).toBe(false)

    const champion = result.project.meddpicc.champions.people[0]
    expect(champion?.status).toBe('candidate')
    expect(champion?.behaviors).toEqual([])

    expect(result.project.evidence.every((entry) => entry.quality === 'unknown')).toBe(true)
    expect(result.project.evidence.find((entry) => entry.id === 'ev_metric_01')?.relatedAreas).toContain('metrics')

    expect(result.project.history.at(-1)).toMatchObject({
      type: 'schema_migrated',
      timestamp: '2026-10-05T12:00:00.000Z',
      summary: 'Projektdatei deterministisch von Schema 0.1.0 auf 0.2.0 migriert.',
    })
  })

  it('liefert für dieselbe 0.1.0-Datei immer exakt dasselbe Migrationsergebnis', () => {
    const first = loadProject(legacyProjectRaw)
    const second = loadProject(legacyProjectRaw)

    expect(first.success).toBe(true)
    expect(second.success).toBe(true)

    if (first.success && second.success) {
      expect(first.project).toEqual(second.project)
      expect(first.migration).toEqual(second.migration)
    }
  })

  it('migriert eine bereits gespeicherte 0.2.0-Datei nicht erneut', () => {
    const migrated = loadProject(legacyProjectRaw)
    expect(migrated.success).toBe(true)
    if (!migrated.success) return

    const loadedAgain = loadProject(serializeProject(migrated.project))
    expect(loadedAgain.success).toBe(true)
    if (!loadedAgain.success) return

    expect(loadedAgain.migration).toBeNull()
    expect(loadedAgain.project.history.filter((entry) => entry.type === 'schema_migrated')).toHaveLength(1)
  })

  it('bricht eine strukturell beschädigte 0.1.0-Datei sicher ab', () => {
    const malformed = JSON.parse(legacyProjectRaw) as Record<string, unknown>
    const meddpicc = malformed.meddpicc as Record<string, unknown>
    delete meddpicc.metrics

    const result = loadProject(JSON.stringify(malformed))

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.issues[0]).toMatchObject({
        source: 'migration',
        code: 'migration_failed',
      })
    }
  })
})
