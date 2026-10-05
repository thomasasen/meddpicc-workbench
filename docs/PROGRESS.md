# Projektfortschritt

Stand: 05.10.2026

Dieses Dokument ist der kompakte Handoff-Stand für die Weiterentwicklung von MEDDPICC Workbench. Es ergänzt die Roadmap um den tatsächlich implementierten Zustand und den nächsten empfohlenen Arbeitsschritt.

## Aktueller Roadmap-2-Stand

Der gemeinsame Qualifizierungs-Layer umfasst inzwischen:

- projektweites Evidenzregister
- projektweite Risiken und nächste Aktionen
- Risk → Action-Verknüpfung
- projektweite Source-/Reference-Records
- Evidence → Reference-Verknüpfung
- sichtbare Source-Traceability für Risk-/Action-Findings im Dashboard
- relevante History-Events für die bisher implementierten Workflows

Der Source-/Reference-Slice wurde mit PR #27 vollständig qualitätsgesichert und per Squash auf `main` gemergt. Der Merge-Commit ist `c5b2e1282db3603478301cffcfb00908bcc4a5a7`; der finale PR-Quality-Gate einschließlich Desktop-/Mobile-Playwright war grün, ebenso der anschließende schlanke `main`-Integritätscheck und die GitHub-Pages-Bereitstellung. Das bestehende Dateiformat bleibt bei `schemaVersion: 0.2.0`, weil die benötigten Reference-Felder und `evidence.referenceId` bereits Bestandteil des kanonischen Vertrags sind.

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
- fachlich leeres neues Projekt
- lokale `.meddpicc`-Dateien öffnen
- vollständige Schema- und Domain-Validierung
- ungültige Dateien ersetzen niemals teilweise den aktuellen State
- Dirty-State und Warnung vor Datenverlust
- validierter Save/Download mit Revision und `updatedAt`
- Round-Trip-Tests
- deterministische Migration `0.1.0 → 0.2.0`
- historisches Regression-Fixture

Issue #3 ist abgeschlossen.

## Phase 2 – Gemeinsames Qualifizierungsmodell

Phase 2 ist aktiv und bleibt bewusst offen.

### Gemeinsames Evidenzregister

PR #23 hat den ersten Roadmap-2-Slice geliefert.

Unterstützt werden:

- Evidenz projektweit anzeigen und anlegen
- Classification, Quality und Verification getrennt modellieren
- Source Stakeholder, Source Date und Context
- Zuordnung zu einem oder mehreren MEDDPICC-Bereichen
- visuelle und textliche Trennung von Annahmen, Unbekanntem und bestätigter Evidenz
- vollständige Validierung vor Übernahme in den Projektstate
- Dirty-State und `evidence_added`-History-Event
- Speichern/Download direkt aus dem Evidenzregister

### Projektweite Risiken und nächste Aktionen

PR #25 hat gemeinsame Deal-Risiken und Qualification-/Execution-Aktionen ergänzt.

Unterstützt werden:

- Risiken projektweit anlegen und bearbeiten
- Severity und Risk-Status
- MEDDPICC-Bereich und passende Entity-/Process-Step-Referenzen
- Impact, Mitigation, Owner und Due Date
- nächste Aktionen projektweit anlegen und bearbeiten
- Action → Risk, Gap und Evidence
- `desiredEvidence`
- `risk_opened`, `risk_closed` und `action_completed` ohne Doppel-Events
- atomare, vollständig validierte Store-Mutationen
- Dashboard liest Risks und Actions aus demselben Projektmodell

### Source-/Reference-Records und Source-Traceability

PR #27 hat den Source-Layer ohne Schemaänderung abgeschlossen.

Unterstützt werden:

- Reference-Records projektweit anlegen und bearbeiten
- Typ, Titel, Datum, externe ID, URL und Notizen
- Evidence kann auf genau einen vorhandenen Reference-Record verweisen
- Evidenzkarten zeigen die konkrete Quellenreferenz
- Dashboard-Risiken und -Aktionen zeigen ihre deterministisch abgeleitete Quellenbasis
- Drill-down vom Dashboard zu einem konkreten Reference- bzw. Evidence-Eintrag
- fehlende Quellenreferenzen werden sichtbar benannt statt implizit ergänzt
- Risk-Traceability bleibt bei vorhandenen `relatedEntityIds` auf die verknüpften Entities sowie explizite Section-Evidence begrenzt
- Action-Traceability nutzt direkte Evidence-IDs und gegebenenfalls die Quellenbasis des verknüpften Risks
- Reference-Mutationen sind atomar validiert; ungültige Änderungen erzeugen keinen Partial State
- keine erfundenen History-Events für Reference-Erstellung oder -Bearbeitung

Fachliche Grenze:

Ein Risk besitzt im aktuellen Schema keine direkte `evidenceIds`-Liste. Die Workbench behauptet deshalb keine direkte Risk→Evidence-Beziehung. Die sichtbare Quellenbasis wird aus den bereits modellierten MEDDPICC-/Entity-Referenzen hergeleitet.

### Noch offen in Phase 2

- Projektmetadaten als vollständige editierbare Arbeitsoberfläche
- Evidenz gezielt mit konkreten Qualification-Entities bzw. -Aussagen verknüpfen
- weitere History-/Status-Nutzung außerhalb der bereits implementierten Events
- gemeinsames Statusmodell vollständig in späteren Arbeitsoberflächen nutzen
- Source-Traceability für weitere künftig hinzukommende abgeleitete Dashboard-Findings
- vollständige acht MEDDPICC-Bearbeitungsmodule bleiben Phase 3

Issue #4 bleibt offen und bildet diesen Fortschritt ab.

## Nächster empfohlener Slice

### Projektmetadaten + konkrete Evidence-to-Entity-Verknüpfung

Nach dem erfolgreich gemergten Source-Layer soll Phase 2 jetzt die verbleibenden gemeinsamen Grundlagen vor den acht MEDDPICC-Modulen schließen:

1. Projektmetadaten vollständig editierbar machen.
2. Eine belastbare, bidirektional nachvollziehbare Zuordnung zwischen Evidenz und konkreten Qualification-Entities ermöglichen.
3. Die daraus entstehenden Status-/Dashboard-Findings über denselben Source-Traceability-Pfad erklären.

Dabei darf eine UI-Vereinfachung keine neue Schema-Semantik vortäuschen. Falls für Evidence-to-Entity tatsächlich eine Modelllücke besteht, ist sie zuerst fachlich zu begründen und erst dann über Schema-Versionierung/Migration zu ergänzen.

Bewusst weiterhin nicht Teil dieses nächsten Slices:

- generative AI
- automatische Risk-/Action-Generierung
- Scoring Engine
- ROI/Payback/Cost of Delay
- Critical Path
- CRM-Integration
- Cloud Sync

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
- `src/domain/projectValidation.ts`
- `src/domain/evidence.ts`
- `src/domain/reference.ts`
- `src/domain/sourceTraceability.ts`
- `src/domain/riskAction.ts`
- `src/stores/projectStore.ts`
- `src/views/EvidenceView.vue`
- `src/views/ReferencesView.vue`
- `src/views/RisksActionsView.vue`
- `src/views/HomeView.vue`
- `tests/e2e/references-traceability.spec.ts`
- `tests/e2e/risks-actions.spec.ts`
