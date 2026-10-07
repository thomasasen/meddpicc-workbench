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
3. Jeder Schritt besitzt Bezeichnung, Dauer, Kalender- oder Arbeitstage, Verantwortlichkeit und Bereich.
4. Die Berechnung zieht Schritt für Schritt die Dauer vom jeweils späteren Meilenstein ab.
5. Arbeitstage sind Montag bis Freitag.
6. Feiertage werden nicht automatisch berücksichtigt.
7. Der späteste errechnete Start wird gegen ein explizites Planungsdatum verglichen.
8. Ein negativer Vorlauf wird als Kompressionsbedarf beschrieben, nicht als automatische Deal-Niederlage.
9. Die Visualisierung besitzt immer eine textuelle Detaildarstellung.
10. SVG und PNG sind kundenfähige Exportformate; interne Coaching-Wertungen werden dort nicht ergänzt.

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
