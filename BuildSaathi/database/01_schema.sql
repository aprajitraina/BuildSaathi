-- BuildSaathi Database Master Package
-- 01_schema.sql
-- Purpose: Core schema DDL (tables + columns + PK/UK + audit/soft-delete columns)
-- Notes:
--   1) Aligned to current EF Core model table names/types.
--   2) Includes requested Roles and Suppliers as platform reference tables.
--   3) FK and index strategy are finalized in 02_constraints_indexes.sql.

CREATE DATABASE IF NOT EXISTS `buildsaathi_dev`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `buildsaathi_dev`;

-- ---------------------------------------------------------------------------
-- Reference / identity
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `Roles` (
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
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `Contractors` (
  `Id` CHAR(36) NOT NULL,
  `Name` VARCHAR(200) NOT NULL,
  `Email` VARCHAR(200) NOT NULL,
  `Phone` VARCHAR(20) NOT NULL,
  `CompanyName` VARCHAR(300) NOT NULL,
  `GstNumber` VARCHAR(15) NULL,
  `PanNumber` VARCHAR(10) NULL,
  `City` VARCHAR(100) NOT NULL,
  `State` VARCHAR(100) NOT NULL,
  `Address` VARCHAR(500) NULL,
  `Plan` VARCHAR(20) NOT NULL,
  `IsActive` TINYINT(1) NOT NULL DEFAULT 1,
  `PreferredCategories` VARCHAR(1000) NOT NULL,
  `CreatedAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `UpdatedAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `CreatedById` CHAR(36) NULL,
  `UpdatedById` CHAR(36) NULL,
  `IsDeleted` TINYINT(1) NOT NULL DEFAULT 0,
  `DeletedAt` DATETIME(6) NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `UK_Contractors_Email` (`Email`)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `Users` (
  `Id` CHAR(36) NOT NULL,
  `ContractorId` CHAR(36) NOT NULL,
  `Name` VARCHAR(200) NOT NULL,
  `Email` VARCHAR(200) NOT NULL,
  `PasswordHash` VARCHAR(500) NOT NULL,
  `Phone` VARCHAR(20) NULL,
  `Role` VARCHAR(20) NOT NULL, -- EF-compatible role storage
  `RoleId` CHAR(36) NULL,      -- optional lookup reference for reporting
  `IsActive` TINYINT(1) NOT NULL DEFAULT 1,
  `RefreshToken` VARCHAR(500) NULL,
  `RefreshTokenExpiresAt` DATETIME(6) NULL,
  `CreatedAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `UpdatedAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `CreatedById` CHAR(36) NULL,
  `UpdatedById` CHAR(36) NULL,
  `IsDeleted` TINYINT(1) NOT NULL DEFAULT 0,
  `DeletedAt` DATETIME(6) NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `UK_Users_Email` (`Email`)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------------
-- Tender intelligence
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `Tenders` (
  `Id` CHAR(36) NOT NULL,
  `Title` VARCHAR(500) NOT NULL,
  `ReferenceNumber` VARCHAR(100) NOT NULL,
  `Department` VARCHAR(300) NOT NULL,
  `Organization` VARCHAR(300) NOT NULL,
  `State` VARCHAR(100) NOT NULL,
  `District` VARCHAR(100) NULL,
  `Category` VARCHAR(100) NOT NULL,
  `EstimatedValue` DECIMAL(18,2) NOT NULL,
  `EmdAmount` DECIMAL(18,2) NULL,
  `DocumentFee` DECIMAL(18,2) NULL,
  `PublishedDate` DATETIME(6) NOT NULL,
  `SubmissionDeadline` DATETIME(6) NOT NULL,
  `OpeningDate` DATETIME(6) NULL,
  `SourceUrl` VARCHAR(1000) NULL,
  `SourcePortal` VARCHAR(100) NOT NULL,
  `IsActive` TINYINT(1) NOT NULL DEFAULT 1,
  `Tags` VARCHAR(500) NOT NULL,
  `CreatedAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `UpdatedAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `CreatedById` CHAR(36) NULL,
  `UpdatedById` CHAR(36) NULL,
  `IsDeleted` TINYINT(1) NOT NULL DEFAULT 0,
  `DeletedAt` DATETIME(6) NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `UK_Tenders_ReferenceNumber` (`ReferenceNumber`)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `TenderMatches` (
  `Id` CHAR(36) NOT NULL,
  `ContractorId` CHAR(36) NOT NULL,
  `TenderId` CHAR(36) NOT NULL,
  `Status` VARCHAR(30) NOT NULL,
  `Notes` VARCHAR(1000) NULL,
  `CreatedAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `UpdatedAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `CreatedById` CHAR(36) NULL,
  `UpdatedById` CHAR(36) NULL,
  `IsDeleted` TINYINT(1) NOT NULL DEFAULT 0,
  `DeletedAt` DATETIME(6) NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `UK_TenderMatches_Contractor_Tender` (`ContractorId`, `TenderId`)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `TenderSummaries` (
  `Id` CHAR(36) NOT NULL,
  `TenderId` CHAR(36) NOT NULL,
  `ScopeOfWork` VARCHAR(2000) NOT NULL,
  `KeyRequirements` VARCHAR(4000) NOT NULL,
  `EligibilityCriteria` VARCHAR(4000) NOT NULL,
  `KeyRisks` VARCHAR(2000) NOT NULL,
  `Recommendation` VARCHAR(10) NOT NULL,
  `RecommendationReason` VARCHAR(1000) NOT NULL,
  `IsAiGenerated` TINYINT(1) NOT NULL DEFAULT 0,
  `ContentHash` VARCHAR(100) NULL,
  `CreatedAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `UpdatedAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `CreatedById` CHAR(36) NULL,
  `UpdatedById` CHAR(36) NULL,
  `IsDeleted` TINYINT(1) NOT NULL DEFAULT 0,
  `DeletedAt` DATETIME(6) NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `UK_TenderSummaries_TenderId` (`TenderId`)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------------
-- Execution and costing
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `Projects` (
  `Id` CHAR(36) NOT NULL,
  `ContractorId` CHAR(36) NOT NULL,
  `TenderId` CHAR(36) NULL, -- EF model keeps nullable column without FK
  `Title` VARCHAR(300) NOT NULL,
  `ClientName` VARCHAR(200) NULL,
  `Location` VARCHAR(300) NOT NULL,
  `State` VARCHAR(100) NOT NULL,
  `Status` VARCHAR(20) NOT NULL,
  `ContractValue` DECIMAL(18,2) NOT NULL,
  `CompletionPercent` INT NOT NULL DEFAULT 0,
  `StartDate` DATETIME(6) NULL,
  `ExpectedCompletionDate` DATETIME(6) NULL,
  `ActualCompletionDate` DATETIME(6) NULL,
  `CreatedAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `UpdatedAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `CreatedById` CHAR(36) NULL,
  `UpdatedById` CHAR(36) NULL,
  `IsDeleted` TINYINT(1) NOT NULL DEFAULT 0,
  `DeletedAt` DATETIME(6) NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `Milestones` (
  `Id` CHAR(36) NOT NULL,
  `ProjectId` CHAR(36) NOT NULL,
  `Title` VARCHAR(200) NOT NULL,
  `Description` VARCHAR(500) NULL,
  `Status` VARCHAR(20) NOT NULL,
  `DueDate` DATETIME(6) NULL,
  `CompletedAt` DATETIME(6) NULL,
  `SortOrder` INT NOT NULL DEFAULT 0,
  `CreatedAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `UpdatedAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `CreatedById` CHAR(36) NULL,
  `UpdatedById` CHAR(36) NULL,
  `IsDeleted` TINYINT(1) NOT NULL DEFAULT 0,
  `DeletedAt` DATETIME(6) NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `BOQs` (
  `Id` CHAR(36) NOT NULL,
  `ContractorId` CHAR(36) NOT NULL,
  `TenderId` CHAR(36) NULL,
  `ProjectId` CHAR(36) NULL, -- EF model column exists without FK
  `Title` VARCHAR(300) NOT NULL,
  `State` VARCHAR(100) NOT NULL,
  `WorkCategory` VARCHAR(100) NOT NULL,
  `Status` VARCHAR(20) NOT NULL DEFAULT 'Draft',
  `OverheadPercent` DECIMAL(5,2) NOT NULL DEFAULT 15.00,
  `ContingencyPercent` DECIMAL(5,2) NOT NULL DEFAULT 5.00,
  `CreatedAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `UpdatedAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `CreatedById` CHAR(36) NULL,
  `UpdatedById` CHAR(36) NULL,
  `IsDeleted` TINYINT(1) NOT NULL DEFAULT 0,
  `DeletedAt` DATETIME(6) NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `BOQLineItems` (
  `Id` CHAR(36) NOT NULL,
  `BOQId` CHAR(36) NOT NULL,
  `Description` VARCHAR(500) NOT NULL,
  `Unit` VARCHAR(30) NOT NULL,
  `Quantity` DECIMAL(18,3) NOT NULL,
  `UnitRate` DECIMAL(18,2) NOT NULL,
  `DsrCode` VARCHAR(50) NULL,
  `Category` VARCHAR(100) NOT NULL,
  `Remarks` VARCHAR(500) NULL,
  `SortOrder` INT NOT NULL DEFAULT 0,
  `CreatedAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `UpdatedAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `CreatedById` CHAR(36) NULL,
  `UpdatedById` CHAR(36) NULL,
  `IsDeleted` TINYINT(1) NOT NULL DEFAULT 0,
  `DeletedAt` DATETIME(6) NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------------
-- Rate libraries
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `DSRRates` (
  `Id` CHAR(36) NOT NULL,
  `Code` VARCHAR(50) NOT NULL,
  `Description` VARCHAR(1000) NOT NULL,
  `Unit` VARCHAR(30) NOT NULL,
  `Rate` DECIMAL(18,2) NOT NULL,
  `State` VARCHAR(100) NOT NULL,
  `Category` VARCHAR(100) NOT NULL,
  `EffectiveFrom` DATETIME(6) NOT NULL,
  `Source` VARCHAR(100) NOT NULL,
  `IsActive` TINYINT(1) NOT NULL DEFAULT 1,
  `CreatedAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `UpdatedAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `CreatedById` CHAR(36) NULL,
  `UpdatedById` CHAR(36) NULL,
  `IsDeleted` TINYINT(1) NOT NULL DEFAULT 0,
  `DeletedAt` DATETIME(6) NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `Suppliers` (
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
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `MaterialRates` (
  `Id` CHAR(36) NOT NULL,
  `MaterialName` VARCHAR(200) NOT NULL,
  `Unit` VARCHAR(30) NOT NULL,
  `Rate` DECIMAL(18,2) NOT NULL,
  `State` VARCHAR(100) NOT NULL,
  `District` VARCHAR(100) NULL,
  `EffectiveDate` DATETIME(6) NOT NULL,
  `Source` VARCHAR(200) NULL,
  `SupplierId` CHAR(36) NULL,
  `Category` VARCHAR(50) NOT NULL,
  `CreatedAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `UpdatedAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `CreatedById` CHAR(36) NULL,
  `UpdatedById` CHAR(36) NULL,
  `IsDeleted` TINYINT(1) NOT NULL DEFAULT 0,
  `DeletedAt` DATETIME(6) NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------------
-- Billing, documents, notifications, activity
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `Invoices` (
  `Id` CHAR(36) NOT NULL,
  `ContractorId` CHAR(36) NOT NULL,
  `ProjectId` CHAR(36) NULL,
  `InvoiceNumber` VARCHAR(50) NOT NULL,
  `ClientName` VARCHAR(200) NOT NULL,
  `Amount` DECIMAL(18,2) NOT NULL,
  `PaidAmount` DECIMAL(18,2) NOT NULL DEFAULT 0.00,
  `Status` VARCHAR(20) NOT NULL,
  `IssuedDate` DATETIME(6) NULL,
  `DueDate` DATETIME(6) NULL,
  `Notes` VARCHAR(1000) NULL,
  `CreatedAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `UpdatedAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `CreatedById` CHAR(36) NULL,
  `UpdatedById` CHAR(36) NULL,
  `IsDeleted` TINYINT(1) NOT NULL DEFAULT 0,
  `DeletedAt` DATETIME(6) NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `Payments` (
  `Id` CHAR(36) NOT NULL,
  `InvoiceId` CHAR(36) NOT NULL,
  `Amount` DECIMAL(18,2) NOT NULL,
  `PaidDate` DATETIME(6) NOT NULL,
  `PaymentMethod` VARCHAR(50) NULL,
  `ReferenceNumber` VARCHAR(100) NULL,
  `Notes` VARCHAR(500) NULL,
  `CreatedAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `UpdatedAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `CreatedById` CHAR(36) NULL,
  `UpdatedById` CHAR(36) NULL,
  `IsDeleted` TINYINT(1) NOT NULL DEFAULT 0,
  `DeletedAt` DATETIME(6) NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `Documents` (
  `Id` CHAR(36) NOT NULL,
  `ContractorId` CHAR(36) NOT NULL,
  `FileName` VARCHAR(300) NOT NULL,
  `OriginalFileName` VARCHAR(300) NOT NULL,
  `ContentType` VARCHAR(100) NOT NULL,
  `FileSizeBytes` BIGINT NOT NULL,
  `StorageKey` VARCHAR(500) NOT NULL,
  `DocumentType` VARCHAR(50) NOT NULL,
  `EntityType` VARCHAR(50) NULL,
  `EntityId` CHAR(36) NULL,
  `Tags` VARCHAR(500) NULL,
  `TenderId` CHAR(36) NULL,
  `CreatedAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `UpdatedAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `CreatedById` CHAR(36) NULL,
  `UpdatedById` CHAR(36) NULL,
  `IsDeleted` TINYINT(1) NOT NULL DEFAULT 0,
  `DeletedAt` DATETIME(6) NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `Notifications` (
  `Id` CHAR(36) NOT NULL,
  `ContractorId` CHAR(36) NOT NULL,
  `Title` VARCHAR(200) NOT NULL,
  `Message` VARCHAR(1000) NOT NULL,
  `Type` VARCHAR(50) NOT NULL,
  `IsRead` TINYINT(1) NOT NULL DEFAULT 0,
  `ActionUrl` VARCHAR(500) NULL,
  `EntityType` VARCHAR(50) NULL,
  `EntityId` CHAR(36) NULL,
  `CreatedAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `UpdatedAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `CreatedById` CHAR(36) NULL,
  `UpdatedById` CHAR(36) NULL,
  `IsDeleted` TINYINT(1) NOT NULL DEFAULT 0,
  `DeletedAt` DATETIME(6) NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `ActivityEvents` (
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
) ENGINE=InnoDB;
