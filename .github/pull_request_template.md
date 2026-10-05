## Zusammenfassung

Beschreibe, was dieser Pull Request ändert und warum.

## Scope

- [ ] nur UI
- [ ] Domain Logic
- [ ] `.meddpicc`-Schema
- [ ] Migration
- [ ] Berechnung / deterministische Regel
- [ ] Dokumentation
- [ ] Build / CI / Deployment

## Project-File-Kompatibilität

- Schema-Auswirkung: keine / Patch / Minor / Major
- Migration erforderlich: ja / nein
- mögliches Datenverlustrisiko: ja / nein

Falls relevant: Migration und Fixture-/Testabdeckung erläutern.

## Privacy / Netzwerk

- [ ] Keine neuen Runtime-Netzwerkaufrufe mit Projektdaten
- [ ] Keine neue Telemetrie
- [ ] Keine Backend-Abhängigkeit

Wenn ein Punkt nicht erfüllt ist, begründen und beschreiben, wie das Verhalten für Nutzer sichtbar gemacht wird.

## Projektsprache

- [ ] UI-Texte und Dokumentation sind deutsch.
- [ ] Englische Begriffe werden nur als MEDDPICC-/technische Fachbegriffe oder Code-Identifier verwendet.

## Tests

Beschreibe hinzugefügte bzw. durchgeführte Tests.

## Checkliste

- [ ] Verhalten ist dort deterministisch, wo es erwartet wird.
- [ ] Annahme und Evidenz werden nicht vermischt.
- [ ] Business Rules liegen nicht nur versteckt in UI-Komponenten.
- [ ] Dokumentation ist aktualisiert.
- [ ] Bei UI-Änderungen wurde `docs/DESIGN_SYSTEM.md` geprüft.
- [ ] Es wurden keine Copyright-geschützten/proprietären Trainingstexte kopiert.
