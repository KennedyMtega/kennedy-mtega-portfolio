-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create contact_messages table
CREATE TABLE IF NOT EXISTS contact_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    is_archived BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create page_views table
CREATE TABLE IF NOT EXISTS page_views (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    page_path TEXT NOT NULL,
    device_type TEXT NOT NULL,
    referrer TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create donations table
CREATE TABLE IF NOT EXISTS donations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'USD',
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create settings table
CREATE TABLE IF NOT EXISTS settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    value JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_contact_messages_updated_at
    BEFORE UPDATE ON contact_messages
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_donations_updated_at
    BEFORE UPDATE ON donations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_settings_updated_at
    BEFORE UPDATE ON settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_messages_is_read ON contact_messages(is_read);
CREATE INDEX IF NOT EXISTS idx_contact_messages_is_archived ON contact_messages(is_archived);

CREATE INDEX IF NOT EXISTS idx_page_views_created_at ON page_views(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_page_views_page_path ON page_views(page_path);
CREATE INDEX IF NOT EXISTS idx_page_views_device_type ON page_views(device_type);

CREATE INDEX IF NOT EXISTS idx_donations_created_at ON donations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_donations_status ON donations(status);
CREATE INDEX IF NOT EXISTS idx_donations_currency ON donations(currency);

-- Create functions for analytics
CREATE OR REPLACE FUNCTION get_popular_pages(limit_count INTEGER DEFAULT 10)
RETURNS TABLE (page_path TEXT, view_count BIGINT) AS $$
BEGIN
    RETURN QUERY
    SELECT pv.page_path, COUNT(*)::BIGINT as view_count
    FROM page_views pv
    GROUP BY pv.page_path
    ORDER BY view_count DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_device_stats()
RETURNS TABLE (device_type TEXT, count BIGINT) AS $$
BEGIN
    RETURN QUERY
    SELECT pv.device_type, COUNT(*)::BIGINT
    FROM page_views pv
    GROUP BY pv.device_type
    ORDER BY count DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_referrer_stats(limit_count INTEGER DEFAULT 10)
RETURNS TABLE (referrer TEXT, count BIGINT) AS $$
BEGIN
    RETURN QUERY
    SELECT pv.referrer, COUNT(*)::BIGINT
    FROM page_views pv
    WHERE pv.referrer IS NOT NULL
    GROUP BY pv.referrer
    ORDER BY count DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function for donation statistics
CREATE OR REPLACE FUNCTION get_donation_stats()
RETURNS TABLE (currency TEXT, total_amount DECIMAL, donation_count BIGINT) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        d.currency,
        SUM(d.amount)::DECIMAL as total_amount,
        COUNT(*)::BIGINT as donation_count
    FROM donations d
    WHERE d.status = 'completed'
    GROUP BY d.currency;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable RLS (Row Level Security)
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Enable read access for authenticated users" ON contact_messages
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable insert for all users" ON contact_messages
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users" ON contact_messages
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable read access for authenticated users" ON page_views
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable insert for all users" ON page_views
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable read access for authenticated users" ON donations
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable insert for all users" ON donations
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users" ON donations
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable read access for all users" ON settings
    FOR SELECT USING (true);

CREATE POLICY "Enable update for authenticated users" ON settings
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Insert default settings
INSERT INTO settings (value) VALUES (
    '{
        "site_name": "Kennedy Mtega Portfolio",
        "site_description": "Personal portfolio showcasing projects and blog posts",
        "contact_email": "contact@kennedymtega.com",
        "social_links": {
            "github": "https://github.com/kennedymtega",
            "linkedin": "https://linkedin.com/in/kennedymtega",
            "twitter": "https://twitter.com/kennedymtega"
        }
    }'::jsonb
) ON CONFLICT DO NOTHING; 