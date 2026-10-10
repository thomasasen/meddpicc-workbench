# Redesign: Prüfraster für Originalansichten

Stand 11.10.2026. **Dies ist keine Freigabe und keine visuelle Abnahme.**

Die Browser-Matrix `tests/e2e/redesign-viewport-matrix.spec.ts` ruft 25 produktive Routenziele bei 375, 768, 1024 und 1440 px auf, prüft dokumentweiten Overflow und erzeugt Originalbilder bei 375 und 1440 px. Technisch durchlaufene Tests ersetzen keine manuelle Bildprüfung. Leere, befüllte, Ergebnis- und Sonderzustände sind separat zu prüfen.

| Routenziel | Technische Prüfung | Visuelle Abnahme |
| --- | --- | --- |
| `/` | Browser-Matrix grün (CI #38093731202) | Manuelle Sichtabnahme offen |
| `/tools/quick-payback` | Browser-Matrix grün (CI #38093731202) | Manuelle Sichtabnahme offen |
| `/tools/metric-builder` | Browser-Matrix grün (CI #38093731202) | Manuelle Sichtabnahme offen |
| `/tools/cost-of-delay` | Browser-Matrix grün (CI #38093731202) | Manuelle Sichtabnahme offen |
| `/tools/value-bridge` | Browser-Matrix grün (CI #38093731202) | Manuelle Sichtabnahme offen |
| `/tools/reverse-timeline` | Browser-Matrix grün (CI #38093731202) | Manuelle Sichtabnahme offen |
| `/checklists/discovery-call` | Browser-Matrix grün (CI #38093731202) | Manuelle Sichtabnahme offen |
| `/checklists/decision-criteria` | Browser-Matrix grün (CI #38093731202) | Manuelle Sichtabnahme offen |
| `/checklists/decision-process` | Browser-Matrix grün (CI #38093731202) | Manuelle Sichtabnahme offen |
| `/checklists/pain-implication` | Browser-Matrix grün (CI #38093731202) | Manuelle Sichtabnahme offen |
| `/checklists/champion` | Browser-Matrix grün (CI #38093731202) | Manuelle Sichtabnahme offen |
| `/checklists/competition` | Browser-Matrix grün (CI #38093731202) | Manuelle Sichtabnahme offen |
| `/checklists/paper-process` | Browser-Matrix grün (CI #38093731202) | Manuelle Sichtabnahme offen |
| `/checklists/metrics` | Browser-Matrix grün (CI #38093731202) | Manuelle Sichtabnahme offen |
| `/checklists/economic-buyer` | Browser-Matrix grün (CI #38093731202) | Manuelle Sichtabnahme offen |
| `/checklists/economic-buyer-meeting` | Browser-Matrix grün (CI #38093731202) | Manuelle Sichtabnahme offen |
| `/knowledge/discovery-call` | Browser-Matrix grün (CI #38093731202) | Manuelle Sichtabnahme offen |
| `/knowledge/decision-criteria` | Browser-Matrix grün (CI #38093731202) | Manuelle Sichtabnahme offen |
| `/knowledge/decision-process` | Browser-Matrix grün (CI #38093731202) | Manuelle Sichtabnahme offen |
| `/knowledge/pain-implication` | Browser-Matrix grün (CI #38093731202) | Manuelle Sichtabnahme offen |
| `/knowledge/champion` | Browser-Matrix grün (CI #38093731202) | Manuelle Sichtabnahme offen |
| `/knowledge/competition` | Browser-Matrix grün (CI #38093731202) | Manuelle Sichtabnahme offen |
| `/knowledge/paper-process` | Browser-Matrix grün (CI #38093731202) | Manuelle Sichtabnahme offen |
| `/knowledge/metrics` | Browser-Matrix grün (CI #38093731202) | Manuelle Sichtabnahme offen |
| `/knowledge/economic-buyer` | Browser-Matrix grün (CI #38093731202) | Manuelle Sichtabnahme offen |

## Report-/Exportmatrix

| Modul | Technische Prüfung | Originalbildseiten visuell geprüft |
| --- | --- | --- |
| `src/report/valueBridgePdf.ts` | 2 PDF-Seiten gerendert | Manuelle Sichtabnahme offen |
| `src/report/metricBuilderPdf.ts` | 1 PDF-Seite gerendert | Manuelle Sichtabnahme offen |
| `src/report/costOfDelayPdf.ts` | 2 PDF-Seiten gerendert | Manuelle Sichtabnahme offen |
| `src/report/softwareBusinessCasePdf.ts` | 8 PDF-Seiten gerendert | Manuelle Sichtabnahme offen |
| `src/report/customerBusinessCasePdf.ts` | 5 PDF-Seiten gerendert | Manuelle Sichtabnahme offen |
| `src/services/timelineExport.ts (SVG)` | Bestehende Browserprüfungen bestanden | Manuelle Sichtabnahme offen |
| `src/services/timelineExport.ts (PNG)` | Bestehende Browserprüfungen bestanden | Manuelle Sichtabnahme offen |

## Legacy-Routen

Die nicht primär navigierten Routen `/evidence`, `/risks-actions`, `/references` bleiben erhalten. Es findet keine unbegründete funktionale Erweiterung statt. Responsive und Accessibility sind separat zu prüfen.

## Offene Abnahmeschritte

PDF-Originale aller fünf Exporter in allen Szenarien rendern und **jede** Seite beurteilen; finale Querformat-/Seitenumbruchprüfung; Hands-on-Accessibility (Fokus, Tastatur, Touch), Diagramme und SVG-/PNG-Exporte; berechnungsidentische Ergebnisse; Format/Lint/Tests/Build/Pages/E2E. Die Testmatrix wird erst nach verifizierten Ergebnissen als bestanden markiert.

## Verifiziertes CI-Ergebnis vom 11.10.2026

- [CI #38093731202](https://github.com/thomasasen/meddpicc-workbench/actions/runs/38093731202): Status **success**.
- `npm run format:check`, `npm run lint`, `npm test` (331 von 331), `npm run build`, `npm run test:e2e` (195 bestanden, 1 übersprungen), `npm run pages:check`: erfolgreich.
- Automatische Original-PDF-Renderings: **18 von 18 Seiten** aus fünf tatsächlich erzeugten Testberichten. Kundenbericht 5, Finance-Anhang 8, Metric Builder 1, Cost of Delay 2, Value Bridge 2.
- Die PNG-Originale liegen unter [docs/review-screenshots/redesign](review-screenshots/redesign/). [Beispiel: fünfte Kundenberichtseite](review-screenshots/redesign/business-case-customer-desktop-chromium-5.png).
- Der Browser-QS-Lauf prüft 25 Routenziele bei 375, 768, 1024 und 1440 Pixeln und legt Bilder in den CI-Artefakten ab. **Manuelle Sichtkontrolle der Bilder wurde nicht abgeschlossen.**
- Nicht belegt durch den CI-Lauf: vollständig erneuerte Report-Bodys, WCAG-2.2-AA-/PDF/UA-Konformität, visuelle Nutzerfreigabe, sämtliche Sonderfälle.

