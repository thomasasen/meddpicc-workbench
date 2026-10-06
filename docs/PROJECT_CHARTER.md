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

Eine **local-first MEDDPICC Deal-Reasoning- und Coaching-Workbench**, die rigorose Qualifizierung so praktikabel macht, dass sie während des gesamten komplexen Sales Cycles kontinuierlich genutzt werden kann.

Die Anwendung übernimmt mechanische und regelbasierte Denkarbeit. Die fachliche Beurteilung bleibt beim Seller.

Das Produktversprechen ist nicht „MEDDPICC digital pflegen“, sondern **„aus vorhandenem Dealwissen schneller die richtige nächste Arbeit ableiten“**.

Beispiele:

- Qualification Gaps deterministisch erkennen und erklären
- wenige Next Best Actions priorisieren
- vor POC, Pricing, Proposal oder Commit Qualification Gates prüfen
- Champion und Economic Buyer anhand Evidence testen
- ROI, Payback und Cost of Delay berechnen
- Decision Process und Paper Process auf Lücken, Dependencies und unrealistische Termine prüfen
- rückwärts vom Target Close / Go-Live planen
- Meeting Prep aus aktuellen Gaps und Gesprächszielen ableiten
- konsistente Deal Reviews erzeugen

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

### Deal prüfen

Der Deal Inspector zeigt die wenigen kritischen Qualification Gaps, Risiken und fehlenden Belege und erklärt die zugrunde liegenden Regeln und Inputs.

### Nächste Aktion bestimmen

Aus den offenen Gaps priorisiert die Workbench wenige konkrete Sales-Aktionen und erklärt, warum diese jetzt wichtiger sind als andere.

### Qualification Gate prüfen

Vor ressourcenintensiven Schritten wie POC, Proposal, Pricing oder Commit prüft die Workbench deterministisch, welche Voraussetzungen erfüllt bzw. noch offen sind.

### Deal Review vorbereiten

Die Workbench erzeugt einen strukturierten Deal Review direkt aus dem aktuellen Projektstand.

### Business Case pflegen

Annahmen oder kundenseitig bestätigte Werte werden aktualisiert und Value, ROI, Payback und Cost of Delay deterministisch neu berechnet.

### Close Date schützen

Decision Process, Paper Process und Go-Live-Planung werden kombiniert, um unrealistische Termine, fehlende Schritte und Abhängigkeiten sichtbar zu machen.

## Produktprinzipien

### Workflows statt Datensätze

Die primäre UI folgt Seller-Aufgaben wie „Deal prüfen“, „Champion testen“ oder „Business Case rechnen“. Das Projektschema ist ein Datenfundament und kein Auftrag, für jedes Feld eine CRUD-Oberfläche zu bauen.

### Deterministisch by default

MEDDPICC-Reasoning, Gap Detection, Priorisierung, Berechnungen und Prozessplanung müssen ohne AI-/LLM-Runtime funktionieren. Gleiche Inputs liefern gleiche Ergebnisse.

### AI ist optionaler Input, nicht die Reasoning Engine

Eine spätere AI-Funktion darf unstrukturierte Texte in Candidate Evidence überführen. Candidate Evidence wird erst nach Bestätigung zum kanonischen Projektwissen.

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

- eine portable `.meddpicc`-Datei zuverlässig erstellen, öffnen, validieren, migrieren und speichern kann
- Evidence, Annahmen und unbekannte Informationen sauber unterscheiden und auf Quellen zurückführen kann
- einen Deal Inspector nutzen kann, der kritische Qualification Gaps nachvollziehbar erkennt
- wenige Next Best Actions mit klarer Begründung erhält
- Qualification Gates vor POC, Proposal, Pricing, Commit und ähnlichen Schritten nutzen kann
- Champion und Economic Buyer evidence-basiert prüfen kann
- Value / ROI / Payback / Cost of Delay deterministisch berechnen kann
- Decision Process und Paper Process inklusive Dependencies und Closing-Timeline prüfen kann
- ein nächstes Meeting aus Deal-Gaps fokussiert vorbereiten kann
- einen verwendbaren Deal Review exportieren kann
- alle Core-Funktionen ohne AI-/LLM-Runtime und ohne verpflichtendes Backend nutzen kann

## Nichtziele für v1

- CRM-artige Account- oder Kontaktverwaltung
- Pipeline Board und Pipeline Rollups
- Activity Timeline oder generische Task-App
- AI als Voraussetzung für Deal-Reasoning oder Empfehlungen
- automatische Meeting-Transkription
- automatische CRM-Synchronisation
- E-Mail-/Kalender-Integration
- Multi-User-Echtzeit-Kollaboration
- Cloud-Projektspeicher
- Enterprise Identity Management
- eingebettetes Dokumentarchiv

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
