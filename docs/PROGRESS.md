# Projektfortschritt / Handoff

## Aktueller Produktstand

Am 07.10.2026 wurde die MEDDPICC Toolbox weiter präzisiert.

Die zentrale Produktgrenze lautet jetzt:

> **Kein ganzheitliches MEDDPICC-System und kein CRM. Die Toolbox erleichtert wiederkehrende Arbeit und stellt Wissen genau dann bereit, wenn es gebraucht wird.**

## Verbindliches Produktmodell

Drei Bausteine:

1. **Tools** – konkrete Arbeit berechnen, strukturieren, vorbereiten oder visualisieren.
2. **Checklists** – kurze Lern- und Orientierungshilfen für Themen und wiederkehrende Sales-Situationen.
3. **Knowledge** – kompakte MEDDPICC-Referenz statt erneuter Buchsuche.

MEDDPICC bleibt die fachliche Basis, wird aber nicht als vollständiger Deal-Workflow erzwungen.

## Checklists

Checklists sind ausdrücklich keine Deal-Scorecards.

Ein Checklist-Punkt soll bei Bedarf erklären:

- Worum geht es?
- Warum ist das wichtig?
- Woran erkenne ich es?
- Was wird häufig falsch interpretiert?
- Welche Frage oder Handlung kann helfen?

Standardansicht: schnell scanbar. Details: progressiv aufklappbar.

Keine historische Opportunity-Pflege, kein Score, kein Management-Dashboard.

## Produktiver Slice

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
- CI grün

## Aktiver Migrations-Slice

Branch: `feat/toolbox-start-checklists-knowledge`

Ziel:

1. Roadmap auf Tools / Checklists / Knowledge festschreiben
2. Startseite auf diese drei Einstiege migrieren
3. bestehende Go-Live-Rückwärtsplanung prominent erhalten
4. Checklists als Lernhilfe sichtbar machen
5. MEDDPICC Knowledge als geplante Referenzschicht darstellen
6. CRM-Abgrenzung in UI und Dokumentation explizit machen

## Nächster funktionaler Ausbau nach dieser Migration

**Checklists & Knowledge Foundation**.

Danach folgen die Value-&-Metrics-Tools, beginnend mit Quick Payback und Metric Builder.

## Bewusste Nichtziele

- Pipeline / Forecast
- Account-/Kontaktverwaltung
- vollständige Opportunity-Pflege
- Activity Tracking
- dauerhaftes MEDDPICC-Scoring
- Deal Health / Completeness
- Pflicht-Workflow über alle MEDDPICC-Bereiche
