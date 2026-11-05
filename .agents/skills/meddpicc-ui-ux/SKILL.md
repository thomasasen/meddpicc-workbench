---
name: meddpicc-ui-ux
description: Wendet das MEDDPICC-Workbench-Designsystem und die UI/UX-Qualitätsregeln bei Screens, Komponenten, Formularen, Tabellen, Dashboards, Charts, Navigation, Responsive-Verhalten und Accessibility an.
---

# MEDDPICC Workbench UI/UX Skill

Diesen Skill bei jeder UI-Implementierung oder UI-Review in diesem Repository **zusammen mit** `.agents/skills/apple-design/SKILL.md` verwenden.

**Konfliktregel:** Bei sich überschneidenden Vorgaben zu Interaktion, Animation, Gesten, Materialtiefe oder Typografie hat Apple Design Vorrang vor älteren Stil-Empfehlungen (einschließlich UI UX Pro Max). Fachliche Korrektheit, das aktuelle Microtool-Produktmodell, Accessibility, Datenschutz und Performance bleiben vorrangige Randbedingungen. Apple Design beschreibt keine Pflicht zu Effekten auf jeder Oberfläche. `AGENTS.md` und `docs/DESIGN_SYSTEM.md` konkretisieren diese Abgrenzung.

## 1. Projektkontext laden

Lesen:

- `docs/DESIGN_SYSTEM.md`
- `docs/ROADMAP.md`
- `docs/PROGRESS.md`
- `docs/ICON_SYSTEM.md` bei Icon-relevanten Aufgaben
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

Das Produkt ist eine **deterministische Enterprise Sales Coaching-/Reasoning-Workbench**, keine Marketing-Site und kein CRM.

Die wichtigste UX-Regel lautet:

> **Seller-Workflow vor Datenstruktur.**

Ein Screen unterstützt eine fokussierte Aufgabe: etwa Wirtschaftlichkeit berechnen, Kennzahlen entwickeln, Cost of Delay einschätzen, Value Bridge erstellen, Closing-Timeline planen oder eine Checklist/Wissensfrage klären. Legacy-Deal-Inspector und Qualification Gates sind keine Standard-Muster für neue Screens.

Nicht aus jedem Schemaobjekt automatisch eine Hauptnavigation oder CRUD-Maske erzeugen.

Gestaltungsgrundlage sind die acht Apple-Design-Prinzipien (Purpose, Agency, Responsibility, Familiarity, Flexibility, Simplicity, Craft, Delight) und ihre Web-Umsetzung aus `apple-design`. Die Workbench bleibt dennoch ein präzises, sachliches B2B-Arbeitswerkzeug. Unmittelbares Feedback, räumliche Kontinuität, flüssige und abbrechbare Interaktion sowie funktionale transluzente Materialien **ersetzen** frühere pauschale Verbote von Glassmorphism und Animation. Keine Neon-/AI-Gradienten, Marketing-Hero-Bereiche oder Charts ohne fachlichen Erkenntnisgewinn.

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

Die **aktuelle** Produktstruktur ist **Tools → Checklists → Knowledge**, nicht „Opportunity → Deal-Dashboard“. Ein konkreter Seller-Arbeitsschritt steht vor Schema-/Datenpflege; kein Tool erfordert ohne fachlichen Grund einen vollständigen Opportunity-Datensatz.

- **Tools:** Aufgabe → minimale Eingabe → nachvollziehbares Ergebnis → gegebenenfalls Export.
- **Checklists:** Situation → schnell prüfbare Frage → nur bei Bedarf fachliche Erklärung.
- **Knowledge:** direkte Definition → praktische Bedeutung → Beispiele, Grenzen und passende Werkzeuge.
- Nur implementierte Workflows als aktiv darstellen; beim Drill-down Orientierung, Fokus und Rückweg beibehalten.
- Quelle, Evidenz und fachliche Unsicherheit klar erläutern; keine künstlichen Deal-Scores oder versteckte CRM-Verwaltung.

Apple-Design-Fokus: Jeder Screen beantwortet „Wo bin ich? Was kann ich tun? Wie komme ich zurück?“. Direkte, verständliche Labels vor abstrakten Menünamen; Kontrollflächen nahe an dem Objekt, das sie beeinflussen.

## 6. Komponentenregeln

### Formulare

- nur dann eigene Formulare schaffen, wenn ein konkreter Workflow oder notwendiger Source-Data-Drill-down sie braucht
- sichtbare Labels
- nebeneinanderliegende einzeilige `input`-/`select`-Controls müssen auf derselben oberen und unteren Kante liegen und dieselbe Höhe haben, auch wenn nur einzelne Felder Hilfetexte, optionale Hinweise oder Fehler anzeigen; die Eingabefelder sind die primäre Ausrichtungslinie. Mehrzeilige `textarea`-Felder beginnen auf gleicher Höhe, behalten aber ihre erforderliche natürliche Höhe
- Layout grundsätzlich in drei Spuren denken: **Label → gleich hohes Control → optionaler Hilfetext/Fehler darunter**. Gemeinsames CSS-Grid/Subgrid oder äquivalente Layouts statt Bottom-Alignment der gesamten Feldcontainer; Responsivität und Zoom prüfen
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
- Ein-/Austritt räumlich symmetrisch am Auslöser verankern; unterbrechbare Bewegung und funktionale Materialtiefe gemäß Apple Design

### Navigation

- aktuelle Sektion visuell und programmatisch erkennbar
- Tastaturnavigation vollständig
- aktiven Tool-, Checklist- oder Knowledge-Kontext im Application Chrome verständlich machen; keine dauerhaft geladene Opportunity voraussetzen

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

## 8. Apple-Design-Interaktionsreview

- Unmittelbares Feedback beim Drücken; finale Aktion erst beim Commit, Abbruch bei Wegziehen möglich.
- Drag/Swipe/Slider direkt mit dem Zeiger mitführen und den Greifversatz bewahren; Pointer Capture/Cancel sauber behandeln.
- Bewegung aus dem aktuellen sichtbaren Wert und der vorhandenen Geschwindigkeit starten; während des Übergangs jederzeit reversibel.
- Spring und Momentum nur für passende physische Gesten; keine pauschale Bounce-Animation.
- Räumlich konsistente Popover/Sheets; funktionale Transparenz, Dimmer, Blur und Schatten mit hinreichendem Kontrast.
- Typografie nach Größe unterschiedlich setzen (Tracking, Leading, Gewicht); Text-Zoom und Reflow erhalten.
- Keine zusätzliche Animationsbibliothek ohne konkreten Qualitätsgewinn; Desktop- und Touch-Verhalten prüfen.

## 9. Accessibility Review

Prüfen:

- semantisches HTML
- vollständige Tastaturbedienung
- sichtbarer Fokus
- zugängliche Namen
- korrekte Zustandsattribute
- Kontrast
- keine Bedeutung nur durch Farbe
- `prefers-reduced-motion`, `prefers-reduced-transparency` und `prefers-contrast: more`
- keine essenziellen Hover-only-Informationen
- Zoom/Textskalierung ohne Clipping
- ausreichend große Touch Targets
- Fehler korrekt Controls zugeordnet/angekündigt

## 10. Responsive Review

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

## 11. Vue-Implementierung

Bevorzugen:

- Vue 3 Composition API
- `<script setup lang="ts">`
- `computed` für abgeleitete UI-Werte
- Pinia nur für geteilten Application State
- Route-Level Lazy Loading, wenn sinnvoll
- semantische native Elemente
- typisierte Props und Emits
- Verhalten testen, nicht interne Implementierungsdetails

## 12. Externe UI/UX-Referenzen und Vorrang

1. **Apple Design**: `.agents/skills/apple-design/SKILL.md` ist für überlappende Gestaltungs- und Interaktionsfragen **vorrangig**. Es liefert die konkreten Prinzipien für Bewegung, direkte Manipulation, Transparenz, Feedback, Typografie und Nutzerkontrolle.
2. **UI UX Pro Max**: `nextlevelbuilder/ui-ux-pro-max-skill` bleibt ergänzend für Vue, Formular-/Tabellen-Accessibility und Chart-Entscheidungen verfügbar. In Überlappungen mit Apple Design werden seine alten Stilvorgaben nicht angewendet.
3. **MEDDPICC-spezifische Regeln**: Fachsemantik, Produkteinteilung, Datenschutz, Barrierefreiheit und technischer Stack bleiben verbindlich.

Provenienz, Version und Lizenzen: `docs/UI_UX_REFERENCE.md`. Beide Referenzen sind **keine Runtime-Abhängigkeiten**.

## Definition of Done

Eine UI-Änderung ist erst fertig, wenn sie:

- eine konkrete Seller-Aufgabe unterstützt oder einen notwendigen Drill-down ermöglicht
- keine CRM-/CRUD-Doppelpflege als Hauptworkflow erzeugt
- keine noch nicht implementierte Coaching-Logik vortäuscht
- `docs/DESIGN_SYSTEM.md` und bei Überlappungen dem Apple-Design-Skill entspricht
- Eingaben direkt beantwortet, Gesten kontinuierlich und reversibel gestaltet und bei bewegten Oberflächen passende Motion-/Material-Fallbacks vorsieht
- per Tastatur bedienbar ist
- responsive funktioniert
- MEDDPICC-Statussemantik explizit darstellt
- keine unnötigen Runtime-Netzwerkabhängigkeiten enthält
- mit realistischen, dichten B2B-Daten lesbar bleibt
- normale UI-Sprache auf Deutsch verwendet
- auf geeigneter Unit-/Component-/Browser-Ebene getestet wurde


## Icon Review

Bei Icons gilt `docs/ICON_SYSTEM.md` als verbindliche Quelle. Nur Lucide über `@lucide/vue` verwenden, vorhandene Zuordnungen wiederverwenden und komplexe MEDDPICC-Begriffe niemals durch ein Icon ohne sichtbares Textlabel ersetzen.
