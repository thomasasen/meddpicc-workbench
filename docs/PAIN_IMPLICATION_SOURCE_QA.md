# Pain / Implication – Quellenprüfung und simuliertes Autoren-Red-Team

Stand: 08.10.2026. Grundlage sind die **beiden im Projekt hinterlegten EPUB-Originaltexte**, nicht Rezensionen oder fremde Zusammenfassungen. Bei EPUBs werden **keine Seitenzahlen** behauptet. Die folgenden Kritiker sind **simulierte fachliche Perspektiven**, keine echten Reviews der Autoren.

## Quellenmatrix

| Fachliche Aussage | Autor / Original-Fundstelle | Umsetzung | Grenze / Autorenunterschied |
| --- | --- | --- | --- |
| Identify → Indicate → Implicate ist eine qualifikatorische Vertiefung. | Andy Whyte: **IMPLICATE THE PAIN → Identify, Indicate, or Implicate the Pain? → The Three I’s Transition** | Wissensabschnitt mit drei Stufen; Checklist `identify`, `indicate`, `implicate` | **Nicht** Lahoutifards dreiteiliges Modell. Whyte spricht ausdrücklich von Seller-Taktiken. |
| Pain wird nach Financial, Efficiency und People eingeordnet und einem Owner zugeordnet. | Whyte: **IMPLICATE THE PAIN → The 3 Types of Pain; Who Owns the Pain?** | Stakeholder- und Business-Impact-Prüfung; Perspektive im Quellenbereich | Diese Typologie ist **nicht** identisch mit Lahoutifards Business-/Capability-Pain. |
| Indicate betrifft Quantifizierung, typischerweise mit Champion und Business Case. | Whyte: **The Three I’s Transition → Tactics to Indicate the Pain** | Schätzwerte als Schätzwerte und gemeinsame Herleitung in Checklist und Beispiel | Whyte nennt ROI-Taktiken. **Nicht** jede Verkäuferrechnung ist validierte Kundenevidenz. Diese Strenge ist zusätzliche QS. |
| Implicate soll die negative Auswirkung wirksam machen und Dringlichkeit erhöhen. | Whyte: **The Three I’s Transition → Tactics to Implicate the Pain; Pain Creates Urgency; Mid-Stages** | Käuferverständnis mit eigener Aussage und Handlung prüfen | Käufer-Eigenäußerung als **Evidenztest ist Praxisableitung**, nicht Whytes wörtliche Mindestbedingung. Nicht künstlich Angst erzeugen. |
| Discovery braucht Credibility, Beispiele und echte Vertiefung. | Whyte: **Uncover Pain via Discovery; Implicate the Pain in your Sales Process** | offene Fragen, laufende Hypothesenprüfung, Validierung | Ein Discovery-Termin allein beweist keinen qualifizierten Pain. |
| Business-Pain und Capability-Pain sind zwei unterschiedliche Perspektiven, die sich überschneiden können. | Darius Lahoutifard: **Chapter Seven – Identify Pain → Types of Pain** | Knowledge-Karten und Punkt `type` | Keine 1:1-Übersetzung von Whytes Financial/Efficiency/People. |
| Positive, offene Fragen; T.H.E.D.; keine aggressive „Problem“-Anrede. | Lahoutifard: **Chapter Seven → How to Identify the Pain?; Language is Important; The MEDDIC Questions** | erste Fragen zu funktionierendem Prozess und Verbesserungsziel; Checklist ohne Druck | Fragen sind deutsche **Sinngemäß-Übertragungen**, keine wörtlichen Zitate. |
| Konsequenz der Nichtentscheidung und gewünschtes Ergebnis separat klären. | Lahoutifard: **Chapter Seven → Consequence; Desired Outcome; Get More Information about the Pain?** | Abgrenzung Pain/Outcome; Checklist `outcome`/`why-now` | Ein Ziel-KPI darf nicht als bestätigte Ursache oder bereits realisierte Einsparung gelten. |
| Kundenfrist, wirtschaftlicher Anlass und Folgen einer Verzögerung ergründen. | Lahoutifard: **Chapter Seven → Urgency: Compelling Event** | keine fingierte Deadline; Fragen nach Auslöser und Folge | Eine Seller-Quartalsfrist ist **kein** Kundenevent. „Need vs. Want“ nicht als pauschales Seller-Urteil. |
| Tiefere Fragen schaffen Consultative Selling. | Lahoutifard: **Chapter Seven → The Challenger Consultant** | konkrete Folgefrage statt automatischem Pitch | Kein Beleg für ein universelles, manipulativeres Skript. |
| Die Sicht eines Champions ersetzt nicht automatisch die wirtschaftlich betroffenen Stakeholder. | Whyte: **Who Owns the Pain?; Mid-Stages**; Lahoutifard: **Urgency: Compelling Event; Get More Information about the Pain?** | Prüffrage Pain-Owner; Links zu Economic Buyer | Economic Buyer und Pain-Owner **nicht pauschal identisch**; Team-/Rollenprüfung bleibt situationsabhängig. |

## Praxisableitungen, nicht als Buchschema ausgeben

- Das Fünf-Stufen-Evidenzraster **Beobachtung → Kundenaussage → Verkäuferhypothese → quantifizierte Annahme → bestätigte Kundenevidenz** ist ein eigenständiges Qualitätsmodell.
- Die Rechnung mit **acht Personen und zwei Stunden pro Woche** ist vollständig konstruiert. Weder Personenzahl noch Aufwand sind bestätigte Kundendaten. Keine Umrechnung in fingierte Euro-Werte, kein ROI-Versprechen.
- Eine vom Kunden selbst erklärte Konsequenz und ein kundenseitiger Validierungsschritt sind im Produkt ein **Evidenztest** für Implication, keine vorgeblich wörtliche Autorenregel.
- Quellen werden gemäß `AGENTS.md` bei Knowledge und Checklist **nur am Seitenende** in standardmäßig geschlossenem `details` gezeigt.
- Die Checkboxen sind temporäre Denkhilfen. **Kein Local Storage, kein Deal-Score, keine Persistenz und keine neue Opportunity-Pflege.**

## Simuliertes Red-Team – vor Implementierung

| Perspektive / Fundstelle | Strittige Ausgangsbehauptung | Warum problematisch | Unmittelbare Korrektur | Prüfung / Beleg |
| --- | --- | --- | --- | --- |
| Whyte: The Three I’s Transition | „Wir haben den Pain im Discovery identifiziert, damit ist er implicated.“ | Identify überspringt Indicate und Implicate. | Drei getrennte Stufen in Knowledge und Checklist `identify`, `indicate`, `implicate`. | Unit-Test Stufen; E2E Abschnitt sichtbar. |
| Whyte: Tactics to Indicate; Mid-Stages | „Unsere ROI-Folie ist der Impact-Beleg.“ | Kundeneigene Herleitung und Bestätigung fehlen. | Ungeprüfte Werte als **Annahmen** ausweisen, Quelle und Bestätigung erfragen. | Unit-Test `Rechenannahme`; E2E Szenario. |
| Whyte: Who Owns the Pain?; Implicate | „Die Ansprechpartnerin ist überzeugt. Mehr braucht es nicht.“ | Pain-Owner und Buyer-Priorität unbekannt. | Stakeholder-Frage und Käuferäußerung/Handlung als Evidenztest. | Punkte `owner` und `implicate`, Unit-Test. |
| Lahoutifard: Language is Important | „Was ist mit Ihrem Geschäft falsch?“ | Negativer, manipulativer Einstieg widerspricht positiver Gesprächsführung. | Offener positiver Einstieg und T.H.E.D.-artige Vertiefung. | Unit-Test Fragen; Knowledge-Liste. |
| Lahoutifard: Types of Pain | „Keine API beweist millionenschweren Business Pain.“ | Capability ≠ wirtschaftliche Konsequenz. | Typen getrennt; Business-Folge als zu bestätigende Frage. | Punkt `type`; Unit-Test Typologie. |
| Lahoutifard: Desired Outcome | „15 % schneller ist der bestätigte aktuelle Schaden.“ | Zielwert ≠ Ausgangslage, Ursache oder monetärer Effekt. | Trennung Pain, Ziel-KPI, Metric. | Abgrenzungskarten und Punkt `outcome`. |
| Lahoutifard: Urgency: Compelling Event | „Unser Quartalsende ist die Kundenfrist.“ | Künstlicher Compelling Event. | Kundenfrist nur mit Ursache und Verzögerungsfolge anerkennen. | Red Flag, Punkt `why-now`, Unit-Test. |
| Beide | „Drei I und Business-/Capability-Pain sind dasselbe Framework.“ | Falsche Attribution und veränderte Fachbedeutung. | Getrennte Abschnitte und Quellenhinweis am Ende. | Unit-Test Autorensicht. |
| UX / `AGENTS.md` | Autorenlabel unter jeder Karte und Häkchen dauerhaft speichern | Verstößt gegen Quellen-UX und Produktgrenzen. | Kein Autorenlabel in Fachkarten, ein geschlossenes Quellendetail; in-memory Häkchen. | E2E Quellen-/Reload-Test; Vue-Review. |

## Simuliertes Red-Team – nach Implementierung

| Kritiker / Fundstelle | Erneuter Angriff | Ergebnis und Korrektur | Nachprüfung |
| --- | --- | --- | --- |
| Whyte: Three I’s Transition | Indicate kann leicht wie automatisch valide Kundenzahl wirken. | **Korrigiert:** Ausmaß ist gemeinsam zu erarbeiten, Schätzungen ausdrücklich markiert; Käuferverständnis nicht mit Seller-Präsentation gleichgesetzt. | Unit-Assertions, Szenariotext und Checklist. |
| Whyte: Implicate the Pain | Käufer-Eigenaussage könnte ihm als wörtliche Norm untergeschoben werden. | **Korrigiert:** Quellenbereich und Matrix kennzeichnen das als eigene Praxisableitung; Whytes aktive Seller-Taktiken ausdrücklich erwähnt. | Test auf getrennte Perspektiven, Quellenbereich. |
| Lahoutifard: Consequence / Urgency | Konsequenz kann ohne nachvollziehbaren Zeitpunkt zu künstlicher Dringlichkeit führen. | **Korrigiert:** `why-now` trennt Folge einer Nichtentscheidung von belegtem Compelling Event. | Unit-Test keine Verkäuferdeadline; Checklist. |
| Lahoutifard: Language is Important | Discovery könnte ein drängender Fragenkatalog werden. | **Korrigiert:** positive Startfragen, situative Folgefragen, keine Pflicht, alles linear zu stellen. | Questions-Test und Knowledge-Intro. |
| Beide: Quellen | Ein Praxisraster könnte wie ein wissenschaftlich validiertes Buchschema aussehen. | **Korrigiert:** Das Raster und das vollständig konstruierte Szenario sind als eigene Arbeit gekennzeichnet. | `sourceNotes` und E2E konstruierte Zahlen. |
| Produkt-UX | 10 Prüfpunkte könnten in der Standardansicht überladen. | **Korrigiert:** Nur Fragen sofort sichtbar, Details per `details`, wiederverwendete `ChecklistView`. | E2E prüft geschlossene/offene Details. |

## Bekannte fachliche Grenzen

- Die konkrete Zahl oder Frist eines echten Deals muss stets erst beim Kunden überprüft werden. Das Produkt nimmt **keine automatische Qualification** vor.
- Der Prüfschritt „Kunde beschreibt die Konsequenz selbst“ macht ein Buyer-Commitment **wahrscheinlicher sichtbar**, garantiert aber weder Priorität noch Abschluss.
- Externe Frameworks wie SPIN oder SPICED werden nicht als gemeinsames Autorenmodell ausgegeben. Ein Discovery-Link ist eine thematische Navigation, keine Quellenzuschreibung.
- Diese Prüfung ersetzt weder eine Live-Autorenbewertung noch die spätere visuelle Freigabe durch den Nutzer.

## Technische Abnahmematrix

- Unit: Typologie, Three I’s, positive Fragen, Evidence/Annahmen, Compelling Event, 10 Punkte, no scoring.
- Playwright Desktop/Mobile: Navigation, Quellen am Ende geschlossen/aufgeklappt, Red Flags, 10 Punkte, Haken nach Reload weg, reale Querverweise, Browserkonsole ohne Fehler, Overflow bei 375/768/1024/1440.
- Vier Browserbilder: `pain-knowledge-desktop-chromium.png`, `pain-knowledge-mobile-chromium.png`, `pain-checklist-desktop-chromium.png`, `pain-checklist-mobile-chromium.png` im Playwright-Testartefakt.
- Format/Lint/Unit/Build/E2E/Pages: **Ergebnis nur anhand tatsächlich absolvierter CI-Runs angeben**, nicht vorwegnehmen.
