import type { ProjectReference } from './project'

export type ReferenceDraft = {
  type: ProjectReference['type']
  title: string
  date?: string | null
  externalId?: string | null
  url?: string | null
  notes?: string
}

export type ReferenceCreateOptions = {
  id?: string
}

function createId(prefix: string): string {
  return `${prefix}_${globalThis.crypto.randomUUID().replaceAll('-', '_')}`
}

function nullableText(value: string | null | undefined): string | null {
  const normalized = value?.trim()
  return normalized ? normalized : null
}

function normalizeReferenceDraft(draft: ReferenceDraft) {
  return {
    type: draft.type,
    title: draft.title.trim(),
    date: nullableText(draft.date),
    externalId: nullableText(draft.externalId),
    url: nullableText(draft.url),
    notes: draft.notes?.trim() ?? '',
  }
}

export function createReference(draft: ReferenceDraft, options: ReferenceCreateOptions = {}): ProjectReference {
  return {
    id: options.id ?? createId('ref'),
    ...normalizeReferenceDraft(draft),
  }
}

export function updateReference(reference: ProjectReference, draft: ReferenceDraft): ProjectReference {
  return {
    ...reference,
    ...normalizeReferenceDraft(draft),
  }
}
