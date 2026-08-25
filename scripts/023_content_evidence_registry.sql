-- Phase 4A: versioned clinical content provenance
-- Historical activity is deliberately labelled legacy-unversioned.

ALTER TABLE journey_completions
  ADD COLUMN IF NOT EXISTS content_id VARCHAR(255),
  ADD COLUMN IF NOT EXISTS content_version VARCHAR(64),
  ADD COLUMN IF NOT EXISTS content_registry_revision VARCHAR(64);

UPDATE journey_completions
SET
  content_id = COALESCE(content_id, 'waypoint.journey.' || REPLACE(module_slug, '/', '.')),
  content_version = COALESCE(content_version, 'legacy-unversioned'),
  content_registry_revision = COALESCE(content_registry_revision, 'legacy-unversioned')
WHERE content_id IS NULL
   OR content_version IS NULL
   OR content_registry_revision IS NULL;

ALTER TABLE journey_completions
  ALTER COLUMN content_id SET NOT NULL,
  ALTER COLUMN content_version SET NOT NULL,
  ALTER COLUMN content_registry_revision SET NOT NULL;

CREATE INDEX IF NOT EXISTS idx_journey_completions_content_version
  ON journey_completions(content_id, content_version);

ALTER TABLE skills_practice
  ADD COLUMN IF NOT EXISTS skill_slug VARCHAR(255),
  ADD COLUMN IF NOT EXISTS content_id VARCHAR(255),
  ADD COLUMN IF NOT EXISTS content_version VARCHAR(64),
  ADD COLUMN IF NOT EXISTS content_registry_revision VARCHAR(64),
  ADD COLUMN IF NOT EXISTS practice_source VARCHAR(64),
  ADD COLUMN IF NOT EXISTS was_helpful BOOLEAN;

UPDATE skills_practice
SET practice_source = COALESCE(practice_source, 'legacy')
WHERE practice_source IS NULL;

UPDATE skills_practice
SET skill_slug = CASE LOWER(TRIM(skill_name))
  WHEN 'tip' THEN 'tip'
  WHEN 'tip skills' THEN 'tip'
  WHEN 'stop' THEN 'stop'
  WHEN 'stop skill' THEN 'stop'
  WHEN 'please' THEN 'please'
  WHEN 'please skills' THEN 'please'
  WHEN 'improve' THEN 'improve'
  WHEN 'improve skills' THEN 'improve'
  WHEN 'rain' THEN 'rain'
  WHEN 'rain mindfulness' THEN 'rain'
  WHEN 'opposite action' THEN 'opposite-action'
  WHEN 'dear man' THEN 'interpersonal/dear-man'
  WHEN 'give' THEN 'interpersonal/give'
  WHEN 'fast' THEN 'interpersonal/fast'
  WHEN 'problem solving' THEN 'interpersonal/problem-solving'
  WHEN 'turning the mind' THEN 'interpersonal/turning-the-mind'
  WHEN 'reality acceptance' THEN 'reality-acceptance'
  WHEN 'willingness' THEN 'willingness'
  WHEN 'distress tolerance' THEN 'distress-tolerance'
  WHEN 'distress tolerance overview' THEN 'distress-tolerance'
  ELSE skill_slug
END
WHERE skill_slug IS NULL;

UPDATE skills_practice
SET
  content_id = COALESCE(content_id, 'waypoint.skill.' || REPLACE(skill_slug, '/', '.')),
  content_version = COALESCE(content_version, 'legacy-unversioned'),
  content_registry_revision = COALESCE(content_registry_revision, 'legacy-unversioned')
WHERE skill_slug IS NOT NULL
  AND (content_id IS NULL OR content_version IS NULL OR content_registry_revision IS NULL);

ALTER TABLE skills_practice
  ALTER COLUMN practice_source SET DEFAULT 'legacy',
  ALTER COLUMN practice_source SET NOT NULL;

CREATE INDEX IF NOT EXISTS idx_skills_practice_content_version
  ON skills_practice(content_id, content_version)
  WHERE content_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_skills_practice_slug
  ON skills_practice(user_id, skill_slug, practiced_at DESC)
  WHERE skill_slug IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS ux_skills_practice_page_feedback
  ON skills_practice(user_id, skill_slug)
  WHERE practice_source = 'skill_page_feedback' AND skill_slug IS NOT NULL;
