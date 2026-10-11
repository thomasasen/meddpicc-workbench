# Corporate Identity: Architektur-, Security- und QA-Nachweise

Stand: 11. Oktober 2026. Ausgangsbranch main, SHA 76a32fa76377db30249337e5425f39bec2916aec.

## Ausgangslage und erster Red-Team-Durchlauf

Inventar: customerBusinessCasePdf.ts (kundenfähig, 77pt Kopf), softwareBusinessCasePdf.ts (interner Finance-Anhang, 89pt), metricBuilderPdf.ts (kundenfähig, 92pt), costOfDelayPdf.ts (kundenfähig, 88pt), valueBridgePdf.ts (kundenfähig, 99pt). Alle nutzen pdf-lib und reportChrome.ts für den Masthead/Footer. Original-Header enthielt M-Symbol und MEDDPICC TOOLBOX; zwei Business-Case-Ausgaben setzten zusätzlich MEDDPICC-Creator-Metadaten. Die Wirtschaftlichkeitsberechnungen sind bereits Domain-Services. Gefahr: Ein größerer dynamischer Header könnte bestehende manuelle Seitenumbrüche überschreiben, daher begrenzter Markenbereich im vorhandenen Header.

Kritische Vorabbefunde: (hoch) Tool-Metadaten und Logo-Wortmarke; (hoch) beliebige Dateiimporte inklusive SVG/aktiver Inhalte; (hoch) Speicherverlust und gleichzeitig aktive Tabs; (hoch) Vermischung kundenfähiger und interner Aussagen; (mittel) Kontrastprobleme und lange Firmennamen; (hoch) manipulierte Modell-Evidenz. Umsetzung: zentrale ReportAudience-Vorgabe, PNG/JPEG-Signaturen und Browserdekodierung, Canvas-Normalisierung, transaktionaler Store, einheitliches Header-Rendering und Bewahrung aller Domain- und Evidenzregeln.

## Designvertrag und Datenfluss

- BrandProfile (version=1): Nur Firmenidentität, Farben, optional Website/Kontakt/Verfasser/Footer, Logo als Base64-PNG/JPEG mit festen Abmessungen. Kein Kunden- oder Projektzustand.
- ReportData: ausschließlich vorhandene fachliche Tool-Inputs. Formeln und Modellgrenzen unverändert.
- ReportAudience: customer für Kunden-Business-Case, Metric Builder, Cost of Delay, Value Bridge; internal für Software-Finance-Anhang. Im Generator unveränderlich festgelegt.
- Exportbeginn: Vue lädt den aktuell gespeicherten IndexedDB-Datensatz; der Report validiert einen eigenen Snapshot und bettet Logos einmal ein. PDF-Generatoren haben selbst keinerlei Browser-Storage- oder Netzwerkabhängigkeit.
- Speicherung: ein Record im IndexedDB-Store; Revisionsprüfung und Put in einer readwrite-Transaktion. Import vollständig vor der Speicherung prüfen. Browser-Neustarts behalten Werte, solange der Browser Datenspeicher nicht entfernt.
- Keine Cloud, kein neues CDN und keine neue Telemetrie. Generierte PDF-Blob-URLs werden nach Gebrauch freigegeben.

## Abnahmematrix

Profile A neutral ohne Logo, B dunkel mit breitem transparentem PNG, C hell mit hohem JPEG. Jeder der fünf Generatoren wird mit allen drei Profilen als echtes A4-PDF generiert. Vitest-Tests prüfen Dateisignatur, Seitenmaße, PDF-Metadaten. Die CI läuft über 15 Datei-Originale, PDFInfo-, Text- und vollständiges PNG-Seitenrendering; Artefaktname ci-white-label-review. Kundenberichte und Finance-Anhang werden unterschieden.

UI-Tests: Speichern/Reload, Import/Export, Reset, ungültiger Import und vier Viewportbreiten (375, 768, 1024, 1440). Weitere ausdrücklich nachzuprüfende Fälle: QuotaExceededError, tatsächlich parallele Tabs, Keyboard/Fokus/Screeenreader, Preview-Parität, schwarzweißer Ausdruck, anspruchsvolle Langtext-Pagination und vollständig sichtbare Originalseiten. Kein Status gilt ohne tatsächlichen Prüflauf als bestanden.

Fachliche Regressionen: bestehende Business-Case-, Metrics-, Cost-of-Delay-, Value-Bridge- und Szenario-Unit-Tests sind verpflichtend. Der CI-Snapshot ist ausschließlich ein Renderparameter, nicht Bestandteil der Domainfunktionen. Optische Aufwertung darf unbestätigte Annahmen nicht zu geprüften Kundenzahlen machen.

## Zweiter Red-Team-Durchlauf: Review-Kontrollfragen

1. HTML/SVG/JS/CSS: Strikt zugelassene Datenfelder, Farbhex und URL-Scheme, keine HTML-Interpretation; kein SVG-Import.
2. Logo/CPU: Datei bis 2 MB, 4096 Pixel je Seite und 12 Mio. Pixel; lokale Bitmap-Dekodierung, keine Fremdanfragen.
3. Import-Datenverlust: Validierung vor Speicherung, Transaktionsfehler werden angezeigt.
4. Exfiltration: Keine neuen Endpunkte, aber übergreifende Netzwerkanalyse aller bestehenden Anwendungspfade ist #66.
5. Audience: Fest kodierte Kunden- und Finance-Generatoren, interne Finance-Markierung.
6. Kontrast: Primärfarben mit kontrastabhängiger Schrift; semantische Risikofarben unberührt.
7. Metadaten: Leerer Creator, optionaler expliziter Verfasser; pdf-lib als technischer Producer ist keine Toolbox-Werbung.
8. Gleichzeitige Tabs: Readwrite-Vergleich schützt gegen stillen Lost Update; laufender PDF-Export verarbeitet einen feststehenden Snapshot.
9. Temporäre Profile: Unsaved-Markierung, Speicherungserfolg nur nach IndexedDB-Transaktionsabschluss.
10. Projektformate: Unverändert, keine CI-Daten in .meddpicc- oder Handoff-Datensätzen.

## Grenzen und Folgepunkte

P0: Allgemeiner Datenverlustschutz #65 und Netzwerkaudit/Dependency-Audit #66 getrennt bearbeiten. P1: Eingebettete Unicode-Fonts inklusive Lizenz-/PDF-Regressionsprüfung. P1: Visuelle Sichtprüfung jeder gerenderten Seite und aller Logo-Grenzfälle vor Merge-Empfehlung. P2: CI-Branding für SVG/PNG-Rückwärtsplanung als separater Scope. Fehlende echte QA-Ergebnisse dürfen nicht aus dieser Planung abgeleitet werden.

**Merge-Sperre:** Kein Merge ohne ausdrückliche Freigabe des Nutzers für diesen konkreten PR.
