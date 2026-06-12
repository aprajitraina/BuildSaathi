-- BuildSaathi Database Master Package
-- 06_triggers.sql
-- Purpose: Data quality automation (audit timestamps, payment rollups, activity, notifications).

USE `buildsaathi_dev`;

DELIMITER $$

-- ---------------------------------------------------------------------------
-- Audit timestamp triggers
-- ---------------------------------------------------------------------------

DROP TRIGGER IF EXISTS `trg_contractors_set_updated_at`$$
CREATE TRIGGER `trg_contractors_set_updated_at`
BEFORE UPDATE ON `Contractors`
FOR EACH ROW
BEGIN
  SET NEW.`UpdatedAt` = UTC_TIMESTAMP(6);
END$$

DROP TRIGGER IF EXISTS `trg_users_set_updated_at`$$
CREATE TRIGGER `trg_users_set_updated_at`
BEFORE UPDATE ON `Users`
FOR EACH ROW
BEGIN
  SET NEW.`UpdatedAt` = UTC_TIMESTAMP(6);
END$$

DROP TRIGGER IF EXISTS `trg_tenders_set_updated_at`$$
CREATE TRIGGER `trg_tenders_set_updated_at`
BEFORE UPDATE ON `Tenders`
FOR EACH ROW
BEGIN
  SET NEW.`UpdatedAt` = UTC_TIMESTAMP(6);
END$$

DROP TRIGGER IF EXISTS `trg_projects_set_updated_at`$$
CREATE TRIGGER `trg_projects_set_updated_at`
BEFORE UPDATE ON `Projects`
FOR EACH ROW
BEGIN
  SET NEW.`UpdatedAt` = UTC_TIMESTAMP(6);
END$$

DROP TRIGGER IF EXISTS `trg_boqs_set_updated_at`$$
CREATE TRIGGER `trg_boqs_set_updated_at`
BEFORE UPDATE ON `BOQs`
FOR EACH ROW
BEGIN
  SET NEW.`UpdatedAt` = UTC_TIMESTAMP(6);
END$$

DROP TRIGGER IF EXISTS `trg_invoices_set_updated_at`$$
CREATE TRIGGER `trg_invoices_set_updated_at`
BEFORE UPDATE ON `Invoices`
FOR EACH ROW
BEGIN
  SET NEW.`UpdatedAt` = UTC_TIMESTAMP(6);
END$$

-- ---------------------------------------------------------------------------
-- Payment balance + invoice status
-- ---------------------------------------------------------------------------

DROP TRIGGER IF EXISTS `trg_payments_after_insert_update_invoice`$$
CREATE TRIGGER `trg_payments_after_insert_update_invoice`
AFTER INSERT ON `Payments`
FOR EACH ROW
BEGIN
  DECLARE v_total_paid DECIMAL(18,2);
  DECLARE v_total_amount DECIMAL(18,2);
  DECLARE v_current_status VARCHAR(20);

  SELECT COALESCE(SUM(p.`Amount`), 0)
    INTO v_total_paid
  FROM `Payments` p
  WHERE p.`InvoiceId` = NEW.`InvoiceId`
    AND p.`IsDeleted` = 0;

  SELECT i.`Amount`, i.`Status`
    INTO v_total_amount, v_current_status
  FROM `Invoices` i
  WHERE i.`Id` = NEW.`InvoiceId`;

  UPDATE `Invoices`
  SET `PaidAmount` = v_total_paid,
      `Status` = CASE
                   WHEN v_current_status = 'Cancelled' THEN 'Cancelled'
                   WHEN v_total_paid <= 0 AND v_current_status = 'Draft' THEN 'Draft'
                   WHEN v_total_paid <= 0 THEN 'Sent'
                   WHEN v_total_paid >= v_total_amount THEN 'Paid'
                   ELSE 'PartiallyPaid'
                 END,
      `UpdatedAt` = UTC_TIMESTAMP(6)
  WHERE `Id` = NEW.`InvoiceId`;
END$$

DROP TRIGGER IF EXISTS `trg_payments_after_update_recalculate_invoice`$$
CREATE TRIGGER `trg_payments_after_update_recalculate_invoice`
AFTER UPDATE ON `Payments`
FOR EACH ROW
BEGIN
  DECLARE v_total_paid DECIMAL(18,2);
  DECLARE v_total_amount DECIMAL(18,2);
  DECLARE v_current_status VARCHAR(20);

  SELECT COALESCE(SUM(p.`Amount`), 0)
    INTO v_total_paid
  FROM `Payments` p
  WHERE p.`InvoiceId` = NEW.`InvoiceId`
    AND p.`IsDeleted` = 0;

  SELECT i.`Amount`, i.`Status`
    INTO v_total_amount, v_current_status
  FROM `Invoices` i
  WHERE i.`Id` = NEW.`InvoiceId`;

  UPDATE `Invoices`
  SET `PaidAmount` = v_total_paid,
      `Status` = CASE
                   WHEN v_current_status = 'Cancelled' THEN 'Cancelled'
                   WHEN v_total_paid <= 0 AND v_current_status = 'Draft' THEN 'Draft'
                   WHEN v_total_paid <= 0 THEN 'Sent'
                   WHEN v_total_paid >= v_total_amount THEN 'Paid'
                   ELSE 'PartiallyPaid'
                 END,
      `UpdatedAt` = UTC_TIMESTAMP(6)
  WHERE `Id` = NEW.`InvoiceId`;
END$$

-- ---------------------------------------------------------------------------
-- Activity logging + notification generation
-- ---------------------------------------------------------------------------

DROP TRIGGER IF EXISTS `trg_projects_after_insert_activity`$$
CREATE TRIGGER `trg_projects_after_insert_activity`
AFTER INSERT ON `Projects`
FOR EACH ROW
BEGIN
  INSERT INTO `ActivityEvents`
  (`Id`,`ContractorId`,`ActorUserId`,`EventType`,`Description`,`EntityType`,`EntityId`,`MetadataJson`,`CreatedAt`,`UpdatedAt`,`IsDeleted`)
  VALUES
  (UUID(), NEW.`ContractorId`, NEW.`CreatedById`, 'ProjectCreated',
   CONCAT('Project created: ', NEW.`Title`), 'Project', NEW.`Id`,
   JSON_OBJECT('status', NEW.`Status`, 'completionPercent', NEW.`CompletionPercent`),
   UTC_TIMESTAMP(6), UTC_TIMESTAMP(6), 0);
END$$

DROP TRIGGER IF EXISTS `trg_invoices_after_update_notify_overdue`$$
CREATE TRIGGER `trg_invoices_after_update_notify_overdue`
AFTER UPDATE ON `Invoices`
FOR EACH ROW
BEGIN
  IF NEW.`Status` = 'Overdue' AND OLD.`Status` <> 'Overdue' THEN
    INSERT INTO `Notifications`
    (`Id`,`ContractorId`,`Title`,`Message`,`Type`,`IsRead`,`ActionUrl`,`EntityType`,`EntityId`,`CreatedAt`,`UpdatedAt`,`IsDeleted`)
    VALUES
    (UUID(), NEW.`ContractorId`, 'Invoice overdue',
     CONCAT('Invoice ', NEW.`InvoiceNumber`, ' is now overdue.'), 'invoice', 0,
     '/billing/invoices', 'Invoice', NEW.`Id`, UTC_TIMESTAMP(6), UTC_TIMESTAMP(6), 0);

    INSERT INTO `ActivityEvents`
    (`Id`,`ContractorId`,`ActorUserId`,`EventType`,`Description`,`EntityType`,`EntityId`,`MetadataJson`,`CreatedAt`,`UpdatedAt`,`IsDeleted`)
    VALUES
    (UUID(), NEW.`ContractorId`, NEW.`UpdatedById`, 'InvoiceOverdue',
     CONCAT('Invoice marked overdue: ', NEW.`InvoiceNumber`), 'Invoice', NEW.`Id`,
     JSON_OBJECT('previousStatus', OLD.`Status`, 'currentStatus', NEW.`Status`),
     UTC_TIMESTAMP(6), UTC_TIMESTAMP(6), 0);
  END IF;
END$$

DELIMITER ;
