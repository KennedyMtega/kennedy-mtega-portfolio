-- Fix remaining database functions to add search_path
CREATE OR REPLACE FUNCTION public.hash_password(password text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
    RETURN crypt(password, gen_salt('bf'));
END;
$function$;

CREATE OR REPLACE FUNCTION public.verify_password(password text, hashed_password text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
    RETURN crypt(password, hashed_password) = hashed_password;
END;
$function$;

CREATE OR REPLACE FUNCTION public.soft_delete()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $function$
BEGIN
    NEW.deleted_at = NOW();
    RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.create_audit_log()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
    IF (TG_OP = 'DELETE') THEN
        INSERT INTO audit_logs (user_id, action, table_name, record_id, old_data)
        VALUES (auth.uid(), 'DELETE', TG_TABLE_NAME, OLD.id, row_to_json(OLD));
        RETURN OLD;
    ELSIF (TG_OP = 'UPDATE') THEN
        INSERT INTO audit_logs (user_id, action, table_name, record_id, old_data, new_data)
        VALUES (auth.uid(), 'UPDATE', TG_TABLE_NAME, NEW.id, row_to_json(OLD), row_to_json(NEW));
        RETURN NEW;
    ELSIF (TG_OP = 'INSERT') THEN
        INSERT INTO audit_logs (user_id, action, table_name, record_id, new_data)
        VALUES (auth.uid(), 'INSERT', TG_TABLE_NAME, NEW.id, row_to_json(NEW));
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_donation_stats()
RETURNS TABLE(total_amount numeric, donation_count bigint, average_amount numeric, completed_count bigint, pending_count bigint, failed_count bigint)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(SUM(d.amount), 0) as total_amount,
    COUNT(*) as donation_count,
    COALESCE(AVG(d.amount), 0) as average_amount,
    COUNT(*) FILTER(WHERE d.status = 'completed') as completed_count,
    COUNT(*) FILTER(WHERE d.status = 'pending') as pending_count,
    COUNT(*) FILTER(WHERE d.status = 'failed') as failed_count
  FROM 
    donations d;
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_referrer_stats(limit_count integer DEFAULT 10)
RETURNS TABLE(referrer text, count bigint)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(p.referrer, 'direct') as referrer,
    COUNT(*) as count
  FROM 
    page_views p
  GROUP BY 
    referrer
  ORDER BY 
    count DESC
  LIMIT limit_count;
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_popular_pages(limit_count integer DEFAULT 10)
RETURNS TABLE(page_path text, view_count bigint)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    p.page_path,
    COUNT(*) as view_count
  FROM 
    page_views p
  GROUP BY 
    p.page_path
  ORDER BY 
    view_count DESC
  LIMIT limit_count;
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_device_stats()
RETURNS TABLE(device_type text, count bigint)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(p.device_type, 'unknown') as device_type,
    COUNT(*) as count
  FROM 
    page_views p
  GROUP BY 
    device_type
  ORDER BY 
    count DESC;
END;
$function$;