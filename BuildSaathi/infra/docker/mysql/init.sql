-- ─────────────────────────────────────────────────────────────────────────────
-- BuildSaathi — MySQL Initialization Script
-- Runs once when the MySQL container is first created.
-- EF Core migrations handle schema creation — this just sets up the database.
-- ─────────────────────────────────────────────────────────────────────────────

CREATE DATABASE IF NOT EXISTS `buildsaathi_dev`
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

-- Grant all privileges to the application user
GRANT ALL PRIVILEGES ON `buildsaathi_dev`.* TO 'buildsaathi'@'%';
FLUSH PRIVILEGES;

USE `buildsaathi_dev`;

-- Set timezone
SET GLOBAL time_zone = '+00:00';
SET time_zone = '+00:00';
