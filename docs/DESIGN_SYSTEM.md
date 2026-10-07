# Design System – MEDDPICC Toolbox

## Designziel

Die Oberfläche soll sich wie eine professionelle Sammlung von B2B-Sales-Werkzeugen anfühlen.

Nicht Dashboard zuerst, sondern:

**Werkzeug wählen → wenige Inputs → starkes Ergebnis**

## Startseite

Die Startseite listet die MEDDPICC-Bereiche sichtbar und gleichberechtigt auf:

- Metrics
- Economic Buyer
- Decision Criteria
- Decision Process
- Paper Process
- Identify / Implicate Pain
- Champion
- Competition

Unter jedem Bereich stehen die zugehörigen Microtools.

Nur implementierte Tools sind aktiv. Geplante Tools dürfen sichtbar sein, müssen aber eindeutig deaktiviert bzw. als
„Geplant“ markiert sein.

## Tool-Typen

### Kundenfähig

Output ist für Kundentermine, Workshops oder Präsentationen geeignet.

Kennzeichnung: „Kundenfähig“.

Anforderungen:

- neutrale Kundensprache
- keine internen Deal-Risiken im Export
- sauberer Titel / Kontext
- druck- bzw. präsentationstaugliche Visualisierung
- lokale Exportmöglichkeit, wenn sinnvoll

### Intern

Qualification-, Coaching- oder Deal-Inspection-Werkzeug.

Kennzeichnung: „Intern“.

Interne Interpretation darf nicht unabsichtlich im kundenfähigen Output landen.

## Layout eines Microtools

Desktop bevorzugt:

```text
Tool Header
Intro
+----------------------+----------------------------+
| minimale Eingaben    | Ergebnis / Vorschau        |
|                      |                            |
|                      | Export                     |
+----------------------+----------------------------+
```

Bei kleineren Breiten stapeln. Ergebnis darf vor den Inputs stehen, wenn dies die Orientierung verbessert.

## Inputs

- jedes Feld sichtbar beschriften
- nur wirklich notwendige Inputs
- ungewöhnliche Felder erklären
- keine versteckte Pflicht zur Opportunity-Pflege
- sinnvolle Defaults nur als klar erkennbare Beispiele
- Fehler direkt und verständlich anzeigen

## Ergebnisdarstellung

Präzision vor Dekoration.

Geeignet:

- Timelines
- Gantt-artige Pläne
- klare Tabellen
- Value Bridges
- einfache Balken / Direktwerte
- kundenfähige Zusammenfassungen

Vermeiden:

- Radar-Charts
- Gauges
- 3D
- dekorative Heatmaps
- globale Deal Health

## Stil

- professionell
- ruhig
- präzise
- neutral
- informationsdicht, aber nicht gedrängt
- klare Borders statt starker Schatten
- Systemfonts
- Lucide Icons
- keine externen Assets

## Farben

Basis:

- Hintergrund #F6F8FB
- Surface #FFFFFF
- Text #172033
- Muted #5F6B7A
- Border #D7DEE7
- Accent #2563EB

Kennzeichnungen müssen zusätzlich Text enthalten. Farbe allein trägt keine Bedeutung.

## Accessibility

- semantische Landmarks
- Tastaturbedienbarkeit
- sichtbarer Fokus
- zugängliche Labels
- keine Hover-only-Information
- Responsive
- Reduced Motion
- exportierte Charts im UI durch lesbare Daten ergänzen

## Print / Export

Kundenfähige Outputs sollen ohne Navigations- oder Editor-Ballast druckbar sein.

Exportgrafiken sollen:

- auf weißem Hintergrund funktionieren
- keine Remote-Fonts benötigen
- in Präsentationen lesbar bleiben
- Titel, Kontext und fachlich notwendige Hinweise enthalten
