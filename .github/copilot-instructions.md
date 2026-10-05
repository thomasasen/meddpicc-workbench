# MEDDPICC Workbench – Copilot-Anweisungen

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

- `README.md`
- `docs/PROJECT_CHARTER.md`
- `docs/ARCHITECTURE.md`
- `docs/PROJECT_FILE_SPEC.md`
- bei UI/UX-Änderungen `docs/DESIGN_SYSTEM.md`
- `AGENTS.md` für repository-weite Regeln

## Produktgrenzen

MEDDPICC Workbench ist local-first und deterministisch.

Kein verpflichtendes Backend, keine AI-Abhängigkeit zur Runtime, kein stiller Cloud-Sync, keine Analytics mit Opportunity-Inhalten und keine zweite kanonische Datenquelle neben der `.meddpicc`-Projektdatei einführen.

Das Projekt nicht zu einem allgemeinen CRM ausweiten.

## UI/UX-Regeln

Bei UI-Arbeiten `docs/DESIGN_SYSTEM.md` und `.agents/skills/meddpicc-ui-ux/SKILL.md` befolgen.

`nextlevelbuilder/ui-ux-pro-max-skill` wird nur als externe Entwicklungs- und Designreferenz genutzt und ist keine Anwendungsabhängigkeit. Details und gepinnter Upstream-Stand: `docs/UI_UX_REFERENCE.md`.

Bevorzugen:

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

## Vue-Konventionen

Vue 3 Composition API, `<script setup lang="ts">`, typisierte Props/Emits, Pinia für wirklich geteilten State, Vue Router für Navigation und reine Domain Services für Berechnungen und Regeln bevorzugen.

Methodik- und Business-Logik nicht in Presentation Components verstecken.


## Icons

Für UI-Icons ausschließlich die in `docs/ICON_SYSTEM.md` definierte Lucide-Bibliothek und Zuordnung verwenden. Icons direkt aus `@lucide/vue` importieren; keine CDN-Icons, keine Emojis als Navigations-/Statusicons und keine neuen konkurrierenden Icon-Familien einführen.
