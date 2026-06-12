-- stored_procedure_fixes.sql
-- Apply this to patch previously deployed procedures to current enum/model expectations.

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

DELIMITER ;
