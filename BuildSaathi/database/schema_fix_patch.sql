-- schema_fix_patch.sql
-- Idempotent patch for environments that already executed an older SQL package.

USE `buildsaathi_dev`;
SET @schema_name = DATABASE();

-- ----------------------------------------------------------------------------
-- 1) Data correction for enum compatibility with current C# domain enums
-- ----------------------------------------------------------------------------
UPDATE `Users`
SET `Role` = 'Supervisor'
WHERE `Role` = 'Manager';

UPDATE `Users`
SET `Role` = 'Staff'
WHERE `Role` = 'Engineer';

UPDATE `Projects`
SET `Status` = 'Active'
WHERE `Status` = 'InProgress';

UPDATE `TenderMatches`
SET `Status` = 'Saved'
WHERE `Status` IN ('Interested','Applied','Submitted');

UPDATE `Roles`
SET `Code` = 'Supervisor', `Name` = 'Supervisor'
WHERE `Code` = 'Manager';

UPDATE `Roles`
SET `Code` = 'Staff', `Name` = 'Staff'
WHERE `Code` = 'Engineer';

-- ----------------------------------------------------------------------------
-- 2) Reconcile check constraints
-- ----------------------------------------------------------------------------
SET @drop_ck_users_role = (
  SELECT IF(
    EXISTS(
      SELECT 1
      FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS
      WHERE TABLE_SCHEMA = @schema_name
        AND TABLE_NAME = 'Users'
        AND CONSTRAINT_NAME = 'CK_Users_Role'
        AND CONSTRAINT_TYPE = 'CHECK'
    ),
    'ALTER TABLE `Users` DROP CHECK `CK_Users_Role`',
    'SELECT ''CK_Users_Role not present'' AS msg'
  )
);
PREPARE stmt FROM @drop_ck_users_role; EXECUTE stmt; DEALLOCATE PREPARE stmt;
ALTER TABLE `Users`
  ADD CONSTRAINT `CK_Users_Role` CHECK (`Role` IN ('Owner','Supervisor','Accountant','Staff'));

SET @drop_ck_contractors_plan = (
  SELECT IF(
    EXISTS(
      SELECT 1
      FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS
      WHERE TABLE_SCHEMA = @schema_name
        AND TABLE_NAME = 'Contractors'
        AND CONSTRAINT_NAME = 'CK_Contractors_Plan'
        AND CONSTRAINT_TYPE = 'CHECK'
    ),
    'ALTER TABLE `Contractors` DROP CHECK `CK_Contractors_Plan`',
    'SELECT ''CK_Contractors_Plan not present'' AS msg'
  )
);
PREPARE stmt FROM @drop_ck_contractors_plan; EXECUTE stmt; DEALLOCATE PREPARE stmt;
ALTER TABLE `Contractors`
  ADD CONSTRAINT `CK_Contractors_Plan` CHECK (`Plan` IN ('Free','Pro','Business','Enterprise'));

SET @drop_ck_projects_status = (
  SELECT IF(
    EXISTS(
      SELECT 1
      FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS
      WHERE TABLE_SCHEMA = @schema_name
        AND TABLE_NAME = 'Projects'
        AND CONSTRAINT_NAME = 'CK_Projects_Status'
        AND CONSTRAINT_TYPE = 'CHECK'
    ),
    'ALTER TABLE `Projects` DROP CHECK `CK_Projects_Status`',
    'SELECT ''CK_Projects_Status not present'' AS msg'
  )
);
PREPARE stmt FROM @drop_ck_projects_status; EXECUTE stmt; DEALLOCATE PREPARE stmt;
ALTER TABLE `Projects`
  ADD CONSTRAINT `CK_Projects_Status` CHECK (`Status` IN ('Planning','Active','OnHold','Completed','Cancelled'));

SET @drop_ck_milestones_status = (
  SELECT IF(
    EXISTS(
      SELECT 1
      FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS
      WHERE TABLE_SCHEMA = @schema_name
        AND TABLE_NAME = 'Milestones'
        AND CONSTRAINT_NAME = 'CK_Milestones_Status'
        AND CONSTRAINT_TYPE = 'CHECK'
    ),
    'ALTER TABLE `Milestones` DROP CHECK `CK_Milestones_Status`',
    'SELECT ''CK_Milestones_Status not present'' AS msg'
  )
);
PREPARE stmt FROM @drop_ck_milestones_status; EXECUTE stmt; DEALLOCATE PREPARE stmt;
ALTER TABLE `Milestones`
  ADD CONSTRAINT `CK_Milestones_Status` CHECK (`Status` IN ('NotStarted','InProgress','Completed','Delayed','Cancelled'));

SET @drop_ck_tm_status = (
  SELECT IF(
    EXISTS(
      SELECT 1
      FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS
      WHERE TABLE_SCHEMA = @schema_name
        AND TABLE_NAME = 'TenderMatches'
        AND CONSTRAINT_NAME = 'CK_TenderMatches_Status'
        AND CONSTRAINT_TYPE = 'CHECK'
    ),
    'ALTER TABLE `TenderMatches` DROP CHECK `CK_TenderMatches_Status`',
    'SELECT ''CK_TenderMatches_Status not present'' AS msg'
  )
);
PREPARE stmt FROM @drop_ck_tm_status; EXECUTE stmt; DEALLOCATE PREPARE stmt;
ALTER TABLE `TenderMatches`
  ADD CONSTRAINT `CK_TenderMatches_Status` CHECK (`Status` IN ('Saved','Reviewing','BidSubmitted','Won','Lost','Withdrawn'));
