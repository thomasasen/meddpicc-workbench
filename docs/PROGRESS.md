# Cost of Delay – Feature-Branch (10.10.2026)

Basis: `537af8d`. Dreistufiges Microtool mit Monatsengine, drei fiktiven Beispielen, SVG-Kurve, PDF-Export,
expliziter Metric-Builder-Übernahme und getrenntem Modellvergleich von Nutzen, Abschaltung und Projektkosten.
Kostenlücken verhindern einen scheinbar vollständigen Nettovergleich. CI-Basislauf erfolgreich: 309 Vitest, 125 Playwright erfolgreich, 1 übersprungen ([#38059322709](https://github.com/thomasasen/meddpicc-workbench/actions/runs/38059322709)). Desktop-/Mobil-Originale und beide PDF-Seiten wurden danach visuell betrachtet. Die dritte simulierte Red-Team-Runde ist dokumentiert; keine echte Autoren- oder Nutzerfreigabe.
Keine Merge-Freigabe für main. Quellen und simuliertes Red Team: [COST_OF_DELAY_SOURCE_AND_RED_TEAM.md](COST_OF_DELAY_SOURCE_AND_RED_TEAM.md).

---

# Quick Payback · aktueller T3-Draft-Slice (09.10.2026)

- Feature-Branch: `feature/quick-payback-tool` vom bestätigten Main-Commit `c4e99ec682452c29998f33a128deadd8225c90d3`.
- Route `/#/tools/quick-payback`: reines lokales Modell mit drei EUR-Werten; 0-/Negativ-Nutzen und null Investition sind gesonderte Zustände, Demo ausdrücklich fiktiv, Kopiertext als Schätzung.
- [Original-EPUB-Quellenmatrix und zwei simulierte Autoren-Red-Teams](QUICK_PAYBACK_SOURCE_QA.md).
- **Erweiterung:** `SoftwarePaybackPanel.vue` und `softwarePayback.ts` mit frei ergänzbaren Kosten/Customer Metrics, konservativer Anrechnung, Doppelzählungsgate, zeitlichem SaaS-/Nutzenverlauf, kumuliertem Break-even, zugänglicher Tabelle und SVG/PNG.
- **Finale Browser-CI:** [#37862223720](https://github.com/thomasasen/meddpicc-workbench/actions/runs/37862223720) erfolgreich: Format, Lint, 230/230 Vitest, TypeScript/Vite, 91/91 Playwright und 1 bestehender Skip, Pages-Sync und pages:check. Vier zusätzliche Desktop-/Mobile-Originalbilder erzeugt und im Review geprüft. Historische Zwischenfehler und Fixes stehen im Red-Team-Protokoll.
- **Freigabe:** simulierte Fachrollen-Voten sind keine persönlich erteilten Freigaben echter Autoren; Nutzer hat neue sichtbare UI noch nicht ausdrücklich freigegeben. Daher **Draft-PR #53 offen, kein Merge auf `main`**.

---

# Projektfortschritt / Handoff

## General-Merge am 08.10.2026

- **PR #46 · Discovery Call / SPICED:** in `main` gemergt (Merge `32f8e5dd6e39d63b0d7c0dd95c46377741061197`). Qualitätsprüfung: [CI #468](https://github.com/thomasasen/meddpicc-workbench/actions/runs/37777949492) vollständig grün; anschließender `main`-Check [#469](https://github.com/thomasasen/meddpicc-workbench/actions/runs/37778158370) grün.
- **PR #47 · Decision Criteria:** in `main` gemergt (Merge `38ab593bad7ed9e1e047302ba719500e6ffae604`). Quellen-Red-Team-Korrekturen einschließlich `Taking Score` integriert; [CI #470](https://github.com/thomasasen/meddpicc-workbench/actions/runs/37778247899) vollständig grün.
- **PR #38 · alte Toolbox Foundation:** als überholt und nicht konfliktfrei mergebar geschlossen, **ohne den alten Branch in `main` zu übernehmen**. Toolbox-Pivot und Go-Live-Rückwärtsplanung sind bereits aus neueren Umsetzungen auf `main` vorhanden.
- Keine offenen Pull Requests nach dem General-Merge; die vorhandenen Fachbereiche und Navigation liegen auf `main`.
- Die Post-Merge-`main`-CI für PR #47 wird separat überprüft; fachliche Freigabe erfolgte mit der ausdrücklichen Nutzeranweisung zum General-Merge.

## Aktueller Produktstand

Am 07.10.2026 wurde die MEDDPICC Toolbox auf drei klare Bausteine ausgerichtet:

1. **Tools** – konkrete Arbeit berechnen, strukturieren, vorbereiten oder visualisieren.
2. **Checklists** – kurze Lern- und Orientierungshilfen für Themen und wiederkehrende Sales-Situationen.
3. **Knowledge** – kompakte MEDDPICC-Referenz statt erneuter Buchsuche.

Die Produktoberfläche erklärt primär, **wann ein Service hilft, was er macht und welchen konkreten Nutzen der Account Manager erhält**.

## Produktiver Referenz-Slice

**Go-Live-Rückwärtsplanung** ist auf `main` gemergt und bleibt das Referenz-Tool.

Technisch vorhanden:

- deterministische Rückwärtsrechnung
- Kalender- und Arbeitstage
- Verantwortlichkeiten und Prozessbereiche
- intuitive Reihenfolgeänderung per Drag & Drop mit Tastatur-Fallback
- Vorlauf-/Kompressionshinweis
- dynamische kundenfähige Executive-Timeline
- zeitproportionale Datumsachse und Prozessbalken
- SVG-/PNG-Export im gleichen Visualstil
- Unit Tests
- Playwright Desktop/Mobile

### UX-Erweiterung: Schritt-Reihenfolge

Branch: `feat/reverse-timeline-drag-reorder`  
PR: **#41**

Umgesetzt:

- sichtbarer Drag-Griff je Prozessschritt
- Reordering per Maus, Touch und Pen über Pointer Events
- Tastatur-Fallback am selben Griff mit ↑ / ↓ / Home / End
- Screenreader-Live-Feedback nach Positionsänderung
- keine sichtbaren Auf-/Ab-Pfeilbuttons mehr
- Rückwärtsberechnung selbst unverändert

Technische QS: CI-Lauf **#336** erfolgreich inklusive Playwright Desktop/Mobile und Pages-Integrität.

### UX-Erweiterung: Customer-ready Executive Timeline

Branch: `feat/reverse-timeline-executive-chart`

Umgesetzt:

- Roadmap-/Gantt-Hybrid mit eigener Zeile je Prozessschritt
- dynamische Datumsachse vom spätesten Start bis zum Target Go-Live
- semantische Achsenlabels: Kalenderwochen bei kurzen, Monatsmarken bei längeren Plänen
- zeitproportionale Position und Breite der Prozessbalken
- getrennte Kennzahlen für Prozessdauer und Puffer zum notwendigen Start
- farbliche Trennung von Decision Process, Paper Process und Implementierung
- Verantwortungsseite je Prozessschritt plus optional konkrete Person / Rolle als Owner
- optionaler kundenseitiger Termin-Treiber / Compelling Event („Warum dieses Datum?“)
- Übergabepunkte an jedem sequenziellen Prozesswechsel und hervorgehobenes Go-Live-Ziel
- klar hervorgehobenes Target Go-Live
- kurze Kundenbotschaft: wann der erste Prozessschritt spätestens starten sollte
- Prozessdetails standardmäßig einklappbar
- Mobile-Scroll-Hinweis und sticky Schrittnamen
- horizontale, tastaturfokussierbare Ansicht auf kleinen Displays
- Live-Reaktion auf geänderte Dauer, Reihenfolge und Termine
- identische Präsentationslogik für SVG-/PNG-Export
- Zero-Duration-Schritte bleiben als Marker sichtbar
- Layout-Regressionscheck verhindert überlagerte/zusammengedrückte Timeline-Zeilen
- Unit- und Playwright-Tests für die Präsentationslogik
- Source-QA gegen Whyte und Lahoutifard in `docs/REVERSE_TIMELINE_SOURCE_QA.md`
- bewusste Abgrenzung: Go-Live-Timeline ≠ vollständiger Go-Live Plan
- Parallelisierung bleibt bewusst dem geplanten Dependency / Parallelization Helper vorbehalten

## Economic Buyer – Checklists & Knowledge v0.1

Branch: `feat/toolbox-start-checklists-knowledge`  
PR: **#40**

Umgesetzt:

- gemeinsame, typisierte Content-Basis für Knowledge und Checklists
- **Wissen → Economic Buyer**
- **Checklist → Economic Buyer**
- **Checklist → Economic-Buyer-Termin**
- progressive Erklärungen pro Checklist-Punkt:
  - Worum geht es?
  - Warum ist das relevant?
  - Woran erkenne ich es?
  - typische Fehlinterpretation
  - mögliche Frage oder Handlung
  - optional Mehr erfahren
- temporäre Checkboxen nur als persönliche Gedankenstütze
- keine Score-, Gewichtungs- oder Deal-Status-Logik
- sichtbarer fachlicher Unterschied zwischen Whyte und Lahoutifard zur Frage einzelner Economic Buyer vs. Gremium
- Navigation direkt von der Startseite
- responsive Desktop-/Mobile-Ansichten
- Quellenabschnitte nachvollziehbar dokumentiert

## QS des Economic-Buyer-Slices

CI-Lauf **#315** ist erfolgreich.

Bestanden:

- Formatierung
- ESLint
- Unit Tests
- Production Build
- Playwright Desktop
- Playwright Mobile
- Startseiten-Regression
- Go-Live-Rückwärtsplanung Regression
- UI-QS-Screenshots
- Pages-Sync und Pages-Integrität

## Metrics – Checklists & Knowledge v0.1 (PR #45)

Branch: `feat/metrics-knowledge-checklist`

**Fachlicher Quellenabgleich mit Whyte und Lahoutifard am 08.10.2026 bestätigt; CI #412 vollständig grün, Screenshots Desktop/Mobile visuell geprüft.** Umsetzung:

- Wissen → Metrics (Definition, Business Impact, Before-/After, M1 vs. M2, ROI-Abgrenzung)
- Checklist → Metrics (7 Punkte mit progressiven Erklärungen, lokalen Checkboxen)
- gemeinsamer Content-Baustein für Knowledge und Checklist
- fachlicher Vergleich Andy Whyte / Darius Lahoutifard in `docs/METRICS_SOURCE_QA.md`
- Unit- und Playwright-Tests für Content, Navigation, Desktop und Mobile
- keine Scoring-Logik und keine persistente Opportunity-Datenpflege

## Discovery Call – Checklists & Knowledge (PR #46, in main)

Branch: `feat/discovery-call-spiced` · PR: https://github.com/thomasasen/meddpicc-workbench/pull/46 · **am 08.10.2026 nach erfolgreicher CI und Nutzerfreigabe in `main` gemergt**.

- Checklist → Discovery Call: 9 erklärende Prüfpunkte mit rein temporären Checkboxen
- Wissen → Discovery Call: inhaltlich anhand Whyte und Lahoutifard geprüft, ergänzt um SPICED
- SPICED S–P–I–CE–D mit natürlichen Einstiegs-/Vertiefungsfragen, MEDDPICC-Brücken und Evidenzlücken
- ACE (Appreciate, Check End Time, End Goal) als praktischer Gesprächseinstieg
- T.H.E.D., sieben Frageabsichten und vertiefendes Nachfragen
- Source-QA-Matrix: `docs/DISCOVERY_CALL_SOURCE_QA.md`
- **CI #445 vollständig erfolgreich**: Formatierung, Lint, Unit Tests, Build, Playwright Desktop/Mobile und Pages-Integrität (https://github.com/thomasasen/meddpicc-workbench/actions/runs/37756165637)
- Desktop-/Mobile-Screenshots für Nutzerabnahme verfügbar
- **Freigabe / Merge:** ausdrücklicher Nutzerwunsch zum General-Merge am 08.10.2026; PR #46 nach erfolgreichem CI-Lauf #468 gemergt.
- kein CRM, keine KI-Runtime, kein Call-Protokoll und kein Deal-Scoring

### Quellen-UX-Regel (08.10.2026)

- Für **Discovery Call, Metrics und Economic Buyer** sind sichtbare Autoren-/Buchlabels aus Fachkarten, Überschriften und Erklärungstexten entfernt.
- **Wissensseiten und sämtliche aktuellen Checklists** zeigen die Quellen und ggf. Unterschiede der Autoren nur am **Seitenende** im **standardmäßig geschlossenen** Bereich „Quellen und fachliche Einordnung anzeigen“.
- Source-Notizen bleiben in den typisierten Datenmodellen und QA-Dokumenten erhalten; nur die Darstellung ändert sich.
- Die verbindliche Designregel wurde in `AGENTS.md` festgehalten.
- **Die Quellen-UX-Regel ist jetzt in `main` wirksam** und gilt als Standard für kommende Themen.

## Aktueller T2-Stand

### Umgesetzt

- Knowledge Foundation / Content-Schema
- Metrics Knowledge
- Metrics Themen-Checklist
- Economic Buyer Knowledge
- Economic Buyer Themen-Checklist
- Economic-Buyer-Termin Checklist
- Discovery-Call-Checklist (in `main`)
- Discovery-Call-Knowledge (in `main`)
- Decision Criteria Knowledge und Themen-Checklist (in `main`)
- Decision Process Knowledge und Themen-Checklist (PR #48, in `main`)
- Paper Process Knowledge und Themen-Checklist (PR #49, in `main`)
- Pain / Implication Knowledge und Themen-Checklist (PR #50, in `main`)

### Noch offen

- Champion (PR #51, nach Freigabe in `main`)
- Competition (PR #52 am 09.10.2026 in `main` gemergt)
- weitere situative Checklists wie POC, Pricing und Closing

## Decision Criteria – Knowledge & Themen-Checklist (PR #47, in main)

Umgesetzt und am **08.10.2026 nach Nutzerfreigabe per General-Merge** gemergt: https://github.com/thomasasen/meddpicc-workbench/pull/47.

- Routen: `/knowledge/decision-criteria` und `/checklists/decision-criteria`, von der Startseite erreichbar.
- **10** vollständige Checklist-Punkte mit progressiven Erklärungen und temporären Checkboxen – keine Deal-/Score-Persistenz.
- Whytes Technical/Economic/Relationship, Lahoutifards Vendor/Partner/Financial Justification/Capability Validation und sämtliche sieben Value-Triangle-Zonen werden fachlich richtig und ohne falsche Gleichsetzung dargestellt.
- Red-Team-Gegencheck anhand der bereitgestellten Original-EPUBs: `docs/DECISION_CRITERIA_RED_TEAM.md`. Umgesetzt: **Taking Score / tatsächliche Kundenbewertung**, fehlende Kriterien als Kaufreife-Signal und aktive Nutzung von Value/Danger/Unique Differentiators.
- Methodische Nachweise: `docs/DECISION_CRITERIA_SOURCE_QA.md` und `docs/DECISION_CRITERIA_SOURCE_BRIEF.md`.
- **[CI #470 vollständig grün](https://github.com/thomasasen/meddpicc-workbench/actions/runs/37778247899)** (Format, Lint, Unit, Build, Playwright Desktop/Mobile, Pages-Check), danach mit Merge-Commit `38ab593bad7ed9e1e047302ba719500e6ffae604` in `main` übernommen.
- Standalone-Knowledge-/Checklist-Slice: kein Criteria Workshop, keine Decision Matrix, kein automatisches Scoring und kein CRM.
- **Decision Process:** PR #48 am 08.10.2026 nach Nutzerfreigabe in `main` gemergt (Commit `af750f861a596001b3af1f299faa8bc729cf80c2`).
- **Paper Process:** PR #49 nach CI und visueller Freigabe am 08.10.2026 in `main` gemergt; Quellenmatrix in `docs/PAPER_PROCESS_SOURCE_QA.md`.
- **Pain / Implication:** PR #50 am 08.10.2026 per Squash-Merge nach `main` übernommen (`a84d1b0d8be23db9d9ca8eec0a3531a96840a4f5`), vollständiger PR-Qualitätslauf CI #529 erfolgreich (https://github.com/thomasasen/meddpicc-workbench/actions/runs/37838466957). Der separate Push-`main-pages-integrity`-Lauf ist unabhängig zu prüfen und hier nicht pauschal als grün behauptet.
- **Champion:** PR #51 am 08.10.2026 per Squash-Merge `5391d84e96bdff4e2490caa022de61ef8f84ba3b` nach `main` übernommen; PR-CI #536 erfolgreich. Separater `main-pages-integrity`-Lauf https://github.com/thomasasen/meddpicc-workbench/actions/runs/37844111688 erfolgreich.
- **Competition:** PR #52 am 09.10.2026 nach Nutzerfreigabe gemergt (`c4e99ec682452c29998f33a128deadd8225c90d3`); Post-Merge-CI [#37848576751](https://github.com/thomasasen/meddpicc-workbench/actions/runs/37848576751) erfolgreich. Pages-Veröffentlichung war erst nach einem GitHub-HTTP-500 im Wiederholungsversuch erfolgreich.

## Nächste Roadmap-Blöcke

Nach dem T2-Ausbau folgen die Value-&-Metrics-Tools:

1. Quick Payback
2. Metric Builder
3. Cost of Delay
4. Business Case / Value Bridge

## Bewusste Nichtziele

- Pipeline / Forecast
- Account-/Kontaktverwaltung
- vollständige Opportunity-Pflege
- Activity Tracking
- dauerhaftes MEDDPICC-Scoring
- Deal Health / Completeness
- Pflicht-Workflow über alle MEDDPICC-Bereiche


## T3 – Value Bridge (10.10.2026, Draft-Stand)

**Verifizierte Ausgangsbasis:** PR #61 Cost of Delay ist mit Squash `7759a7e09f0c38165bd317cd8f006c0191053d99` in `main` enthalten. Ältere Statusangaben in Roadmap und Projektunterlagen, wonach Cost of Delay ungemergt sei, sind überholt.

**Branch:** `feature/value-bridge` · **Status:** in Implementierung / noch nicht für Merge freigegeben.

Neu: `src/domain/valueBridge.ts` und `valueBridgeHandoff.ts` mit Evidenz-, Realisierungs- und Doppelzählungsgates; geführte Oberfläche unter `/tools/value-bridge`; Kundenansicht, Copy, lokaler PDF-Bericht; drei fiktive Szenarien; Tests. Monetäre Gesamtwirkung wird mit `summarizeBusinessCase` und der vorhandenen Monatsengine berechnet. Der Übernahmeprozess bleibt einmalig über Session Storage und aktiviert keine EUR-Position automatisch.

**Offen vor Done:** Sämtliche Quality Gates auf dem tatsächlichen Commit verifizieren, Original-Browserbilder in vier Viewports und sämtliche gerenderten PDF-Seiten sichten, dritte simulierte fachliche Reviewrunde, ausdrückliche visuelle Nutzerfreigabe. Kein Merge nach `main`.

Siehe [Value Bridge Quellenmatrix und Gap-Analyse](VALUE_BRIDGE_SOURCE_AND_RED_TEAM.md).
