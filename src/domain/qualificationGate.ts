import {
  inspectDeal,
  type DealInspectorFinding,
  type DealInspectorInput,
  type DealInspectorRuleId,
} from './dealInspector'
import { deriveNextBestActions, type NextBestActionRecommendation, type NextBestActionRuleId } from './nextBestAction'
import type { MeddpiccProject, ProjectAreaKey } from './project'

export const qualificationGateIds = ['poc-pilot', 'proposal-pricing', 'commit-forecast'] as const

export type QualificationGateId = (typeof qualificationGateIds)[number]
export type QualificationGateStatus = 'ready' | 'conditional' | 'not-ready'
export type QualificationGateRequirementLevel = 'required' | 'recommended'
export type QualificationGateArea = ProjectAreaKey | 'project'

export type QualificationGateRequirement = {
  id: string
  level: QualificationGateRequirementLevel
  area: QualificationGateArea
  label: string
  satisfied: boolean
  explanation: string
  desiredEvidence: string[]
  nextStep: string
  relatedFindingRuleIds: DealInspectorRuleId[]
  evidenceIds: string[]
  entityIds: string[]
  inputs: DealInspectorInput[]
}

export type QualificationGateAssessment = {
  id: string
  gateId: QualificationGateId
  title: string
  status: QualificationGateStatus
  verdict: string
  rationale: string
  requirements: QualificationGateRequirement[]
  missingRequired: QualificationGateRequirement[]
  missingRecommended: QualificationGateRequirement[]
  nextStep: string | null
  nextBestActionRuleId: NextBestActionRuleId | null
  nextBestActionId: string | null
  evidenceIds: string[]
  entityIds: string[]
  inputs: DealInspectorInput[]
  limitations: string[]
}

type GateContext = {
  project: MeddpiccProject
  findings: DealInspectorFinding[]
  recommendations: NextBestActionRecommendation[]
}

function unique<T>(values: readonly T[]): T[] {
  return [...new Set(values)]
}

function uniqueInputs(inputs: readonly DealInspectorInput[]): DealInspectorInput[] {
  const seen = new Set<string>()
  const result: DealInspectorInput[] = []

  for (const input of inputs) {
    const key = input.path + '\u0000' + input.label + '\u0000' + input.value
    if (seen.has(key)) continue
    seen.add(key)
    result.push(input)
  }

  return result
}

function existingEvidenceIds(project: MeddpiccProject, ids: readonly string[]): string[] {
  const existing = new Set(project.evidence.map((item) => item.id))
  return unique(ids).filter((id) => existing.has(id))
}

function supportingEvidenceIds(project: MeddpiccProject, ids: readonly string[]): string[] {
  const wanted = new Set(ids)

  return project.evidence
    .filter(
      (item) =>
        wanted.has(item.id) &&
        item.classification !== 'assumption' &&
        item.classification !== 'unknown' &&
        item.verification !== 'unconfirmed',
    )
    .map((item) => item.id)
}

function areaEvidenceIds(project: MeddpiccProject, area: ProjectAreaKey): string[] {
  const section = project.meddpicc[area]
  const base = [...section.evidenceIds]

  switch (area) {
    case 'metrics':
      return existingEvidenceIds(project, [
        ...base,
        ...project.meddpicc.metrics.metrics.flatMap((item) => item.evidenceIds),
      ])
    case 'economicBuyer':
      return existingEvidenceIds(project, [
        ...base,
        ...project.meddpicc.economicBuyer.candidates.flatMap((item) => item.evidenceIds),
      ])
    case 'decisionCriteria':
      return existingEvidenceIds(project, [
        ...base,
        ...project.meddpicc.decisionCriteria.criteria.flatMap((item) => item.evidenceIds),
      ])
    case 'decisionProcess':
      return existingEvidenceIds(project, [
        ...base,
        ...project.meddpicc.decisionProcess.steps.flatMap((item) => item.evidenceIds),
      ])
    case 'paperProcess':
      return existingEvidenceIds(project, [
        ...base,
        ...project.meddpicc.paperProcess.steps.flatMap((item) => item.evidenceIds),
      ])
    case 'pain':
      return existingEvidenceIds(project, [...base, ...project.meddpicc.pain.items.flatMap((item) => item.evidenceIds)])
    case 'champions':
      return existingEvidenceIds(project, [
        ...base,
        ...project.meddpicc.champions.people.flatMap((person) =>
          person.behaviors.flatMap((behavior) => behavior.evidenceIds),
        ),
      ])
    case 'competition':
      return existingEvidenceIds(project, [
        ...base,
        ...project.meddpicc.competition.knownAlternatives.flatMap((item) => item.evidenceIds),
      ])
  }
}

function relatedFindings(context: GateContext, ruleIds: readonly DealInspectorRuleId[]): DealInspectorFinding[] {
  const wanted = new Set(ruleIds)
  return context.findings.filter((finding) => wanted.has(finding.ruleId))
}

function findingRequirement(
  context: GateContext,
  value: {
    id: string
    level: QualificationGateRequirementLevel
    area: ProjectAreaKey
    label: string
    findingRuleIds: DealInspectorRuleId[]
    explanationWhenSatisfied: string
    explanationWhenMissing: string
    desiredEvidence: string[]
    nextStep: string
  },
): QualificationGateRequirement {
  const findings = relatedFindings(context, value.findingRuleIds)
  const satisfied = findings.length === 0

  return {
    id: value.id,
    level: value.level,
    area: value.area,
    label: value.label,
    satisfied,
    explanation: satisfied ? value.explanationWhenSatisfied : value.explanationWhenMissing,
    desiredEvidence: value.desiredEvidence,
    nextStep: value.nextStep,
    relatedFindingRuleIds: unique(findings.map((finding) => finding.ruleId)),
    evidenceIds: existingEvidenceIds(context.project, [
      ...areaEvidenceIds(context.project, value.area),
      ...findings.flatMap((finding) => finding.evidenceIds),
    ]),
    entityIds: unique(findings.flatMap((finding) => finding.entityIds)),
    inputs: uniqueInputs(findings.flatMap((finding) => finding.inputs)),
  }
}

function painRequirement(
  context: GateContext,
  id: string,
  level: QualificationGateRequirementLevel,
  requireImplication: boolean,
): QualificationGateRequirement {
  const section = context.project.meddpicc.pain
  const supportedItems = section.items.filter(
    (item) => supportingEvidenceIds(context.project, item.evidenceIds).length > 0,
  )
  const ruleIds: DealInspectorRuleId[] = requireImplication
    ? ['pain.identified', 'pain.implication-complete']
    : ['pain.identified']
  const related = relatedFindings(context, ruleIds)
  const satisfied = supportedItems.length > 0 && related.length === 0

  return {
    id,
    level,
    area: 'pain',
    label: requireImplication
      ? 'Pain ist identifiziert, evidenzbasiert und ausreichend impliziert'
      : 'Konkreter kundenseitiger Pain ist evidenzbasiert identifiziert',
    satisfied,
    explanation: satisfied
      ? requireImplication
        ? 'Mindestens ein Pain ist mit belastbarer Evidence verknüpft; Business Impact und Konsequenz des Nicht-Handelns sind ausreichend beschrieben.'
        : 'Mindestens ein konkreter Pain ist mit belastbarer Evidence verknüpft.'
      : requireImplication
        ? 'Pain, Business Impact oder Konsequenz des Nicht-Handelns sind noch nicht ausreichend evidenzbasiert qualifiziert.'
        : 'Es fehlt noch ein konkreter Pain mit belastbarer Evidence.',
    desiredEvidence: requireImplication
      ? ['Konkrete Problemaussage', 'Business Impact', 'Konsequenz des Nicht-Handelns', 'Belastbare Pain-Evidence']
      : ['Konkrete Problemaussage des Kunden', 'Geschäftliche Relevanz', 'Belastbare Pain-Evidence'],
    nextStep: requireImplication
      ? 'Pain, Business Impact und Konsequenz des Nicht-Handelns evidenzbasiert vervollständigen.'
      : 'Kundenseitigen Pain konkretisieren und mit belastbarer Evidence verknüpfen.',
    relatedFindingRuleIds: unique(related.map((finding) => finding.ruleId)),
    evidenceIds: existingEvidenceIds(context.project, [
      ...section.evidenceIds,
      ...section.items.flatMap((item) => item.evidenceIds),
    ]),
    entityIds: section.items.map((item) => item.id),
    inputs: [
      {
        path: 'meddpicc.pain.items',
        label: 'Erfasste Pain-Items',
        value: String(section.items.length),
      },
      {
        path: 'meddpicc.pain.items[*].evidenceIds',
        label: 'Pain-Items mit belastbarer Evidence',
        value: String(supportedItems.length),
      },
      ...(requireImplication
        ? [
            {
              path: 'meddpicc.pain.items[*].businessImpact',
              label: 'Offene Pain-Implikation',
              value: related.some((finding) => finding.ruleId === 'pain.implication-complete') ? 'ja' : 'nein',
            },
          ]
        : []),
    ],
  }
}

function decisionCriteriaRequirement(
  context: GateContext,
  id: string,
  level: QualificationGateRequirementLevel,
): QualificationGateRequirement {
  const section = context.project.meddpicc.decisionCriteria
  const importantCriteria = section.criteria.filter(
    (criterion) => criterion.importance === 'high' || criterion.importance === 'must-have',
  )
  const supportedImportantCriteria = importantCriteria.filter(
    (criterion) => supportingEvidenceIds(context.project, criterion.evidenceIds).length > 0,
  )
  const satisfied =
    section.criteria.length > 0 &&
    importantCriteria.length > 0 &&
    supportedImportantCriteria.length === importantCriteria.length

  let explanation = 'Die priorisierten Decision Criteria sind mit belastbarer Evidence hinterlegt.'
  if (section.criteria.length === 0) {
    explanation = 'Es sind noch keine Decision Criteria strukturiert erfasst.'
  } else if (importantCriteria.length === 0) {
    explanation = 'Es ist noch nicht belastbar priorisiert, welche Decision Criteria high oder must-have sind.'
  } else if (supportedImportantCriteria.length !== importantCriteria.length) {
    explanation = 'Nicht alle high-/must-have Decision Criteria sind mit belastbarer Evidence abgesichert.'
  }

  return {
    id,
    level,
    area: 'decisionCriteria',
    label: 'Priorisierte Decision Criteria sind kundenseitig belastbar',
    satisfied,
    explanation,
    desiredEvidence: [
      'Mindestens ein high- oder must-have Decision Criterion',
      'Belastbare Evidence für alle high-/must-have Kriterien',
      'Klarheit darüber, woran der Kunde Erfolg und Eignung bewertet',
    ],
    nextStep: 'High-/must-have Decision Criteria mit dem Kunden priorisieren und evidenzbasiert bestätigen.',
    relatedFindingRuleIds: [],
    evidenceIds: existingEvidenceIds(context.project, [
      ...section.evidenceIds,
      ...importantCriteria.flatMap((criterion) => criterion.evidenceIds),
    ]),
    entityIds: importantCriteria.map((criterion) => criterion.id),
    inputs: [
      {
        path: 'meddpicc.decisionCriteria.criteria',
        label: 'Erfasste Decision Criteria',
        value: String(section.criteria.length),
      },
      {
        path: 'meddpicc.decisionCriteria.criteria[*].importance',
        label: 'High-/must-have Kriterien',
        value: String(importantCriteria.length),
      },
      {
        path: 'meddpicc.decisionCriteria.criteria[*].evidenceIds',
        label: 'Davon belastbar belegt',
        value: String(supportedImportantCriteria.length),
      },
    ],
  }
}

function customerConfirmedMetricsRequirement(
  context: GateContext,
  id: string,
  level: QualificationGateRequirementLevel,
): QualificationGateRequirement {
  const section = context.project.meddpicc.metrics
  const confirmed = section.metrics.filter(
    (metric) => metric.customerConfirmed && supportingEvidenceIds(context.project, metric.evidenceIds).length > 0,
  )
  const related = relatedFindings(context, ['metrics.customer-confirmed'])

  return {
    id,
    level,
    area: 'metrics',
    label: 'Mindestens eine relevante Metric ist kundenseitig bestätigt',
    satisfied: confirmed.length > 0,
    explanation:
      confirmed.length > 0
        ? 'Mindestens eine relevante Metric ist kundenseitig bestätigt und mit belastbarer Evidence hinterlegt.'
        : 'Es fehlt noch eine kundenseitig bestätigte Metric mit belastbarer Evidence.',
    desiredEvidence: [
      'Kundenseitig bestätigter Current State',
      'Kundenseitig bestätigter Desired Outcome',
      'Belastbare Evidence für die verwendete Metric',
    ],
    nextStep: 'Current State und Desired Outcome mit dem Kunden quantifizieren und evidenzbasiert bestätigen.',
    relatedFindingRuleIds: unique(related.map((finding) => finding.ruleId)),
    evidenceIds: existingEvidenceIds(context.project, [
      ...section.evidenceIds,
      ...section.metrics.flatMap((metric) => metric.evidenceIds),
    ]),
    entityIds: section.metrics.map((metric) => metric.id),
    inputs: [
      {
        path: 'meddpicc.metrics.metrics',
        label: 'Erfasste Metrics',
        value: String(section.metrics.length),
      },
      {
        path: 'meddpicc.metrics.metrics[*].customerConfirmed',
        label: 'Belastbar kundenseitig bestätigte Metrics',
        value: String(confirmed.length),
      },
    ],
  }
}

function economicImpactRequirement(
  context: GateContext,
  id: string,
  level: QualificationGateRequirementLevel,
): QualificationGateRequirement {
  const section = context.project.meddpicc.metrics
  const supported = section.metrics.filter(
    (metric) => metric.customerConfirmed && supportingEvidenceIds(context.project, metric.evidenceIds).length > 0,
  )
  const quantified = supported.filter(
    (metric) => metric.economicImpact.value !== null && Boolean(metric.economicImpact.derivation?.trim()),
  )
  const related = relatedFindings(context, ['metrics.economic-impact-quantified'])

  return {
    id,
    level,
    area: 'metrics',
    label: 'Wirtschaftlicher Impact ist nachvollziehbar quantifiziert',
    satisfied: quantified.length > 0,
    explanation:
      quantified.length > 0
        ? 'Mindestens eine kundenseitig bestätigte Metric besitzt einen nachvollziehbar hergeleiteten wirtschaftlichen Impact.'
        : 'Es fehlt noch mindestens eine belastbar bestätigte Metric mit quantifiziertem und nachvollziehbar hergeleitetem Economic Impact.',
    desiredEvidence: [
      'Wirtschaftlich quantifizierter Nutzen mindestens einer relevanten Metric',
      'Nachvollziehbare Herleitung des wirtschaftlichen Effekts',
      'Belastbare Evidence für die zugrunde liegende Metric',
    ],
    nextStep: 'Economic Impact mindestens einer relevanten Metric gemeinsam mit dem Kunden validieren.',
    relatedFindingRuleIds: unique(related.map((finding) => finding.ruleId)),
    evidenceIds: existingEvidenceIds(context.project, [
      ...section.evidenceIds,
      ...section.metrics.flatMap((metric) => metric.evidenceIds),
    ]),
    entityIds: section.metrics.map((metric) => metric.id),
    inputs: [
      {
        path: 'meddpicc.metrics.metrics[*].customerConfirmed',
        label: 'Belastbar kundenseitig bestätigte Metrics',
        value: String(supported.length),
      },
      {
        path: 'meddpicc.metrics.metrics[*].economicImpact',
        label: 'Davon mit quantifiziertem Economic Impact',
        value: String(quantified.length),
      },
    ],
  }
}

function targetCloseRequirement(context: GateContext): QualificationGateRequirement {
  const targetCloseDate = context.project.project.targetCloseDate

  return {
    id: 'commit.target-close',
    level: 'required',
    area: 'project',
    label: 'Target Close ist konkret gesetzt',
    satisfied: targetCloseDate !== null,
    explanation:
      targetCloseDate !== null
        ? 'Ein konkretes Target Close ist vorhanden und kann gegen Decision- und Paper-Process geprüft werden.'
        : 'Ohne konkretes Target Close ist ein Commit zeitlich nicht belastbar prüfbar.',
    desiredEvidence: ['Konkretes, kundenseitig plausibles Target Close'],
    nextStep:
      'Target Close mit dem kundenseitigen Entscheidungs- und Beschaffungsablauf abgleichen und konkret setzen.',
    relatedFindingRuleIds: [],
    evidenceIds: [],
    entityIds: [],
    inputs: [
      {
        path: 'project.targetCloseDate',
        label: 'Target Close',
        value: targetCloseDate ?? 'unbekannt',
      },
    ],
  }
}

function competitionRequirement(context: GateContext): QualificationGateRequirement {
  const section = context.project.meddpicc.competition
  const supportedAlternatives = section.knownAlternatives.filter(
    (alternative) => supportingEvidenceIds(context.project, alternative.evidenceIds).length > 0,
  )
  const statusQualified = section.status !== 'unknown' && section.status !== 'assumption'
  const satisfied = statusQualified && supportedAlternatives.length > 0

  return {
    id: 'commit.competition',
    level: 'recommended',
    area: 'competition',
    label: 'Competition einschließlich Status quo / Do Nothing ist qualifiziert',
    satisfied,
    explanation: satisfied
      ? 'Mindestens eine relevante Alternative ist evidenzbasiert qualifiziert.'
      : 'Competition ist noch nicht ausreichend evidenzbasiert qualifiziert; dadurch bleibt ein relevantes Forecast-Risiko offen.',
    desiredEvidence: [
      'Aktive Alternativen einschließlich Status quo / Do Nothing',
      'Belastbare Evidence zur tatsächlichen Wettbewerbssituation',
      'Klarheit über relevante Stärken, Risiken oder Budgetkonkurrenz',
    ],
    nextStep: 'Competition, Status quo und Do-Nothing-Risiko mit einem belastbaren Kundenzugang qualifizieren.',
    relatedFindingRuleIds: [],
    evidenceIds: existingEvidenceIds(context.project, [
      ...section.evidenceIds,
      ...supportedAlternatives.flatMap((alternative) => alternative.evidenceIds),
    ]),
    entityIds: supportedAlternatives.map((alternative) => alternative.id),
    inputs: [
      {
        path: 'meddpicc.competition.status',
        label: 'Competition-Status',
        value: section.status,
      },
      {
        path: 'meddpicc.competition.knownAlternatives',
        label: 'Erfasste Alternativen',
        value: String(section.knownAlternatives.length),
      },
      {
        path: 'meddpicc.competition.knownAlternatives[*].evidenceIds',
        label: 'Belastbar belegte Alternativen',
        value: String(supportedAlternatives.length),
      },
    ],
  }
}

function pocPilotRequirements(context: GateContext): QualificationGateRequirement[] {
  return [
    painRequirement(context, 'poc.pain', 'required', false),
    painRequirement(context, 'poc.pain-implication', 'recommended', true),
    decisionCriteriaRequirement(context, 'poc.decision-criteria', 'required'),
    findingRequirement(context, {
      id: 'poc.decision-process',
      level: 'required',
      area: 'decisionProcess',
      label: 'Kundenseitiger Decision Process und der Schritt nach erfolgreichem Test sind belastbar',
      findingRuleIds: ['decision-process.ready'],
      explanationWhenSatisfied:
        'Der kundenseitige Entscheidungsablauf ist belastbar genug, um einen erfolgreichen Test in einen nächsten Kaufprozess-Schritt zu überführen.',
      explanationWhenMissing:
        'Ein erfolgreicher Test wäre aktuell nicht sauber mit dem nächsten kundenseitigen Entscheidungsschritt verknüpft.',
      desiredEvidence: ['Erforderliche Entscheidungsschritte', 'Owner', 'kundenseitige Bestätigung der Abfolge'],
      nextStep: 'Decision Process kundenseitig validieren und den konkreten Schritt nach erfolgreichem Test klären.',
    }),
    customerConfirmedMetricsRequirement(context, 'poc.metrics', 'recommended'),
    findingRequirement(context, {
      id: 'poc.economic-buyer',
      level: 'recommended',
      area: 'economicBuyer',
      label: 'Economic Buyer und wirtschaftliche Priorität sind ausreichend validiert',
      findingRuleIds: ['economic-buyer.validated'],
      explanationWhenSatisfied:
        'Die wirtschaftliche Entscheidungsautorität und Priorität sind belastbar genug qualifiziert.',
      explanationWhenMissing:
        'POC-/Pilot-Ressourcen würden eingesetzt, obwohl wirtschaftliche Authority, Access oder Priorität noch nicht belastbar sind.',
      desiredEvidence: ['Economic-Buyer-Authority', 'Investitionspriorität', 'belastbarer Access-Pfad'],
      nextStep: 'Economic Buyer und Investitionspriorität weiter qualifizieren, bevor der Test unnötig eskaliert.',
    }),
  ]
}

function proposalPricingRequirements(context: GateContext): QualificationGateRequirement[] {
  return [
    painRequirement(context, 'proposal.pain', 'required', false),
    customerConfirmedMetricsRequirement(context, 'proposal.metrics', 'required'),
    decisionCriteriaRequirement(context, 'proposal.decision-criteria', 'required'),
    economicImpactRequirement(context, 'proposal.economic-impact', 'recommended'),
    findingRequirement(context, {
      id: 'proposal.economic-buyer',
      level: 'recommended',
      area: 'economicBuyer',
      label: 'Economic Buyer ist belastbar validiert',
      findingRuleIds: ['economic-buyer.validated'],
      explanationWhenSatisfied: 'Die wirtschaftliche Entscheidungsautorität ist ausreichend qualifiziert.',
      explanationWhenMissing:
        'Ein Proposal kann erstellt werden, aber ohne validierten Economic Buyer bleibt das Risiko hoch, dass Preis und Priorität auf falscher Ebene bewertet werden.',
      desiredEvidence: ['Economic-Buyer-Authority', 'Priorität', 'direkte oder belastbare Interaktion'],
      nextStep: 'Economic-Buyer-Authority und Investitionspriorität validieren.',
    }),
    findingRequirement(context, {
      id: 'proposal.decision-process',
      level: 'recommended',
      area: 'decisionProcess',
      label: 'Decision Process ist kundenseitig belastbar',
      findingRuleIds: ['decision-process.ready'],
      explanationWhenSatisfied: 'Der Proposal ist in einen bekannten kundenseitigen Entscheidungsweg eingebettet.',
      explanationWhenMissing:
        'Der Proposal droht ohne klaren nächsten Entscheidungs- und Freigabeschritt im Prozess zu versanden.',
      desiredEvidence: ['Decision-Process-Schritte', 'Owner', 'kundenseitige Bestätigung'],
      nextStep: 'Decision Process und den konkreten nächsten Schritt nach dem Proposal validieren.',
    }),
  ]
}

function commitForecastRequirements(context: GateContext): QualificationGateRequirement[] {
  return [
    targetCloseRequirement(context),
    painRequirement(context, 'commit.pain', 'required', true),
    customerConfirmedMetricsRequirement(context, 'commit.metrics-confirmed', 'required'),
    economicImpactRequirement(context, 'commit.economic-impact', 'required'),
    findingRequirement(context, {
      id: 'commit.economic-buyer',
      level: 'required',
      area: 'economicBuyer',
      label: 'Economic Buyer, Authority, Access und Priorität sind validiert',
      findingRuleIds: ['economic-buyer.validated'],
      explanationWhenSatisfied:
        'Die finale wirtschaftliche Entscheidungsautorität und Priorität sind ausreichend qualifiziert.',
      explanationWhenMissing:
        'Ohne belastbare Economic-Buyer-Validierung bleibt offen, wer final entscheidet und ob die Investition tatsächlich Priorität hat.',
      desiredEvidence: [
        'Economic-Buyer-Authority',
        'direkte Interaktion oder belastbarer Access',
        'Investitionspriorität',
      ],
      nextStep: 'Economic-Buyer-Gap schließen, bevor der Deal als Commit geführt wird.',
    }),
    findingRequirement(context, {
      id: 'commit.decision-process',
      level: 'required',
      area: 'decisionProcess',
      label: 'Decision Process ist vollständig genug für den geplanten Close',
      findingRuleIds: ['decision-process.ready'],
      explanationWhenSatisfied: 'Erforderliche Entscheidungs- und Freigabeschritte sind belastbar abgebildet.',
      explanationWhenMissing:
        'Unbekannte, geplante oder blockierte Entscheidungsschritte machen den Zeitpunkt des Abschlusses unzuverlässig.',
      desiredEvidence: ['Erforderliche Schritte', 'Owner', 'Status und kundenseitige Bestätigung'],
      nextStep: 'Decision Process validieren und offene Blocker oder Owner klären.',
    }),
    findingRequirement(context, {
      id: 'commit.paper-process',
      level: 'required',
      area: 'paperProcess',
      label: 'Paper Process, Owner und Lead Times sind close-ready',
      findingRuleIds: ['paper-process.ready'],
      explanationWhenSatisfied: 'Procurement-, Legal-, PO- und Signaturschritte sind ausreichend belastbar.',
      explanationWhenMissing:
        'Close-relevante Procurement-/Legal-Lücken können den Forecast verschieben, selbst wenn die fachliche Entscheidung positiv ist.',
      desiredEvidence: ['Paper-Process-Schritte', 'Owner', 'Lead Times', 'kundenseitige Bestätigung'],
      nextStep: 'Paper Process, Owner und Lead Times belastbar bestätigen.',
    }),
    findingRequirement(context, {
      id: 'commit.champion',
      level: 'recommended',
      area: 'champions',
      label: 'Champion ist durch beobachtbares Verhalten belastbar',
      findingRuleIds: ['champion.proven'],
      explanationWhenSatisfied: 'Ein belastbarer Champion reduziert internes Überraschungsrisiko.',
      explanationWhenMissing:
        'Ein Commit ist nicht automatisch ausgeschlossen, aber ohne belastbaren Champion fehlt ein wichtiger interner Risikoindikator.',
      desiredEvidence: ['Einfluss', 'Personal Win', 'internes Verkaufen', 'beobachtbarer Zugang oder interne Aktion'],
      nextStep: 'Champion-Candidate durch eine konkrete interne Aktion weiter testen.',
    }),
    competitionRequirement(context),
  ]
}

function gateDefinition(
  context: GateContext,
  gateId: QualificationGateId,
): {
  title: string
  requirements: QualificationGateRequirement[]
  limitations: string[]
} {
  switch (gateId) {
    case 'poc-pilot':
      return {
        title: 'POC / Pilot',
        requirements: pocPilotRequirements(context),
        limitations: [
          'Schema 0.2.0 modelliert noch keine test-spezifischen Success Criteria oder den expliziten Kundengegenwert nach erfolgreichem Test. v0.1 prüft deshalb die vorgelagerte Qualifizierungsbasis, nicht die vollständige POC-Charter.',
        ],
      }
    case 'proposal-pricing':
      return {
        title: 'Proposal / Pricing',
        requirements: proposalPricingRequirements(context),
        limitations: [
          'Das Gate bewertet die Qualifizierungsreife. Interne Preisfreigaben, Angebotsgenehmigungen und kommerzielle Guardrails liegen außerhalb von v0.1.',
        ],
      }
    case 'commit-forecast':
      return {
        title: 'Commit Forecast',
        requirements: commitForecastRequirements(context),
        limitations: [
          'Das Gate ist keine Win Probability. Es prüft nachvollziehbare Qualification-Voraussetzungen und ersetzt kein Manager Judgment.',
        ],
      }
  }
}

function recommendationForMissingRequirements(
  context: GateContext,
  missingRequired: readonly QualificationGateRequirement[],
  missingRecommended: readonly QualificationGateRequirement[],
): NextBestActionRecommendation | undefined {
  const findRecommendation = (requirements: readonly QualificationGateRequirement[]) => {
    const findingRuleIds = new Set(requirements.flatMap((requirement) => requirement.relatedFindingRuleIds))
    if (findingRuleIds.size === 0) return undefined

    return context.recommendations.find((recommendation) =>
      recommendation.triggeringFindingRuleIds.some((ruleId) => findingRuleIds.has(ruleId)),
    )
  }

  return findRecommendation(missingRequired) ?? findRecommendation(missingRecommended)
}

export function assessQualificationGate(
  project: MeddpiccProject,
  gateId: QualificationGateId,
): QualificationGateAssessment {
  const findings = inspectDeal(project)
  const recommendations = deriveNextBestActions(project, findings)
  const context: GateContext = { project, findings, recommendations }
  const definition = gateDefinition(context, gateId)
  const missingRequired = definition.requirements.filter(
    (requirement) => requirement.level === 'required' && !requirement.satisfied,
  )
  const missingRecommended = definition.requirements.filter(
    (requirement) => requirement.level === 'recommended' && !requirement.satisfied,
  )

  const status: QualificationGateStatus =
    missingRequired.length > 0 ? 'not-ready' : missingRecommended.length > 0 ? 'conditional' : 'ready'

  const recommendation = recommendationForMissingRequirements(context, missingRequired, missingRecommended)
  const firstMissing = missingRequired[0] ?? missingRecommended[0]

  const verdict =
    status === 'not-ready'
      ? 'Pause empfohlen – vor diesem Schritt fehlen notwendige Qualification-Voraussetzungen.'
      : status === 'conditional'
        ? 'Nur bewusst fortfahren – die Basis ist vorhanden, aber relevante Qualifizierungsrisiken bleiben offen.'
        : 'Innerhalb des v0.1-Prüfumfangs sind die Qualification-Voraussetzungen erfüllt.'

  const rationale =
    status === 'not-ready'
      ? String(missingRequired.length) +
        ' notwendige Voraussetzung' +
        (missingRequired.length === 1 ? ' ist' : 'en sind') +
        ' noch offen.'
      : status === 'conditional'
        ? String(missingRecommended.length) +
          ' wichtige Qualifizierungslücke' +
          (missingRecommended.length === 1 ? ' bleibt' : 'n bleiben') +
          ' als bewusste Warnung offen.'
        : 'Keine der für dieses Gate definierten v0.1-Voraussetzungen ist offen.'

  return {
    id: 'qualification_gate_' + gateId.replaceAll('-', '_'),
    gateId,
    title: definition.title,
    status,
    verdict,
    rationale,
    requirements: definition.requirements,
    missingRequired,
    missingRecommended,
    nextStep: recommendation?.title ?? firstMissing?.nextStep ?? null,
    nextBestActionRuleId: recommendation?.ruleId ?? null,
    nextBestActionId: recommendation?.id ?? null,
    evidenceIds: unique(definition.requirements.flatMap((requirement) => requirement.evidenceIds)),
    entityIds: unique(definition.requirements.flatMap((requirement) => requirement.entityIds)),
    inputs: uniqueInputs(definition.requirements.flatMap((requirement) => requirement.inputs)),
    limitations: definition.limitations,
  }
}

export function assessQualificationGates(project: MeddpiccProject): QualificationGateAssessment[] {
  return qualificationGateIds.map((gateId) => assessQualificationGate(project, gateId))
}
