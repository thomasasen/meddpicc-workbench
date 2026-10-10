# MEDDPICC Toolbox

> **Cost of Delay:** Seit PR #61 (10.10.2026, Commit `7759a7e`) in `main`. Unter `/#/tools/cost-of-delay` werden zeitliche Verzögerungsszenarien ohne erfundene EUR-Wirkung verglichen.

Praktische **Tools, Checklists und Wissenshilfen** für wiederkehrende Aufgaben im komplexen B2B-Vertrieb.

Die Toolbox soll einem Account Manager vor allem eine Frage beantworten:

> **Was hilft mir bei meiner aktuellen Aufgabe – und wie komme ich schnell zu einem brauchbaren Ergebnis?**


### Metric Builder – Value & Metrics (Feature-Branch)

Der Metric Builder führt über Problem, Before/After und wirtschaftliche Realisierung zu einer überprüfbaren Metric Card. Alle sieben Metric-Typen verwenden die bestehenden Software-Payback-Formeln. Reine Kapazität, Risiko und qualitative Effekte werden nicht automatisch monetarisiert. Ein kundenfähiger PDF-Steckbrief entsteht lokal im Browser. Die ausdrückliche Übernahme in Software-Payback fügt nur **nicht aktivierte** Metrics hinzu; vorhandene Kosten bleiben bei der vorgesehenen Rücknavigation erhalten. Quellen, Formeln und fachliche Abnahme: [Metric Builder Red Team](docs/METRIC_BUILDER_RED_TEAM.md). Stand: Feature-Branch mit abgeschlossener technischer und visueller Abnahme ([CI #38007800785](https://github.com/thomasasen/meddpicc-workbench/actions/runs/38007800785): 115 Playwright-Tests bestanden, 1 übersprungen, Format/Lint/Unit/Build/Pages/PDF erfolgreich); PR #60 wartet auf ausdrückliche Nutzerfreigabe, nicht in `main`.

### Metrics – Knowledge und Checklist

**Umgesetzt mit PR #45: fachlich mit Whyte und Lahoutifard abgeglichen, technische CI #412 grün und Desktop-/Mobile-Screenshots geprüft.**

- **Wissen → Metrics:** Definition, Before-/After-State, Economic Impact, M1-Proof-Points vs. kundenspezifische M2-Metrics, Validierung sowie Sichtweisen von Whyte und Lahoutifard.
- **Checklist → Metrics:** sieben kompakte Prüfpunkte mit Erklärung, Erkennungsmerkmalen, typischen Fehlinterpretationen und konkreten Discovery-Fragen.
- Die Content-Basis wird zwischen Knowledge und Checklist wiederverwendet. Checkboxen sind nur temporäre Denkhilfen, kein Deal-Score.
- Die fachliche Quellenprüfung steht unter [Metrics Source QA](docs/METRICS_SOURCE_QA.md).

### Discovery Call – MEDDPICC und SPICED

**Seit PR #46 in `main` (08.10.2026):**

- **Checklist → Discovery Call:** neun persönliche Prüfpunkte vor, während und nach dem Gespräch; offene Lücken statt künstlicher Score.
- **Wissen → Discovery Call:** Whytes kontinuierliche Discovery und Two-Sided Discovery, Lahoutifards positive T.H.E.D.-Fragen, zusätzlich das SPICED-Modell von Winning by Design.
- **ACE-Einstieg:** Appreciate, Check End Time, End Goal nach dem offiziellen Blueprint „The Perfect Discovery Call“.
- Fachliche Belege, Grenzen und Unterschiede in [Discovery Call Source QA](docs/DISCOVERY_CALL_SOURCE_QA.md).
- Keine Deal-Pflege, kein Transcript, kein KI-Zwang.

### Decision Process – Knowledge und Checklist

**Seit PR #48 in `main` (08.10.2026), mit Nutzerfreigabe gemergt.**

- **Wissen → Decision Process:** Technical Validation, Business Approval, Entscheidungsrechte, Gremien, Zeitpunkte, Abhängigkeiten und klare Abgrenzung zu Decision Criteria und Paper Process.
- **Checklist → Decision Process:** zehn nachvollziehbare Prüfungen mit konkreten Fragen und typischen Fehlinterpretationen; keine gespeicherten Scores oder Deal-Daten.
- Der fachliche Quellenabgleich und das simulierte Autoren-Red-Team stehen in [Decision Process Source QA](docs/DECISION_PROCESS_SOURCE_QA.md).

### Paper Process – Knowledge und Themen-Checklist

**Seit PR #49 am 08.10.2026 in `main` (Squash-Commit `2504170512cd9d5475e50b6dbea9be97064825a6`).**

- **Wissen → Paper Process:** Abgrenzung zu Decision Process und Approval, Prozess/Personen/Timing, situative Einkaufs- und Vertragsstationen, Go-Live-Rückwärtsplanung, SaaS-Beispiel und Warnsignale.
- **Checklist → Paper Process:** zehn fachliche Prüfpunkte mit Evidenz und Next Steps; temporäre Checkboxen ohne Score oder Persistenz.
- [Primärquellenmatrix und simuliertes Autoren-Red-Team](docs/PAPER_PROCESS_SOURCE_QA.md).

### Pain / Implication – Knowledge und Themen-Checklist

**Seit PR #50 am 08.10.2026 per Squash-Merge in `main` (Commit `a84d1b0d8be23db9d9ca8eec0a3531a96840a4f5`; PR-CI #529 erfolgreich).**

- **Wissen → Pain / Implication:** Whytes Identify/Indicate/Implicate und Lahoutifards ergänzender Blick auf Business-/Capability-Pain, Consequence, Outcome und kundenseitige Urgency.
- **Checklist → Pain / Implication:** zehn inhaltliche Prüfpunkte mit Evidenz, typischen Fehlinterpretationen und natürlichen Folgefragen, ohne Score oder Speicherung.
- [Primärquellenmatrix und simulierte Autoren-Red-Teams](docs/PAIN_IMPLICATION_SOURCE_QA.md).

### Champion – Knowledge und Themen-Checklist

**Seit PR #51 am 08.10.2026 per Squash-Merge in `main` (Commit `5391d84e96bdff4e2490caa022de61ef8f84ba3b`; PR-CI #536 erfolgreich).**

- **Wissen → Champion:** Kontakt, Coach, Kandidat und erprobter Champion; drei explizite Kriterien nach Whyte sowie ergänzende Lahoutifard-Perspektive; nachvollziehbare interne Fürsprache, EB-Zugang, Personal Win, angemessene Tests und ein frei konstruiertes B2B-CRM-Szenario.
- **Checklist → Champion:** zehn fachliche Prüffragen mit Evidenz, Fehlinterpretationen und Next Steps. Häkchen flüchtig, kein Deal-Score und keine Kontakt-/Opportunity-Pflege.
- [Primärquellenmatrix und simulierte fachliche Red-Teams](docs/CHAMPION_SOURCE_QA.md). Champion Tester, Development Helper und Internal Selling Pack bleiben für T8 geplant.

### Aktualisierte Beispielwerte für den Software-Payback (09.10.2026)

Im Projektmodus stehen zwei ausdrücklich fiktive Szenarien bereit: die bewährte Kurzrechnung (120.000 EUR einmalig, 3.000 EUR/Monat SaaS, Payback Monat 18) und ein detailliertes **CRM-/SaaS-Beispiel mit Kunden-Metrics**. Es enthält 480.000 EUR gestaffelte Einmalkosten, SaaS für 8.000 EUR monatlich, ab Monat 10 entfallende Altsystemkosten von 3.000 EUR monatlich und drei wirtschaftliche, ausdrücklich unbestätigte Metrics mit zusammen 320.000 EUR/Jahr Vollnutzen. Ein rechnerischer Kapazitätswert von 1.360.680 EUR/Jahr sowie eine fiktive 40.000-EUR-Risikoschätzung bleiben außerhalb des Payback; Break-even **Projektmonat 35**.

Die zugehörige [Demo-Opportunity](examples/demo-opportunity.meddpicc) verwendet dieselbe fiktive Story. Die Legacy-Projektdatei befüllt den eigenständigen Rechner jedoch **nicht automatisch**; ROI in Prozent wird ebenfalls nicht berechnet.

### Business-Case-Stresstest – Economic-Buyer-Szenarien (PR #59, 10.10.2026)

**In `main` integriert:** [PR #59](https://github.com/thomasasen/meddpicc-workbench/pull/59). Die Software-Payback-Engine nutzt weiterhin die V4-Basisrechnung. Neu sind ein konservativer und ein optimistischer Fall mit einzeln editierbaren Änderungen bei Kundennutzen, Einmalkosten und Nutzenverzögerung. Ausgewählte Variante, KPI-Zusammenfassung, V4-Wertverlauf und Kunden-PDF basieren auf derselben Monatsrechnung; die Basis-Eingaben bleiben unverändert. Kündigungs- und Lizenztermine ändern sich nicht automatisch.

- Im Abschnitt **„Wie belastbar ist die Wirtschaftlichkeit?“** werden Amortisation, Endsaldo und Abweichung für alle drei Fälle ausgewiesen. Die V4-Fortführung wird für den aktiven Fall separat und nur unter erfüllten Bedingungen dargestellt.
- **Kundenbericht 4 Seiten** einschließlich übersichtlichem Szenariovergleich; **Finance-Anhang** mit vollständiger Basis-Herleitung und eigenem Sensitivitätskapitel. Alle gerenderten Beispielseiten, Original-PDFs und Desktop-/Mobilbilder sind in der [CI-Abnahme](https://github.com/thomasasen/meddpicc-workbench/actions/runs/38003943054) dokumentiert.
- [Fachliche Herleitung, fünf simulierte EB-Reviews in drei Phasen, gefundene Fehler und visuelle Abnahme](docs/BUSINESS_CASE_SCENARIO_RED_TEAM.md). Szenarien sind keine Prognosewahrscheinlichkeiten; Ergebnisse sind keine Cashflow- oder Liquiditätsrechnung.

### Quick-Payback-GUI: Feinschliff und Browser-QS (09.10.2026)

- Der Einstieg erfolgt über zwei beschriftete Auswahlflächen: **Schnellberechnung** (drei Werte) oder **Softwareprojekt & Kunden-Metrics** (zeitlicher Verlauf). Der Nutzer wird in der Projektansicht durch **Kosten → Kundennutzen → Ergebnis** geführt.
- Kurztexte statt Bedienungsanleitung; passende Aktionen und ein ausdrücklich fiktives Beispiel direkt im ersten Abschnitt. Seltene Nachweis-/Zeitangaben sind in „Zeitplan & Herkunft“ aufklappbar.
- Einheitliche Feldhöhen, konsistente Spaltenausrichtung, mobile Kartenköpfe und Tastaturfokus; die Monatstabelle scrollt auf schmalen Displays **innerhalb ihres Rahmens**.
- [Dokumentierte UX-Abnahme, echte Chromium-Bilder und Tests](docs/QUICK_PAYBACK_UX_QA.md) – [CI #37904430171](https://github.com/thomasasen/meddpicc-workbench/actions/runs/37904430171): **230 Unit-Tests, 93 Playwright-Tests bestanden, 1 übersprungen**; Code ist im Feature-Branch, **kein Merge auf `main`**.

### Softwareprojekt & Customer Metrics · Quick-Payback-Erweiterung (PR #53)

**Technisch und visuell geprüft im Feature-Branch, noch nicht in `main`.** [CI #37862223720](https://github.com/thomasasen/meddpicc-workbench/actions/runs/37862223720): 230 Unit-Tests, 91 Playwright-Tests bestanden (1 übersprungen), Format/Lint/Build/Pages-Prüfung erfolgreich.

- **Schnellberechnung** bleibt der Standard mit drei EUR-Eingaben. Der zusätzliche Modus **„Softwareprojekt & Kunden-Metrics“** ist nur bei Auswahl sichtbar.
- Mehrere einmalige Implementierungs-/Migrationskosten, laufende SaaS-Kosten und tatsächlich wegfallende Altsystemkosten; monatlich/jährlich als wirtschaftliche Beträge, nicht als exakte Zahlungsströme.
- Unbegrenzt im normalen Umfang erweiterbare Metrics (technische Obergrenze 100): direkte EUR-Effekte, Vorgangskosten, Zeit, Conversion/Deckungsbeitrag, Qualität/Fehler und separat ausgewiesene Risiko-/qualitative Metrics.
- Monatlicher Nutzenstart, Ramp-up, optionaler Endmonat und Datenherkunft. Realisierungsbegründung für angerechnete Metrics; Risiko/Kapazität zählen nicht automatisch als sichere Ersparnis. Wirkungsgruppen blockieren unklare Doppelzählung.
- Monatliche Simulation über 36 oder 60 Monate, zwei Payback-Zeitpunkte (erste / innerhalb des Horizonts anhaltende Nullpunktüberschreitung), kumulierter EUR-Saldo, zugängliche Monats-Tabelle sowie SVG-/PNG-Grafik und kopierbare Management-Zusammenfassung.
- [Originalquellen und simuliertes fachübergreifendes Red Team](docs/SOFTWARE_PAYBACK_RED_TEAM.md). Die modellierten Perspektiven sind keine authentischen Empfehlungen oder Freigaben der Buchautoren.
- [Vier neue Original-Screenshots](docs/review-screenshots/software-payback-result-mobile-chromium.png) in `docs/review-screenshots/`: Projektmodus leer/Ergebnis jeweils Desktop und Mobile. Zusammen mit vier ursprünglichen Quick-Payback-Bildern acht überprüfbare Aufnahmen.

### Quick Payback – Value & Metrics Tool (T3)

**Implementierung auf `feature/quick-payback-tool`, visuelle/technische Draft-Abnahme offen; kein Merge auf `main`.**

- [Quick-Payback-Tool](/meddpicc-workbench/#/tools/quick-payback) mit drei EUR-Inputs, transparenter Formel, Grenzfällen, fiktivem Demo und kopierbarer Schätzung.
- Ohne Login, Deal-State, Datenspeicherung, AI oder Backend. Kein ROI, keine finanzielle Freigabe und kein Forecast.
- [Primärquellen, simulierte Red-Teams und QA-Gates](docs/QUICK_PAYBACK_SOURCE_QA.md).

### Competition – Knowledge und Themen-Checklist

**Seit PR #52 am 09.10.2026 in `main` (Squash-Commit `c4e99ec682452c29998f33a128deadd8225c90d3`; CI [#37848576751](https://github.com/thomasasen/meddpicc-workbench/actions/runs/37848576751) erfolgreich).**

- **Wissen → Competition:** vier Alternativarten, kundenseitige Evidenz, Political/Technical/Commercial, Value-Triangle-Zonen, faire Differenzierung und ein ausdrücklich frei konstruiertes CRM-/SaaS-Beispiel.
- **Checklist → Competition:** zehn unabhängige Prüffragen mit Signalen, Fehlinterpretationen und sinnvollen nächsten Discovery-Fragen; Checkboxen bleiben flüchtig.
- [Primärquellenmatrix und simulierte Red-Teams](docs/COMPETITION_SOURCE_QA.md). Die interaktiven Value-Triangle-/Criteria-Tools bleiben T6; Competition-Microtools bleiben T9.

## Status

| Status | Bedeutung |
| --- | --- |
| ✅ **Umgesetzt** | Funktion ist implementiert und nutzbar. |
| 🟡 **In Draft-Abnahme** | Funktion liegt im Feature-PR, ist aber noch nicht gemergt und benötigt Freigabe. |
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
| **Quick Payback** | ✅ In main | Schneller Payback und optionaler Softwareprojekt-Modus mit zeitlichem SaaS-/Nutzenverlauf und Kunden-Metrics. | Du kannst dem Kunden schnell und verständlich zeigen, **wann der Break-even erreicht wird**, ohne selbst Formeln oder Excel aufzubauen. |
| **Metric Builder** | 🟡 PR #60 geprüft, wartet auf Freigabe | Hilft, aus einem Pain oder gewünschten Outcome eine belastbare, nachvollziehbare Kennzahl abzuleiten. | Du kommst schneller von Aussagen wie „das kostet uns viel Zeit“ zu einer Metric, mit der sich ein Business Case wirklich begründen lässt. |
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
| **Discovery Call** | ✅ Umgesetzt | Prüft vor einem Discovery-Gespräch Pain, Impact, Stakeholder, Hypothesen und gewünschte Erkenntnisse. | Du gehst strukturierter ins Gespräch und kannst vorhandene Gesprächszeit gezielter nutzen. |
| **POC / Pilot** | 🟡 Als Nächstes | Prüft Success Criteria, Verantwortliche, Commitment, Entscheidungsweg und den Prozess nach erfolgreichem POC. | Du reduzierst das Risiko eines aufwendigen POCs, der technisch funktioniert, aber anschließend keine Entscheidung auslöst. |
| **Pricing / Angebot** | 🟡 Als Nächstes | Prüft vor dem kommerziellen Angebot, ob Value, Entscheidungsweg und kommerzieller Kontext ausreichend verstanden sind. | Du verschickst Pricing seltener zu früh und kannst Preis stärker im Kontext des geschaffenen Value positionieren. |
| **Go-Live / Decision Process** | 🟡 Als Nächstes | Prüft Zeitplan, Verantwortlichkeiten, Abhängigkeiten und relevante Entscheidungs-/Freigabeschritte. | Du kannst einen Go-Live-Plan vor dem Kundengespräch schnell plausibilisieren und vermeidest leicht übersehene Prozesslücken. |
| **Closing / Paper Process** | 🟡 Als Nächstes | Prüft Einkauf, Legal, Datenschutz, Security, Signaturweg und weitere administrative Schritte vor der Schlussphase. | Du erkennst früher, ob ein Deal wirklich close-ready ist oder noch administrative Arbeit fehlt. |

### Themen-Checklists

| Checklist | Status | Was macht sie? | Vorteil für den Account Manager |
| --- | --- | --- | --- |
| **Metrics** | ✅ Umgesetzt | Erklärt und prüft die wichtigsten Merkmale einer belastbaren Metric. | Du kannst schnell gegenprüfen, ob eine Kennzahl wirklich aussagekräftig ist oder nur eine unvalidierte Annahme darstellt. |
| **Economic Buyer** | ✅ Umgesetzt | Erklärt die zentralen Merkmale des Economic Buyers und typische Verwechslungen. | Du kannst Kontakte sicherer einordnen und vermeidest, Titel oder Seniorität mit echter wirtschaftlicher Entscheidungsautorität gleichzusetzen. |
| **Decision Criteria** | ✅ Umgesetzt | Hilft, relevante Kriterien zu erkennen, einzuordnen und auf Vollständigkeit zu prüfen. | Du erkennst leichter, welche Kriterien die Auswahl wirklich beeinflussen und wo dir noch Wissen fehlt. |
| **Decision Process** | ✅ Umgesetzt | Erklärt Validation, Approval, beteiligte Rollen und typische Prozesslücken. | Du kannst schneller prüfen, ob du den tatsächlichen Weg zur Entscheidung verstanden hast. |
| **Paper Process** | ✅ Umgesetzt | Erklärt die administrativen Schritte zwischen Entscheidung und Unterschrift. | Du weißt, welche Fragen du zu Einkauf, Legal oder Signatur stellen solltest und verwechselst Paper Process nicht mit dem fachlichen Decision Process. |
| **Pain / Implication** | ✅ Umgesetzt | Hilft zu prüfen, ob ein Pain nur beschrieben oder tatsächlich hinsichtlich seiner Konsequenzen verstanden wurde. | Du kannst schneller erkennen, ob genügend Business Relevanz vorhanden ist oder Discovery noch tiefer gehen muss. |
| **Champion** | ✅ Umgesetzt | Erklärt die Merkmale eines Champions und typische Fehlinterpretationen wie Sympathie oder hohe Aktivität. | Du kannst Champion-Qualität besser beurteilen und weißt, welche Verhaltenssignale wirklich relevant sind. |
| **Competition** | ✅ Umgesetzt | Erweitert den Wettbewerbsbegriff über direkte Anbieter hinaus. | Du vergisst Status quo, Eigenbau oder andere interne Prioritäten nicht als reale Alternativen. |

---

## Wissen

**Economic Buyer ist der erste vollständig umgesetzte Wissensbereich.** Die Seite erklärt Definition, praktische Bedeutung, Erkennungsmerkmale, typische Fehlinterpretationen, mögliche Fragen, Vorgehen ohne direkten Zugang und den relevanten Unterschied zwischen Whyte und Lahoutifard.

Die Wissenshilfe ist für Situationen gedacht, in denen du einen MEDDPICC-Begriff **kurz, korrekt und praxisnah nachschlagen** möchtest, ohne erneut im Buch suchen zu müssen.

| Wissensbereich | Status | Welche Frage beantwortet er? | Vorteil für den Account Manager |
| --- | --- | --- | --- |
| **Metrics** | ✅ Umgesetzt | Wann ist eine Metric belastbar und wie wird daraus wirtschaftlicher Impact? | Du kannst Metrics schneller korrekt anwenden und vermeidest unklare oder nicht validierte Nutzenbehauptungen. |
| **Economic Buyer** | ✅ Umgesetzt | Woran erkennst du den Economic Buyer und wie unterscheidet er sich von Champion oder fachlichem Entscheider? | Du kannst Rollen sicherer einordnen und weißt, worauf es bei EB-Zugang und EB-Gesprächen wirklich ankommt. |
| **Decision Criteria** | ✅ Umgesetzt | Welche Kriterien beeinflussen die Auswahl und wie lassen sie sich strukturieren? | Du kannst Entscheidungskriterien schneller verstehen, hinterfragen und in Kundengesprächen gezielter bearbeiten. |
| **Decision Process** | ✅ Umgesetzt | Wie unterscheiden sich Validation und Approval und wer entscheidet wann? | Du verstehst den tatsächlichen Entscheidungsweg besser und kannst gezielter nach offenen Schritten fragen. |
| **Paper Process** | ✅ Umgesetzt | Welche administrativen Schritte liegen zwischen Entscheidung und Unterschrift? | Du kannst Einkauf, Legal, Security und Signaturweg früher berücksichtigen und besser vom Decision Process unterscheiden. |
| **Pain & Implication** | ✅ Umgesetzt | Wie wird aus einem Problem eine relevante geschäftliche Konsequenz? | Du bekommst eine schnelle Gedankenstütze, um Discovery tiefer zu führen und Pain nicht nur oberflächlich zu dokumentieren. |
| **Champion** | ✅ Umgesetzt | Was macht einen echten Champion aus und welche Signale werden häufig überschätzt? | Du kannst Champion und engagierten Ansprechpartner klarer voneinander unterscheiden. |
| **Competition** | 🟡 In Draft-Abnahme | Warum gehören Status quo, Eigenbau und andere Initiativen genauso zum Wettbewerb? | Du entwickelst ein vollständigeres Bild der tatsächlichen Alternativen und kannst deine Verkaufsstrategie besser darauf ausrichten. |

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


### Value Bridge – vom Pain zur nachvollziehbaren Wirkung (Feature-Branch)

Route: `/#/tools/value-bridge`. Drei Schritte von Ausgangssituation, Pain und Konsequenz über das gewünschte Geschäftsergebnis zu messbaren Veränderungen und der begrenzten wirtschaftlichen Wirkung. Ohne bestätigte EUR-Realisierung zeigt das Tool qualitative und kapazitätsbezogene Ergebnisse statt fiktiver Amortisation. Bei konkret angenommenem finanziellen Nutzen nutzt es die vorhandene Business-Case-Monatsengine (36/60 Monate), ohne diese zu duplizieren. Kundenversion, kopierbare Zusammenfassung und PDF werden lokal im Browser erstellt.

Einmalige ausdrückliche Übernahme aus Metric Builder, Software Business Case und Cost of Delay; alle übergebenen Metrics bleiben zunächst **nicht** finanziell aktiviert und behalten ihren Evidenzstatus. Drei ausdrücklich fiktive Beispiele: Servicekostensenkung, mögliche Doppelzählung im Vertrieb und Kapazität ohne EUR-Nachweis. [Fachliche Gap-Analyse, Primärquellenmatrix und simuliertes Red Team](docs/VALUE_BRIDGE_SOURCE_AND_RED_TEAM.md). **Stand 10.10.2026:** technische CI und visuelle Prüfung der Original-Screenshots sowie PDF-Bildseiten durchgeführt ([CI #38070981674](https://github.com/thomasasen/meddpicc-workbench/actions/runs/38070981674), 326 Unit-/135 Playwright-Tests bestanden, 1 Skip). PR #62 wurde nach ausdrücklicher Freigabe nach `main` gemergt; die genannte CI dokumentiert den damaligen Feature-Stand.

### UX/UI- und Report-Redesign

Der übergreifende Redesign-Audit, die vollständige Routen-/Report-Inventur und der priorisierte Umsetzungsplan stehen in [docs/REDESIGN_AUDIT_2026-10-10.md](docs/REDESIGN_AUDIT_2026-10-10.md). Die technischen Design-Grundlagen sind in [docs/DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md) und [docs/REPORT_VISUAL_SYSTEM.md](docs/REPORT_VISUAL_SYSTEM.md) dokumentiert. Ein Draft-Branch ist keine Nutzerfreigabe oder Aussage zur visuellen Fertigstellung sämtlicher Ansichten.

### PR #64: UI-/Report-Redesign – geprüfter Stand am 11.10.2026

[PR #64](https://github.com/thomasasen/meddpicc-workbench/pull/64) ergänzt alle fünf PDF-Generatoren um gemeinsame Breiten-/Seitenlogik, den mehrseitigen Kundenanhang und den geprüften Langtextfluss. Hinzu kommen sechs ausdrücklich getrennte Value-Bridge-Stufen in UI und PDF, geteilte Workflowschritte, Kapitelnavigation für neun Knowledge-Sichten und responsive Chart-/Ergebnisregeln. Die Finanzformeln und Local-first-Architektur bleiben erhalten.

[CI #38094931479](https://github.com/thomasasen/meddpicc-workbench/actions/runs/38094931479): **334 Unit-Tests, 205 Browser-Tests bestanden, ein Skip**, Format/Lint/Build/Pages erfolgreich. Insgesamt 27 von 27 echten PDF-Seiten gerendert, einzeln gesichtet und die Langtext-PDFs mit Textextraktion geprüft. 25 produktive und drei interne Routen auf vier Viewportbreiten getestet. [Abnahmematrix](docs/REDESIGN_ACCEPTANCE_MATRIX_2026-10-11.md) und [Originalbilder](docs/review-screenshots/redesign/) dokumentieren den Stand.

Die Merge-Freigabe wurde am 11.10.2026 ausdrücklich vorab erteilt. Das Testresultat ersetzt keine formale WCAG-2.2-AA-/PDF/UA-Konformitätsbescheinigung; Standard-PDF-Fonts sind nicht vollständige Unicode-Schriften.
