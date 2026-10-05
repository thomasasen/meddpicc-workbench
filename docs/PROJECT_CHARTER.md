# Project Charter

## Working title

**MEDDPICC Workbench**

## Problem

Complex B2B opportunities accumulate a large amount of qualification knowledge over time. Most CRM implementations capture only a compressed snapshot: a name for the Economic Buyer, a Champion field, a close date, a competitor, or a few notes.

That loses the information that matters most for rigorous qualification:

- where a statement came from
- whether it is a fact, customer statement, interpretation, or assumption
- what is still unknown
- which evidence supports a conclusion
- what changed over time
- which gap creates deal risk
- what action should close that gap
- how decision, paper, and implementation timelines interact

At the same time, doing this well by hand creates repetitive administrative work.

## Vision

Create a **local-first MEDDPICC workspace** that makes rigorous qualification practical enough to use continuously throughout a complex sales cycle.

The application should take over mechanical work while leaving judgment with the seller.

Examples of mechanical work:

- calculate ROI, payback, and cost of delay
- maintain a structured evidence register
- map decision and paper-process steps
- calculate backwards from a target go-live date
- identify missing owners, dates, dependencies, and confirmations
- maintain deterministic evidence/confidence scores
- produce consistent deal-review outputs
- preserve the history of qualification changes

## Product promise

Given a portable `.meddpicc` project file, the Workbench should let a seller reopen an opportunity at any time and immediately understand:

1. what is confirmed
2. what is partial
3. what is assumption
4. what is unknown
5. what is risky
6. what should happen next

## Primary users

### Account Executive / Strategic Account Manager

Needs a reliable working file for a complex opportunity without maintaining parallel spreadsheets and documents.

### Sales Manager

Needs to inspect a deal based on evidence instead of seller optimism and identify the few gaps that matter most.

### Deal team

Needs a shared, portable representation of qualification, process, value, risks, and next actions.

## Primary use cases

### Open an existing opportunity

A user downloads a `.meddpicc` file from a CRM or shared location, opens it in the Workbench, updates the deal, and saves it again.

### Inspect qualification

The dashboard shows the status of each MEDDPICC element together with evidence quality, open gaps, and risk.

### Prepare a deal review

The Workbench generates a structured review from the current project state rather than requiring a separate presentation to be rebuilt manually.

### Maintain the business case

The seller updates assumptions or customer-confirmed values and receives deterministic recalculations of value, ROI, payback, and delay cost.

### Protect the close date

Decision Process, Paper Process, and Go-Live Plan are combined to expose impossible dates, missing steps, and dependencies.

## Product principles

### Evidence is a first-class object

A qualification statement without provenance is weaker than the same statement with a named source, date, context, and classification.

### Unknown is a valid state

The tool must never force a seller to invent data simply to complete a score.

### Scoring must explain itself

A score without the underlying evidence is not useful. Every derived status should be traceable to explicit project data and deterministic rules.

### Calculations must be reproducible

Given the same project file, the same application version should produce the same calculated result.

### Project files must remain portable

A project should not depend on one browser profile, one machine, or a proprietary backend.

### The tool is not a CRM

Account master data, email, activity capture, pipeline rollups, and contact management remain outside the core scope.

## Success criteria for v1

A v1 release is successful when a user can:

- create a new project
- open an existing `.meddpicc` file
- validate and migrate its schema
- maintain all MEDDPICC elements
- attach evidence to qualification statements
- maintain risks and next actions
- calculate value / ROI / payback / cost of delay
- build a decision process and paper process
- create a go-live / critical-path plan
- see a deal-health dashboard based on deterministic rules
- export a usable deal review
- save the complete project back into one portable file
- perform all of the above without sending opportunity data to a backend

## Non-goals for v1

- AI-generated recommendations
- automatic meeting transcription
- automatic CRM synchronization
- email/calendar integration
- multi-user real-time collaboration
- cloud-hosted project storage
- enterprise identity management
- embedded document archive
- full pipeline management

These may be evaluated later, but none should be allowed to complicate the v1 architecture.

## Quality bar

The application should be safe to use with real opportunity data in the following limited sense:

- no deliberate runtime upload of project data
- no analytics dependency that receives project content
- clear distinction between persisted file data and temporary browser state
- validation before opening or saving a project
- deterministic calculations covered by tests
- schema migration covered by tests
- no silent data loss
- explicit warning when an unsupported future schema is opened
