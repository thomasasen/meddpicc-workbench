import type { MeddpiccProject } from './project'

export const qualificationStatusKeys = ['confirmed', 'partial', 'assumption', 'unknown', 'risk'] as const

export type QualificationStatusKey = (typeof qualificationStatusKeys)[number]

type SchemaQualificationStatus = MeddpiccProject['meddpicc']['metrics']['status']

const _schemaStatusGuard: readonly SchemaQualificationStatus[] = qualificationStatusKeys
void _schemaStatusGuard

export const qualificationStatusLabels: Record<QualificationStatusKey, string> = {
  confirmed: 'Bestätigt',
  partial: 'Teilweise',
  assumption: 'Annahme',
  unknown: 'Unbekannt',
  risk: 'Risiko',
}
