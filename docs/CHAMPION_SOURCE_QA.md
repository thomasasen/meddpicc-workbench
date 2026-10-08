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

Noch offen bis zur tatsächlichen Prüfung der implementierten Dateien und E2E-Flows. Diese Sektion wird erst nach der Implementierung mit konkreten Beobachtungen und angewandten Korrekturen ersetzt.

## Technische Abnahmematrix

| Gate | Tatsächliches Ergebnis |
| --- | --- |
| Format, Lint, Unit, Build, Playwright Desktop/Mobile, Pages-Root | Ausstehend |
| 375/768/1024/1440, Fokus, Konsole, Overflow, Details | Ausstehend |
| Screenshots Knowledge/Checklist Desktop/Mobile, visuelle Prüfung | Ausstehend |
| GitHub-PR-CI, Pages-Integrität auf main | Ausstehend / getrennt prüfen |
| Merge-Sperre | Feature-Branch; keine Änderung an `main` erlaubt |
