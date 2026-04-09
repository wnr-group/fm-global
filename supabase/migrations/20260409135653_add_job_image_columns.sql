-- Add image columns to job_listings
ALTER TABLE job_listings
  ADD COLUMN IF NOT EXISTS image_url TEXT,
  ADD COLUMN IF NOT EXISTS image_filename TEXT;

-- Create job-images storage bucket (public)
INSERT INTO storage.buckets (id, name, public)
VALUES ('job-images', 'job-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to job images
CREATE POLICY "Public can view job images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'job-images');

-- Allow authenticated users to upload/update/delete job images
CREATE POLICY "Authenticated users can upload job images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'job-images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update job images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'job-images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete job images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'job-images' AND auth.role() = 'authenticated');
