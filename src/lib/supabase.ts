import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://jxcfjnnknwwnmmbhthup.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp4Y2Zqbm5rbnd3bm1tYmh0aHVwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MTYwMTMyNSwiZXhwIjoyMDU3MTc3MzI1fQ.b80YMBUtaQuhM_bl_jR0qho85gkNX2fKnKpBgRLS21M'

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function inspectDatabase() {
  try {
    console.log('\n=== Database Inspection Started ===\n')

    // Get all tables
    const { data: tables, error: tablesError } = await supabase
      .from('projects')
      .select('*')
      .limit(1)

    console.log('Projects table:', tables)
    if (tablesError) console.error('Projects table error:', tablesError)

    // Check blog_posts
    const { data: blogPosts, error: blogPostsError } = await supabase
      .from('blog_posts')
      .select('*')
      .limit(1)

    console.log('\nBlog posts table:', blogPosts)
    if (blogPostsError) console.error('Blog posts table error:', blogPostsError)

    // Check contact_messages
    const { data: messages, error: messagesError } = await supabase
      .from('contact_messages')
      .select('*')
      .limit(1)

    console.log('\nContact messages table:', messages)
    if (messagesError) console.error('Contact messages table error:', messagesError)

    // Check page_views
    const { data: pageViews, error: pageViewsError } = await supabase
      .from('page_views')
      .select('*')
      .limit(1)

    console.log('\nPage views table:', pageViews)
    if (pageViewsError) console.error('Page views table error:', pageViewsError)

    // Check donations
    const { data: donations, error: donationsError } = await supabase
      .from('donations')
      .select('*')
      .limit(1)

    console.log('\nDonations table:', donations)
    if (donationsError) console.error('Donations table error:', donationsError)

    // Check settings
    const { data: settings, error: settingsError } = await supabase
      .from('settings')
      .select('*')
      .limit(1)

    console.log('\nSettings table:', settings)
    if (settingsError) console.error('Settings table error:', settingsError)

    // Check storage buckets
    const { data: buckets, error: bucketsError } = await supabase
      .storage
      .listBuckets()

    console.log('\nStorage buckets:', buckets)
    if (bucketsError) console.error('Storage buckets error:', bucketsError)

  } catch (error) {
    console.error('Error during database inspection:', error)
  }
}

// Run the inspection
inspectDatabase() 