# UI/UX-Entwicklungsreferenz

## Zweck

MEDDPICC Workbench nutzt **UI UX Pro Max** von NextLevelBuilder als externe Entwicklungsreferenz für UI/UX-Design und Reviews.

Repository:

`nextlevelbuilder/ui-ux-pro-max-skill`

Das Upstream-Projekt ist **keine Runtime-Abhängigkeit** von MEDDPICC Workbench.

## Geprüfter Upstream-Stand

Die initialen Design-System-Entscheidungen basieren auf:

- Upstream-Version: **2.13.0**
- geprüftem `main`-Commit: `477bcb28c9812b385cb51a4605ddf30d7b2266e2`
- Lizenz: MIT

Der gepinnte Commit macht die Design-Provenienz reproduzierbar. Ein späteres Review kann diesen Stand aktualisieren.

## Warum wir es nutzen

Das Upstream-Projekt enthält strukturierte Guidance für:

- Vue
- Accessibility
- Formulare und Interaktion
- Responsive-Verhalten
- Data-Dense Dashboards
- Drill-Down Analytics
- Chart-Auswahl
- Typografie- und Farbsysteme
- UI-Anti-Patterns

Das ist für MEDDPICC Workbench relevant, weil die Anwendung dichte Opportunity-Daten, strukturierte Formulare, Evidenztabellen, Timelines, Status und Management-Dashboards kombiniert.

## Was wir daraus verwenden

Wir nutzen die Inhalte als **Design Intelligence**, insbesondere für:

1. Vue-3-Implementierung
2. zugängliche semantische Controls
3. Keyboard-/Focus-Verhalten
4. Responsive Layouts
5. informationsdichte Enterprise-Dashboards
6. Drill-Down-Navigation
7. Chart- und Tabellen-Accessibility
8. Vermeidung von Color-only-Semantik

Die daraus abgeleiteten MEDDPICC-spezifischen Regeln stehen in `docs/DESIGN_SYSTEM.md`.

## Was wir bewusst nicht übernehmen

Generische Empfehlungen sind nicht automatisch verbindlich.

Upstream-SaaS-Empfehlungen können beispielsweise visuelle Stile enthalten, die für unsere Anwendung ungeeignet sind. MEDDPICC Workbench vermeidet bewusst:

- Glassmorphism als primären App-Stil
- dekorative Gradienten
- Marketing-Hero-Layouts in der Arbeitsoberfläche
- übermäßige Micro-Animation
- externe Google Fonts zur Runtime
- visuelle Komplexität zulasten der Deal-Review-Geschwindigkeit

Das projektspezifische Design System hat immer Vorrang.

## Relevante Upstream-Pfade

Beim gepinnten Commit insbesondere:

- `src/ui-ux-pro-max/data/stacks/vue.csv`
- `src/ui-ux-pro-max/data/styles.csv`
- `src/ui-ux-pro-max/data/products.csv`
- `src/ui-ux-pro-max/data/charts.csv`
- `.claude/skills/ui-ux-pro-max/references/quick-reference.md`
- `src/ui-ux-pro-max/templates/platforms/codex.json`

## Agent-Integration

Das Upstream-Projekt unterstützt Codex-Skills unter `.agents/skills/`.

Wir vendoren nicht den kompletten Skill, sondern pflegen einen fokussierten lokalen Skill:

`.agents/skills/meddpicc-ui-ux/SKILL.md`

Zusätzlich:

- `AGENTS.md`
- `.github/copilot-instructions.md`

So bleiben die Designregeln für unterschiedliche Coding-Assistant-Workflows sichtbar.

## Projektsprache

Auch bei Verwendung externer englischer Quellen bleibt die Projektsprache Deutsch.

Upstream-Begriffe dürfen als Fachbegriffe übernommen werden. Eigene UI-Texte, Dokumentation und fachliche Erklärungen werden deutsch formuliert.

## Runtime-Grenze

UI UX Pro Max darf nicht nur wegen seiner Entwicklungs-Guidance in den Production Bundle importiert werden.

Kein Python-Suchsystem, AI Agent, Design Recommender oder Remote-Service von UI UX Pro Max wird für die deployte Anwendung benötigt.

Die GitHub-Pages-Anwendung bleibt deterministisch und local-first.

## Lizenz und Attribution

UI UX Pro Max steht unter MIT License von Next Level Builder.

Aktuell wurden keine substantiellen Upstream-Quelltexte oder Datensätze in MEDDPICC Workbench kopiert. Deshalb referenzieren wir Repository und Lizenz, statt Upstream-Dateien zu vendoren.

Falls künftig substantieller Code oder Daten übernommen werden, müssen Copyright- und MIT-Hinweise erhalten und der übernommene Umfang dokumentiert werden.
