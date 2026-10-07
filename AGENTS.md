# Agent-Anweisungen

Diese Anweisungen gelten für das gesamte Repository.

## Projektsprache

Die Projektsprache ist Deutsch. UI, Dokumentation, Issues, Pull Requests, Hilfetexte und fachliche Beschreibungen werden auf Deutsch formuliert. Etablierte MEDDPICC-Begriffe und technische Identifier bleiben im Original.

## Produktziel

MEDDPICC Toolbox ist eine local-first Sammlung fokussierter **MEDDPICC Microtools** für komplexe B2B-Sales-Aufgaben.

Verbindliche Produktlogik:

- **Microtool-first:** Ausgangspunkt ist eine konkrete Aufgabe, nicht ein vollständiger Opportunity-Datensatz.
- **Eigener Inputvertrag pro Tool:** Nur Informationen abfragen, die das Tool tatsächlich braucht.
- **Kundenfähige Outputs:** Wo sinnvoll, Ergebnisse so gestalten, dass Seller sie in Präsentationen, Workshops oder gemeinsamen Plänen verwenden können.
- **Interne Tools bleiben möglich:** Coaching-/Qualification-Tools dürfen seller-only sein.
- **Deterministisch by default:** Berechnungen, Regeln und Prozesslogik müssen ohne AI vollständig funktionieren.
- **Optionaler Workspace:** Ein späterer Deal Workspace darf Tool-Daten wiederverwenden, aber kein Microtool zur Projektanlage zwingen.
- **Kein CRM-Nachbau:** Keine Pipeline-, Kontakt-, Activity- oder generische Task-Verwaltung in den Core.
- **AI optional:** AI darf später Inputs unterstützen, aber nicht Voraussetzung für Core-Logik sein.

## Feature-Fit-Gate

Vor jedem neuen Feature beantworten:

1. Welche konkrete Seller-Aufgabe wird einfacher?
2. Welche minimalen Inputs sind dafür wirklich nötig?
3. Ist der Output intern oder kundenfähig?
4. Ist die Logik deterministisch und nachvollziehbar?
5. Muss das Feature wirklich auf globalen Deal-State zugreifen?
6. Führt es versehentlich Richtung CRM/Datenpflege?

Wenn ein Tool nur deshalb viele Felder braucht, weil ein globales Schema sie besitzt, ist die Architektur falsch.

## Architekturregeln

- Microtools sind logisch unabhängig.
- Domain-Berechnungen liegen in reinen, testbaren Services und nicht in Vue-Komponenten.
- Tool-spezifische Inputs benötigen nicht automatisch eine Schema-Änderung.
- Pinia nur für echten view-übergreifenden State verwenden.
- Ein optionaler Workspace darf später Ergebnisse persistieren, aber Microtools nicht blockieren.
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
- klare MEDDPICC-Navigation
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
