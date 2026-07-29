-- ============================================
-- TrendSphere OS - Full Database Schema
-- شغّل الملف ده كامل في Supabase SQL Editor
-- ============================================

-- Enums
CREATE TYPE article_status AS ENUM ('draft', 'review', 'scheduled', 'published', 'archived');
CREATE TYPE user_role AS ENUM ('admin', 'editor', 'author', 'reader');
CREATE TYPE subscriber_status AS ENUM ('pending', 'verified', 'unsubscribed');

-- Users (لسه موجودة في الـ schema حتى بعد تبسيط تسجيل الدخول - مربوطة بجدول authors)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200),
  email VARCHAR(300) NOT NULL UNIQUE,
  email_verified TIMESTAMP,
  image TEXT,
  role user_role NOT NULL DEFAULT 'reader',
  created_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE accounts (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  provider VARCHAR(50) NOT NULL,
  provider_account_id VARCHAR(300) NOT NULL,
  refresh_token TEXT,
  access_token TEXT,
  expires_at INTEGER,
  token_type VARCHAR(50),
  scope VARCHAR(300),
  id_token TEXT,
  session_state VARCHAR(300),
  PRIMARY KEY (provider, provider_account_id)
);

CREATE TABLE sessions (
  session_token VARCHAR(300) PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires TIMESTAMP NOT NULL
);

CREATE TABLE verification_tokens (
  identifier VARCHAR(300) NOT NULL,
  token VARCHAR(300) NOT NULL,
  expires TIMESTAMP NOT NULL,
  PRIMARY KEY (identifier, token)
);

-- Authors
CREATE TABLE authors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  name VARCHAR(200) NOT NULL,
  slug VARCHAR(200) NOT NULL UNIQUE,
  bio TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT now()
);

-- Categories
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(150) NOT NULL,
  slug VARCHAR(150) NOT NULL UNIQUE,
  parent_id UUID,
  description TEXT
);

-- Tags
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE
);

-- Articles
CREATE TABLE articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(300) NOT NULL,
  slug VARCHAR(300) NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT NOT NULL,
  content_part_2 TEXT,
  hero_image_url TEXT,
  secondary_image_url TEXT,
  author_id UUID REFERENCES authors(id),
  category_id UUID REFERENCES categories(id),
  status article_status NOT NULL DEFAULT 'draft',
  meta_title VARCHAR(300),
  meta_description VARCHAR(500),
  ai_summary TEXT,
  faq JSONB,
  reading_time_minutes INTEGER,
  published_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  updated_at TIMESTAMP NOT NULL DEFAULT now()
);

-- Article <-> Tags (many to many)
CREATE TABLE article_tags (
  article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE
);

-- Analytics: Page Views
CREATE TABLE page_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID REFERENCES articles(id) ON DELETE SET NULL,
  path VARCHAR(500) NOT NULL,
  referrer VARCHAR(500),
  created_at TIMESTAMP NOT NULL DEFAULT now()
);

-- Advertisement: Ad Slots
CREATE TABLE ad_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key VARCHAR(100) NOT NULL UNIQUE,
  name VARCHAR(200) NOT NULL,
  code TEXT,
  enabled BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMP NOT NULL DEFAULT now()
);

-- Newsletter Subscribers
CREATE TABLE subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(300) NOT NULL UNIQUE,
  status subscriber_status NOT NULL DEFAULT 'pending',
  preferred_categories JSONB,
  verification_token VARCHAR(300),
  verification_token_expires TIMESTAMP,
  unsubscribe_token VARCHAR(300) NOT NULL,
  verified_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT now()
);
