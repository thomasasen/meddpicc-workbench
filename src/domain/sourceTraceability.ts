import type {
  MeddpiccProject,
  ProjectAction,
  ProjectAreaKey,
  ProjectEvidence,
  ProjectReference,
  ProjectRisk,
} from './project'

export type SourceTrace = {
  evidence: ProjectEvidence[]
  references: ProjectReference[]
  evidenceWithoutReference: number
}

function uniqueEvidence(items: ProjectEvidence[]): ProjectEvidence[] {
  return [...new Map(items.map((item) => [item.id, item])).values()]
}

function evidenceByIds(project: MeddpiccProject, ids: readonly string[]): ProjectEvidence[] {
  const wanted = new Set(ids)
  return project.evidence.filter((item) => wanted.has(item.id))
}

function referenceTrace(project: MeddpiccProject, evidence: ProjectEvidence[]): SourceTrace {
  const referenceIds = new Set(evidence.map((item) => item.referenceId).filter((id): id is string => Boolean(id)))
  const references = project.references.filter((item) => referenceIds.has(item.id))

  return {
    evidence,
    references,
    evidenceWithoutReference: evidence.filter((item) => !item.referenceId).length,
  }
}

function entityEvidenceIds(project: MeddpiccProject, area: ProjectAreaKey, entityIds: readonly string[]): string[] {
  const ids = new Set(entityIds)

  switch (area) {
    case 'metrics':
      return project.meddpicc.metrics.metrics.filter((item) => ids.has(item.id)).flatMap((item) => item.evidenceIds)
    case 'economicBuyer':
      return project.meddpicc.economicBuyer.candidates
        .filter((item) => ids.has(item.stakeholderId))
        .flatMap((item) => item.evidenceIds)
    case 'decisionCriteria':
      return project.meddpicc.decisionCriteria.criteria
        .filter((item) => ids.has(item.id))
        .flatMap((item) => item.evidenceIds)
    case 'decisionProcess':
      return project.meddpicc.decisionProcess.steps.filter((item) => ids.has(item.id)).flatMap((item) => item.evidenceIds)
    case 'paperProcess':
      return project.meddpicc.paperProcess.steps.filter((item) => ids.has(item.id)).flatMap((item) => item.evidenceIds)
    case 'pain':
      return project.meddpicc.pain.items.filter((item) => ids.has(item.id)).flatMap((item) => item.evidenceIds)
    case 'champions':
      return project.meddpicc.champions.people
        .filter((item) => ids.has(item.stakeholderId))
        .flatMap((item) => item.behaviors.flatMap((behavior) => behavior.evidenceIds))
    case 'competition':
      return project.meddpicc.competition.knownAlternatives
        .filter((item) => ids.has(item.id))
        .flatMap((item) => item.evidenceIds)
  }

  return []
}

export function traceAreaSources(project: MeddpiccProject, area: ProjectAreaKey): SourceTrace {
  const areaEvidence = project.evidence.filter((item) => item.relatedAreas.includes(area))
  const sectionEvidence = evidenceByIds(project, project.meddpicc[area].evidenceIds)
  return referenceTrace(project, uniqueEvidence([...sectionEvidence, ...areaEvidence]))
}

export function traceRiskSources(project: MeddpiccProject, risk: ProjectRisk): SourceTrace {
  const sectionEvidence = evidenceByIds(project, project.meddpicc[risk.relatedArea].evidenceIds)
  const linkedEvidence = evidenceByIds(project, entityEvidenceIds(project, risk.relatedArea, risk.relatedEntityIds))
  const fallbackAreaEvidence = risk.relatedEntityIds.length === 0 ? traceAreaSources(project, risk.relatedArea).evidence : []

  return referenceTrace(project, uniqueEvidence([...linkedEvidence, ...sectionEvidence, ...fallbackAreaEvidence]))
}

export function traceActionSources(project: MeddpiccProject, action: ProjectAction): SourceTrace {
  const directEvidence = evidenceByIds(project, action.evidenceIds)
  const linkedRisk = action.relatedRiskId ? project.risks.find((risk) => risk.id === action.relatedRiskId) : undefined
  const riskEvidence = linkedRisk ? traceRiskSources(project, linkedRisk).evidence : []

  return referenceTrace(project, uniqueEvidence([...directEvidence, ...riskEvidence]))
}
