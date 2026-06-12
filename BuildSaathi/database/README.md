# BuildSaathi Database Script Package

This folder contains a production-oriented MySQL script set to bootstrap, seed, operate, and tune the BuildSaathi database.

It is aligned to the existing EF Core model (`Contractors`, `Users`, `Tenders`, `TenderMatches`, `Projects`, `BOQs`, `Invoices`, etc.) and includes requested operational SQL assets (procedures, views, triggers, functions, reporting library).

## Files and purpose

- `01_schema.sql`  
  Core table DDL with audit metadata (`CreatedAt`, `UpdatedAt`, `CreatedById`, `UpdatedById`), soft-delete (`IsDeleted`, `DeletedAt`), and tenant columns (`ContractorId`) where applicable.

- `02_constraints_indexes.sql`  
  Foreign keys, check constraints, and index strategy for common query paths.

- `03_seed_data.sql`  
  Realistic baseline data: roles, contractors, users, tenders, DSR rates, material rates, suppliers, projects, BOQ, invoices, notifications, and activity events.

- `04_stored_procedures.sql`  
  Business-flow procedures:
  - dashboard summary
  - tender search/filter
  - BOQ calculations
  - project progress report
  - payment due alerts
  - invoice summary
  - material trend analysis
  - contractor activity feed

- `05_views.sql`  
  Reporting views:
  - `vw_contractor_dashboard`
  - `vw_overdue_payments`
  - `vw_tender_pipeline`
  - `vw_material_trends`
  - `vw_project_progress`

- `06_triggers.sql`  
  Trigger automation:
  - auto `UpdatedAt` updates
  - invoice paid amount/status sync from payments
  - project activity event creation
  - overdue invoice notification + activity event generation

- `07_functions.sql`  
  Reusable scalar functions:
  - `fn_invoice_outstanding`
  - `fn_boq_total`
  - `fn_project_health_score`

- `08_reporting_queries.sql`  
  Query library for KPI and analytics use cases:
  - top due payments
  - contractor KPI rollups
  - tender win metrics
  - material month-over-month trends
  - project profitability lens

- `09_migration_patches.sql`  
  Idempotent patch script for already-running databases (adds missing columns/tables/indexes and backfills RoleId mapping).

- `10_performance_optimization.sql`  
  Index diagnostics, explain-plan templates, runtime tuning notes, caching candidates, and scaling guidance.

- `master_setup.sql`  
  Runs the full package in sequence.

- `database_validation_checklist.md`  
  Pre-flight + post-run validation checklist for end-to-end safety.

- `query_test_cases.sql`  
  Smoke test query suite for schema, seed, SPs, views, and trigger behavior.

- `schema_fix_patch.sql`  
  Backward compatibility patch for previously deployed script versions (enum/check/data reconciliation).

- `stored_procedure_fixes.sql`  
  Procedure-only patch for previously deployed SP definitions.

## Execution order

1. `01_schema.sql`
2. `02_constraints_indexes.sql`
3. `03_seed_data.sql`
4. `04_stored_procedures.sql`
5. `05_views.sql`
6. `06_triggers.sql`
7. `07_functions.sql`
8. `08_reporting_queries.sql`
9. `09_migration_patches.sql`
10. `10_performance_optimization.sql`

Run all at once:

```bash
cd database
mysql -u root -p < master_setup.sql
```

## Important runtime compatibility note (EF migrations)

Your API startup runs `Database.MigrateAsync()` in development.  
Use one bootstrap path per environment:

- **Path A (recommended for this package):** run SQL scripts from this folder, then run API with database migration disabled/removed for that environment.
- **Path B (default app path):** let EF migrations create schema and use `09_migration_patches.sql` + optional reporting/SP scripts only.

Do not run full manual schema bootstrap and EF schema migrations as independent creators on the same empty DB without coordination.

## Dependencies

- MySQL 8.x (required for check constraints and window functions used in reporting queries).
- InnoDB engine.
- UTF8MB4 charset/collation support.

## EF Core compatibility notes

- Existing EF model compatibility is preserved for table names and primary columns.
- `Users.Role` remains string-based (as in current EF model).
- `Roles` and `Suppliers` are added as platform-level extensibility tables; they do not break current EF behavior.
- `Project.TenderId` and `BOQ.ProjectId` remain nullable references to match current model behavior.
- `Documents.TenderId` is included to match migration schema.

## Multi-tenancy and soft-delete model

- Tenant scope is represented with `ContractorId` in tenant-bound tables.
- All major tables include soft-delete columns and audit metadata.
- Reporting procedures/views filter out soft-deleted rows by default.
