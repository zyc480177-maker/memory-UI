-- MEMOIRS V1 Initial Schema
-- Run: psql $DATABASE_URL -f migrations/001_initial.sql

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── Users ───────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS account_users (
  id            TEXT PRIMARY KEY DEFAULT 'usr_' || gen_random_uuid()::text,
  email         TEXT NOT NULL UNIQUE,
  password_hash TEXT,
  display_name  TEXT NOT NULL DEFAULT '',
  avatar_url    TEXT,
  status        TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('pending','active','disabled')),
  last_login_at TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Auth tokens (magic link / refresh) ──────────────────────────────────────

CREATE TABLE IF NOT EXISTS auth_tokens (
  id         TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id    TEXT NOT NULL REFERENCES account_users(id) ON DELETE CASCADE,
  token      TEXT NOT NULL UNIQUE,
  type       TEXT NOT NULL DEFAULT 'magic_link' CHECK (type IN ('magic_link','refresh')),
  used       BOOLEAN NOT NULL DEFAULT FALSE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Projects ────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS projects (
  id                     TEXT PRIMARY KEY DEFAULT 'prj_' || gen_random_uuid()::text,
  owner_user_id          TEXT NOT NULL REFERENCES account_users(id) ON DELETE CASCADE,
  title                  TEXT NOT NULL,
  subtitle               TEXT,
  description            TEXT,
  cover_asset_id         TEXT,
  primary_subject_id     TEXT,
  status                 TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('draft','active','archived')),
  phase                  TEXT NOT NULL DEFAULT 'collecting' CHECK (phase IN ('collecting','organizing','writing','exporting')),
  default_narrative_voice TEXT NOT NULL DEFAULT 'first_person' CHECK (default_narrative_voice IN ('first_person','third_person')),
  target_audience        TEXT NOT NULL DEFAULT 'self' CHECK (target_audience IN ('self','family','public_reserved')),
  created_at             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at             TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Subject Profiles ────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS subject_profiles (
  id                         TEXT PRIMARY KEY DEFAULT 'sub_' || gen_random_uuid()::text,
  project_id                 TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  full_name                  TEXT NOT NULL,
  display_name               TEXT,
  relationship_to_owner      TEXT NOT NULL DEFAULT 'self' CHECK (relationship_to_owner IN ('self','parent','grandparent','spouse','child','other')),
  gender                     TEXT NOT NULL DEFAULT 'unknown' CHECK (gender IN ('unknown','male','female','other')),
  birth_year                 INTEGER,
  birth_date_precision       TEXT NOT NULL DEFAULT 'unknown' CHECK (birth_date_precision IN ('year','month','day','unknown')),
  life_summary               TEXT,
  narrative_voice_preference TEXT NOT NULL DEFAULT 'first_person' CHECK (narrative_voice_preference IN ('first_person','third_person')),
  created_at                 TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at                 TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE projects ADD CONSTRAINT fk_projects_subject
  FOREIGN KEY (primary_subject_id) REFERENCES subject_profiles(id) ON DELETE SET NULL
  DEFERRABLE INITIALLY DEFERRED;

-- ─── Assets ──────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS assets (
  id                    TEXT PRIMARY KEY DEFAULT 'ast_' || gen_random_uuid()::text,
  project_id            TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  type                  TEXT NOT NULL CHECK (type IN ('image','audio','text','video_reserved')),
  source                TEXT NOT NULL DEFAULT 'upload' CHECK (source IN ('upload','recording','manual_text')),
  file_name             TEXT,
  mime_type             TEXT,
  byte_size             BIGINT,
  storage_key           TEXT,
  status                TEXT NOT NULL DEFAULT 'pending_upload' CHECK (status IN ('pending_upload','uploaded','processing','ready','failed','deleted')),
  capture_time          TIMESTAMPTZ,
  capture_time_precision TEXT DEFAULT 'unknown' CHECK (capture_time_precision IN ('year','month','day','minute','unknown')),
  location_text         TEXT,
  summary               TEXT,
  notes                 TEXT,
  analysis_status       TEXT NOT NULL DEFAULT 'not_started' CHECK (analysis_status IN ('not_started','queued','running','completed','failed')),
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Asset Analyses ──────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS asset_analyses (
  id               TEXT PRIMARY KEY DEFAULT 'ana_' || gen_random_uuid()::text,
  asset_id         TEXT NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
  project_id       TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  version          INTEGER NOT NULL DEFAULT 1,
  provider         TEXT NOT NULL,
  model            TEXT NOT NULL,
  task_type        TEXT NOT NULL CHECK (task_type IN ('image_understanding','audio_transcription','structured_extraction','text_analysis')),
  status           TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued','running','completed','failed')),
  raw_text         TEXT,
  structured_data  JSONB,
  confidence_score NUMERIC(4,3),
  error_code       TEXT,
  error_message    TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Events ──────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS events (
  id                  TEXT PRIMARY KEY DEFAULT 'evt_' || gen_random_uuid()::text,
  project_id          TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title               TEXT NOT NULL,
  summary             TEXT,
  description         TEXT,
  start_at            TIMESTAMPTZ,
  end_at              TIMESTAMPTZ,
  time_precision      TEXT DEFAULT 'unknown' CHECK (time_precision IN ('year','month','day','range','unknown')),
  location_text       TEXT,
  participants        TEXT[],
  emotion_tags        TEXT[],
  source_type         TEXT NOT NULL DEFAULT 'ai_generated' CHECK (source_type IN ('ai_generated','manual','merged')),
  status              TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','confirmed','archived')),
  confidence_score    NUMERIC(4,3),
  timeline_order_hint INTEGER,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Event-Asset Links ───────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS event_asset_links (
  event_id        TEXT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  asset_id        TEXT NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
  relevance_score NUMERIC(4,3),
  link_type       TEXT NOT NULL DEFAULT 'evidence' CHECK (link_type IN ('evidence','primary_source','supporting_material')),
  PRIMARY KEY (event_id, asset_id)
);

-- ─── Chapters ────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS chapters (
  id               TEXT PRIMARY KEY DEFAULT 'chp_' || gen_random_uuid()::text,
  project_id       TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title            TEXT NOT NULL,
  subtitle         TEXT,
  summary          TEXT,
  sort_order       INTEGER NOT NULL DEFAULT 0,
  status           TEXT NOT NULL DEFAULT 'outline' CHECK (status IN ('outline','ai_draft','owner_editing','finalized')),
  draft_content    TEXT,
  edited_content   TEXT,
  narrative_voice  TEXT NOT NULL DEFAULT 'first_person' CHECK (narrative_voice IN ('first_person','third_person')),
  word_count       INTEGER NOT NULL DEFAULT 0,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Chapter-Event Links ─────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS chapter_event_links (
  chapter_id TEXT NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
  event_id   TEXT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  role       TEXT NOT NULL DEFAULT 'primary' CHECK (role IN ('primary','supporting')),
  PRIMARY KEY (chapter_id, event_id)
);

-- ─── Jobs ────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS jobs (
  id            TEXT PRIMARY KEY DEFAULT 'job_' || gen_random_uuid()::text,
  project_id    TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  resource_type TEXT NOT NULL CHECK (resource_type IN ('asset','event','chapter','export')),
  resource_id   TEXT NOT NULL,
  job_type      TEXT NOT NULL CHECK (job_type IN ('asset_analysis','event_generation','chapter_generation','export_generation')),
  status        TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued','running','succeeded','failed','cancelled')),
  provider      TEXT,
  model         TEXT,
  attempt_count INTEGER NOT NULL DEFAULT 0,
  started_at    TIMESTAMPTZ,
  finished_at   TIMESTAMPTZ,
  error_code    TEXT,
  error_message TEXT,
  result_summary JSONB,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Export Versions ─────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS export_versions (
  id          TEXT PRIMARY KEY DEFAULT 'exp_' || gen_random_uuid()::text,
  project_id  TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  format      TEXT NOT NULL DEFAULT 'html' CHECK (format IN ('html','pdf_reserved')),
  status      TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued','running','ready','failed','expired')),
  download_url TEXT,
  storage_key TEXT,
  expires_at  TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Indexes ─────────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_projects_owner ON projects(owner_user_id);
CREATE INDEX IF NOT EXISTS idx_assets_project ON assets(project_id);
CREATE INDEX IF NOT EXISTS idx_assets_status ON assets(project_id, status);
CREATE INDEX IF NOT EXISTS idx_asset_analyses_asset ON asset_analyses(asset_id);
CREATE INDEX IF NOT EXISTS idx_events_project ON events(project_id);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(project_id, status);
CREATE INDEX IF NOT EXISTS idx_chapters_project ON chapters(project_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_jobs_project ON jobs(project_id, status);
CREATE INDEX IF NOT EXISTS idx_jobs_resource ON jobs(resource_type, resource_id);
