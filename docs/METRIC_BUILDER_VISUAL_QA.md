# Wahrnehmungsorientierte Layout-QS – Metric Builder

Stand: 10.10.2026. Gegenstand: ausschließlich Metric Builder (Schritte 1–3, Metric Card, Kunden-PDF). Andere Tools und ihre Berechnungslogik bleiben unverändert.

## Ausgangsbefund anhand echter Screenshots und PDF

Geprüft wurden die im Feature-PR erzeugten Desktop- und Mobil-Screenshots sowie die tatsächlich gerenderte einseitige CRM-Beispiel-PDF.

- Labels, Eingaben und Hilfetexte hatten nicht überall explizit definierte Zwischenräume; besonders bei mehrspaltigen Eingabegruppen änderte sich die visuelle Höhe ungleichmäßig.
- Auf Mobilgeräten sorgten die großen KPI-Karten und langen, benachbarten Hilfetexte für unnötige vertikale Streckung. Das Ziel ist nicht maximale Kompaktheit, sondern sichtbare inhaltliche Gruppen und vollständige Lesbarkeit.
- In der Original-PDF waren der Vorher/Nachher-Text und die Wirtschaftsbox zu nahe an der farbigen Fläche und teilweise unmittelbar am nächsten Text. Die Labels und Werte folgten nicht durchgehend denselben vertikalen Achsen.
- Unterschiedliche Freiräume vor Unterüberschriften, Ergebnistabellen und Aktionen erschwerten das schnelle Erfassen der Zusammenhänge.

## Verwendete Gestalt- und Lesbarkeitsprinzipien

Diese Prinzipien sind allgemeine Erkenntnisse bzw. UX-Heuristiken, **keine empirische Evaluation der konkreten Anwendung**.

| Prinzip | Umsetzung | Kontrollpunkt |
| --- | --- | --- |
| **Nähe (Proximity)** | Label, Feld und Hilfe bilden eine Einheit mit kleinem Abstand. Zwischen unterschiedlichen Eingabegruppen ist der Abstand größer. | Label-Feld-Abstand in jedem Schritt programmgesteuert prüfen |
| **Ähnlichkeit (Similarity)** | Gleiche Felder, Überschriften und Ergebnisgrößen teilen eine Typografie und dieselben Ränder. | Durchgängige Konsistenz in Desktop/Mobil-Screenshots |
| **Gemeinsamer Bereich (Common Region)** | Ein Schritt steht in einer klar abgegrenzten Fläche; Vergleichswerte teilen ein visuelles Muster. | Feldinhalte und KPI-Karten bleiben vollständig im Panel |
| **Visuelle Hierarchie** | Hauptüberschrift > Abschnittsüberschrift > Feldlabel > Hilfetext. Beträge haben klaren Gewichtsunterschied, ohne andere Texte zu verdrängen. | Textgewicht und Zeilenhöhen visuell prüfen |
| **Kontinuität und Leserichtung** | Linksbündige Zeilen sowie einheitliche Achsen für Label/Wert im PDF. | Kein Springen der Textanfänge und keine abgeschnittenen Label |
| **Kognitive Entlastung** | Vorhandene drei Arbeitsschritte bleiben. Nur zum gewählten Typ passende Felder werden eingeblendet, Texte sind sprachlich unverändert. | Nicht alle Optionen und Detailfragen gleichzeitig zeigen |
| **Reflow / Textabstände** | Mehrspaltige Felder werden bei schmalen Viewports untereinander dargestellt; umbrochene Werte und Texte bleiben lesbar. | 375/768/1024/1440 px und Zoom/Textabstände separat prüfen |

## Umsetzung

- Einheitlicher 8/16/24-px-Rhythmus im Metric Builder mit größerem Abstand zwischen Abschnitten als zwischen Label und Feld.
- Feldgruppen sind als Flex-Spalten organisiert; eindeutige Reihenfolge Label → Control → erklärender Text. Controls normalgewichtig und mindestens 46 px hoch; Hilfetexte ohne überflüssige Margins.
- Desktop-KPI-Karten erhalten ein einheitliches Inhaltsmuster; Mobile nutzt kompaktere, weiterhin vollständige Blöcke.
- Vorher/Nachher-Werte werden in symmetrischen Karten ausgerichtet, Resultatdefinition und Betrag auf Desktop in festen Spalten, auf Mobil untereinander.
- Aktionen sind klar zusammengefasst; auf Mobil volle Buttonbreite und linksbündige Texte ohne Abschneiden.
- Das PDF verwendet feste linke Achsen für Labels und Werte, dynamisch berechnete Textblockhöhen, explizite Innenabstände von farbigen Bereichen und einen stabilen Druckrand mit eigener Fußzeile. Der kurze CRM-Beleg soll auf einer A4-Seite bleiben.
- Keine Änderung der Formel-, Evidenz-, Payback- oder Übergabelogik.

## Prüfungen

Automatisiert: Prettier, ESLint, Vitest, Build, Pages, Playwright Desktop/Mobil, vier Viewport-Breiten in **allen drei Schritten**, Prüfung der relativen Positionen zwischen Label und Control, vier neue Screenshots der Schritte 1 und 2, vorhandene Screenshots von Schritt 3, tatsächlicher PDF-Export als einseitiges Original sowie pdftoppm-Rendering.

Visuell: Screenshots müssen tatsächlich geöffnet und kontrolliert werden. Der Code kann Überschneidungen oder Layoutbrüche prüfen; er kann keine subjektive visuelle Abnahme ersetzen. Nach erfolgreicher CI die Originalbilder und PDF-Seite sichten, Nachbesserungen dokumentieren und **nicht ohne Nutzerfreigabe mergen**.

## Literatur / externe UX-Referenzen

- Nielsen Norman Group: [Proximity Principle in Visual Design](https://www.nngroup.com/articles/gestalt-proximity/), 2020.
- Nielsen Norman Group: [Similarity Principle in Visual Design](https://www.nngroup.com/articles/gestalt-similarity/), 2020.
- Nielsen Norman Group: [Visual Hierarchy in UX](https://www.nngroup.com/articles/visual-hierarchy-ux-definition/), 2020.
- Nielsen Norman Group: [5 Principles of Visual Design in UX](https://www.nngroup.com/articles/principles-visual-design/), zuletzt geprüft 2026.
- W3C/WAI: [WCAG 2.2, Understanding Text Spacing, SC 1.4.12](https://www.w3.org/WAI/WCAG22/Understanding/text-spacing).

**Grenze:** Gestaltprinzipien unterstützen sinnvolle Gruppierung, aber eine feste Pixelzahl ist kein psychologisch nachgewiesenes Optimum. Die Werte sind konsistente Designentscheidungen und müssen gegen tatsächliche Screenshots sowie Reflow geprüft werden.
