# Business-Case-Stresstest – fachliches Red Team und Abnahme

Stand: 10.10.2026. **Alle fünf Rollenreviews sind simulierte Prüfperspektiven, keine persönlichen Gespräche, Befragungen oder Autorenzustimmungen.** Keine empirische Validierung von Kaufentscheidungen.

## Primärquellen (Original-EPUBs des Projekts)

- **Andy Whyte, _MEDDICC_, Abschnitt METRICS:** M1 sind Referenz-/Proof-Point-Kennzahlen aus bestehenden Kunden; M2 quantifizieren erst durch Discovery und Abstimmung mit dem konkreten Kunden den erwarteten Wert. Abschnitt ECONOMIC BUYER: maßgeblich ist die Gesamtentscheidungskompetenz, nicht der Einkaufstitel. Abschnitt DECISION CRITERIA: der Business Case muss den tatsächlichen wirtschaftlichen Entscheidungskriterien entsprechen.
- **Darius Lahoutifard, _Always Be Qualifying_, Kapitel 3 „Metrics“:** messbare Wirkung des zukünftigen Zustands gegenüber Status quo/Alternative statt allgemeiner Nutzenbehauptungen. Kapitel 4 „Economic Buyer“: Entscheidungsmacht und frei disponierbare Mittel klären. Kapitel 5 „Decision Criteria“: wirtschaftliche und andere Kriterien des Kunden prüfen. Kapitel 9 „The ROI Pitch“, „ROI vs. Payback Period“: Payback in Monaten ist auch für Nicht-Finanzfachleute zugänglich; Finance benötigt trotzdem nachvollziehbare Detailrechnung.

**Fachliche Ableitung, keine Buchbehauptung:** Ein variierter Business Case ersetzt keine Validierung von M2 und ist keine Wahrscheinlichkeitsprognose. Szenariofaktoren sind vom Benutzer gesetzte Sensitivitäten, keine statistischen Konfidenzintervalle. Eine negative Variante ist ausdrücklich gleichberechtigt.

## Phase 1 – Red Team vor Konzeption

| Simulierte Perspektive | Kritischer Einwand | Konsequenz |
| --- | --- | --- |
| CFO eines mittelständischen Unternehmens | „Woher kommen die Einsparungen? Ist der angezeigte Tiefstand Liquiditätsbedarf?“ | Herkunft/Status der Metrics bleibt erhalten; Kennzeichnung als wirtschaftlicher Saldo, **nicht** Cashflow. Kosten/Nutzen/ROI/Break-even pro Szenario |
| CEO eines größeren Unternehmens | „Wie stark hängt der Erfolg von einer optimistischen Umsetzung ab?“ | drei Annahmenvarianten, Vergleich von Endsaldo und Amortisation ohne Drei-Linien-Diagramm |
| CIO mit Investitionsverantwortung | „Eine spätere Nutzenrealisierung bedeutet nicht, dass der SaaS-Vertrag später beginnt.“ | Nutzen-Ramp-up verschieben, Lizenzkostenzeitpunkte unverändert lassen |
| COO eines Industrieunternehmens | „Mitarbeiter sparen Zeit, aber keine Stelle entfällt: Wo ist die echte Ersparnis?“ | Kapazität/Risiko unverändert ausschließen, Doppelzählungsschutz wiederverwenden |
| Geschäftsbereichsleitung mit Budgetverantwortung | „Kann ich in zehn Sekunden erkennen, wann sich die Investition rechnet und was bei Verzögerung passiert?“ | Payback zuerst, Endsaldo darunter, expliziter Fallwechsel für den bestehenden V4-Chart |

## Phase 2 – Red Team nach der fachlichen Implementierung

**Simulationen, keine Interviews.** Die fünf Rollen prüfen dieselben Fragen nochmals.

- **CFO:** Warum betrifft der prozentuale Nutzenabschlag nur monetarisierte Kunden-Metrics, nicht terminierte Altsystemkosten? **Entscheidung:** Vertragswerte sind gesonderte Ausgangsannahmen; sie ändern sich nur, wenn Anwender die Basisdaten anpassen. Die Abgrenzung steht sichtbar im UI, Kunden-PDF und Finance-Anhang. ROI entspricht der bestehenden Formel `(angerechneter Nutzen – neue Projektkosten) / neue Projektkosten * 100`; keine Annualisierung, keine Liquiditätsrechnung.
- **CEO:** Besteht das Risiko, dass das optimistische Szenario als gesicherte Prognose wirkt? **Entscheidung:** explizite Parameter, hypothetischer Charakter, keine Wahrscheinlichkeiten oder Gewinnzusagen.
- **CIO:** Verschieben wir irrtümlich Endmonate über die Projektlaufzeit? **Entscheidung:** Die Monatsengine betrachtet weiterhin strikt Monat 0 bis Monat 36/60; spätere Nutzeneffekte fallen aus dem ausgewiesenen Zeitraum heraus. Keine automatische Vertragsänderung.
- **COO:** Wird ein Zeitgewinn bei multiplikativ erhöhtem Nutzen ungewollt monetarisiert? **Entscheidung:** nur schon enthaltene `realized`-Metrics werden skaliert; `capacity`, `risk`, `nonfinancial` und Doppelzählungsgruppen bleiben unverändert.
- **Geschäftsbereichsleitung:** Sind zwei Varianten mit identischem Break-even dennoch unterscheidbar? **Entscheidung:** Endsaldo und dessen EUR-Differenz zur Basis werden je Szenario angezeigt; Gesamtkosten, Nutzen, Tiefpunkt und ROI im ausgewählten Fall zusätzlich.

### Fachliche Qualitätsgates

- Ausgangsinput und Basisberechnung bleiben bitgleich in Logik und Werten.
- Die Szenarioberechnung nutzt **dieselbe** `calculateSoftwarePayback` / `summarizeBusinessCase`-Engine, keine nachgelagerte künstliche Nachberechnung.
- Explizite Default-Annahmen: konservativ −25 % Nutzen, +15 % einmalige Kosten, +3 Monate; optimistisch +10 % Nutzen, 0 % Kosten, 0 Monate.
- Alle sechs Nicht-Basisparameter sind getrennt änderbar; Validierungsgrenzen −100 % bis +200 %, Verzögerung 0 bis Modellhorizont.
- V4-Fortführung wird auf den tatsächlichen Monatswerten des **ausgewählten** Szenarios erneut geprüft; maximal 6/12 illustrative Monate, **nie** im KPI-Horizont. Bei fehlender Stabilität oder fehlendem positivem Saldo gibt es keine positive Fortführung.
- Kundenbericht zeigt den ausgewählten wirtschaftlichen Verlauf und einen Vergleich aller drei Varianten; Finance-Anhang erhält vollständig die Basisrechnung **plus** ein Szenariokapitel.
- Sämtliche Szenariowerte und Delta-Beträge stammen vom gleichen `CaseSummary`-Ergebnis.

## Phase 3 – nach visueller Abnahme

**Offen bis echte Desktop-/Mobil-Screenshots und alle gerenderten PDF-Seiten vorliegen und betrachtet wurden.** Ein grüner Build oder automatisierte PDF-Textprüfung ersetzt diese Sichtprüfung nicht. Dokumentationsstatus nicht vorwegnehmen.

Visuell zu kontrollieren: 375/768/1024/1440 Pixel, Zahlenumbrüche bei negativem Saldo, aktive Karte, Tastaturfokus, Beschriftung „keine Amortisation“, Warnhinweise, ausgewählter Chart einschließlich bedingter Fortführung, Chart-Achsen, PDF-Spalten, Seitenzählung und keine Überschneidung mit Footer.

## Bekannte Grenzen und weitere fachliche Fragen

1. Prozentänderungen sind pauschal für bereits monetarisierte Kundenwirkungen; individuelle Wirkungsrisiken können stärker differieren. Keine risikogewichtete Prognose.
2. Terminierte Altsystemeinsparungen bleiben per Definition unverändert. Ob dies für das konkrete Projekt plausibel ist, muss der Kunde verifizieren.
3. Keine Diskontierung, Steuern, Finanzierung, Liquidität, Zahlungszeitpunkte oder Cashflow-Prognose.
4. Eine als „kundenseitig geprüft“ markierte Metric ist keine externe Prüfung.
5. Die simulierten Economic-Buyer-Reviews sind Design- und Gegenargumentationsprüfungen, keine empirische Nutzungsstudie.

## Bewertungsmaßstab

**Fachlich begründeter Mehrwert:** Ein Economic Buyer kann Abhängigkeiten vom Nutzenbeginn, Einmalkosten und Monetarisierung getrennt sehen, den stabilen Payback und den Negativfall direkt vergleichen und die offenen Annahmen prüfen. **Nicht nachgewiesen:** höhere Gewinnquote, bessere Investitionsentscheidungen in echten Unternehmen oder kausale Wirkung der Visualisierung auf Freigaben. Diese Aussagen erfordern Nutzerstudien bzw. echte retrospektive Entscheidungsdaten.
