# Projektfortschritt

Stand: 05.10.2026

Dieses Dokument ist der kompakte Handoff-Stand für die Weiterentwicklung von MEDDPICC Workbench. Es ergänzt die Roadmap um den tatsächlich implementierten Zustand und den nächsten empfohlenen Arbeitsschritt.

## Aktueller qualitätsgesicherter Stand

Der aktuelle Roadmap-2-Slice wird über PR #25 umgesetzt:

- projektweites Evidenzregister
- projektweite Risiken
- projektweite nächste Aktionen
- Risk → Action-Verknüpfung
- relevante History-Events für diese Workflows

Für den finalen Implementierungsstand vor der Dokumentationsaktualisierung liefen in der PR-CI erfolgreich:

- Formatting
- ESLint
- 43 Unit Tests
- Production Build
- Pages-Root-Synchronitätsprüfung
- 14 Playwright-Ausführungen auf Desktop und Mobile

Der Merge erfolgt weiterhin erst nach einer vollständig grünen finalen PR-CI einschließlich dieser Dokumentationsänderungen.

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

Phase 2 ist aktiv und bleibt bewusst offen.

### Bereits umgesetzt

#### Gemeinsames Evidenzregister

PR #23 hat den ersten produktiv nutzbaren Roadmap-2-Slice geliefert.

Unterstützt werden:

- Evidenz projektweit anzeigen und anlegen
- Classification, Quality und Verification getrennt modellieren
- Source Stakeholder, Source Date und Context
- Zuordnung zu einem oder mehreren MEDDPICC-Bereichen
- visuelle und textliche Unterscheidung von Annahmen, Unbekanntem und bestätigter Evidenz
- vollständige Validierung vor Übernahme in den Projektstate
- Dirty-State
- automatisches `evidence_added`-History-Event
- Speichern/Download direkt aus dem Evidenzregister
- Desktop- und Mobile-Browsertests

#### Projektweite Risiken und nächste Aktionen

PR #25 ergänzt die gemeinsamen Arbeitsobjekte für Deal Risk und konkrete Qualification-/Execution-Aktionen.

Unterstützt werden:

- Risiken projektweit anlegen und bearbeiten
- Severity und Risk-Status pflegen
- Risk auf einen MEDDPICC-Bereich beziehen
- Risk sicher auf zum Bereich gehörende Entities bzw. Process Steps referenzieren
- Impact, Mitigation, Owner und Due Date pflegen
- nächste Aktionen projektweit anlegen und bearbeiten
- Action auf MEDDPICC-Bereich sowie optional Risk und Gap beziehen
- `desiredEvidence` als erwartetes Wissen bzw. erwarteten Nachweis explizit pflegen
- vorhandene Evidence IDs mit Actions verknüpfen
- Risk → Action im UI nachvollziehbar anzeigen
- `risk_opened`, `risk_closed` und `action_completed` nur bei passenden Ereignissen bzw. Statusübergängen schreiben
- keine erfundenen History-Events für Action-Erstellung
- atomare, vollständig validierte Store-Mutationen
- Dirty-State und valider Save-/Round-Trip
- Dashboard liest neue/geänderte Risks und Actions aus demselben Projektmodell
- Desktop- und Mobile-Browsertests

Fachliche Entscheidung:

Das bestehende Schema 0.2.0 reicht für diesen Slice aus. Es wurde nicht aus UI-Bequemlichkeit erweitert. Stattdessen wurde die Domain-Validierung für Risk-`relatedEntityIds` verschärft: Eine vorhandene ID reicht nicht; die referenzierte Entity muss zum gewählten MEDDPICC-Bereich gehören.

Technische Besonderheit:

Vor atomaren Store-Änderungen wird ein reaktiver Pinia/Vue-State mit `toRaw()` entpackt, bevor ein sicherer Snapshot erzeugt wird. Dadurch werden Proxy-Probleme vermieden und ein ungültiger Zwischenstand kann nicht teilweise in den Store gelangen.

### Noch offen in Phase 2

- Projektmetadaten als vollständige editierbare Arbeitsoberfläche
- Source-/Reference-Records als editierbare Arbeitsoberfläche
- weitere noch benötigte History-/Status-Nutzung außerhalb der bereits implementierten Events
- gemeinsames Statusmodell vollständig in allen späteren Arbeitsoberflächen nutzen
- Dashboard Findings mit expliziter Source-Traceability
- Evidenz gezielt mit mehreren konkreten Qualifizierungsaussagen/Entities verknüpfen

Issue #4 bleibt offen und bildet diesen Fortschritt ab.

## Nächster empfohlener Slice

### Source-/Reference-Records + Source-Traceability

Als nächstes sollten die bereits im Projektmodell vorhandenen Reference-Records als gemeinsame Arbeitsobjekte nutzbar gemacht und die Source-Traceability bis in die Dashboard-Findings vervollständigt werden.

Warum dieser Schritt jetzt sinnvoll ist:

- Evidenz, Risiken und Aktionen sind als gemeinsame Objekte nutzbar.
- Evidenz besitzt bereits `referenceId`, aber References sind noch nicht über eine Arbeitsoberfläche pflegbar.
- Das Dashboard kann Risks/Actions anzeigen, aber Findings sind noch nicht vollständig bis zur zugrunde liegenden Source nachvollziehbar.
- Diese Traceability sollte vor den acht MEDDPICC-Kernmodulen stabil sein, damit spätere Module dieselbe Source-of-Truth verwenden.

Bewusst weiterhin nicht Teil dieses nächsten Slices:

- vollständige acht MEDDPICC-Bearbeitungsmodule
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
- `src/domain/project.ts`
- `src/domain/projectValidation.ts`
- `src/domain/evidence.ts`
- `src/domain/riskAction.ts`
- `src/stores/projectStore.ts`
- `src/views/EvidenceView.vue`
- `src/views/RisksActionsView.vue`
- `src/views/HomeView.vue`
- `tests/e2e/risks-actions.spec.ts`
- `examples/demo-opportunity.meddpicc`
