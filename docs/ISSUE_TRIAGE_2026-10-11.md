# Issue- und Roadmap-Konsolidierung – 11.10.2026

> **Verbindlicher Produktstand:** Die MEDDPICC Toolbox besteht aus **Tools, Checklists und Knowledge**. Es gibt **keinen** globalen Pflicht-Opportunity-Datensatz, kein dauerhaftes Deal-Scoring, kein Forecast-/CRM-System und keinen CRM-Writeback. Maßgeblich sind [Projektauftrag](PROJECT_CHARTER.md), [Architektur](ARCHITECTURE.md) und [Roadmap](ROADMAP.md). Die ursprünglichen GitHub-Roadmap-Issues #4–#8 stammen noch aus einer früheren, projektzentrierten Produktannahme.

## Entscheidung über bisherige Roadmap-Issues

| Issue | GitHub-Status nach Abgleich | Begründung / Ersatz |
| --- | --- | --- |
| [#2 – Technische Basis](https://github.com/thomasasen/meddpicc-workbench/issues/2) | Geschlossen – abgeschlossen | Foundation, CI, GitHub Pages und App Shell implementiert. |
| [#3 – Projektdatei-Lifecycle](https://github.com/thomasasen/meddpicc-workbench/issues/3) | Geschlossen – abgeschlossen | Unterstützte Migration 0.1.0 → 0.2.0 und sicherer Legacy-Import im vereinbarten Core-Umfang. |
| [#4 – Evidenz/Risiken/Aktionen/Dashboard](https://github.com/thomasasen/meddpicc-workbench/issues/4) | **Geschlossen: not planned / superseded** | Bestehende Register-/Verknüpfungsfunktionen bleiben als Legacy erhalten. Der damals weitergehende History-/Status-/Dashboard-Ausbau wird bewusst nicht als Toolbox-Pflichtziel umgesetzt; Schutz-/Regressionsthemen werden über #65, #66, #69, #70 verfolgt. **Nicht vollständig umgesetzt.** |
| [#5 – Acht dauerhafte MEDDPICC-Qualifizierungsmodule](https://github.com/thomasasen/meddpicc-workbench/issues/5) | **Geschlossen: not planned / superseded** | Acht fachliche MEDDPICC-Bereiche durch Knowledge und Checklists nutzbar, aber **kein** globaler Qualification-Workflow oder dauerhafter Score. Neue konkrete, eigenständige Tools siehe #71–#76. |
| [#6 – Deterministische MEDDPICC-Tools](https://github.com/thomasasen/meddpicc-workbench/issues/6) | **Offen: fachliche Klammer** | Teilfunktionen geliefert (Quick Payback, Metric Builder, Cost of Delay, Value Bridge, Reverse Timeline); neue Microtool-Aufgaben #71–#76 sind einzeln abnehmbar. |
| [#7 – Projektzentrierte Deal-Review-/CRM-Exporte](https://github.com/thomasasen/meddpicc-workbench/issues/7) | **Geschlossen: not planned / superseded** | Vorhandene kundenfähige PDFs, Copy- und Timeline-Exporte bleiben; projektzentrische Manager-/CRM-Review-Pakete werden **nicht** als erledigt ausgegeben. Optionaler Toolbox-Export #77. |
| [#8 – Privacy/Accessibility/Migration/Offline](https://github.com/thomasasen/meddpicc-workbench/issues/8) | **Offen: Qualitätsklammer mit Vorrang** | Sechs einzeln abnehmbare Qualitäts-Issues #65–#70; PR #64 ist ein vorbereitender UI-/PDF-/Responsive-Beitrag, keine formale a11y-/Security-Abnahme. |

**Wichtig:** GitHub `not_planned` bezeichnet hier die **ersetzte Produktanforderung**. Es ist weder „funktioniert nicht“ noch „vollständig implementiert“. Historische Issue-Beschreibungen bleiben zur Nachvollziehbarkeit erhalten.

## Verbindliche Prioritäten und ausführbare Nachfolger

### P0: Risiko für Datenverlust und Vertraulichkeit zuerst beheben

| Reihenfolge | Issue | Abnahmeschwerpunkt |
| --- | --- | --- |
| 1 | [#65 – Datenverlust-/Recovery-Konzept](https://github.com/thomasasen/meddpicc-workbench/issues/65) | Kein verdeckter Verlust; Recovery bleibt opt-in, unterscheidbar von gespeichertem Projektstand, atomar und löschbar. |
| 2 | [#66 – Privacy-/Security-Audit](https://github.com/thomasasen/meddpicc-workbench/issues/66) | Nachweisbare Null-Exfiltration von Kundendaten, validierte Datenflüsse, Dependency-/Import-/Export-Review. |

### P1: Barrierefreiheit, Offline und Resilienz

| Reihenfolge | Issue | Abnahmeschwerpunkt |
| --- | --- | --- |
| 3 | [#67 – Accessibility-WCAG-Lückenanalyse](https://github.com/thomasasen/meddpicc-workbench/issues/67) | Tatsächlicher Tastatur-/Screenreader-Review, Route/State-Matrix, priorisierte Fixes; keine bloße CI-Scheinzertifizierung. |
| 4 | [#68 – Offline-/PWA-Prüfung](https://github.com/thomasasen/meddpicc-workbench/issues/68) | Nachweisbares Offline-Verhalten; PWA nur nach testgestützter Nutzen-/Security-Entscheidung. |
| 5 | [#69 – Migration-/Import-Regressionsmatrix](https://github.com/thomasasen/meddpicc-workbench/issues/69) | Schema-0.1.0- und 0.2.0-Fixtures, Future-/Malformed-File-Abwehr, Datenintegrität. |
| 6 | [#70 – Performance-/Export-Stresstests](https://github.com/thomasasen/meddpicc-workbench/issues/70) | Große Legacy-Projekte und lange Tool-/Reporttexte ohne instabile UI, Clipping oder geänderte Rechenergebnisse. |

### P2: Neue fachliche Microtools nach P0/P1

| Arbeitsfeld | Issue | Abnahmekern |
| --- | --- | --- |
| Decision Criteria | [#71 – Criteria Workshop / Value Triangle](https://github.com/thomasasen/meddpicc-workbench/issues/71) | Validierbare Entscheidungskriterien statt undurchsichtiger Scorecard. |
| Economic Buyer | [#72 – Meeting Prep / Zugangsstrategie](https://github.com/thomasasen/meddpicc-workbench/issues/72) | Kundennahe Executive-Agenda und konkrete Access-Handlungen. |
| Champion | [#73 – Champion-Tester](https://github.com/thomasasen/meddpicc-workbench/issues/73) | Beobachtbare Verhaltenssignale und nächste Tests, kein dauerhaftes Ranking. |
| Buying Process / Closing | [#74 – Paper Process / Closing Prep](https://github.com/thomasasen/meddpicc-workbench/issues/74) | Echte Fristen-/Owner-/Abhängigkeitsrisiken ohne Deal-Health-Dashboard. |
| Competition | [#75 – Alternatives Map](https://github.com/thomasasen/meddpicc-workbench/issues/75) | Vendor, Eigenbau, andere Initiativen und Status quo/No Decision. |
| Discovery & Pain | [#76 – Discovery/Pain-to-Impact](https://github.com/thomasasen/meddpicc-workbench/issues/76) | Terminvorbereitung und Opt-in-Folgetoolübergabe, kein Call-/CRM-Protokoll. |
| Cross-Service | [#77 – optionales Kunden-Ergebnis-Paket](https://github.com/thomasasen/meddpicc-workbench/issues/77) | Explizit gewählte Ergebnisse, local-first und getrennt von internen Annahmen. |

**Reihenfolge:** P0 vor P1 vor P2. Die Tabelle ist eine Priorisierung, **keine Aussage, dass die neuen Features implementiert sind**. Bei Security-Funden können einzelne P0-Fixes andere Arbeit blockieren.

## Schon auf main vorhandene technische Grundlage

- [PR #64](https://github.com/thomasasen/meddpicc-workbench/pull/64), Merge-Commit `13deb4698a1e1c0e31b239ac7a9251a2aad09136`: UI- und PDF-Redesign, sechs Value-Bridge-Stufen, Kapitelanker, responsive Cost-of-Delay-Grafik, mehrseitiger PDF-Textfluss.
- [QA-Lauf](https://github.com/thomasasen/meddpicc-workbench/actions/runs/38094931479): 334 Unit-Tests, 205 erfolgreiche Browser-Tests, ein Skip; 27 aus echten PDF-Testexporten gerenderte Seiten. Nachfolgende Main-Integrität und GitHub-Pages-Deployment erfolgreich.
- Die bereits funktionierenden fünf Tools bleiben erhalten. Keine Rechenänderung, neue zentrale Datenspeicherung oder backendseitige Pipeline durch diese reine Roadmap-Konsolidierung.
- Die Dokumentation älterer Feature-Branches/Red-Teams bleibt als **historischer Verlauf** erhalten; der **aktuelle** Umsetzungsstand steht hier und in der Roadmap.

## Tracking- und Merge-Regeln für Nachfolgearbeit

1. Jedes Nachfolger-Issue braucht einen klaren Nutzerfall, kontrollierten Inputvertrag, Tests und überprüfbare Acceptance Criteria.
2. Implementation über isolierten Feature-Branch und Pull Request; bestehende Domainformeln, local-first und Sicherheitsregeln bleiben erhalten.
3. Vor Abschluss: Unit/Build/Format/Lint, relevanter Browser-Test auf Desktop und Mobile, Datenschutz-/A11y-Prüfung entsprechend Risiko; bei PDFs **echte** Originalseiten rendern.
4. Issues erst schließen, wenn die jeweilige Umsetzung nachweisbar gemergt wurde **oder** die Entscheidung ausdrücklich und begründet auf `not_planned` geändert wird. Ein geschlossenes überholtes Sammelissue ersetzt keine Quality-Abnahme.
