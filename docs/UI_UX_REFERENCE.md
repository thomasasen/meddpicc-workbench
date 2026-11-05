# UI/UX-Entwicklungsreferenzen

## Verbindliche Reihenfolge

Für UI/UX-Entwicklung und Reviews gilt:

1. **Apple Design** für alle Fragen der direkten Interaktion, Gesten, Bewegung, Rückmeldung, Materialien, Raumgefühl und Typografie. Bei Überschneidungen **ersetzt Apple Design** ältere UI/UX-Stilregeln im Projekt und in UI UX Pro Max.
2. **MEDDPICC-spezifische Umsetzung** in `docs/DESIGN_SYSTEM.md` und `.agents/skills/meddpicc-ui-ux/SKILL.md`: Produktzweck (Tools, Checklists, Knowledge), fachliche Semantik, konkrete Bedienaufgaben, Accessibility, Datenschutz und technischer Stack sind unverändert verbindlich.
3. **UI UX Pro Max** ergänzend für Vue-Patterns, Formulare, Tabellen, Chart-Auswahl und Accessibility, sofern kein Konflikt mit Apple Design oder dem Produktmodell besteht.

Die Vorrangregel steht auch in `AGENTS.md` und `.github/copilot-instructions.md`. Weder Apple Design noch UI UX Pro Max ist eine Runtime-Abhängigkeit.

## Apple Design (vorrangig bei UI/UX-Überschneidungen)

- Upstream (Community-Skill von Emil Kowalski, **keine offizielle Apple-Designvorgabe**): https://github.com/emilkowalski/skills/tree/main/skills/apple-design
- Gepinnter Stand des Upstream-Repositories: `c8a79627b59d72d764d6ab6f2c87c09a48169833`
- Lizenz: MIT, Copyright (c) 2026 Emil Kowalski
- Lokaler Codex-Skill: `.agents/skills/apple-design/SKILL.md`
- Mitgelieferter Lizenztext: `.agents/skills/apple-design/LICENSE`
- Anpassung: Die spezielle Upstream-Erstantwortanweisung wurde nicht übernommen, da sie keine UI-Anforderung ist und mit Codex-Aufgaben kollidieren würde. Zusätzlich wurden Vorrang, Kontext und Browser-/Abhängigkeits-Fallbacks ergänzt. Die pauschale Empfehlung zu translucenter Navigation und ein Beispiel zu Spring-APIs wurden für das Vue-/B2B-Projekt präzisiert; die fachlichen Designprinzipien bleiben erhalten.

### Übernommene Bereiche

- direktes, unmittelbares Feedback; 1:1-Drag und Touch-Erfassung
- jederzeit unterbrechbare Animationen mit aktuellem On-Screen-Wert
- Spring-basierte Bewegung, Geschwindigkeitstransfer, Impulsprojektion und weiche Grenzen
- symmetrische räumliche Übergänge, ursprungsbezogene Popover/Sheets
- funktionale transluzente Materialien, Blur, Tiefenwirkung und differenzierte Dimmer
- visuelle Bildruhe, sinnvolle Rückmeldungen, physikalisch passende Gesten
- Schriftgrößen-abhängiges Tracking/Leading, Systemfont und Textskalierung
- Reduced Motion, Reduced Transparency, höheren Kontrast und Tastaturalternativen
- acht Leitprinzipien: Purpose, Agency, Responsibility, Familiarity, Flexibility, Simplicity, Craft, Delight

Diese Regeln **verbieten** weder strukturierten B2B-Content noch sachlich nötige Tabellen. Die Anwendung soll nicht als iOS-Kopie wirken: Apple Design steuert die Qualität des Verhaltens, nicht eine fremde Produktarchitektur.

## UI UX Pro Max (ergänzende Referenz)

- Repository: https://github.com/nextlevelbuilder/ui-ux-pro-max-skill
- Upstream-Version: **2.13.0**
- Geprüfter `main`-Commit: `477bcb28c9812b385cb51a4605ddf30d7b2266e2`
- Lizenz: MIT

Weiterhin nützlich für:
- Vue 3 und semantische Formulare
- Responsive Tabellen, Lesbarkeit von informationsdichten B2B-Ansichten
- zugängliche Charts und Diagrammauswahl
- Focus, Keyboard- und Fehlerzustände

Alte Vorgaben wie ein **pauschales Verbot** von Glassmorphism/Transluzenz, animierten Übergängen oder physikalischen Interaktionen haben keinen Vorrang mehr. Rein dekorative Effekte bleiben nur dann ausgeschlossen, wenn sie keinen verständlichen Beitrag zu Interaktion oder Informationshierarchie leisten.

Relevante historische Upstream-Pfade:
- `src/ui-ux-pro-max/data/stacks/vue.csv`
- `src/ui-ux-pro-max/data/styles.csv`
- `src/ui-ux-pro-max/data/charts.csv`
- `.claude/skills/ui-ux-pro-max/references/quick-reference.md`

## Agent-Integration und Laufzeitgrenze

Die beiden lokalen Skills liegen unter `.agents/skills/` und sind für Codex auffindbar; `AGENTS.md` fordert ihre Berücksichtigung bei UI-Arbeiten und regelt die Prioritäten. Eine automatische Anwendung ohne passenden Agent-Kontext oder Skill-Erkennung darf nicht unterstellt werden. Für andere Editor-Agents dokumentiert `.github/copilot-instructions.md` dieselben Regeln.

Das gesamte UI UX Pro Max-Tooling wird weiterhin nicht vendort. Apple Design liegt dagegen als geprüfte, versionsgebundene Textreferenz einschließlich Lizenz im Repository.

Keine neue Produktions-/Runtime-Abhängigkeit; keine fremden Fonts, Design-Recommender, AI-Agenten oder Skripte im deployten GitHub-Pages-Bundle. Alle Eingaben und Kundendaten bleiben local-first.

## Review

Bei Änderungen an Apple Design die Upstream-Version erneut prüfen und nicht stillschweigend `main` nachladen. Konflikte nach Prioritätsregel auflösen. Bei echtem UI-Refactoring die vorhandenen Browser-, Tastatur-, Mobile- und Reduced-Motion-Tests ausführen und um Reduced Transparency/Kontrast prüfen.
