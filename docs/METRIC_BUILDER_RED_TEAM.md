# Metric Builder – Fachkonzept, Quellen und Red Team

Stand: 10.10.2026. Die folgenden Bewertungen sind **simulierte Reviews**, keine tatsächlichen Interviews, Autorenzustimmungen oder empirischen Studien.

## Primärquellen

**Andy Whyte: MEDDICC**, Abschnitte „Metrics 1 (M1's) – Metrics Proof Points“, „Metrics 2 (M2's) – Return on Investment“, „Metrics and Clarity“, „Metrics and Storytelling“, „Metrics and Urgency“ und „Metrics and Your Sales Process“: Bereits erzielte Referenzkundeneffekte (M1) sind Proof Points, nicht automatisch ein kundenspezifisch quantifiziertes und mit dem Champion entwickeltes M2. Gute Metrics müssen von Stakeholdern einschließlich Economic Buyer verstanden werden und können die Dringlichkeit des Handelns begründen.

**Darius Lahoutifard: Always Be Qualifying**, Chapter Three „Metrics“ („Good METRICS should have the following characteristics“, „Sources of Metrics“, „Metrics and the Economic Impact“): M = Measurable, E = Everyday Language, T = Tells a Story, R = Result of an After-State Comparison, I = Impacts Economics, C = Champion Supported and/or Authored. **Chapter Nine, „ROI vs. Payback Period“:** Payback kann gerade gegenüber nicht-finanziellen Stakeholdern verständlicher sein als ROI in Prozent.

**Eigene Produktentscheidungen:** Die drei Stufen „operative Veränderung – rechnerisches Potenzial – realisierter wirtschaftlicher Betrag“, die sieben Eingabetypen, Prüfgrenzen, Datenherkunft, Einordnung in Wirkungsgruppen, lokale Übergabe und die Teilrealisierung mit zwei Positionen stammen **nicht** als verbindliches MEDDPICC-Schema aus den Büchern.

## Implementierte fachliche Regeln

- Drei progressive Schritte: Pain/Prozess/Zielbild, Before/After/Einheit, wirtschaftliche Realisierung und Quelle.
- Die Payback-Domainfunktion annualMetricPotential berechnet Potenziale; die monatliche Payback-Engine bleibt unverändert. Monatsmengen und direkte Monatskosten werden transparent auf 12 Monate normiert.
- Fehlende Werte sind nicht 0. NaN, negative oder zu große Werte, ungültige Prozentsätze, Nullverbesserung und Verschlechterung erzeugen keine abgeschlossene Modellrechnung.
- Kapazitätsgewinn ist keine Kostenreduktion. Risiko- und qualitative Aussagen werden nicht ohne belastbare Zusatzdaten monetarisiert.
- Finanzielle Realisierung erfordert einen expliziten Mechanismus, einen höchstens dem Potenzial entsprechenden EUR-Betrag und eine konkrete Begründung. Der Nutzer kann die Evidenzstufe nur selbst setzen; ein M1-Referenzwert wird nicht automatisch zu kundenseitig validierter M2.
- Bei Teilrealisierung wird die operative Ursprungs-Metric separat von einer direkten Metric mit **nur dem tatsächlich realisierbaren Teilbetrag** übertragen. Gemeinsame Wirkungsgruppe erhält die bestehende Doppelzählungsprüfung. Alle übertragenen Metrics sind zunächst nicht im Payback enthalten.
- Die Übergabe erfolgt explizit und einmalig innerhalb des Browser-Session-Speichers. Ein vorheriger Payback-Entwurf bleibt über den eingebauten Rückweg erhalten. Keine URL-Kundendaten oder zusätzliche Backend-Schnittstelle.

## Simuliertes Red Team 1: vor dem Konzept

| Perspektive | Einwand | Konsequenz |
| --- | --- | --- |
| Strategic Account Manager | Ein langer Pflichtfragebogen macht Discovery unbrauchbar. | Schrittweiser Einstieg, typabhängige Felder und konkrete Fragen zu Lücken |
| CFO / Controlling | Freie Zeit erzeugt nicht automatisch eine GuV-Ersparnis. | Operatives Potenzial von tatsächlichem Kostenabbau trennen |
| COO | Woher stammen Prozessvolumen und Sollwerte? | Baseline, Zielwert, Einheit und Mengenperiode explizit |
| Kundenseitiger Champion | M1-Referenzwerte kann ich intern nicht als eigene Zahlen vertreten. | Quelle und kundenspezifische Prüfung sichtbar halten |
| Economic Buyer | Eine überzeugende Zahl ist noch keine Investitionsfreigabe. | Keine automatische Payback-Aktivierung, Begründung des Mechanismus |

## Simuliertes Red Team 2: nach Implementierung der Domainlogik

| Perspektive | Kritik / Kontrollfrage | Maßnahmen und verbleibende Unsicherheit |
| --- | --- | --- |
| Strategic Account Manager | Funktioniert der Ablauf ohne fertige Ausgangswerte? | Ja, Ergebnis bleibt offen, kontextbezogene Discovery-Fragen; kein Blindwert |
| CFO / Controlling | Wie wird nur ein Teilbetrag von 91.667 EUR finanziell wirksam? | Eigene direkte EUR-Position nur für konkret erklärten Teil; realer Kostennachweis bleibt extern |
| COO | Monats- und Jahreswerte könnten vermischt werden. | Expliziter Periodenfaktor und Unit-Tests für Normalisierung |
| Champion | Wer hat „mit dem Kunden geprüft“ entschieden? | Nur manuelle Auswahl, Quellenhinweis; keine automatische Plausibilitätsbescheinigung |
| Economic Buyer | Kann derselbe Effekt zweimal angerechnet werden? | Identische Wirkungsgruppe und vorhandene Engineprüfung, keine Voraktivierung |

## Simuliertes Red Team 3: nach visueller Abnahme

**Ausstehend.** Diese Runde darf erst nach technischen Quality Gates, echten Desktop-/Mobil-Screenshots und gerenderten PDF-Originalseiten eingetragen werden. Grün bei Browser-Tests ist keine menschliche Sichtprüfung.

## Fiktive Beispiele

| Fiktiver Fall | Rechnerischer Wert pro Jahr | Wirtschaftliche Einordnung |
| --- | ---: | --- |
| CRM: 25.000 Vorgänge × 4 Min × 55 EUR/h | 91.666,67 EUR | Nur Kapazitätswert, nicht angerechnet |
| Service: 15.000 Vorgänge × 4 EUR | 60.000 EUR | Potenziell konkret vermiedene externe Kosten |
| Vertrieb: 1.200 Fälle × 4 Prozentpunkte × 4.000 EUR DB | 192.000 EUR | Modellierter zusätzlicher Deckungsbeitrag |
| Qualität: 20.000 Fälle × 2 Prozentpunkte × 80 EUR | 32.000 EUR | Modellierte tatsächlich vermeidbare Fehlerkosten |
| Risiko: weniger Störungen | Kein verlässlicher EUR-Wert | Keine automatische Monetarisierung |

Es handelt sich ausschließlich um erfundene Schulungswerte, nicht um Referenzfälle oder echte Kundendaten.

## Risiken und fachliches Urteil

Der Builder kann bei belastbaren Inputs eine bessere prüfbare M2-Hypothese ermöglichen, weil Ausgangszahlen, Rechenweg, Realisierungsmechanismus und ungeklärte Annahmen sichtbar bleiben. Ob dies in der Praxis zu besseren Verkaufsentscheidungen führt, ist empirisch **nicht belegt**. Realisierte Effekte benötigen weiterhin eine organisatorische Maßnahme und die Prüfung durch Kunde bzw. Controlling; Risiko, Liquidität und komplexer ROI liegen außerhalb dieses Microtools.

**Freigabe ausstehend:** Format, Lint, Tests, Build, Pages, E2E, PDF-Rendering, visuelle Sichtprüfung und ausdrückliche Nutzerfreigabe vor Merge.
