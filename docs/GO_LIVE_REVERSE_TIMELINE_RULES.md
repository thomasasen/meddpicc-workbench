# Go-Live-Rückwärtsplanung v0.1 – fachliche Herleitung

## Zweck

Das Microtool beantwortet:

> Wenn der Kunde zu einem bestimmten Termin live sein will, wann müssen die davorliegenden Schritte spätestens beginnen?

Der Output ist bewusst kundenfähig.

## Primärquelle

Andy Whyte – *MEDDICC: The ultimate guide to staying one step ahead in the complex sale*

Relevanter Abschnitt: **The Go-Live Plan**

Whyte beschreibt den Go-Live Plan als kundenfokussiertes, kollaboratives und lebendes Dokument.

Quellengestützte Prinzipien:

- Der Fokus liegt auf dem Go-Live des Kunden und nicht nur auf dem Close des Sellers.
- Der Plan sollte gemeinsam mit dem Kunden bzw. Champion entwickelt werden.
- Die Planung ist besonders wirksam, wenn sie vom gewünschten Go-Live **rückwärts** erfolgt.
- Durch die Rückwärtsplanung werden wichtige Meilensteine und Abhängigkeiten früh sichtbar.
- Whyte nennt unter anderem Legal, Security und Procurement als Schritte, deren Timing dadurch früher erkannt werden kann.
- Das Sichtbarmachen dieser Zeitbedarfe kann Urgency erzeugen und die Forecast-Qualität verbessern.

## Ergänzende Einordnung

Darius Lahoutifard behandelt Decision Process und Paper Process als relevante, zu verstehende Schritte auf dem Weg zur
Kaufentscheidung bzw. zum Abschluss. Die konkrete Rückwärtsplanung als Tool-Mechanik wird für v0.1 jedoch primär aus
Whytes Go-Live-Plan-Abschnitt hergeleitet.

## Product Inference

Folgende Punkte sind unsere konkrete Operationalisierung und keine behauptete offizielle MEDDPICC-Formel:

- Nutzer gibt ein Ziel-Go-Live an.
- Schritte werden in der Reihenfolge „direkt vor Go-Live“ nach rückwärts erfasst.
- Jeder Schritt besitzt eine Dauer in Arbeitstagen.
- Optional kann ein Owner angegeben werden.
- Die Engine rechnet die Schritte deterministisch rückwärts.
- Das Ergebnis zeigt den spätesten Startpunkt jedes Schritts.
- Die Timeline wird kundenfähig visualisiert und exportiert.

## Arbeitstage v0.1

v0.1 definiert Arbeitstage als Montag bis Freitag.

Nicht automatisch berücksichtigt:

- gesetzliche Feiertage
- kundenspezifische Betriebsferien
- regionale Kalender
- parallele Schritte
- komplexe Dependencies
- Ressourcenengpässe

Diese Grenzen werden im UI und im Export transparent genannt.

## Reihenfolgeregel

Der erste Eingabeschritt liegt direkt vor dem Ziel-Go-Live.

Beispiel:

1. Implementierung
2. Vertrag & Signatur
3. Legal / Datenschutz / Security
4. Procurement
5. finale Entscheidung

Die Berechnung läuft vom Go-Live in dieser Reihenfolge rückwärts. Die Ergebnis-Timeline wird anschließend chronologisch
vom frühesten notwendigen Start bis zum Go-Live dargestellt.

## Kein künstlicher Forecast

Das Tool berechnet keine Win Probability und behauptet nicht, dass ein Termin garantiert erreicht wird.

Es beantwortet ausschließlich die Terminfrage auf Basis der eingegebenen Dauern.

## Export

Kundenfähige Ausgabe:

- SVG
- PNG
- Druck / PDF

Die Exporte werden lokal im Browser erzeugt.
