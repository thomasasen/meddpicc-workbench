# MEDDPICC Toolbox

Praktische **Tools, Checklists und Wissenshilfen** für wiederkehrende Aufgaben im komplexen B2B-Vertrieb.

Die Toolbox soll einem Account Manager vor allem eine Frage beantworten:

> **Was hilft mir bei meiner aktuellen Aufgabe – und wie komme ich schnell zu einem brauchbaren Ergebnis?**


### Metrics – Knowledge und Checklist

**Feature-PR #45: technische CI #412 grün, Screenshots geprüft; bis zur Nutzerfreigabe weiterhin Draft und nicht auf `main`.**

- **Wissen → Metrics:** Definition, Before-/After-State, Economic Impact, M1-Proof-Points vs. kundenspezifische M2-Metrics, Validierung sowie Sichtweisen von Whyte und Lahoutifard.
- **Checklist → Metrics:** sieben kompakte Prüfpunkte mit Erklärung, Erkennungsmerkmalen, typischen Fehlinterpretationen und konkreten Discovery-Fragen.
- Die Content-Basis wird zwischen Knowledge und Checklist wiederverwendet. Checkboxen sind nur temporäre Denkhilfen, kein Deal-Score.
- Die fachliche Quellenprüfung steht unter [Metrics Source QA](docs/METRICS_SOURCE_QA.md).

## Status

| Status | Bedeutung |
| --- | --- |
| ✅ **Umgesetzt** | Funktion ist implementiert und nutzbar. |
| 🟡 **Als Nächstes** | Inhalt und Nutzen sind festgelegt; Umsetzung ist in einer der nächsten Phasen vorgesehen. |
| ⚪ **Geplant** | Funktion gehört zur Roadmap, wird aber später umgesetzt. |

---

# Funktionen

## Tools

Tools erledigen eine konkrete Aufgabe: berechnen, vorbereiten, strukturieren oder visualisieren.

### Go-Live & Buying Process

| Funktion | Status | Was macht sie? | Vorteil für den Account Manager |
| --- | --- | --- | --- |
| **Go-Live-Rückwärtsplanung** | ✅ Umgesetzt | Du gibst Target Go-Live und die notwendigen Prozessschritte mit Dauer und Verantwortlichkeit ein. Das Tool rechnet rückwärts und erzeugt eine dynamische Executive-Timeline mit proportionaler Zeitachse. | Du erkennst sofort, **wann welcher Schritt spätestens starten muss**, wie viel Zeit jeder Prozessblock beansprucht und kannst dieselbe hochwertige Übersicht direkt im Kundengespräch oder als SVG/PNG verwenden. |
| **Go-Live Plan Builder** | ⚪ Geplant | Führt Prozessschritte, Termine und Verantwortlichkeiten zu einem gemeinsamen Go-Live-Plan zusammen. | Du musst einen gemeinsamen Plan nicht jedes Mal manuell in PowerPoint oder Excel aufbauen und kannst Verantwortlichkeiten mit dem Kunden schneller abstimmen. |
| **Decision Process Mapper** | ⚪ Geplant | Visualisiert, wie fachliche Validierung, Freigaben und endgültige Entscheidung beim Kunden ablaufen. | Du erkennst leichter, **wer wann was entscheiden muss** und wo im Buying Process noch Unklarheiten bestehen. |
| **Paper Process Explorer** | ⚪ Geplant | Führt Schritt für Schritt durch Einkauf, Legal, Datenschutz, Security, Vertrag und Signatur. | Du deckst administrative Schritte früher auf und reduzierst das Risiko, dass ein vermeintlich gewonnener Deal kurz vor Abschluss durch unbekannte Prozesse verzögert wird. |
| **Dependency / Parallelization Helper** | ⚪ Geplant | Zeigt Abhängigkeiten zwischen Prozessschritten und prüft, welche Aktivitäten parallel laufen könnten. | Du findest Möglichkeiten, den Sales Cycle zu verkürzen, ohne notwendige Kundenschritte zu überspringen. |
| **Procurement Prep** | ⚪ Geplant | Hilft, ein Gespräch mit Einkauf strukturiert vorzubereiten: Ziele, Value, erwartbare Themen und notwendige Informationen. | Du gehst besser vorbereitet in Procurement-Gespräche und vermeidest, dass die Diskussion ausschließlich auf Preis und Rabatt reduziert wird. |

### Value & Metrics

| Funktion | Status | Was macht sie? | Vorteil für den Account Manager |
| --- | --- | --- | --- |
| **Quick Payback** | 🟡 Als Nächstes | Berechnet aus Investition und wirtschaftlichem Nutzen, nach welcher Zeit sich die Investition amortisiert. | Du kannst dem Kunden schnell und verständlich zeigen, **wann der Break-even erreicht wird**, ohne selbst Formeln oder Excel aufzubauen. |
| **Metric Builder** | 🟡 Als Nächstes | Hilft, aus einem Pain oder gewünschten Outcome eine belastbare, nachvollziehbare Kennzahl abzuleiten. | Du kommst schneller von Aussagen wie „das kostet uns viel Zeit“ zu einer Metric, mit der sich ein Business Case wirklich begründen lässt. |
| **Cost of Delay** | 🟡 Als Nächstes | Berechnet, welchen wirtschaftlichen Wert der Kunde pro Woche oder Monat verliert, wenn sich die Veränderung verzögert. | Du kannst **Why now?** quantifizieren und Dringlichkeit mit wirtschaftlichen Auswirkungen statt nur mit Bauchgefühl begründen. |
| **Business Case / Value Bridge** | 🟡 Als Nächstes | Führt Nutzen, Kosten, Annahmen und relevante Metrics zu einem nachvollziehbaren Business Case zusammen. | Du erhältst schneller eine belastbare Grundlage für die Kundendiskussion und kannst Value konsistent gegenüber Management und Economic Buyer darstellen. |

### Discovery & Pain

| Funktion | Status | Was macht sie? | Vorteil für den Account Manager |
| --- | --- | --- | --- |
| **Discovery Prep** | ⚪ Geplant | Strukturiert vor einem Kundentermin relevante Themen, Ziele und Fragen für die Discovery. | Du bereitest dich schneller vor und reduzierst das Risiko, wichtige Pain-, Impact- oder Stakeholder-Fragen im Gespräch zu vergessen. |
| **Pain → Impact** | ⚪ Geplant | Führt von einem beschriebenen Problem zu dessen Konsequenzen und wirtschaftlichem bzw. organisatorischem Impact. | Du bleibst nicht beim oberflächlichen Pain stehen und kannst besser herausarbeiten, **warum das Problem tatsächlich relevant ist**. |
| **Identify / Indicate / Implicate Helper** | ⚪ Geplant | Unterstützt dabei, Pain zunächst zu identifizieren, anschließend mit konkreten Auswirkungen zu belegen und schließlich die weitergehenden Konsequenzen zu verstehen. | Du bekommst eine klare Gesprächsstruktur, um aus einer Problembeschreibung einen belastbaren Business Pain zu entwickeln. |
| **Compelling Event / Why Now Helper** | ⚪ Geplant | Hilft, Zeitdruck, Ereignisse und Konsequenzen einer Verzögerung strukturiert herauszuarbeiten. | Du kannst besser beurteilen und erklären, **warum der Kunde jetzt handeln sollte** und nicht irgendwann später. |

### Decision Criteria & Differentiation

| Funktion | Status | Was macht sie? | Vorteil für den Account Manager |
| --- | --- | --- | --- |
| **Criteria Workshop** | ⚪ Geplant | Hilft, relevante Entscheidungskriterien gemeinsam zu sammeln, zu strukturieren und zu hinterfragen. | Du kannst einen Kundenworkshop gezielter moderieren und erkennst früh, welche Kriterien die spätere Auswahl wirklich beeinflussen. |
| **Value Triangle** | ⚪ Geplant | Stellt Kundenbedarf, eigene Stärke und Fähigkeiten der Wettbewerbsalternativen gegenüber. | Du identifizierst schneller **echte Differenzierung**, die für den Kunden relevant ist, statt nur Produktfeatures gegenüberzustellen. |
| **Danger Zone** | ⚪ Geplant | Zeigt Kriterien, die für den Kunden wichtig sind, bei denen die Konkurrenz stark ist und das eigene Angebot schwächer aufgestellt ist. | Du erkennst kritische Wettbewerbsrisiken früh und kannst entscheiden, ob du sie adressieren, beeinflussen oder bewusst umgehen musst. |
| **POC Success Criteria** | ⚪ Geplant | Hilft, vor einem POC oder Pilot konkrete und überprüfbare Erfolgskriterien festzulegen. | Du vermeidest technisch erfolgreiche POCs ohne klare Konsequenz und schaffst vorab Klarheit darüber, **wann ein POC als erfolgreich gilt und was danach passiert**. |
| **Decision Matrix** | ⚪ Später geplant | Stellt Kriterien, Gewichtung und Bewertung strukturiert gegenüber. | Du kannst komplexe Auswahlentscheidungen transparenter machen und mit dem Kunden nachvollziehbar diskutieren. |

### Economic Buyer

| Funktion | Status | Was macht sie? | Vorteil für den Account Manager |
| --- | --- | --- | --- |
| **EB Qualifier** | ⚪ Geplant | Hilft zu prüfen, ob eine Person tatsächlich die wirtschaftliche Entscheidungsautorität besitzt. | Du vermeidest, einen Champion oder fachlichen Entscheider fälschlich als Economic Buyer einzuordnen. |
| **EB Meeting Prep** | ⚪ Geplant | Bereitet einen Termin mit dem Economic Buyer auf Value, Kernfragen, relevante Metrics und gewünschtes Commitment vor. | Du kannst einen seltenen Executive-Termin fokussierter nutzen und gehst mit einem klaren Ziel statt einer normalen Produktpräsentation hinein. |
| **EB Access Strategy** | ⚪ Geplant | Strukturiert mögliche Wege zum Economic Buyer und bewertet sinnvolle nächste Schritte. | Du erhältst konkrete Optionen, wenn du noch keinen direkten EB-Zugang hast, statt dich ausschließlich auf deinen aktuellen Ansprechpartner zu verlassen. |
| **EB Value Story / Executive Value Narrative** | ⚪ Geplant | Verdichtet Pain, Metrics, Nutzen und Why Now zu einer managementgerechten Value Story. | Du kannst deinen Business Value auf die Informationsbedürfnisse eines Executives zuschneiden und vermeidest zu technische oder zu detaillierte Gespräche. |

### Champion

| Funktion | Status | Was macht sie? | Vorteil für den Account Manager |
| --- | --- | --- | --- |
| **Champion Tester** | ⚪ Geplant | Prüft anhand konkreter Verhaltensmerkmale wie Einfluss, internes Verkaufen, persönlicher Nutzen und Zugang, ob ein Kontakt tatsächlich als Champion belastbar ist. | Du reduzierst das Risiko, einen freundlichen oder engagierten Ansprechpartner fälschlich für einen Champion zu halten. |
| **Champion Development Helper** | ⚪ Geplant | Zeigt, welche Eigenschaften oder konkreten Handlungen noch fehlen, damit ein Kontakt eine stärkere Champion-Rolle übernehmen kann. | Du bekommst Anhaltspunkte, **wie du einen potenziellen Champion entwickeln und testen kannst**, statt nur „Champion vorhanden: ja/nein“ zu bewerten. |
| **Internal Selling Pack** | ⚪ Geplant | Stellt einem Champion eine kompakte Argumentationsgrundlage für das interne Verkaufen bereit. | Dein Champion kann Value, Why Now, Differenzierung und relevante Argumente intern leichter vertreten, wenn du selbst nicht im Raum bist. |

### Competition & Closing

| Funktion | Status | Was macht sie? | Vorteil für den Account Manager |
| --- | --- | --- | --- |
| **Competition / Alternatives Map** | ⚪ Geplant | Erfasst nicht nur andere Anbieter, sondern auch Eigenbau, andere Initiativen, Ressourcenprioritäten und Status quo. | Du erkennst, **gegen welche Alternative du tatsächlich verkaufst**, statt nur nominelle Wettbewerber zu betrachten. |
| **Differentiation Strategy** | ⚪ Geplant | Verbindet Kundenkriterien, eigene Stärken und Wettbewerbsunterschiede zu einer gezielten Differenzierungsstrategie. | Du kannst deine Verkaufsargumentation stärker auf relevante Unterschiede konzentrieren und vermeidest generische Feature-Vergleiche. |
| **Build vs. Buy Helper** | ⚪ Geplant | Strukturiert die wirtschaftlichen und organisatorischen Überlegungen zwischen Eigenentwicklung und Kauf. | Du kannst Eigenbau als echte Wettbewerbsalternative sachlicher diskutieren und versteckte Kosten oder Risiken sichtbar machen. |
| **Status Quo / Inertia Check** | ⚪ Geplant | Hilft zu verstehen, warum der Kunde möglicherweise gar nichts verändert und welche Argumente für das Nichtstun sprechen. | Du adressierst den häufig wichtigsten Wettbewerber: **keine Entscheidung**. |
| **Closing Readiness Checklist** | ⚪ Geplant | Prüft vor der Schlussphase kompakt die entscheidenden Punkte rund um Freigaben, Verantwortlichkeiten und Paper Process. | Du erkennst offene Closing-Risiken früher, ohne dafür einen Deal-Score oder ein zusätzliches Dashboard pflegen zu müssen. |
| **Paper Process Helper** | ⚪ Geplant | Unterstützt bei konkreten Fragen und nächsten Schritten innerhalb des administrativen Abschlussprozesses. | Du kannst schneller klären, welcher administrative Schritt als Nächstes notwendig ist und wer dafür verantwortlich ist. |
| **Dependency Check** | ⚪ Geplant | Prüft, welche noch offenen Schritte den Abschluss tatsächlich blockieren. | Du fokussierst dich auf echte Blocker statt auf eine lange unsortierte Aufgabenliste. |

---

## Checklists

Checklists sind für konkrete Situationen gedacht. Sie sollen in wenigen Minuten helfen, **nichts Wichtiges zu vergessen und MEDDPICC-Punkte korrekt zu verstehen**.

Jeder Checklist-Punkt soll bei Bedarf erklären:

**Prüffrage → Worum geht es? → Warum ist das relevant? → Woran erkenne ich es? → typische Fehlinterpretation → mögliche Frage oder Handlung**

### Situative Checklists

| Checklist | Status | Was macht sie? | Vorteil für den Account Manager |
| --- | --- | --- | --- |
| **Economic-Buyer-Termin** | ✅ Umgesetzt | Prüft vor dem Termin, ob Value, Metrics, Kernfragen und gewünschtes Ergebnis ausreichend vorbereitet sind. | Du kannst dich in wenigen Minuten auf einen wichtigen Executive-Termin vorbereiten und übersiehst weniger kritische Punkte. |
| **Discovery Call** | 🟡 Als Nächstes | Prüft vor einem Discovery-Gespräch Pain, Impact, Stakeholder, Hypothesen und gewünschte Erkenntnisse. | Du gehst strukturierter ins Gespräch und kannst vorhandene Gesprächszeit gezielter nutzen. |
| **POC / Pilot** | 🟡 Als Nächstes | Prüft Success Criteria, Verantwortliche, Commitment, Entscheidungsweg und den Prozess nach erfolgreichem POC. | Du reduzierst das Risiko eines aufwendigen POCs, der technisch funktioniert, aber anschließend keine Entscheidung auslöst. |
| **Pricing / Angebot** | 🟡 Als Nächstes | Prüft vor dem kommerziellen Angebot, ob Value, Entscheidungsweg und kommerzieller Kontext ausreichend verstanden sind. | Du verschickst Pricing seltener zu früh und kannst Preis stärker im Kontext des geschaffenen Value positionieren. |
| **Go-Live / Decision Process** | 🟡 Als Nächstes | Prüft Zeitplan, Verantwortlichkeiten, Abhängigkeiten und relevante Entscheidungs-/Freigabeschritte. | Du kannst einen Go-Live-Plan vor dem Kundengespräch schnell plausibilisieren und vermeidest leicht übersehene Prozesslücken. |
| **Closing / Paper Process** | 🟡 Als Nächstes | Prüft Einkauf, Legal, Datenschutz, Security, Signaturweg und weitere administrative Schritte vor der Schlussphase. | Du erkennst früher, ob ein Deal wirklich close-ready ist oder noch administrative Arbeit fehlt. |

### Themen-Checklists

| Checklist | Status | Was macht sie? | Vorteil für den Account Manager |
| --- | --- | --- | --- |
| **Metrics** | 🟡 Als Nächstes | Erklärt und prüft die wichtigsten Merkmale einer belastbaren Metric. | Du kannst schnell gegenprüfen, ob eine Kennzahl wirklich aussagekräftig ist oder nur eine unvalidierte Annahme darstellt. |
| **Economic Buyer** | ✅ Umgesetzt | Erklärt die zentralen Merkmale des Economic Buyers und typische Verwechslungen. | Du kannst Kontakte sicherer einordnen und vermeidest, Titel oder Seniorität mit echter wirtschaftlicher Entscheidungsautorität gleichzusetzen. |
| **Decision Criteria** | 🟡 Als Nächstes | Hilft, relevante Kriterien zu erkennen, einzuordnen und auf Vollständigkeit zu prüfen. | Du erkennst leichter, welche Kriterien die Auswahl wirklich beeinflussen und wo dir noch Wissen fehlt. |
| **Decision Process** | 🟡 Als Nächstes | Erklärt Validation, Approval, beteiligte Rollen und typische Prozesslücken. | Du kannst schneller prüfen, ob du den tatsächlichen Weg zur Entscheidung verstanden hast. |
| **Paper Process** | 🟡 Als Nächstes | Erklärt die administrativen Schritte zwischen Entscheidung und Unterschrift. | Du weißt, welche Fragen du zu Einkauf, Legal oder Signatur stellen solltest und verwechselst Paper Process nicht mit dem fachlichen Decision Process. |
| **Pain / Implication** | 🟡 Als Nächstes | Hilft zu prüfen, ob ein Pain nur beschrieben oder tatsächlich hinsichtlich seiner Konsequenzen verstanden wurde. | Du kannst schneller erkennen, ob genügend Business Relevanz vorhanden ist oder Discovery noch tiefer gehen muss. |
| **Champion** | 🟡 Als Nächstes | Erklärt die Merkmale eines Champions und typische Fehlinterpretationen wie Sympathie oder hohe Aktivität. | Du kannst Champion-Qualität besser beurteilen und weißt, welche Verhaltenssignale wirklich relevant sind. |
| **Competition** | 🟡 Als Nächstes | Erweitert den Wettbewerbsbegriff über direkte Anbieter hinaus. | Du vergisst Status quo, Eigenbau oder andere interne Prioritäten nicht als reale Alternativen. |

---

## Wissen

**Economic Buyer ist der erste vollständig umgesetzte Wissensbereich.** Die Seite erklärt Definition, praktische Bedeutung, Erkennungsmerkmale, typische Fehlinterpretationen, mögliche Fragen, Vorgehen ohne direkten Zugang und den relevanten Unterschied zwischen Whyte und Lahoutifard.

Die Wissenshilfe ist für Situationen gedacht, in denen du einen MEDDPICC-Begriff **kurz, korrekt und praxisnah nachschlagen** möchtest, ohne erneut im Buch suchen zu müssen.

| Wissensbereich | Status | Welche Frage beantwortet er? | Vorteil für den Account Manager |
| --- | --- | --- | --- |
| **Metrics** | 🟡 Als Nächstes | Wann ist eine Metric belastbar und wie wird daraus wirtschaftlicher Impact? | Du kannst Metrics schneller korrekt anwenden und vermeidest unklare oder nicht validierte Nutzenbehauptungen. |
| **Economic Buyer** | ✅ Umgesetzt | Woran erkennst du den Economic Buyer und wie unterscheidet er sich von Champion oder fachlichem Entscheider? | Du kannst Rollen sicherer einordnen und weißt, worauf es bei EB-Zugang und EB-Gesprächen wirklich ankommt. |
| **Decision Criteria** | 🟡 Als Nächstes | Welche Kriterien beeinflussen die Auswahl und wie lassen sie sich strukturieren? | Du kannst Entscheidungskriterien schneller verstehen, hinterfragen und in Kundengesprächen gezielter bearbeiten. |
| **Decision Process** | 🟡 Als Nächstes | Wie unterscheiden sich Validation und Approval und wer entscheidet wann? | Du verstehst den tatsächlichen Entscheidungsweg besser und kannst gezielter nach offenen Schritten fragen. |
| **Paper Process** | 🟡 Als Nächstes | Welche administrativen Schritte liegen zwischen Entscheidung und Unterschrift? | Du kannst Einkauf, Legal, Security und Signaturweg früher berücksichtigen und besser vom Decision Process unterscheiden. |
| **Pain & Implication** | 🟡 Als Nächstes | Wie wird aus einem Problem eine relevante geschäftliche Konsequenz? | Du bekommst eine schnelle Gedankenstütze, um Discovery tiefer zu führen und Pain nicht nur oberflächlich zu dokumentieren. |
| **Champion** | 🟡 Als Nächstes | Was macht einen echten Champion aus und welche Signale werden häufig überschätzt? | Du kannst Champion und engagierten Ansprechpartner klarer voneinander unterscheiden. |
| **Competition** | 🟡 Als Nächstes | Warum gehören Status quo, Eigenbau und andere Initiativen genauso zum Wettbewerb? | Du entwickelst ein vollständigeres Bild der tatsächlichen Alternativen und kannst deine Verkaufsstrategie besser darauf ausrichten. |

---

# Spätere Komfortfunktionen

Diese Funktionen werden erst relevant, wenn mehrere Tools produktiv sind.

| Funktion | Status | Was macht sie? | Vorteil für den Account Manager |
| --- | --- | --- | --- |
| **Ergebnis an Folgetool übergeben** | ⚪ Später geplant | Übernimmt relevante Ergebnisse eines Tools direkt in ein passendes nächstes Tool. | Du musst dieselben Informationen nicht mehrfach eingeben. |
| **Temporärer Session Context** | ⚪ Später geplant | Hält während einer Arbeitssession bereits bekannte Informationen für mehrere Tools verfügbar. | Mehrere Services lassen sich nacheinander nutzen, ohne jedes Mal bei null anzufangen. |
| **Gemeinsame kundenfähige Exporte** | ⚪ Später geplant | Bündelt Ergebnisse mehrerer Services in einem konsistenten Output. | Du kannst Ergebnisse schneller in Kundenterminen oder internen Reviews weiterverwenden. |
| **PDF / Präsentations-Export** | ⚪ Später geplant | Erstellt aus geeigneten Ergebnissen direkt nutzbare Dokument- oder Präsentationsformate. | Weniger manuelle Nacharbeit in PowerPoint oder anderen Dokumenten. |
| **Deal Pack Export** | ⚪ Später geplant | Stellt ausgewählte Ergebnisse einer Arbeitssession als kompaktes Paket zusammen. | Du kannst relevante Ergebnisse weitergeben oder dokumentieren, ohne dafür ein vollständiges Deal-System zu pflegen. |

---

# Aktuell umgesetzt: Go-Live-Rückwärtsplanung

Pfad: **Tools → Go-Live & Buying Process → Go-Live-Rückwärtsplanung**

### Eingaben

- Kunde und Titel optional
- Planungsdatum
- Target Go-Live
- optional: kundenseitiger Termin-Treiber / Compelling Event („Warum dieses Datum?“)
- beliebig viele Prozessschritte
- Reihenfolge der Schritte per Drag & Drop; Tastaturbedienung über den Drag-Griff
- pro Schritt: Bezeichnung, Dauer, Kalender-/Arbeitstage, Verantwortungsseite und Bereich
- optional pro Schritt: konkrete Person oder Rolle als Owner

### Ergebnis

- spätester errechneter Start
- deterministische Rückwärtsrechnung
- Vorlauf-/Kompressionshinweis
- dynamische Executive-Timeline im Roadmap-/Gantt-Stil
- zeitproportionale Prozessbalken mit semantischer Monats-/KW-Achse, Ownern und Go-Live-Ziellinie
- klar getrennte Kennzahlen für Prozessdauer und Puffer zum notwendigen Start
- Übergabepunkte zwischen den Prozessschritten; nur das Go-Live-Ziel wird besonders hervorgehoben
- standardmäßig eingeklappte Prozessdetails für eine ruhigere Kundenansicht
- Mobile-Führung mit Scroll-Hinweis und sticky Schrittnamen
- Live-Aktualisierung bei Dauer, Reihenfolge oder Go-Live-Änderungen
- SVG- und PNG-Export im gleichen kundenfähigen Visualstil
- exportoptimiertes Layout mit separater Legende/Achse, rechter Safe Area und konsistenter UI-Sans-Typografie

Die Funktion bleibt bewusst eine **Go-Live-Rückwärtsplanung / Go-Live-Timeline**. Der umfassendere **Go-Live Plan Builder** bleibt als separates späteres Tool vorgesehen. Parallelisierung und Critical-Path-Logik werden nicht implizit behauptet.

Der Quellenabgleich für diesen Slice ist in `docs/REVERSE_TIMELINE_SOURCE_QA.md` dokumentiert.

Arbeitstage berücksichtigen in v0.1 Montag bis Freitag. Feiertage werden bewusst nicht automatisch angenommen.

---

# Produktprinzipien

- **Konkrete Aufgabe vor Datenpflege.**
- **Nur die Eingaben abfragen, die ein Service wirklich benötigt.**
- **Nutzer müssen schnell verstehen, wann ein Service hilft und welches Ergebnis er liefert.**
- **Checklists erklären statt nur abhaken zu lassen.**
- **Wissensinhalte sollen typische Fehlinterpretationen ausdrücklich adressieren.**
- **Kundenfähige Outputs dort erzeugen, wo sie echte Arbeit ersparen.**
- **Local-first und deterministisch by default.**

Die Anwendung ist bewusst kein vollständiges CRM- oder Opportunity-Management-System. Die detaillierten Scope-Grenzen stehen in `docs/PROJECT_CHARTER.md` und `docs/ROADMAP.md`.

## Fachliche Fundierung

Die fachliche Ausrichtung stützt sich primär auf die bereitgestellten Werke von Andy Whyte und Darius Lahoutifard. Softwarelogik, Informationsarchitektur und konkrete UI-Formulierungen sind eigene Produktentscheidungen. Unterschiede zwischen den Autoren sollen bei Wissensinhalten sichtbar gemacht werden, wenn sie für die praktische Anwendung relevant sind.

## Technische Basis

- Vue 3, TypeScript, Vite und Vue Router
- Vitest und Playwright
- GitHub Actions / GitHub Pages
- Lucide Icons
- Design Tokens und Accessibility-Baseline
- local-first Browser-Anwendung

## Qualitätsgates

Vor Merge eines Feature-PRs werden mindestens Formatierung, Lint, Unit Tests, Production Build, Pages-Integrität und Playwright für Desktop und Mobile geprüft.

## Dokumentation

- Projektauftrag: `docs/PROJECT_CHARTER.md`
- Architektur: `docs/ARCHITECTURE.md`
- Roadmap: `docs/ROADMAP.md`
- Fortschritt: `docs/PROGRESS.md`
- Design System: `docs/DESIGN_SYSTEM.md`
- Regeln der Go-Live-Rückwärtsplanung: `docs/REVERSE_TIMELINE_RULES.md`
- Agent-Anweisungen: `AGENTS.md`

## Lizenz

MIT. Siehe LICENSE.
