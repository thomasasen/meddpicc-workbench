import type { QualificationStatusKey } from './qualificationStatus'

export type ProjectAreaKey =
  | 'metrics'
  | 'economicBuyer'
  | 'decisionCriteria'
  | 'decisionProcess'
  | 'paperProcess'
  | 'pain'
  | 'champions'
  | 'competition'

export type QualificationSection = {
  status: QualificationStatusKey
  confidence: number
  summary: string
  evidenceIds: string[]
  gaps: string[]
}

export type ProjectMeta = {
  name: string
  accountName: string
  opportunityId: string
  owner: string
  currency: string
  dealValue: number
  targetCloseDate: string
  targetGoLiveDate: string
  forecastCategory: string
  notes: string
}

export type ProjectRisk = {
  id: string
  title: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  status: 'open' | 'mitigating' | 'closed' | 'accepted'
  relatedArea: ProjectAreaKey
  relatedEntityIds: string[]
  impact: string
  openedAt: string
}

export type ProjectAction = {
  id: string
  title: string
  status: 'open' | 'completed' | 'cancelled'
  owner: string
  dueDate: string | null
  relatedArea: ProjectAreaKey
  relatedRiskId: string | null
  desiredEvidence: string
}

export type MeddpiccProject = {
  format: 'meddpicc-workbench-project'
  schemaVersion: string
  appVersion: string
  projectId: string
  revision: number
  createdAt: string
  updatedAt: string
  project: ProjectMeta
  meddpicc: {
    metrics: QualificationSection & Record<string, unknown>
    economicBuyer: QualificationSection & Record<string, unknown>
    decisionCriteria: QualificationSection & Record<string, unknown>
    decisionProcess: QualificationSection & Record<string, unknown>
    paperProcess: QualificationSection & Record<string, unknown>
    pain: QualificationSection & Record<string, unknown>
    champions: QualificationSection & Record<string, unknown>
    competition: QualificationSection & Record<string, unknown>
  }
  stakeholders: Array<Record<string, unknown>>
  evidence: Array<Record<string, unknown>>
  risks: ProjectRisk[]
  actions: ProjectAction[]
  calculators: Record<string, unknown>
  planning: Record<string, unknown>
  references: Array<Record<string, unknown>>
  history: Array<Record<string, unknown>>
}

export function isMeddpiccProject(value: unknown): value is MeddpiccProject {
  if (!value || typeof value !== 'object') return false

  const candidate = value as Partial<MeddpiccProject>

  return (
    candidate.format === 'meddpicc-workbench-project' &&
    typeof candidate.schemaVersion === 'string' &&
    typeof candidate.projectId === 'string' &&
    typeof candidate.project === 'object' &&
    candidate.project !== null &&
    typeof candidate.meddpicc === 'object' &&
    candidate.meddpicc !== null &&
    Array.isArray(candidate.risks) &&
    Array.isArray(candidate.actions)
  )
}
