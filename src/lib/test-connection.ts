import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jxcfjnnknwwnmmbhthup.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    // Try to fetch the current timestamp from Supabase
    const { data, error } = await supabase
      .from('projects')
      .select('id')
      .limit(1);

    if (error) {
      console.error('Connection error:', error);
      return;
    }

    console.log('Successfully connected to Supabase!');
    console.log('Test query result:', data);

  } catch (error) {
    console.error('Error:', error);
  }
}

testConnection(); 