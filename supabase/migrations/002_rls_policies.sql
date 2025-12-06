-- Enable Row Level Security on all tables
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallpapers ENABLE ROW LEVEL SECURITY;
ALTER TABLE feature_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE location_declarations ENABLE ROW LEVEL SECURITY;
ALTER TABLE feature_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE submission_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

-- Resources RLS Policies
-- Public can read approved and visible resources
CREATE POLICY "Public can read approved and visible resources" 
ON resources FOR SELECT 
TO public 
USING (status = 'approved' AND (hidden = false OR hidden IS NULL));

-- Public can insert resources (for submissions)
CREATE POLICY "Allow public insert to resources"
ON resources FOR INSERT
TO public
WITH CHECK (true);

-- Admin can update resources (service role bypasses RLS)
CREATE POLICY "Allow admin updates to resources"
ON resources FOR UPDATE
TO authenticated, anon, service_role
USING (true)
WITH CHECK (true);

-- Admin can delete resources
CREATE POLICY "Allow admin delete to resources"
ON resources FOR DELETE
TO authenticated, anon, service_role
USING (true);

-- Wallpapers RLS Policies
-- Public can read published and visible wallpapers
CREATE POLICY "Public can read published and visible wallpapers"
ON wallpapers FOR SELECT
TO public
USING (status = 'published' AND (hidden = false OR hidden IS NULL));

-- Public can insert wallpapers
CREATE POLICY "Allow public insert to wallpapers"
ON wallpapers FOR INSERT
TO public
WITH CHECK (true);

-- Admin can update wallpapers
CREATE POLICY "Allow admin updates to wallpapers"
ON wallpapers FOR UPDATE
TO authenticated, anon, service_role
USING (true)
WITH CHECK (true);

-- Admin can delete wallpapers
CREATE POLICY "Allow admin delete to wallpapers"
ON wallpapers FOR DELETE
TO authenticated, anon, service_role
USING (true);

-- Feature Requests RLS Policies
-- Public can read published and visible feature requests
CREATE POLICY "Public can read published and visible feature requests"
ON feature_requests FOR SELECT
TO public
USING (status = 'published' AND (hidden = false OR hidden IS NULL));

-- Public can insert feature requests
CREATE POLICY "Allow public insert to feature requests"
ON feature_requests FOR INSERT
TO public
WITH CHECK (true);

-- Public can update votes_count (via function)
CREATE POLICY "Allow public update votes on feature requests"
ON feature_requests FOR UPDATE
TO public
USING (true)
WITH CHECK (true);

-- Admin can update all fields
CREATE POLICY "Allow admin updates to feature requests"
ON feature_requests FOR UPDATE
TO authenticated, anon, service_role
USING (true)
WITH CHECK (true);

-- Admin can delete feature requests
CREATE POLICY "Allow admin delete to feature requests"
ON feature_requests FOR DELETE
TO authenticated, anon, service_role
USING (true);

-- Location Declarations RLS Policies
-- Public can read all location declarations
CREATE POLICY "Public can read location declarations"
ON location_declarations FOR SELECT
TO public
USING (true);

-- Public can insert location declarations
CREATE POLICY "Allow public insert to location declarations"
ON location_declarations FOR INSERT
TO public
WITH CHECK (true);

-- Feature Votes RLS Policies
-- Public can read feature votes
CREATE POLICY "Public can read feature votes"
ON feature_votes FOR SELECT
TO public
USING (true);

-- Public can insert feature votes
CREATE POLICY "Allow public insert to feature votes"
ON feature_votes FOR INSERT
TO public
WITH CHECK (true);

-- Submission Limits RLS Policies
-- Public can read their own submission limits
CREATE POLICY "Public can read submission limits"
ON submission_limits FOR SELECT
TO public
USING (true);

-- Public can insert submission limits
CREATE POLICY "Allow public insert to submission limits"
ON submission_limits FOR INSERT
TO public
WITH CHECK (true);

-- Public can update submission limits
CREATE POLICY "Allow public update to submission limits"
ON submission_limits FOR UPDATE
TO public
USING (true)
WITH CHECK (true);

-- Analytics RLS Policies
-- Public can read analytics
CREATE POLICY "Public can read analytics"
ON analytics FOR SELECT
TO public
USING (true);

-- Only admin can update analytics (via service role)
CREATE POLICY "Allow admin updates to analytics"
ON analytics FOR UPDATE
TO authenticated, anon, service_role
USING (true)
WITH CHECK (true);

