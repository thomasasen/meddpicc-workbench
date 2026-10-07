import type { ChecklistDefinition, ChecklistItem, KnowledgeTopic, MeddpiccConcept } from './types'

export const economicBuyerConcepts = {
  authority: {
    id: 'economic-authority',
    meaning:
      'Gemeint ist die Person oder wirtschaftliche Instanz, die die Investition letztlich freigeben, priorisieren oder stoppen kann. Titel, Budgetnähe oder Projektverantwortung reichen dafür allein nicht aus.',
    whyItMatters:
      'Eine fachlich bevorzugte Lösung kann trotzdem scheitern, wenn die wirtschaftliche Autorität nicht überzeugt ist oder andere Prioritäten setzt.',
    signals: [
      'Kann eine Investition trotz Zustimmung anderer Stakeholder stoppen oder vorantreiben.',
      'Kann Budgets priorisieren, verschieben oder zusätzliche Mittel ermöglichen.',
      'Ist in die wirtschaftliche Freigabe oder den Weg zur finalen Genehmigung eingebunden.',
      'Verantwortet relevante Geschäftsziele oder trägt Ergebnisverantwortung.',
    ],
    commonMisinterpretation:
      '„Die Person hat den höchsten Titel oder besitzt das Projektbudget – damit muss sie der Economic Buyer sein.“',
    possibleQuestionsOrActions: [
      'Wer kann diese Investition am Ende noch stoppen, obwohl alle anderen zustimmen?',
      'Wer entscheidet, ob dieses Vorhaben gegenüber anderen Initiativen finanziert und priorisiert wird?',
      'Welche Person müsste dem Business Case zustimmen, damit die Investition tatsächlich freigegeben wird?',
    ],
    learnMore:
      'Whyte warnt sowohl vor dem Budget-Holder-Fehler als auch davor, automatisch eine zu weit entfernte C-Level-Person zum Economic Buyer zu erklären. Entscheidend ist die tatsächliche Autorität im konkreten Vorhaben.',
    sourceNote:
      'Whyte → Economic Buyer: Identifying the Economic Buyer / Qualifying Criteria; Lahoutifard → Chapter Four: Economic Buyer.',
  },
  businessOutcome: {
    id: 'business-outcome',
    meaning:
      'Der Economic Buyer betrachtet das Vorhaben aus Sicht geschäftlicher Ergebnisse: zum Beispiel Umsatz, Kosten, Risiko, Produktivität, strategische Ziele oder Time-to-Value.',
    whyItMatters:
      'Wer nur Funktionen oder technische Details erklärt, spricht häufig an den Prioritäten des Economic Buyers vorbei.',
    signals: [
      'Kann benennen, welches Geschäftsergebnis die Investition verbessern soll.',
      'Verknüpft das Vorhaben mit einer strategischen Initiative oder Priorität.',
      'Fragt nach Wirkung, Risiko, Kosten oder Geschwindigkeit bis zum Nutzen.',
    ],
    commonMisinterpretation:
      '„Wenn die Fachabteilung die Lösung gut findet, wird der Economic Buyer denselben Nutzen automatisch genauso bewerten.“',
    possibleQuestionsOrActions: [
      'Welches Geschäftsergebnis soll diese Investition für Sie konkret verändern?',
      'Welche Ihrer aktuellen Prioritäten würde dieses Vorhaben direkt unterstützen?',
      'Was wäre für Sie ein sichtbares Zeichen dafür, dass die Investition erfolgreich war?',
    ],
    learnMore:
      'Whyte empfiehlt, mit dem Economic Buyer über Business Objectives und Outcomes statt über „bells and whistles“ zu sprechen. Lahoutifard formuliert denselben Gedanken als „WHY“-Frequenz für Top Management.',
    sourceNote:
      'Whyte → Talk in the Language of the Economic Buyer / How Economic Buyers Make Decisions; Lahoutifard → Tune Your Sales Pitch to the Right Frequency.',
  },
  metricsValue: {
    id: 'metrics-value',
    meaning:
      'Der erwartete Nutzen sollte in einer Form beschrieben werden, die für die wirtschaftliche Entscheidung relevant ist – mit belastbaren Metrics und nachvollziehbarem Business Impact.',
    whyItMatters:
      'Metrics schaffen eine gemeinsame Sprache für Wert, Priorität und Investitionsentscheidung. Ohne sie bleibt der Nutzen schnell abstrakt.',
    signals: [
      'Es gibt konkrete Ausgangswerte oder belastbare Annahmen.',
      'Die Metric ist mit einem geschäftlichen Ergebnis verbunden.',
      'Der Economic Buyer kann nachvollziehen, wie und wann der Wert entsteht.',
    ],
    commonMisinterpretation:
      '„Je mehr Produktmetriken und Feature-KPIs ich zeige, desto überzeugender ist mein Business Case.“',
    possibleQuestionsOrActions: [
      'Welche Kennzahl würden Sie selbst nutzen, um den Erfolg dieser Investition zu beurteilen?',
      'Welche wirtschaftliche Wirkung wäre groß genug, damit dieses Vorhaben Priorität bekommt?',
      'Wann müsste der Nutzen sichtbar werden, damit die Investition für Sie attraktiv ist?',
    ],
    learnMore:
      'Whyte schlägt vor, den Economic Buyer nach seinem eigenen Erfolgsindikator zu fragen. Lahoutifard betont, Metrics je Stakeholder auf die passende wirtschaftliche Bedeutung zu übersetzen.',
    sourceNote:
      'Whyte → First Interaction Guidance / How Economic Buyers Make Decisions; Lahoutifard → How to Align Metrics with Your Message.',
  },
  decisionCriteria: {
    id: 'decision-criteria',
    meaning:
      'Neben fachlichen Kriterien zählen für den Economic Buyer wirtschaftliche und strategische Kriterien: Investitionshöhe, Risiko, Time-to-Value, Priorität und Vertrauen in die Umsetzung.',
    whyItMatters:
      'Eine Lösung kann technisch überzeugen und trotzdem wirtschaftlich abgelehnt werden, wenn die relevanten Entscheidungskriterien nicht verstanden sind.',
    signals: [
      'Die wirtschaftlichen Kriterien sind nicht nur vom Seller vermutet, sondern validiert.',
      'Risiko, Kosten und erwarteter Nutzen sind aus Sicht des Economic Buyers verstanden.',
      'Es ist klar, welche Bedenken oder Bedingungen eine Zustimmung verhindern könnten.',
    ],
    commonMisinterpretation:
      '„Die technische Evaluation ist positiv – damit sind die entscheidenden Kriterien bereits erfüllt.“',
    possibleQuestionsOrActions: [
      'Welche wirtschaftlichen Kriterien müssen für Sie erfüllt sein, bevor Sie zustimmen können?',
      'Welche Risiken würden Sie davon abhalten, das Vorhaben freizugeben?',
      'Was müsste im Business Case noch klarer werden, damit Sie eine Entscheidung treffen können?',
    ],
    learnMore:
      'Whyte beschreibt Cost, Completion und Confidence als typische Perspektiven des Economic Buyers. Die Toolbox behandelt sie als Denkhilfe, nicht als starre offizielle MEDDPICC-Formel.',
    sourceNote:
      'Whyte → How Economic Buyers Make Decisions; Lahoutifard → Chapter Four: The Meeting with the Economic Buyer.',
  },
  access: {
    id: 'access',
    meaning:
      'Direkter Zugang ist wertvoll, weil Prioritäten, Metrics und Entscheidungskriterien dadurch aus erster Hand validiert werden können. Fehlt direkter Zugang, sollte die Informationsqualität bewusst hinterfragt werden.',
    whyItMatters:
      'Wenn alle Informationen nur über Dritte kommen, steigt das Risiko, dass Erwartungen, Prioritäten oder Einwände gefiltert oder falsch interpretiert werden.',
    signals: [
      'Es gab einen direkten Austausch mit der wirtschaftlichen Entscheidungsinstanz.',
      'Alternativ liegen konkrete, mehrfach bestätigte Informationen zu Prioritäten und Kriterien vor.',
      'Der Champion kann erklären, wie der Economic Buyer angesprochen werden möchte und was ihm wichtig ist.',
    ],
    commonMisinterpretation:
      '„Mein Champion hält den Kontakt für unnötig – deshalb brauche ich den Economic Buyer nicht selbst zu verstehen.“',
    possibleQuestionsOrActions: [
      'Wie können wir den Economic Buyer sinnvoll einbinden, ohne den bestehenden Prozess zu umgehen?',
      'Welche Themen sollte ich vor einem Gespräch aus Sicht des Economic Buyers unbedingt verstanden haben?',
      'Falls ein direkter Termin aktuell nicht möglich ist: Welche Kriterien, Prioritäten und Einwände kann ich mit dem Champion belastbar vorbereiten, während ich weiter an sinnvollem EB-Zugang arbeite?',
    ],
    learnMore:
      'Whyte beschreibt den Champion als wichtigen Weg zur Identifikation, Einführung und Vorbereitung, empfiehlt aber zugleich, eine eigene Engagement-Strategie zu entwickeln. Lahoutifard misst dem frühen EB-Meeting besonders hohe Bedeutung bei.',
    sourceNote:
      'Whyte → Your Champion and the Economic Buyer / Other Ways to Engage; Lahoutifard → The Meeting with the Economic Buyer.',
  },
  commitment: {
    id: 'commitment',
    meaning:
      'Ein Economic-Buyer-Gespräch sollte nicht nur informieren. Vor dem Termin sollte klar sein, welche Entscheidung, Unterstützung oder welcher nächste Schritt sinnvollerweise erreicht werden soll.',
    whyItMatters:
      'Ohne klares Ziel kann ein seltener Executive-Termin freundlich verlaufen, ohne den Buying Process tatsächlich voranzubringen.',
    signals: [
      'Das gewünschte Ergebnis des Gesprächs ist vorab formuliert.',
      'Der nächste Schritt lässt sich einer Person und einem Zeitpunkt zuordnen.',
      'Offene Bedingungen für eine Zustimmung sind explizit benannt.',
    ],
    commonMisinterpretation:
      '„Wenn der Economic Buyer die Präsentation positiv findet, war das Meeting automatisch erfolgreich.“',
    possibleQuestionsOrActions: [
      'Was wäre aus Ihrer Sicht der sinnvolle nächste Schritt, wenn wir die heute besprochenen Punkte bestätigen?',
      'Welche Bedingung muss als Nächstes erfüllt sein, damit Sie das Vorhaben weiter unterstützen?',
      'Wen sollten wir für den nächsten Schritt gemeinsam einbinden?',
    ],
    learnMore:
      'Whyte empfiehlt, Meetings mit klaren Actions und Owners zu schließen. Lahoutifard verbindet das EB-Meeting ebenfalls mit konkreten nächsten Schritten und der Validierung des Decision Process.',
    sourceNote: 'Whyte → Close Strong / Follow-Up; Lahoutifard → The Meeting with the Economic Buyer.',
  },
  evidence: {
    id: 'evidence',
    meaning:
      'Die Einordnung als Economic Buyer sollte auf beobachtbaren Informationen beruhen: tatsächliche Autorität, Rolle im Freigabeprozess, Business-Verantwortung und validierte Aussagen – nicht nur auf Titel oder Seller-Annahme.',
    whyItMatters:
      'Eine falsche EB-Annahme führt dazu, dass Value, Zugang und Entscheidungsprozess an der falschen Person ausgerichtet werden.',
    signals: [
      'Mehrere Hinweise zur wirtschaftlichen Autorität passen zusammen.',
      'Die Rolle wurde durch Champion, weitere beteiligte Stakeholder, Prozessinformationen oder direkten Austausch bestätigt.',
      'Widersprüchliche Hinweise sind sichtbar und werden nicht einfach ignoriert.',
    ],
    commonMisinterpretation: '„Er wurde mir als Entscheider genannt – weitere Validierung ist deshalb nicht nötig.“',
    possibleQuestionsOrActions: [
      'Woher wissen wir konkret, dass diese Person die wirtschaftliche Entscheidung beeinflussen oder stoppen kann?',
      'Welche unserer Informationen sind bestätigt – und welche sind noch Interpretation?',
      'Welche Person könnte unsere Annahme zur Entscheidungsautorität verlässlich bestätigen?',
    ],
    learnMore:
      'Beide Autoren zeigen, dass die Identifikation des Economic Buyers aktiv qualifiziert werden muss. Die Toolbox macht daraus keine Punktzahl, sondern fordert nachvollziehbare Hinweise.',
    sourceNote: 'Whyte → Identifying the Economic Buyer; Lahoutifard → How do you find the EB?',
  },
} satisfies Record<string, MeddpiccConcept>

export const economicBuyerKnowledge: KnowledgeTopic = {
  id: 'economic-buyer',
  eyebrow: 'Wissen · Economic Buyer',
  title: 'Economic Buyer verstehen und sicherer einordnen',
  lead: 'Kläre, wer die wirtschaftliche Entscheidung tatsächlich tragen kann, welche Business Outcomes zählen und welche Annahmen du noch validieren solltest.',
  shortDefinition:
    'Der Economic Buyer ist die wirtschaftliche Autorität hinter der Investitionsentscheidung. Entscheidend ist nicht der Titel, sondern ob diese Person oder Instanz die Investition priorisieren, freigeben oder stoppen kann und die relevanten Business Outcomes verantwortet.',
  benefit:
    'Du richtest Value, Metrics und Zugang auf die tatsächlich relevante wirtschaftliche Entscheidung aus – statt auf Titel, Organigramm oder Bauchgefühl.',
  whyImportant: [
    'Fachliche Zustimmung ersetzt keine wirtschaftliche Freigabe.',
    'Der Economic Buyer priorisiert das Vorhaben gegenüber anderen Investitionen und Initiativen.',
    'Seine Sicht auf Nutzen, Risiko und Time-to-Value kann von der Fachabteilung deutlich abweichen.',
    'Direkter Austausch reduziert Fehlannahmen am stärksten; bis der Zugang hergestellt ist, helfen belastbar validierte Informationen bei Vorbereitung und Einordnung.',
  ],
  recognitionConceptIds: ['economic-authority', 'business-outcome', 'metrics-value', 'evidence'],
  misinterpretations: [
    {
      claim: '„Der höchste Titel muss der Economic Buyer sein.“',
      explanation:
        'Zu senior kann genauso falsch sein wie zu junior. Whyte beschreibt ausdrücklich den Fehler, automatisch den CEO zu nominieren, obwohl diese Person vom konkreten Decision Process zu weit entfernt sein kann.',
    },
    {
      claim: '„Wer das Budget besitzt, ist automatisch der Economic Buyer.“',
      explanation:
        'Ein Budget Holder kann an ein festes Budget gebunden sein. Wirtschaftliche Autorität zeigt sich eher daran, ob Prioritäten oder Mittel tatsächlich verändert und Entscheidungen gestoppt oder vorangetrieben werden können.',
    },
    {
      claim: '„Mein Champion entscheidet das.“',
      explanation:
        'Champion und Economic Buyer sind unterschiedliche Rollen. Ein Champion kann intern verkaufen und Zugang schaffen, ohne selbst die wirtschaftliche Letztentscheidung zu besitzen.',
    },
    {
      claim: '„Procurement ist der Economic Buyer.“',
      explanation:
        'Procurement verhandelt häufig Preis und Vertragsbedingungen im Auftrag der Organisation. Das macht den Einkauf nicht automatisch zur Instanz, die über die geschäftliche Investition entscheidet.',
    },
    {
      claim: '„Der fachliche Entscheider ist automatisch der wirtschaftliche Entscheider.“',
      explanation:
        'Fachliche oder technische Autorität kann von wirtschaftlicher Autorität getrennt sein. Bei komplexen Softwareentscheidungen müssen beide Perspektiven verstanden werden.',
    },
  ],
  discoveryQuestions: [
    'Wer kann die Investition am Ende noch stoppen, obwohl die übrigen Stakeholder zustimmen?',
    'Wer verantwortet den wirtschaftlichen Erfolg, den dieses Vorhaben verbessern soll?',
    'Nach welchen wirtschaftlichen Kriterien wird entschieden, ob dieses Vorhaben Priorität bekommt?',
    'Wer müsste vom Business Case überzeugt sein, damit die Investition tatsächlich freigegeben wird?',
    'Welche Kennzahl würde diese Person selbst als Beleg für einen erfolgreichen Business Outcome verwenden?',
    'Was müsste diese Person sehen oder verstehen, um das Vorhaben aktiv zu unterstützen?',
  ],
  withoutDirectAccess: [
    'Über den Champion klären, was der Economic Buyer erreichen will, welche Metrics zählen und welche Einwände wahrscheinlich sind.',
    'Den Nutzen eines EB-Termins begründen: Ziel ist nicht, den Champion zu umgehen, sondern wirtschaftliche Annahmen und Value direkt zu validieren.',
    'Eine kurze Executive Value Story vorbereiten, die Business Outcome, Metric und Why now verbindet.',
    'Parallel eine respektvolle eigene Zugangsstrategie prüfen, zum Beispiel Executive-to-Executive oder eine direkte, kontextreiche Ansprache.',
  ],
  authorPerspective: {
    whyte:
      'Whyte beschreibt den Economic Buyer meist als eine Person, lässt aber ausdrücklich zu, dass die Rolle gelegentlich aus mehreren Personen oder einem Gremium besteht.',
    lahoutifard:
      'Lahoutifard vertritt eine strengere Sicht: Auch wenn ein Executive Committee beteiligt ist, soll der Account Manager die Person mit dem letztlich entscheidenden Einfluss bzw. finalen Wort identifizieren.',
    practicalTakeaway:
      'Die Toolbox erzwingt deshalb keine starre Zählregel. Entscheidend ist, die tatsächliche wirtschaftliche Autorität im konkreten Buying Process zu verstehen und Unsicherheit sichtbar zu lassen, wenn sie noch nicht belastbar geklärt ist.',
  },
  sourceNotes: [
    'Andy Whyte → Economic Buyer: Identifying the Economic Buyer, Qualifying Criteria, Getting Engaged With the Economic Buyer, Talk in the Language of the Economic Buyer.',
    'Darius Lahoutifard → Chapter Four: Economic Buyer, How do you find the EB?, Operational vs. Functional Decision Maker, How about “Executive Committees”?, The Meeting with the Economic Buyer.',
  ],
}

function conceptChecklistItem(id: string, question: string, concept: MeddpiccConcept): ChecklistItem {
  return {
    id,
    question,
    meaning: concept.meaning,
    whyItMatters: concept.whyItMatters,
    signals: concept.signals,
    commonMisinterpretation: concept.commonMisinterpretation,
    possibleQuestionsOrActions: concept.possibleQuestionsOrActions,
    learnMore: concept.learnMore,
    relatedKnowledge: 'economic-buyer',
    sourceNote: concept.sourceNote,
  }
}

export const economicBuyerChecklist: ChecklistDefinition = {
  id: 'economic-buyer',
  eyebrow: 'Checklist · Economic Buyer',
  title: 'Economic Buyer: Wissen oder nur annehmen?',
  lead: 'Gehe die Punkte kurz durch, wenn du prüfen möchtest, ob du die wirtschaftliche Entscheidungsinstanz wirklich verstanden hast.',
  whenToUse:
    'Vor Deal Reviews, wichtigen Kundenterminen oder immer dann, wenn die Rolle des Economic Buyers bisher vor allem auf Titel, Budget oder Aussagen Dritter basiert.',
  benefit:
    'Du erkennst schneller, welche EB-Annahmen belastbar sind und an welcher Stelle noch eine konkrete Frage oder Validierung sinnvoll ist.',
  items: [
    conceptChecklistItem(
      'authority',
      'Weiß ich, wer die Investition tatsächlich genehmigen, priorisieren oder stoppen kann?',
      economicBuyerConcepts.authority,
    ),
    conceptChecklistItem(
      'business-outcome',
      'Verstehe ich, welches geschäftliche Ergebnis für diese Person oder Instanz relevant ist?',
      economicBuyerConcepts.businessOutcome,
    ),
    conceptChecklistItem(
      'metrics-value',
      'Kann ich den erwarteten Nutzen in einer für den Economic Buyer relevanten Form darstellen?',
      economicBuyerConcepts.metricsValue,
    ),
    conceptChecklistItem(
      'decision-criteria',
      'Weiß ich, nach welchen wirtschaftlichen und strategischen Kriterien entschieden wird?',
      economicBuyerConcepts.decisionCriteria,
    ),
    conceptChecklistItem(
      'access',
      'Habe ich direkten Zugang – und falls noch nicht, weiß ich belastbar, was dem Economic Buyer wichtig ist und wie ich Zugang herstellen kann?',
      economicBuyerConcepts.access,
    ),
    conceptChecklistItem(
      'commitment',
      'Weiß ich, welches konkrete Ergebnis oder Commitment ich vom Economic Buyer brauche?',
      economicBuyerConcepts.commitment,
    ),
    conceptChecklistItem(
      'evidence',
      'Worauf basiert meine Einschätzung, dass ich den Economic Buyer wirklich identifiziert habe?',
      economicBuyerConcepts.evidence,
    ),
  ],
  sourceNotes: economicBuyerKnowledge.sourceNotes,
}

const meetingItems: ChecklistItem[] = [
  {
    id: 'meeting-goal',
    question: 'Ist klar, was am Ende des Termins erreicht oder entschieden sein soll?',
    meaning:
      'Formuliere vor dem Gespräch ein konkretes Ziel: zum Beispiel wirtschaftliche Priorität validieren, ein Commitment erhalten, einen Entscheidungsweg bestätigen oder einen nächsten Schritt vereinbaren.',
    whyItMatters:
      'Ohne klares Ziel kann ein seltener Executive-Termin positiv wirken, ohne den Buying Process tatsächlich voranzubringen.',
    signals: [
      'Das gewünschte Ergebnis lässt sich in einem Satz formulieren.',
      'Der Erfolg des Gesprächs hängt nicht nur von „guter Stimmung“ ab.',
    ],
    commonMisinterpretation: '„Hauptsache, der Economic Buyer kennt uns danach.“',
    possibleQuestionsOrActions: [
      'Vor dem Termin notieren: Welche eine Veränderung soll nach diesem Gespräch erreicht sein?',
      'Das gewünschte Commitment so formulieren, dass es realistisch und konkret ist.',
    ],
    relatedKnowledge: 'economic-buyer',
    sourceNote: economicBuyerConcepts.commitment.sourceNote,
  },
  conceptChecklistItem(
    'business-pain-outcome',
    'Kann ich den relevanten Business Pain oder gewünschten Business Outcome aus Sicht des Economic Buyers erklären?',
    economicBuyerConcepts.businessOutcome,
  ),
  conceptChecklistItem(
    'meeting-metrics',
    'Habe ich belastbare Metrics, die den wirtschaftlichen Nutzen verständlich machen?',
    economicBuyerConcepts.metricsValue,
  ),
  {
    id: 'executive-value',
    question: 'Kann ich den Value in kurzer Executive-Sprache erklären, ohne in Produktdetails abzurutschen?',
    meaning:
      'Executive-Sprache verbindet das Vorhaben mit geschäftlichem Ergebnis, wirtschaftlicher Wirkung, Risiko und Zeit bis zum Nutzen. Produktdetails kommen nur dort hinein, wo sie für diese Entscheidung relevant sind.',
    whyItMatters:
      'Economic Buyer haben meist viele Initiativen gleichzeitig zu bewerten. Eine zu technische Darstellung erschwert die Einordnung des tatsächlichen Business Value.',
    signals: [
      'Die Kernbotschaft funktioniert ohne Feature-Liste.',
      'Business Outcome und wirtschaftliche Wirkung stehen vor Produktdetails.',
    ],
    commonMisinterpretation: '„Für einen Executive brauche ich einfach dieselbe Präsentation in kürzer.“',
    possibleQuestionsOrActions: [
      'Eine 30-Sekunden-Version vorbereiten: Problem → wirtschaftliche Wirkung → erwarteter Outcome.',
      'Alle Folien oder Argumente entfernen, die keinen Beitrag zur wirtschaftlichen Entscheidung leisten.',
    ],
    relatedKnowledge: 'economic-buyer',
    sourceNote: economicBuyerConcepts.businessOutcome.sourceNote,
  },
  {
    id: 'why-now',
    question: 'Kann ich erklären, warum das Unternehmen gerade jetzt handeln sollte?',
    meaning:
      'Why now verbindet Priorität mit Konsequenzen einer Verzögerung, Compelling Event oder wirtschaftlichem Verlust des Wartens.',
    whyItMatters:
      'Selbst ein überzeugender Business Case konkurriert mit anderen Initiativen. Ohne Dringlichkeit kann eine Investition leicht verschoben werden.',
    signals: [
      'Es gibt eine konkrete Konsequenz des Wartens.',
      'Zeitpunkt oder Dringlichkeit stammen nicht nur aus dem eigenen Forecast.',
    ],
    commonMisinterpretation: '„Unser Quartalsende ist ein überzeugendes Why now für den Kunden.“',
    possibleQuestionsOrActions: [
      'Welche geschäftliche Konsequenz hätte es, wenn das Vorhaben um ein Quartal verschoben wird?',
      'Welche Initiative, Frist oder Veränderung macht den Zeitpunkt für den Kunden relevant?',
    ],
    relatedKnowledge: 'economic-buyer',
    sourceNote: 'Lahoutifard → The Meeting with the Economic Buyer: Why buying anything? Why us? Why now?',
  },
  {
    id: 'core-questions',
    question:
      'Habe ich wenige Kernfragen vorbereitet, die ich nur vom Economic Buyer sinnvoll beantworten lassen kann?',
    meaning:
      'Nutze den Termin nicht nur zum Präsentieren. Bereite Fragen vor, die wirtschaftliche Ziele, Erfolgskriterien, Priorität, Entscheidungslogik oder Risiken direkt validieren.',
    whyItMatters:
      'Direkte Antworten reduzieren gefilterte Informationen und helfen, Annahmen aus Champion- oder anderen Stakeholder-Gesprächen zu prüfen.',
    signals: [
      'Die Fragen zielen auf Business Outcome, Metrics, Priorität oder wirtschaftliche Entscheidung.',
      'Es sind wenige hochwertige Fragen statt eines MEDDPICC-Verhörs.',
    ],
    commonMisinterpretation: '„Wenn ich den Economic Buyer treffe, muss ich möglichst viel präsentieren.“',
    possibleQuestionsOrActions: economicBuyerKnowledge.discoveryQuestions.slice(1, 5),
    relatedKnowledge: 'economic-buyer',
    sourceNote: 'Whyte → First Interaction Guidance: Ask Questions; Lahoutifard → The Meeting with the Economic Buyer.',
  },
  {
    id: 'objections',
    question: 'Habe ich mögliche wirtschaftliche oder strategische Bedenken vorab durchdacht?',
    meaning:
      'Economic Buyer bringen häufig Erfahrung aus früheren Investitionen mit und können Risiken sehen, die im Projektteam bisher kaum diskutiert wurden.',
    whyItMatters:
      'Früh angesprochene Bedenken lassen sich bearbeiten. Verdeckte Bedenken können später trotz positiver Fachentscheidung die Investition stoppen.',
    signals: [
      'Relevante Risiken oder Einwände sind als Hypothesen vorbereitet.',
      'Es gibt keine Absicht, kritische Themen im Termin bewusst zu vermeiden.',
    ],
    commonMisinterpretation:
      '„Wenn der Champion keine Einwände nennt, wird der Economic Buyer wahrscheinlich auch keine haben.“',
    possibleQuestionsOrActions: [
      'Welche vergleichbaren Investitionen sind in der Vergangenheit schwierig gelaufen und warum?',
      'Was bereitet Ihnen bei einem Vorhaben dieser Art am meisten Sorge?',
    ],
    relatedKnowledge: 'economic-buyer',
    sourceNote: 'Whyte → Hunt the Negatives with the Economic Buyer.',
  },
  conceptChecklistItem(
    'desired-commitment',
    'Weiß ich, welches konkrete Commitment ich am Ende des Gesprächs ansprechen möchte?',
    economicBuyerConcepts.commitment,
  ),
  {
    id: 'next-step',
    question: 'Ist ein sinnvoller nächster Schritt vorbereitet, den wir gemeinsam vereinbaren können?',
    meaning:
      'Ein Next Step macht das Meeting anschlussfähig. Er kann zum Beispiel ein weiterer Termin, eine Validierung, die Einbindung eines Stakeholders oder die Bestätigung des Decision Process sein.',
    whyItMatters:
      'Ohne klaren Anschluss bleibt der Termin isoliert und wichtige Erkenntnisse werden nicht in den Buying Process übersetzt.',
    signals: ['Der nächste Schritt hat einen klaren Zweck.', 'Wenn möglich sind Owner und Zeitpunkt direkt vereinbar.'],
    commonMisinterpretation: '„Wir schicken danach einfach Unterlagen und warten auf Rückmeldung.“',
    possibleQuestionsOrActions: [
      'Was wäre aus Ihrer Sicht der sinnvollste nächste Schritt nach unserem heutigen Gespräch?',
      'Wen sollten wir für diesen nächsten Schritt zusätzlich einbinden?',
    ],
    relatedKnowledge: 'economic-buyer',
    sourceNote: 'Whyte → Close Strong / Follow-Up; Lahoutifard → The Meeting with the Economic Buyer.',
  },
]

export const economicBuyerMeetingChecklist: ChecklistDefinition = {
  id: 'economic-buyer-meeting',
  eyebrow: 'Checklist · Economic-Buyer-Termin',
  title: 'Economic-Buyer-Termin in wenigen Minuten vorbereiten',
  lead: 'Nutze die Checklist unmittelbar vor dem Termin, um Value, Kernfragen, Commitment und den nächsten Schritt noch einmal fokussiert zu prüfen.',
  whenToUse:
    'Kurz vor einem geplanten Gespräch mit dem Economic Buyer oder einer wirtschaftlichen Entscheidungsinstanz.',
  benefit:
    'Du nutzt knappe Executive-Zeit gezielter und reduzierst das Risiko, mit zu viel Produktdetail und zu wenig Business-Relevanz in den Termin zu gehen.',
  items: meetingItems,
  sourceNotes: economicBuyerKnowledge.sourceNotes,
}

export const economicBuyerChecklists = {
  'economic-buyer': economicBuyerChecklist,
  'economic-buyer-meeting': economicBuyerMeetingChecklist,
} satisfies Record<string, ChecklistDefinition>
