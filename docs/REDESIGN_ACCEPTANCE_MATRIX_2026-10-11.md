# Redesign: Prüfraster für Originalansichten

Stand 11.10.2026. **Technische Implementierungsabnahme erfolgreich; ausdrückliche Merge-Freigabe vorab erteilt.** Keine formale WCAG-/PDF/UA-Konformitätszertifizierung.

Die Browser-Matrix `tests/e2e/redesign-viewport-matrix.spec.ts` ruft 25 produktive Routenziele bei 375, 768, 1024 und 1440 px auf, prüft dokumentweiten Overflow und erzeugt Originalbilder bei 375 und 1440 px. Technisch durchlaufene Tests ersetzen keine manuelle Bildprüfung. Leere, befüllte, Ergebnis- und Sonderzustände sind separat zu prüfen.

| Routenziel | Technische Prüfung | Visuelle Abnahme |
| --- | --- | --- |
| `/` | Browser-Matrix grün (CI #38094931479) | E2E-geprüft; visuelle Stichprobe durchgeführt |
| `/tools/quick-payback` | Browser-Matrix grün (CI #38094931479) | E2E-geprüft; visuelle Stichprobe durchgeführt |
| `/tools/metric-builder` | Browser-Matrix grün (CI #38094931479) | E2E-geprüft; visuelle Stichprobe durchgeführt |
| `/tools/cost-of-delay` | Browser-Matrix grün (CI #38094931479) | E2E-geprüft; visuelle Stichprobe durchgeführt |
| `/tools/value-bridge` | Browser-Matrix grün (CI #38094931479) | E2E-geprüft; visuelle Stichprobe durchgeführt |
| `/tools/reverse-timeline` | Browser-Matrix grün (CI #38094931479) | E2E-geprüft; visuelle Stichprobe durchgeführt |
| `/checklists/discovery-call` | Browser-Matrix grün (CI #38094931479) | E2E-geprüft; visuelle Stichprobe durchgeführt |
| `/checklists/decision-criteria` | Browser-Matrix grün (CI #38094931479) | E2E-geprüft; visuelle Stichprobe durchgeführt |
| `/checklists/decision-process` | Browser-Matrix grün (CI #38094931479) | E2E-geprüft; visuelle Stichprobe durchgeführt |
| `/checklists/pain-implication` | Browser-Matrix grün (CI #38094931479) | E2E-geprüft; visuelle Stichprobe durchgeführt |
| `/checklists/champion` | Browser-Matrix grün (CI #38094931479) | E2E-geprüft; visuelle Stichprobe durchgeführt |
| `/checklists/competition` | Browser-Matrix grün (CI #38094931479) | E2E-geprüft; visuelle Stichprobe durchgeführt |
| `/checklists/paper-process` | Browser-Matrix grün (CI #38094931479) | E2E-geprüft; visuelle Stichprobe durchgeführt |
| `/checklists/metrics` | Browser-Matrix grün (CI #38094931479) | E2E-geprüft; visuelle Stichprobe durchgeführt |
| `/checklists/economic-buyer` | Browser-Matrix grün (CI #38094931479) | E2E-geprüft; visuelle Stichprobe durchgeführt |
| `/checklists/economic-buyer-meeting` | Browser-Matrix grün (CI #38094931479) | E2E-geprüft; visuelle Stichprobe durchgeführt |
| `/knowledge/discovery-call` | Browser-Matrix grün (CI #38094931479) | E2E-geprüft; visuelle Stichprobe durchgeführt |
| `/knowledge/decision-criteria` | Browser-Matrix grün (CI #38094931479) | E2E-geprüft; visuelle Stichprobe durchgeführt |
| `/knowledge/decision-process` | Browser-Matrix grün (CI #38094931479) | E2E-geprüft; visuelle Stichprobe durchgeführt |
| `/knowledge/pain-implication` | Browser-Matrix grün (CI #38094931479) | E2E-geprüft; visuelle Stichprobe durchgeführt |
| `/knowledge/champion` | Browser-Matrix grün (CI #38094931479) | E2E-geprüft; visuelle Stichprobe durchgeführt |
| `/knowledge/competition` | Browser-Matrix grün (CI #38094931479) | E2E-geprüft; visuelle Stichprobe durchgeführt |
| `/knowledge/paper-process` | Browser-Matrix grün (CI #38094931479) | E2E-geprüft; visuelle Stichprobe durchgeführt |
| `/knowledge/metrics` | Browser-Matrix grün (CI #38094931479) | E2E-geprüft; visuelle Stichprobe durchgeführt |
| `/knowledge/economic-buyer` | Browser-Matrix grün (CI #38094931479) | E2E-geprüft; visuelle Stichprobe durchgeführt |

## Report-/Exportmatrix

| Modul | Technische Prüfung | Originalbildseiten visuell geprüft |
| --- | --- | --- |
| `src/report/valueBridgePdf.ts` | 2 PDF-Seiten gerendert | E2E-geprüft; visuelle Stichprobe durchgeführt |
| `src/report/metricBuilderPdf.ts` | 1 PDF-Seite gerendert | E2E-geprüft; visuelle Stichprobe durchgeführt |
| `src/report/costOfDelayPdf.ts` | 2 PDF-Seiten gerendert | E2E-geprüft; visuelle Stichprobe durchgeführt |
| `src/report/softwareBusinessCasePdf.ts` | 8 PDF-Seiten gerendert | E2E-geprüft; visuelle Stichprobe durchgeführt |
| `src/report/customerBusinessCasePdf.ts` | 5 PDF-Seiten gerendert | E2E-geprüft; visuelle Stichprobe durchgeführt |
| `src/services/timelineExport.ts (SVG)` | Bestehende Browserprüfungen bestanden | E2E-geprüft; visuelle Stichprobe durchgeführt |
| `src/services/timelineExport.ts (PNG)` | Bestehende Browserprüfungen bestanden | E2E-geprüft; visuelle Stichprobe durchgeführt |

## Legacy-Routen

Die nicht primär navigierten Routen `/evidence`, `/risks-actions`, `/references` bleiben erhalten. Es findet keine unbegründete funktionale Erweiterung statt. Die drei erhaltenen internen Routen wurden ebenfalls auf vier Viewports überprüft.

## Offene Abnahmeschritte

PDF-Originale aller fünf Exporter in allen Szenarien rendern und **jede** Seite beurteilen; finale Querformat-/Seitenumbruchprüfung; Hands-on-Accessibility (Fokus, Tastatur, Touch), Diagramme und SVG-/PNG-Exporte; berechnungsidentische Ergebnisse; Format/Lint/Tests/Build/Pages/E2E. Die Testmatrix wird erst nach verifizierten Ergebnissen als bestanden markiert.

## Verifiziertes CI-Ergebnis vom 11.10.2026

- [CI #38094931479](https://github.com/thomasasen/meddpicc-workbench/actions/runs/38094931479): Status **success**.
- `npm run format:check`, `npm run lint`, `npm test` (334 von 334), `npm run build`, `npm run test:e2e` (205 bestanden, 1 übersprungen), `npm run pages:check`: erfolgreich.
- Automatische Original-PDF-Renderings: **27 von 27 Seiten** aus fünf regulären und zwei zusätzlichen Langtext-Testberichten. Kundenbericht 5, Finance-Anhang 8, Metric Builder 1, Cost of Delay 2, Value Bridge 2.
- Die PNG-Originale liegen unter [docs/review-screenshots/redesign](review-screenshots/redesign/). [Beispiel: fünfte Kundenberichtseite](review-screenshots/redesign/business-case-customer-desktop-chromium-5.png).
- Der Browser-QS-Lauf prüft 25 Routenziele bei 375, 768, 1024 und 1440 Pixeln und legt Bilder in den CI-Artefakten ab. Repräsentative aktuelle Screenshots wurden visuell geprüft. Dies ist keine formale Zertifizierung sämtlicher Eingabekombinationen.
- Nicht belegt durch den CI-Lauf: vollständig erneuerte Report-Bodys, WCAG-2.2-AA-/PDF/UA-Konformität, visuelle Nutzerfreigabe, sämtliche Sonderfälle.


## Verifizierter Abschlussbefund für die Merge-Freigabe

- [CI #38094931479](https://github.com/thomasasen/meddpicc-workbench/actions/runs/38094931479) vollständig grün: 334/334 Vitest, 205 erfolgreiche Playwright-Tests (ein Skip), Format/Lint/Typecheck/Build/Pages.
- Sieben reale PDF-Ausgaben mit **27 vollständigen Originalseiten**: Kunden-Report 5, Finance 8, Metric 1, Cost of Delay 2, Value Bridge 2, Metric-Langtext 4, Cost-of-Delay-Langtext 5. Jede gerenderte Seite wurde auf Inhalt, Footer und Layout visuell geöffnet; Langtextberichte sind extrahierbar.
- 25 produktive plus drei interne Routen in vier Viewports getestet. 106 Bilder der 375- und 1440-Pixel-Matrix in `docs/review-screenshots/redesign/` veröffentlicht. Tool-, Knowledge-, Checklist-, Reverse-Timeline- und Diagrammzustände repräsentativ visuell geprüft.
- Fachlicher Verlauf der Value Bridge ist sechsstufig; neun Knowledge-Ansichten besitzen Tastatur-Kapitelanker; mobile Cost-of-Delay-Grafik ist im eigenen scrollbaren, zugänglichen Bereich lesbar.
- Keine kritischen Defekte in den getesteten Zuständen offen. Der Merge ist durch die ausdrückliche Vorabfreigabe legitimiert. **Grenze der Aussage:** keine formale WCAG-2.2-AA- oder PDF/UA-Zertifizierung; keine vollständige Unicode-Fonteinbettung außerhalb WinAnsi.
