# Architecture

## Architectural goal

MEDDPICC Workbench should be deployable as a static GitHub Pages application while still providing a robust project-based workflow.

The central rule is:

> **The `.meddpicc` project file is the canonical state. Browser storage is optional recovery/cache state only.**

## High-level architecture

```text
                 GitHub Pages
                     │
                     ▼
              Static Vue application
                     │
          ┌──────────┴──────────┐
          ▼                     ▼
   Project file I/O       Deterministic services
   (.meddpicc JSON)       calculations / checks
          │                     │
          └──────────┬──────────┘
                     ▼
                Pinia state
                     │
          ┌──────────┼──────────┐
          ▼          ▼          ▼
      MEDDPICC    Dashboard   Exports
       modules
```

There is no application backend in the intended v1 architecture.

## Proposed stack

### Application

- Vue 3
- TypeScript
- Vite
- Vue Router
- Pinia

### Validation

Use a single explicit runtime schema for project files. The implementation may use a TypeScript-friendly validator such as Zod or JSON Schema plus generated types, but the repository must avoid having two divergent definitions of the file format.

Requirements:

- parse untrusted local files defensively
- reject malformed required data
- retain compatible optional data
- provide actionable validation errors
- support explicit schema migrations

### Testing

- **Vitest** for calculations, stores, validation, and migrations
- **Playwright** for critical file lifecycle and browser flows
- fixture projects for old/current/invalid schema versions

### Delivery

- GitHub Actions
- production build on pull request
- test gate before deploy
- deploy static build to GitHub Pages from `main`

## Domain layers

### 1. Project model

Owns the canonical opportunity state.

Examples:

- metadata
- MEDDPICC sections
- evidence
- risks
- actions
- history
- calculator inputs
- derived settings

### 2. Domain services

Pure deterministic functions wherever possible.

Examples:

- ROI calculation
- payback calculation
- cost-of-delay calculation
- critical-path calculation
- qualification status derivation
- evidence completeness checks
- timeline consistency checks
- export rendering

A domain service should not know about Vue components.

### 3. Application state

Pinia stores provide the currently loaded working state.

They are responsible for:

- loading a validated project
- tracking dirty state
- applying edits
- invoking domain services
- coordinating save/export
- exposing derived UI state

### 4. UI

The UI should render domain state and collect user input. Business rules should not be hidden inside components.

## Project file lifecycle

### Open

1. User selects a `.meddpicc` file.
2. Read as text.
3. Parse JSON.
4. Validate envelope and schema version.
5. Migrate if supported.
6. Validate migrated project.
7. Load into application state.
8. Mark project clean.

### Edit

- edits update in-memory project state
- deterministic derived values recompute
- project becomes dirty
- changes that matter for audit may create history events

### Save

1. Validate current project.
2. Normalize fields.
3. update `updatedAt` and revision
4. serialize stable JSON
5. download/write the `.meddpicc` file
6. mark state clean only after successful save operation

## Browser file APIs

The baseline must work through standard file upload + download APIs.

The File System Access API may be used as progressive enhancement for browsers that support direct reopen/save behavior. It must not be a hard dependency because support differs between browsers.

## Browser persistence

Optional local persistence can improve resilience, but it must be clearly separated from canonical project storage.

Allowed uses:

- crash recovery
- unsaved-change recovery
- recently opened project metadata
- user preferences

Not allowed:

- silently treating browser storage as the only project copy
- syncing opportunity content to third-party storage
- claiming data is saved when it exists only in volatile memory

## Derived vs persisted data

Prefer persisting inputs and qualification records. Derived values can be recalculated.

Examples of good persisted data:

- investment amount
- annual benefit assumption
- process duration
- dependency
- evidence classification

Examples of normally derived data:

- ROI
- payback
- cost of delay per month
- schedule slack
- dashboard counts
- score summaries

If a derived value is persisted for audit reasons, store the calculation version and inputs that produced it.

## History model

History should be useful without recording every keystroke.

Candidate events:

- project created
- MEDDPICC status changed
- assumption confirmed/rejected
- critical process date changed
- risk opened/closed
- action completed
- project schema migrated

History entries should reference stable IDs where possible.

## Deterministic rule engine

Rules should be implemented as pure functions with tests.

Example:

```text
Paper Process step has no owner
AND step is required
AND target close date depends on it
→ create/display process gap
```

The application must distinguish between:

- source data
- deterministic derived findings
- human judgment / manual status

Derived findings should always be explainable by showing which input fields triggered them.

## Security and privacy architecture

Production runtime should not require network calls for project processing.

External dependencies are build-time assets bundled into the application. Any future runtime integration must be opt-in, documented, and isolated from the default local-only mode.

See [SECURITY.md](../SECURITY.md).

## Future architecture decisions

Not required for the first implementation:

- PWA/offline installation
- encrypted project files
- optional cloud sync
- CRM API adapters
- team collaboration
- plugin architecture

These should be evaluated only after the file model and single-user local workflow are stable.
