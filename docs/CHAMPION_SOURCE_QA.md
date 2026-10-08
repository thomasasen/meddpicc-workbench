# Champion: Primärquellen, simuliertes Red-Team und Abnahme

> Stand: 08.10.2026. Die Kritikerperspektiven sind **Simulationen auf Basis der Originalbücher**. Es handelt sich weder um Bewertungen durch Andy Whyte bzw. Darius Lahoutifard noch um externe Autorenfreigaben. Die deutschen Gesprächsfragen und die ethischen Prüfgrenzen sind eigene Praxisübertragungen, keine Buchzitate. EPUB-Seitenzahlen werden nicht behauptet.

## Feature-Fit-Gate

Ein Account Manager soll ohne Deal-Datensatz zwischen freundlichem Kontakt, Coach, Kandidat und getesteter interner Fürsprache unterscheiden, wahrscheinliche Selbsttäuschungen erkennen und einen respektvollen nächsten Schritt finden. Inputs: keine verpflichtenden; Checklist-Haken nur im Arbeitsspeicher. Output: Lern- und Gesprächshilfe. Keine Accounts, Opportunities, Kontaktverwaltung, Scores, Persistenz oder automatische Qualifizierung. Champion Tester, Development Helper und Internal Selling Pack verbleiben in T8.

## Quellenmatrix: Aussage → Primärfundstelle → Umsetzung → Grenze

| Aussage | Originalfundstelle | Umsetzung | Nuance / Abgrenzung |
| --- | --- | --- | --- |
| Drei explizite Kriterien: Power & Influence, interner Seller, vested interest | Whyte, `CHAMPION` → `The Criteria of a Champion`; drei Unterabschnitte | Drei getrennte Knowledge-Kriterien, Checklist-Evidenz | Nicht als Lahoutifards identische Liste ausgeben |
| Einfluss ist keine Funktion des Titels | Whyte, `Power and Influence doesn’t necessarily mean seniority` | Einflussprüfung mit vergangenen internen Initiativen | VP-Titel allein ist kein Nachweis |
| Öffentliche, private und Konkurrenz-bezogene interne Fürsprache | Whyte, `The Public Champion Sell`, `The Private Champion Sell`, `The Competitor Champion Sell` | Konkrete Beispiele und vorsichtige Evidenzprüfung | Private Gespräche oft nur über Ergebnisse/Bestätigung erfassbar |
| Coach → Champion ist Entwicklung, kein Etikett | Whyte, `Coach or Champion?`, `Build Your Champion` | Rollenabgrenzung, Entwicklungsaktionen | Ein wertvoller Coach muss nicht Champion werden |
| Wertargumentation und Three Why’s befähigen | Whyte, `Make Your Champion Pitch Perfect`, `The Three Why’s` | Why buy, why us, why now als internes Verständnis | Freie deutsche Fragen, nicht wörtliche Buchzitate |
| Tests aller drei Kriterien, interne Gegenargumente | Whyte, `Testing Champions` und drei Test-Unterabschnitte | Beobachtbare, angemessene Handlungen | Keine Tests durch Loyalitätsfallen |
| Mehrere Champions und Counter Champion | Whyte, `Champion or Champions?`, `Counter Champion` | Stakeholder-Abgleich | Weder Garantie noch stets nötig |
| EB-Zugang als wichtiger Einflussaspekt | Whyte, `Testing your Champions Power and Influence`; `Your Champion and the Economic Buyer` | Nachfrage zu realistischen Zugangswegen | Kein automatischer Fake-Champion bei Verzögerung |
| Respekt und Glaubwürdigkeit | Lahoutifard, `Chapter Eight – Champion` → `Respect & Credibility` | Ergänzende Perspektive und Checklist | Kompetenz/Ansehen statt vermeintlicher Hierarchiemacht |
| EB-Zugang und Beziehung | Lahoutifard, `Access to the Economic Buyer`, `Favorable Relation with You` | Zugang, Vertrauen, Arbeitsbeziehung | Champion und EB können, müssen aber nicht dieselbe Person sein |
| Personal Win / Unterstützung | Lahoutifard, `Personal Win`, `The Champion Needs You to Win` | Motivation nur als bestätigte Hypothese | Karriere/Beförderung niemals unterstellen |
| Coach / Champion und Test | Lahoutifard, `Champions vs. Coaches`, `How to Know if You Have a True Champion?`, `Test the Champion` | Rollen und verbindlicher kleiner nächster Schritt | Informationen und gute Beziehung sind kein alleiniger Beweis |
| Business-/Technical-Champions | Lahoutifard, `Could There Be More Than One Champion?` | Funktionsübergreifende Perspektiven | Nicht als stets erforderliche Anzahl auffassen |
| Finden und Entwickeln vor/während/nach Demos | Lahoutifard, `Building Champions`, `How to Find Champions BEFORE/DURING/AFTER Demos` | Konstruktive Discovery und Befähigung | Verfügbarkeit nach Feierabend keine Definition |

## Autorenunterschiede und bewusste Grenzen

**Whyte** setzt explizit drei notwendige Kriterien und fordert deren fortlaufende Prüfung. Freundlichkeit genügt ihm nicht, um internen Einfluss zu belegen (`Friendly, not necessarily Friends`). **Lahoutifard** beschreibt differenzierter Respekt, Glaubwürdigkeit, Beziehung, Zugang zum Economic Buyer und Personal Win. Seine Formulierung zur persönlichen Nähe ist deutlich stärker. Gemeinsam ist beiden die Unterscheidung Coach/Champion, die interne Advocacy in Abwesenheit, die Ausrichtung auf den Kundennutzen und das Testen tatsächlichen Handelns. Weder drei Whyte-Kriterien noch einzelne Lahoutifard-Merkmale sind ein numerischer Deal-Score.

**Methodische und ethische Praxisableitung (nicht wörtliche Autorenregel):** Kein Zugang zu Geheimnissen, vertraulichen Angeboten oder Datenschutzverstößen; keine Erreichbarkeit in der Freizeit erwarten. Eine Verweigerung eines EB-Termins kann legitime organisatorische Gründe haben. Behauptete interne Aktivitäten sind Kundenangaben, durch beobachtbare Ergebnisse (z. B. weitere Termine, ernsthafte Einwände, abgestimmte Value Story) zu triangulieren. Eine persönliche Karrierehypothese ist keine bestätigte Motivation. Ein fachliches Ja ersetzt niemals Procurement, Legal oder Zeichnungsbefugnis.

## Simuliertes Red-Team VOR Implementierung (06+06 substanzielle Angriffe)

| Perspektive und Ausgangsthese | Belegte Kritik / Fundstelle | Änderung der Modellierung | Prüfmethode |
| --- | --- | --- | --- |
| W1: „VP reicht für Einfluss“ | Whyte, `Power and Influence doesn’t necessarily mean seniority` | Kriterium verlangt konkrete Wirkung und andere Stakeholder | Content-Test Titel ≠ Einfluss |
| W2: „Tägliche Antworten beweisen Champion“ | Whyte, `Coach or Champion?`; `Testing Champions` | Rolle Coach explizit positiv, kein Aktivitätsscore | E2E/Content-Assertions |
| W3: „Internes Verkaufen ist schon belegt, weil er es sagt“ | Whyte, `The Private Champion Sell` | Aussage vs. beobachtbares Ergebnis unterscheiden | Beispiel und Tests |
| W4: „EB-Namen genannt: Power bewiesen“ | Whyte, `Testing your Champions Power and Influence` | Name ≠ Zugang/Überzeugungsarbeit | Checklist „Zugang“ |
| W5: „Interessen ergeben sich automatisch aus Beförderung“ | Whyte, `A Champions have a vested interest` | Personal Win als offene, freiwillige Frage | Red-Flag-Test |
| W6: „Nach Auswahl sind Legal und Procurement irrelevant“ | Whyte, `Champion and Legal`, `Champion and Procurement` | Helferrolle ohne Freigabevollmacht | Prozessgrenzen |
| L1: „Guter Kontakt ist gleich Champion“ | Lahoutifard, `Champions vs. Coaches` | Mehrstufige Rollenbeschreibung | Rollen-Test |
| L2: „EB-Introduktion ist nicht wichtig“ | Lahoutifard, `Access to the Economic Buyer` | Zugang explizit relevant; Hürden anerkennen | Test EB-Zugang |
| L3: „Sympathischer IT-Advocate genügt allein“ | Lahoutifard, `Respect & Credibility`, `Could There Be More Than One Champion?` | Sicht auf technische, fachliche, wirtschaftliche Gruppen | Stakeholder-Test |
| L4: „Personal Win ist nur der Bonus des Sellers“ | Lahoutifard, `Personal Win` | Legitime Eigenmotivation vom Kunden erkunden | Question/Test |
| L5: „Demo-Engagement ersetzt echte Advocacy“ | Lahoutifard, `How to Find Champions DURING Demos`, `Test the Champion` | Demo-Signale als Kandidatenhinweis | Red Flags |
| L6: „Einmal als Champion klassifiziert, immer Champion“ | Lahoutifard, `How to Know if You Have a True Champion?` | Fortlaufendes Beobachten und kleine Schritte | Checklist-Fragen |

**Gemeinsame Vorab-Risiken:** 1) Etiketten statt Evidenz → Zwischenstufe „Kandidat“. 2) Inszenierte Loyalitätsprüfungen → freiwillige, rollengerechte Aufgaben. 3) Hinterzimmerwissen → nur verantwortbare Gesprächsinhalte. 4) Endlose Lehrbuchseite → kompakte Erstansicht mit einklappbaren Details. 5) Quellenüberladung → nur am Ende geschlossen. 6) Deal-Scoring → ausdrücklich ausgeschlossen.

## Simuliertes Red-Team NACH Implementierung

Erneuter eigenständiger Angriff auf die tatsächlich angelegten `src/content/meddpicc/champion.ts`, `ChampionKnowledgeView.vue`, `ChecklistView.vue` und die neuen Vitest-/Playwright-Spezifikationen. Erneut **simulierte Fachperspektiven**, keine Aussage der echten Autoren. Prüflage vor der CI: Code-/Content-Inspektion; automatisierte Tests separat unten.

| Perspektive / Angriff auf die Implementierung | Originalbezug | Konkreter Befund und Änderung bzw. Abgrenzung | Prüfmethode |
| --- | --- | --- | --- |
| W1: Im konstruierten Fall wird die Bereichsleiterin bereits nach bloßer Organisation eines Termins zum „erprobten Champion“ | Whyte, `The Private Champion Sell`, `Testing Champions` | **Berechtigter Fehler, im Code korrigiert:** Situation beschreibt nun ausdrücklich nur die **Kundenaussage** über ihre interne Value-Diskussion und separat die **beobachtbare Reaktion** von Finance. Weder Budgetzusage noch vollständige Wirksamkeit wird daraus behauptet. | `champion.test.ts` (Szenario), Sichtprüfung in Knowledge |
| W2: Drei Kriterien könnten unter der generischen Überschrift unkenntlich werden | Whyte, `The Criteria of a Champion` | `whyteCriteria` bindet exakt die drei typisierten Checklist-Items `einfluss/intern/motivation`; Autorenherkunft nur unten im Quellendetail. Kein zusätzlicher Score. Keine weitere Änderung nötig. | Content-Test Kriterien-IDs und Quellen |
| W3: „Einfluss“ könnte durch den VP-Titel ersetzt werden | Whyte, `Power and Influence doesn’t necessarily mean seniority` | Die konkrete Warnung „Sie ist VP“ steht in `einfluss`; vergangene Wirkung und relevante Gruppen sind Gegencheck. | Content-Test Einfluss |
| W4: Das Three-Why-Training könnte einen beliebigen Pitch statt des validierten Kundennutzens fördern | Whyte, `The Three Why’s`, `Educate your Champion on MEDDICC` | `enablement` verbindet Pain und **kundenseitig validierte Metrics**, die Checklist verweist auf echte Einwände. Keine vorfabrizierte Verkaufsmappe. | Content-/View-Inspektion |
| W5: Späte Fachzustimmung könnte fälschlich Vertragssicherheit bedeuten | Whyte, `Champion and Procurement`, `Champion and Legal` | `buyerAndCommittee` und Punkt `grenzen` trennen fachliches Ja und Zeichnung; echter Paper-Process-Link. | Unit und Browser-Link |
| W6: Internes Handeln darf nicht mit unbeobachteten privaten Gesprächen „belegt“ werden | Whyte, `The Private Champion Sell` | **Korrektur:** Signaltext nun explizit „Interne Einwände werden vom Kunden konkret beschrieben“; Code und Beispiel trennen berichtete Ereignisse von unabhängigem Verhalten. | Checklist-Signal und Szenario |
| L1: Mehrere Champions werden möglicherweise zur Pflicht | Lahoutifard, `Could There Be More Than One Champion?` | `buyerAndCommittee` sagt ausdrücklich „möglich, nicht pauschal vorgeschrieben“; technische/fachliche/wirtschaftliche Gruppen differenziert. | Unit-Test |
| L2: EB-Nennung ersetzt EB-Zugang oder EB-Verweigerung wird als Lüge behandelt | Lahoutifard, `Access to the Economic Buyer`, `Test the Champion` | `zugang` prüft realistische Wege und nennt Hürden; Red Flag „Fake-Champion“ korrigiert die vorschnelle Bewertung. | Unit-Test und Knowledge-Fold |
| L3: Personal Win wird als vom Seller vermutete Beförderung präsentiert | Lahoutifard, `Personal Win` | `motivation` verlangt selbst beschriebene Ziele; Beförderung ist explizite Fehlinterpretation, kein Beweis. | Unit-Test |
| L4: Ein guter Coach wird entwertet | Lahoutifard, `Champions vs. Coaches` | Vier Rollen sind getrennt. Im frei konstruierten Beispiel bleibt ein Projektleiter bewusst als hilfreicher Coach ohne Abwertung. | Rollen-Test und E2E |
| L5: Demo-Begeisterung wird in Handlungsbeweis umetikettiert | Lahoutifard, `How to Find Champions DURING Demos`, `Test the Champion` | Prüffrage `wert` trennt Demo-Interesse von belastbarer interner Value Story; `test` fordert faire konkrete Aktion. | Unit-/Checklist-Inspektion |
| L6: Eine persönliche Beziehung wird gegenüber Lahoutifard unterschlagen | Lahoutifard, `Favorable Relation with You` | Positive Arbeitsbeziehung steht explizit unter ergänzender Perspektive; Quellen-Appendix weist auf Lahoutifards stärkeren Freundschaftsfokus vs. Whyte hin. | Source-Appendix-E2E |

### Änderungsevidenz aus dem zweiten Durchgang

1. **Inhaltliche Korrektur** der vierten Szenario-Stufe: bloßer Meeting-Termin war zu wenig für Advocacy. Jetzt sind gemeldete interne Gespräche und unabhängig sichtbare Finance-Folgen getrennt; Budgetzusage verneint. Datei: `src/content/meddpicc/champion.ts`.
2. **Inhaltliche Korrektur** eines zu großzügigen Signals für interne Fürsprache. Datei: gleicher Content, Element `intern`.
3. **Regressionstest angepasst** auf die präzisierte Evidenzaussage im Szenario; darüber hinaus Tests für VP-Titel, EB-Zugang, Motivation, Coaches, vertrauliche Unterlagen, Mehrfach-Champions und Paper Process.
4. **Nicht als Autorenregel präsentiert:** Vermeidung von Geheimnissen, Regelbrüchen und Freizeit-Loyalitätstests ist eigene verantwortliche Umsetzung. Die Bücher enthalten teils andere operative Beispiele; diese sind nicht ungeprüft als „Muss“ übernommen worden.
5. **Offene Grenze:** Die UI kann keine außerhalb des Anbieters stattfindenden internen Gespräche verifizieren. Sie schult zur Trennung von Beobachtung, Bericht und Annahme. Keine Deal- oder Nutzerqualifikation wird gespeichert.



## Technische Abnahmematrix

| Gate | Tatsächliches Ergebnis |
| --- | --- |
| Format, Lint, Unit, Build, Playwright Desktop/Mobile, Pages-Root | Ausstehend |
| 375/768/1024/1440, Fokus, Konsole, Overflow, Details | Ausstehend |
| Screenshots Knowledge/Checklist Desktop/Mobile, visuelle Prüfung | Ausstehend |
| GitHub-PR-CI, Pages-Integrität auf main | Ausstehend / getrennt prüfen |
| Merge-Sperre | Feature-Branch; keine Änderung an `main` erlaubt |
