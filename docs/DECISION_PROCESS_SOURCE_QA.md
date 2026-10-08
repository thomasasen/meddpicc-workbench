# Decision Process – Fachprüfung und Autoren-Red-Team

## Umfang und Quellen

- Andy Whyte, *MEDDICC*, Abschnitt **Decision Process**: From the What to the How; Technical Validation; Business Approval; Decision Process and Go-Live Plan; Influencing the Decision Process; Measure Progress Against the Decision Process.
- Darius Lahoutifard, *Always Be Qualifying*, **Chapter Six: Decision & Paper Process** und **Chapter Ten: Say No to Qualify**.
- Deutsche Fragen und CRM-Beispiele sind redaktionell entwickelte Hilfen, keine Originalzitate.

## Fachliche Abgrenzung

| Perspektive | Abgeleiteter Kern | Umsetzung |
| --- | --- | --- |
| Whyte | Kundenentscheidung als wiederholt zu bestätigende Folge von Schritten und Stakeholder-Freigaben; Technical Validation und Business Approval; Fortschritt nicht an Seller-Aktivität messen | Evidenz vor optimistischem Status; Plan mit den tatsächlich zuständigen Rollen validieren; Änderungen laufend nachfassen |
| Lahoutifard | Validation und Approval klar erkennen; Prozess dokumentieren, zeitlich prüfen und zusammen mit Kundenseite optimieren; Paper Process ausdrücklich untersuchen | Checkpunkte für Meilensteine, Parallelisierung, aktive Prozessklärung und Formalitäten |
| Gemeinsamer Kern | Käuferprozess statt Verkäuferphasen; Personen, Ablauf, Abhängigkeiten und Entscheidungsschritte verstehen | Knowledge-Seite und zehn einmalige Checklist-Fragen |

**Einordnung Paper Process:** Whyte trennt den Ablauf zwischen Auswahl und unterschriebenem Vertrag zur eigenständigen Prüfung. Lahoutifard bezeichnet Paper Process als administrativen Teil des größeren Decision Process. Deshalb ist die UI organisatorisch getrennt, behauptet aber keine starre zeitliche Reihenfolge.

## Simuliertes Autoren-Red-Team: Einwände und eingebaute Korrekturen

1. **„Mit dem Champion abgestimmt reicht nicht.“** Korrektur: Mehrpersonenvalidierung und Abgleich mit Gremien sowie technischen und wirtschaftlichen Verantwortlichen.
2. **„Ein POC-Termin ist kein Entscheidungsschritt.“** Korrektur: bestätigte Akzeptanzkriterien, Abnehmer, Ergebnis und konkreter nächster Beschluss.
3. **„Kauf- und Entscheidungsprozess nicht vermischen.“** Korrektur: klare Kriterien-/Process-/Paper-Process-Abgrenzung und gesonderter Formalitätenpfad.
4. **„Technical Validation und Business Approval laufen nicht in jedem Fall strikt nacheinander.“** Korrektur: expliziter Hinweis auf mögliche Überschneidung, nur nach Kundennachweis.
5. **„Verkäuferaktivität ist kein Deal-Fortschritt.“** Korrektur: bestätigte Kundenmeilensteine statt Demo-/Meetinganzahl.
6. **„Ein genannter Vorstandstermin ist kein belastbarer Forecast.“** Korrektur: Sitzung, Beschlussbedingungen, Fristen, Abhängigkeiten, zuständige Personen und Folgen einer Verschiebung erfragen.
7. **„Prozessabkürzungen könnten notwendige Kontrollen unterlaufen.“** Korrektur: Optimierung nur mit Kundenzustimmung; keine Umgehung von Gremien, Security, Legal oder Einkauf.
8. **„Ein einmal skizzierter Ablauf verändert sich.“** Korrektur: regelmäßiges Revalidieren, offen dokumentierte neue Schritte und verantwortliche Folgeaktionen.
9. **„Economic Buyer ist nicht automatisch Projektleiter.“** Korrektur: Entscheidungsrecht, tatsächliche wirtschaftliche Autorität und Veto-Rollen separat klären.
10. **„Ein fachlicher Zuschlag ist noch kein signierter Auftrag.“** Korrektur: Übergang in Paper Process früh erforschen, niemals automatische Unterschrift behaupten.

## UI- und Datenschutzentscheidungen

- Die neue Funktion ist **Knowledge + Checklist**, kein CRM, keine Opportunitätsdatenbank und kein Score.
- Bestehende Design-System-Klassen und Lucide-Icons werden wiederverwendet.
- Checklist-Checks verbleiben nur im lokalen Zustand der aktuellen Ansicht.
- Quellen und Autorenperspektiven stehen gesammelt im standardmäßig geschlossenen Bereich am Seitenende.
- Browserprüfungen decken die Navigation, Quellen-Disclosure, temporäre Checks und Breiten 375/768/1024/1440 px ab.
- Sichtbare Änderungen benötigen vor Merge eine explizite Desktop-/Mobile-Freigabe.

## Nicht behauptet

Die Quellen geben kein universelles verpflichtendes Entscheidergremium, keine standardisierte POC-Dauer und keine allgemeingültige Reihenfolge bis zur Unterschrift vor. Solche Details müssen aus dem jeweiligen Kundenprozess ermittelt werden.
