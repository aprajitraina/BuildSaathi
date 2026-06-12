-- BuildSaathi Database Master Package
-- 07_functions.sql
-- Purpose: Reusable SQL scalar functions for financial and project analytics.

USE `buildsaathi_dev`;

DELIMITER $$

DROP FUNCTION IF EXISTS `fn_invoice_outstanding`$$
CREATE FUNCTION `fn_invoice_outstanding`(
  p_invoice_id CHAR(36)
)
RETURNS DECIMAL(18,2)
DETERMINISTIC
READS SQL DATA
BEGIN
  DECLARE v_amount DECIMAL(18,2) DEFAULT 0.00;
  DECLARE v_paid DECIMAL(18,2) DEFAULT 0.00;

  SELECT COALESCE(`Amount`, 0), COALESCE(`PaidAmount`, 0)
    INTO v_amount, v_paid
  FROM `Invoices`
  WHERE `Id` = p_invoice_id
    AND `IsDeleted` = 0
  LIMIT 1;

  RETURN GREATEST(v_amount - v_paid, 0);
END$$

DROP FUNCTION IF EXISTS `fn_boq_total`$$
CREATE FUNCTION `fn_boq_total`(
  p_boq_id CHAR(36)
)
RETURNS DECIMAL(18,2)
DETERMINISTIC
READS SQL DATA
BEGIN
  DECLARE v_base DECIMAL(18,2) DEFAULT 0.00;
  DECLARE v_overhead_pct DECIMAL(5,2) DEFAULT 0.00;
  DECLARE v_contingency_pct DECIMAL(5,2) DEFAULT 0.00;

  SELECT
    COALESCE(SUM(li.`Quantity` * li.`UnitRate`), 0),
    b.`OverheadPercent`,
    b.`ContingencyPercent`
  INTO v_base, v_overhead_pct, v_contingency_pct
  FROM `BOQs` b
  LEFT JOIN `BOQLineItems` li
    ON li.`BOQId` = b.`Id`
   AND li.`IsDeleted` = 0
  WHERE b.`Id` = p_boq_id
    AND b.`IsDeleted` = 0
  GROUP BY b.`OverheadPercent`, b.`ContingencyPercent`;

  RETURN ROUND(v_base * (1 + (v_overhead_pct / 100) + (v_contingency_pct / 100)), 2);
END$$

DROP FUNCTION IF EXISTS `fn_project_health_score`$$
CREATE FUNCTION `fn_project_health_score`(
  p_project_id CHAR(36)
)
RETURNS INT
DETERMINISTIC
READS SQL DATA
BEGIN
  DECLARE v_completion INT DEFAULT 0;
  DECLARE v_total_milestones INT DEFAULT 0;
  DECLARE v_overdue_milestones INT DEFAULT 0;
  DECLARE v_score INT DEFAULT 100;

  SELECT p.`CompletionPercent`
    INTO v_completion
  FROM `Projects` p
  WHERE p.`Id` = p_project_id
    AND p.`IsDeleted` = 0
  LIMIT 1;

  SELECT COUNT(*)
    INTO v_total_milestones
  FROM `Milestones` m
  WHERE m.`ProjectId` = p_project_id
    AND m.`IsDeleted` = 0;

  SELECT COUNT(*)
    INTO v_overdue_milestones
  FROM `Milestones` m
  WHERE m.`ProjectId` = p_project_id
    AND m.`IsDeleted` = 0
    AND m.`Status` <> 'Completed'
    AND m.`DueDate` IS NOT NULL
    AND m.`DueDate` < UTC_TIMESTAMP();

  SET v_score = v_score
    - LEAST(v_overdue_milestones * 15, 60)
    + LEAST(FLOOR(v_completion / 10), 10);

  RETURN LEAST(GREATEST(v_score, 0), 100);
END$$

DELIMITER ;
