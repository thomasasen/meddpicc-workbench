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

## Abnahme der optionalen Gestaltungswerte

Die Akzentfarbe wird als 2,4-Punkt-Zierlinie am unteren Rand jedes gebrandeten Mastheads eingesetzt. Sie färbt keine wirtschaftlichen Statusinformationen. Eine optionale Textfarbe wird im PDF-Footer nur verwendet, wenn sie auf weißem Hintergrund mindestens ein Kontrastverhältnis von 4,5:1 erreicht; andernfalls bleibt die bestehende gut lesbare Schriftfarbe. Die optionale Kontaktinformation ergänzt Website und freien Footer-Text; Überlänge wird mittels der gemessenen Schriftbreite gekürzt. Die Regel gilt für alle fünf Reporttypen.

## Fehlende oder beschädigte IndexedDB im Export

Die konfigurierende Ansicht behält bei Schreib-/Lesefehlern einen ausdrücklich sichtbaren Fehler und markiert das Profil nicht als gespeichert. PDF-Exportwege sind davon entkoppelt: `loadBrandForReport()` liefert bei fehlender oder ungültiger CI-Konfiguration das neutrale Profil und einen sichtbaren Warnhinweis im jeweiligen Tool. So bleibt die fachliche PDF-Funktion auch in Browsern mit blockiertem IndexedDB verfügbar, ohne fälschlich Firmenbranding vorzutäuschen. Die ausführliche allgemeine Recovery-Strategie bleibt #65.

## Zusätzliche Langtext-Matrix

Der gesonderte Stresslauf erzeugt vier echte PDF-Originale mit und ohne Firmenprofil: Kundenbericht und Cost-of-Delay-Bericht mit sehr langen deutschsprachigen Problem-, Ziel- und Herkunftstexten. Die Unit-Tests prüfen die profilunabhängige Seitenanzahl. CI rendert sämtliche zusätzlichen Seiten als PNG, erzeugt pdftotext/pdinfo-Artefakte und blockiert bei unvollständiger Ausgabe. Diese vier PDFs sind im selben Review-Artefakt `ci-white-label-review` enthalten.

## Abschluss-Erweiterung: Timeline-SVG/PNG und Unicode-Typografie (11.10.2026)

Branch `feature/document-accessibility-and-timeline-ci-20261011` baut auf dem noch ungemergten Corporate-Identity-PR #79 auf. Corporate Identity wird beim SVG- und PNG-Export der Rückwärtsplanung einmalig aus dem gespeicherten IndexedDB-Datensatz geladen und als validierter Snapshot verwendet. Bei defektem Speicher wird ein neutrales Dokument mit sichtbarer Warnung erzeugt. Logo ist ausschließlich eine Base64-Daten-URI aus lokal normalisiertem PNG/JPEG; fremde Bild-URLs, SVG-Skripte und weitere Datenfelder werden nicht interpoliert. Kundendaten werden weiterhin XML-escaped. Statusfarben der drei Timeline-Bereiche und des Go-Live bleiben unverändert. Ein XML-`<title>` und `<desc>` beschreiben Start, Go-Live und Schritte für Assistive Technology; vorhandene HTML-Detailansicht bleibt zugänglich.

Für PDF-Ausgaben verwenden die fünf bestehenden Generatoren im **Browser** lokal gebündelte Noto-Sans-Latin-Regular-/Bold-Fonts über pdf-lib/fontkit. Vite liefert die Assets vom eigenen Origin; kein CDN, keine Fonts-Uploads. Die Schriftschnitte sind OFL 1.1 lizenziert; @pdf-lib/fontkit ist MIT-lizenziert. WinAnsi-Normalisierung bleibt in reinem Node/Vitest-Testlauf als deterministischer Alt-Fallback; die tatsächliche PDF-Schrift und Extraktion müssen deshalb zwingend im Playwright-Produktionsbrowser samt `pdftotext` getestet werden. Emojis und nicht-lateinische Schriften bleiben explizit außerhalb des unterstützten Profilschemas. Eingeschränkte Textunterstützung für das lateinische Unicode-Spektrum ist keine umfassende Unicode-Abdeckung aller Schriftsysteme.

QA-Grenzen: Automatisierte Accessibility-Prüfungen mit Keyboard, Rolle, Title/Description, sichtbaren Fehlermeldungen und Responsive-Viewports sind **keine** echte NVDA-, JAWS- oder VoiceOver-Prüfung. Solche manuellen Screenreader-Durchläufe und ein Test mit freigegebenen realen Kundenlogos benötigen menschliche Prüfer; es werden bewusst keine fremden Markenzeichen zu Testzwecken als eigene Firmenidentität ausgegeben. Vorgeschlagene manuelle Abnahme: NVDA/Firefox, VoiceOver/Safari, 200%-Zoom, Hochkontrast und PDF-Druck in Graustufen, jeweils mit Logos mit transparentem Rand, breitem und hohem Format sowie nicht-lateinischen Zeichen als Negativtests.

## Nachtrag: geprüfte Glyph-Abdeckung

Die aus dem Produktionsbuild extrahierten Noto-Sans-Latin-WOFF-400/700-Dateien wurden über die tatsächliche Font-cmap überprüft: enthalten sind ÄÖÜäöü, ß, Eurozeichen, Gedankenstriche und typografische Anführungszeichen, **nicht** aber Č, Ł, kyrillische und CJK-Zeichen. Das Firmenprofil verweigert nicht enthaltene Glyphen mit einer klaren Fehlermeldung; Reporttexte normalisieren nicht vorhandene Zeichen zu `?`. Die gewünschte vollständige Mehrschriften-Unterstützung bedarf eines separaten Font-Fallbacks und eigener Sicherheits-/Layoutabnahme.
