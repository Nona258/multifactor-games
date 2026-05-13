-- Supabase leaderboard schema for Multifactor Games
-- Run this file in the Supabase SQL Editor.

CREATE TABLE IF NOT EXISTS public.scores (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  username TEXT NOT NULL,
  game_id TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  completion_time INTEGER NOT NULL CHECK (completion_time > 0),
  result TEXT NOT NULL CHECK (result IN ('win', 'loss')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT score_valid CHECK (completion_time > 0)
);

CREATE INDEX IF NOT EXISTS idx_scores_game_difficulty
  ON public.scores (game_id, difficulty);

CREATE INDEX IF NOT EXISTS idx_scores_username
  ON public.scores (username);

CREATE INDEX IF NOT EXISTS idx_scores_created_at
  ON public.scores (created_at DESC);

ALTER TABLE public.scores ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read scores" ON public.scores;
CREATE POLICY "Anyone can read scores"
  ON public.scores
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Anyone can insert scores" ON public.scores;
CREATE POLICY "Anyone can insert scores"
  ON public.scores
  FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "No updates" ON public.scores;
CREATE POLICY "No updates"
  ON public.scores
  FOR UPDATE
  USING (false);

DROP POLICY IF EXISTS "No deletes" ON public.scores;
CREATE POLICY "No deletes"
  ON public.scores
  FOR DELETE
  USING (false);