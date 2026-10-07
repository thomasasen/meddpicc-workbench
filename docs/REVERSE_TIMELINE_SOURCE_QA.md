# Go-Live-Rückwärtsplanung – Source QA

## Zweck

Dieses Dokument hält fest, welche Teile der Go-Live-Rückwärtsplanung direkt aus den beiden verwendeten MEDDPICC-Quellen abgeleitet sind und welche Elemente Produkt-/UX-Entscheidungen der Toolbox sind.

Primärquellen:

- Andy Whyte, *MEDDICC – The ultimate guide to staying one step ahead in the complex sale*
- Darius Lahoutifard, *ALWAYS BE QUALIFYING – MEDDIC & MEDDPICC Sales*

Es werden keine Buchpassagen als Software-Regeln ausgegeben, wenn sie in den Quellen nicht entsprechend belegt sind.

## Ergebnis des Red Teams

Die Rückwärtsplanung ist mit beiden Quellen vereinbar, solange sie als **Go-Live-Timeline / Rückwärtsplanung** und nicht als vollständiger Go-Live Plan dargestellt wird.

Der vollständige Go-Live Plan bei Whyte enthält mehr als eine Timeline: insbesondere geplante Schritte bzw. Key Events mit Stage, Action, Owner, By When und Status sowie zusätzliche kollaborative Informationen. Diese Version des Microtools bildet bewusst nur den zeitlichen Planungs-Ausschnitt ab.

Lahoutifard beschreibt den Decision/Paper Process als Folge von Buyer- und Seller-Aktivitäten und empfiehlt, den Ablauf zeitlich sichtbar zu machen. Er weist außerdem ausdrücklich darauf hin, dass Aufgaben teilweise parallelisiert werden können. Diese Version rechnet bewusst konservativ **sequenziell**; Parallelisierung ist kein implizites Versprechen der Grafik.

## Source Matrix

| Toolbox-Aussage / Funktion | Whyte | Lahoutifard | Einordnung |
| --- | --- | --- | --- |
| Vom gewünschten Go-Live rückwärts planen | Kapitel **The Go-Live Plan** | **Decision & Paper Process / Compelling Event** unterstützt Reverse Timeline vom kundenseitigen Deadline-Treiber | direkt gestützt |
| Procurement, Legal, Security und ähnliche Schritte früh sichtbar machen | Go-Live-Plan- und Paper-Process-Passagen | Paper Process | direkt gestützt |
| Kundenseitige und Seller-Aktivitäten unterscheiden | Go-Live Plan: Owner / kollaborativer Plan | Decision Process: Aktionen auf beiden Seiten | direkt gestützt |
| Optional konkreten Owner / Rolle ergänzen | Go-Live Plan: Owner | Ownership auf beiden Seiten | direkt gestützt |
| „Warum dieses Datum?“ / Compelling Event | Go-Live-orientierte Urgency und kundenseitige Termine | Compelling Event = kundenseitige Business Deadline / „Why Now?“ | direkt gestützt, besonders explizit bei Lahoutifard |
| Internes Quartalsende ist kein kundenseitiger Compelling Event | nicht als Software-Regel benötigt | explizite Abgrenzung im Abschnitt **Compelling Event** | direkt gestützt |
| Übergabepunkte zwischen Schritten visualisieren | Termine/Stages/Milestones im Go-Live Plan | Prozessschritte und Timeline | sinnvolle Visualisierung, aber nicht jeder Übergang ist ein „Key Milestone“ |
| Schritte in v0.1 sequenziell rechnen | nicht als Pflichtregel der Quelle | Lahoutifard weist ausdrücklich auf mögliche Parallelisierung hin | bewusste Produktgrenze |
| Prozessdauer und Puffer getrennt anzeigen | keine vorgegebene UI | keine vorgegebene UI | Produkt-/UX-Entscheidung |
| Monats-/KW-Achse | keine Vorgabe | Timeline wird empfohlen, konkrete Achsendarstellung nicht | Produkt-/UX-Entscheidung |
| Einklappbare Details, sticky Mobile Labels, SVG/PNG | keine Vorgabe | keine Vorgabe | Produkt-/UX-Entscheidung |

## Warum die Bezeichnung „Go-Live-Timeline“ verwendet wird

Die Bezeichnung **Go-Live-Plan** wäre für die aktuelle Funktion zu weitreichend.

Whytes Go-Live Plan ist ein umfassender kollaborativer Arbeitsplan und enthält neben Zeitpunkten zusätzliche Strukturen wie Owner, Status und weitere Deal-/Projektinformationen. Die Toolbox-Funktion visualisiert dagegen bewusst einen begrenzten, deterministischen Ausschnitt:

- Target Go-Live
- kundenseitiger Termin-Treiber optional
- Prozessschritte
- Dauer
- grobe Verantwortungsseite
- konkreter Owner / Rolle optional
- zeitliche Rückwärtsrechnung
- Puffer / Kompressionsbedarf
- Kundenvisualisierung und Export

Der spätere **Go-Live Plan Builder** bleibt deshalb als umfassenderes Tool getrennt.

## Compelling Event

Das optionale Feld **„Warum dieses Datum?“** dient dazu, einen echten kundenseitigen Termin-Treiber sichtbar zu machen.

Geeignete Beispiele sind etwa:

- Ende der Wartung eines Altsystems
- regulatorische Deadline
- festgelegter Produktions-/Standortstart
- kundenseitige Board-/Unternehmenszusage

Nicht als Compelling Event dargestellt werden soll ein rein sellerseitiger Termin wie Quartals- oder Jahresende.

Das Feld verändert die Datumsberechnung nicht. Es erklärt **warum** das Target Go-Live geschäftlich relevant ist.

## Owner

Die drei bestehenden Verantwortungsseiten bleiben:

- Kunde
- Anbieter
- Gemeinsam

Zusätzlich kann optional eine konkrete Rolle oder Person ergänzt werden. Das erhöht die praktische Nutzbarkeit, ohne eine Kontakt- oder Projektverwaltung einzuführen.

Beispiele:

- Kunde · Einkauf
- Kunde · Dr. Müller / Legal
- Gemeinsam · Projektteam

## Übergabepunkte statt pauschaler Milestones

Die kleinen Punkte am Ende jedes Prozessbalkens werden als **Übergabepunkte / Prozessübergänge** behandelt.

Nur der Target Go-Live wird als besonders hervorgehobenes Ziel dargestellt.

Damit behauptet die UI nicht, dass jeder technische Übergang automatisch ein strategisch wichtiger Key Event oder Milestone im Sinne eines umfassenden Go-Live Plans ist.

## Bewusste Grenze: Parallelisierung

Lahoutifard beschreibt ausdrücklich, dass manche Aktivitäten parallel statt ausschließlich sequenziell ausgeführt werden können, etwa die frühzeitige Einbindung von Legal.

Diese Version der Rückwärtsplanung modelliert das **nicht**.

Sie erzeugt einen konservativen sequenziellen Basisplan. Die Grafik darf daher keine Parallelisierung oder Critical-Path-Logik suggerieren.

Für diese Fragestellung ist weiterhin ein separates Tool vorgesehen:

**Dependency / Parallelization Helper**

## Merge Gate

Vor Merge müssen folgende Punkte erfüllt sein:

1. UI nennt das Ergebnis Go-Live-Timeline bzw. Rückwärtsplanung, nicht vollständigen Go-Live Plan.
2. Compelling Event ist optional und beeinflusst die Datumsrechnung nicht.
3. Konkreter Owner / Rolle ist optional und beeinflusst die Datumsrechnung nicht.
4. Übergabepunkte werden nicht pauschal als Milestones bezeichnet.
5. Sequenzielle Berechnung wird sichtbar als Produktgrenze dokumentiert.
6. Live-Ansicht und SVG/PNG verwenden dieselbe Semantik.
7. Unit-, Browser-, Mobile-, Export- und Layout-Regressions-QS sind grün.
