# Qualitätssicherung und Red-Team: Apple-Design-Integration

**Stand:** 05.11.2026

**Gegenstand:** PR #83, Branch `docs/apple-design-priority-2026-11`

**Umfang der hier dokumentierten ersten Runde:** Anweisungs-/Dokumentationsintegration. Später hinzugefügte Anwendungscode-Änderungen und ihre eigenständige Laufzeitprüfung sind in `APPLE_DESIGN_IMPLEMENTATION_QA_2026-11-05.md` dokumentiert.

## Methode

Zwei voneinander getrennte Prüfrollen als **simuliertes Red-Team-Review** (kein extern beauftragtes Team):

- **Qualitätssicherung:** GitHub-PR-Diff und Referenzen vergleichen, Upstream-Provenienz/Lizenz prüfen, normative Dokumente gegeneinander abgleichen, Text-/Markdown-Integrität sowie Zielpfade überprüfen.
- **Red-Team:** widersprüchliche Anweisungen erzwingen, Worst-Case-Anwendung der Apple-Beispiele simulieren, fehlende Browser-Funktionen, Accessibility, Performance und veraltete Produktannahmen gezielt testen.

Die in diesem Dokument beschriebenen Prüfungen sind dokumentarisch/statisch. Sie ersetzen keine Tests einer späteren UI-Implementierung.

## Befunde und Korrekturen

| Priorität | Red-Team-Szenario / Befund | Korrektur |
| --- | --- | --- |
| Hoch | Copilot fordert weiterhin eine Deal-Reasoning-Workbench und eine zentrale `.meddpicc`-Datenquelle; Codex könnte daraus CRM-/Opportunity-Pflege ableiten. | Copilot auf Tools/Checklists/Knowledge und optionale Legacy-Projektdateien umgestellt. |
| Hoch | UI-Skill fordert eine dauerhaft geladene Opportunity im Application Chrome und nennt Legacy-Qualifizierungsworkflows als Standard. | Vorgabe auf aktuellen Tool-/Checklist-/Knowledge-Kontext korrigiert; Beispiele aktualisiert. |
| Mittel | Apple-Original fordert pauschal transluzente Navigation, während das Designsystem nur funktionale Transparenz erlaubt. Unkontrollierte Anwendung würde Kontrast verschlechtern. | Lokale Skill-Kopie auf **tatsächlich schwebende** Oberflächen präzisiert, deckender Fallback gefordert. |
| Mittel | Spring-Codebeispiel mit `motion`/Framer Motion könnte als Aufforderung zur Installation im Vue-Projekt verstanden werden. | Illustrative API ausdrücklich als **keine neue Abhängigkeit** gekennzeichnet. |
| Mittel | `prefers-reduced-transparency` ist nicht überall unterstützt; alleiniges Vertrauen darauf könnte Transparenz- und Kontrastprobleme erzeugen. | Opaquer Basisstil, progressive Enhancement und Browser-Fallback als verbindliche Anforderungen. |
| Niedrig | Formulierungsfehler „dürfen/transparente“ im Designsystem. | Bereinigt. |
| Niedrig | „Apple Design“ könnte fälschlich als offizielle Apple-Spezifikation gelten; tatsächlich handelt es sich um eine Community-Aufbereitung. | Urheberschaft und Abgrenzung in Referenzdoku konkretisiert. |
| Niedrig | Dokumentation behauptet, Codex lade die Skills automatisch. | Auf Auffindbarkeit plus explizite Referenz in `AGENTS.md` präzisiert. |

## Angriffsszenarien (Abnahmematrix)

| Szenario | Erwartetes Verhalten des Coding-Agents |
| --- | --- |
| „Gib jeder Toolbar Glassmorphism“ | Für schwebende Flächen nur mit belegtem Hierarchienutzen; normale Navigation darf opak bleiben. |
| „Installiere Framer Motion für einen Button“ | Keine neue Abhängigkeit ohne konkreten Nutzen und Vue-Kompatibilität; native Controls bleiben erhalten. |
| „Auf Knopfdruck sofort die Aktion auslösen“ | Sofortige visuelle Rückmeldung, eigentliche Aktion regulär bei Commit/Click; Abbruch sowie Tastaturzugang bleiben möglich. |
| „Ziehe Karten mit einer CSS-Keyframe-Animation“ | Direktmanipulation folgt Pointer 1:1; jederzeit umkehrbar und tastaturäquivalent. |
| „Nur `prefers-reduced-transparency` reicht“ | Solid/lesbar ohne diese Media Query, dann optionale transparente Verbesserung. |
| „Schritt soll einen Opportunity-Score pflegen“ | Abweisen: Microtool-/Checklist-Modell statt persistiertem Deal-Scoring. |
| „Der User will schöne animierte Charts“ | Nur visualisieren, wenn ein fachlicher Mehrwert gegenüber Tabelle/zahl vorhanden ist, inklusive Textalternative. |
| „Animation darf während laufender Aktion keine Eingaben annehmen“ | Keine erzwungene Eingabesperre für reversible Übergänge; sichere fachliche Sperren (z. B. gegen Doppelsubmits) sind weiterhin zulässig. |

## Abnahmebedingungen

1. `AGENTS.md`, Copilot-Instruktionen, beide lokalen Skills, `docs/DESIGN_SYSTEM.md` und `docs/UI_UX_REFERENCE.md` bilden eine einheitliche Prioritätsregel ab.
2. Die lokale Apple-Skill-Kopie enthält die 17 fachlichen Kapitel; die Upstream-Erstantwortanweisung ist entfernt; MIT-Lizenz und Commit-Provenienz sind enthalten.
3. Das aktuelle Tools/Checklists/Knowledge-Modell hat fachlichen Vorrang; keine verpflichtenden Deal-/Opportunity-Entitäten in normativen UI-Anweisungen.
4. Direkte Manipulation, unterbrechbare Animation und Materialtiefe werden sachgerecht angewendet und benötigen keine neue Produktionsabhängigkeit.
5. Accessibility-Fallbacks (Tastatur, Reduced Motion, Reduced Transparency, höherer Kontrast) sowie local-first bleiben verbindlich.
6. In der ersten dokumentarischen Prüfrunde wurden keine Vue-/CSS-/Runtime-Dateien geändert. Die **anschließend implementierten UI-Änderungen** haben separate Regressionstests und eine erfolgreiche GitHub-CI erhalten.

## Verifikation und Grenzen

- Die PR-Dateien und Originalquellen werden nach den Korrekturen erneut abgerufen; Überschneidungen, Links, Lizenzhinweise und Markdown-Grundstruktur statisch geprüft.
- Für die **ursprüngliche Dokumentations-QS** waren keine Browser-, Unit- oder Build-Tests nötig. Anschließend wurde die UI tatsächlich angepasst und über GitHub-CI überprüft: **356 Vitest bestanden, 247 Playwright bestanden, 1 übersprungen**, Format, Lint, Build und Pages-Integrität grün ([CI-Lauf](https://github.com/thomasasen/meddpicc-workbench/actions/runs/42019174928)). Diese Tests ersetzen keine manuelle visuelle Abnahme.
- Die tatsächliche Umsetzung (u. a. Reverse-Timeline-Drag mit kontinuierlicher Pointer-Führung) wurde anschließend auf demselben PR-Branch ergänzt. Bestehende Responsive-/Tastatur- und neue Reduced-Motion-/Kontrast-Tests sind grün. Manuelle Sichtung der generierten Screenshots sowie ein eigenständiges Performance-Profiling bleiben gesonderte Aufgaben.
- Die ergänzenden UI-Implementierungen und ihre separaten Laufzeit-Prüfkriterien stehen in `docs/APPLE_DESIGN_IMPLEMENTATION_QA_2026-11-05.md`; der ursprüngliche dokumentarische QA-Nachweis allein belegt keine UI-Freigabe.
- Dieser PR bleibt bis zur UI-Freigabe ungemergt; `main` wird nicht verändert.
