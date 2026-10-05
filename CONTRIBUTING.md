# Beitragen

MEDDPICC Workbench soll ein fokussiertes local-first Qualifizierungswerkzeug bleiben. Beiträge müssen diese Richtung erhalten.

## Projektsprache

Die Projektsprache ist **Deutsch**.

Deutsch für:

- Dokumentation
- Issues
- Pull Requests
- UI-Texte
- Hilfetexte und Fehlermeldungen
- fachliche Beschreibungen

Englisch bleibt bei etablierten MEDDPICC- und technischen Fachbegriffen sowie in Code, Schema-Keys, APIs, Typen, Variablen, Funktionen und Dateinamen.

Vor Implementierung `AGENTS.md` lesen. Bei UI/UX zusätzlich `docs/DESIGN_SYSTEM.md`.

## Vor einem Feature

Eine Änderung sollte mindestens eine dieser Fragen mit Ja beantworten:

- Reduziert sie repetitive Qualification-/Deal-Planning-Arbeit?
- Verbessert sie Verlässlichkeit von Evidenz und Qualifizierungsstatus?
- Macht sie ein Projekt leichter wiederaufnehmbar, reviewbar oder übergebbar?
- Hilft sie, reale Gaps, Risiken, Abhängigkeiten oder nächste Aktionen sichtbar zu machen?

Wenn nicht, gehört sie wahrscheinlich nicht in den Core.

## Architekturgrenzen

Nicht einführen:

- verpflichtendes Backend
- verpflichtende Benutzerkonten
- AI-Abhängigkeit zur Runtime
- Telemetrie mit Zugriff auf Opportunity-Inhalte
- stillen Upload/Sync von Projektdateien
- zweite kanonische Datenquelle neben der `.meddpicc`-Datei

Browser Storage ist nur für Recovery, Präferenzen oder ausdrücklich dokumentierte Komfortfunktionen zulässig.

## Entwicklungsworkflow

Empfohlen:

1. fokussierten Branch erstellen
2. kleine, beschreibende Commits
3. Tests für Domain-Verhalten ergänzen/aktualisieren
4. bei Schema-Änderungen Migrationsdokumentation aktualisieren
5. UI-Änderungen gegen Design-System-Checkliste prüfen
6. Pull Request mit Verhalten und Kompatibilitätsauswirkung erstellen
7. nicht mit fehlschlagenden Tests mergen

## Commit-Stil

Conventional-Commit-Präfixe bleiben Englisch:

```text
feat:
fix:
docs:
test:
refactor:
build:
ci:
chore:
```

Die Beschreibung danach darf deutsch sein.

## Project-File-Kompatibilität

Änderungen am `.meddpicc`-Schema erfordern besondere Sorgfalt.

Ein Pull Request mit Persistenzänderung dokumentiert:

- alte Schema-Version
- neue Schema-Version
- Patch/Minor/Major
- Migrationsverhalten
- Fixture-/Teständerungen
- Datenverlustrisiko
- Downgrade-Verhalten, falls relevant

Kompatible unbekannte Felder niemals still verwerfen.

## Domain-Regeln

Reine Funktionen bevorzugen für:

- Berechnungen
- Scoring
- Gap Detection
- Datums-/Dependency-Logik
- Validierung
- Migration

UI-Komponenten dürfen keine versteckte Methodiklogik enthalten.

## UI/UX-Beiträge

UI-Arbeiten folgen:

- `docs/DESIGN_SYSTEM.md`
- `.agents/skills/meddpicc-ui-ux/SKILL.md`
- `AGENTS.md`

`nextlevelbuilder/ui-ux-pro-max-skill` ist ausschließlich externe Entwicklungsreferenz. Gepinnter Stand und Nutzungsgrenzen: `docs/UI_UX_REFERENCE.md`.

Nicht als Runtime Dependency hinzufügen.

UI-Pull-Requests prüfen insbesondere:

- semantisches HTML
- vollständige Tastaturbedienung
- sichtbaren Fokus
- Status nicht nur über Farbe
- Responsive-Verhalten bei ca. 375/768/1024/1440 px
- lange deutsche Labels und englische Fachbegriffe
- Browser-Zoom/Textskalierung
- Reduced Motion
- Chart-/Tabellen-Accessibility
- lokale/gebündelte Assets statt externer Runtime-Fonts/Scripts
- deutsche Standardsprache im UI

## Methodikinhalte

Eigene Formulierungen verwenden.

Keine Copyright-geschützten Buchpassagen, proprietären Trainingsfolien, Zertifizierungsunterlagen oder fremden Kursinhalte in das Repository kopieren.

Allgemeine Methodik kann als Softwareverhalten umgesetzt werden; öffentliche Dokumentation und UI-Texte müssen eigenständig formuliert sein.

## Testerwartungen

Mindestens:

- deterministische Berechnungen mit Unit Tests
- Schema-Änderungen mit valid/invalid/migration Fixtures
- File Open/Save mit Browser-Flow-Tests
- relevante UI-Flows mit Keyboard-/Responsive-Prüfung
- Bugfixes möglichst mit Regression Test

## Security und Privacy

Jede Funktion, die Runtime-Netzwerkverkehr mit Projektdaten einführt, benötigt explizites Design Review und Dokumentation.

Siehe [SECURITY.md](SECURITY.md).
