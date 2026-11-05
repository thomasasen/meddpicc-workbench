# Lokales Recovery: Zwischenstand zu Issue #65

> **Status: unvollständige WIP-Implementierung. Nicht freigeben oder mergen.**

## Vorhandene Datenklassen

- Tool-Eingaben werden zunächst ausschließlich in Vue-Komponenten gehalten; Reload/Tab-Schließen verwirft sie.
- Bestehende explizite Tool-Handoffs nutzen `sessionStorage`; sie sind **keine** Einwilligung in dauerhafte Aufbewahrung.
- CI-/Dokumentgestaltung nutzt bereits eigenständige IndexedDB-Speicherung für Organisationsgestaltung; dieser Speicher ist nicht der Recovery-Bereich.
- Die importierte oder exportierte `.meddpicc`-Datei ist im Legacy-Workspace die kanonische Source of Truth, nicht ein Recovery-Snapshot.

## Momentane Implementierung

Nur die Go-Live-Rückwärtsplanung hat einen sichtbaren Recovery-Schalter. Der wiederverwendbare Service verwendet `localStorage` mit getrennten Keys pro Tool. Das Einverständnis entsteht erst bei Betätigung des Aktivieren-Buttons. Normale Nutzung des Tools erzeugt keine Recovery-Schreibvorgänge.

Gespeichert werden versionierte JSON-Snapshots. Obergrenze 256 KiB inklusive Envelope, Retention sieben Tage seit letzter Änderung, Schreibbegrenzung 750 ms. Ein neuer gespeicherter Token wird gegen den beim letzten Lesen beobachteten Token geprüft; ein `storage`-Event signalisiert Änderungen in anderen Tabs. Diese Prüfung ist **nicht atomar** zwischen Tabs. Vor jeder Wiederherstellung erfolgen erneutes Lesen und Validieren. Ungültige Daten werden nicht übernommen; Nutzer müssen sie bewusst verwerfen.

Recovery ist nicht verschlüsselt und kann durch andere Skripte desselben Origins oder durch andere Nutzer desselben Browserprofils gelesen werden. Eine vollständige, physische Löschung kann mit Web Storage nicht garantiert werden (Browser-Backups, Browser-Synchronisation, Betriebssystemkopien). Browserabsturz direkt vor dem nächsten Debounce kann die letzte Änderung verlieren. Kein Browser kann das Anzeigen eines `beforeunload`-Dialogs garantieren.

## Noch nicht erfüllt

- Recovery-UI und tool-spezifische Validatoren für Software-Payback, Metric Builder, Cost of Delay, Value Bridge und weitere geeignete Workflows.
- Nachweis einer transaktionssicheren tabübergreifenden Schreibstrategie. `localStorage` bietet kein Compare-and-Swap.
- Atomare Zustandswiederherstellung einschließlich Vue-State, Konflikten zu Import- und Handoff-Daten und potenzieller Rollback-Grenzen.
- Bereinigung und explizite Lösch-UI aller Recovery-Keys sowie Erkennung veralteter Schlüssel.
- Korrektur von Export-Erfolgstexten und des Legacy-Download-Bestätigungsflusses.
- Vollständige Browser-, Quota-, A11y- und Responsive-Prüfung mit echtem Rendering.
- Alle sechs geforderten Quality Gates und simulierte Red-Team-Gegenprüfung.

Der vorhandene Stand ist als prototypische erste Implementierung zu behandeln. Insbesondere dürfen die Einträge im Issue nicht als erfüllt markiert werden.
