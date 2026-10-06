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

Die ersten beiden Reasoning-Slices sind umgesetzt: **Deal Inspector v0.1** analysiert den Projektstand rein deterministisch und zeigt die wichtigsten abgeleiteten Qualification Gaps getrennt von manuell gepflegten Risiken. Darauf aufbauend leitet die **Next Best Action Engine v0.1** wenige konkrete, erklärbare Verkäuferaktionen ab. Beide Services bleiben abgeleiteter State und verändern weder manuelle Risiken noch `project.actions`. Die Regelsets sind in `docs/DEAL_INSPECTOR_RULES.md` und `docs/NEXT_BEST_ACTION_RULES.md` dokumentiert.

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

Erster Slice v0.1 umgesetzt.

Umgesetzt:

- reiner Domain Service `inspectDeal(project)`
- acht klar abgegrenzte Gap-Regeln für Pain, Metrics, Economic Buyer, Decision Process, Paper Process und Champion
- stabile Rule-IDs, Severity, Begründung, fehlende Evidence, Entity-/Evidence-IDs und auslösende Inputs
- deterministische Priorisierung ohne globale Score-Zahl
- klare Trennung zwischen abgeleiteten Inspector-Findings und manuell gepflegten Risks
- Deal-Fokus zeigt maximal drei priorisierte Findings mit aufklappbarer Datenbasis
- Unit- und Browser-Regressionen für Demo und fachlich leere Projekte

Bewusste Grenzen:

- keine Win Probability
- keine automatische Mutation von Risks oder Actions
- kein Critical Path
- keine Next Best Action in diesem Service
- kein neues Schemafeld

### 2. Next Best Action Engine

Erster Slice v0.1 umgesetzt.

Umgesetzt:

- reiner Domain Service `deriveNextBestActions(project, findings)`
- sechs fokussierte Action Families für Pain, Metrics, Economic Buyer, Champion, Decision Process und Paper Process
- stabile Recommendation-/Rule-IDs, Priorität, `whyNow`, gewünschte Evidence, auslösende Inspector-Regeln sowie Evidence-/Entity-/Input-Traceability
- Evidence-Härtung identisch zum Deal Inspector; Assumption/Unknown/Unconfirmed erfüllt keine Voraussetzung
- Economic-Buyer-/Champion-Deduplizierung, einschließlich Schutz vor unbewiesenen Champion-Introductions
- deterministische Priorisierung ohne sichtbaren Score und ohne Win Probability
- Target Close erhöht die Dringlichkeit offener Decision-/Paper-Process-Klärung ohne künstliche Tages-Schwellen
- Empfehlungen bleiben abgeleiteter State und mutieren weder Risks noch `project.actions`
- Deal-Fokus zeigt maximal drei priorisierte Empfehlungen mit „Warum jetzt?“ und gewünschter Evidence
- Desktop- und Mobile-Smokes decken die UI-Integration ab
- fachlicher Regelkatalog: `docs/NEXT_BEST_ACTION_RULES.md`

Bewusste Grenzen:

- keine Competition-Regel in v0.1
- keine automatische Brief-/E-Mail-Erzeugung
- keine neue Schema-Version
- keine AI-/LLM-Runtime

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

**Qualification Gates / Pause Points.**

Auf Basis von Deal Inspector und Next Best Action Engine soll als nächstes geprüft werden, ob ressourcenintensive oder irreversible Sales-Aktivitäten fachlich ausreichend vorbereitet sind.

Erster sinnvoller Umfang:

- wenige klar definierte Gates, zunächst z. B. POC/Pilot, Proposal/Pricing und Commit Forecast
- pro Gate explizite Vorbedingungen aus vorhandenen Deal-Daten
- Output als Empfehlung, nicht als technischer Zwang
- fehlende Voraussetzungen mit konkreter Evidence und nächstem Qualifizierungsschritt erklären
- keine neue globale Deal-Health-Zahl oder Win Probability
- keine Schemaerweiterung ohne belegten Bedarf

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
- `src/domain/dealInspector.ts`
- `src/domain/nextBestAction.ts`
- `docs/DEAL_INSPECTOR_RULES.md`
- `docs/NEXT_BEST_ACTION_RULES.md`
- `src/stores/projectStore.ts`
