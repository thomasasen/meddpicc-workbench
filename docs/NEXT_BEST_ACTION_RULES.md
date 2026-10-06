# Next Best Action Engine v0.1 – Regelkatalog

## Zweck

Die Next Best Action Engine leitet aus dem aktuellen, validierten Projektstand und den Deal-Inspector-Findings wenige konkrete Verkäuferaktionen ab.

Sie ist **keine generische Taskliste** und sortiert project.actions nicht um. Empfehlungen sind rein abgeleiteter State und werden nicht in die .meddpicc-Datei geschrieben.

Die Kernfrage lautet:

> Was sollte ich in diesem Deal als Nächstes tun, warum gerade jetzt, und welche Evidence soll dadurch entstehen?

## Quellenreview und Red Team vor Implementierung

Fachlich geprüft wurden insbesondere:

- Andy Whyte – *MEDDICC: The ultimate guide to staying one step ahead in the complex sale*
  - Qualification als kontinuierliche Navigation durch Gaps
  - Metrics als quantifizierter Wert
  - Economic Buyer: tatsächliche Authority, direkte Interaktion und Champion als bevorzugter Access-Pfad
  - alternative EB-Zugänge bei blockierter Introduction, einschließlich direkter Ansprache, „Champion Letter“ und Executive-to-Executive-Ansatz
  - Champion: Power/Influence, Personal Win, internes Verkaufen und beobachtbares Verhalten
  - Decision Process und Paper Process als reale kundenseitige Abläufe
- Darius Lahoutifard – *Always Be Qualifying – MEDDIC & MEDDPICC Sales*
  - kontinuierliche Qualification und Vermeidung unnötiger Sales-Aktivitäten
  - Economic Buyer als finale wirtschaftliche Entscheidungsautorität, nicht Procurement
  - Champion als Zugangshilfe und Test über konkrete interne Handlungen
  - Metrics und Economic Impact
  - Decision-/Paper-Process sowie frühe Procurement-/Legal-Klärung
  - Pain über Konsequenz, Desired Outcome und Urgency/Compelling Event vertiefen

### Red-Team-Ergebnis

1. Schema 0.2.0 reicht für v0.1 aus. Keine Schemaerweiterung ist nötig.
2. Die Engine darf keine Person zum Economic Buyer erklären, wenn nur ein Candidate oder eine Dritt-Aussage vorliegt.
3. Ein Champion-Label reicht nicht. Für eine EB-Introduction müssen Influence, Personal Win, belastbarer Informationszugang, internes Verkaufen und ein belegtes Access-Signal evidenzbasiert sein.
4. „Champion um EB-Introduction bitten“ darf nicht parallel als Champion- und EB-Empfehlung doppelt erscheinen.
5. Fehlender Pain darf nicht direkt in eine ROI-/Business-Case-Aktion übersetzt werden.
6. Unbestätigte Metrics dürfen nicht durch Monetarisierung künstlich „gehärtet“ werden.
7. Blockierte Process Steps müssen vor nachgelagerten Optimierungen kommen.
8. Die bloße Existenz eines Target Close erhöht die Dringlichkeit ungeklärter Decision-/Paper-Process-Lücken; v0.1 verwendet bewusst keine willkürlichen Tages-Schwellen.
9. Die Bücher liefern keine universelle mathematische Next-Best-Action-Punktzahl. Die Sortierung ist deshalb eine transparente Workbench-Produktregel.
10. Es werden keine persistierten Actions erzeugt oder verändert.

## Output-Vertrag

Jede Empfehlung enthält:

- stabile Recommendation-ID
- stabile Rule-ID
- MEDDPICC-Bereich
- Priorität high oder medium
- Aktionstitel
- whyNow
- gewünschte Evidence
- auslösende Deal-Inspector-Rule-IDs
- relevante Evidence-IDs
- relevante Entity-IDs
- relevante strukturierte Inputs
- optional zusätzlich adressierte Findings

## Regeln

| Rule-ID | Trigger | Aktion | gewünschte Evidence | Priorität | konsumierte Inspector-Findings | Quellenkennzeichnung |
|---|---|---|---|---|---|---|
| nba.pain.clarify-impact | Pain fehlt oder ist nicht vollständig impliziert | Pain konkretisieren bzw. Business Impact und Konsequenz des Nicht-Handelns vertiefen | Problemaussage, Business Impact, Inaction Consequence, Priorität | high/medium aus Finding | pain.identified, pain.implication-complete | **MEDDPICC-source-supported** |
| nba.metrics.validate-value | keine kundenseitig bestätigte Metric oder wirtschaftlicher Impact fehlt | zuerst Current State/Desired Outcome validieren; erst danach wirtschaftlichen Impact einer relevanten Metric herleiten | bestätigte Baseline/Zielgröße bzw. nachvollziehbarer Economic Impact | high/medium aus Finding | metrics.customer-confirmed, metrics.economic-impact-quantified | **MEDDPICC-source-supported** |
| nba.economic-buyer.advance | EB-Candidate fehlt, Authority unklar, Access fehlt, Priority unklar oder Evidence reicht nicht | jeweils nur den nächsten belastbaren EB-Schritt empfehlen | Candidate/Authority, direkter Access, Priorität/Business Outcome oder Evidence | high | economic-buyer.validated, ggf. zusammen mit champion.proven | **MEDDPICC-source-supported** |
| nba.champion.test | Champion-Finding offen und nicht bereits durch EB-Access-Aktion konsumiert | Candidate identifizieren, Personal Win klären oder konkrete interne Aktion verlangen | Influence, Personal Win, internes Verkaufen / beobachtbare interne Aktion | high/medium aus Finding | champion.proven | **MEDDPICC-source-supported** |
| nba.decision-process.validate | Decision Process fehlt, Owner fehlen, Schritte sind geplant/unbekannt oder blockiert | Prozess abbilden, Owner bestätigen, Ablauf validieren oder zuerst Blocker klären | Schritte, Owner, Reihenfolge, kundenseitige Bestätigung, Blocker-Auflösung | high | decision-process.ready | **MEDDPICC-source-supported** |
| nba.paper-process.de-risk | Paper Process fehlt, Owner/Lead Time fehlen, Schritte unbekannt oder blockiert | Procurement/Legal/Signaturprozess klären; Blocker vorziehen | formale Schritte, Owner, Lead Times, Ablauf, Blocker-Auflösung | high/medium; bei Target Close high | paper-process.ready | **MEDDPICC-source-supported** |

## Economic-Buyer-/Champion-Deduplizierung

Die Engine unterscheidet drei Access-Fälle:

1. **Belastbarer Champion:** direkte EB-Introduction empfehlen.
2. **Champion-Candidate vorhanden, aber nicht belastbar:** keine Introduction unterstellen. Stattdessen eine kombinierte Aktion „Champion-Candidate testen und EB-Zugangspfad klären“ erzeugen. Diese konsumiert EB- und Champion-Finding gemeinsam.
3. **Kein belastbarer Champion-Candidate:** alternative Access-Route vorbereiten. Die Engine formuliert bewusst neutral und generiert keinen automatischen Brief.

Damit entsteht aus einem EB-Access-Gap und einem dazugehörigen Champion-Gap höchstens eine gemeinsame Empfehlung, wenn eine einzige Verkäuferaktion beide sinnvoll adressieren kann.

## Evidence-Regeln

Eine Recommendation-Voraussetzung gilt nur als belastbar, wenn die referenzierte Evidence nicht assumption oder unknown ist und verification nicht unconfirmed ist.

Eine Evidence-ID allein reicht nicht.

Fehlen belastbare Daten, lautet die Empfehlung auf **Evidence erzeugen oder validieren**, nicht auf eine Verkäuferannahme.

## Priorisierung – Workbench product inference

Die Priorisierung ist **keine offizielle MEDDPICC-Formel**.

Es gibt keine sichtbare globale Punktzahl und keine Win Probability. Kandidaten werden deterministisch in dieser Reihenfolge sortiert:

1. tatsächlicher Blocker oder fehlende Voraussetzung vor Optimierung
2. high vor medium
3. Empfehlungen, die mehrere offene Inspector-Findings mit einer Aktion adressieren
4. direkte Evidence-Erzeugung vor weiterer Verkäuferinterpretation
5. bei gesetztem Target Close: offene Decision-/Paper-Process-Klärung erhält zusätzliche Dringlichkeit
6. stabile Tie-Break-Reihenfolge über nextBestActionRuleIds

Diese Sortierreihenfolge ist ausdrücklich **Workbench product inference**.

## Bewusste Grenzen von v0.1

- kein mathematischer Recommendation Score
- keine Win Probability
- keine persistierten Actions
- keine automatische Brief-/E-Mail-Generierung
- keine Datums-Schwellen wie „unter 30 Tagen“
- keine Competition-Regeln im NBA-v0.1-Slice
- keine neuen Schemafelder
- keine AI-/LLM-Runtime
