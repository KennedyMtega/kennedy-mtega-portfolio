
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio', 'portfolio', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Allow public read access to portfolio" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to upload to portfolio" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to update portfolio" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to delete from portfolio" ON storage.objects;

-- Create policies for portfolio bucket
CREATE POLICY "Allow public read access to portfolio" 
ON storage.objects FOR SELECT 
TO anon, authenticated USING ( bucket_id = 'portfolio' );

CREATE POLICY "Allow authenticated users to upload to portfolio" 
ON storage.objects FOR INSERT 
TO authenticated WITH CHECK ( bucket_id = 'portfolio' );

CREATE POLICY "Allow authenticated users to update portfolio" 
ON storage.objects FOR UPDATE 
TO authenticated USING ( bucket_id = 'portfolio' );

CREATE POLICY "Allow authenticated users to delete from portfolio" 
ON storage.objects FOR DELETE 
TO authenticated USING ( bucket_id = 'portfolio' );
