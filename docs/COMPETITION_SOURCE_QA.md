# Competition – Primärquellenmatrix und fachliche Qualitätssicherung

Stand: 08.10.2026. Original-EPUBs im Projekt direkt anhand der Abschnitte geprüft. Keine EPUB-Seitenzahlen. **Simuliertes** Red Team: keine Beteiligung oder Freigabe durch die realen Autoren.

## Feature-Fit-Gate

- **Verkäuferfrage:** Welche tatsächlichen Alternativen kann die Kundenentscheidung verdrängen, was davon ist belegt, und welche Frage klärt die größte Lücke?
- **Input:** keiner verpflichtend; die zehn flüchtigen Checkboxen sind persönliche Denkhilfen.
- **Output:** quellenbasierte Knowledge-Referenz, natürliche Discovery-Fragen und eine erklärende Themen-Checklist.
- **Produktgrenze:** kein CRM, Account/Opportunity, globaler Deal-State, Score, P&L, Wettbewerber-Ranking oder persistente Auswahl. Die Legacy-Deal-Inspection wird nicht eingebunden.
- **Trennung T2/T6/T9:** Der Slice ist T2 Knowledge/Checklist. Value Triangle/Decision Matrix bleiben T6, Alternativen- und Wettbewerbsmicrotools T9.

## Primärquellenmatrix

Legende: **P** = belegter Originalgedanke, **A** = eigenständige Praxisableitung; **F** = frei konstruiertes Beispiel, nicht Kundenevidenz.

| Fachlicher Anspruch | Originalfundstelle Whyte | Originalfundstelle Lahoutifard | Umsetzung / UI | Beobachtbare Evidenz | Praxisableitung / Grenze |
| --- | --- | --- | --- | --- | --- |
| Vier Alternativarten: Rival Solutions, Building Internally, Other Projects/Priorities, Inertia | COMPETITION → Types of Competition | Chapter Two → Where do we cover the Competition? erwähnt incumbent/non-decision, **keine identische Vierer-Typologie** | competition.ts → types; Knowledge-Typenkarten | konkret benannte Alternativen / Kundenaussagen | P Whyte; keine künstliche Autoren-Einigkeit |
| Rival Solutions nicht auf Feature Battle reduzieren | COMPETITION → Rival Solutions | Chapter Five → Decision Criteria | types.rival; Checklist rival | tatsächliche Ausschreibung/Angebotsvergleich | A: offene Käuferfragen, keine konkreten Rival-Funktionen erfunden |
| Internal Build politisch und technisch | COMPETITION → Building Internally | Keine direkte Entsprechung | types.build; deepDives, Checklist build | benannter interner Sponsor, Ziele, Ressourcen und Auftrag | P politisches Motiv; A: keine pauschalen Kosten-/Zeitbehauptungen |
| Andere Initiativen teilen Funds/Resources | COMPETITION → Other Projects/Priorities | Chapter Three → Metrics zur wirtschaftlichen Relevanz | types.projects; Checklist prioritaeten | Kundenbestätigung einer Ressourcenkollision | P Whyte; A: Budget ist nicht automatisch Priorität |
| Inertia als Alternative, Warnsignale statt Verlustorakel | COMPETITION → Inertia; Signs your Deal is Heading for Inertia | Chapter Two → Where do we cover the Competition? enthält non-decision | types.inertia; deepDives; Checklist inertia | Gründe für Status quo, Pain, EB, Kriterien, Prozess | A: No Decision (fehlender Beschluss) und Status quo (Ist-Zustand) differenziert; kein Win-/Loss-Score |
| Political / Technical / Commercial sind Analyseperspektiven | COMPETITION → Competitive Strategy | Chapter Five → Kriterienbezug; Chapter Eight → Champion | perspectives; separate drei Karten | Sponsor/Einfluss, validierte Kriterien, wirtschaftliche Vergleichsgröße | P Whyte; ausdrücklich nicht die vier Alternativarten |
| Competitive Strategy Plan umfasst Strengths, Weaknesses, Traps und Proof | COMPETITION → The Competitive Strategy Plan | Keine direkte Entsprechung | Deep Dive zu sachlichen Fragen; kein Plan-Microtool | fallbezogene belegbare Kriterien | P als Knowledge erklärt, T9-Plan-Tool ausgeschlossen |
| Kundenspezifische Differenzierung mit Pain, Criteria, Metrics | COMPETITION → Rival Solutions; DECISION CRITERIA | Chapter Three → Metrics; Chapter Five → Decision Criteria | differentiation; Checklist impact, kriterien | Kundenseitige Bewertung und Proof Points | A fünfstufige Value Story, keine generische Feature-Behauptung |
| Sieben Value-Triangle-Zonen | DECISION CRITERIA als angrenzende Perspektive, **keine identische Sieben-Zonen-Taxonomie** | Chapter Five → The Value Triangle; Analysis of The Decision Criteria Triangle; Most important zones | zones (sieben separate IDs); Knowledge-Details | kundenseitiges Kriterium plus verifizierte Erfüllung zweier Lösungen | P Lahoutifard; ohne konkrete Alternative keine belastbare Zone |
| VALUE vs UNIQUE DIFFERENTIATORS | Keine direkte Entsprechung der Zone | Chapter Five → Analysis …; Most important zones | zones.value, zones.unique-differentiators | Kunde fordert Fähigkeit vs Kunde fordert sie nicht | UNIQUE kann nützlich sein, ist aber noch kein bestätigter VALUE |
| DANGER vs unbekannt; PARITY vs Differenzierung | Keine direkte Entsprechung der Zone | Chapter Five → Analysis …; Most important zones; How to Act on Each Zone? | zones.danger, zones.parity; Checklist value | bestätigtes Kriterium, reale Erfüllung/Fehlen pro Alternative | Hypothese nie zu DANGER umetikettieren |
| MARKET TRENDS, USELESS, CUSTOM NEEDS | Keine direkte Entsprechung der Zone | Chapter Five → Analysis of The Decision Criteria Triangle | zones.market-trends, zones.useless, zones.custom-needs | erfragte / unerfragte Fähigkeiten und verifizierte Erfüllung | Keine Zone ohne Kundendaten festlegen |
| Competition-Champion und interne Unterstützer | COMPETITION → A word from Jack on Competition; CHAMPION | Chapter Two → Where do we cover the Competition?; Chapter Eight → Champion | deepDives, Checklist politisch | beobachtbare Advocacy; Bericht bleibt Bericht | Passage aus Whytes Buch wird nicht Jack als separatem Buch zugeschrieben |
| Nicht schlechtreden; Trap Setting / Counter-Traps nicht beschönigen | COMPETITION → Do Not Knock the Competition; The Competitive Strategy Plan; DON’T KNOCK THE COMPETITION → Trap-Setting Questions | Chapter Five → How to Act on Each Zone? (aktiv Kriterien beeinflussen) | deepDives Trap-Fragen; Checklist aktion | geprüfte kundenseitige Relevanz und sachliche Antwort | **A ethische Einschränkung:** offene Fragen statt FUD, Täuschung oder Geheimdaten; nicht als wörtliche Whyte-Regel etikettiert |
| Offene Unsicherheit: Beobachtung, Bericht, Hypothese, unbekannt | COMPETITION → Qualifizierung im Sales Process | Chapter Two; Chapter Five → Criteria | evidence; Checklist alle Signals | abgeglichene Entscheidung vs. ungeprüfte Vermutung | **A** explizite Evidenzstufen |
| CRM-/SaaS-Praxisfall | keine historische Kundenreferenz | keine historische Kundenreferenz | scenario (fünf Schritte) | keine: **F**, frei konstruiert | nur didaktisches Szenario, keine echten Zahlen, Kundennamen oder Feature-Claims |

## Runde A – adversariale Prüfung vor der technischen Umsetzung

Prüfgrundlage: die Original-EPUBs und das geplante fachliche Inhaltsmodell. Die folgenden Einwände sind **simulierte** Kritikerpositionen, keine Aussagen der Autoren über die Software.

### Whyte-Perspektive (vorher)

| Originalfundstelle | Risiko im Entwurf | Beschlossene Gegenmaßnahme | Geplanter Test |
| --- | --- | --- | --- |
| COMPETITION → Types of Competition | Nur konkrete Vendors werden gezeigt, Budgetkonflikt verschwindet | Vier separat erkennbare Alternativarten, mehrere parallel möglich | Vitest exakte vier IDs; Playwright vier Karten |
| COMPETITION → Inertia; Signs … | Kein Angebot wird als sichere Zukunftsentscheidung gedeutet, Warnsignale als Loss-Prognose verkauft | Eigene Inertia-Karte und offene Why-change-Prüfung, keine Score-Ampel | Vitest Prognosegrenze; Browser Red Flags |
| COMPETITION → Building Internally | Build vs. Buy nur Preis-/Funktionsvergleich | Kontrolle, IP, Sponsor und politische Dynamik ausdrücklich prüfen | Vitest nicht-pauschale Formulierung |
| COMPETITION → Competitive Strategy; The Competitive Strategy Plan | Vier Arten mit Political/Technical/Commercial verwechselt; eigener Plan-Builder drängt in T9 | Drei getrennte Analyseperspektiven, Strategy Plan nur in Knowledge | Vitest Perspektiven-IDs, Scope-QA |
| COMPETITION → Do Not Knock; DON’T KNOCK → Trap-Setting Questions | Trap Taktik fälschlich komplett verboten oder aggressiv kopiert | Whytes offensive Taktik historisch korrekt, eigene offene und faire Fragen als Praxisgrenze | Vitest Attribution; Quellennote im UI |
| COMPETITION → Rival Solutions | Differenzierung besteht aus unbewiesenen Rival-Features | Pain → Kriterium → Proof → Metrics → Champion-Story | Vitest keine Preis-/ROI-Claims; Playwright Links |

### Lahoutifard-Perspektive (vorher)

| Originalfundstelle | Risiko im Entwurf | Beschlossene Gegenmaßnahme | Geplanter Test |
| --- | --- | --- | --- |
| Chapter Two → Where do we cover the Competition? | Eigenes Competition-Kapitel des Autors erfunden | Herkunft aus Metrics/Kriterien/Champion kenntlich | Vitest Quellenattribution |
| Chapter Three → Metrics; Chapter Five → Decision Criteria | Wettbewerb wird nur als Anbietername erfasst | Kriterien-/Metrics-Validation und Economic Buyer verbinden | E2E Querverweise |
| Chapter Five → Analysis of The Decision Criteria Triangle | Zonenliste falsch oder verkürzt | Genau sieben IDs samt relativer Bedeutung | Vitest sieben IDs |
| Chapter Five → Most important zones | UNIQUE als VALUE verkauft | Kundenbedarf + einseitige Erfüllung Voraussetzung | Vitest VALUE/UNIQUE-Abgrenzung |
| Chapter Five → Most important zones | DANGER bei unbelegten Fremdbehauptungen behauptet | Unbekannt separat, DANGER nur bei bestätigt erfülltem Käuferkriterium | Vitest DANGER-Aussage, E2E Zonen |
| Chapter Two; Chapter Eight → Champion | Gegenseitige Fürsprache / konkurrierende Kriterien fehlen | Political-Karte, gegnerische Sponsorschaft und Criteria-Quelle | E2E Deep Dives und Links |

**Vorabentscheidung:** Knowledge ist eine kurze Erstansicht mit vier Arten, Evidenzgrenzen, drei Analyseachsen und vertiefenden Details. Die Checklist umfasst zehn unabhängige Punkte, ohne Datenpersistenz. Fiktiver CRM-Fall wird als fiktiv ausgezeichnet. Priorität A: Zonentrennung und keine erdachte Wettbewerber-Evidenz. Priorität B: Quellen-Fold/Responsive/Tastatur. Keine Aussage zur bereits bestandenen UI-Qualität in dieser Runde.

## Runde B – tatsächliche Nachprüfung an Implementierung, Tests und Screenshots

Simulierte adversariale Fachprüfung aus beiden Autorenperspektiven, **keine direkte Mitwirkung oder Freigabe der Autoren**. Geprüft wurden die real implementierten Vue-Views, die Competition-Contentdatei, zehn Checklist-Einträge, die automatisierten Testprotokolle und die tatsächlich erzeugten vier Browserbilder. Folgende Prüfungen beziehen sich auf konkrete Aussagen des geschriebenen Codes und sind keine fiktiven Testresultate.

### Whyte – sechs substantielle Nachprüfungen

| Tatsächlicher Code und Whyte-Fundstelle | Kritischer Einwand | Entscheidung, Korrektur, Commit | Reale Prüf-Evidenz |
| --- | --- | --- | --- |
| competition.ts: types; COMPETITION → Types of Competition | Sind vier Alternativarten korrekt, Budget und Ressourcen statt nur Vendor-Vergleich? | **Beibehalten:** rival, build, projects und inertia werden getrennt gezeigt; konkurrierende Prioritäten ausdrücklich erfasst. | Vitest vier IDs; Playwright vier sichtbare Arten, Desktop-/Mobile-Knowledgebild. |
| competition.ts: types.inertia, deepDives; COMPETITION → Inertia; Signs your Deal is Heading for Inertia | Werden schwache Metrics, fehlender EB-Zugang oder No Decision als sichere Loss-Prognose ausgegeben? | **Beibehalten:** Warnsignale nur als Validierungsauftrag; No Decision und praktischer Status quo begrifflich unterschieden. | Vitest Inertia-Grenze; Playwright Details und Red Flags. |
| competition.ts: types.build und Checklist build; COMPETITION → Building Internally | Werden politische Interessen, IP, Kontrolle und interner Sponsor von einem simplen Technik-/Kostenvergleich verdrängt? | **Beibehalten:** Build politisch und technisch qualifizieren; kein generelles „Buy ist billiger“. | Vitest keine pauschale Build-Wirtschaftlichkeit; E2E gerenderter Checklist-Punkt. |
| competition.ts: perspectives und deepDives; COMPETITION → Competitive Strategy; The Competitive Strategy Plan | In der ersten Version waren Political/Technical/Commercial korrekt, der interne Strategy Plan aber zu schwach dargestellt. | **Tatsächlich ergänzt:** neuer aufklappbarer Abschnitt zu Strengths, Weaknesses, Political, Technical, Commercial, Traps, Counter-Traps, Proof-Points und Education. Commit **1f562fbe4dbc76931c5511fc575e213b7443905d**. Kein vorgezogenes T9-Microtool. | Finale Knowledge-Screenshots und CI #37847325580, sieben Knowledge-Details als DOM bedienbar. |
| competition.ts: Deep Dive zu Trap-Fragen; COMPETITION → Do Not Knock; DON’T KNOCK THE COMPETITION → Trap-Setting Questions | Würde die Toolbox Whytes offensives Trap Setting unterschlagen oder ungeprüft zum Angriff auf Konkurrenten machen? | **Beibehalten mit offengelegter Grenze:** Whytes Taktik ausdrücklich erwähnt; Forderung nach offenen, überprüfbaren Fragen und ohne FUD ist unsere ethische Praxisableitung, nicht eine fingierte Autorenregel. | Vitest Attribution, geschlossener Quellenbereich und aufklappbare Details im E2E. |
| CompetitionKnowledgeView.vue: Querverweise; COMPETITION → Competition and your Sales Process | Sind zusätzliche Links auf kleinen Displays wirklich zugänglich? | **Korrigiert nach echtem Fehler:** Ein horizontaler Overflow bis x=401 bei 375 px lag am Inline-Link „Paper Process“; diagnostiziert im Browser, Links in eigene Zeilen umgebaut. Commit **0b1dd618a11eb49cad279cc27685f1df781c2222**. | Final 71 erfolgreiche Playwright-Tests, alle 375/768/1024/1440-Viewport-Prüfungen; finaler Mobile-Screenshot ohne Clipping. |

### Lahoutifard – sechs substantielle Nachprüfungen

| Tatsächlicher Code und Lahoutifard-Fundstelle | Kritischer Einwand | Entscheidung, tatsächlicher Stand | Reale Prüf-Evidenz |
| --- | --- | --- | --- |
| competition.ts: sourceNotes; Chapter Two → Where do we cover the Competition? | Wird ihm ein eigenständiges Competition-Kapitel oder Whytes vierteilige Liste fälschlich zugeschrieben? | **Beibehalten:** explizit kein separates Competition-Kapitel, sondern Einbettung in Metrics, Decision Criteria und Champion. | Vitest Autorenattribution, Quellenbereiche am Seitenende. |
| competition.ts: zones; Chapter Five → The Value Triangle; Analysis of The Decision Criteria Triangle | Sind alle sieben Zonen mit unverwechselbaren Definitionen vorhanden? | **Beibehalten:** PARITY, MARKET TRENDS, USELESS, UNIQUE DIFFERENTIATORS, VALUE, DANGER und CUSTOM NEEDS, jeweils eigene ID. Kein T6-Tool. | Vitest exakte sieben IDs; Playwright aufklappbare Zone VALUE, Knowledge-Screenshot. |
| competition.ts: zones.value und unique-differentiators; Chapter Five → Most important zones | Wird eine vom Kunden nicht verlangte Besonderheit fälschlich als VALUE verkauft? | **Beibehalten:** VALUE erst bei gefordertem Käuferkriterium mit relativ validiertem Erfüllungsunterschied; UNIQUE bleibt ohne Käuferbedarf ein anderer Fall. | Vitest VALUE/UNIQUE, Browser-Karten und Checklist value. |
| competition.ts: zones.danger und parity; Chapter Five → Most important zones; How to Act on Each Zone? | Wird eine Vermutung über eine andere Lösung bereits als DANGER oder PARITY als Value bezeichnet? | **Beibehalten:** DANGER benötigt bestätigtes Kriterium und relativen Lösungsnachweis, PARITY belegt keine Differenzierung; unbekannte Fähigkeiten bleiben unbekannt. | Vitest DANGER/PARITY, E2E der Details und Evidenzstufen. |
| competition.ts: differentiation, Checklist kriterien und impact; Chapter Three → Metrics; Chapter Five → Decision Criteria | Beschränkt sich die Positionierung auf Features statt auf Käuferkriterien und wirtschaftlich geprüfte Metrics? | **Beibehalten:** Pain → Kriterium → Proof-Points → valide Metrics → kundenspezifische Value Story, ohne unbelegte ROI- oder Preisdaten. | Vitest unerlaubte Markt-Claims; E2E Querverweise Metrics, Pain und Decision Criteria. |
| competition.ts: perspectives.Political, Deep Dive Champion; Chapter Two → Competition; Chapter Eight → Champion | Wird der gegnerische Champion ignoriert oder die interne Fürsprache ungeprüft aus Verkäuferoptimismus abgeleitet? | **Beibehalten:** tatsächliche Wirkung und Stakeholder-Interessen prüfen; Kundenbericht, bestätigter Vorgang, Hypothese und Unbekannt getrennt; keine illegitime Internabeschaffung. | Vitest vier Evidenzstufen; E2E Champion-Link und CRM-Szenario. |

**Tatsächliche Korrekturen aufgrund der Qualitätsprüfung:** (1) Prettier-konforme Helper-Formatierung in Commit **84a56b5af8d889a411806c82e8d0ac2612920ed3**; (2) ausdrückliche Strategy-Plan-Ergänzung in **1f562fbe4dbc76931c5511fc575e213b7443905d**; (3) 375-px-Overflow nach DOM-Diagnose in **0b1dd618a11eb49cad279cc27685f1df781c2222** beseitigt. Die Diagnostik wurde mit Commit **875f6753f3c2726f47ae24a37acdeb1dc1b1448c** ergänzt. Keine anderen Änderungen fälschlich als aus Runde B verursacht ausgegeben.

### Qualitätsgates – reale GitHub-Actions-Protokolle

| Lauf | Faktisches Ergebnis |
| --- | --- |
| [#37845899632](https://github.com/thomasasen/meddpicc-workbench/actions/runs/37845899632) | Fehlgeschlagener Formatcheck; spätere Gates liefen nicht. Daraufhin Prettier-Fix. |
| [#37845981379](https://github.com/thomasasen/meddpicc-workbench/actions/runs/37845981379) | 69 erfolgreiche Playwright-Tests, 1 bestehender Skip, **2 Fehler** am 375px-Overflow (Dokument 401px). |
| [#37846487539](https://github.com/thomasasen/meddpicc-workbench/actions/runs/37846487539) | Eine anfängliche Verkürzung der CTA löste das Problem **nicht**: erneut 69 erfolgreich, 1 Skip, 2 Overflow-Fehler. |
| [#37846914657](https://github.com/thomasasen/meddpicc-workbench/actions/runs/37846914657) | Diagnostischer Browserlauf zeigte das rechts ausufernde Inline-Element „Paper Process“ bei x=401; danach gezielter UI-Fix. |
| **[Finaler erfolgreicher CI-Lauf #37847325580](https://github.com/thomasasen/meddpicc-workbench/actions/runs/37847325580)** | **npm ci, format:check, lint, test, build, test:e2e, Pages-Sync und pages:check erfolgreich.** 190/190 Vitest-Tests aus 28 Testdateien, 71 erfolgreiche Playwright-Tests, 1 bestehender Skip. Lint: 0 Fehler, 125 Warnungen. Vite Chunk-Size-Hinweis und Node-/Actions-Hinweise ohne Gate-Abbruch. |

**Browser-QA:** Desktop Chromium, Mobile Chromium (Pixel 5), über die Startseite und direkte Hash-Routen; Checkboxen unabhängig und nach Reload zurückgesetzt; Details geöffnet/geschlossen; Quellen geschlossen am Seitenende; Links zu Metrics, Pain, Decision Criteria, Decision Process, Economic Buyer, Champion, Paper Process; Fokus/Tastatur und Page Errors; Overflow für **375, 768, 1024, 1440 px**, inklusive geöffneter Details. Bestätigt ist Chromium, nicht Firefox/WebKit.

### Genau vier echte Fullpage-Screenshots aus dem erfolgreichen Lauf

Alle vier PNG-Dateien wurden tatsächlich über GitHub Actions aus Playwright Chromium erstellt, im Feature-Branch publiziert, aus dem [erfolgreichen CI-Artefakt](https://github.com/thomasasen/meddpicc-workbench/actions/runs/37847325580/artifacts/11580545980) heruntergeladen und als echte Originalbilder geöffnet; die beiden langen Mobile-Ansichten zusätzlich in Abschnitten:

1. [Competition Knowledge Desktop](https://github.com/thomasasen/meddpicc-workbench/blob/feature/competition-knowledge-checklist/docs/review-screenshots/competition-knowledge-desktop-chromium.png) – 1280 × 5049 px
2. [Competition Knowledge Mobile](https://github.com/thomasasen/meddpicc-workbench/blob/feature/competition-knowledge-checklist/docs/review-screenshots/competition-knowledge-mobile-chromium.png) – 1081 × 24126 physische Pixel
3. [Competition Checklist Desktop](https://github.com/thomasasen/meddpicc-workbench/blob/feature/competition-knowledge-checklist/docs/review-screenshots/competition-checklist-desktop-chromium.png) – 1280 × 1957 px
4. [Competition Checklist Mobile](https://github.com/thomasasen/meddpicc-workbench/blob/feature/competition-knowledge-checklist/docs/review-screenshots/competition-checklist-mobile-chromium.png) – 1081 × 7942 physische Pixel

**Echte visuelle Befunde:** Header, Typografie, vier Alternativarten, drei Analyseperspektiven, Value-Triangle-Labels, Knowledge-Karten, Checkbox-Fragen und Schaltflächen sind in den jeweiligen Formaten vollständig und lesbar. Auf Mobile brechen die Titel und Checklist-Texte um; Quellen und Buttons sind weder abgeschnitten noch überlagert. Die Querverweise sind nach dem Overflow-Fix umbrechend. Die Quellen stehen unten und sind geschlossen. Die Knowledge-Seite ist mobil sehr lang (umfangreiche Inhalte), bleibt aber durch standardmäßig geschlossene Detailbereiche nutzbar. **Geöffnete Details selbst wurden funktional per Playwright geprüft; die vier Vollseitenbilder zeigen bewusst die geschlossene Erstansicht.** Keine Screenshots mit Puppen-HTML oder Bildgenerator.

**Commit-/Gültigkeitsgrenze:** Der erfolgreiche Testlauf prüfte den letzten UI-/Inhaltscommit **0b1dd618a11eb49cad279cc27685f1df781c2222**. Das CI-System hat später den Build/Pages-Root synchronisiert und vier Original-Screenshots in den Feature-Branch committed. Nachfolgende Änderungen ausschließlich an Markdown-Dokumentation verändern kein getestetes Programmverhalten. Der finale GitHub-HEAD wird separat vor Abschluss kontrolliert.

### Offene Grenzen und konkrete visuelle Abnahme

Ohne verifizierte kundenseitige Käuferkriterien und Lösungsvergleiche ist eine konkrete Value-Triangle-Zuordnung nicht zulässig; die Knowledge-Seite vergibt sie deshalb nicht. Keine Wettbewerberdatenbank, Berechnungen, Score oder Deal-State. Auch die vorhandenen 125 Lint-Warnungen und die Länge der mobilen Knowledge-Seite sind offen benannt.

Vor einem späteren Merge bitte ausdrücklich prüfen und freigeben: **(1)** Hierarchie/Lesbarkeit Desktop und Mobile, einschließlich Mobile-Länge, **(2)** vier Alternativarten getrennt von Political/Technical/Commercial, **(3)** VALUE/UNIQUE/DANGER sowie klare Evidenzgrenzen, **(4)** zehn unabhängige flüchtige Checkboxen mit erklärenden Details, **(5)** eingeklappter Quellenbereich am Seitenende. **Keine Merge-Freigabe liegt vor.**
