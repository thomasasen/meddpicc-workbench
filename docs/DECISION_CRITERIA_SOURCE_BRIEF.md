# Decision Criteria – fachliches Source-Briefing für die nächste Implementierung

Stand: 08.10.2026 · **Historisches fachliches Umsetzungsbriefing.** Die Umsetzung wurde nach Quellen-Red-Team und CI in PR #47 abgeschlossen und in `main` gemergt. Aktueller Fachnachweis: `docs/DECISION_CRITERIA_SOURCE_QA.md` und `docs/DECISION_CRITERIA_RED_TEAM.md`.

## Verifizierte Primärquellen

1. Andy Whyte, *MEDDICC: The Ultimate Guide to Staying One Step Ahead in the Complex Sale*, Kapitel **Decision Criteria** (im bereitgestellten EPUB: `OEBPS/Medicc_copy.xhtml`, Kapitelbeginn „D DECISION CRITERIA“).
2. Darius Lahoutifard, *Always Be Qualifying – MEDDIC & MEDDPICC Sales*, Kapitel **Five: Decision Criteria** (im bereitgestellten EPUB: `OEBPS/Text/part0012.xhtml`); ergänzend Kapitel **Ten** zum qualifizierenden „Nein“.

Dieses Briefing paraphrasiert die überprüften Kapitel. Es enthält **keine** wörtlichen Buchfragen oder frei erfundenen Zitate. Die Original-EPUBs sind Chat-Dateianhänge und müssen einem externen Codex-/Runner-Kontext bei Bedarf gesondert bereitgestellt werden. Für den Quellenbeleg im Code die Kapitelüberschriften nennen; nicht behaupten, fehlende Dateien gelesen zu haben.

## Fachlich bestätigte Bausteine

### Whyte

- Decision Criteria sind Anforderungen, Prinzipien und Maßstäbe, anhand derer ein Kunde Lösungen beurteilt; sie sind nicht mit den Schritten des **Decision Process** oder dem **Paper Process** identisch.
- Kriterien liegen nicht zwangsläufig als formales Dokument vor: häufig besteht nur informelle Einigkeit verschiedener Stakeholder. In RFPs und formalisierten Beschaffungen kann es einen dokumentierten Kriterienkatalog geben.
- Zuerst feststellen, **ob**, bei **wem** und **aus welchen Quellen** Kriterien entstanden sind, wie gefestigt sie sind und welche Positionen von Analysten, Beratern, internen Teams oder konkurrierenden Anbietern geprägt wurden.
- Die ausdrücklich dargestellten **drei Kriterienarten**: **Technical** (Feasibility, Use Cases, Infrastruktur, Integration, Usability), **Economic** (Business Case, ROI, Risiko, Time-to-Value, Opportunitätskosten, kommerzielle Bedingungen) und **Relationship** (Executive Alignment, Ruf, Zusammenarbeit, Branchenbezug, Fairness).
- Relevante Kriterien aus **Pain → Use Case → Capability → kundenseitig bestätigte Metric** herleiten, statt Feature-Listen zu erzeugen. Kriterien transparent mit Beteiligten besprechen, Nutzen erklären und auf Kundenseite validieren.
- Kundenfeedback erheben, **wo die eigene Lösung Kriterien erfüllt oder nicht**, aber **keine algorithmische Verkäufer-Selbstbewertung als Kundenvotum ausgeben**.
- Bei RFP, Demo, POC oder Pilot vor Ressourceneinsatz **Success Criteria** und die **Konsequenz bei erfolgreicher Validierung** klären. Keine Zusage oder Freigabe als selbstverständlich annehmen.
- Unklare/ungewöhnliche Muss-Kriterien respektvoll nach Geschäftsgrund und belegter Notwendigkeit fragen; nicht pauschal als falsch oder überflüssig deklarieren.
- Unvorteilhafte und nicht sinnvoll veränderbare Kriterien können ein Grund sein, ein Vorhaben **bewusst nicht weiterzuverfolgen**.

### Lahoutifard

- Kapitel Five ordnet Kriterien in **Vendor/Partner Criteria**, **Financial Justification** und **Capability Validation** ein. Diese Perspektive ist verwandt mit, aber **nicht exakt identisch** zu Whytes Technical/Economic/Relationship.
- Er fordert das Erkennen, Verstehen und **frühzeitige Mitgestalten** der Kundenkriterien und den Vergleich mit Alternativen.
- Das **Value Triangle** stellt die Schnittmengen von Kundenbedarf, eigener Leistungsfähigkeit und Wettbewerbsfähigkeit heraus; darunter sieben benannte Zonen: **Parity, Market Trends, Useless, Unique Differentiators, Custom Needs, Value, Danger**.
- Fachlich entscheidend: **Value** = Kunde verlangt etwas, die eigene Lösung erfüllt es, die Wettbewerbsalternative nicht; **Danger** = Kunde verlangt etwas, die Wettbewerbsalternative erfüllt es, die eigene nicht. Parity allein ist keine Differenzierung. Unique Differentiators ohne Kundenrelevanz sind noch kein gesicherter Value.
- Bewertungen der Konkurrenz sind **Hypothesen**, solange sie nicht mit Kunden oder belastbaren Belegen geprüft wurden; keine erfundenen Wettbewerbsstärken.
- Kapitel Ten behandelt das qualifizierende **Nein** als mögliche Reaktion auf fragwürdige oder unpassende Criteria, statt jede Anforderung vorschnell zuzusagen.

## Praxissynthese für die Toolbox

- Für den Nutzer **nur praktische Methoden und Fragen** darstellen, nicht prominent „laut Buch/Autor“. Quellen, Unterschied der Ansätze und Unsicherheiten **ganz am Ende** in einer standardmäßig **geschlossenen** Disclosure.
- Fokussierte **Knowledge-Seite + Themen-Checklist** als nächster Slice; noch kein umfassender Criteria Workshop, Value-Triangle-Visualizer oder Scoring-System.
- In Beispiel-Szenarien aus dem Enterprise-Software-Vertrieb **belegte Criteria** von Anforderungen, Anbieterwerbung, Annahmen und intern noch nicht abgestimmten Wünschen trennen.
- Deutlich zwischen **Muss-Kriterium / Wunsch / informeller Präferenz / bewerteter Gewichtung** unterscheiden; ein angebliches Gewicht gilt erst nach Kundenbestätigung.
- Verbindungen zu Economic Buyer, Metrics und Discovery Call anbieten, aber keine globale Dealakte einführen.
- Ambivalenzen sichtbar lassen: Dass technische Machbarkeit häufig ein Eintrittskriterium ist, bedeutet nicht, dass alle Kunden gleich entscheiden. Unterschiedliche Stakeholder gewichten unterschiedlich.
- Ohne kundenseitige Evidenz keine Behauptung, wir seien „führend“, „Sieger“, „bevorzugt“ oder ein Kriterium sei „entscheidend“.

## Source-QA-Check für den späteren PR

- [ ] Primary-Source-Zuordnung pro zentraler Behauptung und Quelle im internen QA-Dokument.
- [ ] Whyte-Dreiteilung und Lahoutifard-Dreiteilung jeweils korrekt benannt; keine erfundene deckungsgleiche Abbildung.
- [ ] Value-/Danger-Zonen nicht vertauscht und keine nicht belegten Stakeholder-/Wettbewerbskenntnisse.
- [ ] Decision Criteria ≠ Decision Process ≠ Paper Process.
- [ ] Kriterien verknüpfen Pain, Metrics, Differenzierung und Validierung.
- [ ] Fragen sind eigene deutsche Praxisformulierungen, **keine als Zitate deklarierten Textpassagen**.
- [ ] Quellen und Autoren vollständig am Ende einklappbar, nicht in Erklärungskarten sichtbar.
