# modules/documents/

Document Vault — secure storage and organization of contractor documents.

## Status: Phase 2

This module is scaffolded but not yet implemented.

## Planned Responsibilities

- Upload documents (PDF, images, Excel)
- Organize by entity: Tender, Project, or Contractor-level
- Tag documents by type (Contract, Drawing, Compliance, Invoice, etc.)
- Signed URL download (secure, time-limited links)
- Search and filter documents

## Storage

Files are stored in MinIO (S3-compatible) locally, AWS S3 in production.
The backend returns signed download URLs — files are never served directly through the API.
