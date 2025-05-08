import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jxcfjnnknwwnmmbhthup.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp4Y2Zqbm5rbnd3bm1tYmh0aHVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk5ODk2MDAsImV4cCI6MjAyNTU2NTYwMH0.ZpZxqLm7FjZDc9GqQg6FhFUQYtNQEOjhQfEbZEWxvGw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function runMigrations() {
  try {
    // Create contact_messages table
    const { error: contactMessagesError } = await supabase.rpc('create_contact_messages_table');
    if (contactMessagesError) {
      console.error('Error creating contact_messages table:', contactMessagesError);
    } else {
      console.log('Successfully created contact_messages table');
    }

    // Create page_views table
    const { error: pageViewsError } = await supabase.rpc('create_page_views_table');
    if (pageViewsError) {
      console.error('Error creating page_views table:', pageViewsError);
    } else {
      console.log('Successfully created page_views table');
    }

    // Create donations table
    const { error: donationsError } = await supabase.rpc('create_donations_table');
    if (donationsError) {
      console.error('Error creating donations table:', donationsError);
    } else {
      console.log('Successfully created donations table');
    }

    // Create settings table
    const { error: settingsError } = await supabase.rpc('create_settings_table');
    if (settingsError) {
      console.error('Error creating settings table:', settingsError);
    } else {
      console.log('Successfully created settings table');
    }

    // Insert default settings
    const { error: defaultSettingsError } = await supabase.rpc('insert_default_settings');
    if (defaultSettingsError) {
      console.error('Error inserting default settings:', defaultSettingsError);
    } else {
      console.log('Successfully inserted default settings');
    }

    // Create indexes
    const { error: indexesError } = await supabase.rpc('create_indexes');
    if (indexesError) {
      console.error('Error creating indexes:', indexesError);
    } else {
      console.log('Successfully created indexes');
    }

  } catch (error) {
    console.error('Error running migrations:', error);
  }
}

runMigrations(); 