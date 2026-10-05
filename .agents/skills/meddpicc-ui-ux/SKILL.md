---
name: meddpicc-ui-ux
description: Wendet das MEDDPICC-Workbench-Designsystem und die UI/UX-Qualitätsregeln bei Screens, Komponenten, Formularen, Tabellen, Dashboards, Charts, Navigation, Responsive-Verhalten und Accessibility an.
---

# MEDDPICC Workbench UI/UX Skill

Diesen Skill bei jeder UI-Implementierung oder UI-Review in diesem Repository verwenden.

## 1. Projektkontext laden

Lesen:

- `docs/DESIGN_SYSTEM.md`
- `docs/ARCHITECTURE.md`
- `docs/PROJECT_CHARTER.md`

Wenn die Aufgabe Projektdatei-Inhalte oder Evidenz-Semantik betrifft, zusätzlich:

- `docs/PROJECT_FILE_SPEC.md`

## 2. Projektsprache beachten

Die Projektsprache ist Deutsch.

Normale UI-Texte, Labels, Buttons, Hilfetexte, Fehlermeldungen und Beschreibungen sind deutsch.

MEDDPICC-Fachbegriffe bleiben im Original, z. B.:

- Metrics
- Economic Buyer
- Decision Criteria
- Decision Process
- Paper Process
- Champion
- Competition

Technische Namen und Code-Identifier bleiben Englisch.

Statuslabels im UI:

- Bestätigt
- Teilweise
- Annahme
- Unbekannt
- Risiko

## 3. Produktdesign anwenden

Das Produkt ist eine **Enterprise Sales Workbench**, keine Marketing-Site.

Primäre Design-Einflüsse:

- Accessible & Ethical
- Minimalism / Swiss-style hierarchy
- Data-Dense Dashboard
- Drill-Down Analytics

Die Workbench soll ruhig, präzise, professionell und operativ wirken.

Kein dekoratives Glassmorphism, keine Neon-/AI-Gradienten, keine übergroßen Marketing-Hero-Bereiche, kein Parallax, keine dekorative Bewegung und keine optisch beeindruckenden Charts ohne echten Nutzen für eine Sales-Entscheidung.

## 4. MEDDPICC-Semantik schützen

Qualifizierungsstatus muss ohne Farbe verständlich sein.

Explizite Labels/Icons verwenden für:

- Bestätigt
- Teilweise
- Annahme
- Unbekannt
- Risiko

Evidence Confidence niemals als Win Probability darstellen.

Jede abgeleitete Warnung oder Bewertung soll die zugrunde liegende Begründung bzw. Eingabe nachvollziehbar machen.

## 5. Informationsarchitektur

Standardhierarchie:

```text
Opportunity
├── Übersicht
│   ├── Deal Health
│   ├── Kritische Gaps
│   ├── Risiken
│   └── Nächste Aktionen
├── MEDDPICC
│   ├── Metrics
│   ├── Economic Buyer
│   ├── Decision Criteria
│   ├── Decision Process
│   ├── Paper Process
│   ├── Pain
│   ├── Champion
│   └── Competition
├── Evidenz
├── Risiken
├── Aktionen
├── Tools
└── Historie / Export
```

Overview → Detail → Evidenz als Drill-Down nutzen. Kontext erhalten und Rücknavigation eindeutig machen.

## 6. Komponentenregeln

### Formulare

- sichtbare Labels
- sinnvolle fachliche Gruppierung
- klare Unterscheidung zwischen Pflichtfeld und optional
- Validierung direkt am Problem
- Placeholder nicht als Ersatz für Label
- Eingaben bei Validierungsfehlern erhalten
- destruktive Aktionen eindeutig bestätigen

### Tabellen

- Spaltenbedeutung eindeutig
- horizontalen Overflow oder bewusstes Responsive-Layout statt Clipping
- Sticky Header nur bei echtem Nutzen
- Sortierzustand semantisch ausweisen
- lange Account-, Personen- und Dokumentnamen umbrechen oder vollständig zugänglich machen
- sinnvolle Empty States

### Status und Badges

- Text/Icon + Farbe
- niemals Farbe allein
- Pills/Badges sparsam einsetzen
- Statusvokabular über alle Module stabil halten

### Dialoge und Overlays

- Fokus korrekt binden und anschließend zurückgeben
- Escape schließt, wenn fachlich sicher
- aktuellen Kontext nicht unnötig verdecken
- verschachtelte Dialoge vermeiden

### Navigation

- aktuelle Sektion visuell und programmatisch erkennbar
- Tastaturnavigation vollständig
- geladene Opportunity im Application Chrome sichtbar halten

## 7. Charts und Visualisierungen

Zuerst prüfen: Kommuniziert ein Direktwert, eine Tabelle, Liste oder Timeline die Information besser?

Bevorzugte Fälle:

- Bullet-/Progress-Vergleich für mehrere Evidence-/Confidence-Werte
- einfache Balken für Vergleiche
- Timeline/Prozessdarstellung für Decision-/Paper-/Go-Live-Abhängigkeiten
- Line Chart nur bei echten Zeitreihen

Nicht standardmäßig verwenden:

- Gauges
- Donut Charts
- Radar-/Spider-Charts
- 3D-Charts
- dekorative Heatmaps

Für wesentliche Chart-Informationen immer eine zugängliche Text-/Tabellenalternative anbieten.

## 8. Accessibility Review

Prüfen:

- semantisches HTML
- vollständige Tastaturbedienung
- sichtbarer Fokus
- zugängliche Namen
- korrekte Zustandsattribute
- Kontrast
- keine Bedeutung nur durch Farbe
- `prefers-reduced-motion`
- keine essenziellen Hover-only-Informationen
- Zoom/Textskalierung ohne Clipping
- ausreichend große Touch Targets
- Fehler korrekt Controls zugeordnet/angekündigt

## 9. Responsive Review

Ungefähr prüfen bei:

- 375 px
- 768 px
- 1024 px
- 1440 px

Kein separates Mobile-Produkt bauen, wenn Reflow genügt:

- Sidebar → Drawer/kompakte Navigation
- mehrspaltige Panels → gestapelte Bereiche
- Tabellen → Scroll oder bewusstes Responsive-Layout
- Action Bars → umbrechen, ohne Labels zu verlieren

## 10. Vue-Implementierung

Bevorzugen:

- Vue 3 Composition API
- `<script setup lang="ts">`
- `computed` für abgeleitete UI-Werte
- Pinia nur für geteilten Application State
- Route-Level Lazy Loading, wenn sinnvoll
- semantische native Elemente
- typisierte Props und Emits
- Verhalten testen, nicht interne Implementierungsdetails

## 11. Externe UI/UX-Referenz

Das Projekt darf konsultieren:

`nextlevelbuilder/ui-ux-pro-max-skill`

Den gepinnten Stand und die Provenienz aus `docs/UI_UX_REFERENCE.md` verwenden.

Besonders nützliche Upstream-Bereiche:

- Vue-Guidance
- UX-/Accessibility-Regeln
- Data-Dense-Dashboard-Muster
- Drill-Down-Muster
- Chart-Auswahl und Chart-Accessibility

Nicht den gesamten Upstream-Skill kopieren und nicht als Produktions-/Runtime-Abhängigkeit hinzufügen.

## Definition of Done

Eine UI-Änderung ist erst fertig, wenn sie:

- `docs/DESIGN_SYSTEM.md` entspricht
- per Tastatur bedienbar ist
- responsive funktioniert
- MEDDPICC-Statussemantik explizit darstellt
- keine unnötigen Runtime-Netzwerkabhängigkeiten enthält
- mit realistischen, dichten B2B-Daten lesbar bleibt
- normale UI-Sprache auf Deutsch verwendet
- auf geeigneter Unit-/Component-/Browser-Ebene getestet wurde
