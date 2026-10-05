import type { ProjectAreaKey } from './project'

export const SUPPORTED_LEGACY_SCHEMA_VERSIONS = ['0.1.0'] as const

export type ProjectMigrationMetadata = {
  fromVersion: string
  toVersion: string
  steps: string[]
}

export type ProjectMigrationIssue = {
  code: string
  path: string
  message: string
}

export type ProjectMigrationResult =
  | { success: true; value: unknown; migration: ProjectMigrationMetadata | null }
  | { success: false; issues: ProjectMigrationIssue[] }

type JsonObject = Record<string, unknown>

function isObject(value: unknown): value is JsonObject {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

function objectAt(value: unknown, path: string): JsonObject {
  if (!isObject(value)) {
    throw new Error(`Erwartetes Objekt fehlt oder ist ungültig: ${path}`)
  }
  return value
}

function arrayAt(value: unknown, path: string): unknown[] {
  if (!Array.isArray(value)) {
    throw new Error(`Erwartete Liste fehlt oder ist ungültig: ${path}`)
  }
  return value
}

function stringAt(value: unknown, path: string): string {
  if (typeof value !== 'string') {
    throw new Error(`Erwarteter Textwert fehlt oder ist ungültig: ${path}`)
  }
  return value
}

function nullableString(value: unknown): string | null {
  return typeof value === 'string' ? value : null
}

function stringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : []
}

function numberOrNull(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null
}

function booleanOr(value: unknown, fallback: boolean): boolean {
  return typeof value === 'boolean' ? value : fallback
}

function qualificationBase(section: JsonObject) {
  return {
    status: section.status,
    confidence: section.confidence,
    summary: section.summary,
    evidenceIds: stringArray(section.evidenceIds),
    gaps: stringArray(section.gaps),
  }
}

function stakeholderRelationship(value: unknown): string {
  switch (value) {
    case 'economic_buyer_candidate':
    case 'technical_stakeholder':
    case 'procurement':
      return value
    case 'champion':
      return 'champion_candidate'
    default:
      return 'other'
  }
}

function processStatus(value: unknown, plannedDate: unknown): string {
  switch (value) {
    case 'confirmed':
      return 'confirmed'
    case 'partial':
    case 'assumption':
      return typeof plannedDate === 'string' ? 'planned' : 'unknown'
    case 'risk':
      return 'blocked'
    default:
      return 'unknown'
  }
}

function relatedAreasByEvidence(meddpicc: JsonObject): Map<string, ProjectAreaKey[]> {
  const result = new Map<string, ProjectAreaKey[]>()
  const areas: ProjectAreaKey[] = [
    'metrics',
    'economicBuyer',
    'decisionCriteria',
    'decisionProcess',
    'paperProcess',
    'pain',
    'champions',
    'competition',
  ]

  for (const area of areas) {
    const section = isObject(meddpicc[area]) ? meddpicc[area] : null
    if (!section) continue

    for (const evidenceId of stringArray(section.evidenceIds)) {
      const current = result.get(evidenceId) ?? []
      if (!current.includes(area)) current.push(area)
      result.set(evidenceId, current)
    }
  }

  return result
}

function migrationHistoryId(history: unknown[]): string {
  const existing = new Set(
    history
      .filter(isObject)
      .map((entry) => entry.id)
      .filter((id): id is string => typeof id === 'string'),
  )

  const base = 'hist_schema_010_020'
  if (!existing.has(base)) return base

  let suffix = 2
  while (existing.has(`${base}_${suffix}`)) suffix += 1
  return `${base}_${suffix}`
}

function migrate010To020(value: unknown): unknown {
  const legacy = objectAt(value, '/')
  const project = objectAt(legacy.project, '/project')
  const meddpicc = objectAt(legacy.meddpicc, '/meddpicc')
  const metrics = objectAt(meddpicc.metrics, '/meddpicc/metrics')
  const economicBuyer = objectAt(meddpicc.economicBuyer, '/meddpicc/economicBuyer')
  const decisionCriteria = objectAt(meddpicc.decisionCriteria, '/meddpicc/decisionCriteria')
  const decisionProcess = objectAt(meddpicc.decisionProcess, '/meddpicc/decisionProcess')
  const paperProcess = objectAt(meddpicc.paperProcess, '/meddpicc/paperProcess')
  const pain = objectAt(meddpicc.pain, '/meddpicc/pain')
  const champions = objectAt(meddpicc.champions, '/meddpicc/champions')
  const competition = objectAt(meddpicc.competition, '/meddpicc/competition')

  const legacyChampionPeople = arrayAt(champions.people, '/meddpicc/champions/people')
    .filter(isObject)
  const championByStakeholderId = new Map(
    legacyChampionPeople
      .filter((person) => typeof person.stakeholderId === 'string')
      .map((person) => [person.stakeholderId as string, person]),
  )

  const stakeholders = arrayAt(legacy.stakeholders, '/stakeholders').map((entry, index) => {
    const stakeholder = objectAt(entry, `/stakeholders/${index}`)
    const id = stringAt(stakeholder.id, `/stakeholders/${index}/id`)
    const champion = championByStakeholderId.get(id)

    return {
      id,
      name: stakeholder.name,
      role: stakeholder.role ?? '',
      organization: stakeholder.organization ?? '',
      relationships: [stakeholderRelationship(stakeholder.relationship)],
      influence: champion?.influence ?? 'unknown',
      dealPosition: 'unknown',
      personalWin: champion ? nullableString(champion.personalWin) : null,
      status: 'unknown',
      notes: '',
    }
  })

  const migratedMetrics = arrayAt(metrics.metrics, '/meddpicc/metrics/metrics').map((entry, index) => {
    const metric = objectAt(entry, `/meddpicc/metrics/metrics/${index}`)
    const unit = typeof metric.unit === 'string' && metric.unit ? metric.unit : 'Unbekannt'

    return {
      id: metric.id,
      name: metric.name,
      current: {
        value: numberOrNull(metric.currentValue),
        unit,
        period: null,
      },
      target: {
        value: numberOrNull(metric.targetValue),
        unit,
        period: null,
      },
      economicImpact: {
        value: null,
        currency: null,
        period: null,
        derivation: null,
        assumptions: [],
      },
      evidenceIds: stringArray(metric.evidenceIds),
      customerConfirmed: false,
      notes: '',
    }
  })

  const ebStakeholderId = nullableString(economicBuyer.stakeholderId)
  const migratedEconomicBuyer = {
    ...qualificationBase(economicBuyer),
    candidates: ebStakeholderId
      ? [
          {
            stakeholderId: ebStakeholderId,
            identityStatus: 'assumed',
            authorityStatus: 'unknown',
            directAccess: false,
            engagementStatus: 'none',
            priorityStatus: 'unknown',
            decisionCriteria: [],
            evidenceIds: stringArray(economicBuyer.evidenceIds),
            notes: 'Aus Schema 0.1.0 migriert; Authority und direkter Zugang waren dort nicht strukturiert belegt.',
          },
        ]
      : [],
  }

  const migratedCriteria = arrayAt(
    decisionCriteria.criteria,
    '/meddpicc/decisionCriteria/criteria',
  ).map((entry, index) => {
    const criterion = objectAt(entry, `/meddpicc/decisionCriteria/criteria/${index}`)
    return {
      ...criterion,
      evidenceIds: [],
      notes: '',
    }
  })

  function migrateProcess(section: JsonObject, path: string) {
    return {
      ...qualificationBase(section),
      steps: arrayAt(section.steps, `${path}/steps`).map((entry, index) => {
        const step = objectAt(entry, `${path}/steps/${index}`)
        const status = processStatus(step.status, step.plannedDate)
        return {
          id: step.id,
          title: step.title,
          description: '',
          ownerStakeholderId: step.ownerStakeholderId ?? null,
          status,
          plannedDate: step.plannedDate ?? null,
          confirmedDate: status === 'confirmed' ? (step.plannedDate ?? null) : null,
          durationBusinessDays: step.durationBusinessDays ?? null,
          predecessorIds: stringArray(step.predecessorIds),
          required: true,
          evidenceIds: [],
          parallelGroup: null,
          notes: '',
        }
      }),
    }
  }

  const migratedChampionPeople = legacyChampionPeople.map((person) => ({
    stakeholderId: person.stakeholderId,
    status: 'candidate',
    personalWin: nullableString(person.personalWin),
    influence: person.influence ?? 'unknown',
    behaviors: [],
    notes:
      person.tested === true
        ? 'Aus Schema 0.1.0 migriert: Der Kontakt war dort als getestet markiert; dies bestätigt noch keinen Champion-Status.'
        : '',
  }))

  const migratedAlternatives = arrayAt(
    competition.knownAlternatives,
    '/meddpicc/competition/knownAlternatives',
  ).map((entry, index) => {
    const alternative = objectAt(entry, `/meddpicc/competition/knownAlternatives/${index}`)
    return {
      ...alternative,
      evidenceIds: [],
      notes: '',
    }
  })

  const evidenceAreas = relatedAreasByEvidence(meddpicc)
  const createdAt = stringAt(legacy.createdAt, '/createdAt')
  const migratedEvidence = arrayAt(legacy.evidence, '/evidence').map((entry, index) => {
    const evidence = objectAt(entry, `/evidence/${index}`)
    const id = stringAt(evidence.id, `/evidence/${index}/id`)
    return {
      ...evidence,
      quality: 'unknown',
      context: null,
      relatedAreas: evidenceAreas.get(id) ?? [],
      createdAt,
    }
  })

  const migratedRisks = arrayAt(legacy.risks, '/risks').map((entry, index) => {
    const risk = objectAt(entry, `/risks/${index}`)
    return {
      ...risk,
      mitigation: null,
      owner: null,
      dueDate: null,
    }
  })

  const migratedActions = arrayAt(legacy.actions, '/actions').map((entry, index) => {
    const action = objectAt(entry, `/actions/${index}`)
    return {
      ...action,
      relatedGap: null,
      evidenceIds: [],
    }
  })

  const calculators = objectAt(legacy.calculators, '/calculators')
  const legacyBusinessCase = isObject(calculators.businessCase) ? calculators.businessCase : null
  const migratedCalculators = legacyBusinessCase
    ? {
        businessCase: {
          ...legacyBusinessCase,
          assumptions: [],
          customerConfirmed: false,
        },
      }
    : {}

  const planning = objectAt(legacy.planning, '/planning')
  const implementation = objectAt(planning.implementation, '/planning/implementation')
  const migratedPlanning = {
    ...planning,
    implementation: {
      ...implementation,
      evidenceIds: [],
    },
  }

  const legacyHistory = arrayAt(legacy.history, '/history')
  const updatedAt = stringAt(legacy.updatedAt, '/updatedAt')
  const migratedHistory = [
    ...legacyHistory,
    {
      id: migrationHistoryId(legacyHistory),
      timestamp: updatedAt,
      type: 'schema_migrated',
      area: null,
      entityId: null,
      summary: 'Projektdatei deterministisch von Schema 0.1.0 auf 0.2.0 migriert.',
    },
  ]

  return {
    ...legacy,
    schemaVersion: '0.2.0',
    project: {
      ...project,
      opportunityId: nullableString(project.opportunityId),
      owner: nullableString(project.owner),
      dealValue: numberOrNull(project.dealValue),
      targetCloseDate: nullableString(project.targetCloseDate),
      targetGoLiveDate: nullableString(project.targetGoLiveDate),
    },
    stakeholders,
    meddpicc: {
      metrics: {
        ...qualificationBase(metrics),
        metrics: migratedMetrics,
      },
      economicBuyer: migratedEconomicBuyer,
      decisionCriteria: {
        ...qualificationBase(decisionCriteria),
        criteria: migratedCriteria,
      },
      decisionProcess: migrateProcess(decisionProcess, '/meddpicc/decisionProcess'),
      paperProcess: migrateProcess(paperProcess, '/meddpicc/paperProcess'),
      pain: {
        ...qualificationBase(pain),
        items: [],
      },
      champions: {
        ...qualificationBase(champions),
        people: migratedChampionPeople,
      },
      competition: {
        ...qualificationBase(competition),
        knownAlternatives: migratedAlternatives,
      },
    },
    evidence: migratedEvidence,
    risks: migratedRisks,
    actions: migratedActions,
    calculators: migratedCalculators,
    planning: migratedPlanning,
    references: arrayAt(legacy.references, '/references'),
    history: migratedHistory,
  }
}

export function migrateProjectToCurrent(value: unknown): ProjectMigrationResult {
  if (!isObject(value)) {
    return { success: true, value, migration: null }
  }

  const version = value.schemaVersion
  if (version !== '0.1.0') {
    return { success: true, value, migration: null }
  }

  try {
    return {
      success: true,
      value: migrate010To020(value),
      migration: {
        fromVersion: '0.1.0',
        toVersion: '0.2.0',
        steps: ['0.1.0 → 0.2.0'],
      },
    }
  } catch (error) {
    return {
      success: false,
      issues: [
        {
          code: 'migration_failed',
          path: '/',
          message:
            error instanceof Error
              ? `Schema 0.1.0 konnte nicht sicher migriert werden: ${error.message}`
              : 'Schema 0.1.0 konnte nicht sicher migriert werden.',
        },
      ],
    }
  }
}
