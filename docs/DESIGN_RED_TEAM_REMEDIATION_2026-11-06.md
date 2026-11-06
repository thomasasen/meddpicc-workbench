# Design-Red-Team: Korrektur- und Prüfprotokoll vom 06.11.2026

**Ausgangsstand:** `main` bei `f4293fc1c7b77fef0076974f1a907354388f3897`. PR #96 ist gemergt; PR #84 bleibt separat offen und wird nicht pauschal übernommen. Die vier Änderungspakete werden als gestapelte Pull Requests ausgeführt, bis eine gesonderte visuelle Freigabe vorliegt.

**Statusmodell:** `OFFEN`, `REPRODUZIERT`, `BEHOBEN`, `VERIFIZIERT`, `NICHT REPRODUZIERBAR`, `BLOCKIERT`. `BEHOBEN` bedeutet Implementierung abgeschlossen, nicht automatisch browser- oder screenreader-verifiziert. Jeder CI-Status wird erst nach abgeschlossenem Run erfasst.

| ID | Prio | Ursprung und statischer Befund | Betroffene Stellen | Korrektur / weiterer Auftrag | Prüfung | Status | Restrisiko |
| --- | --- | --- | --- | --- | --- | --- | --- |
| RT-01 | P1 | Fragment-Links in Vue Hash History | src/App.vue; src/views/HomeView.vue; alle 30 Routen | Zentraler Click-Capture verhindert Hash-Navigation; Fokus auf Main; Startseitensonderlösung entfernt | tests/e2e/skip-link-routing.spec.ts, 30 Routen; PR #97 CI erfolgreich | VERIFIZIERT | Screenreader NVDA/VoiceOver weiterhin manuell zu prüfen |
| RT-02 | P1 | Kleinteilige Typografie | CSS-Schichten; Tools, Checklists, Knowledge | Gezielte 14px-Hilfetexte, Zeilenabstand und semantische Tokens ohne globales Heading-Scaling | tests/e2e/mobile-readability-touch.spec.ts; PR #98 CI erfolgreich | VERIFIZIERT | 200%-Textzoom und alle seltenen Metadatenklassen gesondert nachzuprüfen |
| RT-03 | P1 | Recovery verdrängt Aufgabe | ToolRecoveryPanel.vue; fünf Tool-Ansichten | Deaktiviertes Recovery kompakt, vollständige Datenschutzdetails per disclosure; Opt-in, Commit, Restore und Siebentagefrist unverändert | tests/e2e/recovery-mobile-announcement.spec.ts; bestehende Recovery-Suiten; PR #99 | BEHOBEN | Gesamte E2E-CI des finalen C-Commits und reale Browser-Storage-Fehlerfälle abzuwarten |
| RT-04 | P2 | Mobile Header und Einleitung zu hoch | Fünf Tool-Ansichten | Header, Einleitungen und Recovery bei maximal 640px reduziert; erste Eingabefelder nach oben verlagert | Playwright-Viewport-Matrix 320/375/768/1024/1440; PR #99 und #100 | BEHOBEN | Mit langem Fachtext und 200%-Zoom erneut bewerten |
| RT-05 | P2 | Legacy-Ansichten mit alter Produktidentität | EvidenceView.vue; RisksActionsView.vue; ReferencesView.vue | Drei Legacy-Routen mit sichtbarer Isolierung und Rückweg, Funktions- und Deep-Link-Erhalt | tests/e2e/shared-toolbox-header.spec.ts, Legacy-Viewport-Matrix; PR #100 | BEHOBEN | Legacy-Code bleibt technisch erhalten, bewusst keine CRM-Modernisierung |
| RT-06 | P2 | Header und Navigation uneinheitlich | Home, Tools, Checklists, Knowledge, Settings | 17 produktive Ansichten nutzen ToolboxHeader mit Kontext, Desktop-Bereichsnavigation, mobilem Rückweg und Recovery-Teleport | tests/e2e/shared-toolbox-header.spec.ts; PR #100 | BEHOBEN | Abschließende Desktop- und Mobile-Bildprüfung erforderlich |
| RT-07 | P2 | Touchziele unter 44 CSS-px | interaktive Controls in allen Bereichen | Mobile Buttons und vollwertige Navaktionen erhalten mindestens 44 mal 44 CSS-px | tests/e2e/mobile-readability-touch.spec.ts, PR #98 CI erfolgreich | VERIFIZIERT | Inline-Links als begründete Ausnahme; 200%-Textzoom offen |
| RT-08 | P2 | Überlange mobile Startseite | HomeView.vue | Geplante Tools pro Cluster einklappbar, aktive Tools bleiben sichtbar; Orientierung und Kernbereiche erhalten | tests/e2e/shared-toolbox-header.spec.ts, quick-payback.spec.ts; PR #100 | BEHOBEN | 375px-Startseite 9434→8727 px, 320px 10141→9469 px; längere Seite bleibt bewusst inhaltlich |
| RT-09 | P2 | Veraltete Titel und Beschreibung | index.html | HTML-Titel und Meta-Description aktualisiert auf Toolbox, Tools, Checklists und Wissen | Produktionsbuild und Pages-Integrität, PR #100 | BEHOBEN | Dynamische seitenbezogene Browser-Titel bleiben optional |
| RT-10 | P2 | Abweichende Wizard-Konventionen | MetricBuilder, CostOfDelay, ValueBridge | ToolStepNavigation und Value Bridge mit current/completed/upcoming; Fachworkflow und Eingaben bleiben erhalten | tests/e2e/tool-step-navigation.spec.ts und bestehende Fach-E2E; PR #100 | BEHOBEN | Abgeschlossene Schritte repräsentieren bisher Navigationsfortschritt; fachliche Eingabevalidierung weiterhin workflowspezifisch |
| RT-11 | P3 | Mögliche Live-Region-Überansagen | ToolRecoveryPanel.vue | Header bleibt visuell mit aria-live=off; separate höfliche Region nur für relevante bestätigte Ereignisse; Konflikt-/Fehleralerts erhalten | tests/e2e/recovery-mobile-announcement.spec.ts, recovery-header-acceptance.spec.ts; PR #99/#100 | BEHOBEN | Echte NVDA- oder VoiceOver-Prüfung noch nicht durchgeführt |
| RT-12 | P3 | CSS-Kaskade nicht konsistent dokumentiert | src/main.ts; Styles; docs/DESIGN_SYSTEM.md | Tatsächliche CSS-Reihenfolge inklusive letzter formRowAlignment-Schicht dokumentiert; Scoped-Stile und Ownership geklärt | docs/DESIGN_SYSTEM.md, src/styles/appleVisualRedesign.css, CI-Format/Build; PR #100 | BEHOBEN | Mehrfach-Overrides nur risikoarm und nach tatsächlichem Nachweis entfernen |

## Paket A – Skip-Links und Hash-Routing

- **Ursache, statisch belegt:** `createWebHashHistory()` nutzt das Fragment für die Route. Unterseiten verwenden `href="#main-content"` ohne `preventDefault()`; allein die Startseite hatte `@click.prevent`. Ein nativer Ankerklick kann dadurch den Router-Hash beeinflussen.
- **Korrektur:** Delegierter und während der App-Lebensdauer registrierter Event-Handler in `App.vue`; ausschließlich `a.skip-link[href="#main-content"]` betroffen; `preventDefault()`, `tabindex="-1"` bei Bedarf, DOM-Fokus und Scrolloffset unter dem Header. Auf der Startseite wird die doppelte Sonderbehandlung entfernt.
- **Abdeckung:** Explizite 30-Routen-Matrix in `tests/e2e/skip-link-routing.spec.ts`. Getestet werden Fokus, identische URL und unveränderte History-Länge. Screenshots der Fokuszustände bei 320/375/1440 px werden als echte Playwright-Ausgaben im CI-Artefakt bereitgestellt.
- **Prüflimit:** Der zugrunde liegende Router-/DOM-Fehler ist statisch belegt, ein alter fehlerhafter Chromium-Lauf wurde nicht durchgeführt. Eine reale NVDA- oder VoiceOver-Prüfung liegt nicht vor.
- **PR A:** https://github.com/thomasasen/meddpicc-workbench/pull/97

## Nachweispflicht für weitere Pakete

Für jedes RT werden bestätigte Ursache, fachlich begründete Anpassung, zugeordnete Tests und originale Browser-Screenshots ergänzt. Vorher-/Nachher-Bilder müssen dieselbe Route, Auflösung und möglichst identische Daten verwenden. Simulatorische Design-Prüfperspektiven werden ausdrücklich nicht als unabhängiges Experten-Audit ausgegeben.

## Freigabegrenze

Auch bei erfolgreichen Quality Gates bleiben alle neuen Design-PRs ungemergt. Für ihre visuelle Abnahme ist eine erneute ausdrückliche Nutzerfreigabe erforderlich; die Freigabe für PR #96 gilt nicht weiter.

## Umsetzungspakete und überprüfte Ausgangsbasis

- **PR A / RT-01:** https://github.com/thomasasen/meddpicc-workbench/pull/97. CI: https://github.com/thomasasen/meddpicc-workbench/actions/runs/42264587778 (erfolgreich).
- **PR B / RT-02+07:** https://github.com/thomasasen/meddpicc-workbench/pull/98. CI: https://github.com/thomasasen/meddpicc-workbench/actions/runs/42266566865 (erfolgreich).
- **PR C / RT-03+04+11:** https://github.com/thomasasen/meddpicc-workbench/pull/99. Neuester E2E-Lauf wird separat geprüft.
- **PR D / RT-05+06+08+09+10+12:** https://github.com/thomasasen/meddpicc-workbench/pull/100. Basierend auf C; neuer E2E-Lauf nach Korrektur von zwei veralteten Testannahmen wird separat geprüft.

### Echte Browser-Screenshots und quantitative Vergleichswerte

Die vergleichbaren Originalbilder stammen aus Playwright Chromium (Projekt `desktop-chromium`) bei identischer Route und Fensterbreite.
Der Vorherstand ist der visuell unveränderte PR-A-Code vor den UI-Paketen, der Nachherstand der durch PR D gebaute Stand. Die ersten Screenshots aus dem Nachherlauf sind als **Vorabvergleich**, nicht als finale Review-Freigabe, einzuordnen.

- Vorher / Lauf von PR A: https://github.com/thomasasen/meddpicc-workbench/actions/runs/42264587778/artifacts/13527048424
- Nachher / erster Browserlauf von PR D: https://github.com/thomasasen/meddpicc-workbench/actions/runs/42267711508/artifacts/13528248903
- Startseite 375px: 9434px → 8727px Dokumenthöhe (−7,5%).
- Startseite 320px: 10141px → 9469px Dokumenthöhe (−6,6%).
- Metric Builder 375px: 2275px → 2127px (−6,5%).
- Cost of Delay 375px: 2493px → 2325px (−6,7%).
- Go-Live-Rückwärtsplanung 375px: 5635px → 5500px (−2,4%).
- Legacy Evidenz 375px: 11913px → 12117px (+1,7% durch eindeutige Legacy-Kennzeichnung).
- Wissen Champion 375px: 10255px → 10924px (+6,5% zugunsten lesbarer Erklärungstexte).

Die Gesamtseitenhöhe ist lediglich ein Indikator und kein eigenständiges Qualitätsziel.

### Bewertung von PR #84

https://github.com/thomasasen/meddpicc-workbench/pull/84 bleibt ungeprüft ungeeignet zum pauschalen Merge. Sein älteres `src/styles/appleRedesign.css` würde eine konkurrierende Design-Kaskade neben `appleVisualRedesign.css` einführen. Änderungen an `src/domain/dragSpring.ts` sind für die hier festgestellten zwölf Probleme nicht erforderlich. Einzelne Konzepte werden nur bei klar nachgewiesenem Vorteil übernommen; bisher wurde keines unkritisch portiert.

### Vier Review-Perspektiven, kein unabhängiges Personenaudit

1. **Visuell:** Lesbarkeit und kompakteres Recovery sind in den Chromium-Vergleichen nachvollziehbar; zusätzliche Höhe in Knowledge und Legacy ist teilweise inhaltlich begründet.
2. **Sales-Nutzung:** Die erste relevante Eingabe wird in mehreren Tools früher erreichbar; die Startseite behält die direkte Go-Live-Aktion.
3. **Accessibility:** Globale Skip-Links und Touchziele sind automatisiert geprüft. Die neue Live-Region ist semantisch auf wichtige Statuswechsel begrenzt. Ein echtes Screenreader-Hörprotokoll existiert nicht.
4. **Technik/QA:** Berechnungslogik und Speicherformate wurden nicht verändert. Die Legacy-Routen bleiben erreichbar. Der vollständige finale kombinierte CI-/E2E-Nachweis steht zur gesonderten Aktualisierung aus.

**Merge-Grenze:** Die vier PRs bleiben Draft und ungeöffnet für einen Merge nach `main`, bis die visuelle Freigabe ausdrücklich erteilt ist.
