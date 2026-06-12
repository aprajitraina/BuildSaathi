-- BuildSaathi Database Master Package
-- master_setup.sql
-- Purpose: Execute complete SQL setup in strict order.
--
-- Usage:
--   cd database
--   mysql -u root -p < master_setup.sql

SOURCE 01_schema.sql;
SOURCE 02_constraints_indexes.sql;
SOURCE 03_seed_data.sql;
SOURCE 04_stored_procedures.sql;
SOURCE 05_views.sql;
SOURCE 06_triggers.sql;
SOURCE 07_functions.sql;
SOURCE 08_reporting_queries.sql;
SOURCE 09_migration_patches.sql;
SOURCE 10_performance_optimization.sql;
