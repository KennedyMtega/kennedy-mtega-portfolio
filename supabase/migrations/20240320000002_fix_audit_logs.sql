-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS audit_log_trigger ON contact_messages;
DROP TRIGGER IF EXISTS audit_log_trigger ON page_views;
DROP TRIGGER IF EXISTS audit_log_trigger ON donations;
DROP TRIGGER IF EXISTS audit_log_trigger ON settings;

-- Drop existing function if it exists
DROP FUNCTION IF EXISTS create_audit_log();

-- Create audit_logs table if it doesn't exist
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    action TEXT NOT NULL,
    table_name TEXT NOT NULL,
    record_id UUID NOT NULL,
    old_data JSONB,
    new_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create the audit log function with proper UUID casting
CREATE OR REPLACE FUNCTION create_audit_log()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    INSERT INTO audit_logs (
        user_id,
        action,
        table_name,
        record_id,
        new_data
    )
    VALUES (
        auth.uid(),
        TG_OP,
        TG_TABLE_NAME,
        NEW.id::uuid,  -- Explicitly cast to UUID
        row_to_json(NEW)
    );
    RETURN NEW;
END;
$$;

-- Create triggers for each table
CREATE TRIGGER audit_log_trigger
    AFTER INSERT OR UPDATE OR DELETE
    ON contact_messages
    FOR EACH ROW
    EXECUTE FUNCTION create_audit_log();

CREATE TRIGGER audit_log_trigger
    AFTER INSERT OR UPDATE OR DELETE
    ON page_views
    FOR EACH ROW
    EXECUTE FUNCTION create_audit_log();

CREATE TRIGGER audit_log_trigger
    AFTER INSERT OR UPDATE OR DELETE
    ON donations
    FOR EACH ROW
    EXECUTE FUNCTION create_audit_log();

CREATE TRIGGER audit_log_trigger
    AFTER INSERT OR UPDATE OR DELETE
    ON settings
    FOR EACH ROW
    EXECUTE FUNCTION create_audit_log(); 