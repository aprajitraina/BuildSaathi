# docs/

This directory contains all documentation for the BuildSaathi platform.

## Structure

| Folder | Purpose |
|---|---|
| `architecture/` | System design, ADRs (Architecture Decision Records), ERDs, data flow diagrams |
| `api/` | API endpoint reference, request/response schemas, auth flows |
| `product/` | Product requirements docs, user stories, feature specs, sitemap |
| `ux/` | Wireframes, component hierarchy, design system notes, user flows |

## Conventions

- Every major decision that affects architecture should have an ADR in `architecture/decisions/`.
- API docs are auto-generated from Swagger but annotated here for non-technical readers.
- Product docs are the source of truth for what gets built — not Slack, not memory.

## Key Documents

- [Architecture Overview](./architecture/README.md)
- [API Reference](./api/README.md)
- [Product Requirements](./product/README.md)
- [UX & Design](./ux/README.md)
