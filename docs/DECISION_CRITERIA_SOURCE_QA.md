# Decision Criteria: fachliche Quellenprüfung und Freigabekriterien

Stand: 08.10.2026. Quellen wurden aus den im Chat bereitgestellten Original-EPUBs überprüft; die Umsetzung verwendet eigene deutschsprachige Erläuterungen und Beispiele.

| Fachliche Aussage / UI-Element | Überprüfte Fundstelle | Einordnung und Fehlerprävention |
| --- | --- | --- |
| Kriterien können formal (RFP) oder informell abgestimmt sein | Whyte: Decision Criteria → Einleitung, Establishing the Status | Nicht behaupten, jeder Kunde besitze einen abschließenden Kriterienkatalog |
| Quellen der Kriterien hinterfragen, Beeinflussbarkeit und Qualify-out prüfen | Whyte: Decision Criteria → Establishing the Status of the Decision Criteria; If Your Customer Has Established/No Clearly Established Decision Criteria | Respektvolle Ursachenfrage; rechtliche Anforderungen nicht ungeprüft als falsch darstellen |
| Technical / Economic / Relationship | Whyte: Decision Criteria → The Three Types of Decision Criteria, Technical/Economic/Relationship Criteria | Unterschiedliche Stakeholder-Sichten, keine allgemeingültige Gewichtung |
| Technical enthält auch Infrastruktur, Integration und Ease of Use | Whyte: Technical Decision Criteria | Nicht allein mit Featureliste gleichsetzen |
| Economic umfasst ROI, Risiko, Zeit, Opportunitätskosten, Commercial Terms | Whyte: Economic Decision Criteria | Wirtschaftlichen Wert nicht allein als Preis interpretieren |
| Relationship umfasst Reputation, Executive Alignment, Branche, Zusammenarbeit, Fairness | Whyte: Relationship Decision Criteria | Nicht bloß mit persönlicher Sympathie verwechseln |
| Pain → Use Case → Capability → Metrics | Whyte: Influencing the Decision Criteria | Kein Capability-Marketing ohne Kundennutzen |
| Vendor/Partner, Financial Justification, Capability Validation | Lahoutifard: Chapter Five → Decision Criteria | **Nicht** 1:1 mit Whytes Dreiteilung gleichsetzen |
| Muss-Anforderungen, optionale Features und Gewichtung | Lahoutifard: Chapter Five → Capability Validation | Erfasste Kriterien von unbestätigten Bewertungen unterscheiden |
| Value Triangle: Value, Danger, Parity, Unique Differentiators, Custom Needs, Market Trends, Useless | Lahoutifard: Chapter Five → The Value Triangle; Analysis of The Decision Criteria Triangle | Die Zonen nach Kundenbedarf, eigener Fähigkeit und Alternative ordnen |
| Value = Bedarf + eigener Fit + fehlender Alternativ-Fit | Lahoutifard: Chapter Five → Value | Wettbewerbsunterschied ohne Beleg ist kein validierter Value |
| Danger = Bedarf + eigener Mangel + vorhandener Alternativ-Fit | Lahoutifard: Chapter Five → Danger | Gegenrisiko nicht kleinreden oder nicht vorhandene Fähigkeit zusagen |
| Unique Differentiators ohne Kundenbedarf noch kein Value | Lahoutifard: Chapter Five → Unique Differentiators | Kundenbedarf erst ermitteln; nicht „USP = kaufentscheidend“ |
| Konkurrenz umfasst ggf. Status quo oder No Decision | Lahoutifard: Chapter Five → Value Triangle | Im aktuellen Deal tatsächliche Alternativen ermitteln |
| POC-Erfolg ≠ finale Freigabe | fachliche Ableitung aus Whytes Technical Criteria und der Unterscheidung Decision Criteria/Decision Process; bereits bestehende Roadmap-Logik | Kein automatischer Auftrag nach bestandenem Test |
| Qualify-out oder klares „Nein“ möglich | Whyte: Establishing the Status; Lahoutifard: Chapter Ten → Say No To Qualify | Nicht um jeden Preis Kriterien zu unseren Gunsten manipulieren |

## Eigene Redaktion und Darstellungsregeln

- Selbst erstellte Fragen zu CRM-Integration, Hosting-/Datenschutzanforderung und Time-to-Value dienen ausschließlich als **fiktive B2B-Beispiele** und sind keine Zitate oder rechtlichen Aussagen.
- Wirtschaftliche bzw. technische Anforderungen können eine harte Hürde sein, müssen aber im konkreten Deal mit zuständigen Stellen verifiziert werden.
- Beide Autoren verwenden unterschiedliche Kategorien. Der sichtbare Knowledge-Text erklärt sie als zusätzliche Perspektiven, ohne ein erfundenes offizielles Mapping.
- Quellen und Autoren werden in Knowledge und Checklist **nur ganz am Ende in einem standardmäßig geschlossenen Bereich** gezeigt; Checkliste wiederverwendet Quellennotizen pro Punkt.
- Prüfpunkte sind **Orientierung**, keine objektiven Deal-Scores; Checkboxen sind nicht persistent.
- Der Bereich implementiert keine spätere T6 Decision Matrix oder Criteria Workshop.
- Die bereitgestellten Original-EPUBs liegen nicht als öffentliche Dateien im Repository; `docs/DECISION_CRITERIA_SOURCE_BRIEF.md` dient dem reproduzierbaren Handoff.

## QA-Check

- [x] Kriterienmodelle und sieben Zonen fachlich mit EPUB-Text abgeglichen
- [x] Erneuter Originalquellen-Gegencheck mit simulierten Autorenperspektiven: `docs/DECISION_CRITERIA_RED_TEAM.md`
- [x] Korrekturen zu `Taking Score`, fehlenden Kriterien und Value-Triangle-Aktionen implementiert
- [x] Beispielsprache auf hypothetische Aussagen und Nachfragen begrenzt
- [x] Reproduzierbare Unit- und Playwright-Tests implementiert
- [x] Vorheriger CI-Lauf #456 grün – https://github.com/thomasasen/meddpicc-workbench/actions/runs/37773584286
- [x] Erneute CI nach Red-Team-Korrekturen **#466** und final gegen `main` gerichtete PR-CI **#470** vollständig grün: https://github.com/thomasasen/meddpicc-workbench/actions/runs/37778247899
- [x] Desktop-/Mobile-Screenshots aus Lauf #453 für die ursprüngliche Knowledge-/Checklist-Fassung visuell geprüft; nach Red-Team-Änderungen erneut automatische Playwright-Desktop-/Mobile-Prüfung in CI #470 bestanden. Die Mergefreigabe erfolgte durch den Nutzer.
- [x] Ausdrückliche Nutzeranweisung zum General-Merge am 08.10.2026 erteilt (Mergefreigabe)
- [x] PR #47 am 08.10.2026 in `main` gemergt: https://github.com/thomasasen/meddpicc-workbench/pull/47
