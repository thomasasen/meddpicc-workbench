# Deal Inspector – Regelkatalog v0.1

## Ziel

Der Deal Inspector ist der erste deterministische Reasoning-Service der MEDDPICC Workbench.

Er beantwortet die Verkäuferfrage:

> Welche Qualification Gaps sind im aktuellen Dealstand belastbar erkennbar – und worauf stützt sich diese Aussage?

Der Service verändert keine Projektdaten. Er liest ausschließlich den aktuellen, validierten `.meddpicc`-Projektstand und erzeugt daraus reproduzierbare Findings.

## Fachliche Grundlage

Die Regeln wurden gegen zwei im Projekt hinterlegte MEDDIC/MEDDPICC-Quellen gespiegelt:

- Andy Whyte: *MEDDICC – The ultimate guide to staying one step ahead in the complex sale*
- Darius Lahoutifard: *Always Be Qualifying – MEDDIC & MEDDPICC Sales*

Die Implementierung übernimmt keine Scoring-Tabellen oder Textpassagen. Verwendet werden die gemeinsamen fachlichen Kernaussagen beider Quellen:

- Pain muss konkret identifiziert und in geschäftliche Konsequenz übersetzt werden.
- Metrics sollen kundenspezifisch, quantifizierbar und mit dem Buying Team belastbar sein; nicht jede operative Metric muss einzeln monetarisiert werden, solange der wirtschaftliche Nutzen insgesamt belastbar quantifiziert ist.
- Der Economic Buyer wird nicht über Titel oder Budgetbesitz definiert, sondern über tatsächliche wirtschaftliche Entscheidungsautorität.
- Direkte Validierung des Economic Buyers ist stärker als eine reine Beschreibung durch Dritte.
- Decision Process und Paper Process müssen als tatsächliche kundenseitige Abläufe verstanden werden; Verkäuferannahmen reichen nicht.
- Ein Champion ist kein sympathischer Kontakt. Einfluss, persönlicher Nutzen und beobachtbares internes Handeln müssen nachweisbar sein.

Zusätzlich gelten die Produktregeln der Workbench:

- Evidence first.
- Annahmen und Unbekannt bleiben sichtbar.
- Eine reine Evidence-ID reicht nicht als Nachweis: `assumption`, `unknown` oder `unconfirmed` Evidence darf ein Finding nicht fälschlich schließen.
- Keine globale Deal-Health- oder Win-Probability-Zahl.
- Jedes Finding nennt Regel, relevante Inputs und fehlende Evidence.
- Manuell gepflegte Risiken bleiben getrennt von abgeleiteten Inspector-Findings.

## Output-Vertrag

Ein Finding enthält mindestens:

- stabile Rule-ID
- MEDDPICC-Bereich
- Severity
- verständlichen Titel
- fachliche Begründung
- fehlende bzw. gewünschte Evidence
- relevante Entity-IDs
- verknüpfte Evidence-IDs
- die auslösenden strukturierten Inputs

Die Findings sind abgeleitet und werden nicht in `project.risks` gespeichert.

## Regeln v0.1

### `pain.identified`

**Frage:** Ist ein konkreter kundenseitiger Pain erfasst?

Trigger:

- kein Pain-Item vorhanden

Severity:

- hoch

Benötigte Evidence:

- konkrete Problemaussage
- geschäftliche Auswirkung
- Priorität bzw. Relevanz aus Kundensicht

### `pain.implication-complete`

**Frage:** Ist der Pain in Business Impact und Konsequenz des Nicht-Handelns übersetzt?

Trigger:

- mindestens ein Pain-Item vorhanden
- bei mindestens einem Item fehlt `businessImpact` oder `consequenceOfInaction`

Severity:

- hoch bei High-/Critical-Pain
- sonst mittel

### `metrics.customer-confirmed`

**Frage:** Gibt es mindestens eine kundenseitig bestätigte Metric?

Trigger:

- Pain oder Metrics sind bereits vorhanden
- keine Metric hat `customerConfirmed = true`

Severity:

- hoch

Bewusste Grenze:

Ein fachlich leeres neues Projekt erhält nicht zusätzlich zu `pain.identified` sofort einen Metrics-Gap. Die Regeln sollen fehlende Informationen nicht unnötig mehrfach melden.

### `metrics.economic-impact-quantified`

**Frage:** Sind relevante operative Metrics wirtschaftlich quantifiziert?

Trigger:

- mindestens eine Metric besitzt bereits Current- oder Target-Werte
- keine dieser relevanten Metrics besitzt gleichzeitig einen wirtschaftlichen Wert und eine nachvollziehbare Herleitung

Severity:

- hoch, wenn mindestens eine relevante Metric bereits kundenseitig bestätigt ist
- sonst mittel

Bewusste Grenze:

v0.1 verlangt nicht, jede einzelne operative Metric zu monetarisieren. Sobald mindestens eine relevante Metric den wirtschaftlichen Nutzen mit Wert und Herleitung belastbar abbildet, erzeugt diese Regel kein Finding.

### `economic-buyer.validated`

**Frage:** Ist der Economic Buyer belastbar validiert?

Geprüfte Signale:

- Candidate vorhanden
- Identität bestätigt
- wirtschaftliche Entscheidungsautorität bestätigt
- direkter Zugang und direkte Interaktion
- Investitionspriorität bestätigt
- belastbare, nicht als Annahme/unbestätigt klassifizierte Evidence vorhanden

Severity:

- hoch

Bei mehreren Candidates bewertet die Regel deterministisch den am weitesten validierten Candidate. Das verhindert mehrere nahezu identische EB-Findings.

### `decision-process.ready`

**Frage:** Ist der kundenseitige Decision Process ausreichend verstanden?

Trigger:

- keine erforderlichen Schritte vorhanden oder
- bei erforderlichen Schritten fehlen Owner, kundenseitige Bestätigung oder belastbare Evidence
- erforderliche Schritte sind blockiert oder als übersprungen markiert

Severity:

- hoch

`planned` gilt in v0.1 noch nicht als kundenseitig bestätigt. Diese Grenze ist bewusst konservativ und kann später mit einem spezifischeren Process Service verfeinert werden.

### `paper-process.ready`

**Frage:** Sind die formalen Schritte bis zum Abschluss ausreichend verstanden?

Geprüfte Signale bei erforderlichen Schritten:

- Owner
- Status
- Lead Time / Dauer
- belastbare Evidence

Severity:

- hoch, wenn bereits ein Target Close hinterlegt ist
- sonst mittel

Die Regel berechnet noch keinen Critical Path. Sie erkennt nur fehlende Grundlagen, die eine spätere Terminplanung unzuverlässig machen würden.

### `champion.proven`

**Frage:** Ist der stärkste Champion-Candidate anhand beobachtbaren Verhaltens belastbar getestet?

Geprüfte Signale:

- ausreichender interner Einfluss (medium oder high)
- konkreter Personal Win
- belegter interner Informationszugang
- belegtes internes Verkaufen für die Opportunity
- belegte Fähigkeit, relevanten internen Zugang herzustellen
- die jeweilige Behavior-Evidence ist weder Annahme/Unbekannt noch unbestätigt

Severity:

- hoch bei mehreren fehlenden Signalen oder fehlendem Candidate
- sonst mittel

Bewusste Modellgrenze:

Champion-Behaviors besitzen in Schema 0.2.0 noch keine eigenen stabilen IDs. Der Inspector kann sie lesen und Evidence auswerten, erzeugt daraus aber keine künstlichen adressierbaren Behavior-Entities.

## Priorisierung

v0.1 kennt bewusst nur:

- hoch
- mittel

Es gibt keine künstliche `critical`-Eskalation ohne zusätzliche Deal-Stage- oder zeitliche Kontextlogik.

Sortierung:

1. Severity
2. stabile Reihenfolge des Regelkatalogs

Dadurch erzeugt derselbe Projektstand immer dieselbe Reihenfolge.

## Nicht Teil von v0.1

- globale Deal-Score-Zahl
- Win Probability
- automatische Erzeugung oder Änderung von Risks
- automatische Erzeugung von Actions
- Next Best Action
- Qualification Gates
- Critical-Path-Berechnung
- generative AI
- neue Schemafelder

Diese Punkte folgen nur in den dafür vorgesehenen späteren Services.
