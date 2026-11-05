# Lokaler Datenverlustschutz und Recovery (Issue #65)

## Produktentscheidung

Die MEDDPICC Toolbox bleibt **local-first und microtool-first**. Ein Benutzer entscheidet pro längerem Arbeitsablauf, ob er lokale Recoverydaten anlegen möchte. Die Eingaben bleiben ohne Opt-in im Vue-Komponenten-State. Eine neue globale Deal-Datenbank, Cloud-Synchronisation oder dauerhafte Session-Übertragung wird nicht eingeführt.

Ein `.meddpicc`-Projektimport ist eine ausdrücklich gewählte Dateioperation. Die kanonische Datei wird weder durch einen Recovery-Snapshot ersetzt noch durch dessen Metadaten (`revision`, `updatedAt`) verändert. Existierende `sessionStorage`-Handoffs dienen weiterhin nur einem expliziten Toolwechsel.

## Reproduzierbare Ursachen vor dem Umbau

1. Die Go-Live-Planung hielt Kundenname, Zieldatum und Prozessschritte ausschließlich in lokalen Vue-Refs. Ohne erneute Erfassung waren sie nach Reload verloren.
2. Metric Builder, Cost of Delay und Value Bridge hielten ihre großen Entwürfe im Komponenten-State. Die Session-Handoffs übertragen nur fachlich ausgewählte Daten an Zieltools und sind keine Sicherung des gesamten Entwurfs.
3. Software-Payback hielt Kosten, Metrics, Szenarien und Berichtsfelder nur solange die Komponente lebte. Auch der Wechsel in den Schnellrechner konnte die Komponente zerstören.
4. `App.vue` prüfte `projectStore.dirty` beim `beforeunload`, nicht aber die unabhängigen Microtools.
5. Legacy-Projektansichten riefen nach `downloadTextFile` bereits `confirmDownloaded` auf. Ein ausgelöster Ankerdownload beweist nicht, dass der Browser die Datei wirklich gespeichert hat. Das führte zu einem potenziell falschen gespeicherten Status und zu vorzeitig aktualisierten Revisionen/Zeitstempeln.

## Geschützte Bereiche

| Workflow | Snapshot-Inhalte | Warum |
| --- | --- | --- |
| Go-Live-Rückwärtsplanung | Kontext, Termine und Schritte | längere, bearbeitbare Prozessplanung |
| Metric Builder | vollständiger Metric-Entwurf und Wizard-Schritt | mehrstufige Discovery und Annahmen |
| Cost of Delay | vollständiger Entwurf, ausgewählte Verzögerung, Eingabezeitraum und Schritt | mehrstufige wirtschaftliche Szenarien |
| Value Bridge | Argumentation, Metrics und Ansichts-/Schrittauswahl | längere zusammenhängende Bearbeitung |
| Software-Payback | Kosten, Metrics, Szenarien und Berichtsfelder | umfangreiche Business-Case-Erstellung |

Der bewusst kurze Schnellrechner, einzelne Checklists und Wissensseiten erhalten keine Recovery-Snapshots. Import-/Export, Session-Handoffs sowie die bestehende separate IndexedDB-Konfiguration für die Dokumentgestaltung werden nicht migriert oder zweckentfremdet.

## Technischer Vertrag

- Speicher: **IndexedDB** mit eigener Datenbank `meddpicc-tool-recovery` und Store `snapshots`, je Tool ein unabhängiger Schlüssel.
- Standard: Keine Recovery-Schreibvorgänge vor dem ausdrücklich betätigten Aktivierungsbutton.
- Format: versionierter JSON-Envelope, Tool-ID, zufälliger Token, `savedAt`, `expiresAt`, fachlicher Input-Snapshot. Keine Projektdatei-Metadaten.
- Validierung: Version, Zugehörigkeit, Datum, Ablauf, maximale Bytezahl und streng begrenzter, toolspezifischer TypeScript-Inputvertrag.
- Aufbewahrung: maximal sieben Tage nach dem letzten tatsächlich ausgeführten Schreibvorgang. Ein abgelaufener oder beschädigter Stand wird nicht übernommen.
- Größe: höchstens 256 KiB pro Snapshot einschließlich Envelope. Listen besitzen zusätzliche fachliche Mengenlimits.
- Schreibfrequenz: 600 ms Debounce nach Eingabeänderung, keine Schreibvorgänge für identischen Zustand.
- Konkurrenz: Lesen, erwarteten Token prüfen und Schreiben erfolgen **innerhalb derselben IndexedDB-readwrite-Transaktion**. Ändert ein zweiter Tab die Daten, wird der veraltete Schreibversuch abgewiesen. `BroadcastChannel` signalisiert Änderungen ohne Kundendaten an andere Tabs.
- Wiederherstellung: nur durch bewusste Auswahl, nach erneutem vollständigem Lesen und Validieren. Der aktuelle Datenstand wird bei Auswahl ausdrücklich ersetzt, nicht mit importierten Daten vermischt.
- Fehler: Speicherverbot, beschädigte Snapshots, Quota oder Konflikt erzeugen eine sichtbare Nachricht. Die Anwendung verarbeitet ihre Eingaben weiter; der lokale Sicherungsstatus wird nicht behauptet.
- Löschen: Verwerfen im jeweiligen Tool oder vollständiges Löschen aller Recovery-Snapshots unter Einstellungen. Andere Speicherbereiche bleiben bestehen.

Der Speicher ist browserprofil- und originspezifisch, **nicht verschlüsselt**. `BroadcastChannel` kommuniziert nur im Browser auf demselben Origin; es gibt keine Serverübertragung und keine Telemetrie von Recoverydaten.

## Browser- und Datenschutzgrenzen

**Recovery ist keine dauerhafte Datensicherung.** Der Browser oder das Betriebssystem kann IndexedDB-Inhalte löschen, private Sitzungen können Speicher unterbinden, und ein Absturz vor Ablauf des Debounce-Intervalls kann die letzten Eingaben kosten. `beforeunload` kann nur mit eingeschränkter Browser-Unterstützung warnen und nicht zuverlässig asynchron schreiben. Eine vollständige physische Löschung aus Browser-Backups, Snapshots des Betriebssystems und externen Browserprofil-Kopien kann die Anwendung nicht garantieren.

Auf gemeinsam benutzten Geräten oder in Browserprofilen mit fremden Skripten desselben Origins können unverschlüsselte Recoverydaten eingesehen werden. Es werden weder Secrets bewusst extrahiert noch vertrauliche Inhalte geloggt. Unternehmensrichtlinien für vertrauliche Kundendaten haben Vorrang.

Ein ausgelöster Browser-Download wird lediglich als **angefordert** dargestellt. Insbesondere wird `confirmDownloaded` in den sichtbaren Legacy-Projektansichten nicht mehr unmittelbar aufgerufen. Die tatsächliche Annahme/Speicherung einer Datei liegt außerhalb der nachweisbaren Browser-API-Garantie.

## Qualitätssicherung und simulierte Red-Team-Gegenprüfung

- **Architektur:** Das ursprüngliche nicht-atomare `localStorage`-Konzept wurde durch transaktionales IndexedDB ersetzt. Ein Toolwechsel zwischen Payback-Modi besitzt nun denselben Safe-Exit-Pfad wie Router-Navigation. Separate Domain-Services bleiben unverändert.
- **Sicherheit/Datenschutz:** Explizites Opt-in, Datenlimits, Ablaufprüfung, strikte Snapshot-Schemata, sichtbare Quota-Fehler, Löschfunktion und reiner In-Browser-Signalkanal. Recovery ersetzt keine importierten Dateien.
- **UX/Regression:** Gemeinsamer Recovery-Controller, explizites Wiederherstellen/Verwerfen, präziser nicht als Datei gespeicherter Status und vorhandener Navigationsschutz. Die Browsergrenzen werden in der UI erläutert.

Die Gegenprüfung ist **simuliert** und nicht durch externe Fachprüfer durchgeführt. Maßgeblich bleiben die tatsächlichen Vitest-, Playwright-, Build- und Render-Ergebnisse des Pull Requests.
