-- BuildSaathi Database Master Package
-- 03_seed_data.sql
-- Purpose: Baseline seed data for local/dev/staging smoke testing.
-- Notes:
--   - Uses deterministic emails/reference numbers to stay idempotent.
--   - Password hash below is sample bcrypt for demo password only.

USE `buildsaathi_dev`;

SET @now = UTC_TIMESTAMP(6);

-- ---------------------------------------------------------------------------
-- Roles
-- ---------------------------------------------------------------------------
INSERT INTO `Roles` (`Id`, `Code`, `Name`, `Description`, `IsSystem`, `CreatedAt`, `UpdatedAt`, `IsDeleted`)
SELECT UUID(), 'Owner', 'Owner', 'Full tenant administration access', 1, @now, @now, 0
WHERE NOT EXISTS (SELECT 1 FROM `Roles` WHERE `Code` = 'Owner');

INSERT INTO `Roles` (`Id`, `Code`, `Name`, `Description`, `IsSystem`, `CreatedAt`, `UpdatedAt`, `IsDeleted`)
SELECT UUID(), 'Supervisor', 'Supervisor', 'Operational management access', 1, @now, @now, 0
WHERE NOT EXISTS (SELECT 1 FROM `Roles` WHERE `Code` = 'Supervisor');

INSERT INTO `Roles` (`Id`, `Code`, `Name`, `Description`, `IsSystem`, `CreatedAt`, `UpdatedAt`, `IsDeleted`)
SELECT UUID(), 'Staff', 'Staff', 'Execution and estimation access', 1, @now, @now, 0
WHERE NOT EXISTS (SELECT 1 FROM `Roles` WHERE `Code` = 'Staff');

INSERT INTO `Roles` (`Id`, `Code`, `Name`, `Description`, `IsSystem`, `CreatedAt`, `UpdatedAt`, `IsDeleted`)
SELECT UUID(), 'Accountant', 'Accountant', 'Billing and payment operations', 1, @now, @now, 0
WHERE NOT EXISTS (SELECT 1 FROM `Roles` WHERE `Code` = 'Accountant');

-- ---------------------------------------------------------------------------
-- Contractors + users
-- ---------------------------------------------------------------------------
SET @contractor_demo = UUID();
SET @contractor_alpha = UUID();
SET @user_demo_owner = UUID();
SET @user_alpha_mgr = UUID();

INSERT INTO `Contractors`
(`Id`,`Name`,`Email`,`Phone`,`CompanyName`,`GstNumber`,`PanNumber`,`City`,`State`,`Address`,`Plan`,`IsActive`,`PreferredCategories`,`CreatedAt`,`UpdatedAt`,`IsDeleted`)
SELECT @contractor_demo, 'Ramesh Kumar', 'demo@buildsaathi.in', '9876543210', 'Kumar Construction Pvt Ltd',
       '09ABCDE1234F1Z5', 'ABCDE1234F', 'Lucknow', 'Uttar Pradesh', 'Aliganj, Lucknow',
       'Pro', 1, 'Road & Highway,Building Construction,Civil Works', @now, @now, 0
WHERE NOT EXISTS (SELECT 1 FROM `Contractors` WHERE `Email` = 'demo@buildsaathi.in');

INSERT INTO `Contractors`
(`Id`,`Name`,`Email`,`Phone`,`CompanyName`,`GstNumber`,`PanNumber`,`City`,`State`,`Address`,`Plan`,`IsActive`,`PreferredCategories`,`CreatedAt`,`UpdatedAt`,`IsDeleted`)
SELECT @contractor_alpha, 'Anita Sharma', 'alpha@buildsaathi.in', '9822001122', 'Alpha Infra Projects LLP',
       '27AAECA1111K1Z2', 'AAECA1111K', 'Pune', 'Maharashtra', 'Baner, Pune',
       'Business', 1, 'Bridge & Culvert,Road & Highway,Water Supply', @now, @now, 0
WHERE NOT EXISTS (SELECT 1 FROM `Contractors` WHERE `Email` = 'alpha@buildsaathi.in');

SET @owner_role_id = (SELECT `Id` FROM `Roles` WHERE `Code` = 'Owner' LIMIT 1);
SET @supervisor_role_id = (SELECT `Id` FROM `Roles` WHERE `Code` = 'Supervisor' LIMIT 1);

INSERT INTO `Users`
(`Id`,`ContractorId`,`Name`,`Email`,`PasswordHash`,`Phone`,`Role`,`RoleId`,`IsActive`,`RefreshToken`,`RefreshTokenExpiresAt`,`CreatedAt`,`UpdatedAt`,`IsDeleted`)
SELECT @user_demo_owner, COALESCE((SELECT `Id` FROM `Contractors` WHERE `Email`='demo@buildsaathi.in' LIMIT 1), @contractor_demo),
       'Ramesh Kumar', 'demo@buildsaathi.in',
       '$2a$11$9kPoB2zJpQCF0T1lZL0Q8eD4qniz5TQykXWfZWs4Q95xYQ5kWl4x2',
       '9876543210', 'Owner', @owner_role_id, 1, NULL, NULL, @now, @now, 0
WHERE NOT EXISTS (SELECT 1 FROM `Users` WHERE `Email` = 'demo@buildsaathi.in');

INSERT INTO `Users`
(`Id`,`ContractorId`,`Name`,`Email`,`PasswordHash`,`Phone`,`Role`,`RoleId`,`IsActive`,`RefreshToken`,`RefreshTokenExpiresAt`,`CreatedAt`,`UpdatedAt`,`IsDeleted`)
SELECT @user_alpha_mgr, COALESCE((SELECT `Id` FROM `Contractors` WHERE `Email`='alpha@buildsaathi.in' LIMIT 1), @contractor_alpha),
       'Anita Sharma', 'manager@alpha-infra.in',
       '$2a$11$9kPoB2zJpQCF0T1lZL0Q8eD4qniz5TQykXWfZWs4Q95xYQ5kWl4x2',
       '9822001122', 'Supervisor', @supervisor_role_id, 1, NULL, NULL, @now, @now, 0
WHERE NOT EXISTS (SELECT 1 FROM `Users` WHERE `Email` = 'manager@alpha-infra.in');

-- ---------------------------------------------------------------------------
-- Suppliers + material rates
-- ---------------------------------------------------------------------------
SET @supplier1 = UUID();
SET @supplier2 = UUID();

INSERT INTO `Suppliers`
(`Id`,`ContractorId`,`Name`,`ContactPerson`,`Phone`,`Email`,`State`,`City`,`Category`,`Rating`,`IsActive`,`CreatedAt`,`UpdatedAt`,`IsDeleted`)
SELECT @supplier1, (SELECT `Id` FROM `Contractors` WHERE `Email`='demo@buildsaathi.in' LIMIT 1), 'Shivam Steel Traders',
       'Sanjay Gupta','9415000001','contact@shivamsteel.in','Uttar Pradesh','Lucknow','Steel',4.50,1,@now,@now,0
WHERE NOT EXISTS (SELECT 1 FROM `Suppliers` WHERE `Name`='Shivam Steel Traders');

INSERT INTO `Suppliers`
(`Id`,`ContractorId`,`Name`,`ContactPerson`,`Phone`,`Email`,`State`,`City`,`Category`,`Rating`,`IsActive`,`CreatedAt`,`UpdatedAt`,`IsDeleted`)
SELECT @supplier2, (SELECT `Id` FROM `Contractors` WHERE `Email`='alpha@buildsaathi.in' LIMIT 1), 'Maha Cement Depot',
       'Pratik Deshmukh','9819000002','sales@mahacement.in','Maharashtra','Pune','Cement',4.20,1,@now,@now,0
WHERE NOT EXISTS (SELECT 1 FROM `Suppliers` WHERE `Name`='Maha Cement Depot');

INSERT INTO `MaterialRates`
(`Id`,`MaterialName`,`Unit`,`Rate`,`State`,`District`,`EffectiveDate`,`Source`,`SupplierId`,`Category`,`CreatedAt`,`UpdatedAt`,`IsDeleted`)
SELECT UUID(),'OPC Cement 53 Grade','Bag (50 kg)',420.00,'Uttar Pradesh','Lucknow',@now,'Market Survey',@supplier1,'Cement',@now,@now,0
WHERE NOT EXISTS (SELECT 1 FROM `MaterialRates` WHERE `MaterialName`='OPC Cement 53 Grade' AND `State`='Uttar Pradesh' AND `IsDeleted`=0);

INSERT INTO `MaterialRates`
(`Id`,`MaterialName`,`Unit`,`Rate`,`State`,`District`,`EffectiveDate`,`Source`,`SupplierId`,`Category`,`CreatedAt`,`UpdatedAt`,`IsDeleted`)
SELECT UUID(),'TMT Steel Fe500 12mm','Kg',62.00,'Maharashtra','Pune',@now,'Market Survey',@supplier2,'Steel',@now,@now,0
WHERE NOT EXISTS (SELECT 1 FROM `MaterialRates` WHERE `MaterialName`='TMT Steel Fe500 12mm' AND `State`='Maharashtra' AND `IsDeleted`=0);

-- ---------------------------------------------------------------------------
-- DSR rates
-- ---------------------------------------------------------------------------
INSERT INTO `DSRRates`
(`Id`,`Code`,`Description`,`Unit`,`Rate`,`State`,`Category`,`EffectiveFrom`,`Source`,`IsActive`,`CreatedAt`,`UpdatedAt`,`IsDeleted`)
SELECT UUID(),'EW-001','Excavation in ordinary soil','Cum',95.00,'Uttar Pradesh','Earthwork',@now,'UPPWD DSR 2023-24',1,@now,@now,0
WHERE NOT EXISTS (SELECT 1 FROM `DSRRates` WHERE `Code`='EW-001' AND `State`='Uttar Pradesh');

INSERT INTO `DSRRates`
(`Id`,`Code`,`Description`,`Unit`,`Rate`,`State`,`Category`,`EffectiveFrom`,`Source`,`IsActive`,`CreatedAt`,`UpdatedAt`,`IsDeleted`)
SELECT UUID(),'RC-002','RCC M20 Grade including shuttering','Cum',7800.00,'Uttar Pradesh','RCC Works',@now,'UPPWD DSR 2023-24',1,@now,@now,0
WHERE NOT EXISTS (SELECT 1 FROM `DSRRates` WHERE `Code`='RC-002' AND `State`='Uttar Pradesh');

INSERT INTO `DSRRates`
(`Id`,`Code`,`Description`,`Unit`,`Rate`,`State`,`Category`,`EffectiveFrom`,`Source`,`IsActive`,`CreatedAt`,`UpdatedAt`,`IsDeleted`)
SELECT UUID(),'MH-RC-001','PCC M10 Grade','Cum',4650.00,'Maharashtra','RCC Works',@now,'Maharashtra PWD DSR 2023',1,@now,@now,0
WHERE NOT EXISTS (SELECT 1 FROM `DSRRates` WHERE `Code`='MH-RC-001' AND `State`='Maharashtra');

-- ---------------------------------------------------------------------------
-- Tenders + matches
-- ---------------------------------------------------------------------------
SET @tender1 = UUID();
SET @tender2 = UUID();
SET @demo_contractor_id = (SELECT `Id` FROM `Contractors` WHERE `Email`='demo@buildsaathi.in' LIMIT 1);

INSERT INTO `Tenders`
(`Id`,`Title`,`ReferenceNumber`,`Department`,`Organization`,`State`,`District`,`Category`,`EstimatedValue`,`EmdAmount`,`DocumentFee`,`PublishedDate`,`SubmissionDeadline`,`OpeningDate`,`SourceUrl`,`SourcePortal`,`IsActive`,`Tags`,`CreatedAt`,`UpdatedAt`,`IsDeleted`)
SELECT @tender1,
       'Construction of 2-Lane Road from Lucknow to Unnao',
       'UP/PWD/NH/2024/1842',
       'Public Works Department',
       'UPPWD Lucknow Division',
       'Uttar Pradesh','Lucknow','Road & Highway',
       285000000.00,5700000.00,25000.00,@now,DATE_ADD(@now, INTERVAL 20 DAY),DATE_ADD(@now, INTERVAL 22 DAY),
       'https://etender.up.gov.in','GePNIC',1,'road,highway,up',@now,@now,0
WHERE NOT EXISTS (SELECT 1 FROM `Tenders` WHERE `ReferenceNumber`='UP/PWD/NH/2024/1842');

INSERT INTO `Tenders`
(`Id`,`Title`,`ReferenceNumber`,`Department`,`Organization`,`State`,`District`,`Category`,`EstimatedValue`,`EmdAmount`,`DocumentFee`,`PublishedDate`,`SubmissionDeadline`,`OpeningDate`,`SourceUrl`,`SourcePortal`,`IsActive`,`Tags`,`CreatedAt`,`UpdatedAt`,`IsDeleted`)
SELECT @tender2,
       'Construction of Overhead Water Tank 2 Lakh Litre Capacity',
       'UP/JJM/OHT/2024/1105',
       'Jal Jeevan Mission',
       'UP Jal Nigam',
       'Uttar Pradesh','Prayagraj','Water Supply',
       21500000.00,430000.00,5000.00,@now,DATE_ADD(@now, INTERVAL 18 DAY),DATE_ADD(@now, INTERVAL 20 DAY),
       'https://etender.up.gov.in','GePNIC',1,'water,storage,civil',@now,@now,0
WHERE NOT EXISTS (SELECT 1 FROM `Tenders` WHERE `ReferenceNumber`='UP/JJM/OHT/2024/1105');

INSERT INTO `TenderMatches`
(`Id`,`ContractorId`,`TenderId`,`Status`,`Notes`,`CreatedAt`,`UpdatedAt`,`IsDeleted`)
SELECT UUID(), @demo_contractor_id,
       (SELECT `Id` FROM `Tenders` WHERE `ReferenceNumber`='UP/PWD/NH/2024/1842' LIMIT 1),
       'Saved','Strong fit based on category and state',@now,@now,0
WHERE NOT EXISTS (
  SELECT 1 FROM `TenderMatches`
  WHERE `ContractorId`=@demo_contractor_id
    AND `TenderId`=(SELECT `Id` FROM `Tenders` WHERE `ReferenceNumber`='UP/PWD/NH/2024/1842' LIMIT 1)
);

-- ---------------------------------------------------------------------------
-- Projects, BOQ, invoices, notifications
-- ---------------------------------------------------------------------------
SET @project1 = UUID();
SET @boq1 = UUID();
SET @invoice1 = UUID();

INSERT INTO `Projects`
(`Id`,`ContractorId`,`TenderId`,`Title`,`ClientName`,`Location`,`State`,`Status`,`ContractValue`,`CompletionPercent`,`StartDate`,`ExpectedCompletionDate`,`ActualCompletionDate`,`CreatedAt`,`UpdatedAt`,`IsDeleted`)
SELECT @project1, @demo_contractor_id,
       (SELECT `Id` FROM `Tenders` WHERE `ReferenceNumber`='UP/PWD/NH/2024/1842' LIMIT 1),
       'Lucknow-Unnao Road Package A','UPPWD','Lucknow, Uttar Pradesh','Uttar Pradesh',
       'Active',285000000.00,36,@now,DATE_ADD(@now, INTERVAL 300 DAY),NULL,@now,@now,0
WHERE NOT EXISTS (SELECT 1 FROM `Projects` WHERE `Title`='Lucknow-Unnao Road Package A' AND `ContractorId`=@demo_contractor_id);

INSERT INTO `Milestones`
(`Id`,`ProjectId`,`Title`,`Description`,`Status`,`DueDate`,`CompletedAt`,`SortOrder`,`CreatedAt`,`UpdatedAt`,`IsDeleted`)
SELECT UUID(), (SELECT `Id` FROM `Projects` WHERE `Title`='Lucknow-Unnao Road Package A' LIMIT 1),
       'Earthwork Completion','Complete subgrade and embankment section A','InProgress',
       DATE_ADD(@now, INTERVAL 45 DAY),NULL,1,@now,@now,0
WHERE NOT EXISTS (
  SELECT 1 FROM `Milestones`
  WHERE `ProjectId`=(SELECT `Id` FROM `Projects` WHERE `Title`='Lucknow-Unnao Road Package A' LIMIT 1)
    AND `Title`='Earthwork Completion'
);

INSERT INTO `BOQs`
(`Id`,`ContractorId`,`TenderId`,`ProjectId`,`Title`,`State`,`WorkCategory`,`Status`,`OverheadPercent`,`ContingencyPercent`,`CreatedAt`,`UpdatedAt`,`IsDeleted`)
SELECT @boq1,@demo_contractor_id,
       (SELECT `Id` FROM `Tenders` WHERE `ReferenceNumber`='UP/PWD/NH/2024/1842' LIMIT 1),
       (SELECT `Id` FROM `Projects` WHERE `Title`='Lucknow-Unnao Road Package A' LIMIT 1),
       'Road Package A BOQ','Uttar Pradesh','Road & Highway','Draft',12.00,5.00,@now,@now,0
WHERE NOT EXISTS (SELECT 1 FROM `BOQs` WHERE `Title`='Road Package A BOQ' AND `ContractorId`=@demo_contractor_id);

INSERT INTO `BOQLineItems`
(`Id`,`BOQId`,`Description`,`Unit`,`Quantity`,`UnitRate`,`DsrCode`,`Category`,`Remarks`,`SortOrder`,`CreatedAt`,`UpdatedAt`,`IsDeleted`)
SELECT UUID(), (SELECT `Id` FROM `BOQs` WHERE `Title`='Road Package A BOQ' LIMIT 1),
       'Excavation in ordinary soil','Cum',3500.000,95.00,'EW-001','Earthwork','Machine + manual edges',1,@now,@now,0
WHERE NOT EXISTS (
  SELECT 1 FROM `BOQLineItems`
  WHERE `BOQId`=(SELECT `Id` FROM `BOQs` WHERE `Title`='Road Package A BOQ' LIMIT 1)
    AND `Description`='Excavation in ordinary soil'
);

INSERT INTO `Invoices`
(`Id`,`ContractorId`,`ProjectId`,`InvoiceNumber`,`ClientName`,`Amount`,`PaidAmount`,`Status`,`IssuedDate`,`DueDate`,`Notes`,`CreatedAt`,`UpdatedAt`,`IsDeleted`)
SELECT @invoice1, @demo_contractor_id,
       (SELECT `Id` FROM `Projects` WHERE `Title`='Lucknow-Unnao Road Package A' LIMIT 1),
       'INV-2026-0001','UPPWD',5200000.00,1800000.00,'PartiallyPaid',@now,DATE_ADD(@now, INTERVAL 30 DAY),
       'Running bill RA-01',@now,@now,0
WHERE NOT EXISTS (SELECT 1 FROM `Invoices` WHERE `InvoiceNumber`='INV-2026-0001');

INSERT INTO `Payments`
(`Id`,`InvoiceId`,`Amount`,`PaidDate`,`PaymentMethod`,`ReferenceNumber`,`Notes`,`CreatedAt`,`UpdatedAt`,`IsDeleted`)
SELECT UUID(), (SELECT `Id` FROM `Invoices` WHERE `InvoiceNumber`='INV-2026-0001' LIMIT 1),
       1800000.00,@now,'NEFT','UTR0987654321','Part payment received',@now,@now,0
WHERE NOT EXISTS (
  SELECT 1 FROM `Payments`
  WHERE `InvoiceId`=(SELECT `Id` FROM `Invoices` WHERE `InvoiceNumber`='INV-2026-0001' LIMIT 1)
    AND `ReferenceNumber`='UTR0987654321'
);

INSERT INTO `Notifications`
(`Id`,`ContractorId`,`Title`,`Message`,`Type`,`IsRead`,`ActionUrl`,`EntityType`,`EntityId`,`CreatedAt`,`UpdatedAt`,`IsDeleted`)
SELECT UUID(), @demo_contractor_id,
       'Welcome to BuildSaathi',
       'Your account is ready. Start by reviewing tenders and preparing BOQ.',
       'system',0,'/tenders','Contractor',@demo_contractor_id,@now,@now,0
WHERE NOT EXISTS (
  SELECT 1 FROM `Notifications`
  WHERE `ContractorId`=@demo_contractor_id AND `Title`='Welcome to BuildSaathi'
);

INSERT INTO `ActivityEvents`
(`Id`,`ContractorId`,`ActorUserId`,`EventType`,`Description`,`EntityType`,`EntityId`,`MetadataJson`,`CreatedAt`,`UpdatedAt`,`IsDeleted`)
SELECT UUID(), @demo_contractor_id,
       (SELECT `Id` FROM `Users` WHERE `Email`='demo@buildsaathi.in' LIMIT 1),
       'ProjectCreated',
       'Project Lucknow-Unnao Road Package A created',
       'Project',
       (SELECT `Id` FROM `Projects` WHERE `Title`='Lucknow-Unnao Road Package A' LIMIT 1),
       '{"source":"seed","priority":"high"}',@now,@now,0
WHERE NOT EXISTS (
  SELECT 1 FROM `ActivityEvents`
  WHERE `ContractorId`=@demo_contractor_id
    AND `EventType`='ProjectCreated'
    AND `EntityType`='Project'
);
