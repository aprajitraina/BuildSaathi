-- query_test_cases.sql
-- Smoke and compatibility tests for BuildSaathi DB package.

USE `buildsaathi_dev`;

-- ----------------------------------------------------------------------------
-- 0) Basic table/object existence
-- ----------------------------------------------------------------------------
SELECT 'Tables' AS TestBlock, COUNT(*) AS CountFound
FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_SCHEMA = DATABASE()
  AND TABLE_NAME IN (
    'Contractors','Users','Tenders','TenderMatches','TenderSummaries',
    'Projects','Milestones','BOQs','BOQLineItems','DSRRates','MaterialRates',
    'Suppliers','Invoices','Payments','Documents','Notifications','ActivityEvents'
  );

SELECT 'Procedures' AS TestBlock, ROUTINE_NAME
FROM INFORMATION_SCHEMA.ROUTINES
WHERE ROUTINE_SCHEMA = DATABASE()
  AND ROUTINE_TYPE = 'PROCEDURE'
  AND ROUTINE_NAME LIKE 'sp_%'
ORDER BY ROUTINE_NAME;

-- ----------------------------------------------------------------------------
-- 1) Seed integrity and enum compatibility
-- ----------------------------------------------------------------------------
SELECT 'Invalid user roles' AS TestName, COUNT(*) AS InvalidCount
FROM `Users`
WHERE `Role` NOT IN ('Owner','Supervisor','Accountant','Staff');

SELECT 'Invalid project statuses' AS TestName, COUNT(*) AS InvalidCount
FROM `Projects`
WHERE `Status` NOT IN ('Planning','Active','OnHold','Completed','Cancelled');

SELECT 'Invalid tender match statuses' AS TestName, COUNT(*) AS InvalidCount
FROM `TenderMatches`
WHERE `Status` NOT IN ('Saved','Reviewing','BidSubmitted','Won','Lost','Withdrawn');

-- ----------------------------------------------------------------------------
-- 2) Tenant safety spot checks
-- ----------------------------------------------------------------------------
SELECT `ContractorId`, COUNT(*) AS UserCount
FROM `Users`
WHERE `IsDeleted` = 0
GROUP BY `ContractorId`;

SELECT `ContractorId`, COUNT(*) AS ProjectCount
FROM `Projects`
WHERE `IsDeleted` = 0
GROUP BY `ContractorId`;

-- ----------------------------------------------------------------------------
-- 3) Financial consistency checks
-- ----------------------------------------------------------------------------
SELECT
  i.`Id` AS InvoiceId,
  i.`Amount`,
  i.`PaidAmount`,
  fn_invoice_outstanding(i.`Id`) AS OutstandingFn
FROM `Invoices` i
WHERE i.`IsDeleted` = 0
LIMIT 10;

-- Trigger behavior check (manual transaction test)
START TRANSACTION;
SET @inv_id = (SELECT `Id` FROM `Invoices` WHERE `IsDeleted` = 0 LIMIT 1);
INSERT INTO `Payments` (`Id`,`InvoiceId`,`Amount`,`PaidDate`,`PaymentMethod`,`ReferenceNumber`,`Notes`,`CreatedAt`,`UpdatedAt`,`IsDeleted`)
VALUES (UUID(), @inv_id, 123.45, UTC_TIMESTAMP(6), 'TEST', CONCAT('TEST-', UUID()), 'trigger test', UTC_TIMESTAMP(6), UTC_TIMESTAMP(6), 0);

SELECT `Id`,`Amount`,`PaidAmount`,`Status`
FROM `Invoices`
WHERE `Id` = @inv_id;
ROLLBACK;

-- ----------------------------------------------------------------------------
-- 4) Stored procedure smoke tests
-- ----------------------------------------------------------------------------
SET @contractor_id = (SELECT `Id` FROM `Contractors` WHERE `IsDeleted` = 0 LIMIT 1);
SET @boq_id = (SELECT `Id` FROM `BOQs` WHERE `IsDeleted` = 0 LIMIT 1);

CALL sp_dashboard_summary(@contractor_id);
CALL sp_tender_search_filter('Uttar Pradesh', NULL, NULL, NULL, NULL, 1, 20);
CALL sp_boq_calculation_summary(@boq_id);
CALL sp_project_progress_report(@contractor_id);
CALL sp_payment_due_alerts(@contractor_id, 30);
CALL sp_invoice_summary(@contractor_id, NULL, NULL);
CALL sp_material_rate_trends(NULL, NULL, 12);
CALL sp_contractor_activity_feed(@contractor_id, 20);

-- ----------------------------------------------------------------------------
-- 5) Views smoke tests
-- ----------------------------------------------------------------------------
SELECT * FROM `vw_contractor_dashboard` LIMIT 10;
SELECT * FROM `vw_overdue_payments` LIMIT 10;
SELECT * FROM `vw_tender_pipeline` LIMIT 10;
SELECT * FROM `vw_material_trends` LIMIT 10;
SELECT * FROM `vw_project_progress` LIMIT 10;
