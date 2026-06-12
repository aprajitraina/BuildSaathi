START TRANSACTION;

CREATE TABLE `ActivityEvents` (
    `Id` char(36) COLLATE ascii_general_ci NOT NULL,
    `ContractorId` char(36) COLLATE ascii_general_ci NOT NULL,
    `ActorUserId` char(36) COLLATE ascii_general_ci NULL,
    `EventType` varchar(64) CHARACTER SET utf8mb4 NOT NULL,
    `Description` varchar(500) CHARACTER SET utf8mb4 NOT NULL,
    `EntityType` varchar(64) CHARACTER SET utf8mb4 NOT NULL,
    `EntityId` char(36) COLLATE ascii_general_ci NULL,
    `MetadataJson` varchar(2000) CHARACTER SET utf8mb4 NULL,
    `CreatedAt` datetime(6) NOT NULL,
    `UpdatedAt` datetime(6) NOT NULL,
    `CreatedById` char(36) COLLATE ascii_general_ci NULL,
    `UpdatedById` char(36) COLLATE ascii_general_ci NULL,
    `IsDeleted` tinyint(1) NOT NULL,
    `DeletedAt` datetime(6) NULL,
    CONSTRAINT `PK_ActivityEvents` PRIMARY KEY (`Id`)
) CHARACTER SET=utf8mb4;

CREATE INDEX `IX_ActivityEvents_ContractorId_CreatedAt` ON `ActivityEvents` (`ContractorId`, `CreatedAt`);

CREATE INDEX `IX_ActivityEvents_ContractorId_EventType` ON `ActivityEvents` (`ContractorId`, `EventType`);

CREATE INDEX `IX_ActivityEvents_EntityType_EntityId` ON `ActivityEvents` (`EntityType`, `EntityId`);

INSERT INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`)
VALUES ('20260429193118_AddActivityEvents', '8.0.2');

COMMIT;

