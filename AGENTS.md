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

MEDDPICC Workbench ist eine local-first Browser-Anwendung für die strukturierte Qualifizierung komplexer B2B-Opportunities nach MEDDPICC und für deterministische Deal-Planning-Werkzeuge.

Das Produkt soll repetitive Sales-Arbeit reduzieren, ohne die fachliche Beurteilung durch den Seller zu ersetzen.

Vor der Umsetzung eines Features sind zu lesen:

1. `README.md`
2. `docs/PROJECT_CHARTER.md`
3. `docs/ARCHITECTURE.md`
4. `docs/PROJECT_FILE_SPEC.md`
5. bei UI/UX-Arbeiten zusätzlich `docs/DESIGN_SYSTEM.md`

## Nicht verhandelbare Architekturregeln

- Die portable `.meddpicc`-Projektdatei ist die kanonische Source of Truth der Opportunity.
- Kein verpflichtendes Backend einführen.
- Keine AI-/LLM-Abhängigkeit zur Runtime einführen.
- Opportunity- oder Projektdaten standardmäßig nicht hochladen oder synchronisieren.
- Die Anwendung nicht zu CRM, E-Mail-Client, Kalender oder Pipeline-Management-Suite ausweiten.
- Deterministische Berechnungen und Qualifizierungsregeln gehören in Domain Services und nicht versteckt in UI-Komponenten.
- Annahmen, unbekannte Informationen, Kundenaussagen, Interpretationen und bestätigte Evidenz müssen unterscheidbar bleiben.
- „Unbekannt“ ist ein gültiger Zustand.
- Jede Schema-Änderung muss Kompatibilität und Migration berücksichtigen.

## UI/UX-Anweisung

Bei jeder Aufgabe, die Screens, Navigation, Formulare, Tabellen, Charts, Statusanzeigen, Responsive-Verhalten oder Interaktionsmuster erstellt oder verändert:

1. `docs/DESIGN_SYSTEM.md` lesen und befolgen.
2. Den lokalen Skill `.agents/skills/meddpicc-ui-ux/SKILL.md` als UI/UX-Checkliste verwenden.
3. `nextlevelbuilder/ui-ux-pro-max-skill` nur als **Entwicklungsreferenz**, niemals als Runtime-Abhängigkeit behandeln.
4. Bei Nutzung der Upstream-Referenz den in `docs/UI_UX_REFERENCE.md` dokumentierten Stand bevorzugen.
5. Keine Upstream-Datensätze oder größeren Textmengen kopieren, außer dies wurde bewusst geprüft und die Lizenzhinweise werden erhalten.

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

- Ist die wichtigste Deal-Information ohne Suchen sichtbar?
- Lassen sich Evidenz und Annahme anhand Text/Icon unterscheiden und nicht nur anhand Farbe?
- Kann die Aufgabe vollständig per Tastatur erledigt werden?
- Funktioniert das UI auch mit längeren deutschen und englischen Fachbegriffen?
- Funktioniert es bei Browser-Zoom und Textskalierung ohne Clipping?
- Ist jeder Chart wirklich hilfreicher als Tabelle oder Direktwert?
- Wurde eine unnötige Runtime-Netzwerkabhängigkeit eingeführt?
- Entspricht das Design weiterhin `docs/DESIGN_SYSTEM.md`?
- Sind alle normalen UI-Texte deutsch und nur echte Fachbegriffe Englisch?
