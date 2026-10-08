# Roadmap

## Produktdefinition

Die **MEDDPICC Toolbox** ist ausdrücklich **kein ganzheitliches MEDDPICC-System und kein CRM**.

Sie unterstützt Account Manager bei wiederkehrenden Aufgaben im komplexen B2B-Vertrieb durch drei klar getrennte Bausteine:

1. **Tools** – konkrete Arbeit vereinfachen, berechnen, strukturieren oder visualisieren.
2. **Checklists** – vor wiederkehrenden Situationen nichts Wesentliches vergessen und MEDDPICC-Begriffe nicht falsch interpretieren.
3. **Knowledge** – MEDDPICC-Konzepte schnell und praxisnah nachschlagen, ohne erneut im Buch suchen zu müssen.

Die Toolbox verwaltet keinen Deal vollständig. Sie soll nur dort helfen, wo ein fokussierter Service einen klaren praktischen Nutzen liefert.

## Harte Scope-Grenzen

Die Toolbox ist kein System of Record und baut insbesondere nicht:

- Pipeline- oder Forecast-Dashboards
- Account-, Kontakt- oder Opportunity-Verwaltung
- Activity Tracking oder generisches Task Management
- dauerhaft gepflegte MEDDPICC-Scores
- Deal-Health- oder Completeness-Dashboards
- verpflichtende Stage Gates
- historische Checklisten- oder Qualification-Pflege

Ein Account Manager darf niemals das Gefühl bekommen, neben dem CRM noch ein zweites CRM pflegen zu müssen.

## Produktbaustein A – Tools

Ein Tool gehört in die Toolbox, wenn es eine konkrete, wiederkehrende Arbeit in wenigen Minuten sinnvoll erleichtert.

Typische Ergebnisse:

- Berechnung
- Gesprächsvorbereitung
- Strukturierung
- Visualisierung
- kundenfähiges Artefakt
- kompakte interne Arbeitshilfe

### Qualitätsregel für Tools

**Konkrete Aufgabe öffnen → nur notwendige Inputs erfassen → nachvollziehbares Ergebnis erhalten → direkt weiterverwenden.**

Ein vollständiger Opportunity-Datensatz ist niemals Voraussetzung.

## Produktbaustein B – Checklists

Checklists sind **Lern- und Orientierungshilfen**, keine Deal-Scorecards.

Sie dienen zwei Zwecken:

1. wichtige Punkte in wiederkehrenden Situationen nicht vergessen;
2. MEDDPICC-Konzepte fachlich korrekt verstehen und typische Fehlinterpretationen vermeiden.

### Informationsmodell je Checklist-Punkt

Jeder Punkt soll – soweit fachlich sinnvoll – folgende Ebenen anbieten:

- **Prüffrage** – der schnelle Punkt zum Überfliegen
- **Worum geht es?** – fachliche Bedeutung
- **Warum ist das wichtig?** – Relevanz im Verkaufsprozess
- **Woran erkenne ich es?** – beobachtbare Hinweise oder Beispiele
- **Typische Fehlinterpretation** – was häufig fälschlich angenommen wird
- **Mögliche Frage oder Handlung** – wie der Account Manager den Punkt praktisch klären kann
- **Mehr erfahren** – optionaler vertiefender Hintergrund

Die Standardansicht bleibt kurz. Details werden bei Bedarf aufgeklappt.

### Was Checklists ausdrücklich nicht tun

- keinen Opportunity-Status erzeugen
- keinen historischen Deal-Fortschritt speichern
- keinen Management-Score ableiten
- keinen Pflicht-Workflow erzwingen
- keinen Account Manager zum vollständigen Ausfüllen zwingen

## Produktbaustein C – Knowledge

Knowledge ist eine kompakte, praxisnahe Referenz für MEDDPICC-Begriffe und angrenzende Konzepte.

Ziel:

> **Ich brauche gerade eine Erklärung – ich möchte nicht erneut im Buch nachschlagen.**

Knowledge-Inhalte sollen sich auf die bereitgestellten Primärquellen stützen und Unterschiede zwischen den Autoren kenntlich machen, wenn sie fachlich relevant sind.

Beispiele:

- Was macht einen Champion aus?
- Coach vs. Champion
- Wer ist der Economic Buyer?
- Decision Criteria
- Validation vs. Approval
- Decision Process vs. Paper Process
- Identify / Indicate / Implicate Pain
- Competition inklusive Status quo / No Decision
- Metrics und wirtschaftlicher Impact

## UX-Grundstruktur

Die Startseite bietet drei primäre Einstiege:

- **Tools**
- **Checklists**
- **Knowledge**

MEDDPICC bleibt darunter als **fachliche Orientierung**, ist aber nicht die einzige Navigation und kein vollständiger Deal-Workflow.

Zusätzlich gilt:

> Ein Account Manager denkt häufiger „Was muss ich gerade tun?“ als „Welchen MEDDPICC-Buchstaben möchte ich bearbeiten?“

Deshalb werden Werkzeuge und Checklisten nach konkreten Arbeitssituationen benannt.

---

## Phase T0 – Produkt-Neustart

- [x] Microtool-first Produktmodell festgelegt
- [x] vollständigen Opportunity-Datensatz als Voraussetzung entfernt
- [x] kundenfähige und interne Services unterschieden
- [x] Projektdatei zum optionalen Legacy-/Workspace-Konzept herabgestuft
- [x] bestehende technische Basis selektiv weiterverwendet

## Phase T1 – Referenz-Tool: Go-Live-Rückwärtsplanung

- [x] eigener Inputvertrag
- [x] deterministische Rückwärtsrechnung
- [x] Kalender- und Arbeitstage
- [x] Verantwortlichkeit Kunde / Anbieter / gemeinsam
- [x] Einordnung Decision Process / Paper Process / Implementierung
- [x] Vorlauf-/Kompressionshinweis
- [x] kundenfähige Timeline
- [x] SVG-Export
- [x] PNG-Export
- [x] Unit Tests
- [x] Playwright Desktop/Mobile
- [x] vollständige CI grün
- [x] sichtbare UI-Abnahme
- [x] Merge in `main`

## Phase T2 – Checklists & Knowledge Foundation

Diese Phase wird bewusst früh umgesetzt, weil die Wissensbasis später auch Hilfetexte innerhalb der Tools speisen kann.

### General-Merge / Stand 08.10.2026

- [x] **PR #46 · Discovery Call + SPICED** inklusive Quellen-UX nach erfolgreicher CI #468 in `main` gemergt.
- [x] **PR #47 · Decision Criteria Knowledge + Themen-Checklist** inklusive der drei Red-Team-Korrekturen nach CI #470 in `main` gemergt.
- [x] **Quellen-UX verbindlich:** Autoren und Quellen bei Discovery Call, Economic Buyer, Metrics, Decision Criteria und sämtlichen aktuellen Checklists **nur ganz unten, standardmäßig eingeklappt**; Produktregel in `AGENTS.md`.
- [x] Veralteten PR #38 zur Foundation als überholt geschlossen; die aktuelle Go-Live-Rückwärtsplanung und Toolbox-Foundation bleiben auf `main`.
- [x] **PR #48 · Decision Process Knowledge + Themen-Checklist** ist nach technischer und visueller Freigabe am 08.10.2026 in `main` gemergt.
- **Aktueller Draft-Slice:** Paper Process Knowledge + Themen-Checklist; Merge erst nach technischer QS und ausdrücklicher visueller Abnahme. Die umfassenden Decision-Criteria-Tools (Value Triangle, Criteria Workshop, Decision Matrix) bleiben in T6.

### Themen-Checklists

- [x] Metrics
- [x] Economic Buyer
- [x] Decision Criteria (in `main`)
- [x] Decision Process (PR #48, in `main`)
- [ ] Paper Process (Feature-Branch; Draft/visuelle Abnahme offen)
- [ ] Pain / Implication
- [ ] Champion
- [ ] Competition

### Situative Checklists

1. [x] Economic-Buyer-Termin
2. [x] Discovery Call
3. [ ] POC / Pilot vorbereiten
4. [ ] Pricing / kommerzielles Angebot vorbereiten
5. [ ] Go-Live-/Decision-Process-Plan prüfen
6. [ ] Closing / Paper Process prüfen

### Knowledge Foundation

- [x] einheitliches, typisiertes Content-Schema
- [x] kurze Standardansicht + vertiefende Erklärung
- [x] typische Fehlinterpretationen explizit dokumentieren
- [x] Quellenbezug je Thema nachvollziehbar halten
- [x] Inhalte zwischen Knowledge und Checklists wiederverwenden
- [x] Economic Buyer Knowledge als erster Referenz-Slice
- [x] Metrics Knowledge als zweiter quellengeprüfter Themen-Slice
- [x] Discovery Call als ergänzender SPICED-Wissensbereich
- [x] Decision Criteria Knowledge als dritter quellengeprüfter Themen-Slice (in `main`)
- [x] Decision Process Knowledge (PR #48, in `main`)
- [ ] Paper Process Knowledge (Feature-Branch, Merge/Freigabe offen)
- [ ] weitere Knowledge-Bereiche ausrollen

## Phase T3 – Value & Metrics Tools

Priorität:

1. **Quick Payback**
2. **Metric Builder**
3. **Cost of Delay**
4. **Business Case / Value Bridge**

Ziel: Pain oder Nutzen in nachvollziehbaren wirtschaftlichen Impact übersetzen.

Leitprinzip:

**Pain / Outcome → Metric → wirtschaftlicher Wert → Payback / Cost of Delay**

Keine dauerhafte Opportunity-Pflege.

## Phase T4 – Buying Process Tools

Aufbauend auf der vorhandenen Go-Live-Rückwärtsplanung:

- Go-Live Plan Builder
- Decision Process Mapper
- Paper Process Explorer
- Dependency / Parallelization Helper
- Procurement Prep

Diese Tools strukturieren konkrete Prozessarbeit, ohne daraus einen dauerhaft gepflegten Deal-Plan im CRM-Sinn zu machen.

## Phase T5 – Discovery & Pain Tools

- Discovery Prep
- Pain → Impact
- Identify / Indicate / Implicate Helper
- Compelling Event / Why Now Helper

Ziel ist eine konkrete Gesprächs- oder Workshop-Unterstützung, kein Discovery-Protokollsystem.

## Phase T6 – Decision Criteria & Differentiation Tools

Priorität:

- Criteria Workshop
- Value Triangle
- Danger Zone
- POC Success Criteria
- später optional Decision Matrix

Die Tools sollen Entscheidungskriterien verständlich machen und Differenzierung unterstützen, nicht den gesamten Beschaffungsprozess verwalten.

## Phase T7 – Economic Buyer Tools

- EB Qualifier
- EB Meeting Prep
- EB Access Strategy
- EB Value Story / Executive Value Narrative

Einzelne Funktionen wie Message Translation oder Kontaktvorbereitung werden zunächst innerhalb dieser Services gebündelt und nicht künstlich zu eigenen Produkten gemacht.

## Phase T8 – Champion Tools

- Champion Tester
- Champion Development Helper
- Internal Selling Pack

Vorhandene Champion-Domainlogik darf selektiv wiederverwendet werden. Das frühere projektzentrierte UI-/Datenmodell wird nicht übernommen.

## Phase T9 – Competition & Closing Tools

### Competition

- Competition / Alternatives Map
- Differentiation Strategy
- Build vs. Buy Helper
- Status Quo / Inertia Check

Competition umfasst ausdrücklich nicht nur andere Anbieter, sondern auch Eigenentwicklung, andere Initiativen, Ressourcenprioritäten und Nichtstun.

### Closing

- Closing Readiness Checklist
- Paper Process Helper
- Dependency Check

Kein Closing-Dashboard und kein dauerhaft gepflegter Deal-Status.

## Phase T10 – Cross-Service Convenience

Erst wenn mehrere Services produktiv sind:

- Ergebnisse optional an ein passendes Folgetool übergeben
- temporärer Session Context statt globalem Opportunity-Schema
- gemeinsame kundenfähige Exporte
- PDF / Präsentationsformate prüfen
- optionaler Deal Pack Export

Leitregel:

> **Informationen dürfen zwischen Services weitergegeben werden, müssen aber niemals zentral als vollständiger Deal gepflegt werden.**

## Priorisierungsregel für neue Features

Ein neues Feature wird nur aufgenommen, wenn mindestens eine dieser Fragen klar mit Ja beantwortet werden kann:

- Spart es dem Account Manager wiederkehrende Arbeit?
- Verhindert es eine typische fachliche Fehlinterpretation?
- Bereitet es einen konkreten Kundentermin oder Sales-Schritt besser vor?
- Erzeugt es eine hilfreiche Berechnung, Visualisierung oder kundenfähige Unterlage?
- Macht es relevantes MEDDPICC-Wissen schneller zugänglich?

Wenn der primäre Nutzen hingegen „mehr Deal-Daten erfassen, speichern oder reporten“ lautet, gehört das Feature nicht in den Core der Toolbox.
