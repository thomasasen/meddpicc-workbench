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
- Vorlauf-/Kompressionshinweis
- kundenfähige Timeline
- SVG-/PNG-Export
- Unit Tests
- Playwright Desktop/Mobile

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

## Aktueller T2-Stand

### Umgesetzt

- Knowledge Foundation / Content-Schema
- Economic Buyer Knowledge
- Economic Buyer Themen-Checklist
- Economic-Buyer-Termin Checklist

### Noch offen

- Metrics
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
