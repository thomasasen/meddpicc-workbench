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

## Noch erforderliche Gates
CI muss `npm run format:check`, `npm run lint`, `npm run test`, `npm run build`, `npm run pages:check`, `npm run test:e2e` und die visuelle Screenshot-Prüfung erfolgreich bestehen. Diese Datei ist **kein** Ersatz für nachgewiesene Testergebnisse oder die vorgeschriebene ausdrückliche visuelle Freigabe. Nicht vor Nutzerfreigabe mergen.
