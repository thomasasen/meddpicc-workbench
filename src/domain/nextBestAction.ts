import type { DealInspectorFinding, DealInspectorInput, DealInspectorRuleId } from './dealInspector'
import type { MeddpiccProject, ProjectAreaKey } from './project'

export const nextBestActionRuleIds = [
  'nba.pain.clarify-impact',
  'nba.metrics.validate-value',
  'nba.economic-buyer.advance',
  'nba.champion.test',
  'nba.decision-process.validate',
  'nba.paper-process.de-risk',
] as const

export type NextBestActionRuleId = (typeof nextBestActionRuleIds)[number]
export type NextBestActionPriority = 'high' | 'medium'

export type NextBestActionRecommendation = {
  id: string
  ruleId: NextBestActionRuleId
  area: ProjectAreaKey
  priority: NextBestActionPriority
  title: string
  whyNow: string
  desiredEvidence: string[]
  triggeringFindingRuleIds: DealInspectorRuleId[]
  evidenceIds: string[]
  entityIds: string[]
  inputs: DealInspectorInput[]
  additionallyAddressesFindingRuleIds: DealInspectorRuleId[]
}

type RecommendationCandidate = {
  recommendation: NextBestActionRecommendation
  dependencyBlocker: boolean
  directEvidence: boolean
  targetCloseUrgency: boolean
}

type NextBestActionRule = (
  project: MeddpiccProject,
  findings: readonly DealInspectorFinding[],
  consumedFindingRuleIds: Set<DealInspectorRuleId>,
) => RecommendationCandidate | null

function unique<T>(values: readonly T[]): T[] {
  return [...new Set(values)]
}

function textPresent(value: string | null | undefined): boolean {
  return Boolean(value?.trim())
}

function hasSupportingEvidence(project: MeddpiccProject, ids: readonly string[]): boolean {
  const wanted = new Set(ids)

  return project.evidence.some(
    (item) =>
      wanted.has(item.id) &&
      item.classification !== 'assumption' &&
      item.classification !== 'unknown' &&
      item.verification !== 'unconfirmed',
  )
}

function behaviorHasSupportingEvidence(
  project: MeddpiccProject,
  person: MeddpiccProject['meddpicc']['champions']['people'][number],
  type: MeddpiccProject['meddpicc']['champions']['people'][number]['behaviors'][number]['type'],
): boolean {
  return person.behaviors.some(
    (behavior) => behavior.type === type && hasSupportingEvidence(project, behavior.evidenceIds),
  )
}

function activeChampionCandidates(project: MeddpiccProject) {
  return project.meddpicc.champions.people.filter((person) => person.status !== 'disqualified')
}

function championEvidenceScore(
  project: MeddpiccProject,
  person: MeddpiccProject['meddpicc']['champions']['people'][number],
): number {
  return (
    Number(person.influence === 'medium' || person.influence === 'high') +
    Number(textPresent(person.personalWin)) +
    Number(
      behaviorHasSupportingEvidence(project, person, 'provided_internal_information') ||
        behaviorHasSupportingEvidence(project, person, 'shared_bad_news'),
    ) +
    Number(behaviorHasSupportingEvidence(project, person, 'sold_internally')) +
    Number(
      behaviorHasSupportingEvidence(project, person, 'created_access') ||
        behaviorHasSupportingEvidence(project, person, 'enabled_economic_buyer_access'),
    )
  )
}

function strongestChampionCandidate(project: MeddpiccProject) {
  return [...activeChampionCandidates(project)].sort(
    (a, b) =>
      championEvidenceScore(project, b) - championEvidenceScore(project, a) ||
      a.stakeholderId.localeCompare(b.stakeholderId),
  )[0]
}

function championIsStrongEnoughForEbIntroduction(
  project: MeddpiccProject,
  person: MeddpiccProject['meddpicc']['champions']['people'][number],
): boolean {
  return (
    (person.influence === 'medium' || person.influence === 'high') &&
    textPresent(person.personalWin) &&
    (behaviorHasSupportingEvidence(project, person, 'provided_internal_information') ||
      behaviorHasSupportingEvidence(project, person, 'shared_bad_news')) &&
    behaviorHasSupportingEvidence(project, person, 'sold_internally') &&
    (behaviorHasSupportingEvidence(project, person, 'created_access') ||
      behaviorHasSupportingEvidence(project, person, 'enabled_economic_buyer_access'))
  )
}

function findingByRule(
  findings: readonly DealInspectorFinding[],
  ruleId: DealInspectorRuleId,
): DealInspectorFinding | undefined {
  return findings.find((finding) => finding.ruleId === ruleId)
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

function makeRecommendation(
  project: MeddpiccProject,
  value: {
    ruleId: NextBestActionRuleId
    area: ProjectAreaKey
    priority: NextBestActionPriority
    title: string
    whyNow: string
    desiredEvidence: string[]
    triggeringFindings: readonly DealInspectorFinding[]
    extraEvidenceIds?: readonly string[]
    extraEntityIds?: readonly string[]
    extraInputs?: readonly DealInspectorInput[]
    additionallyAddresses?: readonly DealInspectorRuleId[]
  },
): NextBestActionRecommendation {
  const existingEvidenceIds = new Set(project.evidence.map((item) => item.id))
  const triggeringRuleIds = unique(value.triggeringFindings.map((finding) => finding.ruleId))

  return {
    id: 'recommendation_' + value.ruleId.replaceAll('.', '_').replaceAll('-', '_'),
    ruleId: value.ruleId,
    area: value.area,
    priority: value.priority,
    title: value.title,
    whyNow: value.whyNow,
    desiredEvidence: unique(value.desiredEvidence),
    triggeringFindingRuleIds: triggeringRuleIds,
    evidenceIds: unique([
      ...value.triggeringFindings.flatMap((finding) => finding.evidenceIds),
      ...(value.extraEvidenceIds ?? []),
    ]).filter((id) => existingEvidenceIds.has(id)),
    entityIds: unique([
      ...value.triggeringFindings.flatMap((finding) => finding.entityIds),
      ...(value.extraEntityIds ?? []),
    ]),
    inputs: uniqueInputs([
      ...value.triggeringFindings.flatMap((finding) => finding.inputs),
      ...(value.extraInputs ?? []),
    ]),
    additionallyAddressesFindingRuleIds: unique(value.additionallyAddresses ?? []).filter(
      (ruleId) => !triggeringRuleIds.includes(ruleId),
    ),
  }
}

function priorityFromFindings(findings: readonly DealInspectorFinding[]): NextBestActionPriority {
  return findings.some((finding) => finding.severity === 'high') ? 'high' : 'medium'
}

function painRule(project: MeddpiccProject, findings: readonly DealInspectorFinding[]): RecommendationCandidate | null {
  const missingPain = findingByRule(findings, 'pain.identified')
  if (missingPain) {
    return {
      recommendation: makeRecommendation(project, {
        ruleId: 'nba.pain.clarify-impact',
        area: 'pain',
        priority: 'high',
        title: 'Kundenseitigen Pain konkretisieren',
        whyNow:
          'Ohne konkreten Pain fehlt die Voraussetzung für belastbare Dringlichkeit, Metrics und einen Business Case. Deshalb zuerst das Problem und seine geschäftliche Relevanz klären.',
        desiredEvidence: [
          'Konkrete Problemaussage des Kunden',
          'Geschäftliche Auswirkung des Problems',
          'Priorität bzw. Relevanz aus Kundensicht',
        ],
        triggeringFindings: [missingPain],
      }),
      dependencyBlocker: true,
      directEvidence: true,
      targetCloseUrgency: false,
    }
  }

  const implicationGap = findingByRule(findings, 'pain.implication-complete')
  if (!implicationGap) return null

  return {
    recommendation: makeRecommendation(project, {
      ruleId: 'nba.pain.clarify-impact',
      area: 'pain',
      priority: priorityFromFindings([implicationGap]),
      title: 'Business Impact und Konsequenz des Nicht-Handelns vertiefen',
      whyNow:
        'Der Pain ist bereits beschrieben, aber seine geschäftliche Konsequenz ist noch nicht ausreichend belastbar. Diese Lücke sollte vor weiterer Value-Optimierung geschlossen werden.',
      desiredEvidence: [
        'Kundenseitig bestätigter Business Impact',
        'Konsequenz des Nicht-Handelns',
        'Erkennbare Dringlichkeit oder Priorität',
      ],
      triggeringFindings: [implicationGap],
    }),
    dependencyBlocker: false,
    directEvidence: true,
    targetCloseUrgency: false,
  }
}

function metricsRule(
  project: MeddpiccProject,
  findings: readonly DealInspectorFinding[],
): RecommendationCandidate | null {
  const customerConfirmationGap = findingByRule(findings, 'metrics.customer-confirmed')
  if (customerConfirmationGap) {
    return {
      recommendation: makeRecommendation(project, {
        ruleId: 'nba.metrics.validate-value',
        area: 'metrics',
        priority: priorityFromFindings([customerConfirmationGap]),
        title: 'Current State und Desired Outcome mit dem Kunden quantifizieren',
        whyNow:
          'Pain oder operative Kennzahlen sind vorhanden, aber noch keine Metric ist kundenseitig bestätigt. Bevor ein ROI oder Business Case belastbar wird, müssen Ausgangswert und Zielbild mit dem Kunden validiert werden.',
        desiredEvidence: [
          'Kundenseitig bestätigter Current State',
          'Kundenseitig bestätigter Desired Outcome',
          'Nachvollziehbare Messgröße für den erwarteten Nutzen',
        ],
        triggeringFindings: [customerConfirmationGap],
      }),
      dependencyBlocker: false,
      directEvidence: true,
      targetCloseUrgency: false,
    }
  }

  const economicImpactGap = findingByRule(findings, 'metrics.economic-impact-quantified')
  if (!economicImpactGap) return null

  return {
    recommendation: makeRecommendation(project, {
      ruleId: 'nba.metrics.validate-value',
      area: 'metrics',
      priority: priorityFromFindings([economicImpactGap]),
      title: 'Wirtschaftlichen Impact einer relevanten Metric validieren',
      whyNow:
        'Mindestens eine operative Metric ist bereits belastbar genug für den nächsten Schritt. Jetzt sollte der wirtschaftliche Nutzen nachvollziehbar hergeleitet werden, ohne jede einzelne Kennzahl künstlich zu monetarisieren.',
      desiredEvidence: [
        'Wirtschaftlich quantifizierter Nutzen mindestens einer relevanten Metric',
        'Nachvollziehbare Herleitung der wirtschaftlichen Wirkung',
        'Kundenseitige Bestätigung der wesentlichen Annahmen',
      ],
      triggeringFindings: [economicImpactGap],
    }),
    dependencyBlocker: false,
    directEvidence: true,
    targetCloseUrgency: false,
  }
}

function economicBuyerRule(
  project: MeddpiccProject,
  findings: readonly DealInspectorFinding[],
  consumedFindingRuleIds: Set<DealInspectorRuleId>,
): RecommendationCandidate | null {
  const ebGap = findingByRule(findings, 'economic-buyer.validated')
  if (!ebGap) return null

  const section = project.meddpicc.economicBuyer
  const championGap = findingByRule(findings, 'champion.proven')
  const champion = strongestChampionCandidate(project)

  if (section.candidates.length === 0) {
    return {
      recommendation: makeRecommendation(project, {
        ruleId: 'nba.economic-buyer.advance',
        area: 'economicBuyer',
        priority: 'high',
        title: 'Economic-Buyer-Candidate identifizieren und Authority prüfen',
        whyNow:
          'Ohne belastbaren Candidate ist weder die wirtschaftliche Entscheidungsautorität noch die Investitionspriorität qualifiziert. Ein Meeting mit einer nur vermuteten Person wäre Scheingenauigkeit.',
        desiredEvidence: [
          'Namentlich identifizierter Economic-Buyer-Candidate',
          'Bestätigung der finalen wirtschaftlichen Entscheidungsautorität',
          'Klarheit darüber, wer die Investition stoppen oder freigeben kann',
        ],
        triggeringFindings: [ebGap],
      }),
      dependencyBlocker: true,
      directEvidence: true,
      targetCloseUrgency: false,
    }
  }

  const rankedCandidates = [...section.candidates].sort((a, b) => {
    const score = (candidate: (typeof section.candidates)[number]) =>
      Number(candidate.identityStatus === 'confirmed') +
      Number(candidate.authorityStatus === 'confirmed') +
      Number(candidate.directAccess && candidate.engagementStatus === 'direct') +
      Number(candidate.priorityStatus === 'confirmed')

    return score(b) - score(a) || a.stakeholderId.localeCompare(b.stakeholderId)
  })
  const candidate = rankedCandidates[0]

  if (candidate.identityStatus !== 'confirmed' || candidate.authorityStatus !== 'confirmed') {
    return {
      recommendation: makeRecommendation(project, {
        ruleId: 'nba.economic-buyer.advance',
        area: 'economicBuyer',
        priority: 'high',
        title: 'Tatsächliche Economic-Buyer-Authority validieren',
        whyNow:
          'Ein Candidate ist bekannt, aber Identität oder finale wirtschaftliche Entscheidungsautorität sind nicht bestätigt. Vor Access- oder Pitch-Optimierung muss geklärt werden, ob diese Person den wirtschaftlichen Entscheid tatsächlich tragen kann.',
        desiredEvidence: [
          'Direkte oder belastbar bestätigte Identität des Economic Buyers',
          'Bestätigung der finalen wirtschaftlichen Entscheidungsautorität',
          'Klarheit über Veto- bzw. Freigabemacht',
        ],
        triggeringFindings: [ebGap],
        extraEntityIds: [candidate.stakeholderId],
      }),
      dependencyBlocker: true,
      directEvidence: true,
      targetCloseUrgency: false,
    }
  }

  if (!candidate.directAccess || candidate.engagementStatus !== 'direct') {
    if (champion && championIsStrongEnoughForEbIntroduction(project, champion)) {
      if (championGap) consumedFindingRuleIds.add(championGap.ruleId)

      return {
        recommendation: makeRecommendation(project, {
          ruleId: 'nba.economic-buyer.advance',
          area: 'economicBuyer',
          priority: 'high',
          title: 'Champion gezielt um direkte Economic-Buyer-Introduction bitten',
          whyNow:
            'Die Economic-Buyer-Authority ist bestätigt, direkter Zugang fehlt aber noch. Der stärkste Champion-Candidate zeigt Einfluss, Personal Win, belastbaren Informationszugang und internes Verkaufen; damit ist eine konkrete Introduction ein sinnvoller nächster Test und Access-Schritt.',
          desiredEvidence: [
            'Champion stellt eine direkte Introduction zum Economic Buyer her',
            'Direkte Interaktion mit dem Economic Buyer',
            'Bestätigung von Business Outcome und Investitionspriorität aus erster Hand',
          ],
          triggeringFindings: championGap ? [ebGap, championGap] : [ebGap],
          extraEvidenceIds: champion.behaviors.flatMap((behavior) => behavior.evidenceIds),
          extraEntityIds: [candidate.stakeholderId, champion.stakeholderId],
        }),
        dependencyBlocker: false,
        directEvidence: true,
        targetCloseUrgency: false,
      }
    }

    if (champion && championGap) {
      consumedFindingRuleIds.add(championGap.ruleId)

      return {
        recommendation: makeRecommendation(project, {
          ruleId: 'nba.economic-buyer.advance',
          area: 'economicBuyer',
          priority: 'high',
          title: 'Champion-Candidate testen und einen belastbaren EB-Zugangspfad klären',
          whyNow:
            'Direkter Economic-Buyer-Zugang fehlt, aber der vorhandene Champion-Candidate ist noch nicht belastbar genug für eine unterstellte Introduction. Ein konkreter interner Test soll gleichzeitig zeigen, ob er Einfluss besitzt und welchen realistischen Zugangspfad es gibt.',
          desiredEvidence: [
            'Beobachtbare interne Aktion des Champion-Candidates',
            'Belastbare Aussage zum realistischen Zugangspfad zum Economic Buyer',
            'Keine bloße Zusage, sondern nachvollziehbares internes Handeln',
          ],
          triggeringFindings: [ebGap, championGap],
          extraEvidenceIds: champion.behaviors.flatMap((behavior) => behavior.evidenceIds),
          extraEntityIds: [candidate.stakeholderId, champion.stakeholderId],
        }),
        dependencyBlocker: false,
        directEvidence: true,
        targetCloseUrgency: false,
      }
    }

    return {
      recommendation: makeRecommendation(project, {
        ruleId: 'nba.economic-buyer.advance',
        area: 'economicBuyer',
        priority: 'high',
        title: 'Alternativen Zugang zum Economic Buyer vorbereiten',
        whyNow:
          'Die Economic-Buyer-Authority ist bestätigt, direkter Zugang fehlt und es gibt keinen belastbaren Champion, auf den eine Introduction gestützt werden kann. Deshalb darf die Empfehlung keinen Champion voraussetzen.',
        desiredEvidence: [
          'Konkreter, organisatorisch vertretbarer Zugangspfad zum Economic Buyer',
          'Direkte Interaktion oder bestätigter Termin',
          'Dokumentierte Begründung, falls direkter Zugang tatsächlich nicht möglich ist',
        ],
        triggeringFindings: [ebGap],
        extraEntityIds: [candidate.stakeholderId],
      }),
      dependencyBlocker: false,
      directEvidence: true,
      targetCloseUrgency: false,
    }
  }

  if (candidate.priorityStatus !== 'confirmed') {
    return {
      recommendation: makeRecommendation(project, {
        ruleId: 'nba.economic-buyer.advance',
        area: 'economicBuyer',
        priority: 'high',
        title: 'Investitionspriorität und Business Outcome direkt mit dem Economic Buyer validieren',
        whyNow:
          'Direkter Economic-Buyer-Zugang besteht bereits. Damit ist Verkäuferinterpretation nicht mehr nötig: Priorität, wirtschaftliches Ergebnis und Erfolgskriterien sollten jetzt aus erster Hand bestätigt werden.',
        desiredEvidence: [
          'Economic Buyer bestätigt die Investitionspriorität',
          'Economic Buyer bestätigt das relevante Business Outcome',
          'Economic Buyer bestätigt messbare Erfolgskriterien',
        ],
        triggeringFindings: [ebGap],
        extraEntityIds: [candidate.stakeholderId],
      }),
      dependencyBlocker: false,
      directEvidence: true,
      targetCloseUrgency: false,
    }
  }

  return {
    recommendation: makeRecommendation(project, {
      ruleId: 'nba.economic-buyer.advance',
      area: 'economicBuyer',
      priority: 'high',
      title: 'Economic-Buyer-Validierung mit belastbarer Evidence absichern',
      whyNow:
        'Die strukturierten Statusfelder wirken weitgehend vollständig, der Deal Inspector erkennt aber weiterhin fehlende belastbare Evidence. Diese Lücke sollte nicht durch Statuslabels überspielt werden.',
      desiredEvidence: [
        'Belastbare Evidence für Identität, Authority, direkte Interaktion und Priorität',
        'Quellenbezug für die Economic-Buyer-Validierung',
      ],
      triggeringFindings: [ebGap],
      extraEntityIds: [candidate.stakeholderId],
    }),
    dependencyBlocker: false,
    directEvidence: true,
    targetCloseUrgency: false,
  }
}

function championRule(
  project: MeddpiccProject,
  findings: readonly DealInspectorFinding[],
  consumedFindingRuleIds: Set<DealInspectorRuleId>,
): RecommendationCandidate | null {
  const championGap = findingByRule(findings, 'champion.proven')
  if (!championGap || consumedFindingRuleIds.has(championGap.ruleId)) return null

  const champion = strongestChampionCandidate(project)

  if (!champion) {
    return {
      recommendation: makeRecommendation(project, {
        ruleId: 'nba.champion.test',
        area: 'champions',
        priority: priorityFromFindings([championGap]),
        title: 'Möglichen Champion identifizieren und mit einer echten internen Aktion testen',
        whyNow:
          'Ein hilfreicher Kontakt ist noch kein Champion. Bevor der Deal auf internen Support baut, muss ein Candidate mit Einfluss, Personal Win und beobachtbarem internem Handeln identifiziert werden.',
        desiredEvidence: [
          'Champion-Candidate mit ausreichendem Einfluss',
          'Konkreter Personal Win',
          'Beobachtbare interne Aktion zugunsten der Opportunity',
        ],
        triggeringFindings: [championGap],
      }),
      dependencyBlocker: false,
      directEvidence: true,
      targetCloseUrgency: false,
    }
  }

  if (!textPresent(champion.personalWin)) {
    return {
      recommendation: makeRecommendation(project, {
        ruleId: 'nba.champion.test',
        area: 'champions',
        priority: priorityFromFindings([championGap]),
        title: 'Personal Win des Champion-Candidates herausarbeiten',
        whyNow:
          'Einfluss und Hilfsbereitschaft allein reichen nicht. Ohne persönlichen Nutzen ist unklar, warum der Candidate intern dauerhaft für die Veränderung handeln sollte.',
        desiredEvidence: [
          'Konkreter persönlicher Nutzen des Champion-Candidates',
          'Verbindung zwischen Projekterfolg und eigenem Erfolg des Candidates',
        ],
        triggeringFindings: [championGap],
        extraEntityIds: [champion.stakeholderId],
      }),
      dependencyBlocker: false,
      directEvidence: true,
      targetCloseUrgency: false,
    }
  }

  return {
    recommendation: makeRecommendation(project, {
      ruleId: 'nba.champion.test',
      area: 'champions',
      priority: priorityFromFindings([championGap]),
      title: 'Champion-Candidate durch konkrete interne Aktion testen',
      whyNow:
        'Der Candidate zeigt bereits einzelne positive Signale, aber internes Verkaufen oder belastbarer Einfluss sind noch nicht ausreichend belegt. Ein konkreter Test erzeugt bessere Evidence als ein weiteres Verkäuferurteil.',
      desiredEvidence: [
        'Belegtes internes Verkaufen oder belastbare Weitergabe kritischer Informationen',
        'Konkrete interne Aktion mit nachvollziehbarem Ergebnis',
        'Beleg für ausreichenden Einfluss im Buying Team',
      ],
      triggeringFindings: [championGap],
      extraEvidenceIds: champion.behaviors.flatMap((behavior) => behavior.evidenceIds),
      extraEntityIds: [champion.stakeholderId],
    }),
    dependencyBlocker: false,
    directEvidence: true,
    targetCloseUrgency: false,
  }
}

function decisionProcessRule(
  project: MeddpiccProject,
  findings: readonly DealInspectorFinding[],
): RecommendationCandidate | null {
  const gap = findingByRule(findings, 'decision-process.ready')
  if (!gap) return null

  const required = project.meddpicc.decisionProcess.steps.filter((step) => step.required)
  const blocked = required.filter((step) => step.status === 'blocked')

  if (blocked.length > 0) {
    return {
      recommendation: makeRecommendation(project, {
        ruleId: 'nba.decision-process.validate',
        area: 'decisionProcess',
        priority: 'high',
        title: 'Blocker im Decision Process klären, bevor nachgelagerte Schritte geplant werden',
        whyNow:
          'Mindestens ein erforderlicher Entscheidungsschritt ist blockiert. Solange Ursache, Owner und Auflösung nicht geklärt sind, wären Empfehlungen für nachgelagerte Schritte Spekulation.',
        desiredEvidence: [
          'Konkrete Blocker-Ursache',
          'Verantwortlicher Owner für die Auflösung',
          'Bestätigter nächster Schritt zur Entblockung',
        ],
        triggeringFindings: [gap],
        extraEntityIds: blocked.map((step) => step.id),
      }),
      dependencyBlocker: true,
      directEvidence: true,
      targetCloseUrgency: project.project.targetCloseDate !== null,
    }
  }

  if (required.length === 0) {
    return {
      recommendation: makeRecommendation(project, {
        ruleId: 'nba.decision-process.validate',
        area: 'decisionProcess',
        priority: 'high',
        title: 'Kundenseitigen Decision Process gemeinsam abbilden',
        whyNow:
          'Es sind noch keine erforderlichen Entscheidungsschritte strukturiert. Ohne reale Schritte, Owner und Abhängigkeiten lässt sich weder Progression noch eine belastbare Entscheidung planen.',
        desiredEvidence: [
          'Erforderliche kundenseitige Entscheidungsschritte',
          'Owner je Schritt',
          'Reihenfolge und relevante Abhängigkeiten',
          'Kundenseitige Bestätigung des Ablaufs',
        ],
        triggeringFindings: [gap],
      }),
      dependencyBlocker: true,
      directEvidence: true,
      targetCloseUrgency: project.project.targetCloseDate !== null,
    }
  }

  const missingOwners = required.filter((step) => step.ownerStakeholderId === null)
  if (missingOwners.length > 0) {
    return {
      recommendation: makeRecommendation(project, {
        ruleId: 'nba.decision-process.validate',
        area: 'decisionProcess',
        priority: 'high',
        title: 'Owner und Verantwortlichkeiten im Decision Process bestätigen',
        whyNow:
          'Der Prozess ist teilweise bekannt, aber erforderliche Schritte besitzen noch keinen bestätigten Owner. Ohne Verantwortlichkeit bleibt der tatsächliche Entscheidungsweg unklar.',
        desiredEvidence: [
          'Bestätigter Owner für jeden erforderlichen offenen Schritt',
          'Klarheit über Verantwortlichkeiten und Übergaben',
        ],
        triggeringFindings: [gap],
        extraEntityIds: missingOwners.map((step) => step.id),
      }),
      dependencyBlocker: false,
      directEvidence: true,
      targetCloseUrgency: project.project.targetCloseDate !== null,
    }
  }

  return {
    recommendation: makeRecommendation(project, {
      ruleId: 'nba.decision-process.validate',
      area: 'decisionProcess',
      priority: 'high',
      title: 'Geplante und unbekannte Decision-Process-Schritte kundenseitig validieren',
      whyNow:
        'Der Ablauf ist bereits modelliert, aber einzelne erforderliche Schritte sind noch geplant, unbekannt oder nur schwach belegt. Jetzt sollte Verkäuferplanung durch kundenseitige Bestätigung ersetzt werden.',
      desiredEvidence: [
        'Kundenseitige Bestätigung der noch offenen Entscheidungsschritte',
        'Bestätigte Reihenfolge und Abhängigkeiten',
        'Belastbare Evidence für den tatsächlichen Ablauf',
      ],
      triggeringFindings: [gap],
    }),
    dependencyBlocker: false,
    directEvidence: true,
    targetCloseUrgency: project.project.targetCloseDate !== null,
  }
}

function paperProcessRule(
  project: MeddpiccProject,
  findings: readonly DealInspectorFinding[],
): RecommendationCandidate | null {
  const gap = findingByRule(findings, 'paper-process.ready')
  if (!gap) return null

  const required = project.meddpicc.paperProcess.steps.filter((step) => step.required)
  const blocked = required.filter((step) => step.status === 'blocked')
  const targetCloseKnown = project.project.targetCloseDate !== null

  if (blocked.length > 0) {
    return {
      recommendation: makeRecommendation(project, {
        ruleId: 'nba.paper-process.de-risk',
        area: 'paperProcess',
        priority: 'high',
        title: 'Blocker im Paper Process jetzt auflösen',
        whyNow:
          'Ein erforderlicher Procurement-, Legal- oder Signaturschritt ist blockiert. Dieser Blocker kann den Abschluss direkt verzögern und muss vor weiteren Close-Annahmen geklärt werden.',
        desiredEvidence: [
          'Konkrete Blocker-Ursache',
          'Verantwortlicher Owner',
          'Bestätigter Entblockungsweg und realistische Lead Time',
        ],
        triggeringFindings: [gap],
        extraEntityIds: blocked.map((step) => step.id),
      }),
      dependencyBlocker: true,
      directEvidence: true,
      targetCloseUrgency: targetCloseKnown,
    }
  }

  if (required.length === 0) {
    return {
      recommendation: makeRecommendation(project, {
        ruleId: 'nba.paper-process.de-risk',
        area: 'paperProcess',
        priority: targetCloseKnown ? 'high' : priorityFromFindings([gap]),
        title: 'Procurement-, Legal- und Signaturprozess abbilden',
        whyNow: targetCloseKnown
          ? 'Ein Target Close ist gesetzt, aber der formale Weg zur Unterschrift ist noch nicht abgebildet. Späte Procurement- oder Legal-Überraschungen gefährden damit direkt den geplanten Abschluss.'
          : 'Der formale Weg von der fachlichen Entscheidung zur Unterschrift ist noch unbekannt. Eine frühe Klärung verhindert spätere Überraschungen.',
        desiredEvidence: [
          'Erforderliche Procurement-, Legal-, Datenschutz-, PO- und Signaturschritte',
          'Owner je Schritt',
          'Lead Times und relevante Abhängigkeiten',
        ],
        triggeringFindings: [gap],
      }),
      dependencyBlocker: targetCloseKnown,
      directEvidence: true,
      targetCloseUrgency: targetCloseKnown,
    }
  }

  const missingLeadTimeOrOwner = required.filter(
    (step) => step.ownerStakeholderId === null || step.durationBusinessDays === null,
  )
  if (missingLeadTimeOrOwner.length > 0) {
    return {
      recommendation: makeRecommendation(project, {
        ruleId: 'nba.paper-process.de-risk',
        area: 'paperProcess',
        priority: targetCloseKnown ? 'high' : priorityFromFindings([gap]),
        title: 'Paper-Process-Owner und Lead Times bestätigen',
        whyNow: targetCloseKnown
          ? 'Der Target Close ist gesetzt, während für erforderliche formale Schritte Owner oder Bearbeitungsdauer fehlen. Genau diese Informationen entscheiden, ob der geplante Abschluss realistisch erreichbar ist.'
          : 'Erforderliche formale Schritte sind bekannt, aber Owner oder Bearbeitungsdauer fehlen. Diese Lücken sollten geklärt werden, bevor daraus ein belastbarer Closing Plan entsteht.',
        desiredEvidence: [
          'Bestätigte Owner für alle erforderlichen formalen Schritte',
          'Realistische Lead Times bzw. Bearbeitungsdauern',
          'Kundenseitige Bestätigung der formalen Abfolge',
        ],
        triggeringFindings: [gap],
        extraEntityIds: missingLeadTimeOrOwner.map((step) => step.id),
      }),
      dependencyBlocker: false,
      directEvidence: true,
      targetCloseUrgency: targetCloseKnown,
    }
  }

  return {
    recommendation: makeRecommendation(project, {
      ruleId: 'nba.paper-process.de-risk',
      area: 'paperProcess',
      priority: targetCloseKnown ? 'high' : priorityFromFindings([gap]),
      title: 'Offene Procurement-/Legal-Schritte kundenseitig bestätigen',
      whyNow:
        'Der formale Prozess ist teilweise modelliert, enthält aber weiterhin unbekannte oder schwach belegte Schritte. Diese sollten proaktiv geklärt werden, bevor sie spät im Deal den Close verzögern.',
      desiredEvidence: [
        'Kundenseitige Bestätigung der offenen formalen Schritte',
        'Bestätigter Status und Ablauf',
        'Belastbare Evidence für Procurement, Legal und Signaturweg',
      ],
      triggeringFindings: [gap],
    }),
    dependencyBlocker: false,
    directEvidence: true,
    targetCloseUrgency: targetCloseKnown,
  }
}

const rules: readonly NextBestActionRule[] = [
  painRule,
  metricsRule,
  economicBuyerRule,
  championRule,
  decisionProcessRule,
  paperProcessRule,
]

const priorityWeight: Record<NextBestActionPriority, number> = {
  high: 2,
  medium: 1,
}

function sortCandidates(a: RecommendationCandidate, b: RecommendationCandidate): number {
  return (
    Number(b.dependencyBlocker) - Number(a.dependencyBlocker) ||
    priorityWeight[b.recommendation.priority] - priorityWeight[a.recommendation.priority] ||
    b.recommendation.triggeringFindingRuleIds.length - a.recommendation.triggeringFindingRuleIds.length ||
    Number(b.directEvidence) - Number(a.directEvidence) ||
    Number(b.targetCloseUrgency) - Number(a.targetCloseUrgency) ||
    nextBestActionRuleIds.indexOf(a.recommendation.ruleId) - nextBestActionRuleIds.indexOf(b.recommendation.ruleId)
  )
}

export function deriveNextBestActions(
  project: MeddpiccProject,
  findings: readonly DealInspectorFinding[],
): NextBestActionRecommendation[] {
  const consumedFindingRuleIds = new Set<DealInspectorRuleId>()

  return rules
    .flatMap((rule) => {
      const result = rule(project, findings, consumedFindingRuleIds)
      return result ? [result] : []
    })
    .sort(sortCandidates)
    .map((candidate) => candidate.recommendation)
}
