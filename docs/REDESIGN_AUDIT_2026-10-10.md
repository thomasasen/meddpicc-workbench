# UX/UI- und Report-Redesign – Repository-Audit und Lieferplan

Stand: 10.10.2026. Ausgangsbasis: `feature/value-bridge` (`4bafd3e`), PR #62 offen; `main` (`7759a7e`). **Keine Änderung an `main`.**

## 1. Prüfgrundlage und Abgrenzung

- Gesichtet: `AGENTS.md`, Charter, Architektur, Design-/Icon-System, Roadmap, Progress, bestehendes Report-System, `src/router/index.ts`, die tatsächliche Verzeichnisstruktur, gemeinsame UI-/Report-Module und relevante Vue-Templates.
- GitHub Actions: Letzter auf PR #62 bezogener Workflow auf `4bafd3e` abgeschlossen mit `success`. Laut PR-Beschreibung: 326 Unit-Tests, 135 Playwright-Tests erfolgreich, ein Skip. **Das ist kein Testnachweis für die neu angelegten Redesign-Änderungen.**
- Scope: Produktiv erreichbare Bereiche zuerst; verwaiste Legacy-Dateien werden nicht grundlos erneuert.
- Die nachstehende Bestandsaufnahme ist eine **Route-/Artefaktinventur und technische Erstanalyse**, keine Behauptung einer abgeschlossenen Pixel- oder Accessibility-Prüfung aller Screens.

## 2. Routeninventar (28 registrierte Ziele)

| Route | Bereich | Bewertung | Priorität |
| --- | --- | --- | --- |
| `/` | Start, Tools-/Checklist-/Knowledge-Navigation | produktiv | P1 |
| `/tools/quick-payback` | Quick Payback und Software Business Case (zwei Modi) | produktiv | P1 |
| `/tools/metric-builder` | Metric Builder (drei Schritte) | produktiv | P1 |
| `/tools/cost-of-delay` | Cost of Delay (drei Schritte) | produktiv | P1 |
| `/tools/value-bridge` | Value Bridge (PR #62, drei Schritte und Output) | produktiv auf Feature-Branch | P1 |
| `/tools/reverse-timeline` | Go-Live-Rückwärtsplanung | produktiv | P1 |
| `/checklists/discovery-call` | Discovery Call | produktiv | P2 |
| `/checklists/decision-criteria` | Decision Criteria | produktiv | P2 |
| `/checklists/decision-process` | Decision Process | produktiv | P2 |
| `/checklists/pain-implication` | Pain / Implication | produktiv | P2 |
| `/checklists/champion` | Champion | produktiv | P2 |
| `/checklists/competition` | Competition | produktiv | P2 |
| `/checklists/paper-process` | Paper Process | produktiv | P2 |
| `/checklists/metrics` | Metrics | produktiv | P2 |
| `/checklists/economic-buyer` | Economic Buyer | produktiv | P2 |
| `/checklists/economic-buyer-meeting` | Economic-Buyer-Termin | produktiv | P2 |
| `/knowledge/discovery-call` | Discovery Call | produktiv | P2 |
| `/knowledge/decision-criteria` | Decision Criteria | produktiv | P2 |
| `/knowledge/decision-process` | Decision Process | produktiv | P2 |
| `/knowledge/pain-implication` | Pain / Implication | produktiv | P2 |
| `/knowledge/champion` | Champion | produktiv | P2 |
| `/knowledge/competition` | Competition | produktiv | P2 |
| `/knowledge/paper-process` | Paper Process | produktiv | P2 |
| `/knowledge/metrics` | Metrics | produktiv | P2 |
| `/knowledge/economic-buyer` | Economic Buyer | produktiv | P2 |
| `/evidence` | Evidence Register | Legacy / intern, nicht primär navigiert | P3 |
| `/risks-actions` | Risiko-/Maßnahmenverwaltung | Legacy / intern, nicht primär navigiert | P3 |
| `/references` | Quellen-/Referenzverwaltung | Legacy / intern, nicht primär navigiert | P3 |

**Wichtig:** Nicht als eigenständige Route registriert, aber produktiv: `SoftwarePaybackPanel.vue` als Projektmodus der Quick-Payback-Seite. Die Seite braucht deshalb **zwei** gesonderte UI-Abnahmen. Unregistrierte Domain-/Store-Komponenten sind kein zusätzlicher produktiver Screen.

## 3. Reports und Visualisierungen

| Export / Darstellung | Datei | Status vor Redesign | Vorbereitende Umsetzung |
| --- | --- | --- | --- |
| Value-Bridge-PDF | `src/report/valueBridgePdf.ts` | PR #62: visuell aufgewertet, aber Langtext-Stressprüfung offen | gemeinsamer Footer integriert |
| Metric-Steckbrief | `src/report/metricBuilderPdf.ts` | eigener PDF-Layout-/Textumbruchcode | gemeinsamer Footer integriert |
| Cost-of-Delay-PDF | `src/report/costOfDelayPdf.ts` | eigene Szenario-/Zeitleisten-Gestaltung | gemeinsamer Footer integriert |
| Finance Business Case | `src/report/softwareBusinessCasePdf.ts` | mehrseitiger Finanzbericht mit Szenarien | gemeinsamer Footer integriert |
| Kunden-Business-Case | `src/report/customerBusinessCasePdf.ts` | separates vierseitiges Kundenformat | gemeinsamer Footer integriert |
| Go-Live-SVG-/PNG-Export | `src/services/timelineExport.ts` | Kunden-Timeline, kein PDF | noch nicht umgebaut |
| Go-Live-Chart | `src/components/CustomerTimelineChart.vue` | SVG-/Zeitachsen-Darstellung | unverändert |
| Business-Case-Chart | `src/components/SoftwareBalanceChart.vue` | Salden, Zeitachse | unverändert |

Quick Payback im Einfachmodus erzeugt eine kopierbare Zusammenfassung; die beiden PDFs entstehen über den Projektmodus im `SoftwarePaybackPanel`. Eine zusätzliche PDF-Engine allein für den Quick-Modus wäre nicht ohne fachlichen Mehrwert sinnvoll.

## 4. Weitere technische Bestandsaufnahme

- **UI:** `src/views/HomeView.vue`, fünf aktive Tool-Views, neun Knowledge-Views, eine parametrische Checklist-View für zehn Routen; `src/components/SoftwarePaybackPanel.vue` ist die größte formular- und ergebnisführende Einzelkomponente.
- **Wiederverwendung:** bereits vorhanden sind die zentralen Layout-, Formular- und Panelklassen in `src/styles/main.css`. Zusätzliche Styles: `costOfDelay.css`, `valueBridge.css`, `reverseTimelineDragElevation.css`. Die Ergänzung `redesignFoundations.css` gilt über die Produktbereiche hinweg.
- **Icons:** `@lucide/vue` Version 1.51.0, statische Imports. Bestehende Zuordnungen in `docs/ICON_SYSTEM.md` beibehalten.
- **PDFs:** gemeinsame Technologie `pdf-lib` 1.17.1, bislang mehrfach eigene Fußzeilen, Textumbruch-, Farb-, Abstand- und Seitenfunktionen. `src/report/reportChrome.ts` zentralisiert in der ersten Phase die Footer-Funktion. **Der darüber liegende Report-Layoutcode ist noch nicht vereinheitlicht.**
- **Local-first:** Alle betroffenen Funktionen verbleiben clientseitig. Kein Netzwerkservice, keine neue Runtime-Abhängigkeit, keine persistente Opportunity.
- **Semantik:** Hypothesen, Potenziale, tatsächlich realisierbare Effekte und Kundennachweise müssen getrennt bleiben. Design ersetzt keine Validierung.

## 5. Problemklassen und Priorisierung

| P | Befund / Risiko | Maßnahme | Abnahme |
| --- | --- | --- | --- |
| P0 | Unbeabsichtigtes Ändern fokussierter Selects beim Scrollen | zentraler Wheel-Guard | Playwright: Select nach Wheel unverändert |
| P0 | Unterschiedliche Footer/Seitenzahlen in den Reports | `reportChrome.ts` | PDF-Regressions- und Renderingprüfung |
| P1 | Fünf eigenständige Layoutsysteme, redundante Reportlogik | Header, Flow, Typografie, Safe-Wrapping und KPI-Card-Helfer schrittweise vereinheitlichen | jede echte PDF-Seite bei Randfällen visuell prüfen |
| P1 | Ergebnisse und Berechnungsteile konkurrieren visuell | Executive Summary / KPI-Hierarchie in Quick Payback, Software Business Case, Metric, Cost of Delay, Value Bridge | Desktop/Mobile 375, 768, 1024, 1440 |
| P1 | Umfangreiche Eingabestrecken | Progressive Disclosure und konsistente Schrittzustände, Scroll-Stabilität | keine verlorenen Eingaben und unerwartete Scrollsprünge |
| P1 | Business-Potenzial wirkt durch Design wie gesicherte Ersparnis | Evidenz-/Wirkungsstatus neben Wert | Domain-Regression |
| P2 | Lange Checklists ohne selektive Ansicht | `Alle / Noch offen / Markiert` und temporärer Zähler | Playwright; kein Deal-Score |
| P2 | Knowledge-Seiten inhaltsdicht | einheitliche Inhaltsanker, gut sichtbare Abgrenzung und Quellen einklappbar | Tastatur, Screenreader, Mobile |
| P2 | Go-Live-Termine / Abhängigkeiten | Meilenstein-Darstellung und Kundenexport prüfen | SVG-/PNG-Originale |
| P3 | Legacy-Routen bleiben technisch erreichbar | nach Produktentscheidung separat prüfen | keine ungewollte Datenmigration |

## 6. Implementierungsstand dieses ersten Draft-PR

**Eingebaut:** ein gemeinsamer Footer für alle fünf PDF-Generatoren; globale Dropdown-Wheel-Sicherung; gefilterte, nicht persistente Checklists; gemeinsame typografische, Focus-/Mobile- und Feld-Grundlagen; E2E-/Vitest-Abdeckung für die neuen Kernfunktionen.

**Noch nicht abgeschlossen:** visuell abgestimmte Executive Summaries aller Rechner; vollständiger PDF-Layoutumbau; manuelles Rendering *jeder* PDF-Testseite; alle vier Viewports und Accessibility-Prüfung für *jede* Route; visuelle Abnahme durch den Nutzer. Bestehende CI-Ergebnisse des Value-Bridge-Branches ersetzen die neue CI nicht.

## 7. Vorgesehene abgestimmte Draft-PRs

1. **Grundlagen (dieser PR):** sichere Bedienung, Design-Basics, PDF-Chrome, Audit und Tests. Basis: `feature/value-bridge`.
2. **Finance / Metrics:** Quick Payback, Software Business Case, Metric Builder und beide Business-Case-PDFs. Basis nach Review des Grundlagen-PR.
3. **Value Story / Delay:** Cost of Delay und Value Bridge inklusive PDF, Evidenz-/Annahmenlegende. Value-Bridge-Domainlogik unverändert.
4. **Go-Live / Enablement:** Go-Live-GUI und SVG/PNG-Export, danach alle zehn Checklists und neun Knowledge-Sichten.
5. **Visuelle QA / Dokumentation:** echte Browser-Screenshots, PDF-Renderings, Fehlerkorrektur, 375/768/1024/1440, Screenreader-/Tastaturtests, Abnahme-Liste.

Die PR-Grenzen sind ein Plan, keine Zusage, dass die Folgearbeiten in diesem ersten PR bereits implementiert sind. Alle Feature-PRs bleiben bis zur ausdrücklichen Freigabe Draft; kein Merge nach `main`.
