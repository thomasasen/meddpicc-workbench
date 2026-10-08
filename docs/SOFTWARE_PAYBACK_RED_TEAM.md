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

Vor endgültiger Bewertung mit echter finaler GitHub-CI, beiden Chromium-Geräteklassen, konkreten Testzahlen, vier neuen Original-Screenshots und verbliebenen Einschränkungen aktualisieren. Keine Testfreigabe ohne erfolgreiche Ausführung behaupten.
