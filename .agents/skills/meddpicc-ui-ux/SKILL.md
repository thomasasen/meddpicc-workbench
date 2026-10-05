---
name: meddpicc-ui-ux
description: Apply the MEDDPICC Workbench design system and UI/UX quality rules when creating or reviewing screens, components, forms, tables, dashboards, charts, navigation, responsive behavior, or accessibility.
---

# MEDDPICC Workbench UI/UX Skill

Use this skill for every user-interface implementation or review in this repository.

## 1. Load project context

Read:

- `docs/DESIGN_SYSTEM.md`
- `docs/ARCHITECTURE.md`
- `docs/PROJECT_CHARTER.md`

If the task touches project-file content or evidence semantics, also read:

- `docs/PROJECT_FILE_SPEC.md`

## 2. Apply the product design model

Treat the product as an **enterprise sales workbench**, not a marketing site.

Primary design influences:

- Accessible & Ethical
- Minimalism / Swiss-style hierarchy
- Data-Dense Dashboard
- Drill-Down Analytics

The Workbench should feel calm, precise, professional, and operational.

Do not use decorative glassmorphism, neon/AI gradients, oversized marketing hero sections, parallax, decorative motion, or visually impressive charts that do not improve a sales decision.

## 3. Preserve MEDDPICC semantics

Qualification status must be understandable without color.

Use explicit labels/icons for:

- Confirmed
- Partial
- Assumption
- Unknown
- Risk

Do not turn evidence confidence into win probability.

Every derived warning or score should expose the underlying reason or input when practical.

## 4. Information architecture

Default hierarchy:

```text
Opportunity
├── Overview
│   ├── Deal health
│   ├── Critical gaps
│   ├── Risks
│   └── Next actions
├── MEDDPICC
│   ├── Metrics
│   ├── Economic Buyer
│   ├── Decision Criteria
│   ├── Decision Process
│   ├── Paper Process
│   ├── Pain
│   ├── Champion
│   └── Competition
├── Evidence
├── Risks
├── Actions
├── Tools
└── History / Export
```

Use overview → detail → evidence drill-down. Preserve context and make return navigation obvious.

## 5. Component rules

### Forms

- visible labels
- sensible grouping
- clear required/optional distinction
- validation next to the problem
- do not rely on placeholder text as a label
- preserve entered data on validation failure
- destructive actions require clear confirmation

### Tables

- keep column meaning explicit
- support horizontal overflow or responsive alternate layout instead of clipping
- sticky headers only when they materially help
- sorting must expose current sort state
- long account/person/document names must wrap or have an accessible full-value path
- provide useful empty states

### Status and badges

- text/icon + color
- never color alone
- do not overuse pills/badges
- keep status vocabulary stable across modules

### Dialogs and overlays

- trap and restore focus correctly
- Escape closes when safe
- do not obscure the user's current context unnecessarily
- avoid nested dialogs

### Navigation

- current section must be visually and programmatically identifiable
- keyboard navigation must work
- keep the loaded opportunity visible in the application chrome

## 6. Charts and visualizations

First ask: would a direct value, table, list, or timeline communicate this better?

Preferred cases:

- bullet/progress-style comparison for several evidence/confidence measures
- simple bars for comparisons
- timeline/process visualization for Decision/Paper/Go-Live dependencies
- line chart only for meaningful time-series data

Avoid defaulting to:

- gauges
- donut charts
- radar/spider charts
- 3D charts
- decorative heat maps

For material chart information, provide an accessible text/table alternative.

## 7. Accessibility review

Verify:

- semantic HTML
- keyboard reachability
- visible focus
- accessible names
- correct state attributes
- contrast
- no color-only meaning
- `prefers-reduced-motion`
- no hover-only information
- zoom/text scaling does not clip essential content
- touch targets remain usable
- errors are announced/associated with controls where appropriate

## 8. Responsive review

Check representative widths around:

- 375 px
- 768 px
- 1024 px
- 1440 px

Do not build a separate mobile product unless necessary. Prefer reflow:

- sidebar → drawer/compact navigation
- multi-column panels → stacked sections
- tables → scroll or deliberate responsive view
- action bars → wrap without losing labels

## 9. Vue implementation review

Prefer:

- Vue 3 Composition API
- `<script setup lang="ts">`
- computed values for derived UI
- Pinia only for shared application state
- route-level lazy loading where beneficial
- semantic native elements
- typed props and emits
- test behavior, not component internals

## 10. External UI/UX reference

The project may consult:

`nextlevelbuilder/ui-ux-pro-max-skill`

Use the pinned reference and provenance documented in `docs/UI_UX_REFERENCE.md`.

Useful upstream areas include:

- Vue stack guidance
- UX/accessibility rules
- data-dense dashboard patterns
- drill-down patterns
- chart selection/accessibility guidance

Do not copy the entire upstream skill into this repository. Do not add it as a production/runtime dependency.

## Definition of done

A UI change is not done until it is:

- consistent with `docs/DESIGN_SYSTEM.md`
- keyboard-operable
- responsive
- explicit about MEDDPICC status semantics
- free of unnecessary runtime network dependencies
- readable with realistic dense B2B data
- tested at least at the appropriate unit/component/browser level
