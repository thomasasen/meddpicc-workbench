import packageInfo from '../../package.json'

import { defaultProject } from './defaultProject'
import type { MeddpiccProject } from '../domain/project'
import { CURRENT_SCHEMA_VERSION, validateProject, ProjectValidationError } from '../domain/projectSchema'

export type NewProjectInput = {
  accountName: string
  name: string
  owner?: string
  currency?: string
}

export type NewProjectOptions = {
  now?: Date
  projectId?: string
}

function createProjectId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return `project_${crypto.randomUUID().replaceAll('-', '')}`
  }

  return `project_${Date.now().toString(36)}`
}

function resetQualificationBase(section: {
  status: 'confirmed' | 'partial' | 'assumption' | 'unknown' | 'risk'
  confidence: number
  summary: string
  evidenceIds: string[]
  gaps: string[]
}) {
  section.status = 'unknown'
  section.confidence = 0
  section.summary = ''
  section.evidenceIds = []
  section.gaps = []
}

export function createNewProject(input: NewProjectInput, options: NewProjectOptions = {}): MeddpiccProject {
  const accountName = input.accountName.trim()
  const name = input.name.trim()

  if (!accountName || !name) {
    throw new Error('Account und Projektname sind für ein neues Projekt erforderlich.')
  }

  const now = options.now ?? new Date()
  const timestamp = now.toISOString()
  const currency = (input.currency ?? 'EUR').trim().toUpperCase()
  const project = structuredClone(defaultProject)

  project.format = 'meddpicc-workbench-project'
  project.schemaVersion = CURRENT_SCHEMA_VERSION
  project.appVersion = packageInfo.version
  project.projectId = options.projectId ?? createProjectId()
  project.revision = 1
  project.createdAt = timestamp
  project.updatedAt = timestamp
  project.project = {
    name,
    accountName,
    opportunityId: null,
    owner: input.owner?.trim() || null,
    currency,
    dealValue: null,
    targetCloseDate: null,
    targetGoLiveDate: null,
    forecastCategory: 'unknown',
    notes: '',
  }

  project.stakeholders = []
  project.evidence = []
  project.risks = []
  project.actions = []
  project.references = []

  resetQualificationBase(project.meddpicc.metrics)
  project.meddpicc.metrics.metrics = []

  resetQualificationBase(project.meddpicc.economicBuyer)
  project.meddpicc.economicBuyer.candidates = []

  resetQualificationBase(project.meddpicc.decisionCriteria)
  project.meddpicc.decisionCriteria.criteria = []

  resetQualificationBase(project.meddpicc.decisionProcess)
  project.meddpicc.decisionProcess.steps = []

  resetQualificationBase(project.meddpicc.paperProcess)
  project.meddpicc.paperProcess.steps = []

  resetQualificationBase(project.meddpicc.pain)
  project.meddpicc.pain.items = []

  resetQualificationBase(project.meddpicc.champions)
  project.meddpicc.champions.people = []

  resetQualificationBase(project.meddpicc.competition)
  project.meddpicc.competition.knownAlternatives = []

  project.calculators = {
    businessCase: {
      currency,
      inputs: {
        affectedSalesEmployees: null,
        hoursLostPerEmployeePerWeek: null,
        workingWeeksPerYear: null,
        loadedHourlyCost: null,
        expectedEfficiencyImprovementPercent: null,
        oneTimeInvestment: null,
        annualRecurringCost: null,
      },
      evidenceIds: [],
      assumptions: [],
      customerConfirmed: false,
      notes: '',
    },
  }

  project.planning = {
    targetGoLiveDate: null,
    implementation: {
      estimatedBusinessDays: null,
      assumption: false,
      evidenceIds: [],
    },
    notes: '',
  }

  project.history = [
    {
      id: 'hist_created',
      timestamp,
      type: 'project_created',
      area: null,
      entityId: null,
      summary: 'Projekt in MEDDPICC Workbench erstellt.',
    },
  ]

  const validation = validateProject(project)
  if (!validation.success) {
    throw new ProjectValidationError('Das neue Projekt konnte nicht gültig initialisiert werden.', validation.issues)
  }

  return validation.project
}
