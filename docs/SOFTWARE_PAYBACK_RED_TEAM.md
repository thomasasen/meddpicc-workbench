# Software Payback: Quellennachweis und adversariales Red Team

Stand: 09.10.2026. Erweiterung im Draft-PR #53. **Keine echte Beteiligung oder Freigabe** durch die Autoren, McKinsey, BCG oder Roland Berger. Die Rollen sind fachlich simuliert.

## 1. Produktgrenze
Ziel ist ein local-first Software-Investitionsrechner mit Quick-Modus, optionalem Monatsmodell, SaaS, einmaligen Projektkosten, abgelösten Bestandssystemen und flexiblen Kunden-Metrics. Es handelt sich um eine wirtschaftliche Modellrechnung gegenüber dem Status quo, **keine zahlungszeitgenaue Cashflow-Prognose**, keinen garantierten ROI und keine Investitionsfreigabe. Kein Deal-State, kein Backend, keine KI-Pflicht, keine Speicherung.

## 2. Erneut direkt geprüfte Originalquellen

| Quelle im Original-EPUB | Belegte Position | Umsetzung und eigene Ableitung |
| --- | --- | --- |
| Andy Whyte, MEDDICC, „Metrics 1 (M1's) – Metrics Proof Points“ | M1 sind erzielte Resultate vorhandener Kunden und können für den Zielkunden hypothetisch sein. | Kennzeichen „Referenzwert / M1-Hypothese“, keine automatische Kundenvalidierung. |
| Whyte, „Metrics 2 (M2's) – Return on Investment“ | Kundenspezifische M2 entstehen aus Research, Discovery und Konsens mit dem Champion. SaaS-Erfolg und Metrics unterstützen einen Business Case und sind nicht bloß Produkt-KPIs. | Herkunftsstatus, Nutzerbegründung und explizite offene Annahmen. „Kundenseitig geprüft“ bleibt eine Nutzerangabe, kein verifizierter Status. |
| Whyte, „Economic Decision Criteria“ | Für den Economic Buyer zählt die Gesamteconomic und ein tragfähiger Business Case. | Keine automatische Budget- oder EB-Freigabe aus einer Monatszahl. |
| Darius Lahoutifard, Always Be Qualifying, Chapter Nine „ROI vs. Payback Period“ | Payback in Monaten ist für Nicht-Finanzfachleute oft leichter zu verstehen als ROI in Prozent. | Nur Zeitgröße für Payback; keine ROI-Prozentzahl. |
| Lahoutifard, Chapter Nine „The Process to Pitch the Payback Period“ | Metrics → wirtschaftliche Wirkung → Lösungskosten einschließlich Implementierung/indirekten Kosten → Payback. | Getrennte Eingabe von Kosten, Metrics und Ergebnis. Quick-Modus bleibt aktiv. |
| Lahoutifard, Chapter Three „Metrics and the Economic Impact“ | Wirtschaftliche Impact-Arten Revenue, Cost und Risk; „Zeit gespart“ muss konkretisiert werden, Risiko hat Unsicherheit. | Deckungsbeitrag statt Umsatz; Kapazitätsgewinn und Risk-Metrics bleiben standardmäßig außerhalb der sicheren EUR-Basis. |

**Eigene Modellentscheidungen:** monatliche Verteilung jährlicher Kosten, Nutzen-Ramp-up, Wirkungsgruppen gegen Doppelzählung, alle Inputtypen, Vergleich des Status quo, Zwei-Stufen-Modus, Export und die Unterscheidung erste/innerhalb des Horizonts anhaltende Nullpunktüberschreitung sind **keine Formeln der Autoren**.

## 3. Red Team A: adversarialer Konzeptreview

| Simulierte Rolle | Wesentlicher Einwand | Verbindliche Entwurfsmaßnahme |
| --- | --- | --- |
| Whyte | Referenz-M1 wird fälschlich als kundenbestätigte M2 gezeigt. | Herkunft als Verkäuferannahme/Referenz/Kundenaussage/laut Nutzer geprüft, Default Hypothese. |
| Whyte | Payback ersetzt wirtschaftliche Entscheidungsrechte. | Keine Approval-Ampel, offene Annahmen am Ergebnis. |
| Whyte | Quantifizierung ohne Pain und Champion bleibt beliebig. | Freie Metric-Titel, Realisierungsbegründung und Quellenzuordnung. |
| Lahoutifard | Zehn fachliche Kategorien überfrachten Quick Payback. | Default Quick-Modus mit drei Eingaben, Projektmodus optional. |
| Lahoutifard | Freie Zeitquote gilt fälschlich als realisierter Nutzen. | Zeitgewinn zunächst Kapazität, niemals automatisch cash-relevant. |
| Lahoutifard | Kosten von Implementierung/indirektem Aufwand fehlen. | Freie Einmalkostenpositionen und SaaS-Beginn unabhängig vom Nutzenbeginn. |
| IT-Projektleiter | Nutzen entsteht später als Go-Live. | Startmonat, Ramp-up und Ende pro Metric. |
| Kundenseitiger Fachbereich | Freigewordene Stunden reduzieren nicht notwendigerweise Budget. | Operativer und tatsächlich realisierbarer Nutzen getrennt. |
| CFO | Zwei Metrics beschreiben denselben Effekt. | Konfliktprüfung gleicher Wirkungsgruppen blockiert die Basisrechnung. |
| Controller | Abgeschaltete Altlizenzen können doppelt als Metric und Bestandskosten gezählt werden. | Wirkungsgruppenprüfung schließt abgelöste Bestandskosten ein. |
| Finance | Jährliche SaaS-Vorauszahlung ≠ linearer Zahlungsstrom. | Monatskosten als Wirtschaftlichkeitsverteilung deklarieren, Cashflow separat. |
| GUI-Designer | Riesige Formulare verhindern Anwendung. | Drei nummerierte Abschnitte, progressive Metric-Karten, responsive Darstellung. |
| Strategieberatungs-Präsentationsdesigner (simuliert nach Qualitätsanspruch McKinsey / BCG / Roland Berger) | Monatszahl allein ist keine Entscheidungsvorlage. | Wertentwicklung, Treiber und Grenzen, zugängliche Tabelle, SVG/PNG-Export. |

## 4. Red Team B: Ist-Code-Review und gezielte Abnahmekriterien

| Perspektive | Konkrete Stelle | Kontrollpunkt |
| --- | --- | --- |
| Whyte / M1-M2 | CustomerMetric.evidence, evidenceLabel und unresolvedAssumptions | Hypothese als Default, echte Kundenbestätigung nicht behaupten. |
| Whyte / EB | SoftwarePaybackPanel.summary | Schätzung statt automatische Entscheidung; offene Kundenzahlen. |
| Whyte / Economic Decision Criteria | SoftwarePaybackPanel und Quellen-Accordion | Voller Business Case ausdrücklich außerhalb des Tools. |
| Lahoutifard / verständlicher Pitch | QuickPaybackView.vue | Schnellberechnung bleibt sofort verfügbar. |
| Lahoutifard / monatlicher Nutzen | calculateSoftwarePayback | 120.000 EUR Monat 0, SaaS Monat 1, Nutzen Monat 7 → Break-even Monat 18. |
| Lahoutifard / Revenue-Cost-Risk | annualMetricPotential, MetricTreatment | Deckungsbeitrag statt Umsatz, ungesicherte Zeit-/Risikoannahmen separat. |
| CFO / Double Counting | groupCount über Metrics und vermiedene Altsoftware | Dopplung erzeugt fachlichen Fehlerstatus statt addierter Scheinersparnis. |
| Controller / Datenvalidität | validateCosts, validateMetrics | Negative Werte, Infinity, überhöhte Quoten, ungültige Monate ablehnen. |
| IT-Projektleiter | startMonth, rampMonths, endMonth | Vorteil entsteht ab tatsächlichem Nutzenbeginn, nicht zwingend Go-Live. |
| Finance / Volatilität | firstBreakEvenMonth und sustainedBreakEvenMonth | Einmaliger Nullpunkt ≠ anhaltend bis Modellhorizont; Horizont wird genannt. |
| GUI-Designer | SoftwarePaybackPanel.vue | Labels, Fehlerzustände, Keyboard, 375–1440 px, keine versteckten Kernaussagen. |
| Präsentationsdesigner | SVG-/PNG-Export | Identische berechnete Datenbasis wie die zugängliche Monats-Tabelle. |

**Fachliche Einschränkung:** Die eigene Engine ist weder bestätigter Unternehmens-Cashflow noch Alternativinvestmentvergleich oder vollständiger Business Case. Vermiedene Altsystemkosten beginnen nur ab Modellmonat der Abschaltung. Jahreskosten werden /12 verrechnet, nicht als Liquiditätsbewegung im Rechnungsmonat.

## 5. Simuliertes Votum und reale Merge-Sperre

- Simulierte Whyte-Perspektive: Zustimmung zum quellen- und kundenkritischen Design **unter der Voraussetzung**, dass Datenherkunft und EB-Grenzen stets sichtbar bleiben. **Keine tatsächliche Whyte-Freigabe.**
- Simulierte Lahoutifard-Perspektive: Zustimmung zur verständlichen zeitlichen Payback-Logik, sofern Quick-Modus und wirtschaftliche Kostenklarheit erhalten bleiben. **Keine tatsächliche Lahoutifard-Freigabe.**
- CFO-/Projekt-/UX-Perspektiven: nur nach technischen Tests, Browserprüfung und nachvollziehbarem Export als ausreichend einstufen.

**Merge-Bedingung:** Der Nutzer erlaubt Merge nur „wenn die Buchautoren im Red-Team einverstanden sind und ihre Freigabe erteilen“. Simulierte Bewertungen können weder echte persönliche Zustimmung noch Freigaben der Autoren darstellen. **Die Bedingung kann hier nicht nachgewiesen werden. Deshalb Draft behalten und main nicht mergen**, bis der Nutzer die Bedingung ausdrücklich ändert oder echte Freigaben außerhalb dieser Simulation vorliegen.

## 6. Prüfprotokoll

### Nachgewiesene Läufe und Korrekturen

- **Fehlschlag [#37861173184](https://github.com/thomasasen/meddpicc-workbench/actions/runs/37861173184):** Prettier erfolgreich, ESLint fand eine unbenutzte Chart-Konstante; entfernt. Hunderte Vue-HTML-Stilwarnungen waren nicht fatal; `npm run lint` ist nach Korrektur erfolgreich.
- **Fehlschlag [#37861239043](https://github.com/thomasasen/meddpicc-workbench/actions/runs/37861239043):** 229/230 Unit-Tests bestanden. Ein Test verlangte nach einer 250.000-EUR-Zusatzinvestition eine zweite Amortisation innerhalb von 36 Monaten, obwohl der Saldo in diesem Zeitraum tatsächlich negativ blieb. Testdaten mit 150.000 EUR korrigiert. Die Engine verhielt sich korrekt, die Testannahme war fehlerhaft.
- **Erster vollständiger Erfolg [#37861337604](https://github.com/thomasasen/meddpicc-workbench/actions/runs/37861337604):** 230 Unit, 91 Browser bestanden, 1 übersprungen. Projektmodus und SVG-/PNG-Downloads per Playwright erfolgreich, Pages-Root synchron und `pages:check` erfolgreich.
- **Visueller Review:** Nach Öffnen der ersten Originale den zu umfangreichen Leerzustand (leere Grafik und Management-Summary), fehlende visuelle Gruppierung der Projektabschnitte und fehlenden Mobile-Tabellenhinweis korrigiert. SVG/PNG enthalten jetzt zusätzlich Amortisationsmonat und kumulierten Saldo. Optional leere Endmonate lassen sich wieder leeren, ohne einen ungültigen String zu speichern. Die mobile Playwright-Vollseitenaufnahme wurde als CSS-Pixel-Original aufgenommen, weil das erheblich größere Gerätepixel-PNG über den GitHub-Inhalts-Endpunkt nicht vollständig gelesen werden konnte.
- **Finaler Erfolg [#37862223720](https://github.com/thomasasen/meddpicc-workbench/actions/runs/37862223720)** am 09.10.2026: `npm ci --no-audit --no-fund`, `npm run format:check`, `npm run lint`, `npm test` (**30 Dateien, 230 bestanden**), `npm run build`, `npm run test:e2e` (**91 bestanden, 1 übersprungen**, Desktop- und Mobile-Chromium), Pages-Sync, `npm run pages:check`, Screenshot-Veröffentlichung erfolgreich. Original-PNGs nach dem Review direkt aus dem Feature-Branch geprüft.

### Finale Originalbilder des Projektmodus

| Bild | Pixel | Bildprüfung |
| --- | --- | --- |
| [Leerer Desktop-Zustand](review-screenshots/software-payback-empty-desktop-chromium.png) | Chromium Desktop, 1280 px breit | Drei getrennte Abschnitte, keine leere Finanzgrafik mehr, zugängliche Aktionen. |
| [Ergebnis Desktop](review-screenshots/software-payback-result-desktop-chromium.png) | Chromium Desktop, 1280 px breit | Zwei Kostenpositionen, direkte Kunden-Metric, Payback Monat 18, Formel-/Datenherkunftshinweis und Grafikexport. |
| [Leerer Mobile-Zustand](review-screenshots/software-payback-empty-mobile-chromium.png) | **393 × 2332** | Einspaltige Darstellung, drei Abschnitte, Aktionen bedienbar, kein Horizontal-Overflow. |
| [Ergebnis Mobile](review-screenshots/software-payback-result-mobile-chromium.png) | **393 × 6001** | Gut lesbare Eingaben, Monatswert 18, 222.000 EUR kumulierter Saldo bei 36 Monaten, Grafikergebnis, Scrollhinweis für Tabelle und Kunden-Zusammenfassung. |

**Verbleibende fachliche Grenzen:** Jahresgebühren als wirtschaftlicher Monatsaufwand, keine Jahresvorauszahlung-/Cashflow-Terminierung, keine NPV/IRR/Steuerrechnung, keine echte Kundenvalidierung, keine echte Autorenfreigabe. Der Copy-Fehlerzweig ist implementiert; der erfolgreiche Clipboard-Pfad wurde im Chromium Browser verifiziert.

**Merge bleibt gesperrt** bis zur ausdrücklichen visuellen UI-Freigabe und eindeutig erfüllter Nutzerbedingung. Red-Team-Simulation ersetzt keine persönliche Autorenunterschrift.
