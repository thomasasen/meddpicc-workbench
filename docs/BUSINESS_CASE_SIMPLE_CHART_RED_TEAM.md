# Red Team: Vereinfachte Payback-Grafik für Economic Buyer

Stand: 09.10.2026 | Modelliertes Review, **keine echten Interviews oder Autorengespräche**.

## Quellengebundene Perspektiven

- **Andy Whyte, MEDDICC: The Ultimate Guide to Staying One Step Ahead in the Complex Sale**: Abschnitte „Metrics 1 (M1's) - Metrics Proof Points“, „Metrics 2 (M2's) - Return on Investment“, „Economic Buyer Decision Criteria“. M1 sind nachweisbare Ergebnisse vorhandener Kunden; M2 sind mit dem konkreten Kunden erarbeitete wirtschaftliche Ergebnisse. Entscheider haben eigene Wirtschaftlichkeits- und Entscheidungsanforderungen. Ein gut aussehender positiver Verlauf ersetzt keine bestätigte M2-Metric.
- **Darius Lahoutifard, Always Be Qualifying: MEDDIC & MEDDPICC Sales**: Kapitel 3 „Metrics“, Kapitel 4 „Economic Buyer“, Kapitel 9 „The ROI Pitch“, insbesondere „ROI vs. Payback Period“ und „The Process to Pitch the Payback Period“. Payback als für Entscheider leichter verständliche Zeitangabe, vollständige Lösungskosten und Nutzen aus konkreten finanziellen Wirkungen. Der Budgetentscheider fragt nach dem wirtschaftlichen Einfluss, nicht nach einer technischen Chart-Legende.

Die folgenden Einwände sind **fachliche Ableitungen** aus den Texten, keine wörtlichen Äußerungen der Autoren.

## Simulierte fünf Economic Buyer – Einwände / Gegenmaßnahmen

| Rolle (nur wenn mit tatsächlicher Budgethoheit) | Red-Team-Einwand | Nachweisanforderung |
| --- | --- | --- |
| CFO | „Ist der Endsaldo ein Cashflow? Wer hat die Nutzenwerte überprüft?“ | Grafik und PDF verwenden „rechnerischer Saldo“; explizit **kein** Zahlungsstrom; unbestätigte Annahmen werden benannt. |
| CEO / Geschäftsführung | „Wann wird das Vorhaben wirtschaftlich sinnvoll?“ | Amortisationsmonat steht unmittelbar als eigenständiger Wert; keine Doppelmarkierung des Nutzenbeginns. |
| CIO | „Ist die vollständige Umsetzung einschließlich Migration und Betrieb berücksichtigt?“ | Zahl zu den gesamten neuen Kosten bleibt im Formular und Kunden-PDF; vollständige Kostenpositionen im Finance-Anhang. |
| COO | „Sind Zeitgewinne wirkliche Einsparungen?“ | Kapazitäts- und Risikoeffekte ohne realisierte EUR-Wirkung bleiben ausgeschlossen; fiktive Nutzenannahmen offen deklarieren. |
| Geschäftsbereichsleiter mit Budgetverantwortung | „Welche Wirkung entsteht in meinem Bereich?“ | Ausgangssituation und Zielbild werden im Kundenbericht verpflichtend verlangt und die konkreten Nutzenpositionen erklärt. |

## Überarbeitete Darstellung und Ablehnungsbedingungen

- **Einheitliches Liniendiagramm** in der Formular-Ergebnisansicht und auf Seite 1 des Kundenberichts. Basis: dieselben Monatsdaten der unveränderten Rechenengine.
- Eine blaue Saldenlinie und eine einzige Nulllinie. **Keine** rote/grüne Flächenfüllung und **keine** vertikale Linie zum Nutzenbeginn.
- Höchstens drei Ereignisse hervorgehoben: negativer Tiefstsaldo (sofern vorhanden), bis zum Modellende anhaltender wirtschaftlicher Ausgleich (sofern vorhanden), Saldo am Ende des Betrachtungszeitraums.
- Bei keinem anhaltenden wirtschaftlichen Ausgleich ausdrücklich „Nicht erreicht“, niemals ein grüner Break-even-Punkt.
- Keine „amortisiert“/„garantiert“-Botschaft bei einem nachfolgend wieder negativen Saldo.
- Die Formulierung „Tiefster Saldo“ wird bewusst **nicht** in „maximaler Finanzierungsbedarf“ umbenannt; wirtschaftliches Modell ist keine Liquiditätsrechnung.
- Browseransicht zeigt zur Finanzierbarkeit die **gesamten neuen Kosten** statt einer verwirrenden zweiten „ersten Nullpunktüberschreitung“.
- Trotz grafischer Vereinfachung: Zahlenbasis, Herkunft, Annahmen und detaillierte Monatswerte bleiben in Formular und Finance-Anhang sichtbar. **Kein** Löschen notwendiger Finance-Evidenz.
- Tests für die drei Marker, Wegfall doppelte Nutzenbeginn-Markierung, vollständige Kunden-PDF-Bildausgabe, fehlende Amortisation, A4-Lesbarkeit und Mobile-Overflow.

## Noch offener fachlicher Punkt

Das Modell ist ein **Ein-Szenario-Modell**. Ein CFO kann zusätzlich eine Sensitivitätsbetrachtung (beispielsweise pessimistisch / Basis) und einen validierten Status je Nutzenposition verlangen. Bis dies berechnet und überprüft wird, darf die Darstellung weder Eintrittswahrscheinlichkeit noch bestätigte Wirtschaftlichkeit suggerieren.

**Merge-Freigabe:** Nur nach grünem vollständigem CI-Lauf, tatsächlichem PDF-Rendering und manueller visueller Kontrolle; keine automatische Freigabe durch simulierte Review-Rollen.
