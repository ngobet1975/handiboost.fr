-- =============================================================
-- PATCH: Fix pathology visibility
-- Run this in Supabase SQL Editor
-- =============================================================

-- 1. Force all pathologies to published + validated
UPDATE pathologies 
SET status = 'published', 
    validation_status = 'validated'
WHERE status != 'published' OR validation_status != 'validated';

-- 2. Add RLS policy for public read access on pathologies
ALTER TABLE pathologies ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read published pathologies" ON pathologies;
CREATE POLICY "Public can read published pathologies"
  ON pathologies
  FOR SELECT
  USING (status = 'published');

-- 3. Same for directories
ALTER TABLE directories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read published directories" ON directories;
CREATE POLICY "Public can read published directories"
  ON directories
  FOR SELECT
  USING (status = 'published');

-- 4. Same for articles
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read published articles" ON articles;
CREATE POLICY "Public can read published articles"
  ON articles
  FOR SELECT
  USING (status = 'published');

-- 5. Same for events
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read published events" ON events;
CREATE POLICY "Public can read published events"
  ON events
  FOR SELECT
  USING (status = 'published');

-- 6. Verify result
SELECT id, title, slug, status, validation_status FROM pathologies ORDER BY title;
