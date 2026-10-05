# Spezifikation der MEDDPICC-Projektdatei

## Zweck

Die `.meddpicc`-Datei ist die portable Source of Truth für eine Opportunity.

Version 1 bleibt bewusst einfach:

- UTF-8
- JSON
- menschenlesbar
- eine Datei
- keine eingebetteten Binärdaten
- explizite Schema-Version
- deterministische Validierung und Migration

Beispiel:

```text
acme-crm-transformation.meddpicc
```

## Datei-Envelope

Ein Projekt besitzt eine stabile Top-Level-Struktur ähnlich:

```json
{
  "schemaVersion": "1.0.0",
  "appVersion": "0.1.0",
  "projectId": "uuid",
  "revision": 1,
  "createdAt": "2026-10-05T13:00:00.000Z",
  "updatedAt": "2026-10-05T13:00:00.000Z",
  "project": {},
  "meddpicc": {},
  "evidence": [],
  "risks": [],
  "actions": [],
  "history": [],
  "calculators": {},
  "planning": {},
  "references": []
}
```

Das exakte Schema wird vor Beginn der Feature-Implementierung formalisiert.

## Versionsfelder

### schemaVersion

Steuert die Kompatibilität des Dateiformats.

Regeln:

- Patch: abwärtskompatible Korrektur/Default
- Minor: abwärtskompatible Ergänzung
- Major: inkompatible Schema-Änderung mit Migration

Eine nicht unterstützte zukünftige Major-Version darf niemals still geöffnet und anschließend überschrieben werden.

### appVersion

Dokumentiert die App-Version, die die Datei zuletzt gespeichert hat. Dieses Feld ist Diagnosemetadatum und nicht die eigentliche Kompatibilitätsinstanz.

### revision

Wird bei erfolgreichem Speichern monoton erhöht.

Hilfreich zum Vergleich zweier Kopien desselben Projekts, aber kein verteiltes Conflict-Resolution-Protokoll.

## Projektmetadaten

Vorgeschlagene Felder:

```json
{
  "project": {
    "name": "ACME CRM Transformation",
    "accountName": "ACME GmbH",
    "opportunityId": "OPP-0042",
    "owner": "Thomas Asen",
    "currency": "EUR",
    "dealValue": 480000,
    "targetCloseDate": "2027-03-31",
    "targetGoLiveDate": "2027-07-01",
    "forecastCategory": "best-case",
    "notes": ""
  }
}
```

Nur Felder, die Qualifizierung und Deal Planning unterstützen, gehören hier hinein. Die Datei darf nicht zu einer vollständigen Account-/Kontaktdatenbank werden.

## MEDDPICC-Bereiche

Vorgeschlagene Struktur:

```json
{
  "meddpicc": {
    "metrics": {},
    "economicBuyer": {},
    "decisionCriteria": {},
    "decisionProcess": {},
    "paperProcess": {},
    "pain": {},
    "champions": [],
    "competition": []
  }
}
```

Jeder Bereich soll unterstützen:

- strukturierte Aussagen
- manuelle Notizen
- verknüpfte Evidence-IDs
- aktuellen Qualifizierungsstatus
- Gaps
- bereichsspezifische Daten

## Qualifizierungsstatus

Explizite Zustände statt erzwungenem Ja/Nein.

Interne Enum-Kandidaten:

```text
confirmed
partial
assumption
unknown
risk
```

Im UI werden diese deutsch dargestellt:

```text
confirmed  → Bestätigt
partial    → Teilweise
assumption → Annahme
unknown    → Unbekannt
risk       → Risiko
```

Ein Bereich darf zusätzlich einen deterministischen Confidence Score liefern. Dieser ersetzt weder expliziten Status noch zugrunde liegende Evidenz.

## Evidenzmodell

Evidenz ist ein gemeinsam nutzbares First-Class-Objekt.

Beispiel:

```json
{
  "id": "ev_01",
  "classification": "customer_statement",
  "statement": "The CFO approves investments above EUR 250k.",
  "source": {
    "person": "Max Mustermann",
    "role": "Head of Sales",
    "date": "2026-10-05",
    "context": "Discovery Workshop"
  },
  "referenceId": "ref_03",
  "createdAt": "2026-10-05T13:30:00.000Z"
}
```

Interne Klassifikationskandidaten:

```text
fact
customer_statement
seller_interpretation
assumption
confirmed_evidence
unknown
```

Die Implementierung darf die Namen noch schärfen, muss aber die konzeptionelle Trennung von Wissen und Annahme erhalten.

### Verknüpfung

MEDDPICC-Aussagen referenzieren Evidenz über stabile IDs, statt Quellmetadaten mehrfach zu duplizieren.

## Risiken

Beispiel:

```json
{
  "id": "risk_01",
  "title": "Procurement process is not confirmed",
  "severity": "high",
  "status": "open",
  "relatedArea": "paperProcess",
  "relatedEntityIds": ["pp_step_05"],
  "impact": "Target close date may be unreliable",
  "openedAt": "2026-10-05T13:40:00.000Z"
}
```

Interne Schweregrade:

```text
low
medium
high
critical
```

Interne Statuswerte:

```text
open
mitigating
closed
accepted
```

Die UI übersetzt diese Werte in deutsche Labels.

## Aktionen

Aktionen übersetzen Qualification Gaps in konkrete Arbeit.

Beispiel:

```json
{
  "id": "action_01",
  "title": "Confirm procurement lead time",
  "status": "open",
  "owner": "Thomas Asen",
  "dueDate": "2026-10-12",
  "relatedArea": "paperProcess",
  "desiredEvidence": "Procurement owner confirms steps, lead time and PO requirement"
}
```

Schema-Inhalte können englische technische Werte besitzen; sichtbare UI-Texte werden deutsch gepflegt bzw. dargestellt.

## Decision Process und Paper Process

Eine generische Process-Step-Struktur soll beide Bereiche unterstützen.

Mögliche Felder:

- stabile ID
- Titel
- Beschreibung
- Owner
- Status
- geplantes Datum
- bestätigtes Datum
- Dauer
- Vorgänger-IDs
- required/optional
- Evidence-IDs
- Notizen

So kann dieselbe Scheduling Engine Abhängigkeiten und Critical Path berechnen, ohne Decision Process und Paper Process semantisch zu vermischen.

## Metrics und Business Case

Source Inputs, Einheiten, Provenienz und Confidence persistieren.

Nicht nur einen finalen ROI speichern.

Mögliche Inputs:

- aktuelles Volumen
- aktueller Zeit-/Kostenaufwand
- erwartete Verbesserung
- Annualization Basis
- Investment
- wiederkehrende Kosten
- einmalige Kosten

Jede wesentliche Zahl kann optional Evidenz referenzieren.

## Planning

Kann enthalten:

- Target Go-Live Date
- Implementierungsphasen
- Prozessabhängigkeiten
- Dauerannahmen
- berechnete Critical-Path-Metadaten

Berechnete Ergebnisse müssen aus Inputs reproduzierbar sein.

## Referenzen

Referenzen zeigen auf externen Kontext, ohne ihn einzubetten.

Beispiel:

```json
{
  "id": "ref_03",
  "type": "meeting",
  "title": "Discovery Workshop",
  "date": "2026-10-05",
  "externalId": null,
  "url": null,
  "notes": ""
}
```

Mögliche Typen:

- meeting
- crm
- document
- email
- rfp
- contract
- other

URLs sind nur Metadaten. Öffnen muss immer eine explizite Nutzeraktion sein.

## Historie

History ist ein Audit-orientiertes Änderungsprotokoll, kein Keystroke Log.

Beispiel:

```json
{
  "id": "hist_01",
  "timestamp": "2026-10-05T14:00:00.000Z",
  "type": "qualification_status_changed",
  "area": "economicBuyer",
  "entityId": "eb_01",
  "summary": "Economic Buyer status changed from assumption to partial"
}
```

Die Event-Taxonomie soll klein und stabil bleiben.

## Unbekannte Erweiterungsdaten

Forward Compatibility braucht eine bewusste Policy.

Validator/Migrator dürfen Felder, die sie innerhalb einer kompatiblen Schema-Version nicht kennen, nicht versehentlich löschen.

Bei inkompatiblen zukünftigen Major-Versionen darf die Anwendung nicht speichern, bevor ein unterstützter Migrationspfad existiert.

## Dateisicherheit

Jede importierte Datei als untrusted Input behandeln.

Anforderungen:

- Größenlimit
- sauberes JSON-Parse-Error-Handling
- Schema-Validierung
- Strings niemals als unsicheres HTML interpretieren
- sichere URL-Schemata
- kein automatischer Netzwerkzugriff aufgrund von Dateiinhalten
- kein Ausführen von Projektinhalten

## Beispiel-Fixture

Nach Definition des ersten formalen Schemas wird ein bereinigtes Beispielprojekt ergänzt:

```text
examples/demo-opportunity.meddpicc
```

Nur fiktive Unternehmen und Personen verwenden.
