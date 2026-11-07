# Feldvalidierung für berechnungsrelevante Tool-Eingaben

Stand: 07.11.2026 · Arbeitszweig: `feat/contextual-required-fields-20261107` · PR #106

## Ziel und Abgrenzung

Nur die für einen konkreten Rechenschritt oder eine bewusst aktivierte finanzielle Anrechnung **tatsächlich benötigten** Angaben werden bei fehlendem oder ungültigem Wert unmittelbar am Control hervorgehoben. Eine gute Discovery-Antwort oder höhere Evidenzqualität ist ohne entsprechende fachliche Sperre **keine** generelle Berechnungspflicht. Vorhandene Rohdaten, Recovery-Snapshots, Berechnungsformeln und Berichte bleiben unverändert.

Die Prüfung läuft unmittelbar während der Eingabe, nutzt `aria-invalid`, feldbezogene `aria-describedby`-Fehlermeldungen und Tokens des bestehenden Designsystems. Kein automatisch erzwungener Fokuswechsel, kein Verlust bereits eingegebener Daten. Bei korrigierten Werten verschwinden Kennzeichnung und Fehlermeldung. Für Nebeneinanderfelder gilt weiterhin das Control-Zeilenraster; Meldungen stehen unter dem Feld.

## Fachliche Matrix

| Werkzeug | Ohne weitere Eingabe erforderlich | Bedingt erforderlich | Bewusst optional |
| --- | --- | --- | --- |
| Quick Payback | Anfangsinvestition, Bruttonutzen, laufende Zusatzkosten (bereits mit 0 vorbelegt) | Beträge innerhalb des Modellbereichs | Keine zusätzlichen Eingabefelder |
| Reverse Timeline | Gültiges Planungsdatum, gültiges Target-Go-Live-Datum, mindestens ein Schritt mit Bezeichnung und ganzer Dauer von 0–1000 | Schrittbezogene Werte bei Änderung des Plans | Kunde, Titel, Compelling Event, Rollenname |
| Metric Builder | Kundenproblem, Geschäftsprozess, Geschäftsergebnis zur fertiggestellten Metric | Gemäß Berechnungstyp Ist-/Zielwert, Vorgangsmenge, Stundensatz oder Ereigniswert; bei qualitativer Metric textliche Vorher-/Nachher-Beschreibung; bei aktivierter EUR-Realisierung Betrag, Wirkungsgruppe und ausreichende Erläuterung; bei »mit Kunden geprüft« Quellenangabe | Geschäftliche Konsequenz und andere Discovery-/Evidenzfragen ohne harte Sperre |
| Cost of Delay | Gültiger Nutzenbeginn und Ramp-up sowie weitere Modellterminwerte | Bei »realisierter EUR-Nutzen« gültiger Betrag und Wirkungsgruppe; bei kundengeprüfter Evidenz Quelle; bei positiven Altsystem-/Zusatzkosten passende Wirkungsgruppe bzw. Quelle | Erklärtexte, nicht eingegebene Kostenfelder, zusätzliche Verzögerung, Nutzenende |
| Value Bridge | Gültige Terminwerte vorhandener Metrics | Bei ausdrücklich angerechneter EUR-Wirkung Metric-Name, Ist-/Zielwert, Herleitung, positiver realisierter Jahresbetrag, Realisierungsmechanismus und Wirkungsgruppe; bei kundengeprüfter Evidenz Quelle; bei ausdrücklich geöffnetem Finanzmodell Investition und laufende Kosten | Kundendaten, beschreibende Discovery-Angaben, freiwillige nicht angerechnete Metrics, rein theoretisches Potenzial |
| Software-Payback | Für angelegte Kostenpositionen Bezeichnung, Betrag und Zeitraum; für angelegte Metrics Bezeichnung und valide Zeitraumparameter | Gemäß Metric-Formel weitere Zahlen; bei aktivierter finanzieller Anrechnung Wirkungsgruppe und Realisierungsnachweis; bei Altsystemkosten mit Betrag Wirkungsgruppe; bei Szenarioänderungen gültige Parameter | Nicht genutzte weitere Kosten/Metric-Felder und nicht aktivierte Finanzanrechnung |

**Wichtig:** Eine Eingabe von `0` ist in vielen Rechenmodellen gültig; sie darf nicht mit „fehlt“ verwechselt werden. Wo eine positive Zahl erforderlich ist (z. B. als realisierter Nutzen in der Value Bridge), wird dies gezielt geprüft. Angaben ohne finanzielle Modellgrundlage dürfen nicht allein durch das Ausfüllen eines Textfelds als wirtschaftlich bestätigt gelten.

## Technische Umsetzung

- `src/domain/requiredFieldRules.ts`: einheitliche primitive Text-, Betrags-, Ganzmonats- und ISO-Datumsprüfung.
- `src/styles/formRowAlignment.css`: gemeinsame, kontrastfähige Warnhervorhebung ohne zusätzliche Komponentenbibliothek.
- Die sechs Tool-Views bzw. die Software-Payback-Komponente: Bedingungslogik liegt nahe an ihrem konkreten Formular-Input; finanzielle Pflichtbedingungen spiegeln die Domain-Regeln.
- `src/domain/requiredFieldRules.test.ts` und `tests/e2e/required-fields.spec.ts`: Regressionen für Anfangs-, Korrektur- und bedingte Felder.

## Abnahme

Verbindliche Prüfungen gemäß `AGENTS.md`: `npm run format:check`, `npm run lint`, `npm test`, `npm run build`, `npm run pages:check`, `npm run test:e2e`. Zusätzlich responsive Verfügbarkeit und Ausrichtung der Hilfetexte sowie Tastaturbedienbarkeit prüfen. Ein Merge erfolgt erst nach erfolgreicher CI und ausdrücklicher visueller Nutzerfreigabe.

PR #105 für den einklappbaren Recovery-Bereich bleibt eine separate Änderung. Die Pflichtfeldarbeit verändert weder dessen Recovery-Logik noch dessen Speicherung.
