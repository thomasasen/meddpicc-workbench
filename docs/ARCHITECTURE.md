# Architektur

## Architekturziel

MEDDPICC Toolbox ist eine statische, local-first Browser-Anwendung aus fachlich unabhängigen Microtools.

Die zentrale Architekturregel lautet:

> **Ein Microtool darf nicht von einem globalen Opportunity-Datensatz abhängen, wenn seine konkrete Aufgabe mit einem kleineren Inputvertrag lösbar ist.**

## High-Level

GitHub Pages → Vue Toolbox → eigenständige Microtools → eigener Input → reine Domain-Logik → UI-Ergebnis und optionaler Export.

## Schichten eines Microtools

### Tool Input

Fachlich kleiner, expliziter Vertrag. Kein globales Schema ist automatisch erforderlich.

### Domain Service

Reine, deterministische Berechnung oder Regelprüfung. Keine Vue-Abhängigkeit und keine versteckte UI-Logik.

### Tool UI

Erfasst Inputs, erklärt Grenzen und visualisiert Ergebnisse.

### Export Adapter

Erzeugt – wenn fachlich sinnvoll – kundenfähige Artefakte. Exportlogik bleibt vom Domain Service getrennt.

## Optionaler Deal Workspace

Die bestehende Projektdatei und Teile des früheren Projektmodells können später als optionaler Workspace dienen.

Mögliche Aufgaben:

- Tool-Ergebnisse zu einer Opportunity speichern
- Inputs zwischen Tools wiederverwenden
- Deal Review aus mehreren Tool-Ergebnissen erzeugen

Nicht erlaubt:

- Microtools zur Projektanlage zwingen
- globale Pflichtfelder einführen, nur weil sie im Workspace existieren
- Microtool-Logik versteckt an Workspace-State koppeln

## Bestehender Legacy-Code

Evidence Register, Risks/Actions, Deal Inspector, Qualification Gates und Project-File-Lifecycle bleiben vorerst im Repository. Sie gelten nicht mehr als primärer Navigations- oder Produktkern.

Wiederverwendung erfolgt nur, wenn ein konkretes Microtool davon profitiert.

## Go-Live-Rückwärtsplanung v0.1

Input: Target Go-Live, Planungsdatum und Schritte mit Bezeichnung, Dauer, Einheit, Verantwortlichkeit und Bereich.

Domain Service: calculateReverseTimeline.

Output: spätester Start, Segmentgrenzen, Vorlaufstatus, zugängliche Detail-Liste, visuelle Timeline sowie SVG-/PNG-Export.

Arbeitstage sind in v0.1 Montag bis Freitag. Feiertage werden nicht automatisch modelliert.

## Technischer Stack

- Vue 3
- TypeScript
- Vite
- Vue Router
- Pinia nur bei tatsächlich view-übergreifendem State
- Vitest
- Playwright
- GitHub Actions
- GitHub Pages

## Qualitätsregeln

- Domain-Berechnungen als reine Funktionen
- gleiche Inputs → gleiche Outputs
- keine Business Rules ausschließlich in Komponenten
- keine Runtime-CDNs
- keine Analytics mit Zugriff auf Kundendaten
- semantische HTML-Controls
- Tastaturbedienbarkeit
- Responsive-Prüfung Desktop/Mobile
- kundenfähige Exporte benötigen eine nichtgrafische Informationsalternative im UI
