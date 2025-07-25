-- Fix blog_posts RLS and consolidate policies
-- First, enable RLS on blog_posts (it should already be enabled but let's ensure it)
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Drop all existing conflicting policies
DROP POLICY IF EXISTS "Allow all for Kennedy" ON public.blog_posts;
DROP POLICY IF EXISTS "Allow all inserts" ON public.blog_posts;
DROP POLICY IF EXISTS "Allow all selects" ON public.blog_posts;
DROP POLICY IF EXISTS "Allow all updates" ON public.blog_posts;
DROP POLICY IF EXISTS "Allow anonymous read access to published blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Allow authenticated users to delete blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Allow authenticated users to insert blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Allow authenticated users to read all blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Allow authenticated users to update blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Published blog posts are viewable by everyone" ON public.blog_posts;
DROP POLICY IF EXISTS "blog_posts_admin_policy" ON public.blog_posts;
DROP POLICY IF EXISTS "blog_posts_select_policy" ON public.blog_posts;

-- Create clean, consolidated RLS policies
-- Public can read published blog posts
CREATE POLICY "Public can read published blog posts" 
ON public.blog_posts 
FOR SELECT 
USING (published = true);

-- Admin users can do everything
CREATE POLICY "Admins can manage all blog posts" 
ON public.blog_posts 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = auth.uid() 
    AND auth.users.role = 'admin'
  )
);

-- Fix database function security by adding search_path
-- Update get_user_role function
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS character varying
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $function$
BEGIN
    RETURN (
        SELECT role FROM auth.users
        WHERE id = auth.uid()
    );
END;
$function$;

-- Update is_admin function
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $function$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM auth.users
        WHERE id = auth.uid() AND role = 'admin'
    );
END;
$function$;

-- Update audit_log function
CREATE OR REPLACE FUNCTION public.audit_log()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public, auth
AS $function$
BEGIN
    INSERT INTO audit_logs (
        user_id,
        action,
        table_name,
        record_id,
        old_data,
        new_data,
        ip_address,
        user_agent
    )
    VALUES (
        auth.uid(),
        TG_OP,
        TG_TABLE_NAME,
        CASE
            WHEN TG_OP = 'DELETE' THEN OLD.id
            ELSE NEW.id
        END,
        CASE
            WHEN TG_OP = 'UPDATE' OR TG_OP = 'DELETE'
            THEN to_jsonb(OLD)
            ELSE NULL
        END,
        CASE
            WHEN TG_OP = 'INSERT' OR TG_OP = 'UPDATE'
            THEN to_jsonb(NEW)
            ELSE NULL
        END,
        current_setting('request.headers', true)::json->>'x-forwarded-for',
        current_setting('request.headers', true)::json->>'user-agent'
    );
    RETURN NULL;
END;
$function$;