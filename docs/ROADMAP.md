# Roadmap

The roadmap prioritizes the portable project model before feature breadth. Every later tool depends on a trustworthy file lifecycle and shared domain model.

## Phase 0 — Foundation

**Goal:** create a stable development, design, and deployment baseline.

Deliverables:

- repository-wide agent instructions
- MEDDPICC Workbench design system
- local UI/UX development skill
- documented UI UX Pro Max reference/provenance
- Vue 3 + TypeScript + Vite application
- repository structure
- central design tokens
- formatting/linting
- Vitest
- Playwright baseline
- GitHub Actions CI
- GitHub Pages deployment
- minimal accessible application shell
- architecture decision on runtime schema validator
- first formal `.meddpicc` schema

Acceptance criteria:

- pull requests build and test automatically
- `main` deploys a static site
- application makes no opportunity-data network calls
- project schema has versioning and test fixtures
- application shell follows `docs/DESIGN_SYSTEM.md`
- core shell/navigation is keyboard-operable with visible focus
- status semantics are not encoded by color alone
- no external web font/CDN dependency is required for the UI

## Phase 1 — Project file lifecycle

**Goal:** reliably create, open, validate, migrate, edit, and save projects.

Deliverables:

- New Project flow
- Open Project flow
- validation errors
- unsupported-version handling
- migration framework
- dirty-state tracking
- Save As / download
- optional File System Access API enhancement
- crash/unsaved recovery design
- sanitized demo project

Acceptance criteria:

- valid file round-trips without data loss
- invalid file never partially loads
- unsupported future schema is not rewritten
- old supported fixture migrates deterministically
- user is warned before abandoning unsaved changes

## Phase 2 — Shared qualification model

**Goal:** implement the cross-cutting objects needed by all MEDDPICC areas.

Deliverables:

- project metadata
- evidence register
- references
- risks
- next actions
- history
- shared qualification status model
- dashboard summary

Acceptance criteria:

- one evidence item can support multiple qualification statements
- assumptions and unknowns are visually distinct from confirmed information
- every risk/action can link back to a MEDDPICC area or process step
- dashboard findings are traceable to source data

## Phase 3 — Core MEDDPICC modules

**Goal:** support complete structured qualification.

Deliverables:

- Metrics
- Economic Buyer
- Decision Criteria
- Decision Process
- Paper Process
- Identify / Implicate Pain
- Champion
- Competition

Acceptance criteria:

- every module supports evidence links
- every module supports explicit unknown state
- modules produce structured gaps without generative AI
- no module maintains a private duplicate of shared project data

## Phase 4 — Deterministic utilities

**Goal:** automate repetitive analysis and planning work.

### Value tools

- metrics calculator
- ROI
- payback
- cost of delay
- current/future-state comparison

### Process tools

- dependency planner
- go-live backward planning
- critical path / slack
- closing checklist
- missing owner/date detection

### Qualification tools

- decision-criteria matrix
- champion evidence check
- evidence/confidence scoring
- deal-health rules

Acceptance criteria:

- all calculations are pure/tested functions
- same inputs produce same outputs
- derived findings explain their inputs and rule
- user can override planning assumptions without corrupting source evidence

## Phase 5 — Review and export

**Goal:** turn project data into useful outputs without re-entering information.

Deliverables:

- executive deal review
- manager deal review
- MEDDPICC summary
- risk/action summary
- customer-facing go-live plan
- print-friendly view
- Markdown export
- CRM-ready text summary

Acceptance criteria:

- exported content is generated from project state
- outputs distinguish evidence, assumption, unknown, and risk
- customer-facing exports exclude internal-only fields by design

## Phase 6 — Hardening

**Goal:** make the application dependable for real recurring use.

Deliverables:

- full accessibility review
- keyboard navigation audit
- responsive layout audit
- PWA/offline option
- stronger recovery flow
- schema migration test matrix
- performance tests with large projects
- security review
- privacy verification
- import/export regression fixtures
- UI consistency audit against the design system

## Later / optional

Only after the local single-user product is stable:

- encrypted project files
- optional CRM adapters
- optional cloud storage adapters
- collaboration
- plugin system
- organization-specific rule packs

These features must not compromise local-first operation of the base product.

## Release strategy

Suggested milestones:

- **0.1** — project lifecycle + schema
- **0.2** — evidence / risks / actions / dashboard
- **0.3** — complete MEDDPICC modules
- **0.4** — value and process utilities
- **0.5** — exports and deal review
- **1.0** — stable file format, migrations, hardened local-first workflow

A 1.0 release should mean that the project file format is treated as a long-term compatibility contract.
