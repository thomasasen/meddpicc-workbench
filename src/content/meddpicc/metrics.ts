import type { ChecklistDefinition, ChecklistItem, KnowledgeTopic, MeddpiccConcept } from './types'

export const metricsConcepts = {
  measurableOutcome: {
    id: 'measurable-outcome',
    meaning:
      'Eine Metric macht den erwarteten oder bereits erreichten Nutzen messbar. Aussagen wie „spart Zeit“, „verbessert Produktivität“ oder „reduziert Aufwand“ sind erst der Ausgangspunkt, solange Umfang und Veränderung nicht quantifiziert sind.',
    whyItMatters:
      'Ohne messbare Größen bleibt Value subjektiv. Quantifizierung macht den Nutzen vergleichbar, diskutierbar und für einen Business Case nutzbar.',
    signals: [
      'Die Aussage enthält eine nachvollziehbare Größe, Einheit oder Veränderung.',
      'Es ist klar, was konkret gemessen wird.',
      'Die Zahl beschreibt einen Business Outcome oder einen belastbaren Treiber davon.',
    ],
    commonMisinterpretation:
      '„Unsere Lösung spart viel Zeit“ oder „steigert die Produktivität“ sei bereits eine belastbare Metric.',
    possibleQuestionsOrActions: [
      'Wie viel Zeit geht heute dafür pro Person, Vorgang oder Monat verloren?',
      'Wie viele Vorgänge, Nutzer oder Fälle sind davon betroffen?',
      'Welche Veränderung wäre nach der Einführung realistisch messbar?',
    ],
    learnMore:
      'Eine Metric übersetzt qualitative Nutzenversprechen in quantifizierbaren Geschäftswert und verbindet die Wirkung mit nachvollziehbaren Zahlen.',
    sourceNote:
      'Whyte → Metrics: Definition / Metrics and Discovery; Lahoutifard → Chapter Three: What is a Metric? / How to Collect Data.',
  },
  baselineTarget: {
    id: 'baseline-target',
    meaning:
      'Eine belastbare Metric braucht einen Bezugspunkt: Wie sieht der heutige Zustand aus und welche messbare Veränderung soll im zukünftigen Zustand eintreten?',
    whyItMatters:
      'Ohne Baseline lässt sich die behauptete Verbesserung kaum überprüfen. Erst der Vergleich von Before-State und After-State macht die Veränderung nachvollziehbar.',
    signals: [
      'Der aktuelle Zustand ist mit einer Zahl oder belastbaren Bandbreite beschrieben.',
      'Der gewünschte oder erwartete zukünftige Zustand ist ebenfalls konkret.',
      'Die Differenz zwischen beiden Zuständen lässt sich erklären.',
    ],
    commonMisinterpretation:
      '„20 % schneller“ sei ausreichend, obwohl unklar ist, 20 % wovon und gegenüber welchem Ausgangswert.',
    possibleQuestionsOrActions: [
      'Wie sieht der heutige Wert aus?',
      'Welchen Zielwert möchten Sie erreichen?',
      'Woran würden Sie nach der Einführung erkennen, dass sich der Zustand tatsächlich verbessert hat?',
    ],
    learnMore:
      'Der Before-/After-Vergleich macht sichtbar, wie weit der heutige Zustand vom angestrebten Ziel entfernt ist. Den Wert leitest du vom Kundenziel rückwärts ab.',
    sourceNote:
      'Whyte → Metrics: working backwards from customer goals; Lahoutifard → Chapter Three: Result of an “After-State” Comparison.',
  },
  economicImpact: {
    id: 'economic-impact',
    meaning:
      'Die Metric sollte zeigen, welche geschäftliche Wirkung die Veränderung erzeugt. Typische Wirkungsrichtungen sind mehr Umsatz, geringere Kosten oder reduziertes Risiko.',
    whyItMatters:
      'Eine operative Kennzahl wird für die Investitionsentscheidung erst dann stark, wenn klar ist, warum sie wirtschaftlich relevant ist.',
    signals: [
      'Die operative Veränderung lässt sich mit Umsatz, Kosten oder Risiko verbinden.',
      'Die Rechenlogik und Annahmen sind nachvollziehbar.',
      'Der wirtschaftliche Effekt passt zu einem relevanten Business Outcome des Kunden.',
    ],
    commonMisinterpretation:
      'Jede Produkt- oder Nutzungskennzahl sei automatisch eine wirtschaftlich relevante MEDDPICC-Metric.',
    possibleQuestionsOrActions: [
      'Was bedeutet diese Veränderung wirtschaftlich für Ihr Unternehmen?',
      'Entsteht der Wert primär durch zusätzlichen Umsatz, geringere Kosten oder weniger Risiko?',
      'Welche Annahmen müssen wir gemeinsam bestätigen, bevor wir daraus einen Business Impact ableiten?',
    ],
    learnMore:
      'Wirtschaftlicher Impact zeigt sich etwa in zusätzlichem Umsatz, niedrigeren Kosten oder reduziertem Risiko. Er ist mehr als eine technische Produkt-KPI.',
    sourceNote: 'Whyte → Metrics 2 (M2) / Summary of Metrics; Lahoutifard → Metrics and the Economic Impact.',
  },
  proofToCustomerMetric: {
    id: 'proof-to-customer-metric',
    meaning:
      'Referenzwerte bestehender Kunden sind wertvolle Proof Points, aber noch keine kundenspezifische Metric. Sie dienen als Hypothese und Gesprächseinstieg, bis der Zielkunde seinen eigenen Ausgangswert, Nutzen und erwartete Verbesserung validiert hat.',
    whyItMatters:
      'Wer Referenzwerte ungeprüft auf einen neuen Kunden überträgt, verwechselt Glaubwürdigkeit mit Evidenz für den konkreten Business Case.',
    signals: [
      'Referenzwerte werden klar als Proof Point und nicht als Versprechen dargestellt.',
      'Die kundenspezifische Metric basiert auf dessen eigenen Daten oder gemeinsam bestätigten Annahmen.',
      'Abweichungen zwischen Referenzkunde und aktuellem Kunden werden berücksichtigt.',
    ],
    commonMisinterpretation:
      '„Bei Kunde A haben wir 30 % erreicht, also können wir beim aktuellen Kunden mit denselben 30 % rechnen.“',
    possibleQuestionsOrActions: [
      'Welche dieser Referenzwirkungen ist für Ihre Situation überhaupt vergleichbar?',
      'Welche eigenen Ausgangsdaten können wir verwenden, statt den Referenzwert einfach zu übertragen?',
      'Welche Verbesserung würden Sie selbst für realistisch und relevant halten?',
    ],
    learnMore:
      'M1-Proof-Points stammen aus bestehenden Kundenprojekten. M2-Metrics bzw. der kundenspezifische ROI werden dagegen mit dem aktuellen Kunden aus dessen Zahlen und Situation entwickelt.',
    sourceNote: 'Whyte → Metrics 1 (M1) / Metrics 2 (M2); Lahoutifard → Sources of Metrics.',
  },
  customerValidation: {
    id: 'customer-validation',
    meaning:
      'Eine Metric wird belastbarer, wenn der Kunde die verwendeten Zahlen, Annahmen und die Bedeutung der Kennzahl mitträgt. Besonders wichtig ist die Unterstützung durch den Champion und später durch relevante Entscheider.',
    whyItMatters:
      'Seller-eigene Berechnungen wirken schnell wie Marketing. Kundenseitige Autorenschaft oder Bestätigung erhöht Glaubwürdigkeit und macht die Metric intern anschlussfähig.',
    signals: [
      'Die wesentlichen Eingangsgrößen stammen vom Kunden oder wurden mit ihm bestätigt.',
      'Der Champion kann die Rechenlogik selbst erklären.',
      'Die Metric hält auch kritischen Rückfragen anderer Stakeholder stand.',
    ],
    commonMisinterpretation: '„Wenn die Excel-Rechnung mathematisch stimmt, ist die Metric automatisch validiert.“',
    possibleQuestionsOrActions: [
      'Welche Eingangsgrößen würden Sie selbst für diese Rechnung verwenden?',
      'Welche Annahme würden Sie intern am ehesten hinterfragen?',
      'Könnten Sie diese Metric Ihrem Economic Buyer mit denselben Zahlen erklären?',
    ],
    learnMore:
      'Validiere die Metric möglichst früh mit dem Champion und hole im weiteren Verlauf Zustimmung relevanter Stakeholder ein. Kundenseitige Mitwirkung schafft Glaubwürdigkeit.',
    sourceNote:
      'Whyte → Metrics and Your Sales Process: Early/Mid/Late Consensus; Lahoutifard → Chapter Three: Champion Supported and/or Authored.',
  },
  clarity: {
    id: 'metric-clarity',
    meaning:
      'Eine starke Metric ist für unterschiedliche Stakeholder leicht verständlich. Sie erklärt in einfacher Sprache, was sich verändert und warum diese Veränderung wichtig ist.',
    whyItMatters:
      'Eine komplizierte Kennzahl verliert Wirkung, wenn nur der Seller oder ein Spezialist sie versteht. Metrics müssen insbesondere für Champion und Economic Buyer erzählbar bleiben.',
    signals: [
      'Die Metric lässt sich in einem oder zwei Sätzen erklären.',
      'Fachbegriffe und Rechenschritte sind auf das notwendige Maß reduziert.',
      'Die Bedeutung für den jeweiligen Stakeholder ist sofort erkennbar.',
    ],
    commonMisinterpretation:
      'Je komplexer die Berechnung und je mehr Kennzahlen enthalten sind, desto professioneller wirke der Business Case.',
    possibleQuestionsOrActions: [
      'Wie würden Sie diese Metric intern in einem Satz erklären?',
      'Welche Zahl ist für die Entscheidung wirklich wesentlich?',
      'Versteht ein Executive die wirtschaftliche Aussage ohne Produktdetail?',
    ],
    learnMore:
      'Erkläre die wirtschaftliche Aussage in verständlichen Worten und anhand eines greifbaren Beispiels, damit unterschiedliche Stakeholder sie selbst weitergeben können.',
    sourceNote:
      'Whyte → Metrics and Clarity / Metrics and Storytelling; Lahoutifard → Chapter Three: Everyday Language / Tells a Story.',
  },
  urgency: {
    id: 'metric-urgency',
    meaning:
      'Metrics können sichtbar machen, was eine Verzögerung wirtschaftlich bedeutet und damit ein kundenseitiges Why now stützen. Die Dringlichkeit muss aus der Kundensituation kommen, nicht aus dem Forecast des Sellers.',
    whyItMatters:
      'Ein positiver Business Case konkurriert weiterhin mit anderen Initiativen. Quantifizierter Nutzen oder Verlust durch Warten kann Priorität nachvollziehbarer machen.',
    signals: [
      'Es ist klar, welcher Nutzen später eintritt oder welcher Wert bei Verzögerung verloren geht.',
      'Der Zeitraum stammt aus einem realen Kundenkontext.',
      'Die Aussage ist mit derselben Sorgfalt validiert wie die übrigen Metrics.',
    ],
    commonMisinterpretation:
      'Eine hochgerechnete Zahl zum „Verlust pro Woche“ dürfe ohne Kundenvalidierung als Druckmittel verwendet werden.',
    possibleQuestionsOrActions: [
      'Was verändert sich wirtschaftlich, wenn das Vorhaben um einen Monat oder ein Quartal später startet?',
      'Welcher Teil des Nutzens ist tatsächlich zeitabhängig?',
      'Welche zeitliche Konsequenz würde der Kunde selbst intern vertreten?',
    ],
    learnMore:
      'Nutze validierte Metrics, um ein echtes „Why now?“ sichtbar zu machen. Ungeprüfte Nutzenrechnungen sollten nicht erst während der Beschaffung als Druckmittel auftauchen.',
    sourceNote:
      'Whyte → Metrics and Urgency / Metrics and Procurement; Lahoutifard → Chapter Three: Metrics and the Economic Impact.',
  },
} satisfies Record<string, MeddpiccConcept>

export const metricsKnowledge: KnowledgeTopic = {
  id: 'metrics',
  eyebrow: 'Wissen · Metrics',
  title: 'Metrics: aus Nutzen belastbaren Business Impact machen',
  lead: 'Verstehe, wann eine Kennzahl wirklich eine MEDDPICC-Metric ist, wie du vom Pain zur Quantifizierung kommst und wo Referenzwerte noch keine Kundenevidenz sind.',
  shortDefinition:
    'Metrics sind quantifizierbare Maße des geschäftlichen Werts, den eine Lösung bereits erzeugt hat oder für den Kunden erzeugen soll. Eine belastbare Metric verbindet einen messbaren Before-/After-Unterschied mit einem relevanten Business Outcome und nachvollziehbaren Annahmen.',
  benefit:
    'Du kannst qualitative Nutzenversprechen in belastbare, kundenseitig verständliche Zahlen übersetzen und erkennst schneller, welche Werte noch Hypothese statt Evidenz sind.',
  whyImportant: [
    'Metrics machen subjektiven Nutzen messbar und damit entscheidungsfähig.',
    'Sie verbinden Pain und gewünschte Outcomes mit wirtschaftlichem Impact.',
    'Sie helfen, Value gegenüber Champion, Economic Buyer und weiteren Stakeholdern konsistent zu erklären.',
    'Sie liefern wichtige Bausteine für ROI, Business Case und ein belastbares Why now.',
  ],
  recognitionConceptIds: ['measurable-outcome', 'baseline-target', 'economic-impact', 'customer-validation'],
  misinterpretations: [
    {
      claim: '„Zeit sparen“ ist bereits eine Metric.',
      explanation:
        'Das ist zunächst ein qualitativer Nutzen. Erst wenn Umfang, Einheit, Ausgangszustand und erwartete Veränderung quantifiziert sind, entsteht eine belastbare Metric.',
    },
    {
      claim: '„Unser Referenzkunde hat 30 % erreicht – also ist 30 % unsere Metric für diesen Deal.“',
      explanation:
        'M1-Proof-Points schaffen Glaubwürdigkeit und Arbeitshypothesen. Die kundenspezifische M2 muss aus der Situation des aktuellen Kunden erarbeitet und validiert werden.',
    },
    {
      claim: '„Eine Produkt-KPI ist automatisch eine MEDDPICC-Metric.“',
      explanation:
        'Eine technische oder operative Kennzahl kann ein Treiber sein. Entscheidend ist, ob ihr Bezug zum relevanten Business Outcome und wirtschaftlichen Impact nachvollziehbar ist.',
    },
    {
      claim: '„ROI und Metric sind dasselbe.“',
      explanation:
        'Einzelne Kennzahlen und ein vollständiger Return on Investment (ROI) sind nicht automatisch identisch. M2 beschreibt den kundenspezifischen ROI-Bezug. Ob eine einzelne Metric bereits einen ROI abbildet, hängt von Inhalt und Rechenlogik ab.',
    },
    {
      claim: '„Wenn meine Rechnung korrekt ist, braucht der Kunde sie nur noch abzunicken.“',
      explanation:
        'Die Mathematik kann stimmen und die Annahmen trotzdem falsch sein. Belastbarkeit entsteht, wenn der Kunde die Eingangsgrößen, Rechenlogik und Relevanz mitträgt.',
    },
  ],
  discoveryQuestions: [
    'Was kostet oder verhindert der heutige Zustand konkret?',
    'Wie häufig tritt das Problem auf und wie viele Personen, Vorgänge oder Kunden sind betroffen?',
    'Wie sieht der aktuelle Wert heute aus?',
    'Welche messbare Verbesserung wäre für Sie realistisch und relevant?',
    'Was bedeutet diese Verbesserung wirtschaftlich in Umsatz, Kosten oder Risiko?',
    'Welche Annahmen dieser Rechnung können Sie intern bestätigen – und welche müssten wir noch validieren?',
  ],
  withoutDirectAccess: [],
  practiceActions: [
    'Mit dem Pain beginnen: Was passiert heute und warum ist das relevant?',
    'Den heutigen Zustand quantifizieren: Menge × Häufigkeit × Zeit/Kosten bzw. eine andere passende Baseline.',
    'Den gewünschten After-State gemeinsam definieren und die Differenz sichtbar machen.',
    'Die Veränderung mit einem Business Outcome und wirtschaftlichem Impact verbinden.',
    'Annahmen mit Champion und relevanten Stakeholdern validieren und die Metric im Sales Cycle weiter schärfen.',
  ],
  authorPerspective: {
    whyte:
      'Whyte trennt M1-Proof-Points aus bestehenden Kundenbeispielen von M2-Metrics, die im konkreten Deal gemeinsam mit dem Kunden entwickelt werden. Er betont Discovery, Consensus, Klarheit und die Weiterentwicklung der Metrics über den gesamten Sales Cycle.',
    lahoutifard:
      'Lahoutifard beschreibt gute Metrics über Messbarkeit, einfache Sprache, Story, Before-/After-Vergleich, Economic Impact und Champion-Support. Zusätzlich strukturiert er wirtschaftliche Wirkung über Revenue, Cost und Risk.',
    practicalTakeaway:
      'Nutze Referenzwerte, um eine plausible Value-Hypothese zu eröffnen. Behandle sie aber nicht als Kundenevidenz. Die starke Deal-Metric entsteht aus kundenspezifischer Baseline, gewünschter Veränderung, wirtschaftlicher Wirkung und validierten Annahmen.',
  },
  sourceNotes: [
    'Andy Whyte → Metrics: Metrics 1 (M1), Metrics 2 (M2), Metrics and Discovery, Metrics and Clarity, Metrics and Urgency, Metrics and Your Sales Process.',
    'Darius Lahoutifard → Chapter Three: Metrics, What is a Metric?, How to Collect Data, Sources of Metrics, Metrics and the Economic Impact, Where to Look for Metrics.',
    'Darius Lahoutifard → Chapter Nine: The ROI Pitch – Metrics as foundation for ROI and economic value.',
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
    relatedKnowledge: 'metrics',
    sourceNote: concept.sourceNote,
  }
}

export const metricsChecklist: ChecklistDefinition = {
  id: 'metrics',
  eyebrow: 'Checklist · Metrics',
  title: 'Metrics: belastbar oder nur gut klingende Zahl?',
  lead: 'Prüfe in wenigen Minuten, ob deine Metric wirklich messbar, kundenspezifisch, wirtschaftlich relevant und validiert ist.',
  whenToUse:
    'Nach Discovery, vor einem Business-Case- oder Economic-Buyer-Termin sowie immer dann, wenn eine Nutzenzahl im Deal wichtig wird.',
  benefit:
    'Du erkennst schneller, ob du bereits eine belastbare Metric hast oder nur eine plausible Hypothese, einen Referenzwert oder eine unvalidierte Seller-Rechnung.',
  items: [
    conceptChecklistItem(
      'measurable',
      'Ist der Nutzen konkret messbar statt nur qualitativ beschrieben?',
      metricsConcepts.measurableOutcome,
    ),
    conceptChecklistItem(
      'baseline-target',
      'Kenne ich den heutigen Ausgangswert und den gewünschten zukünftigen Zustand?',
      metricsConcepts.baselineTarget,
    ),
    conceptChecklistItem(
      'economic-impact',
      'Kann ich die Veränderung mit einem relevanten wirtschaftlichen Impact verbinden?',
      metricsConcepts.economicImpact,
    ),
    conceptChecklistItem(
      'customer-specific',
      'Ist die Zahl kundenspezifisch – oder übertrage ich nur einen Proof Point aus einem anderen Kunden?',
      metricsConcepts.proofToCustomerMetric,
    ),
    conceptChecklistItem(
      'validated',
      'Sind Eingangsgrößen, Annahmen und Rechenlogik vom Kunden ausreichend validiert?',
      metricsConcepts.customerValidation,
    ),
    conceptChecklistItem(
      'clear',
      'Ist die Metric so klar, dass Champion und Economic Buyer sie selbst erklären können?',
      metricsConcepts.clarity,
    ),
    conceptChecklistItem(
      'urgency',
      'Stützt die Metric ein echtes kundenseitiges Why now, ohne künstlichen Druck zu erzeugen?',
      metricsConcepts.urgency,
    ),
  ],
  sourceNotes: metricsKnowledge.sourceNotes,
}

export const metricsChecklists = {
  metrics: metricsChecklist,
} satisfies Record<string, ChecklistDefinition>
