# UI/UX Development Reference

## Purpose

MEDDPICC Workbench uses **UI UX Pro Max** by NextLevelBuilder as an external development reference for UI/UX design and implementation reviews.

Repository:

`nextlevelbuilder/ui-ux-pro-max-skill`

The upstream project is **not** a runtime dependency of MEDDPICC Workbench.

## Reviewed upstream snapshot

The initial design-system decisions in this repository were informed by:

- upstream version metadata: **2.13.0**
- upstream `main` commit reviewed: `477bcb28c9812b385cb51a4605ddf30d7b2266e2`
- license: MIT

Pinning the reviewed commit makes our design provenance reproducible. A future review may update this reference after checking upstream changes.

## Why we use it

The upstream project contains structured guidance for:

- Vue
- accessibility
- forms and interaction
- responsive behavior
- data-dense dashboards
- drill-down analytics
- chart selection
- typography and color systems
- UI anti-patterns

These are useful during development because MEDDPICC Workbench combines dense opportunity data, structured forms, evidence tables, timelines, statuses, and management dashboards.

## What we use from it

We use its guidance as **design intelligence**, especially around:

1. Vue 3 implementation practices
2. accessible semantic controls
3. keyboard/focus behavior
4. responsive layouts
5. information-dense enterprise dashboards
6. drill-down navigation
7. chart and data-table accessibility
8. avoiding color-only meaning

The resulting MEDDPICC-specific rules are maintained in `docs/DESIGN_SYSTEM.md`.

## What we deliberately do not adopt

Generic recommendations are never automatically authoritative.

For example, upstream SaaS recommendations may include visual styles that are inappropriate for this product. MEDDPICC Workbench deliberately avoids:

- glassmorphism as a primary app style
- decorative gradients
- marketing hero layouts in the working application
- excessive micro-animation
- external Google Fonts at runtime
- visual complexity that reduces deal-review speed

The project design system always has precedence.

## Useful upstream locations

At the pinned commit, the most relevant source areas are:

- `src/ui-ux-pro-max/data/stacks/vue.csv`
- `src/ui-ux-pro-max/data/styles.csv`
- `src/ui-ux-pro-max/data/products.csv`
- `src/ui-ux-pro-max/data/charts.csv`
- `.claude/skills/ui-ux-pro-max/references/quick-reference.md`
- `src/ui-ux-pro-max/templates/platforms/codex.json`

## Agent integration

The upstream project supports Codex skills under `.agents/skills/`.

Rather than vendoring the full upstream skill, this repository provides a focused local skill:

`.agents/skills/meddpicc-ui-ux/SKILL.md`

That skill contains only the MEDDPICC Workbench-specific workflow and points back to this document for external reference provenance.

We also maintain:

- `AGENTS.md`
- `.github/copilot-instructions.md`

This keeps the design constraints visible to multiple coding-assistant workflows.

## Runtime boundary

UI UX Pro Max must not be imported into the production bundle merely to provide development guidance.

No Python search engine, AI agent, design recommender, or remote UI UX Pro Max service is required for the deployed application.

The finished GitHub Pages application remains deterministic and local-first.

## License and attribution

UI UX Pro Max is licensed under the MIT License by Next Level Builder.

At the time of this integration, no substantial upstream source or dataset is copied into MEDDPICC Workbench. We therefore reference the upstream repository and its license rather than vendoring its files.

If substantial upstream code or data is copied in the future, the contributor must preserve the required MIT copyright and permission notice and document the copied scope.
