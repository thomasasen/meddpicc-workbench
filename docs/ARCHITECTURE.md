# Architektur

## Architekturziel

MEDDPICC Workbench soll als statische GitHub-Pages-Anwendung deploybar sein und trotzdem einen robusten projektbasierten Workflow bieten.

Zentrale Regel:

> **Die `.meddpicc`-Projektdatei ist der kanonische Projektstand. Browser Storage ist nur optionaler Recovery-/Cache-State.**

## High-Level-Architektur

```text
                    GitHub Pages
                        │
                        ▼
                 statische Vue-App
                        │
             ┌──────────┴──────────┐
             ▼                     ▼
       Project File I/O       Application State
      (.meddpicc JSON)            (Pinia)
             │                     │
             └──────────┬──────────┘
                        ▼
             strukturierte Deal-Daten
                        │
                        ▼
          deterministische Domain Services
                        │
        ┌───────────────┼────────────────┐
        ▼               ▼                ▼
 Deal Inspector     Coaching Tools   Planning/Value
 Gap / NBA / Gates   EB / Champion    Process / ROI
        └───────────────┬────────────────┘
                        ▼
                 Seller-Workflows
                        │
                        ▼
                  Review / Export
```

Für v1 ist kein Application Backend vorgesehen. Die geplanten „Services“ sind **logische Domain Services/Microtools innerhalb der Browser-Anwendung**. Eine Verteilung auf Netzwerk-Microservices ist kein Selbstzweck und wird nur bei einem späteren konkreten technischen Bedarf geprüft.

## Geplanter Stack

### Anwendung

- Vue 3
- TypeScript
- Vite
- Vue Router
- Pinia

### Validierung

Es gibt genau einen kanonischen Dateiformatvertrag:

```text
schema/meddpicc-project.schema.json
        ↓
Ajv Runtime-Validierung
        ↓
Build-time Type Generation
        ↓
src/domain/project.generated.ts
```

Das JSON Schema ist die Source of Truth für Struktur, Required Fields, Enums, Datumsformate und grundlegende Constraints. TypeScript-Typen für den Projektvertrag werden mit `json-schema-to-typescript` erzeugt und nicht unabhängig gepflegt.

Komplexe Regeln, die JSON Schema nicht sinnvoll ausdrücken soll, liegen in separater Domain Validation. Dazu gehören insbesondere:

- Referenzintegrität von Stakeholder-, Evidence-, Risk- und Entity-IDs
- Existenz von Process-Predecessors
- Erkennung von Dependency Cycles
- bereichsübergreifende Konsistenzprüfungen

Der Ladepfad ist bewusst getrennt:

```text
Text
→ Größenlimit / JSON parse
→ Schema-Version erkennen
→ falls unterstützt: deterministische Migration zur aktuellen Version
→ JSON-Schema-Validierung
→ Domain Validation
→ vollständig validiertes Projekt laden
```

Ungültige Projekte werden vollständig abgelehnt; es gibt keinen Partial Load und keinen Silent Fallback. Eine unbekannte zukünftige Major-Version wird nicht geladen und darf nicht still überschrieben werden. Das aktuelle Pre-Alpha-Limit für Projektdateien beträgt 5 MB.

### Tests

- **Vitest** für Berechnungen, Stores, Validierung und Migrationen
- **Playwright** für zentrale File-Lifecycle- und Browser-Flows
- Fixture-Projekte für alte, aktuelle und ungültige Schema-Versionen

### Delivery

- GitHub Actions
- Production Build bei Pull Requests
- Test Gate vor Deployment
- statischer Deploy nach GitHub Pages aus `main`

## Domain Layer

### 1. Projektmodell

Besitzt den kanonischen Opportunity-State.

Beispiele:

- Metadaten
- MEDDPICC-Bereiche
- Evidenz
- Risiken
- Aktionen
- Historie
- Calculator-Inputs
- Einstellungen für abgeleitete Regeln

### 2. Domain Services

Wo möglich reine deterministische Funktionen.

Beispiele:

- Deal Inspector / Qualification Gap Rules
- Next-Best-Action-Priorisierung
- Qualification Gates / Pause Points
- Champion-Evidence-Check
- Economic-Buyer-Statuslogik
- ROI-/Payback-/Cost-of-Delay-Berechnung
- Decision-/Paper-Process- und Critical-Path-Berechnung
- Meeting-Prep-Fragenauswahl
- Evidence Completeness und Source Traceability
- Export-Rendering

Ein Domain Service kennt keine Vue-Komponenten.

### 3. Application State

Pinia Stores halten den aktuell geladenen Arbeitsstand.

Verantwortung:

- validiertes Projekt laden
- Dirty State verfolgen
- Änderungen anwenden
- Domain Services aufrufen
- Save/Export koordinieren
- abgeleiteten UI-State bereitstellen

### 4. UI

Das UI stellt Domain State und Reasoning-Ergebnisse dar und sammelt gezielte Inputs.

Die primäre Informationsarchitektur folgt **Seller-Workflows**, nicht der Struktur des JSON-Schemas. MEDDPICC-Entities, Stakeholder, Evidence, Risks und Actions sind wichtige Drill-down-/Bearbeitungsobjekte, aber nicht automatisch eigenständige Hauptmodule.

Business Rules dürfen nicht versteckt in Komponenten liegen.

### 5. Reasoning-/Coaching-Service-Grenzen

Jeder Coaching-Service soll:

- eine klar abgegrenzte Verkäuferfrage beantworten
- als reine bzw. weitgehend reine Domain-Logik testbar sein
- strukturierte Projektinputs verwenden
- Findings mit Rule-ID/Begründung und relevanten Inputs erklären können
- `unknown` und Annahmen respektieren
- keine CRM-artige Datenhaltung einführen

Die ersten priorisierten Services stehen in `docs/ROADMAP.md`.

### 6. Optionale AI-Input-Schicht

AI ist **nicht** Bestandteil der kanonischen MEDDPICC-Reasoning-Engine.

Ein späterer optionaler Adapter darf unstrukturierte Inputs wie Transkripte oder freie Notizen analysieren:

```text
unstrukturierter Input
→ optionaler AI-Adapter
→ Candidate Evidence + Provenienz
→ Nutzer bestätigt/korrigiert/verwirft
→ kanonische Projektdaten
→ deterministische Domain Services
```

Regeln:

- Core bleibt vollständig ohne AI nutzbar.
- Kein stiller Upload.
- Kein AI-Ergebnis darf ungeprüft kanonische Projektdaten verändern.
- Lokale und Cloud-Provider bleiben austauschbare Adapter.
- Provider-spezifische Logik darf nicht in die Domain-Reasoning-Schicht einsickern.

## Lifecycle einer Projektdatei

### Öffnen

Die Baseline ist implementiert:

1. Nutzer wählt lokal eine `.meddpicc`-Datei.
2. Datei wird ausschließlich im Browser als Text gelesen.
3. JSON wird geparst.
4. Envelope und Schema-Version werden erkannt.
5. Aktuell unterstützte Legacy-Versionen werden über eine explizite Migrationskette auf die aktuelle Version transformiert.
6. Das migrierte bzw. bereits aktuelle Projekt wird vollständig per JSON Schema und Domain Validation geprüft.
7. Nur ein vollständig valides Projekt wird in den Application State übernommen.
8. Aktuelle Dateien werden als clean geladen; automatisch migrierte Dateien bleiben dirty, bis der Nutzer sie als aktuelle `.meddpicc`-Datei speichert.

Aktuell existiert eine explizite Migration `0.1.0 → 0.2.0`. Die Migration ist deterministisch und konservativ: vorhandene Daten werden erhalten, neue semantische Informationen werden nicht erfunden. Wo das alte Modell keine Aussage kannte, entstehen `unknown`, `null` oder leere Strukturen. Ungültige oder nicht sicher migrierbare Legacy-Dateien ersetzen den aktuellen State niemals.

### Bearbeiten

- Änderungen aktualisieren den In-Memory-Projektstand.
- deterministische abgeleitete Werte werden neu berechnet.
- Projekt wird dirty.
- auditrelevante Änderungen können History Events erzeugen.

### Speichern

Die browserbasierte Baseline ist implementiert:

1. aktuellen Projektstand als JSON-sicheren Snapshot erzeugen
2. `updatedAt` aktualisieren und `revision` monoton erhöhen
3. Snapshot erneut vollständig validieren
4. stabiles, menschenlesbares JSON serialisieren
5. als `.meddpicc`-Datei per Browser-Download ausgeben
6. erst nach ausgelöstem Download den In-Memory-State auf diesen Save-Snapshot setzen und als clean markieren

Direktes Überschreiben einer zuvor geöffneten Datei über die File System Access API ist bewusst nur ein optionales Progressive Enhancement.

## Schema-Migrationen

Migrationen liegen im Domain Layer und sind unabhängig von Vue-Komponenten.

Regeln:

- jede unterstützte Ausgangsversion besitzt einen expliziten Migrationsschritt
- dieselbe Eingabedatei erzeugt immer dasselbe Ergebnis
- Migrationen verwenden keine aktuelle Uhrzeit und keine externen Daten
- fachlich fehlende Informationen werden nicht aus Titeln, Rollen oder Freitexten „erraten“
- nach jeder Migration folgt die vollständige Validierung des Zielschemas
- ein `schema_migrated`-History-Event dokumentiert die Transformation
- die ursprüngliche Datei wird beim Öffnen niemals überschrieben
- erst ein bewusster Save/Download persistiert den migrierten Stand

Für `0.1.0 → 0.2.0` wird das echte historische Pre-Alpha-Fixture unter `examples/legacy/demo-opportunity-0.1.0.meddpicc` als Regressionstest verwendet.

## Browser File APIs

Die Basis muss mit normalem File Upload + Download funktionieren.

Die File System Access API darf als Progressive Enhancement für Browser mit direktem Reopen/Save dienen. Sie darf keine harte Abhängigkeit sein.

## Unsaved-Changes- und Recovery-Baseline

Der aktuelle Lifecycle führt einen expliziten Dirty State.

- Ein neu erzeugtes oder über Store-Aktionen bearbeitetes Projekt ist `dirty`.
- Vor dem Ersetzen eines dirty Projekts durch Neu/Öffnen muss der Nutzer den Datenverlust bestätigen.
- Bei Verlassen/Neuladen der Seite wird über `beforeunload` eine Browser-Warnung ausgelöst.
- Nach einem validierten Download wird der gespeicherte Snapshot als clean markiert.
- Browser Storage wird aktuell **nicht** still als Recovery-Kopie verwendet.

Ein späteres echtes Crash-Recovery darf zusätzliche lokale Persistenz verwenden, aber nur als klar gekennzeichnete Recovery-Ebene; die `.meddpicc`-Datei bleibt Source of Truth.

## Browser Persistence

Lokale Persistenz kann Resilienz verbessern, muss aber klar vom kanonischen Projektstand getrennt bleiben.

Erlaubt:

- Crash Recovery
- Recovery ungespeicherter Änderungen
- Metadaten zuletzt geöffneter Projekte
- Benutzereinstellungen

Nicht erlaubt:

- Browser Storage still als einzige Projektkopie behandeln
- Opportunity-Inhalte zu Drittanbietern synchronisieren
- „gespeichert“ anzeigen, obwohl Daten nur in volatilem State liegen

## Persistierte vs. abgeleitete Daten

Bevorzugt Inputs und Qualifizierungsrecords persistieren. Abgeleitete Werte neu berechnen.

Gut persistierbar:

- Investment
- Annual Benefit Assumption
- Prozessdauer
- Abhängigkeit
- Evidenzklassifikation

Normalerweise abgeleitet:

- ROI
- Payback
- Cost of Delay pro Monat
- Schedule Slack
- Dashboard Counts
- Score Summaries

Falls ein abgeleiteter Wert aus Audit-Gründen gespeichert wird, Calculation Version und Inputs mitführen.

## History-Modell

History soll sinnvoll sein, ohne jeden Tastendruck zu protokollieren.

Mögliche Events:

- Projekt erstellt
- MEDDPICC-Status geändert
- Annahme bestätigt/verworfen
- kritisches Prozessdatum geändert
- Risiko geöffnet/geschlossen
- Aktion erledigt
- Schema migriert

Wo möglich stabile IDs referenzieren.

## Deterministic Rule Engine

Die Rule Engine ist ein zentraler Produktbestandteil. Regeln als reine Funktionen mit Tests.

Beispiel:

```text
Paper-Process-Schritt hat keinen Owner
UND Schritt ist erforderlich
UND Target Close hängt davon ab
→ Process Gap anzeigen/erzeugen
```

Die Anwendung unterscheidet:

- Source Data
- deterministisch abgeleitete Findings
- menschliche Beurteilung / manuellen Status

Abgeleitete Findings müssen erklärbar sein und die auslösenden Inputs zeigen können.

## Security- und Privacy-Architektur

Zur Production Runtime sind für Projektverarbeitung keine Netzwerkaufrufe erforderlich.

Externe Dependencies werden beim Build gebündelt. Künftige Runtime-Integrationen müssen opt-in, dokumentiert und vom lokalen Standardmodus getrennt sein.

Siehe [SECURITY.md](../SECURITY.md).

## Projektsprache und technische Namen

Dokumentation und UI sind deutsch.

Code, Schema-Keys, Typen, APIs und technische Identifier bleiben Englisch. MEDDPICC-Fachbegriffe bleiben im Original, wenn dies fachlich präziser ist.

## Spätere Architekturentscheidungen

Nicht für die erste Umsetzung erforderlich:

- PWA/Offline-Installation
- verschlüsselte Projektdateien
- optionaler Cloud Sync
- optionale AI-Input-Adapter
- CRM API Adapter
- Team Collaboration
- Plugin Architecture
- physische Verteilung einzelner Domain Services als echte Netzwerk-Microservices

Erst bewerten, wenn Dateimodell und lokaler Single-User-Workflow stabil sind.
