-- Table pour les articles/news
CREATE TABLE IF NOT EXISTS news (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  featured_image_url TEXT,
  author_name TEXT,
  author_email TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  featured BOOLEAN DEFAULT false,
  hidden BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  views_count INTEGER DEFAULT 0
);

-- Index pour les recherches
CREATE INDEX IF NOT EXISTS idx_news_status ON news(status);
CREATE INDEX IF NOT EXISTS idx_news_published_at ON news(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_slug ON news(slug);
CREATE INDEX IF NOT EXISTS idx_news_hidden ON news(hidden);
CREATE INDEX IF NOT EXISTS idx_news_featured ON news(featured);

-- Fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_news_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour updated_at (drop if exists to make migration idempotent)
DROP TRIGGER IF EXISTS update_news_updated_at_trigger ON news;
CREATE TRIGGER update_news_updated_at_trigger
  BEFORE UPDATE ON news
  FOR EACH ROW
  EXECUTE FUNCTION update_news_updated_at();

-- Fonction pour incrémenter le compteur de vues
CREATE OR REPLACE FUNCTION increment_news_views(news_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE news
  SET views_count = views_count + 1
  WHERE id = news_id;
END;
$$ LANGUAGE plpgsql;

-- RLS Policies
ALTER TABLE news ENABLE ROW LEVEL SECURITY;

-- Lecture publique pour les articles publiés (drop if exists to make migration idempotent)
DROP POLICY IF EXISTS "Public can view published news" ON news;
CREATE POLICY "Public can view published news"
  ON news FOR SELECT
  USING (status = 'published' AND hidden = false);

-- Admin peut tout faire (à adapter selon votre système d'auth)
-- Pour l'instant, on utilise le service_role qui bypass RLS
-- Vous pouvez ajouter une policy spécifique si vous avez un système d'auth

