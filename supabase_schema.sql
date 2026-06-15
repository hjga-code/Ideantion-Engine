-- ═══════════════════════════════════════════════
-- IDEATION ENGINE — Database Schema
-- Run this in Supabase SQL Editor
-- ═══════════════════════════════════════════════

-- 1. SESSIONS TABLE
CREATE TABLE IF NOT EXISTS public.sessions (
  id            TEXT PRIMARY KEY,
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title         TEXT NOT NULL DEFAULT 'Nueva Sesion',
  timestamp     BIGINT NOT NULL,
  last_modified BIGINT NOT NULL,
  messages      JSONB NOT NULL DEFAULT '[]',
  module        TEXT NOT NULL,
  preset        TEXT NOT NULL,
  language      TEXT NOT NULL DEFAULT 'AUTO',
  format        TEXT NOT NULL DEFAULT 'MARKDOWN',
  provider      TEXT NOT NULL DEFAULT 'GEMINI',
  model_used    TEXT NOT NULL DEFAULT 'gemini-3.5-flash',
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_own_sessions" ON public.sessions
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_sessions_user_id
  ON public.sessions(user_id);

CREATE INDEX IF NOT EXISTS idx_sessions_last_modified
  ON public.sessions(user_id, last_modified DESC);

-- 2. USER SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.user_settings (
  user_id           UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  provider          TEXT DEFAULT 'GEMINI',
  gemini_key        TEXT DEFAULT '',
  gemini_model      TEXT DEFAULT 'gemini-3.5-flash',
  open_router_key   TEXT DEFAULT '',
  open_router_model TEXT DEFAULT 'anthropic/claude-sonnet-4-6',
  provider_name     TEXT DEFAULT 'My Workspace',
  tour_completed    BOOLEAN NOT NULL DEFAULT FALSE,
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_own_settings" ON public.user_settings
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 3. AUTO-CREATE SETTINGS ROW ON FIRST LOGIN
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_settings (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
