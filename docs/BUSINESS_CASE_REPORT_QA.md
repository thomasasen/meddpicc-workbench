# Business-Case-PDF und Chart · Quellen und simuliertes Red Team
Stand: 09.10.2026 · Feature-Branch, keine reale Autorenfreigabe.

## Primärquellen – direkt eingesehene Buchstellen
- **Darius Lahoutifard**, *Always Be Qualifying MEDDIC & MEDDPICC Sales*, Chapter Nine, „ROI vs. Payback Period“: Er bevorzugt eine in Monaten ausdrückbare Payback Period in der Sales-Konversation; **ROI** als Prozentkennzahl ist finanzspezifischer und darf nicht unter dem Namen Payback ausgegeben werden.
- **Lahoutifard**, Chapter Nine, „The Process to Pitch the Payback Period“: Die wirtschaftliche Argumentation soll von nachvollziehbaren Metrics über den monetären Nutzen und die tatsächlichen Lösungskosten hin zum Payback führen und dabei einfach verständlich bleiben.
- **Andy Whyte**, *MEDDICC*, Kapitel „Metrics 1 (M1's) – Metrics Proof Points“, „Metrics 2 (M2's) – Return on Investment“, „Economic Buyer“ und „Economic Decision Criteria“: Kundenreferenzwerte und kundenspezifische ökonomische Evidenz sind methodisch zu unterscheiden; die Zahlungs- und Wertargumentation richtet sich nach Kundenzielen und Entscheidungskriterien.
- **Eigene finanzmathematische Produktentscheidung, NICHT aus den Büchern zitiert**: Undiskontierter Modell-ROI im Betrachtungszeitraum = (kumulierte monetarisierte Vorteile einschließlich entfallender Altsystemkosten minus alle neuen angesetzten Projekt-/Softwarekosten) / alle neuen angesetzten Projekt-/Softwarekosten × 100. Bei null neuen Kosten nicht definiert. Keine Verwechslung mit IRR, NPV, Brutto-ROI oder tatsächlichem Finanzcashflow.

## Simuliertes Red Team, Runde 1
| Perspektive | Kritischer Angriff | Umsetzung |
| --- | --- | --- |
| Whyte (simuliert) | Ein PDF macht aus einem Verkäufer-M1 scheinbar vom Kunden freigegebene M2. | Jede Metric wird mit Original-Evidenz und offenem Nachweis abgebildet. Keine automatische Autoren-/Kundenvalidierung. |
| Lahoutifard (simuliert) | Prozent-ROI überfrachtet den Payback-Pitch. | Dominante Monats-KPI und eine separat definierte, eindeutig benannte ROI-Formel. |
| CFO | Kostenbasis für ROI kann nur einmalige Kosten oder alle Kosten bedeuten. | Explizite Angabe, dass sämtliche neuen Kosten über 36/60 Monate Nenner sind. |
| Controller | Ein Altsoftware-Wegfall könnte doppelt auftreten. | Bestehender Double-Counting-Blocker bleibt vor PDF-Export aktiv. |
| Projektleiter | Nutzen-Ramp-up und gestaffelte Investition verschwinden auf Managementfolie. | Chart mit Investitionstief und Break-even; pro Metric Start/Hochlauf sowie vollständige Monatsspur. |
| Economic Buyer / Kunde | Attraktiver Chart suggeriert Garantien. | Finanzielle Hypothesen, Validierungshinweise, eigene Methodik-/Grenzenseite. |
| GUI-Designer | Nackte SVG-Linie erklärt ohne Achsenwerte den Verlauf nicht. | Visuelle Flächen, Nullachse, Marker und interpretierbare Ergebnisleiste; tatsächlicher SVG-/PNG-Export aus demselben Element. |
| Executive-Report-Designer (simulierte McKinsey/BCG/Roland-Berger-Qualitätskriterien) | Ein PDF aus Formularfeldern wirkt nicht präsentationsreif. | Feste A4-Abschnitte mit dunklem Kopfbereich, Nutzen-KPIs, Verlauf, Kosten, Metrics, Transparenz und nachvollziehbarer Prüfspur. Keine Behauptung, die Beratungen seien beteiligt. |

## Simuliertes Red Team, Runde 2 – Sicherheitsgate
- Kein Versand von vertraulichen Daten: PDF wird rein lokal im Browser erzeugt, ohne CDN, Backend, Serverlogs oder Upload.
- Kein positiver ROI bei negativen Modellzahlen. Bei null Kosten als „nicht definiert“ kennzeichnen.
- Nicht angerechnete Kapazität und Risiko verbleiben im Appendix **nicht** als cash-relevante Metrics.
- Der Export ist ein echtes PDF 1.4, keine bloße HTML-Datei mit .pdf-Endung.
- Schriftart ist PDF-Standard Helvetica / Helvetica Bold, mit WinAnsi-Encoding. Keine fremden Schriftdateien.
- Datenstand wird unmittelbar beim Export aus den sichtbaren Kosten, Metrics und der Financial Engine erstellt.
- Details/Begrenzung: vereinfachtes A4-Reportlayout, keine Kapitalwert-/Steuerrechnung, keine reale Kunden-/Autoren-Freigabe.
- Ergebnis: **Bedingte modellierte Freigabe** für interne Software-QS, **keine echte Zustimmung** von Whyte, Lahoutifard oder Unternehmensberatungen.

## Technische QS
Unit-Tests müssen ein lesbares PDF-Signatur- und Seitenobjekt, Grenzen des ROI-Nenners, CRM-M35-Demo und Nullkostenfälle abdecken. Browser-Tests prüfen echten PDF-Download und responsive SVG-Grafik. Der aktuelle CI-Status darf erst nach durchgeführter Pipeline als bestanden bezeichnet werden.

## Freigabe
PR zunächst DRAFT, kein Merge ohne weitere explizite Anweisung.

## Tatsächliche technische und visuelle Abnahme (09.10.2026)

- [CI #37923870625](https://github.com/thomasasen/meddpicc-workbench/actions/runs/37923870625): **ERFOLGREICH**. 239 Unit-Tests in 32 Dateien, 99 Playwright-Tests bestanden, 1 übersprungen, Prettier, ESLint, TypeScript/Vite, Pages-Integrität und Chromium-Abnahme der Browser-UI erfolgreich. Der PDF-Download wurde im Browser durch Signatur `%PDF-1.4`, Größe und erwarteten Dateinamen verifiziert.
- Zwei echte Chromium-Vollseitenbilder der aktualisierten CRM-Demo direkt geöffnet und betrachtet: [Desktop](review-screenshots/software-payback-crm-demo-desktop-chromium.png) und [Mobile](review-screenshots/software-payback-crm-demo-mobile-chromium.png). Die Darstellung zeigt den neuen Chart mit dezentem Negativbereich, Investitionstief M7, Break-even M35 und 42.583,33 EUR Saldo. Desktop-Layout und die einspaltige mobile Berichtseingabe haben keine offensichtlichen horizontalen Seitenüberläufe.
- Die realen Modellwerte: 480.000 EUR initiale Projektkosten, 8.000 EUR neue Monatskosten, 3.000 EUR entfallende Bestandskosten ab M10 und drei angesetzte Metrics. Die bisherigen ausgeschlossenen Risiko- und Kapazitätskennzahlen bleiben ausgeschlossen. Bei einem 36-Monats-Nettosaldo von 42.583,33 EUR und neuen kumulierten Kosten von 768.000 EUR beträgt der definierte Modell-ROI rund 5,5 %.
- [Zusätzliche PDF-Datei-Abnahme #37924483656](https://github.com/thomasasen/meddpicc-workbench/actions/runs/37924483656): gestartet, bis zur Dokumentation jedoch in der Chromium-Installationsphase nicht abgeschlossen. Ein direktes visuelles Rendern der erzeugten PDF-Seiten ist deshalb **noch nicht nachgewiesen**, obwohl PDF-Signatur/Download in einem früheren Browserlauf bestanden sind. Keine visuelle PDF-Freigabe behaupten, solange dieser Nachweis fehlt.

**Freigabegate:** Modellierte Autoren-Rollen und technische Tests sind keine persönlichen Freigaben. PR bleibt bis zur Nutzerabnahme offen und wird nicht automatisch nach `main` gemergt.
