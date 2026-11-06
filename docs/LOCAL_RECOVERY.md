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
- Aufbewahrung: Gültigkeit maximal sieben Tage nach dem letzten tatsächlich ausgeführten Schreibvorgang. Bei jedem Recovery-Zugriff werden abgelaufene Stände aller Tools bereinigt. Ohne erneuten Browserzugriff ist eine physische Löschung zum Ablaufzeitpunkt nicht garantiert. Ein abgelaufener oder beschädigter Stand wird nicht übernommen.
- Größe: höchstens 256 KiB pro Snapshot einschließlich Envelope. Listen besitzen zusätzliche fachliche Mengenlimits.
- Schreibfrequenz: sofortiger erster Snapshot nach Opt-in (auch bei bereits vorhandenen Eingaben); anschließend 600 ms Debounce nach Änderungen, keine erneuten Schreibvorgänge für identischen Zustand.
- Konkurrenz: Lesen, erwarteten Token prüfen und Schreiben erfolgen **innerhalb derselben IndexedDB-readwrite-Transaktion**. Ändert ein zweiter Tab die Daten, wird der veraltete Schreibversuch abgewiesen. `BroadcastChannel` signalisiert Änderungen ohne Kundendaten an andere Tabs.
- Wiederherstellung: nur durch bewusste Auswahl, nach erneutem vollständigem Lesen und Validieren. Der aktuelle Datenstand wird bei Auswahl ausdrücklich ersetzt, nicht mit importierten Daten vermischt.
- Fehler: Speicherverbot, beschädigte Snapshots, Quota oder Konflikt erzeugen eine sichtbare Nachricht. Die Anwendung verarbeitet ihre Eingaben weiter; der lokale Sicherungsstatus wird nicht behauptet.
- Löschen: Verwerfen im jeweiligen Tool oder vollständiges Löschen aller Recovery-Snapshots unter Einstellungen. Andere Speicherbereiche bleiben bestehen.

Der Speicher ist browserprofil- und originspezifisch, **nicht verschlüsselt**. `BroadcastChannel` kommuniziert nur im Browser auf demselben Origin; es gibt keine Serverübertragung und keine Telemetrie von Recoverydaten.

## Speicherstatus im Tool-Header

Die fünf Recovery-fähigen Microtools zeigen im jeweiligen Header einen kompakten, barrierefrei beschrifteten Status mit Lucide-Symbol. Der Status stammt aus `useToolRecovery` und wird **nicht** aus einem angeforderten Datei-Download oder bloß aktiviertem Opt-in abgeleitet.

| Anzeige | Bedeutung |
| --- | --- |
| Prüfe Speicher | Beim Öffnen wird der Browserspeicher geprüft. |
| Recovery aus | Für dieses Tool ist keine automatische lokale Sicherung aktiv. |
| Nicht gesichert | Ohne Opt-in sind Eingaben nur im aktuellen Tab vorhanden, oder geänderte Werte warten noch auf die nächste Sicherung. |
| Sichert lokal | IndexedDB-Schreibvorgang läuft. |
| Lokal gesichert | Erst nach erfolgreichem transaktionalem IndexedDB-Commit des angezeigten Eingabestands. Kein Datei-Export. |
| Entwurf vorhanden | Ein vorhandener Snapshot erfordert eine bewusste Wiederherstellungsentscheidung. |
| Speicherproblem | Schreibfehler, invalider Snapshot oder Mehr-Tab-Konflikt; keine falsche Erfolgsanzeige. |

Die Darstellung verwendet Symbol **und** sichtbaren deutschen Text, eine kurze erklärende Titelinformation, Screenreader-Status und Reduced-Motion-Fallback. Bei schmalen Displays darf sich der Header um eine Zeile erweitern. Schnellrechner, Checklists und Wissensseiten ohne Recovery erhalten bewusst keinen vermeintlichen Speicherstatus.

## Browser- und Datenschutzgrenzen

**Recovery ist keine dauerhafte Datensicherung.** Der Browser oder das Betriebssystem kann IndexedDB-Inhalte löschen, private Sitzungen können Speicher unterbinden, und ein Absturz vor Ablauf des Debounce-Intervalls kann die letzten Eingaben kosten. `beforeunload` kann nur mit eingeschränkter Browser-Unterstützung warnen und nicht zuverlässig asynchron schreiben. Eine vollständige physische Löschung aus Browser-Backups, Snapshots des Betriebssystems und externen Browserprofil-Kopien kann die Anwendung nicht garantieren.

Auf gemeinsam benutzten Geräten oder in Browserprofilen mit fremden Skripten desselben Origins können unverschlüsselte Recoverydaten eingesehen werden. Es werden weder Secrets bewusst extrahiert noch vertrauliche Inhalte geloggt. Unternehmensrichtlinien für vertrauliche Kundendaten haben Vorrang.

Ein ausgelöster Browser-Download wird lediglich als **angefordert** dargestellt. Insbesondere wird `confirmDownloaded` in den sichtbaren Legacy-Projektansichten nicht mehr unmittelbar aufgerufen. Die tatsächliche Annahme/Speicherung einer Datei liegt außerhalb der nachweisbaren Browser-API-Garantie.

## Qualitätssicherung und simulierte Red-Team-Gegenprüfung

- **Architektur:** Das ursprüngliche nicht-atomare `localStorage`-Konzept wurde durch transaktionales IndexedDB ersetzt. Ein Toolwechsel zwischen Payback-Modi besitzt nun denselben Safe-Exit-Pfad wie Router-Navigation. Separate Domain-Services bleiben unverändert.
- **Sicherheit/Datenschutz:** Explizites Opt-in, Datenlimits, Ablaufprüfung, strikte Snapshot-Schemata, sichtbare Quota-Fehler, Löschfunktion und reiner In-Browser-Signalkanal. Recovery ersetzt keine importierten Dateien.
- **UX/Regression:** Gemeinsamer Recovery-Controller, explizites Wiederherstellen/Verwerfen, präziser nicht als Datei gespeicherter Status und vorhandener Navigationsschutz. Die Browsergrenzen werden in der UI erläutert.

Die Gegenprüfung ist **simuliert** und nicht durch externe Fachprüfer durchgeführt. Nachprüfung: fehlende erste Sicherung unmittelbar nach Opt-in behoben, Ablaufchronologie strenger validiert, abgelaufene Snapshots anderer Tools werden beim Zugriff mitbereinigt, und die nichtmodale Recovery-Oberfläche ist eine semantische Region statt eines Dialogs. Diese Änderungen müssen durch den CI-Lauf des abschließenden Commits bestätigt werden.

Die von GitHub Actions zuvor vorgenommene automatische Formatierung und der selbsttätige Commit auf dem Feature-Branch wurden für diesen PR entfernt. Formatierungsfehler sollen als Quality-Gate-Fehler auffallen, statt die geprüfte Revision während der CI zu verändern.

## Ergänzende statische Red-Team-Prüfung (6. November 2026)

Zwei zusätzliche Datenintegritätsrisiken wurden anhand des Quellcodes untersucht und korrigiert:

1. **Konkurrierende Flush-Vorgänge:** Debounce, Navigation und Verwerfen konnten dieselbe Sicherungsgeneration gleichzeitig bearbeiten. Eine Promise-Warteschlange serialisiert Schreibversuche. Das Verwerfen deaktiviert weitere Sicherungen und wartet eingereihte Schreibversuche vor dem Löschen ab.
2. **Vorübergehend leere numerische Eingabefelder:** Bei `v-model.number` kann während der Bearbeitung der Wert `''` entstehen. Solche spezifischen Zwischenwerte werden im lokalen Snapshot zugelassen, beliebige andere Zahlenstrings weiterhin abgelehnt. Ein nicht validierbarer aktueller UI-Stand wird als ungesichert gemeldet und nicht als konkurrierender Tab klassifiziert.

Die Regressionstests wurden erweitert. **Die erfolgreiche Ausführung aller Quality Gates und die visuelle Nutzerfreigabe stehen separat aus; dieser Abschnitt ist kein Test-Erfolgsnachweis.**

## Globales Löschen und konkurrierende Tabs

Eine globale Löschung entfernt alle Snapshots innerhalb einer `readwrite`-Transaktion und schreibt in derselben Transaktion eine neue zufällige Löschgeneration in den Recovery-Store. Beim Laden eines Tools wird diese Generation gelesen; jeder spätere Schreibversuch prüft sie zusammen mit dem Revisionstoken innerhalb seiner Schreibtransaktion. Ein bereits geöffneter Tab mit einem älteren Stand kann somit auch dann keine zuvor gelöschten Inhalte wieder anlegen, wenn sein erster Schreibversuch erst nach der Löschung erfolgt und `BroadcastChannel` nicht verfügbar ist. Nach einem Reload kann der Benutzer Recovery ausdrücklich neu aktivieren.

Die Löschgeneration enthält keine Kundendaten. Wie bei den übrigen Recoverydaten garantiert die Browser-API keine physische Bereinigung aus Backups und Kopien. Ein Playwright-Regressionstest reproduziert den Konflikt aus einem noch geöffneten Tab vor dessen erster Sicherung; die endgültige Testaussage ergibt sich aus der CI auf dem jeweiligen Commit.

## Gezielte Handoff-Navigationsprüfung

Ein ausdrücklicher Session-Handoff überträgt ausschließlich die fachlich vereinbarten Felder, nicht zwingend den vollständigen Ursprungsentwurf. Der bisherige Sonderpfad `acknowledgeNavigation` konnte ohne Opt-in die normale Verlustwarnung überspringen. Bei tatsächlich veränderten ungesicherten Eingaben wird nun auch vor einem solchen bewussten Toolwechsel eine Bestätigung verlangt. Abbrechen erhält den bisherigen Entwurf; ausdrücklich bestätigtes Fortfahren ist weiterhin möglich. Browser-Regressionen prüfen beide Entscheidungen sowie die regulären fachlichen Übergaben.

**Reihenfolge bei Handoffs:** `prepareHandoff` prüft und bestätigt zuerst den möglichen Verlust. Erst danach darf ein fachlich begrenzter Wert über `sessionStorage` eingereiht werden. Ein abgebrochener Wechsel erzeugt damit keine unerwünschten Handoff-Daten. Der zuvor bestätigte Wechsel wird im Router einmalig ohne zweiten Dialog ausgeführt; ein fehlgeschlagener Übergabeversuch setzt diese Freigabe zurück.
