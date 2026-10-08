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

**Dokumentationsstatus:** Code/Gegenmaßnahmen sind in den Dateien konkret vorhanden; Testerfolge, CI-URL, Originalbilder, beobachtete visuelle Details und verbleibende Fixes werden nach tatsächlicher Ausführung ergänzend protokolliert. Keiner der Autoren hat mitgewirkt oder etwas abgenommen.

## 6. Quality Gates / Bilder / Review

*Noch auszuführen und mit konkreten Logs/Dateilinks zu belegen.* Verlangt sind `npm ci --no-audit --no-fund`, `npm run format:check`, `npm run lint`, `npm test`, `npm run build`, `npm run test:e2e`, `npm run pages:check` nach Pages-Sync sowie Chromium Desktop/Mobile.

Screenshot-Ziel: `docs/review-screenshots/quick-payback-empty-desktop-chromium.png`, `quick-payback-empty-mobile-chromium.png`, `quick-payback-result-desktop-chromium.png`, `quick-payback-result-mobile-chromium.png`. Originale müssen von Playwright stammen, nicht von einem Mockup. Keine Bilder als fertig markieren, bevor echte Dateien und Dimensionen geprüft sind.
