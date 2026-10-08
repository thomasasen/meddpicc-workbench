import type { ChecklistDefinition, ChecklistItem, MeddpiccConcept } from './types'

export interface SpicedElement {
  id: 'situation' | 'pain' | 'impact' | 'critical-event' | 'decision'
  code: 'S' | 'P' | 'I' | 'CE' | 'D'
  name: string
  meaning: string
  openingQuestion: string
  followUpQuestion: string
  evidenceGap: string
  meddpiccBridge: string
}

export const spicedElements: SpicedElement[] = [
  {
    id: 'situation',
    code: 'S',
    name: 'Situation',
    meaning:
      'Geschäftlicher Kontext, heutiger Ablauf, relevante Prioritäten, Rahmenbedingungen und Auslöser für Veränderung.',
    openingQuestion: 'Wie läuft das heute bei Ihnen ab, und was hat Sie veranlasst, das Thema jetzt aufzugreifen?',
    followUpQuestion: 'Was funktioniert daran bereits gut – und wo wird es im Alltag schwierig?',
    evidenceGap:
      'Bekannte Branchen- oder Firmeninformationen ersetzen keine bestätigte Beschreibung der konkreten Kundensituation.',
    meddpiccBridge: 'Grundlage für Identify Pain, Competition und eine belastbare Discovery.',
  },
  {
    id: 'pain',
    code: 'P',
    name: 'Pain',
    meaning:
      'Konkrete, beobachtbare Schwierigkeiten, verpasste Ziele, Engpässe oder Risiken – nicht nur eine Wunschliste für Funktionen.',
    openingQuestion: 'An welcher Stelle hält Sie dieser Ablauf heute am stärksten auf?',
    followUpQuestion: 'Was passiert dadurch konkret – und wen betrifft es außer Ihrem Team?',
    evidenceGap: 'Ein Funktionswunsch ist ohne erkennbares Problem noch kein bestätigter Pain.',
    meddpiccBridge: 'Identify Pain und Implicate the Pain als vertiefende Qualifizierung.',
  },
  {
    id: 'impact',
    code: 'I',
    name: 'Impact',
    meaning:
      'Wirtschaftliche Folgen des Problems und Wert eines besseren Zustands; daneben persönliche oder organisatorische Auswirkungen auf die Beteiligten.',
    openingQuestion: 'Welche Konsequenzen hat das heute für Ihre Ziele, Ihre Mitarbeitenden oder Ihre Kunden?',
    followUpQuestion:
      'Können wir die Größenordnung gemeinsam eingrenzen – etwa Vorgänge, Zeit, Kosten oder entgangenen Umsatz?',
    evidenceGap:
      'Eine plausible Verkäuferrechnung oder ein emotionales Signal ersetzt keine kundenseitig bestätigte wirtschaftliche Metric.',
    meddpiccBridge:
      'Metrics und Implicate the Pain; SPICED macht zusätzlich rationale und emotionale Bedeutung explizit.',
  },
  {
    id: 'critical-event',
    code: 'CE',
    name: 'Critical Event',
    meaning: 'Kundenseitiger Termin, Meilenstein oder äußerer Zwang mit realer Konsequenz, falls er verfehlt wird.',
    openingQuestion: 'Bis wann müsste sich die Situation ändern, damit das Vorhaben seinen Zweck erfüllt?',
    followUpQuestion: 'Was würde konkret passieren, wenn der Zeitpunkt nicht eingehalten wird – und warum gerade dann?',
    evidenceGap:
      'Ein gewünschtes Go-Live-Datum, Budgetjahr oder Verkäufer-Quartalsende belegt noch kein Critical Event.',
    meddpiccBridge:
      'Compelling Event und Why now; mit Decision und Paper Process auf einen realistischen Zeitplan zurückführen.',
  },
  {
    id: 'decision',
    code: 'D',
    name: 'Decision',
    meaning:
      'Wie eine Entscheidung tatsächlich zustande kommt: Beteiligte, Bewertungskriterien, Alternativen, Abwägungen und erforderliche Prozessschritte.',
    openingQuestion:
      'Woran werden Sie intern festmachen, welche Lösung die richtige ist – und wer muss diese Sicht mittragen?',
    followUpQuestion: 'Welche Schritte stehen nach der fachlichen Bewertung bis zur Freigabe und Beauftragung noch an?',
    evidenceGap:
      'Der freundliche Gesprächspartner ist nicht automatisch Champion oder Economic Buyer; ein Auswahltermin ist kein vollständiger Decision Process.',
    meddpiccBridge:
      'Decision Criteria, Decision Process, Economic Buyer, Champion, Competition und gegebenenfalls Paper Process.',
  },
]

export const discoveryCallConcepts = {
  research: {
    id: 'discovery-research',
    meaning:
      'Vorab recherchierst du Organisation, Branche, Gesprächspartner und bereits bekannte Initiativen. Daraus leitest du überprüfbare Hypothesen ab, keine als Fakten getarnten Annahmen.',
    whyItMatters:
      'Gute Vorbereitung schafft Glaubwürdigkeit und vermeidet unnötige Fragen zu öffentlich verfügbaren Unternehmensdaten.',
    signals: [
      'Du kennst den geschäftlichen Anlass des Gesprächs und die beteiligten Rollen.',
      'Du kannst relevante Fakten, Vermutungen und offene Fragen auseinanderhalten.',
      'Du hast ein klares Lernziel für das Gespräch statt einer Produktpräsentation.',
    ],
    commonMisinterpretation: '„Ich habe die Website gelesen – deshalb kenne ich die Probleme des Unternehmens schon.“',
    possibleQuestionsOrActions: [
      'Vorab Geschäftsbericht, aktuelle Initiativen und öffentliche Informationen zur Rolle prüfen.',
      'Eigene Hypothese für den Einstieg markieren: „Ich habe gelesen ..., trifft das auf Ihren Bereich zu?“',
    ],
    sourceNote: 'Whyte → Discovery: Research First, The Organization, The Industry, The People.',
  },
  opening: {
    id: 'discovery-opening',
    meaning:
      'Du stimmst Ziel, Erwartungen und Gesprächsrahmen mit ACE ab: Appreciate (für die Zeit danken), Check End Time (verfügbare Zeit prüfen), End Goal (gemeinsames Ziel bestätigen). Danach lässt du den Kunden seine Sicht beschreiben.',
    whyItMatters:
      'Mit offenen, gerne auch positiven Fragen entsteht ein Gespräch statt eines Verhörs. Ein klarer Einstieg schafft einen gemeinsamen Rahmen, bevor die Diagnose beginnt.',
    signals: [
      'Das Gesprächsziel ist beiderseitig abgestimmt und die verfügbare Zeit bestätigt.',
      'Der Kunde kann sagen, was für ihn heute wichtig ist und was zusätzlich auf die Agenda gehört.',
      'Deine ersten Fragen sind offen, respektvoll und nicht suggestiv.',
    ],
    commonMisinterpretation:
      '„Discovery beginnt am besten mit zehn schnellen Schmerzfragen oder einem vollständigen Produktpitch.“',
    possibleQuestionsOrActions: [
      '„Danke für Ihre Zeit. Passt unser Zeitrahmen noch? Mein Ziel wäre, Ihre Situation zu verstehen und gemeinsam sinnvolle nächste Schritte zu finden. Was ist Ihnen heute besonders wichtig?“',
      '„Was funktioniert in Ihrem heutigen Ansatz bereits besonders gut?“',
    ],
    sourceNote:
      'Lahoutifard → Chapter Seven: How to Identify the Pain?, Language is Important; Winning by Design → The Perfect Discovery Call (PDF): ACE your opening.',
  },
  situation: {
    id: 'discovery-situation',
    meaning:
      'Du verstehst Prozesse, Ziele und Randbedingungen in den Worten des Kunden. Du stellst nur so viele Kontextfragen, wie für die nächsten Vertiefungen erforderlich sind.',
    whyItMatters:
      'Situation schafft den Bezugsrahmen, ohne den ein Problem oder der mögliche Nutzen leicht falsch eingeordnet wird.',
    signals: [
      'Der konkrete Arbeitsablauf und beteiligte Bereiche sind verständlich.',
      'Bekannte Informationen werden bestätigt oder korrigiert.',
      'Du hast ein Beispiel aus dem tatsächlichen Tagesgeschäft.',
    ],
    commonMisinterpretation: '„Viele Fakten über die Firma ergeben automatisch eine gute Discovery.“',
    possibleQuestionsOrActions: [
      '„Nehmen Sie mich durch einen typischen Vorgang: Was passiert von Anfang bis Ende?“',
      '„Welche Teams und Systeme sind daran beteiligt?“',
    ],
    sourceNote: 'Whyte → Discovery: The Big Questions, Research First; Winning by Design → SPICED: Situation.',
  },
  pain: {
    id: 'discovery-pain',
    meaning:
      'Du gehst von konkreten Reibungsverlusten, unerreichten Zielen oder Risiken aus und prüfst deren Ursachen. Du bleibst beim Kundenproblem, statt sofort eine Funktion zu verkaufen.',
    whyItMatters:
      'Geschäftliche Probleme und fehlende Fähigkeiten sind nicht dasselbe. Vertiefe Pain über die erste Antwort hinaus, bevor du eine Lösung anbietest.',
    signals: [
      'Der Kunde beschreibt selbst ein spezifisches, relevantes Problem.',
      'Du kennst mindestens eine Ursache oder ein wiederkehrendes Beispiel.',
      'Du weißt, wer darunter leidet oder welches Ziel gefährdet ist.',
    ],
    commonMisinterpretation: '„Der Kunde möchte ein neues CRM – also haben wir den Pain gefunden.“',
    possibleQuestionsOrActions: [
      '„Was läuft in diesem Schritt heute nicht so, wie Sie es brauchen?“',
      '„Können Sie mir einen konkreten Fall aus den letzten Wochen beschreiben?“',
    ],
    sourceNote:
      'Whyte → Discovery: The Big Questions, Two-Sided Discovery; Lahoutifard → Chapter Seven: Types of Pain, How to Identify the Pain?',
  },
  impact: {
    id: 'discovery-impact',
    meaning:
      'Du fragst nach den Folgen bei Nicht-Handeln und nach einem gewünschten besseren Zustand. Wenn möglich grenzt ihr die wirtschaftliche Größenordnung gemeinsam ein; zusätzlich beachtest du persönliche Konsequenzen.',
    whyItMatters:
      'Prüfe die Konsequenzen des Pain, den gewünschten Outcome und wenn möglich die Größenordnung. Beachte neben rationalem auch emotionalen Impact.',
    signals: [
      'Die Folgen des Problems sind für ein konkretes Geschäfts- oder Bereichsziel verständlich.',
      'Kundenseitige Größen, Annahmen oder ein klarer Plan zur Validierung sind benannt.',
      'Du unterscheidest wirtschaftliche Evidenz von noch ungemessenen persönlichen Auswirkungen.',
    ],
    commonMisinterpretation: '„Jeder genannte Zeitverlust ist bereits eine valide ROI-Zahl.“',
    possibleQuestionsOrActions: [
      '„Was passiert, wenn Sie das noch zwölf Monate so weiterführen?“',
      '„Wie häufig kommt das vor, und welche Kosten oder Verzögerungen entstehen daraus?“',
    ],
    sourceNote:
      'Whyte → Discovery: Quantify the Value, Two-Sided Discovery; Lahoutifard → Chapter Seven: Consequence, Desired Outcome; Winning by Design → SPICED: Impact.',
  },
  event: {
    id: 'discovery-critical-event',
    meaning:
      'Du klärst, ob ein Termin, Meilenstein oder externer Treiber tatsächliche Dringlichkeit erzeugt und was der Kunde bei Versäumnis riskiert.',
    whyItMatters:
      'Dringlichkeit entsteht erst durch eine konkrete Konsequenz des Pain oder ein relevantes Ereignis. Ein Critical Event benötigt daher mehr als nur ein Datum.',
    signals: [
      'Der Zeitpunkt wird vom Kunden oder einem externen Sachverhalt her begründet.',
      'Die Folgen einer Verschiebung sind konkret nachvollziehbar.',
      'Es ist klar, ob bis dahin eine Entscheidung oder bereits eine wirksame Lösung benötigt wird.',
    ],
    commonMisinterpretation:
      '„Wir wollen bis Dezember live sein“ ist ohne Konsequenz bereits ein bewiesenes Critical Event.',
    possibleQuestionsOrActions: [
      '„Warum ist dieser Termin wichtig und was ändert sich, wenn er nicht gehalten wird?“',
      '„Was müsste intern bis dahin passiert sein, damit der Nutzen tatsächlich eintritt?“',
    ],
    sourceNote: 'Lahoutifard → Chapter Seven: Urgency: Compelling Event; Winning by Design → SPICED: Critical Event.',
  },
  decision: {
    id: 'discovery-decision',
    meaning:
      'Du entdeckst, wer beteiligt ist, wie Kriterien entstehen, welche Alternativen geprüft werden und wie die Freigabe bis zur Bestellung verläuft.',
    whyItMatters:
      'SPICED bündelt dies als Decision; MEDDPICC differenziert darüber hinaus Economic Buyer, Champion, Decision Criteria, Decision Process und Paper Process.',
    signals: [
      'Es gibt eine plausible, vom Kunden beschriebene Entscheidungslogik.',
      'Beteiligte und ihre Rolle sind nicht allein aus Titeln geraten.',
      'Kriterien, Prozess und formale Freigaben werden nicht verwechselt.',
    ],
    commonMisinterpretation:
      '„Mein Ansprechpartner sagt, er entscheidet“ klärt bereits Economic Buyer, Kriterien und Paper Process.',
    possibleQuestionsOrActions: [
      '„Wer bewertet die Lösung aus fachlicher und wirtschaftlicher Sicht?“',
      '„Welche Schritte folgen intern von einer Empfehlung bis zu einer unterschriebenen Bestellung?“',
    ],
    sourceNote: 'Whyte → Discovery, Economic Buyer, Decision Process; Winning by Design → SPICED: Decision.',
  },
  listen: {
    id: 'discovery-listen',
    meaning:
      'Du hörst aktiv zu, paraphrasierst und fragst entlang der Kundenantwort tiefer. Die Reihenfolge ist flexibel: Gute Discovery folgt dem Gespräch, nicht fünf fest vorgeschriebenen Fragen.',
    whyItMatters:
      'Sei neugierig, höre aktiv zu und vertiefe wichtige Antworten auch von einer zweiten Seite, statt nur die nächste Frage abzulesen.',
    signals: [
      'Du lässt den Kunden ausreden und spiegelst entscheidende Aussagen zurück.',
      'Du prüfst deine Interpretation mit einer Rückfrage.',
      'Du nutzt Nachfragen statt vorschnell zum nächsten Framework-Buchstaben zu springen.',
    ],
    commonMisinterpretation: '„Gute Discovery bedeutet, die SPICED-Felder in fünf Minuten vollständig abzuhaken.“',
    possibleQuestionsOrActions: [
      '„Wenn ich Sie richtig verstanden habe: ... Stimmt das so?“',
      '„Sie haben gerade ... erwähnt. Was steckt konkret dahinter?“',
    ],
    sourceNote:
      'Whyte → Discovery: Always Be Curious, Being Curious means Actively Listening, Two-Sided Discovery; Winning by Design → The SPICED Framework (Key Takeaways).',
  },
  close: {
    id: 'discovery-close',
    meaning:
      'Du fasst die bestätigten Erkenntnisse zusammen, trennst Beobachtung von offenen Annahmen und vereinbarst einen sinnvollen nächsten Lern- oder Entscheidungsschritt mit Verantwortlichkeit.',
    whyItMatters:
      'Discovery soll zu besseren Entscheidungen und konkreten nächsten Schritten führen, nicht bloß zu mehr Verkäufernotizen. Fasse das Gehörte zusammen und lass es bestätigen.',
    signals: [
      'Der Kunde bestätigt oder korrigiert deine Zusammenfassung.',
      'Offene Lücken sind sichtbar und nicht als beantwortet markiert.',
      'Der nächste Schritt hat einen konkreten Zweck sowie einen zuständigen Ansprechpartner.',
    ],
    commonMisinterpretation:
      '„Wir schicken Unterlagen“ oder „Wir melden uns“ ist immer ein sinnvoll vereinbarter Fortschritt.',
    possibleQuestionsOrActions: [
      '„Was habe ich richtig verstanden – und was sollten wir korrigieren?“',
      '„Was müssen wir als Nächstes klären, und wer sollte dafür im Gespräch sein?“',
    ],
    sourceNote:
      'Whyte → Discovery: Active Listening; Winning by Design → The Perfect Discovery Call, The SPICED Framework (Key Takeaways).',
  },
} satisfies Record<string, MeddpiccConcept>

export const discoveryCallKnowledge = {
  title: 'Discovery Call: erst verstehen, dann empfehlen',
  lead: 'Führe Discovery-Gespräche strukturiert, ohne einen Fragenkatalog abzuhaken. SPICED hilft dir dabei, Situation, Pain, Impact, Critical Event und Decision gezielt zu vertiefen.',
  principle:
    'Discovery ist weder Produktpitch noch einmalige Qualifizierungsprüfung. Ein guter Call erzeugt ein genaueres, vom Kunden überprüftes Verständnis – und zeigt offen, was noch unbekannt ist.',
  differences: [
    {
      author: 'Andy Whyte',
      summary:
        'Discovery ist keine Sales-Stage, sondern eine dauerhaft neugierige Haltung. Vorbereitung, aktives Zuhören, die sieben Arten großer Fragen, offene Fragen und Two-Sided Discovery helfen, Pain zu vertiefen und Value zu quantifizieren.',
      source:
        'MEDDICC → Discovery: Discovery is not a Stage; Always Be Curious; The Big Questions; Two-Sided Discovery.',
    },
    {
      author: 'Darius Lahoutifard',
      summary:
        'Beim Pain mit offenen, möglichst positiven Fragen einsteigen (T.H.E.D.). Dann Consequence, Desired Outcome und Urgency/Compelling Event vertiefen. Geschäftliches Problem und fehlende Fähigkeit unterscheiden.',
      source:
        'Always Be Qualifying → Chapter Seven: Identify Pain, Language is Important, Consequence, Desired Outcome, Urgency.',
    },
    {
      author: 'Winning by Design · SPICED',
      summary:
        'SPICED ist eine Diagnose- und Kommunikationsstruktur über den ganzen Kundenlebenszyklus. Neben rationalem Impact berücksichtigt sie emotionalen Impact; Decision umfasst Kriterien, Beteiligte und Prozess. Es ergänzt MEDDPICC, ersetzt es nicht.',
      source:
        'The SPICED Framework (15.04.2022); The Perfect Discovery Call (09.05.2022); SPICED Framework / MEDDIC and SPICED 2023.',
    },
  ],
  whyteBigQuestions: [
    'Was funktioniert im aktuellen Ablauf gut?',
    'Was funktioniert nicht wie gewünscht?',
    'Welche positiven Folgen hat es, wenn es gut läuft?',
    'Welche negativen Folgen hat es, wenn es nicht funktioniert?',
    'Welche Menschen, Teams oder Kunden betrifft das?',
    'Wie groß ist der Aufwand oder wirtschaftliche Schaden?',
    'Warum wurde das Thema bislang nicht gelöst?',
  ],
  lahouThed: [
    { code: 'T', name: 'Tell me', prompt: 'Erzählen Sie mir mehr über ...' },
    { code: 'H', name: 'How', prompt: 'Wie läuft das bei Ihnen heute ab?' },
    { code: 'E', name: 'Explain', prompt: 'Können Sie mir erklären, wie es dazu kommt?' },
    { code: 'D', name: 'Describe', prompt: 'Beschreiben Sie mir bitte einen konkreten Fall.' },
  ],
  twoSidedExample: {
    first: 'Sie sagen, die Bearbeitung dauert lange. Wie lange dauert sie heute?',
    deepen: 'Wodurch entsteht diese Zeit, wie häufig passiert das und was bedeutet das für Ihre Ziele?',
    caution: 'Die Zahl ist zunächst eine Kundenaussage oder Schätzung, bis sie überprüft wurde.',
  },
  ace: [
    { code: 'A', name: 'Appreciate', meaning: 'Für die Zeit und Teilnahme danken.' },
    { code: 'C', name: 'Check End Time', meaning: 'Verfügbare Gesprächszeit bestätigen.' },
    { code: 'E', name: 'End Goal', meaning: 'Gemeinsames Ziel des Gesprächs vereinbaren.' },
  ],
  flow: [
    {
      title: 'Vorbereitung',
      detail: 'Strategie, Branche, Personen und bekannte Informationen prüfen. Annahmen als Hypothesen kennzeichnen.',
      question: 'Was wissen wir aus verlässlichen Quellen, was vermuten wir nur?',
    },
    {
      title: 'Einstieg',
      detail:
        'Mit ACE öffnen: für Zeit danken, Zeitrahmen prüfen, Endziel abgleichen. Dann Agenda und gewünschtes Ergebnis des Kunden erfragen.',
      question: 'Was funktioniert heute gut, und was möchten Sie verbessern?',
    },
    {
      title: 'Vertiefung',
      detail: 'Dem Kunden folgen: Situation → konkrete Schwierigkeit → Ursache → betroffene Menschen und Ziele.',
      question: 'Können Sie mir ein konkretes Beispiel geben?',
    },
    {
      title: 'Bedeutung & Entscheidung',
      detail:
        'Folgen und gewünschte Wirkung prüfen. Dringlichkeit nicht erfinden. Entscheidungsweg und Alternativen ansprechen, wenn das Gespräch dafür reif ist.',
      question: 'Welche Konsequenz hätte es, wenn sich daran nichts ändert?',
    },
    {
      title: 'Abschluss & Fortsetzung',
      detail:
        'Zusammenfassen, vom Kunden bestätigen lassen, Unsicherheiten benennen und gemeinsam den nächsten Erkenntnisschritt vereinbaren.',
      question: 'Wen sollten wir hinzunehmen, um die offenen Annahmen zu validieren?',
    },
  ],
  redFlags: [
    'Funktionswunsch ohne belegtes Geschäftsproblem',
    'Verkäufer-ROI oder Benchmark als angeblich bestätigte Kunden-Metric',
    'Go-Live-Wunsch ohne nachprüfbare Konsequenz bei Verzögerung',
    '„Budget vorhanden“ wird mit Economic-Buyer-Freigabe gleichgesetzt',
    'Nur Kontaktfreudigkeit wird als Nachweis für einen Champion gelesen',
    'Nach dem Call steht lediglich „Angebot schicken“ ohne Kundencommitment',
  ],
  sourceNotes: [
    'Andy Whyte → MEDDICC: Discovery; Metrics; Economic Buyer; Implicate the Pain.',
    'Darius Lahoutifard → Always Be Qualifying: Chapter Three – Metrics; Chapter Seven – Identify Pain; Chapter Ten – Say No To Qualify and to Close.',
    'Winning by Design → The SPICED Framework: https://winningbydesign.com/resources/blueprints/the-spiced-framework/',
    'Winning by Design → SPICED Framework (Definitionen): https://winningbydesign.com/spiced-framework/',
    'Winning by Design → The Perfect Discovery Call (Original-Blueprint PDF): https://winningbydesign.com/wp-content/uploads/2022/05/Winning-by-Design_Blueprint_The-Perfect-Discovery-Call.pdf',
    'Winning by Design → MEDDIC and SPICED 2023 – Two Different Approaches: https://winningbydesign.com/resources/blog/meddic-and-spiced-2023-two-different-approaches-2/',
  ],
}

function checklistItem(id: string, question: string, concept: MeddpiccConcept): ChecklistItem {
  return {
    id,
    question,
    meaning: concept.meaning,
    whyItMatters: concept.whyItMatters,
    signals: concept.signals,
    commonMisinterpretation: concept.commonMisinterpretation,
    possibleQuestionsOrActions: concept.possibleQuestionsOrActions,
    learnMore:
      'Discovery ist kein einmaliger Termin und SPICED keine starre Abfolge. Ungeklärte Aspekte sind Themen für Folgegespräche, keine fiktiv abgeschlossenen Checks.',
    relatedKnowledge: 'discovery-call',
    sourceNote: concept.sourceNote,
  }
}

export const discoveryCallChecklist: ChecklistDefinition = {
  id: 'discovery-call',
  eyebrow: 'Checklist · Discovery Call',
  title: 'Discovery Call: vorbereitet, neugierig und kundenzentriert',
  lead: 'Neun Orientierungspunkte vor, während und nach dem Kundengespräch. MEDDPICC gibt die Qualifizierungslogik, SPICED unterstützt die natürliche Gesprächsführung.',
  whenToUse:
    'Vor dem ersten Discovery Call sowie zur Vorbereitung neuer Gespräche, wenn weitere Stakeholder, neue Probleme oder offene Annahmen auftauchen.',
  benefit:
    'Du findest gezielter gute Nachfragen, erkennst frühe Pitch-Fallen und gehst mit bestätigten Erkenntnissen statt Happy Ears aus dem Call.',
  items: [
    checklistItem(
      'research',
      'Habe ich recherchiert und meine Hypothesen von Fakten getrennt?',
      discoveryCallConcepts.research,
    ),
    checklistItem(
      'opening',
      'Ist ein offener, kundenorientierter Gesprächseinstieg vorbereitet?',
      discoveryCallConcepts.opening,
    ),
    checklistItem(
      'situation',
      'Kann ich den konkreten Arbeitskontext des Kunden verstehen, statt nur Firmenfakten zu sammeln?',
      discoveryCallConcepts.situation,
    ),
    checklistItem(
      'pain',
      'Vertiefe ich ein echtes Problem hinter dem ersten Wunsch oder Symptom?',
      discoveryCallConcepts.pain,
    ),
    checklistItem(
      'impact',
      'Ermittle ich Folgen, gewünschten Outcome und mögliche Quantifizierung – ohne ROI zu erfinden?',
      discoveryCallConcepts.impact,
    ),
    checklistItem(
      'event',
      'Prüfe ich, ob ein genannter Termin wirklich ein Critical Event mit Konsequenz ist?',
      discoveryCallConcepts.event,
    ),
    checklistItem(
      'decision',
      'Frage ich nach Kriterien, Beteiligten und Prozess, ohne Rollen aus Titeln abzuleiten?',
      discoveryCallConcepts.decision,
    ),
    checklistItem(
      'listen',
      'Höre ich zu, spiegele Verständnis und stelle passende Vertiefungsfragen?',
      discoveryCallConcepts.listen,
    ),
    checklistItem(
      'close',
      'Plane ich Bestätigung, offene Evidenzlücken und einen sinnvollen nächsten Schritt?',
      discoveryCallConcepts.close,
    ),
  ],
  sourceNotes: discoveryCallKnowledge.sourceNotes,
}
