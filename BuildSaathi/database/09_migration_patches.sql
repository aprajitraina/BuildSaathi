-- BuildSaathi Database Master Package
-- 09_migration_patches.sql
-- Purpose: Idempotent compatibility patches for existing environments.
-- Apply this when database already exists and you want to align with the package.

USE `buildsaathi_dev`;

SET @schema_name = DATABASE();

-- ---------------------------------------------------------------------------
-- Patch helper: execute only when a condition is met
-- ---------------------------------------------------------------------------

-- Add Users.RoleId if missing (optional lookup; does not break EF role string usage)
SET @exists_roleid = (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = @schema_name
    AND TABLE_NAME = 'Users'
    AND COLUMN_NAME = 'RoleId'
);
SET @sql = IF(
  @exists_roleid = 0,
  'ALTER TABLE `Users` ADD COLUMN `RoleId` CHAR(36) NULL AFTER `Role`',
  'SELECT ''Users.RoleId already exists'' AS msg'
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- Add MaterialRates.SupplierId if missing
SET @exists_supplierid = (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = @schema_name
    AND TABLE_NAME = 'MaterialRates'
    AND COLUMN_NAME = 'SupplierId'
);
SET @sql = IF(
  @exists_supplierid = 0,
  'ALTER TABLE `MaterialRates` ADD COLUMN `SupplierId` CHAR(36) NULL AFTER `Source`',
  'SELECT ''MaterialRates.SupplierId already exists'' AS msg'
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- Add ActivityEvents table if missing (introduced after initial migration)
SET @exists_activity = (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.TABLES
  WHERE TABLE_SCHEMA = @schema_name
    AND TABLE_NAME = 'ActivityEvents'
);
SET @sql = IF(
  @exists_activity = 0,
  'CREATE TABLE `ActivityEvents` (
      `Id` CHAR(36) NOT NULL,
      `ContractorId` CHAR(36) NOT NULL,
      `ActorUserId` CHAR(36) NULL,
      `EventType` VARCHAR(64) NOT NULL,
      `Description` VARCHAR(500) NOT NULL,
      `EntityType` VARCHAR(64) NOT NULL,
      `EntityId` CHAR(36) NULL,
      `MetadataJson` VARCHAR(2000) NULL,
      `CreatedAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
      `UpdatedAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
      `CreatedById` CHAR(36) NULL,
      `UpdatedById` CHAR(36) NULL,
      `IsDeleted` TINYINT(1) NOT NULL DEFAULT 0,
      `DeletedAt` DATETIME(6) NULL,
      PRIMARY KEY (`Id`)
    ) ENGINE=InnoDB',
  'SELECT ''ActivityEvents already exists'' AS msg'
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- Create Roles table if missing
SET @exists_roles = (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.TABLES
  WHERE TABLE_SCHEMA = @schema_name
    AND TABLE_NAME = 'Roles'
);
SET @sql = IF(
  @exists_roles = 0,
  'CREATE TABLE `Roles` (
      `Id` CHAR(36) NOT NULL,
      `Code` VARCHAR(50) NOT NULL,
      `Name` VARCHAR(100) NOT NULL,
      `Description` VARCHAR(300) NULL,
      `IsSystem` TINYINT(1) NOT NULL DEFAULT 1,
      `CreatedAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
      `UpdatedAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
      `CreatedById` CHAR(36) NULL,
      `UpdatedById` CHAR(36) NULL,
      `IsDeleted` TINYINT(1) NOT NULL DEFAULT 0,
      `DeletedAt` DATETIME(6) NULL,
      PRIMARY KEY (`Id`),
      UNIQUE KEY `UK_Roles_Code` (`Code`)
    ) ENGINE=InnoDB',
  'SELECT ''Roles already exists'' AS msg'
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- Create Suppliers table if missing
SET @exists_suppliers = (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.TABLES
  WHERE TABLE_SCHEMA = @schema_name
    AND TABLE_NAME = 'Suppliers'
);
SET @sql = IF(
  @exists_suppliers = 0,
  'CREATE TABLE `Suppliers` (
      `Id` CHAR(36) NOT NULL,
      `ContractorId` CHAR(36) NULL,
      `Name` VARCHAR(200) NOT NULL,
      `ContactPerson` VARCHAR(150) NULL,
      `Phone` VARCHAR(20) NULL,
      `Email` VARCHAR(200) NULL,
      `State` VARCHAR(100) NULL,
      `City` VARCHAR(100) NULL,
      `Category` VARCHAR(100) NULL,
      `Rating` DECIMAL(3,2) NULL,
      `IsActive` TINYINT(1) NOT NULL DEFAULT 1,
      `CreatedAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
      `UpdatedAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
      `CreatedById` CHAR(36) NULL,
      `UpdatedById` CHAR(36) NULL,
      `IsDeleted` TINYINT(1) NOT NULL DEFAULT 0,
      `DeletedAt` DATETIME(6) NULL,
      PRIMARY KEY (`Id`)
    ) ENGINE=InnoDB',
  'SELECT ''Suppliers already exists'' AS msg'
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- Add recommended indexes for ActivityEvents if missing
SET @idx_activity_created = (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.STATISTICS
  WHERE TABLE_SCHEMA = @schema_name
    AND TABLE_NAME = 'ActivityEvents'
    AND INDEX_NAME = 'IX_ActivityEvents_Contractor_CreatedAt'
);
SET @sql = IF(
  @idx_activity_created = 0,
  'CREATE INDEX `IX_ActivityEvents_Contractor_CreatedAt` ON `ActivityEvents` (`ContractorId`,`CreatedAt`)',
  'SELECT ''ActivityEvents contractor-createdAt index exists'' AS msg'
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- Backfill Users.RoleId from Users.Role when lookup exists
UPDATE `Users` u
LEFT JOIN `Roles` r
  ON r.`Code` = u.`Role`
 AND r.`IsDeleted` = 0
SET u.`RoleId` = r.`Id`
WHERE u.`RoleId` IS NULL;
