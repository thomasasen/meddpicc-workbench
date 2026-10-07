# Go-Live-Rückwärtsplanung – Regeln v0.1

## Zweck

Das Microtool unterstützt Seller dabei, gemeinsam mit dem Kunden von einem gewünschten Go-Live rückwärts zu planen.

Es ist kein Forecasting-Modell und behauptet nicht, dass ein Deal zu einem Datum sicher abgeschlossen wird.

## Primärquellen

### Andy Whyte

Die Quelle beschreibt den Go-Live Plan als kundenorientierten und kollaborativen Plan. Besonders relevant für das Tool ist die Empfehlung, von einem Ziel-Go-Live rückwärts zu planen und dadurch wichtige Meilensteine wie Legal, Security oder Procurement früh sichtbar zu machen.

### Darius Lahoutifard

Die Quelle beschreibt Decision Process als schrittweisen Kundenvorgang und empfiehlt eine schriftliche bzw. visuelle Timeline. Für den Paper Process wird betont, den administrativen Ablauf Schritt für Schritt offenzulegen und früh zu antizipieren.

## Produktableitung

Die folgenden Regeln sind **Toolbox-Produktentscheidungen**, nicht als offizielle MEDDPICC-Formel behauptet:

1. Target Go-Live ist der feste Endpunkt.
2. Schritte werden in der Eingabemaske vom Go-Live rückwärts angeordnet. Die sichtbare Reihenfolge kann primär per Drag & Drop verändert werden; derselbe Drag-Griff unterstützt für Tastaturnutzung Pfeiltasten sowie Home/End.
3. Jeder Schritt besitzt Bezeichnung, Dauer, Kalender- oder Arbeitstage, Verantwortungsseite und Bereich; optional kann eine konkrete Person oder Rolle als Owner ergänzt werden.
4. Die Berechnung zieht Schritt für Schritt die Dauer vom jeweils späteren Meilenstein ab.
5. Arbeitstage sind Montag bis Freitag.
6. Feiertage werden nicht automatisch berücksichtigt.
7. Der späteste errechnete Start wird gegen ein explizites Planungsdatum verglichen.
8. Ein negativer Vorlauf wird als Kompressionsbedarf beschrieben, nicht als automatische Deal-Niederlage.
9. Die Kundenansicht verwendet eine zeitproportionale Executive-Timeline: Position und Breite eines Prozessbalkens ergeben sich aus den errechneten Start- und Enddaten.
10. Arbeitstage werden für die Darstellung nicht künstlich gleich breit gemacht; maßgeblich ist der daraus resultierende Kalenderzeitraum zwischen Start und Ende.
11. Änderungen an Dauer, Reihenfolge oder Target Go-Live aktualisieren die Visualisierung unmittelbar aus demselben deterministischen Plan.
12. Die Zeitachse verwendet verständliche Periodenmarken: bei kurzen Plänen Kalenderwochen, bei längeren Plänen Monatsgrenzen; spätester Start und Target Go-Live bleiben exakte Datumsanker.
13. Prozessdauer und Puffer zum notwendigen Start werden als unterschiedliche Kennzahlen ausgewiesen und dürfen nicht miteinander vermischt werden.
14. Übergaben zwischen sequenziellen Prozessschritten werden als Übergabepunkte visualisiert. Nicht jeder Übergang wird als fachlicher Key Milestone behauptet; daraus wird keine zusätzliche Abhängigkeits- oder Parallelisierungslogik abgeleitet.
15. Die Visualisierung besitzt immer eine textuelle Detaildarstellung, damit exakte Daten und Verantwortlichkeiten auch ohne Grafik verständlich bleiben. Diese darf in der Kundenansicht standardmäßig eingeklappt sein.
16. Die Grafik impliziert keine Parallelisierung oder Critical-Path-Logik. In v0.1 werden die eingegebenen Schritte weiterhin sequenziell rückwärts gerechnet.
17. Das optionale Feld „Warum dieses Datum?“ beschreibt einen kundenseitigen Termin-Treiber / Compelling Event und verändert die Datumsberechnung nicht. Rein sellerseitige Deadlines wie Quartalsende werden nicht als kundenseitiger Treiber dargestellt.
18. Die Kundenansicht heißt Go-Live-Timeline bzw. Rückwärtsplanung. Sie wird nicht als vollständiger Go-Live Plan ausgegeben.
19. SVG und PNG spiegeln denselben kundenfähigen Visualstil und dieselbe Semantik wider; interne Coaching-Wertungen werden dort nicht ergänzt.

Der detaillierte Quellenabgleich ist in `docs/REVERSE_TIMELINE_SOURCE_QA.md` dokumentiert.

## Grenzen v0.1

Nicht enthalten:

- Feiertagskalender
- parallele Abhängigkeiten
- echte Critical-Path-Logik
- Teilzeit-/Ressourcenkapazitäten
- automatische Kalenderintegration
- automatische Kundendatenübernahme
- PowerPoint-/PDF-Export
- kollaborative Echtzeitbearbeitung
