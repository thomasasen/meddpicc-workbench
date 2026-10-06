import type { MeddpiccProject, ProjectAreaKey } from './project'

export const dealInspectorRuleIds = [
  'pain.identified',
  'pain.implication-complete',
  'metrics.customer-confirmed',
  'metrics.economic-impact-quantified',
  'economic-buyer.validated',
  'decision-process.ready',
  'paper-process.ready',
  'champion.proven',
] as const

export type DealInspectorRuleId = (typeof dealInspectorRuleIds)[number]
export type DealInspectorSeverity = 'medium' | 'high'

export type DealInspectorInput = {
  path: string
  label: string
  value: string
}

export type DealInspectorFinding = {
  id: string
  ruleId: DealInspectorRuleId
  area: ProjectAreaKey
  severity: DealInspectorSeverity
  title: string
  whyItMatters: string
  missingEvidence: string[]
  evidenceIds: string[]
  entityIds: string[]
  inputs: DealInspectorInput[]
}

type DealInspectorRule = (project: MeddpiccProject) => DealInspectorFinding | null

function unique(values: readonly string[]): string[] {
  return [...new Set(values.filter(Boolean))]
}

function existingEvidenceIds(project: MeddpiccProject, ids: readonly string[]): string[] {
  const available = new Set(project.evidence.map((item) => item.id))
  return unique(ids).filter((id) => available.has(id))
}

function finding(
  project: MeddpiccProject,
  value: Omit<DealInspectorFinding, 'id' | 'evidenceIds'> & { evidenceIds: readonly string[] },
): DealInspectorFinding {
  return {
    ...value,
    id: `inspector_${value.ruleId.replaceAll('.', '_').replaceAll('-', '_')}`,
    evidenceIds: existingEvidenceIds(project, value.evidenceIds),
    entityIds: unique(value.entityIds),
  }
}

function textPresent(value: string | null | undefined): boolean {
  return Boolean(value?.trim())
}

function painIdentifiedRule(project: MeddpiccProject): DealInspectorFinding | null {
  const section = project.meddpicc.pain
  if (section.items.length > 0) return null

  return finding(project, {
    ruleId: 'pain.identified',
    area: 'pain',
    severity: 'high',
    title: 'Kundenseitiger Pain ist noch nicht konkret identifiziert.',
    whyItMatters:
      'Ohne konkreten Pain fehlt die fachliche Grundlage für Dringlichkeit, Metrics und einen belastbaren Business Case.',
    missingEvidence: [
      'Konkrete Problemaussage des Kunden',
      'Geschäftliche Auswirkung des Problems',
      'Priorität oder Relevanz aus Kundensicht',
    ],
    evidenceIds: section.evidenceIds,
    entityIds: [],
    inputs: [
      {
        path: 'meddpicc.pain.items',
        label: 'Erfasste Pain-Items',
        value: '0',
      },
      {
        path: 'meddpicc.pain.status',
        label: 'Pain-Status',
        value: section.status,
      },
    ],
  })
}

function painImplicationRule(project: MeddpiccProject): DealInspectorFinding | null {
  const section = project.meddpicc.pain
  if (section.items.length === 0) return null

  const incomplete = section.items.filter(
    (item) => !textPresent(item.businessImpact) || !textPresent(item.consequenceOfInaction),
  )
  if (incomplete.length === 0) return null

  const highPriorityGap = incomplete.some((item) => item.priority === 'high' || item.priority === 'critical')

  return finding(project, {
    ruleId: 'pain.implication-complete',
    area: 'pain',
    severity: highPriorityGap ? 'high' : 'medium',
    title: 'Pain ist identifiziert, aber noch nicht vollständig impliziert.',
    whyItMatters:
      'Ein beschriebenes Problem erzeugt erst dann belastbare Dringlichkeit, wenn Business Impact und Konsequenz des Nicht-Handelns nachvollziehbar sind.',
    missingEvidence: ['Business Impact der betroffenen Pain-Items', 'Konsequenz des Nicht-Handelns'],
    evidenceIds: [...section.evidenceIds, ...incomplete.flatMap((item) => item.evidenceIds)],
    entityIds: incomplete.map((item) => item.id),
    inputs: incomplete.flatMap((item) => [
      {
        path: `meddpicc.pain.items[${item.id}].businessImpact`,
        label: `${item.statement} · Business Impact`,
        value: textPresent(item.businessImpact) ? 'vorhanden' : 'fehlt',
      },
      {
        path: `meddpicc.pain.items[${item.id}].consequenceOfInaction`,
        label: `${item.statement} · Konsequenz des Nicht-Handelns`,
        value: textPresent(item.consequenceOfInaction) ? 'vorhanden' : 'fehlt',
      },
    ]),
  })
}

function customerConfirmedMetricsRule(project: MeddpiccProject): DealInspectorFinding | null {
  const section = project.meddpicc.metrics
  const painExists = project.meddpicc.pain.items.length > 0
  if (!painExists && section.metrics.length === 0) return null

  const confirmed = section.metrics.filter((metric) => metric.customerConfirmed)
  if (confirmed.length > 0) return null

  return finding(project, {
    ruleId: 'metrics.customer-confirmed',
    area: 'metrics',
    severity: 'high',
    title: 'Es gibt noch keine kundenseitig bestätigte Metric.',
    whyItMatters:
      'Metrics sollen den konkreten Kundennutzen quantifizieren und im Buying Team konsensfähig sein; reine Verkäuferannahmen tragen den Business Case nicht.',
    missingEvidence: [
      'Kundenseitig bestätigte Current-State-Messgröße',
      'Kundenseitig bestätigtes Ziel oder Verbesserungspotenzial',
    ],
    evidenceIds: [...section.evidenceIds, ...section.metrics.flatMap((metric) => metric.evidenceIds)],
    entityIds: section.metrics.map((metric) => metric.id),
    inputs: [
      {
        path: 'meddpicc.metrics.metrics',
        label: 'Erfasste Metrics',
        value: String(section.metrics.length),
      },
      {
        path: 'meddpicc.metrics.metrics[*].customerConfirmed',
        label: 'Kundenseitig bestätigte Metrics',
        value: '0',
      },
    ],
  })
}

function economicImpactRule(project: MeddpiccProject): DealInspectorFinding | null {
  const section = project.meddpicc.metrics
  if (section.metrics.length === 0) return null

  const relevant = section.metrics.filter((metric) => metric.current.value !== null || metric.target.value !== null)
  const incomplete = relevant.filter((metric) => metric.economicImpact.value === null)
  if (incomplete.length === 0) return null

  return finding(project, {
    ruleId: 'metrics.economic-impact-quantified',
    area: 'metrics',
    severity: incomplete.some((metric) => metric.customerConfirmed) ? 'high' : 'medium',
    title: 'Mindestens eine relevante Metric ist wirtschaftlich noch nicht quantifiziert.',
    whyItMatters:
      'Operative Kennzahlen werden für die Investitionsentscheidung stärker, wenn ihr wirtschaftlicher Effekt nachvollziehbar quantifiziert werden kann.',
    missingEvidence: [
      'Wirtschaftlicher Effekt der betroffenen Metric',
      'Nachvollziehbare Herleitung des wirtschaftlichen Effekts',
    ],
    evidenceIds: [...section.evidenceIds, ...incomplete.flatMap((metric) => metric.evidenceIds)],
    entityIds: incomplete.map((metric) => metric.id),
    inputs: incomplete.map((metric) => ({
      path: `meddpicc.metrics.metrics[${metric.id}].economicImpact.value`,
      label: `${metric.name} · Economic Impact`,
      value: 'nicht quantifiziert',
    })),
  })
}

function economicBuyerRule(project: MeddpiccProject): DealInspectorFinding | null {
  const section = project.meddpicc.economicBuyer
  if (section.candidates.length === 0) {
    return finding(project, {
      ruleId: 'economic-buyer.validated',
      area: 'economicBuyer',
      severity: 'high',
      title: 'Economic Buyer ist noch nicht belastbar validiert.',
      whyItMatters:
        'Ohne identifizierte wirtschaftliche Entscheidungsautorität bleiben Budgetfreigabe, Priorität und finale Entscheidung unzureichend qualifiziert.',
      missingEvidence: [
        'Economic-Buyer-Candidate',
        'Bestätigung der finalen wirtschaftlichen Entscheidungsautorität',
        'Direkter Zugang oder direkte Interaktion',
        'Bestätigte Investitionspriorität',
      ],
      evidenceIds: section.evidenceIds,
      entityIds: [],
      inputs: [
        {
          path: 'meddpicc.economicBuyer.candidates',
          label: 'Economic-Buyer-Candidates',
          value: '0',
        },
      ],
    })
  }

  const ranked = [...section.candidates].sort((a, b) => {
    const score = (candidate: (typeof section.candidates)[number]) =>
      Number(candidate.identityStatus === 'confirmed') +
      Number(candidate.authorityStatus === 'confirmed') +
      Number(candidate.directAccess && candidate.engagementStatus === 'direct') +
      Number(candidate.priorityStatus === 'confirmed')

    return score(b) - score(a) || a.stakeholderId.localeCompare(b.stakeholderId)
  })
  const candidate = ranked[0]

  const missing: string[] = []
  if (candidate.identityStatus !== 'confirmed') missing.push('Identität des Economic Buyers direkt bestätigen')
  if (candidate.authorityStatus !== 'confirmed') {
    missing.push('Finale wirtschaftliche Entscheidungsautorität bestätigen')
  }
  if (!candidate.directAccess || candidate.engagementStatus !== 'direct') {
    missing.push('Direkten Zugang bzw. direkte Interaktion mit dem Economic Buyer herstellen')
  }
  if (candidate.priorityStatus !== 'confirmed') missing.push('Investitionspriorität direkt bestätigen')

  if (missing.length === 0) return null

  return finding(project, {
    ruleId: 'economic-buyer.validated',
    area: 'economicBuyer',
    severity: 'high',
    title: 'Economic Buyer ist noch nicht belastbar validiert.',
    whyItMatters:
      'Die Rolle sollte nicht nur vermutet oder über Dritte beschrieben sein: Autorität, direkte Interaktion und Investitionspriorität müssen belastbar geprüft werden.',
    missingEvidence: missing,
    evidenceIds: [...section.evidenceIds, ...candidate.evidenceIds],
    entityIds: [candidate.stakeholderId],
    inputs: [
      {
        path: `meddpicc.economicBuyer.candidates[${candidate.stakeholderId}].identityStatus`,
        label: 'Identität',
        value: candidate.identityStatus,
      },
      {
        path: `meddpicc.economicBuyer.candidates[${candidate.stakeholderId}].authorityStatus`,
        label: 'Entscheidungsautorität',
        value: candidate.authorityStatus,
      },
      {
        path: `meddpicc.economicBuyer.candidates[${candidate.stakeholderId}].engagementStatus`,
        label: 'Interaktion',
        value: candidate.engagementStatus,
      },
      {
        path: `meddpicc.economicBuyer.candidates[${candidate.stakeholderId}].priorityStatus`,
        label: 'Investitionspriorität',
        value: candidate.priorityStatus,
      },
    ],
  })
}

function decisionProcessRule(project: MeddpiccProject): DealInspectorFinding | null {
  const section = project.meddpicc.decisionProcess
  const required = section.steps.filter((step) => step.required)

  if (required.length === 0) {
    return finding(project, {
      ruleId: 'decision-process.ready',
      area: 'decisionProcess',
      severity: 'high',
      title: 'Der Decision Process ist noch nicht belastbar abgebildet.',
      whyItMatters:
        'Ohne kundenseitig verstandene Entscheidungsschritte, Verantwortlichkeiten und Bestätigung ist nicht klar, wie die Opportunity tatsächlich zur Entscheidung kommt.',
      missingEvidence: [
        'Erforderliche Entscheidungsschritte',
        'Verantwortliche Personen je Schritt',
        'Kundenseitige Bestätigung des Ablaufs',
      ],
      evidenceIds: section.evidenceIds,
      entityIds: [],
      inputs: [
        {
          path: 'meddpicc.decisionProcess.steps',
          label: 'Erforderliche Decision-Process-Schritte',
          value: '0',
        },
      ],
    })
  }

  const unclear = required.filter(
    (step) =>
      step.ownerStakeholderId === null ||
      step.status === 'unknown' ||
      step.status === 'planned' ||
      step.evidenceIds.length === 0,
  )
  if (unclear.length === 0) return null

  return finding(project, {
    ruleId: 'decision-process.ready',
    area: 'decisionProcess',
    severity: 'high',
    title: 'Erforderliche Schritte im Decision Process sind noch nicht bestätigt.',
    whyItMatters:
      'Ein Verkäuferplan ist nicht dasselbe wie der kundenseitig bestätigte Decision Process. Offene Owner, Status oder Evidenz machen den tatsächlichen Entscheidungsweg unsicher.',
    missingEvidence: [
      'Owner für alle erforderlichen Entscheidungsschritte',
      'Kundenseitige Bestätigung noch geplanter oder unbekannter Schritte',
      'Evidence für die beschriebenen Entscheidungsschritte',
    ],
    evidenceIds: [...section.evidenceIds, ...unclear.flatMap((step) => step.evidenceIds)],
    entityIds: unclear.map((step) => step.id),
    inputs: unclear.flatMap((step) => [
      {
        path: `meddpicc.decisionProcess.steps[${step.id}].status`,
        label: `${step.title} · Status`,
        value: step.status,
      },
      {
        path: `meddpicc.decisionProcess.steps[${step.id}].ownerStakeholderId`,
        label: `${step.title} · Owner`,
        value: step.ownerStakeholderId ?? 'unbekannt',
      },
    ]),
  })
}

function paperProcessRule(project: MeddpiccProject): DealInspectorFinding | null {
  const section = project.meddpicc.paperProcess
  const required = section.steps.filter((step) => step.required)
  const hasTargetClose = project.project.targetCloseDate !== null

  if (required.length === 0) {
    return finding(project, {
      ruleId: 'paper-process.ready',
      area: 'paperProcess',
      severity: hasTargetClose ? 'high' : 'medium',
      title: 'Der Paper Process ist noch nicht belastbar abgebildet.',
      whyItMatters:
        'Unbekannte Procurement-, Legal-, Datenschutz-, PO- oder Signaturschritte können einen geplanten Close verzögern, auch wenn die fachliche Entscheidung bereits positiv ist.',
      missingEvidence: [
        'Erforderliche formale Beschaffungs- und Freigabeschritte',
        'Owner der Schritte',
        'Lead Times bzw. Bearbeitungsdauern',
      ],
      evidenceIds: section.evidenceIds,
      entityIds: [],
      inputs: [
        {
          path: 'meddpicc.paperProcess.steps',
          label: 'Erforderliche Paper-Process-Schritte',
          value: '0',
        },
        {
          path: 'project.targetCloseDate',
          label: 'Target Close',
          value: project.project.targetCloseDate ?? 'unbekannt',
        },
      ],
    })
  }

  const unclear = required.filter(
    (step) =>
      step.ownerStakeholderId === null ||
      step.status === 'unknown' ||
      step.durationBusinessDays === null ||
      step.evidenceIds.length === 0,
  )
  if (unclear.length === 0) return null

  return finding(project, {
    ruleId: 'paper-process.ready',
    area: 'paperProcess',
    severity: hasTargetClose ? 'high' : 'medium',
    title: 'Der Paper Process enthält noch close-relevante Lücken.',
    whyItMatters:
      'Fehlende Owner, Lead Times oder kundenseitige Bestätigung in formalen Schritten erhöhen das Risiko, dass Procurement oder Legal den geplanten Abschluss verschieben.',
    missingEvidence: [
      'Owner für alle erforderlichen Paper-Process-Schritte',
      'Lead Times bzw. Dauer der noch unklaren Schritte',
      'Kundenseitige Bestätigung der formalen Abfolge',
    ],
    evidenceIds: [...section.evidenceIds, ...unclear.flatMap((step) => step.evidenceIds)],
    entityIds: unclear.map((step) => step.id),
    inputs: [
      {
        path: 'project.targetCloseDate',
        label: 'Target Close',
        value: project.project.targetCloseDate ?? 'unbekannt',
      },
      ...unclear.flatMap((step) => [
        {
          path: `meddpicc.paperProcess.steps[${step.id}].status`,
          label: `${step.title} · Status`,
          value: step.status,
        },
        {
          path: `meddpicc.paperProcess.steps[${step.id}].ownerStakeholderId`,
          label: `${step.title} · Owner`,
          value: step.ownerStakeholderId ?? 'unbekannt',
        },
        {
          path: `meddpicc.paperProcess.steps[${step.id}].durationBusinessDays`,
          label: `${step.title} · Dauer`,
          value: step.durationBusinessDays === null ? 'unbekannt' : `${step.durationBusinessDays} Arbeitstage`,
        },
      ]),
    ],
  })
}

function championRule(project: MeddpiccProject): DealInspectorFinding | null {
  const section = project.meddpicc.champions
  const candidates = section.people.filter((person) => person.status !== 'disqualified')

  const behaviorHasEvidence = (
    person: (typeof section.people)[number],
    type: (typeof person.behaviors)[number]['type'],
  ) => person.behaviors.some((behavior) => behavior.type === type && behavior.evidenceIds.length > 0)

  const championScore = (person: (typeof section.people)[number]) =>
    Number(person.influence === 'high') +
    Number(textPresent(person.personalWin)) +
    Number(
      behaviorHasEvidence(person, 'provided_internal_information') || behaviorHasEvidence(person, 'shared_bad_news'),
    ) +
    Number(behaviorHasEvidence(person, 'sold_internally')) +
    Number(
      behaviorHasEvidence(person, 'created_access') || behaviorHasEvidence(person, 'enabled_economic_buyer_access'),
    )

  const ranked = [...candidates].sort(
    (a, b) => championScore(b) - championScore(a) || a.stakeholderId.localeCompare(b.stakeholderId),
  )
  const candidate = ranked[0]

  if (!candidate) {
    return finding(project, {
      ruleId: 'champion.proven',
      area: 'champions',
      severity: 'high',
      title: 'Ein belastbarer Champion ist noch nicht nachgewiesen.',
      whyItMatters:
        'Ein Champion ist mehr als ein freundlicher Kontakt: Einfluss, persönlicher Nutzen und beobachtbares internes Handeln müssen sich im Deal zeigen.',
      missingEvidence: [
        'Champion-Candidate mit ausreichendem Einfluss',
        'Persönlicher Nutzen / Personal Win',
        'Beobachtbares internes Handeln zugunsten der Opportunity',
      ],
      evidenceIds: section.evidenceIds,
      entityIds: [],
      inputs: [
        {
          path: 'meddpicc.champions.people',
          label: 'Aktive Champion-Candidates',
          value: '0',
        },
      ],
    })
  }

  const missing: string[] = []
  if (candidate.influence !== 'high') missing.push('Hoher interner Einfluss')
  if (!textPresent(candidate.personalWin)) missing.push('Konkreter Personal Win')
  if (
    !behaviorHasEvidence(candidate, 'provided_internal_information') &&
    !behaviorHasEvidence(candidate, 'shared_bad_news')
  ) {
    missing.push('Belastbarer Informationszugang, z. B. interne Informationen oder schlechte Nachrichten')
  }
  if (!behaviorHasEvidence(candidate, 'sold_internally')) {
    missing.push('Beleg, dass der Champion intern für uns verkauft')
  }
  if (
    !behaviorHasEvidence(candidate, 'created_access') &&
    !behaviorHasEvidence(candidate, 'enabled_economic_buyer_access')
  ) {
    missing.push('Beleg, dass der Champion relevanten internen Zugang herstellen kann')
  }

  if (missing.length === 0) return null

  const evidenceIds = candidate.behaviors.flatMap((behavior) => behavior.evidenceIds)

  return finding(project, {
    ruleId: 'champion.proven',
    area: 'champions',
    severity: missing.length >= 3 ? 'high' : 'medium',
    title: 'Der stärkste Champion-Candidate ist noch nicht ausreichend getestet.',
    whyItMatters:
      'Sympathie oder ein Champion-Label reichen nicht. Ein belastbarer Champion zeigt Einfluss, persönlichen Nutzen und konkrete interne Handlungen, die den Deal voranbringen.',
    missingEvidence: missing,
    evidenceIds: [...section.evidenceIds, ...evidenceIds],
    entityIds: [candidate.stakeholderId],
    inputs: [
      {
        path: `meddpicc.champions.people[${candidate.stakeholderId}].status`,
        label: 'Champion-Status',
        value: candidate.status,
      },
      {
        path: `meddpicc.champions.people[${candidate.stakeholderId}].influence`,
        label: 'Einfluss',
        value: candidate.influence,
      },
      {
        path: `meddpicc.champions.people[${candidate.stakeholderId}].personalWin`,
        label: 'Personal Win',
        value: textPresent(candidate.personalWin) ? 'vorhanden' : 'fehlt',
      },
      {
        path: `meddpicc.champions.people[${candidate.stakeholderId}].behaviors`,
        label: 'Belegte Champion-Verhaltenssignale',
        value: String(candidate.behaviors.filter((behavior) => behavior.evidenceIds.length > 0).length),
      },
    ],
  })
}

const rules: readonly DealInspectorRule[] = [
  painIdentifiedRule,
  painImplicationRule,
  customerConfirmedMetricsRule,
  economicImpactRule,
  economicBuyerRule,
  decisionProcessRule,
  paperProcessRule,
  championRule,
]

const severityWeight: Record<DealInspectorSeverity, number> = {
  high: 2,
  medium: 1,
}

export function inspectDeal(project: MeddpiccProject): DealInspectorFinding[] {
  return rules
    .flatMap((rule) => {
      const result = rule(project)
      return result ? [result] : []
    })
    .sort(
      (a, b) =>
        severityWeight[b.severity] - severityWeight[a.severity] ||
        dealInspectorRuleIds.indexOf(a.ruleId) - dealInspectorRuleIds.indexOf(b.ruleId),
    )
}
