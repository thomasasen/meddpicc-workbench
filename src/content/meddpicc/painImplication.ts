import type { ChecklistDefinition, ChecklistItem } from './types'

export const painImplicationKnowledge = {
  title: 'Pain / Implication: Vom Symptom zur echten Priorität',
  lead: 'Du hast ein Problem gehört. Aber weißt du, warum es geschäftlich relevant ist, was Nichtstun bedeutet und ob der Kunde diese Konsequenz selbst trägt?',
  shortDefinition: 'Business Pain ist eine relevante geschäftliche Schwierigkeit. Identify erkennt sie; Indicate macht ihre Auswirkungen gemeinsam mit dem Kunden greifbar; Implicate arbeitet heraus, welche Bedeutung diese Auswirkungen für die betroffenen Entscheider haben. Erst Käuferäußerungen und Handlungen zeigen, wie weit das gelungen ist.',
  benefit: 'In wenigen Minuten trennst du Annahmen von Kundenevidenz und findest die nächste natürliche Discovery-Frage, statt vorschnell einen Business Case zu behaupten.',
  whyImportant: [
    'Ein Feature-Wunsch oder ein unerreichtes Ziel ist noch kein belegter geschäftlicher Pain.',
    'Eine plausible Zahl aus deinem Rechner ist ohne Kundendaten und Validierung keine bestätigte Metric.',
    'Die Konsequenz muss für die betroffenen Personen und wirtschaftlichen Entscheider nachvollziehbar sein. Ein engagierter Champion ist dafür ein Ausgangspunkt, kein Ersatz.',
  ],
  stages: [
    { title: '1 · Identify', meaning: 'Ausgangssituation, Symptom und mögliches Problem erkennen; nicht sofort eine Ursache oder Lösung behaupten.', evidence: 'Eine konkrete Kundenaussage über den heutigen Ablauf und einen beobachteten Engpass.', question: 'Wie läuft das heute ab, und an welcher Stelle wird es für Sie schwierig?' },
    { title: '2 · Indicate', meaning: 'Ausmaß, Häufigkeit, betroffene Prozesse und gegebenenfalls wirtschaftliche Wirkung mit dem Kunden greifbar machen. Schätzungen ausdrücklich kennzeichnen.', evidence: 'Gemeinsam erarbeitete Größenordnung, nachvollziehbare Herleitung und offene Annahmen.', question: 'Wie oft tritt das auf? Welche Zeit oder Kapazität bindet es ungefähr, und wer kann das überprüfen?' },
    { title: '3 · Implicate', meaning: 'Die tatsächliche Tragweite für den Kunden vertiefen: betroffene Ziele, Nichtentscheidung, wahrgenommene Bedeutung und mögliche Priorität.', evidence: 'Der Kunde beschreibt selbst die Konsequenz, bindet relevante Stakeholder ein oder vereinbart einen konkreten internen Validierungsschritt.', question: 'Was würde sich für Ihren Bereich ändern, wenn das so bleibt? Welche Bedeutung hätte das für die anstehenden Prioritäten?' },
  ],
  otherPerspective: [
    { title: 'Business-Pain', meaning: 'Ein geschäftliches Ergebnis ist betroffen, etwa Kosten, Ertrag, Produktivität oder Lieferfähigkeit.' },
    { title: 'Capability-Pain', meaning: 'Dem Unternehmen fehlt eine Fähigkeit, mit der es eigene Anforderungen oder Kundenbedürfnisse erfüllen möchte. Eine fehlende Funktion allein belegt noch keinen wirtschaftlichen Schaden.' },
    { title: 'Konsequenz, Outcome, Urgency', meaning: 'Zusätzlich klären: Was passiert bei Nichtentscheidung? Welches Ergebnis ist gewünscht? Gibt es eine echte kundenseitige Frist samt Grund und Folgen einer Verspätung?' },
  ],
  distinctions: [
    { title: 'Symptom ≠ Ursache', explanation: '„Wir pflegen Excel doppelt“ beschreibt eine Beobachtung. Warum das passiert und was es auslöst, ist noch zu ermitteln.' },
    { title: 'Pain ≠ Lösung', explanation: '„Wir brauchen ein neues CRM“ benennt eine Wunschlösung, nicht automatisch die relevante Geschäftsbeeinträchtigung.' },
    { title: 'Pain ≠ Outcome', explanation: '„15 % weniger Bearbeitungszeit“ ist ein Ziel. Die aktuelle Ursache und der Leidensdruck bleiben separat zu prüfen.' },
    { title: 'Implication ≠ Metric', explanation: 'Eine Zahl beziffert eine mögliche Wirkung; die Bedeutung und Priorität beim Käufer sind damit nicht automatisch geklärt.' },
    { title: 'Pain ≠ Compelling Event', explanation: 'Auch ein wichtiges Problem hat nicht zwingend eine feste kundenseitige Deadline. Warum jetzt und was bei Verzögerung geschieht, ist offen.' },
    { title: 'Kundenevidenz ≠ Seller-Hypothese', explanation: 'Erfahrungen aus anderen Deals und eigene Rechnungen helfen bei Fragen, ersetzen aber weder bestätigte Kundenaussagen noch Handlungen.' },
  ],
  evidenceLevels: [
    { title: 'Beobachtung', example: 'In einem Workshop werden drei voneinander getrennte Excel-Listen gezeigt.', caution: 'Noch keine Aussage über Ursache oder Kosten.' },
    { title: 'Kundenaussage', example: 'Die Vertriebsleiterin sagt: „Wir gleichen diese Daten jede Woche manuell ab.“', caution: 'Die Wahrnehmung ist konkret, der Umfang noch nicht überprüft.' },
    { title: 'Verkäuferhypothese', example: 'Vielleicht führt Medienbruch zu unnötiger Mehrarbeit.', caution: 'Als Hypothese kenntlich machen und offen nachfragen.' },
    { title: 'Quantifizierte Annahme', example: 'Beispielrechnung: 8 Personen × 2 Stunden/Woche = 16 Stunden/Woche.', caution: 'Frei konstruierte Beispielwerte. Kein belegter Kunden-ROI.' },
    { title: 'Bestätigte Kundenevidenz', example: 'Der Kunde bestätigt Ausgangswerte und Herleitung und vereinbart die Validierung mit Operations.', caution: 'Die Freigabe des konkreten Investment-Prioritätsentscheids bleibt gesondert zu prüfen.' },
  ],
  scenario: {
    title: 'Konstruiertes Beispiel · B2B-SaaS-Vertrieb',
    steps: [
      { name: 'Symptom', detail: 'Im Vertriebs-Reporting werden Daten mehrfach in Tabellen übertragen. Das bestätigt zunächst nur den Ablauf.' },
      { name: 'Ursache / Pain-Hypothese', detail: 'Möglicherweise verhindern getrennte Systeme einen konsistenten Datenfluss. Die Ursache und der Business Pain müssen mit dem Kunden geprüft werden.' },
      { name: 'Mögliche Auswirkung', detail: 'Reine Rechenannahme: acht Mitarbeitende benötigen jeweils zwei Stunden pro Woche; das wären 16 Stunden pro Woche. Weder Personenanzahl noch Zeit oder monetärer Wert sind hier Kundendaten.' },
      { name: 'Kundenevidenz', detail: 'Die Bereichsleitung könnte Häufigkeit, betroffene Teams und Auswirkungen auf Entscheidungen prüfen und bestätigen. Solange das nicht geschieht, bleibt die Rechnung eine Hypothese.' },
      { name: 'Wahrgenommene Konsequenz', detail: 'Erst wenn die Verantwortlichen selbst beschreiben, was verspätete oder uneinheitliche Daten für ihre Ziele bedeuten, ist die Tragweite greifbar. Eine zwingende Deadline ist nicht belegt.' },
      { name: 'Nächste Aktion', detail: 'Mit Operations eine reale Stichprobe und den gewünschten Zielzustand abgleichen; danach wirtschaftlich betroffene Stakeholder zur Einordnung einbeziehen.' },
    ],
  },
  redFlags: [
    { claim: '„Der Kunde wünscht Feature X, also hat er Pain.“', explanation: 'Die Lösung ist sichtbar, aber Bedarf, Ursache und geschäftliche Konsequenz können noch unbekannt sein.' },
    { claim: '„Unser ROI-Rechner beweist den Business Impact.“', explanation: 'Ohne Herkunft, Annahmen und Bestätigung der Kundendaten ist das eine Verkäufermodellierung, keine validierte Metric.' },
    { claim: '„Die Ansprechpartnerin ist überzeugt, also ist das wirtschaftlich priorisiert.“', explanation: 'Engagement ist hilfreich. Wer die Auswirkungen trägt und wer Investitionen priorisiert, muss gesondert geklärt werden.' },
    { claim: '„Unser Quartalsende ist der Compelling Event.“', explanation: 'Ein Seller-Ziel schafft keine Kundenfrist. Frage nach einem echten Ereignis und konkreten Folgen einer Verzögerung.' },
    { claim: '„Ich habe die Konsequenz erklärt, also hat der Kunde sie verstanden.“', explanation: 'Erklären ist eine Seller-Aktion. Frage nach der Sicht des Kunden und beobachte konkrete interne Schritte.' },
  ],
  questions: [
    'Was funktioniert im heutigen Ablauf bereits gut?',
    'Was möchten Sie daran als Nächstes verbessern?',
    'Können Sie mir zeigen, wie das heute konkret abläuft?',
    'Woran merken die betroffenen Teams die Schwierigkeit?',
    'Was steckt aus Ihrer Sicht hinter dem wiederkehrenden Aufwand?',
    'Wie häufig kommt das vor, und wer könnte die Größenordnung bestätigen?',
    'Woran würden Sie in sechs Monaten erkennen, dass sich die Situation verbessert hat?',
    'Was passiert, wenn Sie die Situation vorerst unverändert lassen?',
    'Welche Termine oder Abhängigkeiten ergeben sich wirklich aus Ihrem Geschäft?',
    'Wer außer Ihnen wäre von der Konsequenz betroffen und könnte sie einordnen?',
  ],
  actions: [
    'Die letzte Aussage des Kunden notieren und als Aussage statt als Tatsache über die gesamte Organisation behandeln.',
    'Offene Ursachen als Hypothesen kennzeichnen; mit einer T.H.E.D.-artigen, offenen Vertiefung prüfen.',
    'Eine mögliche Kennzahl gemeinsam herleiten, die Datenquelle und alle Schätzungen ausdrücklich markieren.',
    'Den betroffenen Stakeholder um Bestätigung der Auswirkungen und des gewünschten Outcomes bitten.',
    'Kundeneigene Konsequenz und gegebenenfalls echtes zeitliches Ereignis prüfen, nicht künstlich dringlich machen.',
    'Eine konkrete nächste Validierung mit zuständiger Person verabreden; ein weiterer Pitch ist nicht automatisch sinnvoll.',
  ],
  practicalTakeaway: 'Nicht „Wie dramatisch kann ich das Problem verkaufen?“, sondern „Welche Konsequenz sieht der Kunde nachweislich selbst, und was müssen wir als Nächstes prüfen?“',
  perspectives: [
    { author: 'Andy Whyte', source: 'MEDDICC → IMPLICATE THE PAIN → The 3 Types of Pain; Who Owns the Pain?; The Three I’s Transition; Tactics to Identify/Indicate/Implicate the Pain; Uncover Pain via Discovery; Implicate the Pain in your Sales Process.', summary: 'Der Übergang Identify → Indicate → Implicate beschreibt die Vertiefung von erkanntem Problem über Quantifizierung zur wahrgenommenen Tragweite. Seine Typen heißen Financial, Efficiency und People Pain. Whyte betont die aktive Seller-Rolle, Champion, Discovery und betroffene Stakeholder.' },
    { author: 'Darius Lahoutifard', source: 'Always Be Qualifying → Chapter Seven – Identify Pain → Types of Pain; How to Identify the Pain?; Language is Important; Consequence; Desired Outcome; Urgency: Compelling Event; Get More Information about the Pain?; The MEDDIC Questions; The Challenger Consultant.', summary: 'Er unterscheidet Business- und Capability-Pain. Positive offene Gesprächsführung, Ursachen, Nichtentscheidungsfolge, gewünschtes Ergebnis und kundenseitige Frist bilden seine Vertiefung. Das ist keine alternative Benennung von Whytes drei I.' },
  ],
  sourceNotes: [
    'Die beiden Pain-Typologien unterscheiden sich: Whyte Financial/Efficiency/People; Lahoutifard Business/Capability. Keine Gleichsetzung.',
    'Das explizite Evidenzraster Beobachtung/Kundenaussage/Hypothese/Annahme/Bestätigung ist eine praxisorientierte Qualitätssicherung, nicht ein wörtliches Autorenschema.',
    'Das SaaS-Szenario, die Rechenannahmen und die konkreten Fragen sind eigens konstruiert und nicht durch Primärquellen als Kundendaten belegt.',
    'Kundeneigene Aussagen und Handlungen als Abschlussprüfung für Implication sind eine bewusste Praxisableitung; Whyte beschreibt auch aktive Verkäufer-Taktiken zur Erhöhung der Dringlichkeit.',
    'Ein konkretes Compelling Event oder Economic-Buyer-Commitment ergibt sich nicht automatisch aus erkanntem Pain.',
  ],
} as const

function point(
  id: string,
  question: string,
  meaning: string,
  whyItMatters: string,
  signals: string[],
  commonMisinterpretation: string,
  possibleQuestionsOrActions: string[],
  sourceNote: string,
): ChecklistItem {
  return { id, question, meaning, whyItMatters, signals, commonMisinterpretation, possibleQuestionsOrActions, relatedKnowledge: 'pain-implication', sourceNote }
}

export const painImplicationChecklist: ChecklistDefinition = {
  id: 'pain-implication',
  eyebrow: 'Identify · Indicate · Implicate',
  title: 'Pain / Implication: Wie belastbar ist die Konsequenz?',
  lead: 'Zehn kurze Prüfungen, die Symptome, Business Pain, wirtschaftliche Wirkung und kundenseitige Bedeutung voneinander trennen.',
  whenToUse: 'Nach Discovery, vor einem Business Case und immer dann, wenn ein Deal allein mit Feature-Wünschen oder vermutetem Leidensdruck begründet wird.',
  benefit: 'Du erkennst die wichtigste Evidenzlücke und kannst eine konkrete nächste Frage oder Validierungsaktion ableiten.',
  items: [
    point('statement','Ist der Pain durch eine konkrete Kundenaussage belegt?','Trenne beobachteten Vorgang, Kundenwortlaut und deine Interpretation. Ein Wunsch nach einem Tool ist zunächst keine bestätigte Ursache.','Du qualifizierst nicht die eigene Sales-Story, sondern eine reale Kundensituation.',['Originalaussage und betroffener Ablauf sind bekannt.','Interpretationen sind als Hypothesen markiert.'],'Das Wort „CRM“ im Wunsch als bereits bewiesenen Business Pain zu behandeln.',['Was möchten Sie mit dem neuen System verbessern?','Können Sie mir ein konkretes Beispiel zeigen?'],'Whyte → IMPLICATE THE PAIN → Identifying the Pain; Lahoutifard → Chapter Seven → How to Identify the Pain?'),
    point('cause','Hast du Symptom und mögliche Ursache getrennt untersucht?','Eine langsame Auswertung ist das Symptom; Prozess, Datenqualität oder Zuständigkeiten könnten die Ursache sein. Auch mehrere Ursachen sind möglich.','Die falsche Ursache führt schnell zu einer unpassenden Lösung.',['Der Kunde beschreibt wiederkehrende Muster im Prozess.','Ursachenhypothesen wurden mit betroffenen Personen abgeglichen.'],'Eine erste Problembeschreibung sei bereits die Ursachenanalyse.',['Wo entsteht die Wartezeit konkret?','Was passiert unmittelbar davor?'],'Lahoutifard → Chapter Seven → Get More Information about the Pain?; Whyte → Uncover Pain via Discovery.'),
    point('type','Ist geklärt, ob Business- oder Capability-Pain vorliegt und wie sie zusammenhängen?','Business-Pain betrifft Geschäftsergebnisse; Capability-Pain betrifft eine fehlende Fähigkeit. Eine gewünschte Funktion kann beide berühren, beweist aber nicht automatisch einen Geschäftsschaden.','Du verhinderst, dass technische Wünsche als unwiderlegbarer Investitionsgrund gelten.',['Die fehlende Fähigkeit wird konkret beschrieben.','Falls behauptet, wurde die Geschäftskonsequenz separat geprüft.'],'„Keine API“ sei zwangsläufig gleichbedeutend mit Umsatzverlust.',['Welche Aufgaben können Sie deshalb derzeit nicht erfüllen?','Was hat das für die geschäftlichen Ziele zur Folge?'],'Lahoutifard → Chapter Seven → Types of Pain; Whytes Financial/Efficiency/People sind eine andere Typologie.'),
    point('identify','Ist die Ausgangssituation so verstanden, dass du Identify von einer fertigen Implication unterscheidest?','Bei Identify erkennst du ein mögliches Problem und die Ausgangslage. Damit sind Ausmaß und Priorität noch nicht bestätigt.','Ein frühes Discovery-Signal darf den Rest der Qualifizierung nicht überspringen.',['Betroffene Arbeitssituation und ein Beispiel liegen vor.','Offene Impact-Fragen sind erkennbar.'],'Nach einem Discovery-Termin sei Pain bereits vollständig implicated.',['Wie läuft das aktuell ab?','Wo beginnt aus Ihrer Sicht die Schwierigkeit?'],'Whyte → IMPLICATE THE PAIN → The Three I’s Transition: Identify.'),
    point('indicate','Wurden Auswirkungen gemeinsam quantifiziert und Annahmen markiert?','Indicate macht Häufigkeit, Zeit oder finanzielle Größenordnung sichtbar. Startwerte können Schätzungen sein, bleiben aber als solche gekennzeichnet.','Eine Zahl ist nur so belastbar wie Herkunft und Plausibilität ihrer Eingaben.',['Kunde kennt Herleitung, Einheit und Datenquelle.','Annahmen, Schätzwerte und offene Prüfungen sind erkennbar.'],'Ein Verkäufer-ROI-Sheet sei bereits eine bestätigte Kunden-Metric.',['Wie häufig entsteht der Aufwand wirklich?','Mit wem prüfen wir diese Schätzung an echten Fällen?'],'Whyte → The Three I’s Transition: Indicate; Tactics to Indicate the Pain.'),
    point('owner','Sind die betroffenen Stakeholder und der Pain-Owner bekannt?','Kläre, wessen Arbeit, Ziele oder Verantwortung betroffen sind und wer wirtschaftliche Prioritäten setzen kann. Ein Champion ist nicht automatisch Economic Buyer.','Ein lokaler Engpass kann wichtig sein, ohne im Budgetentscheid Priorität zu haben.',['Betroffene Personen und Zuständigkeiten sind konkret benannt.','Wirtschaftlich relevante Perspektiven wurden direkt oder über überprüfbare Aussagen eingeholt.'],'Die Überzeugung der Kontaktperson ersetze jede weitere Käuferbestätigung.',['Wer trägt die Konsequenzen im Unternehmen?','Wer müsste den Nutzen wirtschaftlich bewerten?'],'Whyte → IMPLICATE THE PAIN → Who Owns the Pain?; Mid-Stages; Lahoutifard → Chapter Seven → Urgency: Compelling Event.'),
    point('outcome','Ist das gewünschte Ergebnis vom Problem und von der Wunschlösung getrennt?','Der Kunde benennt, welcher Zustand besser werden soll. Ein Ziel-KPI belegt weder die Ursache noch automatisch die aktuelle Einbuße.','Ohne Outcome bleibt unklar, was eine sinnvolle Lösung tatsächlich leisten müsste.',['Ein beobachtbares Kundenziel ist formuliert.','Ausgangslage und gewünschtes Ergebnis sind getrennt erfragt.'],'„15 % schneller“ sei schon der Beweis eines gegenwärtigen Kostenproblems.',['Was soll für Ihre Teams dann konkret anders sein?','Woran würden Sie eine echte Verbesserung erkennen?'],'Lahoutifard → Chapter Seven → Desired Outcome; Get More Information about the Pain?.'),
    point('implicate','Beschreibt der Kunde die Konsequenz selbst statt sie nur von dir zu hören?','Implicate zielt auf die Bedeutung des Pain im Kundenunternehmen. Prüfe durch offene Nachfrage, ob deine Erklärung geteilt und mit eigenen Beispielen untermauert wird.','Seller-Rhetorik ist kein Beweis für Käuferverständnis oder Handlungsbereitschaft.',['Der Kunde formuliert Folgen für seine Ziele in eigenen Worten.','Ein kundenseitiger Folge- oder Validierungsschritt wird selbst mitgetragen.'],'„Ich habe den Schaden erklärt“ bedeute, der Käufer fühle sich zum Handeln verpflichtet.',['Was würde für Sie passieren, wenn alles so bliebe?','Wie ordnen Sie diese Auswirkung intern ein?'],'Whyte → The Three I’s Transition: Implicate; Käuferäußerung als Evidenztest ist eigene Praxisableitung.'),
    point('why-now','Sind Nichtentscheidung und ein möglicher Compelling Event kundenseitig geprüft?','Nicht-Handeln kann Konsequenzen haben; ein fester Termin muss aber nicht existieren. Eine Seller-Quartalsfrist ist kein Kundenereignis.','Künstliche Dringlichkeit verdeckt die tatsächliche Priorität und beschädigt Vertrauen.',['Kunde beschreibt mögliche Folgen der Nichtentscheidung.','Eine genannte Frist hat einen kundenseitigen Auslöser und überprüfbare Konsequenz.'],'Ein verspäteter Seller-Abschluss sei automatisch wirtschaftlicher Kundenschaden.',['Was verändert sich, wenn Sie zunächst nichts tun?','Wodurch entsteht dieser Termin, und was wäre danach anders?'],'Lahoutifard → Chapter Seven → Consequence; Urgency: Compelling Event; Whyte → Pain Creates Urgency.'),
    point('validation','Ist die nächste konkrete Validierung vereinbart statt nur ein weiterer Pitch?','Ergänze offene Evidenz dort, wo sie fehlt: reale Prozessprobe, belastbare Datengröße, betroffene Stakeholder oder Entscheidungspriorität.','Nur nachprüfbare nächste Schritte verkleinern den Qualification Gap.',['Zuständige Person, zu prüfende Frage und erwartete Evidenz sind bekannt.','Schätzungen und ungeklärte Punkte bleiben sichtbar.'],'Ein weiteres Produktmeeting werde die fehlende Kundenevidenz automatisch liefern.',['Wer kann die Zeitannahme anhand echter Fälle gegenprüfen?','Können wir die Konsequenz mit der wirtschaftlich betroffenen Person besprechen?'],'Whyte → Uncover Pain via Discovery; Lahoutifard → Get More Information about the Pain?; Validierungsraster eigene Praxisableitung.'),
  ],
  sourceNotes: [
    'Andy Whyte, MEDDICC → IMPLICATE THE PAIN → The Three I’s Transition, Tactics to Identify/Indicate/Implicate, Who Owns the Pain?, Uncover Pain via Discovery.',
    'Darius Lahoutifard, Always Be Qualifying → Chapter Seven – Identify Pain → Types of Pain, Language is Important, Consequence, Desired Outcome, Urgency: Compelling Event, Get More Information about the Pain?.',
    'Die Zehn-Punkte-Prüfung und Evidenzstufen sind eigenständige Praxisübertragungen. Es existiert weder Deal-Score noch Speicherung der Häkchen.',
  ],
}
