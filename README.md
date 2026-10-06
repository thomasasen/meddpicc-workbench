# MEDDPICC Workbench

Eine local-first **Deal-Reasoning- und Coaching-Workbench** für komplexe B2B-Opportunities nach MEDDPICC.

Die Grundidee ist einfach: **Die Projektdatei ist die Source of Truth.** Strukturierte Deal-Daten und Evidence werden einmal erfasst und anschließend von deterministischen Coaching-Services genutzt, um Gaps, Risiken, nächste Aktionen, Value und Prozessabhängigkeiten nachvollziehbar abzuleiten. Der Core benötigt weder AI, Backend, Benutzerkonto noch externe Datenbank.

> **Projektstatus:** Pre-Alpha. Foundation, Project File Lifecycle und das gemeinsame Qualifizierungsfundament aus Evidence, References, Risks, Actions, Projektmetadaten und Traceability sind vorhanden. Der aktuelle Produktfokus liegt nun auf deterministischen Seller-Workflows: Deal Inspector, Next Best Action, Qualification Gates, Champion-/Economic-Buyer-Coaching, Value-/Business-Case-Tools, Process-/Closing-Planung und Meeting Prep.

[![Live-Anwendung öffnen](https://img.shields.io/badge/MEDDPICC%20Workbench-Live--Anwendung%20%C3%B6ffnen-2563EB?style=for-the-badge)](https://thomasasen.github.io/meddpicc-workbench/)

## Projektsprache

Die Projektsprache ist **Deutsch**.

Deutsch verwenden wir für UI, Dokumentation, Issues, Pull Requests, Hilfetexte und fachliche Beschreibungen. Etablierte MEDDPICC-Begriffe wie `Economic Buyer`, `Decision Process`, `Paper Process` oder `Champion` bleiben im Original. Code, Schema-Keys, API-Namen und andere technische Identifier bleiben Englisch.

## Warum dieses Projekt existiert

MEDDPICC ist wertvoll, weil es Seller dazu zwingt, zwischen belastbarem Wissen und bloßen Annahmen zu unterscheiden. Gute Qualifizierung erzeugt in der Praxis jedoch viel repetitive Arbeit: Evidenz pflegen, Decision Process und Paper Process rekonstruieren, Business Cases neu berechnen, Gaps verfolgen, vom gewünschten Go-Live rückwärts planen und Deal Reviews vorbereiten.

MEDDPICC Workbench soll diese administrative und analytische Arbeit reduzieren, ohne die fachliche Beurteilung des Sellers zu ersetzen. Das Produkt soll deshalb **nicht primär MEDDPICC-Felder digitalisieren**, sondern konkrete Verkäuferaufgaben vereinfachen.

Zu jedem Zeitpunkt im Deal soll die Anwendung vier Fragen beantworten:

1. **Was wissen wir tatsächlich?**
2. **Was ist noch Annahme oder unbekannt?**
3. **Welche Gaps oder Risiken sind relevant?**
4. **Welche konkrete nächste Aktion verbessert die Qualifizierung?**

## Produktkonzept

Ein Seller erstellt oder öffnet ein Opportunity-Projekt:

```text
ACME CRM Transformation.meddpicc
        ↓
MEDDPICC Workbench
        ↓
deterministische Deal-Reasoning- und Coaching-Services
        ↓
aktualisierte .meddpicc-Projektdatei
        ↓
Ablage bei der Opportunity, z. B. im CRM
```

Die Anwendung läuft vollständig im Browser und wird automatisch über GitHub Pages bereitgestellt.

**Live:** https://thomasasen.github.io/meddpicc-workbench/

### Standard-Demo

Beim Öffnen der Anwendung wird zunächst eine vollständig fiktive Demo-Opportunity aus `examples/demo-opportunity.meddpicc` geladen. Über die Projektleiste können Nutzer ein fachlich leeres Projekt anlegen, eine lokale `.meddpicc`-Datei vollständig validiert öffnen und den aktuellen Stand wieder als `.meddpicc` herunterladen. Die Startseite liest Account, Deal Value, Termine, MEDDPICC-Status, Risiken und nächste Aktionen direkt aus dem aktuell geladenen Projekt. Über die gemeinsamen Arbeitsoberflächen lassen sich Projektmetadaten, Evidenz, Quellenreferenzen, Risiken und Aktionen projektweit validiert pflegen. Evidence kann einen Reference-Record referenzieren und mit stabil adressierbaren Qualification-Entities verknüpft werden; die kanonische Relation bleibt dabei auf der jeweiligen Entity in deren `evidenceIds`. Sichtbare Risk-/Action-Findings zeigen im Dashboard eine nachvollziehbare Quellenbasis und verlinken auf den zugrunde liegenden Source-Record.

Die Demo dient gleichzeitig als Regression-Fixture für das formalisierte Pre-Alpha-Dateiformat. Sie verwendet `schemaVersion: 0.2.0`. Zusätzlich sichert `examples/legacy/demo-opportunity-0.1.0.meddpicc` die deterministische Migration des echten historischen 0.1.0-Formats ab. Der kanonische Vertrag liegt in `schema/meddpicc-project.schema.json`; Pre-Alpha-Versionen sind weiterhin noch kein langfristiger Kompatibilitätsvertrag.

## Kernprinzipien

- **Local-first** – Projektdaten werden im Browser verarbeitet.
- **Kein AI-Zwang im Core** – Qualifizierungslogik, Gaps, Priorisierung, Berechnungen und Planung sind deterministisch. AI kann später optional nur unstrukturierte Inputs in Candidate Evidence überführen.
- **Kein Backend erforderlich** – GitHub Pages kann die vollständige Anwendung hosten.
- **Portable Projektdateien** – eine `.meddpicc`-Datei enthält den wiederverwendbaren Opportunity-Stand.
- **Evidenz vor Optimismus** – Annahmen dürfen niemals wie bestätigte Fakten aussehen.
- **Aus Gaps werden Aktionen** – fehlende Qualifizierung soll zu einer klaren nächsten Aktion führen.
- **Ein Datenmodell** – alle Services lesen denselben Projektstand.
- **Workflows statt Datensätze** – UI und Services starten von Seller-Aufgaben, nicht von Schemafeldern.
- **Kein CRM-Nachbau** – keine Account-/Kontaktverwaltung, Pipeline, Activity Timeline oder generische Task-App.
- **Abwärtskompatible Dateien** – Schema-Versionierung und Migrationen sind zentrale Anforderungen.
- **Accessible by Design** – Tastatur, Fokus, Kontrast, Responsive-Verhalten und nicht farbabhängige Statussemantik sind Basisanforderungen.
- **Deutsch als Produktsprache** – außer bei etablierten Fachbegriffen und technischen Identifiern.

## Geplante Arbeitsoberfläche

Die Workbench orientiert sich an konkreten Verkäuferaufgaben.

### Deal-Fokus

- Was braucht aktuell Aufmerksamkeit?
- Welche Gaps sind kritisch?
- Welche Risiken und nächsten Aktionen sind belegt?
- Welche Information ist noch Annahme oder unbekannt?

### Deterministische Coaching-Services

Priorisiert geplant:

1. **Deal Inspector / Qualification Gap Engine** – erkennt und erklärt kritische Qualification Gaps.
2. **Next Best Action Engine** – priorisiert wenige konkrete Sales-Aktionen und erklärt „Warum jetzt?“.
3. **Qualification Gates / Pause Points** – prüft Voraussetzungen vor POC, Demo, Pricing, Proposal, Commit usw.
4. **Champion Tester** – bewertet Champion-Evidence anhand beobachtbaren Verhaltens.
5. **Economic Buyer Coach** – prüft Candidate, Autorität, Zugang, Priorität, Business Case und Return Ticket.
6. **Metrics & Business Case Builder** – berechnet Baseline, Benefit, ROI, Payback, Cost of Delay und Szenarien.
7. **Decision / Paper Process / Closing Planner** – prüft Schritte, Owner, Dependencies, Termine und Critical Path.
8. **Meeting Prep Coach** – wählt aus Deal-Gaps passende Gesprächsziele und Fragen.

Diese Services funktionieren im Core ohne AI-/LLM-Runtime.

### Unterstützende Projektdaten

Evidence, References, Stakeholder, Risks, Actions, MEDDPICC-Entities und Projektmetadaten bleiben wichtig, sind aber **Unterbau der Workflows** und nicht das primäre Produktversprechen.

### Später optional: AI-assisted Input

Ein optionaler AI-Layer darf Transkripte oder freie Notizen in **Candidate Evidence** überführen. Erst nach Nutzerbestätigung werden daraus kanonische Projektdaten. Das deterministische Reasoning bleibt davon getrennt.

### Output

- Executive / Manager Deal Review
- MEDDPICC-Zusammenfassung
- Gaps + Next Best Actions
- kundenfähiger Closing-/Go-Live-Plan
- CRM-fähige Textzusammenfassung
- JSON-/`.meddpicc`-Export

## Inhalt einer Projektdatei

Ein `.meddpicc`-Projekt ist für v1 als menschenlesbares JSON mit eigener Dateiendung geplant. Es enthält unter anderem:

- Projektmetadaten
- alle MEDDPICC-Elemente
- strukturierte Evidenz und Quellenreferenzen
- Annahmen und unbekannte Informationen
- Risiken und Qualification Gaps
- nächste Aktionen
- Business-Case-Eingaben und berechnete Ergebnisse
- Schritte aus Decision Process und Paper Process
- Go-Live-Planungsdaten
- Scoring-Ergebnisse
- Projekthistorie
- Schema- und Anwendungsversion

Die erste Version bettet bewusst keine Binäranhänge ein. Dokumente können über Titel, CRM-ID, URL oder andere Metadaten referenziert werden, ohne die Projektdatei unnötig groß zu machen.

Siehe [Spezifikation der Projektdatei](docs/PROJECT_FILE_SPEC.md).

## Technische Architektur

Technische Basis:

- Vue 3
- TypeScript
- Vite
- Pinia
- Vue Router
- JSON Schema als kanonischer `.meddpicc`-Dateiformatvertrag
- Ajv für Runtime-Validierung plus zusätzliche Domain Validation
- TypeScript-Typen werden beim Build aus dem JSON Schema generiert
- Vitest für Unit Tests
- Playwright für zentrale Browser-Flows und Smoke Tests
- GitHub Actions für Build/Test/Deployment
- GitHub Pages für Hosting

Browser Storage darf für Recovery oder Komfort genutzt werden, darf die Projektdatei aber niemals stillschweigend als kanonischen Projektstand ersetzen.

Siehe [Architektur](docs/ARCHITECTURE.md).

## UI/UX Engineering

Die Anwendung besitzt bereits vor der Implementierung ein projektspezifisches Design System.

Die visuelle Richtung ist bewusst **Enterprise Workbench** und nicht Marketing-SaaS:

- zugänglich und semantisch
- minimale/Swiss Informationshierarchie
- informationsdicht, aber lesbar
- Übersicht → Drill-Down → Evidenz
- zurückhaltende semantische Farben
- minimale dekorative Bewegung
- System-/lokale Fonts und gebündelte Assets
- keine MEDDPICC-Statusbedeutung ausschließlich über Farbe
- konsistente lokale SVG-Icons über Lucide

Das Projekt nutzt [UI UX Pro Max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) ausschließlich als **externe Entwicklungsreferenz**. Es ist kein Bestandteil der Produktions-Runtime.

Anweisungen für Coding Assistants liegen in:

- `AGENTS.md`
- `.github/copilot-instructions.md`
- `.agents/skills/meddpicc-ui-ux/SKILL.md`

Siehe [Design System](docs/DESIGN_SYSTEM.md) und [UI/UX-Entwicklungsreferenz](docs/UI_UX_REFERENCE.md).

## Scope-Grenzen

MEDDPICC Workbench soll **nicht** werden:

- CRM
- E-Mail-Client
- Kalender
- Kontaktdatenbank
- Pipeline-Management-System
- generativer AI Sales Assistant
- Cloud-Ablage für Kundendaten

Diese Grenzen sind wichtig. Das Produkt soll ein fokussierter Begleiter für Qualifizierung und Deal Planning bleiben.

## Roadmap

Die Umsetzung erfolgt in kleinen, testbaren Phasen:

1. Foundation
2. Project File Lifecycle
3. gemeinsames Qualifizierungsfundament
4. deterministische Deal-Reasoning- und Coaching-Services
5. Workflow-Orchestrierung / Seller UX
6. Review und Export
7. optionale AI-assisted Input Layer
8. Hardening

Die detaillierte Reihenfolge der Coaching-Services und der aktuelle nächste Slice stehen verbindlich in `docs/ROADMAP.md` und `docs/PROGRESS.md`.

Siehe die ausführliche [Roadmap](docs/ROADMAP.md).

## Dokumentation

- [Projektauftrag](docs/PROJECT_CHARTER.md)
- [Architektur](docs/ARCHITECTURE.md)
- [Spezifikation der Projektdatei](docs/PROJECT_FILE_SPEC.md)
- [Design System](docs/DESIGN_SYSTEM.md)
- [Icon System](docs/ICON_SYSTEM.md)
- [UI/UX-Entwicklungsreferenz](docs/UI_UX_REFERENCE.md)
- [Roadmap](docs/ROADMAP.md)
- [Aktueller Projektfortschritt / Handoff](docs/PROGRESS.md)
- [Beitragen](CONTRIBUTING.md)
- [Security & Privacy](SECURITY.md)
- [Agent-Anweisungen](AGENTS.md)
- [Third-Party Notices](THIRD_PARTY_NOTICES.md)

## Methodik und Inhalte

Dieses Projekt setzt allgemeine MEDDPICC-Konzepte als strukturierte Software-Workflows um. Die Implementierung verwendet eigene Formulierungen und deterministische Regeln. Copyright-geschützte Buchtexte, proprietäre Trainingsunterlagen oder Inhalte fremder Kurse dürfen nicht reproduziert werden.

Die Anwendung ist ein unabhängiges Open-Source-Projekt und wird nicht als offizielles MEDDPICC-Trainingsprodukt oder als mit einem Methodikanbieter bzw. Autor verbunden dargestellt.

## Lizenz

MIT. Siehe [LICENSE](LICENSE).
