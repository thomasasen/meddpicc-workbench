# Champion Tester v0.1 – Regeln und fachliche Herleitung

## Zweck

Der Champion Tester beantwortet eine enge Qualification-Frage:

> Haben wir einen belastbaren Champion oder lediglich einen hilfreichen Kontakt bzw. Champion-Candidate?

Er ist kein Kontakt-Scoring und keine zweite CRM-Ansicht. Er erzeugt ausschließlich deterministischen Derived State aus dem aktuellen MEDDPICC-Projekt. Das Source Project wird nicht mutiert.

Der Tester soll insbesondere sichtbar machen:

- welche Champion-Signale belastbar belegt sind,
- welche Angaben nur strukturiert vorhanden oder unzureichend belegt sind,
- welche zentralen Signale fehlen,
- welcher konkrete Champion-Test als Nächstes sinnvoll ist,
- welche Evidence das Bestehen dieses Tests belegen würde.

Es gibt weder eine Win Probability noch einen globalen Champion Score.

## Quellenreview

Primärquellen:

1. Andy Whyte – MEDDICC: The ultimate guide to staying one step ahead in the complex sale
2. Darius Lahoutifard – Always Be Qualifying: MEDDIC & MEDDPICC Sales

### Andy Whyte – Abschnitt Champion / Coach or Champion? / Testing Champions

Whyte trennt einen Coach ausdrücklich von einem qualifizierten Champion. Ein freundlicher Kontakt, der nützliche Informationen gibt, ist zunächst ein Coach bzw. potenzieller Champion. Für einen echten Champion nennt Whyte drei Kerneigenschaften:

- Power and Influence,
- aktives Internal Selling,
- einen eigenen Vested Interest am Erfolg.

Alle drei müssen getestet werden. Seniorität allein beweist keinen Einfluss. Besonders aussagekräftig ist Verhalten außerhalb der Anwesenheit des Sellers: Verteidigt und verkauft die Person den Value intern, bringt sie Fragen und Einwände zurück und lässt sie sich für den internen Verkauf coachen?

Whyte verbindet Power and Influence außerdem ausdrücklich mit der Fähigkeit, Zugang zum Economic Buyer zu ermöglichen. In der laufenden Qualification sollen Champions weiterhin getestet werden; ein einmal vergebenes Label ist kein Endzustand.

### Darius Lahoutifard – Chapter Eight: Champion

Lahoutifard beschreibt den Champion als interne Kraft, die Kundenhandeln zugunsten der Opportunity vorantreibt und die Lösung auch verkauft, wenn der Seller nicht anwesend ist.

Seine Schwerpunkte sind insbesondere:

- Access to the Economic Buyer,
- Respect, Credibility und Influence,
- Personal Win,
- aktives internes Sponsoring bzw. internes Verkaufen,
- hilfreiche interne Informationen und frühe Warnsignale,
- fortlaufendes Testen des Champions,
- mehrere Champions in größeren Accounts.

Lahoutifard beschreibt eine enge positive Beziehung als wichtig. Gleichzeitig warnt er ausdrücklich davor, Informer, Coach oder freundlichen Kontakt mit einem Champion zu verwechseln. Für die Workbench ist die Beziehung deshalb kein Beweis; entscheidend bleibt beobachtbares internes Handeln.

### Gemeinsamer belastbarer Kern

Beide Quellen stützen folgende Prinzipien:

- Champion ist eine Verhaltens- und Einflussrolle, kein Seller-Label.
- Power bzw. Influence ist relevant und nicht mit Seniorität gleichzusetzen.
- Personal Win bzw. eigener Nutzen ist wesentlich.
- Der Champion verkauft intern für die Opportunity.
- Interne Informationen, Warnsignale und schlechte Nachrichten sind wichtige Tests.
- Relevanter interner Zugang und insbesondere Economic-Buyer-Zugang sind starke Signale.
- Champions müssen aktiv getestet und fortlaufend qualifiziert werden.
- Mehrere Champions sind möglich.

Die Quellen liefern keine mathematische Champion-Formel. Die Workbench führt daher bewusst kein sichtbares Punktesystem und keinen Schwellenwert wie „5 von 7“ ein.

## Workbench Product Inference

Die folgenden Regeln sind unsere Operationalisierung der Quellen im vorhandenen Datenmodell. Sie sind keine behauptete offizielle MEDDPICC-Formel.

### Abgeleiteter Status

| Status im UI | Bedeutung |
| --- | --- |
| Kandidat | Es existieren strukturierte Angaben, aber noch kein belastbares beobachtbares Champion-Verhalten. |
| Teilweise bewiesen | Mindestens ein Champion-Verhalten ist durch belastbare Evidence gestützt, zentrale Kriterien sind aber noch offen. |
| Belastbar | Ausreichender strukturierter Einfluss sowie die erforderlichen evidenzgestützten Kernsignale sind vorhanden. |
| Disqualifiziert | Der kanonische Status ist disqualified. Derived State darf ihn nicht wieder hochstufen. |

Der kanonische Personenstatus candidate oder confirmed wird nicht als Beweis verwendet.

## Signale

### Einfluss / Power

Datenbasis: Champion-Feld influence.

medium oder high wird für v0.1 als ausreichender strukturierter Input behandelt. Das aktuelle Schema verknüpft dieses Feld aber nicht mit eigener Evidence. Im UI und im Assessment bleibt deshalb sichtbar:

„Strukturiert, nicht evidenzverankert“.

unknown ist eine offene Lücke. low ist unzureichend.

### Personal Win

Datenbasis:

- personalWin als Text,
- Behavior confirmed_personal_win,
- dessen verknüpfte Evidence.

Ein bloßer Text ist nur strukturierter Input. Für den Status „Belastbar“ muss der Personal Win zusätzlich über confirmed_personal_win mit belastbarer Evidence gestützt sein.

### Inside Information / Bad News

Datenbasis:

- provided_internal_information,
- shared_bad_news.

Mindestens ein passendes Behavior mit belastbarer Evidence beweist dieses Signal.

### Internal Selling

Datenbasis:

- sold_internally.

Dieses Signal ist ein Kernunterscheidungsmerkmal zwischen hilfreichem Kontakt und Champion. Informationen weitergeben oder Meetings organisieren ersetzt Internal Selling nicht.

### Access Creation

Datenbasis:

- created_access.

Das Signal ist unterstützend und ein guter Zwischentest. Es ist in v0.1 nicht zusätzlich erforderlich, wenn der stärkere Economic-Buyer-Zugang bereits belastbar belegt ist.

### Economic-Buyer-Zugang

Datenbasis:

- enabled_economic_buyer_access.

Für den abgeleiteten Status „Belastbar“ wird dieses Signal in v0.1 als Kernsignal verlangt. Das ist eine bewusste strenge Workbench Product Inference aus der starken Bedeutung, die beide Quellen dem Champion als Zugangspfad zum Economic Buyer geben.

## Wann gilt ein Champion in v0.1 als belastbar?

Kein Punktescore entscheidet darüber.

Die Person darf nicht disqualified sein. Zusätzlich müssen folgende Bedingungen erfüllt sein:

- influence ist medium oder high,
- Personal Win ist evidenzgestützt bestätigt,
- Inside Information / Bad News ist evidenzgestützt,
- Internal Selling ist evidenzgestützt,
- Economic-Buyer-Zugang ist evidenzgestützt.

Access Creation bleibt ein zusätzliches Signal, wenn Economic-Buyer-Zugang noch nicht vorliegt.

Diese Kombination ist eine Workbench Product Inference, keine offizielle MEDDPICC-Formel.

## Evidence-Regeln

Eine Evidence unterstützt ein Champion-Signal nur, wenn sie existiert und gleichzeitig:

- classification nicht assumption ist,
- classification nicht unknown ist,
- verification nicht unconfirmed ist.

Ein Behavior ohne passende belastbare Evidence ist nicht „bewiesen“.

Der Tester unterscheidet vier Signalzustände:

| Zustand | Bedeutung |
| --- | --- |
| Bewiesen | Passendes Behavior besitzt belastbare verknüpfte Evidence. |
| Strukturiert, nicht evidenzverankert | Das Datenmodell enthält eine relevante Angabe, aber keine direkte belastbare Evidence-Verankerung. |
| Nicht ausreichend belegt | Behavior bzw. Angabe ist vorhanden, die verknüpfte Evidence besteht die Härtungsregel aber nicht. |
| Fehlt | Das relevante Signal ist nicht dokumentiert. |

Damit bleiben Assumption, Unknown und unbestätigte Angaben sichtbar, ohne als Beweis gezählt zu werden.

## Source Traceability

Der Champion Tester braucht in v0.1 keine Behavior-ID.

Ein Signal ist über folgende vorhandene Informationen stabil nachvollziehbar:

- stakeholderId,
- behavior.type,
- behavior.evidenceIds,
- die vorhandenen Evidence Records,
- strukturierte Feldpfade für status, influence und personalWin.

Assessment-IDs sind deterministisch:

champion_assessment_<stakeholderId>

Mehrere Behaviors desselben Typs werden aggregiert. Für die fachliche Frage „Ist dieses Signal durch belastbare Evidence gestützt?“ ist keine individuelle Behavior-Entität erforderlich.

## Candidate-Priorisierung

Mehrere Candidates werden deterministisch bewertet und sortiert. Es wird nicht einfach der erste Array-Eintrag verwendet.

Sortierlogik:

1. abgeleiteter Status: Belastbar vor Teilweise bewiesen vor Kandidat vor Disqualifiziert,
2. Eignung für einen Economic-Buyer-Access-Test,
3. belastbares Internal Selling,
4. Qualität des Personal-Win-Signals,
5. strukturierter Einfluss,
6. Economic-Buyer-Zugang,
7. Inside Information / Bad News,
8. Access Creation,
9. stakeholderId als stabiler Tie-Breaker.

Die technischen Vergleichswerte werden nicht als Champion Score ausgegeben und haben keine fachliche Prozentbedeutung.

Disqualified bleibt immer am Ende und kann nicht als stärkster aktiver Candidate erscheinen.

## Next-Champion-Test-Logik

Der Tester wählt deterministisch den nächsten sinnvollen Test. Er erzeugt keine persistierte Task.

Reihenfolge v0.1:

1. Einfluss unbekannt oder zu niedrig: Einfluss an einer realen internen Hürde testen.
2. Personal Win fehlt vollständig: Personal Win herausarbeiten.
3. Interner Informationszugang fehlt: unbequeme Fragen, Gegenwind und schlechte Nachrichten testen.
4. Internal Selling fehlt: konkrete interne Verkaufsaktion vereinbaren.
5. Personal Win ist nur strukturiert: direkte Bestätigung und Evidence herstellen.
6. Allgemeiner Access fehlt und auch kein EB-Zugang ist belegt: relevanten internen Zugang testen.
7. EB-Zugang fehlt: vorbereitete Economic-Buyer-Introduction als Härtetest.
8. Alle Kernsignale sind belastbar: Champion am nächsten realen Deal-Hindernis weiterqualifizieren.

Jeder Test liefert:

- Titel,
- fachliche Begründung,
- konkrete Aktion,
- gewünschte Evidence bzw. Erfolgskriterium,
- erwartete Behavior-Typen.

## Zusammenspiel mit Next Best Action

Es existiert weiterhin nur eine Recommendation-Engine.

Der Champion Tester liefert den konkreten Champion-Test als Assessment-Ergebnis. Die bestehende Action Family nba.champion.test übernimmt diesen Test, wenn ein Champion-Gap die eigenständige nächste Recommendation auslöst.

Die bestehende Economic-Buyer-Deduplizierung bleibt erhalten:

- Ist die EB-Authority bestätigt, direkter Zugang fehlt und der stärkste Champion ist für einen Access-Test ausreichend belastbar, kann nba.economic-buyer.advance eine direkte Champion-Introduction empfehlen.
- Ist der Champion noch nicht ausreichend belastbar, bleibt die kombinierte EB-/Champion-Empfehlung konservativ.
- Es werden keine parallelen Champion-Tasks erzeugt.

## Zusammenspiel mit Deal Inspector

Die Regel champion.proven nutzt denselben Champion Tester.

Damit gelten für Inspector und Champion Tester identische Regeln für:

- Evidence-Härtung,
- Candidate-Priorisierung,
- disqualified,
- abgeleiteten Champion-Status.

Ein manuell gesetztes confirmed erzeugt kein positives Inspector-Ergebnis.

## Zusammenspiel mit Economic Buyer

Der Champion Tester bestätigt nicht den Economic Buyer selbst. Er beantwortet nur, ob der Champion belastbar genug ist, um intern zu verkaufen und Zugang zu relevanten Entscheidern zu erzeugen.

Economic-Buyer-Identität, Authority, direkte Interaktion und Investitionspriorität bleiben Verantwortung der Economic-Buyer-Qualification bzw. eines späteren Economic Buyer Coach.

## Red-Team-Entscheidungen

### 1. Kein Candidate

Ergebnis: kein stärkster aktiver Champion. Kein künstlicher „gesunder“ Empty State.

### 2. Candidate ohne Personal Win

Nicht belastbar. Personal Win wird explizit als Lücke und Test ausgewiesen.

### 3. Hoher Einfluss, keine belastbaren Behaviors

Nur Kandidat. Das strukturierte Feld influence allein reicht nicht.

### 4. status = confirmed ohne Verhaltensbelege

Nur Kandidat. Das Label wird nicht als Evidence verwendet.

### 5. Behaviors nur mit Assumption-/Unconfirmed-Evidence

Nicht bewiesen. Die vorhandenen Behaviors werden als unzureichend belegt gezeigt.

### 6. Interne Informationen ohne Internal Selling

Teilweise bewiesen. Der nächste Test fokussiert Internal Selling.

### 7. Meeting-/Stakeholder-Zugang ohne EB-Zugang

Access Creation und Economic-Buyer-Zugang bleiben getrennte Signale.

### 8. Personal Win + Influence + Internal Selling, aber weitere Kernsignale fehlen

Teilweise bewiesen. Es gibt keinen automatischen Schwellenwert.

### 9. Starker Champion mit gehärteten Kernsignalen

Belastbar. Danach wird nicht „fertig“ gemeldet, sondern die laufende Qualification unter realem Deal-Druck fortgesetzt.

### 10. disqualified mit starken Daten

Bleibt disqualified.

### 11. Mehrere Candidates

Stabile Sortierung nach expliziten fachlichen Merkmalen und stakeholderId-Tie-Breaker.

### 12. Identischer Projektstand

Identischer Output.

### 13. Source Project

Keine Mutation.

### 14. Demo-Projekt

Markus Stein bleibt „Teilweise bewiesen“:

- influence = high: strukturiert vorhanden, aber nicht separat evidenzverankert,
- Personal Win: als Text vorhanden, nicht über confirmed_personal_win evidenzbestätigt,
- provided_internal_information: bewiesen,
- created_access: bewiesen,
- sold_internally: fehlt,
- enabled_economic_buyer_access: fehlt.

Der nächste Test ist deshalb bewusst „Internal Selling konkret testen“ und nicht vorschnell „Champion belastbar“.

## Schemaentscheidung – Mini-ADR

### Frage

Braucht Champion Tester v0.1 stabile IDs für Champion Behaviors oder eine andere Schemaerweiterung?

### Red-Team-Prüfung

Use Cases des v0.1-Testers:

- Signal je Candidate erkennen,
- Evidence-Härtung anwenden,
- mehrere Candidates deterministisch sortieren,
- Quellenpfade nachvollziehbar ausgeben,
- nächsten Test bestimmen,
- Inspector/NBA konsistent halten.

Diese Use Cases sind mit stakeholderId + behavior.type + evidenceIds lösbar.

Ein Behavior muss für v0.1 weder separat editiert noch als dauerhaft adressierbare Domain-Entität referenziert werden. Mehrere Behaviors desselben Typs können für die Signalfrage deterministisch aggregiert werden.

### Entscheidung

Schema 0.2.0 bleibt unverändert.

Keine Migration, keine neue Behavior-ID und keine Versionserhöhung.

### Konsequenz

Die fehlende direkte Evidence-Verankerung von influence wird nicht durch eine künstliche Schemaänderung kaschiert. Der Tester zeigt diese Unsicherheit offen als strukturierten Input.

Eine spätere Schemaänderung ist erst gerechtfertigt, wenn ein echter Workflow einzelne Champion-Behavior-Records stabil referenzieren, editieren oder historisieren muss.

## Grenzen von v0.1

- influence besitzt keine eigene Evidence-Verknüpfung.
- personalWin als Text ist ohne confirmed_personal_win nicht „bewiesen“.
- Der Tester erzeugt keine Kontakte, Actions oder Risiken.
- Er verändert keine kanonischen Qualification-Felder.
- Er trifft keine Win-Probability-Aussage.
- Er ersetzt keine menschliche Deal Inspection.
- Er beweist nicht, dass ein Economic Buyer korrekt identifiziert wurde.
- Die Statuslogik ist bewusst konservativ und kann mit späteren Datenmodell-Erweiterungen verfeinert werden.
