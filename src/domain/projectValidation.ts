import { projectAreaKeys, type MeddpiccProject } from './project'

export type DomainValidationIssue = {
  code: string
  path: string
  message: string
}

type EvidenceCarrier = {
  evidenceIds: string[]
}

type ProcessStep = MeddpiccProject['meddpicc']['decisionProcess']['steps'][number]

function addMissingReferences(
  issues: DomainValidationIssue[],
  values: readonly string[],
  existing: ReadonlySet<string>,
  path: string,
  label: string,
) {
  for (const value of values) {
    if (!existing.has(value)) {
      issues.push({
        code: 'missing_reference',
        path,
        message: `${label} "${value}" existiert nicht.`,
      })
    }
  }
}

function validateEvidenceCarrier(
  issues: DomainValidationIssue[],
  carrier: EvidenceCarrier,
  evidenceIds: ReadonlySet<string>,
  path: string,
) {
  addMissingReferences(issues, carrier.evidenceIds, evidenceIds, `${path}/evidenceIds`, 'Evidence-ID')
}

function validateProcess(
  issues: DomainValidationIssue[],
  steps: ProcessStep[],
  stakeholderIds: ReadonlySet<string>,
  evidenceIds: ReadonlySet<string>,
  basePath: string,
) {
  const stepIds = new Set(steps.map((step) => step.id))

  for (const [index, step] of steps.entries()) {
    const stepPath = `${basePath}/steps/${index}`

    if (step.ownerStakeholderId && !stakeholderIds.has(step.ownerStakeholderId)) {
      issues.push({
        code: 'missing_stakeholder_reference',
        path: `${stepPath}/ownerStakeholderId`,
        message: `Stakeholder-ID "${step.ownerStakeholderId}" existiert nicht.`,
      })
    }

    addMissingReferences(issues, step.predecessorIds, stepIds, `${stepPath}/predecessorIds`, 'Vorgänger-Step-ID')
    validateEvidenceCarrier(issues, step, evidenceIds, stepPath)
  }

  const state = new Map<string, 'visiting' | 'visited'>()
  const byId = new Map(steps.map((step) => [step.id, step]))

  function visit(stepId: string, stack: string[]) {
    const current = state.get(stepId)

    if (current === 'visited') return

    if (current === 'visiting') {
      const cycleStart = stack.indexOf(stepId)
      const cycle = [...stack.slice(cycleStart), stepId]
      issues.push({
        code: 'dependency_cycle',
        path: `${basePath}/steps`,
        message: `Abhängigkeitszyklus erkannt: ${cycle.join(' → ')}.`,
      })
      return
    }

    state.set(stepId, 'visiting')
    const step = byId.get(stepId)

    for (const predecessorId of step?.predecessorIds ?? []) {
      if (byId.has(predecessorId)) {
        visit(predecessorId, [...stack, stepId])
      }
    }

    state.set(stepId, 'visited')
  }

  for (const stepId of stepIds) {
    visit(stepId, [])
  }
}

function collectEntityIds(project: MeddpiccProject): Array<{ id: string; path: string }> {
  const ids: Array<{ id: string; path: string }> = []

  project.stakeholders.forEach((item, index) => ids.push({ id: item.id, path: `/stakeholders/${index}/id` }))
  project.evidence.forEach((item, index) => ids.push({ id: item.id, path: `/evidence/${index}/id` }))
  project.risks.forEach((item, index) => ids.push({ id: item.id, path: `/risks/${index}/id` }))
  project.actions.forEach((item, index) => ids.push({ id: item.id, path: `/actions/${index}/id` }))
  project.references.forEach((item, index) => ids.push({ id: item.id, path: `/references/${index}/id` }))
  project.history.forEach((item, index) => ids.push({ id: item.id, path: `/history/${index}/id` }))

  project.meddpicc.metrics.metrics.forEach((item, index) =>
    ids.push({ id: item.id, path: `/meddpicc/metrics/metrics/${index}/id` }),
  )
  project.meddpicc.decisionCriteria.criteria.forEach((item, index) =>
    ids.push({ id: item.id, path: `/meddpicc/decisionCriteria/criteria/${index}/id` }),
  )
  project.meddpicc.decisionProcess.steps.forEach((item, index) =>
    ids.push({ id: item.id, path: `/meddpicc/decisionProcess/steps/${index}/id` }),
  )
  project.meddpicc.paperProcess.steps.forEach((item, index) =>
    ids.push({ id: item.id, path: `/meddpicc/paperProcess/steps/${index}/id` }),
  )
  project.meddpicc.pain.items.forEach((item, index) =>
    ids.push({ id: item.id, path: `/meddpicc/pain/items/${index}/id` }),
  )
  project.meddpicc.competition.knownAlternatives.forEach((item, index) =>
    ids.push({ id: item.id, path: `/meddpicc/competition/knownAlternatives/${index}/id` }),
  )

  return ids
}

export function validateProjectDomain(project: MeddpiccProject): DomainValidationIssue[] {
  const issues: DomainValidationIssue[] = []
  const stakeholderIds = new Set(project.stakeholders.map((item) => item.id))
  const evidenceIds = new Set(project.evidence.map((item) => item.id))
  const referenceIds = new Set(project.references.map((item) => item.id))
  const riskIds = new Set(project.risks.map((item) => item.id))

  const seen = new Map<string, string>()
  for (const entity of collectEntityIds(project)) {
    const firstPath = seen.get(entity.id)
    if (firstPath) {
      issues.push({
        code: 'duplicate_id',
        path: entity.path,
        message: `ID "${entity.id}" ist bereits unter ${firstPath} vergeben.`,
      })
    } else {
      seen.set(entity.id, entity.path)
    }
  }

  for (const area of projectAreaKeys) {
    validateEvidenceCarrier(issues, project.meddpicc[area] as EvidenceCarrier, evidenceIds, `/meddpicc/${area}`)
  }

  project.meddpicc.metrics.metrics.forEach((metric, index) =>
    validateEvidenceCarrier(issues, metric, evidenceIds, `/meddpicc/metrics/metrics/${index}`),
  )

  project.meddpicc.economicBuyer.candidates.forEach((candidate, index) => {
    if (!stakeholderIds.has(candidate.stakeholderId)) {
      issues.push({
        code: 'missing_stakeholder_reference',
        path: `/meddpicc/economicBuyer/candidates/${index}/stakeholderId`,
        message: `Stakeholder-ID "${candidate.stakeholderId}" existiert nicht.`,
      })
    }
    validateEvidenceCarrier(issues, candidate, evidenceIds, `/meddpicc/economicBuyer/candidates/${index}`)
  })

  project.meddpicc.decisionCriteria.criteria.forEach((criterion, index) =>
    validateEvidenceCarrier(issues, criterion, evidenceIds, `/meddpicc/decisionCriteria/criteria/${index}`),
  )

  validateProcess(
    issues,
    project.meddpicc.decisionProcess.steps,
    stakeholderIds,
    evidenceIds,
    '/meddpicc/decisionProcess',
  )
  validateProcess(issues, project.meddpicc.paperProcess.steps, stakeholderIds, evidenceIds, '/meddpicc/paperProcess')

  project.meddpicc.pain.items.forEach((pain, index) =>
    validateEvidenceCarrier(issues, pain, evidenceIds, `/meddpicc/pain/items/${index}`),
  )

  project.meddpicc.champions.people.forEach((champion, championIndex) => {
    if (!stakeholderIds.has(champion.stakeholderId)) {
      issues.push({
        code: 'missing_stakeholder_reference',
        path: `/meddpicc/champions/people/${championIndex}/stakeholderId`,
        message: `Stakeholder-ID "${champion.stakeholderId}" existiert nicht.`,
      })
    }

    champion.behaviors.forEach((behavior, behaviorIndex) =>
      validateEvidenceCarrier(
        issues,
        behavior,
        evidenceIds,
        `/meddpicc/champions/people/${championIndex}/behaviors/${behaviorIndex}`,
      ),
    )
  })

  project.meddpicc.competition.knownAlternatives.forEach((alternative, index) =>
    validateEvidenceCarrier(issues, alternative, evidenceIds, `/meddpicc/competition/knownAlternatives/${index}`),
  )

  project.evidence.forEach((evidence, index) => {
    if (evidence.sourceStakeholderId && !stakeholderIds.has(evidence.sourceStakeholderId)) {
      issues.push({
        code: 'missing_stakeholder_reference',
        path: `/evidence/${index}/sourceStakeholderId`,
        message: `Stakeholder-ID "${evidence.sourceStakeholderId}" existiert nicht.`,
      })
    }

    if (evidence.referenceId && !referenceIds.has(evidence.referenceId)) {
      issues.push({
        code: 'missing_reference_record',
        path: `/evidence/${index}/referenceId`,
        message: `Reference-ID "${evidence.referenceId}" existiert nicht.`,
      })
    }
  })

  project.risks.forEach((risk, index) => {
    addMissingReferences(
      issues,
      risk.relatedEntityIds,
      new Set(seen.keys()),
      `/risks/${index}/relatedEntityIds`,
      'Related-Entity-ID',
    )
  })

  project.actions.forEach((action, index) => {
    if (action.relatedRiskId && !riskIds.has(action.relatedRiskId)) {
      issues.push({
        code: 'missing_risk_reference',
        path: `/actions/${index}/relatedRiskId`,
        message: `Risk-ID "${action.relatedRiskId}" existiert nicht.`,
      })
    }
    validateEvidenceCarrier(issues, action, evidenceIds, `/actions/${index}`)
  })

  if (project.calculators.businessCase) {
    validateEvidenceCarrier(issues, project.calculators.businessCase, evidenceIds, '/calculators/businessCase')
  }

  validateEvidenceCarrier(issues, project.planning.implementation, evidenceIds, '/planning/implementation')

  project.history.forEach((event, index) => {
    if (event.entityId && !seen.has(event.entityId)) {
      issues.push({
        code: 'missing_history_entity',
        path: `/history/${index}/entityId`,
        message: `History-Entity-ID "${event.entityId}" existiert nicht.`,
      })
    }
  })

  return issues
}
