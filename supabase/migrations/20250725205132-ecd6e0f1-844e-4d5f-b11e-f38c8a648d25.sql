-- Drop the existing admin policy for blog_posts that's checking wrong table
DROP POLICY IF EXISTS "Admins can manage all blog posts" ON public.blog_posts;

-- Create correct admin policy that checks public.users table
CREATE POLICY "Admins can manage all blog posts" 
ON public.blog_posts 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Also ensure the public read policy exists
DROP POLICY IF EXISTS "Public can read published blog posts" ON public.blog_posts;
CREATE POLICY "Public can read published blog posts" 
ON public.blog_posts 
FOR SELECT 
USING (published = true);