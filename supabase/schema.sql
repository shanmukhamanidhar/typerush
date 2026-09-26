-- ==============================================================================
-- TypeRush — Production Multi-User Architecture Schema
-- Apply this file in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/_/sql/new
-- ==============================================================================

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Trigger to create a profile automatically when a user signs up via Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  desired_username TEXT;
  final_username TEXT;
BEGIN
  -- Extract username from user_metadata or generate fallback from email
  desired_username := NULLIF(TRIM(new.raw_user_meta_data->>'username'), '');
  IF desired_username IS NULL THEN
    desired_username := SPLIT_PART(new.email, '@', 1);
  END IF;

  -- Ensure username is clean (alphanumeric and underscore)
  desired_username := REGEXP_REPLACE(LOWER(desired_username), '[^a-z0-9_]', '', 'g');
  IF LENGTH(desired_username) < 3 THEN
    desired_username := 'racer_' || SUBSTRING(new.id::text FROM 1 FOR 6);
  END IF;

  final_username := desired_username;

  -- Handle collision gracefully
  IF EXISTS (SELECT 1 FROM public.profiles WHERE username = final_username) THEN
    final_username := final_username || '_' || SUBSTRING(new.id::text FROM 1 FOR 4);
  END IF;

  INSERT INTO public.profiles (id, username, display_name, created_at, updated_at)
  VALUES (
    new.id,
    final_username,
    COALESCE(NULLIF(TRIM(new.raw_user_meta_data->>'display_name'), ''), final_username),
    now(),
    now()
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate trigger cleanly
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- 2. TYPING RESULTS TABLE (Authentic Test Submissions)
CREATE TABLE IF NOT EXISTS public.typing_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  wpm NUMERIC NOT NULL CHECK (wpm > 0 AND wpm <= 350),
  raw_wpm NUMERIC,
  accuracy NUMERIC NOT NULL CHECK (accuracy >= 0 AND accuracy <= 100),
  consistency NUMERIC,
  characters INTEGER,
  correct_characters INTEGER,
  incorrect_characters INTEGER,
  mode TEXT NOT NULL,
  duration INTEGER,
  language TEXT DEFAULT 'english',
  punctuation BOOLEAN DEFAULT false,
  numbers BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);


-- 3. MULTIPLAYER MATCHES TABLES
CREATE TABLE IF NOT EXISTS public.multiplayer_matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL,
  host_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  mode TEXT NOT NULL DEFAULT 'time',
  duration INTEGER NOT NULL DEFAULT 30,
  difficulty TEXT DEFAULT 'medium',
  status TEXT NOT NULL DEFAULT 'completed',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.multiplayer_players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID NOT NULL REFERENCES public.multiplayer_matches(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  ready BOOLEAN DEFAULT true,
  connected BOOLEAN DEFAULT true,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.multiplayer_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID NOT NULL REFERENCES public.multiplayer_matches(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  rank INTEGER,
  wpm NUMERIC NOT NULL,
  raw_wpm NUMERIC,
  accuracy NUMERIC NOT NULL,
  consistency NUMERIC,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);


-- 4. PERFORMANCE INDEXES
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);
CREATE INDEX IF NOT EXISTS idx_typing_results_user_id ON public.typing_results(user_id);
CREATE INDEX IF NOT EXISTS idx_typing_results_leaderboard ON public.typing_results(mode, duration, wpm DESC);
CREATE INDEX IF NOT EXISTS idx_typing_results_created_at ON public.typing_results(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_multiplayer_matches_code ON public.multiplayer_matches(code);
CREATE INDEX IF NOT EXISTS idx_multiplayer_results_match_id ON public.multiplayer_results(match_id);
CREATE INDEX IF NOT EXISTS idx_multiplayer_results_user_id ON public.multiplayer_results(user_id);


-- 5. ROW LEVEL SECURITY (RLS) POLICIES

-- Profiles RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public profiles are readable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are readable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Typing Results RLS
ALTER TABLE public.typing_results ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Typing results are viewable by everyone" ON public.typing_results;
CREATE POLICY "Typing results are viewable by everyone"
  ON public.typing_results FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert their own typing results" ON public.typing_results;
CREATE POLICY "Authenticated users can insert their own typing results"
  ON public.typing_results FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own typing results" ON public.typing_results;
CREATE POLICY "Users can update their own typing results"
  ON public.typing_results FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own typing results" ON public.typing_results;
CREATE POLICY "Users can delete their own typing results"
  ON public.typing_results FOR DELETE
  USING (auth.uid() = user_id);

-- Multiplayer Matches RLS
ALTER TABLE public.multiplayer_matches ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Matches are viewable by everyone" ON public.multiplayer_matches;
CREATE POLICY "Matches are viewable by everyone"
  ON public.multiplayer_matches FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Authenticated users can create matches" ON public.multiplayer_matches;
CREATE POLICY "Authenticated users can create matches"
  ON public.multiplayer_matches FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Host can update match status" ON public.multiplayer_matches;
CREATE POLICY "Host can update match status"
  ON public.multiplayer_matches FOR UPDATE
  USING (auth.uid() = host_id);

-- Multiplayer Players RLS
ALTER TABLE public.multiplayer_players ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Match players are viewable by everyone" ON public.multiplayer_players;
CREATE POLICY "Match players are viewable by everyone"
  ON public.multiplayer_players FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Authenticated users can join matches" ON public.multiplayer_players;
CREATE POLICY "Authenticated users can join matches"
  ON public.multiplayer_players FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Multiplayer Results RLS
ALTER TABLE public.multiplayer_results ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Multiplayer results are viewable by everyone" ON public.multiplayer_results;
CREATE POLICY "Multiplayer results are viewable by everyone"
  ON public.multiplayer_results FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Authenticated users can record their own match results" ON public.multiplayer_results;
CREATE POLICY "Authenticated users can record their own match results"
  ON public.multiplayer_results FOR INSERT
  WITH CHECK (auth.uid() = user_id);
