# MEDDPICC Toolbox

Eine local-first Sammlung fokussierter **Tools, Checklists und Wissenshilfen** für wiederkehrende Aufgaben im komplexen B2B-Vertrieb.

> **Produktgrenze:** Die Toolbox ist kein ganzheitliches MEDDPICC-System und kein CRM. Sie verwaltet keinen Deal vollständig.

## Was die Toolbox leisten soll

Ein Account Manager soll die Anwendung öffnen können, wenn eine konkrete Aufgabe ansteht:

- einen Go-Live vom Zieltermin rückwärts planen
- Payback oder Cost of Delay berechnen
- einen Economic-Buyer-Termin vorbereiten
- vor einem POC oder Closing nichts Wesentliches vergessen
- einen MEDDPICC-Begriff oder eine typische Fehlinterpretation schnell nachschlagen

Die Anwendung besteht deshalb aus drei Bausteinen:

### Tools

Fokussierte Services für konkrete, wiederkehrende Arbeit. Jedes Tool besitzt einen eigenen kleinen Inputvertrag und funktioniert ohne angelegten Deal.

### Checklists

Lern- und Orientierungshilfen für Themen und wiederkehrende Sales-Situationen. Ein Checklist-Punkt erklärt nicht nur **was** geprüft wird, sondern auch **worum es geht, warum es wichtig ist, woran man es erkennt und was häufig falsch interpretiert wird**.

Checklists erzeugen keinen gespeicherten Deal-Score und keinen Opportunity-Status.

### Knowledge

Kompakte, praxisnahe Referenz für MEDDPICC-Konzepte, damit der Account Manager nicht jedes Mal in den Büchern nachschlagen muss. Diese Wissensbasis kann später auch Checklists und Hilfetexte innerhalb der Tools speisen.

## Aktuell produktiv

### Go-Live-Rückwärtsplanung

Pfad: Tools → Go-Live & Buying Process → Go-Live-Rückwärtsplanung

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
- SVG- und PNG-Export

Arbeitstage berücksichtigen in v0.1 Montag bis Freitag. Feiertage werden bewusst nicht automatisch angenommen.

## Produktprinzipien

- **Konkrete Aufgabe vor Datenpflege.**
- **Kein vollständiger Opportunity-Datensatz als Voraussetzung.**
- **Keine Pipeline-, Account-, Kontakt- oder Activity-Verwaltung.**
- **Keine dauerhaft gepflegten MEDDPICC-Scores.**
- **Local-first und deterministisch by default.**
- **Kundenfähige Outputs, wenn der Use Case es rechtfertigt.**
- **Checklists erklären statt nur abhaken zu lassen.**
- **MEDDPICC bleibt fachliche Orientierung, aber kein erzwungener Workflow.**

## Fachliche Fundierung

Die fachliche Ausrichtung stützt sich primär auf die bereitgestellten Werke von Andy Whyte und Darius Lahoutifard. Softwarelogik, Informationsarchitektur und konkrete UI-Formulierungen sind eigene Produktentscheidungen. Unterschiede zwischen den Autoren sollen bei Knowledge-Inhalten sichtbar gemacht werden, wenn sie für die praktische Anwendung relevant sind.

## Technische Basis

- Vue 3, TypeScript, Vite und Vue Router
- Vitest und Playwright
- GitHub Actions / GitHub Pages
- Lucide Icons
- Design Tokens und Accessibility-Baseline
- local-first Browser-Anwendung

Bestehende frühere Deal-/Project-Komponenten bleiben Legacy-/Experimentiercode und sind nicht mehr das primäre Produktmodell.

## Qualitätsgates

Vor Merge eines Feature-PRs werden mindestens Formatierung, Lint, Unit Tests, Production Build, Pages-Integrität und Playwright für Desktop und Mobile geprüft.

## Dokumentation

- Projektauftrag: `docs/PROJECT_CHARTER.md`
- Architektur: `docs/ARCHITECTURE.md`
- Roadmap: `docs/ROADMAP.md`
- Fortschritt: `docs/PROGRESS.md`
- Design System: `docs/DESIGN_SYSTEM.md`
- Regeln der Go-Live-Rückwärtsplanung: `docs/REVERSE_TIMELINE_RULES.md`
- Agent-Anweisungen: `AGENTS.md`

## Lizenz

MIT. Siehe LICENSE.
