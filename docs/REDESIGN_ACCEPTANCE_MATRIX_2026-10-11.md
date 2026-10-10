# Redesign: Prüfraster für Originalansichten

Stand 11.10.2026. **Dies ist keine Freigabe und keine visuelle Abnahme.**

Die Browser-Matrix `tests/e2e/redesign-viewport-matrix.spec.ts` ruft 25 produktive Routenziele bei 375, 768, 1024 und 1440 px auf, prüft dokumentweiten Overflow und erzeugt Originalbilder bei 375 und 1440 px. Technisch durchlaufene Tests ersetzen keine manuelle Bildprüfung. Leere, befüllte, Ergebnis- und Sonderzustände sind separat zu prüfen.

| Routenziel | Technische Prüfung | Visuelle Abnahme |
| --- | --- | --- |
| `/` | CI-Lauf ausstehend | Ausstehend |
| `/tools/quick-payback` | CI-Lauf ausstehend | Ausstehend |
| `/tools/metric-builder` | CI-Lauf ausstehend | Ausstehend |
| `/tools/cost-of-delay` | CI-Lauf ausstehend | Ausstehend |
| `/tools/value-bridge` | CI-Lauf ausstehend | Ausstehend |
| `/tools/reverse-timeline` | CI-Lauf ausstehend | Ausstehend |
| `/checklists/discovery-call` | CI-Lauf ausstehend | Ausstehend |
| `/checklists/decision-criteria` | CI-Lauf ausstehend | Ausstehend |
| `/checklists/decision-process` | CI-Lauf ausstehend | Ausstehend |
| `/checklists/pain-implication` | CI-Lauf ausstehend | Ausstehend |
| `/checklists/champion` | CI-Lauf ausstehend | Ausstehend |
| `/checklists/competition` | CI-Lauf ausstehend | Ausstehend |
| `/checklists/paper-process` | CI-Lauf ausstehend | Ausstehend |
| `/checklists/metrics` | CI-Lauf ausstehend | Ausstehend |
| `/checklists/economic-buyer` | CI-Lauf ausstehend | Ausstehend |
| `/checklists/economic-buyer-meeting` | CI-Lauf ausstehend | Ausstehend |
| `/knowledge/discovery-call` | CI-Lauf ausstehend | Ausstehend |
| `/knowledge/decision-criteria` | CI-Lauf ausstehend | Ausstehend |
| `/knowledge/decision-process` | CI-Lauf ausstehend | Ausstehend |
| `/knowledge/pain-implication` | CI-Lauf ausstehend | Ausstehend |
| `/knowledge/champion` | CI-Lauf ausstehend | Ausstehend |
| `/knowledge/competition` | CI-Lauf ausstehend | Ausstehend |
| `/knowledge/paper-process` | CI-Lauf ausstehend | Ausstehend |
| `/knowledge/metrics` | CI-Lauf ausstehend | Ausstehend |
| `/knowledge/economic-buyer` | CI-Lauf ausstehend | Ausstehend |

## Report-/Exportmatrix

| Modul | Technische Prüfung | Originalbildseiten visuell geprüft |
| --- | --- | --- |
| `src/report/valueBridgePdf.ts` | CI-Lauf ausstehend | Ausstehend |
| `src/report/metricBuilderPdf.ts` | CI-Lauf ausstehend | Ausstehend |
| `src/report/costOfDelayPdf.ts` | CI-Lauf ausstehend | Ausstehend |
| `src/report/softwareBusinessCasePdf.ts` | CI-Lauf ausstehend | Ausstehend |
| `src/report/customerBusinessCasePdf.ts` | CI-Lauf ausstehend | Ausstehend |
| `src/services/timelineExport.ts (SVG)` | CI-Lauf ausstehend | Ausstehend |
| `src/services/timelineExport.ts (PNG)` | CI-Lauf ausstehend | Ausstehend |

## Legacy-Routen

Die nicht primär navigierten Routen `/evidence`, `/risks-actions`, `/references` bleiben erhalten. Es findet keine unbegründete funktionale Erweiterung statt. Responsive und Accessibility sind separat zu prüfen.

## Offene Abnahmeschritte

PDF-Originale aller fünf Exporter in allen Szenarien rendern und **jede** Seite beurteilen; finale Querformat-/Seitenumbruchprüfung; Hands-on-Accessibility (Fokus, Tastatur, Touch), Diagramme und SVG-/PNG-Exporte; berechnungsidentische Ergebnisse; Format/Lint/Tests/Build/Pages/E2E. Die Testmatrix wird erst nach verifizierten Ergebnissen als bestanden markiert.
