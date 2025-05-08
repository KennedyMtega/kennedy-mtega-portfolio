import { supabase } from './supabase'

async function verifyTables() {
  try {
    // Check contact_messages table
    const { data: contactMessages, error: contactError } = await supabase
      .from('contact_messages')
      .select('*')
      .limit(1)

    if (contactError) {
      console.error('Error checking contact_messages table:', contactError)
    } else {
      console.log('Contact messages table structure:', contactMessages)
    }

    // Check page_views table
    const { data: pageViews, error: pageViewsError } = await supabase
      .from('page_views')
      .select('*')
      .limit(1)

    if (pageViewsError) {
      console.error('Error checking page_views table:', pageViewsError)
    } else {
      console.log('Page views table structure:', pageViews)
    }

    // Check donations table
    const { data: donations, error: donationsError } = await supabase
      .from('donations')
      .select('*')
      .limit(1)

    if (donationsError) {
      console.error('Error checking donations table:', donationsError)
    } else {
      console.log('Donations table structure:', donations)
    }

    // Check settings table
    const { data: settings, error: settingsError } = await supabase
      .from('settings')
      .select('*')
      .limit(1)

    if (settingsError) {
      console.error('Error checking settings table:', settingsError)
    } else {
      console.log('Settings table structure:', settings)
    }

  } catch (error) {
    console.error('Error verifying tables:', error)
  }
}

// Run the verification
verifyTables() 