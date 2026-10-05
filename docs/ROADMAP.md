# Roadmap

Die Roadmap priorisiert ein belastbares portables Projektmodell vor Feature-Breite. Alle späteren Tools hängen von einem verlässlichen File Lifecycle und gemeinsamen Domain Model ab.

## Phase 0 – Foundation

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
- Formatting/Linting
- Vitest
- Playwright-Baseline
- GitHub Actions CI
- GitHub Pages Deployment
- minimale accessible Application Shell
- Architekturentscheidung zum Runtime-Schema-Validator
- erstes formales `.meddpicc`-Schema

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

## Phase 1 – Project File Lifecycle

**Ziel:** Projekte zuverlässig erstellen, öffnen, validieren, migrieren, bearbeiten und speichern.

Deliverables:

- Neues-Projekt-Flow
- Projekt-öffnen-Flow
- Validierungsfehler
- Handling nicht unterstützter Versionen
- Migrationsframework
- Dirty-State-Tracking
- Save As / Download
- optionale File System Access API
- Crash-/Unsaved-Recovery-Konzept
- bereinigtes Demo-Projekt

Acceptance Criteria:

- gültige Dateien round-trippen ohne Datenverlust
- ungültige Datei wird niemals teilweise geladen
- zukünftige nicht unterstützte Schema-Version wird nicht überschrieben
- unterstütztes altes Fixture migriert deterministisch
- Nutzer wird vor Verlust ungespeicherter Änderungen gewarnt

## Phase 2 – Gemeinsames Qualifizierungsmodell

**Ziel:** bereichsübergreifende Objekte für alle MEDDPICC-Bereiche implementieren.

Deliverables:

- Projektmetadaten
- Evidenzregister
- Referenzen
- Risiken
- nächste Aktionen
- Historie
- gemeinsames Statusmodell
- Dashboard-Zusammenfassung

Acceptance Criteria:

- ein Evidenzobjekt kann mehrere Aussagen stützen
- Annahmen und Unbekanntes sind visuell von bestätigter Evidenz unterscheidbar
- Risiken/Aktionen verlinken auf MEDDPICC-Bereich oder Prozessschritt
- Dashboard Findings sind auf Source Data zurückführbar

## Phase 3 – MEDDPICC-Kernmodule

**Ziel:** vollständige strukturierte Qualifizierung unterstützen.

Module:

- Metrics
- Economic Buyer
- Decision Criteria
- Decision Process
- Paper Process
- Identify / Implicate Pain
- Champion
- Competition

Acceptance Criteria:

- jedes Modul unterstützt Evidenzlinks
- jedes Modul unterstützt explizit „Unbekannt“
- Module erzeugen strukturierte Gaps ohne generative AI
- kein Modul pflegt Duplikate gemeinsamer Evidenz-/Risiko-/Aktionsdaten

## Phase 4 – Deterministische Tools

**Ziel:** repetitive Analyse- und Planungsarbeit automatisieren.

### Value Tools

- Metrics-/Value-Calculator
- ROI
- Payback
- Cost of Delay
- Current-State-/Future-State-Vergleich

### Process Tools

- Dependency Planner
- Go-Live-Rückwärtsplanung
- Critical Path / Slack
- Closing Checklist
- Prüfung fehlender Owner/Termine/Abhängigkeiten

### Qualification Tools

- Decision-Criteria-Matrix
- Champion-Evidence-Check
- Evidence-/Confidence-Scoring
- Deal-Health-Regeln

Acceptance Criteria:

- Berechnungen sind reine getestete Funktionen
- gleiche Inputs liefern gleiche Outputs
- abgeleitete Findings erklären Regel und Inputs
- Business-Case-Zahlen können Evidenz referenzieren
- Planungsannahmen können geändert werden, ohne wie bestätigte Evidenz zu wirken

## Phase 5 – Review und Export

**Ziel:** strukturierte Projektdaten wiederverwenden statt Deal-Review-Inhalte manuell neu zu bauen.

Deliverables:

- Executive Deal Review
- Manager Deal Review
- MEDDPICC-Zusammenfassung
- Risiko-/Aktionsübersicht
- kundenfähiger Go-Live-Plan
- druckfreundliche Ansicht
- Markdown-Export
- CRM-fähige Textzusammenfassung

Acceptance Criteria:

- Exporte entstehen nur aus aktuellem Projektstand
- interne Outputs unterscheiden Evidenz, Annahme, Unbekannt und Risiko
- kundenfähige Outputs schließen interne Felder bewusst aus
- Export benötigt kein Backend
- gleicher Projektstand erzeugt konsistente Outputs

## Phase 6 – Hardening

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

## Später / optional

Erst nach stabilem local-first Single-User-Produkt:

- verschlüsselte Projektdateien
- optionale CRM Adapter
- optionale Cloud Storage Adapter
- Collaboration
- Plugin System
- organisationsspezifische Rule Packs

Diese Funktionen dürfen die local-first Basis nicht kompromittieren.

## Release-Strategie

Vorgeschlagene Milestones:

- **0.1** – Project Lifecycle + Schema
- **0.2** – Evidenz / Risiken / Aktionen / Dashboard
- **0.3** – vollständige MEDDPICC-Module
- **0.4** – Value- und Process-Tools
- **0.5** – Exporte und Deal Review
- **1.0** – stabiles Dateiformat, Migrationen, gehärteter local-first Workflow

Mit 1.0 wird das Project File Format als langfristiger Kompatibilitätsvertrag behandelt.
