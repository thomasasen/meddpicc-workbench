# Security and Privacy

## Security model

MEDDPICC Workbench is designed as a static local-first browser application.

The intended default data flow is:

```text
local .meddpicc file
        ↓
browser memory
        ↓
local save/download
```

Opportunity content should not require a backend or external API.

## Privacy promises we can reasonably make

The project should be engineered so that the application itself does not intentionally transmit loaded opportunity data during normal local use.

That does **not** mean a web application can guarantee absolute confidentiality. Browser extensions, compromised devices, developer tools, modified builds, third-party hosting changes, or user actions can affect privacy.

Documentation and UI must therefore avoid absolute claims such as "data can never leave your computer."

## Runtime network policy

The production application should not send project content to:

- analytics services
- AI services
- error-reporting services
- ad networks
- remote databases
- CRM systems

unless a future integration is explicitly enabled by the user and clearly separated from the default local-only mode.

## Static assets

Prefer bundling runtime assets with the application.

Avoid external fonts, scripts, or trackers when the same result can be achieved with packaged assets.

## Imported project files are untrusted

The loader must defend against:

- malformed JSON
- oversized files
- unexpected types
- prototype-pollution style objects
- unsafe URLs
- HTML/script strings
- unsupported schema versions

Project content must be rendered as data, never executed.

## Saving files

Before saving:

1. validate the current project
2. serialize through the canonical schema/model
3. update revision metadata
4. preserve compatible unknown data according to the schema policy
5. never mark the project as saved before the browser save/download operation succeeds

## Vulnerability reporting

Please do not publish sensitive exploit details in a public issue.

Use GitHub's private security reporting / Security Advisory mechanism for this repository when available. If that mechanism is not enabled, open a minimal non-sensitive issue asking for a private reporting channel without including exploit details.

## Dependency security

Once application dependencies are added:

- keep the dependency surface small
- use lockfiles
- enable automated dependency alerts
- review runtime dependencies more strictly than development-only tooling
- avoid dependencies that add telemetry or runtime remote code
