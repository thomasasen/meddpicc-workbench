# Roadmap – MEDDPICC Toolbox

## Produkt-Pivot

Die frühere Roadmap einer zentralen Deal-Reasoning-Workbench wird nicht weiter als primäres Produktmodell verfolgt.

Grund:

Die bisherigen Services benötigen einen relativ detailliert gepflegten, strukturierten Opportunity-Datensatz. Das erzeugt
zu viel Vorarbeit, bevor ein Verkäufer einen konkreten Nutzen erhält.

Neues Leitbild:

**MEDDPICC-Microtools, die einzeln funktionieren und nur die für ihre Aufgabe notwendigen Inputs verlangen.**

Bestehende technische und fachliche Komponenten bleiben als mögliche Wiederverwendung erhalten.

## T0 – Technische Foundation ✅

Vorhanden und weiterhin nutzbar:

- Vue 3 + TypeScript + Vite
- Vue Router
- Design Tokens
- Accessibility-Basis
- Vitest
- Playwright
- GitHub Actions
- GitHub Pages
- lokale Browser-Verarbeitung

## T1 – Toolbox Foundation

Ziel:

- neue Startseite nach MEDDPICC-Bereichen
- Microtool-Verzeichnis
- Kennzeichnung kundenfähig vs. intern
- kein Opportunity-/Project-File-Zwang
- erste wiederverwendbare Exportmechanik
- erstes vollständiges Referenz-Microtool

### Referenz-Microtool: Go-Live-Rückwärtsplanung

Bereich: **Decision Process**

Funktionen:

- Ziel-Go-Live eingeben
- beliebige Schritte mit Dauer und optionalem Owner
- Reihenfolge rückwärts vom Go-Live
- Arbeitstage deterministisch zurückrechnen
- spätesten Start anzeigen
- kundenfähige Timeline
- SVG
- PNG
- Druck / PDF
- Desktop + Mobile

Fachliche Grenze v0.1:

- Montag bis Freitag als Arbeitstage
- Feiertage und Betriebsferien noch nicht automatisch berücksichtigt

## T2 – Metrics / Value Tools

Priorität:

1. Business Case Builder
2. ROI / Payback
3. Cost of Delay

Ziel:

- schnelle Berechnung
- Annahmen klar sichtbar
- kundenfähige Value-Darstellung
- Export für Präsentationen

## T3 – Decision & Paper Process Tools

- Decision Map
- Mutual Action Plan
- Procurement Timeline
- Paper Process Check
- erweiterte Rückwärtsplanung mit Abhängigkeiten, Feiertagen und optionalem Critical Path

## T4 – Pain & Decision Criteria Tools

- Pain → Impact
- Cost of Pain
- Executive Problem Statement
- Decision Matrix
- Criteria Workshop
- Differentiation Map

## T5 – Seller-only Qualification Tools

Selektiv vorhandene Logik wiederverwenden:

- Champion Tester
- Economic Buyer Qualification
- Competition Map
- Qualification Gates
- Deal Inspector

Wichtig: Diese Tools müssen standalone nutzbar werden. Sie dürfen nicht voraussetzen, dass vorher eine vollständige
.meddpicc-Datei gepflegt wurde.

## T6 – Optionaler Deal Workspace

Erst nach mehreren bewährten Microtools prüfen:

- Ergebnisse einem Deal zuordnen
- Inputs zwischen Tools übernehmen
- gespeicherte Projekte
- Evidence / References selektiv integrieren

Der Workspace bleibt optional.

## T7 – Erweiterte Exporte

Nur bei echtem Bedarf:

- PowerPoint
- kundenfähige PDF-Pakete
- Meeting-/Workshop-Unterlagen
- wiederverwendbare Templates

## Nicht priorisieren

- CRM-Nachbau
- Pipeline
- Kontaktverwaltung
- Activity Timeline
- generische Task-App
- Cloud Sync
- AI als Voraussetzung
- vollständige MEDDPICC-CRUD-Maske
- neue Schemafelder ohne konkreten Microtool-Use-Case
