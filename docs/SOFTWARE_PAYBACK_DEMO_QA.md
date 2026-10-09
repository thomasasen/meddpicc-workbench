# Beispielwerte: Quick Payback und CRM-/SaaS-Szenario

**Stand:** 09.10.2026 · rein fiktive Daten · keine Angaben eines realen Kunden.

## Warum zwei Beispiele?

Der Rechner bleibt **ohne Beispiel sofort leer und bedienbar**. Wer eine Berechnung sehen möchte, kann im Projektmodus eines von zwei Beispielen laden:

1. **Einfaches Beispiel:** 120.000 EUR einmalig, 3.000 EUR SaaS/Monat ab Monat 1, 15.000 EUR Bruttonutzen/Monat ab Monat 7. Konstanter monatlicher Nettozufluss nach Go-Live von 12.000 EUR, erster und anhaltender Payback im Projektmonat **18**. Das ist der unveränderte kleine Regressionstest.
2. **CRM-/SaaS-Beispiel mit Kunden-Metrics:** realistischerer fiktiver Business-Case-Entwurf für eine CRM-/Service-Transformation mit Kostenstaffel, Altsoftware, mehreren Metric-Typen, Nutzenbeginn und Ramp-up.

Die Formulierungen **„ROI-Rechner“** und **„Payback-Rechner“** sind nicht synonym: Die Software zeigt **keinen ROI in Prozent**, sondern einen undiskontierten wirtschaftlichen Saldo und den Monat, in dem sich die Anfangs- und laufenden Kosten innerhalb des Modellhorizonts amortisieren.

## Neues detailliertes Beispiel

### Einmalige und laufende Softwarekosten

| Kostenposition | Betrag | Wirksam ab |
| --- | ---: | --- |
| Einführung / Customizing | 360.000 EUR einmalig | Projektmonat 0 |
| Migration / Integration | 90.000 EUR einmalig | Projektmonat 4 |
| Training / Change Management | 30.000 EUR einmalig | Projektmonat 6 |
| **Summe Einmalkosten** | **480.000 EUR** | gestaffelt |
| Neue CRM-SaaS-Lizenzen | 8.000 EUR/Monat (96.000 EUR/Jahr) | Monat 1 |
| Vermiedene alte CRM-Lizenzen | 3.000 EUR/Monat (36.000 EUR/Jahr) | erst ab Monat 10 |

Jährliche Kostenwerte würden im Rechner wirtschaftlich gleichmäßig verteilt, **nicht** als kalendergenauer Zahlungsstrom modelliert. Das Demo wählt explizite Monatsbeträge.

### Kundenseitige Metrics

| Metrik | Nachvollziehbare Modellierung | Jahreswert bei Vollnutzen | Berücksichtigung |
| --- | --- | ---: | --- |
| Externe Vertriebsunterstützung entfällt | angenommene tatsächliche Ausgabensenkung | 110.000 EUR | **Ja**, ab M7, 3 Monate Ramp-up |
| Geringere Servicekosten | 30.000 Vorgänge/Jahr × (6 − 4) EUR | 60.000 EUR | **Ja**, ab M7, 3 Monate Ramp-up |
| Bessere Angebots-Conversion | 2.500 Angebote × 5 Prozentpunkte × 1.200 EUR zusätzlicher **Deckungsbeitrag** | 150.000 EUR | **Ja**, ab M9, 6 Monate Ramp-up |
| CRM-Nacharbeit wird kürzer | 85 Personen × 6 Std./Woche × 46 Wochen × 58 EUR/Std. | 1.360.680 EUR **rechnerischer Kapazitätswert** | **Nein**: keine nachgewiesene Kostenersparnis |
| Reduziertes Service-/Compliance-Risiko | freie hypothetische Risikoschätzung | 40.000 EUR Risikowert | **Nein**: kein sicherer Cash-Nutzen |

**Finanziell angerechnete Metrics:** 110.000 + 60.000 + 150.000 = **320.000 EUR/Jahr nach vollem Ramp-up**. Die beiden anderen Werte bleiben erklärbar sichtbar, aber ausgeschlossen. Alle fünf Metrics haben **Datenherkunft Verkäuferannahme**, nicht kundenbestätigt, und erhalten eigene eindeutige Wirkungsgruppen. Bei überlappenden Gruppen blockiert die Finanzengine weiterhin eine unkritische doppelte Anrechnung.

### Nachvollziehbares Ergebnis der Domain-Engine

| Zeitpunkt | Erwarteter kumulierter Saldo |
| --- | ---: |
| Monat 0 | −360.000 EUR |
| Monat 6 (Investitionen und SaaS-Vorlauf) | −528.000 EUR |
| Monat 9 (noch kein Altsoftware-Wegfall) | ca. −521.583 EUR |
| Monat 24 | ca. −217.417 EUR |
| **Monat 35** | **erstmals positiv** |
| Monat 36 | **+42.583 EUR** |

Der **erste und über die 36 Modellmonate anhaltende Break-even** ist Projektmonat **35**. Diese Monatszahl ist das Ergebnis des fiktiven Kosten-/Nutzenverlaufs und **keine bestätigte Kaufentscheidung, ROI-Garantie oder Forecast**.

## Anschluss zur Demo-Opportunity

Die historische Datei [`examples/demo-opportunity.meddpicc`](../examples/demo-opportunity.meddpicc) ist inhaltlich auf die **Beispielwerke Industrie GmbH** abgestimmt, bleibt aber das Legacy-Projektformat `0.2.0`. Ihre fünf MEDDPICC-Metrics unterscheiden dokumentierte, fiktive operative Aussagen von drei **unbestätigten** wirtschaftlichen Hypothesen. Die früher falsche Zeitersparnis-Kalkulation wurde korrigiert:

`85 × 6 × 46 × 58 = 1.360.680 EUR` (nur potenzieller Kapazitätswert; `economicImpact.value=null`).

Die Projektdatei enthält weiterhin einen alten aggregierten `businessCase`-Input von 480.000 EUR einmalig und 96.000 EUR jährlich. **Sie übergibt nicht automatisch** einzelne Kostenpositionen, Ramp-ups, Metric-Daten oder das Ergebnis an das Microtool. Ein solcher Import wäre eine gesonderte Erweiterung des Datenvertrags und ist hier ausdrücklich nicht hinzugefügt.

## Qualitätssicherung

- Vitest: vollständige Referenzvalidierung, fünf Formeln/Status, Herkunft, Null-/Negativfälle, Payback m35, kumulierter Saldo und Unveränderlichkeit der Fixture nach UI-Bearbeitung. **Die ältere Qualification-Testbasis wurde ebenfalls angepasst:** Unbestätigte Demowerte führen fachlich korrekt zu einem Metric-Gap; im separaten positiven Gate-Test wird eine hypothetische Metric ausdrücklich mit bestätigter Evidenz versehen.
- Playwright: beide Beispiele laden, m18/m35, ausgeschlossene Wirkungstypen sichtbar, Rücksetzen, bestehende Export- und Navigationsprüfung.
- Prettier, ESLint, TypeScript/Vite und bestehende Chromium-Regression müssen vor Merge erfolgreich sein.

### Fehlerbehebung während der Umsetzung

Die erste Pipeline schlug wegen der JSON-Prettier-Regeln für `.meddpicc` fehl. Nach deren Korrektur deckten ältere Qualification-Tests sechs bisher fest erwartete Demo-Zustände auf, die mit den jetzt unbestätigten Metrics nicht mehr zutrafen. Die Tests wurden fachlich entsprechend aktualisiert; die Produktregeln wurden **nicht** abgeschwächt. Anschließend waren 235 Vitest-Tests grün. Ein zusätzlicher TypeScript-Check erzwang die korrekte Behandlung des optionalen alten `businessCase`-Felds. Nach automatischer Normalisierung der geänderten Dateien wurde der temporäre Formatierungsschritt wieder entfernt. Die abschließende CI läuft auf genau diesem Stand.
