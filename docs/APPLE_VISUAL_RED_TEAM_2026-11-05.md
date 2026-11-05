# Sichtbares Apple-Design-Redesign: Implementierung und simuliertes Red-Team

Stand: 05.11.2026. Feature-Branch `feature/apple-design-visible-redesign-2026-11`.

## Konkrete Umsetzung

- Gemeinsame neue Oberflächentokens und `appleVisualRedesign.css` (letzter Stylesheet-Import): Material- und Tiefenstaffelung, größere Abstände/Radien, lesbare Formulare, klar differenzierte Interaktionszustände, professionelle Typografie.
- Startseite: neue echte Bereichsnavigation (Tools, Checklists, Wissen) mit sichtbaren Fokuszuständen; räumlich gegliederter Hero und direkter, funktionaler Go-Live-Einstieg.
- Einheitliche Stilführung auf Go-Live-Rückwärtsplanung, Quick Payback, Metric Builder, Cost of Delay, Value Bridge, Checklists, Knowledge und Settings.
- Bestehende Export- und Fachlogik bleibt unangetastet. Keine neue JS- oder Animationsbibliothek.

## Red-Team-Hypothesen und Gegenmaßnahmen

| Adversariales Risiko | Maßnahme / Prüfziel |
| --- | --- |
| Nur Dokumentationsänderungen, weiterhin identische GUI | Neue echte HomeView-Navigation/Hero + gemeinsame CSS-Komponenten, nicht nur Skill-Verweis |
| Apple-Look wird zu iOS-Kopie/Marketing-Gradient | Ruhige B2B-Hierarchie, weiche Materialtiefe; nur funktionale Hero-Akzentfläche |
| Glassmorphism macht Texte unlesbar | Standard ist 98% weiß; Blur nur für sticky Header mit opakem Fallback |
| Kontrast-/Transparenz-/Reduced-Motion-Präferenzen fehlen | CSS-Fallbacks, eigene Media Queries und neue Browser-Regressionen |
| Hover-Effekte erschweren Touch/Klick | Hover-Lift nur bei `(hover: hover) and (pointer: fine)`; native Links und Buttons |
| Sichtbare Navigation bricht bei 320 px/Zoom | Mobile-Umbruch, Header-Navigation als zweite Zeile, responsive Grids |
| Neue Startseitenaktion führt ins Leere | Link auf existierende Route `/tools/reverse-timeline` |
| Formulare verlieren native Semantik | ausschließlich CSS-Styling von bestehenden Inputs und Labels |
| Bestehende Drag-WAAPI von globalem Card-Transform blockiert | neue Card-Styles greifen nicht in den aktiven Drag-Transform ein; eigener Drag-Regressionstest bleibt |
| Screens für Checklists/Knowledge bleiben unberührt | explizite Panels, Checklisten, Wissenskarten, Steps und Settings im neuen Theme |
| CSS verändert PDF-Export und Kundencharts | Exportcode und SVG/PDF-Metriken nicht geändert; bestehende Regressionstests als Gate |

## Ergebnisse der technischen Qualitätssicherung

- Vollständig erfolgreicher Workflow: [GitHub Actions #42035429161](https://github.com/thomasasen/meddpicc-workbench/actions/runs/42035429161).
- Formatierung, Linting und TypeScript-/Vite-Produktionsbuild: **bestanden**.
- Vitest: **356 Tests bestanden** in 48 Testdateien.
- Playwright Chromium Desktop und Mobile: **255 Tests bestanden**, **1 bestehender Skip**, **0 Fehler**.
- GitHub-Pages-Root mit gebauten Assets synchronisiert und Integritätsprüfung **bestanden**.
- Neue Szenarien prüfen die tatsächlich gerenderte Bereichsnavigation und ihren Tastaturfokus, direkte Go-Live-Navigation, messbare Hero-Materialeigenschaften, horizontale Überläufe bei **320, 375, 768, 1024 und 1440 px** sowie Reduced Motion und erhöhten Kontrast.
- Reale CI-Regression: Vor der Korrektur erwartete `smoke.spec.ts` nur **einen** Link zu `#tools`. Nach Einführung des zusätzlichen Navigationslinks lagen legitimerweise zwei vor. Die Prüfung ist auf semantisch benannte Bereichsnavigation plus drei separate Einstiegskarten umgestellt. Zweiter vollständiger CI-Lauf grün.
- Die CI stellt das Artefakt `ui-qs-screenshots` bereit. Dies sind Screenshots für ein menschliches Review, kein automatisch bestandener Pixel-Freigabetest.

## Prüflimits

Diese Red-Team-Rollen sind **simulierte Gegenprüfungen**, keine unabhängigen externen menschlichen Reviewer. Eine unabhängige visuelle Prüfung sämtlicher Originalscreenshots und dediziertes Framerate-/Performance-Profiling wurde **nicht** durchgeführt. Die erfolgreiche CI belegt technische Regressionen und Browserbedienbarkeit; sie ist keine WCAG-Zertifizierung und ersetzt nicht die gestalterische Abnahme durch echte Nutzer.
