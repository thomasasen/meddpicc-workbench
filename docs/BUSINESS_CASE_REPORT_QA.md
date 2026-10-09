# Business Case / ROI-Bericht: Quellenbasierte Simulation und fachliches Red Team

Stand: 09.10.2026. **Keine tatsächliche Mitwirkung, Unterschrift oder Freigabe** von Andy Whyte, Darius Lahoutifard, McKinsey, BCG oder Roland Berger. Alle Fachrollenreviews sind Simulationen. Die Original-EPUBs wurden erneut inhaltlich geprüft.

## 1. Scope und klare Definitionen

- Tool: bestehender Software Payback Calculator. Keine neue Server-/CRM-Persistenz, keine KI, keine externe Weitergabe.
- Grafik: kumulierter EUR-Wert mit ausdrücklich markiertem Tiefpunkt, Nutzenbeginn und Payback; negative/positive Fläche differenziert; Hover/Keyboard-Punkte; weiter vorhandener SVG-/PNG-Export.
- PDF: lokal mit pdf-lib erzeugter mehrseitiger A4-Management-Bericht mit Kundenname, Projekt, Verfasser, Datum, Nutzen/Kosten/ROI, farbigem Chart, allen Kostenpositionen und Metrics einschließlich ausgeschlossener, Quellen-/Statusbezeichnung, allen 37/61 Monatswerten, Methodik und nächsten Kundenschritten.
- **ROI über den Horizont, undiskontiert** = (angerechneter kumulierter Nutzen inkl. vermiedener Altsystemkosten minus kumulierte neue Projektkosten) / kumulierte neue Projektkosten × 100. Kein jährlicher ROI, kein NPV, IRR oder echte Cashflow-Rechnung. 0 EUR neue Kosten => ROI nicht definiert. **Altsoftware-Ersparnis nicht doppelt** als Kostensenkung und Nutzen ansetzen.
- Laufende Jahreskosten werden wirtschaftlich zu 1/12 pro Modellmonat verteilt, unabhängig von Zahlungsfälligkeit. Erste und bis zum Modellhorizont anhaltende Nullpunktüberschreitung sind getrennt.

## 2. Direkt geprüfte Stellen aus den Originalbüchern

| Autor und Quelle | Tatsächlich gestützte Aussage | Umsetzung | Abgrenzung |
| --- | --- | --- | --- |
| Andy Whyte, *MEDDICC*, „Metrics 1 (M1's) - Metrics Proof Points“ | M1-Proof-Points stammen aus bereits erzielten Kundenergebnissen und sind für andere Kunden zunächst Hypothesen. | Der PDF-Report übernimmt für jede Metric den tatsächlichen Datenstatus. | Keine automatische Umwandlung von M1 in M2. |
| Whyte, „Metrics 2 (M2's) - Return on Investment“ | M2 werden durch Research, Discovery und Zusammenarbeit/Konsens mit dem Champion kundenspezifisch erarbeitet. | Hypothesen und kundenseitige Validierung bleiben unterscheidbar. | Kunden-Häkchen sind Selbstauskunft, keine unabhängige Prüfung. |
| Whyte, „Economic Buyer“ und „Economic Decision Criteria“ | Wirtschaftliche Ziele, Entscheidungsrelevanz und wirtschaftlicher Case sind wichtiger als isolierte Aktivitätsmetriken. | Management-Kernaussage sowie offene Evidenz und Finance-Next-Steps. | Die Modellrechnung stellt keine Kauf-/Budgetfreigabe dar. |
| Darius Lahoutifard, *Always Be Qualifying*, Kap. 9 „ROI vs. Payback Period“ | Ein Payback in Zeit ist für Nichtfinanzler oft verständlicher; ROI in Prozent ist eine andere, komplexere Kennzahl. | In PDF **beide separat**: Payback-Monate und explizit benannter undiskontierter Horizon-ROI %. | Die konkrete ROI-Formel ist unsere eigene finanzmathematische Modellentscheidung, keine zitierte Autorenformel. |
| Lahoutifard, Kap. 9 „The Process to Pitch the Payback Period“ | Argumentationskette Metrics → Geldwirkung → Kosten inkl. Einführung → Payback. | Report mit Executive Summary, Kosten-/Nutzen-Brücke, Metrics und Zeitleiste. | Der Detailbericht ist bewusst ausführlicher als ein schneller Whiteboard-Pitch. |
| Lahoutifard, Kap. 3 „Metrics and the Economic Impact“ | Monetarisierung muss sich aus realem wirtschaftlichen Impact ableiten. | Nicht realisierte Kapazität oder reine Risikoerwartung bleiben ausgeschlossen und transparent gezeigt. | Umsatz nicht mit Deckungsbeitrag verwechseln. |

## 3. Simuliertes Autoren-Red-Team: Runde A (Design)

**Whyte-Perspektive:** Ein glänzender ROI-Report aus bloßen Verkäuferannahmen wäre problematisch: M1-Hypothese ≠ kundenspezifischer M2-Nachweis. *Anforderung:* Herkunft jeder Metric, Kennzeichen unbestätigter EUR-Effekte, keine manipulierte Validierungsampel, Economic-Buyer-Fragen statt vermeintlicher Freigabe. *Umsetzung:* vollständiger Status und Notiz je Metric, explizite Zahl unbestätigter angerechneter Metrics, Validierungsschritte.

**Lahoutifard-Perspektive:** ROI und Payback können leicht verwechselt werden. *Anforderung:* Payback als erste Antwort verständlich präsentieren und prozentualen ROI nur zusätzlich unter klarer Formel ausweisen. *Umsetzung:* Break-even im Management-Header, ROI gesondert, wirtschaftliche Brücke und monatlicher Verlauf.

**CFO / Finance:** Gegenfrage: Woher stammen der Zähler, der Nenner, die 36 Monate und die Altsystem-Erträge? *Anforderung:* ROI-Formel, wirtschaftliche Monatswerte, getrennte Einmal-/SaaS-Kosten, keine doppelte Verrechnung von Legacy-Savings, keine Vermischung von Cashflow und Accrual-Nutzen. *Umsetzung:* finanzmathematische Funktion mit Tests, transparente Quellen und Methodik sowie lückenlose Monatstabelle.

**Projektleiter:** Anlaufphase, Datenmigration und Abschaltung alter Verträge fallen nicht zusammen. *Anforderung:* einzelne Startmonate und Ramp-ups im Report; Tiefpunkt und Break-even lesbar. *Umsetzung:* Quelle bleibt die bestehende deterministische Projekt-Monatsengine, Wertverlaufsdiagramm mit Nutzenbeginn und Tiefpunkt.

**Kundenperspektive:** Mein CFO darf nicht sehen, dass hypothetische 320.000 EUR „bestätigter Wert“ sind. *Anforderung:* jede PDF-Seite als Modellrechnung erkennbar, unbestätigte Positionen und nicht angerechnete Kapazitäten sichtbar.

**Designperspektive (fiktive McKinsey/BCG/Roland-Berger-Anforderung, keine Beteiligung):** Nicht nur ein Rohdatenexport; klare Hauptbotschaft, wenige entscheidende Kennzahlen, sauberer Chart mit Markern, Kosten-/Benefit-Bridge, Abschluss mit konkreten Prüfschritten. Keine erfundenen Kundenlogos oder Marken-Zustimmung.

## 4. Simuliertes Red Team: Runde B (Implementierungsgates)

| Angriff | Erwartung / Prüfkriterium |
| --- | --- |
| 0 EUR neue Kosten, positiver Nutzen | Prozent-ROI nicht definiert; nicht Infinity. |
| negativer Business Case | Negativer ROI sichtbar; kein fiktiver Payback-Monat. |
| 36 Monate vs. 60 Monate | ROI-Nenner und Nutzen jeweils nur für den gewählten Horizont. |
| Dublette in Wirkungsgruppe | Ursprüngliche Finanzengine blockiert gesamte Kundenrechnung und PDF, statt doppelt zu summieren. |
| Risiko und Kapazität | Im PDF separat dokumentiert, aber nicht heimlich zum ROI addiert. |
| Kunde verändert Werte | PDF wird aus dem **aktuellen UI-State** erzeugt und nicht aus einer veralteten Demo-Fixture. |
| Deutsch, Umlaute und Euro | PDF-Schrift / Encoding darf nicht abstürzen. |
| Viele Eingabepositionen | PDF erzeugt ausreichend Folgeseiten für Monats- und Metric-Tabellen. |
| Sensible Kundenangaben | Kein Backend, keine Cloud, keine externe Fonts, kein automatischer Upload. Download aus Blob im Client. |
| Mobile/Keyboard | Ergebnisgrafik responsiv, Screenreader-Tabelle unverändert, Download-Aktion erreichbar. |
| Keine Zahl bestätigt | Report nennt diese Unsicherheit sichtbar, selbst wenn ein großer ROI resultiert. |

**Nur modellierte Fachzustimmung:** Der Entwurf ist mit den in den Originalbüchern beschriebenen Vertriebsprinzipien kompatibel, sofern diese Gates nachweisbar bestanden werden. Keine persönliche Autorenfreigabe. Die finale Freigabe richtet sich nach funktionalen Tests und Nutzerabnahme.

## 5. Grenzen

Ein kundenfähiger Bericht ist kein Wirtschaftsprüfer-Testat. Er dokumentiert unverifizierte Nutzerannahmen, nicht garantierte finanzielle Vorteile, periodisierte Wirtschaftlichkeit statt echten Vertragszahlungsplan und keine mehrjährige Diskontierung. Eine qualitative Herausforderung der tatsächlich erzielbaren finanziellen Effekte durch Finance oder Kunden liegt außerhalb eines automatisierten Tests.

## 6. Tatsächliche technische und visuelle QS

CI-Ergebnisse, Report-PDF-Signatur-/A4-/Mehrseitenprüfung, Original-Chromium-Screenshots und eventuelle Fehlerkorrekturen erst nach den tatsächlichen Läufen eintragen. Vorher keinen grünen Release-Status behaupten.
