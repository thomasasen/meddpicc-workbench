import type { ChecklistDefinition, ChecklistItem } from './types'

export const paperProcessKnowledge = {
  title: 'Paper Process: den Weg bis zur Unterschrift verstehen',
  lead: 'Fachlich ausgewählt heißt noch nicht bestellt. Kläre, welche kundenseitigen Schritte, Personen und Fristen tatsächlich zwischen Auswahl und Auftrag liegen.',
  shortDefinition:
    'Paper Process ist der kundenabhängige administrative und vertragliche Weg von einer beabsichtigten Beauftragung bis zur erforderlichen Bestellung beziehungsweise Unterzeichnung. Die Schritte unterscheiden sich je Unternehmen und können teilweise vor der Auswahl beginnen.',
  benefit:
    'Du erkennst fehlende Freigaben, nicht verfügbare Unterschriftsberechtigte und unrealistische Abschlussdaten, bevor sie deinen Forecast oder Go-Live gefährden.',
  whyImportant: [
    'Eine fachliche Auswahl ist noch keine kaufmännische Freigabe und kein unterschriebener Vertrag.',
    'Procurement, Legal oder andere zuständige Stellen können zusätzliche Schritte und Wartezeiten auslösen.',
    'Ein vom Kunden bestätigter Ablauf ist belastbarer als die Einschätzung des Projektleiters oder dein eigener Sales-Funnel.',
  ],
  distinctions: [
    {
      title: 'Decision Process',
      definition: 'Wie fällt der Kunde seine Auswahl- und Investitionsentscheidung?',
      example: 'Das Steering Committee entscheidet nach der Validierung über das CRM-Projekt.',
    },
    {
      title: 'Business Approval',
      definition: 'Wer genehmigt Nutzen, Finanzierung und kaufmännische Bedingungen?',
      example:
        'Eine zuständige Führungskraft oder ein Gremium gibt die Investition frei. Freigabe und Vertragsprüfung können sich überschneiden.',
    },
    {
      title: 'Paper Process',
      definition: 'Wie wird aus der beabsichtigten Beauftragung eine formale Bestellung oder Unterschrift?',
      example:
        'Der kundenspezifische Bestell- und Vertragsweg wird mit Einkauf, Legal und den weiteren beteiligten Stellen geklärt.',
    },
  ],
  dimensions: [
    {
      title: 'Prozess',
      meaning:
        'Welche Schritte und Dokumente sind hier tatsächlich notwendig? Was muss vorher abgeschlossen sein, was darf parallel laufen?',
      question: 'Was passiert nach der Auswahl bis zur Bestellung – und was passiert danach noch?',
    },
    {
      title: 'Personen',
      meaning:
        'Wer verantwortet, prüft und genehmigt jeden Schritt? Wer darf unterschreiben und wer vertritt die Person bei Abwesenheit?',
      question: 'Mit wem können wir die einzelnen Stationen unmittelbar gegenprüfen?',
    },
    {
      title: 'Timing',
      meaning:
        'Welche Bearbeitungszeiten, Sitzungsrhythmen, Abwesenheiten und Rückläufe wurden kundenseitig bestätigt?',
      question: 'Wie lange dauert das in einem vergleichbaren Einkaufsvorgang tatsächlich?',
    },
  ],
  examples: [
    {
      title: 'Einkauf und Lieferantenanlage',
      detail:
        'Falls erforderlich: Lieferantenregistrierung, Konditionenklärung oder Beschaffungsfreigabe. Nicht jeder Kunde nutzt denselben Einkaufspfad.',
      owner: 'Procurement oder die konkret zuständige Einkaufsstelle',
    },
    {
      title: 'Vertrag und Dokumente',
      detail:
        'Je nach Deal beispielsweise Vertragsentwurf, Rahmenvertrag (MSA), Leistungsbeschreibung (SOW) oder Vereinbarung zur Auftragsverarbeitung (AVV).',
      owner: 'Legal, Vertragsverantwortliche und gegebenenfalls Datenschutz',
    },
    {
      title: 'Security und Datenschutz',
      detail:
        'Falls relevant: Fragebögen, Prüfberichte, AVV und weitere interne Freigaben. Einzelne Prüfungen lassen sich möglicherweise frühzeitig starten.',
      owner: 'IT-Security und Datenschutzverantwortliche',
    },
    {
      title: 'Budget, Bestellung, Unterschrift',
      detail:
        'Kläre, ob Budgetbestätigung, Bestellnummer (PO) und Signatur notwendig sind und welcher Schritt wovon abhängt. Kein universeller Ablauf.',
      owner: 'Budgetverantwortliche, Einkauf und zeichnungsbefugte Person',
    },
  ],
  planning: [
    'Vom benötigten Go-Live-Termin ausgehen und zuerst die reale Implementierungsdauer samt kundenseitigen Vorleistungen klären.',
    'Den spätesten Vertrags- beziehungsweise Bestelltermin daraus ableiten, nicht aus dem Verkäufer-Quartalsende.',
    'Bearbeitungsdauern, Freigaben, Abwesenheiten und echte Abhängigkeiten mit den zuständigen Stellen prüfen.',
    'Unabhängige Prüfungen wie Legal oder Security nur dann parallelisieren, wenn die kundenseitigen Regeln das erlauben.',
    'Nach neuen Unterlagen, geänderten Preisen oder Stakeholderwechseln den Plan erneut bestätigen lassen.',
  ],
  scenario: {
    situation:
      'Ein Unternehmen wählt nach einem erfolgreichen CRM-POC einen SaaS-Anbieter aus. Der Projektleiter kündigt die Bestellung für den Monatsabschluss an. Einkauf und Legal waren bisher nicht beteiligt; der Go-Live soll acht Wochen später stattfinden.',
    evidence:
      'Belegt ist die fachliche Auswahl, sofern das zuständige Gremium sie bestätigt hat. Noch offen sind der echte Einkaufsweg, Vertragsprüfung, eine mögliche AVV-/Security-Prüfung, zeichnungsberechtigte Personen, Bearbeitungszeiten und die Implementierungsdauer.',
    nextAction:
      'Mit dem Champion einen Termin mit Einkauf und den relevanten Prüfstellen organisieren. Verantwortliche, Nachweise, Abhängigkeiten und realistische Termine direkt abgleichen. Go-Live rückwärts neu planen und den Abschluss nicht als sicher forecasten.',
  },
  redFlags: [
    {
      claim: '„Wir haben den Zuschlag, der Auftrag ist sicher.“',
      explanation:
        'Eine fachliche Auswahl ist keine endgültige kaufmännische Genehmigung und kein wirksamer Vertrag. Welche Schritte fehlen, ist zunächst offen.',
    },
    {
      claim: '„Unser Champion sagt, das sei alles geregelt.“',
      explanation:
        'Ein Champion hilft beim Zugang und bei Eskalationen, kennt die administrativen Details aber möglicherweise nicht. Die zuständigen Stellen müssen den Ablauf bestätigen.',
    },
    {
      claim: '„Wir schicken Legal die Unterlagen erst nach dem Steering Committee.“',
      explanation:
        'Manche Prüfungen können früher beginnen. Prüfe Zulässigkeit und Abhängigkeiten, statt pauschal zu warten oder eine Freigabe zu umgehen.',
    },
    {
      claim: '„Das dauert bei Kunden dieser Größe immer zwei Wochen.“',
      explanation:
        'Erfahrungswerte ersetzen keine Auskunft über das konkrete Kundenverfahren, tatsächliche Bearbeitungszeiten und die Verfügbarkeit der Beteiligten.',
    },
    {
      claim: '„Die Präsentation ist fertig; damit ist der nächste Meilenstein erreicht.“',
      explanation:
        'Eine Verkäuferaktivität beweist keinen Fortschritt beim Käufer. Erforderlich ist das nachweisbare Ergebnis des kundenseitigen Schritts.',
    },
    {
      claim: '„Unser Quartalsende ist die harte Deadline des Kunden.“',
      explanation:
        'Der Verkäufertermin ist kein kundenseitiger Compelling Event. Für einen realistischen Go-Live müssen der Kundendruck und die Umsetzungsschritte getrennt geklärt sein.',
    },
  ],
  discoveryQuestions: [
    'Angenommen, die Auswahl wird bestätigt: Was genau passiert danach bis zur Bestellung?',
    'Wer aus Ihrem Einkauf kennt diesen Weg im Detail und könnte ihn kurz mit uns durchgehen?',
    'Welche Vertragsteile oder Nachweise sollten Legal und Security schon jetzt sehen?',
    'Wer bestätigt die Mittel, wer löst die Bestellung aus und wer darf unterschreiben?',
    'Wann sind die zuständigen Personen verfügbar und wie lange brauchen die einzelnen Prüfungen erfahrungsgemäß?',
    'Wo hängt ein Schritt zwingend vom vorherigen ab, und was könnten wir parallel vorbereiten?',
    'Woran erkennen wir gemeinsam, dass die jeweilige Kundengenehmigung tatsächlich vorliegt?',
    'Welche Folgen hat es für Ihren Go-Live, wenn die Bestellung vier Wochen später erfolgt?',
  ],
  practiceActions: [
    'Den Prozess mit dem Champion zunächst skizzieren und explizite Lücken markieren.',
    'Procurement, Legal, Datenschutz und Security nur dort einbeziehen, wo der konkrete Kundenvorgang dies erfordert.',
    'Pro Schritt zuständige Person, notwendiges Ergebnis und erwartete Dauer direkt gegenprüfen.',
    'Die Zeichnungsbefugnis und eine mögliche Vertretung bestätigen lassen.',
    'Seller-Artefakte von Kundenhandlungen trennen und nur bestätigte Käuferereignisse als Fortschritt behandeln.',
    'Die kritischen Abhängigkeiten im gemeinsamen Go-Live-Plan prüfen und bei Änderungen erneut abstimmen.',
  ],
  practicalTakeaway:
    'Der nächste sinnvolle Schritt ist nicht noch ein Sales-Meeting, sondern die Bestätigung der tatsächlich fehlenden Kundenstation mit der jeweils zuständigen Person.',
  perspectives: [
    {
      author: 'Andy Whyte',
      source:
        'MEDDICC → PAPER PROCESS: You Need Your Champion; The 3 Key Elements of any Paper Process; Paper Process and Go-Live Plan; Paper Process and your Sales Process.',
      summary:
        'Eigenes MEDDPICC-Element mit den Achsen Prozess, Personen und Timing. Champion und gemeinsame Go-Live-Planung helfen, Abhängigkeiten, Vertretungen und Laufzeiten bis zur Signatur zu prüfen.',
    },
    {
      author: 'Darius Lahoutifard',
      source: 'Always Be Qualifying → Chapter Six – Decision & Paper Process → Paper Process; Compelling Event.',
      summary:
        'Formal-administrativer Teil des weiter gefassten Decision Process mit Bezug zum finanziellen, rechtlichen und kommerziellen Approval. Durch wiederholtes Nachfragen wird die gesamte Kette bis zur Bestellung sichtbar; unabhängige Schritte lassen sich gegebenenfalls vorziehen.',
    },
  ],
  sourceNotes: [
    'Beide Autoren: Paper Process erfordert konkrete Kenntnis der kundenseitigen Schritte; die fachliche Auswahl allein schließt den Kauf nicht ab.',
    'Warum MSA/SOW, AVV, PO oder Lieferantenanlage vorkommen können: konkrete B2B-SaaS-Praxisbeispiele; nicht durch beide Primärquellen als universell verpflichtende Stationen belegt.',
    'Keine Rechtsberatung: welche Unterschrift oder Vertragsform im Einzelfall rechtlich wirksam ist, muss vom zuständigen Kunden-/Rechtsteam geklärt werden.',
  ],
} as const

const paperProcessItems: ChecklistItem[] = [
  {
    id: 'customer-chain',
    question: 'Ist der kundenseitige Weg von der Auswahl bis zur Bestellung wirklich bekannt?',
    meaning:
      'Rekonstruiere den tatsächlichen administrativen Prozess bis zum Abschluss. Unbekannte Schritte bleiben offen, auch wenn du bevorzugter Anbieter bist.',
    whyItMatters: 'Der Verkäufer-Funnel ersetzt keine kundenseitige Beschaffungslogik.',
    signals: [
      'Kunde beschreibt alle bekannten Stationen samt Abschlusskriterium.',
      'Offene Schritte werden als offene Fragen sichtbar.',
    ],
    commonMisinterpretation: 'Der Zuschlag sei bereits eine verbindliche Kaufzusage.',
    possibleQuestionsOrActions: [
      'Was passiert danach, und was danach?',
      'Wer bestätigt die vollständige Prozesskette?',
    ],
    relatedKnowledge: 'paper-process',
    sourceNote: 'Whyte → PAPER PROCESS: The Process; Lahoutifard → Chapter Six: Paper Process.',
  },
  {
    id: 'stakeholders',
    question: 'Sind für jeden relevanten Schritt zuständige Personen und Vertretungen benannt?',
    meaning:
      'Ermittle die fachlich zuständigen Verantwortlichen, Entscheider und eine mögliche Vertretung bei Abwesenheit.',
    whyItMatters: 'Ohne tatsächliche Zuständigkeit wird ein Termin schnell zu einer bloßen Erwartung.',
    signals: ['Verantwortliche Person je Station bekannt.', 'Verfügbarkeit und gegebenenfalls Vertretung abgeklärt.'],
    commonMisinterpretation: 'Der Champion kenne alle Rollen und könne sie selbst ersetzen.',
    possibleQuestionsOrActions: [
      'Wer ist bei Einkauf und Legal verantwortlich?',
      'Wer springt bei Urlaub oder Krankheit ein?',
    ],
    relatedKnowledge: 'paper-process',
    sourceNote: 'Whyte → PAPER PROCESS: The People; You Need Your Champion.',
  },
  {
    id: 'procurement',
    question: 'Ist geklärt, ob Einkauf oder Lieferantenanlage einbezogen werden müssen?',
    meaning:
      'Prüfe die tatsächlichen Beschaffungsvorgaben des Kunden. Eine Lieferantenanlage kann erforderlich sein, muss es aber nicht.',
    whyItMatters: 'Ein unbekannter Einkaufsschritt kann die Bestellung verzögern, auch nach der Auswahl.',
    signals: [
      'Einkauf bestätigt seinen konkreten Ablauf oder die Nichtzuständigkeit.',
      'Benötigte Unterlagen sind identifiziert.',
    ],
    commonMisinterpretation: 'Jeder Deal durchlaufe dieselbe starre Einkaufskette.',
    possibleQuestionsOrActions: [
      'Wie lösen Sie bei vergleichbaren SaaS-Projekten Bestellungen aus?',
      'Brauchen Sie eine neue Lieferantenanlage?',
    ],
    relatedKnowledge: 'paper-process',
    sourceNote:
      'Lahoutifard → Chapter Six: Paper Process (Procurement); Praxisbeispiel Lieferantenanlage: nicht durch Primärquellen belegt.',
  },
  {
    id: 'contract',
    question: 'Sind Vertragsprüfung, Unterlagen und mögliche Verhandlungspunkte geklärt?',
    meaning:
      'Erfrage, ob Legal eingebunden ist und welche Unterlagen der konkrete Deal benötigt, beispielsweise MSA oder SOW.',
    whyItMatters: 'Unbekannte Vertragsklauseln können einen scheinbar fertigen Abschluss blockieren.',
    signals: ['Zuständiges Legal-Team und Dokumentenstand bestätigt.', 'Offene Vertragsfragen und Rückläufe benannt.'],
    commonMisinterpretation: 'Ein verschickter Vertragsentwurf bedeute bereits rechtliche Freigabe.',
    possibleQuestionsOrActions: [
      'Welche Vertragsfassung prüfen Sie?',
      'Können wir kritische Klauseln vorab gemeinsam identifizieren?',
    ],
    relatedKnowledge: 'paper-process',
    sourceNote: 'Whyte → PAPER PROCESS: Early-Stages; Lahoutifard → Chapter Six: Paper Process (Legal).',
  },
  {
    id: 'data-security',
    question: 'Sind Datenschutz- und Security-Prüfungen dort eingeplant, wo sie nötig sind?',
    meaning:
      'Prüfe, ob dieser SaaS-Kauf eine AVV, Security-Prüfung oder weitere Nachweise auslöst. Nicht jede Organisation verlangt dieselben Schritte.',
    whyItMatters: 'Solche Prüfungen können auf dem kritischen Pfad liegen oder möglicherweise früher stattfinden.',
    signals: [
      'Zuständige Stellen bestätigen Bedarf und Status.',
      'Unabhängige Prüfungen werden nur zulässig parallel geplant.',
    ],
    commonMisinterpretation:
      'Security und Datenschutz seien in jedem Deal Pflicht und immer erst nach der Auswahl dran.',
    possibleQuestionsOrActions: [
      'Gibt es eine notwendige Security- oder Datenschutzprüfung?',
      'Dürfen wir Unterlagen bereits vor der Auswahl einreichen?',
    ],
    relatedKnowledge: 'paper-process',
    sourceNote:
      'Whyte → PAPER PROCESS: Summary of Paper Process (Security); AVV als situatives Praxisbeispiel: nicht durch Primärquellen belegt.',
  },
  {
    id: 'approval-po',
    question: 'Sind kaufmännische Freigabe, Budget und möglicher PO-Prozess getrennt geprüft?',
    meaning:
      'Unterscheide wirtschaftliche Genehmigung von der administrativen Ausstellung einer Bestellung. Eine PO-Nummer ist nicht überall der einzige Vertragsweg.',
    whyItMatters: 'Ein freigegebenes Budget beweist nicht, dass Einkauf oder Vertragsabschluss erledigt sind.',
    signals: ['Zuständige Stelle bestätigt Freigabestatus.', 'Ob und wann eine PO erforderlich ist, ist geklärt.'],
    commonMisinterpretation: 'Budget vorhanden bedeute Bestellung erfolgt.',
    possibleQuestionsOrActions: [
      'Wer bestätigt die Finanzierung formal?',
      'Ist eine PO notwendig, und welcher Schritt löst sie aus?',
    ],
    relatedKnowledge: 'paper-process',
    sourceNote: 'Lahoutifard → Chapter Six: Decision & Paper Process (Approval; Purchase Order).',
  },
  {
    id: 'signatory',
    question: 'Sind Unterschriftsberechtigung und tatsächlicher Signaturweg bestätigt?',
    meaning:
      'Finde heraus, wer für den konkreten Vorgang zeichnen darf und wie die Unterlagen zur Unterschrift gelangen.',
    whyItMatters:
      'Auch bereits abgestimmte Vertragsdokumente können durch Abwesenheit oder fehlende Zeichnungsbefugnis hängen bleiben.',
    signals: [
      'Kundenseitige Signaturperson und Verfügbarkeit bestätigt.',
      'Bei Bedarf ist eine zulässige Vertretung bekannt.',
    ],
    commonMisinterpretation: 'Der Projektleiter könne automatisch für das Unternehmen unterschreiben.',
    possibleQuestionsOrActions: [
      'Wer ist hierfür zeichnungsberechtigt?',
      'Was passiert, wenn diese Person nicht verfügbar ist?',
    ],
    relatedKnowledge: 'paper-process',
    sourceNote: 'Whyte → PAPER PROCESS: The Process; The People.',
  },
  {
    id: 'timing',
    question: 'Sind Dauer, Fristen und Abwesenheiten mit zuständigen Stellen bestätigt?',
    meaning: 'Trenne einen gewünschten Termin von nachgewiesenen Bearbeitungszeiten und echten Kundendeadlines.',
    whyItMatters: 'Unbestätigte Laufzeiten erzeugen Scheingenauigkeit im Forecast.',
    signals: [
      'Bearbeitungszeiten stammen aus kundenseitiger Auskunft.',
      'Kritische Termine und Abwesenheiten sind berücksichtigt.',
    ],
    commonMisinterpretation: 'Unser Quartalsende sei automatisch ein kundenseitiger Compelling Event.',
    possibleQuestionsOrActions: [
      'Wie lange dauert dieser Schritt üblicherweise bei Ihnen?',
      'Welche Frist oder Sitzung könnte den Termin gefährden?',
    ],
    relatedKnowledge: 'paper-process',
    sourceNote: 'Whyte → PAPER PROCESS: The Timing; Lahoutifard → Chapter Six: Compelling Event.',
  },
  {
    id: 'dependencies',
    question: 'Sind echte Abhängigkeiten und zulässige parallele Schritte geklärt?',
    meaning:
      'Stelle fest, welche Stationen aufeinander warten müssen und welche Unterlagen früher bearbeitet werden dürfen.',
    whyItMatters:
      'Pauschales Hintereinanderschalten verlängert den Abschluss; unerlaubte Abkürzungen schaffen neue Risiken.',
    signals: ['Kunde benennt echte Vorbedingungen.', 'Parallelisierung wurde mit zuständigen Teams abgestimmt.'],
    commonMisinterpretation: 'Alle Paper-Process-Schritte seien immer linear oder dürften beliebig abgekürzt werden.',
    possibleQuestionsOrActions: [
      'Was muss zwingend vorher erledigt sein?',
      'Welche Prüfung kann zulässig parallel laufen?',
    ],
    relatedKnowledge: 'paper-process',
    sourceNote: 'Whyte → PAPER PROCESS: Summary of Paper Process; Lahoutifard → Chapter Six: Paper Process.',
  },
  {
    id: 'evidence-golive',
    question: 'Ist der tatsächliche Kundenfortschritt nachgewiesen und der Go-Live realistisch?',
    meaning:
      'Vergleiche Käuferbestätigungen und Dokumentenstand mit dem rückwärts geplanten Termin einschließlich Implementierung.',
    whyItMatters:
      'Ein Seller-Angebot oder internes Meeting ist kein Käuferabschluss. Fehlende Implementierungszeit verschiebt den realistischen Go-Live.',
    signals: [
      'Zuständige Person bestätigt erledigte Kundenschritte.',
      'Bestell-/Signaturtermin und Implementierungsdauer passen zum Go-Live.',
    ],
    commonMisinterpretation:
      'Ein versendetes Angebot oder eine ausgewählte Lösung garantiere den Abschluss und rechtzeitigen Go-Live.',
    possibleQuestionsOrActions: [
      'Welches Kundenergebnis belegt die erledigte Freigabe?',
      'Bis wann muss unterschrieben sein, damit die Implementierung gelingt?',
    ],
    relatedKnowledge: 'paper-process',
    sourceNote: 'Whyte → PAPER PROCESS: Paper Process and Go-Live Plan; Lahoutifard → Chapter Six: Paper Process.',
  },
]

export const paperProcessChecklist: ChecklistDefinition = {
  id: 'paper-process',
  eyebrow: 'Nach der Auswahl nicht im Blindflug',
  title: 'Paper Process: Ist der Weg zum Auftrag wirklich geklärt?',
  lead: 'Zehn Prüffragen zu Personen, Prüfungen, Freigaben, Fristen und nachweisbarem Kundenfortschritt.',
  whenToUse: 'Sobald ein möglicher Auftrag greifbar wird, besonders vor Forecast-Zusagen und Vertragsabschluss.',
  benefit: 'Du machst administrative Risiken sichtbar, ohne den Deal künstlich zu bewerten.',
  items: paperProcessItems,
  sourceNotes: [
    'Andy Whyte → MEDDICC → PAPER PROCESS: The Process; The People; The Timing; Paper Process and Go-Live Plan.',
    'Darius Lahoutifard → Always Be Qualifying → Chapter Six – Decision & Paper Process → Paper Process.',
    'Autorenunterschied: Whyte behandelt Paper Process separat; Lahoutifard als Teil des Decision Process mit administrativem Approval.',
    'Situative Praxisbeispiele (MSA/SOW, AVV, Lieferantenanlage) sind keine laut Primärquellen universell vorgeschriebenen Schritte.',
  ],
}
