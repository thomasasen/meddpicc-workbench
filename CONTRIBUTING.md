# Contributing

MEDDPICC Workbench is intended to remain a focused, local-first qualification tool. Contributions should preserve that product direction.

## Before implementing a feature

A change should answer at least one of these questions:

- Does it reduce repetitive qualification/deal-planning work?
- Does it improve the reliability of evidence and qualification state?
- Does it make a project easier to reopen, review, or hand off?
- Does it help expose a real gap, risk, dependency, or next action?

If not, it may belong outside the core product.

Before coding, read `AGENTS.md`. For UI/UX changes also read `docs/DESIGN_SYSTEM.md`.

## Architecture constraints

Do not introduce:

- a mandatory backend
- mandatory user accounts
- runtime AI dependencies
- telemetry that can receive opportunity content
- silent upload/sync of project files
- a second canonical datastore beside the `.meddpicc` file

Browser storage is permitted only for recovery, preferences, or explicitly documented convenience features.

## Development workflow

Recommended workflow:

1. Create a focused branch.
2. Keep commits small and descriptive.
3. Add or update tests for domain behavior.
4. Update schema/migration documentation when file structure changes.
5. For UI changes, validate against the design-system checklist.
6. Open a pull request describing behavior and compatibility impact.
7. Do not merge with failing tests.

## Commit style

Use clear conventional-style prefixes where practical:

```text
feat:
fix:
docs:
test:
refactor:
build:
ci:
chore:
```

## Project-file compatibility

Changes to the `.meddpicc` schema require special care.

A pull request changing persisted data should document:

- old schema version
- new schema version
- whether change is patch/minor/major
- migration behavior
- fixture/test changes
- data-loss risk
- downgrade behavior, if relevant

Never silently discard unknown compatible fields.

## Domain rules

Prefer pure functions for:

- calculations
- scoring
- gap detection
- date/dependency logic
- validation
- migration

UI components should not contain hidden methodology rules.

## UI/UX contributions

UI work must follow:

- `docs/DESIGN_SYSTEM.md`
- `.agents/skills/meddpicc-ui-ux/SKILL.md`
- repository-wide rules in `AGENTS.md`

The project uses `nextlevelbuilder/ui-ux-pro-max-skill` only as an external development reference. The reviewed upstream snapshot and usage boundaries are documented in `docs/UI_UX_REFERENCE.md`.

Do not add the upstream skill as a runtime dependency.

UI pull requests should consider:

- semantic HTML
- complete keyboard operation
- visible focus
- non-color-only status meaning
- responsive behavior around 375/768/1024/1440 px
- long German/English labels
- browser zoom and text scaling
- reduced motion
- chart/table accessibility
- local/bundled assets rather than external runtime fonts/scripts

## Methodology content

Use original wording.

Do not paste or reproduce copyrighted book passages, proprietary training slides, certification materials, or third-party course content into the repository.

General methodology concepts can be implemented as software behavior, but public documentation and UI copy should be independently written.

## Testing expectations

At minimum:

- deterministic calculations need unit tests
- schema changes need valid/invalid/migration fixtures
- file open/save needs browser-flow coverage
- meaningful UI workflows need keyboard/responsive checks
- bug fixes should receive a regression test when practical

## Security and privacy

Any feature that introduces a runtime network request involving project data requires explicit design review and documentation.

See [SECURITY.md](SECURITY.md).
