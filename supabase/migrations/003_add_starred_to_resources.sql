-- Add starred field to resources table
ALTER TABLE resources ADD COLUMN IF NOT EXISTS starred BOOLEAN DEFAULT false;

-- Create index for faster queries on starred resources
CREATE INDEX IF NOT EXISTS idx_resources_starred ON resources(starred) WHERE starred = true;

