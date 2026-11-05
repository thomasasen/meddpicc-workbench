# Apple Design · Sichtbares Redesign & simuliertes Red-Team (05.11.2026)

## Auftrag und Abgrenzung

Der frühere PR #83 übernahm die Apple-Design-Prinzipien, änderte die Benutzeroberfläche optisch aber nur geringfügig. Dieser **neue PR** führt einen tatsächlich sichtbaren, gemeinsamen Design-Layer für **alle produktiven Routen** der MEDDPICC Toolbox ein.

Dies ist ein **simuliertes Red-Team**, keine externe Designagentur oder menschlich unabhängige Auditierung. Es nutzt Gegenproben für die neuen verbindlichen Regeln aus `.agents/skills/apple-design/SKILL.md` sowie aus `AGENTS.md` und `docs/DESIGN_SYSTEM.md`.

## Umsetzung

- **Struktur und visuelle Hierarchie:** neue Design-Tokens, deutlich differenzierter Startseiten-Hero, drei klare Einstiegskarten, durchgehende Tool-/Checklist-/Knowledge-Surfaces, überarbeitete Einstellungsansichten.
- **Typografie:** optisch abgestimmte Schriftgrößen, responsive Headlines, Laufweite, Lesbarkeit, ausreichende Schriftgewichte und Zeilenhöhe; kein externes Font-Loading.
- **Material:** ein tatsächlich schwebender, sticky globaler Header mit transparenter Tiefenwirkung, opakem Fallback; alle Formular- und Ergebniskarten bleiben zur Lesbarkeit opak. Kein gestapelter Glassmorphism.
- **Bedienung:** einheitliche große Pointer-Targets, prominente Tastaturfokussierung, unmittelbare Druck-Rückmeldung, semantisch erhaltene Buttons und Links, aktive Workflow- und Filterzustände.
- **Bewegung:** dezente und umkehrbare Zustandsübergänge; Drag-and-drop auf der Go-Live-Rückwärtsplanung erhält ein tatsächlich **kritisch gedämpftes**, aus der Live-Position und Freigabegeschwindigkeit fortgesetztes Einrasten. Kein Bounce auf normalen Dialogen oder Buttons; keine externe Animationslibrary.
- **Responsive:** 320/375/768/1024/1440 px. Die bestehende Viewport-Matrix prüft alle 25 Produktivseiten bei 375/768/1024/1440 px; ein neuer Test ergänzt 320 px für vier Kernoberflächen.
- **Barrierefreiheit:** Reduced Motion, Reduced Transparency, Contrast More und Forced Colors; solide Basisflächen bei nicht unterstützten Media Queries. Der bisherige Tastatur-Fallback für Timeline-Reordering, Ergebnislabels und Screenreader-Meldungen bleiben bestehen.
- **Keine fachlichen Änderungen:** local-first, keine neue CRM-Struktur, keine neuen externen Dienste, keine neue Produktionsabhängigkeit.

## Red-Team-Angriffsflächen

| Perspektive | Angriff / Worst Case | Gegenmaßnahme / Prüfmethode |
| --- | --- | --- |
| Produkt | Apple-Styling verdrängt Tools/Checklists/Knowledge | Startseite und Datenmodell unverändert task-first; neue visuellen Hierarchien statt CRM-Dashboard |
| UI-Konsistenz | Nur Startseite sieht anders aus | Expliziter Browser-Test gegen zehn unterschiedliche Routen, zusätzlich komplette 25-Routen-Viewport-Matrix |
| Materialien | Glass-Effekte stapeln sich und zerstören Lesbarkeit | Blur ausschließlich am globalen, beim Scrollen schwebenden Header; Formular-/Ergebniskarten opak |
| Accessibility | Heller Untergrund, kontrastarme Sekundärtexte | Text #16243b, Sekundärtext #516279, Akzent #265ed4 auf Weiß; Kontrasttest und `prefers-contrast`-Fallback |
| Accessibility | Motion/Transparenz reduziert, UI verschwindet | Opaker Default, unabhängige Motion-/Transparency-/Contrast-Fallbacks; Medium- und Keyboard-Tests |
| Nutzerkontrolle | Animation blockiert Eingaben oder verursacht ungewollten Reorder | Keine Eingabesperre; Drag-Datenmutation weiterhin erst auf Pointer-Up, Pointer-Cancel verwirft |
| Physics | Drag-Einrasten springt von logischem statt visuellem Startwert, `ease` statt Feder | `criticallyDampedOffsets` mit gemessener aktiver Position, Übergabe der Freigabegeschwindigkeit, Vitest |
| Technik | Externe UI-/Spring-Abhängigkeit oder Cloud-Calls | Nur CSS, native Web Animations API und reine TS-Federberechnung; keine `package.json`-Änderung |
| Performance | Dauerhafte `will-change`-Layer oder flächiger Blur | Materialeffekt auf einen Header begrenzt; Drag `will-change` nur während Drag |
| Fehler | Layout bricht bei 320/375 px, deutsche Langtexte laufen über | Vorhandene E2E-Viewport-Matrix plus 320-px-Zusatztest |
| Stil/Legibilität | Redesign überschreibt semantische Statusfarben | Warn-/Fehler-/Erfolgsfarben und Labeltexte bleiben getrennt von navigationalen Akzentfarben |
| Export | Schönere UI verfälscht kundenfähige Dokumente | Berechnungslogik und PDF-/SVG-Renderer nicht angefasst; Export-Regression läuft im bestehenden E2E-Test |

### Apple-Design-Kapitel: tatsächliche Anwendung

| Skill-Bereiche | Umsetzung |
| --- | --- |
| 1: Response | Press-Feedback auf Pointerdown durch bestehenden `appleInteractions.css`-Layer |
| 2, 3: Direct manipulation/Interruptibility | vorhandenes Pointer-Capture und 1:1-Drag; unterbrechbarer Native-WAAPI-Settling-Effekt |
| 4, 5: Springs/Velocity-Handoff | neue reine Funktion `criticallyDampedOffsets`; Übergabe der gemessenen Drag-Geschwindigkeit |
| 6: Momentum-Projektion | bewusst **nicht** auf präzises Reordering angewendet, da dadurch falsche Positionen entstehen könnten; Fach-/Nutzerkontrolle geht vor |
| 7, 8: räumliche Konsistenz/Trajektorie | sichtbare Einfügevorschau und gleichgerichtetes Einrasten; keine Show-Animation ohne Navigationszweck |
| 9, 10: Rubber-banding/Gestenerkennung | nicht in Formulare oder Sortierung hinein erfunden; bestehende Pointer- und Cancel-Semantik erhalten |
| 11: Frame Smoothness | Compositor-Transform, nur temporäres `will-change` |
| 12: Materials & Depth | nur funktional schwebende Navigation transluzent; deckende Eingabeoberflächen |
| 13: multimodale Rückmeldung | keine unverlangten Sounds/Haptik; visueller Fokus, Status und ARIA bleiben unabhängig |
| 14: Accessibility | Reduced Motion, Reduced Transparency, Contrast More, Forced Colors und Tastatur |
| 15: Typography | skalierende Schrift, responsives Tracking/Leading, kein externer Font |
| 16: Foundations | Purpose/Agency/Responsibility/Familiarity/Flexibility/Simplicity/Craft/Delight als maßgebliche Abwägung |
| 17: Process | scoped Designsystem, interaktive Browser-Regression, Unit-Tests, QA-Review |

## Abnahmekriterien und Status

1. Visuell klar anderes Grundlayout auf der Startseite **und** allen produktiven Teilbereichen: im PR per CSS implementiert; E2E-Nachweis nach CI.
2. Kein rein dekoratives Liquid Glass, kein Bounce auf normalen Buttons, keine neue Abhängigkeit: per statischem Review.
3. Deutsche UI-Sprache, MEDDPICC-Korrektheit, lokale Daten, Form-/Export-Ergebnisse: bestehende Regression.
4. Wiederholbare Format-, Lint-, Vitest-, Build-, Playwright- und Pages-Integritätsprüfung: **ausstehend bis CI-Ergebnis**.
5. Screenshots der Desktop-/Mobile-Originaldarstellung müssen **manuell** geprüft werden. Eine bestandene CI ist kein Nachweis manueller visueller Freigabe.
6. PR bleibt bis zur sichtbaren UI-Freigabe ohne Merge in `main`.

**Bekannte Grenze:** Nicht sämtliche optionalen Apple-Features (Vibration API, Audio-Haptics, Rubber-banding, Velocity-Projektion) sind für eine deutschsprachige Sales-Toolbox fachlich sinnvoll. „Vollständig“ heißt in diesem Projekt, alle **relevanten** verbindlichen UX-Prinzipien ohne Widerspruch umzusetzen, nicht jede Demo-Animation aus dem Skill zu kopieren.
