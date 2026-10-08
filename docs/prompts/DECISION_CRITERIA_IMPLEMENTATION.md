# Codex-Auftrag: Decision Criteria – Knowledge & Checklist (MEDDPICC Toolbox)

## Rolle und Ziel

Handle als interdisziplinäres Team aus Enterprise-Sales-Methodikexperte (MEDDPICC), Vue-3/TypeScript-Engineer, UX-/Accessibility-Designer und QA-/Red-Team-Reviewer. **Implementiere** den nächsten durchgängigen T2-Slice **Decision Criteria** in `thomasasen/meddpicc-workbench`: eine praxisorientierte **Wissensseite** und eine **Themen-Checklist**, vollständig integriert, getestet, dokumentiert und als **Draft-PR zur Sichtfreigabe** bereitgestellt. Keine bloße Konzeptskizze; vorhandene Repository-Konventionen wiederverwenden.

**Geschäftsnutzen:** Account Manager sollen erkennen, welche Anforderungen eine Kaufentscheidung *tatsächlich* beeinflussen, wie belastbar diese sind, wer sie setzt und wie Kriterien sachlich im Sinne des Kundennutzens entwickelt und validiert werden können.

## 0. Repository- und PR-Sicherung (vor jeder Codeänderung)

1. Lies `AGENTS.md`, `docs/DESIGN_SYSTEM.md`, `docs/ICON_SYSTEM.md`, `docs/ROADMAP.md`, `docs/PROGRESS.md` und **`docs/DECISION_CRITERIA_SOURCE_BRIEF.md`**.
2. Prüfe **PR #46** (`feat/discovery-call-spiced`), insbesondere Merge-Status und letzte CI. **Niemals #46 ungefragt mergen.**
3. Falls #46 bereits gemergt ist: Feature-Branch `feat/decision-criteria-knowledge-checklist` auf aktuellem `main` erstellen; PR-Basis `main`.
4. Falls #46 noch offen ist: entweder einen **sauberen gestapelten Feature-Branch** auf #46 aufsetzen und den neuen Draft-PR **gegen `feat/discovery-call-spiced`** richten, oder, falls gestapelte PRs technisch nicht zuverlässig möglich sind, **keine unsaubere PR-Basis erzwingen**. In diesem Fall Code/Dokumentation soweit möglich vorbereiten, Abhängigkeit transparent als Blocker markieren und die Freigabe von #46 abwarten. Bestehenden #46 nicht verändern.
5. Prüfe den aktuellen Repo-Zustand statt Branch-, Datei- und Testnamen blind zu übernehmen. Keine fremden Änderungen überschreiben; keine erzwungenen Pushes.

## 1. Fachliche Source of Truth

**Primär:** zwei vom Auftraggeber bereitgestellte Werke:
- Andy Whyte, *MEDDICC: The Ultimate Guide to Staying One Step Ahead in the Complex Sale*, Kapitel **Decision Criteria**.
- Darius Lahoutifard, *Always Be Qualifying – MEDDIC & MEDDPICC Sales*, Kapitel **Five: Decision Criteria**, ergänzend Kapitel **Ten**.

**Lies zuerst** `docs/DECISION_CRITERIA_SOURCE_BRIEF.md`: dessen Kapitelbezüge und Paraphrasen wurden vorab am EPUB geprüft. Wenn die EPUBs in deiner Umgebung nicht vorhanden sind, **nicht behaupten, sie selbst gelesen zu haben**; nutze das Briefing und kennzeichne diese Provenienz im internen QA-Dokument. Wenn sie vorliegen, prüfe relevante Passagen nochmals; präzise Zitate nur mit überprüfbarer Fundstelle. Ergänzende Fremdquellen lediglich, wenn sie einen echten fachlichen Mehrwert liefern, und als extern kennzeichnen.

**Unverzichtbare Inhalte:**
- Definition von Decision Criteria; schriftlich/formal vs. informell; Entstehung, Eigentümer, Stakeholder, externe Einflüsse, Gültigkeit und Änderbarkeit.
- **Whyte:** Technical, Economic, Relationship mit praxisnahen Beispielen. **Lahoutifard:** Vendor/Partner Criteria, Financial Justification, Capability Validation. Als **zwei Perspektiven**, nicht als behauptete 1:1-Zuordnung.
- Zusammenhang von **Pain → Use Case → benötigter Capability → validierter Metric/Business Impact → kundenseitig bestätigtem Entscheidungskriterium**.
- Echte Differenzierung: kundenseitig relevant und nachweislich anders als Alternativen. Wettbewerb, Status quo, Eigenentwicklung berücksichtigen.
- **Value Triangle** aus Lahoutifards Kapitel erklären: Value, Danger, Parity sowie Market Trends, Useless, Unique Differentiators und Custom Needs. **Value** und **Danger** korrekt einordnen; Unique Differentiator ohne Kundenbedarf ist *noch kein* Value. Das gehört als Erklärung zum Thema; **kein großes Visualisierungstool** im T2-Slice.
- Criteria vs. Decision Process vs. Paper Process unterscheiden. Bei Demo, RFP, POC und Pilot die *Success Criteria* und die **Konsequenz erfolgreicher Validierung** klären.
- Unterschied zwischen echten Muss-Kriterien, Präferenzen, optionalen Wünschen und bloß verkäuferseitigen Vermutungen; keine erfundene Gewichtung. Sachliche, transparente Einflussnahme statt Manipulation oder unbelegten Wettbewerbsaussagen. Qualify-out als legitime Option bei wesentlichem Misfit.

## 2. Benutzererlebnis / Knowledge

Baue eine eigenständige **`/knowledge/decision-criteria`**-Ansicht in der bestehenden optischen und strukturellen Qualität der Themen Metrics und Economic Buyer. Keine neue UI-Library nötig.

Die Seite soll in natürlicher Reihenfolge beantworten:
1. Was sind Decision Criteria und wozu brauche ich sie?
2. Wie erkenne ich, ob ein Kriterium wirklich existiert und entscheidungsrelevant ist?
3. Welche Kriterienarten muss ich unterscheiden?
4. Wie frage ich nach Herkunft, Einfluss, Gewichtung, Stakeholdern, Prioritäten und Validierung?
5. Wie wirken sich die Kriterien auf Differenzierung, Wettbewerb, Risiken und POC-Erfolg aus?
6. Was sind typische Fehlinterpretationen und sinnvolle nächste Schritte?

Enthalten sein sollen anwendbare, **selbst formulierte deutsche Praxisfragen** und zwei bis drei glaubwürdige B2B-Software-/CRM-Beispiele (z. B. Integrationsfähigkeit, Datenschutz-/Hostinganforderung, Time-to-Value, Anbieter-Stabilität), bei denen ausdrücklich klar ist, was eine Kundenbehauptung, Hypothese oder Bestätigung wäre. Es dürfen keine Compliance-Rechtsbehauptungen ohne belastbare Prüfung abgeleitet werden.

**UI-Regel (verbindlich):** In Überschriften, Erklärungen, Beispielkarten und Checklistenpunkten **nicht** erzählen, aus welchen Büchern/Autoren das Wissen stammt. Fachlichkeit und praktischer Nutzen stehen im Vordergrund. **Alle Quellen, präzise Kapitelbezüge und Autorenunterschiede ausschließlich im allerletzten Abschnitt „Quellen und fachliche Einordnung anzeigen“ innerhalb eines standardmäßig geschlossenen nativen `<details>`-Elements.** Dort Quellen nachvollziehbar halten. Keine verstreuten sichtbaren „Quelle: …“-Labels.

## 3. Themen-Checklist

Route **`/checklists/decision-criteria`**, aus Homepage und Knowledge erreichbar, mit klarer Möglichkeit zurück zu navigieren. Wiederverwende `ChecklistView.vue`, `MeddpiccConcept`, `ChecklistDefinition` und aktuelle Typ-/Routing-Konventionen, soweit passend.

Erstelle **8–10** handhabbare Prüfpunkte, u. a.:
- Kriterien vorhanden? Formal oder informell, wer bestätigt sie?
- Fachlicher Geschäftsanlass/Pain hinter jedem wesentlichen Kriterium?
- Technical/Economic/Relationship vollständig mit den passenden Stakeholdern betrachtet?
- Muss-Kriterium versus Wunsch, Gewichtung und Priorität wirklich verifiziert?
- Wer entwickelt/ändert/validiert die Kriterien? Externe Einflüsse?
- Kriterien mit Metrics/Business Outcomes verknüpft?
- Realistische Positionierung gegen Alternativen/Status quo – inkl. Risiken/Danger Zone?
- Bei RFP/POC: klarer Erfolgstest und daraus folgender Entscheidungsschritt?
- Offene Widersprüche, Lücken oder Qualify-out-Risiken?
- Konkrete, mit dem Kunden vereinbarte nächste Validierung?

Pro Punkt alle bisherigen Erklärungsebenen bereitstellen: **Prüffrage**, Bedeutung, Relevanz, beobachtbare Hinweise, Fehlinterpretation, mögliche Fragen/Handlungen, optionale Knowledge-Verknüpfung. Native Checkboxen bleiben **rein temporär**. Keine gespeicherten Deal-Daten, Scorecards, automatischen Win-Probabilities, Rating-/Gewichtungsalgorithmen oder künstliche „Deal vollständig“-Meldungen.

## 4. Integration und technische Architektur

- Domain-Content typisiert nach bewährtem Schema anlegen, z. B. `src/content/meddpicc/decisionCriteria.ts` plus Unit Tests. Source-Notizen **im Content** belassen, aber in der UI **nur** im finalen Quellenbereich rendern.
- Typunionen in `src/content/meddpicc/types.ts`, Router in `src/router/index.ts`, Homepage Tools/Checklists/Knowledge sowie zugehörige Navigation aktualisieren.
- Technische und fachliche Regeln aus `AGENTS.md` einhalten. Nur minimal notwendige Änderungen, keine Ausweitung zum Decision Matrix / Criteria Workshop. Solche Funktionen bleiben spätere T6-Tools.
- Kein Backend, AI-Runtime, Cloudservice, neues persistentes Dealmodell oder unnötige Dependency.
- Vorhandene Funktionalität von Metrics, Economic Buyer, Discovery und Go-Live nicht regressieren.

## 5. Tests, Red Team, Dokumentation

**Fachtests / Red Team:** Mindestens folgende Gegenproben absichern:
- Kundenwunsch ohne bestätigten Pain wird nicht automatisch „must-have“.
- Verkäufer-Score, vermutete Gewichtung oder eigene Wettbewerbseinschätzung gelten nicht als Kundenbeleg.
- RFP-Kriterium ohne Herkunft/Begründung wird kritisch **hinterfragt**, nicht automatisch verworfen.
- Ein Feature, das nur der Anbieter bietet, aber niemand beim Kunden benötigt, ist kein belegter Value.
- **Value** und **Danger** werden nicht vertauscht; **Parity** wird nicht als Alleinstellungsmerkmal dargestellt.
- „Technisch bestanden“ bedeutet nicht automatisch Budgetfreigabe, Unterschrift oder Auftrag.
- Keine Gleichsetzung von Whyte- und Lahoutifard-Kriterienkategorien.
- Eindeutige Checklist-IDs; sinnvolle Content-Verknüpfungen und explizite Evidenzlücken.

**Technische Gates:** `npm run format:check`, `npm run lint`, `npm run test`, `npm run build`, `npm run test:e2e`, `npm run pages:check`. Bei Bedarf Vorabformatierung mit **Prettier lokal**, nicht durch temporäre CI-Workflow-Manipulation. Playwright prüft Routing, Inhalte, Default-closed Quellen, Auf-/Zuklappen, Checkbox-Reset, Lighthouse-unabhängige Accessibility-Basics und Viewports **375 / 768 / 1024 / 1440 px**. Desktop-/Mobile-Fullpage-Screenshots erzeugen und selbst visuell auf Überlauf, Kontrast, Hierarchie, Interaktion und versteckte Quellen prüfen.

**Dokumentation:** `docs/DECISION_CRITERIA_SOURCE_QA.md` (Behauptung → überprüfte Fundstelle oder Source-Brief → UI-Ableitung → Risiko/Abgrenzung), `docs/ROADMAP.md`, `docs/PROGRESS.md`, optional README. Keine „grün“-/„fertig“-Behauptung ohne tatsächlich ausgeführte Nachweise. Quellen-Darstellungsregel aus AGENTS.md beibehalten.

## 6. PR, Abnahme und Abschlussbericht

Lege einen **Draft-PR** mit klarer Abhängigkeit zu #46 an, wenn nötig als stacked PR. Kontrolliere die tatsächliche PR-Basis und liste ausdrücklich, welche Commits/Files zur neuen Funktion gehören. Bei UI-Änderungen **nicht mergen, bevor die Oberfläche ausdrücklich vom Nutzer freigegeben wurde**.

Liefere zum Schluss:
1. Draft-PR-Link, Basis-/Head-Branch und Status von #46.
2. Fertige Features, geänderte Dateien, kurze fachliche Entscheidungen und erkennbare Grenzen.
3. Ergebnisse jedes Gates inkl. CI-Link und Begründung etwaiger Skip/Fehler.
4. **Direkt anklickbare Desktop-/Mobile-Screenshots** von Knowledge und Checklist.
5. Offene Punkte und die eine erforderliche Nutzerentscheidung: **Sichtfreigabe vor Merge**.

Arbeite möglichst eigenständig bis zum getesteten Draft-PR durch; keine voreiligen Merges, keine erfundenen Ergebnisse.
