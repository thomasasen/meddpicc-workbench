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

Die technische Verifikation ist über Format, Lint, TypeScript/Build, Vitest und Playwright Desktop/Mobile im bestehenden GitHub-CI-Workflow durchzuführen. Bis erfolgreiche Läufe vorliegen, ist dies **kein vollständiger Laufzeit-Freigabenachweis**. Der PR bleibt bis zur ausdrücklich erteilten UI-Freigabe ungemergt.
