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

## Runde B – Nachprüfung am implementierten Code

Wird nach tatsächlich vorliegenden CI-/Browserergebnissen ergänzt; vorher dürfen keine erfolgreichen Gates oder Bildprüfungen behauptet werden.
