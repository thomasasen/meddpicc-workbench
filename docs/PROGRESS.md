# Projektfortschritt

Stand: 06.10.2026

Dieses Dokument ist der kompakte Handoff-Stand für die Weiterentwicklung von MEDDPICC Workbench. Es ergänzt die Roadmap um den tatsächlich implementierten Zustand und den nächsten empfohlenen Arbeitsschritt.

## Strategische Kurskorrektur

Die bisherige technische Basis bleibt bestehen, aber die Produktpriorität ändert sich bewusst:

**MEDDPICC Workbench soll kein CRM nachbauen und nicht primär aus acht MEDDPICC-Bearbeitungsmasken bestehen.**

Das Produktziel ist eine **deterministische Deal-Reasoning- und Coaching-Workbench**, die einem Account Manager repetitive Analyse- und Planungsarbeit abnimmt.

Leitprinzipien:

- Workflows statt Datensätze
- wenige konkrete Next Best Actions statt generischer Tasklisten
- Evidence-basierte, erklärbare Regeln statt Black-Box-Scoring
- keine verpflichtende AI-/LLM-Runtime
- AI später nur optional für unstrukturierte Inputs
- .meddpicc bleibt kanonische Source of Truth
- keine Account-/Kontakt-/Pipeline-/Activity-Verwaltung im Core

Die geplanten Services werden zunächst als modulare Domain Services/Microtools innerhalb der local-first Webanwendung umgesetzt. Eine verteilte Microservice-Infrastruktur ist kein Ziel an sich.

## Aktueller Stand

Das gemeinsame Qualifizierungsfundament umfasst:

- projektweites Evidenzregister
- projektweite Risiken und nächste Aktionen
- Risk → Action-Verknüpfung
- projektweite Source-/Reference-Records
- Evidence → Reference-Verknüpfung
- vollständige Bearbeitung der vorhandenen Projektmetadaten
- konkrete Evidence-Verknüpfung zu stabil adressierbaren Qualification-Entities
- deterministischer Reverse-Lookup Evidence → Qualification-Entity
- sichtbare Source-Traceability für Risk-/Action-Findings
- relevante History-Events für die bisher implementierten Workflows

PR #28 hat den letzten dafür benötigten Slice geliefert. Damit ist das Daten-/Traceability-Fundament ausreichend, um den Fokus auf Verkäufer-Workflows zu verlagern.

Weitere History-/Status-Ausbauschritte werden **nicht automatisch** vorgezogen. Sie werden nur umgesetzt, wenn ein konkreter Reasoning-/Coaching-Service sie tatsächlich benötigt.

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
- kanonisches JSON Schema für .meddpicc
- Ajv Runtime Validation
- Build-time TypeScript-Generierung aus dem Schema
- zusätzliche Domain Validation

### Phase 1 – Project File Lifecycle

Im Core abgeschlossen.

Wesentliche Ergebnisse:

- `schemaVersion: 0.2.0`
- fachlich leeres neues Projekt
- lokale .meddpicc-Dateien öffnen
- vollständige Schema- und Domain-Validierung
- ungültige Dateien ersetzen niemals teilweise den aktuellen State
- Dirty-State und Warnung vor Datenverlust
- validierter Save/Download mit Revision und `updatedAt`
- Round-Trip-Tests
- deterministische Migration `0.1.0 → 0.2.0`
- historisches Regression-Fixture

### Phase 2 – Gemeinsames Qualifizierungsfundament

Für die nächste Produktstufe ausreichend abgeschlossen.

Umgesetzt:

- Evidence
- References
- Risks
- Actions
- Project Metadata
- Evidence-to-Entity
- Source Traceability
- atomare Validierung
- Basis-History
- bestehendes Statusmodell

Bewusste Modellgrenze:

Champion-Evidence hängt in Schema 0.2.0 an Behavior-Einträgen ohne stabile eigene ID. Diese Modellierung wird erst erweitert, wenn der geplante Champion Tester einen belegten Bedarf für eine stabile Behavior-Identität erzeugt.

## Neue Phase 3 – Deterministische Coaching-Services

Priorisierte Reihenfolge:

### 1. Deal Inspector / Qualification Gap Engine

Erster empfohlener Slice.

Ziel:

- vorhandenen Projektstand analysieren
- kritische Gaps erkennen
- Evidence vs. Annahme vs. Unbekannt berücksichtigen
- Findings erklären
- Grundlage für spätere Next Best Actions schaffen

Der erste Slice soll **noch keine generische Scoring Engine** bauen. Er soll wenige hochrelevante, nachvollziehbare Regeln implementieren und für jede Aussage die auslösenden Inputs zeigen.

### 2. Next Best Action Engine

Aus offenen Gaps wenige konkrete nächste Verkäuferaktionen priorisieren und jeweils erklären, warum diese Aktion jetzt wichtig ist.

### 3. Qualification Gates / Pause Points

Vor Demo, POC, Pricing, Proposal, Reference Call, Commit usw. prüfen, ob fachliche Vorbedingungen erfüllt sind und unnötige Sales-/Presales-Arbeit vermeiden.

### 4. Champion Tester

Champion anhand beobachtbarer Verhaltenssignale und Evidence testen; fehlende Signale in konkrete Champion-Tests übersetzen.

### 5. Economic Buyer Coach

EB nicht nur als Stakeholder speichern, sondern Candidate, Autorität, Zugang, Metrics-/Business-Case-Validierung, Priorität und Return Ticket systematisch prüfen.

### 6. Metrics & Business Case Builder

Pain in belastbare wirtschaftliche Größen übersetzen: Baseline, Benefit, ROI, Payback, Cost of Delay und Szenarien. Unsichere Inputs bleiben sichtbar als Annahmen markiert.

### 7. Decision / Paper Process / Closing Planner

Prozessschritte, Owner, Dauer, Abhängigkeiten und Termine modellieren; Rückwärtsplanung, Critical Path und unrealistische Target-Close-Termine erkennen.

### 8. Meeting Prep Coach

Aus aktuellen Gaps, Teilnehmern und Deal-Kontext ein fokussiertes Gesprächsziel sowie passende Fragen aus einer gepflegten Question Library auswählen.

Alle acht Services sollen **ohne AI-/LLM-Runtime** funktionieren.

## Spätere optionale AI-Schicht

AI wird nicht für die MEDDPICC-Reasoning-Logik benötigt.

Ein späterer optionaler Input-Layer darf unstrukturierte Inhalte wie Transkripte oder freie Notizen in **Candidate Evidence** überführen.

Wichtig:

- Candidate Evidence ist noch keine bestätigte Evidence
- Nutzer muss bestätigen/korrigieren/verwerfen
- keine automatische ungeprüfte Mutation des Projektfiles
- lokale und Cloud-AI bleiben austauschbar
- Core bleibt ohne AI vollständig nutzbar

## Nächster empfohlener Slice

**Deal Inspector / Qualification Gap Engine.**

Ein sinnvoller erster Umfang:

- 8–15 hochwertige, klar erklärbare Gap-Regeln
- Schwerpunkt auf Pain/Metrics, Economic Buyer, Champion, Decision Process und Paper Process
- Severity + Begründung + fehlende Evidence
- Drill-down auf die Datenbasis
- keine globale „magische“ Deal-Score-Zahl
- Unit Tests für jede Regel
- UI zeigt nur die wichtigsten Findings, nicht alle theoretisch möglichen Hinweise

Erst wenn dieser Slice belastbar funktioniert, folgt die Next Best Action Engine.

## Bewusst nicht als nächstes bauen

- acht große MEDDPICC-CRUD-Masken
- CRM-ähnliche Kontakt- oder Accountverwaltung
- Pipeline Board
- Activity Timeline
- allgemeine Aufgabenverwaltung
- generative AI
- Transcript-Analyse
- CRM-Integration
- Cloud Sync
- zusätzliche Schemafelder ohne konkreten Service-Bedarf

## Qualitätsregel

Ein Slice gilt erst als abgeschlossen, wenn:

- Schema- und Domain-Konsistenz gewahrt bleiben
- keine ungültigen Partial States übernommen werden
- Reasoning-Regeln deterministisch und testbar sind
- jedes Finding seine Inputs und Regel erklären kann
- Formatting und Lint grün sind
- Unit Tests grün sind
- Production Build grün ist
- Pages-Root synchron ist
- relevante Playwright-Flows Desktop und Mobile grün sind
- Dokumentation nur tatsächlich umgesetzte Punkte abhakt
- Merge ausschließlich über einen grünen Pull Request erfolgt

## Relevante Dateien

- `docs/ROADMAP.md`
- `docs/ARCHITECTURE.md`
- `docs/PROJECT_FILE_SPEC.md`
- `schema/meddpicc-project.schema.json`
- `src/domain/projectValidation.ts`
- `src/domain/evidence.ts`
- `src/domain/reference.ts`
- `src/domain/qualificationEvidence.ts`
- `src/domain/sourceTraceability.ts`
- `src/domain/riskAction.ts`
- `src/stores/projectStore.ts`
