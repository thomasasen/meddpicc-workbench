# Projektfortschritt / Handoff

## Aktueller Produktstand

Das Projekt wurde am 07.10.2026 von einer zentralen Deal-Workbench zu einer **MEDDPICC Microtool Toolbox** neu ausgerichtet.

Grund: Die bisherige Architektur verlangte für kleine Coaching-Funktionen zu viele detaillierte Informationen in einem globalen Datenmodell. Das widersprach dem gewünschten Nutzungsbild: Ein Account Manager soll ein konkretes Werkzeug öffnen, nur die dafür nötigen Inputs eingeben und ein direkt verwertbares Ergebnis erhalten.

## Bewusste Wiederverwendung

Beibehalten:

- Vue 3 / TypeScript / Vite
- Vue Router
- Vitest / Playwright
- GitHub Actions / GitHub Pages
- Lucide
- Design Tokens
- Accessibility-Baseline
- ausgewählte reine Domainlogik, wenn ein Microtool davon profitiert

Nicht mehr Produktkern:

- Opportunity-Dashboard
- Pflichtprojekt vor Tool-Nutzung
- Projektdatei als zwingende Source of Truth
- Evidence-/Risks-/Actions-Pflege als Einstieg
- Deal Inspector als Startseite

## Aktiver Slice

Branch: feat/meddpicc-toolbox-v01

Ziel:

1. neue MEDDPICC-Toolbox-Startseite
2. erstes echtes Microtool: Go-Live-Rückwärtsplanung
3. kundenfähiger SVG-/PNG-Export

## Fachliche Basis des ersten Tools

- Whyte: kundenorientierter Go-Live Plan, vom gewünschten Go-Live rückwärts planen, relevante Meilensteine und beteiligte Funktionen früh sichtbar machen.
- Lahoutifard: Decision/Paper Process schriftlich und visuell als Timeline dokumentieren, Aktivitäten beider Seiten sichtbar machen, Paper Process Schritt für Schritt erfragen und antizipieren.

Software-Regeln sind eigene Produktentscheidungen und keine behauptete offizielle MEDDPICC-Formel.

## Zwischen-QS

### QS 1 – Produktfit

Bestanden: Das Tool löst eine konkrete Seller-Aufgabe und erzeugt einen mit dem Kunden nutzbaren Output, ohne CRM-/Projektpflege vorauszusetzen.

### QS 2 – Domain-Grenze

Bestanden: Rückwärtsrechnung liegt in einem reinen Domain Service. UI und Export sind davon getrennt. Feiertage werden nicht still angenommen.

### QS 3 – Technische / visuelle Qualität

Technische Gates bestanden: Formatierung, Lint, Unit Tests, Production Build, Pages-Integrität sowie Playwright Desktop/Mobile sind grün. Offen bleibt ausschließlich die sichtbare UI-Abnahme durch den Nutzer.

## Nächster empfohlener Slice nach Freigabe

Metrics → Quick Payback / ROI.

Dieser Slice testet erneut den vollständigen Produktpfad: wenige Inputs → deterministische Berechnung → verständliche Value Story → kundenfähige Visualisierung/Export.
