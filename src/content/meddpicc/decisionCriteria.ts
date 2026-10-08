import type { ChecklistDefinition, ChecklistItem, MeddpiccConcept } from './types'

export const criterionCategories = [
  {
    code: 'Technical',
    label: 'Technisch',
    meaning: 'Ist die Lösung für den konkreten Use Case machbar? Dazu zählen Funktionen, Integration, Infrastruktur, Sicherheit, Performance und Usability.',
    question: 'Welche technischen Eigenschaften sind für den beschriebenen Geschäftsablauf zwingend erforderlich?',
    caution: 'Ein langer Funktionskatalog ersetzt keinen validierten Use Case.',
  },
  {
    code: 'Economic',
    label: 'Wirtschaftlich',
    meaning: 'Lohnt sich die Investition relativ zu Kosten, Risiko, Time-to-Value, Opportunitätskosten, ROI und kommerziellen Bedingungen?',
    question: 'Welche wirtschaftlichen Ziele und Mindestanforderungen muss die Investition erfüllen?',
    caution: 'Ein Einkaufspreis allein beschreibt noch nicht die gesamten wirtschaftlichen Kriterien.',
  },
  {
    code: 'Relationship',
    label: 'Zusammenarbeit & Partner',
    meaning: 'Passen Organisationen hinsichtlich Verlässlichkeit, Reputation, Zusammenarbeit, Branchenkenntnis und Executive Alignment zusammen?',
    question: 'Was muss ein Anbieter über die reine Produktleistung hinaus mitbringen, damit Sie ihm vertrauen?',
    caution: 'Gute Chemie ist ohne relevante Kundenanforderung kein ausreichend belegtes Entscheidungskriterium.',
  },
] as const

export const complementaryCriteria = [
  {
    label: 'Vendor/Partner Criteria',
    meaning: 'Anforderungen an den Anbieter selbst: wirtschaftliche Stabilität, Erfahrung, Referenzen, Größe oder Standort.',
  },
  {
    label: 'Financial Justification',
    meaning: 'Wirtschaftliche Rechtfertigung: erwarteter ROI, Kostenwirkung, Business Objectives und Risiko.',
  },
  {
    label: 'Capability Validation',
    meaning: 'Nachweis benötigter Fähigkeiten, Muss-Anforderungen, optionale Funktionen und überprüfbare Erfolgskriterien.',
  },
] as const

export const valueTriangleZones = [
  {
    code: 'Value',
    meaning: 'Der Kunde benötigt die Fähigkeit; wir können sie nachweislich bieten, die relevante Alternative nicht.',
    action: 'Mit Kundenbeleg und Business Impact absichern – keine Alleinstellung ohne verlässlichen Vergleich behaupten.',
  },
  {
    code: 'Danger',
    meaning: 'Der Kunde benötigt die Fähigkeit; eine Alternative bietet sie, wir derzeit nicht.',
    action: 'Geschäftlichen Grund und tatsächliches Risiko klären; Grenzen offenlegen, keine falschen Zusagen.',
  },
  {
    code: 'Parity',
    meaning: 'Kunde braucht die Fähigkeit, sowohl wir als auch die Alternative decken sie ab.',
    action: 'Erfüllung belegen, aber Gleichwertigkeit nicht als Differenzierung verkaufen.',
  },
  {
    code: 'Unique Differentiators',
    meaning: 'Wir bieten eine besondere Fähigkeit, die Alternative nicht – der Kunde verlangt sie bisher aber nicht.',
    action: 'Den möglichen Nutzen sachlich untersuchen, statt automatisch Value zu unterstellen.',
  },
  {
    code: 'Custom Needs',
    meaning: 'Kunde benötigt etwas, das weder wir noch die betrachtete Alternative derzeit abdecken.',
    action: 'Relevanz, Partnerlösungen und Umsetzungskonsequenzen prüfen; keine unbelegte Roadmap-Zusage.',
  },
  {
    code: 'Market Trends',
    meaning: 'Beide Anbieter bieten eine Fähigkeit, die der Kunde bisher nicht benötigt.',
    action: 'Nicht als kaufentscheidend behandeln, solange kein Kundenbedarf bestätigt wurde.',
  },
  {
    code: 'Useless',
    meaning: 'Nur die Alternative bietet eine Fähigkeit, für die der Kunde keinen Bedarf formuliert hat.',
    action: 'Keine Energie in einen irrelevanten Vergleich investieren; Kriterien können sich durch Discovery ändern.',
  },
] as const

export const decisionCriteriaConcepts = {
  origin: {
    id: 'origin',
    meaning: 'Ermittle vorhandene Dokumente, informelle Absprachen und mögliche Quellen der Anforderungen.',
    whyItMatters: 'Ein vermeintlicher Kriterienkatalog kann von wenigen Stakeholdern, Beratern oder einem Wettbewerber geprägt sein.',
    signals: ['Das zuständige Team bestätigt, ob ein Kriterienkatalog existiert.', 'Entstehung, Eigentümer und letzte Validierung sind geklärt.'],
    commonMisinterpretation: 'Ein RFP-Dokument ist automatisch vollständig, objektiv und endgültig.',
    possibleQuestionsOrActions: ['Wer hat die Kriterien zusammengestellt, und welche Quellen haben sie geprägt?', 'Welche Anforderungen sind intern bereits abgestimmt und welche noch offen?'],
    sourceNote: 'Whyte → Decision Criteria: Establishing the Status of the Decision Criteria.',
  },
  business: {
    id: 'business',
    meaning: 'Ordne jeder wichtigen Fähigkeit ein Kundenproblem, den Use Case und das gewünschte Ergebnis zu.',
    whyItMatters: 'So lässt sich ein sinnvoller Wertbeitrag von austauschbaren Wunschlisten unterscheiden.',
    signals: ['Mindestens ein Kundenbeispiel erklärt den Bedarf.', 'Die beteiligten Anwender können den Use Case konkret beschreiben.'],
    commonMisinterpretation: 'Ein Funktionswunsch ist schon ein geschäftlich zwingendes Kriterium.',
    possibleQuestionsOrActions: ['Welchen Vorgang oder welches Problem soll diese Anforderung verändern?', 'Was passiert, wenn die Anforderung nicht erfüllt wird?'],
    sourceNote: 'Whyte → Decision Criteria: Influencing the Decision Criteria; Lahoutifard → Chapter Five: Capability Validation.',
  },
  types: {
    id: 'types',
    meaning: 'Technical, Economic und Relationship erfassen unterschiedliche Perspektiven auf eine Kaufentscheidung.',
    whyItMatters: 'Ein bestandener Techniktest allein ist kein Nachweis für wirtschaftliche Tragfähigkeit oder Vertrauen.',
    signals: ['Fachseite, wirtschaftliche Entscheider und weitere Beteiligte wurden passend eingebunden.', 'Zu jeder Kriterienart sind offene Fragen dokumentiert.'],
    commonMisinterpretation: 'Alle Stakeholder bewerten dieselben Eigenschaften gleich.',
    possibleQuestionsOrActions: ['Welche wirtschaftlichen Voraussetzungen müssen neben der technischen Eignung erfüllt sein?', 'Welche Anforderungen haben Sie an die Zusammenarbeit mit einem Anbieter?'],
    sourceNote: 'Whyte → Decision Criteria: The Three Types of Decision Criteria.',
  },
  priorities: {
    id: 'priorities',
    meaning: 'Trenne Ausschlussbedingungen, priorisierte Kriterien, Wünsche und noch offene Hypothesen.',
    whyItMatters: 'Unbelegte Gewichtung kann einen ganzen Auswahlprozess in die falsche Richtung lenken.',
    signals: ['Der Kunde bestätigt, welche Kriterien tatsächlich ausschließend sind.', 'Gewichtungen und Prioritäten werden kundenseitig genannt oder bewusst als ungeklärt markiert.'],
    commonMisinterpretation: 'Ein hoher Verkäufer-Score oder ein „Must-have“ im Gespräch beweist die tatsächliche Entscheidungsgewichtung.',
    possibleQuestionsOrActions: ['Welche Kriterien wären aus Ihrer Sicht echte Ausschlussgründe?', 'Wer bestätigt die Priorität, und nach welchem Maßstab wird bewertet?'],
    sourceNote: 'Lahoutifard → Chapter Five: Capability Validation, Ranking, Scoring, Weighting; Whyte → Establishing the Status.',
  },
  owners: {
    id: 'owners',
    meaning: 'Identifiziere Beteiligte, interne Entscheidungsautorisierung und externe Einflüsse.',
    whyItMatters: 'Kriterien können sich zwischen Fachbereich, IT, Einkauf und Management unterscheiden.',
    signals: ['Owner und wichtige Mitwirkende der Kriterien stehen fest.', 'Ein geeigneter Stakeholder kann Widersprüche zwischen Anforderungen auflösen.'],
    commonMisinterpretation: 'Mein Ansprechpartner kann alle Kriterien ohne Rücksprache verbindlich freigeben.',
    possibleQuestionsOrActions: ['Wer müsste eine Änderung oder Ausnahme genehmigen?', 'Welche Rolle spielen Einkauf, IT und wirtschaftliche Entscheider bei den Kriterien?'],
    sourceNote: 'Whyte → Decision Criteria: Establishing the Status; The Three Types.',
  },
  metrics: {
    id: 'metrics',
    meaning: 'Leite wirtschaftlich wichtige Kriterien aus Zielen, Pain, Use Cases und überprüfbaren Ergebnisgrößen her.',
    whyItMatters: 'Ohne Bezug zum Geschäftsresultat droht eine beliebige Feature- und Preisdiskussion.',
    signals: ['Die geschäftlichen Folgen sind nachvollziehbar.', 'Messgrößen stammen vom Kunden oder sind klar als noch zu validieren markiert.'],
    commonMisinterpretation: 'Unsere ROI-Folie allein ist bereits die bestätigte Finanzanforderung des Kunden.',
    possibleQuestionsOrActions: ['Welche messbare Verbesserung soll mit diesem Kriterium erreicht werden?', 'Wer kann die zugrunde liegenden Zahlen bestätigen?'],
    sourceNote: 'Whyte → Decision Criteria: Influencing the Decision Criteria; Economic Criteria; Lahoutifard → Financial Justification.',
  },
  alternatives: {
    id: 'alternatives',
    meaning: 'Prüfe Kundenrelevanz, eigene Fähigkeiten und belegbare Alternativen inklusive Status quo und Eigenentwicklung.',
    whyItMatters: 'Differenzierung zählt nur, wenn sie für den Kunden relevant und gegenüber Alternativen nachweisbar ist.',
    signals: ['Der Kunde benennt die verglichenen Alternativen.', 'Unsere und fremde Fähigkeiten sind mit belastbaren Informationen belegt oder als unklar markiert.'],
    commonMisinterpretation: 'Ein einzigartiges Feature ist automatisch Value; eine vermutete Wettbewerbsstärke beweist eine Danger Zone.',
    possibleQuestionsOrActions: ['Welche Alternative würde den Bedarf sonst erfüllen?', 'Welche dieser Unterschiede beeinflussen Ihre Entscheidung tatsächlich?'],
    sourceNote: 'Lahoutifard → Chapter Five: The Value Triangle, Value, Danger, Parity.',
  },
  validation: {
    id: 'validation',
    meaning: 'Definiere gemeinsam, wie eine Anforderung praktisch nachgewiesen wird und wer das Ergebnis anerkennt.',
    whyItMatters: 'Ein technisch erfolgreicher Test führt nicht automatisch zur Beschaffungsfreigabe.',
    signals: ['Konkrete Testszenarien und Akzeptanzkriterien sind benannt.', 'Nach der Validierung ist ein expliziter nächster Entscheidungsschritt vereinbart.'],
    commonMisinterpretation: 'Ein erfolgreicher POC bedeutet automatisch Auftrag oder Unterschrift.',
    possibleQuestionsOrActions: ['Was muss der POC nachweislich zeigen, damit die Bewertung abgeschlossen ist?', 'Wer bewertet das Ergebnis und was passiert bei erfolgreichem Test als Nächstes?'],
    sourceNote: 'Whyte → Decision Criteria: Technical Criteria, RFPs, Influencing the Decision Criteria.',
  },
  gaps: {
    id: 'gaps',
    meaning: 'Halte ungelöste Muss-Anforderungen, Gegenpositionen und nötige Folgegespräche sichtbar.',
    whyItMatters: 'Qualifizierung bedeutet auch, bei nachweislichem Misfit sachlich einen Ausstieg zu erwägen.',
    signals: ['Unbestätigte oder widersprüchliche Kriterien werden als offen behandelt.', 'Ein Stakeholder und eine sinnvolle nächste Klärung sind vereinbart.'],
    commonMisinterpretation: 'Jedes kritische Kriterium lässt sich mit einer Behauptung oder Produkt-Roadmap beseitigen.',
    possibleQuestionsOrActions: ['Was wäre für Sie ein Ausschlussgrund, wenn sich die Anforderung nicht erfüllen lässt?', 'Mit wem klären wir die offenen Punkte bis wann?'],
    sourceNote: 'Whyte → Decision Criteria: Established/No Established Criteria, Qualify Out; Lahoutifard → Chapter Ten: Say No To Qualify.',
  },
} satisfies Record<string, MeddpiccConcept>

export const decisionCriteriaKnowledge = {
  id: 'decision-criteria',
  eyebrow: 'Wissen · Decision Criteria',
  title: 'Decision Criteria: verstehen, was die Auswahl wirklich bestimmt',
  lead: 'Finde heraus, welche Kriterien für den Kunden zählen, wer sie beeinflusst und wie du Anforderungen mit Geschäftsnutzen und echten Nachweisen verbindest.',
  shortDefinition: 'Decision Criteria sind die Maßstäbe, nach denen ein Kunde Lösungen und Anbieter bewertet. Sie können dokumentiert sein oder informell zwischen den Beteiligten entstehen.',
  benefit: 'Du vermeidest Feature-Vergleiche ohne Kundenrelevanz und erkennst, was bestätigt, nur vermutet oder noch zu klären ist.',
  whyImportant: [
    'Kriterien sind nicht automatisch vollständig, fest gewichtet oder zwischen allen Beteiligten abgestimmt.',
    'Technische Eignung, wirtschaftliche Rechtfertigung und Vertrauen in den Anbieter können unabhängig voneinander entscheidend sein.',
    'Mit Blick auf Pain, Use Case und Metrics lassen sich relevante Kriterien sachlich konkretisieren.',
    'Ein Test sollte nicht nur technisch bestehen, sondern eine vereinbarte Bewertung und einen nächsten Entscheidungsschritt ermöglichen.',
  ],
  recognitionConceptIds: ['origin', 'business', 'priorities', 'owners'],
  misinterpretations: [
    { claim: 'Jede RFP-Anforderung ist endgültig und unantastbar.', explanation: 'Ein RFP dokumentiert Kriterien, aber weder deren Herkunft noch die dahinterliegenden Geschäftsmotive sind automatisch geklärt. Frage respektvoll nach Relevanz, Entstehung und Zulässigkeit von Alternativen.' },
    { claim: 'Technischer Fit bedeutet, dass der Kunde sich für uns entscheidet.', explanation: 'Capability Validation beantwortet nur einen Teil der Frage. Der Business Case, Partneranforderungen, interne Entscheidung und administrativer Abschluss bleiben eigenständig.' },
    { claim: 'Ein Alleinstellungsmerkmal ist automatisch ein Kaufargument.', explanation: 'Ohne nachgewiesenen Kundenbedarf ist ein Unique Differentiator zunächst nur eine besondere Fähigkeit, kein validierter Value.' },
    { claim: 'Die Konkurrenz kann das nicht – das weiß ich einfach.', explanation: 'Eine Verkäuferannahme über Alternativen ist keine belastbare Differenzierung. Status quo, Eigenbau und Anbieter müssen mit verlässlichen Informationen und dem Kundenkontext geprüft werden.' },
    { claim: 'Unser POC war erfolgreich – damit kommt der Auftrag.', explanation: 'Ein bestandenes Testszenario beweist die vereinbarten Fähigkeiten. Entscheidung, wirtschaftliche Freigabe, Procurement und Vertragsabschluss sind damit nicht automatisch erledigt.' },
  ],
  discoveryQuestions: [
    'Welche Anforderungen sind für Ihre Entscheidung wirklich ausschlaggebend?',
    'Wer hat diese Kriterien entwickelt und worauf beruhen sie?',
    'Welche Bedingungen sind Ausschlusskriterien, welche wären wünschenswert?',
    'Wer prüft die technische Eignung, wer die Wirtschaftlichkeit und wer die Partnerschaft?',
    'Was müsste eine Lösung messbar verbessern, damit die Investition gerechtfertigt ist?',
    'Wodurch wäre eine Bewertung oder ein POC für Sie erfolgreich – und wie geht es danach weiter?',
  ],
  practiceActions: [
    'Bestehende Kriterien und ihren Status klären: schriftlich, informell, unbestätigt.',
    'Das geschäftliche Warum und die dahinterliegenden Use Cases herausarbeiten.',
    'Technical, Economic und Relationship mit den jeweiligen Stakeholdern abgleichen.',
    'Muss-Kriterien, Wünsche und Prioritäten ausdrücklich vom Kunden validieren lassen.',
    'Alternative Angebote und Status quo mit belegbaren Unterschieden prüfen.',
    'Akzeptanzkriterien, Evidenzlücken und nächsten Entscheidungsschritt gemeinsam festlegen.',
  ],
  examples: [
    { title: 'CRM-Integration', situation: '„Wir brauchen eine bidirektionale ERP-Integration.“', inquiry: 'Welcher konkrete Ablauf scheitert heute – und wie würden Sie Erfolg im Test nachweisen?', boundary: 'Ohne Prozessbezug und Testkriterien bleibt „bidirektional“ eine unbestätigte Anforderung.' },
    { title: 'Hosting & Datenschutz', situation: '„Die Daten müssen zwingend in Deutschland liegen.“', inquiry: 'Welche interne Vorgabe oder fachlich geprüfte Rechtsanforderung begründet den Standort?', boundary: 'Nicht ungeprüft rechtliche Notwendigkeit behaupten oder die Anforderung ignorieren; zuständige Fachleute einbeziehen.' },
    { title: 'Time-to-Value', situation: '„Wir müssen spätestens zum Jahresbeginn live sein.“', inquiry: 'Was muss zu diesem Termin geschäftlich erreicht sein und welche Konsequenz hätte eine Verzögerung?', boundary: 'Ein gewünschtes Datum allein belegt weder Priorität noch einen Economic Case oder Critical Event.' },
  ],
  differences: [
    { author: 'Andy Whyte', summary: 'Unterscheidet Technical, Economic und Relationship. Legt besonderen Wert auf Herkunft, Beeinflussbarkeit, Discovery und die Verbindung von Pain, Use Case, Capability und Metrics.', source: 'MEDDICC → Decision Criteria: Establishing the Status, Three Types, Influencing the Decision Criteria.' },
    { author: 'Darius Lahoutifard', summary: 'Ordnet Vendor/Partner Criteria, Financial Justification und Capability Validation; konkretisiert Wettbewerbsvorteile und Gefahrenzonen im Value Triangle.', source: 'Always Be Qualifying → Chapter Five: Decision Criteria, Value Triangle; Chapter Ten: Say No To Qualify.' },
  ],
  practicalTakeaway: 'Erst Kundenrelevanz und Entscheidungsmaßstab klären, dann die eigene Lösung einordnen. Offene Anforderungen werden validiert, nicht per Verkäufer-Score entschieden.',
  sourceNotes: [
    'Andy Whyte → MEDDICC, Kapitel Decision Criteria: Establishing the Status of the Decision Criteria; The Three Types; Technical/Economic/Relationship; Influencing.',
    'Darius Lahoutifard → Always Be Qualifying, Chapter Five: Decision Criteria; Vendor/Partner Criteria; Financial Justification; Capability Validation; The Value Triangle; Chapter Ten: Say No To Qualify.',
    'Fachlicher Quellennachweis: docs/DECISION_CRITERIA_SOURCE_BRIEF.md. Die deutschsprachigen Fragen sind eigenständige Praxisformulierungen, keine Zitate.',
  ],
} as const

function conceptChecklistItem(id: string, question: string, concept: MeddpiccConcept): ChecklistItem {
  return {
    id,
    question,
    meaning: concept.meaning,
    whyItMatters: concept.whyItMatters,
    signals: concept.signals,
    commonMisinterpretation: concept.commonMisinterpretation,
    possibleQuestionsOrActions: concept.possibleQuestionsOrActions,
    relatedKnowledge: 'decision-criteria',
    sourceNote: concept.sourceNote,
  }
}

export const decisionCriteriaChecklist: ChecklistDefinition = {
  id: 'decision-criteria',
  eyebrow: 'Checklist · Decision Criteria',
  title: 'Decision Criteria: prüfe, was die Entscheidung wirklich trägt',
  lead: 'Neun kurze Prüfungen: Kundenkriterien erkennen, Business Relevanz klären, Alternativen einordnen und offene Annahmen gezielt validieren.',
  whenToUse: 'Nach Discovery, vor einer RFP-Antwort, Demo oder einem POC – und sobald Auswahlkriterien oder Prioritäten unklar sind.',
  benefit: 'Du erkennst ungeprüfte Muss-Anforderungen, Scheindifferenzierung und versteckte Ausschlussrisiken, bevor du Zeit in die falsche Bewertung investierst.',
  items: [
    conceptChecklistItem('origin', 'Ist geklärt, welche Entscheidungskriterien existieren, ob sie formal sind und woher sie stammen?', decisionCriteriaConcepts.origin),
    conceptChecklistItem('business', 'Kann ich wesentliche Kriterien auf ein konkretes Kundenproblem und den benötigten Use Case zurückführen?', decisionCriteriaConcepts.business),
    conceptChecklistItem('types', 'Habe ich technische, wirtschaftliche und partnerschaftliche Kriterien bei den passenden Personen geprüft?', decisionCriteriaConcepts.types),
    conceptChecklistItem('priorities', 'Ist bekannt, was Muss-Kriterium, Wunsch oder informelle Präferenz ist – und wer es priorisiert?', decisionCriteriaConcepts.priorities),
    conceptChecklistItem('owners', 'Weiß ich, wer Kriterien setzt, ändert, überprüft und verbindlich bestätigt?', decisionCriteriaConcepts.owners),
    conceptChecklistItem('metrics', 'Haben die wichtigsten Kriterien einen nachvollziehbaren Zusammenhang zu Business Impact und Metrics?', decisionCriteriaConcepts.metrics),
    conceptChecklistItem('alternatives', 'Kenne ich relevante Alternativen und die Belege für Value, Danger und Parity?', decisionCriteriaConcepts.alternatives),
    conceptChecklistItem('validation', 'Sind bei Demo, RFP oder POC die Erfolgskriterien und die Folge eines erfolgreichen Tests geklärt?', decisionCriteriaConcepts.validation),
    conceptChecklistItem('gaps', 'Sind Widersprüche, unpassende Anforderungen und die nächste Kundenvalidierung offen benannt?', decisionCriteriaConcepts.gaps),
  ],
  sourceNotes: decisionCriteriaKnowledge.sourceNotes.slice(),
}
