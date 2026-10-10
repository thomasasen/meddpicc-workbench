# Cost of Delay – Originalquellen, Modellierungsentscheidungen und simuliertes Red Team

**Stand:** 10.10.2026 · Feature-Branch \`feature/cost-of-delay\`. Originalwerke liegen im ChatGPT-Projekt als EPUB vor; keine erfundenen Seitenangaben. Die Bewertungsrollen sind **simuliert**. Kein Autor und kein Kunde wurde kontaktiert oder hat zugestimmt.

## 1. Quellenmatrix

| Gegenstand | Ursprüngliche Quelle | Quellengebundene Aussage | Ableitung / Produktentscheidung |
| --- | --- | --- | --- |
| Messbare Wirkung | Andy Whyte, *MEDDICC*, „Metrics“, M1/M2 | M1 sind Proof-Points bestehender Kunden; kundenspezifisch entwickelte Metrics (M2) benötigen Discovery und Abstimmung. | Evidenzstatus nicht hochstufen; Referenzwerte und Hypothesen erkennbar lassen. |
| Implication | Whyte, *MEDDICC*, „The Three I's“ | Pain wird durch Konsequenzen und quantifizierte Auswirkungen relevanter. | Verzögerung anhand eines konkreten Kundennutzens vergleichen, nicht anhand künstlicher Fristen. |
| Business Impact | Darius Lahoutifard, *Always Be Qualifying*, Kapitel 3 „Metrics“ | Wirtschaftliche Wirkung gegenüber Status quo oder Konkurrenz messbar machen. | Vorher/Nachher und wirtschaftlichen Realisierungsmechanismus getrennt dokumentieren. |
| Economic Buyer | Lahoutifard, Kapitel 4 „Economic Buyer“ | Entscheidungsperson benötigt verständliche wirtschaftliche Auswirkungen; Dringlichkeit muss überprüft werden. | Steckbrief ohne Verkäufer-Scores oder angebliche Budgetfreigabe. |
| Dringlichkeit | Lahoutifard, Kapitel 7 „Identify Pain“, „Urgency: Compelling Event“ | Deadline und wirtschaftliches Bedürfnis sind zu verifizieren. | Kunde muss Nutzenbeginn und echte Ausschlussfrist bestätigen. |
| Payback-Kommunikation | Lahoutifard, Kapitel 9 „The ROI Pitch“ / „ROI vs. Payback Period“ | Zeitbasierte Wirtschaftlichkeit ist oft leichter zu erklären als Prozentkennzahlen. | Monatliche Szenarien und nachvollziehbare kumulierte Entwicklung anzeigen. |
| Exakte Cost-of-Delay-Formel | **Nicht in diesen Primärquellen nachgewiesen** | Keine spezifische Monatsmodellformel den Autoren zuschreiben. | Eigene deterministische Modellierung, dokumentiert und testbar. |

## 2. Modell (eigene Entscheidung, nicht aus den Büchern zitiert)

Beide Fälle betrachten denselben Modellkalender **Monat 0 bis Monat 36 bzw. 60** (einschließlich Monat 0; Nutzen beginnt frühestens in Monat 1).

Je Monat \`m\`:

- Wiederkehrender Jahreswert \`A\`: \`A/12 × min(1, (m - Startmonat + 1)/Ramp-up)\`, sofern wirksam; vor dem Start 0.
- Einmaliger Wert \`E\`: nur im jeweiligen Wirksamkeitsmonat.
- Bei Verschiebung \`d\`: Nutzenstart \`Startmonat + d\`; Ramp-up beginnt dort neu.
- Ende einer Wirkung ist entweder **fester Kalendertermin** oder **mit dem Start verschobenes Ende**.
- Kundennutzendifferenz: \`Σ Basis-Nutzen(m) − Σ verschobener Nutzen(m)\` im **gleichen** Betrachtungshorizont.
- Separat: spätere Abschaltung eines Altvertrags; belegte weitere Verzögerungskosten; Verschiebung der Fälligkeit einmaliger Projektkosten.
- Netto-Modellunterschied **nur wenn die betroffenen Kostenfelder ausdrücklich beziffert sind**:
  \`Kundennutzendifferenz + Altsystem-Differenz + Zusatzkosten − innerhalb des Horizonts nur später anfallende Projektkosten\`.

**Wichtig:** Der Netto-Modellunterschied ist keine vollständige Vermögensschadensberechnung, kein Cashflow, kein NPV und kein Garantieversprechen. Bei offenen Kostenpositionen bleibt die Nettozahl offen. Die ausgewiesene Bruttodifferenz innerhalb eines festen Horizonts ist nicht zwingend ein **endgültiger** Verlust. Ein irreversibler Verlust wird nur bei ausdrücklich festem Wirkungsende und innerhalb des Horizonts abgeschlossener Wirkung **unter dieser Annahme** modelliert.

Die bestehende \`calculateSoftwarePayback\`-Szenarioanpassung verschiebt Kundennutzen, jedoch nicht automatisch die Abschaltung von Altverträgen oder Projektkosten. Daher wird sie **nicht** für eine allgemeine Projektverschiebung wiederverwendet.

Ein \`capacity\`-Status erzeugt **keine** erfundene EUR-Differenz. Wirkungsgruppen verhindern eine gleichzeitige Anrechnung derselben Ersparnis als Metric und als Altsystemabschaltung. Drei Demo-Szenarien sind ausdrücklich fiktiv. Der Metric-Builder-Import erfolgt ausschließlich nach Nutzeraktion und bewahrt Evidenz sowie realisierten Betrag; ungesicherte Kosten werden nicht mit Null aufgefüllt.

## 3. Simuliertes Red Team – Runde 1 vor der Implementierung

| Simulierte Rolle | Einwand | Konsequenz |
| --- | --- | --- |
| Strategic Account Manager | „Ich brauche den Effekt ohne fünf Seiten Eingabefelder.“ | Drei Phasen, Beispiele, fortgeschrittene Kostenpositionen eingeklappt. |
| Economic Buyer | „Warum sollte ich jetzt entscheiden? Das ist doch nur späterer Nutzen.“ | Gemeinsamer Horizont, irreversible Wirkung nur mit expliziter Frist. |
| CFO / Controlling | „Brutto-Nutzendifferenz ist noch kein Nettoverlust.“ | Separater Kostenblock und keine Nettozahl bei Datenlücken. |
| COO | „Zeitersparnis senkt nicht automatisch Personalkosten.“ | Kapazität ohne EUR-Anrechnung. |
| Champion | „Kann ich den Business Case intern weitergeben, ohne alles nachzurechnen?“ | PDF mit Herkunft, Rechenweg, Szenarien und offenen Fragen. |

## 4. Simuliertes Red Team – Runde 2 nach Domain-Implementierung

| Rolle | Gegenprüfung | Stand |
| --- | --- | --- |
| CFO | Monat 0, 3/6/12, Einmalwirkung, verschobene Projektkosten | In \`costOfDelay.test.ts\` als automatische Fälle spezifiziert; CI noch zu bestätigen. |
| COO | Mehrstufiger Ramp-up und anderes Wirksamkeitsende | Monatswerte statt Pauschalformel, Ende differenziert. |
| Economic Buyer | Fester Horizont kann temporäre Verschiebung überzeichnen | Separate Kennzeichnung \`Horizontdifferenz\` und Nachholbarkeit. |
| Champion | Unbelegte Hypothese könnte als bestätigtes M2 missverstanden werden | Eingabestatus unverändert, Warnhinweis und Quellen im PDF. |
| Account Manager | Komplexes Projekt mit mehreren Effekten? | Aktuell ein Hauptnutzen je Rechnung plus getrennte Neben-/Kostenpositionen; kein vollständiges Projektportfolio. |

## 5. Simuliertes Red Team – Runde 3 nach visueller Abnahme

**Ausstehend:** Diese Runde wird erst dokumentiert, wenn Desktop- und Mobil-Originalbilder sowie gerenderte PDF-Seiten tatsächlich betrachtet und etwaige Fehler korrigiert wurden. Bis dahin **keine visuelle oder Autorenfreigabe** behaupten.

## 6. Bekannte Einschränkungen

1. Kein Abzinsungsfaktor, keine Umsatzsteuer, keine Zahlungsfälligkeiten, keine Cashflow-/Voll-Business-Case-Rechnung.
2. Linearer Ramp-up als explizite vereinfachende Annahme; unregelmäßige Effekte benötigen eigene Planung.
3. Zusatzkosten sind nur dann im Modell, wenn sie ausdrücklich erfasst wurden; \`0\` bedeutet bewusste Nullannahme und ersetzt keine Bestätigung.
4. Verlust bei festem Wirkungsende ist eine **modellierte Annahme**, keine rechts- oder bilanzrechtliche Feststellung.
5. Es werden keine wirtschaftlichen Effekte aus einem vollständigen Opportunity-Datensatz oder globalem State importiert.

**Freigaberegel:** Draft-PR; kein Merge nach \`main\` ohne ausdrückliche Nutzerabnahme der sichtbaren UI.
