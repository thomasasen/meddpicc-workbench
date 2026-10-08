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

## Metrics – Checklists & Knowledge v0.1 (Feature-PR)

Branch: `feat/metrics-knowledge-checklist`

Implementiert, **vor CI-/UI-Abnahme noch nicht gemergt**:

- Wissen → Metrics (Definition, Business Impact, Before-/After, M1 vs. M2, ROI-Abgrenzung)
- Checklist → Metrics (7 Punkte mit progressiven Erklärungen, lokalen Checkboxen)
- gemeinsamer Content-Baustein für Knowledge und Checklist
- fachlicher Vergleich Andy Whyte / Darius Lahoutifard in `docs/METRICS_SOURCE_QA.md`
- Unit- und Playwright-Tests für Content, Navigation, Desktop und Mobile
- keine Scoring-Logik und keine persistente Opportunity-Datenpflege

## Aktueller T2-Stand

### Umgesetzt

- Knowledge Foundation / Content-Schema
- Metrics Knowledge (Feature-PR; Merge ausstehend)
- Metrics Themen-Checklist (Feature-PR; Merge ausstehend)
- Economic Buyer Knowledge
- Economic Buyer Themen-Checklist
- Economic-Buyer-Termin Checklist

### Noch offen

- Decision Criteria
- Decision Process
- Paper Process
- Pain / Implication
- Champion
- Competition
- weitere situative Checklists wie Discovery, POC, Pricing und Closing

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
