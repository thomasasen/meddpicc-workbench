# Projektauftrag

## Arbeitstitel

**MEDDPICC Workbench**

## Problem

Komplexe B2B-Opportunities sammeln im Laufe eines Sales Cycles große Mengen an Qualifizierungswissen. Viele CRM-Implementierungen speichern davon nur eine stark komprimierte Momentaufnahme: einen Economic Buyer, einen Champion, ein Close Date, einen Wettbewerber oder wenige Notizen.

Dabei gehen genau die Informationen verloren, die für belastbare Qualifizierung wichtig sind:

- Woher stammt eine Aussage?
- Ist sie Fakt, Kundenaussage, Interpretation oder Annahme?
- Was ist noch unbekannt?
- Welche Evidenz stützt eine Schlussfolgerung?
- Was hat sich über die Zeit verändert?
- Welches Gap erzeugt Deal-Risiko?
- Welche Aktion schließt dieses Gap?
- Wie greifen Decision Process, Paper Process und Implementierungszeitplan ineinander?

Gute Pflege per Hand erzeugt gleichzeitig viel repetitive administrative Arbeit.

## Vision

Eine **local-first MEDDPICC Workbench**, die rigorose Qualifizierung so praktikabel macht, dass sie während des gesamten komplexen Sales Cycles kontinuierlich genutzt werden kann.

Die Anwendung übernimmt mechanische Arbeit. Die fachliche Beurteilung bleibt beim Seller.

Beispiele für mechanische Arbeit:

- ROI, Payback und Cost of Delay berechnen
- strukturiertes Evidenzregister pflegen
- Decision Process und Paper Process abbilden
- rückwärts von einem Target Go-Live planen
- fehlende Owner, Termine, Abhängigkeiten und Bestätigungen erkennen
- deterministische Evidence-/Confidence-Bewertungen pflegen
- konsistente Deal Reviews erzeugen
- Entwicklung der Qualifizierung historisieren

## Produktversprechen

Nach dem Öffnen einer portablen `.meddpicc`-Projektdatei soll ein Seller sofort verstehen:

1. was bestätigt ist
2. was nur teilweise belegt ist
3. was Annahme ist
4. was unbekannt ist
5. was riskant ist
6. was als Nächstes passieren sollte

## Projektsprache

Die Projektsprache ist Deutsch.

MEDDPICC-Fachbegriffe wie `Economic Buyer`, `Decision Process`, `Paper Process`, `Champion` oder `Competition` bleiben im Original. Code und technische Identifier bleiben Englisch.

## Primäre Nutzer

### Account Executive / Strategic Account Manager

Benötigt eine belastbare Arbeitsdatei für eine komplexe Opportunity, ohne parallele Tabellen und Dokumente pflegen zu müssen.

### Sales Manager

Möchte einen Deal anhand Evidenz statt Seller-Optimismus prüfen und die wenigen wirklich kritischen Gaps erkennen.

### Deal Team

Benötigt eine gemeinsame, portable Darstellung von Qualifizierung, Prozess, Value, Risiken und nächsten Aktionen.

## Primäre Use Cases

### Bestehende Opportunity öffnen

Eine `.meddpicc`-Datei wird aus CRM oder Ablage geladen, in der Workbench bearbeitet und anschließend wieder gespeichert.

### Qualifizierung prüfen

Das Dashboard zeigt den Zustand jedes MEDDPICC-Elements zusammen mit Evidenzqualität, offenen Gaps und Risiken.

### Deal Review vorbereiten

Die Workbench erzeugt einen strukturierten Deal Review direkt aus dem aktuellen Projektstand.

### Business Case pflegen

Annahmen oder kundenseitig bestätigte Werte werden aktualisiert und Value, ROI, Payback und Cost of Delay deterministisch neu berechnet.

### Close Date schützen

Decision Process, Paper Process und Go-Live-Planung werden kombiniert, um unrealistische Termine, fehlende Schritte und Abhängigkeiten sichtbar zu machen.

## Produktprinzipien

### Evidenz ist ein First-Class-Objekt

Eine Qualifizierungsaussage ohne Provenienz ist schwächer als dieselbe Aussage mit Quelle, Datum, Kontext und Klassifikation.

### Unbekannt ist ein gültiger Zustand

Das Tool darf niemals dazu zwingen, Daten zu erfinden, nur um einen Score zu vervollständigen.

### Scoring muss erklärbar sein

Ein Score ohne zugrunde liegende Evidenz ist nicht hilfreich. Jeder abgeleitete Status muss auf konkrete Projektdaten und deterministische Regeln zurückführbar sein.

### Berechnungen müssen reproduzierbar sein

Gleiche Projektdatei und gleiche App-Version müssen zum gleichen berechneten Ergebnis führen.

### Projektdateien müssen portabel bleiben

Ein Projekt darf nicht von Browserprofil, einzelner Maschine oder proprietärem Backend abhängen.

### Das Tool ist kein CRM

Account-Stammdaten, E-Mail, Activity Capture, Pipeline Rollups und Contact Management liegen außerhalb des Kernscopes.

## Erfolgskriterien für v1

v1 ist erfolgreich, wenn ein Nutzer:

- ein neues Projekt erstellen kann
- eine vorhandene `.meddpicc`-Datei öffnen kann
- Schema validieren und migrieren kann
- alle MEDDPICC-Elemente pflegen kann
- Evidenz mit Qualifizierungsaussagen verknüpfen kann
- Risiken und nächste Aktionen pflegen kann
- Value / ROI / Payback / Cost of Delay berechnen kann
- Decision Process und Paper Process abbilden kann
- Go-Live-/Critical-Path-Planung erstellen kann
- ein Deal-Health-Dashboard auf Basis deterministischer Regeln nutzen kann
- einen verwendbaren Deal Review exportieren kann
- den vollständigen Projektstand wieder in einer portablen Datei speichern kann
- all das ohne Übertragung von Opportunity-Daten an ein Backend tun kann

## Nichtziele für v1

- AI-generierte Empfehlungen
- automatische Meeting-Transkription
- automatische CRM-Synchronisation
- E-Mail-/Kalender-Integration
- Multi-User-Echtzeit-Kollaboration
- Cloud-Projektspeicher
- Enterprise Identity Management
- eingebettetes Dokumentarchiv
- vollständiges Pipeline Management

Diese Themen können später bewertet werden, dürfen aber v1 nicht architektonisch belasten.

## Qualitätsstandard

Die Anwendung soll für reale Opportunity-Daten in folgendem begrenztem Sinn geeignet sein:

- kein absichtlicher Runtime-Upload von Projektdaten
- keine Analytics-Abhängigkeit mit Zugriff auf Projektinhalte
- klare Trennung von gespeicherter Datei und temporärem Browser-State
- Validierung vor Öffnen und Speichern
- Tests für deterministische Berechnungen
- Tests für Schema-Migration
- kein stiller Datenverlust
- klare Warnung bei nicht unterstützter zukünftiger Schema-Version
