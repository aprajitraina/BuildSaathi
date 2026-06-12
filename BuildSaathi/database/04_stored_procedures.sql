-- BuildSaathi Database Master Package
-- 04_stored_procedures.sql
-- Purpose: Stored procedures for major business workflows.

USE `buildsaathi_dev`;

DELIMITER $$

DROP PROCEDURE IF EXISTS `sp_dashboard_summary`$$
CREATE PROCEDURE `sp_dashboard_summary`(
  IN p_contractor_id CHAR(36)
)
BEGIN
  SELECT
    (SELECT COUNT(*)
     FROM `Tenders` t
     WHERE t.`IsDeleted` = 0
       AND t.`IsActive` = 1
       AND t.`SubmissionDeadline` >= UTC_TIMESTAMP()) AS `ActiveTendersCount`,
    (SELECT COUNT(*)
     FROM `TenderMatches` tm
     WHERE tm.`ContractorId` = p_contractor_id
       AND tm.`IsDeleted` = 0) AS `MatchedTendersCount`,
    (SELECT COUNT(*)
     FROM `Projects` p
     WHERE p.`ContractorId` = p_contractor_id
       AND p.`IsDeleted` = 0
       AND p.`Status` = 'Active') AS `ActiveProjectsCount`,
    (SELECT COUNT(*)
     FROM `Invoices` i
     WHERE i.`ContractorId` = p_contractor_id
       AND i.`IsDeleted` = 0
       AND i.`Status` IN ('Draft','Sent','PartiallyPaid','Overdue')) AS `OpenInvoicesCount`,
    (SELECT COALESCE(SUM(i.`Amount` - i.`PaidAmount`), 0)
     FROM `Invoices` i
     WHERE i.`ContractorId` = p_contractor_id
       AND i.`IsDeleted` = 0
       AND i.`Status` IN ('Sent','PartiallyPaid','Overdue')) AS `OutstandingReceivables`,
    (SELECT COUNT(*)
     FROM `Notifications` n
     WHERE n.`ContractorId` = p_contractor_id
       AND n.`IsDeleted` = 0
       AND n.`IsRead` = 0) AS `UnreadNotifications`;
END$$

DROP PROCEDURE IF EXISTS `sp_tender_search_filter`$$
CREATE PROCEDURE `sp_tender_search_filter`(
  IN p_state VARCHAR(100),
  IN p_category VARCHAR(100),
  IN p_min_estimated_value DECIMAL(18,2),
  IN p_max_estimated_value DECIMAL(18,2),
  IN p_keyword VARCHAR(200),
  IN p_page INT,
  IN p_page_size INT
)
BEGIN
  DECLARE v_offset INT DEFAULT 0;
  SET p_page = IFNULL(NULLIF(p_page, 0), 1);
  SET p_page_size = IFNULL(NULLIF(p_page_size, 0), 20);
  SET p_page_size = LEAST(GREATEST(p_page_size, 1), 200);
  SET v_offset = GREATEST((p_page - 1) * p_page_size, 0);

  SELECT
    t.`Id`,
    t.`Title`,
    t.`ReferenceNumber`,
    t.`Department`,
    t.`Organization`,
    t.`State`,
    t.`District`,
    t.`Category`,
    t.`EstimatedValue`,
    t.`SubmissionDeadline`,
    t.`SourcePortal`
  FROM `Tenders` t
  WHERE t.`IsDeleted` = 0
    AND t.`IsActive` = 1
    AND (p_state IS NULL OR p_state = '' OR t.`State` = p_state)
    AND (p_category IS NULL OR p_category = '' OR t.`Category` = p_category)
    AND (p_min_estimated_value IS NULL OR t.`EstimatedValue` >= p_min_estimated_value)
    AND (p_max_estimated_value IS NULL OR t.`EstimatedValue` <= p_max_estimated_value)
    AND (
      p_keyword IS NULL OR p_keyword = '' OR
      t.`Title` LIKE CONCAT('%', p_keyword, '%') OR
      t.`Department` LIKE CONCAT('%', p_keyword, '%') OR
      t.`Organization` LIKE CONCAT('%', p_keyword, '%') OR
      t.`ReferenceNumber` LIKE CONCAT('%', p_keyword, '%')
    )
  ORDER BY t.`SubmissionDeadline` ASC
  LIMIT p_page_size OFFSET v_offset;
END$$

DROP PROCEDURE IF EXISTS `sp_boq_calculation_summary`$$
CREATE PROCEDURE `sp_boq_calculation_summary`(
  IN p_boq_id CHAR(36)
)
BEGIN
  SELECT
    b.`Id` AS `BOQId`,
    b.`Title`,
    b.`ContractorId`,
    b.`Status`,
    b.`OverheadPercent`,
    b.`ContingencyPercent`,
    COALESCE(SUM(li.`Quantity` * li.`UnitRate`), 0) AS `BaseAmount`,
    ROUND(COALESCE(SUM(li.`Quantity` * li.`UnitRate`), 0) * (b.`OverheadPercent` / 100), 2) AS `OverheadAmount`,
    ROUND(COALESCE(SUM(li.`Quantity` * li.`UnitRate`), 0) * (b.`ContingencyPercent` / 100), 2) AS `ContingencyAmount`,
    ROUND(
      COALESCE(SUM(li.`Quantity` * li.`UnitRate`), 0) *
      (1 + (b.`OverheadPercent` / 100) + (b.`ContingencyPercent` / 100)),
      2
    ) AS `GrandTotal`
  FROM `BOQs` b
  LEFT JOIN `BOQLineItems` li
    ON li.`BOQId` = b.`Id`
   AND li.`IsDeleted` = 0
  WHERE b.`Id` = p_boq_id
    AND b.`IsDeleted` = 0
  GROUP BY b.`Id`, b.`Title`, b.`ContractorId`, b.`Status`, b.`OverheadPercent`, b.`ContingencyPercent`;
END$$

DROP PROCEDURE IF EXISTS `sp_project_progress_report`$$
CREATE PROCEDURE `sp_project_progress_report`(
  IN p_contractor_id CHAR(36)
)
BEGIN
  SELECT
    p.`Id`,
    p.`Title`,
    p.`Status`,
    p.`CompletionPercent`,
    p.`ContractValue`,
    p.`ExpectedCompletionDate`,
    COUNT(m.`Id`) AS `MilestoneCount`,
    SUM(CASE WHEN m.`Status` = 'Completed' THEN 1 ELSE 0 END) AS `MilestonesCompleted`,
    SUM(CASE WHEN m.`DueDate` < UTC_TIMESTAMP() AND m.`Status` <> 'Completed' THEN 1 ELSE 0 END) AS `OverdueMilestones`
  FROM `Projects` p
  LEFT JOIN `Milestones` m
    ON m.`ProjectId` = p.`Id`
   AND m.`IsDeleted` = 0
  WHERE p.`ContractorId` = p_contractor_id
    AND p.`IsDeleted` = 0
  GROUP BY p.`Id`, p.`Title`, p.`Status`, p.`CompletionPercent`, p.`ContractValue`, p.`ExpectedCompletionDate`
  ORDER BY p.`UpdatedAt` DESC;
END$$

DROP PROCEDURE IF EXISTS `sp_payment_due_alerts`$$
CREATE PROCEDURE `sp_payment_due_alerts`(
  IN p_contractor_id CHAR(36),
  IN p_days_ahead INT
)
BEGIN
  SELECT
    i.`Id`,
    i.`InvoiceNumber`,
    i.`ClientName`,
    i.`Amount`,
    i.`PaidAmount`,
    (i.`Amount` - i.`PaidAmount`) AS `OutstandingAmount`,
    i.`DueDate`,
    DATEDIFF(i.`DueDate`, UTC_DATE()) AS `DaysToDue`,
    i.`Status`
  FROM `Invoices` i
  WHERE i.`ContractorId` = p_contractor_id
    AND i.`IsDeleted` = 0
    AND i.`DueDate` IS NOT NULL
    AND i.`Status` IN ('Sent','PartiallyPaid','Overdue')
    AND i.`DueDate` <= DATE_ADD(UTC_DATE(), INTERVAL p_days_ahead DAY)
  ORDER BY i.`DueDate` ASC;
END$$

DROP PROCEDURE IF EXISTS `sp_invoice_summary`$$
CREATE PROCEDURE `sp_invoice_summary`(
  IN p_contractor_id CHAR(36),
  IN p_from_date DATE,
  IN p_to_date DATE
)
BEGIN
  SELECT
    COUNT(*) AS `InvoiceCount`,
    COALESCE(SUM(i.`Amount`), 0) AS `GrossAmount`,
    COALESCE(SUM(i.`PaidAmount`), 0) AS `CollectedAmount`,
    COALESCE(SUM(i.`Amount` - i.`PaidAmount`), 0) AS `OutstandingAmount`,
    SUM(CASE WHEN i.`Status` = 'Paid' THEN 1 ELSE 0 END) AS `PaidCount`,
    SUM(CASE WHEN i.`Status` = 'Overdue' THEN 1 ELSE 0 END) AS `OverdueCount`
  FROM `Invoices` i
  WHERE i.`ContractorId` = p_contractor_id
    AND i.`IsDeleted` = 0
    AND (p_from_date IS NULL OR DATE(i.`CreatedAt`) >= p_from_date)
    AND (p_to_date IS NULL OR DATE(i.`CreatedAt`) <= p_to_date);
END$$

DROP PROCEDURE IF EXISTS `sp_material_rate_trends`$$
CREATE PROCEDURE `sp_material_rate_trends`(
  IN p_state VARCHAR(100),
  IN p_material_name VARCHAR(200),
  IN p_months_back INT
)
BEGIN
  SELECT
    mr.`MaterialName`,
    mr.`State`,
    DATE_FORMAT(mr.`EffectiveDate`, '%Y-%m') AS `RateMonth`,
    ROUND(AVG(mr.`Rate`), 2) AS `AvgRate`,
    MIN(mr.`Rate`) AS `MinRate`,
    MAX(mr.`Rate`) AS `MaxRate`,
    COUNT(*) AS `Observations`
  FROM `MaterialRates` mr
  WHERE mr.`IsDeleted` = 0
    AND (p_state IS NULL OR p_state = '' OR mr.`State` = p_state)
    AND (p_material_name IS NULL OR p_material_name = '' OR mr.`MaterialName` = p_material_name)
    AND mr.`EffectiveDate` >= DATE_SUB(UTC_TIMESTAMP(), INTERVAL p_months_back MONTH)
  GROUP BY mr.`MaterialName`, mr.`State`, DATE_FORMAT(mr.`EffectiveDate`, '%Y-%m')
  ORDER BY `RateMonth` DESC, mr.`MaterialName`;
END$$

DROP PROCEDURE IF EXISTS `sp_contractor_activity_feed`$$
CREATE PROCEDURE `sp_contractor_activity_feed`(
  IN p_contractor_id CHAR(36),
  IN p_limit INT
)
BEGIN
  SELECT
    a.`Id`,
    a.`EventType`,
    a.`Description`,
    a.`EntityType`,
    a.`EntityId`,
    a.`ActorUserId`,
    a.`CreatedAt`
  FROM `ActivityEvents` a
  WHERE a.`ContractorId` = p_contractor_id
    AND a.`IsDeleted` = 0
  ORDER BY a.`CreatedAt` DESC
  LIMIT p_limit;
END$$

DELIMITER ;
