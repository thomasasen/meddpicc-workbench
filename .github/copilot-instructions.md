> **Produktmodell-Hinweis 07.10.2026:** MEDDPICC Toolbox ist inzwischen microtool-first. Die Projektdatei ist kein Pflicht-Einstieg mehr, sondern ein möglicher späterer optionaler Deal-Workspace. Bei Widersprüchen haben AGENTS.md, PROJECT_CHARTER.md, ARCHITECTURE.md und ROADMAP.md Vorrang.\n\n# MEDDPICC Workbench – Copilot-Anweisungen

Vor der Code-Generierung gilt die Repository-Dokumentation als Source of Truth.

## Projektsprache

Die Projektsprache ist **Deutsch**.

Deutsch verwenden für:

- UI-Texte
- Dokumentation
- Issues und Pull Requests
- Fehlermeldungen und Hilfetexte
- fachliche Beschreibungen

Englisch bleibt erhalten für:

- etablierte MEDDPICC-Fachbegriffe wie `Economic Buyer`, `Decision Process`, `Paper Process`, `Champion`
- etablierte technische Fachbegriffe, wenn dies präziser ist
- Code, Schema-Keys, API-Namen, Typen, Variablen, Funktionen und Dateinamen

Beispiel: Im UI heißt der Status **„Bestätigt“**, die Sektion heißt aber weiterhin **„Economic Buyer“**.

## Pflichtlektüre bei Implementierungen

- `AGENTS.md` für repository-weite Regeln
- `README.md`
- `docs/PROJECT_CHARTER.md`
- `docs/ROADMAP.md`
- `docs/PROGRESS.md` – bestimmt den aktuell nächsten empfohlenen Slice
- `docs/ARCHITECTURE.md`
- `docs/PROJECT_FILE_SPEC.md`
- bei UI/UX-Änderungen `docs/DESIGN_SYSTEM.md`

Bei Prioritätskonflikten gelten die aktuelle Roadmap und Progress-Datei vor älteren Beschreibungen bereits implementierter Screens.

## Produktziel und Produktgrenzen

MEDDPICC Toolbox ist eine **local-first, deterministische Sammlung fokussierter Sales-Tools, Checklists und Knowledge-Inhalte**. Sie ist ausdrücklich kein CRM und kein durchgehend gepflegtes Deal-Management-System.

Primäres Ziel: wiederkehrende Seller-Aufgaben vereinfachen (z. B. Quick Payback, Metric Builder, Cost of Delay, Value Bridge, Go-Live-Rückwärtsplanung), Prüf- und Meeting-Situationen erklären und MEDDPICC-Wissen zugänglich machen. Tools haben jeweils nur die für ihren Zweck nötigen Eingaben; Checklists erzeugen keine persistierten Deal-Scores.

Verbindlich:

- Workflows vor Datensätzen.
- Evidence und „Unbekannt“ vor optimistischen Defaults.
- Empfehlungen müssen Regel und Inputs erklären können.
- Domain Services statt versteckter Business-Logik in Vue.
- Kein verpflichtendes Backend.
- Kein Core-Feature darf eine AI-/LLM-Runtime oder externe AI-API benötigen.
- AI darf später optional nur als Input-Layer Candidate Evidence aus unstrukturiertem Material erzeugen; Nutzerbestätigung bleibt erforderlich.
- Kein stiller Cloud-Sync und keine Analytics mit Kundendaten. Eine `.meddpicc`-Projektdatei gehört zum Legacy-Bestand und darf kein verpflichtendes Datenmodell oder Einstieg in neue Microtools werden. Optionaler temporärer Session Context ist nur bei fachlichem Mehrwert zulässig.
- Keine Account-/Kontaktverwaltung, Pipeline, Activity Timeline oder generische Task-App bauen.
- Neue UI nicht aus der Schema-Struktur ableiten, sondern aus konkreten Seller-Aufgaben.

Priorisierte Services stehen in `docs/ROADMAP.md`; `docs/PROGRESS.md` bestimmt den nächsten Slice.

## UI/UX-Regeln

Bei UI-Arbeiten `docs/DESIGN_SYSTEM.md` sowie **beide** Skills `.agents/skills/meddpicc-ui-ux/SKILL.md` und `.agents/skills/apple-design/SKILL.md` befolgen.

**Bei überlappenden Stil-, Typografie-, Gesten-, Material- oder Bewegungsanforderungen gilt Apple Design vor älteren Projekt- und UI UX Pro Max-Empfehlungen.** Fachliche Korrektheit, aktuelle Tools/Checklists/Knowledge-Produktarchitektur, Accessibility, Sicherheit, Performance und Datenschutz sind davon ausgenommen. Apple-Prinzipien sind kontextgerecht anzuwenden: Transparenz ist nicht für jede Fläche Pflicht, Spring-/Momentum-Effekte nicht für jeden Button. Provenienz: `docs/UI_UX_REFERENCE.md`; keine Runtime-Abhängigkeit.

Bevorzugen:

- konkrete Einstiege wie „Payback berechnen“, „Kennzahl herleiten“, „Go-Live rückwärts planen“ oder „Economic Buyer verstehen“
- aktuelle Handlungsbedarfe vor administrativer Projektpflege
- zugängliche Enterprise-Workbench-Muster
- klare, nach Apple Design gestaltete Informationshierarchie
- informationsdichte, aber gut lesbare Layouts
- Overview → Drill-Down
- semantische Statuslabels plus Icons und zurückhaltende Farbe
- responsive Tabellen und Formulare
- vollständige Tastaturbedienung
- sofortiges Eingabefeedback; natürliche, unterbrechbare Bewegung und Pointer-treue Gesten
- funktionale transluzente Floating Surfaces mit Kontrast- und Reduced-Transparency-Fallback
- typografische Hierarchie aus Größe, Tracking, Leading und Gewicht

Vermeiden:

- Glas-/Blur-Effekte ohne räumliche Funktion
- Marketing-Landingpage-Muster in der Anwendung
- Status nur über Farbe
- übermäßige, nicht zweckgebundene Animation; physikalisch nachvollziehbare Gesten ausdrücklich zulassen
- externe Webfonts/CDN-Assets als Standard
- unnötige Charts oder Gauges
- CRM-artige Tabellen-/Formularoberflächen ohne klaren Coaching-Workflow
- aktive UI für Roadmap-Services, deren Domain-Logik noch nicht implementiert ist

## Vue-Konventionen

Vue 3 Composition API, `<script setup lang="ts">`, typisierte Props/Emits, Pinia für wirklich geteilten State, Vue Router für Navigation und reine Domain Services für Berechnungen und Regeln bevorzugen.

Methodik- und Business-Logik nicht in Presentation Components verstecken.


## Icons

Für UI-Icons ausschließlich die in `docs/ICON_SYSTEM.md` definierte Lucide-Bibliothek und Zuordnung verwenden. Icons direkt aus `@lucide/vue` importieren; keine CDN-Icons, keine Emojis als Navigations-/Statusicons und keine neuen konkurrierenden Icon-Familien einführen.
