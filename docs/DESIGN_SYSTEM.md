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

## 11a. Wahrnehmungsorientierte Textausrichtung und Abstände

Übergreifender Standard für alle Microtools, Checklists, Knowledge-Screens und kundenfähigen Exporte.

- **Nähe:** Labels und ihre Controls bilden eine visuelle Einheit. Hilfetexte folgen unmittelbar dem zugehörigen Control; Abstände **zwischen** logischen Gruppen sind größer als Abstände **innerhalb** einer Gruppe.
- **Ähnlichkeit:** Die gleichen Informationstypen nutzen dieselben Schriftrollen, Abstände und Ausrichtungen. Kein zufälliger Wechsel zwischen zentrierten, links- und rechtsbündigen Fließtexten.
- **Gemeinsame Region:** Ein Panel fasst genau eine zusammengehörige Aufgabe oder Information zusammen. Flächen und Ränder nicht als Dekoration oder mehrfach ineinander verschachteln.
- **Hierarchie:** H1 → H2 → Beschriftung → Eingabe/Ergebnis → Erläuterung. Wertkennzahlen dürfen auffallen, ohne Labels und Kontext zu verdrängen.
- **Ausrichtung:** Fließtext linksbündig; Zahlen wenn sinnvoll in eigenen tabellarischen Spalten. Labels und Werte nutzen wiederkehrende optische Kanten. Lange Texte dürfen umbrechen und werden niemals abgeschnitten.
- **Vertikaler Rhythmus:** Kleine wiederkehrende Abstände innerhalb eines Labels/Felds (ca. 8 px), mittlere Abstände innerhalb der Gruppe (ca. 16 px), größere zwischen Gruppen/Sektionen (ca. 24 px oder mehr). Das sind Gestaltungsrichtwerte, keine empirisch optimalen Zahlen.
- **Mobile/Reflow:** Gruppen bleiben beim Stapeln zusammen; keine Textüberlappungen, abgeschnittenen Buttons oder absichtlich winzige Labels. Auch bei erhöhter Schrift- oder Zeilenabstand-Einstellung dürfen keine Informationen verschwinden.
- **PDF:** Texte vor dem Zeichnen umbrechen und Blockhöhen bestimmen. Auf Seitenumbrüche, Fußzeilen, Kanten, Innenabstände und Überschriften ohne abgeschnittenen Folgeinhalt achten. Originalseiten rendern und tatsächlich sichten.

Prinzipien stammen aus allgemeinen UX- und Gestalt-Heuristiken (u. a. Nähe, Ähnlichkeit und Hierarchie), nicht aus einer spezifischen Nutzungsstudie zur Toolbox. Referenzen und ein praktischer Prüfablauf: [Metric Builder Visual QA](METRIC_BUILDER_VISUAL_QA.md).

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

## 18. Gemeinsame Redesign-Primitiven (Entwicklungsbranch ab 10.10.2026)

Die zentralen Tokens bleiben in `src/styles/main.css`; die bereichsübergreifenden typografischen und interaktiven Ergänzungen liegen in `src/styles/redesignFoundations.css` und werden über `src/main.ts` auf alle aktiven Routen geladen.

- `--type-display`, `--type-section` und `--type-number` bilden die inhaltsbezogene Schriftgrößenhierarchie. Überschriften verwenden zurückhaltendes Balancing statt Marketing-Typografie.
- `--panel-gap` und `--color-section-rule` dienen der ruhigen Trennung fachlicher Bereiche, nicht der Dekoration.
- Zahlen in Resultatgruppen verwenden tabellarische Ziffern. Einheiten, Zeiträume und Evidenz bleiben weiterhin explizit im Inhalt.
- Fokussierte native Selects verlieren vor der Wheel-Defaultaktion den Fokus, damit Scrollen ihren Wert nicht versehentlich ändert; Keyboard-Eingaben bleiben möglich. Verhalten ist im E2E-Test abzusichern.
- Checklists zeigen eine ausschließlich temporäre `Alle / Noch offen / Markiert`-Ansicht. Der Zähler bezeichnet nur markierte Prüfpunkte und ist kein Qualification-, Readiness- oder Confidence-Score.
- Tabs und Schrittnavigation müssen mindestens 44px hohe Zielbereiche bieten. Focus-Visible gilt auch für Textareas und Disclosure-Zusammenfassungen.
- Neue Tools sollen dieselben Tokens nutzen, statt eigene per-View-Sonderfarben und Interaktionsmuster zu kopieren.

Die gemeinsame CSS-Grundlage ist **nicht** die vollständige UI-Abnahme jeder Route. Offene Screens und die Testmatrix stehen in `docs/REDESIGN_AUDIT_2026-10-10.md`.

## 19. Gemeinsame Ergebnishierarchie – Erweiterung vom 11.10.2026

Die Reflow-Regeln in `src/styles/redesignFoundations.css` ergänzen bestehende Panels und Feldgruppen um begrenzbare Grid-/Flex-Kinder, umbruchfähige Bedienelemente und tabellarische Finanzzahlen. Ein wiederverwendbarer Hinweisstil `.tool-evidence-note` trennt einen Modellwert von einer Validierungsbestätigung. Für einzelne Ansichten müssen visuelle Abnahmen folgen; allein die Existenz dieser Klassen belegt keinen bestandenen Responsive-Test.


### Gemeinsamer mehrstufiger Workflow

`src/components/ToolStepNavigation.vue` bildet drei interaktive Schritte aus einer einzigen tastaturbedienbaren, semantischen Navigation ab. Der aktive Schritt verwendet `aria-current="step"`, und der Klick ändert ausschließlich den aktuellen Schritt. Der Draft/Input liegt weiterhin in den Elternkomponenten, damit kein Wechsel Daten verwirft. Eingesetzt in Metric Builder und Cost of Delay; weitere Übernahme nur nach Prüfung der jeweiligen Anforderungen.

