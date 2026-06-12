-- BuildSaathi Database Master Package
-- 02_constraints_indexes.sql
-- Purpose: Foreign keys, integrity constraints, and query indexes.

USE `buildsaathi_dev`;

-- ---------------------------------------------------------------------------
-- Foreign keys
-- ---------------------------------------------------------------------------

ALTER TABLE `Users`
  ADD CONSTRAINT `FK_Users_Contractors_ContractorId`
    FOREIGN KEY (`ContractorId`) REFERENCES `Contractors`(`Id`) ON DELETE CASCADE;

ALTER TABLE `Users`
  ADD CONSTRAINT `FK_Users_Roles_RoleId`
    FOREIGN KEY (`RoleId`) REFERENCES `Roles`(`Id`) ON DELETE SET NULL;

ALTER TABLE `TenderMatches`
  ADD CONSTRAINT `FK_TenderMatches_Contractors_ContractorId`
    FOREIGN KEY (`ContractorId`) REFERENCES `Contractors`(`Id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_TenderMatches_Tenders_TenderId`
    FOREIGN KEY (`TenderId`) REFERENCES `Tenders`(`Id`) ON DELETE CASCADE;

ALTER TABLE `TenderSummaries`
  ADD CONSTRAINT `FK_TenderSummaries_Tenders_TenderId`
    FOREIGN KEY (`TenderId`) REFERENCES `Tenders`(`Id`) ON DELETE CASCADE;

ALTER TABLE `Projects`
  ADD CONSTRAINT `FK_Projects_Contractors_ContractorId`
    FOREIGN KEY (`ContractorId`) REFERENCES `Contractors`(`Id`) ON DELETE CASCADE;

ALTER TABLE `Milestones`
  ADD CONSTRAINT `FK_Milestones_Projects_ProjectId`
    FOREIGN KEY (`ProjectId`) REFERENCES `Projects`(`Id`) ON DELETE CASCADE;

ALTER TABLE `BOQs`
  ADD CONSTRAINT `FK_BOQs_Contractors_ContractorId`
    FOREIGN KEY (`ContractorId`) REFERENCES `Contractors`(`Id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_BOQs_Tenders_TenderId`
    FOREIGN KEY (`TenderId`) REFERENCES `Tenders`(`Id`) ON DELETE SET NULL;

ALTER TABLE `BOQLineItems`
  ADD CONSTRAINT `FK_BOQLineItems_BOQs_BOQId`
    FOREIGN KEY (`BOQId`) REFERENCES `BOQs`(`Id`) ON DELETE CASCADE;

ALTER TABLE `Invoices`
  ADD CONSTRAINT `FK_Invoices_Contractors_ContractorId`
    FOREIGN KEY (`ContractorId`) REFERENCES `Contractors`(`Id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_Invoices_Projects_ProjectId`
    FOREIGN KEY (`ProjectId`) REFERENCES `Projects`(`Id`) ON DELETE SET NULL;

ALTER TABLE `Payments`
  ADD CONSTRAINT `FK_Payments_Invoices_InvoiceId`
    FOREIGN KEY (`InvoiceId`) REFERENCES `Invoices`(`Id`) ON DELETE CASCADE;

ALTER TABLE `Documents`
  ADD CONSTRAINT `FK_Documents_Contractors_ContractorId`
    FOREIGN KEY (`ContractorId`) REFERENCES `Contractors`(`Id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_Documents_Tenders_TenderId`
    FOREIGN KEY (`TenderId`) REFERENCES `Tenders`(`Id`) ON DELETE SET NULL;

ALTER TABLE `Notifications`
  ADD CONSTRAINT `FK_Notifications_Contractors_ContractorId`
    FOREIGN KEY (`ContractorId`) REFERENCES `Contractors`(`Id`) ON DELETE CASCADE;

ALTER TABLE `MaterialRates`
  ADD CONSTRAINT `FK_MaterialRates_Suppliers_SupplierId`
    FOREIGN KEY (`SupplierId`) REFERENCES `Suppliers`(`Id`) ON DELETE SET NULL;

ALTER TABLE `Suppliers`
  ADD CONSTRAINT `FK_Suppliers_Contractors_ContractorId`
    FOREIGN KEY (`ContractorId`) REFERENCES `Contractors`(`Id`) ON DELETE SET NULL;

-- ---------------------------------------------------------------------------
-- Check constraints (MySQL 8+)
-- ---------------------------------------------------------------------------

ALTER TABLE `Users`
  ADD CONSTRAINT `CK_Users_Role` CHECK (`Role` IN ('Owner','Supervisor','Accountant','Staff'));

ALTER TABLE `Contractors`
  ADD CONSTRAINT `CK_Contractors_Plan` CHECK (`Plan` IN ('Free','Pro','Business','Enterprise'));

ALTER TABLE `BOQs`
  ADD CONSTRAINT `CK_BOQs_Status` CHECK (`Status` IN ('Draft','Finalized'));

ALTER TABLE `Projects`
  ADD CONSTRAINT `CK_Projects_CompletionPercent` CHECK (`CompletionPercent` BETWEEN 0 AND 100);

ALTER TABLE `Projects`
  ADD CONSTRAINT `CK_Projects_Status` CHECK (`Status` IN ('Planning','Active','OnHold','Completed','Cancelled'));

ALTER TABLE `Milestones`
  ADD CONSTRAINT `CK_Milestones_Status` CHECK (`Status` IN ('NotStarted','InProgress','Completed','Delayed','Cancelled'));

ALTER TABLE `TenderMatches`
  ADD CONSTRAINT `CK_TenderMatches_Status` CHECK (`Status` IN ('Saved','Reviewing','BidSubmitted','Won','Lost','Withdrawn'));

ALTER TABLE `Invoices`
  ADD CONSTRAINT `CK_Invoices_Status` CHECK (`Status` IN ('Draft','Sent','PartiallyPaid','Paid','Overdue','Cancelled'));

ALTER TABLE `Notifications`
  ADD CONSTRAINT `CK_Notifications_Type` CHECK (`Type` IN ('system','tender','project','invoice','payment'));

ALTER TABLE `TenderSummaries`
  ADD CONSTRAINT `CK_TenderSummaries_Recommendation` CHECK (`Recommendation` IN ('high','medium','low'));

-- ---------------------------------------------------------------------------
-- Indexes for access patterns
-- ---------------------------------------------------------------------------

-- Contractors / users
CREATE INDEX `IX_Contractors_State` ON `Contractors` (`State`);
CREATE INDEX `IX_Users_ContractorId` ON `Users` (`ContractorId`);
CREATE INDEX `IX_Users_IsActive` ON `Users` (`IsActive`);

-- Tenders and matching
CREATE INDEX `IX_Tenders_State` ON `Tenders` (`State`);
CREATE INDEX `IX_Tenders_Category` ON `Tenders` (`Category`);
CREATE INDEX `IX_Tenders_SubmissionDeadline` ON `Tenders` (`SubmissionDeadline`);
CREATE INDEX `IX_Tenders_IsActive` ON `Tenders` (`IsActive`);
CREATE INDEX `IX_TenderMatches_ContractorId` ON `TenderMatches` (`ContractorId`);
CREATE INDEX `IX_TenderMatches_TenderId` ON `TenderMatches` (`TenderId`);

-- BOQ and cost management
CREATE INDEX `IX_BOQs_ContractorId` ON `BOQs` (`ContractorId`);
CREATE INDEX `IX_BOQs_TenderId` ON `BOQs` (`TenderId`);
CREATE INDEX `IX_BOQLineItems_BOQId` ON `BOQLineItems` (`BOQId`);
CREATE INDEX `IX_BOQLineItems_DsrCode` ON `BOQLineItems` (`DsrCode`);

-- Projects and milestones
CREATE INDEX `IX_Projects_ContractorId` ON `Projects` (`ContractorId`);
CREATE INDEX `IX_Projects_ContractorId_Status` ON `Projects` (`ContractorId`, `Status`);
CREATE INDEX `IX_Milestones_ProjectId` ON `Milestones` (`ProjectId`);
CREATE INDEX `IX_Milestones_DueDate` ON `Milestones` (`DueDate`);

-- Billing
CREATE INDEX `IX_Invoices_ContractorId` ON `Invoices` (`ContractorId`);
CREATE INDEX `IX_Invoices_ContractorId_Status` ON `Invoices` (`ContractorId`, `Status`);
CREATE INDEX `IX_Invoices_DueDate` ON `Invoices` (`DueDate`);
CREATE INDEX `IX_Invoices_ProjectId` ON `Invoices` (`ProjectId`);
CREATE INDEX `IX_Payments_InvoiceId` ON `Payments` (`InvoiceId`);
CREATE INDEX `IX_Payments_PaidDate` ON `Payments` (`PaidDate`);

-- Documents / notifications / activity
CREATE INDEX `IX_Documents_ContractorId` ON `Documents` (`ContractorId`);
CREATE INDEX `IX_Documents_TenderId` ON `Documents` (`TenderId`);
CREATE INDEX `IX_Documents_Contractor_Entity` ON `Documents` (`ContractorId`, `EntityType`, `EntityId`);
CREATE INDEX `IX_Notifications_ContractorId` ON `Notifications` (`ContractorId`);
CREATE INDEX `IX_Notifications_Contractor_IsRead` ON `Notifications` (`ContractorId`, `IsRead`);
CREATE INDEX `IX_ActivityEvents_Contractor_CreatedAt` ON `ActivityEvents` (`ContractorId`, `CreatedAt`);
CREATE INDEX `IX_ActivityEvents_Contractor_EventType` ON `ActivityEvents` (`ContractorId`, `EventType`);
CREATE INDEX `IX_ActivityEvents_Entity` ON `ActivityEvents` (`EntityType`, `EntityId`);

-- Rate libraries
CREATE INDEX `IX_DSRRates_State_Category` ON `DSRRates` (`State`, `Category`);
CREATE INDEX `IX_DSRRates_Code` ON `DSRRates` (`Code`);
CREATE INDEX `IX_DSRRates_IsActive` ON `DSRRates` (`IsActive`);
CREATE INDEX `IX_MaterialRates_State_Name_Date` ON `MaterialRates` (`State`, `MaterialName`, `EffectiveDate`);
CREATE INDEX `IX_MaterialRates_Category` ON `MaterialRates` (`Category`);
CREATE INDEX `IX_MaterialRates_SupplierId` ON `MaterialRates` (`SupplierId`);
