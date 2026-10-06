# Agent-Anweisungen

Diese Anweisungen gelten für das gesamte Repository von MEDDPICC Workbench.

## Projektsprache

**Die Projektsprache ist Deutsch.**

Das gilt insbesondere für:

- Benutzeroberfläche und alle sichtbaren UI-Texte
- Dokumentation
- Issues und Pull Requests
- fachliche Beschreibungen
- Fehlermeldungen und Hilfetexte
- Beispieldaten, sofern sie nicht bewusst einen internationalen Use Case abbilden

Ausnahmen:

- etablierte MEDDPICC-Fachbegriffe wie `Metrics`, `Economic Buyer`, `Decision Criteria`, `Decision Process`, `Paper Process`, `Champion` und `Competition`
- etablierte technische Begriffe, wenn die deutsche Übersetzung unüblich oder unpräzise wäre, z. B. `local-first`, `Runtime`, `Schema`, `Migration`, `Build`, `CI`
- Code, API-Namen, Dateinamen, Schema-Keys, Variablen-, Funktions- und Typnamen
- Conventional-Commit-Präfixe wie `feat:`, `fix:`, `docs:`

Englische Fachbegriffe dürfen in deutschen Sätzen verwendet werden. Normale Produkt- und UI-Sprache darf nicht unnötig anglisiert werden.

Beispiele:

- UI: **„Bestätigt“**, nicht „Confirmed“
- UI: **„Unbekannt“**, nicht „Unknown“
- UI: **„Nächste Aktion“**, nicht „Next Action“
- Fachbegriff: **„Economic Buyer“** bleibt „Economic Buyer“
- Fachbegriff: **„Paper Process“** bleibt „Paper Process“
- Code: `targetCloseDate` bleibt Englisch

## Produktziel

MEDDPICC Workbench ist eine **local-first Deal-Reasoning- und Coaching-Workbench für komplexe B2B-Opportunities nach MEDDPICC**.

Das Produkt soll dem Account Executive / Strategic Account Manager repetitive Analyse-, Qualifizierungs- und Planungsarbeit abnehmen. Der Schwerpunkt liegt auf **Verkäufer-Workflows und Entscheidungen**, nicht auf der Pflege von CRM-artigen Datensätzen.

Verbindliche Produktlogik:

- **Workflows statt Datensätze:** Ausgangspunkt sind Aufgaben wie „Deal prüfen“, „nächste Aktion bestimmen“, „POC freigeben?“, „Champion testen“, „Economic Buyer bearbeiten“, „Business Case rechnen“, „Closing Plan prüfen“ oder „Meeting vorbereiten“.
- **Deterministisch by default:** MEDDPICC-Reasoning, Gap Detection, Priorisierung, Berechnungen und Prozessplanung werden als nachvollziehbare Domain Services umgesetzt.
- **Evidence first:** Jede abgeleitete Aussage muss auf strukturierten Projektdaten, Evidence oder expliziten Annahmen beruhen.
- **Unbekannt bleibt gültig:** Fehlende Informationen niemals für einen Score oder eine Empfehlung erfinden.
- **Capture once, derive many:** Informationen möglichst einmal erfassen und in mehreren Services wiederverwenden.
- **Keine CRM-Doppelpflege:** Account-/Kontaktverwaltung, Pipeline, Activity Timeline und generische Task-Verwaltung gehören nicht in den Core.
- **AI nur optional als Input-Layer:** Ein späterer AI-Adapter darf unstrukturierte Inhalte in Candidate Evidence überführen. Die eigentliche MEDDPICC-Reasoning-Logik bleibt deterministisch und ohne AI vollständig nutzbar.
- **Services sind zunächst Domain Services/Microtools:** „Microservice“ bedeutet im Produktkontext nicht automatisch ein separates Netzwerk-Backend. Eine physische Service-Trennung braucht einen eigenen technischen Grund.

Priorisierte Coaching-Services gemäß Roadmap:

1. Deal Inspector / Qualification Gap Engine
2. Next Best Action Engine
3. Qualification Gates / Pause Points
4. Champion Tester
5. Economic Buyer Coach
6. Metrics & Business Case Builder
7. Decision / Paper Process / Closing Planner
8. Meeting Prep Coach

Vor der Umsetzung eines Features sind zu lesen:

1. `README.md`
2. `docs/PROJECT_CHARTER.md`
3. `docs/ROADMAP.md`
4. `docs/PROGRESS.md` – bestimmt den aktuell nächsten empfohlenen Slice
5. `docs/ARCHITECTURE.md`
6. `docs/PROJECT_FILE_SPEC.md`
7. bei UI/UX-Arbeiten zusätzlich `docs/DESIGN_SYSTEM.md`

Bei Widersprüchen zur Feature-Priorität haben die aktuelle `ROADMAP.md` und `PROGRESS.md` Vorrang vor älteren Beschreibungen bereits implementierter Oberflächen.

## Nicht verhandelbare Architekturregeln

- Die portable `.meddpicc`-Projektdatei ist die kanonische Source of Truth der Opportunity.
- Kein verpflichtendes Backend einführen.
- Kein Core-Feature darf eine AI-/LLM-Runtime oder externe AI-API voraussetzen.
- Ein späterer optionaler AI-Input-Adapter muss opt-in sein, Candidate Evidence erzeugen und darf kanonische Projektdaten niemals ungeprüft verändern.
- Opportunity- oder Projektdaten standardmäßig nicht hochladen oder synchronisieren.
- Die Anwendung nicht zu CRM, E-Mail-Client, Kalender, Kontaktdatenbank, Pipeline-Management-Suite, Activity Timeline oder generischer Task-App ausweiten.
- Deterministische Berechnungen, Qualification Gaps, Priorisierungen und Empfehlungen gehören in Domain Services und nicht versteckt in UI-Komponenten.
- Keine neuen CRUD-Oberflächen nur deshalb bauen, weil das Schema ein Feld enthält. Jede neue Arbeitsoberfläche braucht einen klaren Seller-Workflow oder Coaching-Use-Case.
- Keine „magischen“ Gesamt-Scores oder Win-Probabilities ohne fachlich explizites, erklärbares Modell.
- Jede abgeleitete Empfehlung muss ihre Regel und relevante Inputs nachvollziehbar machen können.
- Annahmen, unbekannte Informationen, Kundenaussagen, Interpretationen und bestätigte Evidenz müssen unterscheidbar bleiben.
- „Unbekannt“ ist ein gültiger Zustand.
- Jede Schema-Änderung muss Kompatibilität und Migration berücksichtigen.
- `schema/meddpicc-project.schema.json` ist der kanonische Dateiformatvertrag. Projekt-Typen werden daraus generiert; kein paralleles manuelles TypeScript-Dateimodell pflegen.
- Nach Schema-Änderungen mindestens `npm run schema:generate`, Unit Tests und Production Build prüfen.

## Feature-Fit-Gate

Vor jedem neuen Feature beantworten:

1. Welche konkrete, heute aufwändige oder fehleranfällige Arbeit des Sellers wird reduziert?
2. Welche Entscheidung oder nächste Aktion wird dadurch besser?
3. Kann vorhandener strukturierter Deal-Kontext wiederverwendet werden, statt neue Doppelpflege zu erzeugen?
4. Ist die Logik deterministisch und erklärbar lösbar?
5. Führt das Feature versehentlich in Richtung CRM-/Task-/Kontaktverwaltung?

Wenn der primäre Nutzen nur „mehr Felder pflegen“ oder „mehr Daten anzeigen“ lautet, gehört das Feature wahrscheinlich nicht in den Core.

## UI/UX-Anweisung

Bei jeder Aufgabe, die Screens, Navigation, Formulare, Tabellen, Charts, Statusanzeigen, Responsive-Verhalten oder Interaktionsmuster erstellt oder verändert:

1. `docs/DESIGN_SYSTEM.md` lesen und befolgen.
2. Bei Icon-Nutzung zusätzlich `docs/ICON_SYSTEM.md` lesen und die dort festgelegten Lucide-Zuordnungen verwenden.
3. Den lokalen Skill `.agents/skills/meddpicc-ui-ux/SKILL.md` als UI/UX-Checkliste verwenden.
4. `nextlevelbuilder/ui-ux-pro-max-skill` nur als **Entwicklungsreferenz**, niemals als Runtime-Abhängigkeit behandeln.
5. Bei Nutzung der Upstream-Referenz den in `docs/UI_UX_REFERENCE.md` dokumentierten Stand bevorzugen.
6. Keine Upstream-Datensätze oder größeren Textmengen kopieren, außer dies wurde bewusst geprüft und die Lizenzhinweise werden erhalten.

Das MEDDPICC-spezifische Design System hat Vorrang vor generischen Upstream-Empfehlungen.

## Designrichtung

Die Standardrichtung ist:

- professionelle B2B-/Enterprise-Workbench
- minimal und informationsdicht
- beeinflusst durch Accessible & Ethical, Swiss/Minimal, Data-Dense Dashboard und Drill-Down
- neutrale Flächen mit zurückhaltenden semantischen Farben
- klare Informationshierarchie
- wenig dekorative Bewegung
- kein Glassmorphism, keine Neon- oder AI-Gradienten, keine Marketing-Hero-Layouts und kein dekorativer Dashboard-Ballast in der Arbeitsoberfläche

## Accessibility

Accessibility ist eine Basisanforderung und kein späterer Feinschliff.

- Semantisches HTML verwenden.
- Alle Funktionen müssen per Tastatur bedienbar sein.
- Fokuszustände sichtbar machen.
- Bedeutung niemals ausschließlich über Farbe vermitteln.
- `prefers-reduced-motion` berücksichtigen.
- Ausreichenden Kontrast sicherstellen.
- Charts benötigen für wesentliche Informationen eine zugängliche Text- oder Tabellenalternative.
- Interaktive Controls benötigen zugängliche Namen und korrekte Zustandssemantik.

## Privacy-sensitive UI-Regeln

- Keine Fonts, Scripts, Icons, Analytics oder sonstige Assets aus Drittanbieter-CDNs in Produktion laden, sofern dies nicht ausdrücklich architektonisch geprüft wurde.
- Gebündelte Assets und Systemfonts bevorzugen.
- Keine Telemetrie hinzufügen, die Projektinhalte empfangen könnte.
- Externe URLs in einer Projektdatei sind nur Daten und dürfen niemals automatisch Requests auslösen.

## Umsetzungsqualität

- Vue 3 Composition API mit `<script setup lang="ts">` bevorzugen.
- Pinia nur für tatsächlich view-übergreifenden State verwenden.
- Abgeleitete UI-Werte über `computed` modellieren.
- Domain-Berechnungen rein und testbar halten.
- Native semantische Controls statt klickbarer `div`-Elemente bevorzugen.
- Deterministische Regeln und Regressionen testen.
- Responsive-Verhalten ungefähr bei 375, 768, 1024 und 1440 px prüfen.
- Keine beliebigen Spacing-Werte; Design Tokens verwenden.

## Review-Fragen

Vor Abschluss einer UI-Arbeit prüfen:

- Ist innerhalb weniger Sekunden sichtbar, was im Deal Aufmerksamkeit braucht und wo der Seller weiterarbeiten sollte?
- Unterstützt der Screen einen Verkäufer-Workflow statt eine Datenbankstruktur abzubilden?
- Ist die wichtigste Deal-Information ohne Suchen sichtbar?
- Lassen sich Evidenz und Annahme anhand Text/Icon unterscheiden und nicht nur anhand Farbe?
- Kann die Aufgabe vollständig per Tastatur erledigt werden?
- Funktioniert das UI auch mit längeren deutschen und englischen Fachbegriffen?
- Funktioniert es bei Browser-Zoom und Textskalierung ohne Clipping?
- Ist jeder Chart wirklich hilfreicher als Tabelle oder Direktwert?
- Wurde eine unnötige Runtime-Netzwerkabhängigkeit eingeführt?
- Entspricht das Design weiterhin `docs/DESIGN_SYSTEM.md`?
- Sind alle normalen UI-Texte deutsch und nur echte Fachbegriffe Englisch?


## GitHub-Actions-Ressourcen

GitHub Actions sparsam verwenden.

- Feature-PRs während aktiver Implementierung als **Draft** führen. Erst nach abgeschlossenem fachlichem und technischem Review auf „Ready for review“ setzen.
- Keine temporären Push-Workflows für Formatierung, generierte Dateien oder einmalige Hilfsaufgaben anlegen.
- Mehrere kleine Zwischencommits dürfen nicht absichtlich jeweils eine vollständige Browser-CI auslösen.
- Vor „Ready for review“ möglichst lokal bzw. mit den verfügbaren Entwicklungswerkzeugen formatieren und prüfen.
- Die vollständigen Quality Gates einschließlich Playwright sind ein PR-Gate. Nach dem Merge auf `main` nur Production Build und Pages-Integrität erneut prüfen.
- Superseded CI-Runs müssen über Workflow-Concurrency automatisch abgebrochen werden.
- Dokumentations-only Änderungen sollen keine vollständige CI starten.
- Einen fehlgeschlagenen Workflow nicht pauschal vollständig erneut starten, wenn gezielt nur der fehlerhafte Teil geprüft werden kann.
