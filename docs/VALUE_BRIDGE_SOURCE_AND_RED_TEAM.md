# T3 – Value Bridge: Quellenmatrix, Gap-Analyse und simuliertes fachliches Red Team

Stand: 10.10.2026 · Entwicklung auf `feature/value-bridge`. Dies ist **keine Prüfung durch die Buchautoren**, keinen echten CFO und keinen Kunden.

## 1. Verifizierter Ausgangspunkt

Ausgangs-HEAD `main`: `7759a7e09f0c38165bd317cd8f006c0191053d99` (PR #61, Cost of Delay, gemergt am 10.10.2026). Diese Prüfung wurde vor Anlage des Feature-Branches durchgeführt.

### Bestands- und Gap-Analyse

| Vorhandene Komponente | Tatsächliche Funktion | Gap / Entscheidung |
|---|---|---|
| `softwarePayback.ts`, `businessCase.ts` | Kosten, Nutzen je Monat, Ramp-up, kumulierter Saldo, Payback, ROI und Doppelzählung über Wirkungsgruppen | Rechenengine wiederverwenden, **nicht** duplizieren |
| `businessCaseScenarios.ts` | Konservative/Basis-/optimistische Szenarien | Keine neue Szenarien-Engine in der Value Bridge |
| `metricBuilder.ts` | Pain, Vorher/Nachher, Realisierungsmechanismus und Evidenz bis zur Metric | Bisher kein zusammenhängender, kundentauglicher Pain-zu-Value-Argumentationsfluss |
| `costOfDelay.ts` | Differenz bei Projektverschiebung im konstanten Horizont | Keine Horizontdifferenz als endgültigen Vermögensverlust übernehmen |
| `metricBuilderHandoff.ts`, `costOfDelayHandoff.ts` | Einmalige Übergabe über Session Storage | Erweitertes, gleichartig flüchtiges, explizites Handoff ohne Kundendaten in URLs |
| `customerBusinessCasePdf.ts`, `metricBuilderPdf.ts` | Bericht bzw. Metric-Steckbrief | Neues kurzes Gesprächsartefakt statt zusätzlichem vollständigen Finanzbericht |

**Neu:** Eingaben und Ergebnis bauen die Kette Situation → Pain → Konsequenz → Outcome → Mechanismus → Metric → begrenzte wirtschaftliche Wirkung. Die Schätzung bleibt sichtbar geschätzt. Keine zweite Finanzengine.

## 2. Quellenmatrix

Aussagen wurden gegen die im Projekt bereitgestellten EPUB-Texte geprüft. Keine EPUB-Seitenzahlen erfinden.

| Aussage | Beleg in Primärquelle | Einordnung / Produktentscheidung |
|---|---|---|
| M1 sind Proof Points/Ergebnisse bisheriger Kunden; M2 sind kundenspezifische, im Dialog erarbeitete wirtschaftliche Metrics | **Andy Whyte**, `MEDDICC`, Abschnitt „Metrics“, Unterabschnitte „Metrics 1 (M1's) – Metrics Proof Points“ und „Metrics 2 (M2's) – Return on Investment“ | **Buchbelegt.** M1 nicht als M2 behandeln oder automatisch kundenseitig bestätigen |
| Der Weg von Identify über Indicate zu Implicate macht Pain und Konsequenz für Kunden relevant | **Andy Whyte**, Abschnitt „Implicate the Pain“, Unterabschnitte „Identify the Pain“, „Indicate the Pain“, „Implicate the Pain“ | **Buchbelegt.** Die sieben UI-Stufen der Value Bridge sind eine **eigene Synthese**, kein Autorenmodell |
| Metrics beschreiben messbare Wirkung, wirtschaftliche Verbesserung und Ausgangssituation | **Darius Lahoutifard**, Kapitel 3 „Metrics“ | **Buchbelegt.** Vorher-/Nachher-Felder, Evidenzlabels und die Typisierung von Wirkung sind **Produktentscheidungen** |
| Pain umfasst Problem, gewünschtes Ergebnis, Geschäftsimpact und Dringlichkeit / Compelling Event | **Darius Lahoutifard**, Kapitel 7 „Identify Pain“ (Pain, Desired Outcome, Urgency: Compelling Event) | **Buchbelegt.** Value Bridge setzt keine künstlichen Fristen, keine automatische Dringlichkeit |
| Die finanzielle Argumentation richtet sich an den Economic Buyer und muss seinen Business-Kontext treffen | **Darius Lahoutifard**, Kapitel 4 „Economic Buyer“ sowie Kapitel 9 „The ROI Pitch“ | **Buchbelegt.** Ein kundenfähiger Argumentationsbogen unterstützt Champion/EB, ersetzt aber keine gemeinsame Freigabe |
| Payback kann als verständlicher finanzieller Indikator dienen, ist aber nicht mit ROI identisch | **Darius Lahoutifard**, Kapitel 9 „The ROI Pitch“, Abschnitt „ROI vs. Payback Period“ | **Buchbelegt.** Bestehende Projektmonats- und ROI-Logik wird verwendet |
| Arbeitszeit ist nicht zwingend realisierbare Einsparung; Umsatz nicht gleich Deckungsbeitrag; Effekte können doppelt gezählt werden | In dieser **präzisen Buchstaben-/Formelabgrenzung nicht als spezifische Whyte-/Lahoutifard-Regel nachgewiesen** | **CFO-/Controlling-Ableitung und eigene Produktschranke**, durch vorhandene Payback-/Metric-Builder-Engine gestützt |
| Einmalige Browser-Session-Übergabe, boolesche Aktivierung, Wirkungskategorien, 36-/60-Monats-Rechnung | Keine explizite Value-Bridge-Formel in den beiden Quellen | **Eigene Architektur- und Rechenmodellentscheidung** |

## 3. Fachliche Leitplanken

1. Eine monetarisierte Metric wird nur auf ausdrückliche Aktivierung hin berücksichtigt. Ein Handoff belässt `included=false`.
2. Herkunft: Hypothese, Referenz, Kundenaussage, laut Nutzereingabe gemeinsam geprüft. Die letzte Kategorie ist **keine externe Auditbestätigung**.
3. Kapazität, theoretischer Nutzen, bloße Umsatzerwartung, Risiko und qualitatives Outcome werden nicht als sichere Einsparung addiert.
4. Zusätzliches Umsatzpotenzial darf nur bei dokumentiertem **inkrementellem Deckungsbeitrag** als monetarisierbare Wirkung beschrieben werden.
5. Identische Wirkungsgruppen zweier angerechneter Metrics blockieren die Wirtschaftlichkeitsrechnung. Semantisch ähnliche Wirkungen unterschiedlicher Gruppen müssen vom Nutzer weiterhin geprüft werden.
6. Ohne positive anrechenbare Jahreswirkung **und** benannte einmalige sowie monatliche Kosten erfolgt kein vollständiger finanzieller Business Case.
7. Die Domain nutzt `summarizeBusinessCase` → `calculateSoftwarePayback`. Der daraus abgeleitete ROI ist undiskontiert; kein NPV, keine Zahlungsstrom- oder Steuerrechnung.
8. Realisierte EUR-Positionen benötigen eine manuell nachvollziehbare Jahreswertherleitung; diese wird im Ergebnis und PDF ausgewiesen. Rechenwegtexte sind Nutzereingaben und keine unabhängig überprüfte Formel.\n9. Der Cost-of-Delay-Handoff überträgt **niemals eine Verzögerungs-Horizontdifferenz** als realisierten Jahresbetrag. Da die Ursprungs-Engine nicht zwischen Kostensenkung und zusätzlichem Deckungsbeitrag typisiert, wird der Betrag zunächst als **finanzieller Wirkungstyp ungeklärt** eingeordnet und nicht angerechnet. Einmaleffekte werden außerdem niemals als wiederkehrende Jahreswerte importiert.

## 4. Simuliertes fachliches Red Team

### Review A – vor UI-Design (simuliert)

**MEDDPICC-Practitioner / Whyte-Perspektive:** Der Anfang darf nicht nur eine Zahl sein. Ohne Pain, Indication und kundenrelevante Consequence ist eine scheinbare M2-Metric nicht tragfähig. Ergebnis: explizite Eingangskette inklusive tatsächlichem Mechanismus.

**Lahoutifard-/EB-Perspektive:** Ein Prozentwert allein überzeugt keinen Budgetentscheider. Erforderlich sind konkretes Desired Outcome und eine verständliche wirtschaftliche Übersetzung. Ergebnis: Outcome vor Wert, ERP-/CRM-Kontext statt Produktfeatures.

**CFO-Perspektive:** Freie Mitarbeiterstunden sind kein Cash. Gleiche Wirkung darf nicht doppelt gezählt werden. Ergebnis: finanzielle Kategorien und Wirkungsgruppen statt pauschalem Wertaufschlag.

**Champion / Account Manager:** Zu viele Pflichtfelder führen zu Fantasiezahlen. Ergebnis: drei Schritte, zusätzliche Finanzannahmen nur im aufklappbaren Teil.

### Review B – nach Domainimplementierung (simuliert, statische Fachlogikprüfung)

**Prüfobjekt:** `src/domain/valueBridge.ts` und `valueBridgeHandoff.ts`.

- **Whyte-/Champion-Test:** Referenz bleibt Referenz; Handoff wertet `evidence` nicht auf. Quelle und kundenspezifischer Nachweis sind sichtbar. Kein M1→M2-Automatismus.
- **CFO-Test:** Keine Monetarisierung von Kapazität, theoretischem Potenzial, Risiko. Positiver realisierbarer Betrag benötigt Mechanismus und Gruppe. Gruppenüberschneidung blockiert Modellberechnung.
- **EB-Test:** Ohne Kosten kein vollständiger Payback. Der Output ist Gesprächsgrundlage, keine Investitionsentscheidung.
- **Account-Manager-Test:** Fehlende Werte führen zu Validierungsfragen, nicht zu ausgedachten Beträgen.
- **Architektur-Test:** Die monatlichen Zahlen kommen ausschließlich aus dem bereits vorhandenen Business-Case-Service.

**Einschränkungen:** Semantische Doppelzählung über unterschiedlich benannte Gruppen kann nicht deterministisch ausgeschlossen werden; eingetippte Belege werden nicht extern überprüft. Sehr komplexe Zahlungs-/Vertragseffekte verbleiben im Software Business Case.

### Review C – nach Sichtprüfung der Originalartefakte (simuliert, 10.10.2026)

**Tatsächlich durchgeführt:** Die vier vom Playwright-Lauf erzeugten Originalscreenshots (Desktop/Mobile, finanzieller und nicht monetarisierbarer Fall) wurden geöffnet und visuell angesehen. Ebenso wurden alle vier Original-Bildseiten des Service-PDFs aus Desktop- und Mobile-Chromium (je 2 Seiten) geöffnet. Die Bilder liegen unter [docs/review-screenshots](review-screenshots). Automatisch wurde außerdem horizontaler Overflow bei 375, 768, 1024 und 1440 px geprüft. Dies ist eine **simulierte fachliche Reviewrunde**, keine echte Freigabe durch Autoren, CFO oder Kunden.

- **UX/Account Manager:** Desktop hat klar getrennte Eingabe- und Ergebnisspalten; mobil läuft die Ausgabe unter der Eingabe statt gequetscht daneben. Lange Eingabefelder, aufgeklappte Kostendetails und die Value-Bridge-Stufen sind in den Originalbildern lesbar. Ein ursprünglich sichtbar überlagernder „Zum Inhalt springen“-Link wurde als echter Bildfehler erkannt, per `clip-path` für den unfokussierten Zustand korrigiert und im neuen Originalbild nachgeprüft.
- **Economic Buyer / Champion:** Situation → Pain → Konsequenz → angestrebter Zustand → Änderung → messbare Metric → wirtschaftliche Wirkung ist auf den Bildern zusammenhängend nachvollziehbar. Das Servicebeispiel weist 36.000 EUR/Jahr als **ungeprüfte Modellannahme** und nicht als garantierte Ersparnis aus. Herleitung und Zahlungsannahmen bleiben offen einsehbar.
- **CFO/Controlling:** Der Servicefall zeigt bei 36 Monaten 78.000 EUR Kosten, 97.500 EUR modellierten Nutzen und 19.500 EUR undiskontierten Saldo, Break-even in Monat 29. Die PDF-Seiten enthalten Rechenweg, Evidenzherkunft und Einschränkungen; keine Tabellen- oder Textüberlagerung in den geprüften Seiten. Der rein operative Kapazitätsfall zeigt **keinen** finanziellen Saldo oder erfundenen Payback.
- **Fachliche Gegenprüfung:** Die separate Kategorie „Umsatzerwartung“ ist nicht monetarisierbar; importierte einmalige Cost-of-Delay-Wirkungen werden nicht in wiederkehrende Jahresbeträge überführt. Software-Business-Case-Importe mit inkompatiblen Kosten werden ausdrücklich als unvollständig gekennzeichnet.
- **Drucklayout:** Alle vier Originalbildseiten sind lesbar; die zweite Seite des zweitseitigen Beispiel-PDFs enthält die Wirtschaftlichkeits- und Annahmenabschnitte mit deutlich freiem Seitenraum. Das ist kein Überlagerungsfehler, kann gestalterisch später kompakter werden. Der Unit-Test für sehr lange deutsche Bezeichnungen verifiziert PDF-Erzeugbarkeit und Mehrseitigkeit; eine separate Bildabnahme eines extrem langen Stressdokuments wurde **nicht** durchgeführt.

**Restgrenzen:** Die manuell eingetragene Berechnung wird nicht unabhängig rechnerisch auf ihren Sachbezug geprüft. Wirkungsgruppen verhindern nur identisch gekennzeichnete Doppelzählungen, keine semantisch gleichen Effekte mit unterschiedlichen Bezeichnungen. Externe Belege und Kundenfreigaben werden nicht verifiziert. Die ausdrückliche visuelle **Nutzerfreigabe** und der Merge nach `main` bleiben offen.

**Verifizierter CI-Lauf:** [GitHub Actions #38070981674](https://github.com/thomasasen/meddpicc-workbench/actions/runs/38070981674): Format, Lint, 326 Unit-Tests, Production Build, 135 Playwright-Tests bestanden (1 Skip), PDF-Seitenrendering, Pages-Check und Bildpublikation erfolgreich.

## 5. Bewusst begrenzter Umfang

- Keine Opportunity-/Kontaktverwaltung, kein dauerhaftes Scoring, kein Backend.
- Keine neue ROI-/Payback-/Cost-of-Delay-Berechnung.
- Keine automatische Zusammenführung mehrerer Metrics mit unklarer Wirkung oder Herkunft.
- Software-Payback-Import bildet nur **direkte** realisierbare EUR-Metrics und einfache kompatible Kosten in der Bridge ab. Komplexe Formeln, Bestandsabschaltung und Start-/Endpläne bleiben im Ursprungsrechner; **keine stille Näherungsberechnung**.
- Die Value Bridge bleibt ein Diskussionsinstrument und ersetzt keine durch Controlling bestätigte Wirtschaftlichkeitsrechnung.
