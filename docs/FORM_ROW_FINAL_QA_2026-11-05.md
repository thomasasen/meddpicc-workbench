# Projektweite Formular-QS – Abschlussstand (05.11.2026)

## Ausgangspunkt
Neuer Branch vom aktuellen `main` mit der bereits integrierten Navigationskorrektur #91. Die Formulararchitektur aus PR #90 wird selektiv übernommen; konkurrierende CSS-Lösungen aus #84, #87, #88 und #89 werden **nicht** blind gemischt.

## Bestätigte Ursachen des CI-Laufs 42071876091
1. **Software-Payback:** Der Test-Locator für `SaaS / Betrieb` matcht Hinzufügen und Entfernen zugleich. Exakte Rollennamenssuche korrigiert.
2. **Metric Builder:** Der Test wollte bei jedem Viewport den Demo-Button aus Schritt 1 betätigen, nachdem die identische Hash-URL den Wizard-State behalten konnte. Ein echtes `page.reload()` isoliert jeden Viewport. Schritte 2/3 werden über die sichtbare Schrittnavigation aufgerufen; dynamische Felder bei ausgewähltem Realisierungsmechanismus sind einbezogen. Die Logs belegen keinen Fehler in der Domain-Berechnung.
3. **Dokumentgestaltung:** In Chromium war das Label der Farbwahl 114px breit, die Spalte nur 108px. Spalte auf 120px und umbruchfähige Beschriftung; Playwright misst auch direkte Label-Textknoten und alle Farb-Controls.

## Abdeckung
- 11 Formularszenarien einschließlich Go-Live, Software-Payback, Metric Builder, Cost of Delay, Value Bridge, Branding und Legacy; je 320, 375, 768, 800, 1024 und 1440px in Desktop- und Mobil-Chromium.
- Reale DOM-Geometrie: Oberkante, Höhe, vertikale Lage von Labels/Hilfen, Überlauf und Zahl geprüfter Feldpaare.
- Routenmatrix über alle produktiven Tools, Checklists, Knowledge und Legacy-Ansichten um 320px ergänzt.
- Neue Screenshots kritischer Formulare bei 320/1440px und der Routenmatrix bei 320/375/1440px.
- Bestehende Fachservices, Datenformate, Berechnungen, Persistenz und Exporte nicht verändert.

## Simuliertes Red-Team – keine externen Experten
- **Frontend:** Gemeinsamer, zuletzt importierter CSS-Grid/Subgrid-Layer; vorhandenes Go-Live-Raster bleibt bestehen. Alte Browser ohne Subgrid erhalten einspaltiges Fallback.
- **UX/Accessibility:** Discovery-Textarea und Prozesseingabe stehen nicht nebeneinander; Farb-Labels dürfen umbrechen. Bestehende Fokus-, Keyboard- und Reduced-Motion-Tests bleiben verbindlich.
- **QA:** Vorherige Testzustands-Leckage und Blindstelle bei ungeprüften Farb-Controls behoben. Explizite neue Grenzbreite 320px statt pauschal höherer Timeouts.


## Verifizierter CI-Abschluss (Run #42091268117)

Geprüfter Quellcode-Commit: `9553d103e32eaab22b33320d867cc0b1e41a3d98`. Danach hat der Workflow lediglich den geprüften Pages-Build in den PR-Branch übernommen (`53f07f1d9e82107bf6bc4a7e27e34c6088968aec`). `main` blieb unberührt.

| Gate | Ergebnis |
| --- | --- |
| `npm run format:check` | erfolgreich |
| `npm run lint` | erfolgreich, derzeit 511 bestehende Lint-Warnungen (0 Fehler); gesonderte technische Altlast |
| `npm run test` | 48 Testdateien, **356 Tests bestanden** |
| `npm run build` | erfolgreich |
| `npm run pages:check` | erfolgreich |
| `npm run test:e2e` | **293 bestanden, 1 begründet übersprungen, 0 fehlgeschlagen** (Desktop und Mobile Chromium) |

Die eine begründete Auslassung stammt aus `tests/e2e/reverse-timeline-export.spec.ts`: Der SVG-/PNG-Export wird im Desktop-Projekt geprüft und im mobilen Projekt übersprungen, weil das erzeugte Exportformat unabhängig von der Viewportgröße ist. Die mobile Go-Live-Ansicht selbst wird regulär getestet.

### Tatsächliche Browserbildsichtung

Aus dem CI-Artefakt `ui-qs-screenshots` (305 Bilder) wurden exemplarisch die Originalscreenshots für die Dokumentgestaltung (320/1440px), Metric Builder Messung (1440px), Wirkung und Hilfetexte (320px), Go-Live-Prozessschritte (320/1440px), Softwareprojekt-Payback (320px) und Value Bridge (1440px) betrachtet. Dabei keine offensichtlich abgeschnittenen Controls, auf- oder abwärts versetzten Einzeilenfelder oder unlesbaren Farbwahl-Beschriftungen festgestellt. Der automatisierte Browserlauf hat zusätzlich die DOM-Geometrie in allen Szenarien überprüft; eine vollständige manuelle Abnahme aller 305 Screenshots oder eine formale WCAG-Zertifizierung wird nicht behauptet.

### Simuliertes Red-Team: kritische Gegenprüfung

- **Frontend-Architektur:** Die wirksame Formulararchitektur ist zentral unter `src/styles/formRowAlignment.css` und wird zuletzt importiert. Kein zusätzliches Framework. Risiko: Die vorhandene globale CSS-Basis ist umfangreich; künftige Änderungen müssen die Geometrietests mitlaufen lassen.
- **UX/Accessibility:** Mobile 320px, lange Labels, Hilfetexte, getrennte Textarea-Zeilen und Farbauswahl wurden gezielt kontrolliert. Vorhandene Keyboard-, Fokus- und Reduced-Motion-Tests blieben grün. Dies ist keine vollständige Prüfung sämtlicher WCAG-Kriterien.
- **QA/Regression:** Die drei Fehlergruppen aus CI #42071876091 sind durch gezielte Teständerungen und reale DOM-Prüfungen adressiert. Alle 293 aktivierten Playwright-Tests sind grün. Ein bewusst viewport-unabhängiger Exporttest wird einmal statt doppelt ausgeführt.

### Abgrenzung der älteren Pull Requests

PR #87, #88, #89 und #90 enthalten konkurrierende Varianten der Formularausrichtung. Der finale konsolidierte Ansatz aus #92 wurde ohne blindes CSS-Cherry-Picking übernommen; historisch eigenständige Design-/Drag-Änderungen aus PR #84 werden **nicht** als durch #92 ersetzt erklärt. Die älteren PRs dürfen nur mit dokumentiertem Hinweis auf #92 geschlossen werden. Eine fachlich getrennte Weiterentwicklung aus #84 bleibt gesondert prüfbar.

### Noch ausstehend

**Ausdrückliche visuelle Freigabe durch den Repository-Eigentümer.** Vor dieser Freigabe kein Merge nach `main`; danach Merge und produktives GitHub-Pages-Deployment prüfen.
