-- Table pour gérer le debouncing des rebuilds Vercel
-- Permet de partager l'état entre toutes les instances Serverless

CREATE TABLE IF NOT EXISTS rebuild_schedule (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scheduled_at TIMESTAMPTZ NOT NULL,
  triggered BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index pour les requêtes rapides
CREATE INDEX IF NOT EXISTS idx_rebuild_schedule_scheduled_at ON rebuild_schedule(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_rebuild_schedule_triggered ON rebuild_schedule(triggered);

-- Fonction pour nettoyer les anciennes entrées (exécutée périodiquement)
CREATE OR REPLACE FUNCTION cleanup_old_rebuild_schedules()
RETURNS void AS $$
BEGIN
  -- Supprime les entrées déclenchées de plus de 1 heure
  DELETE FROM rebuild_schedule
  WHERE triggered = true
    AND updated_at < NOW() - INTERVAL '1 hour';
END;
$$ LANGUAGE plpgsql;

-- Trigger pour mettre à jour updated_at
CREATE TRIGGER update_rebuild_schedule_updated_at
  BEFORE UPDATE ON rebuild_schedule
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
