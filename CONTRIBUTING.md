# Beitragen

MEDDPICC Workbench soll eine fokussierte local-first Deal-Reasoning- und Coaching-Workbench bleiben. Beiträge müssen diese Richtung erhalten und dürfen das Produkt nicht schrittweise zu einem CRM oder einer zusätzlichen Datenpflege-Schicht machen.

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

- Reduziert sie konkrete repetitive Qualification-/Deal-Planning-Arbeit des Sellers?
- Hilft sie, die nächste sinnvolle Sales-Aktion oder eine bessere Entscheidung abzuleiten?
- Erkennt oder schließt sie reale Gaps, Risiken oder Prozessabhängigkeiten?
- Verbessert sie die Verlässlichkeit und Nachvollziehbarkeit von Evidence?
- Rechnet oder plant sie etwas, das der Seller sonst manuell rekonstruieren müsste?
- Macht sie einen Deal leichter wiederaufnehmbar, reviewbar oder übergebbar?

Zusätzlich prüfen:

- Entsteht nur eine weitere CRUD-/Pflegeoberfläche?
- Werden CRM-Daten wie Kontakte, Activities, Pipeline oder generische Tasks dupliziert?
- Könnte der gleiche Nutzen aus bereits vorhandenen Projektdaten deterministisch abgeleitet werden?
- Ist eine AI-Komponente wirklich für unstrukturierten Input nötig oder wird sie unnötig für Reasoning eingesetzt?

Wenn der Hauptnutzen „mehr Felder pflegen“ lautet, gehört die Änderung wahrscheinlich nicht in den Core.

## Architekturgrenzen

Nicht einführen:

- verpflichtendes Backend
- verpflichtende Benutzerkonten
- AI-Abhängigkeit für Core-Reasoning oder Core-Workflows
- ungeprüfte AI-Mutationen kanonischer Projektdaten
- CRM-artige Account-/Kontakt-/Pipeline-/Activity- oder generische Task-Verwaltung
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
6. Pull Request während aktiver Umsetzung als Draft führen
7. erst nach abgeschlossenem Review auf „Ready for review“ setzen und damit die vollständige CI auslösen
8. nicht mit fehlschlagenden Tests mergen

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
- erklärbare Qualification-/Evidence-Bewertung
- Gap Detection
- Next-Best-Action-Priorisierung
- Qualification Gates
- Champion-/Economic-Buyer-Checks
- Datums-/Dependency-/Closing-Logik
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


## CI- und Actions-Ressourcen

Die CI soll Qualität sichern, nicht jeden Zwischenschritt teuer duplizieren.

- Draft-PRs führen keine vollständige CI aus.
- Neue Commits auf demselben aktiven PR ersetzen ältere CI-Runs; veraltete Runs werden automatisch abgebrochen.
- Reine Markdown-/Lizenzänderungen lösen keine vollständige CI aus.
- Die vollständigen Quality Gates (Format, Lint, Unit Tests, Build, Pages-Check, Playwright Desktop + Mobile) laufen einmal auf dem finalen Ready-for-review-PR. Nach dem Merge prüft `main` nur noch Production Build + Pages-Integrität.
- Der bereits erzeugte Production Build wird für Playwright wiederverwendet.
- Abhängigkeiten werden reproduzierbar mit `npm ci` installiert und über den npm-Cache von `setup-node` wiederverwendet.
- Keine temporären GitHub-Actions-Workflows für einmalige Formatierungs- oder Sync-Aufgaben anlegen.
