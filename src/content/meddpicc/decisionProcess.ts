import type { ChecklistDefinition, ChecklistItem, MeddpiccConcept } from './types'

export const decisionProcessPhases = [
  {
    title: 'Technical Validation',
    description:
      'Der Kunde prüft anhand seiner Decision Criteria, ob die Lösung fachlich und technisch geeignet ist. Dazu können RFP, Demo, Security-Prüfung, POC oder Pilot gehören.',
    evidence:
      'Verantwortliche bestätigen die Erfolgskriterien, den Testumfang und das Ergebnis – einschließlich offener Punkte.',
    question: 'Wer nimmt die technische und fachliche Bewertung ab, und woran erkennen wir die Freigabe?',
  },
  {
    title: 'Business Approval',
    description:
      'Befugte Personen oder Gremien entscheiden über Priorität, Nutzen, Risiko, Finanzierung und Auswahl. Die Freigabe kann von der technischen Prüfung abhängen oder teilweise parallel vorbereitet werden.',
    evidence:
      'Entscheidungsbefugte, Veto-Rechte, Gremium, Sitzungstermin und bestätigter Beschluss sind nachvollziehbar.',
    question: 'Wer kann das Vorhaben noch stoppen, und in welchem Termin wird die Auswahl verbindlich beschlossen?',
  },
  {
    title: 'Paper Process (separat prüfen)',
    description:
      'Nach der fachlichen Auswahl können noch Einkauf, Legal, Datenschutz, Security, Bestellung und Zeichnung folgen. Organisatorisch können Teile früher oder parallel starten.',
    evidence:
      'Der formale Weg bis zur Unterschrift wurde mit den zuständigen Stellen geklärt und mit ausreichend Vorlauf eingeplant.',
    question: 'Welche Vertrags- und Bestellschritte sind auch nach der Auswahl noch erforderlich?',
  },
] as const

export const decisionProcessConcepts = {
  map: {
    id: 'map',
    meaning:
      'Halte die kundenseitigen Phasen von der Evaluierung bis zum Beschluss fest. Benenne pro Schritt das erwartete Ergebnis und die Freigabebedingung.',
    whyItMatters:
      'Ohne nachvollziehbaren Kundenprozess verwechselt man Vertriebsgespräche leicht mit echten Kaufentscheidungen.',
    signals: [
      'Der Kunde beschreibt konkrete Phasen und die Reihenfolge oder Parallelität.',
      'Jede entscheidende Stufe hat ein Ergebnis, das als erreicht oder offen überprüfbar ist.',
    ],
    commonMisinterpretation: 'Unser interner Sales Funnel oder ein voller Meetingkalender sei der Decision Process des Kunden.',
    possibleQuestionsOrActions: [
      'Wie läuft eine Entscheidung dieser Größenordnung bei Ihnen normalerweise ab?',
      'Was muss nach dem POC passieren, bevor Ihr Unternehmen uns als Anbieter auswählt?',
    ],
    sourceNote: 'Whyte → Decision Process: Uncovering the Decision Process; Lahoutifard → Chapter Six: Decision & Paper Process.',
  },
  validation: {
    id: 'validation',
    meaning:
      'Erfrage die konkreten fachlichen und technischen Prüfungen sowie deren Akzeptanzkriterien und Entscheider.',
    whyItMatters:
      'Ein durchgeführter POC beweist noch nicht, dass die zuständigen Personen die Anforderungen als erfüllt akzeptieren.',
    signals: ['Messbare oder eindeutig überprüfbare Abnahmekriterien sind abgestimmt.', 'Die zuständige Person hat das Prüfergebnis bestätigt.'],
    commonMisinterpretation: 'Ein erfolgreiches Demo-Feedback sei bereits die technische Freigabe oder ein Kaufversprechen.',
    possibleQuestionsOrActions: [
      'Welche Ergebnisse müssen vorliegen, damit die fachliche Prüfung als bestanden gilt?',
      'Wer bestätigt diese Ergebnisse verbindlich, und was passiert bei offenen Punkten?',
    ],
    sourceNote: 'Whyte → Decision Process: Technical Validation; Lahoutifard → Chapter Six: Validation.',
  },
  approval: {
    id: 'approval',
    meaning:
      'Identifiziere die tatsächlichen Business-Entscheider, Gremien, die Rolle des Economic Buyer sowie mögliche Veto- oder Eskalationsrechte.',
    whyItMatters:
      'Eine Empfehlung des Projektteams ersetzt weder eine Managemententscheidung noch die wirtschaftliche Freigabe.',
    signals: ['Alle entscheidungsrelevanten Rollen und Gremien sind bekannt.', 'Die Entscheidungsautorität wurde mit mehr als einer belastbaren Kundensicht validiert.'],
    commonMisinterpretation: 'Der Projektleiter oder Champion könne allein entscheiden, weil er das Projekt verantwortet.',
    possibleQuestionsOrActions: [
      'Wer spricht die Auswahl aus, wer bestätigt sie und wer könnte widersprechen?',
      'Wann und mit welchen Unterlagen befasst sich das Entscheidungsgremium damit?',
    ],
    sourceNote: 'Whyte → Decision Process: Business Approval; Lahoutifard → Chapter Six: Approval.',
  },
  evidence: {
    id: 'evidence',
    meaning:
      'Trenne dokumentierte Bestätigung, Kundenaussage und eigene Annahme. Lege fest, welche Kundenevidenz einen Schritt tatsächlich abschließt.',
    whyItMatters:
      'Schlüssige Vermutungen bleiben unsicher. Ein Prozess wird belastbarer, wenn die zuständige Kundenseite ihn bestätigt und die Ergebnisse nachprüfbar sind.',
    signals: ['Ein Verantwortlicher bestätigt den nächsten Schritt und dessen Abschlusskriterium.', 'Unbestätigte Aussagen sind ausdrücklich als offen notiert.'],
    commonMisinterpretation: '„Der Champion hat gesagt, das sei erledigt“ reiche stets als Freigabenachweis.',
    possibleQuestionsOrActions: [
      'Wer könnte diesen Prozessschritt aus eigener Zuständigkeit bestätigen?',
      'Ist das bereits beschlossen, so geplant oder noch unsere Annahme?',
    ],
    sourceNote: 'Whyte → Decision Process: Progressing Through It; Never Assume Your Go-Live Plan Is Correct.',
  },
  timeline: {
    id: 'timeline',
    meaning:
      'Kläre Entscheidungen, Dauer, Sitzungszyklen, Abhängigkeiten, Puffer und den gewünschten Go-Live. Plane bei Bedarf gemeinsam rückwärts.',
    whyItMatters:
      'Ein Quartalsende beim Verkäufer ist keine Kundendeadline. Auch echte Kundentermine belegen ohne Abhängigkeiten und Konsequenzen noch keinen realistischen Abschlusszeitpunkt.',
    signals: ['Meilensteine mit kundenseitigen Eigentümern und realistischen Zeiten liegen vor.', 'Abhängigkeiten und Engpässe sind mit dem Kunden durchgesprochen.'],
    commonMisinterpretation: 'Ein Go-Live-Wunsch oder Forecast-Close-Date sei automatisch ein bestätigter Entscheidungszeitpunkt.',
    possibleQuestionsOrActions: [
      'Wann tagt das Gremium tatsächlich, und bis wann müssen Unterlagen eingereicht sein?',
      'Was passiert geschäftlich, wenn der Go-Live um vier Wochen rutscht?',
    ],
    sourceNote: 'Whyte → Decision Process and Go-Live Plan; Lahoutifard → Chapter Six: Decision Process Timeline.',
  },
  alignment: {
    id: 'alignment',
    meaning:
      'Stimme den Entscheidungsweg mit den betroffenen Fachbereichen, dem Champion und bei relevanten Freigaben dem Economic Buyer ab.',
    whyItMatters:
      'Ein einzelner Kontakt kennt selten alle zusätzlichen Anforderungen und politischen Abhängigkeiten.',
    signals: ['Technische, fachliche und wirtschaftliche Perspektiven wurden überprüft.', 'Widersprüche zwischen Stakeholdern wurden angesprochen.'],
    commonMisinterpretation: 'Ein kundenseitiger Ansprechpartner kenne automatisch alle Schritte anderer Teams.',
    possibleQuestionsOrActions: [
      'Wer sollte unseren gemeinsamen Ablaufplan ebenfalls gegenprüfen?',
      'Mit wem sollten wir frühzeitig über mögliche Freigabehemmnisse sprechen?',
    ],
    sourceNote: 'Whyte → Decision Process: Socializing the Go-Live Plan; Lahoutifard → Chapter Six.',
  },
  boundaries: {
    id: 'boundaries',
    meaning:
      'Unterscheide Decision Criteria (Bewertungsmaßstab), Decision Process (Entscheidungsweg) und Paper Process (formale Kaufabwicklung).',
    whyItMatters:
      'Ein fachlicher Zuschlag ist nicht mit einem signierten Vertrag gleichzusetzen. Administratives kann mitentscheiden, muss aber sichtbar bleiben.',
    signals: ['Auswahlentscheidung und Vertragsabschluss sind getrennt benannt.', 'Einkauf, Legal und Zeichnungsweg sind nicht einfach als erledigt unterstellt.'],
    commonMisinterpretation: '„Wir sind ausgewählt“ bedeute „Der Auftrag kommt sicher rechtzeitig“.',
    possibleQuestionsOrActions: [
      'Was genau ist nach der Auswahl entschieden und was ausdrücklich noch nicht?',
      'Wer kennt den Ablauf vom Beschluss über Bestellung bis zur rechtsgültigen Unterschrift?',
    ],
    sourceNote: 'Whyte → Decision Process / Paper Process; Lahoutifard → Chapter Six: Paper Process.',
  },
  changes: {
    id: 'changes',
    meaning:
      'Prüfe den Plan nach jeder relevanten Kundeninformation neu, besonders bei neuem Stakeholder, zusätzlicher Freigabe oder verändertem Termin.',
    whyItMatters:
      'In komplexen Deals tauchen neue Schritte auf. Ein einmal bestätigter Plan ist keine Garantie für den gesamten weiteren Verlauf.',
    signals: ['Der Plan wurde bei Änderungen mit betroffenen Personen aktualisiert.', 'Neue offene Punkte erhalten eine konkrete Nachfrage oder Aktion.'],
    commonMisinterpretation: 'Ein früher abgestimmter Prozess bleibe bis zur Unterschrift unverändert.',
    possibleQuestionsOrActions: [
      'Hat sich seit unserem letzten Abgleich etwas im Entscheidungsweg geändert?',
      'Welcher neue Schritt gefährdet den Termin und wer kann ihn verbindlich klären?',
    ],
    sourceNote: 'Whyte → Decision Process: Rarely Less, Always More; Lahoutifard → Chapter Six.',
  },
  commitment: {
    id: 'commitment',
    meaning:
      'Klär den nächsten verbindlichen Kundenmeilenstein einschließlich verantwortlicher Person und Folge bei Erfolg oder Misserfolg.',
    whyItMatters:
      'Der Verkauf ist nicht automatisch gewonnen, sobald eine Prüfung positiv ausfällt. Geschäftliche Freigaben und Konkurrenz können weiterhin offen sein.',
    signals: ['Der Kunde benennt die nächste Entscheidung nach der Validierung.', 'Eine Folgebesprechung und die notwendigen Entscheidungsvorlagen sind abgestimmt.'],
    commonMisinterpretation: '„Wenn der POC gut läuft, kaufen wir“ sei ohne befugte Person und klare Bedingungen bereits eine Zusage.',
    possibleQuestionsOrActions: [
      'Wenn wir die gemeinsam definierten Kriterien erfüllen: Welcher Entscheidungsschritt folgt konkret?',
      'Können wir direkt nach der Auswertung einen Termin mit den für die Auswahl zuständigen Personen vereinbaren?',
    ],
    sourceNote: 'Lahoutifard → Economic Buyer / Chapter Six: Conditional Closing; Whyte → Decision Process.',
  },
  influence: {
    id: 'influence',
    meaning:
      'Hilf dem Kunden, unnötige Wartezeiten zu reduzieren oder Schritte sinnvoll parallel vorzubereiten, ohne Kontrollpflichten zu umgehen.',
    whyItMatters:
      'Optimierung ist nur sinnvoll, wenn der Kunde die Änderung tatsächlich mitträgt und die Entscheidung weiterhin sauber getroffen werden kann.',
    signals: ['Eine mögliche Parallelisierung wurde kundenseitig bestätigt.', 'Compliance, Gremien und Prüfungen bleiben unverändert wirksam.'],
    commonMisinterpretation: 'Ein Seller könne obligatorische interne Freigaben aus dem Prozess streichen.',
    possibleQuestionsOrActions: [
      'Welche Vorbereitung könnten wir parallel beginnen, ohne Ihre Prüfschritte zu überspringen?',
      'Welche Aktivität ist zwingend, welche lässt sich nach Ihrer Einschätzung vereinfachen?',
    ],
    sourceNote: 'Whyte → Decision Process: Influencing the Timing; Lahoutifard → Chapter Ten: Say No to Qualify.',
  },
} satisfies Record<string, MeddpiccConcept>

export const decisionProcessKnowledge = {
  title: 'Decision Process: verstehen, wie der Kunde wirklich entscheidet',
  lead: 'Rekonstruiere den tatsächlichen Kaufentscheidungsweg: von der technischen Prüfung über die Business-Freigabe bis zum Übergang in den Paper Process.',
  shortDefinition:
    'Der Decision Process ist die Abfolge von Prüfungen, Abstimmungen und Entscheidungen, mit der der Kunde die Auswahl einer Lösung verbindlich trifft. Er umfasst beteiligte Personen, Zuständigkeiten, Freigaben, Zeitpunkte und Abhängigkeiten.',
  benefit:
    'Du erkennst fehlende Entscheider, zusätzliche Gremien, unbelegte Meilensteine und Terminrisiken – bevor du einen Abschluss auf bloße Aktivität stützt.',
  whyImportant: [
    'Der Kunde entscheidet nach seinem Buying Process, nicht nach den Phasen in unserem CRM.',
    'Fortschritt liegt erst vor, wenn die zuständige Kundenseite ein Ergebnis bestätigt.',
    'Technische Eignung und wirtschaftliche Freigabe sind unterschiedliche Hürden.',
    'Der Weg kann sich ändern. Ein abgestimmter Plan muss mit Beteiligten regelmäßig geprüft werden.',
  ],
  distinctions: [
    { title: 'Decision Criteria', definition: 'Woran wird eine Lösung bewertet?', example: 'Integrationsfähigkeit und wirtschaftlicher Nutzen müssen nachgewiesen werden.' },
    { title: 'Decision Process', definition: 'Wie, von wem und wann wird die Auswahl getroffen?', example: 'IT prüft den POC; Steering Committee gibt anschließend die Auswahl frei.' },
    { title: 'Paper Process', definition: 'Wie wird aus der Auswahl ein rechtsgültiger Auftrag?', example: 'Legal prüft den Vertrag, Einkauf erstellt die PO, Zeichnungsberechtigte unterschreiben.' },
  ],
  discoveryQuestions: [
    'Wie ist bei Ihnen die letzte vergleichbare Softwareentscheidung abgelaufen?',
    'Welche Prüfungen müssen die Fachbereiche abschließen, bevor Ihre Organisation eine Auswahl trifft?',
    'Wer empfiehlt die Lösung, wer genehmigt sie und wer könnte den Beschluss verhindern?',
    'Wann tagt das Gremium und welche Unterlagen müssen dafür wie früh vorliegen?',
    'Wer bestätigt, dass der POC die vereinbarten Anforderungen erfüllt?',
    'Was geschieht nach positivem POC-Ergebnis konkret – und wer entscheidet dann?',
    'Welche Schritte können nach Ihrer internen Vorgabe gleichzeitig beginnen?',
    'Wer kann mit uns den Weg bis zur Bestellung und Unterschrift gesondert durchgehen?',
  ],
  pitfalls: [
    {
      claim: '„Der POC läuft gut – also sind wir fast durch.“',
      explanation: 'Erst klären, wer abnimmt, ob wirtschaftliche Freigabe vorliegt und welche weiteren Anbieter oder Alternativen im Rennen sind.',
    },
    {
      claim: '„Der Champion hat alle Schritte bestätigt.“',
      explanation: 'Den Plan auch bei technischen Verantwortlichen, Entscheidern und zuständigen formalen Stellen validieren. Ein Kontakt ersetzt nicht alle Perspektiven.',
    },
    {
      claim: '„Das Steering Committee entscheidet Ende Oktober.“',
      explanation: 'Ohne genaue Sitzung, Einreichungsfrist, Mitglieder, Beschlussregeln und Folgen einer Vertagung ist dieser Termin eine Hypothese.',
    },
    {
      claim: '„Das Angebot ist intern akzeptiert; die Unterschrift ist Formsache.“',
      explanation: 'Unbekannte Bedingungen des Paper Process können die Bestellung verzögern oder sogar verhindern.',
    },
    {
      claim: '„Wir haben zehn Demos gemacht und der Kunde reagiert schnell.“',
      explanation: 'Aktivität und Begeisterung belegen nicht, dass ein kundenseitiger Entscheidungsschritt bestanden ist.',
    },
  ],
  practiceActions: [
    'Mit dem Kunden den tatsächlich üblichen Buying Process rekonstruieren, nicht den eigenen Sales-Prozess übertragen.',
    'Jeden Schritt um Owner, Entscheidung, Akzeptanznachweis, realistischen Termin und Abhängigkeit ergänzen.',
    'Validierung und Business Approval unterscheiden; mögliche Parallelität kundenseitig bestätigen lassen.',
    'Entscheidungsweg mit mehreren relevanten Stakeholdern besprechen und fehlende oder widersprüchliche Aussagen markieren.',
    'Nach jedem erreichten Meilenstein eine klare Bestätigung und den nächsten kundenseitigen Schritt einholen.',
    'Paper Process früh separat erkunden und die Termine rückwärts vom gewünschten Go-Live prüfen.',
  ],
  perspectives: [
    {
      author: 'Andy Whyte',
      summary:
        'Betont den vollständigen, wiederholt validierten Buying Process, Technical Validation und Business Approval sowie kundenseitige Bestätigung statt bloßer Vertriebsaktivität. Der gemeinsame Go-Live-Plan macht Abhängigkeiten und neue Schritte sichtbar.',
      source: 'MEDDICC → Decision Process: From the What to the How; Validation and Approval; Go-Live Plan; Measure Progress Against the Decision Process.',
    },
    {
      author: 'Darius Lahoutifard',
      summary:
        'Strukturiert Validation und Approval und empfiehlt, den Ablauf gemeinsam zu dokumentieren und zeitlich zu optimieren. Behandelt den Paper Process als gesondert zu erforschenden administrativen Teil des größeren Kaufprozesses.',
      source: 'Always Be Qualifying → Chapter Six: Decision & Paper Process; Chapter Ten: Say No to Qualify.',
    },
  ],
  practicalTakeaway:
    'Ein belastbarer Decision Process ist ein mit den Zuständigen abgeglichener Entscheidungsweg, kein sellerseitiger Wunschplan. Unbekannte Schritte sind Qualifizierungslücken, aus denen die nächste Kundenfrage folgt.',
  sourceNotes: [
    'Andy Whyte → MEDDICC, Kapitel Decision Process: Uncovering the Decision Process; Technical Validation; Business Approval; Go-Live Plan; Influencing the Decision Process; Measure Progress Against the Decision Process.',
    'Darius Lahoutifard → Always Be Qualifying, Chapter Six: Decision & Paper Process; Chapter Ten: Say No to Qualify.',
    'Die deutschen Discovery-Fragen und der CRM-Fall sind eigenständige Praxisformulierungen, keine wörtlichen Zitate.',
  ],
} as const

function makeChecklistItem(question: string, concept: MeddpiccConcept): ChecklistItem {
  return { ...concept, question, relatedKnowledge: 'decision-process' }
}

export const decisionProcessChecklist: ChecklistDefinition = {
  id: 'decision-process',
  eyebrow: 'Checklist · Decision Process',
  title: 'Decision Process: Ist der Entscheidungsweg wirklich geklärt?',
  lead: 'Zehn kurze Prüfungen für echte Kundenmeilensteine statt vermuteter Abschlusstermine. Offene Fragen werden nicht automatisch als erledigt gewertet.',
  whenToUse: 'Nach Discovery, vor einem POC oder Steering Committee und vor jedem Forecast-Commitment.',
  benefit: 'Du erkennst fehlende Freigaben, nicht beteiligte Entscheider und unrealistische Zeitpläne, bevor sie deinen Deal blockieren.',
  items: [
    makeChecklistItem('Kenne ich die tatsächlichen kundenseitigen Schritte bis zur Auswahlentscheidung?', decisionProcessConcepts.map),
    makeChecklistItem('Sind Technical Validation, Abnahme und Ergebnisbedingungen geklärt?', decisionProcessConcepts.validation),
    makeChecklistItem('Sind Business Approval, Economic Buyer, Gremien und mögliche Vetos bekannt?', decisionProcessConcepts.approval),
    makeChecklistItem('Kann ich bestätigte Fakten von Kundenaussagen und Annahmen unterscheiden?', decisionProcessConcepts.evidence),
    makeChecklistItem('Haben die Meilensteine Termine, Verantwortliche und nachvollziehbare Abhängigkeiten?', decisionProcessConcepts.timeline),
    makeChecklistItem('Haben mehrere beteiligte Stakeholder den Entscheidungsweg geprüft?', decisionProcessConcepts.alignment),
    makeChecklistItem('Sind Decision Criteria, Decision Process und Paper Process sauber getrennt?', decisionProcessConcepts.boundaries),
    makeChecklistItem('Habe ich Prozessänderungen, neue Beteiligte und offene Schritte berücksichtigt?', decisionProcessConcepts.changes),
    makeChecklistItem('Weiß ich, welche konkrete Entscheidung nach dem nächsten erfolgreichen Schritt folgt?', decisionProcessConcepts.commitment),
    makeChecklistItem('Sind mögliche Beschleunigungen mit dem Kunden abgestimmt, ohne Freigaben zu umgehen?', decisionProcessConcepts.influence),
  ],
  sourceNotes: decisionProcessKnowledge.sourceNotes.slice(),
}
