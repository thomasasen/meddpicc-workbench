# MEDDPICC Toolbox

Eine local-first Sammlung fokussierter **MEDDPICC Microtools** für komplexe B2B-Sales-Aufgaben.

Das Produkt startet nicht mit einem vollständigen Deal-Datensatz, sondern mit einer konkreten Aufgabe: Business Case rechnen, Go-Live rückwärts planen, Decision Criteria strukturieren, Champion testen oder ein Economic-Buyer-Gespräch vorbereiten.

> **Leitprinzip:** Tool zuerst, Datenmodell danach. Jedes Microtool fragt nur die Informationen ab, die es für seine Aufgabe benötigt.

## Produktmodell

Die Startseite ist entlang der acht MEDDPICC-Bereiche aufgebaut: Metrics, Economic Buyer, Decision Criteria, Decision Process, Paper Process, Identify / Implicate Pain, Champion und Competition.

Unter jedem Bereich liegen eigenständige Microtools. Ein Tool muss ohne angelegtes Opportunity-Projekt nutzbar sein.

Es gibt zwei Tool-Klassen:

- **Kundenfähig** – erzeugt Ergebnisse für Präsentationen, Workshops oder gemeinsame Pläne.
- **Intern** – unterstützt den Seller bei Qualifizierung und Coaching.

Ein optionaler Deal Workspace kann später Ergebnisse mehrerer Tools speichern und wiederverwenden. Er ist jedoch kein Eintrittsticket für die Microtools.

## Erster produktiver Slice

### Go-Live-Rückwärtsplanung

Pfad: Decision Process → Go-Live-Rückwärtsplanung

Eingaben:

- Kunde und Titel optional
- Planungsdatum
- Target Go-Live
- beliebig viele Prozessschritte
- pro Schritt: Bezeichnung, Dauer, Kalender-/Arbeitstage, Verantwortlichkeit und Bereich

Ergebnis:

- spätester errechneter Start
- deterministische Rückwärtsrechnung
- Vorlauf-/Kompressionshinweis
- kundenfähige visuelle Timeline
- SVG- und PNG-Export für Präsentationen

Arbeitstage berücksichtigen in v0.1 Montag bis Freitag. Feiertage werden bewusst nicht automatisch angenommen.

## MEDDPICC-Fundierung

Die fachliche Richtung des ersten Tools folgt zwei Primärquellen, ohne deren Texte zu reproduzieren:

- Andy Whyte beschreibt den Go-Live Plan als kundenorientierten, kollaborativen Plan, der sinnvoll vom gewünschten Go-Live rückwärts aufgebaut wird.
- Darius Lahoutifard empfiehlt, Decision und Paper Process schriftlich und als Timeline abzubilden, Käufer- und Verkäuferaktivitäten sichtbar zu machen und administrative Schritte früh zu antizipieren.

Die konkrete Softwarelogik und Formulierungen sind eigene Produktentscheidungen.

## Architekturprinzipien

- **Microtool-first:** kein vollständiger MEDDPICC-Datensatz als Voraussetzung.
- **Deterministisch by default:** gleiche Eingaben liefern gleiche Ergebnisse.
- **Local-first:** Core-Funktionen laufen im Browser.
- **Kein verpflichtendes Backend oder AI-Modell.**
- **Kundenfähiger Output ist ein First-Class-Use-Case.**
- **Kein CRM-Nachbau.**
- **Optionaler Workspace statt Pflichtprojekt.**
- **Microtools bleiben fachlich und technisch möglichst unabhängig.**

## Technische Basis

Weiterverwendet aus der bisherigen Workbench:

- Vue 3, TypeScript, Vite und Vue Router
- Vitest und Playwright
- GitHub Actions / GitHub Pages
- Lucide Icons
- vorhandene Design Tokens und Accessibility-Baseline

Bestehende Projekt-, Evidence- und Deal-Reasoning-Komponenten bleiben vorerst als Legacy-/Experimentiercode erhalten, sind aber nicht mehr das primäre Produktmodell.

## Qualitätsgates

Vor Merge eines Feature-PRs werden Formatierung, Lint, Unit Tests, Production Build, Pages-Integrität und Playwright für Desktop und Mobile geprüft.

## Projektsprache

Normale Produkt-, Dokumentations- und PR-Sprache ist Deutsch. Etablierte MEDDPICC- und technische Begriffe bleiben im Original.

## Scope-Grenzen

Die Toolbox ist kein CRM, kein Pipeline-System, keine Kontaktdatenbank, kein E-Mail-Client und keine generische Task-App.

## Dokumentation

- Projektauftrag: docs/PROJECT_CHARTER.md
- Architektur: docs/ARCHITECTURE.md
- Roadmap: docs/ROADMAP.md
- Fortschritt: docs/PROGRESS.md
- Design System: docs/DESIGN_SYSTEM.md
- Regeln der Go-Live-Rückwärtsplanung: docs/REVERSE_TIMELINE_RULES.md
- Agent-Anweisungen: AGENTS.md

## Lizenz

MIT. Siehe LICENSE.
