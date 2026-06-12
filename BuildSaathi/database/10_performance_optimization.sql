-- BuildSaathi Database Master Package
-- 10_performance_optimization.sql
-- Purpose: Performance guardrails, query tuning templates, and caching candidates.

USE `buildsaathi_dev`;

-- ===========================================================================
-- A) Index health checks
-- ===========================================================================

-- Review table/index cardinality and row estimates.
SELECT
  s.`TABLE_NAME`,
  s.`INDEX_NAME`,
  GROUP_CONCAT(s.`COLUMN_NAME` ORDER BY s.`SEQ_IN_INDEX`) AS `IndexedColumns`,
  MAX(s.`CARDINALITY`) AS `CardinalityEstimate`
FROM INFORMATION_SCHEMA.STATISTICS s
WHERE s.`TABLE_SCHEMA` = DATABASE()
GROUP BY s.`TABLE_NAME`, s.`INDEX_NAME`
ORDER BY s.`TABLE_NAME`, s.`INDEX_NAME`;

-- Find potential duplicate indexes.
SELECT
  s1.`TABLE_NAME`,
  s1.`INDEX_NAME` AS `IndexA`,
  s2.`INDEX_NAME` AS `IndexB`
FROM INFORMATION_SCHEMA.STATISTICS s1
JOIN INFORMATION_SCHEMA.STATISTICS s2
  ON s1.`TABLE_SCHEMA` = s2.`TABLE_SCHEMA`
 AND s1.`TABLE_NAME` = s2.`TABLE_NAME`
 AND s1.`INDEX_NAME` < s2.`INDEX_NAME`
 AND s1.`SEQ_IN_INDEX` = s2.`SEQ_IN_INDEX`
 AND s1.`COLUMN_NAME` = s2.`COLUMN_NAME`
WHERE s1.`TABLE_SCHEMA` = DATABASE();

-- ===========================================================================
-- B) Query plan checks for critical paths
-- ===========================================================================

-- Tender listing path
EXPLAIN FORMAT=TREE
SELECT t.`Id`, t.`Title`, t.`State`, t.`Category`, t.`SubmissionDeadline`
FROM `Tenders` t
WHERE t.`IsDeleted` = 0
  AND t.`IsActive` = 1
  AND t.`State` = 'Uttar Pradesh'
  AND t.`Category` = 'Road & Highway'
ORDER BY t.`SubmissionDeadline` ASC
LIMIT 20;

-- Dashboard invoice aggregation path
EXPLAIN FORMAT=TREE
SELECT i.`ContractorId`, SUM(i.`Amount` - i.`PaidAmount`) AS `Outstanding`
FROM `Invoices` i
WHERE i.`IsDeleted` = 0
  AND i.`Status` IN ('Sent','PartiallyPaid','Overdue')
GROUP BY i.`ContractorId`;

-- BOQ totalization path
EXPLAIN FORMAT=TREE
SELECT b.`Id`, SUM(li.`Quantity` * li.`UnitRate`) AS `BaseTotal`
FROM `BOQs` b
JOIN `BOQLineItems` li ON li.`BOQId` = b.`Id` AND li.`IsDeleted` = 0
WHERE b.`IsDeleted` = 0
GROUP BY b.`Id`;

-- ===========================================================================
-- C) Runtime tuning recommendations (manual review before applying)
-- ===========================================================================

-- Candidate 1: if workload is read-heavy and memory allows
-- SET GLOBAL innodb_buffer_pool_size = 2147483648; -- 2 GB example

-- Candidate 2: lower fsync pressure in non-prod only
-- SET GLOBAL innodb_flush_log_at_trx_commit = 2;

-- Candidate 3: monitor long queries
-- SET GLOBAL slow_query_log = 'ON';
-- SET GLOBAL long_query_time = 1;

-- ===========================================================================
-- D) Caching candidates for Redis / app-layer cache
-- ===========================================================================

-- 1) Tender discovery list with filters (state/category/deadline)
-- 2) Dashboard summary counters per contractor
-- 3) Material trend aggregates (monthly)
-- 4) DSR lookup by state/category/code
-- 5) BOQ computed totals after line-item update

-- Suggested TTLs:
-- - Tender lists: 5-10 min
-- - Dashboard summary: 1-3 min
-- - Material/DSR rates: 30-60 min
-- - BOQ totals: cache-bust on BOQLineItems changes

-- ===========================================================================
-- E) Partitioning (future scale guidance; do not apply blindly)
-- ===========================================================================

-- Large activity streams can be partitioned monthly by CreatedAt.
-- Billing tables can be partitioned yearly by DueDate/PaidDate at high scale.
