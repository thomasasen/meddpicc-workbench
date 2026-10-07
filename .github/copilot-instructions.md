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

MEDDPICC Workbench ist eine **local-first, deterministische Deal-Reasoning- und Coaching-Workbench**.

Primäres Ziel ist nicht, MEDDPICC als acht CRUD-Masken abzubilden, sondern dem Seller konkrete Arbeit abzunehmen: Deal prüfen, Gaps erkennen, nächste Aktionen priorisieren, Qualification Gates prüfen, Champion/Economic Buyer testen, Business Value rechnen, Decision-/Paper-Process planen und Meetings vorbereiten.

Verbindlich:

- Workflows vor Datensätzen.
- Evidence und „Unbekannt“ vor optimistischen Defaults.
- Empfehlungen müssen Regel und Inputs erklären können.
- Domain Services statt versteckter Business-Logik in Vue.
- Kein verpflichtendes Backend.
- Kein Core-Feature darf eine AI-/LLM-Runtime oder externe AI-API benötigen.
- AI darf später optional nur als Input-Layer Candidate Evidence aus unstrukturiertem Material erzeugen; Nutzerbestätigung bleibt erforderlich.
- Kein stiller Cloud-Sync, keine Analytics mit Opportunity-Inhalten und keine zweite kanonische Datenquelle neben der `.meddpicc`-Projektdatei.
- Keine Account-/Kontaktverwaltung, Pipeline, Activity Timeline oder generische Task-App bauen.
- Neue UI nicht aus der Schema-Struktur ableiten, sondern aus konkreten Seller-Aufgaben.

Priorisierte Services stehen in `docs/ROADMAP.md`; `docs/PROGRESS.md` bestimmt den nächsten Slice.

## UI/UX-Regeln

Bei UI-Arbeiten `docs/DESIGN_SYSTEM.md` und `.agents/skills/meddpicc-ui-ux/SKILL.md` befolgen.

`nextlevelbuilder/ui-ux-pro-max-skill` wird nur als externe Entwicklungs- und Designreferenz genutzt und ist keine Anwendungsabhängigkeit. Details und gepinnter Upstream-Stand: `docs/UI_UX_REFERENCE.md`.

Bevorzugen:

- task-/workflow-orientierte Einstiege wie „Deal prüfen“ oder „Sind wir bereit für …?“
- aktuelle Handlungsbedarfe vor administrativer Projektpflege
- zugängliche Enterprise-Workbench-Muster
- minimale/Swiss Informationshierarchie
- informationsdichte, aber gut lesbare Layouts
- Overview → Drill-Down
- semantische Statuslabels plus Icons und zurückhaltende Farbe
- responsive Tabellen und Formulare
- vollständige Tastaturbedienung

Vermeiden:

- Glassmorphism und dekorative Effekte
- Marketing-Landingpage-Muster in der Anwendung
- Status nur über Farbe
- übermäßige Animation
- externe Webfonts/CDN-Assets als Standard
- unnötige Charts oder Gauges
- CRM-artige Tabellen-/Formularoberflächen ohne klaren Coaching-Workflow
- aktive UI für Roadmap-Services, deren Domain-Logik noch nicht implementiert ist

## Vue-Konventionen

Vue 3 Composition API, `<script setup lang="ts">`, typisierte Props/Emits, Pinia für wirklich geteilten State, Vue Router für Navigation und reine Domain Services für Berechnungen und Regeln bevorzugen.

Methodik- und Business-Logik nicht in Presentation Components verstecken.


## Icons

Für UI-Icons ausschließlich die in `docs/ICON_SYSTEM.md` definierte Lucide-Bibliothek und Zuordnung verwenden. Icons direkt aus `@lucide/vue` importieren; keine CDN-Icons, keine Emojis als Navigations-/Statusicons und keine neuen konkurrierenden Icon-Familien einführen.
