# Architektur

## Zielbild

MEDDPICC Toolbox ist eine local-first Webanwendung aus fachlich eigenständigen Microtools.

```text
Startseite / Tool Directory
        |
        +-- Metrics
        |    +-- Business Case
        |    +-- ROI / Payback
        |
        +-- Economic Buyer
        |
        +-- Decision Criteria
        |
        +-- Decision Process
        |    +-- Go-Live-Rückwärtsplanung
        |    +-- Decision Map
        |
        +-- Paper Process
        |
        +-- Pain
        |
        +-- Champion
        |
        +-- Competition
```

## Microtool-Schichten

Jedes Tool besteht bevorzugt aus:

```text
Tool View
   |
   +-- minimale Inputs
   |
   +-- reiner Domain Service
   |
   +-- Ergebnisdarstellung
   |
   +-- optionaler Export
```

Die Domain-Logik darf nicht in UI-Komponenten versteckt werden.

## State

Default: lokaler State innerhalb des Microtools.

Kein Tool muss einen globalen Opportunity-State laden, um nutzbar zu sein.

Cross-Tool-State wird erst eingeführt, wenn zwei implementierte Tools einen klaren gemeinsamen Use Case besitzen.

## Optionaler Deal Workspace

Die bestehende .meddpicc-Infrastruktur kann später als optionaler Workspace dienen:

- Tool-Ergebnisse einem Deal zuordnen
- Inputs zwischen Tools wiederverwenden
- Exporte und interne Qualification gemeinsam ablegen

Sie bleibt optional. Standalone-Nutzung ist der Primärpfad.

## Legacy-Komponenten

Folgende vorhandene Bausteine bleiben zunächst erhalten:

- JSON Schema und Migration
- Project Store
- Evidence / References
- Risks / Actions
- Deal Inspector
- Next Best Action
- Qualification Gates

Sie werden nicht weiter ausgebaut, solange kein konkretes Microtool davon profitiert.

## Export

Kundenfähige Tools sollen Exporte lokal im Browser erzeugen.

Bevorzugte Formate je Use Case:

- SVG für skalierbare Präsentationsgrafiken
- PNG für einfache Einbindung
- Druckansicht / PDF über den Browser
- später ggf. PPTX, wenn ein belastbarer wiederverwendbarer Export-Use-Case besteht

Keine Server-Runtime ist für Exporte erforderlich.

## Datenschutz

- keine Opportunity-Daten automatisch hochladen
- keine Remote-Fonts oder Analytics
- keine externen Requests aus eingegebenen Kundendaten
- Exporte lokal erzeugen

## Tests

- Domain-Funktionen: Vitest
- zentrale UI-Flows: Playwright
- Desktop und Mobile
- Export-Smokes, soweit browserseitig zuverlässig testbar
- Production Build und Pages-Integrität
