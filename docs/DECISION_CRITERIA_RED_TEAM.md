# Decision Criteria – Originalquellen-Gegencheck und simuliertes Autoren-Red-Team

Stand: 08.10.2026 · Prüfung von PR #47, basierend auf dem weiterhin offenen PR #46.

> **Wichtig:** Die Autoren wurden **nicht** kontaktiert. Das Red Team ist eine **simulierte fachliche Prüfung aus zwei dokumentierten Perspektiven**, die ausschließlich anhand der Originaltexte von Andy Whyte und Darius Lahoutifard rekonstruiert wurden. Es handelt sich nicht um Originalzitate oder reale Zustimmung der Autoren.

## Prüfmaterial und Vorgehen

- Andy Whyte, *MEDDICC: The Ultimate Guide to Staying One Step Ahead in the Complex Sale*, Original-EPUB, `OEBPS/Medicc_copy.xhtml`, Abschnitt **D – DECISION CRITERIA**. Relevante Unterkapitel: *Establishing the Status of the Decision Criteria*, *The Three Types of Decision Criteria*, *Technical/Economic/Relationship Decision Criteria*, *Influencing the Decision Criteria*, *Working with Practical Decision Criteria*, *Link the Decision Criteria to the Metrics*, *Taking Score*.
- Darius Lahoutifard, *Always Be Qualifying – MEDDIC & MEDDPICC Sales*, Original-EPUB, `OEBPS/Text/part0012.xhtml`, **Chapter Five: Decision Criteria**, Unterkapitel *Vendor/Partner Criteria*, *Financial Justification*, *Capability Validation*, *Decision Criteria vs. Your Solution*, *The Value Triangle*, *Analysis of The Decision Criteria Triangle*, *How to Act on Each Zone?*. Zusätzlich Chapter Ten zum qualifizierenden „Nein“.
- Auditgegenstand: `src/content/meddpicc/decisionCriteria.ts`, `src/views/DecisionCriteriaKnowledgeView.vue`, Checklist, Unit-/E2E-Tests, Quellen-QA.
- Bewertungsmaßstab: Wird die zentrale Argumentation beider Autoren **korrekt**, **vollständig genug**, **praxisfähig** und **ohne falsche Verschmelzung** dargestellt? Unterscheidung: *direkt buchgestützt* vs. *eigene, offen ausgewiesene Praxisableitung*.

## Perspektive A: Andy Whyte – fachliche Gegenrede

**A1 · Hoch · Ursprünglich fehlte „Taking Score“.** Warum auch bei bekanntem Kriterienkatalog fragen, *wie der Kunde unsere Lösung tatsächlich bewertet*? Whyte fordert explizit, mit dem Kunden die Kriterien durchzugehen, aktiv Feedback über den eigenen Fit einzuholen und mögliche Bedenken oder Defizite offenzulegen. Der bisherige Screen fragte nach Kriterien, aber nicht deutlich genug nach diesem Feedback.

**Korrektur:** Eigenständiger Knowledge-Block „Kundenbewertung statt Verkäufer-Score“ und neuer zehnter Checklist-Aspekt `customerEvaluation`: kundenseitige Bewertung, Bedenken, fehlende Nachweise und erforderliche nächste Klärung. **Wichtig:** Das sind echte Kundenrückmeldungen, keine künstlichen Deal-Scores der Anwendung.

**A2 · Mittel bis hoch · Keine Kriterien ist nicht automatisch gut.** Whyte bezeichnet ein Fehlen klarer Criteria explizit als mögliches Warnsignal für geringe Vorbereitung oder Kaufreife und fordert bei fehlendem Kriterienkatalog starke Zustimmung mehrerer Stakeholder zu einer ernsthaften Evaluation.

**Korrektur:** Kriterien-Herkunft um fehlende Kriterien, möglichen unreifen Kaufprozess und Stakeholder-Commitment erweitert. Beim Verkäufer bleibt offen, ob der Kontext wirklich ein Risiko ist – kein automatischer Negativ-Score.

**A3 · Mittel · Einflussnahme muss aktiv sein.** Whyte empfiehlt, aus Pain und Use Case relevante Capabilities und Metrics abzuleiten, sie in die Kriterien einzubringen, intern sichtbar zu machen und praktische Übungen wie POC mit einer klaren Konsequenz bei Erfolg zu verknüpfen.

**Korrektur:** Knowledge-Block „Kriterien sinnvoll mitgestalten“ und stärkere Handlungsanleitungen zu Value/Danger. Bereits vorhanden und bestätigt: Pain → Use Case → Capability → Metric, POC-Success-Criteria und Vereinbarung des Folgeschritts.

**A4 · Bestanden · Drei Kategorien korrekt.** Technical, Economic und Relationship sind korrekt unterschieden; Economic wird nicht auf Preis reduziert. Die ergänzende Kategorie von Lahoutifard wird separat dargestellt.

**A5 · Bestanden · RFP-Quellen und Konkurrenz.** Herkunft von Kriterien, externe Beratungs- oder Anbieter-Einflüsse, Status quo und Eigenentwicklung sind vorhanden; rechtliche oder technische Kundenanforderungen werden nicht blind als falsch abgetan.

## Perspektive B: Darius Lahoutifard – fachliche Gegenrede

**B1 · Hoch · Value Triangle nicht nur statisch erklären.** In Chapter Five erklärt Lahoutifard nicht nur sieben Zonen, sondern konkrete Taktiken: **Value** stärken und mit Metrics, Demo oder Referenzen belegen; **Danger** untersuchen und nach der tatsächlichen Notwendigkeit fragen; **Unique Differentiators** mit Kundenbeispielen/Ergebnissen auf potenziellen Nutzen prüfen.

**Korrektur:** Zonenspezifische `action`-Texte für Value, Danger und Unique Differentiators geschärft. Verkäufer dürfen einen bislang unbekannten Bedarf aufzeigen, dürfen ihn aber nicht als bereits bestätigt ausgeben.

**B2 · Bestanden · Exakt sieben Zonen.** Buchkonform inhaltlich zugeordnet:
- Parity = Kundenbedarf, beide bieten es;
- Market Trends = beide bieten es, Kunde benötigt es aktuell nicht;
- Useless = Alternative bietet es, Kunde benötigt es nicht, wir bieten es nicht;
- Unique Differentiators = wir bieten es, Kunde benötigt es noch nicht, Alternative bietet es nicht;
- Custom Needs = Kunde benötigt es, keine der betrachteten Optionen bietet es;
- Value = Kunde benötigt es, wir bieten es, Alternative nicht;
- Danger = Kunde benötigt es, Alternative bietet es, wir nicht.

Die Abbildung ist ein Modell der **konkreten geprüften Alternativen**, keine Behauptung über den Gesamtmarkt.

**B3 · Bestanden · Seine Kriterienarten nicht als Whyte-Übersetzung ausgeben.** Vendor/Partner Criteria, Financial Justification und Capability Validation sind eigenständig erklärt. Die Modelle sind verwandt, aber **nicht deckungsgleich**.

**B4 · Bestanden · Käuferorientierte Capability Validation.** Anforderungen, optionale Funktionen, Ranking/Scoring/Weighting werden als zu prüfende **Kundenentscheidungslogik** dargestellt, nicht als automatisches Toolbox-Rating.

**B5 · Einordnung · Mitgestalten ≠ manipulieren.** Lahoutifard fordert deutliche Einflussnahme auf die Ausdrucksform der Kundenbedürfnisse. Die Toolbox setzt dies als **nachvollziehbare, kundenseitig validierte Empfehlung** um. Diese normative, transparente Einschränkung ist eine bewusste redaktionelle Produktentscheidung, kein wortwörtlicher Grundsatz aus dem Buch.

## Gemeinsame Empfehlungen / unabhängiges Urteil

| Prüfpunkt | Urteil nach Gegencheck | Risiko |
| --- | --- | --- |
| Definition Decision Criteria; formal vs. informell | korrekt | gering |
| Technical/Economic/Relationship nach Whyte | korrekt | gering |
| Vendor/Partner/Financial/Capability nach Lahoutifard | korrekt | gering |
| Sieben Value-Triangle-Zonen | korrekt | gering |
| Value vs. Danger und Unterscheidung von Unique Differentiators | korrekt; Handlungslogik geschärft | gering |
| Kundenbewertung entlang der Kriterien erfragen | ursprünglich Lücke; jetzt ergänzt | zuvor hoch |
| Ohne Kriterien: Kaufreife und Stakeholder-Consensus prüfen | ursprünglich Lücke; jetzt ergänzt | zuvor mittel–hoch |
| Verkäuferseitige Einflussnahme erklären | bislang zu passiv; jetzt aktiver | zuvor mittel |
| Kundenevidenz vs. Verkäuferhypothese | korrekt getrennt | gering |
| POC-Erfolg vs. Finalentscheidung vs. Paper Process | fachlich sauber getrennt | gering |
| Qualify-out bei Misfit möglich | korrekt | gering |

## Bewusste Grenzen

- Die in beiden Werken verwendete Verkäufer-Metaphorik zu Wettbewerb und Einflussnahme wird **nicht** zu manipulativen oder unbelegten Tatsachenbehauptungen übersetzt.
- Der Begriff „Score“ ist bei beiden Autoren im Zusammenhang mit **Kundenbewertung bzw. Kriteriengewichtung** sinnvoll; nur ein automatisches, nicht kundenseitig belegtes **Toolbox-Deal-Scoring** bleibt ausgeschlossen.
- Die Entscheidung, ob ein Kriterium gesetzlich vorgeschrieben ist, wird nicht aus Vertriebslektüre abgeleitet.
- Die Praxisfragen, Warnungen und CRM-Beispiele sind **eigene Redaktion**, nicht zitierte Pflichtfragen.
- Diese Prüfung kann keine direkte fachliche Abnahme durch die Autoren ersetzen.

## Verifikation

- Unit-Tests prüfen nun ausdrücklich `customerEvaluation`, *Taking Score*, Kaufreife bei fehlenden Kriterien sowie die Aktionen für Value, Danger und Unique Differentiators.
- Playwright prüft den neuen Knowledge-Block und nun **10** Checklist-Punkte.
- **CI nach den Korrekturen erneut ausführen**; ein vorangegangener grüner CI-Lauf bestätigt die Änderungen dieses Reviews noch nicht.
- PR #47 bleibt Draft, keine Nutzer-Sichtfreigabe, kein Merge. PR #46 bleibt ebenfalls unverändert offen.
