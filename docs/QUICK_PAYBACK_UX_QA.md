# Quick Payback: GUI-Feinschliff und visuelle QS

Datum: 09.10.2026. Repository `thomasasen/meddpicc-workbench`, Draft-PR #53, Branch `feature/quick-payback-tool`. Diese QS bewertet die **tatsächliche Vue-Oberfläche und die echten Chromium-Läufe**, keine Renderings oder unbelegten Usability-Studien. `main` bleibt unberührt.

## Ziel und tatsächlicher Vorher-Nachher-Befund

| Vorher beobachtetes Problem | Umgesetzte Korrektur | Prüfkriterium |
| --- | --- | --- |
| Zwei Modus-Buttons ohne erkennbaren Unterschied | Zwei gleich hohe, beschriftete Auswahlflächen mit Kurzbeschreibung, aktivem Zustand und sichtbarem Tastaturfokus | Desktop/Mobile original, Browser-Klick und `aria-pressed` |
| Einstieg erklärt vor allem abstrakte Modellgrenzen | Konkrete Handlungsaufforderung: Investition oder Projektkosten eingeben; fachliche Grenzen weiter unten | Startansicht verständlich ohne separate Anleitung |
| Projektansicht wirkt wie ein langer Fragebogen | Drei klar nummerierte Blöcke: Kosten, Kunden-Metrics, Payback | Hierarchie und Leerzustand auf beiden Viewports |
| Lange Hilfetexte und selten verwendete Metric-Felder lenken ab | Kurze Feldtexte; „Zeitplan & Herkunft“ eingeklappt, sichtbar mit Startmonat und Herkunft | Tastatur-Enter öffnet Details; keine Pflicht zur Lektüre einer Anleitung |
| Ungleiche Feldhöhen, Labels und vertikale Kanten | Einheitlich mindestens 44 px für wesentliche Eingaben und feste Label-Baselines in mehrspaltigen Formularen | Playwright kontrolliert tatsächliche Bounding-Boxes bei 375/768/1280 px |
| Langer Kartentitel drückt „Entfernen“ auf eine neue Zeile | Mobile Kartenkopf mit klaren zwei Spalten, ggf. umbrechendem Titel | Mobile Ergebnisbild kontrolliert |
| Metric-Details wirken zentriert statt am Anfang der Zeile | Linksbündige Grid-Ausrichtung für Aufklapp-Pfeil, Titel und Herkunft | Desktop- und Mobile-Bild nach Korrektur kontrolliert |
| Tabellen-Caption wurde mobil abgeschnitten | Caption für Screenreader erhalten, visuell ausgeblendet; Scrollhinweis separat sichtbar | 393 px Chromium-Bild; Tabelle scrollbar ohne Seitenüberlauf |
| Ergebnis zu gleichförmig | Payback-Monat dominant, drei abgeleitete Werte darunter; Wirtschaftlichkeitsgrafik und Summary folgen | Fiktive Referenz 120k/3k SaaS/15k Monat ab M7 → **Projektmonat 18** |

**Keine neue Finanzmathematik:** Die ursprüngliche deterministische Engine, konservative Anrechnung, Doppelzählungssperre, Jahreskostenverteilung, Modellgrenzen und Quelle der Kunden-Metrics wurden nicht geändert.

## Prüfumfang

- Struktur: Moduswechsel, CTA-Position, kurze Texte, Feldgruppen, Ergebnis-Hierarchie und leere Ansicht.
- Responsivität: projektbezogener Layout- und Overflow-Check bei **375, 768, 1024, 1280, 1440 px** über die bestehenden und ergänzten Browser-Tests.
- Interaktion: Projektbeispiel einsetzen; Metric hinzufügen; Berechnungstyp ändern; nicht monetarisierte Zeit-/Risiko-Metrics; angerechnete vs. ausgeschlossene Metrics; Doppelzählungssperre; Wechsel zurück zur Schnellberechnung; Reset.
- Zugänglichkeit: Beschriftungen, native Eingaben, `aria-pressed`, Tastaturfokus, Enter für `details`, Screenreader-Tabelle und visuell getrennte Fehlermeldungen.
- Output: kopierte Kundenbotschaft über Browser-Clipboard; tatsächliche SVG-/PNG-Download-Ereignisse; inhaltlich übereinstimmender Break-even und kumulierter Saldo.
- Regression: gesamte bestehende MEDDPICC-Toolbox in derselben Chromium-Suite.

## Technische Belege

1. [CI #37903927341](https://github.com/thomasasen/meddpicc-workbench/actions/runs/37903927341): Nach erstem Layout-Umbau **erfolgreich**; Prettier, ESLint, 230 Unit-Tests, Build, Browser-Suite sowie Pages-Prüfung. Originalbilder wurden geöffnet und geprüft; dabei kamen zwei Card-Header/Accordion-Ausrichtungen und eine abgeschnittene Tabellen-Caption als konkrete Restpunkte heraus.
2. Diese drei Restpunkte und klarere Formlabels wurden korrigiert; Browser-Spezifikationen entsprechend angepasst.
3. [CI #37904430171](https://github.com/thomasasen/meddpicc-workbench/actions/runs/37904430171): **erfolgreich**, `npm ci --no-audit --no-fund`, `npm run format:check`, `npm run lint`, `npm test` mit **230/230 Tests in 30 Dateien**, `npm run build`, `npm run test:e2e` mit **93 bestandenen Tests, 1 übersprungen**, GitHub-Pages-Sync und `npm run pages:check` erfolgreich. Originale im Feature-Branch neu veröffentlicht und direkt geöffnet.
4. Der ausschließlich für diese Bearbeitung benötigte automatische Formatierungsschritt wurde anschließend wieder aus der CI entfernt. Die unveränderten strengen Gates bleiben bestehen. Der endgültige Follow-up-Check wird separat über GitHub Actions belegt.

### Tatsächliche visuelle Browserabnahme – finale Originale nach den Korrekturen

| Ansicht | Chromium-Original | Pixel | Tatsächlicher Sichtbefund |
| --- | --- | --- | --- |
| Projektmodus leer, Desktop | [PNG](review-screenshots/software-payback-empty-desktop-chromium.png) | **1280 × 1475** | Zwei Modi verständlich, drei Schritte, CTA vor dem Leereintrag, kein unnötiges Nulldiagramm |
| Projektmodus mit Beispiel, Desktop | [PNG](review-screenshots/software-payback-result-desktop-chromium.png) | **1280 × 3684** | Kostenfelder bündig, Metric-Felder/Status ausgerichtet, Detailzeile linksbündig, klare Ergebniskennzahl, vollständige Tabelle |
| Projektmodus leer, Mobile | [PNG](review-screenshots/software-payback-empty-mobile-chromium.png) | **393 × 2181** | Modusflächen und drei Eingabestufen einspaltig, Text lesbar, Bedienelemente ohne seitliches Clipping |
| Projektmodus mit Beispiel, Mobile | [PNG](review-screenshots/software-payback-result-mobile-chromium.png) | **393 × 5463** | Entfernen-Schaltfläche am Kartenkopf, Detailzeile links, Labels sauber untereinander, Monatswerte intern scrollbar, Copy/Export vollständig |
| Schnellmodus, Desktop/Mobile | [Originalbilder im selben Ordner](review-screenshots/) | Desktop/Mobile | Alten Quick-Flow erneut in Browser-Regression und visueller Prüfung kontrolliert; 8,0 Monate für dessen fiktives Beispiel |

Die Bilder stammen aus echten Playwright-Vollseitenaufnahmen, nicht aus separaten Mockups. Die mobile Projektansicht wird in CSS-Pixeln gesichert, damit sie trotz großer Länge zuverlässig geprüft werden kann.

## Verbleibende Grenzen

- Die Prüfung beweist technische/visuelle Konsistenz, **keinen empirischen Usability-Test mit unabhängigen Erstnutzern**. „Ohne Anleitung verständlich“ ist eine belastbar gestaltete Hypothese, noch kein statistischer Nutzernachweis.
- Eine lange Tabelle benötigt auf Mobile weiterhin bewusst horizontales Scrollen **innerhalb der Tabelle**, nicht der ganzen Seite.
- Der Quick-Modus und der Projektmodus verfolgen bewusst unterschiedliche Modellannahmen; ein Projekt-Cashflow mit Jahresvorauszahlungen wird weiterhin nicht berechnet.
- Keine echte Buchautoren-, CFO- oder Kundenseite-Freigabe wird behauptet. Keine automatische Übernahme in `main`.

**Status:** UI-Funktion und visuelle Abnahme auf dem Branch abgeschlossen; PR bleibt Draft bis zur ausdrücklichen Merge-Anweisung des Nutzers.
