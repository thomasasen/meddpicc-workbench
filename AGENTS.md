# Agent-Anweisungen

Diese Anweisungen gelten für das gesamte Repository.

## Projektsprache

Die Projektsprache ist Deutsch. UI, Dokumentation, Issues, Pull Requests, Hilfetexte und fachliche Beschreibungen werden auf Deutsch formuliert. Etablierte MEDDPICC-Begriffe und technische Identifier bleiben im Original.

## Produktziel

MEDDPICC Toolbox ist eine local-first Sammlung fokussierter **Tools, Checklists und Wissenshilfen** für wiederkehrende Aufgaben im komplexen B2B-Vertrieb. Sie ist ausdrücklich kein ganzheitliches MEDDPICC-System und kein CRM.

Verbindliche Produktlogik:

- **Aufgabenorientiert:** Ausgangspunkt ist eine konkrete Arbeit oder Verständnisfrage, nicht ein vollständiger Opportunity-Datensatz.
- **Drei Bausteine:** Tools vereinfachen Arbeit, Checklists erklären und orientieren, Knowledge dient als schnelle MEDDPICC-Referenz.
- **Eigener Inputvertrag pro Tool:** Nur Informationen abfragen, die das Tool tatsächlich braucht.
- **Kundenfähige Outputs:** Wo sinnvoll, Ergebnisse so gestalten, dass Seller sie in Präsentationen, Workshops oder gemeinsamen Plänen verwenden können.
- **Interne Tools bleiben möglich:** Coaching-/Qualification-Tools dürfen seller-only sein.
- **Deterministisch by default:** Berechnungen, Regeln und Prozesslogik müssen ohne AI vollständig funktionieren.
- **Optionaler Session Context:** Ergebnisse dürfen später zwischen Services weitergereicht werden, ohne daraus eine verpflichtende Deal-/Opportunity-Pflege zu machen.
- **Kein CRM-Nachbau:** Keine Pipeline-, Forecast-, Account-, Kontakt-, Activity- oder generische Task-Verwaltung in den Core. Keine dauerhaft gepflegten MEDDPICC-Scores oder Deal-Health-Dashboards.
- **AI optional:** AI darf später Inputs unterstützen, aber nicht Voraussetzung für Core-Logik sein.

## Feature-Fit-Gate

Vor jedem neuen Feature beantworten:

1. Welche konkrete Seller-Aufgabe oder Verständnisfrage wird einfacher?
2. Spart das Feature wiederkehrende Arbeit oder verhindert es eine typische Fehlinterpretation?
3. Welche minimalen Inputs sind dafür wirklich nötig?
4. Ist der Output intern, lernorientiert oder kundenfähig?
5. Muss das Feature wirklich auf globalen Deal-State zugreifen?
6. Führt es versehentlich Richtung CRM/Datenpflege?

Wenn ein Tool nur deshalb viele Felder braucht, weil ein globales Schema sie besitzt, ist die Architektur falsch.

## Architekturregeln

- Tools sind logisch unabhängig.
- Checklists sind Lern- und Orientierungshilfen; sie erzeugen standardmäßig keinen gespeicherten Deal-Score oder historischen Qualification-Status.
- Knowledge-Inhalte sollen zwischen Checklists und Tool-Hilfen wiederverwendbar sein.
- Domain-Berechnungen liegen in reinen, testbaren Services und nicht in Vue-Komponenten.
- Tool-spezifische Inputs benötigen nicht automatisch eine Schema-Änderung.
- Pinia nur für echten view-übergreifenden State verwenden.
- Ein optionaler Session Context darf später Ergebnisse weiterreichen, aber keine vollständige Opportunity-Pflege oder Projektanlage voraussetzen.
- Keine verpflichtende Backend-, Cloud- oder AI-Abhängigkeit einführen.
- Keine Runtime-CDNs für Fonts, Icons oder Scripts.
- Kundendaten standardmäßig lokal im Browser verarbeiten.
- Unbekannte Informationen niemals erfinden.

## Bestehender Legacy-Code

Project File Lifecycle, Evidence Register, Risks/Actions, Deal Inspector, Qualification Gates und weitere Workbench-Komponenten bleiben zunächst im Repository. Sie sind nicht mehr der primäre Produktkern.

Wiederverwenden nur, wenn:

- die Logik fachlich zu einem Microtool passt,
- keine unnötige globale Datenabhängigkeit mitgezogen wird,
- der Code nach aktuellem Produktmodell testbar bleibt.

## UI/UX

Bei UI-Arbeiten docs/DESIGN_SYSTEM.md und docs/ICON_SYSTEM.md beachten.

Grundrichtung:

- professionelle B2B-Anwendung
- In sichtbaren Knowledge- und Checklist-Inhalten den praktischen Nutzen und die Methode erklären, nicht ihre Herkunft aus Büchern oder einzelne Autoren betonen.
- Quellenangaben und Autorenperspektiven nur am **Ende** der Seite in einem standardmäßig **eingeklappten** Bereich „Quellen und fachliche Einordnung“ aufführen; keine verstreuten Quellenlabels unter einzelnen Fragen oder Karten.
- klare Navigation über Tools, Checklists und Knowledge; MEDDPICC bleibt fachliche Orientierung
- wenig dekorativer Ballast
- konkrete Tool-Aktion sofort erkennbar
- Input und Ergebnis deutlich getrennt
- kundenfähige Outputs visuell präsentationsgeeignet
- keine Bedeutung nur über Farbe
- vollständige Tastaturbedienbarkeit
- sichtbarer Fokus
- Responsive-Verhalten bei ca. 375, 768, 1024 und 1440 px

## Accessibility

Accessibility ist Basisanforderung:

- semantisches HTML
- korrekte Labels
- Tastaturbedienung
- sichtbarer Fokus
- ausreichender Kontrast
- Reduced Motion respektieren
- keine essenziellen Hover-only-Inhalte
- grafische Ergebnisse benötigen eine zugängliche Text-/Tabellenalternative

## Technische Qualität

- Vue 3 Composition API mit script setup und TypeScript bevorzugen.
- Abgeleitete Werte über computed modellieren.
- Domain Services rein und deterministisch halten.
- Regressionen mit Vitest absichern.
- zentrale Browser-Flows mit Playwright testen.
- keine unnötigen Dependencies einführen.

## Quality Gates

Vor Merge:

- npm run format:check
- npm run lint
- npm run test
- npm run build
- npm run pages:check
- npm run test:e2e

Playwright muss Desktop und Mobile abdecken.

## GitHub Workflow

- Feature-PRs während aktiver Implementierung als Draft führen.
- Keine temporären Workflows für einmalige Hilfsaufgaben anlegen.
- Dokumentations-only Änderungen sollen keine unnötige vollständige Browser-CI erzwingen.
- Bei sichtbaren UI-Änderungen erst nach technischer QS um visuelle Nutzerfreigabe bitten.
- Nicht mergen, solange die sichtbare UI nicht ausdrücklich freigegeben wurde.
