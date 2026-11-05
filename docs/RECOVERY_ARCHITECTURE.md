# P0: Datenverlustschutz und optionales lokales Recovery (#65)

Stand: Implementierungsbranch zu PR #93. Kanonisch bleiben AGENTS.md, ARCHITECTURE.md und PROJECT_FILE_SPEC.md.

## Analyse vor der Änderung

| Bereich | Vorheriger Zustand | Verlustpfad |
| --- | --- | --- |
| Go-Live-Timeline | `ref` für Kunde, Datum, Schritte und Reihenfolge | Reload, Tab-Schließen, andere Route |
| Metric Builder | `draft` + Wizard-Schritt nur im Component-State | Reload, Browserabsturz, Toolwechsel |
| Software-Payback | Kosten, Metrics, Szenarien, Berichtsmetadaten im Component-State | Reload, Moduswechsel, Tab-Schließen |
| Cost of Delay | Modellwerte + Auswahl im Component-State | Reload und Navigation |
| Value Bridge | Narrative, Metrics, Szenario im Component-State | Reload und Navigation |
| Quick Payback (3 Werte) | Kurzformular im Component-State | Reload; bewusst kein dauerhafter Recovery-Workflow |
| Checklists/Knowledge | temporäre Checkboxen und UI-Zustand | bewusst keine Deal-Speicherung |
| Tool-Handoffs | `sessionStorage` mit bewusstem einmaligem Consume | bei geschlossenem Tab/ungültigem Transfer verloren; keine Backup-Zusage |
| Dokumentgestaltung | separates, opt-in bearbeitetes Firmenprofil in IndexedDB | eigener bestehender Speicherdienst; nicht mit Recovery vermischt |
| Legacy-Projekt | Pinia-Store; importiertes `.meddpicc` bleibt kanonisch | vor Reload Warnung bei `dirty`, aber keine Warnung bei internem Routing |
| Legacy-Download | `prepareDownload` erzeugt erhöhte Revision; Browser-Link wird geklickt | `confirmDownloaded` setzte bisher `dirty=false` und übernahm `updatedAt` **ohne Nachweis**, dass Download gespeichert wurde |

Die Auswertung ist statisch aus den tatsächlichen Call-Sites erfolgt; E2E-Szenarien liegen in `tests/e2e/tool-recovery.spec.ts`. Ein Browser-Download-Ereignis ist keine bestätigte lokale Dateispeicherung.

## Architekturentscheidung

**IndexedDB**, pro Tool ein einzelner versionierter Snapshot in `meddpicc-tool-recovery/snapshots`; ausdrückliche Einwilligung in `preferences`. Kein Cloud-Dienst, keine App-Konto-Verknüpfung, keine neuen npm-Abhängigkeiten. Das bereits vorhandene Branding-IDB bleibt separat.

| Technik | Bewertung |
| --- | --- |
| Komponenten-Refs | Keine persistente Speicherung; verlieren Daten beim Remount |
| `sessionStorage` | Sinnvoll für explizite, kurzlebige Übergaben; ungeeignet für Tab-Neustart |
| `localStorage` | Synchroner Hauptthread-Zugriff und keine atomare Revisionstransaktion über Tabs |
| IndexedDB | Asynchron, transaktional; revisionsgebundene, pro Tool getrennte Writes; gewählt |
| File System Access API / Download | Nutzeraktion, Browserunterstützung/Dateispeicherung nicht garantiert; keine automatische Recovery |

### Technische Verträge

- `src/services/toolRecovery.ts`: Speicheröffnung, Consent, TTL-/Envelope-Prüfung, transaktionale Writes, Löschung und Konflikte.
- `src/services/toolRecoveryValidators.ts`: strikte, toolbezogene Eingabe-Schemas für untrusted Snapshots, inklusive maximaler Listen-/String-Größen und Finite-Number-Prüfung.
- `src/composables/useToolRecovery.ts`: Dirty-Fingerprint, 800-ms-Debounce, Konflikterkennung, Router- und `beforeunload`-Guard, Lebenszyklus.
- `src/components/ToolRecoveryBar.vue`: Opt-in, unauffälliger Status, Fehlerzustand und nativer modaler Entscheidungsdialog.

`schemaVersion=1`; pro Tool Snapshot-Version/Revision und Zeitstempel, Retention-Horizont **7 Tage**, Obergrenze **256 KiB je Snapshot**. Beim nächsten Lesen eines betroffenen Tools wird ein abgelaufener Snapshot innerhalb der Datenbanktransaktion gelöscht; eine automatische Löschung im Hintergrund ohne Website-Aufruf ist browserseitig nicht garantiert. Bei aktivem Recovery werden nur Änderungen des jeweiligen Tool-Inputs, nicht Diagramme, PDFs, Berechnungen, Pinia oder Session-Handoffs gespeichert.

## Lifecycle und Konfliktregeln

1. **Ohne Opt-in:** Eingaben bleiben flüchtig; Dirty-Warnungen bei Navigation und vor Reload. Der Recovery-Dienst kann lediglich den Status bestehender Snapshots lesen; er schreibt keine Kundeneingaben.
2. **Aktivieren:** Consent wird separat transaktional gespeichert; nur dann können sinnvolle Änderungen debounced persistiert werden. Ein leerer/default Entwurf wird nicht geschrieben.
3. **Wiederöffnen:** Gültiger Snapshot → Dialog mit Zeitpunkt und ausdrücklicher Wahl. Der Live-State (auch aus einem Session-Handoff) bleibt unverändert, bis „Wiederherstellen“ gedrückt wird. Ein abweichender Stand wird explizit als Konflikt angezeigt.
4. **Übernahme:** Der Snapshot wird unmittelbar vor der Übernahme erneut gelesen und strikt validiert. Nur der vollständig validierte Input wird synchron in Vue übernommen. Keine Bestätigung von Evidenz, keine implizite Aktivierung importierter Metrics, keine neuen Projekt-Revisionen.
5. **Verwerfen:** Löscht den konkreten Snapshot; ein konkurrierender neuerer Stand kann wegen der Revisionsprüfung nicht versehentlich gelöscht werden.
6. **Deaktivieren:** Entfernt Consent und Snapshot in einer Transaktion. Weitere alte Tabs dürfen danach nicht mehr schreiben, weil jeder Write die gespeicherte Einwilligung in derselben Transaktion erneut prüft.
7. **Globales Löschen:** Einstellungen → „Alle Recoverydaten löschen“ löscht alle Snapshots und Opt-ins. Firmenprofil und exportierte Dateien bleiben unberührt.
8. **Zwei Tabs:** Jeder Write vergleicht die erwartete Revision in derselben `readwrite`-Transaktion. `BroadcastChannel` meldet Änderungen ohne Kundendaten; ein abweichender Tab stoppt Writes und fordert eine Entscheidung.
9. **Speicherfehler:** Kein gefälschter Erfolgsstatus. Die Eingaben bleiben im UI; Fehler und Dirty-Warnung bleiben sichtbar. Quota/IDB-Blockade, Browser-Schließen während des Debounce und Crash vor dem Transaktionsabschluss können dennoch Daten kosten.

### Kanonische Dateien und Downloads

Die `.meddpicc`-Projektdatei bleibt Source of Truth für den Legacy-Bereich. Es gibt **kein automatisches Legacy-Projekt-Recovery** und keine Vermischung von Projektimport und Microtool-Snapshot. Projekt-Importvalidierung bleibt unverändert und atomar.

Bei Legacy-Export wird `prepareDownload` lediglich zum Erzeugen des Download-Inhalts aufgerufen. Der Store wird **nicht** mehr durch `confirmDownloaded` fälschlich als gespeichert markiert. `revision`, `updatedAt` und `dirty` des aktiven Projekts bleiben nach dem Link-Klick unverändert; die UI fordert auf, die gespeicherte Datei selbst zu kontrollieren.

## Datenschutz und Bedrohungsgrenzen

- Recovery ist **nicht verschlüsselt** und bietet **keine Zugriffssperre** innerhalb desselben Browserprofils. Andere Benutzer am gemeinsamen Gerät, Browser-Erweiterungen und lokale Systemadministratoren können Daten möglicherweise einsehen.
- Die Daten können in Browserprofil-Backups, System-Snapshots oder Dateisystem-Restbeständen länger vorhanden sein. Browser-Cache/Profilverwaltung und verschlüsselte Festplatten sind außerhalb der Anwendung.
- Die Anwendung verwendet keine Recovery-Cloud, keinen neuen API-Endpunkt, kein Tracking und protokolliert keine Kundendaten. Browser- oder Betriebssystemdiagnostik kann unabhängig davon existieren.
- `beforeunload` kann vom Browser unterdrückt werden; ein Download-Klick bestätigt keine Platte; weder Debounce noch `visibilitychange` kann eine bereits eingetretene Browser-Katastrophe rückgängig machen.
- `sessionStorage`-Übergaben bleiben temporär und werden nicht unbemerkt in den Recovery-Store übernommen.
- Die separate, bereits vorhandene Speicherung für die Dokumentgestaltung wird durch „Alle Recoverydaten löschen“ **nicht** entfernt.
- Einsatz auf gemeinsam genutzten Rechnern: Recovery nicht aktivieren bzw. nach Nutzung deaktivieren und löschen.

## Bewusst ausgeschlossene Bereiche

- Kurzformular „Schnellberechnung“, spontane Checklist-Häkchen und Knowledge-Einklappungen: geringer Umfang, keine sinnvolle Langzeit-Wiederherstellung.
- Legacy-Komponenten: weiterhin Datei-Workflow; opt-in Recovery für komplette Projekte würde hohe Privacy- und Konfliktkosten sowie eine zweite Source of Truth riskieren. Dies ist **kein** stilles Versprechen einer Legacy-Backup-Funktion.
- Keine CRMs, globale Deal-Listen, Project Lifecycle Automation, periodische Hintergrundjobs, Cloud-Synchronisation oder neue Berechnungen.

## Simulierte Red-Team-Gegenprüfung

Diese Prüfung simuliert drei unabhängige Perspektiven; es wurden keine externen Experten beauftragt.

**Frontend:** Bei unkontrolliertem State-Remount gehen lange Eingaben verloren. Pro Tool abgekapselte Controller statt globalem Pinia, Schreib-Debounce, ein synchronisierter Schreibabschluss vor internem Route-Wechsel und transaktionale Revisionen reduzieren den Eingriff. Verbliebene Grenze: es gibt keine Browser-Crash-Garantie.

**Datenschutz/Sicherheit:** Untrusted Snapshots dürfen nicht ungeprüft in Vue zurückgeladen werden. Strikte Envelopes, Schemas, Größenlimits, Expiry und erneutes Lesen vor Restore schließen beschädigte/incompatible Nutzdaten aus. Abgelaufene Snapshots werden beim nächsten Tool-Aufruf physisch gelöscht; browserweite Löschung meldet sich ohne Nutzdaten an andere Tabs. Restrisiko: unverschlüsselte IDB-Daten im gemeinsamen Browserprofil.

**UX/Regression:** Ein geklickter Download darf nicht als gespeicherte Datei gelten. Der Legacy-Status bleibt nach Download dirty; Recovery heißt ausdrücklich „lokal zwischengesichert“. Der native Dialog erzwingt bewusste Entscheidung und macht Konflikte sichtbar. Moduswechsel aus dem Payback-Panel war ein weiterer Datenverlustpfad und warnt jetzt bei Dirty-State.

## Verifikation

- Unit: `src/services/toolRecovery.test.ts` (Envelope, Version, TTL, Obergrenze, strikte Input-Verträge).
- Playwright: `tests/e2e/tool-recovery.spec.ts` (realer Chromium-Browserspeicher, Reload, Tab, Konflikte, Löschung, A11y, Viewports und Handoffs).
- Vor Freigabe müssen `npm run format:check`, `npm run lint`, `npm run test`, `npm run build`, `npm run pages:check` und `npm run test:e2e` erfolgreich beendet werden.
