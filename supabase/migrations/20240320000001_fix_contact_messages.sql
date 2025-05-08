-- Drop existing table if it exists
DROP TABLE IF EXISTS contact_messages CASCADE;

-- Create contact_messages table with all required columns
CREATE TABLE contact_messages (
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

-- Create indexes
CREATE INDEX idx_contact_messages_created_at ON contact_messages(created_at DESC);
CREATE INDEX idx_contact_messages_is_read ON contact_messages(is_read);
CREATE INDEX idx_contact_messages_is_archived ON contact_messages(is_archived);

-- Enable RLS
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Enable read access for authenticated users" ON contact_messages
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable insert for all users" ON contact_messages
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users" ON contact_messages
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Create trigger for updated_at
CREATE TRIGGER update_contact_messages_updated_at
    BEFORE UPDATE ON contact_messages
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 