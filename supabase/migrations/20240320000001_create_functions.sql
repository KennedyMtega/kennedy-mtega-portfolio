-- Function to create contact_messages table
CREATE OR REPLACE FUNCTION create_contact_messages_table()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS contact_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT,
    email TEXT,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT FALSE,
    archived BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
  );
END;
$$;

-- Function to create page_views table
CREATE OR REPLACE FUNCTION create_page_views_table()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS page_views (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    page_path TEXT NOT NULL,
    device_type TEXT,
    referrer TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
  );
END;
$$;

-- Function to create donations table
CREATE OR REPLACE FUNCTION create_donations_table()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS donations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT,
    email TEXT,
    amount NUMERIC NOT NULL,
    currency TEXT DEFAULT 'USD',
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
  );
END;
$$;

-- Function to create settings table
CREATE OR REPLACE FUNCTION create_settings_table()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS settings (
    id TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
  );
END;
$$;

-- Function to insert default settings
CREATE OR REPLACE FUNCTION insert_default_settings()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO settings (id, value)
  VALUES ('1', '{
    "site_name": "Kennedy Mtega",
    "site_description": "Building systems that empower and connect communities across Tanzania",
    "contact_email": "mtegakennedy@gmail.com",
    "social_links": {
      "twitter": "",
      "linkedin": "",
      "github": "",
      "facebook": ""
    }
  }'::jsonb)
  ON CONFLICT (id) DO NOTHING;
END;
$$;

-- Function to create indexes
CREATE OR REPLACE FUNCTION create_indexes()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at);
  CREATE INDEX IF NOT EXISTS idx_contact_messages_read ON contact_messages(read);
  CREATE INDEX IF NOT EXISTS idx_contact_messages_archived ON contact_messages(archived);
  CREATE INDEX IF NOT EXISTS idx_page_views_created_at ON page_views(created_at);
  CREATE INDEX IF NOT EXISTS idx_donations_created_at ON donations(created_at);
  CREATE INDEX IF NOT EXISTS idx_donations_status ON donations(status);
END;
$$; 