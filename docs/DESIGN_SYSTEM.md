# MEDDPICC Workbench Design System

## 1. Product design goal

MEDDPICC Workbench is an operational tool for complex B2B sales opportunities.

The interface must optimize for:

- fast orientation
- reliable distinction between evidence and assumption
- dense but readable information
- efficient editing
- visible risks and gaps
- clear next actions
- repeatable deal reviews

It should look and behave like a serious enterprise workbench, not a marketing website.

## 2. Design direction

The design combines four influences:

1. **Accessible & Ethical** — clarity, semantic controls, inclusive interaction
2. **Minimal / Swiss** — strong hierarchy, restrained decoration, consistent grid
3. **Data-Dense Dashboard** — efficient use of screen space for complex opportunities
4. **Drill-Down Analytics** — summary first, detail and evidence on demand

These influences were selected with help from the external reference documented in `UI_UX_REFERENCE.md`.

### Desired character

- calm
- precise
- professional
- trustworthy
- analytical
- compact
- predictable

### Avoid

- glassmorphism
- neon or "AI" gradients
- decorative 3D effects
- marketing hero patterns inside the application
- unnecessary animations
- excessive card nesting
- oversized whitespace that reduces information density
- status encoded only by red/amber/green
- charts used merely for visual decoration

## 3. Information architecture

The opportunity is always the primary context.

Recommended application structure:

```text
Application shell
├── Opportunity header
│   ├── Account / opportunity name
│   ├── value
│   ├── forecast category
│   ├── target close
│   ├── target go-live
│   └── save/dirty state
├── Primary navigation
│   ├── Overview
│   ├── MEDDPICC sections
│   ├── Evidence
│   ├── Risks
│   ├── Actions
│   ├── Tools
│   ├── History
│   └── Export
└── Work area
```

Default interaction model:

**Overview → MEDDPICC area → qualification statement/process item → evidence/source**

The user should not lose the opportunity context while drilling down.

## 4. Layout

### Desktop

Baseline:

- top opportunity bar: approximately 56–64 px
- left navigation: approximately 232–248 px
- main content: fluid
- compact 8/12-column content grids where useful
- page padding: 20–24 px on large screens
- panel gaps: 12–16 px

The exact dimensions become tokens during implementation. Avoid arbitrary per-component spacing.

### Medium widths

- reduce navigation width or use compact labels
- allow cards/panels to move from 3 → 2 → 1 columns
- preserve full status labels where possible

### Small screens

- sidebar becomes an accessible drawer or compact navigation
- primary content stacks vertically
- tables may scroll horizontally when that is clearer than transforming the data
- key opportunity identity and save state remain accessible

Test around:

- 375 px
- 768 px
- 1024 px
- 1440 px

## 5. Spacing and shape

Use a 4 px base spacing system.

Suggested tokens:

```text
space-1   4px
space-2   8px
space-3  12px
space-4  16px
space-5  20px
space-6  24px
space-8  32px
space-10 40px
```

Default corner radius should be restrained:

- inputs/buttons: 6 px
- panels/cards: 8 px
- pills only for true compact categorical/status content

Avoid turning every label into a rounded pill.

## 6. Typography

Use a local/system font strategy.

Default UI stack:

```css
font-family:
  ui-sans-serif,
  system-ui,
  -apple-system,
  BlinkMacSystemFont,
  "Segoe UI",
  sans-serif;
```

Use `ui-monospace` only for IDs, schema/version data, formulas, or technical values where monospace improves scanning.

Suggested hierarchy:

- page title: 24–28 px / 600–700
- section title: 18–20 px / 600
- card/panel title: 15–16 px / 600
- body/input: 14–16 px / 400–500
- compact metadata: 12–13 px / 500

Do not use tiny 10–11 px text to create artificial density.

Long German/English labels must wrap safely.

## 7. Color model

Use a neutral base plus one restrained application accent and semantic status colors.

Initial light-theme direction:

```text
background       #F6F8FB
surface          #FFFFFF
surface-muted    #F1F4F8
text             #172033
text-muted       #5F6B7A
border           #D7DEE7
accent           #2563EB
accent-strong    #1D4ED8
focus            #2563EB
```

These are baseline tokens, not a license to hardcode colors throughout components.

### Semantic states

Suggested baseline:

```text
Confirmed    green family
Partial      amber family
Assumption   violet family
Unknown      neutral/slate family
Risk         red family
Information  blue family
```

Every semantic state must also have a text label and/or icon.

Never use green/red alone to distinguish meaning.

## 8. MEDDPICC status language

Use a stable vocabulary throughout the product.

Preferred primary states:

- **Confirmed**
- **Partial**
- **Assumption**
- **Unknown**
- **Risk**

Where the product uses more precise evidence classifications, preserve those distinctions in detail views.

Do not label a deal as "healthy" solely because its average score is high.

A confidence score represents qualification/evidence confidence, not probability of winning.

## 9. Dashboard

The Overview page should prioritize action over decoration.

Recommended order:

1. opportunity identity / commercial context
2. critical gaps and risks
3. next actions
4. MEDDPICC status summary
5. process/close-date warnings
6. supporting value/business-case summary
7. recent meaningful changes

Avoid a screen filled with equally weighted KPI cards.

### MEDDPICC summary

A compact list or bullet-style comparison is preferred over a radar/spider chart.

Example:

```text
Metrics            Confirmed   7/10 evidence confidence
Economic Buyer     Partial     5/10 evidence confidence
Decision Criteria  Confirmed   8/10 evidence confidence
Paper Process      Risk        3/10 evidence confidence
```

The label/state is primary. The numeric confidence is secondary and must be explainable.

## 10. Cards and panels

Use cards only when they create meaningful grouping.

Avoid "card inside card inside card".

A standard panel should contain:

- concise title
- optional status/metadata
- primary content
- actions aligned consistently
- no decorative icon unless it improves recognition

Use borders/background hierarchy before heavy shadows.

## 11. Forms

MEDDPICC data is complex; forms must remain calm.

Rules:

- label every input visibly
- group fields by meaning, not database structure
- explain uncommon fields with short helper text
- clearly distinguish optional from required
- show validation beside the field/problem
- preserve input after errors
- use appropriate native input types
- allow unknown/not-yet-known instead of forcing false precision
- confirmations that convert assumption → evidence should make the semantic change explicit

Avoid giant single-page forms containing every MEDDPICC element.

## 12. Evidence UI

Evidence is a first-class object and should look different from conclusions.

An evidence record should make it easy to scan:

- classification
- statement
- source/person
- role
- date
- context/reference
- linked MEDDPICC areas

When displaying a qualification conclusion, provide a clear route to its supporting evidence.

Assumptions should never visually resemble confirmed evidence.

## 13. Risks and actions

Risk rows/cards should show:

- severity
- concise title
- impact
- related MEDDPICC area/process
- status
- mitigation/next action when present

Next actions should show:

- action
- owner
- due date if known
- related gap
- desired evidence/outcome

Use severity/order to prioritize; do not make every warning visually critical.

## 14. Tables

Tables will be common in Evidence, Risks, Actions, Criteria, History, and Process areas.

Rules:

- explicit headers
- meaningful alignment
- numbers aligned consistently
- sorting only where useful
- expose sort state semantically
- visible selected/focused rows
- wrap long business text
- provide accessible full value if truncation is unavoidable
- support horizontal overflow instead of clipping
- keep row actions discoverable by keyboard and touch

For very narrow screens, choose deliberately between scrollable table and a structured record list.

## 15. Decision and Paper Process visualization

Use a process/timeline view only when it improves dependency understanding.

Every visual step must have a corresponding textual representation containing:

- title
- owner
- status
- planned/confirmed date
- duration
- dependencies
- evidence
- risk/gap

Do not make drag-and-drop the only way to modify or reorder process steps.

## 16. Charts and calculations

Prefer direct values and tables whenever precision matters.

Recommended:

- bullet/progress comparisons for multiple confidence/evidence measures
- horizontal bars for category comparison
- line charts for genuine time-series data
- timeline/Gantt-like representation for process dependencies
- simple waterfall only if a value bridge truly needs it

Avoid by default:

- radar/spider charts
- gauges
- donut charts for precise comparisons
- 3D charts
- decorative heat maps

Charts must:

- have a text/table alternative for material information
- not rely on color alone
- support keyboard access when interactive
- expose the same important detail without hover

## 17. Interaction and motion

Motion should explain state change, not decorate the application.

- fast, restrained transitions
- no perpetual motion except meaningful progress/loading indicators
- respect `prefers-reduced-motion`
- never delay a task for animation
- avoid animated score theatrics

## 18. Icons

Use one consistent SVG icon family.

Requirements:

- icons are supplementary to text for important actions/statuses
- icon-only buttons require accessible names/tooltips where appropriate
- no emoji as application navigation/status icons
- bundle icons with the app; avoid remote runtime assets

## 19. Accessibility baseline

Minimum expectations:

- semantic landmarks
- logical heading order
- keyboard complete
- visible focus
- correctly associated labels
- accessible errors
- correct button/link semantics
- sufficient contrast
- no color-only meaning
- reduced-motion support
- no hover-only essential content
- responsive at zoom/text scaling
- dialog focus management
- charts with non-visual alternatives

## 20. Privacy and external assets

The interface must respect the project's local-first architecture.

Default rules:

- no Google Fonts request
- no CDN JavaScript
- no remote icon library at runtime
- no analytics/tracking scripts that can receive opportunity context
- no automatic fetch of URLs stored inside `.meddpicc` files

If external runtime resources are ever proposed, they require explicit architectural and privacy review.

## 21. Design tokens

When implementation starts, create central tokens for at least:

- colors
- spacing
- typography
- radii
- borders
- focus ring
- control heights
- sidebar/header dimensions
- z-index layers
- motion durations

Components must consume tokens rather than create isolated visual constants.

## 22. UI quality checklist

Before merging a UI change:

- [ ] The opportunity context remains clear.
- [ ] The most important gap/action is easy to find.
- [ ] Confirmed/Partial/Assumption/Unknown/Risk are not color-only.
- [ ] Keyboard navigation works.
- [ ] Focus is visible.
- [ ] Long labels and values do not break the layout.
- [ ] 375/768/1024/1440-width behavior was considered/tested.
- [ ] Zoom/text scaling does not clip essential content.
- [ ] Any chart is justified and has a non-visual alternative.
- [ ] Motion respects reduced-motion settings.
- [ ] No unnecessary runtime network dependency was introduced.
- [ ] The screen looks like one product, not a collection of unrelated components.
