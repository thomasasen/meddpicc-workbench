import type { ProjectAreaKey, ProjectEvidence } from './project'

export type EvidenceDraft = {
  statement: string
  classification: ProjectEvidence['classification']
  quality: ProjectEvidence['quality']
  verification: ProjectEvidence['verification']
  sourceStakeholderId?: string | null
  sourceDate?: string | null
  context?: string | null
  referenceId?: string | null
  relatedAreas: ProjectAreaKey[]
}

export type EvidenceCreateOptions = {
  id?: string
  now?: Date
}

function createId(prefix: string): string {
  return `${prefix}_${globalThis.crypto.randomUUID().replaceAll('-', '_')}`
}

function nullableText(value: string | null | undefined): string | null {
  const normalized = value?.trim()
  return normalized ? normalized : null
}

export function createEvidence(draft: EvidenceDraft, options: EvidenceCreateOptions = {}): ProjectEvidence {
  return {
    id: options.id ?? createId('evidence'),
    classification: draft.classification,
    quality: draft.quality,
    statement: draft.statement.trim(),
    sourceStakeholderId: nullableText(draft.sourceStakeholderId),
    sourceDate: nullableText(draft.sourceDate),
    context: nullableText(draft.context),
    referenceId: nullableText(draft.referenceId),
    verification: draft.verification,
    relatedAreas: [...new Set(draft.relatedAreas)],
    createdAt: (options.now ?? new Date()).toISOString(),
  }
}
