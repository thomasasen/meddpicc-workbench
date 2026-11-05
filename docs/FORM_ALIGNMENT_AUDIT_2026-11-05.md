# Projektweite Formularausrichtung – Audit und Qualitätssicherung

Stand: 05.11.2026.

## Abgedeckte Formularsysteme

| Bereich | Formularraster | Maßnahme |
| --- | --- | --- |
| Go-Live-Rückwärtsplanung | `reverse-context-grid`, `reverse-step-fields` | gemeinsames Control-Raster inklusive Hilfetexten und dynamischen Prozessschritten |
| Quick Payback / Softwareprojekt | `software-fields`, `software-report-story` | wiederholte Kosten-, Nutzen- und Berichtsfelder; auch bedingt sichtbare Eingaben |
| Metric Builder | `metric-fields`, `metric-timing` | je Wizard-Schritt gleiche Oberkante; lange fachliche Labels und Hilfetexte |
| Cost of Delay | `cod-field-row` | zweispaltige Eingaben, einspaltige übrige Gruppen unverändert |
| Value Bridge | `vb-fields-two` | Metrics und Zeitachsen auch bei dynamischen Einträgen |
| Dokumentgestaltung | `branding-color-row` | Text- und Farbauswahl auf gemeinsamer Control-Linie |
| Interne Arbeitsformulare | `evidence-form`, `work-object-form` | zwei-/einspaltige Felder der Evidenz-, Referenz- und Aufgabenansichten |

Einspaltige Formulare (z. B. die **Schnellberechnung** in Quick Payback) brauchen keine nebeneinanderliegenden Control-Ausrichtungen; sie behalten ihren natürlichen vertikalen Lesefluss.

## Gemeinsame Norm

- Label → gleich hohe `input`-/`select`-Controls (46 px) → optionale Hilfe-/Fehlertexte darunter.
- Textareas und Sondercontrols dürfen von 46 px abweichen; **ihre Oberkante** entspricht der Control-Linie.
- Gemeinsame CSS-Subgrid-Zeilen über angrenzende Felder; ohne Subgrid konsistente Label-Mindesthöhen als Fallback.
- Responsive Neubildung von Zeilen bewahrt die gleiche Ausrichtung innerhalb jeder Zeile.
- Keine Änderung an MEDDPICC-Rechenfunktionen, Exportformaten oder gespeicherten Daten.

## Kritische Prüfszenarien

- Lange oder umgebrochene Labels dürfen das jeweilige Control nicht versetzen.
- Nur einzelne Felder mit Hilfe-/Fehlertext dürfen das Control nicht nach oben verschieben.
- Hidden/conditional Widgets dürfen keine alten Kontrollhöhen oder Positionen zurücklassen.
- Formularzeilen in 375/768/1024/1440 px werden anhand der **gerenderten Bounding Boxes** geprüft, nicht nur per CSS-Inspektion.
- Dynamische Wizard-Schritte, Softwareprojekt-Kosten/Metrics sowie die Go-Live-Ansicht benötigen eigene konkrete Testzustände.
- Interne Legacy-Formulare dürfen durch gemeinsame Selektoren nicht ihre Checkbox-/Radio-/Upload-Struktur verlieren.

Die Red-Team-Prüfung hier ist **simuliert** und keine unabhängige externe Abnahme. Testergebnisse werden nach Abschluss der GitHub-CI ergänzt.
