# Agent-Anweisungen

Diese Anweisungen gelten für das gesamte Repository.

## Produktsprache

Die Produktsprache ist Deutsch. Etablierte MEDDPICC-Fachbegriffe wie Metrics, Economic Buyer, Decision Criteria,
Decision Process, Paper Process, Champion und Competition bleiben im Original. Technische Identifier bleiben Englisch.

## Produktziel

MEDDPICC Toolbox ist eine **local-first Sammlung eigenständiger MEDDPICC-Microtools für komplexen B2B-Sales**.

Die Anwendung soll Verkäufern nicht zuerst eine vollständige Opportunity-Akte abverlangen. Der Einstieg erfolgt über eine
konkrete Aufgabe, zum Beispiel:

- Go-Live rückwärts planen
- Business Case rechnen
- ROI / Payback berechnen
- Decision Criteria strukturieren
- Champion testen
- Economic-Buyer-Gespräch vorbereiten
- Competition sichtbar machen

Ein Microtool fragt nur die Informationen ab, die es für seine eigene Aufgabe benötigt.

## Verbindliche Produktprinzipien

1. **Microtool zuerst.** Kein Tool darf einen vollständig gepflegten MEDDPICC-Datensatz voraussetzen.
2. **Standalone nutzbar.** Jedes Tool funktioniert ohne angelegte Opportunity, CRM, Backend oder Cloudkonto.
3. **Kundenfähige Outputs.** Wo fachlich sinnvoll, erzeugt das Tool präsentationsfähige Ergebnisse für Workshops,
   Kundentermine, Präsentationen oder Mutual Action Plans.
4. **Seller-only bleibt klar intern.** Interne Coaching- und Qualification-Ergebnisse dürfen nicht versehentlich als
   kundenfähiger Output erscheinen.
5. **Local-first.** Eingaben und Berechnungen bleiben standardmäßig im Browser.
6. **Deterministisch by default.** Berechnungen und regelbasierte Logik bleiben nachvollziehbar und testbar.
7. **Kein AI-Zwang.** Kein Core-Microtool benötigt eine AI-/LLM-Runtime.
8. **Kein CRM-Nachbau.** Keine Account-, Kontakt-, Pipeline-, Activity- oder generische Task-Verwaltung im Core.
9. **Optionaler Workspace erst später.** Ein späterer Deal Workspace darf Ergebnisse mehrerer Tools verbinden, ist aber
   niemals Voraussetzung für die Nutzung eines Microtools.
10. **Bestehende Workbench-Logik selektiv retten.** Vorhandene Domain Services, Schema- oder Evidence-Komponenten nur
    übernehmen, wenn sie einem konkreten Microtool einen echten Nutzen bringen.

## Microtool-Vertrag

Jedes neue Tool muss explizit definieren:

- konkrete Seller-Aufgabe
- minimale Inputs
- deterministische Logik oder klare redaktionelle Regeln
- Output
- Zielgruppe: kundenfähig oder intern
- Export-/Weiterverwendung, wenn sinnvoll
- fachliche Grenzen und Annahmen
- Tests

Bevor ein zusätzliches Eingabefeld eingeführt wird, ist zu prüfen:

> Ist dieses Feld für genau dieses Tool notwendig?

Wenn nicht, wird es nicht abgefragt.

## Architektur

Bevorzugt:

- Vue 3 + TypeScript + Vite
- Vue Router pro Microtool
- reine Domain-Funktionen für Berechnungen
- UI-State lokal im Tool, solange kein echter Cross-Tool-Use-Case besteht
- Vitest für Domain-Logik
- Playwright Desktop und Mobile für zentrale Flows
- lokale Browser-Exports ohne externe Runtime-Abhängigkeit

Eine verteilte Microservice-Infrastruktur ist nicht erforderlich. „Microtool“ bezeichnet eine fachlich eigenständige
Funktion innerhalb der Webanwendung.

## Legacy-Bestand

Das Repository enthält aus der früheren Workbench-Richtung unter anderem:

- .meddpicc-Schema und Migrationen
- Evidence / References
- Risks / Actions
- Deal Inspector
- Next Best Action
- Qualification Gates

Diese Komponenten sind **nicht mehr das primäre Produktmodell**. Sie dürfen erhalten bleiben und später selektiv
wiederverwendet werden. Neue Features dürfen aber nicht wieder von einer vollständig gepflegten Projektdatei abhängig
gemacht werden, nur weil diese Infrastruktur vorhanden ist.

## UI/UX

Die Startseite ist ein Werkzeugverzeichnis nach den MEDDPICC-Bereichen.

Pro Bereich:

- MEDDPICC-Kürzel
- Fachbegriff
- kurze Aufgabe
- darunter die zugehörigen Microtools

Noch nicht implementierte Tools dürfen sichtbar geplant sein, aber nicht als funktionsfähig vorgetäuscht werden.

Kundenfähige und interne Tools müssen unterscheidbar sein.

Vermeiden:

- Dashboard-KPI-Ballast
- globale Deal Scores
- Opportunity-Pflicht auf der Startseite
- große CRUD-Masken
- dekorative Charts ohne fachlichen Nutzen
- Glassmorphism, Neon, Marketing-Hero-Design

## Accessibility

- semantisches HTML
- Tastaturbedienbarkeit
- sichtbarer Fokus
- Labels für Inputs
- Bedeutung nicht nur über Farbe
- responsive bei ca. 375, 768, 1024 und 1440 px
- Reduced Motion respektieren
- exportierte Visualisierungen brauchen auch im UI eine verständliche textuelle Datenbasis

## Fachquellen

Für MEDDPICC-Fachlogik sind die im Projekt hinterlegten Bücher primäre Quellen:

1. Andy Whyte – MEDDICC: The ultimate guide to staying one step ahead in the complex sale
2. Darius Lahoutifard – Always Be Qualifying: MEDDIC & MEDDPICC Sales

Quellengestützte Prinzipien und konkrete Workbench/Product Inference sind sauber zu trennen.

## GitHub / QS

- nicht direkt auf main arbeiten
- Feature-PRs während aktiver Umsetzung als Draft führen
- keine temporären CI-Workflows für einmalige Hilfsaufgaben
- Zwischen-QS an fachlich sinnvollen Grenzen durchführen, nicht nach jeder Kleinigkeit
- vor Merge mindestens: Format, Lint, Unit Tests, Build, Pages-Check und Playwright Desktop/Mobile
- sichtbare UI vor Merge ausdrücklich visuell prüfen
