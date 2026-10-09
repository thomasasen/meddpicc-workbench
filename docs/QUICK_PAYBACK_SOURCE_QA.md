# Quick Payback · Primärquellen, Feature-Fit und Qualitätssicherung

Stand: 09.10.2026. Feature-Branch: `feature/quick-payback-tool`. Simulierte Autoren-Red-Teams sind **keine** Stellungnahmen der Autoren. Einfache Finanzmathematik und UI-Entscheidungen sind **eigene Produktmodellierung**.

## 1. Live-Gate und Feature-Fit

Vor dem Branch: `main = c4e99ec682452c29998f33a128deadd8225c90d3`, keine offenen PRs, keine kollidierende Payback-Branch; letzter Main-CI-Lauf [#37848576751](https://github.com/thomasasen/meddpicc-workbench/actions/runs/37848576751) erfolgreich. PR #52 ist gemergt. Prüfung über die verbundene GitHub-Schnittstelle, nicht über einen lokalen Git-Clone.

1. **Seller-Aufgabe:** In wenigen Minuten einen *einfachen* monatlichen Amortisationswert für eine konkret definierte Anfangsinvestition und laufenden Nettonutzen ausweisen.
2. **Wiederkehrender Nutzen:** Statt frei zusammengestellter Excel-Formel eine konsistente, erklärte Modellrechnung; verhindert ROI-/Payback-Verwechslungen.
3. **Minimaler Input:** Einmalinvestition, realisierbarer Jahres-Bruttonutzen, jährliche zusätzliche laufende Kosten (explizit 0 als Default).
4. **Output:** Kundenfähige, kopierbare, als Schätzung gekennzeichnete Zusammenfassung plus prüfbare Formel und Annahmen.
5. **Deal-State:** keiner erforderlich. Reine Domain-Funktion, drei lokale Vue-Refs.
6. **Kein CRM-Nachbau:** Keine Kunden-, Opportunity-, Kontakt-, Task-, Score-, Backend- oder Persistenzfunktion.

## 2. Aus den Original-EPUBs geprüfte Quellenmatrix

Fundstellen sind **Kapitel bzw. benannte Abschnitte** im Original-EPUB. Keine Seitenzahlen erfunden. Fremde Formeln werden nicht unbemerkt als Autorendefinition behandelt.

| Autor / Originalstelle | Tatsächlich unterstützte Position | Umsetzung | Eigene Ableitung / Grenze |
| --- | --- | --- | --- |
| Lahoutifard, Chapter Nine, „ROI vs. Payback Period“ | Er bevorzugt Payback **in Zeit** statt ROI als Prozentkennzahl und liefert das Beispiel $200k Anfangskosten / $400k jährliche Savings = 0,5 Jahre bzw. 6 Monate. | Ergebnis prominent in Monaten; Referenztest **200.000 EUR / 400.000 EUR pro Jahr = 6 Monate**. | EUR ist dimensionsgleiche Testübertragung, **keine Währungsumrechnung** oder Originalwährung. Kein ROI-%-Wert. |
| Lahoutifard, Chapter Nine, „The Process to Pitch the Payback Period“ | Von Metrics zu monetären Gains/Savings, Lösungskosten, Implementierung/indirekten Kosten und zeitlichem Payback. | Drei getrennte Kosten-/Nutzenfelder; sichtbarer Rechenweg. | Die präzise Formel für *jährliche zusätzliche Betriebskosten*, 12 gleichmäßige Monate und konstante Flows ist **unser vereinfachtes Modell**. |
| Lahoutifard, Chapter Three, „Metrics and the Economic Impact“ | Wirtschaftliche Effekte durch Revenue, Cost und Risk; „Zeit sparen“ braucht messbaren Bezug und Risiken sind nicht automatisch feste Geldbeträge. | Benefit-Hilfetext begrenzt auf realisierbare EUR, kein ungeprüfter Risikoaufschlag. | Nur zusätzlicher Deckungsbeitrag, nicht Umsatz allein; keine automatische Validierung. |
| Lahoutifard, Chapter Five, „Financial Justification“ | Finanzielle Rechtfertigung ist Teil kundenspezifischer Decision Criteria. | Hinweis: keine automatische Budget-/Investitionsfreigabe. | Kein allgemeiner guter/schlechter Payback-Schwellenwert. |
| Whyte, „METRICS“, „Metrics 1 (M1's) - Metrics Proof Points“ | M1 sind Proof Points bereits erreichter Resultate bei Bestandskunden; ihre Übertragbarkeit auf Zielkunden bleibt eine **Hypothese**. | Keine vorgefüllte Referenz-Metric, Demo explizit fiktiv. | Keine Kundenvalidierung aus Referenzen ableiten. |
| Whyte, „METRICS“, „Metrics 2 (M2's) - Return on Investment“ | M2 entstehen durch Forschung, Discovery und Abstimmung mit Champion/Kunde und quantifizieren kundenspezifischen Wert; Metrics helfen beim Business Case, nicht nur beim Produkt-KPI. | „Modellrechnung / Schätzung“ sowie Kundenvalidierungs-Hinweis; Metrics-Link. | Das Tool **kann M2 nicht verifizieren** und erzeugt keinen ROI-Prozentsatz. |
| Whyte, „ECONOMIC BUYER“, Passage zu „Completion“ und „Economic Buyer and Go-Live Plan“ | EB betrachtet Time to Value, Alternativinitiativen und Vertrauen in Entscheidungsgrundlagen; Abstimmung und Widerspruch ausdrücklich hilfreich. | Zeitlicher Nullpunkt sichtbar **ab Nutzenbeginn**, EB-Verweis. | Kein Go-Live- oder Budget-Beschluss aus Monaten ableiten. |
| Whyte, „DECISION CRITERIA“, „Economic Decision Criteria“ | Ein belastbarer Business Case, Risiko, Zeit und weitere Economic Criteria zählen neben Renditeüberlegungen. | Quellen-/Grenzenbereich und keine Erfolgsampel. | Undiskontierter Payback ist **nicht** vollständiger Business Case, NPV oder IRR. |
| Whyte, „PAIN“ und „CHAMPION“ | Problemauswirkung sowie kundenseitiger Champion sind Grundlage für wertorientierte Discovery und interne Argumentation. | Pain-/Implication-Link, nachvollziehbarer kopierbarer Text. | Das Tool bestätigt weder Pain noch Champion; Werte werden nur vom Nutzer eingegeben. |

**Doppelerfassung ausschließen:** Einmalige Implementierungskosten gehören in das Investitionsfeld, nicht noch einmal in jährlich laufende Kosten. Bereits um die gleichen Ausgaben bereinigte Benefits dürfen nicht nochmals vermindert werden. Zeitersparnis ist ohne betriebswirtschaftliche Realisierung keine automatische Kostenersparnis. Mehrumsatz ist nicht identisch mit Deckungsbeitrag. Unterschiedliche Effekte dürfen nicht doppelt monetarisiert werden.

## 3. Mathematischer und technischer Vertrag

`src/domain/quickPayback.ts`: `QuickPaybackInput` (drei deutsche EUR-Strings), `calculateQuickPayback()` mit den Zuständen `empty`, `invalid`, `payback`, `zero-investment`, `no-payback`, `no-financial-gain`. Für positiven Nettozufluss:

- Netto EUR/Jahr = Bruttonutzen EUR/Jahr − Zusatzkosten EUR/Jahr.
- Netto EUR/Monat = Netto EUR/Jahr / 12.
- Monate = Anfangsinvestition / (Netto EUR/Jahr / 12), **ab Beginn des angenommenen regelmäßigen Nutzens**.

Dezimaltrennzeichen ist das Komma; Punkt nur als korrekt gruppierter Tausenderpunkt; Dezimalstellen bis 2, Bereich 0 bis 1.000.000.000.000 EUR. Keine stillschweigende Interpretation von `1234.56` als deutscher Dezimalwert. Rechnung mit ungerundeten Zahlen, Anzeige in Monaten normalerweise mit einer Nachkommastelle, sehr kleine positive Werte als „unter 0,1“. Negative/Null-Nettozuflüsse liefern **keine** Infinity/NaN-Payback-Dauer. Kein globaler Store, kein Browserzugriff im Domain-Modul.

**Bewusste Grenzen:** Linearer, undiskontierter konstant angenommener monetärer Nutzen ab Nutzenbeginn; kein Kalenderversprechen ab Vertrag oder Projektstart; keine Anlaufphase, gestaffelte Kosten/Nutzen, Steuern, Abschreibung, Finanzierung, Inflation, Kapitalkosten, Alternativinvestitionen oder Wahrscheinlichkeit. Auch 6 Monate wären weder Forecast noch Economic-Buyer-Freigabe.

## 4. Simuliertes Autoren-Red-Team A · vor dem Coding: konkrete Design-Einwände

Bewertung zunächst als Design-/Abnahmebedingung, **nicht** als bereits bestandene technische Prüfung.

### Lahoutifard-Perspektive (7 substanzielle Einwände)

| Originalfundstelle | Risiko | Gegenmaßnahme | Abnahmetest |
| --- | --- | --- | --- |
| Ch. 9, „ROI vs. Payback Period“ | ROI-% mit Monaten verwechseln. | Nur zeitlicher Payback, „undiskontiert“ nennen. | Keine ROI-%-Ausgabe in Unit/Browser. |
| Ch. 9, Zahlenbeispiel | $-Beispiel falsch in EUR „umrechnen“. | Test nur gleiche Zahlenverhältnisse, Währungsunterschied dokumentieren. | 200k / 400k = 6 Monate. |
| Ch. 9, „The Process to Pitch…“ | Nutzen aus Produktaussage statt Metric. | Benefit-Hilfe verlangt nachvollziehbare EUR-Wirkung. | Sichtbarer Hinweis und Kundenbotschaft. |
| Ch. 9, Implementierungs-/indirekte Kosten | Einmalaufwand vergessen oder jährlich doppelt erfassen. | Investment- und Operating-Input bewusst trennen. | 120k/(240k−60k)/12 = 8 Monate. |
| Ch. 3, „Metrics and the Economic Impact“ | Mehrumsatz unbesehen als Einsparung zählen. | Nur realisierbarer Deckungsbeitrag; kein Automatismus. | UI-Text zu Mehrumsatz vs. Gewinn. |
| Ch. 3, Risk | Unbezifferte Risikoreduktion addieren. | Keine automatische Risikorechnung. | Drei Inputs, kein Risikofeld/Schätzwert. |
| Ch. 9, Pitch-Rhetorik | „6 Monate“ als unvermeidliche Dringlichkeit verkaufen. | Schätzung und wirtschaftliche Bedingungen sichtbar. | Copy-Text ohne Garantie. |

### Whyte-Perspektive (7 substanzielle Einwände)

| Originalfundstelle | Risiko | Gegenmaßnahme | Abnahmetest |
| --- | --- | --- | --- |
| „Metrics 1 (M1's)“ | Referenz-/Produktkennzahl als M2 missverstehen. | Demo nur ausdrücklich fiktiv; Start leer. | Default leer, Demo nur nach Klick. |
| „Metrics 2 (M2's)“ | Eingabe als kundenbestätigt anzeigen. | Keine Bestätigt-Marker, explizite Validierungsaufforderung. | Copy-Text + Screenshot. |
| „METRICS“ | Produkt-KPI statt Business Outcome. | Hilfetext zu monetarisierten Outcomes. | Eingabetext inspizieren. |
| „PAIN“ | Zahl ohne Kundenproblem und Folgeanalyse. | Querverweis Pain/Implication. | Route-Link prüfen. |
| „ECONOMIC BUYER“, „Completion“ | Nutzenbeginn mit Vertragsstart verwechseln. | Modellnullpunkt direkt im Ergebnis. | UI-Text + Browsergate. |
| „Economic Decision Criteria“ | Einfacher Payback ersetzt gesamten Beschluss. | Hinweis auf Kriterien, keine Erfolgsampel. | Quellenende/No-Approval-Texte. |
| „CHAMPION“ und EB-Abstimmung | Copy wird als „intern genehmigt“ verkauft. | Neutraler Schätztext für Diskussion. | Unit-Copy ohne Evidenz-/Freigabe-Fiktion. |

## 5. Simuliertes Autoren-Red-Team B · Review am geschriebenen Slice

B ist ein **adversariales Code-/Textreview**, keine echte Autorenschaft. Technische Evidenz wird erst durch spätere CI-/Browserläufe ergänzt.

### Lahoutifard-Perspektive (7 am Ist-Code konkretisierte Einwände)

1. **`src/domain/quickPayback.ts` – `months`**: Monatsskala statt Prozent passt Ch. 9; verwehrt die irreführende Anzeige einer ROI-%-Zahl. Regression: Copy-Test und UI.
2. **`parseEuroInput()`**: Gemischte Schreibweisen wie `1.234,56` dürfen nicht zu 1,23456 werden. Entscheidung: strikter deutscher Parser, feldgenaue Ablehnung. Regression: Parser-Tests.
3. **`QuickPaybackView.vue`, Benefit-Hilfe**: Ein Produktivitätsversprechen „eine Stunde Zeitersparnis“ ist keine belegte Einsparung. Entscheidung: ausdrücklicher Warnsatz zur Realisierung. Browser: Hilfetext.
4. **`QuickPaybackView.vue`, Benefit-Hilfe**: Ein Umsatzplus entspricht keinem Nettoeffekt. Entscheidung: Deckungsbeitrag statt Mehrumsatz berücksichtigen. Browser: Hilfetext.
5. **`calculateQuickPayback()`, Netto-Formel**: Doppelte Einmal- und Betriebskosten könnten aus einer 6-Monats-Rechnung eine falsche Story machen. Entscheidung: getrennte Felder mit Doppelerfassungs-Hinweis. Regression: 8-Monate-Test.
6. **`calculateQuickPayback()` bei Netto ≤ 0**: Division würde negativen/ewigen Payback liefern. Entscheidung: `no-payback` / `no-financial-gain` statt Zahl. Regression: Boundary-Tests.
7. **`buildQuickPaybackSummary()`**: Auch eine korrekte Dauer ist kein garantierter Deal. Entscheidung: immer „Modellrechnung / Schätzung“ und Kundendatenprüfung. Regression: Copy-Test.

### Whyte-Perspektive (7 am Ist-Code konkretisierte Einwände)

1. **`QuickPaybackView.vue` Demo-Button**: Demo-Zahlen könnten als Proof Points missverstanden werden. Entscheidung: Startfelder leer, fiktiv sichtbar nur nach Nutzerklick. Browser: Demo/Reset.
2. **`buildQuickPaybackSummary()`**: Ein M2-Metric-Status wird nie technisch validiert. Entscheidung: keine automatische „kundenseitig bestätigt“-Aussage. Unit-Copy.
3. **`quick-model-note`**: Time to Value ist nicht Vertragstermin. Entscheidung: Nullpunkt bei jedem Ergebnis sichtbar, auch ohne Quellen-Accordion. Browser & Screenshot.
4. **`quick-related`**: Isolierte EUR-Zahl ohne Pain und Economic Buyer wäre fachlich zu schmal. Entscheidung: direkte Wissenslinks. Browser-Navigation.
5. **`quick-sources`**: Economic Criteria umfassen mehr als Payback. Entscheidung: weitere Kriterien und Finanzmodellgrenzen am Seitenende, zunächst eingeklappt. Tastaturtest.
6. **`quick-result`**: 0 EUR Anfangsinvestition könnte wie ein „kostenloser“ Beschluss wirken. Entscheidung: gesonderter Warnzustand bei positiver Nettonutzung; ohne positiven Nutzen überhaupt kein Erfolgsresultat. Unit/Browser.
7. **`quick-duration` und Copy**: „6 Monate“ allein wäre Forecast oder EB-Freigabe ohne Evidenz. Entscheidung: eindeutig undiskontiert, ab Nutzenbeginn, keine automatische Approval-Meldung. Unit-Copy/visueller Review.

**Dokumentationsstatus:** Beide simulierten Reviews liegen als schriftliche Prüfung des finalen Codes vor. Nach Runde B wurden insbesondere die Regressions-Testdaten (0 EUR Anfangsinvestition, positiver Nettofluss), die Smoke-Navigation und der visuelle Skip-Link-Fix ergänzt. Nachweise für Format, Unit, Browser und finale Screenshots stehen in Abschnitt 6. Keiner der Autoren hat mitgewirkt oder etwas abgenommen.

## 6. Ausgeführte Quality Gates und nachvollziehbare Fehlerhistorie

### CI-Nachweis

- **Anfänglicher Lauf [#37853933215](https://github.com/thomasasen/meddpicc-workbench/actions/runs/37853933215), fehlgeschlagen:** `npm ci --no-audit --no-fund`, `npm run format:check`, `npm run lint`, `npm test` (29 Dateien, 214 Tests) und `npm run build` grün. Playwright: **77 bestanden, 4 fehlgeschlagen, 1 übersprungen**. Ursachen waren 2× veralteter Home-Smoke-Erwartungstext und 2× unzutreffende E2E-Testdaten bei Nullinvestition (60.000 EUR jährliche Zusatzkosten blieben gesetzt). Die Domain reagierte korrekt mit „kein Payback“. **Fix:** Erwartungstext an aktualisierte Home-Kachel anpassen; im E2E-Sonderfall vor Erwartung von 0 Monaten die Zusatzkosten auf 0 zurücksetzen.
- **Zwischenläufe [#37854437291](https://github.com/thomasasen/meddpicc-workbench/actions/runs/37854437291), [#37854464429](https://github.com/thomasasen/meddpicc-workbench/actions/runs/37854464429), fehlgeschlagen:** Formatprüfung des aktualisierten Smoke-Tests. **Fix:** Assertion in eine mit Prettier verträgliche kompakte Form überführt; keine Qualitätsprüfung übersprungen.
- **Erster vollständiger grüner Lauf [#37854561280](https://github.com/thomasasen/meddpicc-workbench/actions/runs/37854561280):** npm ci, Prettier, ESLint, Vitest, TypeScript/Vite-Build, Playwright Chromium, Pages-Sync und `pages:check` erfolgreich. Unit **214/214**, E2E **81 bestanden, 1 übersprungen**. Nach der Prüfung der vier Originalbilder fiel bei manchen Vollseitenaufnahmen ein schwebend erscheinender unsichtbarer „Zum Inhalt springen“-Link auf. **Visueller Fix:** `src/views/QuickPaybackView.vue` versteckt den Skip-Link bis zur Tastaturfokussierung mittels Clip; `tests/e2e/quick-payback.spec.ts` normalisiert vor jeder Vollseitenaufnahme die Scrollposition. **Alle vier Bilder nach diesem Fix erneut aus Chromium generiert.**
- **Finaler funktionaler CI-Lauf [#37855094701](https://github.com/thomasasen/meddpicc-workbench/actions/runs/37855094701) – ERFOLGREICH:** `npm ci --no-audit --no-fund` → `npm run format:check` → `npm run lint` → `npm test` (**29 Testdateien, 214 bestanden**) → `npm run build` → `npm run test:e2e` (**81 bestanden, 1 übersprungen**, Desktop + Mobile) → synchronisierter Pages-Root → `npm run pages:check` (**Build-Manifest entspricht Quellen und Assets**). Im Jobprotokoll `113577247372` sind alle Prüfungen und die Veröffentlichung der Screenshot-Dateien erfolgreich. Die GitHub-CI commitete die Pages-Assets und anschließend die vier Original-PNGs ausschließlich in den Feature-Branch.
- Der übersprungene Playwright-Test ist als **übersprungen**, nicht als bestanden gezählt. Gelegentliche npm-/GitHub-Actions-Deprecation-Warnungen erfordern kein Umgehen der Gates; vorhandene Dependencies und Actions wurden nicht eigenmächtig aktualisiert.

### Vier echte, final visuell geprüfte Chromium-Originalbilder

Alle Links zeigen auf originale Dateien in `docs/review-screenshots/` im Feature-Branch, nicht auf Renderings/Mockups. Die PNG-Header und die sichtbaren Bildinhalte wurden direkt aus den GitHub-Dateien kontrolliert.

| Abnahmebild | Auflösung (Originalpixel) | Tatsächlich kontrollierte Details |
| --- | --- | --- |
| [Start Desktop](../docs/review-screenshots/quick-payback-empty-desktop-chromium.png) | **1280 × 1261** | Zweispaltiges Layout, leere Pflichtwerte, 0 EUR laufende Kosten, Hilfen, verständlicher Leerzustand, sichtbare Modellgrenze und Quellen-Accordion unten eingeklappt. Kein überlagernder Skip-Link nach Fix. |
| [Start Mobile](../docs/review-screenshots/quick-payback-empty-mobile-chromium.png) | **1081 × 5800** (Pixel-5-Geräteemulation mit Skalierung) | Einspaltiger Formular-/Ergebnisfluss, gut lesbare Labels und Eingaben, volle Klickflächen, korrekte vertikale Reihenfolge, Quellen unten; kein sichtbares Clipping oder störender Skip-Link. |
| [Ergebnis Desktop](../docs/review-screenshots/quick-payback-result-desktop-chromium.png) | **1280 × 1593** | 120.000 EUR, 240.000 EUR/Jahr, 60.000 EUR/Jahr → **8,0 Monate**, 180.000 EUR/Jahr netto, 15.000 EUR/Monat netto; Formel, Zeitnullpunkt, Hinweis auf fiktives Beispiel und sachliche kopierbare Zusammenfassung sichtbar. |
| [Ergebnis Mobile](../docs/review-screenshots/quick-payback-result-mobile-chromium.png) | **1081 × 8734** (Pixel-5-Geräteemulation mit Skalierung) | Gleiche Daten und Rechnung, dominante Monatszahl, umgebrochene Formel und Kundenbotschaft, große Kopierschaltfläche, sichtbarer Fokus des zuletzt bearbeiteten Kostenfelds, kein Überlauf; Quellen am Seitenende. |

**Visuelle Abnahme nach dem Fix:** Alle vier finalen Bilder erneut geöffnet, längere Mobile-Seiten in ihren Details beurteilt (Eingaben/Labels, Ergebnis, Rechenweg, Copy, Quellenende). Kein störend eingeblendeter Skip-Link mehr. Die Browser-Suite überprüft zusätzlich Layout ohne Horizontal-Overflow bei **375, 768, 1024, 1440 px**, auch mit ungültigen Beträgen und geöffneten Quellen, Navigation, Tastaturaktivierung des Accordeons und Copy per echtem UI-Klick.

### Fachliche Restgrenzen / Abnahme

- **Nicht automatisch prüfbar:** Echtheit und Realisierbarkeit der eingegebenen Kundenzahlen, Zeit bis zum Nutzen, Zustimmung des Economic Buyer oder Business-Case-Freigabe. Dies sind absichtliche Produktgrenzen und bleiben sichtbar kommuniziert.
- Ein tatsächlicher Clipboard-Permissions-Fehler wurde nicht separat in Chromium simuliert; der Fehlerzweig mit verständlicher Meldung ist implementiert, der erfolgreiche Browser-Copy-Klick mit tatsächlichem Clipboard-Inhalt ist verifiziert.
- `main` bleibt auf `c4e99ec682452c29998f33a128deadd8225c90d3`; **kein Merge ohne ausdrückliche weitere Nutzerfreigabe**. Visuelle Nutzerabnahme offen.
