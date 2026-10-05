import type { ProjectAction, ProjectAreaKey, ProjectRisk } from './project'

export type RiskDraft = {
  title: string
  severity: ProjectRisk['severity']
  status: ProjectRisk['status']
  relatedArea: ProjectAreaKey
  relatedEntityIds: string[]
  impact: string
  mitigation?: string | null
  owner?: string | null
  dueDate?: string | null
}

export type ActionDraft = {
  title: string
  status: ProjectAction['status']
  owner?: string | null
  dueDate?: string | null
  relatedArea: ProjectAreaKey
  relatedRiskId?: string | null
  relatedGap?: string | null
  desiredEvidence: string
  evidenceIds: string[]
}

export type RiskCreateOptions = {
  id?: string
  now?: Date
}

export type ActionCreateOptions = {
  id?: string
}

function createId(prefix: string): string {
  return `${prefix}_${globalThis.crypto.randomUUID().replaceAll('-', '_')}`
}

function nullableText(value: string | null | undefined): string | null {
  const normalized = value?.trim()
  return normalized ? normalized : null
}

function uniqueIds(values: readonly string[]): string[] {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))]
}

function normalizeRiskDraft(draft: RiskDraft) {
  return {
    title: draft.title.trim(),
    severity: draft.severity,
    status: draft.status,
    relatedArea: draft.relatedArea,
    relatedEntityIds: uniqueIds(draft.relatedEntityIds),
    impact: draft.impact.trim(),
    mitigation: nullableText(draft.mitigation),
    owner: nullableText(draft.owner),
    dueDate: nullableText(draft.dueDate),
  }
}

function normalizeActionDraft(draft: ActionDraft) {
  return {
    title: draft.title.trim(),
    status: draft.status,
    owner: nullableText(draft.owner),
    dueDate: nullableText(draft.dueDate),
    relatedArea: draft.relatedArea,
    relatedRiskId: nullableText(draft.relatedRiskId),
    relatedGap: nullableText(draft.relatedGap),
    desiredEvidence: draft.desiredEvidence.trim(),
    evidenceIds: uniqueIds(draft.evidenceIds),
  }
}

export function createRisk(draft: RiskDraft, options: RiskCreateOptions = {}): ProjectRisk {
  return {
    id: options.id ?? createId('risk'),
    ...normalizeRiskDraft(draft),
    openedAt: (options.now ?? new Date()).toISOString(),
  }
}

export function updateRisk(risk: ProjectRisk, draft: RiskDraft): ProjectRisk {
  return {
    ...risk,
    ...normalizeRiskDraft(draft),
  }
}

export function createAction(draft: ActionDraft, options: ActionCreateOptions = {}): ProjectAction {
  return {
    id: options.id ?? createId('action'),
    ...normalizeActionDraft(draft),
  }
}

export function updateAction(action: ProjectAction, draft: ActionDraft): ProjectAction {
  return {
    ...action,
    ...normalizeActionDraft(draft),
  }
}
