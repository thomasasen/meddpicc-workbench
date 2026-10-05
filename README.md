# MEDDPICC Workbench

Eine local-first Browser-Anwendung zur Verwaltung und Qualifizierung komplexer B2B-Opportunities mit MEDDPICC.

Die Grundidee ist einfach: **Die Projektdatei ist die Source of Truth.** Die Anwendung öffnet eine portable `.meddpicc`-Datei, unterstützt bei der strukturierten Bewertung der Opportunity mit deterministischen Werkzeugen und speichert das aktualisierte Projekt wieder in dieser Datei. Zur Runtime werden weder AI, Backend, Benutzerkonto noch externe Datenbank benötigt.

> **Projektstatus:** Pre-Alpha. Foundation und Project File Lifecycle sind im Core abgeschlossen. Roadmap 2 besitzt ein projektweites Evidenzregister, gemeinsame Risiken und nächste Aktionen sowie editierbare Source-/Reference-Records. Sichtbare Risk-/Action-Findings im Dashboard zeigen ihre Quellenbasis mit Drill-down zu Evidence bzw. Reference-Records. Projektmetadaten-Bearbeitung und konkrete Evidence-to-Entity-Verknüpfungen bleiben offen. Historische Schema-0.1.0-Dateien werden deterministisch auf 0.2.0 migriert.

[![Live-Anwendung öffnen](https://img.shields.io/badge/MEDDPICC%20Workbench-Live--Anwendung%20%C3%B6ffnen-2563EB?style=for-the-badge)](https://thomasasen.github.io/meddpicc-workbench/)

## Projektsprache

Die Projektsprache ist **Deutsch**.

Deutsch verwenden wir für UI, Dokumentation, Issues, Pull Requests, Hilfetexte und fachliche Beschreibungen. Etablierte MEDDPICC-Begriffe wie `Economic Buyer`, `Decision Process`, `Paper Process` oder `Champion` bleiben im Original. Code, Schema-Keys, API-Namen und andere technische Identifier bleiben Englisch.

## Warum dieses Projekt existiert

MEDDPICC ist wertvoll, weil es Seller dazu zwingt, zwischen belastbarem Wissen und bloßen Annahmen zu unterscheiden. Gute Qualifizierung erzeugt in der Praxis jedoch viel repetitive Arbeit: Evidenz pflegen, Decision Process und Paper Process rekonstruieren, Business Cases neu berechnen, Gaps verfolgen, vom gewünschten Go-Live rückwärts planen und Deal Reviews vorbereiten.

MEDDPICC Workbench soll diese administrative Arbeit reduzieren, ohne die fachliche Beurteilung des Sellers zu ersetzen.

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
Dashboard + MEDDPICC-Module + deterministische Tools
        ↓
aktualisierte .meddpicc-Projektdatei
        ↓
Ablage bei der Opportunity, z. B. im CRM
```

Die Anwendung läuft vollständig im Browser und wird automatisch über GitHub Pages bereitgestellt.

**Live:** https://thomasasen.github.io/meddpicc-workbench/

### Standard-Demo

Beim Öffnen der Anwendung wird zunächst eine vollständig fiktive Demo-Opportunity aus `examples/demo-opportunity.meddpicc` geladen. Über die Projektleiste können Nutzer ein fachlich leeres Projekt anlegen, eine lokale `.meddpicc`-Datei vollständig validiert öffnen und den aktuellen Stand wieder als `.meddpicc` herunterladen. Die Startseite liest Account, Deal Value, Termine, MEDDPICC-Status, Risiken und nächste Aktionen direkt aus dem aktuell geladenen Projekt. Über die gemeinsamen Arbeitsoberflächen lassen sich Evidenz, Quellenreferenzen, Risiken und Aktionen projektweit validiert pflegen. Evidence kann einen Reference-Record referenzieren; sichtbare Risk-/Action-Findings zeigen im Dashboard eine nachvollziehbare Quellenbasis und verlinken auf den zugrunde liegenden Source-Record.

Die Demo dient gleichzeitig als Regression-Fixture für das formalisierte Pre-Alpha-Dateiformat. Sie verwendet `schemaVersion: 0.2.0`. Zusätzlich sichert `examples/legacy/demo-opportunity-0.1.0.meddpicc` die deterministische Migration des echten historischen 0.1.0-Formats ab. Der kanonische Vertrag liegt in `schema/meddpicc-project.schema.json`; Pre-Alpha-Versionen sind weiterhin noch kein langfristiger Kompatibilitätsvertrag.

## Kernprinzipien

- **Local-first** – Projektdaten werden im Browser verarbeitet.
- **Keine AI zur Runtime** – Qualifizierungslogik, Berechnungen, Prüfungen und Exporte sind deterministisch.
- **Kein Backend erforderlich** – GitHub Pages kann die vollständige Anwendung hosten.
- **Portable Projektdateien** – eine `.meddpicc`-Datei enthält den wiederverwendbaren Opportunity-Stand.
- **Evidenz vor Optimismus** – Annahmen dürfen niemals wie bestätigte Fakten aussehen.
- **Aus Gaps werden Aktionen** – fehlende Qualifizierung soll zu einer klaren nächsten Aktion führen.
- **Ein Datenmodell** – jedes Modul liest und schreibt denselben Projektstand.
- **CRM-Begleiter statt CRM-Ersatz** – die Workbench verwaltet MEDDPICC-Tiefe, nicht den kompletten Sales-Prozess.
- **Abwärtskompatible Dateien** – Schema-Versionierung und Migrationen sind zentrale Anforderungen.
- **Accessible by Design** – Tastatur, Fokus, Kontrast, Responsive-Verhalten und nicht farbabhängige Statussemantik sind Basisanforderungen.
- **Deutsch als Produktsprache** – außer bei etablierten Fachbegriffen und technischen Identifiern.

## Geplanter Workspace

### Projekt

- Opportunity-Metadaten
- Deal-Health-Übersicht
- Evidenzregister
- Quellen und Referenzen
- Risiken
- nächste Aktionen
- Änderungshistorie

### MEDDPICC

- Metrics
- Economic Buyer
- Decision Criteria
- Decision Process
- Paper Process
- Identify / Implicate Pain
- Champion
- Competition

### Deterministische Tools

- Metrics- und Value-Calculator
- ROI- und Payback-Calculator
- Cost-of-Delay-Calculator
- Go-Live-/Critical-Path-Planer
- Closing Checklist
- Confidence-/Evidence-Scoring
- Decision-Criteria-Matrix
- Champion-Evidence-Check

### Output

- Executive Deal Review
- Manager Deal Review
- MEDDPICC-Zusammenfassung
- kundenfähiger Go-Live-Plan
- CRM-fähige Zusammenfassung
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

1. Projektgrundlage, Design System und technisches Grundgerüst
2. `.meddpicc`-Dateilifecycle und Schema-Validierung
3. Dashboard, Evidenz, Risiken, Aktionen und Historie
4. MEDDPICC-Kernmodule
5. deterministische Tools
6. Exporte und CRM-Handoff
7. Hardening, Accessibility, Offline-Nutzung und Migrationen

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
