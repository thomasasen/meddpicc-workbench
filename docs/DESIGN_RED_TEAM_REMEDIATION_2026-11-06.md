# Design-Red-Team: Korrektur- und Prüfprotokoll vom 06.11.2026

**Ausgangsstand:** `main` bei `f4293fc1c7b77fef0076974f1a907354388f3897`. PR #96 ist gemergt; PR #84 bleibt separat offen und wird nicht pauschal übernommen. Die vier Änderungspakete werden als gestapelte Pull Requests ausgeführt, bis eine gesonderte visuelle Freigabe vorliegt.

**Statusmodell:** `OFFEN`, `REPRODUZIERT`, `BEHOBEN`, `VERIFIZIERT`, `NICHT REPRODUZIERBAR`, `BLOCKIERT`. `BEHOBEN` bedeutet Implementierung abgeschlossen, nicht automatisch browser- oder screenreader-verifiziert. Jeder CI-Status wird erst nach abgeschlossenem Run erfasst.

| ID | Prio | Ursprung und statischer Befund | Betroffene Stellen | Korrektur / weiterer Auftrag | Prüfung | Status | Restrisiko |
| --- | --- | --- | --- | --- | --- | --- | --- |
| RT-01 | P1 | Fragment-Links in Vue Hash History | src/App.vue; src/views/HomeView.vue; alle 30 Routen | Zentrale Click-Capture-Behandlung für Skip-Links, präzise Fokus- und Scrollsteuerung ohne URL-/History-Mutation | tests/e2e/skip-link-routing.spec.ts | BEHOBEN | CI-Validierung und reale Screenreaderprüfung stehen aus |
| RT-02 | P1 | Kleinteilige Typografie | CSS-Schichten; Tools, Checklists, Knowledge | Noch nicht bearbeitet | ausstehend | OFFEN | Gerenderte Computed-Styles messen |
| RT-03 | P1 | Recovery verdrängt Aufgabe | ToolRecoveryPanel.vue; fünf Tool-Ansichten | Noch nicht bearbeitet | ausstehend | OFFEN | Opt-in, Aufbewahrung und Datenkompatibilität erhalten |
| RT-04 | P2 | Mobile Header und Einleitung zu hoch | Fünf Tool-Ansichten | Noch nicht bearbeitet | ausstehend | OFFEN | 320/375 px und Zoom prüfen |
| RT-05 | P2 | Legacy-Ansichten mit alter Produktidentität | EvidenceView.vue; RisksActionsView.vue; ReferencesView.vue | Noch nicht bearbeitet | ausstehend | OFFEN | Legacy-Funktionen und Deep Links erhalten |
| RT-06 | P2 | Header und Navigation uneinheitlich | Home, Tools, Checklists, Knowledge, Settings | Noch nicht bearbeitet | ausstehend | OFFEN | Recovery-Teleport darf nicht beschädigt werden |
| RT-07 | P2 | Touchziele unter 44 CSS-px | interaktive Controls in allen Bereichen | Noch nicht bearbeitet | ausstehend | OFFEN | Mobile Computed-Rechtecke prüfen |
| RT-08 | P2 | Überlange mobile Startseite | HomeView.vue | Noch nicht bearbeitet | ausstehend | OFFEN | Erste sinnvolle Aktion priorisieren |
| RT-09 | P2 | Veraltete Titel und Beschreibung | index.html | Noch nicht bearbeitet | ausstehend | OFFEN | Pages-Basispfad erhalten |
| RT-10 | P2 | Abweichende Wizard-Konventionen | MetricBuilder, CostOfDelay, ValueBridge | Noch nicht bearbeitet | ausstehend | OFFEN | State und Daten beim Zurücknavigieren erhalten |
| RT-11 | P3 | Mögliche Live-Region-Überansagen | ToolRecoveryPanel.vue | Noch nicht bearbeitet | ausstehend | OFFEN | NVDA/VoiceOver noch nicht geprüft |
| RT-12 | P3 | CSS-Kaskade nicht konsistent dokumentiert | src/main.ts; Styles; docs/DESIGN_SYSTEM.md | Noch nicht bearbeitet | ausstehend | OFFEN | Spezifität und Importreihenfolge erfassen |

## Paket A – Skip-Links und Hash-Routing

- **Ursache, statisch belegt:** `createWebHashHistory()` nutzt das Fragment für die Route. Unterseiten verwenden `href="#main-content"` ohne `preventDefault()`; allein die Startseite hatte `@click.prevent`. Ein nativer Ankerklick kann dadurch den Router-Hash beeinflussen.
- **Korrektur:** Delegierter und während der App-Lebensdauer registrierter Event-Handler in `App.vue`; ausschließlich `a.skip-link[href="#main-content"]` betroffen; `preventDefault()`, `tabindex="-1"` bei Bedarf, DOM-Fokus und Scrolloffset unter dem Header. Auf der Startseite wird die doppelte Sonderbehandlung entfernt.
- **Abdeckung:** Explizite 30-Routen-Matrix in `tests/e2e/skip-link-routing.spec.ts`. Getestet werden Fokus, identische URL und unveränderte History-Länge. Screenshots der Fokuszustände bei 320/375/1440 px werden als echte Playwright-Ausgaben im CI-Artefakt bereitgestellt.
- **Prüflimit:** Der zugrunde liegende Router-/DOM-Fehler ist statisch belegt, ein alter fehlerhafter Chromium-Lauf wurde nicht durchgeführt. Eine reale NVDA- oder VoiceOver-Prüfung liegt nicht vor.
- **PR A:** https://github.com/thomasasen/meddpicc-workbench/pulls (konkrete PR-Verknüpfung folgt bei Eröffnung).

## Nachweispflicht für weitere Pakete

Für jedes RT werden bestätigte Ursache, fachlich begründete Anpassung, zugeordnete Tests und originale Browser-Screenshots ergänzt. Vorher-/Nachher-Bilder müssen dieselbe Route, Auflösung und möglichst identische Daten verwenden. Simulatorische Design-Prüfperspektiven werden ausdrücklich nicht als unabhängiges Experten-Audit ausgegeben.

## Freigabegrenze

Auch bei erfolgreichen Quality Gates bleiben alle neuen Design-PRs ungemergt. Für ihre visuelle Abnahme ist eine erneute ausdrückliche Nutzerfreigabe erforderlich; die Freigabe für PR #96 gilt nicht weiter.
