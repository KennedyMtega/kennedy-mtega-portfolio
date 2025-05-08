import { supabase } from './supabase'

async function createContactMessages() {
  try {
    // Create the table using a direct query
    const { error: createError } = await supabase.from('contact_messages').insert({
      name: 'Test User',
      email: 'test@example.com',
      subject: 'Test Message',
      message: 'This is a test message',
      is_read: false,
      is_archived: false
    })

    if (createError) {
      console.error('Error creating contact_messages:', createError)
    } else {
      console.log('Successfully created contact_messages')
    }

    // Verify the table exists
    const { data, error: selectError } = await supabase
      .from('contact_messages')
      .select('*')
      .limit(1)

    if (selectError) {
      console.error('Error verifying table:', selectError)
    } else {
      console.log('Table structure:', data)
    }

  } catch (error) {
    console.error('Error:', error)
  }
}

// Run the creation
createContactMessages() 