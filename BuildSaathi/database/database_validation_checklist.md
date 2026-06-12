# Database Validation Checklist

Use this checklist before calling the package **ready-to-execute** in any environment.

## 1) Environment prerequisites

- [ ] MySQL version is `8.0+`.
- [ ] Target database user has privileges for `CREATE/ALTER/DROP`, `TRIGGER`, `PROCEDURE`, `FUNCTION`, `VIEW`.
- [ ] App and DB timezone expectations are understood (`UTC_TIMESTAMP(6)` used in scripts).

## 2) Bootstrap path selection (avoid migration collision)

- [ ] Pick one schema owner strategy:
  - [ ] SQL package creates schema, **or**
  - [ ] EF migrations create schema.
- [ ] If SQL package creates schema, avoid duplicate EF schema creation on same DB.
- [ ] If EF creates schema, run only patch/reporting scripts (`09_migration_patches.sql`, SP/view/function/trigger scripts as needed).

## 3) Execute package

- [ ] Run from `database/` folder:
  - [ ] `mysql -u <user> -p < master_setup.sql`
- [ ] Confirm all scripts complete without SQL errors.

## 4) Schema/object verification

- [ ] Core tables exist (`Contractors`, `Users`, `Tenders`, `Projects`, `BOQs`, `Invoices`, etc.).
- [ ] Tenant-bound tables contain `ContractorId`.
- [ ] Soft-delete fields exist (`IsDeleted`, `DeletedAt`) on all major tables.
- [ ] FKs created successfully.
- [ ] Indexes created successfully.
- [ ] SPs, views, triggers, and functions exist.

## 5) Enum and constraint alignment

- [ ] `Users.Role` supports: `Owner`, `Supervisor`, `Accountant`, `Staff`.
- [ ] `Contractors.Plan` supports: `Free`, `Pro`, `Business`, `Enterprise`.
- [ ] `Projects.Status`, `Milestones.Status`, `TenderMatches.Status` check constraints match C# enums.

## 6) Seed verification

- [ ] `demo@buildsaathi.in` exists.
- [ ] Seed statuses use valid enum values (`Saved`, `Active`, etc.).
- [ ] DSR and Material rates inserted.

## 7) Runtime checks

- [ ] API starts without migration/SQL exceptions.
- [ ] Login works (`/auth/login`).
- [ ] Tender list and save/unsave flow works.
- [ ] BOQ create/update totals flow works.
- [ ] Invoice + payment flow works and invoice status updates correctly.
- [ ] Notifications and activity events are generated for relevant events.

## 8) Reporting/SP checks

- [ ] `CALL sp_dashboard_summary('<contractor-id>');` works.
- [ ] `CALL sp_tender_search_filter(...);` works with pagination edge values.
- [ ] `CALL sp_boq_calculation_summary('<boq-id>');` returns expected totals.
- [ ] Views query successfully (`vw_contractor_dashboard`, `vw_overdue_payments`, etc.).

## 9) Performance/safety checks

- [ ] `EXPLAIN` plans use expected indexes for tender/invoice/boq flows.
- [ ] No cross-tenant leakage in reporting SQL where tenant filtering is expected.
- [ ] Trigger side effects are understood (invoice status recalculation + event/notification creation).
