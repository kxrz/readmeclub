-- Create storage bucket for news featured images
INSERT INTO storage.buckets (id, name, public)
VALUES ('news-images', 'news-images', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for news-images bucket
-- Allow public read access
CREATE POLICY "Public can view news images"
ON storage.objects FOR SELECT
USING (bucket_id = 'news-images');

-- Allow authenticated admin uploads (via service role)
-- Note: In practice, uploads are done via API routes with admin auth check
-- This policy allows the service role to upload
CREATE POLICY "Service role can upload news images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'news-images');

CREATE POLICY "Service role can update news images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'news-images');

CREATE POLICY "Service role can delete news images"
ON storage.objects FOR DELETE
USING (bucket_id = 'news-images');

