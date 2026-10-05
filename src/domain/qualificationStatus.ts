export type QualificationStatusKey =
  | 'confirmed'
  | 'partial'
  | 'assumption'
  | 'unknown'
  | 'risk'

export const qualificationStatusLabels: Record<QualificationStatusKey, string> = {
  confirmed: 'Bestätigt',
  partial: 'Teilweise',
  assumption: 'Annahme',
  unknown: 'Unbekannt',
  risk: 'Risiko',
}
