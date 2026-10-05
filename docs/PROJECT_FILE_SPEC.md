# Spezifikation der MEDDPICC-Projektdatei

## Zweck

Die `.meddpicc`-Datei ist die portable Source of Truth für eine Opportunity. Das aktuelle Dateiformat ist **Pre-Alpha** und verwendet:

```text
schemaVersion: 0.2.0
```

Der kanonische technische Vertrag liegt in:

```text
schema/meddpicc-project.schema.json
```

Die Datei bleibt UTF-8, menschenlesbares JSON mit eigener Dateiendung. Binäranhänge werden nicht eingebettet.

## Architektur des Dateivertrags

Die Struktur wird genau einmal definiert:

```text
JSON Schema
    ↓
Ajv Runtime-Validierung
    ↓
Build-time Type Generation
    ↓
TypeScript
```

TypeScript-Projekttypen werden mit `json-schema-to-typescript` aus dem JSON Schema erzeugt. Komplexe bereichsübergreifende Regeln liegen zusätzlich in Domain Validation.

Der Ladepfad ist getrennt in:

1. Dateigröße und JSON-Parsing
2. Schema-Version
3. JSON-Schema-Validierung
4. Domain Validation
5. vollständiges Laden des Projekts

Ungültige Projekte werden nicht teilweise geladen.

## Datei-Envelope

Das aktuelle Schema verlangt mindestens:

```json
{
  "format": "meddpicc-workbench-project",
  "schemaVersion": "0.2.0",
  "appVersion": "0.1.0",
  "projectId": "demo-project",
  "revision": 1,
  "createdAt": "2026-10-05T13:00:00.000Z",
  "updatedAt": "2026-10-05T13:00:00.000Z",
  "project": {},
  "stakeholders": [],
  "meddpicc": {},
  "evidence": [],
  "risks": [],
  "actions": [],
  "calculators": {},
  "planning": {},
  "references": [],
  "history": []
}
```

Unbekannte Zusatzfelder innerhalb einer unterstützten Schema-Version werden nicht pauschal verworfen. Das verhindert unbeabsichtigten Datenverlust bei kompatiblen Erweiterungen.

## Schema-Versionierung

`schemaVersion` steuert die Dateiformat-Kompatibilität.

- **MAJOR:** Breaking Change. Alte Datei ist nicht direkt kompatibel.
- **MINOR:** rückwärtskompatible Felder oder Erweiterungen.
- **PATCH:** Schema-Korrektur ohne strukturelle Bedeutung.

Während Pre-Alpha kann sich das Modell noch ändern. Trotzdem ist jede unterstützte Version explizit.

Eine unbekannte zukünftige Major-Version wird vollständig abgelehnt und darf nicht still überschrieben werden.

`appVersion` ist Diagnosemetadatum und nicht die Kompatibilitätsinstanz.

`revision` wird beim Save-/Download-Lifecycle monoton erhöht; sie ist kein verteiltes Conflict-Resolution-Protokoll. Gleichzeitig wird `updatedAt` auf den Zeitpunkt des erzeugten Save-Snapshots gesetzt.

## Projektmetadaten

Die Metadaten enthalten nur für Qualification und Deal Planning relevante Felder:

- Projektname
- Account
- Opportunity ID
- Owner
- Currency
- Deal Value
- Target Close
- Target Go-Live
- Forecast Category
- Notizen

Unbekannte Werte dürfen `null` sein, wo das Schema dies zulässt. Das System soll keine erfundenen Default-Werte erzwingen.

## Stakeholder

Stakeholder besitzen stabile IDs und können mehrere Beziehungen zum Deal gleichzeitig haben.

Unterstützt werden unter anderem:

- Economic-Buyer-Kandidat
- Champion-Kandidat
- Coach
- technische oder fachliche Stakeholder
- Procurement
- Legal
- Security
- Executive Sponsor
- Detractor

Zusätzlich können Einfluss, Deal-Position, Personal Win, Status und Notizen geführt werden.

Economic Buyer und Champion werden nicht als einzelne feste Person im Projektmodell gespeichert. Die jeweiligen MEDDPICC-Bereiche referenzieren Stakeholder über stabile IDs.

## MEDDPICC-Bereiche

Alle acht Bereiche besitzen mindestens:

- `status`
- `confidence` von 0 bis 10
- `summary`
- `evidenceIds`
- `gaps`

Unterstützte Qualification Status:

```text
confirmed
partial
assumption
unknown
risk
```

Der Confidence-Wert beschreibt Evidenzgrad, nicht Win Probability.

## Metrics

Metrics speichern nicht nur einen finalen ROI. Eine Metric kann enthalten:

- Ist-Zustand
- Ziel-Zustand
- Einheit
- Zeitraum
- wirtschaftliche Ableitung
- Annahmen
- Evidence-IDs
- kundenseitige Bestätigung

Damit bleiben spätere ROI-, Payback- und Cost-of-Delay-Berechnungen nachvollziehbar.

## Economic Buyer

Der Bereich unterstützt mehrere Kandidaten und trennt ausdrücklich:

- vermutete oder bestätigte Identität
- berichtete oder bestätigte Authority
- direkten Zugang
- Engagement
- Priorität
- Entscheidungskriterien
- Evidenz

Eine Person wird nicht allein durch Titel oder Nennung zum bestätigten Economic Buyer.

## Decision Criteria

Kriterien besitzen stabile IDs und können unter anderem Capability-, Technical-, Business-, Value-, Commercial-, Risk- oder Partner-Kriterien abbilden.

Importance und unsere Position werden getrennt modelliert. Kriterien können eigene Evidence-IDs tragen.

## Decision Process und Paper Process

Beide Bereiche nutzen eine gemeinsame Process-Step-Struktur, bleiben fachlich aber getrennt.

Ein Step kann enthalten:

- stabile ID
- Titel und Beschreibung
- Owner-Stakeholder
- Status
- geplantes und bestätigtes Datum
- Dauer
- Vorgänger
- Pflicht-/Optional-Flag
- Evidence-IDs
- optionale Parallelgruppe
- Notizen

Die zusätzliche Domain Validation prüft:

- existierende Owner
- existierende Vorgänger
- Dependency Cycles

Damit ist die Grundlage für spätere Critical-Path-Berechnung gelegt.

## Identify / Implicate Pain

Pain wird als strukturierte Liste modelliert. Ein Eintrag kann Problem, Business Impact, Konsequenz des Nicht-Handelns, Priorität und Evidenz trennen.

## Champion

Mehrere Champion-Kandidaten sind möglich.

Champion-Evidenz soll beobachtbares Verhalten abbilden, zum Beispiel:

- interne Informationen geliefert
- Zugang hergestellt
- intern verkauft
- schlechte Nachrichten geteilt
- Procurement unterstützt
- Economic-Buyer-Zugang ermöglicht
- Personal Win bestätigt

Ein hilfreicher Kontakt ist damit nicht automatisch ein bestätigter Champion.

## Competition

Competition umfasst nicht nur benannte Anbieter.

Unterstützt werden:

- direkter Anbieter
- Status quo
- interne Eigenentwicklung
- Budgetverschiebung
- Do Nothing
- unbekannte oder andere Alternative

## Evidenz

Evidenz ist ein First-Class-Objekt.

Wesentliche Felder:

- stabile ID
- Classification
- Quality
- Aussage
- Source Stakeholder
- Datum
- Kontext
- Reference
- Verification
- verknüpfte MEDDPICC-Bereiche
- Erstellzeitpunkt

Classification und Quality sind bewusst getrennt.

Beispiele für Classification:

```text
fact
customer_statement
seller_interpretation
assumption
confirmed_evidence
unknown
```

Eine `customer_statement` ist eine Kundenaussage und nicht automatisch objektiver Fakt.

## Risiken

Risiko ist orthogonal zu Evidenz.

Ein Risk kann enthalten:

- Severity
- Status
- Related Area
- Related Entity IDs
- Impact
- Mitigation
- Owner
- Due Date
- Opened At

Related Entity IDs werden durch Domain Validation geprüft.

## Aktionen

Actions übersetzen Qualification Gaps in konkrete Arbeit.

Unterstützt werden:

- Owner
- Due Date
- Related Area
- Related Risk
- Related Gap
- gewünschte Evidenz
- Status
- bereits gewonnene Evidence-IDs

## Business Case und Planning

Business-Case-Inputs speichern Inputs, Evidenz, Annahmen und kundenseitige Bestätigung.

Planning hält derzeit Target Go-Live und Implementierungsannahmen. Berechnete Critical-Path-Ergebnisse gehören später in deterministische Domain Services und sollen aus Inputs reproduzierbar sein.

## Referenzen

References verweisen auf externen Kontext, ohne ihn einzubetten.

Unterstützte Typen sind unter anderem:

- meeting
- crm
- document
- email
- rfp
- contract
- other

URLs sind nur Metadaten. Projektdateiinhalte dürfen keine automatischen Netzwerkaufrufe auslösen.

## Historie

History ist ein Audit-orientiertes Änderungsprotokoll, kein Keystroke Log.

Aktuelle Event-Typen umfassen:

- Projekt erstellt
- Evidenz hinzugefügt
- Qualification Status geändert
- Risiko geöffnet/geschlossen
- Aktion abgeschlossen
- Schema migriert

## Domain Validation

Nicht alles gehört in JSON Schema.

Zusätzlich geprüft werden insbesondere:

- eindeutige stabile IDs
- existierende Evidence-IDs
- existierende Stakeholder-IDs
- existierende Risk-IDs
- existierende Related-Entity-IDs
- existierende Process-Predecessors
- keine Process Dependency Cycles
- gültige History-Entity-Referenzen

## Browserbasierter File Lifecycle

Die aktuelle Baseline unterstützt ohne Backend:

- fachlich leeres neues Projekt erzeugen
- lokale `.meddpicc`-Datei auswählen und vollständig validieren
- ungültige Dateien vollständig ablehnen, ohne den aktuellen Projektstand zu ersetzen
- Dirty State für neue bzw. bearbeitete Projekte
- Warnung vor dem Verwerfen ungespeicherter Änderungen
- validierten Save-Snapshot als `.meddpicc` herunterladen

Direktes Reopen/Save über die File System Access API bleibt optional. Migration unterstützter älterer Schema-Versionen ist der nächste noch offene Kompatibilitätsbaustein.

## Round Trip

Die Baseline lautet:

```text
parse
→ validate
→ serialize
→ parse
→ validate
```

Dabei dürfen keine Projektdaten verloren gehen.

## Dateisicherheit

Importierte Projektdateien sind untrusted input.

Aktuelle Regeln:

- Größenlimit: 5 MB
- kein Ausführen von Dateiinhalten
- vollständige Ablehnung ungültiger Dateien
- Strings niemals als unsicheres HTML behandeln
- URLs nur kontrolliert und nutzerinitiiert verwenden
- keine automatischen Requests aufgrund von Projektinhalten
- zukünftige unbekannte Major-Versionen nicht überschreiben

## Beispiel-Fixture

Das vollständig fiktive Regression-Fixture liegt unter:

```text
examples/demo-opportunity.meddpicc
```

Es enthält bewusst unterschiedliche Qualifizierungszustände, Gaps, Risiken, mehrere Stakeholder, Evidence, Decision-/Paper-Process, Business-Case-Inputs, References und History.
