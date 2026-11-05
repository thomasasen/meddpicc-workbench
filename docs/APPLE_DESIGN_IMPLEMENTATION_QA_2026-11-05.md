# Apple Design: UI-Implementierung und technische QS

**Stand:** 05.11.2026  
**Branch:** `docs/apple-design-priority-2026-11` / PR #83

## Implementierte Änderungen

- Gemeinsamer UI-Stil `src/styles/appleInteractions.css` mit unmittelbar erkennbarer Press-Rückmeldung für primäre Buttons, Tool-Navigation, Checklist-Filter und produktive Startseitenkarten.
- Sichtbare Fokus-Stile für Tastatur, erhöhter Kontrast und Forced-Colors-Fallback.
- Schutz bei `prefers-reduced-motion: reduce` und `prefers-reduced-transparency: reduce`. Solide Standardflächen bleiben erhalten; kein pauschales Glassmorphism und keine zusätzlichen JavaScript-Bibliotheken.
- `ReverseTimelineView.vue`: Pointer-treue Drag-Bewegung mit Greifversatz, stabiler Datenreihenfolge bis `pointerup`, Vorschau der Einfügeposition und verschobenen Nachbarkarten.
- Rückgängigmachen bei `pointercancel`, vorhandene Tastatursteuerung (Pfeile, Home, End) und Screenreader-Live-Meldung bleiben erhalten.
- Aus der aktuellen visuellen Position gestartete, unterbrechbare Einrastanimation über Web Animations API ohne neue Dependencies; Reduced Motion blendet diese aus.

## Red-Team-Szenarien und Regressionen

| Risiko | Absicherung |
| --- | --- |
| Datenreihenfolge verändert sich während Drag | Neuer E2E-Test prüft unveränderte Eingaben bis zum Loslassen |
| Verlust von Pointer-Capture, Cancel | `pointercancel` bricht ohne Reorder ab |
| Fokusverlust bei Sortierung | Bestehender E2E-Tastaturtest bleibt erhalten |
| Sprunghaftes Einrasten / neuer Drag während Restbewegung | Beginn misst aktuelle Bildschirmposition, bestehende Animation wird unterbrochen |
| Bewegungsintoleranz | Reduced-Motion-Regression im bestehenden Test sowie neue Press-Rückmeldung-Prüfung |
| Nur Farbfeedback | Semantische Labels und zugänglicher Fokus bleiben erhalten |
| Verschlechterte Kontrastdarstellung | Media-Query-Regression für `prefers-contrast: more` |
| Unnötiger Runtime-Overhead | CSS/WAAPI statt neuer Animationsbibliothek, nur temporäres `will-change` |

## Geltungsbereich und offene Grenzen

Dieser PR verbessert **gemeinsame Interaktionsprimitiven über die aktiven Routen** und überarbeitet den konkreten komplexen Drag-Workflow. Es ist **kein Pixel-für-Pixel-Redesign sämtlicher Views**. Kontextfreie Apple-Liquid-Glass-Effekte oder animierte Datencharts sind bewusst nicht integriert.

## Tatsächlich durchgeführte technische Prüfung

- GitHub Actions: [CI #42019174928](https://github.com/thomasasen/meddpicc-workbench/actions/runs/42019174928), Abschluss **success** am 05.11.2026.
- `npm run format:check`: erfolgreich.
- `npm run lint`: erfolgreich.
- `npm test`: **356 Tests bestanden** (48 Testdateien).
- `npm run build`: erfolgreich, einschließlich TypeScript-Validierung.
- `npm run test:e2e`: **247 Tests bestanden, 1 übersprungen** in Chromium Desktop und Mobile.
- Pages-Root wurde synchronisiert und `pages:check` erfolgreich ausgeführt.
- Der erste Browserlauf fand **vier Fehler in zwei neuen Testfällen** (jeweils Desktop und Mobile): fehlender Scroll-to-View vor der Press-Prüfung und falsche erwartete Hash-URL. **Beide Testannahmen wurden korrigiert**, ohne den fachlichen Anwendungscode dafür anzupassen. Zweiter vollständiger Lauf grün.
- Verfügbare CI-Artefakte: `ui-qs-screenshots` und `production-build` am verlinkten GitHub-Actions-Lauf.

**Offene Abnahme:** Keine unabhängige manuelle Originalbildprüfung oder dedizierte Frame-Time-Performance-Messung in dieser Runde. Die CI belegt technische Funktion und Regression, aber keine vollständige visuelle UX-Abnahme oder WCAG-Zertifizierung. Vor einem Merge bleibt die sichtbare UI ausdrücklich freizugeben.
