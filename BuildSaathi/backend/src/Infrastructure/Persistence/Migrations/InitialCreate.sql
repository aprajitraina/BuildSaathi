CREATE TABLE IF NOT EXISTS `__EFMigrationsHistory` (
    `MigrationId` varchar(150) CHARACTER SET utf8mb4 NOT NULL,
    `ProductVersion` varchar(32) CHARACTER SET utf8mb4 NOT NULL,
    CONSTRAINT `PK___EFMigrationsHistory` PRIMARY KEY (`MigrationId`)
) CHARACTER SET=utf8mb4;

START TRANSACTION;

ALTER DATABASE CHARACTER SET utf8mb4;

CREATE TABLE `Contractors` (
    `Id` char(36) COLLATE ascii_general_ci NOT NULL,
    `Name` varchar(200) CHARACTER SET utf8mb4 NOT NULL,
    `Email` varchar(200) CHARACTER SET utf8mb4 NOT NULL,
    `Phone` varchar(20) CHARACTER SET utf8mb4 NOT NULL,
    `CompanyName` varchar(300) CHARACTER SET utf8mb4 NOT NULL,
    `GstNumber` varchar(15) CHARACTER SET utf8mb4 NULL,
    `PanNumber` varchar(10) CHARACTER SET utf8mb4 NULL,
    `City` varchar(100) CHARACTER SET utf8mb4 NOT NULL,
    `State` varchar(100) CHARACTER SET utf8mb4 NOT NULL,
    `Address` varchar(500) CHARACTER SET utf8mb4 NULL,
    `Plan` varchar(20) CHARACTER SET utf8mb4 NOT NULL,
    `IsActive` tinyint(1) NOT NULL,
    `PreferredCategories` varchar(1000) CHARACTER SET utf8mb4 NOT NULL,
    `CreatedAt` datetime(6) NOT NULL,
    `UpdatedAt` datetime(6) NOT NULL,
    `CreatedById` char(36) COLLATE ascii_general_ci NULL,
    `UpdatedById` char(36) COLLATE ascii_general_ci NULL,
    `IsDeleted` tinyint(1) NOT NULL,
    `DeletedAt` datetime(6) NULL,
    CONSTRAINT `PK_Contractors` PRIMARY KEY (`Id`)
) CHARACTER SET=utf8mb4;

CREATE TABLE `DSRRates` (
    `Id` char(36) COLLATE ascii_general_ci NOT NULL,
    `Code` varchar(50) CHARACTER SET utf8mb4 NOT NULL,
    `Description` varchar(1000) CHARACTER SET utf8mb4 NOT NULL,
    `Unit` varchar(30) CHARACTER SET utf8mb4 NOT NULL,
    `Rate` decimal(18,2) NOT NULL,
    `State` varchar(100) CHARACTER SET utf8mb4 NOT NULL,
    `Category` varchar(100) CHARACTER SET utf8mb4 NOT NULL,
    `EffectiveFrom` datetime(6) NOT NULL,
    `Source` varchar(100) CHARACTER SET utf8mb4 NOT NULL,
    `IsActive` tinyint(1) NOT NULL,
    `CreatedAt` datetime(6) NOT NULL,
    `UpdatedAt` datetime(6) NOT NULL,
    `CreatedById` char(36) COLLATE ascii_general_ci NULL,
    `UpdatedById` char(36) COLLATE ascii_general_ci NULL,
    `IsDeleted` tinyint(1) NOT NULL,
    `DeletedAt` datetime(6) NULL,
    CONSTRAINT `PK_DSRRates` PRIMARY KEY (`Id`)
) CHARACTER SET=utf8mb4;

CREATE TABLE `MaterialRates` (
    `Id` char(36) COLLATE ascii_general_ci NOT NULL,
    `MaterialName` varchar(200) CHARACTER SET utf8mb4 NOT NULL,
    `Unit` varchar(30) CHARACTER SET utf8mb4 NOT NULL,
    `Rate` decimal(18,2) NOT NULL,
    `State` varchar(100) CHARACTER SET utf8mb4 NOT NULL,
    `District` varchar(100) CHARACTER SET utf8mb4 NULL,
    `EffectiveDate` datetime(6) NOT NULL,
    `Source` varchar(200) CHARACTER SET utf8mb4 NULL,
    `SupplierId` char(36) COLLATE ascii_general_ci NULL,
    `Category` varchar(50) CHARACTER SET utf8mb4 NOT NULL,
    `CreatedAt` datetime(6) NOT NULL,
    `UpdatedAt` datetime(6) NOT NULL,
    `CreatedById` char(36) COLLATE ascii_general_ci NULL,
    `UpdatedById` char(36) COLLATE ascii_general_ci NULL,
    `IsDeleted` tinyint(1) NOT NULL,
    `DeletedAt` datetime(6) NULL,
    CONSTRAINT `PK_MaterialRates` PRIMARY KEY (`Id`)
) CHARACTER SET=utf8mb4;

CREATE TABLE `Tenders` (
    `Id` char(36) COLLATE ascii_general_ci NOT NULL,
    `Title` varchar(500) CHARACTER SET utf8mb4 NOT NULL,
    `ReferenceNumber` varchar(100) CHARACTER SET utf8mb4 NOT NULL,
    `Department` varchar(300) CHARACTER SET utf8mb4 NOT NULL,
    `Organization` varchar(300) CHARACTER SET utf8mb4 NOT NULL,
    `State` varchar(100) CHARACTER SET utf8mb4 NOT NULL,
    `District` varchar(100) CHARACTER SET utf8mb4 NULL,
    `Category` varchar(100) CHARACTER SET utf8mb4 NOT NULL,
    `EstimatedValue` decimal(18,2) NOT NULL,
    `EmdAmount` decimal(18,2) NULL,
    `DocumentFee` decimal(18,2) NULL,
    `PublishedDate` datetime(6) NOT NULL,
    `SubmissionDeadline` datetime(6) NOT NULL,
    `OpeningDate` datetime(6) NULL,
    `SourceUrl` varchar(1000) CHARACTER SET utf8mb4 NULL,
    `SourcePortal` varchar(100) CHARACTER SET utf8mb4 NOT NULL,
    `IsActive` tinyint(1) NOT NULL,
    `Tags` varchar(500) CHARACTER SET utf8mb4 NOT NULL,
    `CreatedAt` datetime(6) NOT NULL,
    `UpdatedAt` datetime(6) NOT NULL,
    `CreatedById` char(36) COLLATE ascii_general_ci NULL,
    `UpdatedById` char(36) COLLATE ascii_general_ci NULL,
    `IsDeleted` tinyint(1) NOT NULL,
    `DeletedAt` datetime(6) NULL,
    CONSTRAINT `PK_Tenders` PRIMARY KEY (`Id`)
) CHARACTER SET=utf8mb4;

CREATE TABLE `Notifications` (
    `Id` char(36) COLLATE ascii_general_ci NOT NULL,
    `ContractorId` char(36) COLLATE ascii_general_ci NOT NULL,
    `Title` varchar(200) CHARACTER SET utf8mb4 NOT NULL,
    `Message` varchar(1000) CHARACTER SET utf8mb4 NOT NULL,
    `Type` varchar(50) CHARACTER SET utf8mb4 NOT NULL,
    `IsRead` tinyint(1) NOT NULL,
    `ActionUrl` varchar(500) CHARACTER SET utf8mb4 NULL,
    `EntityType` varchar(50) CHARACTER SET utf8mb4 NULL,
    `EntityId` char(36) COLLATE ascii_general_ci NULL,
    `CreatedAt` datetime(6) NOT NULL,
    `UpdatedAt` datetime(6) NOT NULL,
    `CreatedById` char(36) COLLATE ascii_general_ci NULL,
    `UpdatedById` char(36) COLLATE ascii_general_ci NULL,
    `IsDeleted` tinyint(1) NOT NULL,
    `DeletedAt` datetime(6) NULL,
    CONSTRAINT `PK_Notifications` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_Notifications_Contractors_ContractorId` FOREIGN KEY (`ContractorId`) REFERENCES `Contractors` (`Id`) ON DELETE CASCADE
) CHARACTER SET=utf8mb4;

CREATE TABLE `Projects` (
    `Id` char(36) COLLATE ascii_general_ci NOT NULL,
    `ContractorId` char(36) COLLATE ascii_general_ci NOT NULL,
    `TenderId` char(36) COLLATE ascii_general_ci NULL,
    `Title` varchar(300) CHARACTER SET utf8mb4 NOT NULL,
    `ClientName` varchar(200) CHARACTER SET utf8mb4 NULL,
    `Location` varchar(300) CHARACTER SET utf8mb4 NOT NULL,
    `State` varchar(100) CHARACTER SET utf8mb4 NOT NULL,
    `Status` varchar(20) CHARACTER SET utf8mb4 NOT NULL,
    `ContractValue` decimal(18,2) NOT NULL,
    `CompletionPercent` int NOT NULL,
    `StartDate` datetime(6) NULL,
    `ExpectedCompletionDate` datetime(6) NULL,
    `ActualCompletionDate` datetime(6) NULL,
    `CreatedAt` datetime(6) NOT NULL,
    `UpdatedAt` datetime(6) NOT NULL,
    `CreatedById` char(36) COLLATE ascii_general_ci NULL,
    `UpdatedById` char(36) COLLATE ascii_general_ci NULL,
    `IsDeleted` tinyint(1) NOT NULL,
    `DeletedAt` datetime(6) NULL,
    CONSTRAINT `PK_Projects` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_Projects_Contractors_ContractorId` FOREIGN KEY (`ContractorId`) REFERENCES `Contractors` (`Id`) ON DELETE CASCADE
) CHARACTER SET=utf8mb4;

CREATE TABLE `Users` (
    `Id` char(36) COLLATE ascii_general_ci NOT NULL,
    `ContractorId` char(36) COLLATE ascii_general_ci NOT NULL,
    `Name` varchar(200) CHARACTER SET utf8mb4 NOT NULL,
    `Email` varchar(200) CHARACTER SET utf8mb4 NOT NULL,
    `PasswordHash` varchar(500) CHARACTER SET utf8mb4 NOT NULL,
    `Phone` varchar(20) CHARACTER SET utf8mb4 NULL,
    `Role` varchar(20) CHARACTER SET utf8mb4 NOT NULL,
    `IsActive` tinyint(1) NOT NULL,
    `RefreshToken` varchar(500) CHARACTER SET utf8mb4 NULL,
    `RefreshTokenExpiresAt` datetime(6) NULL,
    `CreatedAt` datetime(6) NOT NULL,
    `UpdatedAt` datetime(6) NOT NULL,
    `CreatedById` char(36) COLLATE ascii_general_ci NULL,
    `UpdatedById` char(36) COLLATE ascii_general_ci NULL,
    `IsDeleted` tinyint(1) NOT NULL,
    `DeletedAt` datetime(6) NULL,
    CONSTRAINT `PK_Users` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_Users_Contractors_ContractorId` FOREIGN KEY (`ContractorId`) REFERENCES `Contractors` (`Id`) ON DELETE CASCADE
) CHARACTER SET=utf8mb4;

CREATE TABLE `BOQs` (
    `Id` char(36) COLLATE ascii_general_ci NOT NULL,
    `ContractorId` char(36) COLLATE ascii_general_ci NOT NULL,
    `TenderId` char(36) COLLATE ascii_general_ci NULL,
    `ProjectId` char(36) COLLATE ascii_general_ci NULL,
    `Title` varchar(300) CHARACTER SET utf8mb4 NOT NULL,
    `State` varchar(100) CHARACTER SET utf8mb4 NOT NULL,
    `WorkCategory` varchar(100) CHARACTER SET utf8mb4 NOT NULL,
    `Status` varchar(20) CHARACTER SET utf8mb4 NOT NULL,
    `OverheadPercent` decimal(5,2) NOT NULL,
    `ContingencyPercent` decimal(5,2) NOT NULL,
    `CreatedAt` datetime(6) NOT NULL,
    `UpdatedAt` datetime(6) NOT NULL,
    `CreatedById` char(36) COLLATE ascii_general_ci NULL,
    `UpdatedById` char(36) COLLATE ascii_general_ci NULL,
    `IsDeleted` tinyint(1) NOT NULL,
    `DeletedAt` datetime(6) NULL,
    CONSTRAINT `PK_BOQs` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_BOQs_Contractors_ContractorId` FOREIGN KEY (`ContractorId`) REFERENCES `Contractors` (`Id`) ON DELETE CASCADE,
    CONSTRAINT `FK_BOQs_Tenders_TenderId` FOREIGN KEY (`TenderId`) REFERENCES `Tenders` (`Id`)
) CHARACTER SET=utf8mb4;

CREATE TABLE `Documents` (
    `Id` char(36) COLLATE ascii_general_ci NOT NULL,
    `ContractorId` char(36) COLLATE ascii_general_ci NOT NULL,
    `FileName` varchar(300) CHARACTER SET utf8mb4 NOT NULL,
    `OriginalFileName` varchar(300) CHARACTER SET utf8mb4 NOT NULL,
    `ContentType` varchar(100) CHARACTER SET utf8mb4 NOT NULL,
    `FileSizeBytes` bigint NOT NULL,
    `StorageKey` varchar(500) CHARACTER SET utf8mb4 NOT NULL,
    `DocumentType` varchar(50) CHARACTER SET utf8mb4 NOT NULL,
    `EntityType` varchar(50) CHARACTER SET utf8mb4 NULL,
    `EntityId` char(36) COLLATE ascii_general_ci NULL,
    `Tags` varchar(500) CHARACTER SET utf8mb4 NULL,
    `TenderId` char(36) COLLATE ascii_general_ci NULL,
    `CreatedAt` datetime(6) NOT NULL,
    `UpdatedAt` datetime(6) NOT NULL,
    `CreatedById` char(36) COLLATE ascii_general_ci NULL,
    `UpdatedById` char(36) COLLATE ascii_general_ci NULL,
    `IsDeleted` tinyint(1) NOT NULL,
    `DeletedAt` datetime(6) NULL,
    CONSTRAINT `PK_Documents` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_Documents_Contractors_ContractorId` FOREIGN KEY (`ContractorId`) REFERENCES `Contractors` (`Id`) ON DELETE CASCADE,
    CONSTRAINT `FK_Documents_Tenders_TenderId` FOREIGN KEY (`TenderId`) REFERENCES `Tenders` (`Id`)
) CHARACTER SET=utf8mb4;

CREATE TABLE `TenderMatches` (
    `Id` char(36) COLLATE ascii_general_ci NOT NULL,
    `ContractorId` char(36) COLLATE ascii_general_ci NOT NULL,
    `TenderId` char(36) COLLATE ascii_general_ci NOT NULL,
    `Status` varchar(30) CHARACTER SET utf8mb4 NOT NULL,
    `Notes` varchar(1000) CHARACTER SET utf8mb4 NULL,
    `CreatedAt` datetime(6) NOT NULL,
    `UpdatedAt` datetime(6) NOT NULL,
    `CreatedById` char(36) COLLATE ascii_general_ci NULL,
    `UpdatedById` char(36) COLLATE ascii_general_ci NULL,
    `IsDeleted` tinyint(1) NOT NULL,
    `DeletedAt` datetime(6) NULL,
    CONSTRAINT `PK_TenderMatches` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_TenderMatches_Contractors_ContractorId` FOREIGN KEY (`ContractorId`) REFERENCES `Contractors` (`Id`) ON DELETE CASCADE,
    CONSTRAINT `FK_TenderMatches_Tenders_TenderId` FOREIGN KEY (`TenderId`) REFERENCES `Tenders` (`Id`) ON DELETE CASCADE
) CHARACTER SET=utf8mb4;

CREATE TABLE `TenderSummaries` (
    `Id` char(36) COLLATE ascii_general_ci NOT NULL,
    `TenderId` char(36) COLLATE ascii_general_ci NOT NULL,
    `ScopeOfWork` varchar(2000) CHARACTER SET utf8mb4 NOT NULL,
    `KeyRequirements` varchar(4000) CHARACTER SET utf8mb4 NOT NULL,
    `EligibilityCriteria` varchar(4000) CHARACTER SET utf8mb4 NOT NULL,
    `KeyRisks` varchar(2000) CHARACTER SET utf8mb4 NOT NULL,
    `Recommendation` varchar(10) CHARACTER SET utf8mb4 NOT NULL,
    `RecommendationReason` varchar(1000) CHARACTER SET utf8mb4 NOT NULL,
    `IsAiGenerated` tinyint(1) NOT NULL,
    `ContentHash` varchar(100) CHARACTER SET utf8mb4 NULL,
    `CreatedAt` datetime(6) NOT NULL,
    `UpdatedAt` datetime(6) NOT NULL,
    `CreatedById` char(36) COLLATE ascii_general_ci NULL,
    `UpdatedById` char(36) COLLATE ascii_general_ci NULL,
    `IsDeleted` tinyint(1) NOT NULL,
    `DeletedAt` datetime(6) NULL,
    CONSTRAINT `PK_TenderSummaries` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_TenderSummaries_Tenders_TenderId` FOREIGN KEY (`TenderId`) REFERENCES `Tenders` (`Id`) ON DELETE CASCADE
) CHARACTER SET=utf8mb4;

CREATE TABLE `Invoices` (
    `Id` char(36) COLLATE ascii_general_ci NOT NULL,
    `ContractorId` char(36) COLLATE ascii_general_ci NOT NULL,
    `ProjectId` char(36) COLLATE ascii_general_ci NULL,
    `InvoiceNumber` varchar(50) CHARACTER SET utf8mb4 NOT NULL,
    `ClientName` varchar(200) CHARACTER SET utf8mb4 NOT NULL,
    `Amount` decimal(18,2) NOT NULL,
    `PaidAmount` decimal(18,2) NOT NULL,
    `Status` varchar(20) CHARACTER SET utf8mb4 NOT NULL,
    `IssuedDate` datetime(6) NULL,
    `DueDate` datetime(6) NULL,
    `Notes` varchar(1000) CHARACTER SET utf8mb4 NULL,
    `CreatedAt` datetime(6) NOT NULL,
    `UpdatedAt` datetime(6) NOT NULL,
    `CreatedById` char(36) COLLATE ascii_general_ci NULL,
    `UpdatedById` char(36) COLLATE ascii_general_ci NULL,
    `IsDeleted` tinyint(1) NOT NULL,
    `DeletedAt` datetime(6) NULL,
    CONSTRAINT `PK_Invoices` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_Invoices_Contractors_ContractorId` FOREIGN KEY (`ContractorId`) REFERENCES `Contractors` (`Id`) ON DELETE CASCADE,
    CONSTRAINT `FK_Invoices_Projects_ProjectId` FOREIGN KEY (`ProjectId`) REFERENCES `Projects` (`Id`)
) CHARACTER SET=utf8mb4;

CREATE TABLE `Milestones` (
    `Id` char(36) COLLATE ascii_general_ci NOT NULL,
    `ProjectId` char(36) COLLATE ascii_general_ci NOT NULL,
    `Title` varchar(200) CHARACTER SET utf8mb4 NOT NULL,
    `Description` varchar(500) CHARACTER SET utf8mb4 NULL,
    `Status` varchar(20) CHARACTER SET utf8mb4 NOT NULL,
    `DueDate` datetime(6) NULL,
    `CompletedAt` datetime(6) NULL,
    `SortOrder` int NOT NULL,
    `CreatedAt` datetime(6) NOT NULL,
    `UpdatedAt` datetime(6) NOT NULL,
    `CreatedById` char(36) COLLATE ascii_general_ci NULL,
    `UpdatedById` char(36) COLLATE ascii_general_ci NULL,
    `IsDeleted` tinyint(1) NOT NULL,
    `DeletedAt` datetime(6) NULL,
    CONSTRAINT `PK_Milestones` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_Milestones_Projects_ProjectId` FOREIGN KEY (`ProjectId`) REFERENCES `Projects` (`Id`) ON DELETE CASCADE
) CHARACTER SET=utf8mb4;

CREATE TABLE `BOQLineItems` (
    `Id` char(36) COLLATE ascii_general_ci NOT NULL,
    `BOQId` char(36) COLLATE ascii_general_ci NOT NULL,
    `Description` varchar(500) CHARACTER SET utf8mb4 NOT NULL,
    `Unit` varchar(30) CHARACTER SET utf8mb4 NOT NULL,
    `Quantity` decimal(18,3) NOT NULL,
    `UnitRate` decimal(18,2) NOT NULL,
    `DsrCode` varchar(50) CHARACTER SET utf8mb4 NULL,
    `Category` varchar(100) CHARACTER SET utf8mb4 NOT NULL,
    `Remarks` varchar(500) CHARACTER SET utf8mb4 NULL,
    `SortOrder` int NOT NULL,
    `CreatedAt` datetime(6) NOT NULL,
    `UpdatedAt` datetime(6) NOT NULL,
    `CreatedById` char(36) COLLATE ascii_general_ci NULL,
    `UpdatedById` char(36) COLLATE ascii_general_ci NULL,
    `IsDeleted` tinyint(1) NOT NULL,
    `DeletedAt` datetime(6) NULL,
    CONSTRAINT `PK_BOQLineItems` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_BOQLineItems_BOQs_BOQId` FOREIGN KEY (`BOQId`) REFERENCES `BOQs` (`Id`) ON DELETE CASCADE
) CHARACTER SET=utf8mb4;

CREATE TABLE `Payments` (
    `Id` char(36) COLLATE ascii_general_ci NOT NULL,
    `InvoiceId` char(36) COLLATE ascii_general_ci NOT NULL,
    `Amount` decimal(18,2) NOT NULL,
    `PaidDate` datetime(6) NOT NULL,
    `PaymentMethod` varchar(50) CHARACTER SET utf8mb4 NULL,
    `ReferenceNumber` varchar(100) CHARACTER SET utf8mb4 NULL,
    `Notes` varchar(500) CHARACTER SET utf8mb4 NULL,
    `CreatedAt` datetime(6) NOT NULL,
    `UpdatedAt` datetime(6) NOT NULL,
    `CreatedById` char(36) COLLATE ascii_general_ci NULL,
    `UpdatedById` char(36) COLLATE ascii_general_ci NULL,
    `IsDeleted` tinyint(1) NOT NULL,
    `DeletedAt` datetime(6) NULL,
    CONSTRAINT `PK_Payments` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_Payments_Invoices_InvoiceId` FOREIGN KEY (`InvoiceId`) REFERENCES `Invoices` (`Id`) ON DELETE CASCADE
) CHARACTER SET=utf8mb4;

CREATE INDEX `IX_BOQLineItems_BOQId` ON `BOQLineItems` (`BOQId`);

CREATE INDEX `IX_BOQs_ContractorId` ON `BOQs` (`ContractorId`);

CREATE INDEX `IX_BOQs_TenderId` ON `BOQs` (`TenderId`);

CREATE UNIQUE INDEX `IX_Contractors_Email` ON `Contractors` (`Email`);

CREATE INDEX `IX_Contractors_State` ON `Contractors` (`State`);

CREATE INDEX `IX_Documents_ContractorId` ON `Documents` (`ContractorId`);

CREATE INDEX `IX_Documents_ContractorId_EntityType_EntityId` ON `Documents` (`ContractorId`, `EntityType`, `EntityId`);

CREATE INDEX `IX_Documents_TenderId` ON `Documents` (`TenderId`);

CREATE INDEX `IX_DSRRates_Code` ON `DSRRates` (`Code`);

CREATE INDEX `IX_DSRRates_IsActive` ON `DSRRates` (`IsActive`);

CREATE INDEX `IX_DSRRates_State_Category` ON `DSRRates` (`State`, `Category`);

CREATE INDEX `IX_Invoices_ContractorId` ON `Invoices` (`ContractorId`);

CREATE INDEX `IX_Invoices_ContractorId_Status` ON `Invoices` (`ContractorId`, `Status`);

CREATE INDEX `IX_Invoices_DueDate` ON `Invoices` (`DueDate`);

CREATE INDEX `IX_Invoices_ProjectId` ON `Invoices` (`ProjectId`);

CREATE INDEX `IX_MaterialRates_Category` ON `MaterialRates` (`Category`);

CREATE INDEX `IX_MaterialRates_State_MaterialName_EffectiveDate` ON `MaterialRates` (`State`, `MaterialName`, `EffectiveDate`);

CREATE INDEX `IX_Milestones_ProjectId` ON `Milestones` (`ProjectId`);

CREATE INDEX `IX_Notifications_ContractorId` ON `Notifications` (`ContractorId`);

CREATE INDEX `IX_Notifications_ContractorId_IsRead` ON `Notifications` (`ContractorId`, `IsRead`);

CREATE INDEX `IX_Payments_InvoiceId` ON `Payments` (`InvoiceId`);

CREATE INDEX `IX_Projects_ContractorId` ON `Projects` (`ContractorId`);

CREATE INDEX `IX_Projects_ContractorId_Status` ON `Projects` (`ContractorId`, `Status`);

CREATE INDEX `IX_TenderMatches_ContractorId` ON `TenderMatches` (`ContractorId`);

CREATE UNIQUE INDEX `IX_TenderMatches_ContractorId_TenderId` ON `TenderMatches` (`ContractorId`, `TenderId`);

CREATE INDEX `IX_TenderMatches_TenderId` ON `TenderMatches` (`TenderId`);

CREATE INDEX `IX_Tenders_Category` ON `Tenders` (`Category`);

CREATE INDEX `IX_Tenders_IsActive` ON `Tenders` (`IsActive`);

CREATE UNIQUE INDEX `IX_Tenders_ReferenceNumber` ON `Tenders` (`ReferenceNumber`);

CREATE INDEX `IX_Tenders_State` ON `Tenders` (`State`);

CREATE INDEX `IX_Tenders_SubmissionDeadline` ON `Tenders` (`SubmissionDeadline`);

CREATE UNIQUE INDEX `IX_TenderSummaries_TenderId` ON `TenderSummaries` (`TenderId`);

CREATE INDEX `IX_Users_ContractorId` ON `Users` (`ContractorId`);

CREATE UNIQUE INDEX `IX_Users_Email` ON `Users` (`Email`);

INSERT INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`)
VALUES ('20260429181342_InitialCreate', '8.0.2');

COMMIT;

