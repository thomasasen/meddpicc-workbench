import type { MeddpiccProject } from './project'

export const championSignalIds = [
  'influence',
  'personal-win',
  'inside-information',
  'internal-selling',
  'access-creation',
  'economic-buyer-access',
] as const

export type ChampionSignalId = (typeof championSignalIds)[number]
export type ChampionSignalState = 'proven' | 'structured' | 'insufficient' | 'missing'
export type ChampionAssessmentStatus = 'candidate' | 'partially-proven' | 'proven' | 'disqualified'

type ChampionPerson = MeddpiccProject['meddpicc']['champions']['people'][number]
type ChampionBehaviorType = ChampionPerson['behaviors'][number]['type']

export type ChampionSignal = {
  id: ChampionSignalId
  label: string
  state: ChampionSignalState
  requiredForProven: boolean
  explanation: string
  evidenceIds: string[]
  weakEvidenceIds: string[]
  sourcePaths: string[]
}

export type ChampionNextTest = {
  id: string
  title: string
  rationale: string
  action: string
  desiredEvidence: string[]
  expectedBehaviorTypes: ChampionBehaviorType[]
}

export type ChampionAssessment = {
  id: string
  stakeholderId: string
  stakeholderName: string
  stakeholderRole: string
  canonicalStatus: ChampionPerson['status']
  status: ChampionAssessmentStatus
  rationale: string
  signals: ChampionSignal[]
  provenSignals: ChampionSignal[]
  openSignals: ChampionSignal[]
  evidenceIds: string[]
  structuredInputs: Array<{
    path: string
    label: string
    value: string
    evidenceAnchoring: 'behavior-evidence' | 'structured-only'
  }>
  sourceTraceability: {
    stakeholderId: string
    behaviorTypes: ChampionBehaviorType[]
    evidenceIds: string[]
    paths: string[]
  }
  nextTest: ChampionNextTest | null
  relatedNextBestActionRuleId: 'nba.champion.test' | null
  readyForEconomicBuyerAccessTest: boolean
}

function unique<T>(values: readonly T[]): T[] {
  return [...new Set(values)]
}

function textPresent(value: string | null | undefined): boolean {
  return Boolean(value?.trim())
}

function support(project: MeddpiccProject, ids: readonly string[]) {
  const wanted = new Set(ids)
  const existing = project.evidence.filter((item) => wanted.has(item.id))
  const supporting = existing.filter(
    (item) =>
      item.classification !== 'assumption' && item.classification !== 'unknown' && item.verification !== 'unconfirmed',
  )
  return {
    all: unique(existing.map((item) => item.id)),
    supporting: unique(supporting.map((item) => item.id)),
  }
}

function behaviorEvidence(project: MeddpiccProject, person: ChampionPerson, types: readonly ChampionBehaviorType[]) {
  const behaviors = person.behaviors.filter((item) => types.includes(item.type))
  const evidence = support(
    project,
    behaviors.flatMap((item) => item.evidenceIds),
  )
  const presentTypes = unique(behaviors.map((item) => item.type))
  return {
    ...evidence,
    presentTypes,
    paths: presentTypes.map(
      (type) => 'meddpicc.champions.people[' + person.stakeholderId + '].behaviors[type=' + type + ']',
    ),
  }
}

function behaviorSignal(
  project: MeddpiccProject,
  person: ChampionPerson,
  config: {
    id: ChampionSignalId
    label: string
    types: readonly ChampionBehaviorType[]
    requiredForProven: boolean
    proven: string
    missing: string
    insufficient: string
  },
): ChampionSignal {
  const evidence = behaviorEvidence(project, person, config.types)
  const base = {
    id: config.id,
    label: config.label,
    requiredForProven: config.requiredForProven,
    sourcePaths: evidence.paths,
  }

  if (evidence.supporting.length > 0) {
    return {
      ...base,
      state: 'proven',
      explanation: config.proven,
      evidenceIds: evidence.supporting,
      weakEvidenceIds: evidence.all.filter((id) => !evidence.supporting.includes(id)),
    }
  }
  if (evidence.presentTypes.length > 0) {
    return {
      ...base,
      state: 'insufficient',
      explanation: config.insufficient,
      evidenceIds: [],
      weakEvidenceIds: evidence.all,
    }
  }
  return {
    ...base,
    state: 'missing',
    explanation: config.missing,
    evidenceIds: [],
    weakEvidenceIds: [],
  }
}

function influenceSignal(person: ChampionPerson): ChampionSignal {
  const path = 'meddpicc.champions.people[' + person.stakeholderId + '].influence'
  const sufficient = person.influence === 'medium' || person.influence === 'high'
  return {
    id: 'influence',
    label: 'Einfluss / Power',
    state: sufficient ? 'structured' : person.influence === 'low' ? 'insufficient' : 'missing',
    requiredForProven: true,
    explanation: sufficient
      ? 'Der Einfluss ist strukturiert ausreichend angegeben. Schema 0.2.0 verknüpft dieses Feld jedoch nicht direkt mit eigener Evidence; deshalb bleibt es transparent ein strukturierter Input.'
      : person.influence === 'low'
        ? 'Der dokumentierte Einfluss ist zu gering, um die Person als belastbaren Champion zu behandeln.'
        : 'Der interne Einfluss ist noch unbekannt und muss an realen internen Handlungen getestet werden.',
    evidenceIds: [],
    weakEvidenceIds: [],
    sourcePaths: [path],
  }
}

function personalWinSignal(project: MeddpiccProject, person: ChampionPerson): ChampionSignal {
  const path = 'meddpicc.champions.people[' + person.stakeholderId + '].personalWin'
  const evidence = behaviorEvidence(project, person, ['confirmed_personal_win'])
  const hasText = textPresent(person.personalWin)
  if (hasText && evidence.supporting.length > 0) {
    return {
      id: 'personal-win',
      label: 'Personal Win',
      state: 'proven',
      requiredForProven: true,
      explanation: 'Ein konkreter Personal Win ist dokumentiert und durch belastbare Evidence bestätigt.',
      evidenceIds: evidence.supporting,
      weakEvidenceIds: evidence.all.filter((id) => !evidence.supporting.includes(id)),
      sourcePaths: [path, ...evidence.paths],
    }
  }
  if (hasText) {
    return {
      id: 'personal-win',
      label: 'Personal Win',
      state: evidence.presentTypes.length > 0 ? 'insufficient' : 'structured',
      requiredForProven: true,
      explanation:
        evidence.presentTypes.length > 0
          ? 'Ein Personal Win ist beschrieben, die Bestätigung stützt sich aber nur auf Assumption, Unknown oder unbestätigte Evidence.'
          : 'Ein Personal Win ist als Text dokumentiert, aber noch nicht durch belastbare Evidence bestätigt.',
      evidenceIds: [],
      weakEvidenceIds: evidence.all,
      sourcePaths: [path, ...evidence.paths],
    }
  }
  return {
    id: 'personal-win',
    label: 'Personal Win',
    state: 'missing',
    requiredForProven: true,
    explanation: 'Ein eigener nachvollziehbarer Grund, warum diese Person die Veränderung gewinnen sehen will, fehlt.',
    evidenceIds: [],
    weakEvidenceIds: evidence.all,
    sourcePaths: [path, ...evidence.paths],
  }
}

function buildSignals(project: MeddpiccProject, person: ChampionPerson): ChampionSignal[] {
  return [
    influenceSignal(person),
    personalWinSignal(project, person),
    behaviorSignal(project, person, {
      id: 'inside-information',
      label: 'Inside Information / Bad News',
      types: ['provided_internal_information', 'shared_bad_news'],
      requiredForProven: true,
      proven:
        'Belastbare Evidence zeigt echten internen Informationszugang, einschließlich relevanter oder unangenehmer Informationen.',
      missing: 'Es fehlt belastbare Evidence für relevante interne Informationen oder schlechte Nachrichten.',
      insufficient: 'Ein Informations-Behavior ist dokumentiert, aber nicht durch belastbare Evidence bestätigt.',
    }),
    behaviorSignal(project, person, {
      id: 'internal-selling',
      label: 'Internal Selling',
      types: ['sold_internally'],
      requiredForProven: true,
      proven: 'Belastbare Evidence zeigt, dass die Person intern aktiv für die Opportunity verkauft.',
      missing:
        'Es fehlt der zentrale Beleg, dass die Person intern aktiv verkauft und nicht nur Informationen weitergibt.',
      insufficient: 'Internal Selling ist dokumentiert, aber nicht durch belastbare Evidence bestätigt.',
    }),
    behaviorSignal(project, person, {
      id: 'access-creation',
      label: 'Access Creation',
      types: ['created_access'],
      requiredForProven: false,
      proven: 'Die Person hat nachweislich relevanten internen Zugang geschaffen.',
      missing: 'Es fehlt ein belastbarer Beleg dafür, dass die Person relevante interne Türen öffnen kann.',
      insufficient: 'Access Creation ist dokumentiert, aber nicht durch belastbare Evidence bestätigt.',
    }),
    behaviorSignal(project, person, {
      id: 'economic-buyer-access',
      label: 'Economic-Buyer-Zugang',
      types: ['enabled_economic_buyer_access'],
      requiredForProven: true,
      proven: 'Die Person hat belastbaren Zugang zum Economic Buyer hergestellt.',
      missing: 'Es fehlt der Beleg, dass die Person den Zugang zum Economic Buyer tatsächlich herstellen kann.',
      insufficient: 'Economic-Buyer-Zugang ist dokumentiert, aber nicht durch belastbare Evidence bestätigt.',
    }),
  ]
}

function getSignal(signals: readonly ChampionSignal[], id: ChampionSignalId): ChampionSignal {
  const result = signals.find((item) => item.id === id)
  if (!result) throw new Error('Champion-Signal fehlt: ' + id)
  return result
}

function deriveStatus(person: ChampionPerson, signals: readonly ChampionSignal[]): ChampionAssessmentStatus {
  if (person.status === 'disqualified') return 'disqualified'
  const influenceOkay = person.influence === 'medium' || person.influence === 'high'
  const behaviorsProven = ['personal-win', 'inside-information', 'internal-selling', 'economic-buyer-access'].every(
    (id) => getSignal(signals, id as ChampionSignalId).state === 'proven',
  )
  if (influenceOkay && behaviorsProven) return 'proven'
  if (signals.some((item) => item.state === 'proven')) return 'partially-proven'
  return 'candidate'
}

function nextTest(
  person: ChampionPerson,
  signals: readonly ChampionSignal[],
  status: ChampionAssessmentStatus,
): ChampionNextTest | null {
  if (status === 'disqualified') return null
  const influence = getSignal(signals, 'influence')
  const personalWin = getSignal(signals, 'personal-win')
  const information = getSignal(signals, 'inside-information')
  const selling = getSignal(signals, 'internal-selling')
  const access = getSignal(signals, 'access-creation')
  const ebAccess = getSignal(signals, 'economic-buyer-access')

  if (influence.state === 'missing' || influence.state === 'insufficient') {
    return {
      id: 'champion-test-influence',
      title: 'Einfluss an einer echten internen Hürde testen',
      rationale:
        'Seniorität oder Selbstauskunft reichen nicht. Entscheidend ist, ob die Person intern tatsächlich etwas bewegen kann.',
      action:
        'Bitte die Person, einen relevanten internen Schritt voranzubringen, bei dem sie Stakeholder, Priorität oder Prozess aktiv beeinflussen muss.',
      desiredEvidence: [
        'Beobachtbares internes Handeln mit konkretem Ergebnis',
        'Nachvollziehbarer Einfluss auf relevante Stakeholder oder den Entscheidungsprozess',
      ],
      expectedBehaviorTypes: ['challenged_internal_process', 'created_access'],
    }
  }
  if (!textPresent(person.personalWin)) {
    return {
      id: 'champion-test-personal-win-discovery',
      title: 'Personal Win konkret herausarbeiten',
      rationale:
        'Ohne eigenen Nutzen ist unklar, warum die Person dauerhaft Energie in den internen Verkauf investieren sollte.',
      action:
        'Kläre, was sich für die Person persönlich oder in ihrer Rolle verbessert, wenn die Opportunity erfolgreich umgesetzt wird, und was sie bei einem Scheitern verliert.',
      desiredEvidence: [
        'Konkreter persönlicher oder rollenbezogener Nutzen',
        'Nachvollziehbare Verbindung zwischen Deal-Erfolg und eigenem Erfolg',
      ],
      expectedBehaviorTypes: ['confirmed_personal_win'],
    }
  }
  if (information.state !== 'proven') {
    return {
      id: 'champion-test-inside-information',
      title: 'Informationszugang mit unbequemen Fragen testen',
      rationale:
        'Ein echter Champion liefert nicht nur positive Updates, sondern hilft auch mit belastbarer interner Realität.',
      action:
        'Bitte um die wichtigsten internen Bedenken, Gegenargumente oder schlechten Nachrichten, die aktuell gegen die Opportunity sprechen.',
      desiredEvidence: [
        'Konkrete interne Bedenken oder neue relevante Informationen',
        'Belastbare Evidence statt unbestätigter Annahme',
      ],
      expectedBehaviorTypes: ['provided_internal_information', 'shared_bad_news'],
    }
  }
  if (selling.state !== 'proven') {
    return {
      id: 'champion-test-internal-selling',
      title: 'Internal Selling konkret testen',
      rationale:
        'Interne Informationen und Meeting-Koordination beweisen noch nicht, dass die Person die Opportunity ohne unsere Anwesenheit aktiv verkauft.',
      action:
        'Vereinbare einen konkreten internen Verkaufsschritt: Die Person soll einen relevanten Stakeholder für Business Outcome, Priorität oder Differenzierung gewinnen und anschließend die Einwände zurückspiegeln.',
      desiredEvidence: [
        'Beobachtbares internes Verkaufen zugunsten der Opportunity',
        'Konkrete Rückmeldung zu Einwänden oder notwendiger Nacharbeit',
      ],
      expectedBehaviorTypes: ['sold_internally'],
    }
  }
  if (personalWin.state !== 'proven') {
    return {
      id: 'champion-test-personal-win-confirmation',
      title: 'Personal Win belastbar bestätigen',
      rationale: 'Der Personal Win ist beschrieben, aber noch nicht evidenzverankert.',
      action:
        'Spiegle den angenommenen Personal Win zurück und lasse die Person selbst bestätigen, warum der Erfolg für sie persönlich bzw. in ihrer Rolle relevant ist.',
      desiredEvidence: ['Direkte Bestätigung des Personal Win', 'Belastbare Evidence für die eigene Motivation'],
      expectedBehaviorTypes: ['confirmed_personal_win'],
    }
  }
  if (access.state !== 'proven' && ebAccess.state !== 'proven') {
    return {
      id: 'champion-test-access-creation',
      title: 'Relevanten internen Zugang testen',
      rationale:
        'Ein Champion sollte nicht nur informieren, sondern relevante interne Türen tatsächlich öffnen können.',
      action:
        'Bitte um Zugang zu einem für die Entscheidung wichtigen Stakeholder, bei dem die Person ihren Einfluss praktisch einsetzen muss.',
      desiredEvidence: [
        'Tatsächlich hergestellter Zugang zu einem relevanten Stakeholder',
        'Nachvollziehbarer Beitrag der Person zur Herstellung dieses Zugangs',
      ],
      expectedBehaviorTypes: ['created_access'],
    }
  }
  if (ebAccess.state !== 'proven') {
    return {
      id: 'champion-test-economic-buyer-access',
      title: 'Economic-Buyer-Zugang als nächsten Härtetest nutzen',
      rationale:
        'Der Candidate zeigt bereits belastbares internes Verhalten. Der Zugang zum Economic Buyer ist jetzt ein besonders aussagekräftiger Test.',
      action:
        'Bitte um eine direkte, vorbereitete Introduction zum Economic Buyer mit klarem Gesprächsziel und gemeinsamem Kontext.',
      desiredEvidence: [
        'Direkte Introduction bzw. bestätigter Termin mit dem Economic Buyer',
        'Aktive Vorbereitung des Zugangs durch den Champion',
      ],
      expectedBehaviorTypes: ['enabled_economic_buyer_access'],
    }
  }
  return {
    id: 'champion-test-resilience',
    title: 'Champion unter realem Deal-Druck weiter qualifizieren',
    rationale:
      'Ein belastbarer Champion bleibt kein statischer Status. Neue interne Hürden oder schlechte Nachrichten sind weitere Qualification-Momente.',
    action:
      'Nutze die nächste reale interne Hürde, Procurement-Frage oder Gegenposition als erneuten Test, ob der Champion weiterhin aktiv verkauft und offen berichtet.',
    desiredEvidence: [
      'Aktive Unterstützung bei einer realen internen Hürde',
      'Offene Rückmeldung zu Gegenwind oder schlechten Nachrichten',
    ],
    expectedBehaviorTypes: ['shared_bad_news', 'challenged_internal_process', 'supported_procurement'],
  }
}

function rationale(status: ChampionAssessmentStatus, signals: readonly ChampionSignal[]): string {
  if (status === 'disqualified')
    return 'Die Person ist kanonisch disqualifiziert. Abgeleitete Signale dürfen diesen Zustand nicht wieder hochstufen.'
  if (status === 'proven')
    return 'Einfluss ist ausreichend strukturiert vorhanden; Personal Win, interner Informationszugang, Internal Selling und Economic-Buyer-Zugang sind durch belastbare Evidence gestützt. Einfluss selbst bleibt in Schema 0.2.0 strukturiert, nicht separat evidenzverankert.'
  if (status === 'partially-proven') {
    const proven = signals.filter((item) => item.state === 'proven').map((item) => item.label)
    return (
      'Es gibt belastbare Champion-Signale (' +
      proven.join(', ') +
      '), aber mindestens ein zentrales Kriterium ist noch nicht ausreichend bewiesen.'
    )
  }
  return 'Die Person bleibt ein Champion-Candidate: Es gibt noch kein belastbares beobachtbares Champion-Verhalten, das über strukturierte Angaben oder Behauptungen hinausgeht.'
}

function readyForEbTest(person: ChampionPerson, signals: readonly ChampionSignal[]): boolean {
  return (
    person.status !== 'disqualified' &&
    (person.influence === 'medium' || person.influence === 'high') &&
    textPresent(person.personalWin) &&
    getSignal(signals, 'inside-information').state === 'proven' &&
    getSignal(signals, 'internal-selling').state === 'proven' &&
    (getSignal(signals, 'access-creation').state === 'proven' ||
      getSignal(signals, 'economic-buyer-access').state === 'proven')
  )
}

function assessPerson(project: MeddpiccProject, person: ChampionPerson): ChampionAssessment {
  const stakeholder = project.stakeholders.find((item) => item.id === person.stakeholderId)
  const signals = buildSignals(project, person)
  const status = deriveStatus(person, signals)
  const behaviorEvidenceIds = support(
    project,
    person.behaviors.flatMap((item) => item.evidenceIds),
  ).all
  const evidenceIds = unique([...support(project, project.meddpicc.champions.evidenceIds).all, ...behaviorEvidenceIds])
  const behaviorTypes = unique(person.behaviors.map((item) => item.type))
  const paths = unique([
    'meddpicc.champions.people[' + person.stakeholderId + ']',
    ...signals.flatMap((item) => item.sourcePaths),
  ])
  return {
    id: 'champion_assessment_' + person.stakeholderId,
    stakeholderId: person.stakeholderId,
    stakeholderName: stakeholder?.name ?? person.stakeholderId,
    stakeholderRole: stakeholder?.role ?? '',
    canonicalStatus: person.status,
    status,
    rationale: rationale(status, signals),
    signals,
    provenSignals: signals.filter((item) => item.state === 'proven'),
    openSignals: signals.filter((item) => item.state !== 'proven'),
    evidenceIds,
    structuredInputs: [
      {
        path: 'meddpicc.champions.people[' + person.stakeholderId + '].status',
        label: 'Kanonischer Champion-Status',
        value: person.status,
        evidenceAnchoring: 'structured-only',
      },
      {
        path: 'meddpicc.champions.people[' + person.stakeholderId + '].influence',
        label: 'Einfluss',
        value: person.influence,
        evidenceAnchoring: 'structured-only',
      },
      {
        path: 'meddpicc.champions.people[' + person.stakeholderId + '].personalWin',
        label: 'Personal Win',
        value: textPresent(person.personalWin) ? person.personalWin!.trim() : 'fehlt',
        evidenceAnchoring:
          getSignal(signals, 'personal-win').state === 'proven' ? 'behavior-evidence' : 'structured-only',
      },
    ],
    sourceTraceability: { stakeholderId: person.stakeholderId, behaviorTypes, evidenceIds, paths },
    nextTest: nextTest(person, signals, status),
    relatedNextBestActionRuleId: status === 'disqualified' ? null : 'nba.champion.test',
    readyForEconomicBuyerAccessTest: readyForEbTest(person, signals),
  }
}

const statusWeight: Record<ChampionAssessmentStatus, number> = {
  proven: 3,
  'partially-proven': 2,
  candidate: 1,
  disqualified: 0,
}
const stateWeight: Record<ChampionSignalState, number> = { proven: 3, structured: 2, insufficient: 1, missing: 0 }
const influenceWeight: Record<ChampionPerson['influence'], number> = { high: 3, medium: 2, low: 1, unknown: 0 }

function compare(a: ChampionAssessment, b: ChampionAssessment): number {
  const aInfluence = a.structuredInputs.find((item) => item.label === 'Einfluss')?.value as ChampionPerson['influence']
  const bInfluence = b.structuredInputs.find((item) => item.label === 'Einfluss')?.value as ChampionPerson['influence']
  const state = (assessment: ChampionAssessment, id: ChampionSignalId) =>
    stateWeight[getSignal(assessment.signals, id).state]
  return (
    statusWeight[b.status] - statusWeight[a.status] ||
    Number(b.readyForEconomicBuyerAccessTest) - Number(a.readyForEconomicBuyerAccessTest) ||
    state(b, 'internal-selling') - state(a, 'internal-selling') ||
    state(b, 'personal-win') - state(a, 'personal-win') ||
    influenceWeight[bInfluence] - influenceWeight[aInfluence] ||
    state(b, 'economic-buyer-access') - state(a, 'economic-buyer-access') ||
    state(b, 'inside-information') - state(a, 'inside-information') ||
    state(b, 'access-creation') - state(a, 'access-creation') ||
    a.stakeholderId.localeCompare(b.stakeholderId)
  )
}

export function assessChampion(project: MeddpiccProject, stakeholderId: string): ChampionAssessment | null {
  const person = project.meddpicc.champions.people.find((item) => item.stakeholderId === stakeholderId)
  return person ? assessPerson(project, person) : null
}

export function assessChampions(project: MeddpiccProject): ChampionAssessment[] {
  return project.meddpicc.champions.people.map((person) => assessPerson(project, person)).sort(compare)
}

export function strongestChampionAssessment(project: MeddpiccProject): ChampionAssessment | null {
  return assessChampions(project).find((assessment) => assessment.status !== 'disqualified') ?? null
}
