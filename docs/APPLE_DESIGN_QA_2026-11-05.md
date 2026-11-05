# Qualitätssicherung und Red-Team: Apple-Design-Integration

**Stand:** 05.11.2026

**Gegenstand:** PR #83, Branch `docs/apple-design-priority-2026-11`

**Umfang:** Anweisungs-/Dokumentationsintegration, keine Anwendungscode-Änderungen.

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
6. Keine Vue-/CSS-/Runtime-Datei wird in diesem PR geändert; seine Integration verursacht daher keine unmittelbare UI-Regression.

## Verifikation und Grenzen

- Die PR-Dateien und Originalquellen werden nach den Korrekturen erneut abgerufen; Überschneidungen, Links, Lizenzhinweise und Markdown-Grundstruktur statisch geprüft.
- Es wurden **keine** Browser-, Unit-, Build- oder Performance-Tests am neuen Design durchgeführt: Der PR ändert nur Agent-Instruktionen und Dokumentation, **nicht** die Anwendung. Bestehende UI-Tests beweisen keine zukünftige Apple-Design-Umsetzung.
- Die tatsächliche Umsetzung (z. B. Reverse-Timeline-Drag mit kontinuierlicher Pointer-Führung) benötigt einen separaten Code-PR mit Playwright-Tests bei ca. 375/768/1024/1440 px sowie Tastatur-, Reduced-Motion-, Transparenz-/Kontrast- und Performance-Prüfung.
- Dieser PR bleibt als **Draft** geöffnet; `main` wird nicht verändert.
