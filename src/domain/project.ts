import type { MeddpiccProject as GeneratedMeddpiccProject } from './project.generated'

export type MeddpiccProject = GeneratedMeddpiccProject

export const projectAreaKeys = [
  'metrics',
  'economicBuyer',
  'decisionCriteria',
  'decisionProcess',
  'paperProcess',
  'pain',
  'champions',
  'competition',
] as const

export type ProjectAreaKey = (typeof projectAreaKeys)[number]
export type ProjectMeta = MeddpiccProject['project']
export type ProjectRisk = MeddpiccProject['risks'][number]
export type ProjectAction = MeddpiccProject['actions'][number]
export type ProjectEvidence = MeddpiccProject['evidence'][number]
export type ProjectReference = MeddpiccProject['references'][number]
export type ProjectHistoryEvent = MeddpiccProject['history'][number]
