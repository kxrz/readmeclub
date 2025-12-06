-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Resources table
CREATE TABLE resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type VARCHAR(20) NOT NULL CHECK (type IN ('language_file', 'plugin', 'link', 'documentation', 'tool', 'font', 'wallpaper', 'info', 'other')),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  version VARCHAR(50),
  compatibility VARCHAR(255),
  installation_instructions TEXT,
  known_issues TEXT,
  file_url TEXT,
  file_name VARCHAR(255),
  external_link TEXT,
  thumbnail_url TEXT,
  contributor_name VARCHAR(255),
  contact_info VARCHAR(255),
  status VARCHAR(20) NOT NULL DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'flagged', 'removed')),
  hidden BOOLEAN DEFAULT false,
  downloads_count INTEGER NOT NULL DEFAULT 0,
  tags TEXT[] DEFAULT '{}',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Wallpapers table
CREATE TABLE wallpapers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  status VARCHAR(20) NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published')),
  title VARCHAR(60),
  category VARCHAR(30) CHECK (category IN ('minimalist', 'dark', 'light', 'pop_culture', 'custom', 'other')),
  author_name VARCHAR(50),
  reddit_username VARCHAR(30),
  instagram_username VARCHAR(30),
  file_url TEXT NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_size INTEGER NOT NULL,
  width INTEGER NOT NULL,
  height INTEGER NOT NULL,
  download_count INTEGER NOT NULL DEFAULT 0,
  flags_count INTEGER NOT NULL DEFAULT 0,
  hidden BOOLEAN DEFAULT false,
  submitted_ip_hash VARCHAR(64) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Feature requests table
CREATE TABLE feature_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(80) NOT NULL,
  description VARCHAR(500) NOT NULL,
  reddit_username VARCHAR(30),
  tags TEXT[] DEFAULT '{}',
  votes_count INTEGER NOT NULL DEFAULT 0,
  warnings_count INTEGER NOT NULL DEFAULT 0,
  status VARCHAR(20) NOT NULL DEFAULT 'published' CHECK (status IN ('published', 'draft', 'archived')),
  hidden BOOLEAN DEFAULT false,
  admin_status TEXT DEFAULT 'pending' CHECK (admin_status IN ('pending', 'planned', 'completed', 'rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Location declarations table
CREATE TABLE location_declarations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country_code VARCHAR(2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Feature votes table
CREATE TABLE feature_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  feature_request_id UUID NOT NULL REFERENCES feature_requests(id) ON DELETE CASCADE,
  ip_hash VARCHAR(64) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(feature_request_id, ip_hash)
);

-- Submission limits table
CREATE TABLE submission_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_hash VARCHAR(64) NOT NULL UNIQUE,
  submission_count INTEGER NOT NULL DEFAULT 0,
  last_submission_at TIMESTAMPTZ,
  reset_at TIMESTAMPTZ NOT NULL DEFAULT NOW() + INTERVAL '24 hours'
);

-- Analytics table (singleton)
CREATE TABLE analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pdf_downloads INTEGER DEFAULT 0,
  pdf_v2_downloads INTEGER DEFAULT 0,
  epub_v2_downloads INTEGER DEFAULT 0,
  csv_downloads INTEGER DEFAULT 0,
  page_views INTEGER DEFAULT 0,
  last_updated TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Insert initial analytics row
INSERT INTO analytics (id) VALUES (gen_random_uuid());

-- Indexes for performance
CREATE INDEX idx_resources_status ON resources(status);
CREATE INDEX idx_resources_hidden ON resources(hidden);
CREATE INDEX idx_resources_type ON resources(type);
CREATE INDEX idx_resources_tags ON resources USING GIN(tags);

CREATE INDEX idx_wallpapers_status ON wallpapers(status);
CREATE INDEX idx_wallpapers_hidden ON wallpapers(hidden);
CREATE INDEX idx_wallpapers_category ON wallpapers(category);

CREATE INDEX idx_feature_requests_status ON feature_requests(status);
CREATE INDEX idx_feature_requests_votes_count ON feature_requests(votes_count DESC);
CREATE INDEX idx_feature_requests_tags ON feature_requests USING GIN(tags);

CREATE INDEX idx_location_declarations_country_code ON location_declarations(country_code);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_resources_updated_at
  BEFORE UPDATE ON resources
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_feature_requests_updated_at
  BEFORE UPDATE ON feature_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Functions for incrementing download counts
CREATE OR REPLACE FUNCTION increment_resource_downloads(resource_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE resources
  SET downloads_count = downloads_count + 1
  WHERE id = resource_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION increment_wallpaper_downloads(wallpaper_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE wallpapers
  SET download_count = download_count + 1
  WHERE id = wallpaper_id;
END;
$$ LANGUAGE plpgsql;

