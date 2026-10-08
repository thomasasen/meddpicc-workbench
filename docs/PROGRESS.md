# Projektfortschritt / Handoff

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

## Discovery Call – Checklists & Knowledge (PR #46, wartet auf Sichtfreigabe)

Branch: `feat/discovery-call-spiced` · PR: https://github.com/thomasasen/meddpicc-workbench/pull/46 · **Draft, offen, nicht gemergt** (Stand 08.10.2026).

- Checklist → Discovery Call: 9 erklärende Prüfpunkte mit rein temporären Checkboxen
- Wissen → Discovery Call: inhaltlich anhand Whyte und Lahoutifard geprüft, ergänzt um SPICED
- SPICED S–P–I–CE–D mit natürlichen Einstiegs-/Vertiefungsfragen, MEDDPICC-Brücken und Evidenzlücken
- ACE (Appreciate, Check End Time, End Goal) als praktischer Gesprächseinstieg
- T.H.E.D., sieben Frageabsichten und vertiefendes Nachfragen
- Source-QA-Matrix: `docs/DISCOVERY_CALL_SOURCE_QA.md`
- **CI #445 vollständig erfolgreich**: Formatierung, Lint, Unit Tests, Build, Playwright Desktop/Mobile und Pages-Integrität (https://github.com/thomasasen/meddpicc-workbench/actions/runs/37756165637)
- Desktop-/Mobile-Screenshots für Nutzerabnahme verfügbar
- **Offene Freigabe:** sichtbare UI durch Nutzer abnehmen lassen; bis dahin kein Merge
- kein CRM, keine KI-Runtime, kein Call-Protokoll und kein Deal-Scoring

### Quellen-UX-Regel (08.10.2026)

- Für **Discovery Call, Metrics und Economic Buyer** sind sichtbare Autoren-/Buchlabels aus Fachkarten, Überschriften und Erklärungstexten entfernt.
- **Wissensseiten und sämtliche aktuellen Checklists** zeigen die Quellen und ggf. Unterschiede der Autoren nur am **Seitenende** im **standardmäßig geschlossenen** Bereich „Quellen und fachliche Einordnung anzeigen“.
- Source-Notizen bleiben in den typisierten Datenmodellen und QA-Dokumenten erhalten; nur die Darstellung ändert sich.
- Die verbindliche Designregel wurde in `AGENTS.md` festgehalten.
- **Diese UX-Änderung liegt derzeit ausschließlich auf dem PR-#46-Branch**. Bereits gemergte Seiten in `main` sind bis zum Merge davon noch nicht betroffen.

## Aktueller T2-Stand

### Umgesetzt

- Knowledge Foundation / Content-Schema
- Metrics Knowledge
- Metrics Themen-Checklist
- Economic Buyer Knowledge
- Economic Buyer Themen-Checklist
- Economic-Buyer-Termin Checklist
- Discovery-Call-Checklist (Feature-PR)
- Discovery-Call-Knowledge (Feature-PR)

### Noch offen

- Decision Criteria: technische CI abgeschlossen, Nutzer-Sichtfreigabe vor Merge noch offen
- Decision Process
- Paper Process
- Pain / Implication
- Champion
- Competition
- weitere situative Checklists wie POC, Pricing und Closing

## Decision Criteria – Knowledge & Themen-Checklist (Feature-PR, QA offen)

**Als nächster eigenständiger Knowledge-/Checklist-Slice nach Discovery Call festgelegt am 08.10.2026.**

- Umsetzungs-Prompt für Codex: `docs/prompts/DECISION_CRITERIA_IMPLEMENTATION.md`
- Fachliches, aus den bereitgestellten EPUB-Kapiteln geprüftes Briefing: `docs/DECISION_CRITERIA_SOURCE_BRIEF.md`
- Implementiert auf `feat/decision-criteria-knowledge-checklist`: `/knowledge/decision-criteria` und `/checklists/decision-criteria`, inkl. Navigation von der Startseite.
- Zehn vollständige Checklist-Punkte und temporäre Checkboxen; fachliche Differenzierung und sieben Value-Triangle-Zonen als Knowledge.
- Unit Tests sowie Playwright Desktop/Mobile inkl. Overflow- und Quellen-Disclosure-Tests hinzugefügt.
- Fachlicher QA-Nachweis: `docs/DECISION_CRITERIA_SOURCE_QA.md`.
- **Red-Team-Gegencheck 08.10.2026:** beide Original-EPUBs erneut geprüft, simulierte Autorenperspektiven in `docs/DECISION_CRITERIA_RED_TEAM.md` dokumentiert. Korrekturen zu Whytes *Taking Score*, fehlenden Kriterien als Kaufreife-Risiko und aktiver Nutzung des Value Triangle eingebaut.
- **Red-Team-QA nach Änderung:** zusätzliche Unit-/Browser-Assertions ergänzt; vorangegangener CI #456 bezieht sich noch auf den Stand **vor** diesen Korrekturen. Neue CI ausstehend.
- **Technische QS abgeschlossen:** Standard-CI #456 vollständig grün (Format, Lint, Unit, Build, Playwright Desktop/Mobile, Pages-Check): https://github.com/thomasasen/meddpicc-workbench/actions/runs/37773584286.
- **Visuelle QS:** Desktop-/Mobile-Fullpage-Screenshots aus CI #453 kontrolliert, keine Auffälligkeiten; Quellen sind standardmäßig eingeklappt.
- **PR #47:** https://github.com/thomasasen/meddpicc-workbench/pull/47, gestapelt auf PR #46. **Ausdrückliche Nutzer-Sichtfreigabe ausstehend; kein Merge**.
- Methodisch explizit: Whytes Technical/Economic/Relationship und Lahoutifards Vendor/Partner/Financial Justification/Capability Validation sowie Value Triangle (Value, Danger, Parity usw.); Gemeinsamkeiten ohne falsche Gleichsetzung zeigen.
- Keine Decision Matrix, kein Criteria-Workshop-Tool, kein automatisches Deal-Scoring: diese Instrumente gehören später zur Phase T6.
- Abhängigkeit: PR #46 vor einem normalen `main`-basierten Decision-Criteria-PR erst freigeben und mergen; alternativ sauberer **stacked Draft-PR** auf #46, niemals unbeabsichtigt PR #46 mitmergen.
- Decision Criteria ist **implementiert, aber noch nicht freigegeben bzw. gemergt**. Keine Produktionsreife ohne erfolgreiche CI und visuelle Nutzerabnahme.
- Fachliche Reihenfolge danach: **Decision Process**, **Paper Process**, anschließend Pain/Implication, Champion, Competition.

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
