# Kundenbericht und Finance-Anhang: Design- und Fachabnahme

Stand: 09.10.2026. **Noch kein Merge auf main.**

## Zielbild
- Zwei **clientseitige** Exporte aus denselben Eingaben und derselben bestehenden Payback-Monatsengine, ohne Backend oder externe Datenübertragung.
- **Kundenbericht**: drei A4-Seiten mit klarer Managementbotschaft, Amortisationsmonat, vollständigen neuen Kosten, modelliertem Nettowert, Wertverlauf, Kosten-Nutzen-Brücke, maximal drei wesentlichen finanziellen Kunden-Metrics sowie konkreten Validierungs- und Entscheidungsfragen. Keine 37/61-Zeilen-Monatstabelle im Kurzbericht.
- **Finance-Anhang**: bisherige vollständige Berechnung mit allen Kosten, Metrics, Herkunft, Hochlauf, ROI und vollständiger Monatsprüfspur. EUR-Werte werden in den Rechentabellen rechtsbündig gesetzt.
- Für einen Kundenexport sind Kunde, Projekt und Verfasser Pflicht. Fehlende Kundenbestätigung wird nicht durch ein positives ROI-Design kompensiert.
- PDF-Reports tragen auf jeder Seite einen eindeutigen Modell-/Freigabehinweis.

## Fachliche Grundlage
- **Andy Whyte, MEDDICC**, Kapitel „Metrics 1 (M1's) – Metrics Proof Points“, „Metrics 2 (M2's) – Return on Investment“ sowie Economic Buyer: M1-Kundenresultat, kundenspezifische M2-Wirtschaftlichkeit, wirtschaftliche Entscheidungskriterien und deren jeweiliger Evidenzstatus bleiben getrennt. Deshalb sichtbarer Status je Metric und offene Fragen an Champion, Finance und Economic Buyer.
- **Darius Lahoutifard, Always Be Qualifying**, Kapitel „ROI vs. Payback Period“ und „The Process to Pitch the Payback Period“: Amortisationszeit in Monaten als zuerst verständliche Kundenbotschaft; gesonderte, explizit definierte ROI-Kennzahl und vollständige Kostenbasis im Anhang.
- **Professionelles Editorial-/Information-Design als simulierte Review-Perspektive**: visuelle Hierarchie, aussagebezogene Diagrammüberschrift, rechtsbündige Finanzwerte, konsistente Spalten, bewusste Seitenökonomie und getrennte Zielgruppen.
- **Keine persönliche Beteiligung oder Zustimmung** der genannten Buchautoren bzw. eines externen Grafikdesigners. Die oben genannten Prinzipien sind eine interpretierende Anwendung der Quellen.

## Prüfmatrix und Freigabegate
1. Einfache (36 Monate, Break-even Monat 18) und CRM-/SaaS-Demo (36 Monate, Break-even Monat 35), negatives Projekt, null neue Kosten, 60 Monate.
2. Kundenbericht exakt drei A4-Seiten, sowohl bei kurzer als auch bei langer Ausgangslage und vielen zusätzlichen nicht monetarisierten Metrics. Der Finance-Bericht enthält Monatswerte und Eingabeherkünfte.
3. E2E: Tatsächlicher Download beider PDF-Typen, Signatur, A4-Seitengröße, Kundendaten-Pflichtfeld, PDF-Reporttexte und UI-Überlaufschutz.
4. **Visuelle Sichtprüfung der gerenderten Originalseiten aller drei Kundenberichtseiten**: keine überlagerten Texte, keine abgeschnittenen Zahlen, sauberer Satzspiegel, konsistente Fußzeilen. Der Automatik-Test allein ersetzt die Sichtprüfung nicht.
5. Keine Umwandlung einer Verkäuferannahme in kundenseitig bestätigten Nutzen; keine doppelte Berücksichtigung vermiedener Altkosten, Kapazität oder Risiko als sicherer Cashnutzen.
6. Nach Änderungen erst Format/Lint/Unit/Build, dann vollständige Chromium- und PDF-Bildabnahme; erst nach tatsächlichem Lauf als grün dokumentieren.

## Grenzen
Der Kundenbericht ist eine undiskontierte wirtschaftliche Modellrechnung und kein DCF, NPV, IRR, Steuer- oder Zahlungsstrommodell. Eine Entscheidungsvorlage aus Verkäuferannahmen ist ausdrücklich als unbestätigt bezeichnet. Der Finance-Anhang dokumentiert mehr Detail als der Kundenbericht, ersetzt aber keine individuelle Prüfung durch den Kunden.


## Tatsächliche technische und visuelle Abnahme (09.10.2026)

- [CI #37932947525](https://github.com/thomasasen/meddpicc-workbench/actions/runs/37932947525): **SUCCESS**, 250 Vitest-Tests in 34 Dateien, 101 Playwright-Tests bestanden, 1 übersprungen. Prettier, ESLint, TypeScript-/Vite-Build sowie Pages-Build-Integrität erfolgreich.
- Browserprüfung: Beide echten PDF-Downloads auf Desktop/Mobile erfolgreich. Kundenbericht genau **3 A4-Seiten**, Finance-Bericht beim fiktiven CRM-/SaaS-Beispiel **7 A4-Seiten**; PDF-Signatur und A4-Maße geprüft.
- Der PDF-Rendering-Schritt (pdftoppm) hat alle drei Kundenberichtseiten erzeugt und per pdftotext relevante Kapiteltexte nachgewiesen.
- **Originale manuell betrachtet:** [Management-Seite](review-screenshots/business-case-customer-cover.png), [Kosten/Nutzen-Seite](review-screenshots/business-case-customer-economics.png), [Validierungsseite](review-screenshots/business-case-customer-decision.png), zusätzlich [Finance-Übersicht](review-screenshots/business-case-report-finance.png) und [Finance-Metrics](review-screenshots/business-case-report-metrics.png). Keine offensichtlichen Textüberlagerungen, Randüberschreitungen oder fehlerhaften Zahlenausrichtungen im fiktiven CRM-Referenzszenario.
- Das im Browser vorangegangene Szenario mit fehlendem Kunden- und Verfassernamen blockiert jetzt den Export. Es wird nicht mehr als scheinbar fertiger Kundenbericht mit „Nicht angegeben“ ausgegeben.
- Negativer Business Case, Nullkosten, 60 Monate, lange Ausgangssituationen und viele zusätzliche Metrics sind als Struktur-/Unit-Regression abgedeckt. Eine eigene visuelle Bildabnahme jeder dieser Extremkombinationen steht außerhalb dieses Testlaufs.
- Nicht umgesetzt: echte persönliche Review-/Autorenfreigabe, DCF-Kapitalwert, versteckte Anrechnung von Kapazität und Risiko, Backend oder Cloud-Persistenz.

**Freigabestatus:** Technisch und visuell im fiktiven Standardfall abgenommen, aber **nicht nach main gemergt**. Benutzerabnahme bleibt erforderlich.
