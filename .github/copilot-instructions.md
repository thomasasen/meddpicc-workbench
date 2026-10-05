# MEDDPICC Workbench — Copilot Instructions

Use the repository documentation as the source of truth before generating code.

## Required reading for implementation tasks

- `README.md`
- `docs/PROJECT_CHARTER.md`
- `docs/ARCHITECTURE.md`
- `docs/PROJECT_FILE_SPEC.md`
- `docs/DESIGN_SYSTEM.md` for UI/UX changes
- `AGENTS.md` for repository-wide engineering constraints

## Product constraints

MEDDPICC Workbench is local-first and deterministic.

Do not introduce a mandatory backend, runtime AI dependency, silent cloud sync, analytics that can receive opportunity content, or a second canonical datastore beside the `.meddpicc` project file.

Do not expand the project into a general CRM.

## UI/UX constraints

For UI work, follow `docs/DESIGN_SYSTEM.md` and the project skill at `.agents/skills/meddpicc-ui-ux/SKILL.md`.

The project uses `nextlevelbuilder/ui-ux-pro-max-skill` as an external development/design reference only. It is not an application dependency. Details and pinned upstream reference: `docs/UI_UX_REFERENCE.md`.

Prefer:

- accessible enterprise workbench patterns
- minimal/Swiss information hierarchy
- data-dense but readable layouts
- overview → drill-down navigation
- semantic status labels plus icons and restrained color
- responsive tables/forms
- keyboard-first operability

Avoid:

- glassmorphism and decorative effects
- marketing landing-page patterns inside the application
- color-only status meaning
- excessive animation
- external web fonts/CDN assets by default
- unnecessary charts or gauges

## Vue conventions

Prefer Vue 3 Composition API, `<script setup lang="ts">`, typed props/emits, Pinia for genuinely shared state, Vue Router for navigation, and pure domain services for calculations and rules.

Keep methodology and business logic out of presentation components.
