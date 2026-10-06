# Qualification Gates v0.1 – Regelkatalog

## Zweck

Qualification Gates prüfen vor ressourcenintensiven oder forecast-relevanten Verkäuferentscheidungen, ob die vorhandene Qualifizierung den nächsten Schritt fachlich trägt.

v0.1 beantwortet für drei konkrete Seller-Entscheidungen:

- **POC / Pilot:** Ist die Opportunity ausreichend qualifiziert, um technische bzw. Presales-Ressourcen zu binden?
- **Proposal / Pricing:** Ist genug Value- und Entscheidungsgrundlage vorhanden, um Preis und Proposal sinnvoll zu platzieren?
- **Commit Forecast:** Ist der Deal ausreichend evidenzbasiert, um den geplanten Abschluss als Commit zu vertreten?

Die Gates sind **Coaching-Empfehlungen und keine technische Sperre**. Sie verändern keine Projektfelder, Risiken oder Aktionen.

## Quellenreview

Fachlich geprüft wurden insbesondere:

- Andy Whyte – *MEDDICC: The ultimate guide to staying one step ahead in the complex sale*
  - POC/Pilot/Test als praktische Validierung mit vorab geklärten Erfolgskriterien
  - Klarheit darüber, was getestet wird, wie Erfolg gemessen wird und welcher nächste Schritt bei Erfolg folgt
  - Metrics als quantifizierbare Basis statt subjektiver Interpretation
  - Decision Criteria und Decision Process als Grundlage dafür, technische Validierung mit dem realen Kaufprozess zu verbinden
  - Economic Buyer als tatsächliche wirtschaftliche Entscheidungsautorität
  - Champion als beobachtbares internes Verhalten, nicht als freundlicher Kontakt
  - Übergang vom Decision Process zum Paper Process vor dem Abschluss
- Darius Lahoutifard – *Always Be Qualifying – MEDDIC & MEDDPICC Sales*
  - kontinuierliche Qualification statt einmaliger Checkliste
  - Vermeidung unnötiger Aktivitäten und Ressourceneinsatz ohne ausreichende Pain-/Value-/Buyer-Qualifizierung
  - Metrics zur Eingrenzung von POC und ROI
  - POC-/Validierungsschritte als Teil des Decision Process
  - Economic Buyer, Pain, Metrics und Prozesskenntnis als Grundlage verlässlicherer Forecasts
  - Procurement-/Legal-Schritte als potenzielle Ursache für Close-Slippage

Die Bücher liefern **keine universelle mathematische Gate-Formel**, keine allgemeingültige Required/Recommended-Matrix und keine festen Prozent- oder Zeitgrenzen. Die konkrete v0.1-Zerlegung ist daher transparent als Workbench-Produktlogik dokumentiert.

## Red-Team-Ergebnis

1. Ein Gate darf keine Win Probability und keinen versteckten Deal Score erzeugen.
2. Ein Gate ist ein Pause Point bzw. Coaching-Hinweis, kein technisches Verbot.
3. Statusfelder allein reichen nicht. Wo eine Voraussetzung Evidence benötigt, zählen Assumption, Unknown und Unconfirmed nicht als belastbarer Nachweis.
4. Der Deal Inspector darf nicht blind als vollständige Gate-Matrix verwendet werden. Beispiel: Bei einem fachlich leeren Deal unterdrückt der Inspector bewusst ein Metrics-Finding, solange noch kein Pain oder keine Metric existiert. Proposal-/Commit-Gates müssen fehlende Metrics trotzdem direkt erkennen.
5. POC/Pilot braucht methodisch test-spezifische Success Criteria und Klarheit über den Schritt nach Erfolg. Schema 0.2.0 modelliert noch keine vollständige POC-Charter. v0.1 behauptet deshalb bewusst nur eine Prüfung der **vorgelagerten Qualifizierungsbasis**.
6. Generic Decision Criteria werden nicht als identisch mit POC-Success-Criteria ausgegeben.
7. Proposal/Pricing darf nicht künstlich auf einen vollständig qualifizierten Economic Buyer oder vollständigen Decision Process warten. Diese Punkte sind in v0.1 Warnungen, solange Pain, Value-Basis und Decision Criteria belastbar genug sind.
8. Commit Forecast erhält die strengste Required-Matrix: Value, Economic Buyer sowie Decision-/Paper-Process müssen den geplanten Abschluss tragen.
9. Champion und Competition sind für Commit wichtige Risikoindikatoren, aber in v0.1 keine universellen technischen Hard Stops.
10. Es wird keine Schemaänderung vorgenommen. Ein dediziertes POC-Datenmodell wird erst eingeführt, wenn der spätere POC-/Workflow-Slice einen belegten Bedarf erzeugt.

## Statusmodell

| Status | Bedeutung |
|---|---|
| `not-ready` / Nicht bereit | Mindestens eine als **notwendig** definierte v0.1-Voraussetzung fehlt. Die Workbench empfiehlt eine Pause vor dem betrachteten Schritt. |
| `conditional` / Bedingt | Alle notwendigen Voraussetzungen sind erfüllt, aber mindestens eine **empfohlene** Qualifizierung bleibt offen. Fortfahren ist möglich, das Risiko soll bewusst bleiben. |
| `ready` / Bereit | Alle im v0.1-Prüfumfang definierten notwendigen und empfohlenen Voraussetzungen sind erfüllt. Dies ist keine Erfolgs- oder Abschlusswahrscheinlichkeit. |

Die Einteilung in notwendig bzw. empfohlen ist **Workbench product inference**. Sie operationalisiert die methodischen Prinzipien für konkrete Seller-Workflows.

## Evidence-Regel

Eine referenzierte Evidence zählt als belastbarer Nachweis nur, wenn:

- `classification` weder `assumption` noch `unknown` ist und
- `verification` nicht `unconfirmed` ist.

Ein gesetztes Statusfeld oder `customerConfirmed: true` ohne belastbare verknüpfte Evidence reicht für die Gate-Voraussetzung nicht aus.

## Gate 1 – POC / Pilot

### Notwendig

| Requirement-ID | Voraussetzung | Begründung |
|---|---|---|
| `poc.pain` | Konkreter kundenseitiger Pain ist identifiziert | Presales-/POC-Ressourcen sollen ein relevantes Kundenproblem validieren, nicht generisches Produktinteresse bedienen. |
| `poc.decision-criteria` | Priorisierte Decision Criteria sind kundenseitig belastbar | Der Test braucht eine vorhandene, evidenzbasierte Bewertungsebene. v0.1 setzt diese **nicht** mit test-spezifischen Success Criteria gleich. |
| `poc.decision-process` | Decision Process und der Schritt nach erfolgreicher Validierung sind belastbar | Ein erfolgreicher Test muss in einen realen nächsten Kundenschritt münden können. |

### Empfohlen

| Requirement-ID | Voraussetzung | Begründung |
|---|---|---|
| `poc.pain-implication` | Business Impact und Konsequenz des Nicht-Handelns sind verstanden | Erhöht Relevanz und schützt vor einem isolierten Techniktest. |
| `poc.metrics` | Mindestens eine relevante Metric ist kundenseitig bestätigt | Hilft, erwarteten Nutzen messbarer zu machen. |
| `poc.economic-buyer` | Economic Buyer und wirtschaftliche Priorität sind ausreichend validiert | Reduziert das Risiko, technische Ressourcen ohne wirtschaftliche Sponsorship bzw. Priorität zu binden. |

### Bewusste Grenze

Schema 0.2.0 enthält noch keine test-spezifischen Success Criteria, keine vollständige POC-Charter und keinen expliziten Kundengegenwert nach erfolgreicher Validierung. Deshalb kann `ready` in diesem Gate nur bedeuten:

> Die vorgelagerte Qualifizierungsbasis für einen POC/Pilot ist im v0.1-Prüfumfang vorhanden.

## Gate 2 – Proposal / Pricing

### Notwendig

| Requirement-ID | Voraussetzung | Begründung |
|---|---|---|
| `proposal.pain` | Konkreter kundenseitiger Pain ist identifiziert | Ohne Pain wird Pricing leicht zur isolierten Kostenfrage. |
| `proposal.metrics` | Mindestens eine relevante Metric ist kundenseitig bestätigt und evidenzbasiert | Value soll nicht auf Verkäuferannahmen beruhen. |
| `proposal.decision-criteria` | Priorisierte Decision Criteria sind kundenseitig belastbar | Proposal und Preis müssen an den realen Auswahlkriterien anschließen. |

### Empfohlen

| Requirement-ID | Voraussetzung | Begründung |
|---|---|---|
| `proposal.economic-impact` | Wirtschaftlicher Impact ist nachvollziehbar quantifiziert | Stärkt die Value-/Preisargumentation. |
| `proposal.economic-buyer` | Economic Buyer ist belastbar validiert | Reduziert das Risiko, Preis und Priorität auf der falschen Ebene zu diskutieren. |
| `proposal.decision-process` | Decision Process ist kundenseitig belastbar | Verhindert, dass ein Proposal ohne klaren nächsten Entscheidungsschritt versandet. |

### Bewusste Grenze

Interne Preisfreigaben, Discount Guardrails, Margenregeln oder Angebotsgenehmigungen liegen außerhalb von v0.1.

## Gate 3 – Commit Forecast

### Notwendig

| Requirement-ID | Voraussetzung | Begründung |
|---|---|---|
| `commit.target-close` | Konkretes Target Close ist gesetzt | Ohne Zieltermin lässt sich ein Commit zeitlich nicht sinnvoll gegen den Prozess prüfen. |
| `commit.pain` | Pain ist identifiziert und ausreichend impliziert | Commit braucht Kundendringlichkeit, nicht nur Seller-Aktivität. |
| `commit.metrics-confirmed` | Mindestens eine relevante Metric ist kundenseitig bestätigt und evidenzbasiert | Der Value-Grund muss belastbar sein. |
| `commit.economic-impact` | Wirtschaftlicher Impact ist nachvollziehbar quantifiziert | Die wirtschaftliche Investitionslogik soll den Forecast tragen. |
| `commit.economic-buyer` | Economic Buyer, Authority, Access und Priorität sind validiert | Finale wirtschaftliche Entscheidung und Priorität dürfen im Commit nicht nur vermutet sein. |
| `commit.decision-process` | Decision Process ist close-ready | Unbekannte bzw. blockierte Entscheidungsschritte machen den Abschlusszeitpunkt unzuverlässig. |
| `commit.paper-process` | Paper Process, Owner und Lead Times sind close-ready | Procurement, Legal, PO oder Signatur können den Close trotz positiver fachlicher Entscheidung verschieben. |

### Empfohlen

| Requirement-ID | Voraussetzung | Begründung |
|---|---|---|
| `commit.champion` | Champion ist durch beobachtbares Verhalten belastbar | Reduziert internes Überraschungsrisiko und verbessert den Informationszugang. |
| `commit.competition` | Competition einschließlich Status quo / Do Nothing ist evidenzbasiert qualifiziert | Unbekannte Alternativen oder Budgetkonkurrenz bleiben ein relevantes Forecast-Risiko. |

### Bewusste Grenze

`ready` ist **keine Win Probability** und ersetzt kein Manager Judgment. Das Gate sagt nur aus, dass die definierten v0.1-Qualification-Voraussetzungen aktuell nicht offen sind.

## Next-Best-Action-Verknüpfung

Ein Gate erfindet keine zweite konkurrierende Action Engine.

Wenn eine offene Gate-Voraussetzung auf ein aktuelles Deal-Inspector-Finding zurückgeht, sucht das Gate die bereits abgeleitete Next Best Action:

1. zuerst für fehlende notwendige Voraussetzungen
2. danach für offene empfohlene Voraussetzungen
3. falls keine passende NBA existiert, wird der requirement-spezifische Qualifizierungsschritt verwendet

Damit bleibt die Kette nachvollziehbar:

`Projektstand → Deal Inspector → Qualification Gate → Next Best Action`

## Output-Vertrag

Jedes Gate-Assessment enthält:

- stabile Gate-ID
- Titel
- Status `ready | conditional | not-ready`
- Urteil und Begründung
- alle Requirements mit `required | recommended`
- erfüllten Zustand je Requirement
- gewünschte Evidence
- konkreten nächsten Qualifizierungsschritt
- verknüpfte Inspector-Rule-IDs
- Evidence-/Entity-/Input-Traceability
- optional verknüpfte Next Best Action
- explizite v0.1-Limitierungen

## Bewusste Grenzen von v0.1

- nur POC/Pilot, Proposal/Pricing und Commit Forecast
- keine Demo-, Reference-Call- oder andere Gates
- kein POC-spezifisches Schema
- keine Win Probability
- kein globaler Deal Score
- keine technischen Sperren
- keine persistierten Actions oder Risks
- keine automatische Änderung der Forecast Category
- keine AI-/LLM-Runtime
- keine willkürlichen Tages- oder Prozent-Schwellen
