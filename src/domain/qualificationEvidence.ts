import type { MeddpiccProject, ProjectAreaKey, ProjectEvidence } from './project'

export type QualificationEvidenceTarget = {
  area: ProjectAreaKey
  entityId: string
}

export type QualificationEvidenceTargetInfo = QualificationEvidenceTarget & {
  label: string
  evidenceIds: string[]
}

export type QualificationEvidenceTargetGroup = {
  area: ProjectAreaKey
  label: string
  targets: QualificationEvidenceTargetInfo[]
  unsupportedReason?: string
}

export const qualificationAreaLabels: Record<ProjectAreaKey, string> = {
  metrics: 'Metrics',
  economicBuyer: 'Economic Buyer',
  decisionCriteria: 'Decision Criteria',
  decisionProcess: 'Decision Process',
  paperProcess: 'Paper Process',
  pain: 'Pain',
  champions: 'Champion',
  competition: 'Competition',
}

type EvidenceCarrier = {
  target: QualificationEvidenceTarget
  label: string
  evidenceIds: string[]
}

function stakeholderLabel(project: MeddpiccProject, stakeholderId: string): string {
  const stakeholder = project.stakeholders.find((item) => item.id === stakeholderId)
  if (!stakeholder) return stakeholderId
  return stakeholder.role ? `${stakeholder.name} · ${stakeholder.role}` : stakeholder.name
}

function stableEvidenceCarriers(project: MeddpiccProject): EvidenceCarrier[] {
  return [
    ...project.meddpicc.metrics.metrics.map((item) => ({
      target: { area: 'metrics' as const, entityId: item.id },
      label: item.name,
      evidenceIds: item.evidenceIds,
    })),
    ...project.meddpicc.economicBuyer.candidates.map((item) => ({
      target: { area: 'economicBuyer' as const, entityId: item.stakeholderId },
      label: stakeholderLabel(project, item.stakeholderId),
      evidenceIds: item.evidenceIds,
    })),
    ...project.meddpicc.decisionCriteria.criteria.map((item) => ({
      target: { area: 'decisionCriteria' as const, entityId: item.id },
      label: item.name,
      evidenceIds: item.evidenceIds,
    })),
    ...project.meddpicc.decisionProcess.steps.map((item) => ({
      target: { area: 'decisionProcess' as const, entityId: item.id },
      label: item.title,
      evidenceIds: item.evidenceIds,
    })),
    ...project.meddpicc.paperProcess.steps.map((item) => ({
      target: { area: 'paperProcess' as const, entityId: item.id },
      label: item.title,
      evidenceIds: item.evidenceIds,
    })),
    ...project.meddpicc.pain.items.map((item) => ({
      target: { area: 'pain' as const, entityId: item.id },
      label: item.statement,
      evidenceIds: item.evidenceIds,
    })),
    ...project.meddpicc.competition.knownAlternatives.map((item) => ({
      target: { area: 'competition' as const, entityId: item.id },
      label: item.name,
      evidenceIds: item.evidenceIds,
    })),
  ]
}

function targetKey(target: QualificationEvidenceTarget): string {
  return `${target.area}::${target.entityId}`
}

export function listQualificationEvidenceTargets(project: MeddpiccProject): QualificationEvidenceTargetGroup[] {
  const carriers = stableEvidenceCarriers(project)

  return (Object.entries(qualificationAreaLabels) as Array<[ProjectAreaKey, string]>).map(([area, label]) => ({
    area,
    label,
    targets: carriers
      .filter((carrier) => carrier.target.area === area)
      .map((carrier) => ({
        ...carrier.target,
        label: carrier.label,
        evidenceIds: [...new Set(carrier.evidenceIds)],
      })),
    ...(area === 'champions'
      ? {
          unsupportedReason:
            'Champion-Evidenz hängt derzeit an Behavior-Einträgen ohne eigene stabile ID. Diese Links bleiben lesbar, werden in diesem Slice aber nicht künstlich adressierbar gemacht.',
        }
      : {}),
  }))
}

export function qualificationTargetsForEvidence(
  project: MeddpiccProject,
  evidenceId: string,
): QualificationEvidenceTargetInfo[] {
  return stableEvidenceCarriers(project)
    .filter((carrier) => carrier.evidenceIds.includes(evidenceId))
    .map((carrier) => ({
      ...carrier.target,
      label: carrier.label,
      evidenceIds: [...new Set(carrier.evidenceIds)],
    }))
}

export function evidenceForQualificationTarget(
  project: MeddpiccProject,
  target: QualificationEvidenceTarget,
): ProjectEvidence[] {
  const carrier = stableEvidenceCarriers(project).find((item) => targetKey(item.target) === targetKey(target))
  if (!carrier) return []

  const evidenceIds = new Set(carrier.evidenceIds)
  return project.evidence.filter((evidence) => evidenceIds.has(evidence.id))
}

export function replaceEvidenceQualificationLinks(
  project: MeddpiccProject,
  evidenceId: string,
  targets: readonly QualificationEvidenceTarget[],
): void {
  if (!project.evidence.some((evidence) => evidence.id === evidenceId)) {
    throw new Error(`Evidence-ID "${evidenceId}" existiert nicht.`)
  }

  const carriers = stableEvidenceCarriers(project)
  const carrierByKey = new Map(carriers.map((carrier) => [targetKey(carrier.target), carrier]))
  const desiredKeys = new Set(targets.map(targetKey))

  for (const target of targets) {
    if (!carrierByKey.has(targetKey(target))) {
      throw new Error(
        `Qualification-Entity "${target.entityId}" im Bereich "${target.area}" existiert nicht oder ist nicht stabil adressierbar.`,
      )
    }
  }

  for (const carrier of carriers) {
    const nextIds = [...new Set(carrier.evidenceIds.filter((id) => id !== evidenceId))]
    if (desiredKeys.has(targetKey(carrier.target))) {
      nextIds.push(evidenceId)
    }
    carrier.evidenceIds.splice(0, carrier.evidenceIds.length, ...nextIds)
  }
}
