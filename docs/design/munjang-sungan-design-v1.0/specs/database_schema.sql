-- 문장순간 MVP database schema draft
-- Target: PostgreSQL

CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE,
  nickname TEXT,
  provider TEXT CHECK (provider IN ('google', 'kakao', 'apple', 'anonymous')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE books (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  publisher TEXT,
  cover_url TEXT,
  isbn TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (title, author, publisher)
);

CREATE TABLE reading_moments (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  book_id TEXT NOT NULL REFERENCES books(id),
  selected_quote TEXT NOT NULL CHECK (char_length(selected_quote) <= 120),
  quote_length INTEGER NOT NULL CHECK (quote_length <= 120),
  reflection TEXT NOT NULL CHECK (char_length(reflection) <= 150),
  page_number TEXT,
  read_at TIMESTAMPTZ NOT NULL,
  place_label TEXT,
  mood TEXT,
  genre TEXT,
  visibility TEXT NOT NULL DEFAULT 'private' CHECK (visibility = 'private'),
  source_type TEXT NOT NULL CHECK (source_type IN ('ocr', 'manual')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

CREATE TABLE card_templates (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'hidden', 'deprecated')),
  moods JSONB NOT NULL DEFAULT '[]',
  genres JSONB NOT NULL DEFAULT '[]',
  palette TEXT NOT NULL,
  layout TEXT NOT NULL,
  text_length JSONB NOT NULL DEFAULT '[]',
  ratios JSONB NOT NULL DEFAULT '[]',
  emphasis JSONB NOT NULL DEFAULT '[]',
  background_style TEXT NOT NULL,
  effects JSONB NOT NULL DEFAULT '[]',
  render_config JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE generated_cards (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  reading_moment_id TEXT NOT NULL REFERENCES reading_moments(id) ON DELETE CASCADE,
  template_id TEXT NOT NULL REFERENCES card_templates(id),
  ratio TEXT NOT NULL CHECK (ratio IN ('1:1', '4:5', '9:16')),
  width INTEGER NOT NULL,
  height INTEGER NOT NULL,
  render_options JSONB NOT NULL DEFAULT '{}',
  image_path TEXT,
  download_token TEXT,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

CREATE TABLE ocr_sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  status TEXT NOT NULL CHECK (status IN ('processing', 'success', 'failed', 'expired')),
  language TEXT NOT NULL CHECK (language IN ('ko', 'en', 'mixed')),
  blocks JSONB NOT NULL DEFAULT '[]',
  sentences JSONB NOT NULL DEFAULT '[]',
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_reading_moments_user_created ON reading_moments(user_id, created_at DESC);
CREATE INDEX idx_reading_moments_book ON reading_moments(book_id);
CREATE INDEX idx_generated_cards_moment ON generated_cards(reading_moment_id);
CREATE INDEX idx_ocr_sessions_expires ON ocr_sessions(expires_at);
