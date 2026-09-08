-- Migration: add "Article 2" (tour) support to the articles table
-- Run this once against your production/Supabase database.
-- If you use `drizzle-kit generate` / `drizzle-kit push` instead, you can skip this
-- file and just run that - it will read the updated schema.ts and produce the same result.

DO $$ BEGIN
  CREATE TYPE article_type AS ENUM ('standard', 'tour');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

ALTER TABLE articles
  ADD COLUMN IF NOT EXISTS type article_type NOT NULL DEFAULT 'standard';

ALTER TABLE articles
  ADD COLUMN IF NOT EXISTS tour_events jsonb;
