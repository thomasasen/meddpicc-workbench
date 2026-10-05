# MEDDPICC Workbench

A local-first browser application for managing and qualifying complex B2B sales opportunities with MEDDPICC.

The core idea is simple: **the project file is the source of truth**. The application opens a portable `.meddpicc` file, helps the user structure and evaluate the opportunity with deterministic tools, and saves the updated project back to that file. No AI, backend, account, or external database is required at runtime.

> **Project status:** foundation / pre-alpha. The repository currently defines the product scope, architecture, project-file concept, UI/UX system, and implementation roadmap. The application itself is not implemented yet.

## Why this project exists

MEDDPICC is useful because it forces sellers to separate what they know from what they merely assume. In practice, however, good qualification creates repetitive work: maintaining evidence, reconstructing decision and paper processes, recalculating business cases, tracking gaps, planning backwards from a target go-live, and preparing deal reviews.

MEDDPICC Workbench is intended to remove that administrative friction without replacing seller judgment.

It should answer four questions at any point in a deal:

1. **What do we actually know?**
2. **What is still assumption or unknown?**
3. **Which gaps or risks matter?**
4. **What is the next concrete action to improve qualification?**

## Product concept

A seller creates or opens one opportunity project:

```text
ACME CRM Transformation.meddpicc
        ↓
MEDDPICC Workbench
        ↓
Dashboard + MEDDPICC modules + deterministic utilities
        ↓
Updated .meddpicc project file
        ↓
Stored alongside the opportunity, e.g. in a CRM
```

The application should be usable directly through GitHub Pages and run entirely in the browser.

## Core principles

- **Local first** — project data is processed in the browser.
- **No AI at runtime** — all qualification logic, calculations, checks, and exports are deterministic.
- **No backend required** — GitHub Pages can host the complete application.
- **Portable project files** — one `.meddpicc` file contains the reusable opportunity state.
- **Evidence over optimism** — assumptions must never look like confirmed facts.
- **Gaps become actions** — missing qualification should produce a clear next step.
- **One data model** — every module reads and writes the same project state.
- **CRM companion, not CRM replacement** — the Workbench manages MEDDPICC depth, not the entire sales process.
- **Backward compatible files** — schema versioning and migrations are first-class requirements.
- **Accessible by design** — keyboard, focus, contrast, responsive behavior, and non-color-only status semantics are baseline requirements.

## Planned workspace

### Project

- Opportunity metadata
- Deal-health overview
- Evidence register
- Risks
- Next actions
- Change history

### MEDDPICC

- Metrics
- Economic Buyer
- Decision Criteria
- Decision Process
- Paper Process
- Identify / Implicate Pain
- Champion
- Competition

### Deterministic utilities

- Metrics and value calculator
- ROI and payback calculator
- Cost-of-delay calculator
- Go-live / critical-path planner
- Closing checklist
- Confidence / evidence scoring
- Decision-criteria matrix
- Champion evidence check

### Output

- Executive deal review
- Manager deal review
- MEDDPICC summary
- Customer-facing go-live plan
- CRM-ready summary
- JSON/`.meddpicc` export

## What a project file should contain

A `.meddpicc` project is planned as human-readable JSON with its own file extension. It will hold:

- project metadata
- all MEDDPICC elements
- structured evidence and source references
- assumptions and unknowns
- risks and qualification gaps
- next actions
- business-case inputs and calculated outputs
- decision and paper-process steps
- go-live planning data
- scoring results
- project history
- schema and application version metadata

The first version will deliberately avoid embedded binary attachments. Documents can be referenced by title, CRM ID, URL, or other metadata without making the project file unnecessarily large.

See [Project File Specification](docs/PROJECT_FILE_SPEC.md).

## Intended architecture

The planned technical baseline is:

- Vue 3
- TypeScript
- Vite
- Pinia
- Vue Router
- schema validation for `.meddpicc` files
- Vitest for unit tests
- Playwright for key browser flows
- GitHub Actions for build/test/deploy
- GitHub Pages for hosting

Browser storage may be used for recovery or convenience, but must never silently replace the project file as the canonical state.

See [Architecture](docs/ARCHITECTURE.md).

## UI/UX engineering

The application has a repository-specific design system before implementation begins.

The visual direction is deliberately **enterprise-workbench**, not marketing-SaaS:

- accessible and semantic
- minimal / Swiss-style hierarchy
- data-dense but readable
- overview → drill-down → evidence
- restrained semantic color
- minimal decorative motion
- system/local fonts and bundled assets
- no color-only MEDDPICC status meaning

The project uses [UI UX Pro Max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) as an **external development reference only**. It is not part of the production runtime.

Repository guidance for coding assistants is provided through:

- `AGENTS.md`
- `.github/copilot-instructions.md`
- `.agents/skills/meddpicc-ui-ux/SKILL.md`

See [Design System](docs/DESIGN_SYSTEM.md) and [UI/UX Development Reference](docs/UI_UX_REFERENCE.md).

## Scope boundaries

MEDDPICC Workbench is **not** intended to become:

- a CRM
- an email client
- a calendar
- a contact database
- a pipeline-management system
- a generative-AI sales assistant
- a cloud repository for customer data

Keeping these boundaries is important. The product should remain a focused qualification and deal-planning companion.

## Roadmap

The implementation is split into small, testable phases:

1. Project foundation, design system, and technical skeleton
2. `.meddpicc` file lifecycle and schema validation
3. Dashboard, evidence, risks, actions, and history
4. Core MEDDPICC modules
5. Deterministic utilities
6. Exports and CRM handoff
7. Hardening, accessibility, offline support, and migrations

See the detailed [Roadmap](docs/ROADMAP.md).

## Documentation

- [Project Charter](docs/PROJECT_CHARTER.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Project File Specification](docs/PROJECT_FILE_SPEC.md)
- [Design System](docs/DESIGN_SYSTEM.md)
- [UI/UX Development Reference](docs/UI_UX_REFERENCE.md)
- [Roadmap](docs/ROADMAP.md)
- [Contributing](CONTRIBUTING.md)
- [Security & Privacy](SECURITY.md)
- [Agent Instructions](AGENTS.md)

## Methodology and content

This project implements general MEDDPICC qualification concepts as structured software workflows. The implementation should use original wording and deterministic rules. It must not reproduce copyrighted book text, proprietary training material, or third-party course content.

The application is an independent open-source project and is not presented as an official MEDDPICC training product or as being affiliated with any methodology provider or author.

## License

MIT. See [LICENSE](LICENSE).
