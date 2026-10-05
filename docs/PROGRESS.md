# Projektfortschritt

Stand: 05.10.2026

Dieses Dokument ist der kompakte Handoff-Stand für die Weiterentwicklung von MEDDPICC Workbench. Es ergänzt die Roadmap um den tatsächlich implementierten Zustand und den nächsten empfohlenen Arbeitsschritt.

## Aktueller Stand auf `main`

Letzter fachlicher Merge:

- PR #23 – `feat: zentrales Evidenzregister für Roadmap 2`
- Merge-Commit: `8ba42aadee40b3ebb1f365145fce4dc459511af2`

Für diesen Stand liefen auf `main` erfolgreich:

- Formatting
- ESLint
- Unit Tests
- Production Build
- Pages-Root-Synchronitätsprüfung
- Playwright Browser Smoke Tests für Desktop und Mobile
- GitHub Pages Build und Deployment

## Abgeschlossen

### Phase 0 – Foundation

Abgeschlossen.

Wesentliche Ergebnisse:

- Vue 3 + TypeScript + Vite
- Vue Router und Pinia
- Design System und Icon System
- ESLint und Prettier
- Vitest und Playwright
- GitHub Actions CI
- GitHub Pages Deployment
- kanonisches JSON Schema für `.meddpicc`
- Ajv Runtime Validation
- Build-time TypeScript-Generierung aus dem Schema
- zusätzliche Domain Validation

### Phase 1 – Project File Lifecycle

Im Core abgeschlossen.

Wesentliche Ergebnisse:

- `schemaVersion: 0.2.0`
- neues fachlich leeres Projekt
- lokale `.meddpicc`-Dateien öffnen
- vollständige Schema- und Domain-Validierung
- ungültige Dateien ersetzen niemals teilweise den aktuellen State
- Dirty-State
- Warnung vor Verlust ungespeicherter Änderungen
- `beforeunload`-Schutz
- validierter Save/Download
- Revision und `updatedAt` beim Speichern
- Round-Trip-Tests
- deterministische Migration `0.1.0 → 0.2.0`
- historisches Regression-Fixture
- migrierte Dateien bleiben bis zum Speichern dirty

Issue #3 ist abgeschlossen.

## Phase 2 – Gemeinsames Qualifizierungsmodell

Phase 2 ist aktiv.

### Bereits umgesetzt

#### Gemeinsames Evidenzregister

PR #23 hat den ersten produktiv nutzbaren Roadmap-2-Slice geliefert.

Unterstützt werden:

- Evidenz projektweit anzeigen
- neue Evidenz anlegen
- Classification:
  - `fact`
  - `customer_statement`
  - `seller_interpretation`
  - `assumption`
  - `confirmed_evidence`
  - `unknown`
- Quality getrennt von Classification
- Verification getrennt von Classification und Quality
- Source Stakeholder
- Source Date
- Context
- Zuordnung zu einem oder mehreren MEDDPICC-Bereichen
- visuelle und textliche Unterscheidung von Annahmen, Unbekanntem und bestätigter Evidenz
- vollständige Validierung vor Übernahme in den Projektstate
- Dirty-State beim Anlegen
- automatisches `evidence_added`-History-Event
- Speichern/Download direkt aus dem Evidenzregister
- Desktop- und Mobile-Browsertests

Technische Besonderheit:

Vor atomaren Store-Änderungen wird ein reaktiver Pinia/Vue-State mit `toRaw()` entpackt, bevor ein sicherer Snapshot erzeugt wird. Dadurch werden `DataCloneError`-Fehler durch Vue-Proxies verhindert.

### Noch offen in Phase 2

- Projektmetadaten als vollständige editierbare Arbeitsoberfläche
- Source-/Reference-Records als editierbare Arbeitsoberfläche
- Risiken als editierbare gemeinsame Objekte
- nächste Aktionen als editierbare gemeinsame Objekte
- weitere History-Events
- gemeinsames Statusmodell vollständig in den Arbeitsoberflächen nutzen
- Dashboard Findings mit expliziter Source-Traceability
- Evidenz gezielt mit mehreren konkreten Qualifizierungsaussagen/Entities verknüpfen

Issue #4 bleibt offen und bildet diesen Fortschritt ab.

## Nächster empfohlener Slice

### Risiken + nächste Aktionen

Der nächste Schritt soll nicht bereits die acht MEDDPICC-Kernmodule bauen. Zuerst werden die beiden gemeinsamen, bereichsübergreifenden Arbeitsobjekte vollständig nutzbar gemacht:

1. Risiken
2. nächste Aktionen

Warum dieser Schritt jetzt sinnvoll ist:

- Das Schema enthält Risk und Action bereits.
- Dashboard und Demo lesen diese Objekte bereits.
- Das Evidenzregister schafft die Grundlage für nachvollziehbare Qualification-Arbeit.
- Gaps sollen künftig nicht nur sichtbar sein, sondern in konkrete Aktionen übersetzt werden.
- Risiken und Aktionen werden später von allen acht MEDDPICC-Modulen gemeinsam genutzt und dürfen daher nicht in einzelnen Modulen dupliziert werden.

### Zielbild des nächsten Slices

Risiken sollen mindestens erfassen und bearbeiten können:

- Titel
- Severity
- Status
- MEDDPICC-Bereich
- Related Entity IDs, soweit sinnvoll nutzbar
- Impact
- Mitigation
- Owner
- Due Date
- Opened At

Aktionen sollen mindestens erfassen und bearbeiten können:

- Titel
- Status
- Owner
- Due Date
- MEDDPICC-Bereich
- Related Risk
- Related Gap
- Desired Evidence
- bereits gewonnene Evidence IDs

Zusätzlich:

- atomare, validierte Store-Operationen
- Dirty-State
- History Events für Risk Open/Close und Action Complete
- klare Verlinkung Risk → Action
- UI für projektweite Risiken und Aktionen
- Tests auf Domain-, Store- und Browser-Ebene
- keine Duplikation der Daten in MEDDPICC-Modulen
- keine generative AI zur Runtime

## Nicht Teil des nächsten Slices

Bewusst noch nicht umsetzen:

- vollständige Metrics-/Economic-Buyer-/Champion-Module
- automatische Risk- oder Action-Generierung
- Scoring Engine
- ROI-/Payback-Tools
- Critical Path
- CRM-Integration
- Cloud Sync
- generative AI
- File System Access API
- umfassendes Reference-Register, außer wenn minimal für Risk/Action-Integrität nötig

## Qualitätsregel

Ein Slice gilt erst als abgeschlossen, wenn:

- Schema- und Domain-Konsistenz gewahrt bleiben
- keine ungültigen Partial States in Pinia übernommen werden
- Formatting und Lint grün sind
- Unit Tests grün sind
- Production Build grün ist
- Pages-Root synchron ist
- Playwright Desktop und Mobile grün sind
- Dokumentation und Issue #4 nur tatsächlich umgesetzte Punkte abhaken
- Merge ausschließlich über einen grünen Pull Request erfolgt

## Relevante Dateien

- `docs/ROADMAP.md`
- `docs/ARCHITECTURE.md`
- `docs/PROJECT_FILE_SPEC.md`
- `schema/meddpicc-project.schema.json`
- `src/domain/project.ts`
- `src/domain/projectValidation.ts`
- `src/domain/evidence.ts`
- `src/stores/projectStore.ts`
- `src/views/EvidenceView.vue`
- `src/views/HomeView.vue`
- `tests/e2e/smoke.spec.ts`
- `examples/demo-opportunity.meddpicc`
