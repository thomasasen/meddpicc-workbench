# MEDDPICC Toolbox Design System

## 1. Designziel

Die Oberfläche unterstützt konkrete MEDDPICC Microtools. Die Startseite ist ein klarer Werkzeugkatalog; innerhalb eines Tools stehen die notwendigen Eingaben und das verwertbare Ergebnis im Mittelpunkt.

Prioritäten:

- Aufgabe vor Datenpflege
- klare MEDDPICC-Zuordnung
- wenige, fachlich notwendige Inputs
- nachvollziehbare Resultate
- kundenfähige Ergebnisse, wenn der Use Case es erlaubt
- Accessibility und Responsive-Verhalten als Baseline

## 2. Designrichtung

- professionell
- ruhig
- präzise
- B2B-tauglich
- informationsdicht, aber nicht dashboard-lastig
- neutrale Flächen mit zurückhaltender Akzentfarbe
- keine Glassmorphism-, Neon-, AI-Gradient- oder Marketing-Hero-Optik

## 3. Startseite

Die Startseite listet die acht MEDDPICC-Bereiche:

- Metrics
- Economic Buyer
- Decision Criteria
- Decision Process
- Paper Process
- Identify / Implicate Pain
- Champion
- Competition

Unter jedem Bereich stehen Microtools als klare Aktionen.

Jedes Tool wird sichtbar als **Kundenfähig** oder **Intern** eingeordnet. Noch nicht implementierte Tools dürfen sichtbar geplant sein, aber nicht wie funktionsfähige Navigation wirken.

## 4. Tool-Screen

Standardstruktur:

1. Tool-Kontext und Zweck
2. notwendige Eingaben
3. fachliche Berechnung / Auswertung
4. visuelles Ergebnis
5. zugängliche Text-/Tabellenalternative
6. Export, falls kundenfähig
7. Methodik-/Grenzen-Hinweis

Kein Microtool darf einen vollständigen Opportunity-Datensatz allein aus Architekturgründen verlangen.

## 5. Formulare

- jedes Feld sichtbar beschriften
- kurze Hilfetexte nur dort, wo Interpretation nötig ist
- fachlich gruppieren
- sinnvolle Defaults oder Vorlagen anbieten
- Nutzer darf Schritte ergänzen, entfernen und sortieren, wenn der Workflow es erfordert
- Validierung direkt beim Problem
- Eingaben nach Fehlern erhalten
- native Input-Typen nutzen

## 6. Kundenfähige Ergebnisse

Kundenfähige Ansichten sollen:

- ohne internes Coaching-Jargon verständlich sein
- Account-/Kundenname optional integrieren können
- klare Titel und Termine zeigen
- direkt als Bild oder Dokument weiterverwendbar sein
- keine internen Risiko-/Score-Informationen ungefragt exportieren
- skalierbare Formate wie SVG bevorzugen, zusätzlich PNG wenn sinnvoll

## 7. Charts und Timelines

Visualisierung nur, wenn sie die Aussage besser macht als reiner Text.

Für Prozess-/Timeline-Tools sind horizontale Zeitachsen oder strukturierte Phasen geeignet.

Jede Visualisierung braucht eine textuelle Alternative mit den wesentlichen Werten.

Keine Radar-Charts, Gauges, 3D-Charts oder dekorativen Diagramme.

## 8. Design Tokens

Bestehende zentrale Tokens für Farben, Spacing, Typografie, Radii, Borders, Focus und Motion weiterverwenden. Keine verstreuten Einzelwerte, wenn ein Token sinnvoll existiert.

## 9. Typografie

Systemfont-Strategie. Normale UI-Texte mindestens ca. 14–16 px, Metadaten nicht künstlich verkleinern. Lange deutsche und englische Fachbegriffe müssen sicher umbrechen.

## 10. Status und Farbe

Bedeutung niemals ausschließlich über Farbe vermitteln. Status immer zusätzlich als Text zeigen.

## 11. Accessibility

Mindestens:

- semantische Landmarks
- logische Heading-Hierarchie
- vollständige Tastaturbedienung
- sichtbarer Fokus
- korrekt verknüpfte Labels
- ausreichender Kontrast
- keine Bedeutung nur über Farbe
- Reduced Motion
- keine essenziellen Hover-only-Inhalte
- stabile Darstellung bei Zoom/Textskalierung

## 12. Responsive

Prüfbreiten ungefähr:

- 375 px
- 768 px
- 1024 px
- 1440 px

Desktop darf mehrere Spalten verwenden. Mobile stapelt die Bereiche und Controls sinnvoll; horizontales Clipping ist zu vermeiden.

## 13. Icons

Lucide über @lucide/vue als primäre Icon-Bibliothek. Icons ergänzen Text und ersetzen MEDDPICC-Begriffe nicht.

## 14. Privacy

Keine Runtime-CDNs, Analytics oder automatischen Requests mit Kundendaten. Local-first bleibt Standard.

## 15. UI-Qualitätscheck

Vor Merge:

- löst der Screen eine konkrete Seller-Aufgabe?
- sind nur notwendige Inputs sichtbar?
- ist Kundenfähig vs. Intern klar?
- ist das Ergebnis ohne Erklärung verständlich?
- ist die Aufgabe vollständig per Tastatur bedienbar?
- funktioniert Desktop und Mobile?
- hat jede Visualisierung eine nichtgrafische Alternative?
- bleibt der Screen frei von CRM-/Dashboard-Ballast?
