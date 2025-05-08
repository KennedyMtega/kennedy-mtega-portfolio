import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jxcfjnnknwwnmmbhthup.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp4Y2Zqbm5rbnd3bm1tYmh0aHVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk5ODk2MDAsImV4cCI6MjAyNTU2NTYwMH0.ZpZxqLm7FjZDc9GqQg6FhFUQYtNQEOjhQfEbZEWxvGw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function inspectDatabase() {
  try {
    // Check if audit_logs table exists and its structure
    const { data: auditLogsData, error: auditLogsError } = await supabase
      .from('audit_logs')
      .select('*')
      .limit(1);

    console.log('Audit Logs Table Structure:', auditLogsData ? Object.keys(auditLogsData[0] || {}) : 'Table does not exist');
    if (auditLogsError) console.log('Audit Logs Error:', auditLogsError);

    // Check if contact_messages table exists and its structure
    const { data: contactMessagesData, error: contactMessagesError } = await supabase
      .from('contact_messages')
      .select('*')
      .limit(1);

    console.log('Contact Messages Table Structure:', contactMessagesData ? Object.keys(contactMessagesData[0] || {}) : 'Table does not exist');
    if (contactMessagesError) console.log('Contact Messages Error:', contactMessagesError);

    // Check if page_views table exists and its structure
    const { data: pageViewsData, error: pageViewsError } = await supabase
      .from('page_views')
      .select('*')
      .limit(1);

    console.log('Page Views Table Structure:', pageViewsData ? Object.keys(pageViewsData[0] || {}) : 'Table does not exist');
    if (pageViewsError) console.log('Page Views Error:', pageViewsError);

    // Check if donations table exists and its structure
    const { data: donationsData, error: donationsError } = await supabase
      .from('donations')
      .select('*')
      .limit(1);

    console.log('Donations Table Structure:', donationsData ? Object.keys(donationsData[0] || {}) : 'Table does not exist');
    if (donationsError) console.log('Donations Error:', donationsError);

    // Check if settings table exists and its structure
    const { data: settingsData, error: settingsError } = await supabase
      .from('settings')
      .select('*')
      .limit(1);

    console.log('Settings Table Structure:', settingsData ? Object.keys(settingsData[0] || {}) : 'Table does not exist');
    if (settingsError) console.log('Settings Error:', settingsError);

  } catch (error) {
    console.error('Error inspecting database:', error);
  }
}

inspectDatabase(); 