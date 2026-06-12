-- BuildSaathi Database Master Package
-- 05_views.sql
-- Purpose: Reporting views used by dashboards and analytics.

USE `buildsaathi_dev`;

DROP VIEW IF EXISTS `vw_contractor_dashboard`;
CREATE VIEW `vw_contractor_dashboard` AS
SELECT
  c.`Id` AS `ContractorId`,
  c.`CompanyName`,
  c.`Plan`,
  c.`State`,
  (
    SELECT COUNT(*)
    FROM `Projects` p
    WHERE p.`ContractorId` = c.`Id`
      AND p.`IsDeleted` = 0
      AND p.`Status` = 'Active'
  ) AS `ActiveProjects`,
  (
    SELECT COUNT(*)
    FROM `TenderMatches` tm
    WHERE tm.`ContractorId` = c.`Id`
      AND tm.`IsDeleted` = 0
  ) AS `TenderPipelineCount`,
  (
    SELECT COALESCE(SUM(i.`Amount`), 0)
    FROM `Invoices` i
    WHERE i.`ContractorId` = c.`Id`
      AND i.`IsDeleted` = 0
  ) AS `InvoiceGrossAmount`,
  (
    SELECT COALESCE(SUM(i.`Amount` - i.`PaidAmount`), 0)
    FROM `Invoices` i
    WHERE i.`ContractorId` = c.`Id`
      AND i.`IsDeleted` = 0
      AND i.`Status` IN ('Sent','PartiallyPaid','Overdue')
  ) AS `OutstandingAmount`,
  (
    SELECT COUNT(*)
    FROM `Notifications` n
    WHERE n.`ContractorId` = c.`Id`
      AND n.`IsDeleted` = 0
      AND n.`IsRead` = 0
  ) AS `UnreadNotifications`
FROM `Contractors` c
WHERE c.`IsDeleted` = 0;

DROP VIEW IF EXISTS `vw_overdue_payments`;
CREATE VIEW `vw_overdue_payments` AS
SELECT
  i.`Id` AS `InvoiceId`,
  i.`ContractorId`,
  c.`CompanyName`,
  i.`InvoiceNumber`,
  i.`ClientName`,
  i.`Amount`,
  i.`PaidAmount`,
  (i.`Amount` - i.`PaidAmount`) AS `OutstandingAmount`,
  i.`DueDate`,
  DATEDIFF(UTC_DATE(), DATE(i.`DueDate`)) AS `DaysOverdue`,
  i.`Status`
FROM `Invoices` i
JOIN `Contractors` c ON c.`Id` = i.`ContractorId` AND c.`IsDeleted` = 0
WHERE i.`IsDeleted` = 0
  AND i.`DueDate` IS NOT NULL
  AND i.`Status` IN ('Sent','PartiallyPaid','Overdue')
  AND i.`DueDate` < UTC_TIMESTAMP()
  AND (i.`Amount` - i.`PaidAmount`) > 0;

DROP VIEW IF EXISTS `vw_tender_pipeline`;
CREATE VIEW `vw_tender_pipeline` AS
SELECT
  tm.`ContractorId`,
  c.`CompanyName`,
  t.`Id` AS `TenderId`,
  t.`ReferenceNumber`,
  t.`Title`,
  t.`State`,
  t.`Category`,
  t.`EstimatedValue`,
  t.`SubmissionDeadline`,
  tm.`Status` AS `MatchStatus`,
  tm.`UpdatedAt` AS `LastActivityAt`
FROM `TenderMatches` tm
JOIN `Contractors` c ON c.`Id` = tm.`ContractorId` AND c.`IsDeleted` = 0
JOIN `Tenders` t ON t.`Id` = tm.`TenderId` AND t.`IsDeleted` = 0
WHERE tm.`IsDeleted` = 0;

DROP VIEW IF EXISTS `vw_material_trends`;
CREATE VIEW `vw_material_trends` AS
SELECT
  mr.`MaterialName`,
  mr.`State`,
  DATE_FORMAT(mr.`EffectiveDate`, '%Y-%m') AS `RateMonth`,
  ROUND(AVG(mr.`Rate`), 2) AS `AvgRate`,
  MIN(mr.`Rate`) AS `MinRate`,
  MAX(mr.`Rate`) AS `MaxRate`,
  COUNT(*) AS `SampleCount`
FROM `MaterialRates` mr
WHERE mr.`IsDeleted` = 0
GROUP BY mr.`MaterialName`, mr.`State`, DATE_FORMAT(mr.`EffectiveDate`, '%Y-%m');

DROP VIEW IF EXISTS `vw_project_progress`;
CREATE VIEW `vw_project_progress` AS
SELECT
  p.`Id` AS `ProjectId`,
  p.`ContractorId`,
  p.`Title`,
  p.`Status`,
  p.`CompletionPercent`,
  p.`ContractValue`,
  p.`ExpectedCompletionDate`,
  COUNT(m.`Id`) AS `MilestoneCount`,
  SUM(CASE WHEN m.`Status` = 'Completed' THEN 1 ELSE 0 END) AS `CompletedMilestones`,
  SUM(CASE WHEN m.`DueDate` < UTC_TIMESTAMP() AND m.`Status` <> 'Completed' THEN 1 ELSE 0 END) AS `OverdueMilestones`
FROM `Projects` p
LEFT JOIN `Milestones` m
  ON m.`ProjectId` = p.`Id`
 AND m.`IsDeleted` = 0
WHERE p.`IsDeleted` = 0
GROUP BY
  p.`Id`,
  p.`ContractorId`,
  p.`Title`,
  p.`Status`,
  p.`CompletionPercent`,
  p.`ContractValue`,
  p.`ExpectedCompletionDate`;
