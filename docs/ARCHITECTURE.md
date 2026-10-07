# Architektur

## Architekturziel

MEDDPICC Toolbox ist eine statische, local-first Browser-Anwendung mit drei fachlich getrennten Oberflächen:

1. **Tools**
2. **Checklists**
3. **Knowledge**

Die zentrale Architekturregel lautet:

> **Kein Service darf von einem vollständigen Opportunity-Datensatz abhängen, wenn seine konkrete Aufgabe mit einem kleineren Inputvertrag lösbar ist.**

Die Anwendung ist kein CRM und kein ganzheitliches MEDDPICC-System.

## High-Level

GitHub Pages → Vue Toolbox → Tools / Checklists / Knowledge.

### Tools

Tool Input → reine Domain-Logik → UI-Ergebnis → optionaler Export.

### Checklists

Content Model → schnelle Prüffrage → optionale Erklärungsebenen.

### Knowledge

Quellenfundierter Content → kompakte Referenz → Wiederverwendung in Checklists und Tool-Hilfen.

## Tool-Schichten

### Tool Input

Fachlich kleiner, expliziter Vertrag. Kein globales Schema ist automatisch erforderlich.

### Domain Service

Reine, deterministische Berechnung oder Regelprüfung. Keine Vue-Abhängigkeit und keine versteckte UI-Logik.

### Tool UI

Erfasst Inputs, erklärt Grenzen und visualisiert Ergebnisse.

### Export Adapter

Erzeugt – wenn fachlich sinnvoll – kundenfähige Artefakte. Exportlogik bleibt vom Domain Service getrennt.

## Checklist-/Knowledge-Schichten

Checklists und Knowledge sollen auf einer gemeinsamen, strukturierten Wissensbasis aufbauen können.

Ein Checklist-Punkt kann enthalten:

- kurze Prüffrage
- fachliche Bedeutung
- Relevanz
- Erkennungsmerkmale / Beispiele
- typische Fehlinterpretation
- mögliche Frage oder Handlung
- optionalen Vertiefungstext
- Quellen-/Themenzuordnung

Die UI zeigt zunächst die kurze Ebene und klappt Details nur bei Bedarf auf.

## Kein persistentes Deal-Scoring

Checklists dürfen lokal im aktuellen UI abhakbar sein, daraus entsteht aber standardmäßig:

- kein Opportunity-Status
- kein historischer Deal-Fortschritt
- kein MEDDPICC-Score
- kein Forecast-Signal
- kein Management-Dashboard

## Optionaler Session Context

Erst wenn mehrere produktive Services voneinander profitieren, darf ein kleiner temporärer Context eingeführt werden.

Mögliche Aufgabe:

- Ergebnis eines Tools an ein anderes Tool übergeben
- bereits bekannte Inputs im aktuellen Arbeitskontext wiederverwenden
- gemeinsamen Export erzeugen

Nicht erlaubt:

- Projektanlage erzwingen
- vollständige Opportunity-Struktur als Voraussetzung
- globale Pflichtfelder
- versteckte Kopplung von Tool-Logik an zentralen State

## Bestehender Legacy-Code

Evidence Register, Risks/Actions, Deal Inspector, Qualification Gates und Project-File-Lifecycle bleiben vorerst im Repository. Sie sind weder Navigations- noch Produktkern.

Wiederverwendung erfolgt nur, wenn ein konkreter Service davon profitiert und dadurch keine CRM-artige Pflichtpflege zurückkehrt.

## Go-Live-Rückwärtsplanung v0.1

Input: Target Go-Live, Planungsdatum und Schritte mit Bezeichnung, Dauer, Einheit, Verantwortlichkeit und Bereich.

Domain Service: `calculateReverseTimeline`.

Output: spätester Start, Segmentgrenzen, Vorlaufstatus, zugängliche Detail-Liste, visuelle Timeline sowie SVG-/PNG-Export.

Arbeitstage sind in v0.1 Montag bis Freitag. Feiertage werden nicht automatisch modelliert.

## Technischer Stack

- Vue 3
- TypeScript
- Vite
- Vue Router
- Pinia nur bei tatsächlich view-übergreifendem, fachlich notwendigem State
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
- Checklists müssen ohne fachlich missverständliche Kurzlabels verständlich sein
- neue Features werden auf CRM-Drift geprüft
