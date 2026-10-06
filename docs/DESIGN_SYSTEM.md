# MEDDPICC Workbench Design System

## 1. Designziel

MEDDPICC Workbench ist ein operatives Werkzeug für komplexe B2B-Opportunities.

Die Oberfläche muss optimieren auf:

- **Seller-Aufgaben vor Datenpflege**
- schnelle Orientierung: „Was braucht in diesem Deal jetzt Aufmerksamkeit?“
- klare Trennung von Evidenz und Annahme
- hohe, aber beherrschbare Informationsdichte
- sichtbare Risiken und Gaps
- wenige klare nächste Aktionen
- nachvollziehbare Reasoning-Ergebnisse
- effiziente Drill-downs auf Evidence und Source Data
- wiederholbare Deal Reviews

Die Anwendung soll wie eine ernsthafte Enterprise Workbench wirken und nicht wie eine Marketing-Website.

## 2. Designrichtung

Das Design kombiniert vier Einflüsse:

1. **Accessible & Ethical** – Klarheit, semantische Controls, inklusive Interaktion
2. **Minimal / Swiss** – klare Hierarchie, zurückhaltende Gestaltung, konsistentes Grid
3. **Data-Dense Dashboard** – effizienter Platzgebrauch für komplexe Opportunity-Daten
4. **Drill-Down Analytics** – Übersicht zuerst, Details und Evidenz bei Bedarf

Diese Richtung wurde unter Nutzung der externen Referenz aus `UI_UX_REFERENCE.md` festgelegt.

### Gewünschter Charakter

- ruhig
- präzise
- professionell
- vertrauenswürdig
- analytisch
- kompakt
- vorhersehbar

### Vermeiden

- Glassmorphism
- Neon- oder „AI“-Gradienten
- dekorative 3D-Effekte
- Marketing-Hero-Muster in der Arbeitsoberfläche
- unnötige Animation
- verschachtelte Card-Strukturen ohne fachlichen Nutzen
- überdimensionierten Leerraum zulasten der Informationsdichte
- Status nur über Rot/Amber/Grün
- Charts als reine Dekoration

## 3. Projektsprache

Die Projektsprache ist **Deutsch**.

Normale UI-Texte, Labels, Buttons, Hilfetexte, Fehlermeldungen und Beschreibungen sind deutsch.

Etablierte MEDDPICC-Begriffe bleiben im Original:

- Metrics
- Economic Buyer
- Decision Criteria
- Decision Process
- Paper Process
- Champion
- Competition

Technische Identifier bleiben Englisch.

### Verbindliche Statusbegriffe im UI

- **Bestätigt**
- **Teilweise**
- **Annahme**
- **Unbekannt**
- **Risiko**

Diese Begriffe sind in allen Modulen konsistent zu verwenden.

## 4. Informationsarchitektur

Die Opportunity ist immer der primäre Kontext. Die primäre Navigation folgt **Verkäufer-Workflows**, nicht der Schema-Struktur.

Zielstruktur:

```text
Application Shell
├── Opportunity Context
│   ├── Account / Opportunity
│   ├── Wert / Forecast
│   ├── Target Close / Go-Live
│   └── Speicher-/Dirty-Status
├── Deal-Fokus
│   ├── aktuell wichtige Gaps / Risiken
│   ├── nächste Aktionen
│   └── vorhandene Qualification-Übersicht
├── Coaching-Workflows
│   ├── Deal prüfen
│   ├── nächste Aktion
│   ├── Qualification Gate
│   ├── Champion prüfen
│   ├── Economic Buyer
│   ├── Business Case
│   ├── Closing / Process
│   └── Meeting vorbereiten
├── Source Data / Drill-down
│   ├── Evidence / References
│   ├── MEDDPICC-Entities
│   ├── Risks / Actions
│   └── Historie
└── Review / Export
```

Noch nicht implementierte Coaching-Services dürfen nicht als funktionsfähige Navigation vorgetäuscht werden.

Standard-Interaktion:

**Seller-Frage → Finding/Empfehlung → Begründung → Evidence/Source Data → gezielte Korrektur oder Aktion**

Source-Data-Ansichten bleiben notwendig, sind aber sekundär. Beim Drill-down darf der Opportunity-Kontext nicht verloren gehen.

## 5. Layout

### Desktop

Baseline:

- Opportunity-Bar: ca. 56–64 px
- linke Navigation: ca. 232–248 px
- Hauptinhalt: flexibel
- kompakte 8-/12-Spalten-Grids, wenn sinnvoll
- Seiten-Padding: ca. 20–24 px
- Panel-Abstände: ca. 12–16 px

Die exakten Werte werden bei der Implementierung als Design Tokens festgelegt. Keine beliebigen Einzelwerte pro Komponente.

### Mittlere Breiten

- Navigation schmaler oder kompakter
- Cards/Panels von 3 → 2 → 1 Spalte umbrechen
- vollständige Statuslabels möglichst erhalten

### Kleine Displays

- Sidebar wird Drawer oder kompakte Navigation
- Hauptinhalt stapelt vertikal
- Tabellen dürfen horizontal scrollen, wenn das verständlicher ist als eine Transformation
- Opportunity-Identität und Speicherstatus bleiben erreichbar

Prüfbreiten ungefähr:

- 375 px
- 768 px
- 1024 px
- 1440 px

## 6. Spacing und Formen

4-px-Basissystem:

```text
space-1   4px
space-2   8px
space-3  12px
space-4  16px
space-5  20px
space-6  24px
space-8  32px
space-10 40px
```

Zurückhaltende Radien:

- Inputs/Buttons: 6 px
- Panels/Cards: 8 px
- Pills nur für echte kompakte Status-/Kategorieinformationen

Nicht jedes Label als Pill darstellen.

## 7. Typografie

Lokale/Systemfont-Strategie.

Standard:

```css
font-family:
  ui-sans-serif,
  system-ui,
  -apple-system,
  BlinkMacSystemFont,
  "Segoe UI",
  sans-serif;
```

`ui-monospace` nur für IDs, Schema-/Versionsdaten, Formeln oder technische Werte.

Empfohlene Hierarchie:

- Seitentitel: 24–28 px / 600–700
- Abschnittstitel: 18–20 px / 600
- Panel-Titel: 15–16 px / 600
- Body/Input: 14–16 px / 400–500
- kompakte Metadaten: 12–13 px / 500

Keine 10–11-px-Schrift nur zur künstlichen Verdichtung.

Lange deutsche Texte und englische Fachbegriffe müssen sicher umbrechen.

## 8. Farbmodell

Neutrale Basis plus eine zurückhaltende Akzentfarbe und semantische Statusfarben.

Erste Light-Theme-Richtung:

```text
background       #F6F8FB
surface          #FFFFFF
surface-muted    #F1F4F8
text             #172033
text-muted       #5F6B7A
border           #D7DEE7
accent           #2563EB
accent-strong    #1D4ED8
focus            #2563EB
```

Diese Werte werden Tokens. Keine verstreuten Hardcodes.

### Semantische Zustände

```text
Bestätigt    Grün-Familie
Teilweise    Amber-Familie
Annahme      Violett-Familie
Unbekannt    Neutral/Slate
Risiko       Rot-Familie
Information  Blau-Familie
```

Jeder Zustand benötigt zusätzlich Text und/oder Icon.

Bedeutung niemals nur über Grün/Rot vermitteln.

## 9. MEDDPICC-Statussemantik

Verbindliche Begriffe:

- **Bestätigt**
- **Teilweise**
- **Annahme**
- **Unbekannt**
- **Risiko**

In Detailansichten dürfen feinere Evidence-Klassifikationen sichtbar sein.

Ein Deal darf nicht allein wegen eines hohen Durchschnittsscores als „gesund“ gelten.

Ein Confidence Score beschreibt Qualifizierungs-/Evidence Confidence und **keine Win Probability**.

## 10. Deal-Fokus / Startseite

Die Startseite ist kein klassisches KPI-Dashboard, sondern die **operative Einstiegsfläche für den Deal**.

Primäre Frage:

> Was braucht in diesem Deal jetzt meine Aufmerksamkeit und wo arbeite ich weiter?

Empfohlene Reihenfolge:

1. kompakter Opportunity- und Speicher-Kontext
2. aktuell wichtigste belegte Gaps / Risiken
3. nächste offene Aktionen
4. verfügbare Arbeits-/Coaching-Workflows
5. kompakte MEDDPICC-Statusübersicht
6. nachgelagerte Detailinformationen

Sobald Deal Inspector und Next Best Action implementiert sind, werden deren erklärbare Findings gegenüber manuellen Listen priorisiert.

Kein Dashboard voller gleichgewichteter KPI-Cards, kein Marketing-Hero und keine künstliche globale Deal-Health-Zahl.

### MEDDPICC-Zusammenfassung

Kompakte Liste oder Bullet-artiger Vergleich statt Radar-/Spider-Chart.

Beispiel:

```text
Metrics            Bestätigt   7/10 Evidence Confidence
Economic Buyer     Teilweise   5/10 Evidence Confidence
Decision Criteria  Bestätigt   8/10 Evidence Confidence
Paper Process      Risiko      3/10 Evidence Confidence
```

Statuslabel ist primär, numerische Confidence sekundär und erklärbar.

## 11. Cards und Panels

Cards nur verwenden, wenn sie echte Gruppierung schaffen.

Keine „Card in Card in Card“-Strukturen.

Standard-Panel:

- kurzer Titel
- optional Status/Metadaten
- Hauptinhalt
- konsistent platzierte Aktionen
- Icon nur, wenn es Erkennung verbessert

Border/Background-Hierarchie vor starken Schatten bevorzugen.

## 12. Formulare

Regeln:

- jedes Feld sichtbar beschriften
- fachlich gruppieren, nicht nach Datenbankstruktur
- ungewöhnliche Felder kurz erklären
- Pflicht/optional eindeutig
- Validierung direkt beim Problem
- Eingaben nach Fehlern erhalten
- passende native Input-Typen
- „unbekannt/noch nicht bekannt“ zulassen
- Wechsel von Annahme zu bestätigter Evidenz bewusst sichtbar machen

Keine riesigen Single-Page-Formulare für ganz MEDDPICC.

Keine CRUD-Maske allein deshalb bauen, weil ein Objekt im Schema existiert. Formulare sollen möglichst in einen konkreten Seller-Workflow eingebettet sein und nur die Informationen abfragen, die für die aktuelle Aufgabe benötigt werden.

## 13. Evidenz

Evidenz ist ein First-Class-Objekt und muss sich visuell von Schlussfolgerungen unterscheiden.

Scannbare Evidenzdarstellung:

- Klassifikation
- Aussage
- Quelle/Person
- Rolle
- Datum
- Kontext/Referenz
- verknüpfte MEDDPICC-Bereiche

Von einer Qualifizierungsaussage muss ein klarer Weg zur stützenden Evidenz existieren.

Annahmen dürfen niemals wie bestätigte Evidenz aussehen.

## 14. Risiken und Aktionen

Risiken zeigen:

- Schweregrad
- kurzen Titel
- Auswirkung
- zugehörigen MEDDPICC-Bereich/Prozess
- Status
- Mitigation/nächste Aktion, falls vorhanden

Nächste Aktionen zeigen:

- Aktion
- Owner
- Fälligkeitsdatum, falls bekannt
- zugehöriges Gap
- gewünschte Evidenz bzw. gewünschtes Ergebnis

Nicht jede Warnung optisch als kritisch darstellen.

## 15. Tabellen

Typische Bereiche: Evidenz, Risiken, Aktionen, Criteria, Historie und Prozesse.

Regeln:

- eindeutige Header
- sinnvolle Ausrichtung
- Zahlen konsistent ausrichten
- Sortierung nur, wenn hilfreich
- Sortierzustand semantisch ausweisen
- fokussierte/ausgewählte Zeilen sichtbar
- langen Business-Text umbrechen
- bei unvermeidbarer Kürzung vollständigen Wert zugänglich machen
- horizontalen Overflow statt Clipping
- Row Actions per Tastatur und Touch erreichbar

Auf schmalen Displays bewusst zwischen scrollbarer Tabelle und Record-Liste entscheiden.

## 16. Decision Process und Paper Process

Prozess-/Timeline-Visualisierung nur verwenden, wenn sie Abhängigkeiten besser verständlich macht.

Jeder visuelle Schritt braucht eine textuelle Repräsentation mit:

- Titel
- Owner
- Status
- geplantem/bestätigtem Datum
- Dauer
- Abhängigkeiten
- Evidenz
- Risiko/Gap

Drag-and-Drop darf niemals die einzige Bearbeitungsmöglichkeit sein.

## 17. Charts und Berechnungen

Wenn Präzision wichtig ist, Direktwerte und Tabellen bevorzugen.

Geeignet:

- Bullet-/Progress-Vergleiche für mehrere Confidence-/Evidence-Maße
- horizontale Bars für Kategorien
- Line Charts für echte Zeitreihen
- Timeline/Gantt-artige Darstellung für Prozessabhängigkeiten
- einfacher Waterfall nur bei echtem Value Bridge Use Case

Standardmäßig vermeiden:

- Radar-/Spider-Charts
- Gauges
- Donut Charts für präzise Vergleiche
- 3D-Charts
- dekorative Heatmaps

Charts müssen:

- für wesentliche Inhalte Text-/Tabellenalternative haben
- nicht nur auf Farbe beruhen
- bei Interaktivität per Tastatur zugänglich sein
- wichtige Details auch ohne Hover bereitstellen

## 18. Interaktion und Motion

Motion erklärt Zustandsänderung und dekoriert nicht.

- kurze, zurückhaltende Transitions
- keine permanente Bewegung außer sinnvollen Loading-/Progress-Indikatoren
- `prefers-reduced-motion` respektieren
- Aufgaben niemals für Animation verzögern
- keine animierten Score-Shows

## 19. Icons

Als verbindliche primäre Icon-Bibliothek verwenden wir **Lucide** über das Vue-Paket `@lucide/vue`.

- Icons direkt aus `@lucide/vue` importieren und mit der App bundlen
- keine Icon-CDNs oder Remote-Icon-Requests
- Icons ergänzen Text bei wichtigen Aktionen und Status
- MEDDPICC-Fachbegriffe niemals durch Icons allein ersetzen
- Icon-only Buttons nur für allgemein bekannte kompakte Aktionen und mit zugänglichem Namen
- keine Emojis als Navigations-/Statusicons
- semantische Bedeutung nie nur über Icon oder Farbe vermitteln
- vorhandene Zuordnungen nicht pro Screen neu erfinden

Die verbindliche Icon-Matrix, Größen, Accessibility-Regeln und Einsatzbereiche stehen in [ICON_SYSTEM.md](ICON_SYSTEM.md).

## 20. Accessibility-Baseline

Mindestens:

- semantische Landmarks
- logische Heading-Hierarchie
- vollständige Tastaturbedienung
- sichtbarer Fokus
- korrekt verknüpfte Labels
- zugängliche Fehler
- korrekte Button-/Link-Semantik
- ausreichender Kontrast
- keine Bedeutung nur über Farbe
- Reduced-Motion-Unterstützung
- keine essenziellen Hover-only-Inhalte
- Layout stabil bei Zoom/Textskalierung
- korrektes Dialog-Focus-Management
- nichtvisuelle Chart-Alternativen

## 21. Privacy und externe Assets

Default-Regeln:

- keine Google-Fonts-Requests
- kein CDN-JavaScript
- keine Remote-Icon-Library zur Runtime
- keine Analytics-/Tracking-Scripts mit Opportunity-Kontext
- kein automatisches Fetching von URLs aus `.meddpicc`-Dateien

Externe Runtime-Ressourcen benötigen ausdrückliche Architektur- und Privacy-Prüfung.

## 22. Design Tokens

Bei Implementierungsstart zentrale Tokens mindestens für:

- Farben
- Spacing
- Typografie
- Radii
- Borders
- Focus Ring
- Control Heights
- Sidebar-/Header-Maße
- z-index Layer
- Motion Durations

Komponenten konsumieren Tokens statt eigene Einzelwerte zu erfinden.

## 23. UI-Qualitätscheckliste

Vor Merge einer UI-Änderung:

- [ ] Der Screen löst eine konkrete Seller-Aufgabe oder unterstützt einen klaren Drill-down.
- [ ] Die UI bildet nicht bloß Schema-/CRM-Struktur nach.
- [ ] Opportunity-Kontext bleibt klar.
- [ ] Wichtigstes Gap / wichtigste Aktion ist schnell sichtbar.
- [ ] Bestätigt/Teilweise/Annahme/Unbekannt/Risiko funktioniert nicht nur über Farbe.
- [ ] Tastaturnavigation funktioniert.
- [ ] Fokus ist sichtbar.
- [ ] Lange Labels/Werte brechen das Layout nicht.
- [ ] 375/768/1024/1440 px wurden berücksichtigt.
- [ ] Zoom/Textskalierung clippt keine wesentlichen Inhalte.
- [ ] Jeder Chart ist begründet und hat eine nichtvisuelle Alternative.
- [ ] Motion respektiert Reduced Motion.
- [ ] Keine unnötige Runtime-Netzwerkabhängigkeit wurde hinzugefügt.
- [ ] Normale UI-Sprache ist Deutsch; MEDDPICC-Fachbegriffe bleiben korrekt.
- [ ] Noch nicht implementierte Reasoning-/Coaching-Logik wird nicht vorgetäuscht.
- [ ] Der Screen wirkt wie ein Teil eines konsistenten Produkts.
