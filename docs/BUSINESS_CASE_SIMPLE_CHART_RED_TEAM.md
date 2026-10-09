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
- Browseransicht zeigt zur Kostenübersicht die **gesamten neuen Kosten** statt einer verwirrenden zweiten „ersten Nullpunktüberschreitung“.
- Trotz grafischer Vereinfachung: Zahlenbasis, Herkunft, Annahmen und detaillierte Monatswerte bleiben in Formular und Finance-Anhang sichtbar. **Kein** Löschen notwendiger Finance-Evidenz.
- Tests für die drei Marker, Wegfall doppelte Nutzenbeginn-Markierung, vollständige Kunden-PDF-Bildausgabe, fehlende Amortisation, A4-Lesbarkeit und Mobile-Overflow.

## Noch offener fachlicher Punkt

Das Modell ist ein **Ein-Szenario-Modell**. Ein CFO kann zusätzlich eine Sensitivitätsbetrachtung (beispielsweise pessimistisch / Basis) und einen validierten Status je Nutzenposition verlangen. Bis dies berechnet und überprüft wird, darf die Darstellung weder Eintrittswahrscheinlichkeit noch bestätigte Wirtschaftlichkeit suggerieren.

**Merge-Freigabe:** Nur nach grünem vollständigem CI-Lauf, tatsächlichem PDF-Rendering und manueller visueller Kontrolle; keine automatische Freigabe durch simulierte Review-Rollen.


## Zweite Red-Team-Runde nach Umsetzung und Originalbildkontrolle

Erneut als **simulierte Prüfung**, nicht als persönliche Autoren- oder Führungskräftebefragung:

| Perspektive | Abschlussbefund | Ergebnis |
| --- | --- | --- |
| Whyte / M1-M2 | Der Kunden-PDF-Fuß und die Hinweisbox trennen die Modellrechnung von bestätigten Kunden-Metrics. | Erfüllt im Referenzfall; echte M2-Validierung ist weiterhin Aufgabe mit dem Kunden. |
| Lahoutifard / Payback | Die Überschrift fragt „Wann rechnet sich das Vorhaben?“ und zeigt den Amortisationsmonat vor ROI-Prozentwerten. | Erfüllt. |
| CFO | Die Kurve darf nicht wie eine Bankkonto- oder Liquiditätsprognose aussehen. Saldo ist explizit wirtschaftlich, nicht liquiditätsbezogen. | Erfüllt; Finanzierungscashflow ausdrücklich nicht modelliert. |
| CEO | Nach wenigen Sekunden müssen wirtschaftlicher Tiefstwert, Ausgleichsmonat und Endsaldo erkennbar sein. | Drei gleichlautende Aussagen in Formular und PDF. |
| CIO | Laufende und einmalige Projektkosten dürfen nicht aus der wirtschaftlichen Prüfung herausfallen. | Unveränderte Monatsengine, Gesamtkosten in UI und Kunden-PDF, vollständiger Finance-Anhang. |
| COO | Kapazitäts- und Risikowerte dürfen nicht als automatisch realisierter Geldnutzen eingehen. | Bestehende konservative Regeln bleiben unverändert. |
| Budgetverantwortliche Geschäftsbereichsleitung | Der Nutzen muss mit der konkreten Ausgangssituation verbunden bleiben. | Ausgangslage und Zielbild sind Pflicht im Kundenbericht. |

**Konkrete Nachbesserung nach dem zweiten Review:** Die Webgrafik und das PDF nutzen dieselbe geprüfte Funktion `paybackAxisBounds` für gerundete, leicht lesbare Euro-Achsengrenzen. Für den Fall ohne Amortisation ist der wirtschaftliche Ausgleich in der Web- und PDF-Zusammenfassung nicht mehr grün markiert. Die ergänzten Unit-Tests decken negative, positive, konstante und ungültige Werte ab.

**Abnahme:** [CI #37994814476](https://github.com/thomasasen/meddpicc-workbench/actions/runs/37994814476) erfolgreich mit 253 Unit-Tests, 101 Chromium-Browser-Tests bestanden (1 übersprungen), A4-PDF-Rendern, Produktionsbuild und Pages-Integrität. Originalbildkontrolle: [Desktopdiagramm](../docs/review-screenshots/business-case-chart-desktop-chromium.png), [Mobilansicht](../docs/review-screenshots/business-case-chart-mobile-chromium.png), [Kunden-PDF Seite 1](../docs/review-screenshots/business-case-customer-cover.png), Seiten 2 und 3 ebenfalls geprüft. Keine erkennbaren Überlagerungen im CRM-Referenzfall.

**Grenzen:** Es gibt weder eine unabhängige empirische Überprüfung mit fünf tatsächlichen Economic Buyern noch die persönliche Freigabe der Autoren. Ein-Szenario-Rechnung; tatsächliche Nutzen-Metrics, Zahlungsströme und Sensitivität müssen kundenseitig validiert bzw. separat ergänzt werden.


## V3-Designreview: Flächen, lesbare Achsen, rechter Horizont (09.10.2026)

Der Nutzer möchte die rot/grünen Flächen zurück und eine visuell hochwertige Zeit- und Geldachse mit Luft rechts des letzten berechneten Monats. **Die V2-Reduktion bleibt für Ereignismarker bestehen:** drei Kernaussagen; kein Nutzenbeginn-Indikator.

### Konsequenzen aus den sieben simulierten Rollen

- **Whyte (M1/M2) / CFO:** Das Diagramm darf Planungsannahmen nicht als tatsächliche Rendite oder Zahlungsströme darstellen. Deshalb bleibt die Quelle der Kennzahlen sichtbar und der unberechnete Zeitraum rechts wird explizit als *keine Prognose* markiert.
- **Lahoutifard / CEO:** Die Amortisation bleibt der zentrale Zeitpunkt. Die transparenten Bereiche unter und über der Nulllinie unterstützen die Aussage, ohne zusätzliche Ereignisboxen zu erzeugen.
- **CIO:** Null-Linie, Euro-Skala und Zeitachse müssen direkt am Diagramm überprüfbar sein; die vollständige Kosten-/Monatsrechnung bleibt im Finance-Anhang.
- **COO:** Die rote Fläche zeigt einen negativen kumulierten **wirtschaftlichen** Saldo, nicht den Finanzierungsbedarf; die grüne Fläche einen positiven Modellwert, keinen realisierten Cash-Zufluss.
- **Budgetverantwortliche Geschäftsbereichsleitung:** Die drei Kernergebnisse sollen ohne Legendenstudium erkennbar sein. Der offengehaltene Raum nach dem Betrachtungszeitraum darf kein zusätzliches wirtschaftliches Ergebnis suggerieren.

### Technische Abnahmekriterien

- Rote und grüne Flächen jeweils geometrisch an der tatsächlichen Nullüberschreitung getrennt, selbst bei mehrmaligem Wechsel zwischen Plus und Minus; nur bis zum letzten vorhandenen Monatswert gefüllt.
- Gleichartige **Berechnung der Polygone**, Euro-Achsenwerte und visuellen Zusatzmonate für Formular und Kunden-PDF. **Keine** extrapolierten Salden nach dem Modellhorizont.
- Sichtbare horizontale Zeitachse mit Ticks, vertikale Geldachse mit gerundeten EUR-Referenzen, dominante Nullreferenz und dezente Hilfslinien.
- Drei Marker: Tiefstsaldo (nur unter 0), anhaltender wirtschaftlicher Ausgleich (nur bei tatsächlichem Modell-Break-even) und Endsaldo.
- Lesbarkeit und Farben in Desktop/Mobile sowie A4-Originalseiten manuell kontrollieren, fehlende Amortisation und wechselnde Vorzeichen durch Unit-Tests abdecken.

Die Review-Rollen sind weiterhin **simuliert**; es gab weder Autoreninterviews noch Gespräche mit fünf realen Economic Buyern.


## V4: Bedingte Fortführung nach Modellende, 10.10.2026

**Anlass:** Das offene Diagrammende lenkt den Blick stärker auf die lange negative Investitionsphase als auf den möglichen wirtschaftlichen Nutzen nach der Amortisation. Die rote Fläche bleibt korrekt, aber der grüne Verlauf soll nach Erreichen des Break-even sichtbar und als *Illustration* weitergeführt werden.

**Evidenzbasis, keine Interviews:** Andy Whytes M1/M2- und Economic-Buyer-Grundsätze sowie Lahoutifards Payback-Argumentation sind die fachliche Leitplanke. Ergänzend empfehlen die [IBCS-Standards](https://www.ibcs.com/standards/page/4/) eine klar unterscheidbare Kennzeichnung von Plan- und Forecastdaten. Eine [experimentelle Bank-of-England-Studie von 2026](https://www.bankofengland.co.uk/working-paper/2026/anchors-aweigh-the-effect-of-communicating-forecast-uncertainty) zeigt für Prognosekommunikation in anderen Kontexten, dass visuelle Unsicherheitskennzeichnung verständlich sein und Reputation vor irreführenden Ankern schützen kann. **Diese Studie untersucht keine B2B-Softwarekäufer und belegt keine höhere Abschlussquote.** Es wurden keine fünf realen Economic Buyer befragt.

### Fünf weitere simulierte Perspektiven

| Rolle | Einwand | Gestalterische/technische Antwort |
| --- | --- | --- |
| CFO | „Woher kommt diese Entwicklung nach Monat 36? Sind die Monatskosten darin enthalten?“ | Reine mathematische Fortführung des **monatlichen Nettobeitrags** (Vorteile abzüglich Kosten) der letzten drei Modellmonate. Nur bei positivem Endsaldo und positiven, weitgehend stabilen letzten drei Beiträgen. Kein zusätzlicher Nutzen und keine Liquiditäts- oder Budgetaussage. |
| CEO | „Was bringt der erreichte Ausgleich danach?“ | Deutlich grün gestrichelte steigende Linie mit leichter grüner Fläche; keine neue Kennzahl, die mit dem berechneten Endsaldo verwechselt werden könnte. |
| CIO | „Steigen SaaS-Gebühren oder Vertragskosten nach dem Modellende?“ | Genau deshalb ist die Fortschreibung **bedingt**. Sie findet nicht statt, wenn sich der Schluss-Nettobeitrag im Modell bereits unstet entwickelt. Die echte Vertragsfortschreibung muss vor einer Kundenentscheidung separat geprüft werden. |
| COO | „Sind Prozesseinsparungen dauerhaft realisierbar?“ | Unbestätigte Metrics bleiben im PDF explizit ausgewiesen. Die Fortführung basiert ausschließlich auf dem bereits kalkulierten Nettobeitrag und darf nicht als validierter operativer Effekt bezeichnet werden. |
| Geschäftsbereichsleiter mit Budgethoheit | „Wie unterscheide ich sicher die Rechnung und die Geschichte darüber?“ | Blau durchgezogene Linie bis zum Modellhorizont, **grün gestrichelte** anschließende Illustration; direkte Formulierung „Beispiel bei unverändertem monatlichem Nettobeitrag“. Kein zweiter Break-even und keine unbestätigten kumulierten Ist-Ergebnisse. |

### Rechenregel und Negativfälle

- Beim 36-Monats-Modell maximal 6 illustrative Folgemonate, beim 60-Monats-Modell maximal 12.
- Monatlicher Beitrag = arithmetischer Mittelwert der drei letzten **inkrementellen** Monatssalden, jeweils aus der vorhandenen Monatsengine. Die Werte müssen positiv sein und höchstens 15 % vom Mittel abweichen.
- Wenn der wirtschaftliche Saldo am Modellende ≤ 0 ist, die letzten Beiträge sinken/wechseln, die Monatsfolge Lücken enthält oder die Daten nicht endlich sind: **keine Fortführung**.
- Die Illustration nutzt denselben Maßstab wie der berechnete Verlauf, wird **nicht** den echten 36-/60-Monats-KPIs oder dem Finance-Ergebnis hinzugerechnet und wird nicht als statistische Prognose oder garantierter Gewinn bezeichnet.
- Web und PDF nutzen dieselbe Datenfunktion `illustrativeBalanceContinuation`. Die visuellen Flächen werden an der Nulllinie getrennt, der anschließende Bereich ist nur bei gültiger Bedingung grün eingefärbt.
- Tests für konstanten Endbeitrag, schwankende/negative Werte, Lücken, fehlenden positiven Endsaldo, 36/60 Monate, tatsächlichen Browser-Screenshot und das A4-PDF-Rendering.

**Freigabekriterium:** Die Linienfortsetzung muss auf den tatsächlichen Desktop-, Mobil- und PDF-Originalen klar als bedingtes Beispiel erkennbar sein. Keine persönliche Freigabe durch Whyte, Lahoutifard oder Economic Buyer wird behauptet. Kundengespräche können erst mit echten, vom Nutzer benannten Teilnehmern organisiert werden.
