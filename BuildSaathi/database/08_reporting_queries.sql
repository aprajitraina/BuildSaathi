-- BuildSaathi Database Master Package
-- 08_reporting_queries.sql
-- Purpose: Query library for BI, analytics, and operational dashboards.

USE `buildsaathi_dev`;

-- ===========================================================================
-- 1) Top due payments
-- ===========================================================================
SELECT
  i.`ContractorId`,
  c.`CompanyName`,
  i.`InvoiceNumber`,
  i.`ClientName`,
  i.`DueDate`,
  (i.`Amount` - i.`PaidAmount`) AS `OutstandingAmount`,
  DATEDIFF(UTC_DATE(), DATE(i.`DueDate`)) AS `DaysOverdue`
FROM `Invoices` i
JOIN `Contractors` c ON c.`Id` = i.`ContractorId`
WHERE i.`IsDeleted` = 0
  AND i.`Status` IN ('Sent','PartiallyPaid','Overdue')
  AND i.`DueDate` < UTC_TIMESTAMP()
ORDER BY `OutstandingAmount` DESC, `DaysOverdue` DESC
LIMIT 20;

-- ===========================================================================
-- 2) Contractor KPI snapshot
-- ===========================================================================
SELECT
  c.`Id` AS `ContractorId`,
  c.`CompanyName`,
  COUNT(DISTINCT p.`Id`) AS `TotalProjects`,
  SUM(CASE WHEN p.`Status` = 'Active' THEN 1 ELSE 0 END) AS `ProjectsInProgress`,
  COUNT(DISTINCT tm.`Id`) AS `TenderPipeline`,
  COALESCE(SUM(i.`Amount`), 0) AS `InvoiceGross`,
  COALESCE(SUM(i.`PaidAmount`), 0) AS `Collected`,
  COALESCE(SUM(i.`Amount` - i.`PaidAmount`), 0) AS `Outstanding`,
  ROUND(AVG(p.`CompletionPercent`), 2) AS `AvgCompletionPercent`
FROM `Contractors` c
LEFT JOIN `Projects` p ON p.`ContractorId` = c.`Id` AND p.`IsDeleted` = 0
LEFT JOIN `TenderMatches` tm ON tm.`ContractorId` = c.`Id` AND tm.`IsDeleted` = 0
LEFT JOIN `Invoices` i ON i.`ContractorId` = c.`Id` AND i.`IsDeleted` = 0
WHERE c.`IsDeleted` = 0
GROUP BY c.`Id`, c.`CompanyName`
ORDER BY `Outstanding` DESC;

-- ===========================================================================
-- 3) Tender win metrics (using TenderMatches status)
-- ===========================================================================
SELECT
  tm.`ContractorId`,
  c.`CompanyName`,
  COUNT(*) AS `TotalPursued`,
  SUM(CASE WHEN tm.`Status` = 'Won' THEN 1 ELSE 0 END) AS `WonCount`,
  SUM(CASE WHEN tm.`Status` = 'Lost' THEN 1 ELSE 0 END) AS `LostCount`,
  SUM(CASE WHEN tm.`Status` IN ('Saved','Reviewing','BidSubmitted') THEN 1 ELSE 0 END) AS `OpenCount`,
  ROUND(
    (SUM(CASE WHEN tm.`Status` = 'Won' THEN 1 ELSE 0 END) / NULLIF(COUNT(*), 0)) * 100,
    2
  ) AS `WinRatePercent`,
  COALESCE(SUM(CASE WHEN tm.`Status` = 'Won' THEN t.`EstimatedValue` ELSE 0 END), 0) AS `WonValue`
FROM `TenderMatches` tm
JOIN `Contractors` c ON c.`Id` = tm.`ContractorId` AND c.`IsDeleted` = 0
JOIN `Tenders` t ON t.`Id` = tm.`TenderId` AND t.`IsDeleted` = 0
WHERE tm.`IsDeleted` = 0
GROUP BY tm.`ContractorId`, c.`CompanyName`
ORDER BY `WinRatePercent` DESC, `WonValue` DESC;

-- ===========================================================================
-- 4) Material trend report (month-over-month)
-- ===========================================================================
SELECT
  x.`MaterialName`,
  x.`State`,
  x.`RateMonth`,
  x.`AvgRate`,
  x.`PrevMonthRate`,
  ROUND(((x.`AvgRate` - x.`PrevMonthRate`) / NULLIF(x.`PrevMonthRate`, 0)) * 100, 2) AS `MoMChangePercent`
FROM (
  SELECT
    mr.`MaterialName`,
    mr.`State`,
    DATE_FORMAT(mr.`EffectiveDate`, '%Y-%m') AS `RateMonth`,
    ROUND(AVG(mr.`Rate`), 2) AS `AvgRate`,
    LAG(ROUND(AVG(mr.`Rate`), 2)) OVER (
      PARTITION BY mr.`MaterialName`, mr.`State`
      ORDER BY DATE_FORMAT(mr.`EffectiveDate`, '%Y-%m')
    ) AS `PrevMonthRate`
  FROM `MaterialRates` mr
  WHERE mr.`IsDeleted` = 0
  GROUP BY mr.`MaterialName`, mr.`State`, DATE_FORMAT(mr.`EffectiveDate`, '%Y-%m')
) x
ORDER BY x.`MaterialName`, x.`State`, x.`RateMonth` DESC;

-- ===========================================================================
-- 5) Profitability analysis (project-level)
-- ===========================================================================
SELECT
  p.`Id` AS `ProjectId`,
  p.`ContractorId`,
  c.`CompanyName`,
  p.`Title` AS `ProjectTitle`,
  p.`ContractValue`,
  COALESCE(SUM(i.`Amount`), 0) AS `InvoicedAmount`,
  COALESCE(SUM(i.`PaidAmount`), 0) AS `CollectedAmount`,
  (
    SELECT COALESCE(SUM(li.`Quantity` * li.`UnitRate`), 0)
    FROM `BOQs` b
    JOIN `BOQLineItems` li ON li.`BOQId` = b.`Id` AND li.`IsDeleted` = 0
    WHERE b.`ProjectId` = p.`Id` AND b.`IsDeleted` = 0
  ) AS `EstimatedExecutionCost`,
  ROUND(
    COALESCE(SUM(i.`PaidAmount`), 0) -
    (
      SELECT COALESCE(SUM(li.`Quantity` * li.`UnitRate`), 0)
      FROM `BOQs` b
      JOIN `BOQLineItems` li ON li.`BOQId` = b.`Id` AND li.`IsDeleted` = 0
      WHERE b.`ProjectId` = p.`Id` AND b.`IsDeleted` = 0
    ),
    2
  ) AS `CollectedMinusEstimatedCost`
FROM `Projects` p
JOIN `Contractors` c ON c.`Id` = p.`ContractorId` AND c.`IsDeleted` = 0
LEFT JOIN `Invoices` i ON i.`ProjectId` = p.`Id` AND i.`IsDeleted` = 0
WHERE p.`IsDeleted` = 0
GROUP BY p.`Id`, p.`ContractorId`, c.`CompanyName`, p.`Title`, p.`ContractValue`
ORDER BY `CollectedMinusEstimatedCost` DESC;
