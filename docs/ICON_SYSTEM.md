# Icon System

## Verbindliche Icon-Quelle

MEDDPICC Workbench verwendet **Lucide** als primäre Icon-Bibliothek.

- Projekt: `lucide-icons/lucide`
- Website: https://lucide.dev/
- Vue-Paket: `@lucide/vue`
- Lizenz: ISC
- Einbindung: als gebündelte npm-Abhängigkeit, **nicht über CDN**
- Stil: konsistente Outline-SVG-Icons

Lucide ist die Standardquelle für allgemeine UI-, Navigations-, Status- und Tool-Icons.

Brand-Logos sind bewusst nicht Teil von Lucide. Falls später ein Markenlogo benötigt wird, muss dafür eine separate, lizenzrechtlich passende Quelle geprüft werden.

## Warum Lucide

Lucide passt zu MEDDPICC Workbench, weil die Bibliothek:

- einen konsistenten visuellen Stil besitzt
- SVG-basiert und skalierbar ist
- mit Vue direkt verwendet werden kann
- tree-shakable ist
- keine Runtime-Verbindung zu einem externen Dienst benötigt
- unter einer permissiven Open-Source-Lizenz steht
- bekannte und gut erkennbare Symbole für typische UI-Aktionen bietet

## Implementierungsregel

Icons direkt und statisch importieren:

```ts
import {
  FolderOpen,
  Save,
  TriangleAlert,
} from '@lucide/vue'
```

Kein globales „alle Icons“-Objekt importieren, wenn dadurch Tree Shaking verhindert oder der Bundle unnötig vergrößert wird.

## Größen und Stil

Standard:

```text
Inline neben kleinem Text       16 px
Navigation                      18 px
Panel-/Section-Header           18–20 px
Primäre Aktion                  18 px
Prominente Empty States         24–32 px
Stroke Width                    1.75–2
```

Icons übernehmen grundsätzlich `currentColor`.

Keine individuellen Farben pro Icon erfinden. Semantische Farbe stammt aus dem bestehenden Design Token / Status.

## Accessibility

### Icon mit sichtbarem Text

Wenn das Icon nur die Erkennung verbessert:

```html
<TriangleAlert aria-hidden="true" />
<span>Risiken</span>
```

Das Icon wird für Screenreader ausgeblendet, weil der Text die Bedeutung bereits liefert.

### Icon-only Button

Nur für allgemein bekannte kompakte Aktionen und nur mit zugänglichem Namen:

```html
<button type="button" aria-label="Menü schließen">
  <X aria-hidden="true" />
</button>
```

Bei weniger offensichtlichen Funktionen immer sichtbaren Text verwenden.

## Verbindliche Zuordnung

### Hauptnavigation

| Bereich | Lucide-Icon | Begründung |
| --- | --- | --- |
| Übersicht | `LayoutDashboard` | vertrautes Dashboard-/Startsymbol |
| Evidenz | `SearchCheck` | gefundene bzw. geprüfte Evidenz |
| Risiken | `TriangleAlert` | etabliertes Warnsymbol |
| Nächste Aktionen | `ListTodo` | offene Aufgaben / To-dos |
| Tools | `Wrench` | Werkzeugbereich |
| Historie | `FileClock` | Änderungen / zeitlicher Verlauf |
| Export | `Download` | Daten aus der Anwendung herausgeben |
| Einstellungen | `Settings` | etablierte Konvention |

### MEDDPICC

Die MEDDPICC-Icons werden **immer zusammen mit dem sichtbaren Fachbegriff** verwendet. Die Begriffe sind zu abstrakt, um nur über ein Icon erklärt zu werden.

| Bereich | Lucide-Icon | Semantik |
| --- | --- | --- |
| Metrics | `ChartColumnIncreasing` | messbare Verbesserung / Kennzahlen |
| Economic Buyer | `UserRoundCheck` | identifizierte Person mit Entscheidungsautorität |
| Decision Criteria | `ListChecks` | Kriterienliste / Anforderungen |
| Decision Process | `Workflow` | Abfolge und Abhängigkeiten |
| Paper Process | `FileCheck` | formaler Dokument-/Freigabeprozess |
| Pain | `CircleAlert` | relevantes Problem mit Konsequenz |
| Champion | `UserStar` | besonders relevanter interner Unterstützer |
| Competition | `GitCompareArrows` | Alternativen / Vergleich |

### Qualifizierungsstatus

Status wird niemals nur über Icon oder Farbe dargestellt. Verbindlich ist **Icon + deutsches Statuslabel + semantische Farbe**.

| Status | Lucide-Icon | UI-Label |
| --- | --- | --- |
| confirmed | `CircleCheck` | Bestätigt |
| partial | `CircleDot` | Teilweise |
| assumption | `CircleDashed` | Annahme |
| unknown | `CircleQuestionMark` | Unbekannt |
| risk | `TriangleAlert` | Risiko |

### Projektdatei und globale Aktionen

| Aktion | Lucide-Icon |
| --- | --- |
| Neues Projekt | `FilePlus` |
| Projekt öffnen | `FolderOpen` |
| Speichern | `Save` |
| Speichern erfolgreich | `SaveCheck` |
| Download / Export | `Download` |
| Import | `Import` |
| Suchen | `Search` |
| Filtern | `Funnel` |
| Hinzufügen | `Plus` |
| Bearbeiten | `Pencil` |
| Löschen | `Trash2` |
| Weitere Aktionen | `Ellipsis` |
| Externer Link | `ExternalLink` |
| Sidebar einklappen | `PanelLeftClose` |
| Sidebar ausklappen | `PanelLeftOpen` |
| Hilfe | `CircleQuestionMark` |

### Deal Planning und Tools

| Funktion | Lucide-Icon |
| --- | --- |
| Value / ROI / Payback | `Calculator` |
| Business Case | `FileChartColumn` |
| Go-Live / Critical Path | `ChartNoAxesGantt` |
| Closing Checklist | `ClipboardCheck` |
| Decision-Criteria-Matrix | `Table2` |
| Champion Check | `UserCheck` |
| Evidence Check | `SearchCheck` |
| Deal Review | `Presentation` |
| Target / Ziel | `Target` |
| Termin / Deadline | `CalendarDays` |
| Owner | `UserRound` |

## Wo Icons bewusst nicht verwendet werden

Keine Icons nur zur Dekoration neben:

- jedem KPI
- jedem Formularfeld
- jeder Tabellenzelle
- langen fachlichen Erklärungen
- abstrakten Konzepten ohne allgemein verständliches Symbol

MEDDPICC-Fachbegriffe bleiben immer ausgeschrieben.

## Review-Regel

Bei jedem neuen Icon prüfen:

1. Ist die Bedeutung für typische Nutzer ohne Erklärung erkennbar?
2. Verbessert das Icon Scanbarkeit oder Bedienung tatsächlich?
3. Gibt es bereits ein festgelegtes Icon für dieselbe Bedeutung?
4. Wird bei komplexer Bedeutung zusätzlich ein Textlabel angezeigt?
5. Ist die Funktion per Screenreader eindeutig?
6. Wird das Icon lokal aus `@lucide/vue` gebündelt?

Wenn eine dieser Fragen problematisch ist, ist Text meist die bessere Lösung.
