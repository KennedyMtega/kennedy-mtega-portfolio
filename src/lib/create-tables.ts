import { supabase } from './supabase'

async function createTables() {
  try {
    // Create contact_messages table
    const { error: createError } = await supabase.rpc('create_contact_messages_table')
    
    if (createError) {
      console.error('Error creating contact_messages table:', createError)
      
      // Try creating the function first
      const { error: functionError } = await supabase
        .from('_functions')
        .insert({
          name: 'create_contact_messages_table',
          definition: `
            CREATE OR REPLACE FUNCTION create_contact_messages_table()
            RETURNS void AS $$
            BEGIN
              -- Drop existing table
              DROP TABLE IF EXISTS contact_messages CASCADE;
              
              -- Create new table
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
              
              -- Create policies
              CREATE POLICY "Enable read access for authenticated users" ON contact_messages
                FOR SELECT USING (auth.role() = 'authenticated');
              
              CREATE POLICY "Enable insert for all users" ON contact_messages
                FOR INSERT WITH CHECK (true);
              
              CREATE POLICY "Enable update for authenticated users" ON contact_messages
                FOR UPDATE USING (auth.role() = 'authenticated');
            END;
            $$ LANGUAGE plpgsql SECURITY DEFINER;
          `
        })
      
      if (functionError) {
        console.error('Error creating function:', functionError)
      } else {
        // Try creating the table again
        const { error: retryError } = await supabase.rpc('create_contact_messages_table')
        if (retryError) {
          console.error('Error retrying table creation:', retryError)
        } else {
          console.log('Successfully created contact_messages table')
        }
      }
    } else {
      console.log('Successfully created contact_messages table')
    }

    // Insert test message
    const { error: insertError } = await supabase
      .from('contact_messages')
      .insert([{
        name: 'Test User',
        email: 'test@example.com',
        subject: 'Test Message',
        message: 'This is a test message'
      }])

    if (insertError) {
      console.error('Error inserting test message:', insertError)
    } else {
      console.log('Successfully inserted test message')
    }

  } catch (error) {
    console.error('Error in createTables:', error)
  }
}

// Run the creation
createTables() 