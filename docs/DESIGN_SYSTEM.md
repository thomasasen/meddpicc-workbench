# MEDDPICC Toolbox Design System

## 1. Designziel

Die Oberfläche unterstützt fokussierte Sales Services und vermeidet bewusst CRM-/Dashboard-Anmutung.

Die Startseite beantwortet zuerst die Frage:

> **Was möchtest du gerade tun?**

Dafür gibt es drei primäre Einstiege:

1. **Tools** – Arbeit vereinfachen
2. **Checklists** – nichts Wichtiges vergessen
3. **Knowledge** – schnell nachschlagen

MEDDPICC bleibt als fachliche Orientierung sichtbar, aber nicht als erzwungener End-to-End-Workflow.

## 2. Designrichtung

- professionell
- ruhig
- präzise
- B2B-tauglich
- informationsdicht, aber nicht dashboard-lastig
- neutrale Flächen mit zurückhaltender Akzentfarbe
- keine Glassmorphism-, Neon-, AI-Gradient- oder Marketing-Hero-Optik

## 3. Startseite

### Hero

Der Hero erklärt in einem Satz, **welche Arbeit die Toolbox erleichtert**. Interne Produktabgrenzungen wie „kein CRM“ gehören nicht in den Vordergrund der Produktoberfläche, solange sie für die konkrete Nutzung nicht erforderlich sind.

### Primäre Navigation

Drei gleichwertige Einstiegskarten:

- Tools
- Checklists
- Knowledge

### Tools

Tools werden nach konkreten Arbeitssituationen beziehungsweise Service-Clustern gruppiert, nicht ausschließlich nach MEDDPICC-Buchstaben.

Jeder Tool-Eintrag muss schon vor dem Öffnen verständlich beantworten:

- **Wann hilft mir das?**
- **Was gebe ich ungefähr hinein?**
- **Welches nutzbare Ergebnis bekomme ich?**
- **Wie spart oder erleichtert mir das konkret Arbeit?**

Aktive Services sind klar navigierbar. Geplante Services dürfen sichtbar sein, müssen aber eindeutig als geplant erscheinen.

### Checklists

Checklists werden nach wiederkehrenden Situationen benannt, zum Beispiel Economic-Buyer-Termin, Discovery, POC oder Closing.

Schon auf der Übersicht muss klar sein, **in welcher Situation** die Checklist genutzt wird und **welchen Fehler oder welches Vergessen** sie vermeiden hilft. Auf dem Checklist-Screen erklärt jeder Punkt seine fachliche Bedeutung so, dass er nicht falsch interpretiert wird.

### Knowledge

Knowledge zeigt MEDDPICC als fachliche Referenz. Jeder Eintrag wird als konkrete Verständnisfrage formuliert beziehungsweise beschreibt, **welche Unsicherheit er klärt**. Die acht Bereiche dienen der Orientierung und dürfen später auf Themenartikel führen.

## 4. Tool-Screen

Standardstruktur:

1. Tool-Kontext und Zweck
2. notwendige Eingaben
3. fachliche Berechnung / Auswertung
4. visuelles Ergebnis
5. zugängliche Text-/Tabellenalternative
6. Export, falls kundenfähig
7. Methodik-/Grenzen-Hinweis

Kein Tool darf einen vollständigen Opportunity-Datensatz allein aus Architekturgründen verlangen.

## 5. Checklist-Screen

Standardstruktur:

1. Situation oder Thema
2. kurze Prüfpunkte
3. Details nur bei Bedarf

Ein Punkt kann enthalten:

- Prüffrage
- Worum geht es?
- Warum ist das wichtig?
- Woran erkenne ich es?
- typische Fehlinterpretation
- mögliche Frage oder Handlung
- Mehr erfahren

Die Standardansicht muss schnell scanbar bleiben. Erklärungstiefe wird progressiv aufgeklappt.

Keine Deal-Gesamtbewertung, kein gespeicherter Score und kein permanenter Fortschrittsstatus.

## 6. Knowledge-Screen

- kurze Definition zuerst
- praktische Bedeutung direkt danach
- relevante Abgrenzungen sichtbar machen
- Beispiele nur zur Erklärung
- typische Fehlinterpretationen hervorheben
- Quellenunterschiede kenntlich machen, wenn fachlich relevant
- Verweise zu passenden Tools oder Checklists erlauben

## 7. Formulare

- jedes Feld sichtbar beschriften
- kurze Hilfetexte nur dort, wo Interpretation nötig ist
- fachlich gruppieren
- sinnvolle Defaults oder Vorlagen anbieten
- Validierung direkt beim Problem
- Eingaben nach Fehlern erhalten
- native Input-Typen nutzen

## 8. Kundenfähige Ergebnisse

Kundenfähige Ansichten sollen:

- ohne internes Coaching-Jargon verständlich sein
- Account-/Kundenname optional integrieren können
- klare Titel und Termine zeigen
- direkt als Bild oder Dokument weiterverwendbar sein
- keine internen Risiko-/Score-Informationen ungefragt exportieren
- skalierbare Formate wie SVG bevorzugen, zusätzlich PNG wenn sinnvoll

## 9. Charts und Timelines

Visualisierung nur, wenn sie die Aussage besser macht als reiner Text.

Für Prozess-/Timeline-Tools sind horizontale Zeitachsen oder strukturierte Phasen geeignet.

Jede Visualisierung braucht eine textuelle Alternative mit den wesentlichen Werten.

Keine Radar-Charts, Gauges, 3D-Charts oder dekorativen Diagramme.

## 10. Design Tokens

Bestehende zentrale Tokens für Farben, Spacing, Typografie, Radii, Borders, Focus und Motion weiterverwenden. Keine verstreuten Einzelwerte, wenn ein Token sinnvoll existiert.

## 11. Typografie

Systemfont-Strategie. Normale UI-Texte mindestens ca. 14–16 px, Metadaten nicht künstlich verkleinern. Lange deutsche und englische Fachbegriffe müssen sicher umbrechen.

## 12. Status und Farbe

Bedeutung niemals ausschließlich über Farbe vermitteln. Status immer zusätzlich als Text zeigen.

## 13. Accessibility

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

## 14. Responsive

Prüfbreiten ungefähr:

- 375 px
- 768 px
- 1024 px
- 1440 px

Desktop darf mehrere Spalten verwenden. Mobile stapelt Bereiche und Controls sinnvoll; horizontales Clipping ist zu vermeiden.

## 15. Icons

Lucide über `@lucide/vue` als primäre Icon-Bibliothek. Icons ergänzen Text und ersetzen Fachbegriffe nicht.

## 16. Privacy

Keine Runtime-CDNs, Analytics oder automatischen Requests mit Kundendaten. Local-first bleibt Standard.

## 17. UI-Qualitätscheck

Vor Merge:

- löst der Screen eine konkrete Aufgabe oder Verständnisfrage?
- versteht der Nutzer ohne Vorwissen, **wann** ihm dieser Service hilft?
- ist klar, **welches Ergebnis** er erhält und wie ihm das Arbeit erspart?
- ist Tools vs. Checklists vs. Knowledge klar?
- bleibt die Oberfläche frei von CRM-/Dashboard-Ballast?
- sind nur notwendige Inputs sichtbar?
- erklärt eine Checklist ihre Punkte ausreichend, ohne zum Lehrbuch zu werden?
- ist Kundenfähig vs. intern klar, wo relevant?
- ist das Ergebnis ohne zusätzliche Erklärung verständlich?
- ist die Aufgabe vollständig per Tastatur bedienbar?
- funktioniert Desktop und Mobile?
- hat jede Visualisierung eine nichtgrafische Alternative?
