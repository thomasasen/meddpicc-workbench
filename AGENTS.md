# Agent Instructions

These instructions apply to the entire MEDDPICC Workbench repository.

## Product intent

MEDDPICC Workbench is a local-first browser application for rigorous MEDDPICC opportunity qualification and deterministic deal-planning utilities.

The product must reduce repetitive sales work without replacing seller judgment.

Before implementing a feature, read:

1. `README.md`
2. `docs/PROJECT_CHARTER.md`
3. `docs/ARCHITECTURE.md`
4. `docs/PROJECT_FILE_SPEC.md`
5. `docs/DESIGN_SYSTEM.md` for any UI/UX work

## Non-negotiable architecture rules

- The portable `.meddpicc` project file is the canonical opportunity state.
- Do not introduce a mandatory backend.
- Do not introduce runtime AI/LLM dependencies.
- Do not upload or sync opportunity/project content by default.
- Do not turn the application into a CRM, email client, calendar, or pipeline-management suite.
- Deterministic calculations and qualification rules belong in domain services, not hidden in UI components.
- Assumptions, unknowns, customer statements, interpretations, and confirmed evidence must remain distinguishable.
- Unknown is a valid state.
- Any schema change requires compatibility and migration consideration.

## UI/UX instruction

For any task that creates or changes screens, navigation, forms, tables, charts, status indicators, responsive behavior, or interaction patterns:

1. Read and follow `docs/DESIGN_SYSTEM.md`.
2. Use the local skill `.agents/skills/meddpicc-ui-ux/SKILL.md` as the UI/UX implementation checklist.
3. Treat `nextlevelbuilder/ui-ux-pro-max-skill` as a **development reference**, not a runtime dependency.
4. When consulting that upstream project, prefer the pinned reference documented in `docs/UI_UX_REFERENCE.md`.
5. Do not copy upstream datasets or large bodies of text into this repository unless there is a specific reviewed need and license notices are preserved.

The MEDDPICC-specific design system takes precedence over generic upstream style recommendations.

## Design direction

The default product direction is:

- professional B2B/enterprise workbench
- minimal and information-dense
- influenced by accessible/ethical, Swiss/minimal, data-dense dashboard, and drill-down patterns
- neutral surfaces with restrained semantic color
- strong information hierarchy
- little decorative motion
- no glassmorphism, neon gradients, marketing-style hero layouts, or decorative dashboard clutter in the working application

## Accessibility

Accessibility is a baseline requirement, not a later polish step.

- Use semantic HTML.
- All functions must be keyboard-operable.
- Show visible focus.
- Do not encode meaning with color alone.
- Respect `prefers-reduced-motion`.
- Maintain readable contrast.
- Charts require an accessible textual/table representation when they convey material information.
- Interactive controls need accessible names and appropriate state semantics.

## Privacy-sensitive UI rules

- Do not load fonts, scripts, icons, analytics, or other assets from third-party CDNs in production without explicit architectural review.
- Prefer bundled assets and system fonts.
- Do not add telemetry that could receive project content.
- External URLs contained in a project file are data only and must never trigger automatic requests.

## Implementation quality

- Prefer Vue 3 Composition API with `<script setup lang="ts">`.
- Keep shared state in Pinia when it is genuinely cross-view.
- Use computed state for derived UI values.
- Keep domain calculations pure and testable.
- Prefer native semantic controls over clickable `div` elements.
- Add tests for deterministic rules and regression fixes.
- Test responsive behavior at representative widths around 375, 768, 1024, and 1440 px.
- Avoid magic spacing values; use design tokens.

## Review questions

Before considering UI work complete, verify:

- Is the most important deal information visible without hunting?
- Can evidence be distinguished from assumption at a glance and by text/icon, not only color?
- Can the task be completed with a keyboard?
- Does the UI still work with longer German/English labels?
- Does it work at browser zoom/text scaling without clipping?
- Is every chart actually more useful than a table or direct number?
- Did this change add any unnecessary runtime network dependency?
- Does the design stay consistent with `docs/DESIGN_SYSTEM.md`?
