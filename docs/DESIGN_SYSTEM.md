# MEDDPICC Toolbox Design System

**Rangfolge für UI/UX:** Die in `.agents/skills/apple-design/SKILL.md` dokumentierten Apple-Design-Prinzipien ersetzen bei Überschneidungen ältere Gestaltungsregeln aus diesem Projekt und aus UI UX Pro Max. Diese Datei konkretisiert ihre Anwendung in einer B2B-Toolbox. Unverändert verbindlich bleiben Produktmodell, MEDDPICC-Semantik, Barrierefreiheit, Datensicherheit, Datenschutz, Leistungsfähigkeit und die deutsche Projektsprache. Funktionale Materialtiefe und Bewegung sind daher erlaubt und erwünscht, rein dekorative Effekte aber keine Pflicht.

## Sichtbare Implementierung (05.11.2026)

Die projektweiten Apple-Design-Vorgaben werden in `src/styles/appleVisualRedesign.css` als gemeinsames Oberflächensystem und in `src/styles/appleInteractions.css` als Interaktionsgrundlage angewendet. Die Startseite nutzt zusätzlich eine echte Bereichsnavigation und einen direkten Tool-Einstieg. Die bestehende MEDDPICC-/Tool-Logik bleibt davon unberührt.

Die folgende Abnahmematrix gilt für den sichtbar überarbeiteten Stand: Hierarchie und Lesbarkeit der Startseite, Tools, Checklists, Knowledge und Einstellungen; 320/375/768/1024/1440 px; Fokus, Pointer, Reduced Motion, Reduced Transparency und erhöhte Kontraste; deterministische Exportdarstellung unabhängig von Shell-Effekten. Ein eigenes simuliertes Red-Team-Protokoll liegt in `docs/APPLE_VISUAL_RED_TEAM_2026-11-05.md`.

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
- funktionale Materialtiefe: tatsächlich schwebende Navigation, Popover und Sheets dürfen transparente Oberflächen und Blur zur räumlichen Trennung nutzen, sofern Kontrast, Hierarchie und solide Fallbacks erhalten bleiben
- keine beliebigen Glasflächen, Neon-/AI-Gradienten oder Marketing-Hero-Optik ohne funktionalen Bezug
- unmittelbare Reaktion auf Eingaben, reversible, räumlich konsistente Übergänge und physikalisch nachvollziehbare Gesten
- Zweck, Nutzerkontrolle, Verantwortlichkeit, Vertrautheit, Flexibilität, Einfachheit (nicht bloß Minimalismus), Sorgfalt und Freude an reibungsloser Bedienung als acht Leitprinzipien

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
- **Verbindliches Zeilenraster:** Wenn mehrere Felder in einer Zeile stehen, müssen ihre Eingabe-Controls auf exakt derselben horizontalen Linie beginnen und gleich hoch sein. Das gilt unabhängig von unterschiedlich langen Beschriftungen, optionalen Markierungen, Hilfetexten oder Fehlermeldungen.
- **Label, Eingabe, Hinweis sind getrennte Ebenen:** Erst die Beschriftung, dann die einheitlich hohe Eingabebox, danach optionaler Hilfe- oder Fehlertext. Ein Hinweis darf **nicht** die Eingabebox des eigenen Felds nach oben oder unten verschieben. Controls sind die visuelle Hauptlinie.
- **Kein Bottom-Alignment vollständiger Feldcontainer** und keine freien Grid-Auto-Tracks, die Felder mit und ohne Hinweise gegeneinander versetzen. Für komplexere Formularzeilen ein gemeinsames CSS-Grid/Subgrid verwenden; bei fehlender Subgrid-Unterstützung Labels und Control-Höhen konsistent reservieren.
- **Responsive:** Sobald sich das Spaltenraster ändert, muss die Ausrichtung innerhalb jeder neu entstehenden Zeile erhalten bleiben. Lange Labels dürfen umbrechen, ohne Eingabeboxen in benachbarten Spalten zu verschieben.
- **Abnahme:** Auf Desktop und Mobile tatsächliche `getBoundingClientRect()`-Positionen und -Höhen prüfen, nicht nur gleich wirkende CSS-Werte. Hilfe- und Fehlermeldungen müssen vollständig unterhalb des zugehörigen Controls bleiben.

**Geltungsbereich der Formular-QS:** Die Regel ist nicht auf den Planungsrahmen beschränkt. Zu prüfen sind alle produktiven mehrspaltigen Formularzeilen, insbesondere Software Payback, Metric Builder (alle Wizard-Schritte), Cost of Delay, Value Bridge und die Go-Live-Schrittliste. Weiterhin erreichbare interne Formulare (Evidenz, Risiken/Aktionen, Referenzen) und die PDF-Dokumentgestaltung gehören ebenfalls zur Bestandsprüfung. Mehrzeilige Textareas werden nicht künstlich auf die Höhe einzeiliger Controls gekürzt, sondern bei Bedarf separat über die volle Zeile geführt.

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

Bestehende zentrale Tokens für Farben, Spacing, Typografie, Radii, Borders, Focus und Motion weiterverwenden. Keine verstreuten Einzelwerte, wenn ein Token sinnvoll existiert. Für neue UI-Anforderungen benötigte Motion-, Material- und Kontrastvarianten als gemeinsame Tokens vorsehen statt pro View Einzelwerte zu erfinden. Gesten-Animationen dürfen nicht durch pauschale globale CSS-Transitions blockiert werden.

## 11. Typografie

Systemfont-Strategie vor eigenen Fonts. Normale UI-Texte mindestens ca. 14–16 px, Metadaten nicht künstlich verkleinern. Lange deutsche und englische Fachbegriffe müssen sicher umbrechen. Nach Apple Design Schriftgröße, Gewicht, Laufweite und Zeilenhöhe **gemeinsam** abstimmen: größere Überschriften mit engerer Laufweite/Zeilenhöhe, Fließtext mit mehr Zeilenhöhe und gut lesbarem Tracking. Keine feste negative Laufweite für alle Größen. `rem`/`em` und responsive Typografie verwenden, damit Zoom und vergrößerte Schrift das Layout nicht brechen.

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

## 12a. Direkte Interaktion, Bewegung und Materialtiefe (Apple Design)

Diese Regeln ersetzen frühere pauschale Einschränkungen für Bewegung und transluzente Materialien. Einzelheiten und technische Beispiele: `.agents/skills/apple-design/SKILL.md`.

### Eingabe und Feedback

- Bei Drücken/Tap **sofort** eine sichtbare Rückmeldung auf `pointerdown`/`:active` geben; die eigentliche Aktion üblicherweise erst auf `pointerup`/Klick auslösen. Wegziehen muss ein versehentliches Auslösen abbrechen können.
- Keine künstlichen Wartezeiten auf dem Eingabepfad. Bei Drag, Schiebereglern und vergleichbaren Manipulationen Inhalt **fortlaufend 1:1** mit dem Zeiger/Finger bewegen, inklusive ursprünglichem Greifpunkt.
- Für Gesten Pointer Events mit `setPointerCapture`, sinnvoller Bewegungs-Schwelle (Richtwert ca. 10 px), Geschwindigkeitsverlauf und klarer Abbruchbehandlung nutzen. Früh Gestenabsicht erkennen, ohne unnötig auf ein Endereignis zu warten.
- Rückmeldungen gezielt für Status, abgeschlossene Aktionen, Warnungen und Fehler einsetzen; kausal, direkt und nicht inflationär. Optionale Sound-/Haptik-Signale dürfen niemals die einzige Rückmeldung sein.

### Bewegung

- Gestengetriebene Animationen **jederzeit unterbrechbar** machen, vom aktuellen gerenderten Zustand und der bisherigen Geschwindigkeit weiterführen und ohne sichtbaren Sprung umkehren lassen.
- Für physikalisch bewegte Objekte Spring-Animationen nutzen; als Ausgangspunkt **kritische Dämpfung (Ratio ca. 1,0) und Response 0,3–0,4 s**. Bounce (ca. 0,8) nur bei tatsächlichem Schwung, etwa einem Flick. Zahlen sind Startwerte, keine global erzwungenen Zeitvorgaben.
- Beim Loslassen Geschwindigkeit an die folgende Animation weitergeben; wenn Schnappunkte vorhanden sind, das natürliche Ziel aus Impuls/Projektion statt allein aus dem Loslasspunkt bestimmen. Für X und Y bei Bedarf getrennte Springs verwenden.
- Ein- und Ausblenden entlang konsistenter, spiegelbildlicher Wege gestalten. Popover/Sheets am Auslöser verankern; Grenzen dürfen bei Touch-Gesten mit zunehmendem Widerstand reagieren (Rubber-banding), sofern fachlich passend.
- Keine fest vorgegebene CSS-Transition oder `@keyframes` für direkt greifbare/umkehrbare Gesten. Bei diskreten Zustandswechseln sind einfache, ruhige CSS-Transitions weiterhin zulässig.
- Pro Frame bevorzugt `transform`/`opacity`, zeitkritisch via `requestAnimationFrame`; unnötige Layout-Reflows und dauerhaft gesetztes `will-change` vermeiden. Kein Bewegungs-Effekt ohne erkennbaren funktionalen Mehrwert.

### Funktionale transluzente Materialien

- Floating Navigation, Toolbars, Popover und Sheets können `backdrop-filter`, Transparenz, gezielte Schatten und Dimmer verwenden, **wenn** dies räumliche Zusammenhänge und Trennung besser erklärt als eine deckende Fläche.
- Materialgewicht nach Funktion staffeln; nicht mehrere helle Glasflächen stapeln. Lesbarkeit über wechselndem Hintergrund, ausreichenden Kontrast und ausreichende Textstärke sichern.
- Blockierende Dialoge dürfen den Hintergrund abdunkeln. Nichtblockierende Panels müssen den Arbeitsfluss erkennbar belassen. Scrollkanten weich auslaufen lassen, wenn tatsächlich überlappende UI vorhanden ist.
- Ein Material soll beim Erscheinen nachvollziehbar entstehen (beispielsweise Opacity/Skalierung/Blur), nicht bloß beliebig ein- oder ausblenden. Kein Glas-Effekt als Selbstzweck.

### Plattform, Barrierefreiheit und Kontrolle

- Desktop bleibt präzise per Maus/Tastatur bedienbar, Touch erhält direkte Manipulation. **Keine Pointer-Geste ohne gleichwertigen tastaturbedienbaren Weg.**
- `prefers-reduced-motion: reduce`: Bewegung/Parallax/Overshoot durch statische Zustände oder kurze Überblendungen ersetzen. `prefers-reduced-transparency: reduce`: Materialien deckender/solid darstellen. **Nicht überall unterstützte Media Queries** dürfen kein Ersatz für solide, kontrastreiche Basisdarstellungen sein. `prefers-contrast: more`: Kontrast und klare Grenzen erhöhen.
- Focus-Management, Semantik, Textgrößenanpassung, reversibles Verhalten/Undo und klare Fehlerrückmeldungen gehen einer optischen Animation vor.
- Keine Audio- oder Haptik-API voraussetzen, keine neuen Runtime-Abhängigkeiten oder externen Services ohne nachgewiesenen Mehrwert einführen.

Die produktive, gemeinsame Implementierung dieser Prinzipien liegt in `src/styles/appleInteractions.css` (Feedback/Accessibility) und für die Go-Live-Planung in `src/views/ReverseTimelineView.vue` sowie `src/styles/reverseTimelineDragElevation.css`. Neue Spezialeffekte benötigen einen nachweisbaren funktionalen Nutzen und passende Browser-Regressionen. Der Umsetzungs- und QA-Umfang ist unter `docs/APPLE_DESIGN_IMPLEMENTATION_QA_2026-11-05.md` dokumentiert.

## 13. Accessibility

Mindestens:

- semantische Landmarks
- logische Heading-Hierarchie
- vollständige Tastaturbedienung
- sichtbarer Fokus
- korrekt verknüpfte Labels
- ausreichender Kontrast
- keine Bedeutung nur über Farbe
- Reduced Motion, Reduced Transparency und höheren Kontrast respektieren
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
- reagieren Controls unmittelbar, sind Bewegung und räumliche Übergänge konsistent und unterbrechbar?
- sind Gesten auch per Tastatur möglich und sind die drei entsprechenden Accessibility-Media-Queries bedacht?

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



## 20. Produktive UI-Regression am 11.10.2026

Die mobile Schrittnavigation wird unter 480 Pixeln vertikal angezeigt; Cost-of-Delay-Verlaufsgrafiken bleiben auf kleinen Bildschirmen horizontal lesbar und per Tastatur fokussierbar. Die neun Knowledge-Ansichten erhalten gemeinsame Kapitelanker, die den Fokus auf Abschnittsüberschriften führen; die sechs Value-Bridge-Stufen trennen Pain, Konsequenz, Ziel, Veränderung, Messung und monetären Wert. 25 produktive und drei interne Routen sind in vier Größen via CI #38094931479 geprüft (205 bestandene Browserprüfungen). Die repräsentative Bildsichtung ersetzt keine formale WCAG-2.2-AA-Zertifizierung.


## Dokumentgestaltung

Die Anwendung bleibt MEDDPICC Toolbox; nur ihre PDF-Ausgaben werden firmenneutral oder mit lokalem CI erzeugt. Die Seite /settings/document-design bietet semantisch beschriftete Felder, Status-/Fehlerrollen, Tastaturbedienung und mobile Layouts. Der PDF-Kopf nutzt kontrastreiches Textweiß oder Textdunkel passend zur Primärfarbe. Wirtschaftliche Statusfarben, Risikoangaben und Evidenzkennzeichnungen sind davon unabhängig. Logo und langer Firmenname belegen eine begrenzte reservierte Masthead-Fläche, ohne den Dokumentinhalt nach unten zu überdecken.


## Zentrale Einstellungsnavigation

Die Startseite erhält im rechten Kopfbereich einen sekundären Zahnrad-Einstieg **Einstellungen** mit Lucide-`Settings` und sichtbarem Text (schmale Mobilansicht: Icon mit zugänglichem Namen). Die Route `/settings` ist die zentrale Einstellungsübersicht. Aktuell gibt es genau einen tatsächlich editierbaren Bereich: **Dokumentgestaltung**, dessen bisheriger Formular- und Datenpersistenzpfad unverändert bleibt. Keine leeren Schalter oder vorgetäuschten Konfigurationen. Der bisherige Deep Link `/settings/document-design` bleibt kompatibel. Einstellungsseiten führen zurück zur Übersicht; der Eingang zur Übersicht führt zum Hauptbildschirm. Tastaturfokus, 375/768/1024/1440 px und kein horizontaler Überlauf müssen geprüft werden.
