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
