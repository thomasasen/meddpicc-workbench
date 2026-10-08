# Paper Process – Primärquellenabgleich und simuliertes Autoren-Red-Team

Stand: 2026-10-08. Die Bewertungen sind **simulierte fachliche Perspektiven**, keine Stellungnahmen oder Freigaben von Andy Whyte beziehungsweise Darius Lahoutifard. Die Originaltexte der bereitgestellten EPUBs wurden geprüft. Alle Buchstellen werden als Kapitel/Abschnitt, nie mit erfundenen EPUB-Seitenzahlen bezeichnet.

## 1. Quellenmatrix: Aussage → Umsetzung → Autorenunterschied

| Autor | Tatsächlicher Buchabschnitt | Belegte Kernaussage | Umsetzung | Autorenunterschied |
| --- | --- | --- | --- | --- |
| Whyte | `PAPER PROCESS` (Kapiteleinstieg) | Schritte vom Vendor-of-Choice-Status bis zur Vertragsunterzeichnung sind kundenspezifisch; Auswahl genügt nicht. | Definition, Abgrenzung und Red Flag „Zuschlag = Auftrag“. | Whyte führt Paper Process als separates P. |
| Whyte | `You Need Your Champion` | Der Champion unterstützt die Erfassung der Schritte, seine Entwarnung ersetzt aber keine laufende Prüfung. | Checklist „Stakeholder“, Praxisaktion zur direkten Validierung. | Lahoutifard warnt ebenfalls vor unvollständigem Championwissen. |
| Whyte | `The 3 Key Elements of any Paper Process`, `1. The Process`, `2. The People`, `3. The Timing` | Prozess, konkrete Beteiligte, Abhängigkeiten, Zeichner/Vertretung und Timing sind getrennt zu klären. | Drei scanbare Dimensionen, Checklist zu Zuständigkeit, Zeichnung, Fristen. | Lahoutifard konzentriert sich stärker auf die administrative Kette. |
| Whyte | `Paper Process and Go-Live Plan` | Schritte, Abhängigkeiten und Deadlines gemeinsam mit dem Champion abstimmen und aktualisieren. | Go-Live-Rückwärtsplanung als Tool-Link, Meilenstein-/Evidenz-Prüfung. | Lahoutifard betont schriftlichen beidseitigen Plan im Gesamt-Decision-Process. |
| Whyte | `Paper Process and your Sales Process`: `Early-Stages`, `Mid-Stages`, `Late-Stages` | Papierarbeiten können früh relevant sein; Prozesskenntnis und Kundenevidenz nehmen gegen Ende zu. | Frühzeitige Prüfungen, nicht nur Closing-Check. | Lahoutifard konkretisiert frühzeitige Legal-Einbindung als Parallelisierung. |
| Whyte | `Summary of Paper Process` | Bei unabhängigen Stationen sind frühe oder parallele Security-Prüfungen möglich. | Bedingte Parallelisierung statt fixem Ablauf. | Übereinstimmung mit Lahoutifards Beispiel zur frühen Vertragsprüfung. |
| Lahoutifard | `Chapter Six – Decision & Paper Process` (vor `Paper Process`) | Decision Process umfasst technische/funktionale Validation sowie finanzielles, administratives, rechtliches und kommerzielles Approval. | Drei Abgrenzungskarten ohne Gleichsetzung von Approval und Signatur. | Kein eigenständiges P zwingend: breiterer Decision Process. |
| Lahoutifard | `Chapter Six – Decision & Paper Process` → `Paper Process` | Paper Process ist administrative Untermenge, führt über Procurement/Legal zum Auftrag; Projektleiter/Champion kennen ihn möglicherweise nicht. | Nachfrageschleife „Was passiert danach?“ und direkte Validierung bei zuständigen Stellen. | Whyte fokussiert stärker Process/People/Timing bis Signatur. |
| Lahoutifard | `Chapter Six – Decision & Paper Process` → `Paper Process` | Die Mechanik nicht einfach umformen; unabhängige Schritte können vorgezogen oder parallel ausgeführt werden, etwa die Prüfung von Vertragsbedingungen. | Abhängigkeits-/Zulässigkeitsfrage vor parallelem Arbeiten. | Whyte verlangt ebenfalls saubere Abhängigkeitsplanung. |
| Lahoutifard | `Chapter Six – Decision & Paper Process` → `Compelling Event` | Echte Kundendringlichkeit ist nicht das Quartalsende des Sellers; der EB begründet „Why Now?“. | Red Flag zum Quartalsende, Rückwärtsplanung vom benötigten Go-Live. | Whyte differenziert zwischen vom Kunden getragenen und sellerseitigen Timings. |

### Begrenzung der Quellenlage

- **MSA/SOW, AVV, Lieferantenanlage, konkrete PO-Nummern und der genaue Kunden-Security-Workflow** sind hier **nicht durch die Primärquellen als universell verpflichtende Schritte belegt**. Sie werden ausdrücklich als situative B2B-SaaS-Praxisbeispiele beschrieben. Eine konkrete Rechtswirkung oder Verpflichtung wird nicht behauptet.
- Die **Implementierungsdauer** wird im Zusammenhang mit der Go-Live-Rückwärtsplanung als praxisbezogene planerische Ableitung berücksichtigt; nicht als von jedem Autor für jeden Paper Process wörtlich verlangter Schritt.
- Ein genehmigter Kaufweg ersetzt **weder** das kundenverantwortliche Approval **noch** eine valide Unterschrift. Was im Einzelfall rechtlich ausreicht, ist nicht Gegenstand dieser Wissenshilfe.
- Sichtbare UI-Fachtexte enthalten keine isolierten Autoren-/Quellenlabels; die Differenzen liegen nur im standardmäßig geschlossenen Quellenbereich am Seitenende.

## 2. Simuliertes Red-Team vor Implementierung

| Perspektive / Einwand | Fundstelle | Bewertung | Direkt umgesetzte Korrektur | Zugeordneter Test |
| --- | --- | --- | --- | --- |
| **Whyte:** Bevorzugter Anbieter ≠ unterschriebener Auftrag. | `PAPER PROCESS` | Berechtigt | Explizite Begriffsgrenzen; Red Flag und Kundennachweis. | `paperProcess.test.ts`: Trennung, keine Kaufzusage. |
| **Whyte:** „Wir kennen den Champion“ reicht nicht; Signaturperson/Vertretung fehlen. | `You Need Your Champion`; `The People` | Berechtigt | Personen- und Signaturprüfung mit Abwesenheitsvertretung. | Unit: Zuständigkeit/Zeichnung; E2E: Detailansicht. |
| **Whyte:** Deadline ohne Bearbeitungsdauer und Go-Live-Abhängigkeit bleibt spekulativ. | `The Timing`; `Paper Process and Go-Live Plan` | Berechtigt | Zeitfragen und Rückwärtsplanung inkl. Implementierung. | Unit: Fristen/Implementierung; E2E: Tool-Link. |
| **Whyte:** NDA, Legal und Security dürfen nicht erst am Ende sichtbar werden. | `Early-Stages`; `Summary of Paper Process` | Berechtigt | frühe Prüfschritte und bedingte Parallelisierung. | Unit: Nichtlinearität; E2E: Stationen. |
| **Lahoutifard:** Der Project Lead kennt Procurement/Legal nicht automatisch. | `Chapter Six` → `Paper Process` | Berechtigt | kundenseitige Prozesskette und gezielte „Was danach?“-Fragen. | Unit: Kundenevidenz; E2E: Fragen. |
| **Lahoutifard:** Validation, Approval und formaler Kaufweg werden vermischt. | `Chapter Six` → Decision & Paper Process | Berechtigt | getrennte Abgrenzungskarten; Autorenunterschied im Quellenbereich. | Unit: drei Grenzen/Autoren. |
| **Beide:** Alle Stationen als zwingende lineare Pflichtfolge abzubilden ist unbelegt. | `Summary of Paper Process`; `Chapter Six` → `Paper Process` | Berechtigt | keine Timeline-Grafik; situative Stationen mit Konditionalsprache. | Unit: konditionale Beispiele; E2E: Ansicht. |
| **Beide:** „Angebot versendet“ ist Seller-Handlung und nicht Buyer-Fortschritt. | Whyte `Late-Stages`; Lahoutifard `Chapter Six` (Buyer/Seller-Aktivitäten) | Berechtigt | Kundennachweis und Fortschritt als expliziter Checklist-Punkt. | Unit: Seller vs. Buyer; E2E: Checklist. |
| **Beide:** Freigaben nicht durch die Oberfläche abkürzen lassen. | Whyte `The Process`; Lahoutifard `Paper Process` | Berechtigt | nur durch Kundenseite bestätigte Parallelisierung. | Unit: Abhängigkeiten. |
| **UX:** Too much disclosure im Einstieg / Quellen im Haupttext. | `AGENTS.md`; `docs/DESIGN_SYSTEM.md` | Berechtigt | Scanbare Karten, `details` für Warnsignale und Checklist, Quellen am Ende geschlossen. | E2E: Disclosure/Quellen/Viewport. |

## 3. Nachprüfung der entwickelten Inhalte

- **Whyte-Sicht:** Die UI fragt getrennt nach Prozess, Personen und Timing. Verfügbarkeit, Zeichnung, Champion und Go-Live-Planung werden eigenständig behandelt. Kein Schema mit starrer Reihenfolge.
- **Lahoutifard-Sicht:** Die UI bildet administrative Abläufe als mit Approval verbundenen Teil des gesamten Entscheidungsvorgangs ab und trainiert Nachfragen bis zur Bestellung. Parallelisierung ist nur nach kundenseitiger Freigabe vorgesehen.
- **Beide Perspektiven:** Kein Ergebnis einer Seller-Aktion wird als automatisch vorliegender Kundennachweis behandelt.
- **Fachliche Restgrenze:** Kundenindividuelle Verfahrens- und Rechtsprüfung kann ein Knowledge-Artikel nicht leisten; sie muss mit den verantwortlichen Stellen erfolgen.

## 4. Technische QS

Testdateien: `src/content/meddpicc/paperProcess.test.ts` und `tests/e2e/paper-process.spec.ts`. Die Browser-Suite erstellt vier echte Screenshots (Knowledge/Checklist × Desktop/Mobile) sowie Overflow-Messungen bei 375/768/1024/1440 px. Die tatsächlichen Lauf- und CI-Ergebnisse werden in den GitHub-Actions-Logs und im PR-Abschlussstatus ausgewiesen; ein grüner Zustand wird nicht vor der Ausführung behauptet.

**Merge-Gate:** Ohne ausdrückliche visuelle Nutzerfreigabe bleibt der Pull Request Draft. Kein Merge.

## 5. Tatsächlich ausgeführte Prüfungen (CI #496)

[GitHub Actions, Run #496](https://github.com/thomasasen/meddpicc-workbench/actions/runs/37809375932) – **erfolgreich beendet**, Original-Workflow unverändert.

| Qualitätsgate | Ergebnis |
| --- | --- |
| `npm run format:check` | bestanden |
| `npm run lint` | bestanden, 0 Fehler; 125 Warnungen in den bereits vorhandenen, hier nicht geänderten `DiscoveryCallKnowledgeView.vue` und `RisksActionsView.vue` |
| `npm test` | 158 Tests in 25 Dateien bestanden, inklusive Paper Process |
| `npm run build` | bestanden, inklusive Vue/TypeScript |
| `npm run test:e2e` | 49 Playwright-Tests bestanden, Desktop- und Mobile-Projekte |
| `npm run pages:check` | bestanden, Pages-Root entspricht gebautem Stand |

Die vier unverfälschten Browseraufnahmen befinden sich im Actions-Artefakt
[ui-qs-screenshots – Run #496](https://github.com/thomasasen/meddpicc-workbench/actions/runs/37809375932/artifacts/11565185641).
Es enthält `paper-process-knowledge-desktop-chromium.png`, `paper-process-knowledge-mobile-chromium.png`,
`paper-process-checklist-desktop-chromium.png` und `paper-process-checklist-mobile-chromium.png`.
Die Dateien wurden zusätzlich nach dem Download visuell auf Desktop- und Mobile-Layout geprüft.
Die Warnungen in zwei nicht geänderten Legacy-Views wurden bewusst nicht in diesem Feature behoben.

**Kein Merge:** PR #49 bleibt bis zu einer expliziten Nutzerfreigabe im Draft-Status.

## 6. Zweiter, unabhängiger simulierter Autoren-Red-Team-Durchgang (08.10.2026)

Dies ist **eine erneute kritische Simulation**, kein Review der beiden Autoren. Ausgangspunkt ist der tatsächlich auf PR #49 vorhandene Content vor diesem zweiten Durchgang. Die EPUB-Texte wurden erneut mit den sichtbaren Wissens- und Checklist-Inhalten verglichen. Wo das erste QA-Dokument eine Korrektur nur behauptet, die UI sie aber nicht transportierte, wird das ausdrücklich offengelegt.

| Perspektive / Befund aus zweitem Review | Tatsächlich überprüfte Buchstelle | Bewertung der vorhandenen UI | Direkt umgesetzte Änderung | Regressionstest |
| --- | --- | --- | --- | --- |
| **Whyte: frühe NDA und restriktive Klauseln fehlen.** | `PAPER PROCESS → Paper Process and your Sales Process → Early-Stages` | **Echte Lücke:** Die erste QA-Matrix behauptete die NDA-Frühprüfung, tatsächlich stand die NDA nicht im sichtbaren Content. | NDA-Blockade vor Discovery/POC, frühe Legal-Prüfung und Unterscheidung NDA ≠ Kaufzusage im Vertragsbeispiel, Checklist-Punkt und in Discovery. | Vitest: `nimmt die vorgezogene NDA-Prüfung...`; Playwright: sichtbare NDA-Karte und geöffneter Vertrags-Checklist-Punkt. |
| **Whyte: vor Pricing muss Vertrags-/Procurement-Verhandlungsspielraum bekannt sein.** | `PAPER PROCESS → Paper Process and your Sales Process → Mid-Stages` | **Lücke:** Bisher ging es um frühes Legal-Checking ohne Bezug zu kommerzieller Verhandlungsposition. | Vor kommerziellen Zusagen relevante Vertrags- und Einkaufsbedingungen identifizieren; ausdrückliche Kundennachfrage. | Vitest: `vor verbindlichen kommerziellen Zusagen`. |
| **Whyte: Stakeholder sind nur benannt, nicht notwendigerweise informiert.** | `PAPER PROCESS → You Need Your Champion` | **Lücke:** Zuständigkeit und Verfügbarkeit allein genügen nicht. | Champion bestätigt Kenntnisstand, Briefing, Verfügbarkeit und erforderliche Vertretung aller relevanten Stellen. | Vitest: `gebrieft und verfügbare Personen`. |
| **Whyte vs. Lahoutifard: sellerseitige Abschlussfrist ≠ wirtschaftliches Compelling Event.** | Whyte `PAPER PROCESS → The 3 Key Elements of any Paper Process → 3. The Timing`; Lahoutifard `Chapter Six → Compelling Event` | **Nuance fehlte:** Die bisherige Warnung konnte so gelesen werden, als dürften Seller niemals eigene Fristen verwenden. | Interne Seller-Deadline als Organisationsmittel zugelassen; kundenseitiger wirtschaftlicher „Why now?“-Grund muss gesondert bestätigt sein. | Vitest: `trennt sellerseitige Deadline`; Playwright: Timing-Text. |
| **Whyte: veränderte Spezifikation/Konditionen können neue Approval-Grenzen auslösen.** | `PAPER PROCESS` (Kapiteleinstieg, `boundary of approval requirements`) | **Lücke:** Der alte Hinweis „Plan nach geänderten Preisen aktualisieren“ nannte keine Freigabegrenzen. | Genehmigungsschwellen explizit im Plan und im Budget-/PO-Checklist-Punkt prüfen. | Vitest: `neue Genehmigungsgrenzen`. |
| **Lahoutifard: Käufer- und Seller-Pflichten schriftlich getrennt planen.** | `Chapter Six – Decision & Paper Process` (vor `Paper Process`, grafische Timeline und Buyer-/Seller-Aktivitäten) | **Unvollständig:** Seller-Aktivität wurde zwar nicht mit Buyerevidenz verwechselt, aber beidseitiges Planen war nicht explizit. | Schriftliche Buyer-/Seller-Aufgaben als konkrete Praxisaktion und Kundensignal aufgenommen. **Als Übertragung seiner Gesamt-Decision-Process-Empfehlung** gekennzeichnet, nicht als wörtliche Sonderpflicht jedes Paper Process. | Vitest: `beidseitige Schriftlichkeit`. |
| **Lahoutifard: administrative Schritte können nicht beliebig verändert werden.** | `Chapter Six – Decision & Paper Process → Paper Process` | **Präzisierung:** Die vorhandene Parallelisierungsregel war fachlich richtig, die Unveränderlichkeit des kundenseitigen Genehmigungsweges aber zu implizit. | Prozesstreue im Abhängigkeits-Checklist-Punkt betont: Parallelisierung nur bei zuständiger Freigabe, kein Umgehen. | Vitest: `regelkonforme Parallelisierung`. |
| **Whyte: Unterschrift und erfasster Auftrag sind getrennte tatsächliche Abschlussereignisse.** | `PAPER PROCESS → Paper Process and your Sales Process → Late-Stages` | **Lücke:** Abschluss nur als angenommenes Papierereignis. | Kundenseitige Signatur/Bestellung als Beleg; interne Buchung im vorhandenen Seller-Prozess ausdrücklich ohne neues CRM- oder Persistenz-Feature erwähnt. | Vitest: `belegbaren Kaufabschluss`. |
| **Quellentreue:** Scheinbar spezifische Zwischenüberschriften. | In beiden EPUBs tatsächlich vorhandene Abschnittstitel. | **Ungenauigkeit:** `Procurement` oder `Legal` standen in Quellenangaben in Klammern und konnten für Kapitelüberschriften gehalten werden. | Als Fließtext-Kontext gekennzeichnet; bei Whyte `1. The Process`, `2. The People`, `3. The Timing` ausdrücklich präzisiert. | Review der `sourceNote`-Strings. |

### Redaktionelle Entscheidung und Restgrenzen

- Der zweite Durchgang ergänzt **keinen universellen linearen Ablauf**, keinen Paper Process Explorer, keine Score- oder CRM-Datenpflege. Es bleiben zehn Checklist-Punkte und die bestehenden Komponenten. Dadurch entstehen keine zusätzlichen Pflichtaktionen in der UI.
- Eine NDA ist **kein Beweis eines Kaufentschlusses**. Der Abschluss einer Papierhandlung erhöht gegebenenfalls die Verbindlichkeit der Zusammenarbeit, ersetzt aber weder Business Approval noch Auftrag.
- **Seller-Deadlines sind zulässig**, müssen aber als interne Steuerungsfristen benannt werden. Sie beweisen keinen Economic-Buyer-Compelling-Event.
- Die Empfehlung, Buyer- und Seller-Aufgaben schriftlich gegenüberzustellen, stammt aus Lahoutifards größerem Decision-Process-Rahmen; ihre Anwendung im Paper Process ist eine **begründete Praxisübertragung**.
- Die unterschiedlichen Schwerpunkte bleiben ausdrücklich erhalten: Whyte = eigener Paper-Process-Qualifikationsbereich mit Process/People/Timing; Lahoutifard = formale administrative Untermenge seines Decision Process.

### Abschlussprüfung nach dem zweiten Red-Team

**[GitHub Actions, Run #513](https://github.com/thomasasen/meddpicc-workbench/actions/runs/37813370045): erfolgreich.**

- `npm run format:check`: bestanden.
- `npm run lint`: bestanden, null Fehler. Die 125 bestehenden Warnungen stammen aus zwei unveränderten Legacy-Views.
- `npm test`: **162 bestandene Unit-Tests in 25 Dateien**, inklusive der vier zusätzlichen Paper-Process-Regressionstests.
- `npm run build`: bestanden, einschließlich TypeScript.
- `npm run test:e2e`: **49 bestandene Browser-Tests**, Desktop/Mobile inklusive 375/768/1024/1440-Pixel-Overflow-Prüfung.
- `npm run pages:check`: bestanden; geprüfter Build wurde mit Pages-Root synchronisiert.
- **[Vier echte aktuelle Browser-Screenshots, Artefakt aus Run #513](https://github.com/thomasasen/meddpicc-workbench/actions/runs/37813370045/artifacts/11565912978)**; Knowledge und Checklist je Desktop/Mobile. Visuell kontrolliert: lesbares Responsive-Layout, keine ungewollten gestreckten Elemente oder Überlappungen im Standardzustand.
- Die unveränderte CI-Workflow-Datei entspricht wieder `main`; keine temporären Änderungen am Workflow verbleiben im PR.

**Kein Merge ohne ausdrückliche visuelle Freigabe.** PR #49 bleibt Draft.
