# Fortschritt

## Aktueller Produktstand

Am 07.10.2026 wurde die Produktstrategie bewusst geändert.

Die bisherige Workbench-Richtung war technisch belastbar, verlangte für viele Funktionen aber zu viele strukturierte
Deal-Informationen, bevor ein unmittelbarer Verkäufernutzen entstand.

Neue Richtung:

> MEDDPICC Toolbox – eigenständige Microtools mit minimalen Inputs und unmittelbar verwertbaren Outputs.

## Was aus dem bisherigen Projekt erhalten bleibt

Technisch sinnvoll:

- Vue 3 / TypeScript / Vite
- Router
- GitHub Pages
- CI
- Vitest
- Playwright
- Design Tokens
- Accessibility-Basis
- Lucide

Selektiv später möglicherweise sinnvoll:

- Deal Inspector
- Next Best Action
- Qualification Gates
- Champion-Logik
- .meddpicc-Dateiformat
- Evidence / References

Nicht mehr primärer Einstieg:

- Opportunity-Bar
- vollständige Deal-Akte
- Evidence Register
- Risks & Actions
- globale Qualification-Übersicht

Diese Komponenten werden nicht gelöscht, aber neue Microtools hängen nicht von ihnen ab.

## Aktiver Slice

**T1 – Toolbox Foundation + Go-Live-Rückwärtsplanung**

Umsetzungsziel:

- MEDDPICC-Verzeichnis als neue Startseite
- 8 MEDDPICC-Bereiche
- Microtools direkt darunter
- kundenfähig / intern sichtbar unterscheiden
- nur implementierte Funktionen aktiv verlinken
- erstes vollständiges Tool unter Decision Process
- lokale SVG-/PNG-/Print-Exports
- deterministische Rückwärtsrechnung
- Unit Tests
- Playwright Desktop/Mobile

## Zwischen-QS

### QS 1 – Produkt / Architektur

Ergebnis:

- Opportunity-Datensatz ist keine Voraussetzung mehr.
- Microtool-State ist lokal.
- ein späterer Deal Workspace ist optional.
- Legacy-Infrastruktur bleibt verfügbar, wird aber nicht weiter ausgebaut.

### QS 2 – Fachlichkeit Go-Live-Plan

Primärquelle: Andy Whyte, Abschnitt „The Go-Live Plan“.

Gestützt sind insbesondere:

- kundenfokussierter statt sellerfokussierter Plan
- gemeinsames / kollaboratives Dokument
- Ziel ist Go-Live statt nur Vertragsabschluss
- Planung rückwärts vom gewünschten Go-Live
- frühes Sichtbarmachen wichtiger Stationen wie Legal, Security und Procurement
- Rückwärtsplanung erzeugt realistischere Timing- und Urgency-Diskussionen

Die konkrete Browserberechnung und Visualisierung ist Product Inference.

## Nächster Schritt nach T1

Nach visueller und technischer Freigabe von T1:

**T2 – Metrics / Value Tools**, beginnend mit Business Case Builder.
