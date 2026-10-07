# MEDDPICC Toolbox

Eine local-first Sammlung eigenständiger **MEDDPICC-Microtools für komplexen B2B-Sales**.

Die Grundidee:

> Nicht erst einen ganzen Deal pflegen. Eine konkrete Aufgabe öffnen, die dafür nötigen Informationen eingeben und
> unmittelbar einen verwertbaren Output erhalten.

## Produktmodell

Die Startseite folgt den MEDDPICC-Bereichen:

- Metrics
- Economic Buyer
- Decision Criteria
- Decision Process
- Paper Process
- Identify / Implicate Pain
- Champion
- Competition

Unter jedem Bereich liegen kleine, fokussierte Werkzeuge.

Beispiele:

- Business Case
- ROI / Payback
- Cost of Delay
- Decision Matrix
- Go-Live-Rückwärtsplanung
- Procurement Timeline
- Pain → Impact
- Champion Tester
- Competition Map

Ein Tool ist entweder **kundenfähig** oder **internes Coaching**. Kundenfähige Tools sollen Ergebnisse erzeugen, die
direkt in Workshops, Kundenterminen und Präsentationen verwendet werden können.

## Erster Referenz-Slice

### Go-Live-Rückwärtsplanung

Der erste vollständig neue Microtool-Slice liegt unter **Decision Process**.

Inputs:

- Titel
- Kunde / Projekt optional
- Ziel-Go-Live
- Schritte
- Owner optional
- Dauer in Arbeitstagen
- Reihenfolge rückwärts vom Go-Live

Outputs:

- spätester Starttermin
- rückwärts berechnete Start-/Endtermine je Schritt
- grafische Timeline
- SVG-Export
- PNG-Export
- druck-/PDF-fähige Ansicht

Die Berechnung läuft vollständig lokal im Browser.

Fachliche Herleitung: `docs/GO_LIVE_REVERSE_TIMELINE_RULES.md`.

## Architekturprinzipien

- Microtool zuerst
- standalone ohne Opportunity-Akte nutzbar
- minimale Inputs je Tool
- deterministische Domain-Logik
- local-first
- kein Backend erforderlich
- kein AI-Zwang
- kein CRM-Nachbau
- optionaler Deal Workspace frühestens später

Die frühere Workbench-Infrastruktur bleibt im Repository, wird aber nicht mehr als Voraussetzung für neue Microtools
verwendet. Sinnvolle Teile dürfen selektiv wiederverwendet werden.

## Technische Basis

- Vue 3
- TypeScript
- Vite
- Vue Router
- Vitest
- Playwright
- GitHub Actions
- GitHub Pages
- Lucide Icons

## Entwicklung

```bash
npm install
npm run dev
```

Qualitätschecks:

```bash
npm run format:check
npm run lint
npm test
npm run build
npm run pages:check
npm run test:e2e
```

## Status

Der Produkt-Pivot zur Microtool-Toolbox läuft in Phase T1. Der erste Referenz-Slice ist die kundenfähige
Go-Live-Rückwärtsplanung.
