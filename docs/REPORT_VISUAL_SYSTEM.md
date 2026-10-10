# Visuelle Lesbarkeit – Microtools und Kundenreports

Stand: 10.10.2026 · Referenzimplementierung: T3 Value Bridge auf `feature/value-bridge`.

## Ausgangspunkt

Die bisherige Value Bridge zeigt alle Inhalte korrekt, aber in sehr ähnlichen grauen Textblöcken und teils langen Formular-/PDF-Strecken. Eine bessere Gestaltung ändert **die Informationsarchitektur**, nicht nur Farben und Icons.

## Verbindliches Muster für weitere Tools

1. **Orientierung:** Eine konkrete Nutzeraufgabe, maximal ein präziser Einleitungssatz. Hilfetexte bei den relevanten Feldern, nicht oberhalb des gesamten Formulars.
2. **Arbeitsschritte:** Drei bis fünf sinnvolle Schritte mit nachvollziehbarer Reihenfolge. Nicht jedem Feld ein eigenes Icon geben.
3. **Erzählung statt Rohdaten:** Ergebnisse als Problem → Konsequenz → gewünschtes Ergebnis → Messgröße → geschäftlicher Nutzen erzählen. Die Reihenfolge variiert mit dem Tool, die fachliche Kausalität nicht.
4. **Hierarchie:** Pro sichtbarem Bereich nur eine primäre Aussage. Kennzahlen mit Einheit, Zeitraum und Rechenstatus. Wenige wiedererkennbare, überwiegend neutrale Flächen.
5. **Evidenz klar erkennbar:** Hypothesen/Referenzwerte dürfen nicht durch repräsentative Visualisierung wie bestätigte Kundenergebnisse wirken; Status immer auch als Text.
6. **Progressive Disclosure:** Datenquellen, Rechenweg, Alternativannahmen und Finanzeinstellungen sind zugänglich, dominieren aber nicht die Erstansicht.
7. **Kundenreport:** Titelseite/erster Berichtsteil liefert eine kurze, überprüfbare Management-Story; danach Metrics mit Vorher-Nachher, Wirtschaftlichkeit und konkrete offene Prüfpunkte. Kein bloßer Formularausdruck.
8. **Export-Parität:** Derselbe Domain-Service liefert die sichtbaren Kennzahlen in UI und PDF. Die PDF-Seiten sind *echte* Browser-Exporte, gerendert und geprüft.
9. **Icon-Regel:** `docs/ICON_SYSTEM.md` ist die Quelle. In Vue werden `@lucide/vue`-Icons statisch importiert, nie per Runtime-CDN. PDF nutzt skalierbare Formelemente und Nummern, wo eine zuverlässige Icon-Einbettung nicht verfügbar ist. Kein Emoji als PDF-Icon-Ersatz.
10. **Barrierefreiheit:** Textlabels bleiben erhalten, Icons sind ergänzend. Gutes Reflow bei 375/768/1024/1440 px; Tastaturfokus und Reduced Motion bleiben erhalten.

## Erste Implementierung

- **Value Bridge GUI:** Icon-beschriftete Prozessschritte (`CircleAlert`, `Target`, `ChartColumnIncreasing`), visuelle Ursache-Wirkungs-Kette, klarer separater Business-Value-Block und strukturierte Metric-Nachweise.
- **Kunden-PDF:** Weißraum, farblich sparsame Abschnitte, Problem-Folge-Änderung, Vorher-/Nachher-Metric-Card, vier Wirtschaftlichkeitskennzahlen, offene Annahmen und Paginationsschutz.
- **Tool-Startseite:** Bestehende Lucide-Icons der aktiven Microtools zeigen die Art des Werkzeugs bereits in der Übersicht. Geplante Tools bleiben optisch zurückhaltend.

## Scope, keine vorgetäuschte Komplettumstellung

Diese Umsetzung ist eine **Referenz** für die übrigen Microtools. Sie überarbeitet **nicht** alle vorhandenen Rechner, Checklists und PDF-Generatoren in einem Schritt. Die gemeinsamen Regeln können nach visueller Nutzerfreigabe konsistent auf Quick Payback, Cost of Delay, Metric Builder und Go-Live-Report ausgerollt werden. Andernfalls drohen inkonsistente Report-Generationen.

## Geplante Sichtprüfung

- Eigene Desktop-/Mobile-Originalscreenshots beider Beispielarten und die neuen PDF-Originalseiten tatsächlich öffnen
- Kein horizontaler Overflow, keine abgeschnittenen Labels und keine unnötige optische Überhöhung unbestätigter Werte
- Kosten/Nutzen/Saldo/Payback fachlich mit ursprünglicher Version abgleichen
- Lange deutsche Eingaben über Seitenumbrüche kontrollieren
- Erst nach technischer und visueller QA explizite Nutzerfreigabe einholen; `main` bleibt unverändert

## Weiterentwicklung: gemeinsamer PDF-Chrome

In `src/report/reportChrome.ts` existiert jetzt ein gemeinsamer, layout-sicher gemessener Footer. Alle **fünf** aktuellen `pdf-lib`-Reportmodule verwenden diese Funktion. Der verbleibende Fachinhalt samt wirtschaftlicher Berechnung wird nicht verändert.

- Der Footer zieht eine konsistente Trennlinie, kennzeichnet den Modell-/Prüfstatus als Text und berechnet Seitenzahlen inklusive Gesamtumfang.
- Die Textbreite wird anhand der eingebetteten Schrift gemessen; zu lange Fußzeilen werden unter Erhalt der Seitenzahl abgekürzt.
- Die jeweiligen reservierten Footerflächen (finance: 38/24pt, customer: 46/30pt, übrige: 53/34–36pt) bleiben zunächst bewusst erhalten, damit bestehender Content nicht überdeckt wird.
- Noch offen: gemeinsames Layout für Header, dynamische Flow-Sections, KPI-Karten, Textumbruch und Unicode-Fonts. `StandardFonts.Helvetica` deckt weiterhin nicht den gesamten Unicode-Zeichensatz ab; Ersatzzeichen sind keine vollständige Lösung.
- Vor visueller Freigabe müssen **Original-PDFs** aus sämtlichen Exportern gerendert, jede Seite betrachtet und lange deutsche Begriffe, viele Metrics, negative/qualitative/fehlende Werte kontrolliert werden.

Diese Implementierung ist eine technische Grundlage, **kein Beleg für eine vollständig modernisierte Reportgestaltung**. Inventar und offene Abnahmekriterien: `docs/REDESIGN_AUDIT_2026-10-10.md`.

### Gemeinsame Masthead-/Footer-Komponenten

Auch die Kopfzeile wird nun in allen fünf PDF-Generatoren über `drawReportMasthead` in `src/report/reportChrome.ts` gezeichnet. Sie verwendet vollständig lokal gerenderte Vektorformen, eine einheitliche MEDDPICC-Toolbox-Kennung, Dokumenttitel und Reportkontext. Die ursprünglichen Headerhöhen und Textanfänge bleiben bewusst erhalten, um bestehende Datenbereiche nicht zu verdrängen.

Die Redesign-CI rendert **sämtliche Originalseiten** der fünf unterschiedlichen Exportvarianten als PNG (nicht nur Seite 1). Diese Originalbilder und ausgewählte Desktop-/Mobile-Screenshots sollen als `docs/review-screenshots/redesign/` zur fachlichen Sichtabnahme veröffentlicht werden. Ein erfolgreicher Renderjob ist noch keine manuelle Sichtfreigabe.

## Erweiterung 11.10.2026: Textfluss und vollständige Langangaben (Draft)

- Die fünf Reportgeneratoren verwenden den gemeinsamen, an der eingebetteten Schrift gemessenen Textumbruch in `src/report/reportText.ts`. Lange Einzelwörter und Absatzgrenzen werden berücksichtigt.
- Das bisher starre vierseitige Kunden-PDF erhält bei langen Firmen-/Projekt-/Freitextangaben und umfangreichen Nutzenpositionen zusätzliche Anhangseiten. Die vier Managementseiten bleiben für normale Daten erhalten.
- Quick Payback kennzeichnet die nicht extern geprüften Eingaben sichtbar. Ergänzende Designregeln führen Reflow, Texte und Zahlen über unterschiedliche Tools zusammen.
- Das ist eine **Teilumsetzung**. Unicode-Font-Einbettung, vollständige dynamische PDF-Body-Pagination, die visuelle Prüfung aller Originalseiten und das Redesign aller produktiven Oberflächen bleiben offen.

