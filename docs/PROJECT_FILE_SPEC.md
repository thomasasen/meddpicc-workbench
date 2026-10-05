# MEDDPICC Project File Specification

## Purpose

The `.meddpicc` file is the portable source of truth for one sales opportunity.

Version 1 is intentionally simple:

- UTF-8
- JSON
- human-readable
- one file
- no embedded binaries
- explicit schema version
- deterministic validation and migration

Example filename:

```text
acme-crm-transformation.meddpicc
```

## File envelope

A project should have a stable top-level structure similar to:

```json
{
  "schemaVersion": "1.0.0",
  "appVersion": "0.1.0",
  "projectId": "uuid",
  "revision": 1,
  "createdAt": "2026-10-05T13:00:00.000Z",
  "updatedAt": "2026-10-05T13:00:00.000Z",
  "project": {},
  "meddpicc": {},
  "evidence": [],
  "risks": [],
  "actions": [],
  "history": [],
  "calculators": {},
  "planning": {},
  "references": []
}
```

The exact schema will be formalized before application development begins.

## Version fields

### schemaVersion

Controls compatibility of the file structure.

Rules:

- patch: backward-compatible clarification/default
- minor: backward-compatible additions
- major: incompatible schema change requiring migration

The application must never silently open and rewrite an unsupported future major version.

### appVersion

Records the application version that last saved the file. It is diagnostic metadata, not the compatibility authority.

### revision

Monotonically increments on successful project save.

It is useful for comparing two copies of the same project, but it is not intended to be a distributed conflict-resolution protocol.

## Project metadata

Suggested fields:

```json
{
  "project": {
    "name": "ACME CRM Transformation",
    "accountName": "ACME GmbH",
    "opportunityId": "OPP-0042",
    "owner": "Thomas Asen",
    "currency": "EUR",
    "dealValue": 480000,
    "targetCloseDate": "2027-03-31",
    "targetGoLiveDate": "2027-07-01",
    "forecastCategory": "best-case",
    "notes": ""
  }
}
```

Only fields that support qualification and deal planning belong here. The file must not drift into becoming a full account/contact database.

## MEDDPICC sections

Suggested envelope:

```json
{
  "meddpicc": {
    "metrics": {},
    "economicBuyer": {},
    "decisionCriteria": {},
    "decisionProcess": {},
    "paperProcess": {},
    "pain": {},
    "champions": [],
    "competition": []
  }
}
```

Each section should be able to hold:

- structured statements
- manual notes
- linked evidence IDs
- current qualification status
- gaps
- section-specific data

## Qualification status

Use explicit states instead of a forced yes/no model.

Candidate enum:

```text
confirmed
partial
assumption
unknown
risk
```

A section may also expose a deterministic confidence score, but the score must not replace the explicit state or underlying evidence.

## Evidence model

Evidence is a first-class shared object.

Example:

```json
{
  "id": "ev_01",
  "classification": "customer_statement",
  "statement": "The CFO approves investments above EUR 250k.",
  "source": {
    "person": "Max Mustermann",
    "role": "Head of Sales",
    "date": "2026-10-05",
    "context": "Discovery workshop"
  },
  "referenceId": "ref_03",
  "createdAt": "2026-10-05T13:30:00.000Z"
}
```

Candidate classifications:

```text
fact
customer_statement
seller_interpretation
assumption
confirmed_evidence
unknown
```

The implementation should refine these names if necessary, but it must preserve the conceptual distinction between knowledge and assumption.

### Evidence links

MEDDPICC statements should reference evidence by stable ID rather than duplicating source metadata throughout the project.

## Risks

Example:

```json
{
  "id": "risk_01",
  "title": "Procurement process is not confirmed",
  "severity": "high",
  "status": "open",
  "relatedArea": "paperProcess",
  "relatedEntityIds": ["pp_step_05"],
  "impact": "Target close date may be unreliable",
  "openedAt": "2026-10-05T13:40:00.000Z"
}
```

Candidate severities:

```text
low
medium
high
critical
```

Candidate statuses:

```text
open
mitigating
closed
accepted
```

## Actions

Actions convert qualification gaps into work.

Example:

```json
{
  "id": "action_01",
  "title": "Confirm procurement lead time",
  "status": "open",
  "owner": "Thomas Asen",
  "dueDate": "2026-10-12",
  "relatedArea": "paperProcess",
  "desiredEvidence": "Procurement owner confirms steps, lead time and PO requirement"
}
```

## Decision and paper processes

A generic process-step structure should support both areas.

Candidate fields:

- stable ID
- title
- description
- owner
- status
- planned date
- confirmed date
- duration
- predecessor IDs
- required/optional
- evidence IDs
- notes

This allows the same scheduling engine to calculate dependencies and critical paths without mixing the semantic meaning of Decision Process and Paper Process.

## Metrics and business case

Persist source inputs, units, provenance, and confidence.

Avoid persisting only a final ROI number.

Example inputs:

- current volume
- current time/cost
- expected improvement
- annualization basis
- investment
- recurring cost
- one-time cost

Every material number should optionally reference evidence.

## Planning

Planning may contain:

- target go-live date
- implementation phases
- process dependencies
- duration assumptions
- calculated critical-path metadata

Calculated outputs should be reproducible from source inputs.

## References

References point to external context without embedding it.

Example:

```json
{
  "id": "ref_03",
  "type": "meeting",
  "title": "Discovery workshop",
  "date": "2026-10-05",
  "externalId": null,
  "url": null,
  "notes": ""
}
```

Potential reference types:

- meeting
- crm
- document
- email
- rfp
- contract
- other

URLs are metadata only. Opening them should always be an explicit user action.

## History

History is an audit-oriented change log, not a keystroke log.

Example:

```json
{
  "id": "hist_01",
  "timestamp": "2026-10-05T14:00:00.000Z",
  "type": "qualification_status_changed",
  "area": "economicBuyer",
  "entityId": "eb_01",
  "summary": "Economic Buyer status changed from assumption to partial"
}
```

The exact event taxonomy should remain small and stable.

## Unknown extension data

Forward compatibility needs a deliberate policy.

The validator/migrator must not accidentally delete fields it does not understand within a compatible schema version.

For incompatible future major versions, the application should refuse to save until a supported migration path exists.

## File safety

Treat every imported file as untrusted input.

Requirements:

- size limit
- JSON parse error handling
- schema validation
- string rendering without unsafe HTML interpretation
- URL handling with safe schemes
- no automatic network access based on file content
- no execution of project content

## Example fixture

A sanitized example project should be added once the first formal schema exists:

```text
examples/demo-opportunity.meddpicc
```

It should contain fictional companies and people only.
