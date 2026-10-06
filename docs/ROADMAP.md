# Roadmap

Die Roadmap priorisiert ein belastbares portables Projektmodell und danach **konkrete Verkäufer-Workflows**. MEDDPICC Workbench soll kein CRM nachbauen und keine zusätzliche Datenpflege-Schicht werden.

## Produktleitbild ab 0.3

Die Workbench soll repetitive Qualification- und Deal-Planning-Arbeit reduzieren:

- **Workflows statt Datensätze:** Der Nutzer startet mit einer Aufgabe wie „Deal prüfen“, „POC freigeben?“, „Champion testen“ oder „Business Case rechnen“.
- **Deterministisch by default:** MEDDPICC-Logik, Gaps, Priorisierung, Berechnungen und Prozessplanung werden durch nachvollziehbare Domain Services gelöst.
- **Evidence first:** Jede abgeleitete Aussage muss auf strukturierten Projektdaten, Evidence oder expliziten Annahmen beruhen.
- **„Unbekannt“ bleibt gültig:** Fehlende Information wird nicht durch Vermutungen ersetzt.
- **Capture once, derive many:** Informationen sollen möglichst einmal strukturiert erfasst und anschließend von mehreren Tools wiederverwendet werden.
- **Keine CRM-Doppelpflege:** Keine Account-/Kontaktverwaltung, Pipeline, generische Activity Timeline oder allgemeine Task-Verwaltung im Core.
- **AI nur optional:** Unstrukturierte Inputs wie Transkripte oder freie Notizen dürfen später optional durch AI in Candidate Evidence umgewandelt werden. AI darf die kanonischen Projektdaten nicht ungeprüft verändern.
- **Local-first bleibt verbindlich:** Die .meddpicc-Datei bleibt Source of Truth. Kein verpflichtendes Backend und keine verpflichtende AI-API.

Die geplanten „Services“ sind zunächst **modulare Domain Services/Microtools innerhalb der local-first Webanwendung**, keine verteilten Netzwerk-Microservices. Erst wenn später ein belastbarer technischer Grund dafür entsteht, darf eine physische Service-Trennung geprüft werden.

## Phase 0 – Foundation ✅

**Ziel:** stabile Entwicklungs-, Design- und Deployment-Basis schaffen.

Deliverables:

- repository-weite Agent-Anweisungen
- deutsche Projektsprache als verbindliche Regel
- MEDDPICC Workbench Design System
- lokaler UI/UX-Skill
- dokumentierte UI-UX-Pro-Max-Referenz/Provenienz
- Vue 3 + TypeScript + Vite
- Repository-Struktur
- zentrale Design Tokens
- Formatting/Linting ✅
- Vitest
- Playwright-Baseline ✅
- GitHub Actions CI
- GitHub Pages Deployment
- minimale accessible Application Shell
- Architekturentscheidung zum Runtime-Schema-Validator ✅
- erstes formales `.meddpicc`-Schema ✅

Acceptance Criteria:

- Pull Requests bauen und testen automatisch.
- `main` deployt eine statische Site.
- Anwendung sendet keine Opportunity-Daten über das Netzwerk.
- Projektschema ist versioniert und durch Fixtures getestet.
- Application Shell folgt `docs/DESIGN_SYSTEM.md`.
- Shell/Navigation sind per Tastatur bedienbar und haben sichtbaren Fokus.
- MEDDPICC-Status wird nicht nur über Farbe vermittelt.
- Keine externe Webfont-/CDN-Abhängigkeit ist für das UI erforderlich.
- Normale UI-Sprache ist Deutsch.

## Phase 1 – Project File Lifecycle ✅

**Ziel:** Projekte zuverlässig erstellen, öffnen, validieren, migrieren, bearbeiten und speichern.

**Core abgeschlossen:** formales Schema 0.2.0, Runtime-Validator, strukturierte Fehler, zukünftige Major-Versionen blockieren, Domain Validation, Round-Trip-Baseline, bereinigtes Demo-Fixture, browserbasierter Project File Lifecycle sowie eine deterministische Migration des historischen Schema-0.1.0-Fixtures auf 0.2.0. Die File System Access API bleibt ein optionales Progressive Enhancement.

Deliverables:

- Neues-Projekt-Flow ✅
- Projekt-öffnen-/Import-Flow ✅
- Validierungsfehler im UI ✅
- Handling nicht unterstützter Versionen ✅
- Migrationsframework ✅
- Dirty-State-Tracking ✅
- Save As / Download ✅
- optionale File System Access API *(Progressive Enhancement, nicht blockierend)*
- Crash-/Unsaved-Recovery-Konzept ✅
- bereinigtes Demo-Projekt ✅

Acceptance Criteria:

- gültige Dateien round-trippen ohne Datenverlust ✅
- ungültige Datei wird niemals teilweise geladen ✅
- zukünftige nicht unterstützte Schema-Version wird nicht überschrieben ✅
- unterstütztes altes Fixture migriert deterministisch ✅
- Nutzer wird vor Verlust ungespeicherter Änderungen gewarnt ✅

## Phase 2 – Gemeinsames Qualifizierungsfundament ✅ für die nächste Produktstufe

**Ziel:** die gemeinsamen Daten- und Traceability-Bausteine bereitstellen, auf denen die Coaching-Services arbeiten.

Die Slices für Evidence (PR #23), Risiken/Aktionen (PR #25), Source-/Reference-Records (PR #27) sowie Projektmetadaten und konkrete Evidence-to-Entity-Verknüpfung (PR #28) sind auf `main` gemergt.

Deliverables:

- Projektmetadaten ✅
- zentrales Evidenzregister ✅
- Classification, Verification und Quality getrennt ✅
- Reference-/Source-Records ✅
- konkrete Evidence-to-Qualification-Entity-Verknüpfung ✅
- projektweite Risiken ✅
- nächste Aktionen ✅
- deterministische Source-Traceability ✅
- Dirty-State und atomar validierte Mutationen ✅
- Basis-History für implementierte Flows ✅
- gemeinsames Statusmodell als vorhandene Grundlage ✅

Bewusste Restpunkte werden **nicht vorgezogen**, nur weil sie Datenmodell-Arbeit sind. Weitere History-/Status-Felder oder Champion-Behavior-IDs werden erst ergänzt, wenn ein konkreter Coaching-Service sie benötigt.

Acceptance Criteria:

- Annahmen, Interpretationen, unbekannte Informationen und bestätigte Evidence bleiben unterscheidbar ✅
- ein Evidenzobjekt kann mehrere stabil adressierbare Qualification-Entities stützen ✅
- Evidence → Entity ist deterministisch ableitbar ✅
- sichtbare Risk-/Action-Findings sind auf Evidence und References zurückführbar ✅
- keine Schemaerweiterung ohne belegten fachlichen Use Case ✅

Fortschritt und Handoff: `docs/PROGRESS.md`

## Phase 3 – Deterministische MEDDPICC Deal-Reasoning- und Coaching-Services

**Ziel:** aus vorhandenen Deal-Daten konkrete Entscheidungen und nächste Verkäuferaktionen ableiten. Phase 3 ersetzt die bisher geplante Strategie, acht MEDDPICC-Bereiche primär als Bearbeitungsmasken nachzubauen.

### 3A – Deal Inspector / Qualification Gap Engine

Analysiert den gesamten Deal und beantwortet:

- Was wissen wir belastbar?
- Was ist nur Annahme oder unbekannt?
- Welche Qualification Gaps sind kritisch?
- Welche Risiken gefährden Progression, Close oder Ressourceninvestment?
- Welche konkrete Evidence fehlt?

Beispiel:

> Pain ist bestätigt, aber Business Impact nicht quantifiziert.  
> Economic Buyer ist nur Kandidat, direkter Zugang fehlt.  
> Paper Process ist mit dem Target Close aktuell nicht vereinbar.

**Technik:** reine, testbare Regeln über strukturierte Projektdaten. Keine AI notwendig.

### 3B – Next Best Action Engine

Priorisiert aus den offenen Gaps **wenige konkrete nächste Sales-Aktionen** statt einer generischen Taskliste.

Bewertet u. a.:

- Deal Impact
- Dringlichkeit
- Abhängigkeit für spätere Schritte
- vorhandene Evidence
- Aufwand zum Schließen des Gaps
- Target Close / Go-Live

Jede Empfehlung muss ein „Warum jetzt?“ liefern und auf die auslösenden Daten/Regeln zurückführbar sein.

**Technik:** deterministische Priorisierungs- und Regelengine. Keine AI notwendig.

### 3C – Qualification Gates / Pause Points

Prüft vor ressourcenintensiven oder irreversiblen Sales-Aktivitäten, ob der Deal ausreichend qualifiziert ist.

Geplante Gates:

- Demo
- POC / Pilot
- Proposal
- Pricing
- Reference Call
- Executive Meeting
- Contract / Legal Start
- Commit Forecast
- Close

Beispiel:

> POC aktuell nicht empfohlen: Economic Buyer nicht validiert und Success Criteria nicht bestätigt.

Die Engine blockiert nichts technisch, sondern gibt eine begründete Empfehlung und zeigt fehlende Vorbedingungen.

**Technik:** deterministische Regeln. Keine AI notwendig.

### 3D – Champion Tester

Prüft einen Champion nicht anhand eines Labels, sondern anhand nachweisbarer Verhaltenssignale.

Mögliche Prüfbereiche:

- liefert interne Informationen
- hilft beim Decision Process
- verschafft Zugang zum Economic Buyer
- verkauft intern für uns
- besitzt Einfluss
- hat persönlichen Nutzen / Motivation
- unterstützt bei Wettbewerb und internen Hürden

Output:

- belegte Signale
- fehlende Belege
- Status „Kandidat / teilweise bewiesen / belastbar“
- nächster sinnvoller Champion-Test

**Technik:** Evidence-basierte Regeln. Keine AI notwendig.

### 3E – Economic Buyer Coach

Hilft nicht bei Kontaktverwaltung, sondern bei der **Validierung und Bearbeitung des Economic-Buyer-Gaps**.

Prüft u. a.:

- Candidate bekannt?
- Entscheidungs-/Budgetautorität bestätigt?
- direkter Zugang?
- Pain / Metrics mit EB validiert?
- Priorität bestätigt?
- Business Case verstanden/akzeptiert?
- nächster Return Ticket vereinbart?

Output:

- aktueller EB-Status
- kritische Lücken
- empfohlene nächste Aktion
- passende Gesprächsziele und redaktionell gepflegte Fragebausteine

**Technik:** deterministische Zustands-/Regellogik plus Question Library. Keine AI notwendig.

### 3F – Metrics & Business Case Builder

Übersetzt bestätigten Pain in belastbare wirtschaftliche Größen.

Funktionen:

- Current-State-Baseline
- Volumen × Zeit × Kosten
- Fehler-/Ausfallkosten
- Zielverbesserung
- jährlicher Nutzen
- ROI
- Payback
- Cost of Delay
- Szenarien
- Current State vs. Future State

Jeder Input trägt seinen Evidence-Status. Eine mathematisch korrekte Rechnung darf sichtbar als unsicher markiert werden, wenn Inputs auf Annahmen beruhen.

**Technik:** reine Berechnungsfunktionen. Keine AI notwendig.

### 3G – Decision Process / Paper Process / Closing Planner

Modelliert Entscheidungs- und Beschaffungsprozesse als Schritte mit:

- Owner
- Status
- Dauer
- Abhängigkeiten
- Evidence
- Terminen

Funktionen:

- fehlende Schritte/Owner erkennen
- Dependencies prüfen
- Rückwärtsplanung vom Target Close / Go-Live
- Critical Path und Slack
- frühestmöglichen Abschluss berechnen
- Konflikt zwischen gewünschtem Close und realistischem Prozess sichtbar machen

**Technik:** Graph-/Dependency- und Datumslogik. Keine AI notwendig.

### 3H – Meeting Prep Coach

Erstellt aus strukturiertem Dealstand eine fokussierte Vorbereitung für den nächsten Kundentermin:

- relevantes Meeting-Ziel
- wichtigste bekannte Fakten
- offene Hypothesen
- kritische MEDDPICC-Gaps
- 3–7 passende Fragen aus einer gepflegten Question Library
- gewünschtes Outcome / Return Ticket

Der Service soll **keine generischen Fragenlisten** ausgeben, sondern nur Fragen, die zu den aktuellen Gaps und Gesprächspartnern passen.

**Technik:** regelbasierte Auswahl aus einer Question Library. Keine AI notwendig; AI kann später nur die Formulierung optional verfeinern.

### Gemeinsame Acceptance Criteria für Phase 3

- jeder Service ist als eigener Domain Service testbar
- kein Service benötigt eine AI-/LLM-Runtime
- gleicher Projektstand liefert gleiche fachliche Ergebnisse
- jede Empfehlung nennt Regel und relevante Inputs
- Evidence, Annahme und Unbekannt bleiben getrennt
- ein Service erzeugt keine CRM-artige Doppelpflege
- Outputs priorisieren wenige handlungsrelevante Findings statt maximaler Informationsmenge
- UI startet vom Verkäufer-Workflow, nicht von einer Datenbankmaske

## Phase 4 – Workflow-Orchestrierung und Seller UX

**Ziel:** die Services zu einer Arbeitsoberfläche verbinden, die der Account Manager freiwillig nutzt.

Geplante Einstiege:

- Deal prüfen
- nächste beste Aktion
- „Sind wir bereit für …?“
- Champion prüfen
- Economic Buyer bearbeiten
- Business Case rechnen
- Closing Plan prüfen
- nächstes Meeting vorbereiten

Die Startseite soll zunehmend **aktuelle Handlungsbedarfe** zeigen statt nur Projektmetadaten.

Beispiel:

- kritisch: Economic Buyer nicht validiert
- kritisch: Paper Process überschreitet Target Close
- mittel: Pain bestätigt, aber nicht quantifiziert
- nächster sinnvoller Schritt: Champion um EB-Introduction bitten

Bewusst nicht Teil dieser Phase:

- Accounts-Datenbank
- Kontaktverwaltung
- Pipeline Board
- generische Task-App
- E-Mail-Client
- Kalender
- Activity Timeline wie im CRM
- automatische Datenübernahme aus externen Systemen

## Phase 5 – Review und Export

**Ziel:** strukturierte Projektdaten und Reasoning-Ergebnisse wiederverwenden, statt Deal-Review-Inhalte manuell neu zu bauen.

Deliverables:

- Executive Deal Review
- Manager Deal Review
- MEDDPICC-Zusammenfassung
- wichtigste Gaps + Next Best Actions
- Risiko-/Aktionsübersicht
- kundenfähiger Go-Live-/Closing-Plan
- druckfreundliche Ansicht
- Markdown-Export
- CRM-fähige Textzusammenfassung

Acceptance Criteria:

- Exporte entstehen nur aus aktuellem Projektstand
- interne Outputs unterscheiden Evidence, Annahme, Unbekannt und Risiko
- abgeleitete Findings nennen ihre Grundlage
- kundenfähige Outputs schließen interne Felder bewusst aus
- Export benötigt kein Backend
- gleicher Projektstand erzeugt konsistente Outputs

## Phase 6 – Optionale AI-assisted Input Layer

**Ziel:** unstrukturierte Informationen komfortabel in strukturierte Candidate Evidence überführen, ohne die deterministische MEDDPICC-Engine durch ein LLM zu ersetzen.

Mögliche Inputs:

- Meeting-Transkripte
- freie Meeting-Notizen
- Dokumente
- E-Mail-Inhalte, sofern vom Nutzer bewusst bereitgestellt

Pipeline:

1. unstrukturierter Input
2. AI extrahiert **Candidate Facts / Candidate Evidence**
3. Herkunft und Textbezug bleiben sichtbar
4. Nutzer bestätigt, korrigiert oder verwirft
5. erst bestätigte Informationen werden in kanonische Projektdaten übernommen
6. deterministische Phase-3-Services analysieren anschließend den neuen Stand

Regeln:

- AI ist optional
- kein stiller Upload
- keine ungeprüfte Mutation der .meddpicc-Datei
- lokale Modelle und Cloud-Provider sind austauschbare Adapter
- Core-Funktionalität bleibt ohne AI vollständig nutzbar
- keine Halluzination darf als bestätigte Evidence gespeichert werden

## Phase 7 – Hardening

**Ziel:** die Workbench für wiederkehrende reale Nutzung robust machen.

Deliverables:

- vollständiges Accessibility Review
- Keyboard-Navigation-Audit
- Responsive-Audit
- optionale PWA-/Offline-Funktion
- stärkerer Recovery Flow
- Schema-Migration-Testmatrix
- Performance-Tests mit großen Projekten
- Security Review
- Privacy Verification
- Import-/Export-Regression-Fixtures
- UI-Konsistenz-Audit gegen das Design System
- Regressionstests für alle Reasoning Rules
- nachvollziehbare Versionierung von Rule Packs

## Später / optional

Erst nach stabilem local-first Single-User-Produkt:

- verschlüsselte Projektdateien
- optionale CRM Adapter
- optionale Cloud Storage Adapter
- Collaboration
- Plugin System
- organisationsspezifische Rule Packs
- optionale lokale oder Cloud-AI-Provider

Diese Funktionen dürfen die local-first Basis und die deterministische Erklärbarkeit nicht kompromittieren.

## Release-Strategie

Vorgeschlagene Milestones:

- **0.1** – Project Lifecycle + Schema
- **0.2** – Evidence / Risks / Actions / Traceability
- **0.3** – Deal Inspector + Qualification Gaps + Next Best Action + Qualification Gates
- **0.4** – Champion / Economic Buyer / Value / Process / Meeting Prep
- **0.5** – Workflow-Orchestrierung + Deal Review + Exporte
- **0.6** – optionale AI-assisted Information Extraction
- **1.0** – gehärtete local-first Workbench mit stabilem Dateiformat und versionierten Reasoning Rules

Mit 1.0 wird das Project File Format als langfristiger Kompatibilitätsvertrag behandelt.
