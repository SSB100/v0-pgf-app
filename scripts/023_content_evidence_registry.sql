-- Phase 4A: versioned clinical content provenance
-- Historical activity is deliberately labelled legacy-unversioned. This migration
-- does not claim that earlier users received the current curriculum version.

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

COMMENT ON COLUMN journey_completions.content_id IS 'Stable Waypoint content identifier for the Journey module.';
COMMENT ON COLUMN journey_completions.content_version IS 'Content version completed by the user; historical rows are legacy-unversioned.';
COMMENT ON COLUMN journey_completions.content_registry_revision IS 'Registry revision that supplied provenance metadata when the activity was recorded.';
COMMENT ON COLUMN skills_practice.skill_slug IS 'Stable Waypoint skill slug when the practice maps to a governed skill; may be null for free-form self-reported skills.';
COMMENT ON COLUMN skills_practice.content_id IS 'Stable Waypoint content identifier when the practice maps to governed content.';
COMMENT ON COLUMN skills_practice.content_version IS 'Content version associated with the governed skill; historical mapped rows are legacy-unversioned.';
COMMENT ON COLUMN skills_practice.content_registry_revision IS 'Registry revision that supplied provenance metadata when the activity was recorded.';
COMMENT ON COLUMN skills_practice.practice_source IS 'Origin of the practice record, such as legacy, daily_checkin_self_report or skill_page_feedback.';
COMMENT ON COLUMN skills_practice.was_helpful IS 'Optional user feedback from a skill page; this is user experience feedback, not a clinical outcome measure.';
